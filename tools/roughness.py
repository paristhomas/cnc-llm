"""Kinematic surface roughness of a run's final program -> <run>/final/roughness.* (npz, glb, png, json).

    python tools/roughness.py <run> [--spacing 1.8]

KINEMATIC (GEOMETRIC) ROUGHNESS ONLY - what an ideal machine with ideal tools leaves. Vibration, deflection, tool wear,
runout, built-up edge and tooth-pass marks are NOT included (see cncllm/roughness.py for the method).
"""
from __future__ import annotations

import argparse
import json
import math
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from cncllm import part5, sim5  # noqa: E402
from cncllm import roughness as rg  # noqa: E402
from cncllm.tools import LIBRARY  # noqa: E402

# colour scale: one hue (blue) light -> dark, log-continuous, anchored at the N-grade breakpoints
SCALE = [(0.2, "#cde2fb"), (0.4, "#9ec5f4"), (0.8, "#6da7ec"), (1.6, "#3987e5"), (3.2, "#256abf"), (6.3, "#184f95"),
         (12.5, "#0d366b")]
STATUS = {1: ("#b4b1a8", "not evaluated: face too small for a profile"),
          2: ("#8e5bb5", "tab witness (not scored)"),
          3: ("#e8822a", "out of tolerance > 0.1 mm (unfinished / gouge, not scored)"),
          4: ("#7d7a72", "no machined surface found (not scored)"),
          5: ("#b4b1a8", "not evaluated: face too small for a profile")}
BREAKS = [0.4, 0.8, 1.6, 3.2, 6.3, 12.5]


def _hex(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])


def fmt(x):
    return "< 0.01" if x < 0.005 else f"{x:.2f}"


def ra_rgb(ra):
    xs = np.log([v for v, _ in SCALE])
    cs = np.array([_hex(c) for _, c in SCALE])
    x = np.log(np.clip(ra, SCALE[0][0], SCALE[-1][0]))
    return np.stack([np.interp(x, xs, cs[:, j]) for j in range(3)], 1)


def colours(val, st):
    rgb = np.zeros((len(val), 3))
    ok = st == 0
    rgb[ok] = ra_rgb(val[ok])
    for k, (c, _) in STATUS.items():
        rgb[st == k] = _hex(c)
    return rgb


def face_desc(faces, f):
    fi = next((x for x in faces if x["id"] == f), {"type": "?"})
    return fi["type"] + (f" r{fi['radius']:g}" if "radius" in fi else "")


def tool_desc(t):
    if t is None or t < 0 or t not in LIBRARY:
        return None
    T = LIBRARY[t]
    return f"T{t} {T.name}"


def ideal_cusp_um(t, pitch):
    """Theoretical scallop for the tool's tip radius and the measured mark pitch (ball: R; bull: corner radius)."""
    if t not in LIBRARY or not np.isfinite(pitch):
        return None
    T = LIBRARY[t]
    r = T.R if T.kind == "ball" else (T.corner_radius if T.kind == "bull" else None)
    if not r or pitch / 2 >= r:
        return None
    return round(1e3 * (r - math.sqrt(r * r - (pitch / 2) ** 2)), 2)


