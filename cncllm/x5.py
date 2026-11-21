"""3+2 (indexed 5-axis) harness CLI:  python -m cncllm.x5 <command>

  fixture-suggest <part.step> [--scale S]           rank part orientations in the vise by 3+2 reachability
  new-run <part.step> --fixture FX.json [--name N] [--model M] [--label L]
                                                     place the part, build the brief, print the run folder
  sim <run> <program.nc> [--note notes.md]          simulate one iteration -> run/iter_NN/feedback.md
  evaluate <run> [--iter N]                          trusted re-evaluation (fresh process) + report
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np

from . import part5, render
from .part import TOL
from .tools import LIBRARY, MACHINE, library_table

PKG = Path(__file__).resolve().parent
REPO = PKG.parent

DIALECT5 = """\
Everything from the 3-axis dialect (metric, absolute, G0/G1/G2/G3, G81-G83, T M6 + G43 H, S M3/M5, M30), plus
indexed 5-axis on a trunnion table (A tilt up to 110 deg from vertical, C unlimited):
- `G68.2 X.. Y.. Z.. I.. J.. K..` defines a tilted work plane: origin X Y Z in G54 (fixture) coordinates, Euler angles
  I J K in degrees (Z, then X', then Z''). The tool axis (frame +Z) in G54 is R[:,2] with R = Rz(I) Rx(J) Rz(K).
  Example: `I0 J90 K0` -> tool comes from -Y (frame X = +X, frame Y = +Z, frame Z = -Y);
  `I90 J90 K0` -> tool from +X; `I-90 J90 K0` -> tool from -X; `I180 J90 K0` -> from +Y; `I0 J45 K0` -> 45 deg
  towards -Y.
- `G53.1` then orients the machine: the tool first retracts to Z150 of the current frame, the table indexes, and the
  tool is parked at Z150 above the new frame origin. Program plain XYZ in the tilted frame afterwards.
- `G69` cancels (same retract/park). A new `G68.2` requires `G69` first. Motion between G68.2 and G53.1 is an error.
- Mark the part-off section with a comment `(PART-OFF)` before its first block.
"""

RULES5 = """\
- Crashes are errors: rapids touching material, spindle stopped while cutting, material above the flute length,
  tool holder touching material, **tool or holder touching the vise or table** (all moves, all orientations).
  In tilted setups the material state is tracked on a 0.25 mm voxel grid, so keep rapids >= 0.5 mm clear.
- **Rigidity:** until the `(PART-OFF)` section the weakest material cross-section between the gripped stub and the
  part (minimum over planes spanning the stub gap) must stay >= 30 % of the stock cross-section.
- **Part-off (machine does the parting; the operator only snaps small tabs):** the program ends with a `(PART-OFF)`
  section that machines the underside (the face towards the stub) to size like any other face and cuts the stub gap
  down to small tabs. Validity rules, checked on the final material:
  - tabs total between 2 and 30 mm2 at the weakest plane of the stub gap (and <= 15 % of the stub section);
  - at most 4 tabs, each <= 3.0 mm across in its smallest direction (snap / cut by hand, no saw);
  - each tab also <= 3.0 mm across at every height from its weakest section up to the part (no big pads);
  - tab witness <= 1.5 % of the surface (target 0.5 %): the part surface within 1.0 mm of where a tab body (material
    still present 1 mm below the part, plus 1 mm for the flare of the side tool) meets the part. Unfinished skin next
    to a tab is NOT witness: it is failed surface.
  Review target (not a validity rule): 2-4 tabs, 20-30 mm2 in total.
- Cutting data checks as in 3-axis (chip load, cut cross-section, plunges).
- **Score: share of the WHOLE part surface within +-0.1 mm**, two-sided (proud and gouge both fail). The only area
  not scored is the tab witness (only when the part-off is valid). Probes in the 0.03 mm face-edge band, where the
  marched deviation is a metrology artefact, are scored with the deviation of the nearest probe outside the band. The underside, undercuts and areas no tool reaches easily are all scored: surface the program did not
  finish is failed surface. The harness's reach search is a hint only (see `reach_hint.png`).
"""


def harness_fp():
    from . import cli
    cli.CORE[:] = sorted(set(cli.CORE + ["part5.py", "sim5.py", "kernel5.py", "x5.py", "crosscheck5.py", "cli.py"]))
    return cli.harness_fingerprint()


# ------------------------------------------------------------------------------------------------ fixture suggestion
def suggest(step: Path, scale=1.0, res=0.2, nprobe=25000):
    import tempfile
    from .part import _mesh_from_step, _sample

    out = []
    for up in ["+Z", "-Z", "+X", "-X", "+Y", "-Y"]:
        for rz in (0.0, 90.0):
            fx = {"up": up, "rot_z_deg": rz, "scale": scale}
            with tempfile.TemporaryDirectory() as td:
                s = part5.place(step, fx, Path(td))
                V, F, TF, faces, _ = _mesh_from_step(Path(td) / "part.step", deflection=0.02)
            P, N, PF, PA = _sample(V, F, TF, nprobe, np.random.default_rng(1))
            part_face = (P[:, 2] < 1e-3) & (N[:, 2] < -0.99)
            under = (N[:, 2] < -0.3) & ~part_face          # downward-facing surface above Z0 (overhangs, underside features)
            low_under = under & (P[:, 2] < 25.0)
            dirs = part5.candidate_dirs(faces, np.eye(3))
            pd = part5.reachability(V, F, s["vise"], np.array(s["stock"]["lo"]), np.array(s["stock"]["hi"]), P, N,
                                    dirs, res=res)
            bb = s["part_bbox"]
            reach = float(PA[pd >= 0].sum() / PA.sum() * 100)
            out.append({"up": up, "rot_z_deg": rz, "tool_found_pct": round(reach, 2),
                        "no_tool_found_mm2": round(float(PA[pd < 0].sum()), 1),
                        "bottom_face_pct": round(float(PA[part_face].sum() / PA.sum() * 100), 2),
                        "bottom_width_mm": None,
                        "downward_faces_low_mm2": round(float(PA[low_under].sum()), 1),
                        "height_mm": round(bb[5] - bb[2], 1), "footprint_mm": [round(bb[3] - bb[0], 1), round(bb[4] - bb[1], 1)],
                        "directions_used": int(len(set(pd[pd >= 0].tolist())))})
            fp = out[-1]["footprint_mm"]
            out[-1]["bottom_width_mm"] = round(min(fp), 1)
            slender = out[-1]["height_mm"] / max(min(fp), 1e-6)
            out[-1]["slenderness"] = round(slender, 2)
            # practical ranking (a hint, not a rule): whole-surface tool coverage first; a mild penalty for tall
            # slender stick-out (rigidity, chatter: deepen the grip) and for a bottom footprint too wide for side tools
            # to finish the underside and part off (T1 reaches ~35 mm from each side)
            wide = max(0.0, min(fp) - 70.0)
            out[-1]["suggest_score"] = round(reach - 1.0 * max(0.0, slender - 3.0) - 0.2 * wide, 2)
            print(json.dumps(out[-1]), flush=True)
    out.sort(key=lambda r: (-r["suggest_score"], r["no_tool_found_mm2"], r["height_mm"]))
    return out


# ------------------------------------------------------------------------------------------------ brief
def write_brief(part, run: Path):
    b = run / "brief"
    b.mkdir(parents=True, exist_ok=True)
    shutil.copy(part.dir / "part.step", b / "part.step")
    shutil.copy(part.dir / "setup.json", b / "setup.json")
    import trimesh
    trimesh.Trimesh(part.V, part.F, process=True).export(b / "part.stl")   # welded (watertight)
    (b / "faces.json").write_text(json.dumps(part.faces, indent=1))
    iso_png(part.P, part.N, b / "target_iso.png", f"{part.name} in the fixture frame (G54): Z0 = bottom of the part "
            "(the face towards the vise stub), part centred in X and Y")
    _views_png(part.P, None, part.pclass, b / "reach_hint.png", "Reach hint (diagnostic only, every area is scored): "
               "blue = quick search found a tool + direction; orange = it found none (plan it yourself)", mode="class")
    s = part.meta
    lo, hi = s["stock"]["lo"], s["stock"]["hi"]
    bb = s["part_bbox"]
    fx = s["fixture"]
    dirs = part.reach_dirs
    counts = np.bincount(part.pdir[part.pdir >= 0], minlength=len(dirs)) if (part.pdir >= 0).any() else np.zeros(len(dirs))
    rows = []
    for i, d in enumerate(dirs):
        if counts[i] == 0:
            continue
        A = math.degrees(math.acos(max(-1, min(1, d[2]))))
        rows.append(f"| ({d[0]:+.3f}, {d[1]:+.3f}, {d[2]:+.3f}) | {A:.1f} | {100 * part.parea[part.pdir == i].sum() / part.parea.sum():.1f}% |")
    cls_area = lambda c: 100 * part.parea[part.pclass == c].sum() / part.parea.sum()
    from .brief import DIALECT, faces_digest
    md = f"""# Job brief (3+2 indexed 5-axis): {part.name}

{s.get('description', '')}

- Material **AL6061-T6**, tolerance **+-{TOL} mm** on every scored surface.
- **Fixture frame (G54):** part bottom (the face towards the vise stub, machined in the part-off) at **Z0**, part centred in XY. Part bbox X [{bb[0]:.2f}, {bb[3]:.2f}]
  Y [{bb[1]:.2f}, {bb[4]:.2f}] Z [{bb[2]:.2f}, {bb[5]:.2f}].
- **Orientation chosen:** model axis `{fx['up']}` points up, then rotated {fx['rot_z_deg']:g} deg about Z, scale {fx.get('scale', 1)}.
- **Stock:** box X [{lo[0]:.2f}, {hi[0]:.2f}] Y [{lo[1]:.2f}, {hi[1]:.2f}] Z [{lo[2]:.2f}, {hi[2]:.2f}]: part + {fx['margin']:g} mm sides,
  + {fx['top']:g} mm top, plus a **stub** below Z0: {fx['gap']:g} mm clearance gap (Z {-fx['gap']:g}..0) and {fx['grip']:g} mm
  gripped in the vise (Z {lo[2]:g}..{-fx['gap']:g}).
- **Vise:** jaws clamp the stub on its -Y and +Y faces (jaws 15 mm thick, top at Z{-fx['gap']:g}, extending 10 mm beyond the
  stock in X); vise body below; table below that. Boxes are in `setup.json` ("vise"). Tool and holder must never
  touch them, in any orientation.
- **Machine:** trunnion 5-axis (A tilt <= 110 deg, C unlimited), 3+2 only (no simultaneous 5-axis).
- **Every face is scored, including the underside (the face towards the stub).** Only the 0.03 mm face-edge band and
  the tab witness are not scored. Reach hint: the harness's quick search (smallest tools, 26 cube directions + feature
  axes, holder-aware) found a tool and direction for {cls_area(0):.1f}% of the surface; for {cls_area(2):.1f}% it found
  none (`reach_hint.png`). That is a hint, not an excuse: those areas count, so plan them.

