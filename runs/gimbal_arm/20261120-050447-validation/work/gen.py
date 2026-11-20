#!/usr/bin/env python3
"""Toolpath generator for gimbal_arm (own code; trimesh only to read geometry)."""
import json, math, os, sys
import numpy as np
import trimesh
from shapely.geometry import Polygon, LineString, Point, MultiPolygon, box
from shapely.geometry.polygon import orient
from shapely.ops import unary_union, substring, polylabel

HERE = os.path.dirname(os.path.abspath(__file__))
BRIEF = os.path.join(HERE, '..', 'brief')
mesh = trimesh.load(os.path.join(BRIEF, 'part.stl'))
SAFE = 22.0
BOSS = (-45.0, 0.0)
HOLE = (48.0, 0.0)
QS = 32

def section(z):
    s = mesh.section(plane_origin=[0, 0, z], plane_normal=[0, 0, 1])
    if s is None:
        return []
    return list(s.to_2D(to_2D=np.eye(4))[0].polygons_full)

def solid(z):
    """part cross-section at z with holes/slit filled"""
    ps = []
    for p in section(z):
        q = Polygon(p.exterior).buffer(1.0, quad_segs=QS).buffer(-1.0, quad_segs=QS)
        for g in (q.geoms if hasattr(q, 'geoms') else [q]):
            ps.append(Polygon(g.exterior))
    return unary_union(ps) if ps else Polygon()

def geoms(g):
    if g.is_empty:
        return []
    return list(g.geoms) if hasattr(g, 'geoms') else [g]

class G:
    def __init__(s):
        s.L = []; s.x = 0.0; s.y = 0.0; s.z = 150.0; s.f = None
    def o(s, t): s.L.append(t)
    def fmt(s, **k):
        return ' '.join('%s%.4f' % (a.upper(), v) for a, v in k.items())
    def g0(s, x=None, y=None, z=None):
        w = []
        if x is not None and abs(x - s.x) > 1e-5: w.append('X%.4f' % x); s.x = x
        if y is not None and abs(y - s.y) > 1e-5: w.append('Y%.4f' % y); s.y = y
        if z is not None and abs(z - s.z) > 1e-5: w.append('Z%.4f' % z); s.z = z
        if w: s.o('G0 ' + ' '.join(w))
    def g1(s, x=None, y=None, z=None, f=None):
        w = []
        if x is not None and abs(x - s.x) > 1e-5: w.append('X%.4f' % x); s.x = x
        if y is not None and abs(y - s.y) > 1e-5: w.append('Y%.4f' % y); s.y = y
        if z is not None and abs(z - s.z) > 1e-5: w.append('Z%.4f' % z); s.z = z
        if not w: return
        if f is not None and f != s.f: w.append('F%.0f' % f); s.f = f
        s.o('G1 ' + ' '.join(w))
    def circ(s, cx, cy, z, cw, f):
        """full circle from current point around (cx,cy), ending at z (helical if z differs)"""
        w = 'G2' if cw else 'G3'
        t = '%s X%.4f Y%.4f' % (w, s.x, s.y)
        if abs(z - s.z) > 1e-5: t += ' Z%.4f' % z; s.z = z
        t += ' I%.4f J%.4f' % (cx - s.x, cy - s.y)
        if f != s.f: t += ' F%.0f' % f; s.f = f
        s.o(t)
    def tool(s, n, rpm, name):
        s.o('(%s)' % name)
        s.o('M5'); s.o('T%d M6' % n); s.z = 150.0; s.o('G43 H%d' % n)
        s.o('S%d M3' % rpm)
        s.o('G0 Z%.4f' % SAFE); s.z = SAFE
    def path(s, pts, f):
        for p in pts:
            s.g1(p[0], p[1], p[2] if len(p) > 2 else None, f)

g = G()
g.o('%'); g.o('(gimbal_arm - own generator)'); g.o('G21 G90 G17 G94'); g.o('G54')

def ring_from(line_ring, pt):
    """closed path coordinates of ring starting at point nearest pt"""
    ls = LineString(line_ring.coords)
    s = ls.project(Point(pt))
    a = substring(ls, s, ls.length); b = substring(ls, 0, s)
    c = list(a.coords) + list(b.coords)[1:]
    return c

# ---------------------------------------------------------------- T1 roughing
R1 = 5.0; A = 0.3
F1 = 3240; P1 = 1000
g.tool(1, 18000, 'T1 D10 flat - roughing')
YO = 29.0
xs = np.linspace(-69.0, 61.0, 34)

