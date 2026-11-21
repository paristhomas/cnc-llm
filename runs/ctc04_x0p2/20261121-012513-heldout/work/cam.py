# Own heightmap / distance-field toolpath engine for 3+2 frames (no CAM libraries).
import numpy as np, math
from scipy import ndimage
import contourpy
from shapely.geometry import LineString

def rot(I, J, K):
    def Rz(a):
        a = math.radians(a); c, s = math.cos(a), math.sin(a)
        return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1.0]])
    def Rx(a):
        a = math.radians(a); c, s = math.cos(a), math.sin(a)
        return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])
    return Rz(I) @ Rx(J) @ Rz(K)

class Frame:
    def __init__(self, I, J, K, origin):
        self.I, self.J, self.K = I, J, K
        self.R = rot(I, J, K); self.o = np.asarray(origin, float)
    def to_f(self, P):
        return (np.asarray(P, float) - self.o) @ self.R
    def to_g(self, P):
        return np.asarray(P, float) @ self.R.T + self.o

def box_tris(lo, hi):
    lo = np.asarray(lo, float); hi = np.asarray(hi, float)
    c = np.array([[lo[0], lo[1], lo[2]], [hi[0], lo[1], lo[2]], [hi[0], hi[1], lo[2]], [lo[0], hi[1], lo[2]],
                  [lo[0], lo[1], hi[2]], [hi[0], lo[1], hi[2]], [hi[0], hi[1], hi[2]], [lo[0], hi[1], hi[2]]])
    f = [(0, 2, 1), (0, 3, 2), (4, 5, 6), (4, 6, 7), (0, 1, 5), (0, 5, 4), (1, 2, 6), (1, 6, 5), (2, 3, 7), (2, 7, 6), (3, 0, 4), (3, 4, 7)]
    return c[np.array(f)]

def raster_max(T, x0, y0, nx, ny, px):
    """T: (n,3,3) triangles in frame coords. Returns H (ny,nx) = max z at pixel centres (-1e9 empty)."""
    H = np.full(ny * nx, -1e9)
    a, b, c = T[:, 0], T[:, 1], T[:, 2]
    area = (b[:, 0] - a[:, 0]) * (c[:, 1] - a[:, 1]) - (b[:, 1] - a[:, 1]) * (c[:, 0] - a[:, 0])
    keep = np.abs(area) > 1e-12
    T = T[keep]; area = area[keep]
    xmin = T[:, :, 0].min(1); xmax = T[:, :, 0].max(1); ymin = T[:, :, 1].min(1); ymax = T[:, :, 1].max(1)
    i0 = np.maximum(np.ceil((xmin - x0) / px - 0.5).astype(int), 0)
    i1 = np.minimum(np.floor((xmax - x0) / px - 0.5).astype(int), nx - 1)
    j0 = np.maximum(np.ceil((ymin - y0) / px - 0.5).astype(int), 0)
    j1 = np.minimum(np.floor((ymax - y0) / px - 0.5).astype(int), ny - 1)
    wi = i1 - i0 + 1; wj = j1 - j0 + 1
    ok = (wi > 0) & (wj > 0)
    T, area, i0, j0, wi, wj = T[ok], area[ok], i0[ok], j0[ok], wi[ok], wj[ok]
    cnt = wi * wj
    order = np.argsort(cnt)
    T, area, i0, j0, wi, wj, cnt = T[order], area[order], i0[order], j0[order], wi[order], wj[order], cnt[order]
    cs = np.cumsum(cnt)
    start = 0; CH = 8_000_000
    while start < len(T):
        base = cs[start - 1] if start > 0 else 0
        end = int(np.searchsorted(cs, base + CH, side='right'))
        end = max(end, start + 1)
        sl = slice(start, end)
        n = cnt[sl]; tot = int(n.sum())
        tid = np.repeat(np.arange(start, end), n)
        off = np.arange(tot) - np.repeat(np.cumsum(n) - n, n)
        ii = i0[tid] + off % wi[tid]; jj = j0[tid] + off // wi[tid]
        X = x0 + (ii + 0.5) * px; Y = y0 + (jj + 0.5) * px
        A = T[tid, 0]; B = T[tid, 1]; C = T[tid, 2]; ar = area[tid]
        w0 = ((B[:, 0] - X) * (C[:, 1] - Y) - (B[:, 1] - Y) * (C[:, 0] - X)) / ar
        w1 = ((C[:, 0] - X) * (A[:, 1] - Y) - (C[:, 1] - Y) * (A[:, 0] - X)) / ar
        w2 = 1 - w0 - w1
        e = -1e-9
        ins = (w0 >= e) & (w1 >= e) & (w2 >= e)
        z = w0 * A[:, 2] + w1 * B[:, 2] + w2 * C[:, 2]
        np.maximum.at(H, (jj * nx + ii)[ins], z[ins])
        start = end
    return H.reshape(ny, nx)