## Files
`part.step`, `part.stl` (fixture frame, mm), `faces.json`, `setup.json` (stock, vise boxes, fixture), images
(`target_iso.png`, `reach_hint.png`).

## Tool directions that reach the surface (greedy cover found by the harness's quick search - a hint, not a plan)
| tool axis (G54) | tilt A deg | share of surface first reached |
|---|---|---|
{chr(10).join(rows)}

## G-code dialect
{DIALECT}
{DIALECT5}
## Checks and score
{RULES5}
## Tool library
{library_table()}

Tool body: cutting profile up to the flute length, then the shank (same diameter) up to the stick-out, then the holder
cylinder of the holder diameter from the stick-out upwards (checked for 50 mm). Necked long-reach tools: a neck no
wider than the cutter up to the neck length (the reach), then a wider shank up to the stick-out; material contact
above the neck length is a crash. Against the vise and table the body is checked exactly (discs along the tool axis)
with a 1.0 mm safety clearance. All endmills are centre-cutting; T9 is not.

## Geometry digest (fixture frame)
{faces_digest(part)}
"""
    (b / "brief.md").write_text(md)


DEV_COLORS = {"in_tol": "#3f9b5a", "witness": "#8e5bd0", "gouge": "#2160c4"}


def dev_colors(dev, score_cls=None):
    """Per-probe RGB: green within +-TOL; proud = orange -> dark red with magnitude (0.1 .. 1 mm); gouge = blue;
    tab witness = purple; the edge band takes the colour of its deviation like any probe."""
    from matplotlib.colors import to_rgb
    n = len(dev)
    rgb = np.tile(np.array(to_rgb(DEV_COLORS["in_tol"])), (n, 1))
    pr = dev > TOL
    t = np.clip((dev[pr] - TOL) / 0.9, 0, 1)[:, None]
    rgb[pr] = (1 - t) * np.array(to_rgb("#f39c34")) + t * np.array(to_rgb("#8f1414"))
    rgb[dev < -TOL] = to_rgb(DEV_COLORS["gouge"])
    if score_cls is not None:
        rgb[score_cls == 1] = to_rgb(DEV_COLORS["witness"])
    return rgb


def _zbuffer(u, v, depth, rgb, px):
    """Nearest-probe-per-pixel render of a probe cloud (orthographic): returns an RGBA image (origin lower) and its
    extent. Pixels whose front probe lies clearly behind the local front (a gap in the outer surface showing an inner
    one) are filled from the front neighbours, so inner surfaces do not bleed through."""
    from scipy import ndimage
    u0, v0 = u.min() - px, v.min() - px
    nu = int((u.max() - u0) / px) + 2
    nv = int((v.max() - v0) / px) + 2
    iu = ((u - u0) / px).astype(int)
    iv = ((v - v0) / px).astype(int)
    pid = iv * nu + iu
    order = np.lexsort((depth, pid))                  # by pixel, then depth ascending: last per pixel = nearest
    last = np.r_[pid[order][1:] != pid[order][:-1], True]
    sel = order[last]
    D = np.full(nv * nu, -np.inf)
    C = np.zeros((nv * nu, 3))
    D[pid[sel]] = depth[sel]
    C[pid[sel]] = rgb[sel]
    D = D.reshape(nv, nu)
    C = C.reshape(nv, nu, 3)
    filled = np.isfinite(D)
    front = ndimage.maximum_filter(np.where(filled, D, -1e9), size=5)
    good = filled & (D >= front - 1.0)               # front-most surface pixels
    sil = ndimage.binary_closing(filled, structure=np.ones((3, 3)), iterations=2) | filled
    lab, nlab = ndimage.label(~sil)                  # small enclosed gaps are sampling holes, not real holes
    if nlab:
        sizes = np.bincount(lab.ravel())
        border = np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])
        small = sizes < max(40, int(4.0 / (px * px)))
        small[border] = False
        small[0] = False
        sil |= small[lab]
    hole = sil & ~good
    _, (ii, jj) = ndimage.distance_transform_edt(~good, return_indices=True)
    C[hole] = C[ii[hole], jj[hole]]
    img = np.dstack([C, sil.astype(float)])
    return img, (u0, u0 + nu * px, v0, v0 + nv * px)


def iso_png(P, N, path, title, rgb=None):
    """Shaded isometric renders of the part from its probe cloud (z-buffered, Lambert + ambient light), from two
    opposite corners so every side face is seen once. Axes arrows show the fixture frame."""
    import matplotlib.pyplot as plt
    from scipy.spatial import cKDTree
    base = np.array([0.62, 0.66, 0.72]) if rgb is None else rgb
    ext = P.max(0) - P.min(0)
    sub = P[np.random.default_rng(0).choice(len(P), size=min(len(P), 20000), replace=False)]
    px = max(ext.max() / 1100.0, 1.05 * float(np.median(cKDTree(P).query(sub, k=2)[0][:, 1])))
    fig, axs = plt.subplots(1, 2, figsize=(15, 7), dpi=110)
    for ax, (az, name) in zip(axs, ((-45.0, "from +X -Y (front right), above"), (135.0, "from -X +Y (back left), above"))):
        a = np.radians(az)
        el = np.radians(30.0)
        view = np.array([np.cos(el) * np.cos(a), np.cos(el) * np.sin(a), np.sin(el)])   # towards the viewer
        right = np.array([-np.sin(a), np.cos(a), 0.0])
        up = np.cross(view, right)
        light = view * 0.6 + up * 0.6 + right * 0.3
        light /= np.linalg.norm(light)
        lam = np.clip(N @ light, 0, 1)
        facing = (N @ view) > -0.05
        shade = 0.35 + 0.65 * lam
        col = (base if base.ndim == 1 else base) * shade[:, None] if base.ndim == 1 else base * shade[:, None]
        col = np.clip(col, 0, 1)
        Q = P[facing]
        img, extent = _zbuffer(Q @ right, Q @ up, Q @ view, col[facing], px)
        ax.imshow(img, origin="lower", extent=extent, interpolation="nearest")
        o = np.array([extent[0] + 0.06 * (extent[1] - extent[0]), extent[2] + 0.08 * (extent[3] - extent[2])])
        L = 0.08 * max(extent[1] - extent[0], extent[3] - extent[2])
        for vec, lab, c in ((np.eye(3)[0], "X", "#c0392b"), (np.eye(3)[1], "Y", "#27ae60"), (np.eye(3)[2], "Z", "#2c6fbb")):
            d = np.array([vec @ right, vec @ up]) * L
            ax.annotate("", xy=o + d, xytext=o, arrowprops=dict(arrowstyle="->", color=c, lw=2))
            ax.text(*(o + d * 1.25), lab, color=c, fontsize=10, ha="center", va="center", weight="bold")
        ax.set_title(name, fontsize=10)
        ax.set_aspect("equal")
        ax.axis("off")
    fig.suptitle(title, fontsize=12)
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)


def _views_png(P, dev, cls, path, title, mode="dev", score_cls=None):
    """Six orthographic z-buffered views. Row 1: front, back, left, right (Z up); row 2: top and the underside.
    mode 'dev': green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness.
    mode 'class': reach hint (blue = the quick search found a tool, orange = it found none)."""
    import matplotlib.pyplot as plt
    from matplotlib.colors import to_rgb
    from matplotlib.lines import Line2D

    if mode == "class":
        rgb = np.where((cls == 2)[:, None], np.array(to_rgb("#e8822a")), np.array(to_rgb("#2a78d6")))
    else:
        rgb = dev_colors(dev, score_cls)
    from scipy.spatial import cKDTree
    ext = P.max(0) - P.min(0)
    sub = P[np.random.default_rng(0).choice(len(P), size=min(len(P), 20000), replace=False)]
    nn = cKDTree(P).query(sub, k=2)[0][:, 1]
    px = max(ext.max() / 1400.0, 1.05 * float(np.median(nn)))     # about one probe per pixel
    # (title, horizontal axis, vertical axis, depth axis, depth sign (+ = larger coordinate is nearer), mirror u)
    row1 = [("front (looking +Y)", 0, 2, 1, -1, False), ("back (looking -Y)", 0, 2, 1, 1, True),
            ("left side (looking +X)", 1, 2, 0, -1, True), ("right side (looking -X)", 1, 2, 0, 1, False)]
    if ext[1] > ext[0]:   # long in Y: lay the plan views along Y so they sit under the side views
        row2 = [("top (looking down; X up the page)", 1, 0, 2, 1, True),
                ("underside (looking up; X up the page)", 1, 0, 2, -1, False)]
        pw = ext[1]
        ph = ext[0]
    else:
        row2 = [("top (looking down)", 0, 1, 2, 1, False), ("underside (looking up)", 0, 1, 2, -1, True)]
        pw = ext[0]
        ph = ext[1]
    w1 = [ext[0], ext[0], ext[1], ext[1]]
    fig_w = 17.0
    h1 = fig_w * 0.92 * ext[2] / sum(w1)
    h2 = min(fig_w * 0.92 * ph / (2 * pw + max(ext[0], ext[1]) * 0.6), 7.5)
    fig = plt.figure(figsize=(fig_w, h1 + h2 + 1.9), dpi=110)
    top_frac = (h1 + 0.6) / (h1 + h2 + 1.9)
    gs1 = fig.add_gridspec(1, 4, width_ratios=w1, left=0.04, right=0.99, top=1 - 0.7 / (h1 + h2 + 1.9),
                           bottom=1 - top_frac - 0.02, wspace=0.12)
    gs2 = fig.add_gridspec(1, 3, width_ratios=[pw, pw, 0.6 * max(ext[0], ext[1])], left=0.04, right=0.99,
                           top=1 - top_frac - 0.07, bottom=0.09, wspace=0.12)
    axes = [fig.add_subplot(gs1[0, i]) for i in range(4)] + [fig.add_subplot(gs2[0, i]) for i in range(2)]
    for ax, (name, a_, b_, c_, sgn, mirror) in zip(axes, row1 + row2):
        u = -P[:, a_] if mirror else P[:, a_]
        img, extent = _zbuffer(u, P[:, b_], sgn * P[:, c_], rgb, px)
        ax.imshow(img, origin="lower", extent=extent, interpolation="nearest")
        ax.set_title(name, fontsize=10)
        ax.set_aspect("equal")
        ax.set_xlabel(("-" if mirror else "") + "XYZ"[a_] + " (mm)", fontsize=8)
        ax.set_ylabel("XYZ"[b_] + " (mm)", fontsize=8)
        ax.tick_params(labelsize=7)
    if mode == "class":
        handles = [Line2D([], [], marker="s", ls="", ms=9, color="#2a78d6", label="quick search found a tool + direction"),
                   Line2D([], [], marker="s", ls="", ms=9, color="#e8822a", label="no tool found by the quick search (still scored)")]
    else:
        handles = [Line2D([], [], marker="s", ls="", ms=9, color=DEV_COLORS["in_tol"], label=f"within ±{TOL:g} mm"),
                   Line2D([], [], marker="s", ls="", ms=9, color="#f39c34", label="proud 0.1–0.5 mm (material left)"),
                   Line2D([], [], marker="s", ls="", ms=9, color="#8f1414", label="proud ≥ 1 mm"),
                   Line2D([], [], marker="s", ls="", ms=9, color=DEV_COLORS["gouge"], label="gouge (too deep)"),
                   Line2D([], [], marker="s", ls="", ms=9, color=DEV_COLORS["witness"], label="tab witness (not scored)")]
    legend_ax = fig.add_subplot(gs2[0, 2])
    legend_ax.axis("off")
    legend_ax.legend(handles=handles, loc="center left", fontsize=10, frameon=False)
    fig.suptitle(title, fontsize=13, y=1 - 0.25 / (h1 + h2 + 1.9))
    fig.savefig(path)
    plt.close(fig)


# ------------------------------------------------------------------------------------------------ feedback
def regions5(part, res, voxel=1.0, max_regions=30):
    from scipy import ndimage
    from .feedback import _normal_class

    dev, cls, P, N = res["dev"], part.pclass, part.P, part.N
    scored = res["score_cls"] == 0
    M, frames = res["moves"], res["frames"]
    out = []
    for kind, mask in (("gouge", scored & (dev < -TOL)), ("proud", scored & (dev > TOL))):
        idx = np.where(mask)[0]
        if not len(idx):
            continue
        Q = P[idx]
        lo = Q.min(0) - voxel
        ijk = np.floor((Q - lo) / voxel).astype(int)
        occ = np.zeros(ijk.max(0) + 1, bool)
        occ[ijk[:, 0], ijk[:, 1], ijk[:, 2]] = True
        lab, nl = ndimage.label(occ, structure=np.ones((3, 3, 3)))
        pl = lab[ijk[:, 0], ijk[:, 1], ijk[:, 2]]
        for L in range(1, nl + 1):
            k = idx[pl == L]
            area = float(part.parea[k].sum())
            if area < 0.05:
                continue
            nm = N[k].mean(0)
            faces = np.bincount(part.pface[k])
            top = [int(f) for f in np.argsort(faces)[::-1][:3] if faces[f] > 0]
            fd = []
            for f in top:
                fi = next((x for x in part.faces if x["id"] == f), None)
                if fi:
                    fd.append(f"face {f} ({fi['type']}" + (f" r{fi['radius']:g}" if "radius" in fi else "") + ")")
            r = {"type": kind, "area_mm2": round(area, 2), "bbox": np.r_[P[k].min(0), P[k].max(0)].round(2).tolist(),
                 "dev_mean": round(float(dev[k].mean()), 3),
                 "dev_extreme": round(float(dev[k].min() if kind == "gouge" else dev[k].max()), 3),
                 "normal": [round(float(v), 2) for v in nm / max(np.linalg.norm(nm), 1e-9)], "faces": fd}
            r["nearest_passes"] = nearest5(M, frames, P[k], N[k], dev[k])
            r["hint"] = _region_hint(r, P[k], N[k], cls[k], part.parea[k])
            out.append(r)
    out.sort(key=lambda r: -r["area_mm2"])
    for i, r in enumerate(out[:max_regions]):
        r["id"] = i + 1
    return out[:max_regions]


def _region_hint(r, P, N, cls, area):
    """A diagnostic sentence for a failed region. It explains, it never excuses: the region counts as failed."""
    nm = np.asarray(r["normal"])
    under = nm[2] < -0.6 and P[:, 2].min() < 1.0
    no_tool = float(area[cls == 2].sum() / max(area.sum(), 1e-9))
    near = r.get("nearest_passes") or []
    bits = []
    if r["type"] == "gouge":
        if near:
            bits.append(f"failed (gouge): line {near[0]['line']} (T{near[0]['tool']}, frame {near[0]['frame']}) cut "
                        f"into the part here")
        else:
            bits.append("failed (gouge)")
    else:
        if not near:
            bits.append("failed: no cutting pass came near this area")
        elif near[0]["gap_mm"] > 0.05:
            bits.append(f"failed: no pass reached this; nearest pass line {near[0]['line']} (T{near[0]['tool']}, "
                        f"frame {near[0]['frame']}) missed by {near[0]['gap_mm']:g} mm")
        elif r["dev_mean"] > 0.5:
            bits.append(f"failed: a pass (line {near[0]['line']}, T{near[0]['tool']}) touches the edge of this area but "
                        f"{r['dev_mean']:+.2f} mm is left on average: the pass stops short of it, the tool cannot form "
                        "this shape, or the feature was not machined")
        else:
            bits.append(f"failed: passes reach the area (line {near[0]['line']}, T{near[0]['tool']}) but leave "
                        f"{r['dev_mean']:+.2f} mm on average: stepover / scallop, the tool radius, or a stop short")
    if under:
        bits.append("underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the "
                    "face) or with a tilted setup")
    if no_tool > 0.5:
        bits.append(f"the harness's quick reach search found no tool for {100 * no_tool:.0f}% of it (smallest tools, "
                    "26 cube directions + feature axes); the search is coarse, so try another direction, a longer or "
                    "smaller library tool, or a different fixture orientation (the area is scored either way)")
    return "; ".join(bits)


def pick_iteration5(hist: list) -> int:
    """Best valid iteration by whole-surface score (gouges weigh 5x); ties within 0.01 pts go to the shorter cycle."""
    valid = [h for h in hist if h["metrics"].get("valid")]
    pool = valid or hist

    def key(h):
        m = h["metrics"]
        return (round(m.get("whole_surface_in_tol_pct", 0) - 5 * m.get("whole_surface_gouge_pct", 0), 2),
                -m.get("cycle_time_min", 0))
    return max(pool, key=key)["iter"]


def nearest5(M, frames, P, N, dev, nsamp=30, top=4):
    cut = (M[:, 7] < 0.5) & (M[:, 6] > 0)
    rng = np.random.default_rng(0)
    s = rng.choice(len(P), size=min(nsamp, len(P)), replace=False)
    Q = P[s] + N[s] * (np.clip(dev[s], -1.0, 1.0) * 0.5)[:, None]   # a point inside the excess / gouged volume
    best = {}
    for k, fr in enumerate(frames):
        sel = np.where(cut & (M[:, 12] == k))[0]
        if not len(sel):
            continue
        R, o = fr["R"], fr["origin"]
        A, B = M[sel, 0:2], M[sel, 3:5]
        zlo = np.minimum(M[sel, 2], M[sel, 5])
        Rt = np.array([LIBRARY[int(t)].R for t in M[sel, 6]])
        for q in (Q - o) @ R:
            ab = B - A
            L2 = np.maximum((ab ** 2).sum(1), 1e-12)
            t = np.clip(((q[:2] - A) * ab).sum(1) / L2, 0, 1)
            gap = np.linalg.norm(A + ab * t[:, None] - q[:2], axis=1) - Rt
            gap = np.where(zlo <= q[2] + 0.05, gap, np.inf)
            for i in np.argsort(gap)[:top]:
                if not np.isfinite(gap[i]):
                    break
                ln = int(M[sel[i], 10])
                g = round(float(max(gap[i], 0.0)), 3)
                if ln not in best or g < best[ln]["gap_mm"]:
                    best[ln] = {"line": ln, "tool": int(M[sel[i], 6]), "frame": k, "gap_mm": g}
    return sorted(best.values(), key=lambda b: b["gap_mm"])[:top]


def write_feedback(part, res, out: Path, iteration=None):
    out.mkdir(parents=True, exist_ok=True)
    m = res["metrics"]
    regs = regions5(part, res)
    (out / "metrics.json").write_text(json.dumps(m, indent=1))
    (out / "regions.json").write_text(json.dumps(regs, indent=1))
    (out / "issues.json").write_text(json.dumps(res["issues"], indent=1, default=str))
    po = res.get("partoff") or {}
    (out / "setups.json").write_text(json.dumps({"segments": res["segments"], "rigidity": res["rigidity"],
                                                 "partoff": po}, indent=1, default=float))
    _views_png(part.P, res["dev"], part.pclass, out / "deviation_views.png",
               f"{part.name}: {m['whole_surface_in_tol_pct']:.2f}% of the whole surface within ±{TOL:g} mm "
               f"({'VALID' if m['valid'] else 'INVALID'})", score_cls=res["score_cls"])
    try:
        partoff_png(part, res, out / "partoff_closeup.png")
    except Exception as e:   # the feedback still works without the picture
        print(f"WARNING: part-off close-up not drawn ({e!r})")
    L = [f"# Simulation feedback{f' - iteration {iteration}' if iteration else ''}: {part.name} (3+2)\n",
         f"**Score: {m['whole_surface_in_tol_pct']:.3f}% of the whole part surface within +-{TOL} mm.** Program valid: "
         f"**{'YES' if m['valid'] else 'NO'}** ({m['errors']} errors, {m['warnings']} warnings). Not scored: tab witness "
         f"{m['tab_witness_pct']:.2f}% and the 0.03 mm face-edge band {m['edge_band_excluded_pct']:.2f}% (metrology). "
         "Everything else counts, including the underside.\n", "| metric | value |\n|---|---|"]
    for k in ["whole_surface_in_tol_pct", "whole_surface_gouge_pct", "whole_surface_proud_pct", "proud_area_mm2",
              "gouge_area_mm2", "max_gouge_mm", "max_proud_mm", "tab_witness_pct", "tabs", "tab_total_mm2",
              "tab_max_width_mm", "partoff_ok", "setups", "distinct_orientations", "cycle_time_min"]:
        L.append(f"| {k} | {m.get(k)} |")
    errs = [i for i in res["issues"] if i["severity"] == "error"]
    if errs:
        L.append("\n## Errors (must be fixed)\n")
        for i in errs[:40]:
            more = f" (lines {', '.join(map(str, i['lines'][:12]))})" if i.get("lines") else ""
            L.append(f"- line {i.get('line')}: {i['msg']}" + (f" x{i['count']}" if i.get("count") else "") + more)
    warns = [i for i in res["issues"] if i["severity"] == "warning"]
    if warns:
        L.append("\n## Warnings\n")
        L += [f"- line {i.get('line')}: {i['msg']}" + (f" x{i['count']}" if i.get("count") else "") for i in warns[:20]]
    L.append("\n## Setups (contiguous segments of one tool orientation)\n")
    L.append("| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |\n|---|---|---|---|---|---|---|")
    for s in res["segments"]:
        L.append(f"| {s['segment']} | {s['first_line']}-{s['last_line']} | {tuple(s['tool_axis'])} | {s['A_deg']:g} / {s['C_deg']:g} | "
                 f"{', '.join('T%d' % t for t in s['tools'])} | {s['moves']} | {s['removed_cm3']} |")
    rg = res["rigidity"]
    L.append(f"\n## Rigidity / part-off (connection area in the stub gap; stock section {rg['stock_section_mm2']} mm2; "
             f"part-off marker at line {rg['part_off_line']})\n")
    L.append("| after setup | line | area mm2 | fraction | islands | part-off |\n|---|---|---|---|---|---|")
    for c in rg["checks"]:
        L.append(f"| {c['after_segment']} | {c['line']} | {c['area_mm2']} | {c['fraction']:.3f} | {c['islands'][:4]} | {c['part_off']} |")
    if po:
        L.append(f"\n## Part-off: tabs and witness ({'OK' if po.get('ok') else 'FAILED'})\n")
        L.append(f"Weakest plane Z{po.get('weakest_z')}: {len(po.get('tabs', []))} tab(s), total {po.get('total_mm2')} mm2 "
                 f"(limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness "
                 f"{po.get('witness_mm2')} mm2 = {po.get('witness_pct')}% of the surface (limit 1.5 %, target 0.5 %); "
                 f"tab joint (proud material connected to the tabs) {po.get('joint_mm2')} mm2. Image: `partoff_closeup.png`.\n")
        if po.get("tabs"):
            L.append("| tab | area mm2 | width mm (smallest direction) | centre X Y Z |\n|---|---|---|---|")
            for i, t in enumerate(po["tabs"][:12], 1):
                L.append(f"| {i} | {t['area_mm2']} | {t['width_mm']} | {' '.join(f'{v:g}' for v in t['centroid'])} |")
        for r_ in po.get("reasons", []):
            L.append(f"- FAILED: {r_}")
    L.append("\n## Failed regions: out of tolerance (largest first; every face counts)\n")
    if not regs:
        L.append("None.")
    else:
        L.append("| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |\n|---|---|---|---|---|---|---|---|")
        for r in regs:
            L.append(f"| R{r['id']} | {r['type']} | {r['area_mm2']} | {' '.join(f'{v:g}' for v in r['bbox'])} | {tuple(r['normal'])} | "
                     f"{r['dev_mean']:+.3f} / {r['dev_extreme']:+.3f} | {'; '.join(r['faces'])} | {r.get('hint', '')} |")
    L.append(f"\nCycle time {m['cycle_time_min']:.1f} min (incl. {6:g} s per re-orientation). Images: `deviation_views.png` "
             "(6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.")
    (out / "feedback.md").write_text("\n".join(L) + "\n")
    return {"metrics": m, "regions": regs}


# ------------------------------------------------------------------------------------------------ commands
def cmd_suggest(a):
    res = suggest(Path(a.step), a.scale)
    print("\nranked (best first):")
    for r in res:
        print(json.dumps(r))


def cmd_new_run(a):
    step = Path(a.step)
    name = a.name or step.stem
    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    run = Path(a.runs) / name / (stamp + (f"-{a.label}" if a.label else ""))
    fx = json.loads(Path(a.fixture).read_text()) if a.fixture else {}
    pdir = run / "part"
    s = part5.place(step, fx, pdir)
    s["name"] = name
    s["description"] = a.description or f"{name} ({step.name}), machined 3+2 from AL6061 billet."
    (pdir / "setup.json").write_text(json.dumps(s, indent=1))
    p = part5.load(pdir)
    write_brief(p, run)
    meta = {"part": name, "part_dir": str(pdir.resolve()), "source_step": str(step.resolve()), "part_sha256": p.sha,
            "created": stamp, "label": a.label, "model": a.model, "mode": "3+2", "harness": harness_fp()}
    (run / "run.json").write_text(json.dumps(meta, indent=1))
    (run / "history.json").write_text("[]")
    print(run)


def cmd_sim(a):
    from . import sim5
    run = Path(a.run_dir)
    meta = json.loads((run / "run.json").read_text())
    p = part5.load(meta["part_dir"], verbose=False)
    hist = json.loads((run / "history.json").read_text())
    n = len(hist) + 1
    it = run / f"iter_{n:02d}"
    it.mkdir()
    shutil.copy(a.program, it / "program.nc")
    if a.note and Path(a.note).exists():
        shutil.copy(a.note, it / "notes.md")
    res = sim5.run((it / "program.nc").read_text(), p)
    fb = write_feedback(p, res, it, n)
    m = fb["metrics"]
    hist.append({"iter": n, "time": dt.datetime.now().isoformat(timespec="seconds"), "metrics": m,
                 "lines": res["program"].n_lines, "moves": int(len(res["moves"]))})
    (run / "history.json").write_text(json.dumps(hist, indent=1))
    print(f"iteration {n}: score {m['whole_surface_in_tol_pct']:.3f}% of the whole surface in tolerance, gouge "
          f"{m['whole_surface_gouge_pct']:.2f}%, proud {m['whole_surface_proud_pct']:.2f}%, tab witness "
          f"{m['tab_witness_pct']:.2f}%, valid={m['valid']} ({m['errors']} errors), {m['setups']} setups, "
          f"cycle {m['cycle_time_min']:.1f} min")
    print(f"feedback: {it / 'feedback.md'}")


FROZEN = REPO / "harness_frozen.json"
_SCAN_PAT = None


_CLI_OK = None


def scan_generator5(work: Path) -> dict:
    """Flag simulator / CAM-library use in the agent's own code (v2, closes review defect M3).
    Scanned: every code file under work/ (*.py, *.sh, *.bash, *.zsh, *.ipynb, and any file starting with '#!').
    Flagged in code (comments ignored): the harness package name except in the documented CLI calls
    `-m cncllm.x5 sim|evaluate|new-run|fixture-suggest`, millbill / cam_agent, __import__, importlib, and dynamic
    code execution (exec / eval / compile / runpy), plus the 3-axis scan's CAM-library imports."""
    import re
    from .cli import scan_generator
    base = scan_generator(work)
    hits = list(base["forbidden_imports"])
    cli_ok = re.compile(r"-m\s+cncllm\.x5\s+(sim|evaluate|new-run|fixture-suggest)\b")
    bad = re.compile(r"\bcncllm\b|__import__|\bimportlib\b|\brunpy\b|millbill|cam_agent|\bexec\s*\(|\beval\s*\(|"
                     r"\bcompile\s*\(")
    files = []
    for f in sorted(work.rglob("*")) if work.exists() else []:
        if not f.is_file() or f.stat().st_size > 5_000_000:
            continue
        code_ext = f.suffix.lower() in (".py", ".sh", ".bash", ".zsh", ".ipynb")
        if not code_ext:
            try:
                with open(f, "rb") as fh:
                    if fh.read(2) != b"#!":
                        continue
            except OSError:
                continue
        files.append(f.name)
        for ln, line in enumerate(f.read_text(errors="replace").splitlines(), 1):
            code = line.split("#", 1)[0] if not line.lstrip().startswith("#!") else ""
            code = cli_ok.sub("", code)
            code = re.sub(r"\bMILLBILL_DIR=\S+", "", code)     # the documented evaluate call sets this
            if bad.search(code):
                hits.append(f"{f.relative_to(work)}:{ln}: {code.strip()[:100]}")
    return {"files": sorted(set(base["files"] + files)), "forbidden_imports": sorted(set(hits)), "ok": not hits}


