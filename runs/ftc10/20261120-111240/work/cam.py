"""Small home-made 3+2 CAM engine (axis-aligned frames only).

Everything here is my own code: z-buffer height maps of the part, EDT-based tool offsets,
marching squares for waterline contours, zig-zag level roughing, a voxel stock model for
air-cut avoidance and holder clearance.  numpy/scipy/shapely/trimesh only.
"""
import math
import numpy as np
import trimesh
from scipy import ndimage
from shapely.geometry import LineString

TOOLS = {
    1: dict(kind='flat', D=10, fl=3, F=25, L=40, HD=32, cl=0.06, rpm=18000),
    2: dict(kind='flat', D=6, fl=3, F=18, L=30, HD=32, cl=0.04, rpm=24000),
    3: dict(kind='flat', D=3, fl=2, F=10, L=22, HD=32, cl=0.02, rpm=24000),
    4: dict(kind='flat', D=1.5, fl=2, F=5, L=14, HD=20, cl=0.01, rpm=24000),
    5: dict(kind='bull', D=8, fl=3, F=20, L=35, HD=32, cl=0.05, rpm=24000, cr=1.0),
    6: dict(kind='ball', D=6, fl=2, F=14, L=32, HD=32, cl=0.03, rpm=24000),
    7: dict(kind='ball', D=3, fl=2, F=8, L=22, HD=32, cl=0.02, rpm=24000),
    8: dict(kind='ball', D=1, fl=2, F=3, L=12, HD=20, cl=0.008, rpm=24000),
}
for t in TOOLS.values():
    t['R'] = t['D'] / 2.0
    t['Rh'] = t['HD'] / 2.0
    t['feed'] = t['cl'] * t['fl'] * t['rpm']

VOX = 0.5     # voxel size of the stock model
GC = 0.25     # coarse grid (roughing, clearance)
GF = 0.05     # fine grid (finishing contours)


def euler_R(I, J, K):
    def rz(a):
        a = math.radians(a); c, s = math.cos(a), math.sin(a)
        return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1.0]])

    def rx(a):
        a = math.radians(a); c, s = math.cos(a), math.sin(a)
        return np.array([[1.0, 0, 0], [0, c, -s], [0, s, c]])
    return rz(I) @ rx(J) @ rz(K)


def box_tris(lo, hi):
    lo = np.asarray(lo, float); hi = np.asarray(hi, float)
    b = trimesh.creation.box(extents=hi - lo)
    b.apply_translation((hi + lo) / 2)
    return b.triangles


