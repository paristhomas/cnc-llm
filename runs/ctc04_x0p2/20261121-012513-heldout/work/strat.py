# Strategies (rough / finish / linking) on top of cam.py - own code, no CAM libraries.
import math
import numpy as np
from scipy import ndimage
from scipy.spatial import cKDTree
from cam import resample, split_runs, simplify, orient_climb


def disc_lift(mat, r):
    rr = int(math.ceil(r / mat.px))
    yy, xx = np.mgrid[-rr:rr + 1, -rr:rr + 1]
    fp = (xx ** 2 + yy ** 2) * mat.px ** 2 <= r * r
    return ndimage.maximum_filter(mat.M, footprint=fp, mode='nearest')


class Linker:
    """links paths of one tool in one frame; keeps the material model up to date"""
    def __init__(self, prog, mat, zsafe, R, F, Fp, D=None, ramp_deg=3.0):
        self.p, self.mat, self.zsafe, self.R, self.F, self.Fp = prog, mat, zsafe, R, F, Fp
        self.D = 2 * R if D is None else D
        self.ramp = math.tan(math.radians(ramp_deg))
        self.pending = []
        self.lift = None
        self.level_pts = []

    def flush(self):
        if self.pending:
            for paths, z in self.pending:
                self.mat.stamp(paths, z, self.R)
            self.pending = []
            self.lift = None

    def L(self):
        if self.lift is None:
            self.lift = disc_lift(self.mat, self.R + 0.25)
        return self.lift

    def top_at(self, P):
        self.flush()
        j, i = self.mat.ij(np.atleast_2d(P))
        return float(self.L()[j, i].max())

    def new_level(self):
        self.level_pts = []

    def can_link_at_depth(self, A, B, z):
        if not self.level_pts:
            return False
        if np.linalg.norm(B - A) > 3 * self.R + 2:
            return False
        seg = resample(np.vstack([A, B]), 0.2)
        pts = np.vstack(self.level_pts[-4:])
        d, _ = cKDTree(pts).query(seg)
        return bool((d <= self.R - 0.35).all())

    def go(self, P, z, closed, lead=None, allow_depth_link=True, valid=None):
        p = self.p
        P = np.asarray(P)
        cur = None if p.pos is None or p.pos[0] is None else np.array(p.pos[:2])
        ok = False
        if cur is not None and abs(p.pos[2] - z) < 1e-6 and allow_depth_link and valid is not None and self.can_link_at_depth(cur, P[0], z):
            ok = bool(valid(resample(np.vstack([cur, P[0]]), 0.1)).all())
        if ok:
            p.g1(P[0][0], P[0][1], z, self.F)
        else:
            entry = P[0] if lead is None else np.asarray(lead)
            if cur is None:
                p.g0(z=self.zsafe)
                p.g0(entry[0], entry[1])
            else:
                seg = resample(np.vstack([cur, entry]), 1.0)
                zt = min(self.top_at(seg) + 1.0, self.zsafe)
                zt = max(zt, p.pos[2])
                if zt > p.pos[2] + 1e-6:
                    p.g0(z=zt)
                p.g0(entry[0], entry[1])
            ztop = self.top_at(entry if lead is not None else P[:min(len(P), 40)])
            zr = max(ztop + 0.8, z)
            if zr < p.pos[2] - 1e-6:
                p.g0(z=zr)
            depth = ztop - z
            if lead is not None:
                if depth > 0.25 * self.D:
                    # helical-free: short plunge only allowed when shallow; ramp down along a tiny zigzag
                    self._zigzag(entry, P[0], z, ztop + 0.3)
                else:
                    p.g1(entry[0], entry[1], z, self.Fp)
                p.g1(P[0][0], P[0][1], z, self.Fp * 2 if self.Fp * 2 < self.F else self.F)
            elif depth > 0.25 * self.D and len(P) >= 2:
                self._ramp(P, z, ztop + 0.3, closed)
            else:
                p.g1(P[0][0], P[0][1], z, self.Fp)
        for q in P[1:]:
            p.g1(q[0], q[1], z, self.F)
        self.level_pts.append(P)
        self.pending.append(([P], z))

    def _zigzag(self, A, B, z, ztop):
        """ramp down between lead point A and path start B (back and forth)"""
        p = self.p
        A = np.asarray(A); B = np.asarray(B)
        L = np.linalg.norm(B - A)
        if L < 0.3:
            p.g1(A[0], A[1], z, self.Fp)
            return
        p.g1(A[0], A[1], ztop, self.Fp)
        zc = ztop; at_a = True
        dz = L * self.ramp
        while zc > z + 1e-9:
            zc = max(z, zc - dz)
            tgt = B if at_a else A
            p.g1(tgt[0], tgt[1], zc, self.Fp)
            at_a = not at_a
        if not at_a:
            p.g1(A[0], A[1], z, self.Fp)

    def _ramp(self, P, z, ztop, closed):
        p = self.p
        cyc = P if closed else np.vstack([P, P[-2::-1]])
        cseg = np.linalg.norm(np.diff(cyc, axis=0), axis=1)
        if cseg.sum() < 1.0:
            p.g1(P[0][0], P[0][1], z, self.Fp)
            return
        p.g1(P[0][0], P[0][1], ztop, self.Fp)
        s = 0.0
        done = False
        k = 0
        fr = min(self.F, self.Fp * 2)
        while not done:
            for k in range(len(cyc) - 1):
                s += cseg[k]
                zz = ztop - s * self.ramp
                if zz <= z:
                    zz = z
                    done = True
                p.g1(cyc[k + 1][0], cyc[k + 1][1], zz, fr)
                if done:
                    break
        pos = k + 1
        if closed:
            for q in cyc[pos + 1:]:
                p.g1(q[0], q[1], z, self.F)
        else:
            if pos < len(P):
                for q in P[pos - 1::-1]:
                    p.g1(q[0], q[1], z, self.F)
            else:
                for q in cyc[pos + 1:]:
                    p.g1(q[0], q[1], z, self.F)


