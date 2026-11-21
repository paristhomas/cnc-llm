"""Reach audit: can every area of a part be machined in 3+2 from a single vise fixture, and with which tool?

For each fixture orientation (the 12 that fixture-suggest considers, or the ones given), the part is placed in the
vise as the harness does it, probes are sampled on its surface, and a holder-aware reach search (the final part and
the vise as obstacles; column model per direction) is run over a dense direction set (26 cube directions + the part's
feature axes + a hemisphere sample down to the 110 deg tilt limit) with a tool set. Areas no tool reaches are
clustered into regions (area, bbox, normal, B-rep faces). "In principle": material order and fixturing during the
cut are not modelled here; the simulator checks those for a real program.

  python tools/reach_audit.py part.step --tools library|extended [--orient +Z:90,-Y:0] [--probes 60000] --out dir
"""
from __future__ import annotations

import argparse
import json
import math
import sys
import tempfile
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from cncllm import part5  # noqa: E402
from cncllm.part import _mesh_from_step, _sample  # noqa: E402
from cncllm.tools import LIBRARY, Tool  # noqa: E402

# tools from the library used by the search, with the raster each is evaluated on (mm)
LIB_TOOLS = [(4, 0.075), (8, 0.075), (3, 0.15), (7, 0.15), (2, 0.3), (6, 0.3), (1, 0.5), (5, 0.5)]


def candidate_tools():
    """Candidate additions (R4). Imported from cncllm.tools if they are in the library already."""
    try:
        from cncllm.tools import CANDIDATES
        return list(CANDIDATES)
    except ImportError:
        return []


def hemisphere(max_tilt=110.0, step_tilt=22.0, step_az=45.0):
    out = []
    for a in np.arange(step_tilt, max_tilt + 1e-6, step_tilt):
        for c in np.arange(0, 360, step_az):
            t, p = math.radians(a), math.radians(c)
            out.append([math.sin(t) * math.cos(p), math.sin(t) * math.sin(p), math.cos(t)])
    return np.array(out)


def audit_orientation(step, fx, tools, nprobe, verbose=False, res=0.15):
    with tempfile.TemporaryDirectory() as td:
        s = part5.place(step, fx, Path(td))
        V, F, TF, faces, _ = _mesh_from_step(Path(td) / "part.step", deflection=0.01)
    P, N, PF, PA = _sample(V, F, TF, nprobe, np.random.default_rng(1))
    dirs = part5.candidate_dirs(faces, np.eye(3))
    extra = [d for d in hemisphere() if not any(abs(d @ o - 1) < 1e-3 for o in dirs)]
    dirs = np.vstack([dirs, extra])
    t0 = time.time()
    best, btool = part5.reachability(V, F, s["vise"], np.array(s["stock"]["lo"]), np.array(s["stock"]["hi"]), P, N,
                                     dirs, res=res, tools=tools, return_tool=True, verbose=verbose)
    return {"setup": s, "P": P, "N": N, "PF": PF, "PA": PA, "faces": faces, "dirs": dirs, "best": best,
            "btool": btool, "seconds": time.time() - t0}


