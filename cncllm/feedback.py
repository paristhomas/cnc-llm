"""Turn a simulation result into feedback for the LLM: defect regions, attribution to G-code lines, images, markdown."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from scipy import ndimage

from . import render
from .part import Part, TOL
from .tools import LIBRARY


def _normal_class(n):
    if n[2] > 0.95:
        return "floor/top (faces up)"
    if abs(n[2]) < 0.1:
        return "wall (vertical)"
    if n[2] > 0:
        return "slope/curved (faces up)"
    return "faces down"


def nearest_moves(M, P, N, dev, nsamp=40, top=4):
    """Cutting moves whose tool came closest (in XY, tool edge to point) to the region, at a tip height that could have
    cut it. Tells the programmer which pass to extend and by how much."""
    from .tools import LIBRARY

    cut = np.where((M[:, 7] < 0.5) & (M[:, 6] > 0))[0]
    if not len(cut):
        return []
    rng = np.random.default_rng(0)
    s = rng.choice(len(P), size=min(nsamp, len(P)), replace=False)
    Q = P[s] + N[s] * np.minimum(dev[s], 1.0)[:, None] * 0.5   # a point inside the excess material
    A, B = M[cut, 0:2], M[cut, 3:5]
    zlo = np.minimum(M[cut, 2], M[cut, 5])
    R = np.array([LIBRARY[int(t)].R for t in M[cut, 6]])
    best = {}
    for q in Q:
        ab = B - A
        L2 = np.maximum((ab ** 2).sum(1), 1e-12)
        t = np.clip(((q[:2] - A) * ab).sum(1) / L2, 0, 1)
        dxy = np.linalg.norm(A + ab * t[:, None] - q[:2], axis=1)
        gap = dxy - R
        ok = zlo <= q[2] + 0.05          # tip low enough to have cut this height
        gap = np.where(ok, gap, np.inf)
        for i in np.argsort(gap)[:top]:
            if not np.isfinite(gap[i]):
                break
            ln = int(M[cut[i], 10])
            if ln not in best or gap[i] < best[ln]["gap_mm"]:
                best[ln] = {"line": ln, "tool": int(M[cut[i], 6]), "gap_mm": round(float(max(gap[i], 0.0)), 3)}
    return sorted(best.values(), key=lambda b: b["gap_mm"])[:top]


def regions(part: Part, res: dict, voxel: float = 1.0, max_regions: int = 40) -> list[dict]:
    dev, cls, P, N = res["dev"], part.pclass, part.P, part.N
    M = res["moves"]
    out = []
    edge = part.pedge if part.pedge is not None else np.zeros(len(cls), bool)
    for kind, mask in (("gouge", (cls != 1) & (cls != 2) & ~edge & (dev < -TOL)), ("proud", (cls == 0) & ~edge & (dev > TOL))):
        idx = np.where(mask)[0]
        if not len(idx):
            continue
        Q = P[idx]
        lo = Q.min(0) - voxel
        ijk = np.floor((Q - lo) / voxel).astype(int)
        shape = ijk.max(0) + 1
        occ = np.zeros(shape, bool)
        occ[ijk[:, 0], ijk[:, 1], ijk[:, 2]] = True
        lab, nlab = ndimage.label(occ, structure=np.ones((3, 3, 3)))
        pl = lab[ijk[:, 0], ijk[:, 1], ijk[:, 2]]
        for L in range(1, nlab + 1):
            k = idx[pl == L]
            area = float(part.parea[k].sum())
            if area < 0.05:
                continue
            d = dev[k]
            bb = np.r_[P[k].min(0), P[k].max(0)].round(2).tolist()
            faces = np.bincount(part.pface[k])
            top_faces = [int(f) for f in np.argsort(faces)[::-1][:3] if faces[f] > 0]
            fdesc = []
            for f in top_faces:
                fi = next((x for x in part.faces if x["id"] == f), None)
                if fi:
                    s = fi["type"]
                    if "radius" in fi:
                        s += f" r{fi['radius']:g}"
                    if "minor_radius" in fi:
                        s += f" fillet r{fi['minor_radius']:g}"
                    if "z" in fi:
                        s += f" z{fi['z']:g}"
                    fdesc.append(f"face {f} ({s})")
            nmean = N[k].mean(0)
            r = {"type": kind, "area_mm2": round(area, 2), "points": int(len(k)), "bbox": bb,
                 "dev_mean": round(float(d.mean()), 3), "dev_extreme": round(float(d.min() if kind == "gouge" else d.max()), 3),
                 "surface": _normal_class(nmean / max(np.linalg.norm(nmean), 1e-9)), "faces": fdesc}
            # attribution: for gouges the move that cut deepest just inside the surface
            if kind == "gouge" and len(M):
                q = P[k] - N[k] * np.minimum(np.abs(d)[:, None] * 0.5, 0.05)
                _, who = res["workpiece"].heights(q[:, 0], q[:, 1])
                who = who[who >= 0]
                if len(who):
                    lines, cnt = np.unique(M[who, 10].astype(int), return_counts=True)
                    o = np.argsort(cnt)[::-1][:6]
                    r["gcode_lines"] = lines[o].tolist()
                    r["tools"] = sorted(set(int(M[w, 6]) for w in who))
            elif kind == "proud" and len(M):
                near = nearest_moves(M, P[k], N[k], d)
                r["last_cut_by_lines"] = [n["line"] for n in near]
                r["nearest_passes"] = near
                if not near:
                    r["note"] = "no cutting move came near this region"
            out.append(r)
    out.sort(key=lambda r: -r["area_mm2"])
    for i, r in enumerate(out[:max_regions]):
        r["id"] = i + 1
    return out[:max_regions]


def write(part: Part, res: dict, out_dir, iteration: int | None = None) -> dict:
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    m = res["metrics"]
    regs = regions(part, res)
    (out / "metrics.json").write_text(json.dumps(m, indent=1))
    (out / "regions.json").write_text(json.dumps(regs, indent=1))
    (out / "issues.json").write_text(json.dumps(res["issues"], indent=1))
    g = res["grid"]
    stock = part.stock
    render.deviation_png(part.P, res["dev"], part.pclass, out / "deviation_top.png",
                         f"Surface deviation (top view) - {m['machinable_in_tol_pct']:.2f}% of machinable surface in tolerance",
                         regions=regs, stock=stock)
    render.height_map_png(res["H"], g, out / "machined_top.png", "Simulated machined part (height map, top view)",
                          stock=stock)
    diff = res["H"] - res["Ht"]
    _diff_png(diff, g, out / "height_error_top.png", stock)
    # sections through the part centre
    cx = (part.stock["x"][0] + part.stock["x"][1]) / 2
    cy = (part.stock["y"][0] + part.stock["y"][1]) / 2
    render.section_png([res["Ht"], res["H"]], ["target", "machined"], g, "x", cy, out / "section_x.png",
                       f"Section at Y={cy:g}")
    render.section_png([res["Ht"], res["H"]], ["target", "machined"], g, "y", cx, out / "section_y.png",
                       f"Section at X={cx:g}")
    md = markdown(part, res, regs, iteration)
    (out / "feedback.md").write_text(md)
    return {"metrics": m, "regions": regs}


def _diff_png(diff, g, path, stock):
    import matplotlib.pyplot as plt
    from matplotlib.colors import TwoSlopeNorm

    ny, nx = diff.shape
    ext = [g["x0"], g["x0"] + nx * g["res"], g["y0"], g["y0"] + ny * g["res"]]
    fig, ax = plt.subplots(figsize=(10, 10 * ny / nx * 0.95 + 0.8), dpi=110)
    im = ax.imshow(np.clip(diff, -1, 1), origin="lower", extent=ext, cmap="coolwarm",
                   norm=TwoSlopeNorm(vmin=-1, vcenter=0, vmax=1), interpolation="nearest")
    fig.colorbar(im, ax=ax, fraction=0.035, pad=0.02, label="machined top - target top (mm), clipped to +-1")
    ax.set_title("Height error seen from above (red = material left, blue = cut too deep)")
    ax.set_aspect("equal")
    ax.grid(True, alpha=0.3)
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)


def markdown(part: Part, res: dict, regs: list, iteration=None) -> str:
    m = res["metrics"]
    st = res["stats"]
    L = []
    L.append(f"# Simulation feedback{f' - iteration {iteration}' if iteration else ''}: {part.name}\n")
    L.append(f"**Score: {m['machinable_in_tol_pct']:.3f}% of the machinable surface within +-{TOL} mm** "
             f"(all non-datum surface: {m['all_in_tol_pct']:.2f}%).  Program valid: **{'YES' if m['valid'] else 'NO'}** "
             f"({m['errors']} errors, {m['warnings']} warnings).\n")
    L.append("| metric | value |\n|---|---|")
    for k in ["machinable_in_tol_pct", "machinable_gouge_pct", "machinable_proud_pct", "max_gouge_mm",
              "tool_limited_area_pct", "undercut_area_pct", "remaining_excess_cm3", "gouged_cm3", "removed_cm3",
              "cycle_time_min"]:
        L.append(f"| {k} | {m[k]} |")
    L.append("\nGouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool "
             "smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. "
             "Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges "
             "(normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field "
             "estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); "
             "the surface percentages are the exact measure.\n")
    errs = [i for i in res["issues"] if i["severity"] == "error"]
    warns = [i for i in res["issues"] if i["severity"] == "warning"]
    if errs:
        L.append("## Errors (the program would crash, break a tool or is not executable) - must be fixed\n")
        for i in errs[:40]:
            extra = f" x{i['count']}" if "count" in i else ""
            more = f" (lines {', '.join(map(str, i['lines'][:12]))}{'...' if len(i.get('lines', [])) > 12 else ''})" if "lines" in i else ""
            L.append(f"- line {i.get('line')}: {i['msg']}{extra}{more}")
        if len(errs) > 40:
            L.append(f"- ... {len(errs) - 40} more")
    if warns:
        L.append("\n## Warnings\n")
        for i in warns[:20]:
            extra = f" x{i['count']}" if "count" in i else ""
            L.append(f"- line {i.get('line')}: {i['msg']}{extra}")
    L.append("\n## Out-of-tolerance regions (largest first)\n")
    if not regs:
        L.append("None.\n")
    else:
        L.append("| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines (gouge: lines that cut it; proud: closest passes that could have reached it) |")
        L.append("|---|---|---|---|---|---|---|---|---|")
        for r in regs[:30]:
            lines = r.get("gcode_lines") or r.get("last_cut_by_lines") or []
            if r["type"] == "gouge":
                lab = ("cut by " + ", ".join(map(str, lines))) if lines else ""
            elif r.get("nearest_passes"):
                lab = "nearest passes: " + ", ".join(f"line {n['line']} T{n['tool']} missed by {n['gap_mm']:g} mm" for n in r["nearest_passes"][:3])
            else:
                lab = r.get("note", "")
            L.append(f"| R{r['id']} | {r['type']} | {r['area_mm2']} | {r['surface']} | {' '.join(f'{v:g}' for v in r['bbox'])} | "
                     f"{r['dev_mean']:+.3f} | {r['dev_extreme']:+.3f} | {'; '.join(r['faces'])} | {lab} |")
    L.append("\n## Tools\n")
    L.append("| T | tool | time s | cut length mm | removed cm3 |\n|---|---|---|---|---|")
    for t, d in st.get("per_tool", {}).items():
        L.append(f"| T{t} | {d['name']} | {d['time_s']} | {d['cut_mm']} | {d['removed_cm3']} |")
    L.append(f"\nMoves: {len(res['moves'])}, cut length {st['cut_length_mm']:.0f} mm, rapid length {st['rapid_length_mm']:.0f} mm, "
             f"estimated cycle time {m['cycle_time_min']:.1f} min.\n")
    L.append("Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, "
             "`machined_top.png`, `section_x.png`, `section_y.png`.")
    return "\n".join(L) + "\n"