def order_paths(items, start):
    out = []
    cur = np.asarray(start, float) if start is not None else None
    rest = list(items)
    while rest:
        best = None
        for idx, (P, cl) in enumerate(rest):
            if cur is None:
                best = (0, idx, 0)
                break
            if cl:
                d = np.linalg.norm(P - cur, axis=1)
                k = int(np.argmin(d))
                dd = d[k]
            else:
                k = 0
                dd = np.linalg.norm(P[0] - cur)
            if best is None or dd < best[0]:
                best = (dd, idx, k)
        _, idx, k = best
        P, cl = rest.pop(idx)
        if cl and k:
            P = np.vstack([P[k:-1], P[:k + 1]])
        out.append((P, cl))
        cur = P[-1]
    return out


def rings_of(grid, D, base, s, jmax, keepfn, minlen=0.5, step=0.25):
    out = []
    for j in range(jmax + 1):
        lev = base + j * s
        lines = grid.contours(D, lev)
        res = []
        for l in lines:
            closed = np.linalg.norm(l[0] - l[-1]) < 1e-6
            Q = resample(l, step)
            if closed:
                Q[-1] = Q[0]
            k = keepfn(Q)
            for R_, cl in split_runs(Q, k, minlen=minlen, closed=closed):
                R_ = orient_climb(grid, D, R_)
                R_ = simplify(R_)
                if cl and np.linalg.norm(R_[0] - R_[-1]) > 1e-6:
                    R_ = np.vstack([R_, R_[:1]])
                res.append((R_, cl))
        out.append(res)
        if not lines and j > 0:
            break
    return out


def grad_dir(grid, D, p):
    j, i = grid.ij(np.asarray(p)[None])
    j = int(j[0]); i = int(i[0])
    j0, j1 = max(j - 2, 0), min(j + 2, grid.ny - 1)
    i0, i1 = max(i - 2, 0), min(i + 2, grid.nx - 1)
    gx = (D[j, i1] - D[j, i0]) / max((i1 - i0) * grid.px, 1e-9)
    gy = (D[j1, i] - D[j0, i]) / max((j1 - j0) * grid.px, 1e-9)
    n = math.hypot(gx, gy)
    if n < 1e-9:
        return np.zeros(2)
    return np.array([gx, gy]) / n


