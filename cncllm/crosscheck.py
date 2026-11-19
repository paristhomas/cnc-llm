"""Independent cross-check of the simulator against MillBill (MIT, github.com/kulibinai/millbill).

MillBill's own G-code reader (cam_agent.services.gcode) and its exact swept-volume point query
(cam_agent.services.exact.SweepSetup / BoxWorkpiece) re-evaluate the program; only the tool geometry rows are shared.
We compare inside/outside material classification at probe points near the target surface and at random points in
the stock. Disagreement beyond floating-point noise indicates a simulator bug (or a parser disagreement).

Usage: python -m cncllm.crosscheck <part_dir> <program.nc> [--millbill PATH]   (or MILLBILL_DIR env var)
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

import numpy as np

from . import part as part_mod
from . import sim
from .tools import LIBRARY


def millbill_inside(millbill_dir: str, program: Path, P: np.ndarray, stock_lo, stock_hi) -> np.ndarray:
    sys.path.insert(0, str(millbill_dir))
    from cam_agent.services import gcode as mb_gcode, exact as mb_exact  # type: ignore
    from cam_agent.services.voxel import Frame  # type: ignore

    parsed = mb_gcode.parse(str(program), arc_tol=0.0005)
    rows, trows, tkey = [], [], {}
    for op in parsed["ops"]:
        tn = op["tool"]
        if tn is None:
            continue
        r = LIBRARY[int(tn)].row()
        key = tuple(r)
        if key not in tkey:
            tkey[key] = len(trows)
            trows.append(r)
        ti = tkey[key]
        rows += [tuple(mv[:6]) + (ti,) for mv in op["moves"]]
    M = np.asarray(rows, np.float64).reshape(-1, 7)
    T = np.asarray(trows, np.float64).reshape(-1, 5)
    st = mb_exact.SweepSetup(M, T, Frame("+Z", [0.0, 0.0, 0.0]), cell=1.0)
    wp = mb_exact.BoxWorkpiece(stock_lo, stock_hi, [st])
    return wp.inside(np.ascontiguousarray(P, np.float64)), {"moves": len(M), "warnings": parsed["warnings"][:5]}


def run(part_dir, program, millbill_dir, n_random=200000, seed=7) -> dict:
    p = part_mod.load(part_dir, verbose=False)
    text = Path(program).read_text()
    prog = sim.gcode.parse(text)
    wp = sim.Workpiece(prog.moves, p)
    rng = np.random.default_rng(seed)
    # near-surface points (both sides) + uniform points in the stock
    k = rng.choice(len(p.P), size=min(len(p.P), 100000), replace=False)
    off = rng.uniform(-0.3, 0.3, size=len(k))
    Q1 = p.P[k] + p.N[k] * off[:, None]
    lo, hi = p.stock_lo, p.stock_hi
    Q2 = lo + (hi - lo) * rng.random((n_random, 3))
    Q = np.vstack([Q1, Q2])
    ours = wp.inside(Q)
    theirs, info = millbill_inside(millbill_dir, Path(program), Q, lo, hi)
    dis = ours != theirs
    # disagreements within 2 um of a boundary are floating-point noise: re-test with nudges
    noisy = np.zeros(len(Q), bool)
    if dis.any():
        idx = np.where(dis)[0]
        for d in ([0, 0, 2e-3], [0, 0, -2e-3]):
            a = wp.inside(Q[idx] + d)
            noisy[idx] |= a != ours[idx]
    real = dis & ~noisy
    res = {"points": int(len(Q)), "disagree": int(dis.sum()), "disagree_beyond_2um": int(real.sum()),
           "agreement_pct": round(100 * (1 - real.mean()), 5), "millbill": info,
           "examples": Q[real][:10].round(4).tolist()}
    return res


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("part")
    ap.add_argument("program")
    ap.add_argument("--millbill", default=os.environ.get("MILLBILL_DIR"))
    a = ap.parse_args(argv)
    if not a.millbill:
        sys.exit("set --millbill or MILLBILL_DIR to a checkout of github.com/kulibinai/millbill")
    print(json.dumps(run(a.part, a.program, a.millbill), indent=1))


if __name__ == "__main__":
    main()