def verify_part(run: Path, meta: dict) -> list[str]:
    """v2 (closes review defect M4, part side): the part the run is scored on must be the run's own part/ folder and
    must equal the part regenerated from the tracked, unmodified source STEP with the recorded fixture."""
    import tempfile
    out = []
    src_in = Path(meta.get("source_step", ""))
    # the same tracked file inside THIS checkout (the frozen commit's copy): the longest path suffix that exists here
    rel = None
    parts_ = src_in.parts
    for k in range(1, len(parts_)):
        cand = Path(*parts_[k:])
        if (REPO / cand).is_file():
            rel = cand
            break
    if rel is None:
        return [f"source STEP {src_in} is not inside the repository"]
    src = REPO / rel
    tracked = subprocess.run(["git", "-C", str(REPO), "ls-files", "--error-unmatch", str(rel)], capture_output=True)
    dirty = subprocess.run(["git", "-C", str(REPO), "status", "--porcelain", "--", str(rel)], capture_output=True,
                           text=True).stdout.strip()
    if tracked.returncode != 0 or dirty:
        out.append(f"source STEP {rel} is not a tracked, unmodified repository file")
    mine = json.loads((run / "part" / "setup.json").read_text())
    with tempfile.TemporaryDirectory() as td:
        ref = part5.place(src, mine["fixture"], Path(td))
        import cadquery as cq
        a = cq.importers.importStep(str(run / "part" / "part.step")).val()
        b = cq.importers.importStep(str(Path(td) / "part.step")).val()
        va, vb, sa, sb = a.Volume(), b.Volume(), a.Area(), b.Area()
        ba, bb = a.BoundingBox(), b.BoundingBox()
        if abs(va - vb) > 1e-6 * max(vb, 1) or abs(sa - sb) > 1e-6 * max(sb, 1) or \
                max(abs(ba.xmin - bb.xmin), abs(ba.ymin - bb.ymin), abs(ba.zmin - bb.zmin), abs(ba.xmax - bb.xmax),
                    abs(ba.ymax - bb.ymax), abs(ba.zmax - bb.zmax)) > 1e-6:
            out.append("the run's part.step differs from the part regenerated from the source STEP and fixture")
        for k in ("stock", "vise", "part_bbox"):
            if json.dumps(ref[k], sort_keys=True) != json.dumps(mine[k], sort_keys=True):
                out.append(f"the run's setup.json '{k}' differs from the one regenerated from the fixture")
    return out


