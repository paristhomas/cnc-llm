#!/usr/bin/env python
"""Standard screenshot set + machine checks for a 3+2 run report (for reviewers; a convenience, not evidence of its own
correctness: open the screenshots and take your own of anything you doubt).

    python tools/review_report.py runs/ftc10/<run>/report/index.html /tmp/review_out [--swings 3] [--quick]

Renders the page from file:// in headless Chromium (WebGL through SwiftShader) at 1440x900 and 390x844, light and dark,
and writes into <outdir>:
  * <vp>_<scheme>_header.png, _machine_swing<k>_{before,mid,after}.png (re-orientations into the setups where the
    table moves most), _machine_cut<k>.png, _part_cut<k>.png, _result.png, _partoff.png, _full.png (desktop light)
  * summary.json: time-to-ready / first frame per render, console errors, window.__machineCheck, scrubber click test
    (real mouse clicks on the timeline must move the cursor to the clicked fraction), document scrollWidth at phone
    width plus any element wider than the viewport, and a grep of the report folder for forbidden wording and model
    identifiers (each hit with file, line and context).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path

FORBIDDEN = re.compile(r"unreach|not reachable|excluded|hand-finish|parting face", re.I)
ALLOWED = [re.compile(p, re.I) for p in (r"edge band \(metrology\) excluded", r"tab witness excluded")]
MODEL_ID = re.compile(r"claude-[a-z0-9]|opus[- ]?\d|sonnet[- ]?\d|haiku[- ]?\d|gpt-\d", re.I)
TEXT_EXT = {".html", ".js", ".css", ".txt", ".md", ".json", ".nc"}
GL_ARGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]


def grep_report(root: Path) -> dict:
    hits, model_hits = [], []
    for f in sorted(root.rglob("*")):
        if not f.is_file() or f.suffix.lower() not in TEXT_EXT or f.stat().st_size > 60_000_000:
            continue
        if f.suffix == ".nc" or f.name in ("viewer5.js",):   # G-code and the minified bundle (no prose)
            continue
        try:
            text = f.read_text(errors="replace")
        except Exception:
            continue
        rel = str(f.relative_to(root))
        if f.name == "data.js":   # base64 blob: only the JSON head carries text
            text = text.split(',blob:"', 1)[0]
        for rx, out in ((FORBIDDEN, hits), (MODEL_ID, model_hits)):
            for m in rx.finditer(text):
                a, b = max(0, m.start() - 70), min(len(text), m.end() + 70)
                ctx = re.sub(r"\s+", " ", text[a:b])
                allowed = rx is FORBIDDEN and any(p.search(text[max(0, m.start() - 40):m.end() + 40]) for p in ALLOWED)
                out.append({"file": rel, "line": text.count("\n", 0, m.start()) + 1, "match": m.group(0), "allowed": allowed,
                            "context": ctx})
    return {"forbidden_hits": [h for h in hits if not h["allowed"]], "allowed_hits": [h for h in hits if h["allowed"]],
            "model_id_hits": model_hits}


def wait_rendered(pg, timeout=60.0, frames=2):
    """Wait until the replay caught up with the cursor and the 3D stage drew `frames` new frames."""
    t0 = time.time()
    # one frame first: `caught` is updated by the frame loop and may still describe the previous cursor
    f0 = pg.evaluate("() => { const s = window.CNCViewer.sim.stage; s.invalidate(); return s.frames || 0; }")
    try:
        pg.wait_for_function(f"() => (window.CNCViewer.sim.stage.frames || 0) > {f0}", timeout=timeout * 1000)
    except Exception:
        pass
    pg.wait_for_function("() => window.__viewer && window.__viewer.state().caught", timeout=timeout * 1000)
    for _ in range(frames):   # the stage renders on demand: ask for one frame at a time
        f0 = pg.evaluate("() => { const s = window.CNCViewer.sim.stage; s.invalidate(); return s.frames || 0; }")
        try:
            pg.wait_for_function(f"() => (window.CNCViewer.sim.stage.frames || 0) > {f0}", timeout=timeout * 1000)
        except Exception:
            pass
    return time.time() - t0


def pick_swings(pg, k):
    """Setups whose re-orientation moves the table most (distinct ones first)."""
    segs = pg.evaluate("""() => window.CNCViewer.sim.segs.map((s, i) => ({i, A: s.ang.Ak, C: s.ang.Ck, phi: window.CNCViewer.data.phi[s.a] || 0}))""")
    cand = []
    for a, b in zip(segs[:-1], segs[1:]):
        if b["phi"] <= 0:
            continue
        mv = abs(b["A"] - a["A"]) + abs(b["C"] - a["C"])
        if mv > 1e-6:
            cand.append((mv, b["i"], (round(a["A"]), round(a["C"]), round(b["A"]), round(b["C"]))))
    cand.sort(key=lambda c: -c[0])
    out, seen = [], set()
    for mv, i, key in cand:
        if key in seen:
            continue
        seen.add(key)
        out.append(i)
        if len(out) >= k:
            break
    for mv, i, key in cand:   # fill up with repeats if there are few distinct ones
        if len(out) >= k:
            break
        if i not in out:
            out.append(i)
    return sorted(out)


def shoot(el, path, pg=None):
    """Element screenshot. Under SwiftShader a 3D frame can take seconds, so Playwright's 'element is stable' wait
    (two equal boxes in consecutive animation frames) can time out: for elements that fit the viewport, clip a page
    screenshot instead."""
    el.scroll_into_view_if_needed()
    box = el.bounding_box()
    vp = pg.viewport_size if pg else None
    if pg and box and vp and box["height"] <= vp["height"] and box["y"] >= 0:
        pg.screenshot(path=str(path), clip={"x": max(box["x"], 0), "y": box["y"], "width": min(box["width"], vp["width"]),
                                            "height": box["height"]}, timeout=180000)
    else:
        el.screenshot(path=str(path), timeout=180000)
    return path.name


def render(p, url, outdir: Path, vp, scheme, swings, full):
    w, h = vp
    tag = f"{w}x{h}_{scheme}"
    res = {"viewport": tag, "shots": [], "console_errors": [], "console_warnings": []}
    b = p.chromium.launch(args=GL_ARGS)
    pg = b.new_page(viewport={"width": w, "height": h}, color_scheme=scheme, device_scale_factor=1)
    pg.set_default_timeout(180000)
    pg.on("console", lambda m: (res["console_errors"] if m.type == "error" else res["console_warnings"]).append(m.text)
          if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: res["console_errors"].append("pageerror: " + str(e)))
    t0 = time.time()
    pg.goto(url)
    pg.wait_for_function("() => window.CNCViewer && (window.CNCViewer.ready || window.CNCViewer.error)", timeout=120000)
    res["time_to_ready_s"] = round(time.time() - t0, 2)
    # the sticky section bar would be captured over the middle of tall element screenshots
    pg.add_style_tag(content=".toc { position: static !important; }")
    res["viewer_error"] = pg.evaluate("() => window.CNCViewer.error || null")
    if res["viewer_error"]:
        b.close()
        return res
    pg.wait_for_function("() => (window.CNCViewer.sim.stage.frames || 0) >= 1", timeout=120000)
    res["time_to_first_frame_s"] = round(time.time() - t0, 2)
    try:   # keyframes of the background replay make seeking fast; wait for them (bounded)
        pg.wait_for_function("() => ['done', 'failed', 'none'].includes(window.CNCViewer.sim.workerState)", timeout=240000)
    except Exception:
        pass
    res["replay_precompute_s"] = round(time.time() - t0, 2)
    res["machine_check"] = pg.evaluate("() => window.__machineCheck")
    res["default_mode"] = pg.evaluate("() => window.__viewer.state().mode")
    res["scrollWidth"] = pg.evaluate("() => document.documentElement.scrollWidth")
    res["too_wide"] = pg.evaluate(f"""() => [...document.querySelectorAll('body *')].filter(e => {{
        const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > {w} + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed'
          && !e.closest('.tablewrap, .gc-scroll, .toc .wrap, .cmaps, pre, .markers, .gallery'); }})
        .slice(0, 15).map(e => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ').join('.') : '') + ' ' + Math.round(e.getBoundingClientRect().right))""")
    hero = pg.query_selector("header.hero")
    if hero:
        res["shots"].append(shoot(hero, outdir / f"{tag}_header.png", pg))
    sim = pg.query_selector("#simview")
    sim.scroll_into_view_if_needed()
    targets = pick_swings(pg, swings)
    res["swings"] = []
    for k, s in enumerate(targets):
        rec = {"segment": s + 1, "states": {}}
        for name, t in (("before", 0.0), ("mid", 0.5), ("after", 1.0)):
            pg.evaluate(f"() => window.__viewer.seekSwing({s}, {t})")
            wait_rendered(pg)
            rec["states"][name] = pg.evaluate("() => window.__viewer.state()")
            res["shots"].append(shoot(sim, outdir / f"{tag}_machine_swing{k + 1}_{name}.png", pg))
        pg.evaluate(f"() => window.__viewer.gotoSeg({s})")
        pg.evaluate("() => { const v = window.CNCViewer.sim; const sg = v.segs[v.segOf(Math.floor(v.cursor))]; v.setCursor(sg.firstCut + Math.floor((sg.b - sg.firstCut) * 0.6)); }")
        wait_rendered(pg)
        rec["states"]["cut"] = pg.evaluate("() => window.__viewer.state()")
        res["shots"].append(shoot(sim, outdir / f"{tag}_machine_cut{k + 1}.png", pg))
        res["swings"].append(rec)
    pg.evaluate("() => window.__viewer.setMode('part')")
    for k, s in enumerate(targets):
        pg.evaluate(f"() => window.__viewer.gotoSeg({s})")
        pg.evaluate("() => { const v = window.CNCViewer.sim; const sg = v.segs[v.segOf(Math.floor(v.cursor))]; v.setCursor(sg.firstCut + Math.floor((sg.b - sg.firstCut) * 0.6)); v.view('setup', false); }")
        wait_rendered(pg)
        res["shots"].append(shoot(sim, outdir / f"{tag}_part_cut{k + 1}.png", pg))
    pg.evaluate("() => window.__viewer.setMode('machine')")
    # scrubber: real mouse clicks at several fractions of the timeline track
    tl = pg.query_selector("#simcontrols .tl")
    clicks = []
    if tl:
        tl.scroll_into_view_if_needed()
        box = tl.bounding_box()
        for fr in (0.1, 0.37, 0.62, 0.9):
            pg.mouse.click(box["x"] + box["width"] * fr, box["y"] + box["height"] / 2)
            pg.wait_for_timeout(150)
            u = pg.evaluate("() => window.__viewer.state().u")
            clicks.append({"clicked": fr, "cursor_u": round(u, 4), "ok": abs(u - fr) < 0.01})
    res["scrubber_clicks"] = clicks
    for sel, name in (("#result", "result"), ("#partoff", "partoff")):
        el = pg.query_selector(sel)
        if el:
            el.scroll_into_view_if_needed()
            pg.wait_for_timeout(2500)
            if name == "result":
                try:
                    pg.wait_for_function("() => window.CNCViewer.result && (window.CNCViewer.result.stage.frames || 0) >= 2", timeout=60000)
                except Exception:
                    pass
            res["shots"].append(shoot(el, outdir / f"{tag}_{name}.png", pg))
    if full:
        pg.screenshot(path=str(outdir / f"{tag}_full.png"), full_page=True)
        res["shots"].append(f"{tag}_full.png")
    b.close()
    return res


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("index")
    ap.add_argument("outdir")
    ap.add_argument("--swings", type=int, default=3)
    ap.add_argument("--quick", action="store_true", help="only 1440x900 light and 390x844 dark")
    a = ap.parse_args(argv)
    from playwright.sync_api import sync_playwright
    index = Path(a.index).resolve()
    out = Path(a.outdir)
    out.mkdir(parents=True, exist_ok=True)
    renders = [((1440, 900), "light"), ((390, 844), "dark")] if a.quick else \
        [((1440, 900), "light"), ((1440, 900), "dark"), ((390, 844), "light"), ((390, 844), "dark")]
    summary = {"index": str(index), "renders": [], "grep": grep_report(index.parent)}
    with sync_playwright() as p:
        for i, (vp, scheme) in enumerate(renders):
            r = render(p, index.as_uri(), out, vp, scheme, a.swings if vp[0] > 800 or i == len(renders) - 1 else 1,
                       full=(i == 0))
            summary["renders"].append(r)
            print(f"{r['viewport']}: ready {r.get('time_to_ready_s')} s, first frame {r.get('time_to_first_frame_s')} s, "
                  f"{len(r['console_errors'])} console errors, scrollWidth {r.get('scrollWidth')}", flush=True)
    mc = next((r.get("machine_check") for r in summary["renders"] if r.get("machine_check")), None) or {}
    summary["verdict"] = {
        "machine_check_pass": bool(mc.get("pass")),
        "max_spindle_dir_err": mc.get("maxSpindleDirErr"), "max_tip_err_mm": mc.get("maxTipErrMm"),
        "default_mode_machine": all(r.get("default_mode") == "machine" for r in summary["renders"]),
        "console_errors": sum(len(r["console_errors"]) for r in summary["renders"]),
        "phone_no_hscroll": all(r.get("scrollWidth", 0) <= int(r["viewport"].split("x")[0]) for r in summary["renders"]),
        "scrubber_clicks_ok": all(c["ok"] for r in summary["renders"] for c in r.get("scrubber_clicks", [])),
        "forbidden_words": len(summary["grep"]["forbidden_hits"]), "model_ids": len(summary["grep"]["model_id_hits"]),
    }
    (out / "summary.json").write_text(json.dumps(summary, indent=1))
    print(json.dumps(summary["verdict"], indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