# --------------------------------------------------------------------------- z-buffer
def zbuffer(tris, u0, v0, g, nu, nv, H=None):
    """max frame-w of triangles at cell centres (u0+i*g, v0+j*g). H[j, i]."""
    if H is None:
        H = np.full((nv, nu), -np.inf)
    A = tris[:, 0]; B = tris[:, 1]; C = tris[:, 2]
    den = (B[:, 0] - A[:, 0]) * (C[:, 1] - A[:, 1]) - (B[:, 1] - A[:, 1]) * (C[:, 0] - A[:, 0])
    ok = np.abs(den) > 1e-12
    A, B, C, den = A[ok], B[ok], C[ok], den[ok]
    uu = np.stack([A[:, 0], B[:, 0], C[:, 0]], 1); vv = np.stack([A[:, 1], B[:, 1], C[:, 1]], 1)
    i0 = np.ceil((uu.min(1) - u0) / g - 1e-9).astype(np.int64)
    i1 = np.floor((uu.max(1) - u0) / g + 1e-9).astype(np.int64)
    j0 = np.ceil((vv.min(1) - v0) / g - 1e-9).astype(np.int64)
    j1 = np.floor((vv.max(1) - v0) / g + 1e-9).astype(np.int64)
    i0 = np.maximum(i0, 0); j0 = np.maximum(j0, 0)
    i1 = np.minimum(i1, nu - 1); j1 = np.minimum(j1, nv - 1)
    keep = (i1 >= i0) & (j1 >= j0)
    A, B, C, den, i0, i1, j0, j1 = A[keep], B[keep], C[keep], den[keep], i0[keep], i1[keep], j0[keep], j1[keep]
    eps = 1e-9

    def bary(px, py, A, B, C, den):
        w1 = ((px - A[:, 0]) * (C[:, 1] - A[:, 1]) - (py - A[:, 1]) * (C[:, 0] - A[:, 0])) / den
        w2 = ((B[:, 0] - A[:, 0]) * (py - A[:, 1]) - (B[:, 1] - A[:, 1]) * (px - A[:, 0])) / den
        return w1, w2

    K = 8
    small = ((i1 - i0) < K) & ((j1 - j0) < K)
    sA, sB, sC, sd = A[small], B[small], C[small], den[small]
    si0, si1, sj0, sj1 = i0[small], i1[small], j0[small], j1[small]
    for di in range(K):
        for dj in range(K):
            ii = si0 + di; jj = sj0 + dj
            valid = (ii <= si1) & (jj <= sj1)
            if not valid.any():
                continue
            idx = np.nonzero(valid)[0]
            a, b, c, d = sA[idx], sB[idx], sC[idx], sd[idx]
            px = u0 + ii[idx] * g; py = v0 + jj[idx] * g
            w1, w2 = bary(px, py, a, b, c, d)
            ins = (w1 >= -eps) & (w2 >= -eps) & (w1 + w2 <= 1 + eps)
            if not ins.any():
                continue
            z = a[:, 2] + w1 * (b[:, 2] - a[:, 2]) + w2 * (c[:, 2] - a[:, 2])
            np.maximum.at(H, (jj[idx][ins], ii[idx][ins]), z[ins])
    big = np.nonzero(~small)[0]
    for k in big:
        ii, jj = np.meshgrid(np.arange(i0[k], i1[k] + 1), np.arange(j0[k], j1[k] + 1))
        px = u0 + ii * g; py = v0 + jj * g
        a, b, c, d = A[k], B[k], C[k], den[k]
        w1 = ((px - a[0]) * (c[1] - a[1]) - (py - a[1]) * (c[0] - a[0])) / d
        w2 = ((b[0] - a[0]) * (py - a[1]) - (b[1] - a[1]) * (px - a[0])) / d
        ins = (w1 >= -eps) & (w2 >= -eps) & (w1 + w2 <= 1 + eps)
        if ins.any():
            z = a[2] + w1 * (b[2] - a[2]) + w2 * (c[2] - a[2])
            sub = H[jj[ins], ii[ins]]
            H[jj[ins], ii[ins]] = np.maximum(sub, z[ins])
    return H


# --------------------------------------------------------------------------- filters
def disc_max(A, r_cells):
    """grey dilation of A with a flat disc of radius r_cells (row decomposition)."""
    r = int(math.ceil(r_cells))
    out = np.full_like(A, -np.inf)
    for dy in range(-r, r + 1):
        w = int(math.floor(math.sqrt(max(r_cells ** 2 - dy ** 2, 0))))
        m = ndimage.maximum_filter1d(A, size=2 * w + 1, axis=1, mode='constant', cval=-np.inf)
        if dy > 0:
            out[dy:, :] = np.maximum(out[dy:, :], m[:-dy, :])
        elif dy < 0:
            out[:dy, :] = np.maximum(out[:dy, :], m[-dy:, :])
        else:
            out = np.maximum(out, m)
    return out