def integrity_failures(hv: dict, meta: dict, part_sha: str, scan: dict, frozen: dict | None) -> list[str]:
    """Reasons that make a trusted evaluation INVALID (ACCEPTANCE_REFINE I1): recorded is not enough."""
    out = []
    if frozen and frozen.get("sha256"):
        if hv.get("sha256") != frozen["sha256"]:
            out.append(f"harness code differs from the frozen harness (now {hv.get('sha256', '')[:12]}, frozen "
                       f"{frozen['sha256'][:12]} from {frozen.get('date', '?')})")
    elif hv.get("sha256") != meta.get("harness", {}).get("sha256"):
        out.append("harness code changed since the run started")
    if hv.get("harness_modified"):
        out.append(f"uncommitted changes in harness files: {', '.join(hv.get('modified_files', [])[:5])}")
    if part_sha != meta.get("part_sha256"):
        out.append("the part (STEP + fixture) changed since the run started")
    if not scan.get("ok", True):
        out.append(f"generator code uses the simulator or a CAM library: {'; '.join(scan.get('forbidden_imports', [])[:5])}")
    return out


def cmd_evaluate(a):
    run = Path(a.run_dir)
    hist = json.loads((run / "history.json").read_text())
    n = a.iter or pick_iteration5(hist)
    final = run / "final"
    final.mkdir(exist_ok=True)
    shutil.copy(run / f"iter_{n:02d}" / "program.nc", final / "program.nc")
    r = subprocess.run([sys.executable, "-I", "-c", "import sys; sys.path.insert(0, %r); from cncllm import x5; "
                        "x5._trusted_eval(%r, %d)" % (str(REPO), str(run), n)])
    if r.returncode:
        sys.exit("trusted evaluation failed")
    try:
        from . import report5
        print("report:", report5.build(run))
    except Exception as e:
        print(f"WARNING: report not built ({e!r})")


