#!/usr/bin/env python3
"""cam_plate toolpath generator: prints G-code to stdout. Own toolpath math (shapely offsets + trimesh sections)."""
import math, sys, os
import numpy as np
import trimesh
from shapely.geometry import Polygon, Point, box
from shapely.geometry.polygon import orient

HERE = os.path.dirname(os.path.abspath(__file__))
BRIEF = os.path.join(HERE, '..', 'brief')
SAFE = 15.0
STOCK = box(-37, -31, 48, 33)
out = []


def g(s):
    out.append(s)


def f3(v):
    s = f"{v:.3f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def move(x=None, y=None, z=None, code='G1', feed=None):
    w = [code]
    if x is not None: w.append('X' + f3(x))
    if y is not None: w.append('Y' + f3(y))
    if z is not None: w.append('Z' + f3(z))
    if feed is not None: w.append('F' + str(int(feed)))
    g(' '.join(w))


def tool(n, rpm, name):
    g('M5')
    g(f'T{n} M6 ({name})')
    g(f'G43 H{n}')
    g(f'S{rpm} M3')
    move(z=SAFE, code='G0')


# ---------------- geometry ----------------
mesh = trimesh.load(os.path.join(BRIEF, 'part.stl'))


def section(z):
    s = mesh.section(plane_origin=[0, 0, z], plane_normal=[0, 0, 1])
    polys = [Polygon(d[:, :2]) for d in s.discrete]
    polys.sort(key=lambda p: -p.area)
    return polys


sec_lo = section(3.0)     # outline, bore+keyway, 3 windows
sec_hi = section(9.5)     # outline, hex+keyway, 3 windows
OUTLINE = sec_lo[0]
HEX = sec_hi[1]
WINDOWS = [p for p in sec_lo[2:]]


def loops_of(geom, ccw=True):
    """exterior rings of a (multi)polygon as point lists (closed), oriented."""
    res = []
    if geom.is_empty:
        return res
    gs = getattr(geom, 'geoms', [geom])
    for p in gs:
        if p.area < 1e-4:
            continue
        p = orient(p, 1.0 if ccw else -1.0)
        pts = list(p.exterior.coords)
        res.append(pts)
    return res


def rotate_to(pts, xy):
    P = np.array(pts[:-1])
    i = int(np.argmin(((P - np.array(xy)) ** 2).sum(1)))
    r = [tuple(p) for p in P[i:]] + [tuple(p) for p in P[:i]]
    return r + [r[0]]


def plen(pts):
    P = np.array(pts)
    return float(np.sqrt((np.diff(P, axis=0) ** 2).sum(1)).sum())


def cut_loop(pts, z, feed):
    for x, y in pts[1:]:
        move(x, y, z, feed=feed)


def ramp_loop(pts, z0, z1, feed_ramp, feed, max_deg):
    """ramp down along closed loop from z0 to z1 (possibly several laps), then one full lap at z1."""
    L = plen(pts)
    laps = max(1, math.ceil((z0 - z1) / (L * math.tan(math.radians(max_deg)))))
    total = L * laps
    s = 0.0
    move(pts[0][0], pts[0][1], z0, feed=feed_ramp)
    for _ in range(laps):
        for a, b in zip(pts[:-1], pts[1:]):
            s += math.dist(a, b)
            move(b[0], b[1], z0 - (z0 - z1) * s / total, feed=feed_ramp)
    g(f'F{int(feed)}')
    cut_loop(pts, z1, feed)


def levels(ztop, zbot, maxstep):
    n = math.ceil((ztop - zbot) / maxstep - 1e-9)
    return [ztop - (ztop - zbot) * (k + 1) / n for k in range(n)]


