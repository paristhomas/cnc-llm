"""3+2 simulation: G68.2 tilted-plane programs on a vise-held stock.

Exact model: in setup frame k (tool axis = frame +Z) every move removes the material above its swept profile, so
  remaining = stock box  AND  for every frame k: z_k(P) < H_k(x_k(P), y_k(P)),
with H_k the exact column height of all frame-k moves (the 3-axis kernel, evaluated in frame coordinates). The surface
metric uses only this (grid-free). Sequential checks (rapid into material, shank above flute length, holder contact,
engagement) replay each contiguous segment on a frame height field seeded from an occupancy voxel grid of the material
left by the earlier segments (resolution VOX; thresholds are relaxed by that resolution in tilted frames).
"""
from __future__ import annotations

import math
import re
import time

import numpy as np

from . import gcode, kernel, kernel5
from .part import TOL
from .sim import CAP, EPS, cutting_checks, move_stats, shank_tables, signed_deviation, tool_tables
from .tools import LIBRARY, MACHINE

VOX = 0.25
GRID_RES = 0.1
MAX_GRID = 8e6
INDEX_TIME_S = 6.0
RIGID_MIN = 0.3        # weakest connection must keep >= 30 % of the stub section until the part-off
PARTOFF_MAX = 0.15     # part-off must leave <= 15 % ...
TAB_MIN_MM2 = 2.0      # ... but at least this much (tabs / web), so the part does not drop in the machine
# Part-off / tab rules (docs/ACCEPTANCE_REFINE.md H3-H4; numbers PROPOSED, may only be tightened)
TAB_MAX_MM2 = 30.0     # total tab section at the weakest plane
TAB_MAX_WIDTH = 3.0    # each tab <= 3 mm across in its smallest direction (snap / cut by hand)
TAB_MAX_COUNT = 4
WITNESS_MM = 1.0       # part surface within 1 mm of a tab joint is the tab witness (excluded only if the part-off is valid)
WITNESS_MAX_PCT = 1.5  # hard limit; target 0.5 %
TAB_RES = 0.1          # section raster for tab sizes


class FrameSweep:
    def __init__(self, Mf, lo2, hi2):
        _, self.T, self.tool_rows, *_ = tool_tables()
        self.M = np.ascontiguousarray(Mf[:, :7])
        self.cs = 1.0
        self.bx0, self.by0 = lo2[0] - 12, lo2[1] - 12
        self.nx = int((hi2[0] - self.bx0 + 12) / self.cs) + 2
        self.ny = int((hi2[1] - self.by0 + 12) / self.cs) + 2
        self.start, self.idx, self.zmin = kernel.build_buckets(self.M, self.T, self.tool_rows, self.bx0, self.by0,
                                                               self.cs, self.nx, self.ny)

    def heights(self, X, Y):
        return kernel.column_heights(np.ascontiguousarray(X, np.float64), np.ascontiguousarray(Y, np.float64), self.M,
                                     self.T, self.tool_rows, self.start, self.idx, self.zmin, self.bx0, self.by0,
                                     self.cs, self.nx, self.ny, 1e30)


class Workpiece5:
    """Exact remaining material after moves[:upto] of a tilted-plane program."""

    def __init__(self, M, frames, part, upto=None):
        self.lo, self.hi = part.stock_lo, part.stock_hi
        corners = np.array([[x, y, z] for x in (self.lo[0], self.hi[0]) for y in (self.lo[1], self.hi[1])
                            for z in (self.lo[2], self.hi[2])])
        M = M[:upto] if upto is not None else M
        M = M[M[:, 6] > 0]
        self.frames = []
        for k in np.unique(M[:, 12]).astype(int) if len(M) else []:
            R, o = frames[k]["R"], frames[k]["origin"]
            c = (corners - o) @ R
            self.frames.append((R, o, FrameSweep(M[M[:, 12] == k], c[:, :2].min(0), c[:, :2].max(0))))

    def inside(self, P):
        ok = ((P >= self.lo) & (P <= self.hi)).all(1)
        for R, o, fs in self.frames:
            k = np.where(ok)[0]
            if not len(k):
                break
            q = (P[k] - o) @ R
            h, _ = fs.heights(q[:, 0], q[:, 1])
            ok[k] = q[:, 2] < h
        return ok

    def heights_frame(self, fi, X, Y):
        return self.frames[fi][2].heights(X, Y)


