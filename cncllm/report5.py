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
    vdev, vcls = _vertex_deviation(part, np.asarray(res["dev"]), V, F, TF)
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
        "mesh": {"n_vertices": int(len(V)), "n_triangles": int(len(F))},
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
    ("machinable_in_tol_pct", "3+2-reachable surface in tolerance (score)", "%"),
    ("machinable_gouge_pct", "Reachable surface gouged (too deep)", "%"),
    ("machinable_proud_pct", "Reachable surface proud (material left)", "%"),
    ("all_in_tol_pct", "Whole surface in tolerance (excl. parting face)", "%"),
    ("unreachable_area_pct", "Not reachable in 3+2 (needs 5-axis / smaller tool)", "%"),
    ("unreachable_in_tol_pct", "… of which in tolerance anyway", "%"),
    ("parting_face_pct", "Parting face (hand-finished, not scored)", "%"),
    ("edge_band_excluded_pct", "Face-boundary band (excluded)", "%"),
    ("max_gouge_mm", "Max gouge depth (any surface)", "mm"),
    ("any_gouge_pct", "Any surface gouged", "%"),
    ("setups", "Setups (contiguous orientations)", ""),
    ("distinct_orientations", "Distinct tool orientations", ""),
    ("final_connection_mm2", "Connection left after the part-off", "mm²"),
    ("surface_area_mm2", "Surface area evaluated", "mm²"),
    ("probes", "Surface probe points", ""),
    ("cycle_time_min", "Estimated cycle time (incl. indexing)", "min"),
    ("errors", "Errors", ""),
    ("warnings", "Warnings", ""),
]


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
                f'<td class="lines" data-l="G-code">{("<span class=muted>nearest passes</span> " + lk) if lk else ""}</td></tr>')

    head = ('<thead><tr><th>Region</th><th>Type</th><th class="num">Area mm²</th><th class="num">Worst mm</th>'
            '<th>Faces</th><th>Where (bounding box, mm)</th><th>G-code lines</th></tr></thead>')
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
    """Connection area after each setup (bars) against the 50 % rigidity and 15 % part-off limits."""
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
        if i == 0 or last or abs(f - checks[i - 1]["fraction"]) > 1e-4 or bad:
            p.append(f'<text class="vlab" x="{x + bw / 2:.2f}%" y="{y(f) - 5:.1f}" text-anchor="middle">{100 * f:.0f}%</text>')
        p.append(f'<text class="tick" x="{x + bw / 2:.2f}%" y="{H - 10}" text-anchor="middle">{c["after_segment"]}</text>')
    p.append("</svg>")
    return (f'<div class="legend"><span class="lg"><i class="rig-ok"></i>before the part-off (must stay ≥ {100 * RIGID_MIN:.0f}%)</span>'
            f'<span class="lg"><i class="rig-po"></i>part-off section (must end ≤ {100 * PARTOFF_MAX:.0f}% and ≥ 2 mm²)</span>'
            f'<span class="lg"><i class="rig-bad"></i>violates a limit</span></div>'
            f'<div class="chart-box"><div class="ylab">{"".join(ylab)}</div>{"".join(p)}</div>'
            f'<p class="muted small chart-note">x: setup number; y: material in the connection plane (middle of the stub gap) as a share of the stock section '
            f'({rg.get("stock_section_mm2", 0):g} mm²). Dashed lines: {100 * RIGID_MIN:.0f}% rigidity minimum, {100 * PARTOFF_MAX:.0f}% part-off maximum.</p>')


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
    return (f'<div class="cmaps">{"".join(out)}</div><p class="muted small">Seen from above at Z {cm["z"]:g} mm (middle of the stub gap), '
            f'X {cm["x0"]:g}…{cm["x0"] + W:g} mm left to right, Y up. Filled = material still connecting the part to the gripped stub. '
            f'Only setups that changed the plane are shown.</p>')


