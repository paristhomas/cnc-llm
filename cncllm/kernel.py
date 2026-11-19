"""Numba kernels: exact swept-volume column heights of a 3-axis tool of revolution.

A 3-axis tool (axis +Z, body extending upward without end) moving tip c(t) = p0 + t (p1 - p0), t in [0, 1], removes
every point P with  P.z >= z(t) + h(d(t))  for some t with d(t) = |P.xy - c(t).xy| <= R.
The remaining material in a column (x, y) is therefore [0, H(x, y)] with
    H(x, y) = min(stock_top, min over moves of zcut(move, x, y)),   zcut = min_t z(t) + h(d(t))  over d(t) <= R.
This is exact for a box stock held on its bottom face (single setup, tool from +Z): no grid enters zcut, only the place
where it is evaluated (grid cell centres for maps, arbitrary probe points for the surface metric).

zcut per move:
  vertical move:        z_low + h(d)
  flat tool, any move:  z(t) is linear, so the minimum is at an end of the t-interval where d(t) <= R
  profiled, horizontal: z0 + h(d_min)
  profiled, inclined:   f(t) = z(t) + h(d(t)) is convex on the interval (d convex, h convex non-decreasing) ->
                        golden-section minimisation to 1e-10 of the interval
Tool rows: kind R cr tip_r cot   (kind 0 flat, 1 ball, 2 bull, 3 cone)
"""
from __future__ import annotations

import math

import numba as nb
import numpy as np

GOLD = 0.5 * (math.sqrt(5.0) - 1.0)
INF = 1e30


@nb.njit(cache=True, inline="always")
def prof(kind, R, cr, tip, cot, d):
    if kind == 0:
        return 0.0
    if kind == 1:
        return R - math.sqrt(max(R * R - d * d, 0.0))
    if kind == 2:
        e = max(d - (R - cr), 0.0)
        return cr - math.sqrt(max(cr * cr - e * e, 0.0))
    return max(d - tip, 0.0) * cot


@nb.njit(cache=True)
def zcut(x0, y0, z0, x1, y1, z1, kind, R, cr, tip, cot, px, py):
    """Lowest height of the tool's cutting surface over column (px, py) during the move; INF if never over it."""
    wx, wy = px - x0, py - y0
    ux, uy, dz = x1 - x0, y1 - y0, z1 - z0
    a = ux * ux + uy * uy
    if a < 1e-18:
        d = math.sqrt(wx * wx + wy * wy)
        if d > R:
            return INF
        return min(z0, z1) + prof(kind, R, cr, tip, cot, d)
    b = wx * ux + wy * uy
    c = wx * wx + wy * wy - R * R
    disc = b * b - a * c
    if disc < 0.0:
        return INF
    s = math.sqrt(disc)
    t0 = max((b - s) / a, 0.0)
    t1 = min((b + s) / a, 1.0)
    if t0 > t1:
        return INF
    if kind == 0:
        return min(z0 + t0 * dz, z0 + t1 * dz)
    tc = min(max(b / a, t0), t1)
    if abs(dz) < 1e-12:
        ex, ey = wx - tc * ux, wy - tc * uy
        return z0 + prof(kind, R, cr, tip, cot, math.sqrt(ex * ex + ey * ey))
    lo, hi = t0, t1
    ta = hi - GOLD * (hi - lo)
    tb = lo + GOLD * (hi - lo)
    ex, ey = wx - ta * ux, wy - ta * uy
    fa = z0 + ta * dz + prof(kind, R, cr, tip, cot, math.sqrt(ex * ex + ey * ey))
    ex, ey = wx - tb * ux, wy - tb * uy
    fb = z0 + tb * dz + prof(kind, R, cr, tip, cot, math.sqrt(ex * ex + ey * ey))
    for _ in range(80):
        if hi - lo < 1e-10:
            break
        if fa < fb:
            hi, tb, fb = tb, ta, fa
            ta = hi - GOLD * (hi - lo)
            ex, ey = wx - ta * ux, wy - ta * uy
            fa = z0 + ta * dz + prof(kind, R, cr, tip, cot, math.sqrt(ex * ex + ey * ey))
        else:
            lo, ta, fa = ta, tb, fb
            tb = lo + GOLD * (hi - lo)
            ex, ey = wx - tb * ux, wy - tb * uy
            fb = z0 + tb * dz + prof(kind, R, cr, tip, cot, math.sqrt(ex * ex + ey * ey))
    best = min(fa, fb)
    for t in (t0, t1, tc):
        ex, ey = wx - t * ux, wy - t * uy
        v = z0 + t * dz + prof(kind, R, cr, tip, cot, math.sqrt(ex * ex + ey * ey))
        if v < best:
            best = v
    return best