def regions(r, mask, voxel=1.0, min_area=0.5):
    from scipy import ndimage
    P, N, PA, PF, faces = r["P"], r["N"], r["PA"], r["PF"], r["faces"]
    idx = np.where(mask)[0]
    out = []
    if not len(idx):
        return out
    Q = P[idx]
    lo = Q.min(0) - voxel
    ijk = np.floor((Q - lo) / voxel).astype(int)
    occ = np.zeros(ijk.max(0) + 1, bool)
    occ[ijk[:, 0], ijk[:, 1], ijk[:, 2]] = True
    lab, nl = ndimage.label(occ, structure=np.ones((3, 3, 3)))
    pl = lab[ijk[:, 0], ijk[:, 1], ijk[:, 2]]
    total = PA.sum()
    for L in range(1, nl + 1):
        k = idx[pl == L]
        area = float(PA[k].sum() * (total / PA.sum()))
        if area < min_area:
            continue
        nm = N[k].mean(0)
        fc = np.bincount(PF[k])
        top = [int(f) for f in np.argsort(fc)[::-1][:3] if fc[f] > 0]
        fd = []
        for f in top:
            fi = next((x for x in faces if x["id"] == f), None)
            if fi:
                fd.append(f"face {f} {fi['type']}" + (f" r{fi['radius']:g}" if "radius" in fi else ""))
        out.append({"area_mm2": round(area, 1), "bbox": np.r_[P[k].min(0), P[k].max(0)].round(1).tolist(),
                    "normal": [round(float(v), 2) for v in nm / max(np.linalg.norm(nm), 1e-9)], "faces": fd})
    return sorted(out, key=lambda r: -r["area_mm2"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("step")
    ap.add_argument("--scale", type=float, default=1.0)
    ap.add_argument("--tools", default="library", choices=["library", "extended"])
    ap.add_argument("--orient", default="all")
    ap.add_argument("--probes", type=int, default=60000)
    ap.add_argument("--gap", type=float, default=24.0)
    ap.add_argument("--out", required=True)
    ap.add_argument("--verbose", action="store_true")
    ap.add_argument("--res", type=float, default=0.15)
    a = ap.parse_args()
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    tools = list(LIB_TOOLS)
    names = [LIBRARY[t].name for t, _ in tools]
    if a.tools == "extended":
        for t in candidate_tools():
            tools.append((t, 0.075 if t.diameter <= 2 else 0.15 if t.diameter <= 4 else 0.3))
            names.append(f"T{t.number} {t.name}")
    if a.orient == "all":
        ors = [(u, r) for u in ["+Z", "-Z", "+X", "-X", "+Y", "-Y"] for r in (0.0, 90.0)]
    else:
        ors = [(o.split(":")[0], float(o.split(":")[1])) for o in a.orient.split(",")]
    summary = []
    for up, rz in ors:
        fx = {"up": up, "rot_z_deg": rz, "scale": a.scale, "gap": a.gap, "grip": 8, "margin": 3, "top": 1.5}
        r = audit_orientation(Path(a.step), fx, tools, a.probes, a.verbose, a.res)
        miss = r["best"] < 0
        PA = r["PA"]
        bb = r["setup"]["part_bbox"]
        used = np.bincount(r["btool"][r["btool"] >= 0], minlength=len(tools))
        row = {"up": up, "rot_z_deg": rz, "no_tool_pct": round(float(100 * PA[miss].sum() / PA.sum()), 3),
               "no_tool_mm2": round(float(PA[miss].sum()), 1), "surface_mm2": round(float(PA.sum()), 1),
               "height_mm": round(bb[5] - bb[2], 1), "footprint_mm": [round(bb[3] - bb[0], 1), round(bb[4] - bb[1], 1)],
               "tools_first_reaching_pct": {names[i]: round(float(100 * PA[r["btool"] == i].sum() / PA.sum()), 2)
                                            for i in range(len(tools)) if used[i]},
               "regions": regions(r, miss)[:25], "seconds": round(r["seconds"], 1)}
        summary.append(row)
        print(json.dumps({k: row[k] for k in ("up", "rot_z_deg", "no_tool_pct", "no_tool_mm2", "seconds")}), flush=True)
        np.savez_compressed(out / f"reach_{up}_{int(rz)}_{a.tools}.npz", P=r["P"].astype(np.float32), N=r["N"].astype(np.float32),
                            area=PA, best=r["best"], tool=r["btool"], dirs=r["dirs"])
    summary.sort(key=lambda r: r["no_tool_pct"])
    (out / f"audit_{a.tools}.json").write_text(json.dumps({"step": a.step, "scale": a.scale, "tools": names,
                                                           "orientations": summary}, indent=1))


if __name__ == "__main__":
    main()