def _trusted_eval(run_dir, n):
    from . import cli, sim5
    run = Path(run_dir)
    meta = json.loads((run / "run.json").read_text())
    p = part5.load(run / "part", verbose=False)      # v2: always the run's own part folder, never a path from run.json
    final = run / "final"
    res = sim5.run((final / "program.nc").read_text(), p)
    hv = harness_fp()
    scan = scan_generator5(run / "work")
    frozen = json.loads(FROZEN.read_text()) if FROZEN.exists() else None
    fails = integrity_failures(hv, meta, p.sha, scan, frozen)
    try:
        fails += verify_part(run, meta)
    except Exception as e:
        fails.append(f"part verification failed to run: {e!r}")
    exp = os.environ.get("CNCLLM_EXPECTED_HARNESS")
    if exp and hv.get("sha256") != exp:
        fails.append(f"harness {hv.get('sha256', '')[:12]} is not the expected published harness {exp[:12]}")
    for f in fails:
        res["issues"].append({"severity": "error", "kind": "integrity", "line": None, "msg": "integrity: " + f})
    m = res["metrics"]
    m["errors"] = sum(1 for i in res["issues"] if i["severity"] == "error")
    m["valid"] = m["errors"] == 0
    write_feedback(p, res, final)
    save_probes(p, res, final)
    ev = {"iteration": n, "metrics": m,
          "integrity": {"ok": not fails, "failures": fails, "harness": hv, "frozen": frozen, "part_sha256_now": p.sha,
                        "part_unchanged": p.sha == meta["part_sha256"],
                        "harness_unchanged_since_run_start": hv["sha256"] == meta["harness"]["sha256"],
                        "generator_scan": scan, "repo": str(REPO)}}
    mb = os.environ.get("MILLBILL_DIR")
    if mb and Path(mb).exists():
        try:
            from . import crosscheck5
            ev["crosscheck_millbill"] = crosscheck5.run(p, res, (final / "program.nc").read_text(), mb)
        except Exception as e:
            ev["crosscheck_millbill"] = {"error": repr(e)}
    else:
        ev["crosscheck_millbill"] = {"skipped": "MILLBILL_DIR not set"}
    (final / "evaluation.json").write_text(json.dumps(ev, indent=1, default=float))
    try:
        from . import report5
        report5.export_data(p, res, final)
    except Exception as e:
        print(f"WARNING: viewer data not exported ({e!r})")
    print(json.dumps({"iteration": n, "metrics": res["metrics"]}, indent=1))


