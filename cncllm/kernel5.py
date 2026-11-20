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


@nb.njit(parallel=True, cache=True)
def fixture_hits(A, B, D, rad, so, hr, hl, boxes):
    """Per move: 1 if the tool (radius rad up to stick-out so) or holder (radius hr from so to so+hl) intersects any box.
    A, B: tip start/end in fixture coords (n,3); D: tool axis (n,3); boxes (nb,2,3)."""
    n = A.shape[0]
    out = np.zeros(n, np.int8)
    for m in nb.prange(n):
        L = math.sqrt((B[m, 0] - A[m, 0]) ** 2 + (B[m, 1] - A[m, 1]) ** 2 + (B[m, 2] - A[m, 2]) ** 2)
        ns = int(L / max(min(rad[m], 2.0), 0.5)) + 1
        hit = False
        for s in range(ns + 1):
            t = s / ns
            tx = A[m, 0] + (B[m, 0] - A[m, 0]) * t
            ty = A[m, 1] + (B[m, 1] - A[m, 1]) * t
            tz = A[m, 2] + (B[m, 2] - A[m, 2]) * t
            total = so[m] + hl
            na = int(total) + 1
            for a in range(na + 1):
                h = total * a / na
                r = rad[m] if h <= so[m] else hr[m]
                px = tx + D[m, 0] * h
                py = ty + D[m, 1] * h
                pz = tz + D[m, 2] * h
                for b in range(boxes.shape[0]):
                    if _pt_box_d2(px, py, pz, boxes[b, 0], boxes[b, 1]) < r * r:
                        hit = True
                        break
                if hit:
                    break
            if hit:
                break
        if hit:
            out[m] = 1
    return out