def to_fixture(M, frames):
    """Tip start/end points and tool axis of every move in fixture coordinates."""
    n = len(M)
    A, B, D = np.zeros((n, 3)), np.zeros((n, 3)), np.zeros((n, 3))
    for k, fr in enumerate(frames):
        sel = M[:, 12] == k
        if not sel.any():
            continue
        R, o = fr["R"], fr["origin"]
        A[sel] = M[sel, 0:3] @ R.T + o
        B[sel] = M[sel, 3:6] @ R.T + o
        D[sel] = R[:, 2]
    return A, B, D


def segments(M):
    if not len(M):
        return []
    f = M[:, 12]
    cut = np.r_[0, np.where(np.diff(f) != 0)[0] + 1, len(M)]
    return [(int(a), int(b), int(f[a])) for a, b in zip(cut[:-1], cut[1:])]


def frame_angles(R):
    """Equivalent trunnion angles: A = tilt of the tool axis from +Z, C = its azimuth (deg)."""
    d = R[:, 2]
    return math.degrees(math.acos(max(-1, min(1, d[2])))), (math.degrees(math.atan2(d[1], d[0])) if abs(d[2]) < 0.9999 else 0.0)


def connection_area(wp, part, res=0.25, nplanes=7):
    """Weakest material cross-section between the vise stub and the part: the minimum, over planes spanning the stub
    gap (from just above the jaws to just below the part bottom), of the material area in the plane."""
    lo, hi = part.stock_lo, part.stock_hi
    gap = part.fixture["gap"]
    xs = np.arange(lo[0] + res / 2, hi[0], res)
    ys = np.arange(lo[1] + res / 2, hi[1], res)
    X, Y = np.meshgrid(xs, ys)
    from scipy import ndimage
    best = None
    for zc in np.linspace(-gap + 0.3, -0.1, nplanes):
        P = np.c_[X.ravel(), Y.ravel(), np.full(X.size, zc)]
        ins = wp.inside(P).reshape(X.shape)
        area = float(ins.sum() * res * res)
        if best is None or area < best[0]:
            lab, n = ndimage.label(ins)
            sizes = np.bincount(lab.ravel())[1:] * res * res if n else np.zeros(0)
            best = (area, sorted(sizes.round(2).tolist(), reverse=True), float(zc))
    return best[0], best[1], best[2]


def _islands(ins, res):
    """Connected material islands of a boolean section raster: area, smallest width (2 x largest inscribed radius,
    rounded up by the raster), centroid index."""
    from scipy import ndimage
    lab, n = ndimage.label(ins)
    out = []
    if not n:
        return lab, out
    dt = ndimage.distance_transform_edt(np.pad(ins, 1))[1:-1, 1:-1]
    for L, sl in enumerate(ndimage.find_objects(lab), start=1):
        m = lab[sl] == L
        ii, jj = np.nonzero(m)
        out.append({"label": L, "cells": int(m.sum()), "area_mm2": float(m.sum() * res * res),
                    "width_mm": float(2.0 * dt[sl][m].max() * res),
                    "ci": float(ii.mean() + sl[0].start), "cj": float(jj.mean() + sl[1].start)})
    return lab, out


