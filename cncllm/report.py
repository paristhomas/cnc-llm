"""Per-run web report: viewer data export (called by the trusted evaluation) and the static HTML report.

  export_data(part, res, final_dir)  -> final_dir/viewer_data/{meta.json, data.bin.gz}
  build(run_dir)                     -> run_dir/report/index.html (+ assets/, img/, gcode/)

The report is a static folder that works from file:// with no server and no network: the viewer bundle
(three.js + viewer code, built by cncllm/viewer/build.sh) and the data are loaded with classic <script> tags.
Binary viewer data is one gzip blob (base64 in assets/data.js), unpacked in the browser with DecompressionStream.
"""
from __future__ import annotations

import base64
import datetime as dt
import gzip
import html
import json
import math
import re
import shutil
from pathlib import Path

import numpy as np

from .tools import LIBRARY, MACHINE

VIEWER = Path(__file__).resolve().parent / "viewer"
MAX_CELLS = 350_000
MAX_TRIS = 200_000
MAX_SUBDIV_TRIS = 320_000
TOL_DEFAULT = 0.1


# ----------------------------------------------------------------------------------------------------------- export

def _downsample_grid(g: dict):
    k = max(1, int(math.ceil(math.sqrt(g["nx"] * g["ny"] / MAX_CELLS))))
    off = k // 2
    nx2 = (g["nx"] - off - 1) // k + 1
    ny2 = (g["ny"] - off - 1) // k + 1
    res2 = g["res"] * k
    # cell j' of the coarse grid is centred exactly on fine cell off + k j'
    x0 = g["x0"] + (off + 0.5) * g["res"] - 0.5 * res2
    y0 = g["y0"] + (off + 0.5) * g["res"] - 0.5 * res2
    jj = off + k * np.arange(nx2)
    ii = off + k * np.arange(ny2)
    return k, ii, jj, {"x0": float(x0), "y0": float(y0), "res": float(res2), "nx": int(nx2), "ny": int(ny2)}


def _decimate(V, F, TF, max_tris):
    """Vertex clustering per B-rep face (keeps face borders separate); good enough for display."""
    if len(F) <= max_tris:
        return V, F, TF
    lo, hi = V.min(0), V.max(0)
    cell = float(np.prod(hi - lo) / max_tris * 2.0) ** (1 / 3) * 0.6
    for _ in range(8):
        key = np.floor((V - lo) / cell).astype(np.int64)
        # cluster id per (face of first use, cell)
        vface = np.zeros(len(V), np.int64)
        vface[F.ravel()] = np.repeat(TF, 3)
        k = (vface * 1_000_003 + key[:, 0]) * 1_000_003 ** 1 + key[:, 1] * 7919 + key[:, 2]
        uk, inv = np.unique(k, return_inverse=True)
        cnt = np.bincount(inv)
        V2 = np.zeros((len(uk), 3))
        for d in range(3):
            V2[:, d] = np.bincount(inv, V[:, d]) / cnt
        F2 = inv[F]
        ok = (F2[:, 0] != F2[:, 1]) & (F2[:, 1] != F2[:, 2]) & (F2[:, 0] != F2[:, 2])
        if ok.sum() <= max_tris:
            return V2, F2[ok], TF[ok]
        cell *= 1.4
    return V2, F2[ok], TF[ok]


def _feature_edges(V, F, angle_deg=28.0):
    """Line segments of sharp edges (dihedral angle > angle_deg) and open boundaries, for the target overlay."""
    q = np.round(V / 1e-4).astype(np.int64)
    _, first, inv = np.unique(q, axis=0, return_index=True, return_inverse=True)
    Vw, Fw = V[first], inv.ravel()[F]
    n = np.cross(Vw[Fw[:, 1]] - Vw[Fw[:, 0]], Vw[Fw[:, 2]] - Vw[Fw[:, 0]])
    n /= np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-12)
    e = np.concatenate([Fw[:, [0, 1]], Fw[:, [1, 2]], Fw[:, [2, 0]]])
    fi = np.tile(np.arange(len(Fw)), 3)
    e.sort(axis=1)
    key = e[:, 0] * (len(Vw) + 1) + e[:, 1]
    order = np.argsort(key, kind="stable")
    key, e, fi = key[order], e[order], fi[order]
    start = np.r_[True, key[1:] != key[:-1]]
    gid = np.cumsum(start) - 1
    cnt = np.bincount(gid)
    firstf = fi[start]
    out = []
    # edges with exactly two faces: dihedral test; others (boundary / non-manifold): keep
    idx = np.where(start)[0]
    two = cnt == 2
    a = firstf[two]
    b = fi[idx[two] + 1]
    cosang = (n[a] * n[b]).sum(1)
    sharp = cosang < np.cos(np.radians(angle_deg))
    keep = np.zeros(len(cnt), bool)
    keep[np.where(two)[0][sharp]] = True
    keep[cnt != 2] = True
    ed = e[idx[keep]]
    return np.stack([Vw[ed[:, 0]], Vw[ed[:, 1]]], 1).reshape(-1, 3)