# --------------------------------------------------------------------------- marching squares
def contours(f, u0, v0, g):
    """iso-line f=0 (allowed where f>=0). returns list of (N,2) arrays in (u,v)."""
    ny, nx = f.shape
    b = f >= 0
    code = (b[:-1, :-1].astype(np.uint8) | (b[:-1, 1:] << 1) | (b[1:, 1:] << 2) | (b[1:, :-1] << 3))
    table = {1: [(3, 0)], 2: [(0, 1)], 3: [(3, 1)], 4: [(1, 2)], 5: [(3, 0), (1, 2)], 6: [(0, 2)],
             7: [(3, 2)], 8: [(2, 3)], 9: [(0, 2)], 10: [(0, 1), (2, 3)], 11: [(1, 2)], 12: [(1, 3)],
             13: [(0, 1)], 14: [(0, 3)]}
    segs = []
    for cval, pairs in table.items():
        ii, jj = np.nonzero(code == cval)          # ii = row (v), jj = col (u)
        if len(ii) == 0:
            continue
        for ea, eb in pairs:
            segs.append(np.stack([ii, jj, np.full_like(ii, ea), np.full_like(ii, eb)], 1))
    if not segs:
        return []
    S = np.concatenate(segs)

    def edge_id(i, j, e):
        # 0 bottom h(i,j), 1 right v(i,j+1), 2 top h(i+1,j), 3 left v(i,j)
        hi = np.where(e == 2, i + 1, i); hj = j
        vi = i; vj = np.where(e == 1, j + 1, j)
        isv = (e == 1) | (e == 3)
        return np.where(isv, (vi * nx + vj) * 2 + 1, (hi * nx + hj) * 2)

    ea = edge_id(S[:, 0], S[:, 1], S[:, 2]); eb = edge_id(S[:, 0], S[:, 1], S[:, 3])

    def edge_pt(eid):
        isv = eid % 2 == 1
        k = eid // 2
        i = k // nx; j = k % nx
        pu = np.empty(len(eid)); pv = np.empty(len(eid))
        # horizontal edge between (i,j) and (i,j+1)
        h = ~isv
        f0 = f[i[h], j[h]]; f1 = f[i[h], np.minimum(j[h] + 1, nx - 1)]
        t = np.clip(f0 / np.where(f0 - f1 == 0, 1e-12, f0 - f1), 0, 1)
        pu[h] = u0 + (j[h] + t) * g; pv[h] = v0 + i[h] * g
        f0 = f[i[isv], j[isv]]; f1 = f[np.minimum(i[isv] + 1, ny - 1), j[isv]]
        t = np.clip(f0 / np.where(f0 - f1 == 0, 1e-12, f0 - f1), 0, 1)
        pu[isv] = u0 + j[isv] * g; pv[isv] = v0 + (i[isv] + t) * g
        return pu, pv

    adj = {}
    for k in range(len(S)):
        adj.setdefault(int(ea[k]), []).append(k)
        adj.setdefault(int(eb[k]), []).append(k)
    used = np.zeros(len(S), bool)
    lines = []
    for s0 in range(len(S)):
        if used[s0]:
            continue
        used[s0] = True
        chain = [int(ea[s0]), int(eb[s0])]
        # extend forward
        for direction in (0, 1):
            while True:
                e = chain[-1]
                nxt = [k for k in adj.get(e, []) if not used[k]]
                if not nxt:
                    break
                k = nxt[0]; used[k] = True
                e2 = int(eb[k]) if int(ea[k]) == e else int(ea[k])
                chain.append(e2)
            chain.reverse()
        pu, pv = edge_pt(np.array(chain, dtype=np.int64))
        lines.append(np.stack([pu, pv], 1))
    return lines


def simplify(P, tol=0.004):
    if len(P) < 3:
        return P
    closed = np.allclose(P[0], P[-1])
    ls = LineString(P).simplify(tol, preserve_topology=False)
    Q = np.array(ls.coords)
    if closed and not np.allclose(Q[0], Q[-1]):
        Q = np.vstack([Q, Q[:1]])
    return Q


def runs(mask):
    """start/end indices (inclusive) of True runs in a 1-D bool array."""
    m = np.concatenate([[False], mask, [False]]).astype(np.int8)
    d = np.diff(m)
    s = np.nonzero(d == 1)[0]; e = np.nonzero(d == -1)[0] - 1
    return list(zip(s, e))


# --------------------------------------------------------------------------- frames
class Frame:
    """axis-aligned tilted work plane. u,v,w = frame x,y,z."""

    def __init__(self, name, I, J, K, origin):
        self.name = name; self.I, self.J, self.K = I, J, K
        self.R = euler_R(I, J, K); self.o = np.asarray(origin, float)
        R = np.round(self.R).astype(int)
        assert np.allclose(self.R, R, atol=1e-9)
        # frame axis k = sign * world axis a
        self.ax = [int(np.nonzero(R[:, k])[0][0]) for k in range(3)]
        self.sg = [int(R[self.ax[k], k]) for k in range(3)]

    def to_frame(self, P):
        return (np.asarray(P) - self.o) @ self.R

    def to_world(self, F):
        return np.asarray(F) @ self.R.T + self.o

    def header(self):
        o = self.o
        return f"G68.2 X{o[0]:.3f} Y{o[1]:.3f} Z{o[2]:.3f} I{self.I:g} J{self.J:g} K{self.K:g}\nG53.1"