def raster_level(z, sol):
    off = sol.buffer(R1 + A, quad_segs=QS) if not sol.is_empty else Polygon()
    bottom, top = [], []
    for x in xs:
        L = LineString([(x, -YO), (x, YO)])
        pieces = geoms(L.difference(off)) if not off.is_empty else [L]
        for pc in pieces:
            (x0, y0), (x1, y1) = pc.coords[0], pc.coords[-1]
            ya, yb = min(y0, y1), max(y0, y1)
            if yb - ya < 1e-3: continue
            if ya <= -YO + 1e-6:
                bottom.append((x, ya, yb))
            elif yb >= YO - 1e-6:
                top.append((x, yb, ya))
            else:
                print('WARN interior piece', z, x, ya, yb, file=sys.stderr)
    for segs, sgn in ((bottom, -1), (top, 1)):
        first = True
        for (x, ys, ye) in segs:
            if first:
                g.g0(z=SAFE); g.g0(x, ys); g.g0(z=z + 1.0); first = False
            else:
                g.g0(x, ys)
            g.g1(z=z, f=P1)
            g.g1(y=ye, f=F1)
            g.g1(z=z + 1.0, f=F1)
            g.g0(y=ys)
    g.g0(z=SAFE)
    # contour clean-up for each polygon of the offset
    for poly in geoms(off):
        ring = orient(poly, sign=-1.0).exterior
        best = None
        for (x, ys, ye) in bottom:
            if ring.distance(Point(x, ye)) < 1e-4:
                if best is None or abs(x - poly.centroid.x) < abs(best[0] - poly.centroid.x):
                    best = (x, ys, ye)
        if best is None:
            print('WARN no entry for contour', z, file=sys.stderr); continue
        x, ys, ye = best
        g.g0(x, ys); g.g0(z=z + 1.0); g.g1(z=z, f=P1); g.g1(y=ye, f=F1)
        g.path(ring_from(ring, (x, ye)), F1)
        g.g1(x, ye, f=F1); g.g1(y=ys, f=F1); g.g0(z=SAFE)

def boss_r(z):
    best = 0
    for p in section(z):
        c = np.array(p.exterior.coords)
        d = np.hypot(c[:, 0] - BOSS[0], c[:, 1] - BOSS[1])
        if d.mean() < 25 and np.hypot(p.centroid.x - BOSS[0], p.centroid.y) < 2:
            best = max(best, d.max())
    return best

def dome_rings(z):
    rin = boss_r(z) + A + R1
    rout = 15.0 + A + R1
    n = max(1, math.ceil((rout - rin) / 3.8))
    rcs = np.linspace(rout, rin, n + 1)
    cx, cy = BOSS
    g.g0(z=SAFE); g.g0(cx - rout, cy); g.g0(z=z + 1.0); g.g1(z=z, f=P1)
    for rc in rcs:
        g.g1(cx - rc, cy, f=F1)
        g.circ(cx, cy, z, True, F1)
    g.g1(cx - rout, cy, f=F1)
    g.g0(z=SAFE)

for z in (19.7, 16.0):
    g.o('(rough level %.2f)' % z); raster_level(z, solid(z))
for z in (19.0, 18.3, 17.6, 16.9):
    g.o('(dome rest ring %.2f)' % z); dome_rings(z)
for z in (12.3, 10.3, 5.0, -0.3):
    g.o('(rough level %.2f)' % z); raster_level(z, solid(z if z > 0 else 0.5))

# ---------------------------------------------------------------- T1 finishing
g.o('(T1 finish lug top Z12)')
lug = [p for p in geoms(solid(11.0)) if p.centroid.x > 0][0]
boss15 = Point(BOSS).buffer(15.0, quad_segs=64)
outline = solid(3.0)
g.g0(z=SAFE)
lx0, ly0, lx1, ly1 = lug.bounds
xl = np.linspace(lx0 + 1.0, lx1 - 1.0, 3)
yy = ly1 + 6.0
g.g0(xl[0], -yy); g.g0(z=13.0); g.g1(z=12.0, f=P1)
d = 1
for i, x in enumerate(xl):
    g.g1(x, -yy * d, f=F1)
    g.g1(x, yy * d, f=F1)
    d = -d
g.g0(z=SAFE)

g.o('(T1 finish Z10 floor raster)')
outer = outline.buffer(3.0, quad_segs=QS)
S = outer.difference(boss15.buffer(R1, quad_segs=QS)).difference(lug.buffer(R1, quad_segs=QS))
for x in np.arange(-68.0, 60.01, 7.5):
    L = LineString([(x, -40), (x, 40)])
    for pc in geoms(L.intersection(S)):
        if pc.geom_type != 'LineString' or pc.length < 0.5: continue
        a, b = pc.coords[0], pc.coords[-1]
        if outer.exterior.distance(Point(a)) > 1e-4:
            a, b = b, a
        g.g0(z=SAFE); g.g0(a[0], a[1]); g.g0(z=10.8); g.g1(z=10.0, f=P1)
        g.g1(b[0], b[1], f=F1)
        g.g0(z=SAFE)

