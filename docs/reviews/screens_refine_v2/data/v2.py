"""Re-review screenshots + checks for the refine report pages (reviewer scratch, not part of the repo).
usage: v2.py RUN OUT TAG W H SCHEME DEEP(0/1)"""
import json, sys, time, traceback
from pathlib import Path
sys.path.insert(0, "/home/paris/cnc-llm/tools")
from review_report import wait_rendered, shoot, GL_ARGS
from playwright.sync_api import sync_playwright

RUN = Path(sys.argv[1]); OUT = Path(sys.argv[2]); TAG = sys.argv[3]
VP = (int(sys.argv[4]), int(sys.argv[5])); SCHEME = sys.argv[6]; DEEP = sys.argv[7] in ("1", "2"); SIMDEEP = sys.argv[7] == "1"
OUT.mkdir(parents=True, exist_ok=True)
url = (RUN / "report/index.html").resolve().as_uri()
setups = json.loads((RUN / "final/setups.json").read_text())["segments"]
res = {"tag": TAG}


def save():
    (OUT / f"{TAG}_res.json").write_text(json.dumps(res, indent=1, default=str))


def step(name, fn):
    t0 = time.time()
    try:
        out = fn()
        if out is not None:
            res[name] = out
    except Exception as e:
        res[name + "_ERR"] = traceback.format_exc()[-800:]
    res.setdefault("_t", {})[name] = round(time.time() - t0, 1)
    save(); print(TAG, name, round(time.time() - t0, 1), flush=True)


def wait_stage(pg, expr, timeout=90):
    for _ in range(3):
        f0 = pg.evaluate(f"() => {{ const s = {expr}; s.invalidate(); return s.frames || 0; }}")
        try:
            pg.wait_for_function(f"() => ({expr}.frames || 0) > {f0}", timeout=timeout * 1000)
        except Exception:
            pass


INDEP = """(setups) => {
  const v = window.CNCViewer.sim; const out = {dir: 0, n: 0, swingN: 0, setups: []};
  const samp = (pos) => { v.placeTool(pos); v.stage.scene.updateMatrixWorld(true);
    const e = v.toolObj.matrixWorld.elements; const z = [e[8], e[9], e[10]];
    const L = Math.hypot(...z); return Math.hypot(z[0]/L, z[1]/L, z[2]/L - 1); };
  for (let si = 0; si < v.N; si++) {
    const s = v.segs[si];
    for (let k = 0; k < 40; k++) { out.dir = Math.max(out.dir, samp(s.a + (k + 0.37) * (s.b - s.a) / 40)); out.n++; }
    const phi = window.CNCViewer.data.phi[s.a] || 0;
    if (phi > 0) for (let k = 1; k < 20; k++) { out.dir = Math.max(out.dir, samp(s.a + k / 20 * phi)); out.swingN++; }
    v.placeTool(Math.min(s.firstCut + 0.5, v.n)); v.stage.scene.updateMatrixWorld(true);
    const m = v.mc.part.matrixWorld.elements; const up = [m[2], m[6], m[10]]; const L = Math.hypot(...up);
    const exp = setups[si].tool_axis;
    out.setups.push({seg: si + 1, err: Math.hypot(up[0]/L - exp[0], up[1]/L - exp[1], up[2]/L - exp[2]),
      dispA: v.mp.dispA, dispC: v.mp.dispC, simA: setups[si].A_deg, simC: setups[si].C_deg});
  }
  return out; }"""