def rough(prog, grid, mat, link, R, levels, a, s, domain=None, minstock=0.12, lead=1.5, log=None, holder=None, rest_R=None):
    px = grid.px
    for z in levels:
        link.new_level()
        D = np.minimum(grid.dist(grid.Hp > z - a) - a, grid.dist(grid.Hs > z))
        if holder is not None:
            st, rh = holder
            hok = grid.dist(grid.Hh > z + st - 1.0) >= rh + 1.0
            D = np.where(hok, D, -1.0)
        link.flush()
        vthr = R + px / 2 - 0.03
        def valid(Q, D=D, vthr=vthr):
            jj, ii = grid.ij(Q)
            return D[jj, ii] >= vthr
        Mlift = disc_lift(mat, max(R - 0.1, 0.2))

        def keep(Q):
            j, i = mat.ij(Q)
            k = Mlift[j, i] > z + minstock
            if domain is not None:
                jj, ii = grid.ij(Q)
                k &= domain[jj, ii]
            return k
        free = D >= R
        if domain is not None:
            free &= domain
        if rest_R is not None:
            Rb, ab = rest_R
            Db = np.minimum(grid.dist(grid.Hp > z - ab) - ab, grid.dist(grid.Hs > z))
            if holder is not None:
                Db = np.where(hok, Db, -1.0)
            need = grid.dist(Db >= Rb + px / 2) > (Rb - R) - 0.25
            free &= need
            needd = need
            def keep(Q, keep0=keep, needd=needd):
                jj, ii = grid.ij(Q)
                return keep0(Q) & needd[jj, ii]
        if not free.any():
            continue
        jm = int(math.ceil((D[free].max() - R) / s)) + 1
        rings = rings_of(grid, D, R + px / 2, s, jm, keep)
        cur = prog.pos[:2] if prog.pos and prog.pos[0] is not None else None
        n = 0
        for j in range(len(rings) - 1, -1, -1):
            for P, cl in order_paths(rings[j], cur):
                ld = None
                if lead:
                    g = grad_dir(grid, D, P[0])
                    q = P[0] + lead * g
                    if grid.sample(D, q[None])[0] >= R + 0.6 * lead:
                        ld = q
                link.go(P, z, cl, lead=ld, valid=valid)
                cur = P[-1]
                n += 1
        link.flush()
        if log is not None:
            log.append(('rough', round(z, 3), n))


def finish(prog, grid, link, R, levels, s, domain=None, rest_of=None, eps=0.0, lead=1.0, max_rings=None, log=None, full_levels=(), holder=None):
    px = grid.px
    levels = list(levels)
    nseg = 0
    T = R + px / 2 - 1e-6
    for k, z in enumerate(levels):
        link.new_level()
        shadow = grid.Hk > z
        Dk = grid.dist(shadow)
        zn = levels[k + 1] if k + 1 < len(levels) else None
        Pn = (grid.Hp > zn) if zn is not None else (grid.Hp > -1e8)
        Dn = grid.dist(Pn)
        full = (zn is None) or any(abs(z - f) < 1e-3 for f in full_levels)
        if holder is not None:
            st, rh = holder
            hok = grid.dist(grid.Hh > z + st - 1.0) >= rh + 1.0
            Dk = np.where(hok, Dk, -1.0)
        band = (Dn < T - eps) & (Dk >= T - 0.03)
        if full:
            band |= (Dk >= T - 0.03) & (Dk <= T + 0.3)
        def valid(Q, Dk=Dk):
            jj, ii = grid.ij(Q)
            return Dk[jj, ii] >= T - 0.03
        if domain is not None:
            band &= domain
        if rest_of is not None:
            valid_b = Dk >= rest_of - eps
            touched = grid.dist(valid_b) <= rest_of + 0.12
            bnd = shadow & ndimage.binary_dilation(~shadow)
            floor = (~shadow) & Pn
            rest = (bnd | floor) & ~touched
            if domain is not None:
                rest &= domain
            if not rest.any():
                continue
            band &= grid.dist(rest) <= R + 0.15
        if not band.any():
            continue
        jm = int(math.ceil((Dk[band].max() - R) / s)) + 1
        if max_rings is not None:
            jm = min(jm, max_rings)

        def keep(Q, band=band):
            j, i = grid.ij(Q)
            return band[j, i]
        rings = rings_of(grid, Dk, R + px / 2, s, jm, keep, minlen=0.3, step=0.15)
        cur = prog.pos[:2] if prog.pos and prog.pos[0] is not None else None
        n = 0
        for j in range(len(rings) - 1, -1, -1):
            for P, cl in order_paths(rings[j], cur):
                ld = None
                if lead:
                    g = grad_dir(grid, Dk, P[0])
                    q = P[0] + lead * g
                    if grid.sample(Dk, q[None])[0] >= R + 0.6 * lead:
                        ld = q
                link.go(P, z, cl, lead=ld, valid=valid)
                cur = P[-1]
                n += 1
        link.flush()
        nseg += n
        if log is not None:
            log.append(('fin', round(z, 3), n))
    return nseg


def floors_of(grid, minarea=2.0, flat_tol=0.004):
    H = grid.Hp
    gy, gx = np.gradient(H, grid.px)
    flat = (np.abs(gx) < flat_tol) & (np.abs(gy) < flat_tol) & (H > -1e8)
    v = np.round(H[flat], 3)
    vals, cnt = np.unique(v, return_counts=True)
    fl = sorted(vals[cnt * grid.px ** 2 >= minarea], reverse=True)
    out = []
    for f in fl:
        if not out or abs(out[-1] - f) > 0.01:
            out.append(f)
    res = []
    for f in out:
        m = flat & (np.abs(H - f) < 0.006)
        res.append(float(np.median(H[m])))
    return res