def _subdivide(V, F, TF, budget=MAX_SUBDIV_TRIS, min_edge=0.3):
    """Split long CAD triangles into a barycentric grid so per-vertex deviation colours stay local (CAD tessellations
    have long slivers; interpolating colours along them smears a gouge across a whole face). Vertices are welded
    per B-rep face, so smooth shading within a face is kept."""
    a, b, c = V[F[:, 0]], V[F[:, 1]], V[F[:, 2]]
    Lmax = np.maximum.reduce([np.linalg.norm(a - b, axis=1), np.linalg.norm(b - c, axis=1), np.linalg.norm(c - a, axis=1)])

    def counts(L):
        return np.clip(np.ceil(Lmax / L), 1, 48).astype(np.int64)

    lo, hi = min_edge, max(float(Lmax.max()), min_edge)
    if (counts(lo) ** 2).sum() > budget:
        for _ in range(30):
            mid = (lo + hi) / 2
            if (counts(mid) ** 2).sum() > budget:
                lo = mid
            else:
                hi = mid
        L = hi
    else:
        L = lo
    nsub = counts(L)
    if nsub.max() <= 1:
        return V, F, TF
    Vs, Fs, TFs = [], [], []
    off = 0
    for n in np.unique(nsub):
        k = np.where(nsub == n)[0]
        ii, jj = np.meshgrid(np.arange(n + 1), np.arange(n + 1), indexing="ij")
        m = ii + jj <= n
        ii, jj = ii[m], jj[m]
        vid = -np.ones((n + 1, n + 1), np.int64)
        vid[ii, jj] = np.arange(len(ii))
        tri = []
        for i in range(n):
            for j in range(n - i):
                tri.append((vid[i, j], vid[i + 1, j], vid[i, j + 1]))
                if i + j < n - 1:
                    tri.append((vid[i + 1, j], vid[i + 1, j + 1], vid[i, j + 1]))
        tri = np.array(tri, np.int64)
        wa, wb = ii / n, jj / n
        P = (a[k, None, :] + (b[k] - a[k])[:, None, :] * wa[None, :, None] + (c[k] - a[k])[:, None, :] * wb[None, :, None])
        nv = len(ii)
        Vs.append(P.reshape(-1, 3))
        Fs.append((tri[None, :, :] + (np.arange(len(k)) * nv)[:, None, None] + off).reshape(-1, 3))
        TFs.append(np.repeat(TF[k], len(tri)))
        off += len(k) * nv
    V2, F2, TF2 = np.concatenate(Vs), np.concatenate(Fs), np.concatenate(TFs)
    # weld per face
    vf = np.zeros(len(V2), np.int64)
    vf[F2.ravel()] = np.repeat(TF2, 3)
    q = np.round(V2 / 1e-4).astype(np.int64)
    key = np.c_[vf, q]
    _, first, inv = np.unique(key, axis=0, return_index=True, return_inverse=True)
    return V2[first], inv.ravel()[F2], TF2


def _vertex_deviation(part, dev, V, F, TF, pclass=None):
    """Deviation and class per mesh vertex from the nearest probe point on the same B-rep face (class from `pclass`,
    default part.pclass)."""
    from scipy.spatial import cKDTree

    nv = len(V)
    vface = np.full(nv, -1, np.int64)
    vface[F.ravel()] = np.repeat(TF, 3)
    vdev = np.zeros(nv)
    vcls = np.zeros(nv, np.int8)
    P, pf = part.P, part.pface
    pclass = part.pclass if pclass is None else np.asarray(pclass)
    # probes in the edge band (within 0.03 mm of a face boundary) are excluded from the score: colour the faces
    # from their interior probes (fall back to all probes of a face that has no interior ones)
    edge = getattr(part, "pedge", None)
    edge = np.zeros(len(P), bool) if edge is None else np.asarray(edge, bool)
    done = np.zeros(nv, bool)
    order = np.argsort(pf, kind="stable")
    pfs = pf[order]
    faces = np.unique(vface[vface >= 0])
    starts = np.searchsorted(pfs, faces, "left")
    ends = np.searchsorted(pfs, faces, "right")
    for f, s, e in zip(faces, starts, ends):
        if e - s < 1:
            continue
        idx = order[s:e]
        inner = idx[~edge[idx]]
        if len(inner) >= 3:
            idx = inner
        vi = np.where(vface == f)[0]
        tree = cKDTree(P[idx])
        k = min(3, len(idx))
        d, nn = tree.query(V[vi], k=k)
        if k == 1:
            nn = nn[:, None]
            d = d[:, None]
        w = 1.0 / np.maximum(d, 1e-4)
        pi = idx[nn]
        vdev[vi] = (dev[pi] * w).sum(1) / w.sum(1)
        vcls[vi] = pclass[pi[:, 0]]
        done[vi] = True
    rest = np.where(~done)[0]
    if len(rest):
        tree = cKDTree(P)
        _, nn = tree.query(V[rest])
        vdev[rest] = dev[nn]
        vcls[rest] = pclass[nn]
    return vdev, vcls