def pocket(region, r, offs, ztop, zbot, step, feed, framp, max_deg, ccw=True):
    """contour-parallel pocket: offs = list of tool-centre offsets (largest first = innermost loop)."""
    loops = []
    for d in sorted(offs, reverse=True):
        loops += loops_of(region.buffer(-d, quad_segs=24), ccw)
    if not loops:
        return
    zprev = ztop
    first = loops[0]
    move(first[0][0], first[0][1], code='G0')
    move(z=ztop + 1.0, code='G0')
    for z in levels(ztop, zbot, step):
        pts = rotate_to(first, first[0])
        ramp_loop(pts, zprev, z, framp, feed, max_deg)
        cur = pts[-1]
        for lp in loops[1:]:
            lp = rotate_to(lp, cur)
            move(lp[0][0], lp[0][1], z, feed=feed)
            cut_loop(lp, z, feed)
            cur = lp[-1]
        # back to the ramp start (inside cleared area) for the next level
        move(first[0][0], first[0][1], z, feed=feed)
        zprev = z
    move(z=SAFE, code='G0')


# ---------------- program ----------------
g('%')
g('(cam_plate - AL6061 - own generator)')
g('G21 G90 G17 G94')
g('G54')

# --- T1 face top 13 -> 12
tool(1, 18000, 'D10 flat')
F1, F1R = 3000, 1200
y = -29.0
rows = []
while y <= 33.0 - 2.0 + 1e-9:
    rows.append(y)
    y += 6.0
move(-43, rows[0], code='G0')
move(z=12.0, code='G0')
left = True
for yy in rows:
    xs = (-43, 54) if left else (54, -43)
    move(xs[0], yy, 12.0, feed=F1)
    move(xs[1], yy, 12.0, feed=F1)
    left = not left
move(z=SAFE, code='G0')

# --- T1 bore rough: helix r2.8 + ring r6.8, Z12 -> -0.2 ; finish circle r7.0
g('(bore rough)')
move(2.8, 0, code='G0')
move(z=13.0, code='G0')
move(z=12.0, feed=600)
zc = 12.0
pitch = 0.8
for z in levels(12.0, -0.2, 2.5):
    while zc > z + 1e-9:
        za = max(z, zc - pitch / 2)
        g(f'G3 X-2.8 Y0 Z{f3(za)} I-2.8 J0 F{F1R}')
        zb = max(z, za - pitch / 2)
        g(f'G3 X2.8 Y0 Z{f3(zb)} I2.8 J0')
        zc = zb
    g('G3 X2.8 Y0 I-2.8 J0')  # flat lap
    move(6.8, 0, z, feed=F1)
    g('G3 X6.8 Y0 I-6.8 J0')
    move(2.8, 0, z, feed=F1)
g('(bore finish)')
move(7.0, 0, -0.2, feed=F1R)
g(f'G3 X7 Y0 I-7 J0 F{F1}')
move(5.0, 0, -0.2, feed=F1)
move(z=SAFE, code='G0')

# --- T2 hex rough Z12 -> 7
tool(2, 24000, 'D6 flat')
F2, F2R = 2400, 1000
offs = [3.2 + 2.4 * k for k in range(6)]
pocket(HEX, 3.0, offs, 12.0, 7.0, 2.5, F2, F2R, 3.0)

# --- T3 keyway, windows, hex finish
tool(3, 24000, 'D3 flat')
F3, F3R = 900, 450
g('(keyway)')
kw = [(1.5, 10.0), (1.5, 15.0), (-1.5, 15.0), (-1.5, 10.0), (1.5, 10.0)]
move(1.5, 10.0, code='G0')
move(z=13.0, code='G0')
for z in levels(12.0, -0.2, 1.0):
    move(1.5, 10.0, z, feed=F3R)
    cut_loop(kw, z, F3)
move(z=SAFE, code='G0')
for i, wdw in enumerate(WINDOWS):
    g(f'(window {i + 1})')
    pocket(wdw, 1.5, [2.7, 1.5], 12.0, -0.2, 1.0, F3, F3R, 2.0)
