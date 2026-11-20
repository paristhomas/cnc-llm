"""Simulate a G-code program against a part: material removal, safety/plausibility checks and the surface metric.

Two independent evaluations of the same exact swept-volume model:
  * grid replay (simulate_grid) in program order -> height field for maps/visualisation, per-move removed volume,
    crash flags (rapid into material, spindle off, shank above flute length, holder collision), move attribution
  * exact point queries (column_heights) at surface probe points -> the surface deviation metric (grid-free)
"""
from __future__ import annotations

import json
import math
import time
from pathlib import Path

import numpy as np

from . import gcode, kernel
from .part import Part, TOL
from .tools import LIBRARY, MACHINE

SIM_RES = 0.1
MAX_CELLS = 9e6
CAP = 5.0            # deviation cap (mm)
EPS = 1e-3


def tool_tables():
    nums = sorted(LIBRARY)
    T = np.array([LIBRARY[n].row() for n in nums], np.float64)
    tool_rows = np.full(max(nums) + 1, -1, np.int64)
    for i, n in enumerate(nums):
        tool_rows[n] = i
    fl = np.array([LIBRARY[n].flute_length for n in nums])
    so = np.array([LIBRARY[n].stickout for n in nums])
    hr = np.array([LIBRARY[n].holder_diameter / 2 for n in nums])
    return nums, T, tool_rows, fl, so, hr


class Workpiece:
    """Exact remaining material after a program: inside(P) by column heights (box stock on Z0)."""

    def __init__(self, M: np.ndarray, part: Part):
        self.M = np.ascontiguousarray(M[:, :7]) if len(M) else np.zeros((0, 7))
        _, self.T, self.tool_rows, *_ = tool_tables()
        self.lo, self.hi = part.stock_lo, part.stock_hi
        self.cs = 1.0
        self.bx0, self.by0 = self.lo[0] - 1, self.lo[1] - 1
        self.nx = int((self.hi[0] - self.bx0) / self.cs) + 2
        self.ny = int((self.hi[1] - self.by0) / self.cs) + 2
        mm = self.M if len(self.M) else np.zeros((0, 7))
        self.start, self.idx, self.zmin = kernel.build_buckets(mm, self.T, self.tool_rows, self.bx0, self.by0, self.cs,
                                                               self.nx, self.ny)

    def heights(self, X, Y):
        X = np.ascontiguousarray(X, np.float64)
        Y = np.ascontiguousarray(Y, np.float64)
        if len(self.M) == 0:
            return np.full(len(X), self.hi[2]), np.full(len(X), -1)
        return kernel.column_heights(X, Y, self.M, self.T, self.tool_rows, self.start, self.idx, self.zmin,
                                     self.bx0, self.by0, self.cs, self.nx, self.ny, float(self.hi[2]))

    def inside(self, P):
        h, _ = self.heights(P[:, 0], P[:, 1])
        inxy = (P[:, 0] >= self.lo[0]) & (P[:, 0] <= self.hi[0]) & (P[:, 1] >= self.lo[1]) & (P[:, 1] <= self.hi[1])
        return inxy & (P[:, 2] >= 0.0) & (P[:, 2] < h)