def export_data(part, res: dict, final_dir) -> Path:
    """Write compact viewer data for the report into final_dir/viewer_data/."""
    out = Path(final_dir) / "viewer_data"
    out.mkdir(parents=True, exist_ok=True)
    M = np.asarray(res["moves"], np.float64).reshape(-1, 12)
    n = len(M)
    arrays: dict[str, np.ndarray] = {}
    # ---- moves: end points, first start, discontinuities
    arrays["mv_end"] = M[:, 3:6].astype(np.float32).ravel()
    start0 = M[0, 0:3].tolist() if n else list(MACHINE.home)
    breaks = []
    if n > 1:
        gap = np.abs(M[1:, 0:3] - M[:-1, 3:6]).max(1) > 1e-6
        for i in np.where(gap)[0][:100000]:
            breaks.append([int(i + 1)] + [round(float(v), 5) for v in M[i + 1, 0:3]])
    arrays["mv_line"] = M[:, 10].astype(np.uint32)
    arrays["mv_feed"] = M[:, 8].astype(np.float32)
    flags = res.get("flags")
    fl = np.zeros(n, np.uint8)
    if flags is not None and len(flags) == n:
        fl = (np.asarray(flags) & 0xFF).astype(np.uint8)
    arrays["mv_crash"] = fl
    tool = M[:, 6].astype(np.int64)
    arrays["mv_tool"] = (tool & 31).astype(np.uint8) | ((M[:, 7] > 0.5).astype(np.uint8) << 5) | \
                        ((M[:, 11] > 0.5).astype(np.uint8) << 6)
    rpm_changes = []
    if n:
        rpm = M[:, 9]
        ch = np.r_[0, np.where(np.diff(rpm) != 0)[0] + 1]
        rpm_changes = [[int(i), float(rpm[i])] for i in ch[:200000]]
    # ---- height fields
    g = res["grid"]
    k, ii, jj, g2 = _downsample_grid(g)
    H = np.asarray(res["H"])[np.ix_(ii, jj)]
    Ht = np.asarray(res["Ht"])[np.ix_(ii, jj)]
    arrays["H"] = H.astype(np.float32).ravel()
    arrays["Ht"] = np.where(np.isfinite(Ht), Ht, 0).astype(np.float32).ravel()
    # ---- target mesh + per-vertex deviation
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
    text = res["program"].text if hasattr(res["program"], "text") else None
    if text is None:
        src = Path(final_dir) / "program.nc"
        text = src.read_text() if src.exists() else ""
    arrays["gcode"] = np.frombuffer(text.encode("utf-8"), np.uint8)
    # ---- pack
    layout, chunks, off = {}, [], 0
    for name, a in arrays.items():
        b = np.ascontiguousarray(a).tobytes()
        layout[name] = {"off": off, "len": int(a.size), "type": a.dtype.name}
        chunks.append(b)
        off += len(b)
        pad = (-off) % 8
        if pad:
            chunks.append(b"\0" * pad)
            off += pad
    blob = gzip.compress(b"".join(chunks), compresslevel=6, mtime=0)
    tools = {}
    for t in LIBRARY.values():
        r = t.row()
        tools[t.number] = {"number": t.number, "name": t.name, "kind": t.kind, "diameter": t.diameter,
                           "corner_radius": t.corner_radius, "half_angle": t.half_angle,
                           "tip_diameter": t.tip_diameter, "flute_length": t.flute_length, "stickout": t.stickout,
                           "shank_diameter": t.shank_diameter, "holder_diameter": t.holder_diameter, "flutes": t.flutes,
                           "row": r}
    stats = res.get("stats", {})
    meta = {
        "version": 1, "n_moves": n, "start0": start0, "breaks": breaks, "rpm_changes": rpm_changes,
        "grid": g2, "grid_full": {k2: (float(v) if isinstance(v, float) else int(v)) for k2, v in g.items()},
        "downsample": k, "stock": {"lo": [float(v) for v in part.stock_lo], "hi": [float(v) for v in part.stock_hi]},
        "tools": tools, "rapid_rate": MACHINE.rapid_rate, "home": list(MACHINE.home),
        "tolerance": TOL_DEFAULT, "n_lines": text.count("\n") + 1,
        "mesh": {"n_vertices": int(len(V)), "n_triangles": int(len(F))},
        "per_tool": {str(k2): v for k2, v in stats.get("per_tool", {}).items()},
        "arrays": layout, "gzip": True, "blob_bytes": len(blob),
    }
    (out / "meta.json").write_text(json.dumps(meta))
    (out / "data.bin.gz").write_bytes(blob)
    return out


# ------------------------------------------------------------------------------------------------------------ build

def _esc(s) -> str:
    return html.escape(str(s), quote=True)


def _inline_md(s: str) -> str:
    s = _esc(s)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?!\w)", r"<em>\1</em>", s)
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r'<a href="\2" rel="noopener">\1</a>', s)
    # G-code line references become jump links
    s = re.sub(r"\b(lines?) (\d+(?:, \d+)*)", lambda m: m.group(1) + " " + ", ".join(
        f'<a href="#sim" class="gl" data-gline="{x}">{x}</a>' for x in m.group(2).split(", ")), s)
    return s


def md_to_html(md: str) -> str:
    """Small markdown subset: headings, paragraphs, lists, tables, code blocks, bold/italic/code."""
    out, para, lst, tbl = [], [], None, []
    lines = md.replace("\r", "").split("\n")

    def flush_para():
        if para:
            out.append("<p>" + _inline_md(" ".join(para)) + "</p>")
            para.clear()

    def flush_list():
        nonlocal lst
        if lst:
            tag, items = lst
            out.append(f"<{tag}>" + "".join(f"<li>{_inline_md(i)}</li>" for i in items) + f"</{tag}>")
            lst = None

    def flush_table():
        if tbl:
            rows = [r for r in tbl if not re.match(r"^\s*\|?\s*:?-{2,}", r)]
            cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
            h = "<thead><tr>" + "".join(f"<th>{_inline_md(c)}</th>" for c in cells[0]) + "</tr></thead>"
            b = "".join("<tr>" + "".join(f"<td>{_inline_md(c)}</td>" for c in r) + "</tr>" for r in cells[1:])
            out.append(f'<div class="tablewrap"><table>{h}<tbody>{b}</tbody></table></div>')
            tbl.clear()

    i = 0
    while i < len(lines):
        ln = lines[i]
        if ln.strip().startswith("```"):
            flush_para(); flush_list(); flush_table()
            j = i + 1
            code = []
            while j < len(lines) and not lines[j].strip().startswith("```"):
                code.append(lines[j]); j += 1
            out.append("<pre><code>" + _esc("\n".join(code)) + "</code></pre>")
            i = j + 1
            continue
        if ln.strip().startswith("|"):
            flush_para(); flush_list()
            tbl.append(ln)
            i += 1
            continue
        flush_table()
        m = re.match(r"^(#{1,6})\s+(.*)", ln)
        if m:
            flush_para(); flush_list()
            lvl = min(len(m.group(1)) + 2, 6)
            out.append(f"<h{lvl}>{_inline_md(m.group(2))}</h{lvl}>")
        elif re.match(r"^\s*[-*+]\s+", ln):
            flush_para()
            if not lst or lst[0] != "ul":
                flush_list(); lst = ("ul", [])
            lst[1].append(re.sub(r"^\s*[-*+]\s+", "", ln))
        elif re.match(r"^\s*\d+[.)]\s+", ln):
            flush_para()
            if not lst or lst[0] != "ol":
                flush_list(); lst = ("ol", [])
            lst[1].append(re.sub(r"^\s*\d+[.)]\s+", "", ln))
        elif not ln.strip():
            flush_para(); flush_list()
        else:
            if lst and ln.startswith("  "):
                lst[1][-1] += " " + ln.strip()
            else:
                flush_list()
                para.append(ln.strip())
        i += 1
    flush_para(); flush_list(); flush_table()
    return "\n".join(out)