with sync_playwright() as p:
    b = p.chromium.launch(args=GL_ARGS)
    pg = b.new_page(viewport={"width": VP[0], "height": VP[1]}, color_scheme=SCHEME)
    pg.set_default_timeout(240000)
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
    t0 = time.time()
    pg.goto(url)
    pg.wait_for_function("() => window.CNCViewer && (window.CNCViewer.ready || window.CNCViewer.error)", timeout=180000)
    res["ready_s"] = round(time.time() - t0, 2)
    pg.wait_for_function("() => (window.CNCViewer.sim.stage.frames || 0) >= 1", timeout=180000)
    res["first_frame_s"] = round(time.time() - t0, 2)
    pg.wait_for_timeout(1500)
    pg.screenshot(path=str(OUT / f"{TAG}_top.png"))
    res["scrollWidth"] = pg.evaluate("() => document.documentElement.scrollWidth")
    res["doc_title"] = pg.title()
    res["mode"] = pg.evaluate("() => window.__viewer.state()")
    sim = pg.query_selector("#simview")
    step("sim_default", lambda: shoot(sim, OUT / f"{TAG}_sim_default.png", pg))
    step("sim_section", lambda: shoot(pg.query_selector("#sim"), OUT / f"{TAG}_sim_section.png", pg))
    step("overflow", lambda: pg.evaluate("""() => [...document.querySelectorAll('.dro-tool,.sb-l,.cs-title,.dro-line,.vp-cta,.dro-phase')]
        .filter(e => e.scrollWidth > e.clientWidth + 1).map(e => [e.className, e.textContent.slice(0,60), getComputedStyle(e).textOverflow])"""))
    if SIMDEEP:
        step("machineCheck", lambda: pg.evaluate("() => window.__machineCheck"))
        segs = pg.evaluate("() => window.CNCViewer.sim.segs.map((s,i)=>({i, A:s.ang.Ak, C:s.ang.Ck, phi: window.CNCViewer.data.phi[s.a]||0}))")
        sw = [s["i"] for a, s in zip(segs, segs[1:]) if s["phi"] > 0 and (abs(s["A"] - a["A"]) + abs(s["C"] - a["C"])) > 1e-6]
        res["swings"] = sw; res["seg_angles"] = segs
        pick = [s for s in sw if s in (1, 2, 4)] or sw[:3]
        if len(pick) < 3:
            pick = sw[:3]
        for s in pick:
            for name, t in (("before", 0.0), ("mid", 0.5), ("after", 1.0)):
                def f(s=s, t=t, name=name):
                    pg.evaluate(f"() => window.__viewer.seekSwing({s}, {t})")
                    wait_rendered(pg)
                    shoot(sim, OUT / f"{TAG}_swing_s{s + 1}_{name}.png", pg)
                    return {"state": pg.evaluate("() => window.__viewer.state().pose"),
                            "phase": pg.evaluate("() => (document.querySelector('.dro-phase')||{}).textContent"),
                            "status": pg.evaluate("() => (document.querySelector('.vp-status')||{}).textContent")}
                step(f"swing_s{s + 1}_{name}", f)
        step("indep", lambda: pg.evaluate(INDEP, setups))
        # cut while tilted, then DRO in play
        def tilted():
            pg.evaluate("() => { const v = window.CNCViewer.sim; const s = v.segs[2]; v.playing=false; v.syncPlay(); v.setCursor(s.firstCut + Math.floor((s.b - s.firstCut) * 0.5)); }")
            wait_rendered(pg); shoot(sim, OUT / f"{TAG}_cut_s3.png", pg)
            d0 = pg.evaluate("() => document.querySelector('.dro').innerText")
            pg.evaluate("() => { const v = window.CNCViewer.sim; v.playing = true; v.lastT = performance.now(); v.syncPlay(); }")
            pg.wait_for_timeout(8000)
            d1 = pg.evaluate("() => document.querySelector('.dro').innerText")
            pg.evaluate("() => { const v = window.CNCViewer.sim; v.playing = false; v.syncPlay(); }")
            pg.evaluate("() => { const v = window.CNCViewer.sim; const s = v.segs[v.N-2]; v.setCursor(s.firstCut + Math.floor((s.b - s.firstCut) * 0.8)); }")
            wait_rendered(pg); shoot(sim, OUT / f"{TAG}_cut_late.png", pg)
            return {"dro0": d0, "dro1": d1}
        step("tilted", tilted)
        # fresh: the CTA button (real playback) -- reload so the page is in its opening state
        def cta():
            pg.reload()
            pg.wait_for_function("() => window.CNCViewer && window.CNCViewer.ready", timeout=180000)
            pg.wait_for_function("() => (window.CNCViewer.sim.stage.frames || 0) >= 1", timeout=180000)
            s2 = pg.query_selector("#simview"); s2.scroll_into_view_if_needed()
            btn = pg.query_selector(".vp-cta"); vis = btn.is_visible()
            btn.click(); out = {"cta_visible": vis, "poses": []}
            for k in range(8):
                pg.wait_for_timeout(5000)
                out["poses"].append([pg.evaluate("() => window.__viewer.state()"), pg.evaluate("() => (document.querySelector('.dro-phase')||{}).textContent")])
                if k in (1, 3, 7):
                    pg.screenshot(path=str(OUT / f"{TAG}_cta_{k}.png"), clip=s2.bounding_box())
            pg.evaluate("() => { const v = window.CNCViewer.sim; v.playing = false; v.syncPlay(); }")
            return out
        step("cta", cta)
    # result view
    pg.evaluate("() => { const v = window.CNCViewer.sim; v.playing = false; v.syncPlay(); }")
    def result_default():
        el = pg.query_selector("#result"); el.scroll_into_view_if_needed()
        pg.wait_for_function("() => window.CNCViewer.result && window.CNCViewer.result.stage", timeout=120000)
        pg.wait_for_timeout(2000); wait_stage(pg, "window.CNCViewer.result.stage")
        shoot(pg.query_selector("#resview"), OUT / f"{TAG}_result_default.png", pg)
        shoot(el, OUT / f"{TAG}_result_section.png", pg)
    step("result_default", result_default)
    for rid in ((1, 2, 3) if DEEP else (1,)):
        def click_region(rid=rid):
            row = pg.query_selector(f"#problems [data-region='{rid}']")
            row.scroll_into_view_if_needed(); row.click()
            pg.wait_for_timeout(4000); wait_stage(pg, "window.CNCViewer.result.stage")
            pg.wait_for_timeout(1500); wait_stage(pg, "window.CNCViewer.result.stage")
            shoot(pg.query_selector("#resview"), OUT / f"{TAG}_result_R{rid}.png", pg)
            if VP[0] < 600:
                shoot(pg.query_selector("#result"), OUT / f"{TAG}_result_R{rid}_section.png", pg)
            return {"xray": pg.evaluate("() => window.CNCViewer.result.xray"),
                    "card": pg.evaluate("() => (document.querySelector('.region-card')||{}).innerText")}
        step(f"region_R{rid}", click_region)
    if DEEP:
        def marker_r2():
            pg.evaluate("() => { const c = document.querySelector('.region-card .rc-x'); if (c) c.click(); window.CNCViewer.result.view('iso'); }")
            pg.wait_for_timeout(2000); wait_stage(pg, "window.CNCViewer.result.stage")
            shoot(pg.query_selector("#resview"), OUT / f"{TAG}_result_iso_again.png", pg)
            m = pg.query_selector(".markers .marker:has-text('R2')")
            if m and m.is_visible():
                m.click(); pg.wait_for_timeout(4000); wait_stage(pg, "window.CNCViewer.result.stage")
                shoot(pg.query_selector("#resview"), OUT / f"{TAG}_result_marker_R2.png", pg)
                return "clicked"
            return "R2 marker not visible"
        step("marker_R2", marker_r2)
        def presets():
            out = []
            for v in pg.evaluate("() => [...document.querySelectorAll('#resbar [data-view]')].map(b => b.dataset.view)"):
                pg.click(f"#resbar [data-view='{v}']"); pg.wait_for_timeout(2500); wait_stage(pg, "window.CNCViewer.result.stage")
                shoot(pg.query_selector("#resview"), OUT / f"{TAG}_result_preset_{v}.png", pg); out.append(v)
            return out
        step("presets", presets)
    # part-off
    def partoff():
        el = pg.query_selector("#partoff"); el.scroll_into_view_if_needed()
        pg.wait_for_function("() => window.CNCViewer.tabs && window.CNCViewer.tabs.stage", timeout=120000)
        pg.wait_for_timeout(2500); wait_stage(pg, "window.CNCViewer.tabs.stage")
        shoot(pg.query_selector("#tabview"), OUT / f"{TAG}_tabview.png", pg)
        el.screenshot(path=str(OUT / f"{TAG}_partoff_full.png"), timeout=180000)
        out = {}
        for btn in pg.query_selector_all("#partoff [data-tab]"):
            k = btn.get_attribute("data-tab"); btn.click(); pg.wait_for_timeout(2500); wait_stage(pg, "window.CNCViewer.tabs.stage")
            shoot(pg.query_selector("#tabview"), OUT / f"{TAG}_tabview_{k}.png", pg); out[k] = 1
        return out
    step("partoff", partoff)
    for sec in ("problems", "setups", "history", "metrics", "images"):
        step("sec_" + sec, lambda sec=sec: pg.query_selector("#" + sec).screenshot(path=str(OUT / f"{TAG}_sec_{sec}.png"), timeout=180000))
    def header():
        pg.query_selector("header.hero").screenshot(path=str(OUT / f"{TAG}_hero.png"))
    step("hero", header)
    res["console"] = errs
    save()
    b.close()
print("DONE", TAG)
