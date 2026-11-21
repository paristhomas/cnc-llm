"""Numba kernels for 3+2: occupancy voxels (material state across tilted setups), column tops seen from a tilted frame,
and tool/holder collision against the vise and table boxes."""
from __future__ import annotations

import math

import numba as nb
import numpy as np


@nb.njit(parallel=True, cache=True)
def occ_cut(occ, vx0, vy0, vz0, vr, R, o, H, gx0, gy0, gres, zoff):
    """occ[i,j,k] (voxel centres in the fixture frame) &= z_frame < H_frame(x,y) (nearest grid cell; H shifted by zoff).
    R columns = frame axes in fixture coords, o = frame origin."""
    nzv, nyv, nxv = occ.shape
    ny, nx = H.shape
    for kz in nb.prange(nzv):
        z = vz0 + (kz + 0.5) * vr
        for jy in range(nyv):
            y = vy0 + (jy + 0.5) * vr
            for ix in range(nxv):
                if not occ[kz, jy, ix]:
                    continue
                x = vx0 + (ix + 0.5) * vr
                dx, dy, dz = x - o[0], y - o[1], z - o[2]
                fx = R[0, 0] * dx + R[1, 0] * dy + R[2, 0] * dz
                fy = R[0, 1] * dx + R[1, 1] * dy + R[2, 1] * dz
                fz = R[0, 2] * dx + R[1, 2] * dy + R[2, 2] * dz
                j = int(math.floor((fx - gx0) / gres))
                i = int(math.floor((fy - gy0) / gres))
                if 0 <= i < ny and 0 <= j < nx:
                    if fz + zoff >= H[i, j]:
                        occ[kz, jy, ix] = False


@nb.njit(parallel=True, cache=True)
def column_tops(occ, vx0, vy0, vz0, vr, R, o, gx0, gy0, gres, nx, ny, zmax, zmin, zoff):
    """Top of the material in each column of a frame grid (frame z + zoff), 0 where the column is empty.
    Marches from zmax down to zmin in steps of vr/2 through the occupancy grid (nearest voxel)."""
    H = np.zeros((ny, nx))
    nzv, nyv, nxv = occ.shape
    step = vr * 0.5
    nsteps = int((zmax - zmin) / step) + 1
    for i in nb.prange(ny):
        fy = gy0 + (i + 0.5) * gres
        for j in range(nx):
            fx = gx0 + (j + 0.5) * gres
            for s in range(nsteps):
                fz = zmax - s * step
                x = o[0] + R[0, 0] * fx + R[0, 1] * fy + R[0, 2] * fz
                y = o[1] + R[1, 0] * fx + R[1, 1] * fy + R[1, 2] * fz
                z = o[2] + R[2, 0] * fx + R[2, 1] * fy + R[2, 2] * fz
                ix = int(math.floor((x - vx0) / vr))
                jy = int(math.floor((y - vy0) / vr))
                kz = int(math.floor((z - vz0) / vr))
                if 0 <= ix < nxv and 0 <= jy < nyv and 0 <= kz < nzv and occ[kz, jy, ix]:
                    H[i, j] = fz + zoff + step   # first occupied sample (conservative: half a step above)
                    break
    return H


@nb.njit(cache=True, inline="always")
def _pt_box_d2(px, py, pz, lo, hi):
    dx = max(lo[0] - px, 0.0, px - hi[0])
    dy = max(lo[1] - py, 0.0, py - hi[1])
    dz = max(lo[2] - pz, 0.0, pz - hi[2])
    return dx * dx + dy * dy + dz * dz


FIXTURE_CLEARANCE = 1.0   # mm: the tool body must stay this far from the vise / table boxes (shop safety margin)