def _load(p: Path, default=None):
    try:
        return json.loads(p.read_text())
    except Exception:
        return default


def _fmt(v, nd=2):
    if isinstance(v, bool):
        return "yes" if v else "no"
    if isinstance(v, float):
        return f"{v:.{nd}f}"
    return str(v)


def _line_chart(hist, series, lo, hi, ticks, label, H=220, final_iter=None, direct_key=None, fmt="{:.2f}%"):
    """Line chart, x positions in % and y in px (no viewBox), so text keeps its real size at any width."""
    T, B = 20, 28
    n = len(hist)
    xs = [(8 + 84 * i / (n - 1)) if n > 1 else 50.0 for i in range(n)]

    def y(v):
        return T + (H - T - B) * (1 - (min(max(float(v), lo), hi) - lo) / max(hi - lo, 1e-9))

    p = [f'<svg class="chart" width="100%" height="{H}" role="img" aria-label="{_esc(label)}">']
    ylab = []
    for g in ticks:
        p.append(f'<line class="grid" x1="0" x2="100%" y1="{y(g):.1f}" y2="{y(g):.1f}"/>')
        ylab.append(f'<span style="top:{y(g) - 8:.1f}px">{fmt.format(g)}</span>')
    for i, h in enumerate(hist):
        p.append(f'<text class="tick" x="{xs[i]:.2f}%" y="{H - 8}" text-anchor="middle">#{h.get("iter")}</text>')
        if h.get("iter") == final_iter:
            p.append(f'<line class="final" x1="{xs[i]:.2f}%" x2="{xs[i]:.2f}%" y1="{T - 8}" y2="{H - B}"/>')
    for name, key, col in series:
        pts = [(xs[i], y(h.get("metrics", {}).get(key, 0))) for i, h in enumerate(hist)]
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            p.append(f'<line x1="{x0:.2f}%" y1="{y0:.1f}" x2="{x1:.2f}%" y2="{y1:.1f}" stroke="{col}" stroke-width="2" stroke-linecap="round"/>')
        for i, (a, b) in enumerate(pts):
            v = float(hist[i].get("metrics", {}).get(key, 0))
            p.append(f'<g class="pt"><circle cx="{a:.2f}%" cy="{b:.1f}" r="11" fill="transparent"/>'
                     f'<circle cx="{a:.2f}%" cy="{b:.1f}" r="4.5" fill="{col}" stroke="var(--surface)" stroke-width="2"/>'
                     f'<title>Iteration {hist[i].get("iter")}: {name} {v:.3f}</title></g>')
            if key == direct_key and n <= 12:
                p.append(f'<text class="vlab" x="{a:.2f}%" y="{b - 10:.1f}" text-anchor="middle">{v:.2f}</text>')
    p.append("</svg>")
    return f'<div class="chart-box"><div class="ylab">{"".join(ylab)}</div>{"".join(p)}</div>'


def _history_svg(hist: list, final_iter) -> str:
    """Score per iteration on an auto-scaled axis, plus a second small chart of gouge / proud %."""
    if not hist:
        return '<p class="muted">No iterations.</p>'
    import math as _m
    sc = [float(h.get("metrics", {}).get("machinable_in_tol_pct", 0)) for h in hist]
    span = 100 - min(sc)
    step = next(s for s in (0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 25) if span / s <= 5) if span > 0 else 0.1
    lo = max(0.0, _m.floor((min(sc) - step * 0.5) / step) * step)
    ticks = [lo + k * step for k in range(int(round((100 - lo) / step)) + 1)]
    nd = 2 if step < 0.5 else 1 if step < 1 else 0
    gp = [max(float(h.get("metrics", {}).get(k, 0)) for k in ("machinable_gouge_pct", "machinable_proud_pct")) for h in hist]
    gmax = max(gp + [0.0])
    gstep = next(s for s in (0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 25) if max(gmax, 0.1) / s <= 4)
    gt = [k * gstep for k in range(int(_m.ceil(max(gmax, 0.1) / gstep)) + 1)]
    a = _line_chart(hist, [("Score (in tolerance)", "machinable_in_tol_pct", "var(--ink)")], lo, 100, ticks,
                    "Score per iteration", 220, final_iter, "machinable_in_tol_pct", "{:.%df}%%" % nd)
    b = _line_chart(hist, [("Gouge", "machinable_gouge_pct", "var(--s-gouge)"), ("Proud", "machinable_proud_pct", "var(--s-proud)")],
                    0, gt[-1], gt, "Gouged and proud surface per iteration", 150, final_iter, None,
                    "{:.%df}%%" % (2 if gstep < 0.5 else 1 if gstep < 1 else 0))
    note = (f'<p class="muted small chart-note">Score axis zoomed to {ticks[0]:.{nd}f}–100 %. Values as simulated at the time of each '
            f'iteration; the header shows the trusted final re-evaluation.</p>')
    return (f'<div class="legend"><span class="lg"><i style="background:var(--ink)"></i>Score: machinable surface in tolerance</span>'
            f'<span class="lg"><i class="dash"></i>evaluated iteration</span></div>{a}'
            f'<div class="legend" style="margin-top:10px"><span class="lg"><i style="background:var(--s-gouge)"></i>Gouge %</span>'
            f'<span class="lg"><i style="background:var(--s-proud)"></i>Proud %</span></div>{b}{note}')