class Stock:
    def __init__(self, lo, hi):
        self.lo = np.array(lo, float)
        self.n = np.round((np.array(hi) - self.lo) / VOX).astype(int)
        self.v = np.ones(self.n, bool)

    def frame_view(self, fr):
        """voxels transposed to (u,v,w) order, flipped so indices ascend with frame coords.
        returns view, and for each frame axis (c0, step) with coord = c0 + k*VOX (cell centre)."""
        V = np.transpose(self.v, fr.ax)
        axes = []
        for k in range(3):
            a = fr.ax[k]; s = fr.sg[k]
            n = self.n[a]
            cen_world0 = self.lo[a] + 0.5 * VOX
            if s > 0:
                c0 = cen_world0 - fr.o[a]
            else:
                V = np.flip(V, axis=k)
                c0 = -(self.lo[a] + (n - 0.5) * VOX - fr.o[a])
            axes.append(c0)
        return V, axes

    def top_map(self, fr):
        """S[v_idx, u_idx] = top frame-w of stock in column (voxel resolution), -inf if empty."""
        V, (cu, cv, cw) = self.frame_view(fr)
        nw = V.shape[2]
        any_ = V.any(axis=2)
        last = nw - 1 - np.argmax(V[:, :, ::-1], axis=2)
        top = cw + last * VOX + 0.5 * VOX
        S = np.where(any_, top, -np.inf)
        return S.T, cu, cv  # (v,u)

    def remove_above(self, fr, cut, cu, cv):
        """remove voxels whose bottom is >= cut[v,u] (cut on voxel (u,v) grid)."""
        V, (_, _, cw) = self.frame_view(fr)
        nw = V.shape[2]
        wb = cw + np.arange(nw) * VOX - 0.5 * VOX     # voxel bottoms
        C = cut.T[:, :, None]                         # (u,v,1)
        rem = wb[None, None, :] >= C
        V &= ~rem   # V is a view (transpose/flip) of self.v


# --------------------------------------------------------------------------- setup engine
def up2(A, f=2):
    return np.repeat(np.repeat(A, f, axis=0), f, axis=1)