def build(run_dir) -> Path:
    run = Path(run_dir)
    meta = _load(run / "run.json", {})
    hist = _load(run / "history.json", []) or []
    final = run / "final"
    ev = _load(final / "evaluation.json")
    out = run / "report"
    if out.exists():
        shutil.rmtree(out)
    for d in ("assets", "img", "gcode", "iter"):
        (out / d).mkdir(parents=True)
    part_dir = Path(meta.get("part_dir", ""))
    setup = _load(part_dir / "setup.json", {}) if meta.get("part_dir") else {}
    if ev and (final / "metrics.json").exists():
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

    # ---- assets
    shutil.copy(VIEWER / "dist" / "viewer5.js", out / "assets" / "viewer5.js")
    shutil.copy(VIEWER / "report.css", out / "assets" / "report.css")
    shutil.copy(VIEWER / "report5.css", out / "assets" / "report5.css")
    vd = final / "viewer_data"
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
                 "part": meta.get("part"), "tolerance": m.get("tolerance_mm", TOL_DEFAULT)}
        with open(out / "assets" / "data.js", "w") as fh:
            fh.write("window.CNCLLM_DATA={meta:")
            fh.write(json.dumps(vmeta | extra))
            fh.write(',blob:"')
            fh.write(b64)
            fh.write('"};\n')
    conn = rg.get("checks") or []
    # ---- images
    gallery = []
    if res_dir and (res_dir / "deviation_views.png").exists():
        shutil.copy(res_dir / "deviation_views.png", out / "img" / "deviation_views.png")
        gallery.append(("img/deviation_views.png", "Surface deviation, 4 views (grey = not reachable in 3+2)"))
    for f, t in (("reachability.png", "3+2 reachability of the target (from the brief)"), ("target_iso.png", "Target part in the vise (iso)")):
        if (run / "brief" / f).exists():
            shutil.copy(run / "brief" / f, out / "img" / f)
            gallery.append(("img/" + f, t))
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
        if (it / "feedback.md").exists():
            shutil.copy(it / "feedback.md", dst / "feedback.txt")
            links.append(f'<a href="iter/{n:02d}/feedback.txt" target="_blank">feedback</a>')
        thumb = ""
        if (it / "deviation_views.png").exists():
            shutil.copy(it / "deviation_views.png", dst / "deviation_views.png")
            links.append(f'<a href="iter/{n:02d}/deviation_views.png" target="_blank">deviation views</a>')
            thumb = (f'<a class="thumb" href="iter/{n:02d}/deviation_views.png" target="_blank">'
                     f'<img src="iter/{n:02d}/deviation_views.png" alt="Deviation views, iteration {n}" loading="lazy"></a>')
        notes = (it / "notes.md").read_text() if (it / "notes.md").exists() else ""
        hm = h["metrics"]
        prev = next((x for x in hist if x["iter"] == n - 1), None)
        delta = ""
        if prev:
            d = hm.get("machinable_in_tol_pct", 0) - prev["metrics"].get("machinable_in_tol_pct", 0)
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
      <div class="big">{hm.get('machinable_in_tol_pct', 0):.3f}%{delta}</div>
      <div class="muted small asof">score as simulated at the time</div>
      <dl>
        <dt>whole surface</dt><dd>{hm.get('all_in_tol_pct', 0):.2f}%</dd>
        <dt>gouge</dt><dd>{hm.get('machinable_gouge_pct', 0):.2f}%</dd>
        <dt>proud</dt><dd>{hm.get('machinable_proud_pct', 0):.2f}%</dd>
        <dt>setups</dt><dd>{hm.get('setups', '–')}</dd>
        <dt>errors</dt><dd>{hm.get('errors', 0)}</dd>
        <dt>cycle</dt><dd>{hm.get('cycle_time_min', 0):.1f} min</dd>
        <dt>lines / moves</dt><dd>{h.get('lines', '')} / {h.get('moves', '')}</dd>
      </dl>
      {thumb}
    </div>
    <div class="notes">{err_html}{md_to_html(notes) if notes.strip() else '<p class="muted">No notes from the LLM for this iteration.</p>'}</div>
  </div>
  <footer class="links">{''.join(links)}</footer>