# ------------------------------------------------------------------ glb
def write_glb(path, V, F, rgb_srgb, extras):
    """Minimal glTF 2.0 binary: positions (Y-up), smooth normals, COLOR_0 (linear, as glTF requires), a matte
    non-metallic material (glTF's default material is fully metallic and renders dark), legend in scene extras."""
    import struct
    import trimesh
    Vg = np.c_[V[:, 0], V[:, 2], -V[:, 1]].astype(np.float32)
    Fi = np.ascontiguousarray(F, np.uint32)
    Nn = np.asarray(trimesh.Trimesh(Vg, Fi, process=False).vertex_normals, np.float32)
    c = np.clip(rgb_srgb, 0, 1)
    lin = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4).astype(np.float32)
    blobs = [Vg.tobytes(), Nn.tobytes(), lin.tobytes(), Fi.tobytes()]
    views, off = [], 0
    for b, tgt in zip(blobs, (34962, 34962, 34962, 34963)):
        views.append({"buffer": 0, "byteOffset": off, "byteLength": len(b), "target": tgt})
        off += (len(b) + 3) // 4 * 4
    binary = b"".join(b + bytes((4 - len(b) % 4) % 4) for b in blobs)
    gl = {"asset": {"version": "2.0", "generator": "cnc-llm tools/roughness.py"},
          "scene": 0, "scenes": [{"nodes": [0], "extras": extras}], "nodes": [{"mesh": 0, "name": "part"}],
          "meshes": [{"name": "part_roughness", "primitives": [{"attributes": {"POSITION": 0, "NORMAL": 1,
                                                                              "COLOR_0": 2},
                                                                 "indices": 3, "material": 0}]}],
          "materials": [{"name": "matte", "pbrMetallicRoughness": {"baseColorFactor": [1, 1, 1, 1],
                                                                  "metallicFactor": 0.0, "roughnessFactor": 0.75},
                         "doubleSided": True}],
          "buffers": [{"byteLength": len(binary)}], "bufferViews": views,
          "accessors": [
              {"bufferView": 0, "componentType": 5126, "count": len(Vg), "type": "VEC3",
               "min": Vg.min(0).tolist(), "max": Vg.max(0).tolist()},
              {"bufferView": 1, "componentType": 5126, "count": len(Vg), "type": "VEC3"},
              {"bufferView": 2, "componentType": 5126, "count": len(Vg), "type": "VEC3"},
              {"bufferView": 3, "componentType": 5125, "count": int(Fi.size), "type": "SCALAR"}]}
    js = json.dumps(gl, separators=(",", ":")).encode()
    js += b" " * ((4 - len(js) % 4) % 4)
    total = 12 + 8 + len(js) + 8 + len(binary)
    with open(path, "wb") as fh:
        fh.write(struct.pack("<III", 0x46546C67, 2, total))
        fh.write(struct.pack("<II", len(js), 0x4E4F534A) + js)
        fh.write(struct.pack("<II", len(binary), 0x004E4942) + binary)


