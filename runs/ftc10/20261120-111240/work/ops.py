"""G-code writer and machining operations on top of cam.py (my own code)."""
import math
import numpy as np
from scipy import ndimage
from cam import TOOLS, GC, GF, Setup, contours, simplify, runs, densify, disc_max, up2


def fmt(x):
    s = f"{x:.3f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


class Writer:
    def __init__(self):
        self.L = ['%', '(ftc10 - NIST FTC-10, 3+2 indexed, own CAM generator)', 'G21 G90 G17 G94', 'G54']
        self.frame = None; self.T = None; self.pos = None; self.F = None; self.mode = None
        self.spindle = False
        self.stats = {}

    def c(self, s):
        self.L.append(f'({s})')

    def set_frame(self, fr):
        if self.T is not None:
            self.L.append('M5')
        if self.frame is not None:
            self.L.append('G69')
        self.L.append(fr.header().split('\n')[0]); self.L.append('G53.1')
        self.frame = fr; self.pos = np.array([0.0, 0.0, 150.0]); self.mode = None
        if self.T is not None:
            self.L.append(f"S{TOOLS[self.T]['rpm']} M3")

    def end_frame(self):
        if self.frame is not None:
            self.L.append('G69'); self.frame = None; self.pos = None

    def tool(self, n):
        if self.T == n:
            return
        self.L.append('M5'); self.L.append(f'T{n} M6'); self.L.append(f'G43 H{n}')
        self.L.append(f"S{TOOLS[n]['rpm']} M3")
        self.T = n; self.mode = None; self.F = None
        if self.pos is not None:
            self.pos = np.array([self.pos[0], self.pos[1], 150.0])
        self.L.append('G0 Z150')

    def mv(self, g, p, F=None):
        p = np.asarray(p, float)
        words = []
        if self.mode != g:
            words.append(g); self.mode = g
        for k, a in enumerate('XYZ'):
            if self.pos is None or abs(p[k] - self.pos[k]) > 5e-4:
                words.append(a + fmt(p[k]))
        if g != 'G0' and F is not None and F != self.F:
            words.append('F' + fmt(round(F))); self.F = F
        if len(words) > (1 if words and words[0] in ('G0', 'G1') else 0):
            self.L.append(' '.join(words))
        self.pos = p

    def arc(self, g, p, I, J, F):
        words = [g]; self.mode = g
        words += ['X' + fmt(p[0]), 'Y' + fmt(p[1]), 'Z' + fmt(p[2]), 'I' + fmt(I), 'J' + fmt(J)]
        if F != self.F:
            words.append('F' + fmt(round(F))); self.F = F
        self.L.append(' '.join(words)); self.pos = np.asarray(p, float)

    def finish(self):
        self.L.append('M5'); self.end_frame(); self.L.append('M30'); self.L.append('%')
        return '\n'.join(self.L) + '\n'


class Cutter:
    """emits moves for one tool inside one setup, with collision-aware approach/links."""

    def __init__(self, W, S, n):
        self.W = W; self.S = S; self.n = n; self.T = TOOLS[n]
        W.tool(n)
        S.clearance(self.T)
        self.Fc = self.T['feed']; self.Fp = self.T['feed'] / 3.0

    def zclr_seg(self, a, b):
        P = densify(np.array([a[:2], b[:2]], float), 0.2)
        j, i = self.S.ci(P[:, 0], P[:, 1])
        return float(self.S.Zclr[j, i].max())

    def approach(self, u, v, w, feed_link_ok=None):
        """bring the tool to (u,v,w) ready to cut. feed_link_ok: callable(a,b)->bool for G1 links."""
        W = self.W; p = W.pos
        tgt = np.array([u, v, w])
        if p is not None and feed_link_ok is not None and abs(p[2] - w) < 1e-6 and feed_link_ok(p, tgt):
            W.mv('G1', tgt, self.Fc); return
        zt = float(self.S.Zclr[self.S.ci(u, v)])
        zl = max(self.zclr_seg(p, tgt), zt)
        if p[2] < zl:
            W.mv('G0', [p[0], p[1], zl])
        W.mv('G0', [u, v, W.pos[2]])
        if W.pos[2] > max(zt, w) + 1e-6:
            W.mv('G0', [u, v, max(zt, w)])
        if W.pos[2] > w + 1e-6:
            W.mv('G1', tgt, self.Fp)

    def path(self, P, F=None, record=True):
        P = np.asarray(P, float)
        for q in P[1:]:
            self.W.mv('G1', q, F or self.Fc)
        if record and len(P) > 1:
            self.S.record(densify(P, 0.1))

    def retract(self):
        p = self.W.pos
        if p is None:
            return
        zt = float(self.S.Zclr[self.S.ci(p[0], p[1])])
        if p[2] < zt:
            self.W.mv('G0', [p[0], p[1], zt])