def tab_sections(wp, part, res=TAB_RES, dz=0.5):
    """Exact sections of the final material across the stub gap (planes every dz from just above the jaws to 0.05 mm
    below the part). Returns the weakest plane (tabs), the tab tops connected to the stub, and the plane list.
    Connectivity to the stub is followed plane by plane (islands overlapping a connected island of the plane below)."""
    from scipy import ndimage
    lo, hi = part.stock_lo, part.stock_hi
    gap = float(part.fixture["gap"])
    zs = np.r_[np.arange(-gap + 0.3, -0.05, dz), -0.05]
    # coarse pass: where is material at all (bounding box), at 0.5 mm
    cr = 0.5
    xs, ys = np.arange(lo[0] + cr / 2, hi[0], cr), np.arange(lo[1] + cr / 2, hi[1], cr)
    X, Y = np.meshgrid(xs, ys)
    anyc = np.zeros(X.shape, bool)
    A0 = float((hi[0] - lo[0]) * (hi[1] - lo[1]))
    coarse_min = None
    for zc in zs:
        ins = wp.inside(np.c_[X.ravel(), Y.ravel(), np.full(X.size, zc)]).reshape(X.shape)
        anyc |= ins
        a = float(ins.sum() * cr * cr)
        coarse_min = a if coarse_min is None else min(coarse_min, a)
    if not anyc.any():
        return {"planes": [], "weakest": None, "tabs": [], "tops_mask": None, "grid": None, "coarse_min_mm2": 0.0}
    if coarse_min > 0.5 * A0:   # far from parted off: report the coarse section only (the program fails anyway)
        res = cr
    ii, jj = np.nonzero(ndimage.binary_dilation(anyc, iterations=3))
    x0, x1 = xs[jj.min()] - cr, xs[jj.max()] + cr
    y0, y1 = ys[ii.min()] - cr, ys[ii.max()] + cr
    fx = np.arange(max(x0, lo[0]) + res / 2, min(x1, hi[0]), res)
    fy = np.arange(max(y0, lo[1]) + res / 2, min(y1, hi[1]), res)
    FX, FY = np.meshgrid(fx, fy)
    planes, conn_prev = [], None
    weakest = None
    for zc in zs:
        ins = wp.inside(np.c_[FX.ravel(), FY.ravel(), np.full(FX.size, zc)]).reshape(FX.shape)
        lab, isl = _islands(ins, res)
        if conn_prev is None:
            conn = ins.copy()          # the plane just above the jaws: all of it is the stub
        else:
            grown = ndimage.binary_dilation(conn_prev, iterations=1)
            keep = np.unique(lab[grown & ins])
            conn = np.isin(lab, keep[keep > 0])
        area = float(ins.sum() * res * res)
        planes.append({"z": round(float(zc), 3), "area_mm2": round(area, 2),
                       "connected_mm2": round(float(conn.sum() * res * res), 2), "islands": len(isl)})
        if weakest is None or area < weakest[0]:
            weakest = (area, float(zc), lab, isl)
        conn_prev = conn
    area, zw, lab, isl = weakest
    tabs = [{"area_mm2": round(t["area_mm2"], 2), "width_mm": round(t["width_mm"], 2),
             "centroid": [round(float(fx[0] + t["cj"] * res), 2), round(float(fy[0] + t["ci"] * res), 2), round(zw, 2)]}
            for t in sorted(isl, key=lambda t: -t["area_mm2"])]
    return {"planes": planes, "weakest": {"z": round(zw, 3), "area_mm2": round(area, 2)}, "tabs": tabs,
            "tops_mask": conn_prev, "grid": {"x0": float(fx[0]), "y0": float(fy[0]), "res": res, "nx": len(fx), "ny": len(fy)},
            "coarse_min_mm2": round(coarse_min, 2)}


def tab_witness(part, dev, tops_mask, grid, voxel=0.5):
    """Tab joint = proud probes in a proud region (probes connected through 0.5 mm voxels, 26-neighbourhood) that
    touches the top of a stub-connected tab (a proud probe below Z0.5 whose XY lies over the tab tops, dilated by
    0.5 mm). Witness = probes within WITNESS_MM of a joint probe, never gouged ones. Conservative: a whole proud
    region that reaches a tab counts as joint, so leaving the underside unfinished makes the witness huge."""
    from scipy import ndimage
    from scipy.spatial import cKDTree
    n = len(dev)
    joint = np.zeros(n, bool)
    witness = np.zeros(n, bool)
    if tops_mask is None or not tops_mask.any():
        return joint, witness
    P = part.P
    proud = np.where(dev > TOL)[0]
    if not len(proud):
        return joint, witness
    res = grid["res"]
    grown = ndimage.binary_dilation(tops_mask, iterations=max(1, int(round(0.5 / res))))
    j = np.floor((P[proud, 0] - grid["x0"]) / res + 0.5).astype(int)
    i = np.floor((P[proud, 1] - grid["y0"]) / res + 0.5).astype(int)
    okij = (i >= 0) & (i < grown.shape[0]) & (j >= 0) & (j < grown.shape[1])
    seed = np.zeros(len(proud), bool)
    seed[okij] = grown[i[okij], j[okij]] & (P[proud[okij], 2] < 0.5)
    if not seed.any():
        return joint, witness
    Q = P[proud]
    lo = Q.min(0) - voxel
    ijk = np.floor((Q - lo) / voxel).astype(int)
    occ = np.zeros(ijk.max(0) + 1, bool)
    occ[ijk[:, 0], ijk[:, 1], ijk[:, 2]] = True
    lab, _ = ndimage.label(occ, structure=np.ones((3, 3, 3)))
    pl = lab[ijk[:, 0], ijk[:, 1], ijk[:, 2]]
    joint[proud[np.isin(pl, np.unique(pl[seed]))]] = True
    d, _ = cKDTree(P[joint]).query(P, k=1, distance_upper_bound=WITNESS_MM + 1e-9)
    witness = np.isfinite(d) & (dev >= -TOL)
    return joint, witness