# ------------------------------------------------------------------ views
def splat_zbuffer(u, v, depth, rgb, px, rad=4, tol=0.6):
    """Gap-free orthographic render of a probe cloud. Each probe covers a disc of `rad` pixels: (1) the nearest depth per
    pixel gives the front surface (no sampling gaps through which faces behind could show); (2) only probes within
    `tol` mm of that front depth are visible, and each pixel takes the colour of the visible probe nearest to it in the
    image plane; (3) the silhouette is eroded back by rad-1 pixels. Returns RGBA (origin lower) and the extent."""
    from scipy import ndimage
    m = rad + 2
    u0, v0 = u.min() - m * px, v.min() - m * px
    nu = int((u.max() - u0) / px) + m + 1
    nv = int((v.max() - v0) / px) + m + 1
    fu, fv = (u - u0) / px, (v - v0) / px
    iu, iv = fu.astype(int), fv.astype(int)
    offs = [(a, b) for a in range(-rad, rad + 1) for b in range(-rad, rad + 1) if a * a + b * b <= rad * rad + 0.5]
    pid = np.concatenate([(iv + b) * nu + (iu + a) for a, b in offs])
    src = np.tile(np.arange(len(u)), len(offs))
    front = np.full(nv * nu, -np.inf)
    np.maximum.at(front, pid, depth[src])
    vis = depth[src] >= front[pid] - tol
    pid, src = pid[vis], src[vis]
    cu = (pid % nu) + 0.5
    cv = (pid // nu) + 0.5
    d2 = (cu - fu[src]) ** 2 + (cv - fv[src]) ** 2
    order = np.lexsort((-d2, pid))
    last = np.r_[pid[order][1:] != pid[order][:-1], True]
    sel = order[last]
    img = np.zeros((nv * nu, 4))
    img[pid[sel], :3] = rgb[src[sel]]
    mask = np.zeros(nv * nu, bool)
    mask[pid[sel]] = True
    mask = mask.reshape(nv, nu)
    yy, xx = np.mgrid[-rad:rad + 1, -rad:rad + 1]
    k = rad - 1
    mask = ndimage.binary_erosion(mask, structure=(xx * xx + yy * yy) <= k * k + 0.5)
    img = img.reshape(nv, nu, 4)
    img[..., 3] = mask
    return img, (u0, u0 + nu * px, v0, v0 + nv * px)


def views_png(P, N, rgb, path, title, footer, stats_lines):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.colors import LinearSegmentedColormap, LogNorm
    from matplotlib.lines import Line2D
    from scipy.spatial import cKDTree

    ext = P.max(0) - P.min(0)
    sub = P[np.random.default_rng(0).choice(len(P), size=min(len(P), 20000), replace=False)]
    nn = cKDTree(P).query(sub, k=2)[0][:, 1]
    px = max(ext.max() / 1400.0, 1.05 * float(np.median(nn)))
    row1 = [("front (looking +Y)", 0, 2, 1, -1, False), ("back (looking −Y)", 0, 2, 1, 1, True),
            ("left (looking +X)", 1, 2, 0, -1, True), ("right (looking −X)", 1, 2, 0, 1, False)]
    if ext[1] > ext[0]:
        row2 = [("top (looking down; X up the page)", 1, 0, 2, 1, True),
                ("underside (looking up; X up the page)", 1, 0, 2, -1, False)]
        pw, ph = ext[1], ext[0]
    else:
        row2 = [("top (looking down)", 0, 1, 2, 1, False), ("underside (looking up)", 0, 1, 2, -1, True)]
        pw, ph = ext[0], ext[1]
    w1 = [ext[0], ext[0], ext[1], ext[1]]
    fig_w = 17.0
    h1 = min(fig_w * 0.92 * ext[2] / sum(w1), 12.0)
    h2 = min(fig_w * 0.92 * ph / (2 * pw), 6.5)
    info = 2.3                                     # colour bar, status legend and statistics strip (inches)
    H = 0.9 + h1 + 0.7 + h2 + 0.6 + info + 0.4
    fig = plt.figure(figsize=(fig_w, H), dpi=110, facecolor="white")
    y = lambda inch: 1 - inch / H                  # noqa: E731  (inches from the top -> figure fraction)
    gs1 = fig.add_gridspec(1, 4, width_ratios=w1, left=0.05, right=0.99, top=y(0.9), bottom=y(0.9 + h1), wspace=0.14)
    gs2 = fig.add_gridspec(1, 2, left=0.05, right=0.99, top=y(0.9 + h1 + 0.7), bottom=y(0.9 + h1 + 0.7 + h2),
                           wspace=0.10)
    axes = [fig.add_subplot(gs1[0, i]) for i in range(4)] + [fig.add_subplot(gs2[0, i]) for i in range(2)]
    for ax, (name, a_, b_, c_, sgn, mirror) in zip(axes, row1 + row2):
        u = -P[:, a_] if mirror else P[:, a_]
        shade = 0.72 + 0.28 * np.clip(sgn * N[:, c_], 0, 1)          # mild Lambert shading: shape stays readable
        img, extent = splat_zbuffer(u, P[:, b_], sgn * P[:, c_], rgb * shade[:, None], px)
        ax.imshow(img, origin="lower", extent=extent, interpolation="nearest")
        ax.set_title(name, fontsize=10, color="#3b3a36")
        ax.set_aspect("equal")
        ax.set_xlabel(("−" if mirror else "") + "XYZ"[a_] + " (mm)", fontsize=8, color="#6b6963")
        ax.set_ylabel("XYZ"[b_] + " (mm)", fontsize=8, color="#6b6963")
        ax.tick_params(labelsize=7, colors="#6b6963")
        for sp in ax.spines.values():
            sp.set_color("#d6d3cc")
    top_info = 0.9 + h1 + 0.7 + h2 + 0.6
    # colour bar (log, N-grade ticks)
    fig.text(0.05, y(top_info), "Ra (µm), ISO 4287 / 16610-21, kinematic only", fontsize=10.5, color="#1f1e1b",
             weight="bold", va="top")
    cax = fig.add_axes([0.05, y(top_info + 0.75), 0.36, 0.32 / H])
    cmap = LinearSegmentedColormap.from_list("ra", [(np.log(v / SCALE[0][0]) / np.log(SCALE[-1][0] / SCALE[0][0]), c)
                                                     for v, c in SCALE])
    norm = LogNorm(SCALE[0][0], SCALE[-1][0])
    cb = fig.colorbar(plt.cm.ScalarMappable(norm=norm, cmap=cmap), cax=cax, orientation="horizontal")
    cb.set_ticks(BREAKS)
    cb.set_ticklabels([f"{b:g}\n{rg.n_grade(b)}" for b in BREAKS])
    cb.ax.minorticks_off()
    cb.ax.tick_params(labelsize=8.5, colors="#3b3a36")
    cb.outline.set_edgecolor("#d6d3cc")
    fig.text(0.05, y(top_info + 1.55), "log scale; ≤ 0.2 µm drawn as the lightest blue, ≥ 12.5 µm as the darkest",
             fontsize=8, color="#6b6963", va="top")
    handles = [Line2D([], [], marker="s", ls="", ms=10, color=STATUS[k][0], label=STATUS[k][1]) for k in (1, 3, 2, 4)]
    fig.legend(handles=handles, loc="upper left", bbox_to_anchor=(0.45, y(top_info - 0.05)), fontsize=9,
               frameon=False, title="not part of the Ra statistics", title_fontsize=9, alignment="left")
    fig.text(0.74, y(top_info), "\n".join(stats_lines), fontsize=8.8, color="#3b3a36", va="top", family="monospace")
    fig.suptitle(title, fontsize=13, y=y(0.35), color="#1f1e1b")
    fig.text(0.5, y(H - 0.25), footer, ha="center", va="center", fontsize=9, color="#8f1414")
    fig.savefig(path, facecolor="white")
    plt.close(fig)


# ------------------------------------------------------------------ main
def compat_keys(summary, R):
    """Flat top-level keys read by the report (cncllm/report5.py _roughness_block)."""
    v = np.asarray(R["valid"], bool)
    summary["Ra_median_um"] = summary["Ra_um"]["median"]
    summary["Ra_p90_um"] = summary["Ra_um"]["p90"]
    summary["Ra_p95_um"] = summary["Ra_um"]["p95"]
    summary["Ra_max_um"] = round(float(np.asarray(R["Ra_um"])[v].max()), 3) if v.any() else None


def run(run_dir: Path, spacing=2.0, verbose=True):
    t0 = time.time()
    p = part5.load(run_dir / "part", verbose=False)
    res = sim5.run((run_dir / "final" / "program.nc").read_text(), p, verbose=False)
    t_sim = time.time() - t0
    surf = rg.SimSurface(res["workpiece"], res["moves"])
    R = rg.measure(surf, p.V, p.F, p.tri_face, p.P, p.N, p.pface, p.parea, spacing=spacing,
                   witness=res["witness"], dev=res["dev"], verbose=verbose)
    tools_seen = R.pop("_tools_seen")
    timing = R.pop("_timing")
    timing["sim_s"] = round(t_sim, 1)
    tp = np.full((len(tools_seen), 4), -1, np.int16)
    for j, ts in enumerate(tools_seen):
        tp[j, :len(ts[:4])] = ts[:4]
    R["tools_on_profile"] = tp
    return write_outputs(run_dir, p, R, timing, spacing, t0, verbose)


def outputs_only(run_dir: Path, verbose=True):
    """Rebuild every output from an existing final/roughness.npz (no simulation, no tracing)."""
    t0 = time.time()
    p = part5.load(run_dir / "part", verbose=False)
    z = np.load(run_dir / "final" / "roughness.npz")
    meta = json.loads(str(z["meta"]))
    R = {k: z[k] for k in z.files if k not in ("meta", "cell_area_mm2")}
    old = run_dir / "final" / "roughness_summary.json"
    timing = json.loads(old.read_text()).get("timing_s", {}) if old.exists() else {}
    timing.pop("total_with_outputs_s", None)
    if "tools_on_profile" not in R:   # older npz: the dominant tool only
        R["tools_on_profile"] = np.c_[R["tool_mode"][:, None], np.full((len(R["tool_mode"]), 3), -1)].astype(np.int16)
    return write_outputs(run_dir, p, R, timing, meta.get("spacing_mm", 2.0), t0, verbose)


def write_outputs(run_dir, p, R, timing, spacing, t0, verbose=True):
    t_out = time.time()
    tools_seen = [[int(t) for t in row if t >= 0] for row in R["tools_on_profile"]]
    out = run_dir / "final"
    cellA, owner = rg.area_weights(R, p.P, p.pface, p.parea)
    R["cell_area_mm2"] = cellA.astype(np.float32)
    total = float(p.parea.sum())
    v = R["valid"]
    ra, w = R["Ra_um"][v].astype(float), cellA[v]
    meta = {"method": "profile method, ISO 4287 parameters, ISO 16610-21 Gaussian filter (truncated at +-lc/2, "
                      "evaluation = traced length - lc); form = 4th-order LSQ polynomial in the profile plane, residual "
                      "normal to the form, resampled uniformly in arc length; heights by bisection on the exact "
                      "simulated workpiece along rays parallel to the patch normal (~0.015 um resolution); lay found "
                      "from 4 short star profiles; patch value = max over across/along-lay profiles",
            "tiers": [{"lc_mm": a, "traced_min_mm": b, "traced_max_mm": c, "dx_mm": d} for a, b, c, d in rg.TIERS],
            "spacing_mm": spacing, "edge_margin_mm": rg.EDGE_MARGIN, "slope_limit": rg.SLOPE_LIM,
            "reasons": rg.REASONS, "caveat": rg.CAVEAT, "units": "um (Ra/Rz/...), mm (positions, lengths)",
            "frame": "fixture / G54 coordinates, Z up (same as part/ and probes.npz)"}
    np.savez_compressed(out / "roughness.npz", **{k: v_ for k, v_ in R.items()}, meta=json.dumps(meta))
    # per-vertex and per-probe maps
    vface = np.zeros(len(p.V), np.int64)
    vface[p.F.ravel()] = np.repeat(p.tri_face, 3)
    vval, vst = rg.map_to_points(R, p.V, vface, R["Ra_um"].astype(float))
    np.save(out / "roughness_vertex.npy", np.where(vst == 0, vval, np.nan).astype(np.float32))
    np.save(out / "roughness_vertex_status.npy", vst.astype(np.uint8))   # 0 ok, else rg.REASONS / 5 = no patch
    pval, pst = rg.map_to_points(R, p.P, p.pface, R["Ra_um"].astype(float))
    # GLB (glTF is Y-up: (x, y, z) -> (x, z, -y))
    write_glb(out / "roughness_model.glb", p.V, p.F, colours(vval, vst),
              {"title": "kinematic surface roughness Ra (um)", "caveat": rg.CAVEAT,
               "colour_stops_um_hex": [[a, c] for a, c in SCALE],
               "status_colours": {v_[1]: v_[0] for k, v_ in STATUS.items() if k != 5},
               "axes": "glTF Y-up: (x, y, z)_G54 -> (x, z, -y)", "units": "mm"})
    # statistics
    pct = rg.wpercentile(ra, w, [10, 25, 50, 75, 90, 95, 99]) if len(ra) else [None] * 7
    share = lambda lim: float(w[ra <= lim].sum() / max(w.sum(), 1e-12))  # noqa: E731
    reason_area = {rg.REASONS[k]: round(float(cellA[R["reason"] == k].sum()), 2) for k in rg.REASONS}
    by_type = {}
    for f in np.unique(R["face"]):
        typ = face_desc(p.faces, int(f)).split()[0]
        by_type.setdefault(typ, []).append(int(f))
    type_stats = {}
    for typ, fl in sorted(by_type.items()):
        m = np.isin(R["face"], fl)
        mv = m & v
        A = float(cellA[m].sum())
        e = {"area_mm2": round(A, 1), "evaluated_pct": round(100 * float(cellA[mv].sum()) / max(A, 1e-9), 1),
             "patches": int(m.sum())}
        if mv.any():
            q = rg.wpercentile(R["Ra_um"][mv].astype(float), cellA[mv], [50, 90])
            e.update({"Ra_median_um": round(q[0], 3), "Ra_p90_um": round(q[1], 3),
                      "Ra_max_um": round(float(R["Ra_um"][mv].max()), 3)})
        type_stats[typ] = e
    # the 10 roughest areas (non-maximum suppression, 6 mm)
    order = np.where(v)[0][np.argsort(-R["Ra_um"][v])]
    picked = []
    for j in order:
        if all(np.linalg.norm(R["P"][j] - R["P"][k]) > 6.0 for k in picked):
            picked.append(j)
        if len(picked) == 10:
            break
    roughest = []
    for j in picked:
        near = (np.linalg.norm(R["P"][v] - R["P"][j], axis=1) < 6.0) & (R["face"][v] == R["face"][j])
        tl = int(R["tool"][j])
        pitch = float(R["pitch_mm_dir"][j, 0])
        roughest.append({
            "rank": len(roughest) + 1, "centre": [round(float(x), 2) for x in R["P"][j]],
            "normal": [round(float(x), 3) for x in R["normal"][j]], "face": int(R["face"][j]),
            "face_type": face_desc(p.faces, int(R["face"][j])),
            "Ra_um": round(float(R["Ra_um"][j]), 3), "Rz_um": round(float(R["Rz_um"][j]), 3),
            "Rt_um": round(float(R["Rt_um"][j]), 3), "Pa_um": round(float(R["Pa_um"][j]), 3),
            "grade": rg.n_grade(float(R["Ra_um"][j])), "lc_mm": float(R["lc_mm"][j]),
            "mark_pitch_mm": round(pitch, 3) if np.isfinite(pitch) else None,
            "across_lay_dir": [round(float(x), 3) for x in R["dirs"][j, 0]],
            "area_mm2_nearby_same_face": round(float(cellA[v][near].sum()), 1),
            "tool": tl if tl >= 0 else None, "tool_name": tool_desc(tl), "line": int(R["line"][j]),
            "frame": int(R["frame"][j]), "tools_on_profile": tools_seen[j][:4],
            "passes_crossed": int(R["n_lines_crossed"][j]),
            "ideal_cusp_um_for_pitch": ideal_cusp_um(tl, pitch),
            "coarse_marks": bool(R["coarse_marks"][j])})
    meas_area = float(w.sum())
    cellT, _ = rg.area_weights(R, p.P, p.pface, p.parea, drop_no_room=False)
    traced_area = float(cellT[v].sum())
    by_tool = {}
    for t_ in sorted(set(int(x) for x in R["tool_mode"][v])):
        mt = v & (R["tool_mode"] == t_)
        if cellA[mt].sum() <= 0:
            continue
        q = rg.wpercentile(R["Ra_um"][mt].astype(float), cellA[mt], [50, 90])
        by_tool["none" if t_ < 0 else f"T{t_}"] = {
            "tool": tool_desc(t_), "area_mm2": round(float(cellA[mt].sum()), 1),
            "area_pct_of_evaluated": round(100 * float(cellA[mt].sum()) / max(meas_area, 1e-9), 2),
            "Ra_median_um": round(q[0], 3), "Ra_p90_um": round(q[1], 3),
            "Pa_median_um": round(rg.wpercentile(R["Pa_um"][mt].astype(float), cellA[mt], [50])[0], 3)}
    summary = {
        "caveat": rg.CAVEAT, "run": str(run_dir), "program": "final/program.nc",
        "surface_area_mm2": round(total, 1),
        "evaluated_area_mm2": round(meas_area, 1), "evaluated_pct": round(100 * meas_area / total, 2),
        "evaluated_note": "evaluated = surface represented by a valid patch on the same B-rep face (edge strips "
                          "with no room for a profile take the nearest same-face patch); traced = area of the "
                          "valid patches' own cells",
        "traced_area_mm2": round(traced_area, 1), "traced_pct": round(100 * traced_area / total, 2),
        "by_tool_dominant_on_profile": by_tool,
        "area_by_status_mm2": reason_area,
        "patches": int(len(R["Ra_um"])), "valid_patches": int(v.sum()),
        "Ra_um": dict(zip(["p10", "p25", "median", "p75", "p90", "p95", "p99"], [round(x, 3) for x in pct])),
        "Ra_mean_um": round(float((ra * w).sum() / w.sum()), 3) if len(ra) else None,
        "Rz_um_median": round(rg.wpercentile(R["Rz_um"][v].astype(float), w, [50])[0], 3) if len(ra) else None,
        "Rz_um_p90": round(rg.wpercentile(R["Rz_um"][v].astype(float), w, [90])[0], 3) if len(ra) else None,
        "share_le": {f"Ra{b:g}": round(share(b), 4) for b in [0.4, 0.8, 1.6, 3.2, 6.3, 12.5]},
        "grade_area_share": {},
        "coarse_marks_pct_of_evaluated": round(100 * float(w[R["coarse_marks"][v]].sum()) / max(meas_area, 1e-9), 2),
        "lc_share_of_evaluated": {f"{a:g}": round(float(w[R["lc_mm"][v] == a].sum()) / max(meas_area, 1e-9), 4)
                                  for a, *_ in rg.TIERS},
        "by_face_type": type_stats, "roughest_areas": roughest,
        "colour_scale": {"kind": "log-continuous, one hue", "stops_um_hex": [[a, c] for a, c in SCALE],
                         "status_colours": {rg.REASONS.get(k, "no patch on this face") if k != 5 else
                                            "no patch on this face": c for k, (c, _) in STATUS.items()},
                         "n_grade_breaks_um": BREAKS},
        "timing_s": timing, "meta": meta,
        "tools_on_profile_note": "roughest_areas[].tools_on_profile: tools forming the across-lay profile, most frequent first (only the dominant one after an --outputs-only rebuild of an older npz)",
    }
    lo = 0.0
    for b, g in rg.N_GRADES:
        summary["grade_area_share"][g] = round(float(w[(ra > lo) & (ra <= b)].sum()) / max(meas_area, 1e-9), 4)
        lo = b
    summary["grade_area_share"][">N12"] = round(float(w[ra > lo].sum()) / max(meas_area, 1e-9), 4)
    compat_keys(summary, R)
    (out / "roughness_summary.json").write_text(json.dumps(summary, indent=1))
    # views
    name = run_dir.parent.name.upper().replace("_", " ")
    title = (f"{name} kinematic surface roughness Ra   |   median {fmt(pct[2])} µm, 90th pct {fmt(pct[4])} µm   |   "
             f"≤ Ra 1.6: {100 * share(1.6):.0f} %,  ≤ Ra 3.2: {100 * share(3.2):.0f} % of evaluated area "
             f"(represents {100 * meas_area / total:.0f} % of the surface)")
    lines = [f"evaluated  {meas_area:8.0f} mm²  {100 * meas_area / total:5.1f} %",
             f"  traced   {traced_area:8.0f} mm²  {100 * traced_area / total:5.1f} %",
             f"surface    {total:8.0f} mm²", "",
             f"Ra p10 / p50 / p90   {fmt(pct[0])} / {fmt(pct[2])} / {fmt(pct[4])} µm",
             f"Ra p99               {pct[6]:.2f} µm",
             f"Rz p50 / p90         {fmt(summary['Rz_um_median'])} / {fmt(summary['Rz_um_p90'])} µm",
             f"marks coarser than λc  {summary['coarse_marks_pct_of_evaluated']:.1f} % (Pa >> Ra)",
             f"{len(R['Ra_um'])} patches, λc 0.8 mm on {100 * summary['lc_share_of_evaluated']['0.8']:.0f} %",
             f"(0.25 mm on the rest)"]
    views_png(p.P, p.N, colours(pval, pst), out / "roughness_views.png", title,
              "KINEMATIC ROUGHNESS ONLY (ideal machine, ideal tools): vibration, deflection, tool wear, runout, "
              "built-up edge and tooth-pass marks are NOT included - a real part measures rougher.", lines)
    timing["outputs_s"] = round(time.time() - t_out, 1)
    timing["total_s_all"] = round(timing.get("sim_s", 0) + timing.get("total_s", 0) + timing["outputs_s"], 1)
    summary["timing_s"] = timing
    (out / "roughness_summary.json").write_text(json.dumps(summary, indent=1))
    if verbose:
        print(json.dumps({k: summary[k] for k in ("evaluated_pct", "Ra_um", "share_le", "timing_s")}, indent=1))
    return summary


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("run", type=Path)
    ap.add_argument("--spacing", type=float, default=2.0)
    ap.add_argument("--outputs-only", action="store_true", help="rebuild the outputs from final/roughness.npz")
    a = ap.parse_args()
    outputs_only(a.run) if a.outputs_only else run(a.run, a.spacing)