class Grid:
    """Heightmap of a frame. Hk: keep-out (part + stub + fixture), Hp: part only."""
    def __init__(self, frame, part_tris_g, keep_tris_g, xlim, ylim, px, holder_tris_g=None):
        self.f = frame; self.px = px
        self.x0, self.y0 = xlim[0], ylim[0]
        self.nx = int(math.ceil((xlim[1] - xlim[0]) / px)); self.ny = int(math.ceil((ylim[1] - ylim[0]) / px))
        def prep(Tg):
            T = frame.to_f(Tg.reshape(-1, 3)).reshape(-1, 3, 3)
            n = np.cross(T[:, 1] - T[:, 0], T[:, 2] - T[:, 0])
            return T[n[:, 2] > 1e-12]
        self.Hp = raster_max(prep(part_tris_g), self.x0, self.y0, self.nx, self.ny, px)
        self.Hk = self.Hp.copy()
        self.Hs = np.full_like(self.Hp, -1e9)
        if keep_tris_g is not None and len(keep_tris_g):
            self.Hs = raster_max(prep(keep_tris_g), self.x0, self.y0, self.nx, self.ny, px)
            self.Hk = np.maximum(self.Hk, self.Hs)
        self.Hh = self.Hp.copy()
        if holder_tris_g is not None:
            self.Hh = np.maximum(self.Hh, raster_max(prep(holder_tris_g), self.x0, self.y0, self.nx, self.ny, px))
        self.xs = self.x0 + (np.arange(self.nx) + 0.5) * px
        self.ys = self.y0 + (np.arange(self.ny) + 0.5) * px
    def ij(self, P):
        P = np.asarray(P)
        i = np.clip(((P[..., 0] - self.x0) / self.px - 0.5).round().astype(int), 0, self.nx - 1)
        j = np.clip(((P[..., 1] - self.y0) / self.px - 0.5).round().astype(int), 0, self.ny - 1)
        return j, i
    def sample(self, A, P):
        j, i = self.ij(P); return A[j, i]
    def dist(self, mask):
        """distance (mm) from each pixel to nearest True pixel of mask"""
        if not mask.any():
            return np.full(mask.shape, 1e6)
        return ndimage.distance_transform_edt(~mask) * self.px
    def contours(self, D, level):
        gen = contourpy.contour_generator(self.xs, self.ys, D, line_type=contourpy.LineType.Separate)
        return [l for l in gen.lines(level) if len(l) >= 3]

def coarse(grid, factor):
    """downsampled copy of a grid (max pooling) for roughing"""
    g = Grid.__new__(Grid)
    g.f = grid.f; g.px = grid.px * factor
    ny, nx = grid.ny // factor, grid.nx // factor
    g.nx, g.ny = nx, ny; g.x0, g.y0 = grid.x0, grid.y0
    def pool(H):
        return H[:ny * factor, :nx * factor].reshape(ny, factor, nx, factor).max(axis=(1, 3))
    g.Hp = pool(grid.Hp); g.Hk = pool(grid.Hk); g.Hs = pool(grid.Hs); g.Hh = pool(grid.Hh)
    g.xs = g.x0 + (np.arange(nx) + 0.5) * g.px; g.ys = g.y0 + (np.arange(ny) + 0.5) * g.px
    return g