g('(hex finish)')
hexf = loops_of(HEX.buffer(-1.5, quad_segs=24), True)[0]
hexf = rotate_to(hexf, (0, -13.5))
move(0, -11.0, code='G0')
move(z=13.0, code='G0')
move(z=7.0, feed=F3R)
move(hexf[0][0], hexf[0][1], 7.0, feed=F3)
cut_loop(hexf, 7.0, F3)
move(0, -11.0, 7.0, feed=F3)
move(z=SAFE, code='G0')

# --- T4 keyway end corners rest (same XY every level so the shank only sweeps cleared space)
tool(4, 24000, 'D1.5 flat')
F4, F4R = 450, 200
g('(keyway end corners rest)')
kc = [(2.25, 14.6), (2.25, 15.75), (-2.25, 15.75), (-2.25, 14.6)]
move(2.25, 14.6, code='G0')
move(z=13.0, code='G0')
fwd = True
for z in levels(12.0, -0.2, 0.6):
    pts = kc if fwd else kc[::-1]
    move(pts[0][0], pts[0][1], z, feed=F4R)
    for x, y in pts[1:]:
        move(x, y, z, feed=F4)
    fwd = not fwd
move(z=SAFE, code='G0')

# --- T9 chamfer bore edge (tip Z5.5, centre radius 11.4)
tool(9, 24000, 'chamfer 90deg')
move(0, 0, code='G0')
move(z=8.0, code='G0')
move(z=5.5, feed=800)
move(8.0, 0, 5.5, feed=800)
move(11.4, 0, 5.5, feed=400)
g('G3 X11.4 Y0 I-11.4 J0 F800')
move(8.0, 0, 5.5, feed=800)
move(0, 0, 5.5, feed=800)
move(z=SAFE, code='G0')

# --- T1 outer profile
tool(1, 18000, 'D10 flat')
corners = [(-37, -31), (48, -31), (48, 33), (-37, 33)]
maxd = max(OUTLINE.exterior.distance(Point(c)) for c in corners)
offs = [5.25]
while offs[-1] - 5.0 < maxd + 0.5:
    offs.append(offs[-1] + 4.0)
oloops = [loops_of(OUTLINE.buffer(d, quad_segs=24), ccw=False)[0] for d in offs]
oloops = oloops[::-1]  # outermost first
outer = oloops[0]
P = np.array(outer[:-1])
dist = [STOCK.exterior.distance(Point(p)) if not STOCK.contains(Point(p)) else -1 for p in P]
start = tuple(P[int(np.argmax(dist))])
g(f'(outer profile rough: {len(offs)} loops, start clearance {max(dist):.2f})')
for z in levels(12.0, -0.2, 4.1):
    lp = rotate_to(outer, start)
    move(lp[0][0], lp[0][1], code='G0')
    move(z=13.0, code='G0')
    move(z=z, feed=1000)
    cut_loop(lp, z, F1)
    cur = lp[-1]
    for lp in oloops[1:]:
        lp = rotate_to(lp, cur)
        move(lp[0][0], lp[0][1], z, feed=F1)
        cut_loop(lp, z, F1)
        cur = lp[-1]
    move(z=SAFE, code='G0')
g('(outer profile finish)')
fin = loops_of(OUTLINE.buffer(5.01, quad_segs=24), ccw=False)[0]
appr = loops_of(OUTLINE.buffer(8.0, quad_segs=24), ccw=False)[0]
fin = rotate_to(fin, start)
a = rotate_to(appr, fin[0])[0]
move(a[0], a[1], code='G0')
move(z=13.0, code='G0')
move(z=-0.2, feed=1000)
move(fin[0][0], fin[0][1], -0.2, feed=F1R)
cut_loop(fin, -0.2, 2400)
move(a[0], a[1], -0.2, feed=F1)
move(z=SAFE, code='G0')

g('M5')
g('M30')
g('%')
print('\n'.join(out))