@nb.njit(cache=True)
def _disc_box_hit(cx, cy, cz, dx, dy, dz, r, lo, hi):
    """True if the disc of radius r centred at c, perpendicular to the unit axis d, intersects the box [lo, hi]
    (exact: the box is cut by the disc's plane into a convex polygon; the disc hits it if the polygon contains c or
    comes within r of c)."""
    if lo[0] <= cx <= hi[0] and lo[1] <= cy <= hi[1] and lo[2] <= cz <= hi[2]:
        return True
    # in-plane basis
    if abs(dx) < 0.9:
        ux, uy, uz = 0.0, dz, -dy
    else:
        ux, uy, uz = -dz, 0.0, dx
    nu = math.sqrt(ux * ux + uy * uy + uz * uz)
    ux, uy, uz = ux / nu, uy / nu, uz / nu
    vx, vy, vz = dy * uz - dz * uy, dz * ux - dx * uz, dx * uy - dy * ux
    pu = np.empty(12)
    pv = np.empty(12)
    k = 0
    for e in range(12):
        # the 12 box edges: axis a varies, the other two coordinates fixed at lo/hi
        ax = e // 4
        b1 = (e // 2) % 2
        b2 = e % 2
        p0 = np.empty(3)
        p1 = np.empty(3)
        o1 = (ax + 1) % 3
        o2 = (ax + 2) % 3
        p0[ax] = lo[ax]
        p1[ax] = hi[ax]
        p0[o1] = lo[o1] if b1 == 0 else hi[o1]
        p1[o1] = p0[o1]
        p0[o2] = lo[o2] if b2 == 0 else hi[o2]
        p1[o2] = p0[o2]
        s0 = (p0[0] - cx) * dx + (p0[1] - cy) * dy + (p0[2] - cz) * dz
        s1 = (p1[0] - cx) * dx + (p1[1] - cy) * dy + (p1[2] - cz) * dz
        if (s0 <= 0.0 <= s1) or (s1 <= 0.0 <= s0):
            if abs(s0 - s1) < 1e-15:
                continue
            t = s0 / (s0 - s1)
            qx = p0[0] + t * (p1[0] - p0[0]) - cx
            qy = p0[1] + t * (p1[1] - p0[1]) - cy
            qz = p0[2] + t * (p1[2] - p0[2]) - cz
            pu[k] = qx * ux + qy * uy + qz * uz
            pv[k] = qx * vx + qy * vy + qz * vz
            k += 1
    if k == 0:
        return False
    # any vertex within r
    for i in range(k):
        if pu[i] * pu[i] + pv[i] * pv[i] < r * r:
            return True
    if k < 3:
        # degenerate (edge-on): distance from origin to the segment(s)
        for i in range(k):
            for j in range(i + 1, k):
                ex, ey = pu[j] - pu[i], pv[j] - pv[i]
                L2 = ex * ex + ey * ey
                t = 0.0 if L2 < 1e-18 else max(0.0, min(1.0, -(pu[i] * ex + pv[i] * ey) / L2))
                fx, fy = pu[i] + t * ex, pv[i] + t * ey
                if fx * fx + fy * fy < r * r:
                    return True
        return False
    # order the convex polygon by angle about its centroid
    mu, mv = 0.0, 0.0
    for i in range(k):
        mu += pu[i]
        mv += pv[i]
    mu /= k
    mv /= k
    ang = np.empty(k)
    for i in range(k):
        ang[i] = math.atan2(pv[i] - mv, pu[i] - mu)
    order = np.argsort(ang)
    inside = True
    for ii in range(k):
        i = order[ii]
        j = order[(ii + 1) % k]
        ex, ey = pu[j] - pu[i], pv[j] - pv[i]
        if ex * (0.0 - pv[i]) - ey * (0.0 - pu[i]) < -1e-12:
            inside = False
        L2 = ex * ex + ey * ey
        t = 0.0 if L2 < 1e-18 else max(0.0, min(1.0, -(pu[i] * ex + pv[i] * ey) / L2))
        fx, fy = pu[i] + t * ex, pv[i] + t * ey
        if fx * fx + fy * fy < r * r:
            return True
    return inside


@nb.njit(parallel=True, cache=True)
def fixture_hits2(A, B, D, rad, so, hr, hl, boxes, nl, sr, clearance=FIXTURE_CLEARANCE):
    """Per move: 1 + 2*box + part if the tool body touches a fixture box (grown by `clearance`). The body is a stack
    of exact discs perpendicular to the tool axis, every 0.5 mm from the tip: cutter/neck radius rad up to nl (necked
    tools) or so, shank radius sr from nl to the stick-out so, holder radius hr from so to so + hl. The move is
    sampled every min(rad, 2) mm. part = 0 tool/neck/shank, 1 holder. A, B: tip start/end (n,3); D: tool axis (n,3)."""
    n = A.shape[0]
    out = np.zeros(n, np.int8)
    nbx = boxes.shape[0]
    gl = np.empty((nbx, 3))
    gh = np.empty((nbx, 3))
    for b in range(nbx):
        for c in range(3):
            gl[b, c] = boxes[b, 0, c] - clearance
            gh[b, c] = boxes[b, 1, c] + clearance
    for m in nb.prange(n):
        L = math.sqrt((B[m, 0] - A[m, 0]) ** 2 + (B[m, 1] - A[m, 1]) ** 2 + (B[m, 2] - A[m, 2]) ** 2)
        ns = int(L / max(min(rad[m], 2.0), 0.5)) + 1
        hit = False
        code = 0
        neck = nl[m] if nl[m] > 0.0 else so[m]
        total = so[m] + hl
        na = int(total * 2) + 1
        for s in range(ns + 1):
            t = s / ns
            tx = A[m, 0] + (B[m, 0] - A[m, 0]) * t
            ty = A[m, 1] + (B[m, 1] - A[m, 1]) * t
            tz = A[m, 2] + (B[m, 2] - A[m, 2]) * t
            for a in range(na + 1):
                h = total * a / na
                if h <= neck:
                    r = rad[m]
                elif h <= so[m]:
                    r = sr[m]
                else:
                    r = hr[m]
                px = tx + D[m, 0] * h
                py = ty + D[m, 1] * h
                pz = tz + D[m, 2] * h
                for b in range(nbx):
                    if _disc_box_hit(px, py, pz, D[m, 0], D[m, 1], D[m, 2], r, gl[b], gh[b]):
                        hit = True
                        code = 1 + b * 2 + (1 if h > so[m] else 0)
                        break
                if hit:
                    break
            if hit:
                break
        if hit:
            out[m] = code
    return out


def fixture_hits(A, B, D, rad, so, hr, hl, boxes):
    """Back-compatible wrapper (tools without a neck)."""
    return fixture_hits2(A, B, D, rad, so, hr, hl, boxes, np.zeros(len(rad)), np.asarray(rad, np.float64))
