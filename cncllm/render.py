"""Static images (matplotlib) for briefs and feedback: shaded height maps, deviation maps, iso views."""
from __future__ import annotations

import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.colors import LightSource, TwoSlopeNorm  # noqa: E402


def hillshade(H, res):
    ls = LightSource(azdeg=315, altdeg=40)
    return ls.hillshade(H, vert_exag=1.0, dx=res, dy=res)


def height_map_png(H, grid, path, title="", stock=None, levels=None, mask=None):
    x0, y0, res = grid["x0"], grid["y0"], grid["res"]
    ny, nx = H.shape
    ext = [x0, x0 + nx * res, y0, y0 + ny * res]
    fig, ax = plt.subplots(figsize=(10, 10 * ny / nx * 0.95 + 0.8), dpi=110)
    cmap = plt.get_cmap("viridis")
    vmax = float(H.max()) if H.size else 1.0
    rgb = cmap(H / max(vmax, 1e-9))[..., :3]
    sh = hillshade(H, res)[..., None]
    img = rgb * (0.45 + 0.55 * sh)
    if mask is not None:
        img[~mask] = 0.92
    ax.imshow(img, origin="lower", extent=ext, interpolation="nearest")
    sm = plt.cm.ScalarMappable(cmap=cmap, norm=plt.Normalize(0, vmax))
    fig.colorbar(sm, ax=ax, fraction=0.035, pad=0.02, label="Z (mm)")
    if levels is not None:
        xs = x0 + (np.arange(nx) + 0.5) * res
        ys = y0 + (np.arange(ny) + 0.5) * res
        ax.contour(xs, ys, H, levels=levels, colors="k", linewidths=0.4, alpha=0.6)
    if stock:
        ax.add_patch(plt.Rectangle((stock["x"][0], stock["y"][0]), stock["x"][1] - stock["x"][0],
                                   stock["y"][1] - stock["y"][0], fill=False, ec="red", lw=1, ls="--"))
    ax.set_xlabel("X (mm)")
    ax.set_ylabel("Y (mm)")
    ax.grid(True, color="w", alpha=0.35, lw=0.5)
    ax.set_title(title)
    ax.set_aspect("equal")
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)


def deviation_png(P, dev, cls, path, title="", tol=0.1, regions=None, stock=None):
    """Top view scatter of surface probes coloured by deviation; out-of-tolerance first-class markers on top."""
    fig, ax = plt.subplots(figsize=(11, 8), dpi=110)
    order = np.argsort(np.abs(dev))
    P, dev, cls = P[order], dev[order], cls[order]
    norm = TwoSlopeNorm(vmin=-1.0, vcenter=0.0, vmax=1.0)
    ok = (cls == 0) | (cls == 3)
    sc = ax.scatter(P[ok, 0], P[ok, 1], c=np.clip(dev[ok], -1, 1), cmap="coolwarm", norm=norm, s=1.2, lw=0)
    un = cls == 2
    if un.any():
        ax.scatter(P[un, 0], P[un, 1], c="#999999", s=0.6, lw=0, label="undercut (not machinable from +Z)")
    cb = fig.colorbar(sc, ax=ax, fraction=0.035, pad=0.02)
    cb.set_label("deviation (mm): blue = gouge, red = proud material; |dev| <= %.2f is in tolerance" % tol)
    if regions:
        for r in regions[:20]:
            b = r["bbox"]
            ax.add_patch(plt.Rectangle((b[0], b[1]), b[3] - b[0], b[4] - b[1], fill=False,
                                       ec="k" if r["type"] == "proud" else "magenta", lw=1.0))
            ax.text(b[0], b[4] + 0.3, f"R{r['id']}", fontsize=8, color="k")
    if stock:
        ax.add_patch(plt.Rectangle((stock["x"][0], stock["y"][0]), stock["x"][1] - stock["x"][0],
                                   stock["y"][1] - stock["y"][0], fill=False, ec="gray", lw=0.8, ls="--"))
    ax.set_aspect("equal")
    ax.set_xlabel("X (mm)")
    ax.set_ylabel("Y (mm)")
    ax.set_title(title)
    if un.any():
        ax.legend(loc="lower right", fontsize=8, markerscale=8)
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)


def section_png(Hs, labels, grid, axis, coord, path, title=""):
    """Profiles of height fields along a line (axis 'x': y=coord, varying x)."""
    x0, y0, res = grid["x0"], grid["y0"], grid["res"]
    fig, ax = plt.subplots(figsize=(11, 3.2), dpi=110)
    for H, lab in zip(Hs, labels):
        ny, nx = H.shape
        if axis == "x":
            i = int(round((coord - y0) / res - 0.5))
            xs = x0 + (np.arange(nx) + 0.5) * res
            ax.plot(xs, H[np.clip(i, 0, ny - 1), :], label=lab, lw=1)
        else:
            j = int(round((coord - x0) / res - 0.5))
            ys = y0 + (np.arange(ny) + 0.5) * res
            ax.plot(ys, H[:, np.clip(j, 0, nx - 1)], label=lab, lw=1)
    ax.set_xlabel("X (mm)" if axis == "x" else "Y (mm)")
    ax.set_ylabel("Z (mm)")
    ax.set_title(title)
    ax.legend(fontsize=8)
    ax.grid(alpha=0.3)
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)


def iso_png(V, F, path, title="", color=None, max_tris=60000):
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection

    if len(F) > max_tris:
        sel = np.random.default_rng(0).choice(len(F), max_tris, replace=False)
        F = F[sel]
    tri = V[F]
    n = np.cross(tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0])
    n /= np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-12)
    light = np.array([-0.4, -0.5, 0.75])
    light /= np.linalg.norm(light)
    sh = np.clip(n @ light, 0, 1) * 0.65 + 0.3
    base = np.array(color or [0.72, 0.75, 0.8])
    fc = np.clip(base[None, :] * sh[:, None], 0, 1)
    fig = plt.figure(figsize=(9, 7), dpi=110)
    ax = fig.add_subplot(111, projection="3d")
    pc = Poly3DCollection(tri, facecolors=fc, edgecolors="none")
    ax.add_collection3d(pc)
    lo, hi = V.min(0), V.max(0)
    c = (lo + hi) / 2
    r = (hi - lo).max() / 2
    ax.set_xlim(c[0] - r, c[0] + r)
    ax.set_ylim(c[1] - r, c[1] + r)
    ax.set_zlim(c[2] - r * 0.6, c[2] + r * 0.6)
    ax.set_box_aspect((1, 1, 0.6))
    ax.view_init(elev=35, azim=-60)
    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    ax.set_zlabel("Z")
    ax.set_title(title)
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)