def signed_deviation(wp: Workpiece, P, N):
    """+ proud (material left outside the target surface), - gouge (target material removed); capped at +-CAP."""
    n = len(P)
    dev = np.zeros(n)
    out_side = wp.inside(P + N * EPS)
    in_side = wp.inside(P - N * EPS)
    steps = np.array([TOL / 2, TOL, 0.2, 0.35, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0, CAP])

    def march(idx, sgn, want_inside):
        # find the first t in steps where inside(P + sgn N t) == want_inside, then bisect from the previous step
        lo_t = np.full(len(idx), EPS)
        hi_t = np.full(len(idx), np.inf)
        open_ = np.ones(len(idx), bool)
        for t in steps:
            if not open_.any():
                break
            k = np.where(open_)[0]
            q = P[idx[k]] + sgn * N[idx[k]] * t
            r = wp.inside(q) == want_inside
            hi_t[k[r]] = t
            lo_t[k[~r]] = t
            open_[k[r]] = False
        res = np.full(len(idx), CAP)
        k = np.where(np.isfinite(hi_t))[0]
        a, b = lo_t[k].copy(), hi_t[k].copy()
        for _ in range(14):
            m = (a + b) / 2
            q = P[idx[k]] + sgn * N[idx[k]] * m[:, None]
            r = wp.inside(q) == want_inside
            b = np.where(r, m, b)
            a = np.where(r, a, m)
        res[k] = (a + b) / 2
        return res

    proud = np.where(out_side)[0]
    if len(proud):
        dev[proud] = march(proud, 1.0, False)
    gouge = np.where(~out_side & ~in_side)[0]
    if len(gouge):
        dev[gouge] = -march(gouge, -1.0, True)
    return dev


def _grid_for(part: Part, res=SIM_RES):
    lo, hi = part.stock_lo, part.stock_hi
    pad = 1.0
    x0, y0 = lo[0] - pad, lo[1] - pad
    w, h = hi[0] - lo[0] + 2 * pad, hi[1] - lo[1] + 2 * pad
    res = max(res, math.sqrt(w * h / MAX_CELLS))
    nx, ny = int(math.ceil(w / res)), int(math.ceil(h / res))
    return x0, y0, res, nx, ny


def initial_height(part: Part, x0, y0, res, nx, ny):
    xs = x0 + (np.arange(nx) + 0.5) * res
    ys = y0 + (np.arange(ny) + 0.5) * res
    lo, hi = part.stock_lo, part.stock_hi
    inx = (xs >= lo[0]) & (xs <= hi[0])
    iny = (ys >= lo[1]) & (ys <= hi[1])
    H = np.zeros((ny, nx))
    H[np.ix_(iny, inx)] = hi[2]
    return H


def target_on_grid(part: Part, x0, y0, res, nx, ny):
    """Target top height and achievable top resampled (nearest) on the simulation grid."""
    g = part.grid
    xs = x0 + (np.arange(nx) + 0.5) * res
    ys = y0 + (np.arange(ny) + 0.5) * res
    jj = np.clip(((xs - g["x0"]) / g["res"] - 0.5).round().astype(int), 0, g["nx"] - 1)
    ii = np.clip(((ys - g["y0"]) / g["res"] - 0.5).round().astype(int), 0, g["ny"] - 1)
    return part.Ht[np.ix_(ii, jj)], part.Hach[np.ix_(ii, jj)]