def _issue_rows(issues: list) -> str:
    if not issues:
        return '<p class="ok-note">No safety or plausibility issues.</p>'
    rows = []
    sev_order = {"error": 0, "warning": 1}
    for i in sorted(issues, key=lambda x: (sev_order.get(x.get("severity"), 2), x.get("line") or 0)):
        lines = i.get("lines") or ([i["line"]] if i.get("line") else [])
        lk = " ".join(f'<button class="gl" data-gline="{l}" title="Show line {l} in the G-code and animation">{l}</button>'
                      for l in lines[:12])
        if len(lines) > 12:
            lk += f' <span class="muted">+{len(lines) - 12} more</span>'
        cnt = f'<span class="muted"> &times;{i["count"]}</span>' if i.get("count") else ""
        sev = i.get("severity", "info")
        rows.append(f'<li class="issue {sev}"><span class="sev {sev}">{_esc(sev)}</span>'
                    f'<div class="ibody"><div class="imsg">{_esc(i.get("msg", ""))}{cnt} '
                    f'<span class="kind">{_esc(i.get("kind", ""))}</span></div>'
                    f'<div class="ilines">{"line" + ("s" if len(lines) > 1 else "") + " " + lk if lk else ""}</div></div></li>')
    return '<ul class="issues">' + "".join(rows) + "</ul>"


def _region_rows(regs: list) -> str:
    if not regs:
        return '<p class="ok-note">No out-of-tolerance regions.</p>'

    def row(r):
        lines = r.get("gcode_lines") or r.get("last_cut_by_lines") or []
        lk = " ".join(f'<button class="gl" data-gline="{l}">{l}</button>' for l in lines[:6])
        bb = r.get("bbox") or [0] * 6
        where = (f"X {bb[0]:.1f}…{bb[3]:.1f} · Y {bb[1]:.1f}…{bb[4]:.1f} · Z {bb[2]:.1f}…{bb[5]:.1f}")
        lbl = "cut by" if r.get("type") == "gouge" else "last cut by"
        return (f'<tr><td data-l="Region"><button class="region-btn" data-region="{r.get("id")}" title="Show in the 3D result view">'
                f'R{r.get("id")}</button></td>'
                f'<td data-l="Type"><span class="pill {_esc(r.get("type", ""))}">{_esc(r.get("type", ""))}</span></td>'
                f'<td class="num" data-l="Area mm²">{r.get("area_mm2", 0):g}</td>'
                f'<td class="num" data-l="Worst mm">{r.get("dev_extreme", 0):+.3f}</td>'
                f'<td data-l="Surface">{_esc(r.get("surface", ""))}</td><td class="where" data-l="Where">{where}</td>'
                f'<td class="lines" data-l="G-code">{(f"<span class=muted>{lbl}</span> " + lk) if lk else _esc(r.get("note", ""))}</td></tr>')

    head = ('<thead><tr><th>Region</th><th>Type</th><th class="num">Area mm²</th><th class="num">Worst mm</th>'
            '<th>Surface</th><th>Where (bounding box, mm)</th><th>G-code lines</th></tr></thead>')
    first = "".join(row(r) for r in regs[:10])
    out = f'<div class="tablewrap"><table class="regions">{head}<tbody>{first}</tbody></table></div>'
    if len(regs) > 10:
        rest = "".join(row(r) for r in regs[10:])
        out += (f'<details class="more"><summary>Show {len(regs) - 10} smaller regions</summary>'
                f'<div class="tablewrap"><table class="regions">{head}<tbody>{rest}</tbody></table></div></details>')
    return out


METRIC_LABELS = [
    ("machinable_in_tol_pct", "Machinable surface in tolerance", "%"),
    ("machinable_gouge_pct", "Machinable surface gouged (too deep)", "%"),
    ("machinable_proud_pct", "Machinable surface proud (material left)", "%"),
    ("all_in_tol_pct", "All non-datum surface in tolerance", "%"),
    ("max_gouge_mm", "Max gouge depth", "mm"),
    ("any_gouge_pct", "Any surface gouged (incl. tool-limited)", "%"),
    ("edge_band_excluded_pct", "Face-boundary band (0.03 mm, excluded)", "%"),
    ("undercut_area_pct", "Undercut area (not reachable from +Z, excluded)", "%"),
    ("tool_limited_area_pct", "Tool-limited area (needs a smaller tool, excluded)", "%"),
    ("remaining_excess_cm3", "Excess material left (raw height field)", "cm³"),
    ("gouged_cm3", "Gouged volume (raw height field, incl. excluded areas)", "cm³"),
    ("removed_cm3", "Material removed", "cm³"),
    ("surface_area_mm2", "Surface area evaluated", "mm²"),
    ("probes", "Surface probe points", ""),
    ("cycle_time_min", "Estimated cycle time", "min"),
    ("errors", "Errors", ""),
    ("warnings", "Warnings", ""),
]