def save_probes(part, res, out: Path):
    """Probe dump for independent re-computation of the score (reviewer checklist A1)."""
    np.savez_compressed(out / "probes.npz", P=part.P.astype(np.float32), N=part.N.astype(np.float32),
                        area=part.parea, dev=np.asarray(res["dev"], np.float32), edge=part.pedge,
                        dev_raw=np.asarray(res.get("dev_raw", res["dev"]), np.float32),
                        witness=np.asarray(res["witness"], bool), score_cls=res["score_cls"],
                        reach_hint=part.pclass, face=part.pface.astype(np.int32), tol=np.float64(TOL))


def partoff_png(part, res, path: Path):
    """Part-off close-up: the underside (seen from below) coloured by deviation with the tabs marked, and the material
    section across the stub gap with the allowed tab band."""
    import matplotlib.pyplot as plt
    from matplotlib.lines import Line2D
    from scipy.spatial import cKDTree
    po = res.get("partoff") or {}
    P, dev, sc = part.P, np.asarray(res["dev"]), res["score_cls"]
    rgb = dev_colors(dev, sc)
    gap = part.fixture["gap"]
    ext = P.max(0) - P.min(0)
    long_y = ext[1] > ext[0]
    fig = plt.figure(figsize=(15, 5.2), dpi=110)
    gs = fig.add_gridspec(1, 2, width_ratios=[2.3, 1], left=0.05, right=0.98, top=0.8, bottom=0.2, wspace=0.18)
    ax = fig.add_subplot(gs[0, 0])
    under = P[:, 2] < max(1.0, 0.04 * ext[2])
    Q = P[under]
    sub = Q[np.random.default_rng(0).choice(len(Q), size=min(len(Q), 20000), replace=False)]
    px = max(ext.max() / 1400.0, 1.05 * float(np.median(cKDTree(Q).query(sub, k=2)[0][:, 1])))
    u, v = (Q[:, 1], Q[:, 0]) if long_y else (-Q[:, 0], Q[:, 1])
    img, extent = _zbuffer(u, v, -Q[:, 2], rgb[under], px)
    ax.imshow(img, origin="lower", extent=extent, interpolation="nearest")
    for i, t in enumerate(po.get("tabs", []), 1):
        cx, cy, _ = t["centroid"]
        tu, tv = (cy, cx) if long_y else (-cx, cy)
        ax.plot(tu, tv, marker="o", mfc="none", mec="k", ms=16, mew=1.6)
        ax.annotate(f"tab {i}: {t['area_mm2']:.1f} mm², {t['width_mm']:.1f} mm wide", (tu, tv),
                    xytext=(12, 16 if i % 2 else -30),
                    textcoords="offset points", fontsize=9,
                    bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="0.5", alpha=0.95))
    ax.set_aspect("equal")
    ax.set_xlabel("Y (mm)" if long_y else "-X (mm)")
    ax.set_ylabel("X (mm)" if long_y else "Y (mm)")
    ax.set_title("Underside of the part, seen from below, with the tabs that hold it to the stub", fontsize=10)
    ax2 = fig.add_subplot(gs[0, 1])
    planes = po.get("planes", [])
    if planes:
        z = [p_["z"] for p_ in planes]
        area = np.maximum([p_["area_mm2"] for p_ in planes], 0.5)
        ax2.axvspan(2, 30, color=DEV_COLORS["in_tol"], alpha=0.15, label="allowed tab total (2–30 mm²)")
        ax2.plot(area, z, "-o", ms=3, color="#333", label="material in the plane")
        if po.get("weakest_z") is not None:
            ax2.axhline(po["weakest_z"], color="#8e5bd0", lw=1, ls="--", label=f"weakest plane Z{po['weakest_z']:g}")
        ax2.set_xscale("log")
        ax2.set_xlim(0.5, max(area.max() * 1.5, 100))
        ax2.set_ylim(-gap, 0.6)
        ax2.set_xlabel("material cross-section (mm², log scale)")
        ax2.set_ylabel("height in the stub gap, Z (mm)")
        ax2.legend(fontsize=8, loc="lower right")
        ax2.grid(alpha=0.25, which="both")
    ax2.set_title("Stub gap: part above Z0, vise stub below", fontsize=10)
    status = "part-off OK" if po.get("ok") else "part-off FAILED"
    line1 = (f"{status}: {len(po.get('tabs', []))} tab(s), {po.get('total_mm2', 0):g} mm² in total; "
             f"tab witness {po.get('witness_pct', 0):.2f}% of the surface ({po.get('witness_mm2', 0):g} mm²)")
    reasons = "; ".join(po.get("reasons", []))
    fig.suptitle(line1 + (chr(10) + (reasons[:190] + ("…" if len(reasons) > 190 else "")) if reasons else ""), fontsize=11)
    handles = [Line2D([], [], marker="s", ls="", ms=9, color=DEV_COLORS["in_tol"], label=f"within ±{TOL:g} mm"),
               Line2D([], [], marker="s", ls="", ms=9, color="#f39c34", label="proud"),
               Line2D([], [], marker="s", ls="", ms=9, color="#8f1414", label="proud ≥ 1 mm"),
               Line2D([], [], marker="s", ls="", ms=9, color=DEV_COLORS["gouge"], label="gouge"),
               Line2D([], [], marker="s", ls="", ms=9, color=DEV_COLORS["witness"], label="tab witness (not scored)")]
    fig.legend(handles=handles, loc="lower left", ncol=5, fontsize=9, frameon=False, bbox_to_anchor=(0.05, 0.0))
    fig.savefig(path)
    plt.close(fig)


