"""FTC-10 3+2 program generator (own toolpaths). Frames: TOP (+Z), MX (tool from -X), PX (tool from +X)."""
import os, sys, time
import numpy as np
from scipy.ndimage import maximum_filter
from shapely.geometry import box, Polygon, Point
from shapely.ops import unary_union, nearest_points
from hm import tip_map, NEG
from frames import get_H, FR

W = os.path.dirname(os.path.abspath(__file__))
TOOLS = {
    1: dict(kind='flat', R=5.0, fl=25, so=40, rpm=18000, f=3240),
    2: dict(kind='flat', R=3.0, fl=18, so=30, rpm=24000, f=2880),
    3: dict(kind='flat', R=1.5, fl=10, so=22, rpm=24000, f=960),
    4: dict(kind='flat', R=0.75, fl=5, so=14, rpm=24000, f=480),
    6: dict(kind='ball', R=3.0, fl=14, so=32, rpm=24000, f=1440),
    7: dict(kind='ball', R=1.5, fl=8, so=22, rpm=24000, f=960),
}
SAFE = {'TOP': 80.0, 'MX': 24.0, 'PX': 24.0, 'PY': 120.0, 'MY': 120.0}
STOCKW = {'TOP': 76.5, 'MX': 18.5, 'PX': 18.5}


class Prog:
    def __init__(self):
        self.L = ['%', '(FTC-10 3+2, own generator)', 'G21 G90 G17 G94', 'G54']
        self.frame = None; self.tool = None; self.spin = False; self.F = None
        self.pos = None

    def o(self, s): self.L.append(s)

    def fmt(self, p):
        return 'X%.3f Y%.3f Z%.3f' % (p[0], p[1], p[2])

    def set_frame(self, name):
        if self.frame == name: return
        self.o('M5'); self.spin = False
        if self.frame not in (None, 'TOP'):
            self.o('G69')
        if name != 'TOP':
            I, J, K = FR[name]
            self.o(f'G68.2 X0 Y0 Z0 I{I} J{J} K{K}')
            self.o('G53.1')
        self.frame = name; self.pos = None; self.F = None

    def set_tool(self, n):
        if self.tool != n:
            self.o('M5'); self.spin = False
            self.o(f'T{n} M6'); self.o(f'G43 H{n}')
            self.tool = n; self.pos = None; self.F = None
        if not self.spin:
            self.o('S%d M3' % TOOLS[n]['rpm']); self.spin = True

    def g0(self, p):
        self.o('G0 ' + self.fmt(p)); self.pos = np.array(p, float)

    def g1(self, p, F):
        s = 'G1 ' + self.fmt(p)
        if F != self.F:
            s += ' F%d' % F; self.F = F
        self.o(s); self.pos = np.array(p, float)

    def up_safe(self, rapid=True):
        if self.pos is None: return
        p = self.pos.copy(); p[2] = SAFE[self.frame]
        if rapid: self.g0(p)
        else: self.g1(p, 4000)

    def goto_safe(self, u, v):
        if self.pos is None:
            self.o('G0 X%.3f Y%.3f' % (u, v)); self.g0((u, v, SAFE[self.frame]))
        else:
            if self.pos[2] < SAFE[self.frame] - 1e-6: self.up_safe()
            self.g0((u, v, SAFE[self.frame]))

    def path(self, P, f, plunge):
        """continuous cutting polyline; first point already reached"""
        prev = self.pos
        for p in P:
            d = p - prev
            hz = np.hypot(d[0], d[1])
            F = plunge if (d[2] < -0.2 and -d[2] > hz) else f
            self.g1(p, F); prev = p


def simplify(P, tol=2e-4):
    if len(P) < 3: return P
    d2 = P[:-2] - 2 * P[1:-1] + P[2:]
    keep = np.ones(len(P), bool)
    keep[1:-1] = np.abs(d2).max(1) > tol
    return P[keep]


