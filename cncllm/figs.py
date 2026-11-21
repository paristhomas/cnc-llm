"""Report-side figures (not part of the hashed harness: they only redraw data the trusted evaluation wrote).

partoff_closeup(): the part-off picture for the report, from final/probes.npz and setups.json["partoff"]:
  row 1: the whole underside seen from below, tabs circled; row 2: one zoomed panel per tab (8 mm around it) and the
  material section through the stub gap.
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np


def partoff_closeup(res_dir: Path, gap: float, out_png: Path) -> bool:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.lines import Line2D
    from scipy.spatial import cKDTree

    from .x5 import DEV_COLORS, _zbuffer, dev_colors

    res_dir = Path(res_dir)
    pz, sj = res_dir / "probes.npz", res_dir / "setups.json"
    if not pz.exists() or not sj.exists():
        return False
    z = np.load(pz)
    po = json.loads(sj.read_text()).get("partoff") or {}
    P = z["P"].astype(float)
    dev = z["dev"].astype(float)
    rgb = dev_colors(dev, z["score_cls"])
    ext = P.max(0) - P.min(0)
    long_y = ext[1] >= ext[0]
    under = P[:, 2] < max(1.0, 0.03 * ext[2])
    Q, C = P[under], rgb[under]
    sub = Q[np.random.default_rng(0).choice(len(Q), size=min(len(Q), 20000), replace=False)]
    px = max(ext.max() / 1400.0, 1.05 * float(np.median(cKDTree(Q).query(sub, k=2)[0][:, 1])))

    def uv(x, y):
        return (y, x) if long_y else (x, y)

    u, v = uv(Q[:, 0], Q[:, 1])
    tabs = po.get("tabs", [])[:4]
    nt = max(len(tabs), 1)
    fig = plt.figure(figsize=(14, 8.2), dpi=110)
    gs = fig.add_gridspec(2, nt + 1, height_ratios=[1.0, 1.25], width_ratios=[1] * nt + [1.25], left=0.06,
                          right=0.98, top=0.88, bottom=0.12, hspace=0.38, wspace=0.32)
    ax = fig.add_subplot(gs[0, :])
    img, extent = _zbuffer(u, v, -Q[:, 2], C, px)
    ax.imshow(img, origin="lower", extent=extent, interpolation="nearest")
    for i, t in enumerate(tabs, 1):
        tu, tv = uv(t["centroid"][0], t["centroid"][1])
        ax.plot(tu, tv, marker="o", mfc="none", mec="k", ms=18, mew=1.6)
        ax.text(tu, tv + 0.9 * (extent[3] - extent[2]) * 0.18, f"tab {i}", ha="center", va="bottom", fontsize=9,
                bbox=dict(boxstyle="round,pad=0.2", fc="white", ec="0.5"))
    ax.set_aspect("equal")
    ax.set_xlabel("Y (mm)" if long_y else "X (mm)")
    ax.set_ylabel("X (mm)" if long_y else "Y (mm)")
    ax.set_title("Underside seen from below: everything here is machined; the circles are the two tab joints", fontsize=10)
    for i, t in enumerate(tabs):
        axz = fig.add_subplot(gs[1, i])
        tu, tv = uv(t["centroid"][0], t["centroid"][1])
        win = 8.0
        m = (np.abs(u - tu) < win) & (np.abs(v - tv) < win)
        if m.sum() > 50:
            im2, ex2 = _zbuffer(u[m], v[m], -Q[m, 2], C[m], px)
            axz.imshow(im2, origin="lower", extent=ex2, interpolation="nearest")
        axz.set_xlim(tu - win, tu + win)
        axz.set_ylim(tv - win, tv + win)
        axz.set_aspect("equal")
        axz.set_title(f"tab {i + 1}: {t['area_mm2']:.1f} mm², {t['width_mm']:.1f} mm wide", fontsize=9)
        axz.tick_params(labelsize=7)
    axs = fig.add_subplot(gs[1, nt])
    planes = po.get("planes", [])
    if planes:
        zz = [p_["z"] for p_ in planes]
        area = np.maximum([p_["area_mm2"] for p_ in planes], 0.5)
        axs.axvspan(2, 30, color=DEV_COLORS["in_tol"], alpha=0.15, label="allowed tab total 2–30 mm²")
        axs.plot(area, zz, "-o", ms=3, color="#333", label="material in the plane")
        if po.get("weakest_z") is not None:
            axs.axhline(po["weakest_z"], color=DEV_COLORS["witness"], lw=1, ls="--", label=f"weakest plane Z{po['weakest_z']:g}")
        axs.set_xscale("log")
        axs.set_xlim(0.5, max(area.max() * 1.5, 100))
        axs.set_ylim(-gap, 0.6)
        axs.set_xlabel("material section (mm², log)", fontsize=8)
        axs.set_ylabel("Z in the stub gap (mm)", fontsize=8)
        axs.tick_params(labelsize=7)
        axs.legend(fontsize=7, loc="lower right")
        axs.grid(alpha=0.25, which="both")
    axs.set_title("Stub gap section (part above Z0)", fontsize=9)
    status = "Part-off OK" if po.get("ok") else "Part-off FAILED"
    fig.suptitle(f"{status}: {len(po.get('tabs', []))} tab(s), {po.get('total_mm2', 0):g} mm² in total · tab witness "
                 f"{po.get('witness_pct', 0):.2f}% of the surface ({po.get('witness_mm2', 0):g} mm²)", fontsize=12)
    handles = [Line2D([], [], marker="s", ls="", ms=9, color=DEV_COLORS["in_tol"], label="within ±0.1 mm"),
               Line2D([], [], marker="s", ls="", ms=9, color="#f39c34", label="proud"),
               Line2D([], [], marker="s", ls="", ms=9, color="#8f1414", label="proud ≥ 1 mm"),
               Line2D([], [], marker="s", ls="", ms=9, color=DEV_COLORS["gouge"], label="gouge"),
               Line2D([], [], marker="s", ls="", ms=9, color=DEV_COLORS["witness"], label="tab witness (not scored)")]
    fig.legend(handles=handles, loc="lower center", ncol=5, fontsize=9, frameon=False)
    fig.savefig(out_png)
    plt.close(fig)
    return True


def hero_png(res_dir: Path, out_png: Path, size_px: int = 900) -> bool:
    """Hero picture for the top of the report: the finished part (the evaluation's probe cloud), shaded, one iso view
    from the side with the most surface, coloured by result (green in tolerance, orange/red proud, blue gouge, purple
    tab witness), tightly cropped on a transparent background so it works in light and dark mode."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from scipy.spatial import cKDTree

    from .x5 import _zbuffer, dev_colors

    pz = Path(res_dir) / "probes.npz"
    if not pz.exists():
        return False
    z = np.load(pz)
    P, N = z["P"].astype(float), z["N"].astype(float)
    base = dev_colors(z["dev"].astype(float), z["score_cls"])
    best = None
    for az in (-45.0, 45.0, 135.0, -135.0):
        a, el = np.radians(az), np.radians(28.0)
        view = np.array([np.cos(el) * np.cos(a), np.cos(el) * np.sin(a), np.sin(el)])
        vis = float(z["area"][(N @ view) > 0.2].sum())
        if best is None or vis > best[0]:
            best = (vis, a, el, view)
    _, a, el, view = best
    right = np.array([-np.sin(a), np.cos(a), 0.0])
    up = np.cross(view, right)
    light = view * 0.55 + up * 0.7 + right * 0.25
    light /= np.linalg.norm(light)
    shade = 0.42 + 0.58 * np.clip(N @ light, 0, 1)
    col = np.clip(base * shade[:, None], 0, 1)
    facing = (N @ view) > -0.05
    Q = P[facing]
    ext = P.max(0) - P.min(0)
    sub = Q[np.random.default_rng(0).choice(len(Q), size=min(len(Q), 20000), replace=False)]
    px = max(ext.max() / 1000.0, 1.05 * float(np.median(cKDTree(P).query(sub, k=2)[0][:, 1])))
    img, extent = _zbuffer(Q @ right, Q @ up, Q @ view, col[facing], px)
    h, w = img.shape[:2]
    fig = plt.figure(figsize=(size_px / 100, size_px / 100 * h / w), dpi=100)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.imshow(img, origin="lower", extent=extent, interpolation="bilinear")
    ax.set_aspect("equal")
    ax.axis("off")
    fig.savefig(out_png, transparent=True)
    plt.close(fig)
    return True