def _verdict(m: dict, regs: list, issues: list) -> str:
    s = []
    valid = m.get("valid")
    if valid:
        s.append("The program is <strong>valid</strong> (no crash, collision or overload detected).")
    else:
        errs = [i for i in issues if i.get("severity") == "error"]
        first = errs[0] if errs else {}
        s.append(f'The program is <strong>invalid</strong>: {m.get("errors", 0)} error(s)'
                 + (f', first at line <a href="#sim" class="gl" data-gline="{first.get("line")}">{first.get("line")}</a>: '
                    f'{_esc(first.get("msg", ""))}' if first else "") + ".")
    s.append(f'{m.get("machinable_in_tol_pct", 0):.3f}% of the machinable surface is within ±{m.get("tolerance_mm", 0.1)} mm; '
             f'{m.get("machinable_gouge_pct", 0):.2f}% is gouged (max {m.get("max_gouge_mm", 0):.3f} mm deep) and '
             f'{m.get("machinable_proud_pct", 0):.2f}% is proud.')
    g = [r for r in regs if r["type"] == "gouge"]
    p = [r for r in regs if r["type"] == "proud"]
    if g:
        r = g[0]
        s.append(f'Largest gouge: <button class="region-btn inline" data-region="{r["id"]}">R{r["id"]}</button> '
                 f'{r["area_mm2"]:g} mm² on a {_esc(r["surface"])} (worst {r["dev_extreme"]:+.2f} mm).')
    if p:
        r = p[0]
        s.append(f'Largest proud area: <button class="region-btn inline" data-region="{r["id"]}">R{r["id"]}</button> '
                 f'{r["area_mm2"]:g} mm² on a {_esc(r["surface"])} (up to {r["dev_extreme"]:+.2f} mm).')
    return " ".join(s)


def build(run_dir) -> Path:
    run = Path(run_dir)
    meta = _load(run / "run.json", {})
    hist = _load(run / "history.json", []) or []
    final = run / "final"
    ev = _load(final / "evaluation.json")
    out = run / "report"
    if out.exists():
        shutil.rmtree(out)
    (out / "assets").mkdir(parents=True)
    (out / "img").mkdir()
    (out / "gcode").mkdir()
    (out / "iter").mkdir()
    part_dir = Path(meta.get("part_dir", ""))
    stock = _load(part_dir / "stock.json", {}) if part_dir else {}

    # which folder is "the result": the trusted final evaluation if present, else the latest iteration
    if ev and (final / "metrics.json").exists():
        res_dir, m, final_iter, is_final = final, ev["metrics"], ev.get("iteration"), True
    elif hist:
        last = hist[-1]["iter"]
        res_dir, m, final_iter, is_final = run / f"iter_{last:02d}", hist[-1]["metrics"], last, False
    else:
        res_dir, m, final_iter, is_final = None, {}, None, False
    issues = _load(res_dir / "issues.json", []) if res_dir else []
    regs = _load(res_dir / "regions.json", []) if res_dir else []

    # ---- assets
    bundle = VIEWER / "dist" / "viewer.js"
    shutil.copy(bundle, out / "assets" / "viewer.js")
    shutil.copy(VIEWER / "report.css", out / "assets" / "report.css")
    vd = final / "viewer_data"
    have_viewer = (vd / "meta.json").exists() and (vd / "data.bin.gz").exists()
    if have_viewer:
        vmeta = json.loads((vd / "meta.json").read_text())
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
    imgs = ["deviation_top.png", "height_error_top.png", "machined_top.png", "section_x.png", "section_y.png"]
    img_titles = {"deviation_top.png": "Surface deviation (top view)", "height_error_top.png": "Height error (top view)",
                  "machined_top.png": "Machined height map", "section_x.png": "Section along X",
                  "section_y.png": "Section along Y", "target_top.png": "Target part (top)", "target_iso.png": "Target part (iso)"}
    gallery = []
    if res_dir:
        for f in imgs:
            if (res_dir / f).exists():
                shutil.copy(res_dir / f, out / "img" / f)
                gallery.append(("img/" + f, img_titles[f]))
    for f in ("target_iso.png", "target_top.png"):
        if (run / "brief" / f).exists():
            shutil.copy(run / "brief" / f, out / "img" / f)
            gallery.append(("img/" + f, img_titles[f]))
    final_nc = None
    if res_dir and (res_dir / "program.nc").exists():
        final_nc = "gcode/final.nc"
        shutil.copy(res_dir / "program.nc", out / final_nc)
        shutil.copy(res_dir / "program.nc", out / "gcode" / "final.txt")
    # per-iteration files
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
            shutil.copy(it / "feedback.md", dst / "feedback.md")
            shutil.copy(it / "feedback.md", dst / "feedback.txt")
            links.append(f'<a href="iter/{n:02d}/feedback.txt" target="_blank">feedback</a>')
        for f in imgs:
            if (it / f).exists():
                shutil.copy(it / f, dst / f)
        if (dst / "deviation_top.png").exists():
            links.append(f'<a href="iter/{n:02d}/deviation_top.png" target="_blank">deviation map</a>')
        if (dst / "height_error_top.png").exists():
            links.append(f'<a href="iter/{n:02d}/height_error_top.png" target="_blank">height error</a>')
        notes = (it / "notes.md").read_text() if (it / "notes.md").exists() else ""
        hm = h["metrics"]
        thumb = (f'<a class="thumb" href="iter/{n:02d}/deviation_top.png" target="_blank">'
                 f'<img src="iter/{n:02d}/deviation_top.png" alt="Deviation map, iteration {n}"></a>'
                 if (dst / "deviation_top.png").exists() else "")
        prev = next((x for x in hist if x["iter"] == n - 1), None)
        delta = ""
        if prev:
            d = hm.get("machinable_in_tol_pct", 0) - prev["metrics"].get("machinable_in_tol_pct", 0)
            delta = f'<span class="delta {"up" if d >= 0 else "down"}">{"+" if d >= 0 else ""}{d:.2f} pts</span>'
        badge = '<span class="badge sm valid">valid</span>' if hm.get("valid") else \
            f'<span class="badge sm invalid">invalid · {hm.get("errors", 0)} err</span>'
        fin = '<span class="badge sm final">evaluated</span>' if n == final_iter and is_final else ""
        it_issues = _load(it / "issues.json", []) or []
        it_errs = [i for i in it_issues if i.get("severity") == "error"]
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
        <dt>gouge</dt><dd>{hm.get('machinable_gouge_pct', 0):.2f}%</dd>
        <dt>proud</dt><dd>{hm.get('machinable_proud_pct', 0):.2f}%</dd>
        <dt>max gouge</dt><dd>{hm.get('max_gouge_mm', 0):.3f} mm</dd>
        <dt>errors</dt><dd>{hm.get('errors', 0)}</dd>
        <dt>warnings</dt><dd>{hm.get('warnings', 0)}</dd>
        <dt>cycle</dt><dd>{hm.get('cycle_time_min', 0):.1f} min</dd>
        <dt>lines / moves</dt><dd>{h.get('lines', '')} / {h.get('moves', '')}</dd>
      </dl>
      {thumb}
    </div>
    <div class="notes">{err_html}{md_to_html(notes) if notes.strip() else '<p class="muted">No notes from the LLM for this iteration.</p>'}</div>
  </div>
  <footer class="links">{''.join(links)}</footer>
