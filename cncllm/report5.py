"""Per-run web report for 3+2 (indexed 5-axis) runs: viewer data export (called by the trusted evaluation) and the
static HTML report. Same page contract as the 3-axis report (cncllm/report.py): a static folder that works from
file://, the viewer bundle (cncllm/viewer/dist/viewer5.js) and the data are loaded with classic <script> tags.

  export_data(part, res, final_dir)  -> final_dir/viewer_data/{meta.json, data.bin.gz, rigidity.json}
  build(run_dir)                     -> run_dir/report/index.html (+ assets/, img/, gcode/, iter/)

Material model shown in the browser (the simulator's exact model, sim5.Workpiece5):
  remaining = stock box AND for every setup segment s:  z_s(P) < H_s(x_s(P), y_s(P))
with H_s the column-height field of segment s's moves in its own frame, capped at the stock box top of that column.
The export writes H_s at the end of every segment (from kernel.column_heights, exact at the cell centres) on a cropped
grid around the cells segment s cut; the browser replays the current segment live (same zcut kernel as the 3-axis
viewer) and renders the intersection by clipping every boundary piece (stock faces, each H_s surface) against all
other active constraints in the fragment shader.
"""
from __future__ import annotations

import datetime as dt
import gzip
import json
import math
import shutil
from pathlib import Path

import numpy as np

from .report import (MAX_TRIS, TOL_DEFAULT, VIEWER, _decimate, _esc, _feature_edges, _fmt, _history_svg, _issue_rows,
                     _load, _subdivide, _vertex_deviation, md_to_html)
from .tools import LIBRARY, MACHINE

SEG_CELLS = 400_000        # max height-field cells per segment (cropped grid)
TOTAL_CELLS = 2_600_000    # over all segments
INDEX_TIME_S = 6.0
CONN_RES = 0.5             # connection-plane maps (mm)


# ----------------------------------------------------------------------------------------------------------- export

def _boxtop(R, o, lo, hi, X, Y):
    """Top of the stock box along the frame z axis over frame columns (X, Y); nan where the column misses the box."""
    c = o[None, :] + X.ravel()[:, None] * R[:, 0][None, :] + Y.ravel()[:, None] * R[:, 1][None, :]
    d = R[:, 2]
    tmin = np.full(len(c), -np.inf)
    tmax = np.full(len(c), np.inf)
    for a in range(3):
        if abs(d[a]) < 1e-12:
            bad = (c[:, a] < lo[a]) | (c[:, a] > hi[a])
            tmax[bad] = -np.inf
        else:
            t1, t2 = (lo[a] - c[:, a]) / d[a], (hi[a] - c[:, a]) / d[a]
            tmin = np.maximum(tmin, np.minimum(t1, t2))
            tmax = np.minimum(tmax, np.maximum(t1, t2))
    top = np.where(tmax >= tmin, tmax, np.nan)
    return top.reshape(X.shape)


def _segment_fields(M, a, b, g, lo, hi, cap):
    """Exact column heights of segment moves M[a:b] (frame coords) on a cropped grid around the cut cells."""
    from .sim5 import FrameSweep
    R, o, zoff = np.asarray(g["R"], float), np.asarray(g["o"], float), float(g["zoff"])
    corners = np.array([[x, y, z] for x in (lo[0], hi[0]) for y in (lo[1], hi[1]) for z in (lo[2], hi[2])])
    c = (corners - o) @ R
    Ms = M[a:b]
    Ms = Ms[Ms[:, 6] > 0]
    if not len(Ms):
        return None
    fs = FrameSweep(Ms, c[:, :2].min(0), c[:, :2].max(0))
    big = float(c[:, 2].max() + zoff + 25.0)
    r0, x0, y0, nx, ny = float(g["res"]), float(g["x0"]), float(g["y0"]), int(g["nx"]), int(g["ny"])

    def heights(xs, ys):
        X, Y = np.meshgrid(xs, ys)
        top = _boxtop(R, o, lo, hi, X, Y)
        h, who = fs.heights(X.ravel(), Y.ravel())
        h = h.reshape(X.shape)
        who = who.reshape(X.shape)
        # columns that miss the stock box get a "no constraint" top (the box test bounds them)
        topz = np.where(np.isfinite(top), top + zoff, big)
        cut = np.maximum(h + zoff, 0.0)
        H = np.minimum(topz, cut)
        lower = H < topz - 1e-6
        return topz, H, np.where(lower, who, -1), lower & np.isfinite(top)

    # coarse pass (every 4th cell) to find the cut region
    s = 4
    xs = x0 + (np.arange(0, nx, s) + 0.5) * r0
    ys = y0 + (np.arange(0, ny, s) + 0.5) * r0
    _, _, _, cm = heights(xs, ys)
    if not cm.any():
        return None
    ii, jj = np.where(cm)
    maxr = max(LIBRARY[int(t)].R for t in np.unique(Ms[:, 6]).astype(int)) if len(Ms) else 5
    pad = int(math.ceil((maxr * 0.25 + 1.0) / r0)) + s
    i0, i1 = max(ii.min() * s - pad, 0), min(ii.max() * s + pad, ny - 1)
    j0, j1 = max(jj.min() * s - pad, 0), min(jj.max() * s + pad, nx - 1)
    cells = (i1 - i0 + 1) * (j1 - j0 + 1)
    k = max(1, int(math.ceil(math.sqrt(cells / cap))), int(math.ceil((j1 - j0 + 1) / 4000)), int(math.ceil((i1 - i0 + 1) / 4000)))
    jx = np.arange(j0, j1 + 1, k)
    iy = np.arange(i0, i1 + 1, k)
    xs = x0 + (jx + 0.5) * r0
    ys = y0 + (iy + 0.5) * r0
    topz, H, who, cm = heights(xs, ys)
    own = np.where(who >= 0, Ms[np.maximum(who, 0), 6], 0).astype(np.uint8)
    grid = {"x0": float(x0 + j0 * r0 + 0.5 * r0 - 0.5 * r0 * k), "y0": float(y0 + i0 * r0 + 0.5 * r0 - 0.5 * r0 * k),
            "res": float(r0 * k), "nx": int(len(xs)), "ny": int(len(ys))}
    # cell centres of the coarse grid coincide with xs / ys
    return {"grid": grid, "D": (topz - H).astype(np.float32), "own": own, "cut_cells": int(cm.sum()), "big": big}


def _conn_masks(res, part):
    """Material in the connection plane (middle of the stub gap) after every segment, as row runs."""
    from . import sim5
    M, frames = res["moves"], res["frames"]
    lo, hi = part.stock_lo, part.stock_hi
    zc = -part.fixture["gap"] / 2
    r = CONN_RES
    xs = np.arange(lo[0] + r / 2, hi[0], r)
    ys = np.arange(lo[1] + r / 2, hi[1], r)
    X, Y = np.meshgrid(xs, ys)
    P = np.c_[X.ravel(), Y.ravel(), np.full(X.size, zc)]
    out = []
    for a, b, k in sim5.segments(M):
        wp = sim5.Workpiece5(M, frames, part, upto=b)
        ins = wp.inside(P).reshape(X.shape)
        runs = []
        for row in ins:
            d = np.diff(np.r_[0, row.astype(np.int8), 0])
            st, en = np.where(d == 1)[0], np.where(d == -1)[0]
            runs.append([int(v) for p in zip(st, en - st) for v in p])
        out.append(runs)
    return {"x0": float(lo[0]), "y0": float(lo[1]), "res": r, "nx": len(xs), "ny": len(ys), "z": zc, "masks": out}