g.o('(T1 finish boss R15 wall + floor ring)')
cx, cy = BOSS
g.g0(cx - 26.0, cy); g.g0(z=10.8); g.g1(z=10.0, f=P1)
g.g1(cx - 20.0, cy, f=F1)
g.circ(cx, cy, 10.0, True, F1)
g.circ(cx, cy, 10.0, True, F1)
g.g1(cx - 26.0, cy, f=F1); g.g0(z=SAFE)

g.o('(T1 finish lug walls Z10-12)')
ring = orient(lug.buffer(R1, quad_segs=QS), sign=-1.0).exterior
st = (lx0 - R1, 0.0)
g.g0(st[0] - 4, st[1]); g.g0(z=10.8); g.g1(z=10.0, f=P1)
pts = ring_from(ring, st)
g.g1(pts[0][0], pts[0][1], f=F1)
g.path(pts, F1)
g.g1(st[0] - 4, st[1], f=F1); g.g0(z=SAFE)

g.o('(T1 finish outer profile to Z-0.3)')
ring = orient(outline.buffer(R1, quad_segs=QS), sign=-1.0).exterior
st = (0.0, -40.0)
pts = ring_from(ring, st)
g.g0(pts[0][0], pts[0][1] - 5); g.g0(z=0.5); g.g1(z=-0.3, f=P1)
g.g1(pts[0][0], pts[0][1], f=F1)
g.path(pts, F1)
g.path(pts, F1)  # spring pass
g.g1(pts[0][0], pts[0][1] - 5, f=F1); g.g0(z=SAFE)

# ---------------------------------------------------------------- T2 bore + hole
g.tool(2, 24000, 'T2 D6 flat - bore D12 and hole D8 helical')
def helix(c, rc, ztop, zbot, pitch, f, start_above):
    n = max(1, math.ceil((ztop - zbot) / pitch))
    g.g0(z=SAFE); g.g0(c[0] + rc, c[1]); g.g0(z=start_above); g.g1(z=ztop, f=f)
    for i in range(1, n + 1):
        g.circ(c[0], c[1], ztop - (ztop - zbot) * i / n, False, f)
    g.circ(c[0], c[1], zbot, False, f)
    g.circ(c[0], c[1], zbot, False, f)
    g.g1(c[0], c[1], f=f); g.g0(z=SAFE)
helix(BOSS, 3.0, 19.9, -0.3, 0.9, 1200, 20.5)
helix(HOLE, 1.0, 12.2, -0.3, 0.5, 800, 12.8)

# ---------------------------------------------------------------- T3 pockets
g.tool(3, 24000, 'T3 D3 flat - lightening pockets')
R3 = 1.5; F3 = 960; P3 = 350
pockets = []
for p in section(8.0):
    for it in p.interiors:
        q = Polygon(it)
        if np.hypot(q.centroid.x - BOSS[0], q.centroid.y - BOSS[1]) > 8:
            pockets.append(q)
print('pockets', len(pockets), [round(q.area, 1) for q in pockets], file=sys.stderr)

def ring_set(q, d0, step):
    rings = []
    d = d0
    while True:
        r = q.buffer(-d, quad_segs=QS)
        if r.is_empty: break
        for gg in geoms(r):
            rings.append(orient(gg, sign=1.0).exterior)
        d += step
    return rings[::-1]

for q in pockets:
    c = polylabel(q, 0.01)
    clear = q.exterior.distance(c)
    print('pocket', round(c.x, 2), round(c.y, 2), 'inradius', round(clear, 2), file=sys.stderr)
    hr = 0.5
    g.g0(z=SAFE); g.g0(c.x + hr, c.y); g.g0(z=10.6); g.g1(z=10.2, f=P3)
    zp = 10.2
    for zl in (8.7, 7.4, 6.25):
        n = max(1, math.ceil((zp - zl) / 0.35))
        for i in range(1, n + 1):
            g.circ(c.x, c.y, zp - (zp - zl) * i / n, False, P3 * 1.5)
        g.circ(c.x, c.y, zl, False, P3 * 1.5)
        for rg in ring_set(q, R3 + 0.25, 1.1):
            pts = ring_from(rg, (g.x, g.y))
            g.g1(pts[0][0], pts[0][1], f=F3)
            g.path(pts, F3)
        g.g1(c.x + hr, c.y, f=F3)
        zp = zl
    # finish floor + walls
    g.g1(c.x, c.y, f=F3); g.g1(z=6.0, f=P3)
    for rg in ring_set(q, R3, 1.1):
        pts = ring_from(rg, (g.x, g.y))
        g.g1(pts[0][0], pts[0][1], f=F3)
        g.path(pts, F3)
    g.path(pts, F3)  # spring on wall
    g.g1(c.x, c.y, f=F3)
    g.g0(z=SAFE)