@nb.njit(cache=True)
def simulate_grid(M, T, tool_rows, H, owner, x0, y0, res, flute_len, stickout, holder_R, coarse, cblock, eps):
    """Replay moves in order on the height field H (ny, nx), cell centres x0 + (j + .5) res.

    M rows: x0 y0 z0 x1 y1 z1 tool rapid feed rpm line spindle ; tool_rows[tool] -> row in T (or -1: no tool).
    Returns per-move arrays: removed volume, max removed column thickness, flags bitmask
        1 rapid removes material  2 spindle off while removing  4 shank contact (above flute length)
        8 holder collision        16 non-centre-cutting plunge  (set by caller)
    coarse: per-block max of H (block size cblock cells) for fast holder rejection.
    """
    n = M.shape[0]
    ny, nx = H.shape
    vol = np.zeros(n)
    thick = np.zeros(n)
    flags = np.zeros(n, np.int32)
    area = res * res
    cny, cnx = coarse.shape
    for m in range(n):
        tr = tool_rows[int(M[m, 6])]
        if tr < 0:
            continue
        kind = int(T[tr, 0]); R = T[tr, 1]; cr = T[tr, 2]; tip = T[tr, 3]; cot = T[tr, 4]
        ax, ay, az, bx, by, bz = M[m, 0], M[m, 1], M[m, 2], M[m, 3], M[m, 4], M[m, 5]
        zlo = min(az, bz)
        fl = flute_len[tr]
        # ---- holder collision (material above tip + stickout within holder radius)
        HR = holder_R[tr]
        zh = zlo + stickout[tr]
        cj0 = max(int(math.floor((min(ax, bx) - HR - x0) / (res * cblock))), 0)
        cj1 = min(int(math.floor((max(ax, bx) + HR - x0) / (res * cblock))), cnx - 1)
        ci0 = max(int(math.floor((min(ay, by) - HR - y0) / (res * cblock))), 0)
        ci1 = min(int(math.floor((max(ay, by) + HR - y0) / (res * cblock))), cny - 1)
        maybe = False
        for ci in range(ci0, ci1 + 1):
            for cj in range(cj0, cj1 + 1):
                if coarse[ci, cj] > zh + eps:
                    maybe = True
        if maybe:
            j0 = max(int(math.floor((min(ax, bx) - HR - x0) / res)), 0)
            j1 = min(int(math.ceil((max(ax, bx) + HR - x0) / res)), nx - 1)
            i0 = max(int(math.floor((min(ay, by) - HR - y0) / res)), 0)
            i1 = min(int(math.ceil((max(ay, by) + HR - y0) / res)), ny - 1)
            hit = False
            for i in range(i0, i1 + 1):
                py = y0 + (i + 0.5) * res
                for j in range(j0, j1 + 1):
                    if H[i, j] > zh + eps:
                        px = x0 + (j + 0.5) * res
                        zc = zcut(ax, ay, az + stickout[tr], bx, by, bz + stickout[tr], 0, HR, 0.0, 0.0, 0.0, px, py)
                        if zc < H[i, j] - eps:
                            hit = True
                            break
                if hit:
                    break
            if hit:
                flags[m] |= 8
        # ---- material removal
        j0 = max(int(math.floor((min(ax, bx) - R - x0) / res)), 0)
        j1 = min(int(math.ceil((max(ax, bx) + R - x0) / res)), nx - 1)
        i0 = max(int(math.floor((min(ay, by) - R - y0) / res)), 0)
        i1 = min(int(math.ceil((max(ay, by) + R - y0) / res)), ny - 1)
        v = 0.0
        tk = 0.0
        for i in range(i0, i1 + 1):
            py = y0 + (i + 0.5) * res
            for j in range(j0, j1 + 1):
                h = H[i, j]
                if h <= zlo:
                    continue
                px = x0 + (j + 0.5) * res
                zc = zcut(ax, ay, az, bx, by, bz, kind, R, cr, tip, cot, px, py)
                if zc < h:
                    if zc < 0.0:
                        zc_eff = 0.0 if h > 0.0 else h
                    else:
                        zc_eff = zc
                    dt = h - zc_eff
                    if dt > 0:
                        v += dt * area
                        if dt > tk:
                            tk = dt
                        H[i, j] = zc_eff
                        owner[i, j] = m
                        ci = i // cblock
                        cj = j // cblock
        vol[m] = v
        thick[m] = tk
        if v > 0.0:
            if tk > eps:
                if M[m, 7] > 0.5 and tk > eps:
                    flags[m] |= 1
                if M[m, 11] < 0.5:
                    flags[m] |= 2
            if tk > fl + eps:
                flags[m] |= 4
            # refresh the coarse max over touched blocks
            for ci in range(i0 // cblock, i1 // cblock + 1):
                for cj in range(j0 // cblock, j1 // cblock + 1):
                    mx = 0.0
                    for i in range(ci * cblock, min((ci + 1) * cblock, ny)):
                        for j in range(cj * cblock, min((cj + 1) * cblock, nx)):
                            if H[i, j] > mx:
                                mx = H[i, j]
                    coarse[ci, cj] = mx
    return vol, thick, flags


# ------------------------------------------------------------------ exact point queries (bucketed moves)
@nb.njit(cache=True)
def build_buckets(M, T, tool_rows, bx0, by0, cs, nx, ny):
    n = M.shape[0]
    cnt = np.zeros(nx * ny + 1, np.int64)
    for m in range(n):
        tr = tool_rows[int(M[m, 6])]
        if tr < 0:
            continue
        R = T[tr, 1]
        j0 = max(int((min(M[m, 0], M[m, 3]) - R - bx0) / cs), 0)
        j1 = min(int((max(M[m, 0], M[m, 3]) + R - bx0) / cs), nx - 1)
        i0 = max(int((min(M[m, 1], M[m, 4]) - R - by0) / cs), 0)
        i1 = min(int((max(M[m, 1], M[m, 4]) + R - by0) / cs), ny - 1)
        for i in range(i0, i1 + 1):
            for j in range(j0, j1 + 1):
                cnt[i * nx + j + 1] += 1
    start = np.cumsum(cnt)
    idx = np.empty(start[-1], np.int64)
    fill = start[:-1].copy()
    for m in range(n):
        tr = tool_rows[int(M[m, 6])]
        if tr < 0:
            continue
        R = T[tr, 1]
        j0 = max(int((min(M[m, 0], M[m, 3]) - R - bx0) / cs), 0)
        j1 = min(int((max(M[m, 0], M[m, 3]) + R - bx0) / cs), nx - 1)
        i0 = max(int((min(M[m, 1], M[m, 4]) - R - by0) / cs), 0)
        i1 = min(int((max(M[m, 1], M[m, 4]) + R - by0) / cs), ny - 1)
        for i in range(i0, i1 + 1):
            for j in range(j0, j1 + 1):
                c = i * nx + j
                idx[fill[c]] = m
                fill[c] += 1
    zmin = np.minimum(M[:, 2], M[:, 5])
    for c in range(nx * ny):
        a, b = start[c], start[c + 1]
        if b - a > 1:
            seg = idx[a:b]
            idx[a:b] = seg[np.argsort(zmin[seg], kind="mergesort")]
    return start, idx, zmin


@nb.njit(parallel=True, cache=True)
def column_heights(PX, PY, M, T, tool_rows, start, idx, zmin, bx0, by0, cs, nx, ny, ztop):
    """Exact remaining-material top H at arbitrary XY points (min of stock top and every move's zcut)."""
    out = np.empty(PX.shape[0])
    who = np.full(PX.shape[0], -1, np.int64)
    for k in nb.prange(PX.shape[0]):
        px, py = PX[k], PY[k]
        best = ztop
        bw = -1
        j = int((px - bx0) / cs)
        i = int((py - by0) / cs)
        if 0 <= i < ny and 0 <= j < nx:
            c = i * nx + j
            for q in range(start[c], start[c + 1]):
                m = idx[q]
                if zmin[m] >= best:
                    break
                tr = tool_rows[int(M[m, 6])]
                v = zcut(M[m, 0], M[m, 1], M[m, 2], M[m, 3], M[m, 4], M[m, 5],
                         int(T[tr, 0]), T[tr, 1], T[tr, 2], T[tr, 3], T[tr, 4], px, py)
                if v < best:
                    best = v
                    bw = m
        out[k] = best
        who[k] = bw
    return out, who


# ------------------------------------------------------------------ target height field (mesh rasteriser)
@nb.njit(cache=True)
def raster_top(V, F, x0, y0, res, nx, ny):
    """Highest mesh surface over every cell centre (0 where the mesh is absent)."""
    Ht = np.zeros((ny, nx))
    for f in range(F.shape[0]):
        a, b, c = V[F[f, 0]], V[F[f, 1]], V[F[f, 2]]
        den = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
        if abs(den) < 1e-14:
            continue
        xmin = min(a[0], b[0], c[0]); xmax = max(a[0], b[0], c[0])
        ymin = min(a[1], b[1], c[1]); ymax = max(a[1], b[1], c[1])
        j0 = max(int(math.ceil((xmin - x0) / res - 0.5)), 0)
        j1 = min(int(math.floor((xmax - x0) / res - 0.5)), nx - 1)
        i0 = max(int(math.ceil((ymin - y0) / res - 0.5)), 0)
        i1 = min(int(math.floor((ymax - y0) / res - 0.5)), ny - 1)
        for i in range(i0, i1 + 1):
            py = y0 + (i + 0.5) * res
            for j in range(j0, j1 + 1):
                px = x0 + (j + 0.5) * res
                l1 = ((b[1] - c[1]) * (px - c[0]) + (c[0] - b[0]) * (py - c[1])) / den
                l2 = ((c[1] - a[1]) * (px - c[0]) + (a[0] - c[0]) * (py - c[1])) / den
                l3 = 1.0 - l1 - l2
                if l1 >= -1e-9 and l2 >= -1e-9 and l3 >= -1e-9:
                    z = l1 * a[2] + l2 * b[2] + l3 * c[2]
                    if z > Ht[i, j]:
                        Ht[i, j] = z
    return Ht


@nb.njit(parallel=True, cache=True)
def achievable(Ht, res, kind, R, cr, tip, cot):
    """Lowest material top a single tool can leave without gouging the target height field Ht:
    tip height  zt(c) = max_{|u|<=R} Ht(c+u) - h(|u|)   (drop cutter), then
    Hach(x)     = min_{|x-c|<=R} zt(c) + h(|x-c|)        (envelope of all gouge-free placements)."""
    ny, nx = Ht.shape
    r = int(math.ceil(R / res))
    zt = np.empty_like(Ht)
    for i in nb.prange(ny):
        for j in range(nx):
            best = -1e30
            for di in range(-r, r + 1):
                ii = i + di
                if ii < 0 or ii >= ny:
                    continue
                for dj in range(-r, r + 1):
                    jj = j + dj
                    if jj < 0 or jj >= nx:
                        continue
                    d = math.sqrt(di * di + dj * dj) * res
                    if d > R:
                        continue
                    v = Ht[ii, jj] - prof(kind, R, cr, tip, cot, d)
                    if v > best:
                        best = v
            zt[i, j] = best
    out = np.empty_like(Ht)
    for i in nb.prange(ny):
        for j in range(nx):
            best = 1e30
            for di in range(-r, r + 1):
                ii = i + di
                if ii < 0 or ii >= ny:
                    continue
                for dj in range(-r, r + 1):
                    jj = j + dj
                    if jj < 0 or jj >= nx:
                        continue
                    d = math.sqrt(di * di + dj * dj) * res
                    if d > R:
                        continue
                    v = zt[ii, jj] + prof(kind, R, cr, tip, cot, d)
                    if v < best:
                        best = v
            out[i, j] = best
    return out