def resample(P, step):
    P = np.asarray(P)
    seg = np.linalg.norm(np.diff(P, axis=0), axis=1)
    L = np.concatenate([[0], np.cumsum(seg)])
    if L[-1] < 1e-9:
        return P[:1]
    n = max(int(math.ceil(L[-1] / step)), 1)
    s = np.linspace(0, L[-1], n + 1)
    return np.column_stack([np.interp(s, L, P[:, 0]), np.interp(s, L, P[:, 1])])

def split_runs(P, keep, minlen=0.3, closed=False):
    """split polyline P (resampled) into runs where keep is True"""
    runs = []
    if keep.all():
        return [(P, closed)]
    k = keep.copy()
    # grow by one sample for overlap
    k = k | np.r_[k[1:], False] | np.r_[False, k[:-1]]
    if closed and k.any() and not k.all():
        sh = int(np.argmin(k))  # start at a False
        P = np.roll(P[:-1], -sh, axis=0); P = np.vstack([P, P[:1]]); k = np.roll(k[:-1], -sh); k = np.r_[k, k[:1]]
    idx = np.flatnonzero(np.diff(np.r_[0, k.astype(int), 0]))
    for a, b in zip(idx[::2], idx[1::2]):
        Q = P[a:b]
        if len(Q) >= 2 and np.linalg.norm(np.diff(Q, axis=0), axis=1).sum() >= minlen:
            runs.append((Q, False))
    return runs

def simplify(P, tol=0.004):
    if len(P) < 3:
        return np.asarray(P)
    return np.asarray(LineString(P).simplify(tol, preserve_topology=False).coords)

def orient_climb(grid, D, P):
    """reverse P if the material (low distance) is not on the right of travel (M3 climb)"""
    if len(P) < 3:
        return P
    gy, gx = np.gradient(D)
    idx = np.linspace(0, len(P) - 2, min(len(P) - 1, 25)).astype(int)
    t = P[idx + 1] - P[idx]
    j, i = grid.ij(P[idx])
    g = np.column_stack([gx[j, i], gy[j, i]])
    right = np.column_stack([t[:, 1], -t[:, 0]])
    s = np.sum(np.sign(np.sum(g * right, axis=1)))
    return P[::-1] if s > 0 else P


class Material:
    """coarse model of the remaining stock top (frame z) for safe links"""
    def __init__(self, grid, top, px=0.25, poly=None):
        self.px = px; self.x0, self.y0 = grid.x0, grid.y0
        self.nx = int(grid.nx * grid.px / px) + 1; self.ny = int(grid.ny * grid.px / px) + 1
        self.M = np.full((self.ny, self.nx), float(top))
        if poly is not None:
            import shapely
            xs = self.x0 + (np.arange(self.nx) + 0.5) * px; ys = self.y0 + (np.arange(self.ny) + 0.5) * px
            X, Y = np.meshgrid(xs, ys)
            inside = shapely.contains_xy(poly.buffer(0.3), X, Y)
            self.M[~inside] = -1e3
    def ij(self, P):
        P = np.asarray(P)
        i = np.clip(((P[..., 0] - self.x0) / self.px - 0.5).round().astype(int), 0, self.nx - 1)
        j = np.clip(((P[..., 1] - self.y0) / self.px - 0.5).round().astype(int), 0, self.ny - 1)
        return j, i
    def stamp(self, paths, z, R):
        """paths: list of (n,2) arrays cut at level z by tool radius R"""
        mask = np.zeros(self.M.shape, bool)
        for P in paths:
            Q = resample(P, self.px * 0.7) if len(P) > 1 else P
            j, i = self.ij(Q); mask[j, i] = True
        if not mask.any():
            return
        d = ndimage.distance_transform_edt(~mask) * self.px
        cut = d <= R - 0.3
        self.M[cut] = np.minimum(self.M[cut], z)
    def lift(self, R):
        """max of M over a square of half-size R+0.6 around each cell"""
        s = int(math.ceil((R + 0.6) / self.px)) * 2 + 1
        return ndimage.maximum_filter(self.M, size=s, mode='nearest')


