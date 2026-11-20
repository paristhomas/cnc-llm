"""3+2 cross-check against MillBill's exact swept-volume kernel (MIT, github.com/kulibinai/millbill).

MillBill's parser has no G68.2, so the moves (already in each tilted frame's coordinates) come from our parser; the
material classification is recomputed with MillBill's SweepSetup (one per frame, points transformed into the frame)
and its BoxWorkpiece logic, independently of our kernels.
"""
from __future__ import annotations

import sys

import numpy as np

from .tools import LIBRARY


def run(part, res, program_text, millbill_dir, n_random=150000, seed=7):
    sys.path.insert(0, str(millbill_dir))
    from cam_agent.services import exact as mb_exact  # type: ignore
    from cam_agent.services.voxel import Frame  # type: ignore

    M, frames = res["moves"], res["frames"]
    M = M[M[:, 6] > 0]
    trow, tkey = [], {}
    setups = []
    for k, fr in enumerate(frames):
        sel = M[M[:, 12] == k]
        if not len(sel):
            continue
        rows = []
        for mv in sel:
            r = tuple(LIBRARY[int(mv[6])].row())
            if r not in tkey:
                tkey[r] = len(trow)
                trow.append(list(r))
            rows.append(list(mv[:6]) + [tkey[r]])
        setups.append((fr["R"], fr["origin"], np.array(rows, float)))
    T = np.array(trow, float).reshape(-1, 5)
    sweeps = [(R, o, mb_exact.SweepSetup(Mk, T, Frame("+Z", [0.0, 0.0, 0.0]), cell=1.0)) for R, o, Mk in setups]
    lo, hi = part.stock_lo, part.stock_hi

    def mb_inside(P):
        ok = ((P >= lo - 1e-6) & (P <= hi + 1e-6)).all(1)
        for R, o, sw in sweeps:
            k = np.where(ok)[0]
            if not len(k):
                break
            ok[k] = sw.inside(np.ascontiguousarray((P[k] - o) @ R))
        return ok

    rng = np.random.default_rng(seed)
    k = rng.choice(len(part.P), size=min(len(part.P), 100000), replace=False)
    Q1 = part.P[k] + part.N[k] * rng.uniform(-0.3, 0.3, len(k))[:, None]
    Q2 = lo + (hi - lo) * rng.random((n_random, 3))
    Q = np.vstack([Q1, Q2])
    wp = res["workpiece"]
    ours, theirs = wp.inside(Q), mb_inside(Q)
    dis = ours != theirs
    noisy = np.zeros(len(Q), bool)
    if dis.any():
        idx = np.where(dis)[0]
        for d in np.vstack([np.eye(3), -np.eye(3)]) * 2e-3:
            noisy[idx] |= wp.inside(Q[idx] + d) != ours[idx]
    real = dis & ~noisy
    return {"points": int(len(Q)), "disagree": int(dis.sum()), "disagree_beyond_2um": int(real.sum()),
            "agreement_pct": round(100 * (1 - real.mean()), 5), "frames": len(sweeps),
            "note": "moves from our G68.2 parser; material classification by MillBill's kernel",
            "examples": Q[real][:10].round(4).tolist()}