def partoff_analysis(wp, part, dev, po_line, A0):
    """Tab sizes, witness and the part-off validity rules (ACCEPTANCE_REFINE H3-H4)."""
    ts = tab_sections(wp, part)
    joint, witness = tab_witness(part, dev, ts["tops_mask"], ts["grid"])
    a = part.parea
    total = float(a.sum())
    wit_area = float(a[witness & ~part.pedge].sum())
    tabs = ts["tabs"]
    tot = ts["weakest"]["area_mm2"] if ts["weakest"] else 0.0
    reasons = []
    if po_line is None:
        reasons.append("no '(PART-OFF)' section")
    if tot < TAB_MIN_MM2:
        reasons.append(f"only {tot:.2f} mm2 left between stub and part (min {TAB_MIN_MM2:g} mm2): the part would come loose")
    if tot > TAB_MAX_MM2:
        reasons.append(f"tabs total {tot:.1f} mm2 at the weakest plane Z{ts['weakest']['z']:g} (max {TAB_MAX_MM2:g} mm2)")
    if tot > PARTOFF_MAX * A0:
        reasons.append(f"{100 * tot / A0:.0f}% of the stub section left (max {100 * PARTOFF_MAX:.0f}%)")
    if len(tabs) > TAB_MAX_COUNT:
        reasons.append(f"{len(tabs)} separate tabs/islands at the weakest plane (max {TAB_MAX_COUNT})")
    wide = [t for t in tabs if t["width_mm"] > TAB_MAX_WIDTH]
    if wide:
        reasons.append(f"{len(wide)} tab(s) wider than {TAB_MAX_WIDTH:g} mm in their smallest direction "
                       f"(widest {max(t['width_mm'] for t in wide):.2f} mm): not removable by hand")
    wpct = 100 * wit_area / total
    if wpct > WITNESS_MAX_PCT:
        reasons.append(f"tab witness {wpct:.2f}% of the surface ({wit_area:.0f} mm2; max {WITNESS_MAX_PCT:g}%): proud "
                       "material connected to the tabs covers too much of the part (an unfinished underside counts "
                       "as tab joint)")
    ok = not reasons
    return {"ok": ok, "tabs": tabs, "total_mm2": round(tot, 2), "weakest_z": ts["weakest"]["z"] if ts["weakest"] else None,
            "witness_mm2": round(wit_area, 2), "witness_pct": round(wpct, 3), "joint_mm2": round(float(a[joint].sum()), 2),
            "reasons": reasons, "planes": ts["planes"],
            "limits": {"total_mm2": [TAB_MIN_MM2, TAB_MAX_MM2], "max_fraction": PARTOFF_MAX, "max_width_mm": TAB_MAX_WIDTH,
                       "max_count": TAB_MAX_COUNT, "witness_mm": WITNESS_MM, "witness_max_pct": WITNESS_MAX_PCT},
            "_witness": witness, "_joint": joint}