class Frame:
    def __init__(self, name):
        self.name = name
        self.G, self.H = get_H(name)
        self.C = np.full_like(self.H, NEG)
        self.T = {}

    def tip(self, n, allow=0.0):
        k = (n, allow)
        if k not in self.T:
            t = TOOLS[n]
            fn = os.path.join(W, f'T_{self.name}_{n}_{allow}.npy')
            if os.path.exists(fn):
                self.T[k] = np.load(fn)
            else:
                t0 = time.time()
                self.T[k] = tip_map(self.H, self.G.g, t['kind'], t['R'], allow)
                np.save(fn, self.T[k])
                print(f'  tipmap {self.name} T{n} a{allow}: {time.time()-t0:.1f}s', file=sys.stderr)
        return self.T[k]

    def zrow(self, Tm, iv, iu0, iu1, L):
        idx = np.arange(iu0, iu1 + 1) if iu1 >= iu0 else np.arange(iu0, iu1 - 1, -1)
        z = np.maximum(np.maximum(Tm[iv, idx], self.C[iv, idx]), L)
        return idx, z


def raster(pr, fr, n, Tm, u0, u1, vrows, L=NEG, entry_air=False, needed_below=None):
    """zigzag rows along u at given v values; returns True if anything emitted"""
    G = fr.G; t = TOOLS[n]
    iu0, iu1 = G.iu(u0), G.iu(u1)
    rows = []
    for v in vrows:
        iv = G.iv(v)
        idx, z = fr.zrow(Tm, iv, iu0, iu1, L)
        if needed_below is not None:
            uu = G.u[idx]
            stock = needed_below[1](uu, G.v[iv])
            if not np.any((z < needed_below[0] - 0.05) & stock):
                continue
        rows.append((iv, idx, z))
    if not rows: return False
    pts = []
    for k, (iv, idx, z) in enumerate(rows):
        if k % 2 == 1:
            idx, z = idx[::-1], z[::-1]
        if pts:
            # connector along v at current u end
            iu = idx[0]; ivp = int(pts[-1][1][-1])
            ivs = np.arange(ivp, iv + (1 if iv > ivp else -1), 1 if iv > ivp else -1)
            zc = np.maximum(np.maximum(Tm[ivs, iu], fr.C[ivs, iu]), L)
            pts.append((np.full(len(ivs), iu), ivs, zc))
        pts.append((idx, np.full(len(idx), iv), z))
    iu = np.concatenate([p[0] for p in pts]); iv = np.concatenate([p[1] for p in pts])
    z = np.concatenate([p[2] for p in pts])
    P = np.stack([G.u[iu], G.v[iv], z], 1)
    # connectors: also cut through the moves between row ends (z already safe)
    P = simplify(P)
    pr.goto_safe(P[0, 0], P[0, 1])
    if entry_air:
        pr.g0((P[0, 0], P[0, 1], P[0, 2] + 1.0))
    pr.g1(P[0], t['f'] // 3)
    pr.path(P[1:], t['f'], t['f'] // 3)
    if entry_air:
        pr.up_safe(True)
    else:
        pr.g1(P[-1] + [0, 0, 1.0], t['f']); pr.up_safe(False)
    return True


def mask_polys(M, G):
    from shapely import affinity
    boxes = []
    for iv in range(M.shape[0]):
        r = M[iv]
        if not r.any(): continue
        d = np.diff(np.concatenate([[0], r.view(np.int8), [0]]))
        st = np.nonzero(d == 1)[0]; en = np.nonzero(d == -1)[0]
        for a, b in zip(st, en):
            boxes.append(box(a - 0.5, iv - 0.5, b - 0.5, iv + 0.5))
    if not boxes: return []
    U = unary_union(boxes).buffer(0)
    U = affinity.affine_transform(U, [G.g, 0, 0, G.g, G.u[0], G.v[0]])
    return list(U.geoms) if hasattr(U, 'geoms') else [U]


def contour(pr, fr, n, Tm, L, region, extra=0.0, rough=False, Lprev=None, minlen=1.0):
    """finish walls at level L: tool centre on boundary of {Tm<=L}, kept only where a wall is near"""
    G = fr.G; t = TOOLS[n]
    u0, u1, v0, v1 = region
    a0, a1, b0, b1 = G.iu(u0), G.iu(u1), G.iv(v0), G.iv(v1)
    Ts = Tm[b0:b1 + 1, a0:a1 + 1]; Cs = fr.C[b0:b1 + 1, a0:a1 + 1]
    M = (Ts <= L + 0.002) & (Cs <= L + 0.002)
    class SG: pass
    sg = SG(); sg.u = G.u[a0:a1 + 1]; sg.v = G.v[b0:b1 + 1]; sg.g = G.g
    polys = mask_polys(M, sg)
    Tnb = maximum_filter(Ts, size=9)
    out = 0
    for P in polys:
        Pin = P.buffer(-(0.05 + extra), join_style=2)
        if Pin.is_empty or P.area < 2.0: continue
        inner = P.buffer(-1.0 - extra)
        geoms = list(Pin.geoms) if hasattr(Pin, 'geoms') else [Pin]
        for gp in geoms:
            for ring in [gp.exterior] + list(gp.interiors):
                ring = ring.simplify(0.01)
                xy = np.array(ring.coords)[:-1]
                if len(xy) < 3: continue
                iu = np.clip(np.round((xy[:, 0] - sg.u[0]) / G.g).astype(int), 0, len(sg.u) - 1)
                iv = np.clip(np.round((xy[:, 1] - sg.v[0]) / G.g).astype(int), 0, len(sg.v) - 1)
                near = Tnb[iv, iu] > L + 0.05
                # drop vertices on region border
                onb = (np.abs(xy[:, 0] - u0) < 0.3) | (np.abs(xy[:, 0] - u1) < 0.3) | \
                      (np.abs(xy[:, 1] - v0) < 0.3) | (np.abs(xy[:, 1] - v1) < 0.3)
                near = fill_gaps(xy, near, 3.0) & ~onb
                if not near.any(): continue
                runs = []
                if near.all():
                    runs.append(np.concatenate([xy, xy[:1]]))
                else:
                    k0 = int(np.nonzero(~near)[0][0])
                    xr = np.roll(xy, -k0, 0); nr = np.roll(near, -k0)
                    cur = []
                    for i in range(len(xr)):
                        if nr[i]:
                            if not cur and i > 0: cur.append(xr[i - 1])
                            cur.append(xr[i])
                        elif cur:
                            cur.append(xr[i]); runs.append(np.array(cur)); cur = []
                    if cur:
                        cur.append(xr[0]); runs.append(np.array(cur))
                for r in runs:
                    if LineStringLen(r) < minlen: continue
                    emit_contour(pr, fr, n, r, L, inner, rough, Lprev)
                    out += 1
    return out


def fill_gaps(xy, near, gap):
    """set short False runs (cyclic, length < gap) to True"""
    n = len(near)
    if near.all() or not near.any(): return near
    seg = np.hypot(*(np.roll(xy, -1, 0) - xy).T)
    k0 = int(np.nonzero(near)[0][0])
    idx = (np.arange(n) + k0) % n
    out = near.copy()
    i = 0
    while i < n:
        if not near[idx[i]]:
            j = i
            ln = 0.0
            while j < n and not near[idx[j]]:
                ln += seg[idx[j - 1]] if j > 0 else 0
                j += 1
            ln += seg[idx[j - 1]]
            if ln < gap:
                out[idx[i:j]] = True
            i = j
        else:
            i += 1
    return out


def LineStringLen(r):
    return float(np.sum(np.hypot(*np.diff(r, axis=0).T)))


def entry_pt(inner, p):
    if inner is None or inner.is_empty: return None
    q = nearest_points(inner, Point(p))[0]
    if q.distance(Point(p)) > 3.0: return None
    return np.array([q.x, q.y])


def emit_contour(pr, fr, n, r, L, inner, rough, Lprev):
    t = TOOLS[n]
    e0 = entry_pt(inner, r[0]); e1 = entry_pt(inner, r[-1])
    s = e0 if e0 is not None else r[0]
    pr.goto_safe(s[0], s[1])
    if rough and e0 is not None:
        pr.g0((s[0], s[1], Lprev + 0.5))
    pr.g1((s[0], s[1], L), t['f'] // 3)
    P = np.column_stack([r, np.full(len(r), L)])
    pr.path(P, t['f'], t['f'] // 3)
    if e1 is not None:
        pr.g1((e1[0], e1[1], L), t['f'])
        pr.up_safe(True)
    else:
        pr.up_safe(False)


def rough(pr, fr, n, allow, levels, u0, u1, vrows, stock_fn, region):
    Tm = fr.tip(n, allow)
    Lprev = STOCKW[fr.name]
    for L in levels:
        raster(pr, fr, n, Tm, u0, u1, vrows, L=L, entry_air=True, needed_below=(Lprev, stock_fn))
        contour(pr, fr, n, Tm, L, region, rough=True, Lprev=Lprev, minlen=4.0)
        Lprev = L


def helix(pr, n, u, v, r, wtop, wbot, pitch, wclear):
    t = TOOLS[n]
    if r > 0.9 * t['R']:
        helix(pr, n, u, v, 0.8 * t['R'], wtop, wbot, pitch, wclear)
    pr.goto_safe(u + r, v)
    pr.g0((u + r, v, wclear))
    pr.g1((u + r, v, wtop), t['f'] // 3)
    w = wtop
    F = int(t['f'] * 0.6)
    while w > wbot + 1e-6:
        w = max(w - pitch, wbot)
        pr.o('G3 X%.3f Y%.3f Z%.3f I%.3f J0 F%d' % (u + r, v, w, -r, F)); pr.F = F
    pr.o('G3 X%.3f Y%.3f Z%.3f I%.3f J0' % (u + r, v, wbot, -r))
    pr.pos = np.array([u + r, v, wbot])
    if 0.2 < r <= 0.9 * t['R']:
        pr.g1((u, v, wbot), F)
    pr.up_safe(True)


def frange(a, b, s):
    return list(np.arange(a, b + 1e-9, s))


def main():
    pr = Prog()
    # ---------------- TOP (+Z) ----------------
    fr = Frame('TOP'); fr.C[:] = 50.5
    pr.set_frame('TOP')
    stock_top = lambda u, v: (np.abs(u) <= 23.0) & (np.abs(v) <= 86.5)
    pr.o('(TOP: rough T1)'); pr.set_tool(1)
    levels = frange(50.5, 74.5, 2.0)[::-1]
    rough(pr, fr, 1, 0.3, levels, -25, 25, frange(-90, 90, 5), stock_top, (-25, 25, -90, 90))
    pr.o('(TOP: finish raster T1)')
    raster(pr, fr, 1, fr.tip(1), -25, 25, frange(-88, 88, 7), entry_air=True)
    pr.o('(TOP: finish contour T1 Z50.5)')
    contour(pr, fr, 1, fr.tip(1, -0.08), 50.5, (-25, 25, -90, 90))
    pr.o('(TOP: slots T3)'); pr.set_tool(3)
    C0 = fr.C.copy(); fr.C[:] = 71.95
    T3 = fr.tip(3)
    for L in (73.5, 72.0):
        raster(pr, fr, 3, T3, -25, 25, frange(38.5, 56.5, 1.2), L=L, entry_air=True)
    for L in (74.0, 72.0):
        contour(pr, fr, 3, fr.tip(3, -0.08), L, (-25, 25, 37, 58))
    fr.C = C0
    pr.o('(TOP: tube top edges ball T6)'); pr.set_tool(6)
    fr.C[:] = 70.0
    raster(pr, fr, 6, fr.tip(6), -21, -4, frange(-64, 24, 0.5), entry_air=False)
    fr.C[:] = 50.5
    pr.o('(TOP: counterbores and bores T2)'); pr.set_tool(2)
    for Y in (-52, -30, -8, 14):
        helix(pr, 2, -7.5, Y, 2.0, 75.0, 65.0, 1.0, 76.0)
        helix(pr, 2, -7.5, Y, 0.5, 65.0, 45.3, 0.5, 66.0)

    # ---------------- MX (tool from -X): u=-Y, v=Z, w=-X ----------------
    fr = Frame('MX'); fr.C[:] = -7.5
    pr.set_frame('MX')
    stock_s = lambda u, v: (np.abs(u) <= 87.0) & (v <= 81.5)
    pr.o('(MX: rough T1)'); pr.set_tool(1)
    levels = frange(-7.5, 16.5, 2.0)[::-1]
    rough(pr, fr, 1, 0.3, levels, -88, 88, frange(0.5, 75.5, 5), stock_s, (-88, 88, 0.5, 80))
    pr.o('(MX: contour T1 flange backs)')
    for L in (-6.5, -7.5):
        contour(pr, fr, 1, fr.tip(1, -0.08), L, (-88, 88, 0.5, 80))
    pr.o('(MX: contours T2)'); pr.set_tool(2)
    T2 = fr.tip(2, -0.08)
    for L in (11.5, 8.5, 7.5):
        contour(pr, fr, 2, T2, L, (-88, 88, 0.5, 80))
    for h in np.arange(0.12, 0.95, 0.12):
        contour(pr, fr, 2, T2, 7.5 + h, (-66, -18, 0.5, 80))
    for L in (-6.5, -7.5):
        for reg in ((-88, 88, 0.5, 29), (-88, 88, 46, 80)):
            contour(pr, fr, 2, T2, L, reg)
    pr.o('(MX: ball T6 raster)'); pr.set_tool(6)
    T6 = fr.tip(6)
    raster(pr, fr, 6, T6, -24, 66, frange(0.5, 51.0, 0.7))
    raster(pr, fr, 6, T6, -66, -18, frange(0.5, 76.0, 0.7))
    pr.o('(MX: pad slots T3)'); pr.set_tool(3)
    for u in (-39.0, -50.0):
        pr.goto_safe(u, 2.0); pr.g0((u, 2.0, 13.0)); pr.g1((u, 2.0, 10.75), 320)
        pr.g1((u, 23.0, 10.75), 960); pr.g1((u, 23.0, 10.0), 320); pr.g1((u, 2.0, 10.0), 960)
        pr.up_safe(True)
    pr.o('(MX: holes T4)'); pr.set_tool(4)
    for (Y, Z) in ((31.9, 7.5), (42.9, 7.5), (53.9, 7.5), (35.1, 17.5), (46.1, 17.5), (57.1, 17.5)):
        helix(pr, 4, -Y, Z, 0.48, 11.5, -0.5, 0.25, 12.5)
    for (Y, Z) in ((33.5, 12.5), (44.5, 12.5), (55.5, 12.5)):
        helix(pr, 4, -Y, Z, 1.0, 11.5, 1.62, 0.25, 12.5)
    for (Y, Z) in ((40.5, 61.0), (47.5, 61.0), (54.5, 61.0)):
        helix(pr, 4, -Y, Z, 1.0, 15.5, 4.62, 0.25, 16.5)
    pr.o('(MX: flange counterbores T2)'); pr.set_tool(2)
    for (Y, Z) in ((70, 9), (-70, 9), (70, 66), (-70, 66)):
        helix(pr, 2, -Y, Z, 2.0, -7.5, -9.5, 0.5, -6.5)

    # ---------------- PX (tool from +X): u=Y, v=Z, w=X ----------------
    fr = Frame('PX')
    fr.C[:] = -1.5
    G = fr.G
    fr.C[:, np.abs(G.u) >= 62.0] = 7.5
    pr.set_frame('PX')
    pr.o('(PX: rough T1)'); pr.set_tool(1)
    levels = frange(-1.5, 16.5, 2.0)[::-1]
    rough(pr, fr, 1, 0.3, levels, -88, 88, frange(0.5, 75.5, 5), stock_s, (-88, 88, 0.5, 80))
    pr.o('(PX: finish raster T2)'); pr.set_tool(2)
    T2 = fr.tip(2)
    raster(pr, fr, 2, T2, -88, 88, frange(0.5, 75.5, 4.5), entry_air=True)
    pr.o('(PX: contours T2)')
    T2c = fr.tip(2, -0.08)
    for L in (7.5, 0.5, -1.5):
        contour(pr, fr, 2, T2c, L, (-88, 88, 0.5, 80))
    for h in np.arange(0.1, 1.95, 0.12):
        contour(pr, fr, 2, T2c, -1.5 + h, (-60, 22, 10, 65))
    pr.o('(PX: flange holes T2)')
    for (Y, Z) in ((70, 9), (-70, 9), (70, 66), (-70, 66)):
        pr.goto_safe(Y, Z); pr.g0((Y, Z, 16.5)); pr.g1((Y, Z, 9.3), 960); pr.up_safe(True)
    pr.o('(PX: pocket corners T3)'); pr.set_tool(3)
    T3 = fr.tip(3, -0.08)
    for (cy, cz) in ((-58, 12.5), (20, 12.5), (-58, 62.5), (20, 62.5)):
        reg = (cy - 5, cy + 5, cz - 5, cz + 5)
        contour(pr, fr, 3, T3, 6.0, reg, minlen=0.5)
        contour(pr, fr, 3, T3, 0.5, reg, extra=0.06, minlen=0.5)

    # ---------------- PART-OFF ----------------
    pr.o('(PART-OFF)')
    ZC = -5.5
    from frames import FR as FRD, R_of
    FRD['PY'] = (180, 55, 0); FRD['MY'] = (0, 55, 0)
    for name, sg in (('PY', 1), ('MY', -1)):
        pr.set_frame(name); pr.set_tool(1)
        R = R_of(name)
        ax = R[:, 2]
        c35, s35 = np.cos(np.radians(35)), np.sin(np.radians(35))
        first = True
        svals = list(np.arange(1.5, 19.5, 2.0)) + [19.5]
        for k, sd in enumerate(svals):
            xs = np.array([-25.0, 25.0]) if k % 2 == 0 else np.array([25.0, -25.0])
            Pg = np.column_stack([xs, np.full(2, sg * (82 - c35 * sd)), np.full(2, -0.5 - s35 * sd)])
            P = Pg @ R
            if first:
                Q = (np.array([xs[0], sg * (82 + c35 * 3), -0.5 + s35 * 3])) @ R
                pr.goto_safe(Q[0], Q[1]); pr.g0(Q); first = False
            pr.g1(P[0], 1080); pr.g1(P[1], 3240)
        pr.up_safe(True)
    tabs = (-40.0, 40.0)
    for name, wt, wtab in (('MX', -1.0, 1.0), ('PX', -1.0, 1.0)):
        pr.set_frame(name); pr.set_tool(1)
        us = np.arange(-62, 62.01, 0.5)
        inwin = np.zeros(len(us), bool)
        for tb in tabs:
            inwin |= np.abs(us - tb) < 6.6
        first = True
        levels = list(np.arange(16.5, wt + 1e-9, -2.0))
        if levels[-1] > wt + 1e-9: levels.append(wt)
        for k, L in enumerate(levels):
            z = np.maximum(L, np.where(inwin, wtab, wt))
            uu = us if k % 2 == 0 else us[::-1]
            zz = z if k % 2 == 0 else z[::-1]
            P = simplify(np.column_stack([uu, np.full(len(uu), ZC), zz]))
            if first:
                pr.goto_safe(P[0, 0], ZC); pr.g0((P[0, 0], ZC, 19.5)); first = False
            pr.g1(P[0], 1080)
            pr.path(P[1:], 3240, 1080)
        pr.up_safe(True)
    pr.o('M5'); pr.o('G69'); pr.o('M30'); pr.o('%')
    open(os.path.join(W, 'program.nc'), 'w').write('\n'.join(pr.L) + '\n')
    print('lines', len(pr.L), file=sys.stderr)


if __name__ == '__main__':
    main()