class Prog:
    def __init__(self):
        self.L = []
        self.pos = None
        self.tool = None
        self.cut_len = 0
    def w(self, s):
        self.L.append(s)
    def g0(self, x=None, y=None, z=None):
        s = 'G0'
        p = list(self.pos) if self.pos is not None else [None, None, None]
        for k, v in zip('XYZ', (x, y, z)):
            if v is not None:
                s += ' %s%.4f' % (k, v); p['XYZ'.index(k)] = v
        self.pos = p; self.w(s)
    def g1(self, x, y, z, f):
        self.w('G1 X%.4f Y%.4f Z%.4f F%d' % (x, y, z, f)); self.pos = [x, y, z]


class Op:
    """emits paths in one frame with safe links using the material model"""
    def __init__(self, prog, mat, zsafe, R, feed, plunge_feed, ramp_deg=3.0, D=None):
        self.p = prog; self.mat = mat; self.zsafe = zsafe; self.R = R; self.F = feed; self.Fp = plunge_feed
        self.ramp = math.tan(math.radians(ramp_deg)); self.lifted = mat.lift(R) if mat is not None else None
        self.D = 2 * R if D is None else D
    def refresh(self):
        if self.mat is not None:
            self.lifted = self.mat.lift(self.R)
    def hclear(self, P):
        if self.mat is None:
            return self.zsafe
        j, i = self.mat.ij(np.atleast_2d(P))
        return float(self.lifted[j, i].max()) + 1.0
    def travel(self, xy, zlevel):
        """go to above xy, ready to enter at zlevel; returns z where material begins (entry height)"""
        p = self.p
        xy = np.asarray(xy)
        if p.pos is None or p.pos[0] is None:
            p.g0(z=self.zsafe); p.g0(xy[0], xy[1]); zc = self.hclear(xy)
            p.g0(z=max(zc, zlevel)); return zc
        cur = np.array(p.pos[:2]); seg = resample(np.vstack([cur, xy]), 1.0)
        zt = min(self.hclear(seg), self.zsafe)
        zt = max(zt, p.pos[2])
        if zt > p.pos[2] + 1e-6:
            p.g0(z=zt)
        p.g0(xy[0], xy[1])
        zc = self.hclear(xy)
        zd = max(zc, zlevel)
        if zd < p.pos[2] - 1e-6:
            p.g0(z=zd)
        return zc
    def retract(self):
        self.p.g0(z=self.zsafe)
    def cut_path(self, P, z, closed, entry_top=None):
        """cut polyline P at level z with ramp entry if needed"""
        p = self.p
        P = np.asarray(P)
        ztop = self.travel(P[0], z) - 1.0 if entry_top is None else entry_top
        depth = ztop - z
        if depth > 0.25 * self.D and len(P) >= 2:
            # ramp along the path
            Lr = depth / self.ramp
            seg = np.linalg.norm(np.diff(P, axis=0), axis=1); Ltot = seg.sum()
            if Ltot < 0.5:
                p.g1(P[0][0], P[0][1], z, self.Fp)
            else:
                pts = []; s = 0.0; zc = ztop
                cyc = P if closed else np.vstack([P, P[-2::-1]])
                cseg = np.linalg.norm(np.diff(cyc, axis=0), axis=1)
                p.g1(P[0][0], P[0][1], ztop, self.Fp)
                done = False
                while not done:
                    for k in range(len(cyc) - 1):
                        s += cseg[k]
                        zz = ztop - s * self.ramp
                        if zz <= z:
                            zz = z; done = True
                        p.g1(cyc[k + 1][0], cyc[k + 1][1], zz, self.Fp * 2 if self.Fp * 2 < self.F else self.F)
                        if done:
                            break
                # return to start of path at depth along the cycle
                if closed:
                    # continue from current index to the end, then full loop
                    for q in cyc[k + 2:]:
                        p.g1(q[0], q[1], z, self.F)
                else:
                    # go back to the start along the path at depth
                    pos = k + 1
                    if pos < len(P):
                        for q in P[pos - 1::-1]:
                            p.g1(q[0], q[1], z, self.F)
                    else:
                        for q in cyc[pos + 1:]:
                            p.g1(q[0], q[1], z, self.F)
        else:
            p.g1(P[0][0], P[0][1], z, self.Fp)
        for q in P[1:]:
            p.g1(q[0], q[1], z, self.F)
        p.cut_len += 1