</article>""")

    # ---- header facts
    name = meta.get("part") or stock.get("name") or run.name
    material = stock.get("material", "aluminium")
    tol = m.get("tolerance_mm", TOL_DEFAULT)
    model = meta.get("model") or "unknown"
    created = meta.get("created", "")
    try:
        created_h = dt.datetime.strptime(created, "%Y%m%d-%H%M%S").strftime("%Y-%m-%d %H:%M")
    except Exception:
        created_h = created
    sx, sy, sz = (stock.get("x", [0, 0]), stock.get("y", [0, 0]), stock.get("z", [0, 0]))
    stock_txt = f"{sx[1] - sx[0]:g} × {sy[1] - sy[0]:g} × {sz[1] - sz[0]:g} mm" if stock else "?"
    score = m.get("machinable_in_tol_pct")
    valid = bool(m.get("valid"))
    integ = (ev or {}).get("integrity", {})
    hv = integ.get("harness", {})
    integrity_note = ""
    chips = []
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
            chips.append(f'<span class="chip {"good" if good else "bad"}" title="{cc.get("points", 0)} query points, '
                         f'{cc.get("disagree_beyond_2um", 0)} disagree beyond 2 µm"><b aria-hidden="true">{"✓" if good else "✗"}</b> '
                         f'MillBill cross-check {cc["agreement_pct"]:.3f}%</span>')
        elif "skipped" in cc:
            chips.append(f'<span class="chip neutral" title="{_esc(cc["skipped"])}">MillBill cross-check skipped</span>')
        elif "error" in cc:
            chips.append(f'<span class="chip bad" title="{_esc(cc["error"])}">MillBill cross-check failed</span>')
    else:
        chips.append('<span class="chip warn" title="run python -m cncllm evaluate RUN">Not yet evaluated (latest iteration shown)</span>')

    mrows = "".join(f'<tr><th>{_esc(lbl)}</th><td class="num">{_fmt(m.get(k), 3 if k == "max_gouge_mm" else 2)}{(" " + u) if u and k in m else ""}</td></tr>'
                    for k, lbl, u in METRIC_LABELS if k in m)
    # per-tool table
    per_tool = {}
    if have_viewer:
        per_tool = vmeta.get("per_tool", {})
    order = []
    if have_viewer:
        pass
    trows = []
    for i, (tn, d) in enumerate(per_tool.items()):
        t = LIBRARY.get(int(tn))
        if not t:
            continue
        geo = {"flat": "flat", "ball": "ball", "bull": f"bull r{t.corner_radius:g}",
               "cone": f"cone {2 * t.half_angle:g}°"}[t.kind]
        trows.append(f'<tr><td><span class="swatch" data-tool="{tn}"></span>T{tn}</td><td>{_esc(t.name)}</td><td>{geo}</td>'
                     f'<td class="num">{t.diameter:g}</td><td class="num">{t.stickout:g}</td>'
                     f'<td class="num">{d["time_s"] / 60:.1f}</td><td class="num">{d["cut_mm"] / 1000:.2f}</td>'
                     f'<td class="num">{d["removed_cm3"]:.2f}</td></tr>')
    tools_tbl = ('<div class="tablewrap"><table class="tools"><thead><tr><th>Tool</th><th>Name</th><th>Type</th>'
                 '<th class="num">Ø mm</th><th class="num">Stick-out</th><th class="num">Time min</th>'
                 '<th class="num">Cut m</th><th class="num">Removed cm³</th></tr></thead><tbody>'
                 + "".join(trows) + '</tbody></table></div>') if trows else '<p class="muted">No tool data.</p>'

    gal = "".join(f'<figure><a href="{p}" target="_blank"><img src="{p}" alt="{_esc(t)}"></a>'
                  f'<figcaption>{_esc(t)}</figcaption></figure>' for p, t in gallery)
    desc = stock.get("description", "")
    n_err = m.get("errors", 0)
    n_warn = m.get("warnings", 0)
    verdict = _verdict(m, regs, issues) if m else "No simulation results yet."
    sim_block = ("""