# ---------------------------------------------------------------- T4 slit
g.tool(4, 24000, 'T4 D1.5 flat - clamp slit')
F4 = 480; P4 = 160
xa, xb = 51.2, 57.8
g.g0(xa, 0.0); g.g0(z=12.6); g.g1(z=12.0, f=P4)
zl = 12.0; at = xa
levels = list(np.arange(11.5, -0.3, -0.5)) + [-0.3]
for zl in levels:
    g.g1(z=zl, f=P4)
    at = xb if at == xa else xa
    g.g1(x=at, f=F4)
g.g1(z=-0.3 + 0.0, f=P4)
g.g0(z=SAFE)

# ---------------------------------------------------------------- T6 ball dome
g.tool(6, 24000, 'T6 D6 ball - spherical cap + fillet')
info = json.load(open(os.path.join(BRIEF, 'target_height.json')))
H = np.load(os.path.join(BRIEF, 'target_height.npy'))
res = info['res']
i0 = int(round((0 - info['y0']) / res - 0.5))
rr = np.arange(0, 24.0, res)
xq = BOSS[0] - rr
j = np.clip(np.round((xq - info['x0']) / res - 0.5).astype(int), 0, info['nx'] - 1)
prof = np.maximum(H[i0, j], H[i0 - 1, j])
sph = -20.0 + np.sqrt(1600.0 - np.minimum(rr, 39) ** 2)
prof = np.where(rr < 7.2, np.maximum(prof, sph), prof)
prof = np.where((rr >= 15.0) & (rr <= 22.0), np.maximum(prof, 10.0), prof)
def h_of(r):
    return np.interp(r, rr, prof, right=0.0)
RB = 3.0
uu = np.arange(-RB, RB + 1e-9, 0.05)
UX, UY = np.meshgrid(uu, uu)
m = UX ** 2 + UY ** 2 <= RB * RB
UX, UY = UX[m], UY[m]
drop = RB - np.sqrt(RB * RB - (UX ** 2 + UY ** 2))
def tip(rc):
    r = np.hypot(rc + UX, UY)
    return float(np.max(h_of(r) - drop))
rcs_tab = np.arange(5.0, 18.6, 0.02)
tips = np.array([tip(r) for r in rcs_tab])
F6 = 1440
r0, r1, pitch = 5.5, 18.0, 0.4
nrev = (r1 - r0) / pitch
nseg = int(nrev * 120)
cx, cy = BOSS
z0 = np.interp(r0, rcs_tab, tips)
g.g0(cx + r0, cy); g.g0(z=z0 + 2.0); g.g1(z=z0, f=300)
for k in range(1, nseg + 1):
    th = 2 * math.pi * k / 120.0
    rc = r0 + (r1 - r0) * k / nseg
    zt = np.interp(rc, rcs_tab, tips)
    g.g1(cx + rc * math.cos(th), cy + rc * math.sin(th), zt, F6)
# final full ring at r1
for k in range(1, 121):
    th = 2 * math.pi * (nrev + k / 120.0)
    g.g1(cx + r1 * math.cos(th), cy + r1 * math.sin(th), np.interp(r1, rcs_tab, tips), F6)
g.g0(z=SAFE)
print('ball tip at r1', np.interp(r1, rcs_tab, tips), file=sys.stderr)

# ---------------------------------------------------------------- T9 chamfer
g.tool(9, 24000, 'T9 chamfer - bore 1x45')
F9 = 600
zt = 18.0
rcf = zt - 12.648
g.g0(cx, cy); g.g0(z=19.0); g.g1(z=zt, f=300)
for rc in (rcf - 0.3, rcf):
    g.g1(cx + rc, cy, f=F9)
    g.circ(cx, cy, zt, False, F9)
g.g1(cx, cy, f=F9); g.g0(z=SAFE)

g.o('M5'); g.o('G0 Z150'); g.o('M30'); g.o('%')
open(os.path.join(HERE, 'program.nc'), 'w').write('\n'.join(g.L) + '\n')
print('lines', len(g.L), file=sys.stderr)