def run(program_text: str, part, verbose=True) -> dict:
    t0 = time.time()
    prog = gcode.parse(program_text, tilt=True, max_tilt_deg=part.meta.get("max_tilt_deg", 110.0))
    M = prog.moves
    frames = prog.frames
    nums, T, tool_rows, fl, so, hr = tool_tables()
    nl_t, sr_t = shank_tables()
    issues = [{"severity": "error", "kind": "gcode", **e} for e in prog.errors]
    issues += [{"severity": "warning", "kind": "gcode", **e} for e in prog.warnings]
    n = len(M)
    vol, thick, flags = np.zeros(n), np.zeros(n), np.zeros(n, np.int32)
    lo, hi = part.stock_lo, part.stock_hi
    # occupancy voxels of the stock
    vr = VOX
    vx0, vy0, vz0 = lo - vr * 0.5
    nxv, nyv, nzv = (np.ceil((hi - lo + vr) / vr)).astype(int)
    occ = np.ones((nzv, nyv, nxv), np.bool_)
    corners = np.array([[x, y, z] for x in (lo[0], hi[0]) for y in (lo[1], hi[1]) for z in (lo[2], hi[2])])
    segs = segments(M)
    seg_info, grids = [], []
    snapshots = []   # material occupancy at the start of each segment (every 2nd voxel: 0.5 mm) for the viewer
    for si, (a, b, k) in enumerate(segs):
        snapshots.append(occ[::2, ::2, ::2].copy())
        R, o = frames[k]["R"], frames[k]["origin"]
        c = (corners - o) @ R
        gx0, gy0 = c[:, 0].min() - 2, c[:, 1].min() - 2
        w, h = c[:, 0].max() + 2 - gx0, c[:, 1].max() + 2 - gy0
        res = max(GRID_RES, math.sqrt(w * h / MAX_GRID))
        nx, ny = int(math.ceil(w / res)), int(math.ceil(h / res))
        zmax, zmin = c[:, 2].max() + 1, c[:, 2].min() - 1
        zoff = -zmin + 10.0
        H = kernel5.column_tops(occ, vx0, vy0, vz0, vr, R, o, gx0, gy0, res, nx, ny, zmax, zmin, zoff)
        H0 = H.copy()
        Ms = np.ascontiguousarray(M[a:b, :12].copy())
        Ms[:, 2] += zoff
        Ms[:, 5] += zoff
        owner = np.full(H.shape, -1, np.int64)
        cblock = 20
        coarse = np.zeros(((ny + cblock - 1) // cblock, (nx + cblock - 1) // cblock))
        for ci in range(coarse.shape[0]):
            for cj in range(coarse.shape[1]):
                coarse[ci, cj] = H[ci * cblock:(ci + 1) * cblock, cj * cblock:(cj + 1) * cblock].max()
        untouched = si == 0 and abs(R[2, 2] - 1) < 1e-9
        eps = 0.01 if untouched else 1.2 * vr
        if untouched:   # exact initial state: the stock top
            H0[H0 > 0] = hi[2] - o[2] + zoff
            H[:] = H0
        v_, t_, f_ = kernel.simulate_grid(Ms, T, tool_rows, H, owner, gx0, gy0, res, fl, so, hr, coarse, cblock, eps,
                                          nl_t, sr_t)
        vol[a:b], thick[a:b], flags[a:b] = v_, t_, f_
        kernel5.occ_cut(occ, vx0, vy0, vz0, vr, R, o, H, gx0, gy0, res, zoff)
        A_, C_ = frame_angles(R)
        tools = sorted(set(int(t) for t in M[a:b, 6] if t > 0))
        seg_info.append({"segment": si + 1, "frame": k, "first_line": int(M[a, 10]), "last_line": int(M[b - 1, 10]),
                         "moves": b - a, "tools": tools, "A_deg": round(A_, 2), "C_deg": round(C_, 2),
                         "tool_axis": [round(float(v), 4) for v in R[:, 2]],
                         "origin": [round(float(v), 4) for v in o],
                         "ijk": frames[k].get("ijk"), "removed_cm3": round(float(v_.sum()) / 1000, 3)})
        grids.append({"x0": gx0, "y0": gy0, "res": res, "nx": nx, "ny": ny, "zoff": zoff, "H0": H0, "H": H,
                      "R": R, "o": o})
    t1 = time.time()
    # ---- crash flags from the grid replay
    _, B_, _ = to_fixture(M, frames)
    names = {1: "rapid (G0) move removes material - crash", 2: "material removed with spindle stopped - crash",
             4: "material contact above the flute length (shank rubbing / tool too short)",
             8: "tool holder collides with material (stick-out too short for this depth)",
             32: "shank of a necked long-reach tool collides with material (deeper than the neck length)"}
    for bit, msg in names.items():
        kk = np.where(flags & bit)[0]
        if len(kk):
            lines = sorted(set(int(M[i, 10]) for i in kk))
            i0 = kk[0]
            issues.append({"severity": "error", "kind": "collision", "count": int(len(kk)), "line": lines[0],
                           "lines": lines[:30], "volume_mm3": round(float(vol[kk].sum()), 2),
                           "msg": msg + f"; first at line {int(M[i0, 10])} (frame {int(M[i0, 12])}, T{int(M[i0, 6])}, move "
                                        f"ends at G54 ({B_[i0, 0]:.2f}, {B_[i0, 1]:.2f}, {B_[i0, 2]:.2f})), removed column up "
                                        f"to {thick[i0]:.2f} mm (material left by earlier setups counts too)"})
    # ---- vise / table collisions (tool + holder, every move incl. rapids)
    A, B, D = to_fixture(M, frames)
    act = M[:, 6] > 0
    if act.any():
        tn = M[act, 6].astype(int)
        rad = np.array([LIBRARY[t].R for t in tn])
        sos = np.array([LIBRARY[t].stickout for t in tn])
        hrs = np.array([LIBRARY[t].holder_diameter / 2 for t in tn])
        boxes = np.array(part.meta["vise"], float)
        nls = np.array([LIBRARY[t].neck_length for t in tn], np.float64)
        srs = np.array([LIBRARY[t].shank_diameter / 2 for t in tn], np.float64)
        hits = kernel5.fixture_hits2(A[act], B[act], D[act], rad, sos, hrs, 50.0, boxes, nls, srs)
        names_b = ["fixed vise jaw (-Y)", "moving vise jaw (+Y)", "vise body", "machine table"]
        idx_all = np.where(act)[0]
        for code in sorted(set(hits[hits > 0].tolist())):
            kk = idx_all[hits == code]
            b, holder = (code - 1) // 2, (code - 1) % 2
            lines = sorted(set(int(M[i, 10]) for i in kk))
            i0 = kk[0]
            issues.append({"severity": "error", "kind": "fixture", "count": int(len(kk)), "line": lines[0],
                           "lines": lines[:30], "box": names_b[b] if b < len(names_b) else f"box {b}",
                           "msg": f"{'tool holder (D%g)' % LIBRARY[int(M[i0, 6])].holder_diameter if holder else 'tool / shank'} "
                                  f"of T{int(M[i0, 6])} hits the {names_b[b] if b < len(names_b) else 'fixture'} "
                                  f"(first at line {int(M[i0, 10])}, frame {int(M[i0, 12])}; vise boxes are in setup.json; "
                                  f"holder is a cylinder from the stick-out to 50 mm above it)"})
    stats = move_stats(M[:, :12], vol, thick) if n else move_stats(M, vol, thick)
    n_index = sum(1 for s in segs if s[2] != 0) + 0
    stats["cycle_time_s"] += INDEX_TIME_S * len([1 for i in range(1, len(segs)) if segs[i][2] != segs[i - 1][2]])
    issues += cutting_checks(M[:, :12], vol, thick, stats) if n else []
    # ---- rigidity and part-off
    m_po = re.search(r"\(\s*PART[- ]?OFF", program_text, re.I)
    po_line = program_text[:m_po.start()].count("\n") + 1 if m_po else None
    A0 = float((hi[0] - lo[0]) * (hi[1] - lo[1]))
    conn = []
    for si, (a, b, k) in enumerate(segs):
        wp_b = Workpiece5(M, frames, part, upto=b)
        area, islands, zw = connection_area(wp_b, part)
        conn.append({"after_segment": si + 1, "line": int(M[b - 1, 10]), "area_mm2": round(area, 2), "weakest_z": round(zw, 2),
                     "fraction": round(area / A0, 4), "islands": islands[:6],
                     "part_off": bool(po_line and M[a, 10] >= po_line)})
    rigid = {"stock_section_mm2": round(A0, 1), "part_off_line": po_line, "checks": conn}
    if po_line is None:
        issues.append({"severity": "error", "kind": "part-off", "line": None,
                       "msg": "no part-off operation: mark it with a '(PART-OFF)' comment and cut the stub down to tabs"})
    for c in conn:
        if not c["part_off"] and c["fraction"] < RIGID_MIN:
            issues.append({"severity": "error", "kind": "rigidity", "line": c["line"],
                           "msg": f"part connection to the vise stub is only {100 * c['fraction']:.0f}% of the stock "
                                  f"section after segment {c['after_segment']} (before the part-off): the part would "
                                  f"flex / chatter (weakest plane Z{c['weakest_z']:g}). Keep >= {100 * RIGID_MIN:.0f}% of the section at every "
                                  f"height of the stub gap until the part-off."})
    # ---- exact workpiece, surface deviation, part-off (tabs + witness)
    wp = Workpiece5(M, frames, part)
    dev = signed_deviation(wp, part.P, part.N)
    po = partoff_analysis(wp, part, dev, po_line, A0)
    if po_line is not None:
        for r_ in po["reasons"]:
            issues.append({"severity": "error", "kind": "part-off", "line": conn[-1]["line"] if conn else None,
                           "msg": "part-off: " + r_})
    witness = po.pop("_witness") if po["ok"] else np.zeros(len(dev), bool)
    joint = po.pop("_joint", None)
    po.pop("_witness", None)
    rigid["partoff"] = po
    t2 = time.time()
    metrics = surface_metrics5(part, dev, witness)
    metrics["tabs"] = len(po["tabs"])
    metrics["tab_total_mm2"] = po["total_mm2"]
    metrics["tab_max_width_mm"] = max((t["width_mm"] for t in po["tabs"]), default=0.0)
    metrics["partoff_ok"] = po["ok"]
    metrics["cycle_time_min"] = round(stats["cycle_time_s"] / 60, 2)
    metrics["setups"] = len(segs)
    metrics["distinct_orientations"] = len({tuple(np.round(frames[s[2]]["R"][:, 2], 3)) for s in segs})
    metrics["final_connection_mm2"] = conn[-1]["area_mm2"] if conn else None
    metrics["errors"] = sum(1 for i in issues if i["severity"] == "error")
    metrics["warnings"] = sum(1 for i in issues if i["severity"] == "warning")
    metrics["valid"] = metrics["errors"] == 0
    if verbose:
        print(f"[sim5] {n} moves, {len(segs)} segments; replay {t1 - t0:.1f}s, metric {t2 - t1:.1f}s; "
              f"whole surface in tol {metrics['whole_surface_in_tol_pct']:.3f}% (tab witness {metrics['tab_witness_pct']:.2f}%), "
              f"errors {metrics['errors']}")
    score_cls = np.zeros(len(dev), np.int8)
    score_cls[witness] = 1
    score_cls[part.pedge] = 2
    return {"program": prog, "moves": M, "frames": frames, "vol": vol, "thick": thick, "flags": flags, "dev": dev,
            "score_cls": score_cls, "witness": witness, "joint": joint, "partoff": po,
            "metrics": metrics, "issues": issues, "stats": stats, "workpiece": wp, "segments": seg_info,
            "grids": grids, "rigidity": rigid, "occ": occ, "snapshots": snapshots, "occ_grid": {"x0": vx0, "y0": vy0, "z0": vz0, "res": vr},
            "fixture_xyz": (A, B, D)}


def surface_metrics5(part, dev, witness=None):
    """Whole-surface score (ACCEPTANCE_REFINE H1): every probe of the part counts, except the 0.03 mm face-edge band
    (metrology artefact) and the tab witness (only passed in when the part-off is valid). Reachability never removes
    area; `hint_no_tool_found_pct` is a diagnostic of the harness's quick reach search only."""
    a = part.parea
    n = len(a)
    edge = part.pedge if part.pedge is not None else np.zeros(n, bool)
    witness = np.zeros(n, bool) if witness is None else witness
    within = np.abs(dev) <= TOL
    scored = ~edge & ~witness
    nonedge = ~edge
    total = float(a.sum())

    def pct(mask, sub):
        den = a[mask].sum()
        return float(100 * a[mask & sub].sum() / den) if den > 0 else 100.0

    gouged = dev < -TOL
    return {
        "whole_surface_in_tol_pct": round(pct(scored, within), 3),
        "whole_surface_gouge_pct": round(pct(scored, gouged), 3),
        "whole_surface_proud_pct": round(pct(scored, dev > TOL), 3),
        "tab_witness_pct": round(float(100 * a[witness & nonedge].sum() / total), 3),
        "tab_witness_mm2": round(float(a[witness & nonedge].sum()), 2),
        "edge_band_excluded_pct": round(float(100 * a[edge].sum() / total), 3),
        "max_gouge_mm": round(float(-dev[nonedge].min()) if nonedge.any() and dev[nonedge].min() < 0 else 0.0, 4),
        "max_proud_mm": round(float(dev[scored].max()) if scored.any() and dev[scored].max() > 0 else 0.0, 4),
        "proud_area_mm2": round(float(a[scored & (dev > TOL)].sum()), 2),
        "gouge_area_mm2": round(float(a[scored & gouged].sum()), 2),
        "hint_no_tool_found_pct": round(float(100 * a[(part.pclass == 2) & scored].sum() / total), 3),
        "surface_area_mm2": round(total, 1),
        "scored_area_mm2": round(float(a[scored].sum()), 1),
        "probes": int(n),
        "tolerance_mm": TOL,
    }