<div class="sim" id="simroot">
  <div class="viewer-col">
    <div class="viewport" id="simview"><div class="vp-msg" id="simmsg">Loading 3D viewer…</div></div>
    <div class="controls" id="simcontrols"></div>
  </div>
  <aside class="side" id="simside"></aside>
</div>""" if have_viewer else '<p class="muted">No viewer data (run <code>python -m cncllm evaluate</code>).</p>')
    res_block = ("""
<div class="result">
  <div class="viewport tall" id="resview"><div class="vp-msg">Loading…</div></div>
  <div class="res-bar" id="resbar"></div>
</div>""" if have_viewer else "")
    iter_n = len(hist)
    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>{_esc(name)} · CNC run report</title>
<link rel="stylesheet" href="assets/report.css">
</head>
<body>
<header class="hero">
  <div class="wrap hero-grid">
    <div class="hero-main">
      <div class="eyebrow">CNC-LLM run report · {_esc(run.name)}</div>
      <h1>{_esc(name)}</h1>
      <p class="desc">{_esc(desc)}</p>
      <dl class="facts">
        <div><dt>Material</dt><dd>{_esc(material)}</dd></div>
        <div><dt>Stock</dt><dd>{_esc(stock_txt)}</dd></div>
        <div><dt>Tolerance</dt><dd>±{tol:g} mm</dd></div>
        <div><dt>Model / agent</dt><dd>{_esc(model)}</dd></div>
        <div><dt>Date</dt><dd>{_esc(created_h)}</dd></div>
        <div><dt>Iterations</dt><dd>{iter_n}{f' · final = #{final_iter}' if final_iter else ''}</dd></div>
      </dl>
    </div>
    <div class="hero-score" aria-label="Final score">
      <div class="score-top">
        <span class="badge lg {'valid' if valid else 'invalid'}">{'VALID' if valid else 'INVALID'}</span>
        <span class="muted">{n_err} error{'s' if n_err != 1 else ''} · {n_warn} warning{'s' if n_warn != 1 else ''}</span>
      </div>
      <div class="score-num">{(f'{score:.3f}' if score is not None else '–')}<span>%</span></div>
      <div class="score-label">of the machinable surface within ±{tol:g} mm{' · trusted final evaluation of iteration ' + str(final_iter) if is_final else ' (latest iteration, not evaluated)'}</div>
      <div class="meter" aria-hidden="true"><i style="width:{max(0, min(100, score or 0)):.2f}%"></i></div>
      <div class="chips">{''.join(chips)}</div>
      {f'<p class="int-note">{_esc(integrity_note)}</p>' if integrity_note else ''}
    </div>
  </div>
  <div class="wrap"><p class="verdict">{verdict}</p></div>
</header>
<nav class="toc" aria-label="Sections"><div class="wrap">
  <a href="#sim">Simulation</a><a href="#result">Result</a><a href="#problems">Problems</a><a href="#history">History</a>
  <a href="#metrics">Metrics</a><a href="#images">Images</a><a href="#gcode">G-code</a>
</div></nav>
<main class="wrap">
<section id="sim">
  <div class="sec-head"><h2>Cutting simulation</h2>
  <p class="sub">Replay of the evaluated program on a height-field stock (same swept-volume model as the simulator, computed in the browser).
  Drag to orbit, right-drag / two fingers to pan, wheel / pinch to zoom.</p></div>
  {sim_block}
</section>
<section id="result">
  <div class="sec-head"><h2>Final result</h2>
  <p class="sub">Target part coloured by the signed deviation of the simulated part, or the machined surface coloured by height error.
  Undercut and tool-limited surfaces are excluded from the score and shown separately, so they are not mistaken for LLM error.</p></div>
  {res_block}
</section>
<section id="problems">
  <div class="sec-head"><h2>Problems</h2><p class="sub">Click a line number to jump the G-code listing and the animation there; click a region to locate it in the result view.</p></div>
  <div class="stack">
    <div><h3>Safety &amp; plausibility issues <span class="count">{len(issues)}</span></h3>{_issue_rows(issues)}</div>
    <div><h3>Out-of-tolerance regions <span class="count">{len(regs)}</span></h3>{_region_rows(regs)}</div>
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
      <p class="muted small">Estimated cycle time <strong>{m.get('cycle_time_min', 0):.1f} min</strong> (feeds as programmed, rapids at {MACHINE.rapid_rate:g} mm/min, 8 s per tool change).</p>
    </div>
  </div>
</section>
<section id="images">
  <div class="sec-head"><h2>Images</h2><p class="sub">2D plots written by the simulator for the LLM's feedback (the same information as the 3D views above).</p></div>
  <details class="imgs" open><summary>Show / hide simulator plots</summary><div class="gallery">{gal}</div></details>
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
<script src="assets/viewer.js"></script>
</body>
</html>
"""
    (out / "index.html").write_text(page)
    return out / "index.html"
