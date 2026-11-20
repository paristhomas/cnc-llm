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
- **Rigidity:** until the `(PART-OFF)` section the material connecting the part to the gripped stub (measured in the
  middle of the stub gap) must stay >= 50 % of the stock cross-section.
- **Part-off:** the program must end with a part-off section that cuts the stub gap down to <= 15 % of the section
  but leaves >= 2 mm2 (tabs or a thin web) so the part does not come loose in the machine; the operator breaks /
  saws it off and hand-finishes the bottom (parting) face, which is therefore not scored.
- Cutting data checks as in 3-axis (chip load, cut cross-section, plunges).
- Score: share of the **3+2-reachable** surface within +-0.1 mm (reachable = the smallest library flat or ball tool can
  reach it from some allowed tool direction without gouging the part or entering the vise). Surface no tool
  direction reaches is reported separately as "needs simultaneous 5-axis / a smaller tool".
"""


def harness_fp():
    from . import cli
    cli.CORE[:] = sorted(set(cli.CORE + ["part5.py", "sim5.py", "kernel5.py", "x5.py"]))
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
            dirs = part5.candidate_dirs(faces, np.eye(3))
            k = np.where(~part_face)[0]
            pd = part5.reachability(V, F, s["vise"], np.array(s["stock"]["lo"]), np.array(s["stock"]["hi"]), P[k],
                                    N[k], dirs, res=res)
            bb = s["part_bbox"]
            reach = float(PA[k][pd >= 0].sum() / PA[k].sum() * 100)
            out.append({"up": up, "rot_z_deg": rz, "reachable_pct": round(reach, 2),
                        "parting_face_pct": round(float(PA[part_face].sum() / PA.sum() * 100), 2),
                        "height_mm": round(bb[5] - bb[2], 1), "footprint_mm": [round(bb[3] - bb[0], 1), round(bb[4] - bb[1], 1)],
                        "directions_used": int(len(set(pd[pd >= 0].tolist())))})
            fp = out[-1]["footprint_mm"]
            slender = out[-1]["height_mm"] / max(min(fp), 1e-6)
            out[-1]["slenderness"] = round(slender, 2)
            # practical ranking: reachability, minus a penalty for tall slender stick-out (vibration, tool reach)
            out[-1]["suggest_score"] = round(reach - 5.0 * max(0.0, slender - 1.0), 2)
            print(json.dumps(out[-1]), flush=True)
    out.sort(key=lambda r: (-r["suggest_score"], r["height_mm"]))
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
    render.iso_png(part.V, part.F, b / "target_iso.png", f"{part.name}: in the fixture frame (Z0 = parting plane)")
    _views_png(part.P, None, part.pclass, b / "reachability.png", "Grey = not reachable in 3+2 (excluded); "
               "red = parting face (hand-finished); blue = scored", mode="class")
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
        rows.append(f"| ({d[0]:+.3f}, {d[1]:+.3f}, {d[2]:+.3f}) | {A:.1f} | {100 * part.parea[part.pdir == i].sum() / part.parea[part.pclass != 1].sum():.1f}% |")
    cls_area = lambda c: 100 * part.parea[part.pclass == c].sum() / part.parea.sum()
    from .brief import DIALECT, faces_digest
    md = f"""# Job brief (3+2 indexed 5-axis): {part.name}

{s.get('description', '')}

- Material **AL6061-T6**, tolerance **+-{TOL} mm** on every scored surface.
- **Fixture frame (G54):** part bottom = parting plane at **Z0**, part centred in XY. Part bbox X [{bb[0]:.2f}, {bb[3]:.2f}]
  Y [{bb[1]:.2f}, {bb[4]:.2f}] Z [{bb[2]:.2f}, {bb[5]:.2f}].
- **Orientation chosen:** model axis `{fx['up']}` points up, then rotated {fx['rot_z_deg']:g} deg about Z, scale {fx.get('scale', 1)}.
- **Stock:** box X [{lo[0]:.2f}, {hi[0]:.2f}] Y [{lo[1]:.2f}, {hi[1]:.2f}] Z [{lo[2]:.2f}, {hi[2]:.2f}]: part + {fx['margin']:g} mm sides,
  + {fx['top']:g} mm top, plus a **stub** below Z0: {fx['gap']:g} mm clearance gap (Z {-fx['gap']:g}..0) and {fx['grip']:g} mm
  gripped in the vise (Z {lo[2]:g}..{-fx['gap']:g}).
- **Vise:** jaws clamp the stub on its -Y and +Y faces (jaws 15 mm thick, top at Z{-fx['gap']:g}, extending 10 mm beyond the
  stock in X); vise body below; table below that. Boxes are in `setup.json` ("vise"). Tool and holder must never
  touch them, in any orientation.
- **Machine:** trunnion 5-axis (A tilt <= 110 deg, C unlimited), 3+2 only (no simultaneous 5-axis).
- Surface classes: scored {cls_area(0):.1f}%, parting face (hand-finished) {cls_area(1):.1f}%, **not reachable in 3+2 with
  the library {cls_area(2):.1f}%** (excluded; see `reachability.png`).

## Files
`part.step`, `part.stl` (fixture frame, mm), `faces.json`, `setup.json` (stock, vise boxes, fixture), images.

## Tool directions that reach the surface (greedy cover found by the harness - a hint, not a plan)
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

Tool body: cutting profile up to the flute length, shank (same diameter) up to the stick-out, holder cylinder of the
holder diameter from the stick-out upwards (checked for 50 mm). All endmills are centre-cutting; T9 is not.