</article>""")

    # ---- header facts and chips
    name = meta.get("part") or setup.get("name") or run.name
    tol = m.get("tolerance_mm", TOL_DEFAULT)
    model = meta.get("model") or "unknown"
    created = meta.get("created", "")
    try:
        created_h = dt.datetime.strptime(created, "%Y%m%d-%H%M%S").strftime("%Y-%m-%d %H:%M")
    except Exception:
        created_h = created
    st = setup.get("stock") or vmeta.get("stock") or {}
    stock_txt = (" × ".join(f"{st['hi'][i] - st['lo'][i]:g}" for i in range(3)) + " mm") if st.get("lo") else "?"
    fx = setup.get("fixture") or vmeta.get("fixture") or {}
    hold = f"5-axis vise · {fx.get('grip', '?'):g} mm grip · {fx.get('gap', '?'):g} mm stub gap" if fx else "5-axis vise"
    score = m.get("machinable_in_tol_pct")
    valid = bool(m.get("valid"))
    integ = (ev or {}).get("integrity", {})
    hv = integ.get("harness", {})
    chips, integrity_note = [], ""
    kinds = {}
    for i in issues:
        if i.get("severity") == "error":
            kinds.setdefault(i.get("kind"), []).append(i)
    po = kinds.get("part-off")
    chips.append(f'<span class="chip {"bad" if po else "good"}" title="{_esc(po[0]["msg"] if po else "part-off leaves tabs / a web of at most 15 % and at least 2 mm²")}">'
                 f'<b aria-hidden="true">{"✗" if po else "✓"}</b> Part-off {"problem" if po else "OK"}'
                 + (f' · {conn[-1]["area_mm2"]:g} mm² left' if conn else "") + '</span>')
    rig = kinds.get("rigidity")
    pre = [c["fraction"] for c in conn if not c.get("part_off")]
    chips.append(f'<span class="chip {"bad" if rig else "good"}" title="{_esc(rig[0]["msg"] if rig else "connection to the stub stays >= 50 % until the part-off")}">'
                 f'<b aria-hidden="true">{"✗" if rig else "✓"}</b> Rigidity {"too weak" if rig else "OK"}'
                 + (f' · min {100 * min(pre):.0f}%' if pre else "") + '</span>')
    fxi = kinds.get("fixture")
    chips.append(f'<span class="chip {"bad" if fxi else "good"}" title="{_esc(fxi[0]["msg"] if fxi else "no tool / holder contact with the vise or table")}">'
                 f'<b aria-hidden="true">{"✗" if fxi else "✓"}</b> Vise {"collision" if fxi else "clear"}'
                 + (f' · {fxi[0].get("count", 0)} moves' if fxi else "") + '</span>')
    if ev:
        ok = integ.get("harness_unchanged_since_run_start") and integ.get("part_unchanged") and not hv.get("harness_modified")
        tip = (f"harness sha256 {hv.get('sha256', '')[:12]}…, git {hv.get('git_head', '?')}, "
               f"uncommitted harness changes: {'yes' if hv.get('harness_modified') else 'no'}, "
               f"unchanged since run start: {'yes' if integ.get('harness_unchanged_since_run_start') else 'no'}, "
               f"part unchanged: {'yes' if integ.get('part_unchanged') else 'no'}")
        chips.append(f'<span class="chip {"good" if ok else "warn"}" title="{_esc(tip)}">'
                     f'<b aria-hidden="true">{"✓" if ok else "!"}</b> Harness {"verified" if ok else "changed since run start"}'
                     f' · git {_esc(hv.get("git_head", "?"))}</span>')
        if not ok:
            why = []
            if not integ.get("harness_unchanged_since_run_start"):
                why.append("the harness code changed between the start of the run and the final evaluation")
            if hv.get("harness_modified"):
                why.append("the evaluating checkout had uncommitted harness changes")
            if not integ.get("part_unchanged", True):
                why.append("the part file changed")
            integrity_note = ("Integrity note: " + "; ".join(why) + ". The final score was re-computed by the current "
                              "harness in a fresh process, so it is consistent; a change is expected while the harness is "
                              "being developed. Hashes are in the footer.")
        cc = ev.get("crosscheck_millbill", {})
        if "agreement_pct" in cc:
            good = cc["agreement_pct"] >= 99.99
            chips.append(f'<span class="chip {"good" if good else "bad"}" title="{cc.get("points", 0)} query points in {cc.get("frames", "?")} frames, '
                         f'{cc.get("disagree_beyond_2um", 0)} disagree beyond 2 µm"><b aria-hidden="true">{"✓" if good else "✗"}</b> '
                         f'MillBill cross-check {cc["agreement_pct"]:.3f}%</span>')
        elif "skipped" in cc:
            chips.append(f'<span class="chip neutral" title="{_esc(cc["skipped"])}">MillBill cross-check skipped</span>')
        elif "error" in cc:
            chips.append(f'<span class="chip bad" title="{_esc(cc["error"])}">MillBill cross-check failed</span>')
    else:
        chips.append('<span class="chip warn" title="run python -m cncllm.x5 evaluate RUN">Not yet evaluated (latest iteration shown)</span>')

    # ---- verdict
    vs = []
    if not m:
        verdict = "No simulation results yet."
    else:
        if valid:
            vs.append("The program is <strong>valid</strong>: no crash, no vise or table contact, the part stays rigid and the part-off leaves breakable tabs.")
        else:
            errs = [i for i in issues if i.get("severity") == "error"]
            first = errs[0] if errs else {}
            fl = (f', first at line <a href="#sim" class="gl" data-gline="{first.get("line")}">{first.get("line")}</a>' if first.get("line") else "")
            vs.append(f'The program is <strong>invalid</strong>: {m.get("errors", 0)} error(s){fl}: {_esc(first.get("msg", ""))}.')
        vs.append(f'{m.get("machinable_in_tol_pct", 0):.3f}% of the 3+2-reachable surface is within ±{tol:g} mm '
                  f'({m.get("machinable_gouge_pct", 0):.2f}% gouged, {m.get("machinable_proud_pct", 0):.2f}% proud); '
                  f'{m.get("all_in_tol_pct", 0):.2f}% of the whole surface. {m.get("unreachable_area_pct", 0):.1f}% of the surface needs simultaneous 5-axis or a smaller tool '
                  f'and {m.get("parting_face_pct", 0):.1f}% is the hand-finished parting face.')
        if segs:
            vs.append(f'{len(segs)} setup{"s" if len(segs) != 1 else ""} in {m.get("distinct_orientations", "?")} orientation{"s" if m.get("distinct_orientations") != 1 else ""}, '
                      f'about {m.get("cycle_time_min", 0):.1f} min.')
        g = [r for r in regs if r["type"] == "gouge"]
        p_ = [r for r in regs if r["type"] == "proud"]
        if g:
            vs.append(f'Largest gouge: <button class="region-btn inline" data-region="{g[0]["id"]}">R{g[0]["id"]}</button> {g[0]["area_mm2"]:g} mm² (worst {g[0]["dev_extreme"]:+.2f} mm).')
        if p_:
            vs.append(f'Largest proud area: <button class="region-btn inline" data-region="{p_[0]["id"]}">R{p_[0]["id"]}</button> {p_[0]["area_mm2"]:g} mm² (up to {p_[0]["dev_extreme"]:+.2f} mm).')
        verdict = " ".join(vs)

    mrows = "".join(f'<tr><th>{_esc(lbl)}</th><td class="num">{_fmt(m.get(k), 3 if k == "max_gouge_mm" else 2)}{(" " + u) if u and m.get(k) is not None else ""}</td></tr>'
                    for k, lbl, u in METRIC5 if k in m)
    trows = []
    for tn, d in (vmeta.get("per_tool") or {}).items():
        t = LIBRARY.get(int(tn))
        if not t:
            continue
        geo = {"flat": "flat", "ball": "ball", "bull": f"bull r{t.corner_radius:g}", "cone": f"cone {2 * t.half_angle:g}°"}[t.kind]
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
        <div><dt>Model / agent</dt><dd>{_esc(model)}</dd></div>
        <div><dt>Date</dt><dd>{_esc(created_h)}</dd></div>
        <div><dt>Iterations</dt><dd>{len(hist)}{f' · final = #{final_iter}' if final_iter else ''}</dd></div>
      </dl>
    </div>
    <div class="hero-score" aria-label="Final score">
      <div class="score-top">
        <span class="badge lg {'valid' if valid else 'invalid'}">{'VALID' if valid else 'INVALID'}</span>
        <span class="muted">{n_err} error{'s' if n_err != 1 else ''} · {n_warn} warning{'s' if n_warn != 1 else ''}</span>
      </div>
      <div class="score-num">{(f'{score:.3f}' if score is not None else '–')}<span>%</span></div>
      <div class="score-label">of the 3+2-reachable surface within ±{tol:g} mm{' · trusted final evaluation of iteration ' + str(final_iter) if is_final else ' (latest iteration, not evaluated)'}</div>
      <div class="meter" aria-hidden="true"><i style="width:{max(0, min(100, score or 0)):.2f}%"></i></div>
      <div class="score-2"><span>Whole surface <b>{m.get('all_in_tol_pct', 0):.2f}%</b></span><span>needs 5-axis <b>{m.get('unreachable_area_pct', 0):.1f}%</b></span><span>parting face <b>{m.get('parting_face_pct', 0):.1f}%</b></span></div>
      <div class="chips">{''.join(chips)}</div>
      {f'<p class="int-note">{_esc(integrity_note)}</p>' if integrity_note else ''}
    </div>
  </div>
  <div class="wrap"><p class="verdict">{verdict}</p></div>
</header>
<nav class="toc" aria-label="Sections"><div class="wrap">
  <a href="#sim">Simulation</a><a href="#setups">Setups</a><a href="#result">Result</a><a href="#rigidity">Rigidity &amp; part-off</a>
  <a href="#problems">Problems</a><a href="#history">History</a><a href="#metrics">Metrics</a><a href="#images">Images</a><a href="#gcode">G-code</a>
</div></nav>
<main class="wrap">
<section id="sim">
  <div class="sec-head"><h2>Cutting simulation</h2>
  <p class="sub">Replay of the evaluated program in the vise: the part stays put and the tool comes in along each setup's tool axis
  (it swings around the part while the table indexes). The material is the stock cut by every setup's swept volume, replayed in the
  browser with the simulator's kernel. Drag to orbit, right-drag / two fingers to pan, wheel / pinch to zoom.</p></div>
  {sim_block}
</section>
<section id="setups">
  <div class="sec-head"><h2>Setups</h2><p class="sub">Contiguous blocks of one tool orientation (G68.2 … G69). Click a setup to play from it; vise contact is highlighted.</p></div>
  {_setups_table(segs, conn, fixmoves)}
</section>
<section id="result">
  <div class="sec-head"><h2>Final result</h2>
  <p class="sub">Target part coloured by the signed deviation of the simulated part, or the machined part coloured by setup.
  Surface no 3+2 direction can reach and the hand-finished parting face are shown in their own colours and are not counted as LLM error.</p></div>
  {res_block}
</section>
<section id="rigidity">
  <div class="sec-head"><h2>Rigidity &amp; part-off</h2><p class="sub">The part must stay connected to the gripped stub by at least half of the stock section until the
  <code>(PART-OFF)</code> section{f' (line <button class="gl" data-gline="{rg["part_off_line"]}">{rg["part_off_line"]}</button>)' if rg.get('part_off_line') else ''}, which must leave thin tabs the operator can break.</p></div>
  <div class="two rig-two">
    <div class="card chart-card">{_rigidity_chart(rg)}</div>
    <div>{_conn_maps(cm, conn) or '<p class="muted">No connection-plane maps.</p>'}</div>
  </div>
</section>
<section id="problems">
  <div class="sec-head"><h2>Problems</h2><p class="sub">Click a line number to jump the G-code listing and the animation there; click a region to locate it in the result view.</p></div>
  <div class="stack">
    <div><h3>Safety, fixture &amp; plausibility issues <span class="count">{len(issues)}</span></h3>{_issue_rows5(issues)}</div>
    <div><h3>Out-of-tolerance regions <span class="count">{len(regs)}</span></h3>{_region_rows5(regs, segs)}</div>
  </div>
</section>
<section id="history">
  <div class="sec-head"><h2>Iteration history</h2><p class="sub">Score per simulated iteration and the LLM's own notes on what it changed.</p></div>
  <div class="card chart-card">{_history_svg(hist, final_iter)}</div>
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
  <div class="sec-head"><h2>Images</h2><p class="sub">2D plots written for the LLM's brief and feedback (the same information as the 3D views above).</p></div>
  <details class="imgs"><summary>Show simulator plots</summary><div class="gallery">{gal}</div></details>
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
  <span>Harness sha256 <code>{_esc(hv.get('sha256', meta.get('harness', {}).get('sha256', ''))[:16])}</code> · git <code>{_esc(hv.get('git_head', meta.get('harness', {}).get('git_head', '')))}</code></span>
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
