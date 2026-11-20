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
from .sim import CAP, EPS, cutting_checks, move_stats, signed_deviation, tool_tables
from .tools import LIBRARY, MACHINE

VOX = 0.25
GRID_RES = 0.1
MAX_GRID = 8e6
INDEX_TIME_S = 6.0
RIGID_MIN = 0.3        # weakest connection must keep >= 30 % of the stub section until the part-off
PARTOFF_MAX = 0.15     # part-off must leave <= 15 % ...
TAB_MIN_MM2 = 2.0      # ... but at least this much (tabs / web), so the part does not drop in the machine


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


def run(program_text: str, part, verbose=True) -> dict:
    t0 = time.time()
    prog = gcode.parse(program_text, tilt=True, max_tilt_deg=part.meta.get("max_tilt_deg", 110.0))
    M = prog.moves
    frames = prog.frames
    nums, T, tool_rows, fl, so, hr = tool_tables()
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
        v_, t_, f_ = kernel.simulate_grid(Ms, T, tool_rows, H, owner, gx0, gy0, res, fl, so, hr, coarse, cblock, eps)
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
             8: "tool holder collides with material (stick-out too short for this depth)"}
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
        hits = kernel5.fixture_hits(A[act], B[act], D[act], rad, sos, hrs, 50.0, boxes)
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
    if conn and po_line is not None:
        last = conn[-1]
        if last["fraction"] > PARTOFF_MAX:
            issues.append({"severity": "error", "kind": "part-off", "line": last["line"],
                           "msg": f"part-off leaves {100 * last['fraction']:.0f}% of the stub section (max "
                                  f"{100 * PARTOFF_MAX:.0f}%): the operator cannot break it off by hand"})
        elif last["area_mm2"] < TAB_MIN_MM2:
            issues.append({"severity": "error", "kind": "part-off", "line": last["line"],
                           "msg": f"part-off leaves only {last['area_mm2']:.2f} mm2: the part would come loose in the "
                                  f"machine. Leave tabs / a web of >= {TAB_MIN_MM2} mm2"})
    # ---- exact workpiece and surface metric
    wp = Workpiece5(M, frames, part)
    dev = signed_deviation(wp, part.P, part.N)
    t2 = time.time()
    metrics = surface_metrics5(part, dev)
    metrics["cycle_time_min"] = round(stats["cycle_time_s"] / 60, 2)
    metrics["setups"] = len(segs)
    metrics["distinct_orientations"] = len({tuple(np.round(frames[s[2]]["R"][:, 2], 3)) for s in segs})
    metrics["final_connection_mm2"] = conn[-1]["area_mm2"] if conn else None
    metrics["errors"] = sum(1 for i in issues if i["severity"] == "error")
    metrics["warnings"] = sum(1 for i in issues if i["severity"] == "warning")
    metrics["valid"] = metrics["errors"] == 0
    if verbose:
        print(f"[sim5] {n} moves, {len(segs)} segments; replay {t1 - t0:.1f}s, metric {t2 - t1:.1f}s; "
              f"reachable in tol {metrics['machinable_in_tol_pct']:.3f}% (whole surface {metrics['all_in_tol_pct']:.2f}%), "
              f"errors {metrics['errors']}")
    return {"program": prog, "moves": M, "frames": frames, "vol": vol, "thick": thick, "flags": flags, "dev": dev,
            "metrics": metrics, "issues": issues, "stats": stats, "workpiece": wp, "segments": seg_info,
            "grids": grids, "rigidity": rigid, "occ": occ, "snapshots": snapshots, "occ_grid": {"x0": vx0, "y0": vy0, "z0": vz0, "res": vr},
            "fixture_xyz": (A, B, D)}


def surface_metrics5(part, dev):
    cls, a = part.pclass, part.parea
    edge = part.pedge if part.pedge is not None else np.zeros(len(cls), bool)
    within = np.abs(dev) <= TOL
    mach = (cls == 0) & ~edge
    nonpart = (cls != 1) & ~edge

    def pct(mask, sub):
        den = a[mask].sum()
        return float(100 * a[mask & sub].sum() / den) if den > 0 else 100.0

    return {
        "machinable_in_tol_pct": round(pct(mach, within), 3),
        "machinable_gouge_pct": round(pct(mach, dev < -TOL), 3),
        "machinable_proud_pct": round(pct(mach, dev > TOL), 3),
        "all_in_tol_pct": round(pct(nonpart, within), 3),
        "unreachable_area_pct": round(pct(nonpart, cls == 2), 3),
        "unreachable_in_tol_pct": round(pct((cls == 2) & ~edge, within), 3),
        "max_gouge_mm": round(float(-dev[nonpart].min()) if nonpart.any() and dev[nonpart].min() < 0 else 0.0, 4),
        "any_gouge_pct": round(pct(nonpart, dev < -TOL), 3),
        "parting_face_pct": round(pct(cls >= 0, cls == 1), 3),
        "edge_band_excluded_pct": round(pct(cls != 1, edge), 3),
        "surface_area_mm2": round(float(a[nonpart].sum()), 1),
        "probes": int(nonpart.sum()),
        "tolerance_mm": TOL,
    }