# ---------------------------------------------------------------------------- operations
def level_masks(S, T, z, allow, ap, Hc=None):
    R = T['R']
    Hc = S.Hc if Hc is None else Hc
    obst = Hc > z + 1e-4
    d = ndimage.distance_transform_edt(~obst) * GC
    mt = S.mintip(T)
    apok = disc_max(S.Sc, (R - 0.1) / GC) <= z + ap + 0.05
    need = ndimage.distance_transform_edt(~(S.Sc > z + 0.05)) * GC <= R + 0.1
    f = d - R - allow - GC / 2
    ok = (mt <= z) & apok
    return f, ok, need


def rough(W, S, n, allow=0.3, ap=2.0, step=None, wbot=None, floors=(), wtop=None, umask=None):
    T = TOOLS[n]; R = T['R']
    step = step or 0.6 * T['D']
    C = Cutter(W, S, n)
    top = wtop if wtop is not None else float(S.Sc[np.isfinite(S.Sc)].max())
    lv = list(np.arange(top - ap, wbot - 1e-6, -ap))
    if not lv or lv[-1] > wbot + 0.3:
        lv.append(wbot)
    lv += [f for f in floors if wbot - 1e-6 <= f < top]
    lv = sorted(set(round(x, 3) for x in lv), reverse=True)
    out = []
    for z in lv:
        f, ok, need = level_masks(S, T, z, allow, ap + 0.3)
        cand = (f >= 0) & ok & need
        if umask is not None:
            cand &= umask
        if not cand.any():
            continue
        allowed = (f >= 0) & ok

        def linkok(a, b):
            P = densify(np.array([a[:2], b[:2]]), GC)
            j, i = S.ci(P[:, 0], P[:, 1])
            return bool(allowed[j, i].all()) and np.linalg.norm(b[:2] - a[:2]) < 3 * step

        ns = max(1, int(round(step / GC)))
        rows = np.nonzero(cand.any(axis=1))[0]
        r0 = rows.min(); rws = list(range(r0 + ns // 2, rows.max() + 1, ns)) or [(r0 + rows.max()) // 2]
        if rows.max() - rws[-1] > ns // 3:
            rws.append(rows.max() - 1 if rows.max() - 1 > rws[-1] else rows.max())
        pts_all = []
        flip = False
        for j in rws:
            segs = runs(cand[j])
            if flip:
                segs = [(b, a) for a, b in segs[::-1]]
            for a, b in segs:
                ua = S.uc0 + a * GC; ub = S.uc0 + b * GC; vv = S.vc0 + j * GC
                C.approach(ua, vv, z, linkok)
                P = np.array([[ua, vv, z], [ub, vv, z]])
                C.path(P); pts_all.append(densify(P, 0.1))
            flip = not flip
        # boundary contour at roughing allowance
        fc = np.where(ok, f, -1.0)
        for line in contours(fc, S.uc0, S.vc0, GC):
            j, i = S.ci(line[:, 0], line[:, 1])
            keep = need[j, i] & (np.abs(f[j, i]) < 0.6)
            for a, b in runs(keep):
                if b - a < 2:
                    continue
                P = line[a:b + 1]
                P = orient(P, fc, S.uc0, S.vc0, GC)
                P = simplify(P, 0.01)
                P3 = np.column_stack([P, np.full(len(P), z)])
                C.approach(P3[0, 0], P3[0, 1], z, linkok)
                C.path(P3); pts_all.append(densify(P3, 0.1))
        if pts_all:
            S.sweep_level(np.vstack(pts_all), z, R)
            S.clearance(T)
        out.append(z)
    C.retract()
    S.commit(R)
    return out


def orient(P, f, u0, v0, g):
    """orient so the allowed side (f>0) is on the left -> part on the right -> climb with M3."""
    k = len(P) // 2
    a = P[max(k - 1, 0)]; b = P[min(k + 1, len(P) - 1)]
    t = b - a; nrm = np.array([-t[1], t[0]]); ln = np.linalg.norm(nrm)
    if ln < 1e-9:
        return P
    nrm /= ln
    m = P[k]
    def samp(p):
        i = int(round((p[0] - u0) / g)); j = int(round((p[1] - v0) / g))
        j = min(max(j, 0), f.shape[0] - 1); i = min(max(i, 0), f.shape[1] - 1)
        return f[j, i]
    if samp(m + 2 * g * nrm) < samp(m - 2 * g * nrm):
        return P[::-1]
    return P


def fine_masks(S, T, z, allow):
    R = T['R']
    obst = S.Hf > z + 1e-4
    d = ndimage.distance_transform_edt(~obst) * GF
    f = d - R - allow - GF / 2
    return f, d


def coarse_to_fine(S, A):
    sub = A[S.mv0:S.mv1, S.mu0:S.mu1]
    return np.repeat(np.repeat(sub, 5, axis=0), 5, axis=1)


def finish(W, S, n, levels, allow=0.0, ap=2.0, rest_of=None, near=0.25, umask=None, minlen=0.3):
    """waterline contours at the given levels (frame w). rest_of: tool number of the previous tool."""
    T = TOOLS[n]; R = T['R']
    C = Cutter(W, S, n)
    mt_c = S.mintip(T)
    for z in sorted(levels, reverse=True):
        f, d = fine_masks(S, T, z, allow)
        okc = (mt_c <= z) & (S.Sc <= z + ap + 0.05)
        ok = coarse_to_fine(S, okc)
        if umask is not None:
            ok &= coarse_to_fine(S, umask)
        keep = ok & (d <= R + allow + GF / 2 + near)
        if rest_of is not None:
            Tb = TOOLS[rest_of]
            fb, _ = fine_masks(S, Tb, z, 0.0)
            mtb = coarse_to_fine(S, S.mintip(Tb) <= z)
            alb = (fb >= 0) & mtb
            db = ndimage.distance_transform_edt(~alb) * GF
            keep &= db > (Tb['R'] - R + 0.03)
        fm = np.where(ok, f, -1.0)
        pts_all = []
        for line in contours(fm, S.uf0, S.vf0, GF):
            j = np.clip(np.round((line[:, 1] - S.vf0) / GF).astype(int), 0, f.shape[0] - 1)
            i = np.clip(np.round((line[:, 0] - S.uf0) / GF).astype(int), 0, f.shape[1] - 1)
            kp = keep[j, i]
            closed = np.allclose(line[0], line[-1]) and kp.all()
            for a, b in runs(kp):
                P = line[a:b + 1]
                if len(P) < 3 or np.linalg.norm(np.diff(P, axis=0), axis=1).sum() < minlen:
                    continue
                P = orient(P, fm, S.uf0, S.vf0, GF)
                P = simplify(P, 0.003)
                P3 = np.column_stack([P, np.full(len(P), z)])
                C.approach(P3[0, 0], P3[0, 1], z)
                C.path(P3); pts_all.append(densify(P3, 0.1))
        if pts_all:
            S.sweep_level(np.vstack(pts_all), z, R)
            S.clearance(T)
    C.retract()
    S.commit(R)


def helix(W, S, n, holes, pitch=0.5, allow=0.0, Ffac=0.6):
    """holes: list of (u, v, r_hole, w_top, w_bot). climb (G3) for internal."""
    T = TOOLS[n]; R = T['R']
    C = Cutter(W, S, n)
    F = T['feed'] * Ffac
    for (u, v, rh, wt, wb) in holes:
        rp = rh - R - allow
        assert rp > 0.05, (u, v, rh, R)
        sx = u + rp
        C.approach(sx, v, wt + 0.5)
        w = wt + 0.5
        pts = []
        while w > wb + 1e-6:
            w = max(w - pitch, wb)
            W.arc('G3', [sx, v, w], -rp, 0, F)
        W.arc('G3', [sx, v, wb], -rp, 0, F)
        th = np.linspace(0, 2 * np.pi, 60)
        for wz in np.arange(wb, wt + 0.5, 0.5):
            pts.append(np.column_stack([u + rp * np.cos(th), v + rp * np.sin(th), np.full(60, wz)]))
        W.mv('G1', [u, v, wb], F)
        S.record(np.vstack(pts))
        C.retract()
    C.retract()
    S.commit(R)