## Geometry digest (fixture frame)
{faces_digest(part)}
"""
    (b / "brief.md").write_text(md)


def _views_png(P, dev, cls, path, title, mode="dev"):
    import matplotlib.pyplot as plt
    from matplotlib.colors import TwoSlopeNorm

    fig, axs = plt.subplots(2, 2, figsize=(12, 9), dpi=100)
    views = [("top (looking -Z)", 0, 1, 2, 1), ("front (looking +Y)", 0, 2, 1, -1), ("side (looking -X)", 1, 2, 0, 1),
             ("bottom (looking +Z)", 0, 1, 2, -1)]
    for ax, (name, a, b, c, sgn) in zip(axs.ravel(), views):
        order = np.argsort(sgn * P[:, c])
        Q = P[order]
        if mode == "class":
            col = np.where(cls[order] == 2, "#9a9ea6", np.where(cls[order] == 1, "#d0452f", "#2a78d6"))
            ax.scatter(Q[:, a], Q[:, b], c=col, s=0.6, lw=0)
        else:
            d = dev[order]
            ok = cls[order] != 2
            ax.scatter(Q[~ok, a], Q[~ok, b], c="#b8bcc4", s=0.5, lw=0)
            sc = ax.scatter(Q[ok, a], Q[ok, b], c=np.clip(d[ok], -1, 1), cmap="coolwarm",
                            norm=TwoSlopeNorm(vmin=-1, vcenter=0, vmax=1), s=0.6, lw=0)
        ax.set_title(name, fontsize=10)
        ax.set_aspect("equal")
        ax.set_xlabel("XYZ"[a])
        ax.set_ylabel("XYZ"[b])
    if mode != "class":
        fig.colorbar(sc, ax=axs, fraction=0.025, label="deviation mm (blue gouge, red proud); grey = not reachable")
    fig.suptitle(title)
    fig.savefig(path)
    plt.close(fig)


# ------------------------------------------------------------------------------------------------ feedback
def regions5(part, res, voxel=1.0, max_regions=30):
    from scipy import ndimage
    from .feedback import _normal_class

    dev, cls, P, N = res["dev"], part.pclass, part.P, part.N
    edge = part.pedge
    M, frames = res["moves"], res["frames"]
    out = []
    for kind, mask in (("gouge", (cls != 1) & ~edge & (dev < -TOL)), ("proud", (cls == 0) & ~edge & (dev > TOL))):
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
            out.append(r)
    out.sort(key=lambda r: -r["area_mm2"])
    for i, r in enumerate(out[:max_regions]):
        r["id"] = i + 1
    return out[:max_regions]


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
    (out / "setups.json").write_text(json.dumps({"segments": res["segments"], "rigidity": res["rigidity"]}, indent=1,
                                                default=float))
    _views_png(part.P, res["dev"], part.pclass, out / "deviation_views.png",
               f"Surface deviation - {m['machinable_in_tol_pct']:.3f}% of the reachable surface in tolerance")
    L = [f"# Simulation feedback{f' - iteration {iteration}' if iteration else ''}: {part.name} (3+2)\n",
         f"**Score: {m['machinable_in_tol_pct']:.3f}% of the 3+2-reachable surface within +-{TOL} mm** (whole non-parting "
         f"surface {m['all_in_tol_pct']:.3f}%). Program valid: **{'YES' if m['valid'] else 'NO'}** ({m['errors']} errors, "
         f"{m['warnings']} warnings).\n", "| metric | value |\n|---|---|"]
    for k in ["machinable_in_tol_pct", "machinable_gouge_pct", "machinable_proud_pct", "max_gouge_mm",
              "unreachable_area_pct", "parting_face_pct", "setups", "distinct_orientations", "final_connection_mm2",
              "cycle_time_min"]:
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
    L.append("\n## Out-of-tolerance regions (largest first; scored surface only)\n")
    if not regs:
        L.append("None.")
    else:
        L.append("| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |\n|---|---|---|---|---|---|---|---|")
        for r in regs:
            np_ = "; ".join(f"line {p['line']} T{p['tool']} frame {p['frame']} missed {p['gap_mm']:g}" for p in r["nearest_passes"][:3])
            L.append(f"| R{r['id']} | {r['type']} | {r['area_mm2']} | {' '.join(f'{v:g}' for v in r['bbox'])} | {tuple(r['normal'])} | "
                     f"{r['dev_mean']:+.3f} / {r['dev_extreme']:+.3f} | {'; '.join(r['faces'])} | {np_} |")
    L.append(f"\nCycle time {m['cycle_time_min']:.1f} min (incl. {6:g} s per re-orientation). Images: `deviation_views.png` "
             "(4 views; grey = not reachable).")
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
    print(f"iteration {n}: score {m['machinable_in_tol_pct']:.3f}% of reachable surface in tolerance, gouge "
          f"{m['machinable_gouge_pct']:.2f}%, proud {m['machinable_proud_pct']:.2f}%, valid={m['valid']} "
          f"({m['errors']} errors), {m['setups']} setups, cycle {m['cycle_time_min']:.1f} min")
    print(f"feedback: {it / 'feedback.md'}")


def cmd_evaluate(a):
    from .cli import pick_iteration
    run = Path(a.run_dir)
    hist = json.loads((run / "history.json").read_text())
    n = a.iter or pick_iteration(hist)
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
    p = part5.load(meta["part_dir"], verbose=False)
    final = run / "final"
    res = sim5.run((final / "program.nc").read_text(), p)
    write_feedback(p, res, final)
    hv = harness_fp()
    ev = {"iteration": n, "metrics": res["metrics"],
          "integrity": {"harness": hv, "part_sha256_now": p.sha, "part_unchanged": p.sha == meta["part_sha256"],
                        "harness_unchanged_since_run_start": hv["sha256"] == meta["harness"]["sha256"],
                        "generator_scan": cli.scan_generator(run / "work")}}
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
    a = ap.parse_args(argv)
    a.f(a)


if __name__ == "__main__":
    main()