def export_data(part, res: dict, final_dir) -> Path:
    """Write compact 3+2 viewer data for the report into final_dir/viewer_data/."""
    from . import kernel5, sim5
    out = Path(final_dir) / "viewer_data"
    out.mkdir(parents=True, exist_ok=True)
    M = np.asarray(res["moves"], np.float64).reshape(-1, 13)
    n = len(M)
    lo, hi = part.stock_lo, part.stock_hi
    arrays: dict[str, np.ndarray] = {}
    # ---- moves (frame coordinates of their segment)
    arrays["mv_end"] = M[:, 3:6].astype(np.float32).ravel()
    start0 = M[0, 0:3].tolist() if n else list(MACHINE.home)
    breaks = []
    if n > 1:
        gap = (np.abs(M[1:, 0:3] - M[:-1, 3:6]).max(1) > 1e-6) | (M[1:, 12] != M[:-1, 12])
        for i in np.where(gap)[0][:100000]:
            breaks.append([int(i + 1)] + [round(float(v), 5) for v in M[i + 1, 0:3]])
    arrays["mv_line"] = M[:, 10].astype(np.uint32)
    arrays["mv_feed"] = M[:, 8].astype(np.float32)
    fl = np.zeros(n, np.uint8)
    flags = res.get("flags")
    if flags is not None and len(flags) == n:
        fl = (np.asarray(flags) & 0x0F).astype(np.uint8)
    # vise / table contact per move and box (bit 4 + box index in the high nibble of mv_fix)
    fix = np.zeros(n, np.uint8)
    boxes = np.array(part.meta.get("vise") or [], float).reshape(-1, 2, 3)
    if n and len(boxes):
        A, B, Dd = res.get("fixture_xyz") or sim5.to_fixture(M, res["frames"])
        act = M[:, 6] > 0
        if act.any():
            tn = M[act, 6].astype(int)
            rad = np.array([LIBRARY[t].R for t in tn])
            sos = np.array([LIBRARY[t].stickout for t in tn])
            hrs = np.array([LIBRARY[t].holder_diameter / 2 for t in tn])
            idx = np.where(act)[0]
            for bi in range(min(len(boxes), 8)):
                h = kernel5.fixture_hits(A[act], B[act], Dd[act], rad, sos, hrs, 50.0, boxes[bi:bi + 1])
                fix[idx[h > 0]] |= np.uint8(1 << bi)
    arrays["mv_crash"] = fl
    arrays["mv_fix"] = fix
    tool = M[:, 6].astype(np.int64)
    arrays["mv_tool"] = (tool & 31).astype(np.uint8) | ((M[:, 7] > 0.5).astype(np.uint8) << 5) | \
                        ((M[:, 11] > 0.5).astype(np.uint8) << 6)
    rpm_changes = []
    if n:
        rpm = M[:, 9]
        ch = np.r_[0, np.where(np.diff(rpm) != 0)[0] + 1]
        rpm_changes = [[int(i), float(rpm[i])] for i in ch[:200000]]
    # ---- per segment: frame, cropped grid, exact end-of-segment height field
    segs = sim5.segments(M)
    info = res.get("segments") or []
    grids = res.get("grids") or []
    cap = max(60_000, min(SEG_CELLS, TOTAL_CELLS // max(len(segs), 1)))
    seg_meta = []
    for si, (a, b, k) in enumerate(segs):
        g = grids[si]
        fr = res["frames"][k]
        sf = _segment_fields(M, a, b, g, lo, hi, cap)
        s = {"a": a, "b": b, "frame": int(k), "R": np.asarray(fr["R"], float).round(9).tolist(),
             "o": np.asarray(fr["origin"], float).round(6).tolist(), "zoff": float(g["zoff"]),
             "grid": sf["grid"] if sf else None, "big": sf["big"] if sf else 0.0, "cut_cells": sf["cut_cells"] if sf else 0}
        if si < len(info):
            s |= {kk: info[si][kk] for kk in ("segment", "first_line", "last_line", "moves", "tools", "A_deg", "C_deg",
                                              "tool_axis", "ijk", "removed_cm3") if kk in info[si]}
        if sf:
            arrays[f"seg{si}_D"] = sf["D"].ravel()
            arrays[f"seg{si}_own"] = sf["own"].ravel()
        seg_meta.append(s)
    # ---- target mesh + per-vertex deviation (as the 3-axis report)
    V, F, TF = _decimate(np.asarray(part.V, np.float64), np.asarray(part.F, np.int64), np.asarray(part.tri_face), MAX_TRIS)
    used = np.unique(F.ravel())
    remap = np.full(len(V), -1, np.int64)
    remap[used] = np.arange(len(used))
    V, F = V[used], remap[F]
    arrays["mesh_edges"] = _feature_edges(V, F).astype(np.float32).ravel()
    V, F, TF = _subdivide(V, F, TF)
    # per-probe score class from the simulator (0 scored, 1 tab witness, 2 edge band). The edge band is a metrology
    # artefact: _vertex_deviation already colours faces from their interior probes, so class 2 is drawn as class 0.
    # Without score_cls (runs scored before the whole-surface rule) every vertex is drawn as scored.
    sc = res.get("score_cls")
    cls_kind = "score" if sc is not None else "none"
    sc = np.zeros(len(part.P), np.int8) if sc is None else np.where(np.asarray(sc) == 1, 1, 0).astype(np.int8)
    vdev, vcls = _vertex_deviation(part, np.asarray(res["dev"]), V, F, TF, pclass=sc)
    arrays["mesh_V"] = V.astype(np.float32).ravel()
    arrays["mesh_F"] = F.astype(np.uint32).ravel()
    arrays["mesh_dev"] = vdev.astype(np.float32)
    arrays["mesh_cls"] = vcls.astype(np.uint8)
    # ---- G-code text
    prog = res.get("program")
    text = getattr(prog, "text", None)
    if text is None:
        src = Path(final_dir) / "program.nc"
        text = src.read_text() if src.exists() else ""
    arrays["gcode"] = np.frombuffer(text.encode("utf-8"), np.uint8)
    # ---- pack
    layout, chunks, off = {}, [], 0
    for name, a_ in arrays.items():
        bts = np.ascontiguousarray(a_).tobytes()
        layout[name] = {"off": off, "len": int(a_.size), "type": a_.dtype.name}
        chunks.append(bts)
        off += len(bts)
        pad = (-off) % 8
        if pad:
            chunks.append(b"\0" * pad)
            off += pad
    blob = gzip.compress(b"".join(chunks), compresslevel=6, mtime=0)
    tools = {}
    for t in LIBRARY.values():
        tools[t.number] = {"number": t.number, "name": t.name, "kind": t.kind, "diameter": t.diameter,
                           "corner_radius": t.corner_radius, "half_angle": t.half_angle,
                           "tip_diameter": t.tip_diameter, "flute_length": t.flute_length, "stickout": t.stickout,
                           "shank_diameter": t.shank_diameter, "holder_diameter": t.holder_diameter, "flutes": t.flutes,
                           "neck_length": float(getattr(t, "neck_length", 0) or 0),
                           "row": t.row()}
    stats = res.get("stats", {})
    vise = [{"lo": [float(v) for v in bx[0]], "hi": [float(v) for v in bx[1]],
             "kind": ("jaw" if i < 2 else "body" if i == 2 else "table")} for i, bx in enumerate(boxes.tolist())]
    meta = {
        "version": 1, "mode": "3+2", "n_moves": n, "start0": start0, "breaks": breaks, "rpm_changes": rpm_changes,
        "stock": {"lo": [float(v) for v in lo], "hi": [float(v) for v in hi]},
        "vise": vise, "fixture": part.fixture, "segments": seg_meta,
        "tools": tools, "rapid_rate": MACHINE.rapid_rate, "home": list(MACHINE.home), "index_time_s": INDEX_TIME_S,
        "tolerance": TOL_DEFAULT, "n_lines": text.count("\n") + 1,
        "mesh": {"n_vertices": int(len(V)), "n_triangles": int(len(F)), "cls_kind": cls_kind},
        "per_tool": {str(k2): v for k2, v in stats.get("per_tool", {}).items()},
        "rigidity": res.get("rigidity"),
        "arrays": layout, "gzip": True, "blob_bytes": len(blob),
    }
    (out / "meta.json").write_text(json.dumps(meta, default=float))
    (out / "data.bin.gz").write_bytes(blob)
    try:
        (out / "rigidity.json").write_text(json.dumps(_conn_masks(res, part)))
    except Exception as e:   # the report still works without the maps
        print(f"WARNING: connection-plane maps not written ({e!r})")
    return out


# ------------------------------------------------------------------------------------------------------------ build

SETUP_PALETTE = ['#3b7dd8', '#e0703a', '#2fa36b', '#a35cc8', '#d4a017', '#d24f7a', '#2aa5b5', '#7c6b4f', '#5d6fd6', '#8aa82e']

METRIC5 = [
    ("whole_surface_in_tol_pct", "Whole part surface in tolerance (score)", "%"),
    ("whole_surface_proud_pct", "Whole surface proud (material left): failed", "%"),
    ("whole_surface_gouge_pct", "Whole surface gouged (cut too deep): failed", "%"),
    ("proud_area_mm2", "Proud area", "mm²"),
    ("gouge_area_mm2", "Gouged area", "mm²"),
    ("max_proud_mm", "Max material left", "mm"),
    ("max_gouge_mm", "Max gouge depth", "mm"),
    ("tab_witness_pct", "Tab witness excluded (part-off tab joints)", "%"),
    ("tab_witness_mm2", "Tab witness area", "mm²"),
    ("edge_band_excluded_pct", "Edge band (metrology) excluded", "%"),
    ("tabs", "Part-off tabs", ""),
    ("tab_total_mm2", "Tab section, total", "mm²"),
    ("tab_max_width_mm", "Widest tab (smallest direction)", "mm"),
    ("setups", "Setups (contiguous orientations)", ""),
    ("distinct_orientations", "Distinct tool orientations", ""),
    ("surface_area_mm2", "Part surface area", "mm²"),
    ("scored_area_mm2", "Scored area", "mm²"),
    ("probes", "Surface probe points", ""),
    ("cycle_time_min", "Estimated cycle time (incl. indexing)", "min"),
    ("errors", "Errors", ""),
    ("warnings", "Warnings", ""),
]
AGENT_LABEL = "LLM agent (Claude Code subagent)"   # never print model identifiers


def _whole_surface(m: dict, res_dir) -> dict:
    """Headline numbers under the whole-surface rule: from metrics.json, else recomputed from <res_dir>/probes.npz
    (P, area, dev, edge, witness), else None (a run scored only under the earlier rule)."""
    keys = ("whole_surface_in_tol_pct", "whole_surface_proud_pct", "whole_surface_gouge_pct")
    if m.get(keys[0]) is not None:
        return {k: m.get(k) for k in keys} | {"tab_witness_pct": m.get("tab_witness_pct"),
                                             "edge_band_excluded_pct": m.get("edge_band_excluded_pct"), "source": "metrics"}
    pz = Path(res_dir) / "probes.npz" if res_dir else None
    if pz and pz.exists():
        z = np.load(pz)
        tol = float(z["tol"]) if "tol" in z.files else m.get("tolerance_mm", TOL_DEFAULT)
        a, dev, edge = z["area"], z["dev"].astype(float), z["edge"].astype(bool)
        wit = z["witness"].astype(bool) if "witness" in z.files else np.zeros(len(a), bool)
        sc = ~edge & ~wit
        den = a[sc].sum() or 1.0
        return {"whole_surface_in_tol_pct": round(float(100 * a[sc & (np.abs(dev) <= tol)].sum() / den), 3),
                "whole_surface_proud_pct": round(float(100 * a[sc & (dev > tol)].sum() / den), 3),
                "whole_surface_gouge_pct": round(float(100 * a[sc & (dev < -tol)].sum() / den), 3),
                "tab_witness_pct": round(float(100 * a[wit].sum() / a.sum()), 3),
                "edge_band_excluded_pct": round(float(100 * a[edge].sum() / a.sum()), 3), "source": "probes"}
    return {k: None for k in keys} | {"tab_witness_pct": None, "edge_band_excluded_pct": m.get("edge_band_excluded_pct"),
                                     "source": None}


def _pct(v, nd=2):
    return "–" if v is None else f"{v:.{nd}f}%"


def _axis_icon(d, size=30, color="currentColor"):
    """Python twin of simview5.axisIcon: the tool axis drawn into an iso view of the stock."""
    def P(x, y, z):
        return (15 + (x - y) * 6.2, 17 + (x + y) * 3.1 - z * 8)
    box = [P(x * 0.75, y * 0.45, z * 0.6) for x, y, z in
           [(-1, -1, -.5), (1, -1, -.5), (1, 1, -.5), (-1, 1, -.5), (-1, -1, .5), (1, -1, .5), (1, 1, .5), (-1, 1, .5)]]
    E = [(0, 1), (1, 2), (2, 3), (3, 0), (4, 5), (5, 6), (6, 7), (7, 4), (0, 4), (1, 5), (2, 6), (3, 7)]
    tip, tail = P(*(v * .55 for v in d)), P(*(v * 1.55 for v in d))
    dx, dy = tip[0] - tail[0], tip[1] - tail[1]
    L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L
    h1 = (tip[0] - ux * 4 - uy * 2.6, tip[1] - uy * 4 + ux * 2.6)
    h2 = (tip[0] - ux * 4 + uy * 2.6, tip[1] - uy * 4 - ux * 2.6)
    f = lambda p: f"{p[0]:.1f},{p[1]:.1f}"  # noqa: E731
    edges = "".join(f"M{f(box[a])}L{f(box[b])}" for a, b in E)
    return (f'<svg class="axis-ico" viewBox="0 0 30 30" width="{size}" height="{size}" aria-hidden="true">'
            f'<path d="{edges}" stroke="currentColor" stroke-opacity=".45" stroke-width="1" fill="none"/>'
            f'<path d="M{f(tail)}L{f(tip)}" stroke="{color}" stroke-width="2.2" stroke-linecap="round"/>'
            f'<path d="M{f(tip)}L{f(h1)}L{f(h2)}Z" fill="{color}"/></svg>')


def _setup_label(s):
    return f"A{round(s.get('A_deg', 0))} C{round(s.get('C_deg', 0))}"


def _issue_rows5(issues: list) -> str:
    if not issues:
        return '<p class="ok-note">No safety, fixture or plausibility issues.</p>'
    rows = []
    sev_order = {"error": 0, "warning": 1}
    kind_lbl = {"fixture": "vise / table collision", "part-off": "part-off", "rigidity": "rigidity", "collision": "crash",
                "gcode": "G-code", "cutting": "cutting data"}
    for i in sorted(issues, key=lambda x: (sev_order.get(x.get("severity"), 2), x.get("kind") != "fixture", x.get("line") or 0)):
        lines = i.get("lines") or ([i["line"]] if i.get("line") else [])
        lk = " ".join(f'<button class="gl" data-gline="{l}" title="Show line {l} in the G-code and animation">{l}</button>'
                      for l in lines[:12])
        if len(lines) > 12:
            lk += f' <span class="muted">+{len(lines) - 12} more</span>'
        cnt = f'<span class="muted"> &times;{i["count"]}</span>' if i.get("count") else ""
        sev, kind = i.get("severity", "info"), i.get("kind", "")
        rows.append(f'<li class="issue {sev} k-{_esc(kind)}"><span class="sev {sev}">{_esc(sev)}</span>'
                    f'<div class="ibody"><div class="imsg">{_esc(i.get("msg", ""))}{cnt} '
                    f'<span class="kind">{_esc(kind_lbl.get(kind, kind))}</span></div>'
                    f'<div class="ilines">{"line" + ("s" if len(lines) > 1 else "") + " " + lk if lk else ""}</div></div></li>')
    return '<ul class="issues">' + "".join(rows) + "</ul>"


def _region_rows5(regs: list, segs: list) -> str:
    if not regs:
        return '<p class="ok-note">No out-of-tolerance regions on the scored surface.</p>'
    fr2seg = {}
    for i, s in enumerate(segs):
        fr2seg.setdefault(s.get("frame"), i + 1)

    def row(r):
        bb = r.get("bbox") or [0] * 6
        where = f"X {bb[0]:.1f}…{bb[3]:.1f} · Y {bb[1]:.1f}…{bb[4]:.1f} · Z {bb[2]:.1f}…{bb[5]:.1f}"
        nn = r.get("normal") or [0, 0, 1]
        passes = r.get("nearest_passes") or []
        lk = " ".join(f'<button class="gl" data-gline="{p["line"]}" title="T{p["tool"]}, setup {fr2seg.get(p["frame"], "?")}, '
                      f'missed by {p["gap_mm"]:g} mm">{p["line"]}</button>' for p in passes[:5])
        return (f'<tr><td data-l="Region"><button class="region-btn" data-region="{r.get("id")}" title="Show in the 3D result view">'
                f'R{r.get("id")}</button></td>'
                f'<td data-l="Type"><span class="pill {_esc(r.get("type", ""))}">{_esc(r.get("type", ""))}</span></td>'
                f'<td class="num" data-l="Area mm²">{r.get("area_mm2", 0):g}</td>'
                f'<td class="num" data-l="Worst mm">{r.get("dev_extreme", 0):+.3f}</td>'
                f'<td data-l="Faces">{_esc(", ".join(r.get("faces", [])[:3]))}<div class="muted small">normal ({", ".join(f"{v:g}" for v in nn)})</div></td>'
                f'<td class="where" data-l="Where">{where}</td>'
                f'<td class="lines" data-l="Why">{("<div class=hint>" + _esc(r["hint"]) + "</div>") if r.get("hint") else ""}'
                f'{("<span class=muted>nearest passes</span> " + lk) if lk else ""}</td></tr>')

    head = ('<thead><tr><th>Region</th><th>Type</th><th class="num">Area mm²</th><th class="num">Worst mm</th>'
            '<th>Faces</th><th>Where (bounding box, mm)</th><th>Why it failed</th></tr></thead>')
    out = f'<div class="tablewrap"><table class="regions">{head}<tbody>{"".join(row(r) for r in regs[:10])}</tbody></table></div>'
    if len(regs) > 10:
        out += (f'<details class="more"><summary>Show {len(regs) - 10} smaller regions</summary>'
                f'<div class="tablewrap"><table class="regions">{head}<tbody>{"".join(row(r) for r in regs[10:])}</tbody></table></div></details>')
    return out


def _setups_table(segs, conn, fixmoves):
    if not segs:
        return '<p class="muted">No setups.</p>'
    rows = []
    for i, s in enumerate(segs):
        col = SETUP_PALETTE[i % len(SETUP_PALETTE)]
        ax = ", ".join(f"{(0 if abs(v) < 5e-4 else v):g}" for v in s.get("tool_axis", [0, 0, 1]))
        ijk = " ".join(f"{float(v):g}" for v in (s.get("ijk") or [0, 0, 0]))
        c = conn[i] if i < len(conn) else None
        cc = (f'{100 * c["fraction"]:.0f}%{" · part-off" if c.get("part_off") else ""}' if c else "–")
        fx = fixmoves.get(i, 0)
        fxs = f'<span class="pill vise" title="moves where the tool or holder touches the vise / table">{fx} moves</span>' if fx else '<span class="muted">none</span>'
        rows.append(
            f'<tr{" class=has-err" if fx else ""}><td data-l="Setup"><button class="setup-btn" data-goseg="{i}" title="Play from this setup" style="--sc:{col}">'
            f'{_axis_icon(s.get("tool_axis", [0, 0, 1]), 24, col)}<b>{i + 1}</b></button></td>'
            f'<td data-l="Orientation"><b>{_setup_label(s)}</b><div class="muted small">axis ({ax}) · IJK {ijk}</div></td>'
            f'<td data-l="Lines"><button class="gl" data-gline="{s.get("first_line")}">{s.get("first_line")}</button>–{s.get("last_line")}</td>'
            f'<td data-l="Tools">{" ".join(f"<span class=swatch data-tool={t}></span>T{t}" for t in s.get("tools", []))}</td>'
            f'<td class="num" data-l="Moves">{s.get("moves", 0):,}</td>'
            f'<td class="num" data-l="Removed cm³">{s.get("removed_cm3", 0):g}</td>'
            f'<td class="num" data-l="Connection after">{cc}</td><td data-l="Vise contact">{fxs}</td></tr>')
    return ('<div class="tablewrap"><table class="setups"><thead><tr><th>Setup</th><th>Orientation (trunnion A / C)</th><th>Lines</th>'
            '<th>Tools</th><th class="num">Moves</th><th class="num">Removed cm³</th><th class="num">Connection after</th>'
            '<th>Vise contact</th></tr></thead><tbody>' + "".join(rows) + '</tbody></table></div>')


def _rigidity_chart(rg):
    """Connection area after each setup (bars) against the rigidity and part-off limits."""
    from .sim5 import PARTOFF_MAX, RIGID_MIN
    checks = rg.get("checks") or []
    if not checks:
        return '<p class="muted">No rigidity data.</p>'
    H, T, B = 210, 14, 30
    n = len(checks)
    y = lambda v: T + (H - T - B) * (1 - min(max(v, 0), 1))  # noqa: E731
    p = [f'<svg class="chart rig" width="100%" height="{H}" role="img" aria-label="Connection area after each setup">']
    ylab = []
    for g in (0, .15, .5, 1.0):
        p.append(f'<line class="grid" x1="0" x2="100%" y1="{y(g):.1f}" y2="{y(g):.1f}"/>')
        ylab.append(f'<span style="top:{y(g) - 8:.1f}px">{100 * g:.0f}%</span>')
    p.append(f'<line class="lim rig" x1="0" x2="100%" y1="{y(RIGID_MIN):.1f}" y2="{y(RIGID_MIN):.1f}"/>')
    p.append(f'<line class="lim po" x1="0" x2="100%" y1="{y(PARTOFF_MAX):.1f}" y2="{y(PARTOFF_MAX):.1f}"/>')
    w = 84 / n
    for i, c in enumerate(checks):
        x = 8 + w * i + w * 0.18
        bw = w * 0.64
        f = c["fraction"]
        po = c.get("part_off")
        last = i == n - 1
        bad = (not po and f < RIGID_MIN) or (last and po and (f > PARTOFF_MAX or c["area_mm2"] < 2.0))
        cls = "bad" if bad else ("po" if po else "ok")
        p.append(f'<g class="bar {cls}"><rect x="{x:.2f}%" y="{y(f):.1f}" width="{bw:.2f}%" height="{max(y(0) - y(f), 1):.1f}" rx="2"/>'
                 f'<title>After setup {c["after_segment"]} (line {c["line"]}): {c["area_mm2"]:g} mm² = {100 * f:.1f}% of the stock section'
                 f'{" · part-off section" if po else ""}</title></g>')
        step = max(1, math.ceil(n / 12))   # thin the labels: at most ~12, always the last and failing bars
        if (n <= 12 and (i == 0 or last or bad or abs(f - checks[i - 1]["fraction"]) > 1e-4)) or last or (n > 12 and i % step == 0 and n - 1 - i >= step):
            p.append(f'<text class="vlab" x="{x + bw / 2:.2f}%" y="{y(f) - 5:.1f}" text-anchor="middle">{100 * f:.0f}%</text>')
        if n <= 16 or i % max(1, math.ceil(n / 14)) == 0 or last:
            p.append(f'<text class="tick" x="{x + bw / 2:.2f}%" y="{H - 10}" text-anchor="middle">{c["after_segment"]}</text>')
    p.append("</svg>")
    return (f'<div class="legend"><span class="lg"><i class="rig-ok"></i>before the part-off (must stay ≥ {100 * RIGID_MIN:.0f}%)</span>'
            f'<span class="lg"><i class="rig-po"></i>part-off section (must end ≤ {100 * PARTOFF_MAX:.0f}% and ≥ 2 mm²)</span>'
            f'<span class="lg"><i class="rig-bad"></i>violates a limit</span></div>'
            f'<div class="chart-box"><div class="ylab">{"".join(ylab)}</div>{"".join(p)}</div>'
            f'<p class="muted small chart-note">x: setup number; y: weakest material cross-section across the stub gap as a share of the stock section '
            f'({rg.get("stock_section_mm2", 0):g} mm²). Dashed lines: {100 * RIGID_MIN:.0f}% rigidity minimum, {100 * PARTOFF_MAX:.0f}% part-off maximum.</p>')


def _partoff_block(po: dict | None, rg: dict, m: dict, img: str | None) -> str:
    """Tabs left by the part-off (simulator's part-off table), witness area and the close-up render."""
    checks = rg.get("checks") or []
    last = checks[-1] if checks else {}
    measured = bool(po)
    if po:
        tabs = po.get("tabs") or []
        total = po.get("total_mm2")
        wit_mm2, wit_pct = po.get("witness_mm2"), po.get("witness_pct")
        ok = po.get("ok")
        reasons = po.get("reasons") or []
    else:   # run simulated before tabs were measured: islands of the last connection plane, widths not measured
        tabs = [{"area_mm2": a, "width_mm": None, "centroid": None} for a in (last.get("islands") or [])]
        total, wit_mm2, wit_pct, ok, reasons = last.get("area_mm2"), None, None, None, []
    rows = "".join(
        f'<tr><td>Tab {i + 1}</td><td class="num">{t.get("area_mm2", 0):g}</td>'
        f'<td class="num">{"not measured" if t.get("width_mm") is None else format(t["width_mm"], "g")}</td>'
        f'<td class="num">{"–" if not t.get("centroid") else ", ".join(f"{v + 0.0:g}" for v in t["centroid"])}</td></tr>'
        for i, t in enumerate(tabs))
    widths = [t["width_mm"] for t in tabs if t.get("width_mm") is not None]
    tbl = (f'<div class="tablewrap"><table class="tabs"><thead><tr><th>Tab</th><th class="num">Section mm²</th>'
           f'<th class="num" title="smallest direction: twice the largest inscribed radius of the tab section">Width mm</th><th class="num">Centre X, Y, Z (G54)</th></tr></thead>'
           f'<tbody>{rows or "<tr><td colspan=4 class=muted>No tabs: nothing connects the part to the stub.</td></tr>"}</tbody>'
           f'<tfoot><tr><th>{len(tabs)} tab{"s" if len(tabs) != 1 else ""}</th><th class="num">{total if total is not None else "–"}</th>'
           f'<th class="num">{f"max {max(widths):g}" if widths else "–"}</th><th></th></tr></tfoot></table></div>')
    if ok is None:
        status = '<span class="badge sm neutral">not checked</span>'
    else:
        status = f'<span class="badge sm {"valid" if ok else "invalid"}">{"part-off OK" if ok else "part-off fails"}</span>'
    if wit_pct is None:
        wit = "Tab witness: not measured in this run."
    else:
        excl = m.get("tab_witness_pct")
        wit = (f'Tab witness (part surface within 1 mm of where a tab joins the part): <b>{wit_mm2:g} mm²</b> = <b>{wit_pct:.2f}%</b> of the surface. '
               + (f'Only this area and the edge band are left out of the score (tab witness excluded {excl:.2f}%).' if excl
                  else 'It is not left out of the score here, because the part-off does not pass.' if ok is False else ''))
    why = "".join(f"<li>{_esc(r)}</li>" for r in reasons)
    lim = (f'Limits: total 2–30 mm² and at most 15% of the stub section, each tab at most 3 mm across, at most 4 tabs, witness at most 1.5% '
           f'of the surface (review target 2–4 tabs, 20–30 mm², witness ≤ 0.5%).')
    fig = (f'<figure class="po-img"><a href="{img}" target="_blank"><img src="{img}" alt="Close-up of the part-off: the tabs left between the part and the stub" loading="lazy"></a>'
           f'<figcaption>Close-up of the tabs after the part-off (simulated material).</figcaption></figure>') if img else ""
    return (f'<div class="po"><div class="po-main"><p class="po-status">{status} {len(tabs)} tab{"s" if len(tabs) != 1 else ""}'
            f'{f", {total:g} mm² in total" if total is not None else ""}{f", widest {max(widths):g} mm" if widths else ""}.'
            f'{"" if measured else " Tab widths were not measured when this run was simulated."}</p>'
            f'{tbl}<p class="small">{wit}</p>{f"<ul class=po-why>{why}</ul>" if why else ""}<p class="muted small">{lim}</p></div>{fig}</div>')


def _history_svg5(hist: list, final_iter) -> str:
    """Whole-surface score per iteration; iterations simulated before the whole-surface rule are not plotted."""
    pts = [h for h in hist if h.get("metrics", {}).get("whole_surface_in_tol_pct") is not None]
    if not pts:
        return ('<p class="muted">The iterations of this run were simulated before the whole-surface scoring rule, so their '
                'scores are not comparable with the headline and are not plotted. The header shows the program re-scored '
                'under the current rule.</p>')
    from .report import _line_chart
    sc = [float(h["metrics"]["whole_surface_in_tol_pct"]) for h in pts]
    span = 100 - min(sc)
    step = next(s for s in (0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 25) if span / s <= 5) if span > 0 else 0.1
    lo = max(0.0, math.floor((min(sc) - step * 0.5) / step) * step)
    ticks = [lo + k * step for k in range(int(round((100 - lo) / step)) + 1)]
    nd = 2 if step < 0.5 else 1 if step < 1 else 0
    a = _line_chart(pts, [("Whole surface in tolerance", "whole_surface_in_tol_pct", "var(--ink)")], lo, 100, ticks,
                    "Whole-surface score per iteration", 220, final_iter, "whole_surface_in_tol_pct", "{:.%df}%%" % nd)
    return (f'<div class="legend"><span class="lg"><i style="background:var(--ink)"></i>Whole part surface in tolerance</span>'
            f'<span class="lg"><i class="dash"></i>evaluated iteration</span></div>{a}'
            f'<p class="muted small chart-note">Score axis zoomed to {ticks[0]:.{nd}f}–100 %. Values as simulated at each iteration.</p>')


def _conn_maps(cm, checks):
    """Small multiples: the connection plane after each setup where it changed (material dark, cut light)."""
    if not cm or not cm.get("masks"):
        return ""
    nx, ny, r = cm["nx"], cm["ny"], cm["res"]
    W, Hh = nx * r, ny * r
    out, prev = [], None
    for i, runs in enumerate(cm["masks"]):
        key = json.dumps(runs)
        last = i == len(cm["masks"]) - 1
        if key == prev and not last:
            continue
        prev = key
        path = []
        for row, rr in enumerate(runs):
            for k in range(0, len(rr), 2):
                path.append(f"M{rr[k] * r:g} {(ny - 1 - row) * r:g}h{rr[k + 1] * r:g}v{r:g}h{-rr[k + 1] * r:g}z")
        c = checks[i] if i < len(checks) else {}
        isl = c.get("islands") or []
        lbl = (f'After setup {i + 1}: <b>{c.get("area_mm2", 0):g} mm²</b> ({100 * c.get("fraction", 0):.0f}%)'
               + (f' · {len(isl)} piece{"s" if len(isl) != 1 else ""}' if len(isl) > 1 or c.get("part_off") else "")
               + (" · part-off" if c.get("part_off") else ""))
        out.append(f'<figure class="cmap{" final" if last else ""}"><svg viewBox="0 0 {W:g} {Hh:g}" preserveAspectRatio="xMidYMid meet" role="img" '
                   f'aria-label="Connection plane after setup {i + 1}"><rect class="cut" width="{W:g}" height="{Hh:g}"/>'
                   f'<path class="mat" d="{"".join(path)}"/></svg><figcaption>{lbl}</figcaption></figure>')
    return (f'<div class="cmaps">{"".join(out)}</div><p class="muted small">Seen from above at Z {cm["z"]:g} mm (middle of the stub gap; the rigidity check uses the weakest plane), '
            f'X {cm["x0"]:g}…{cm["x0"] + W:g} mm left to right, Y up. Filled = material still connecting the part to the gripped stub. '
            f'Only setups that changed the plane are shown.</p>')


def build(run_dir, source: str | None = None) -> Path:
    """Build run_dir/report/. `source`: result folder inside the run ("final", or "rescore_refine" for a program
    re-scored under the whole-surface rule); default: rescore_refine when it has metrics, else final."""
    run = Path(run_dir)
    meta = _load(run / "run.json", {})
    hist = _load(run / "history.json", []) or []
    if source is None:
        source = "rescore_refine" if (run / "rescore_refine" / "metrics.json").exists() else "final"
    final = run / source
    rescored = source != "final"
    ev = _load(final / "evaluation.json") or (_load(run / "final" / "evaluation.json") if rescored else None)
    rescore = _load(final / "rescore.json") if rescored else None
    out = run / "report"
    if out.exists():
        shutil.rmtree(out)
    for d in ("assets", "img", "gcode", "iter"):
        (out / d).mkdir(parents=True)
    part_dir = Path(meta.get("part_dir", ""))
    setup = _load(part_dir / "setup.json", {}) if meta.get("part_dir") else {}
    setup = setup or _load(run / "part" / "setup.json", {}) or _load(run / "brief" / "setup.json", {})
    if rescored and (final / "metrics.json").exists():
        res_dir, m, final_iter, is_final = final, _load(final / "metrics.json"), (ev or {}).get("iteration"), True
    elif ev and (final / "metrics.json").exists():
        res_dir, m, final_iter, is_final = final, ev["metrics"], ev.get("iteration"), True
    elif hist:
        last = hist[-1]["iter"]
        res_dir, m, final_iter, is_final = run / f"iter_{last:02d}", hist[-1]["metrics"], last, False
    else:
        res_dir, m, final_iter, is_final = None, {}, None, False
    issues = _load(res_dir / "issues.json", []) if res_dir else []
    regs = _load(res_dir / "regions.json", []) if res_dir else []
    setups = _load(res_dir / "setups.json", {}) if res_dir else {}
    segs = setups.get("segments") or []
    rg = setups.get("rigidity") or {}
    po = setups.get("partoff")
    ws = _whole_surface(m, res_dir)

    # ---- assets
    shutil.copy(VIEWER / "dist" / "viewer5.js", out / "assets" / "viewer5.js")
    shutil.copy(VIEWER / "report.css", out / "assets" / "report.css")
    shutil.copy(VIEWER / "report5.css", out / "assets" / "report5.css")
    vd = final / "viewer_data"
    if not (vd / "meta.json").exists() and rescored:
        # same program, same simulated material: the original export (its per-vertex deviation is the same; it only
        # lacks the tab witness class)
        vd = run / "final" / "viewer_data"
    have_viewer = is_final and (vd / "meta.json").exists() and (vd / "data.bin.gz").exists()
    vmeta, fixmoves, cm = {}, {}, None
    if have_viewer:
        import base64
        vmeta = json.loads((vd / "meta.json").read_text())
        segs = segs or vmeta.get("segments", [])
        rg = rg or vmeta.get("rigidity") or {}
        cm = _load(vd / "rigidity.json")
        try:   # vise-contact moves per setup (from the exported move flags)
            raw = gzip.decompress((vd / "data.bin.gz").read_bytes())
            lay = vmeta["arrays"]["mv_fix"]
            fx = np.frombuffer(raw, np.uint8, lay["len"], lay["off"])
            for i, s in enumerate(vmeta["segments"]):
                k = int((fx[s["a"]:s["b"]] > 0).sum())
                if k:
                    fixmoves[i] = k
        except Exception:
            pass
        b64 = base64.b64encode((vd / "data.bin.gz").read_bytes()).decode("ascii")
        extra = {"regions": regs, "issues": [{k: v for k, v in i.items() if k != "lines"} | {"lines": i.get("lines", [])[:30]}
                                              for i in issues[:200]],
                 "part": meta.get("part"), "tolerance": m.get("tolerance_mm", TOL_DEFAULT),
                 "score": {k: ws.get(k) for k in ("whole_surface_in_tol_pct", "whole_surface_proud_pct", "whole_surface_gouge_pct")}}
        with open(out / "assets" / "data.js", "w") as fh:
            fh.write("window.CNCLLM_DATA={meta:")
            fh.write(json.dumps(vmeta | extra))
            fh.write(',blob:"')
            fh.write(b64)
            fh.write('"};\n')
    conn = rg.get("checks") or []
    # ---- images
    gallery = []
    # plots made under the earlier scoring rule carry its wording in the image: only show plots of whole-surface data
    if res_dir and (res_dir / "deviation_views.png").exists() and ws["source"]:
        shutil.copy(res_dir / "deviation_views.png", out / "img" / "deviation_views.png")
        gallery.append(("img/deviation_views.png", "Surface deviation, 6 views: green in tolerance, orange to red proud, blue gouge, purple tab witness"))
    for f, t in (("reach_hint.png", "Reach hint from the brief (a diagnostic for the agent; it does not change the score)"),
                 ("target_iso.png", "Target part in the vise (iso)")):
        if (run / "brief" / f).exists():
            shutil.copy(run / "brief" / f, out / "img" / f)
            gallery.append(("img/" + f, t))
    po_img = None
    if res_dir and (res_dir / "partoff_closeup.png").exists():
        shutil.copy(res_dir / "partoff_closeup.png", out / "img" / "partoff_closeup.png")
        po_img = "img/partoff_closeup.png"
    final_nc = None
    if res_dir and (res_dir / "program.nc").exists():
        final_nc = "gcode/final.nc"
        shutil.copy(res_dir / "program.nc", out / final_nc)
        shutil.copy(res_dir / "program.nc", out / "gcode" / "final.txt")
    # ---- iteration cards
    cards = []
    for h in reversed(hist):
        n = h["iter"]
        it = run / f"iter_{n:02d}"
        if not it.exists():
            continue
        dst = out / "iter" / f"{n:02d}"
        dst.mkdir()
        links = []
        if (it / "program.nc").exists():
            shutil.copy(it / "program.nc", dst / "program.nc")
            shutil.copy(it / "program.nc", dst / "program.txt")
            links.append(f'<a href="iter/{n:02d}/program.txt" target="_blank">G-code</a>'
                         f'<a href="iter/{n:02d}/program.nc" download>download .nc</a>')
        hm = h["metrics"]
        new_rule = hm.get("whole_surface_in_tol_pct") is not None
        # feedback and plots of iterations simulated under the earlier scoring rule use its wording: not copied
        if (it / "feedback.md").exists() and new_rule:
            shutil.copy(it / "feedback.md", dst / "feedback.txt")
            links.append(f'<a href="iter/{n:02d}/feedback.txt" target="_blank">feedback</a>')
        thumb = ""
        if (it / "deviation_views.png").exists() and new_rule:
            shutil.copy(it / "deviation_views.png", dst / "deviation_views.png")
            links.append(f'<a href="iter/{n:02d}/deviation_views.png" target="_blank">deviation views</a>')
            thumb = (f'<a class="thumb" href="iter/{n:02d}/deviation_views.png" target="_blank">'
                     f'<img src="iter/{n:02d}/deviation_views.png" alt="Deviation views, iteration {n}" loading="lazy"></a>')
        notes = (it / "notes.md").read_text() if (it / "notes.md").exists() else ""
        prev = next((x for x in hist if x["iter"] == n - 1), None)
        delta = ""
        if prev and new_rule and prev["metrics"].get("whole_surface_in_tol_pct") is not None:
            d = hm["whole_surface_in_tol_pct"] - prev["metrics"]["whole_surface_in_tol_pct"]
            delta = f'<span class="delta {"up" if d >= 0 else "down"}">{"+" if d >= 0 else ""}{d:.2f} pts</span>'
        badge = '<span class="badge sm valid">valid</span>' if hm.get("valid") else \
            f'<span class="badge sm invalid">invalid · {hm.get("errors", 0)} err</span>'
        fin = '<span class="badge sm final">evaluated</span>' if n == final_iter and is_final else ""
        it_errs = [i for i in (_load(it / "issues.json", []) or []) if i.get("severity") == "error"]
        err_html = ""
        if it_errs:
            err_html = ('<div class="iter-errs"><strong>Why invalid:</strong><ul>' + "".join(
                f'<li>line {_esc(i.get("line", "?"))}: {_esc(i.get("msg", ""))}</li>' for i in it_errs[:4]) +
                (f'<li>… {len(it_errs) - 4} more (see feedback)</li>' if len(it_errs) > 4 else "") + "</ul></div>")
        cards.append(f"""
<article class="iter-card{' is-final' if n == final_iter else ''}" id="iter-{n}">
  <header><h3>Iteration {n}</h3>{badge}{fin}<span class="muted when">{_esc(str(h.get('time', '')).replace('T', ' '))}</span></header>
  <div class="iter-body">
    <div class="iter-stats">
      <div class="big">{f"{hm['whole_surface_in_tol_pct']:.2f}%" if new_rule else "–"}{delta}</div>
      <div class="muted small asof">{"whole surface in tolerance, as simulated at the time" if new_rule else "simulated before the whole-surface rule: score not comparable, not shown"}</div>
      <dl>
        <dt>proud</dt><dd>{_pct(hm.get('whole_surface_proud_pct'))}</dd>
        <dt>gouge</dt><dd>{_pct(hm.get('whole_surface_gouge_pct'))}</dd>
        <dt>setups</dt><dd>{hm.get('setups', '–')}</dd>
        <dt>errors</dt><dd>{hm.get('errors', 0)}</dd>
        <dt>cycle</dt><dd>{hm.get('cycle_time_min', 0):.1f} min</dd>
        <dt>lines / moves</dt><dd>{h.get('lines', '')} / {h.get('moves', '')}</dd>
      </dl>
      {thumb}
    </div>
    <div class="notes">{err_html}{(md_to_html(notes) if new_rule else '<details class="old-notes"><summary>The agent’s own notes for this iteration (verbatim, written under the earlier scoring rule)</summary>' + md_to_html(notes) + '</details>') if notes.strip() else '<p class="muted">No notes from the LLM for this iteration.</p>'}</div>
  </div>
  <footer class="links">{''.join(links)}</footer>
</article>""")

    # ---- header facts and chips
    name = meta.get("part") or setup.get("name") or run.name
    tol = m.get("tolerance_mm", TOL_DEFAULT)
    created = meta.get("created", "")
    try:
        created_h = dt.datetime.strptime(created, "%Y%m%d-%H%M%S").strftime("%Y-%m-%d %H:%M")
    except Exception:
        created_h = created
    st = setup.get("stock") or vmeta.get("stock") or {}
    stock_txt = (" × ".join(f"{round(st['hi'][i] - st['lo'][i], 1):g}" for i in range(3)) + " mm") if st.get("lo") else "?"
    fx = setup.get("fixture") or vmeta.get("fixture") or {}
    hold = f"5-axis vise · {fx.get('grip', '?'):g} mm grip · {fx.get('gap', '?'):g} mm stub gap" if fx else "5-axis vise"
    score = ws["whole_surface_in_tol_pct"]
    valid = bool(m.get("valid"))
    integ = (ev or {}).get("integrity", {})
    hv = (rescore or {}).get("harness") or integ.get("harness", {})
    chips, integrity_note, integrity_fail = [], "", ""
    kinds = {}
    for i in issues:
        if i.get("severity") == "error":
            kinds.setdefault(i.get("kind"), []).append(i)
    poi = kinds.get("part-off")
    tabs = (po or {}).get("tabs") or []
    po_bad = bool(poi) or (po is not None and po.get("ok") is False)
    po_tip = poi[0]["msg"] if poi else "; ".join((po or {}).get("reasons") or []) or "the part-off leaves small tabs the operator can break"
    if po is not None:
        widths = [t["width_mm"] for t in tabs if t.get("width_mm") is not None]
        po_txt = (f' · {len(tabs)} tab{"s" if len(tabs) != 1 else ""}, {po.get("total_mm2", 0):g} mm²'
                  + (f', ≤ {max(widths):g} mm wide' if widths else ""))
    else:
        po_txt = f' · {conn[-1]["area_mm2"]:g} mm² left' if conn else ""
    chips.append(f'<span class="chip {"bad" if po_bad else "good"}" title="{_esc(po_tip)}">'
                 f'<b aria-hidden="true">{"✗" if po_bad else "✓"}</b> Part-off {"fails" if po_bad else "OK"}{po_txt}</span>')
    from .sim5 import RIGID_MIN
    rig = kinds.get("rigidity")
    pre = [c["fraction"] for c in conn if not c.get("part_off")]
    chips.append(f'<span class="chip {"bad" if rig else "good"}" title="{_esc(rig[0]["msg"] if rig else f"the weakest connection to the stub stays at least {100 * RIGID_MIN:.0f}% of the stock section until the part-off")}">'
                 f'<b aria-hidden="true">{"✗" if rig else "✓"}</b> Rigidity {"too weak" if rig else "OK"}'
                 + (f' · min {100 * min(pre):.0f}%' if pre else "") + '</span>')
    fxi = kinds.get("fixture")
    chips.append(f'<span class="chip {"bad" if fxi else "good"}" title="{_esc(fxi[0]["msg"] if fxi else "no tool / holder contact with the vise or table")}">'
                 f'<b aria-hidden="true">{"✗" if fxi else "✓"}</b> Vise {"collision" if fxi else "clear"}'
                 + (f' · {fxi[0].get("count", 0)} moves' if fxi else "") + '</span>')
    if integ.get("failures"):
        integrity_fail = ("Integrity check failed: " + "; ".join(_esc(str(f)) for f in integ["failures"])
                          + ". The score below is not a trusted evaluation.")
    if rescored:
        mod = hv.get("harness_modified")
        chips.append(f'<span class="chip {"warn" if mod else "good"}" title="{_esc("same G-code, re-simulated and re-scored under the whole-surface rule; harness sha256 " + hv.get("sha256", "")[:12] + "…, uncommitted harness changes: " + ("yes" if mod else "no"))}">'
                     f'<b aria-hidden="true">{"!" if mod else "✓"}</b> Re-scored under the whole-surface rule · git {_esc(hv.get("git_head", "?"))}</span>')
        if mod:
            integrity_note = ("Re-scored with a harness that had uncommitted changes (the scoring rule was being implemented). "
                              "It is a development re-score, not a frozen trusted evaluation.")
    elif ev:
        ok = integ.get("ok", integ.get("harness_unchanged_since_run_start") and integ.get("part_unchanged") and not hv.get("harness_modified"))
        tip = (f"harness sha256 {hv.get('sha256', '')[:12]}…, git {hv.get('git_head', '?')}, "
               f"uncommitted harness changes: {'yes' if hv.get('harness_modified') else 'no'}, "
               f"unchanged since run start: {'yes' if integ.get('harness_unchanged_since_run_start') else 'no'}, "
               f"part unchanged: {'yes' if integ.get('part_unchanged') else 'no'}")
        hcls = "good" if ok else ("bad" if integ.get("failures") else "warn" if hv.get("harness_modified") else "neutral")
        chips.append(f'<span class="chip {hcls}" title="{_esc(tip)}">'
                     f'<b aria-hidden="true">{"✓" if ok else "!"}</b> Harness {"verified" if ok else "changed since run start"}'
                     f' · git {_esc(hv.get("git_head", "?"))}</span>')
        if not ok and not integrity_fail:
            why = []
            if not integ.get("harness_unchanged_since_run_start"):
                why.append("the harness code changed between the start of the run and the final evaluation")
            if hv.get("harness_modified"):
                why.append("the evaluating checkout had uncommitted harness changes")
            if not integ.get("part_unchanged", True):
                why.append("the part file changed")
            integrity_note = ("Integrity note: " + "; ".join(why) + ". The final score was re-computed by the current "
                              "harness in a fresh process. Hashes are in the footer.")
    if ev:
        cc = ev.get("crosscheck_millbill", {})
        lbl = "MillBill cross-check" + (" (original evaluation, same program)" if rescored else "")
        if "agreement_pct" in cc:
            good = cc["agreement_pct"] >= 99.99
            chips.append(f'<span class="chip {"good" if good else "bad"}" title="{lbl}: {cc.get("points", 0)} query points in {cc.get("frames", "?")} frames, '
                         f'{cc.get("disagree_beyond_2um", 0)} disagree beyond 2 µm"><b aria-hidden="true">{"✓" if good else "✗"}</b> '
                         f'MillBill cross-check {cc["agreement_pct"]:.3f}%</span>')
        elif "skipped" in cc:
            chips.append(f'<span class="chip neutral" title="{_esc(cc["skipped"])}">MillBill cross-check skipped</span>')
        elif "error" in cc:
            chips.append(f'<span class="chip bad" title="{_esc(cc["error"])}">MillBill cross-check failed</span>')
    elif not rescored:
        chips.append('<span class="chip warn" title="run python -m cncllm.x5 evaluate RUN">Not yet evaluated (latest iteration shown)</span>')

    # ---- summary paragraph (what, score, valid, biggest problems, how held and parted off)
    vs = []
    errs = [i for i in issues if i.get("severity") == "error"]
    if not m:
        verdict = "No simulation results yet."
    else:
        if valid:
            vs.append("The program is <strong>valid</strong>: no crash, no vise or table contact, the part stays rigid until the part-off, "
                      "and the part-off leaves only small tabs.")
        else:
            first = errs[0] if errs else {}
            fl = (f', first at line <a href="#sim" class="gl" data-gline="{first.get("line")}">{first.get("line")}</a>' if first.get("line") else "")
            vs.append(f'The program is <strong>invalid</strong>: {m.get("errors", 0)} error{"s" if m.get("errors", 0) != 1 else ""}{fl}: {_esc(first.get("msg", ""))}.')
        if score is not None:
            w_, e_ = ws.get("tab_witness_pct"), ws.get("edge_band_excluded_pct")
            vs.append(f'<strong>{score:.2f}%</strong> of the whole part surface is within ±{tol:g} mm. Everything else counts as failed: '
                      f'{_pct(ws["whole_surface_proud_pct"])} is proud (material left) and {_pct(ws["whole_surface_gouge_pct"])} is gouged. '
                      f'The only areas not scored are the tab witness ({_pct(w_)}) and a 0.03 mm band along face edges '
                      f'(edge band (metrology) excluded {_pct(e_)}).')
        else:
            vs.append("This run was simulated before the whole-surface scoring rule and has not been re-scored yet, so no score is shown.")
        if segs:
            vs.append(f'Held in one vise by {fx.get("grip", "?"):g} mm of extra stock below a {fx.get("gap", "?"):g} mm stub gap, it is machined in '
                      f'{len(segs)} setup{"s" if len(segs) != 1 else ""} ({m.get("distinct_orientations", "?")} table orientations, about '
                      f'{m.get("cycle_time_min", 0):.0f} min); the part-off at the end leaves '
                      + (f'{len(tabs)} tab{"s" if len(tabs) != 1 else ""} ({(po or {}).get("total_mm2", 0):g} mm²)' if po is not None
                         else f'{conn[-1]["area_mm2"]:g} mm² of connection' if conn else 'the part on tabs')
                      + (' for the operator to break off and file flush.' if not po_bad and po is not None else
                         ', but the part-off fails its checks (see Part-off below).' if po_bad else
                         '; tab sizes were not measured when this run was simulated.'))
        top = sorted(regs, key=lambda r: -r.get("area_mm2", 0))[:3]
        if top:
            items = []
            for r in top:
                h = (r.get("hint") or "").replace("failed: ", "").split(";")[0].strip()
                items.append(f'<button class="region-btn inline" data-region="{r["id"]}">R{r["id"]}</button> {r["type"]} '
                             f'{r["area_mm2"]:g} mm² (worst {r["dev_extreme"]:+.2f} mm{"; " + _esc(h) if h else ""})')
            vs.append("Biggest problems: " + "; ".join(items) + ".")
        verdict = " ".join(vs)

    def _mfmt(k, v):
        if v is None:
            return "–"
        if isinstance(v, bool):
            return "yes" if v else "no"
        return _fmt(v, 3 if k in ("max_gouge_mm", "max_proud_mm") else 2)
    mrows = "".join(f'<tr><th>{_esc(lbl)}</th><td class="num">{_mfmt(k, m.get(k))}{(" " + u) if u and m.get(k) is not None else ""}</td></tr>'
                    for k, lbl, u in METRIC5 if k in m)
    if score is not None and "whole_surface_in_tol_pct" not in m:
        mrows = (f'<tr><th>Whole part surface in tolerance (from the probe dump)</th><td class="num">{score:.2f} %</td></tr>' + mrows)
    trows = []
    for tn, d in (vmeta.get("per_tool") or {}).items():
        t = LIBRARY.get(int(tn))
        if not t:
            continue
        geo = {"flat": "flat", "ball": "ball", "bull": f"bull r{t.corner_radius:g}", "cone": f"cone {2 * t.half_angle:g}°"}.get(t.kind, t.kind)
        if getattr(t, "neck_length", 0):
            geo += f", neck to {t.neck_length:g} mm"
        trows.append(f'<tr><td><span class="swatch" data-tool="{tn}"></span>T{tn}</td><td>{_esc(t.name)}</td><td>{geo}</td>'
                     f'<td class="num">{t.diameter:g}</td><td class="num">{t.stickout:g}</td><td class="num">{t.holder_diameter:g}</td>'
                     f'<td class="num">{d["time_s"] / 60:.1f}</td><td class="num">{d["cut_mm"] / 1000:.2f}</td>'
                     f'<td class="num">{d["removed_cm3"]:.2f}</td></tr>')
    tools_tbl = ('<div class="tablewrap"><table class="tools"><thead><tr><th>Tool</th><th>Name</th><th>Type</th>'
                 '<th class="num">Ø mm</th><th class="num">Stick-out</th><th class="num">Holder Ø</th><th class="num">Time min</th>'
                 '<th class="num">Cut m</th><th class="num">Removed cm³</th></tr></thead><tbody>'
                 + "".join(trows) + '</tbody></table></div>') if trows else '<p class="muted">No tool data.</p>'
    gal = "".join(f'<figure><a href="{p}" target="_blank"><img src="{p}" alt="{_esc(t)}" loading="lazy"></a>'
                  f'<figcaption>{_esc(t)}</figcaption></figure>' for p, t in gallery)
    desc = setup.get("description", "")
    n_err, n_warn = m.get("errors", 0), m.get("warnings", 0)
    sim_block = ("""
<div class="sim" id="simroot">
  <div class="viewer-col">
    <div class="viewport" id="simview"><div class="vp-msg" id="simmsg">Loading 3D viewer…</div></div>
    <div class="controls" id="simcontrols"></div>
  </div>
  <aside class="side" id="simside"></aside>
</div>""" if have_viewer else '<p class="muted">No viewer data (run <code>python -m cncllm.x5 evaluate RUN</code>).</p>')
    res_block = ("""
<div class="result">
  <div class="viewport tall" id="resview"><div class="vp-msg">Loading…</div></div>
  <div class="res-bar" id="resbar"></div>
</div>""" if have_viewer else "")
    n_or = m.get("distinct_orientations")
    w_, e_ = ws.get("tab_witness_pct"), ws.get("edge_band_excluded_pct")
    if score is not None:
        score_label = (f'of the whole part surface within ±{tol:g} mm'
                       + (' · same program, re-scored under the whole-surface rule' if rescored else
                          (f' · final evaluation of iteration {final_iter}, integrity check failed' if integrity_fail else f' · trusted final evaluation of iteration {final_iter}') if is_final else ' (latest iteration, not evaluated)'))
    else:
        score_label = 'no whole-surface score: this run was simulated before the rule and has not been re-scored yet'
    score2 = (f'<div class="score-2"><span>proud (failed) <b>{_pct(ws["whole_surface_proud_pct"])}</b></span>'
              f'<span>gouged (failed) <b>{_pct(ws["whole_surface_gouge_pct"])}</b></span></div>'
              f'<div class="score-3">Not scored: tab witness excluded {_pct(w_)} · edge band (metrology) excluded {_pct(e_)}</div>') if score is not None else ""
    help_txt = """<details class="help-k"><summary>How the Machine view works</summary>
  <p>The machine is a trunnion (table-table) 5-axis mill. The spindle always points straight down and only moves in X, Y and Z.
  The <b>A axis</b> tilts the cradle about the machine X axis; the <b>C axis</b> turns the round platter on the cradle; the vise,
  the stock and the part sit on the platter and move with it. For each setup the table angles come from the program's
  <code>G68.2</code> tool axis <i>d</i> (in G54 coordinates, from the tool tip towards the holder): A is the tilt of <i>d</i> from vertical
  and C its direction around Z (C = 0 when A = 0), the same angles the simulator reports. The table rotation is
  R = Rx(A)·Rz(90° − C), which turns <i>d</i> exactly to vertical, under the spindle. Because the A axis lies along machine X,
  the platter sits at 90° when A = C = 0, so the part looks turned a quarter turn compared with the Part view. Between setups the
  spindle retracts, the table swings (the platter takes the short way round) and the tool comes back down.</p>
  <p>The readout shows the tool tip in machine coordinates relative to the rotary centre (where the A and C axes cross), the table
  angles A and C, the tool and the current G-code line. In Part view the part stays still and the tool comes in along each setup's
  axis instead. Both views replay the same simulated cutting; a self-check in the page confirms that the tool tip relative to the
  part is identical in the two views for hundreds of moves of every setup and that the spindle stays vertical.</p></details>"""
    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>{_esc(name)} · 3+2 CNC run report</title>
<link rel="stylesheet" href="assets/report.css">
<link rel="stylesheet" href="assets/report5.css">
</head>
<body class="x5">
<header class="hero">
  <div class="wrap hero-grid">
    <div class="hero-main">
      <div class="eyebrow">CNC-LLM run report · 3+2 indexed 5-axis · {_esc(run.name)}</div>
      <h1>{_esc(name)}</h1>
      <p class="desc">{_esc(desc)}</p>
      <dl class="facts">
        <div><dt>Material</dt><dd>AL6061 billet</dd></div>
        <div><dt>Stock</dt><dd>{_esc(stock_txt)}</dd></div>
        <div><dt>Workholding</dt><dd>{_esc(hold)}</dd></div>
        <div><dt>Setups</dt><dd>{len(segs)}{f' · {n_or} orientation' + ('s' if n_or != 1 else '') if n_or else ''}</dd></div>
        <div><dt>Tolerance</dt><dd>±{tol:g} mm</dd></div>
        <div><dt>Programmed by</dt><dd>{AGENT_LABEL}</dd></div>
        <div><dt>Date</dt><dd>{_esc(created_h)}</dd></div>
        <div><dt>Iterations</dt><dd>{len(hist)}{f' · final = #{final_iter}' if final_iter else ''}</dd></div>
      </dl>
    </div>
    <div class="hero-score" aria-label="Final score">
      {f'<p class="int-fail" role="alert">{integrity_fail}</p>' if integrity_fail else ''}
      <div class="score-top">
        <span class="badge lg {'valid' if valid else 'invalid'}">{'VALID' if valid else 'INVALID'}</span>
        <span class="muted">{n_err} error{'s' if n_err != 1 else ''} · {n_warn} warning{'s' if n_warn != 1 else ''}{' · under the checks of the time (no part-off tab checks yet)' if score is None else ''}</span>
      </div>
      <div class="score-num">{(f'{score:.2f}' if score is not None else '–')}<span>%</span></div>
      <div class="score-label">{score_label}</div>
      <div class="meter" aria-hidden="true"><i style="width:{max(0, min(100, score or 0)):.2f}%"></i></div>
      {score2}
      <div class="chips">{''.join(chips)}</div>
      {f'<p class="int-note">{_esc(integrity_note)}</p>' if integrity_note else ''}
    </div>
  </div>
  <div class="wrap"><p class="verdict">{verdict}</p></div>
</header>
<nav class="toc" aria-label="Sections"><div class="wrap">
  <a href="#sim">Simulation</a><a href="#result">Result</a><a href="#partoff">Part-off</a><a href="#problems">Problems</a>
  <a href="#setups">Setups</a><a href="#history">History</a><a href="#metrics">Metrics</a><a href="#images">Images</a><a href="#gcode">G-code</a>
</div></nav>
<main class="wrap">
<section id="sim">
  <div class="sec-head"><h2>Cutting simulation</h2>
  <p class="sub"><b>Machine view</b> (default): the spindle stays vertical and the table moves the work. To reach each side of the part
  the cradle tilts (A axis) and the platter turns (C axis), carrying the vise, the stock and the part. Press play, or click a setup
  in the strip under the timeline. <b>Part view</b>: the part stays still and the tool comes in along each setup's axis. The material
  is the stock cut by every move, replayed in the browser with the simulator's kernel. Drag to orbit, right-drag or two fingers to pan,
  wheel or pinch to zoom (after a click).</p>{help_txt}</div>
  {sim_block}
</section>
<section id="result">
  <div class="sec-head"><h2>Final result</h2>
  <p class="sub">The target part coloured by how far the simulated part is from it, over the whole surface. Green is within ±{tol:g} mm;
  anything that is not green is a failure (orange to dark red: material left; blue: cut too deep). Purple marks the tab witness, the
  small areas where a part-off tab joins the part. Click a marker, a region in the Problems table or the surface itself to see why it failed.</p></div>
  {res_block}
</section>
<section id="partoff">
  <div class="sec-head"><h2>Holding and part-off</h2><p class="sub">The part is machined out of a block held by its bottom in one vise. It must stay connected to the gripped
  stub by at least {100 * RIGID_MIN:.0f}% of the stock section until the <code>(PART-OFF)</code> section{f' (line <button class="gl" data-gline="{rg["part_off_line"]}">{rg["part_off_line"]}</button>)' if rg.get('part_off_line') else ''},
  which must machine the underside and leave only small tabs that the operator can break by hand and file flush.</p></div>
  {_partoff_block(po, rg, m, po_img)}
  <h3 class="sub-h">Rigidity through the program</h3>
  <div class="two rig-two">
    <div class="card chart-card">{_rigidity_chart(rg)}</div>
    <div>{_conn_maps(cm, conn) or '<p class="muted">No connection-plane maps.</p>'}</div>
  </div>
</section>
<section id="problems">
  <div class="sec-head"><h2>Problems</h2><p class="sub">Click a line number to jump the G-code listing and the animation there; click a region to locate it in the result view.</p></div>
  <div class="stack">
    <div><h3>Out-of-tolerance regions <span class="count">{len(regs)}</span></h3>{_region_rows5(regs, segs)}</div>
    <div><h3>Safety, fixture &amp; plausibility issues <span class="count">{len(issues)}</span></h3>{_issue_rows5(issues)}</div>
  </div>
</section>
<section id="setups">
  <div class="sec-head"><h2>Setups</h2><p class="sub">Contiguous blocks of one tool orientation (G68.2 … G69), with the trunnion angles the table turns to. Click a setup to play from it; vise contact is highlighted.</p></div>
  {_setups_table(segs, conn, fixmoves)}
</section>
<section id="history">
  <div class="sec-head"><h2>Iteration history</h2><p class="sub">Score per simulated iteration and the agent's own notes on what it changed.</p></div>
  <div class="card chart-card">{_history_svg5(hist, final_iter)}</div>
  <div class="iters">{''.join(cards)}</div>
</section>
<section id="metrics">
  <div class="sec-head"><h2>Metrics &amp; tools</h2></div>
  <div class="two">
    <div><h3>Metrics</h3><div class="tablewrap"><table class="metrics"><tbody>{mrows}</tbody></table></div></div>
    <div><h3>Tools used</h3>{tools_tbl}
      <p class="muted small">Estimated cycle time <strong>{m.get('cycle_time_min', 0):.1f} min</strong> (feeds as programmed, rapids at {MACHINE.rapid_rate:g} mm/min, {INDEX_TIME_S:g} s per re-orientation).</p>
    </div>
  </div>
</section>
<section id="images">
  <div class="sec-head"><h2>Images</h2><p class="sub">2D plots written for the agent's brief and feedback (the same information as the 3D views above).</p></div>
  {f'<details class="imgs"><summary>Show simulator plots</summary><div class="gallery">{gal}</div></details>' if gal else '<p class="muted">No plots for this result.</p>'}
</section>
<section id="gcode">
  <div class="sec-head"><h2>G-code</h2><p class="sub">The full listing is in the simulation panel above (search and click to jump).</p></div>
  <div class="dl-row">
    {f'<a class="btn primary" href="{final_nc}" download="{_esc(name)}_final.nc">Download final program (.nc)</a><a class="btn" href="gcode/final.txt" target="_blank">Open as text</a>' if final_nc else ''}
    {''.join(f'<a class="btn ghost" href="iter/{h["iter"]:02d}/program.nc" download="{_esc(name)}_iter{h["iter"]:02d}.nc">Iteration {h["iter"]}</a>' for h in hist if (out / "iter" / f'{h["iter"]:02d}' / "program.nc").exists())}
  </div>
</section>
</main>
<footer class="foot"><div class="wrap">
  <span>Harness sha256 <code>{_esc(hv.get('sha256', meta.get('harness', {}).get('sha256', ''))[:16])}</code> · git <code>{_esc(hv.get('git_head', meta.get('harness', {}).get('git_head', '')))}</code>{' (re-score)' if rescored else ''}</span>
  <span>Part {_esc(meta.get('part_sha256', '')[:12])} · generated {dt.datetime.now().strftime('%Y-%m-%d %H:%M')}</span>
</div></footer>
<div id="toast" role="status" aria-live="polite"></div>
{'<script src="assets/data.js"></script>' if have_viewer else ''}
<script src="assets/viewer5.js"></script>
</body>
</html>
"""
    (out / "index.html").write_text(page)
    return out / "index.html"