def cmd_rescore(a):
    """Re-score an existing run's final program with the current harness into a separate folder (old run untouched)."""
    from . import sim5
    run = Path(a.run_dir)
    meta = json.loads((run / "run.json").read_text())
    p = part5.load(Path(meta["part_dir"]) if Path(meta["part_dir"]).exists() else run / "part", verbose=True)
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    prog = (run / "final" / "program.nc").read_text()
    shutil.copy(run / "final" / "program.nc", out / "program.nc")
    res = sim5.run(prog, p)
    write_feedback(p, res, out)
    save_probes(p, res, out)
    (out / "rescore.json").write_text(json.dumps({"source_run": str(run), "harness": harness_fp(),
                                                  "metrics": res["metrics"]}, indent=1, default=float))
    print(json.dumps(res["metrics"], indent=1))


def main(argv=None):
    ap = argparse.ArgumentParser(prog="cncllm.x5")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("fixture-suggest"); s.add_argument("step"); s.add_argument("--scale", type=float, default=1.0)
    s.set_defaults(f=cmd_suggest)
    s = sub.add_parser("new-run"); s.add_argument("step"); s.add_argument("--fixture"); s.add_argument("--name")
    s.add_argument("--model", default=""); s.add_argument("--label", default=""); s.add_argument("--description", default="")
    s.add_argument("--runs", default=str(REPO / "runs")); s.set_defaults(f=cmd_new_run)
    s = sub.add_parser("sim"); s.add_argument("run_dir"); s.add_argument("program"); s.add_argument("--note")
    s.set_defaults(f=cmd_sim)
    s = sub.add_parser("evaluate"); s.add_argument("run_dir"); s.add_argument("--iter", type=int); s.set_defaults(f=cmd_evaluate)
    s = sub.add_parser("rescore"); s.add_argument("run_dir"); s.add_argument("out"); s.set_defaults(f=cmd_rescore)
    a = ap.parse_args(argv)
    a.f(a)


if __name__ == "__main__":
    main()