class Setup:
    MARG = 80   # coarse cells of margin around the stock (20 mm)

    def __init__(self, job, fr, fine_margin=7.0, vmin=None):
        self.job = job; self.fr = fr
        st = job.stock
        S, cu, cv = st.top_map(fr)              # voxel grid (v,u)
        self.nvu = S.shape
        m = self.MARG
        self.uc0 = cu - 0.125 - m * GC; self.vc0 = cv - 0.125 - m * GC
        self.nu = S.shape[1] * 2 + 2 * m; self.nv = S.shape[0] * 2 + 2 * m
        # fine ROI (stock + fine_margin), aligned to coarse cells
        umin_s = cu - 0.25; umax_s = cu + S.shape[1] * VOX - 0.25
        vmin_s = cv - 0.25; vmax_s = cv + S.shape[0] * VOX - 0.25
        if vmin is not None:
            vmin_s = max(vmin_s, vmin)
        self.mu0 = int(math.floor((umin_s - fine_margin - self.uc0) / GC))
        self.mu1 = int(math.ceil((umax_s + fine_margin - self.uc0) / GC))
        self.mv0 = max(0, int(math.floor((vmin_s - fine_margin - self.vc0) / GC)))
        self.mv1 = int(math.ceil((vmax_s + fine_margin - self.vc0) / GC))
        self.uf0 = self.uc0 + self.mu0 * GC - 0.1; self.vf0 = self.vc0 + self.mv0 * GC - 0.1
        self.nuf = (self.mu1 - self.mu0) * 5; self.nvf = (self.mv1 - self.mv0) * 5
        # keep-solid heights
        kt = fr.to_frame(job.keep_tris.reshape(-1, 3)).reshape(-1, 3, 3)
        self.Hf = zbuffer(kt, self.uf0, self.vf0, GF, self.nuf, self.nvf)
        Hc = zbuffer(kt, self.uc0, self.vc0, GC, self.nu, self.nv)
        pool = self.Hf.reshape(self.nvf // 5, 5, self.nuf // 5, 5).max(axis=(1, 3))
        Hc[self.mv0:self.mv1, self.mu0:self.mu1] = np.maximum(Hc[self.mv0:self.mv1, self.mu0:self.mu1], pool)
        self.Hc = ndimage.maximum_filter(Hc, size=3)
        vt = fr.to_frame(job.vise_tris.reshape(-1, 3)).reshape(-1, 3, 3)
        self.Vc = ndimage.maximum_filter(zbuffer(vt, self.uc0, self.vc0, GC, self.nu, self.nv), size=3)
        self.refresh_stock()

    # ---- stock
    def refresh_stock(self):
        S, cu, cv = self.job.stock.top_map(self.fr)
        m = self.MARG
        Sc = np.full((self.nv, self.nu), -np.inf)
        Sc[m:m + 2 * S.shape[0], m:m + 2 * S.shape[1]] = up2(S)
        self.Sc = Sc
        self.tipmin = np.full((self.nv, self.nu), np.inf)   # for voxel update

    def commit(self, R):
        """apply the swept tool (flat, radius R) recorded in tipmin to the voxel stock."""
        if not np.isfinite(self.tipmin).any():
            return
        cut = -disc_max(-self.tipmin, max(R / GC - 1.0, 0.5))
        m = self.MARG
        nv, nu = self.nvu
        sub = cut[m:m + 2 * nv, m:m + 2 * nu]
        cutv = sub.reshape(nv, 2, nu, 2).max(axis=(1, 3))
        self.job.stock.remove_above(self.fr, cutv + 0.05, None, None)
        self.refresh_stock()

    # ---- coordinate helpers
    def ci(self, u, v):
        return (np.clip(np.round((np.asarray(v) - self.vc0) / GC).astype(int), 0, self.nv - 1),
                np.clip(np.round((np.asarray(u) - self.uc0) / GC).astype(int), 0, self.nu - 1))

    def mintip(self, T, Sc=None):
        Sc = self.Sc if Sc is None else Sc
        R, Rh, L = T['R'], T['Rh'], T['L']
        A = np.maximum(disc_max(Sc, (Rh + 0.6) / GC) - L + 0.6, disc_max(self.Vc, (Rh + 5.0) / GC) - L + 5.0)
        B = disc_max(self.Vc, (R + 5.0) / GC) + 5.0
        return np.maximum(A, B)

    def clearance(self, T):
        R, Rh, L = T['R'], T['Rh'], T['L']
        a = disc_max(self.Sc, (R + 1.5) / GC) + 1.5
        b = np.maximum(disc_max(self.Sc, (Rh + 1.0) / GC) - L + 1.0, disc_max(self.Vc, (Rh + 5.0) / GC) - L + 5.0)
        c = disc_max(self.Vc, (R + 5.0) / GC) + 5.0
        self.Zclr = np.maximum(np.maximum(a, b), c)

    def record(self, pts):
        """pts (N,3) frame coords of tool tip along cutting moves (already densified)."""
        j, i = self.ci(pts[:, 0], pts[:, 1])
        np.minimum.at(self.tipmin, (j, i), pts[:, 2])

    def sweep_level(self, pts, z, R):
        """mark columns swept at level z (update Sc)."""
        if len(pts) == 0:
            return
        mk = np.zeros((self.nv, self.nu), bool)
        j, i = self.ci(pts[:, 0], pts[:, 1]); mk[j, i] = True
        d = ndimage.distance_transform_edt(~mk) * GC
        sw = d <= R - 0.2
        self.Sc = np.where(sw, np.minimum(self.Sc, z), self.Sc)


def densify(P, step=0.1):
    out = [P[:1]]
    for a, b in zip(P[:-1], P[1:]):
        n = max(1, int(np.ceil(np.linalg.norm(b - a) / step)))
        t = np.linspace(0, 1, n + 1)[1:, None]
        out.append(a + (b - a) * t)
    return np.vstack(out)