def run(program_text: str, part: Part, res: float = SIM_RES, verbose: bool = True) -> dict:
    t0 = time.time()
    prog = gcode.parse(program_text)
    M = prog.moves
    nums, T, tool_rows, fl, so, hr = tool_tables()
    x0, y0, res, nx, ny = _grid_for(part, res)
    H = initial_height(part, x0, y0, res, nx, ny)
    owner = np.full(H.shape, -1, np.int64)
    cblock = 20
    coarse = np.zeros(((ny + cblock - 1) // cblock, (nx + cblock - 1) // cblock))
    for ci in range(coarse.shape[0]):
        for cj in range(coarse.shape[1]):
            coarse[ci, cj] = H[ci * cblock:(ci + 1) * cblock, cj * cblock:(cj + 1) * cblock].max()
    t1 = time.time()
    if len(M):
        vol, thick, flags = kernel.simulate_grid(np.ascontiguousarray(M), T, tool_rows, H, owner, x0, y0, res, fl, so, hr,
                                                 coarse, cblock, 0.01)
    else:
        vol, thick, flags = np.zeros(0), np.zeros(0), np.zeros(0, np.int32)
    t2 = time.time()
    # ---- plausibility / safety checks
    issues = list({"severity": "error", "kind": "gcode", **e} for e in prog.errors)
    issues += list({"severity": "warning", "kind": "gcode", **e} for e in prog.warnings)
    stats = move_stats(M, vol, thick)
    names = {1: "rapid (G0) move removes material - crash", 2: "material removed with spindle stopped - crash",
             4: "material contact above the flute length (shank rubbing / tool too short)",
             8: "tool holder collides with material (stick-out too short for this depth)"}
    for bit, msg in names.items():
        k = np.where(flags & bit)[0]
        if len(k):
            lines = sorted(set(int(M[i, 10]) for i in k))
            i0 = k[0]
            where = (f"; first at line {int(M[i0, 10])}: move ({M[i0, 0]:.2f}, {M[i0, 1]:.2f}, {M[i0, 2]:.2f}) -> "
                     f"({M[i0, 3]:.2f}, {M[i0, 4]:.2f}, {M[i0, 5]:.2f}) with T{int(M[i0, 6])}, removed "
                     f"{vol[i0]:.3f} mm3, max {thick[i0]:.3f} mm deep")
            if bit == 4:
                where += f" (flute length {LIBRARY[int(M[i0, 6])].flute_length:g} mm)"
            issues.append({"severity": "error", "kind": "collision", "msg": msg + where, "count": int(len(k)),
                           "line": lines[0], "lines": lines[:30],
                           "volume_mm3": round(float(vol[k].sum()), 2)})
    if len(M):
        low = np.where(np.minimum(M[:, 2], M[:, 5]) < -MACHINE.spoilboard_allowance - 1e-9)[0]
        if len(low):
            lines = sorted(set(int(M[i, 10]) for i in low))
            issues.append({"severity": "error", "kind": "fixture",
                           "msg": f"tool below Z{-MACHINE.spoilboard_allowance:g} (into the fixture plate)",
                           "count": int(len(low)), "line": lines[0], "lines": lines[:30]})
    issues += cutting_checks(M, vol, thick, stats)
    # ---- exact workpiece and surface metric
    wp = Workpiece(M, part)
    dev = signed_deviation(wp, part.P, part.N)
    t3 = time.time()
    Ht, Hach = target_on_grid(part, x0, y0, res, nx, ny)
    metrics = surface_metrics(part, dev)
    metrics.update(volume_metrics(H, Ht, part, res, x0, y0))
    metrics["cycle_time_min"] = round(stats["cycle_time_s"] / 60, 2)
    metrics["errors"] = sum(1 for i in issues if i["severity"] == "error")
    metrics["warnings"] = sum(1 for i in issues if i["severity"] == "warning")
    metrics["valid"] = metrics["errors"] == 0
    if verbose:
        print(f"[sim] {len(M)} moves, parse+setup {t1 - t0:.1f}s, grid {t2 - t1:.1f}s, metric {t3 - t2:.1f}s; "
              f"surface in tol {metrics['machinable_in_tol_pct']:.2f}% (raw {metrics['all_in_tol_pct']:.2f}%), "
              f"errors {metrics['errors']}")
    return {"program": prog, "moves": M, "vol": vol, "thick": thick, "flags": flags, "H": H, "owner": owner,
            "grid": {"x0": x0, "y0": y0, "res": res, "nx": nx, "ny": ny}, "Ht": Ht, "Hach": Hach,
            "dev": dev, "metrics": metrics, "issues": issues, "stats": stats, "workpiece": wp,
            "timing": {"parse_s": t1 - t0, "grid_s": t2 - t1, "metric_s": t3 - t2}}


def move_stats(M, vol, thick):
    if not len(M):
        return {"cycle_time_s": 0.0, "cut_length_mm": 0.0, "rapid_length_mm": 0.0, "per_tool": {}}
    L = np.linalg.norm(M[:, 3:6] - M[:, 0:3], axis=1)
    rapid = M[:, 7] > 0.5
    feed = np.where(rapid, MACHINE.rapid_rate, np.maximum(M[:, 8], 1e-6))
    tsec = L / feed * 60.0
    per_tool = {}
    for tn in np.unique(M[:, 6]).astype(int):
        if tn == 0:
            continue
        k = M[:, 6] == tn
        per_tool[int(tn)] = {"name": LIBRARY[tn].name, "time_s": round(float(tsec[k].sum()), 1),
                             "cut_mm": round(float(L[k & ~rapid].sum()), 1),
                             "removed_cm3": round(float(vol[k].sum()) / 1000, 3)}
    # tool changes ~ 8 s each
    tc = len(set(M[:, 6].astype(int)) - {0})
    return {"cycle_time_s": float(tsec.sum()) + 8.0 * tc, "cut_length_mm": float(L[~rapid].sum()),
            "rapid_length_mm": float(L[rapid].sum()), "per_tool": per_tool, "L": L, "tsec": tsec}


def window_engagement(M, vol, L):
    """Removed volume per mm of travel over a window of 0.5 D around each move, within runs of consecutive cutting
    moves of one tool (a rapid or tool change ends a run)."""
    n = len(M)
    Aw = np.zeros(n)
    isc = (M[:, 7] < 0.5) & (M[:, 6] > 0)
    brk = np.r_[True, (M[1:, 6] != M[:-1, 6]) | (isc[1:] != isc[:-1])]
    starts = np.r_[np.where(brk)[0], n]
    for a, b in zip(starts[:-1], starts[1:]):
        if not isc[a]:
            continue
        l = L[a:b]
        cl = np.r_[0.0, np.cumsum(l)]
        cv = np.r_[0.0, np.cumsum(vol[a:b])]
        D = LIBRARY[int(M[a, 6])].diameter
        c = cl[:-1] + l / 2
        lo = np.searchsorted(cl, c - D / 4, side="right") - 1
        hi = np.searchsorted(cl, c + D / 4, side="left")
        idx = np.arange(b - a)
        lo = np.clip(np.minimum(lo, idx), 0, None)
        hi = np.minimum(np.maximum(hi, idx + 1), b - a)
        span = cl[hi] - cl[lo]
        Aw[a:b] = (cv[hi] - cv[lo]) / np.maximum(span, np.maximum(np.minimum(D / 2, cl[-1]), 1e-9))
    return Aw


def cutting_checks(M, vol, thick, stats):
    """Plausibility of cutting data in aluminium: chip load, engagement (cross-section), plunging."""
    out = []
    if not len(M):
        return out
    L = stats["L"]
    cut = (M[:, 7] < 0.5) & (vol > 1e-6)
    groups = {}
    maxA = {}
    # engagement cross-section measured over a window of >= 0.5 D of travel (short arc chords alone over-count the
    # leading edge of the cutter); windows never span a rapid or a tool change
    Aw = window_engagement(M, vol, L)
    for i in np.where(cut)[0]:
        t = LIBRARY[int(M[i, 6])]
        rpm, f = M[i, 9], M[i, 8]
        D = t.diameter
        horiz = math.hypot(M[i, 3] - M[i, 0], M[i, 4] - M[i, 1])
        vert = M[i, 2] - M[i, 5]
        if rpm > 0:
            cl = f / (rpm * t.flutes)
            if cl > 2.5 * t.chipload:
                groups.setdefault(("chipload_high", t.number), []).append(i)
            elif cl < 0.2 * t.chipload and f > 0:
                groups.setdefault(("chipload_low", t.number), []).append(i)
        # cross-sectional engagement area (removed volume per mm of travel)
        if horiz > 0.05:
            A = Aw[i]
            if A > 0.75 * D * D and t.kind != "cone":
                groups.setdefault(("engagement", t.number), []).append(i)
                worst = maxA.get(t.number)
                if worst is None or A > worst[0]:
                    maxA[t.number] = (A, i)
        if vert > 0.05 and horiz < 0.2 * vert:  # plunge
            if t.kind == "cone" and t.number == 10:
                continue
            if not t.center_cutting:
                groups.setdefault(("plunge_noncenter", t.number), []).append(i)
            elif thick[i] > 0.5 * D and f > 0.5 * t.recommended_feed(max(rpm, 1)):
                groups.setdefault(("plunge_fast", t.number), []).append(i)
        if t.number == 10 and horiz > 0.05 and vol[i] > 0.05 * L[i]:
            groups.setdefault(("drill_side", t.number), []).append(i)
    text = {
        "chipload_high": ("error", "feed per tooth > 2.5x recommended for T{t} (tool breakage)"),
        "chipload_low": ("warning", "feed per tooth < 0.2x recommended for T{t} (rubbing)"),
        "engagement": ("error", "cut cross-section > 0.75 D^2 for T{t} (overloaded: too deep and too wide)"),
        "plunge_noncenter": ("error", "plunge with non-centre-cutting T{t}"),
        "plunge_fast": ("warning", "deep plunge (> 0.5 D) at > 50% of the recommended feed for T{t}; ramp or helix instead"),
        "drill_side": ("error", "side milling with drill T{t}"),
    }
    for (kind, tn), idx in groups.items():
        sev, msg = text[kind]
        lines = sorted(set(int(M[i, 10]) for i in idx))
        # tiny counts of chip-load or engagement outliers are warnings, not errors
        if sev == "error" and kind in ("engagement",) and len(idx) < 3:
            sev = "warning"
        msg = msg.format(t=tn)
        if kind == "engagement":
            A, i = maxA[tn]
            D = LIBRARY[tn].diameter
            msg += (f"; worst {A:.2f} mm2 > limit {0.75 * D * D:.2f} mm2 at line {int(M[i, 10])} "
                    f"(move to {M[i, 3]:.2f}, {M[i, 4]:.2f}, {M[i, 5]:.2f}, removed column up to {thick[i]:.2f} mm deep)")
        elif kind.startswith("chipload"):
            i = idx[0]
            t = LIBRARY[tn]
            cl = M[i, 8] / max(M[i, 9] * t.flutes, 1e-9)
            msg += f"; e.g. line {int(M[i, 10])}: F{M[i, 8]:g} S{M[i, 9]:g} -> {cl:.4f} mm/tooth vs recommended {t.chipload:g}"
        out.append({"severity": sev, "kind": "cutting", "msg": msg, "count": len(idx),
                    "line": lines[0], "lines": lines[:30]})
    return out


def surface_metrics(part: Part, dev):
    cls = part.pclass
    a = part.parea
    within = np.abs(dev) <= TOL
    edge = part.pedge if part.pedge is not None else np.zeros(len(cls), bool)
    mach = (cls == 0) & ~edge
    nond = (cls != 1) & ~edge

    def pct(mask, sub):
        den = a[mask].sum()
        return float(100 * a[mask & sub].sum() / den) if den > 0 else 100.0

    return {
        "machinable_in_tol_pct": round(pct(mach, within), 3),
        "machinable_gouge_pct": round(pct(mach, dev < -TOL), 3),
        "machinable_proud_pct": round(pct(mach, dev > TOL), 3),
        "all_in_tol_pct": round(pct(nond, within), 3),
        "undercut_area_pct": round(pct(nond, cls == 2), 3),
        "tool_limited_area_pct": round(pct(nond, cls == 3), 3),
        "max_gouge_mm": round(float(-dev[nond].min()) if nond.any() and dev[nond].min() < 0 else 0.0, 4),
        "any_gouge_pct": round(pct(nond, dev < -TOL), 3),
        "surface_area_mm2": round(float(a[nond].sum()), 1),
        "probes": int(nond.sum()),
        "tolerance_mm": TOL,
        "edge_band_excluded_pct": round(pct(cls != 1, edge), 3),
    }


def volume_metrics(H, Ht, part, res, x0, y0):
    A = res * res
    proud = np.maximum(H - Ht, 0) * A
    gouge = np.maximum(Ht - H, 0) * A
    stock_v = float((part.stock_hi - part.stock_lo).prod())
    return {"remaining_excess_cm3": round(float(proud.sum()) / 1000, 3),
            "gouged_cm3": round(float(gouge.sum()) / 1000, 4),
            "removed_cm3": round((stock_v - float(H.sum() * A)) / 1000, 3)}
