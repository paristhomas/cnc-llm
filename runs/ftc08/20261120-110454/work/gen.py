#!/usr/bin/env python3
"""ftc08 3+2 program generator (own code; trimesh/shapely only to read geometry)."""
import math, sys, os
import numpy as np
import trimesh
from shapely.geometry import Polygon, Point, MultiPolygon, LineString
from shapely.geometry.polygon import orient
from shapely.ops import unary_union

RUN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = trimesh.load(os.path.join(RUN, 'brief/part.stl'))

# ---------------------------------------------------------------- geometry
def section(z):
    s = M.section(plane_origin=[0, 0, z], plane_normal=[0, 0, 1])
    return s.to_2D(to_2D=np.eye(4))[0].polygons_full

TOP = 24.13
FLOOR = 1.714
WALL_X, WALL_Y = 51.229, 73.009        # outer walls under the lip
LIP_X, LIP_Y = 55.674, 77.899          # lip outline
STK_X, STK_Y = 58.674, 80.899
FIL_TOP = 3.238                         # top of the r1.524 floor fillet in the pocket

lip_poly = max(section(21.0), key=lambda p: p.area)
lip_outline = Polygon(lip_poly.exterior)
pocket = max([Polygon(h) for h in lip_poly.interiors], key=lambda p: p.area)
corner_holes = [Polygon(h) for h in lip_poly.interiors if Polygon(h).area < 50]
web = max(section(0.85), key=lambda p: p.area)
cutouts = [Polygon(h) for h in web.interiors]
outer10 = max(section(10.0), key=lambda p: p.area)
oct_outer = Polygon(outer10.exterior)

def circ_fit(p):
    c = np.array(p.exterior.coords)[:-1]
    cen = c.mean(axis=0)
    r = np.linalg.norm(c - cen, axis=1)
    return cen, r.mean(), r.std()

def parts(g):
    if g.is_empty:
        return []
    if isinstance(g, Polygon):
        return [g]
    return [x for x in getattr(g, 'geoms', []) if isinstance(x, Polygon) and not x.is_empty]

def ring_pts(poly, ccw=True):
    p = orient(poly, 1.0 if ccw else -1.0)
    return [tuple(c) for c in p.exterior.coords]

def rotate_to(pts, xy):
    """closed ring pts (first==last) -> start at vertex nearest xy"""
    ring = pts[:-1]
    i = int(np.argmin([(a - xy[0]) ** 2 + (b - xy[1]) ** 2 for a, b in ring]))
    r = ring[i:] + ring[:i]
    return r + [r[0]]

def offset_rings(region, first, step, ccw=True, min_area=0.0, medial=True):
    """list of levels (outer->inner) of polygons = tool-centre regions"""
    out = []
    o = first
    while True:
        g = region.buffer(-o, join_style=1, resolution=16)
        ps = [p for p in parts(g) if (p.area > min_area or p.length > 0.05)
              and region.boundary.distance(p.representative_point()) >= o - 0.05]
        if not ps:
            break
        out.append(ps)
        o += step
    if out and medial:
        lo, hi = o - step, o
        for _ in range(12):
            mid = 0.5 * (lo + hi)
            if [p for p in parts(region.buffer(-mid, join_style=1, resolution=16))
                    if region.boundary.distance(p.representative_point()) >= mid - 0.05]:
                lo = mid
            else:
                hi = mid
        if lo > o - step + 0.15:
            ps = [p for p in parts(region.buffer(-(lo - 0.01), join_style=1, resolution=16))
                  if region.boundary.distance(p.representative_point()) >= lo - 0.07]
            if ps:
                out.append(ps)
    return out

# ---------------------------------------------------------------- G-code writer
class G:
    def __init__(self):
        self.L = []
        self.pos = [0.0, 0.0, 150.0]
        self.F = None
        self.mode = None

    def c(self, s):
        self.L.append(f'({s})')

    def raw(self, s):
        self.L.append(s)

    def _fmt(self, x=None, y=None, z=None):
        s = ''
        for k, v, i in (('X', x, 0), ('Y', y, 1), ('Z', z, 2)):
            if v is not None:
                s += f' {k}{v:.4f}'
                self.pos[i] = v
        return s

    def g0(self, x=None, y=None, z=None):
        s = self._fmt(x, y, z)
        if s:
            self.L.append('G0' + s)

    def g1(self, x=None, y=None, z=None, f=None):
        if x is not None and y is not None and z is None:
            if abs(x - self.pos[0]) < 1e-5 and abs(y - self.pos[1]) < 1e-5:
                return
        s = self._fmt(x, y, z)
        if not s:
            return
        if f is not None and f != self.F:
            s += f' F{f:.0f}'
            self.F = f
        self.L.append('G1' + s)

    def helix(self, cx, cy, r, z0, z1, pitch, f, ccw=True):
        self.g1(cx + r, cy, z0, f)
        z = z0
        while z > z1 + 1e-6:
            z = max(z1, z - pitch)
            self.L.append(f"{'G3' if ccw else 'G2'} X{cx + r:.4f} Y{cy:.4f} Z{z:.4f} I{-r:.4f} J0.0000 F{f:.0f}")
            self.F = f
        self.L.append(f"{'G3' if ccw else 'G2'} X{cx + r:.4f} Y{cy:.4f} Z{z1:.4f} I{-r:.4f} J0.0000")
        self.pos = [cx + r, cy, z1]

    def path(self, pts, z, f):
        for (x, y) in pts:
            self.g1(x, y, z, f)

    def tool(self, t, rpm, name):
        self.raw('M5')
        self.c(name)
        self.raw(f'T{t} M6')
        self.raw(f'G43 H{t}')
        self.raw(f'S{rpm} M3')
        self.rpm = rpm
        self.pos = [self.pos[0], self.pos[1], 150.0]
        self.F = None

    def frame(self, o, I, label, J=90.0):
        self.c(label)
        self.raw('M5')
        self.raw(f'G68.2 X{o[0]:.4f} Y{o[1]:.4f} Z{o[2]:.4f} I{I:.4f} J{J:.4f} K0.0000')
        self.raw('G53.1')
        self.raw(f'S{self.rpm} M3')
        self.pos = [0.0, 0.0, 150.0]

    def endframe(self):
        self.raw('M5')
        self.raw('G69')
        self.raw(f'S{self.rpm} M3')
        self.pos = [self.pos[0], self.pos[1], 150.0]


TOOLS = {  # t: (D, rpm, feed, plunge)
    1: (10, 18000, 3240, 1080),
    2: (6, 24000, 2880, 960),
    3: (3, 24000, 960, 320),
    4: (1.5, 24000, 480, 160),
    5: (8, 24000, 3600, 1200),
    8: (1, 24000, 384, 128),
}

g = G()
g.raw('%')
g.c('ftc08 - NIST FTC-08 scaled 0.5 - 3+2 indexed, vise on stub')
g.raw('G21 G90 G17 G94')
g.raw('G54')
SAFE = 30.0

# ================================================================ SETUP 1: +Z (G54, no tilt)
# ---- T1 10 mm flat
D, RPM, F, FP = TOOLS[1]
g.tool(1, RPM, 'T1 10mm flat - top setup')
g.c('face top 25.63 -> 24.13')
xs = np.linspace(-(STK_X - 4), STK_X - 4, 18)
g.g0(xs[0], -(STK_Y + 6), SAFE)
g.g0(z=TOP)
for i, x in enumerate(xs):
    y0, y1 = (-(STK_Y + 6), STK_Y + 6) if i % 2 == 0 else (STK_Y + 6, -(STK_Y + 6))
    g.g1(x, y0, TOP, F)
    g.g1(x, y1, TOP, F)
g.g0(z=SAFE)

g.c('lip outer profile (climb, CW) down to z18.5')
prof = lip_outline.buffer(5.0, join_style=1, resolution=16)
lead_poly = lip_outline.buffer(12.0, join_style=1, resolution=16)
pts = ring_pts(prof, ccw=False)
pts = rotate_to(pts, (STK_X + 20, 0.0))
lead = lead_poly.exterior.interpolate(lead_poly.exterior.project(Point(pts[0])))
for zl in (21.13, 18.5):
    g.g0(lead.x, lead.y, SAFE)
    g.g0(z=zl)
    g.g1(pts[0][0], pts[0][1], zl, F)
    g.path(pts[1:], zl, F)
    g.g1(lead.x, lead.y, zl, F)
    g.g0(z=SAFE)


def pocket_levels(g, region_fn, levels, f, fp, z_start_above, step, retract_z_fn, safe=None):
    safe = SAFE if safe is None else safe
    """region_fn(z) -> list of offset levels (outer->inner). cut inner->outer, plunge at innermost."""
    for k, zl in enumerate(levels):
        rings = region_fn(zl)
        seq = []
        for lev in reversed(rings):
            for p in lev:
                seq.append(p)
        first = True
        for p in seq:
            pts = ring_pts(p, ccw=True)
            if first:
                pts = rotate_to(pts, (p.centroid.x, p.centroid.y))
                g.g0(pts[0][0], pts[0][1], safe) if k == 0 else None
                if k == 0:
                    g.g0(z=z_start_above)
                    g.g1(z=zl, f=fp)
                else:
                    g.g1(pts[0][0], pts[0][1], levels[k - 1], f)
                    g.g1(z=zl, f=fp)
                first = False
            else:
                pts = rotate_to(pts, (g.pos[0], g.pos[1]))
                dist = math.hypot(pts[0][0] - g.pos[0], pts[0][1] - g.pos[1])
                allowed = unary_union([q.buffer(0.02) for lev in rings for q in lev])
                link = LineString([(g.pos[0], g.pos[1]), pts[0]])
                if dist > step * 1.6 or not allowed.contains(link):
                    rz = retract_z_fn(zl, k, levels)
                    g.g1(z=rz, f=f)
                    g.g1(pts[0][0], pts[0][1], rz, f)
                    g.g1(z=zl, f=fp)
                else:
                    g.g1(pts[0][0], pts[0][1], zl, f)
            g.path(pts[1:], zl, f)
    g.g0(z=safe)


g.c('pocket rough (offset rings, 3 mm steps), 0.3 wall / 0.2 floor allowance')
levels = [round(TOP - 3 * k, 3) for k in range(1, 8) if TOP - 3 * k > FIL_TOP + 0.2] + [FIL_TOP + 0.2, FLOOR + 0.2]
def pk_region(z):
    first = 5.3 if z > FIL_TOP + 0.1 else 5.0 + 1.524 + 0.25
    return offset_rings(pocket, first, 6.0)
pocket_levels(g, pk_region, levels, F, FP, TOP + 0.5, 6.0,
              lambda zl, k, lv: (lv[k - 1] if k > 0 else TOP + 0.5) + 0.2)

g.c('pocket floor finish z1.714 (stay 6.65 from wall: fillet)')
rings = offset_rings(pocket, 6.65, 7.0)
seq = [p for lev in reversed(rings) for p in lev]
pts0 = ring_pts(seq[0])
g.g0(pts0[0][0], pts0[0][1], SAFE)
g.g0(z=FLOOR + 1.2)
g.g1(z=FLOOR, f=FP)
for p in seq:
    pts = rotate_to(ring_pts(p), (g.pos[0], g.pos[1]))
    g.g1(pts[0][0], pts[0][1], FLOOR, F)
    g.path(pts[1:], FLOOR, F)
g.g0(z=SAFE)

g.c('pocket wall finish offset 5.0, down to z3.3')
ring = ring_pts(pocket.buffer(-5.0, join_style=1, resolution=16))
ring = rotate_to(ring, (0, -100))
leadin = pocket.buffer(-7.0, join_style=1, resolution=16)
li = leadin.exterior.interpolate(leadin.exterior.project(Point(ring[0])))
g.g0(li.x, li.y, SAFE)
g.g0(z=TOP + 1)
for zl in [21.13, 18.13, 15.13, 12.13, 9.13, 6.13, 3.3]:
    g.g1(li.x, li.y, zl, FP)
    g.g1(ring[0][0], ring[0][1], zl, F)
    g.path(ring[1:], zl, F)
    g.g1(li.x, li.y, zl, F)
g.g0(z=SAFE)

# ---- web cut-outs: classify
window = max(cutouts, key=lambda p: p.area)
small_round, shaped = [], []
for h in cutouts:
    if h is window:
        continue
    cen, r, sd = circ_fit(h)
    if h.area < 12 and sd < 0.05:
        small_round.append((cen, r, h))
    else:
        shaped.append(h)
pk_bound = pocket.exterior

def wall_dist(poly):
    return min(pk_bound.distance(Point(c)) for c in poly.exterior.coords)

g.c('window rough to z-0.3 (T1)')
win_rings = offset_rings(window, 5.3, 6.0)
pocket_levels(g, lambda z: win_rings, [-0.3], F * 0.8, FP, FLOOR + 1.0, 6.0, lambda zl, k, lv: FLOOR + 0.5)

# ---- T2 6 mm flat: shaped cut-outs too close to the pocket wall for T3's holder
D, RPM, F, FP = TOOLS[2]
t2_list, t3_list = [], []
for h in shaped:
    cp = h.buffer(-1.5)
    if not cp.is_empty and wall_dist(cp) >= 16.6:
        t3_list.append(h)
    else:
        t2_list.append(h)
if t2_list:
    g.tool(2, RPM, 'T2 6mm flat - cut-outs near the wall')
    for h in t2_list:
        rr = offset_rings(h, 3.0, 3.6)
        if not rr:
            g.c('skip cut-out (T2 does not fit)')
            continue
        pocket_levels(g, lambda z, rr=rr: rr, [-0.3], F * 0.8, FP, FLOOR + 1.0, 3.6, lambda zl, k, lv: FLOOR + 0.5)

# ---- T3 3 mm flat
D, RPM, F, FP = TOOLS[3]
g.tool(3, RPM, 'T3 3mm flat - window finish, cut-outs, corner rest, lip holes')
g.c('window finish ring offset 1.5')
wr = offset_rings(window, 1.5, 100.0, medial=False)
pocket_levels(g, lambda z: wr, [0.714, -0.3], F, FP, FLOOR + 1.0, 1.8, lambda zl, k, lv: FLOOR + 0.5)
for h in t3_list:
    g.c('cut-out (T3)')
    rr = offset_rings(h, 1.5, 1.8)
    pocket_levels(g, lambda z, rr=rr: rr, [0.714, -0.3], F, FP, FLOOR + 1.0, 1.8, lambda zl, k, lv: FLOOR + 0.5)

g.c('pocket vertical corner rest r1.524 (T3 offset 1.5)')
t3ring = pocket.buffer(-1.5, join_style=1, resolution=32)
t1env = pocket.buffer(-5.0, join_style=1, resolution=32).buffer(5.0, join_style=1, resolution=32)
resid = t3ring.buffer(1.5, join_style=1, resolution=32).difference(t1env).buffer(-0.03).buffer(0.03)
resid = unary_union([p for p in parts(resid) if p.area > 0.05])
print('resid parts', [(tuple(np.round(p.centroid.coords[0],1)), round(p.area,2)) for p in parts(resid)], file=sys.stderr)
rp0 = ring_pts(t3ring)
rp = []
for a, b in zip(rp0[:-1], rp0[1:]):
    nseg = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / 0.3))
    for t in range(nseg):
        rp.append((a[0] + (b[0] - a[0]) * t / nseg, a[1] + (b[1] - a[1]) * t / nseg))
rp.append(rp[0])
far = max(range(len(rp) - 1), key=lambda i: Point(rp[i]).distance(resid))
rp = rp[far:-1] + rp[:far]
segs, cur = [], []
for p in rp:
    if Point(p).distance(resid) < 1.8:
        cur.append(p)
    else:
        if len(cur) > 1:
            segs.append(cur)
        cur = []
if len(cur) > 1:
    segs.append(cur)
corner_levels = [round(TOP - 1.0 * k, 3) for k in range(1, 21)] + [3.3]
corner_levels = [z for z in corner_levels if z >= 3.3]
for s in segs:
    # extend each segment a little along the ring (tangent entry)
    g.g0(s[0][0], s[0][1], SAFE)
    g.g0(z=TOP + 1)
    for zl in corner_levels:
        g.g1(s[0][0], s[0][1], zl, FP)
        g.path(s[1:], zl, F)
        g.path(list(reversed(s[:-1])), zl, F)
    g.g0(z=SAFE)

g.c('lip corner holes d3.0 - peck plunge')
for h in corner_holes:
    cen, r, sd = circ_fit(h)
    g.g0(cen[0], cen[1], SAFE)
    g.g0(z=TOP + 0.5)
    z = TOP
    while z > 18.6:
        z = max(18.6, z - 0.8)
        g.g1(z=z, f=FP)
        g.g0(z=TOP + 0.5)
    g.g0(z=SAFE)

# ---- T4 1.5 mm flat: small round holes (helical)
D, RPM, F, FP = TOOLS[4]
g.tool(4, RPM, 'T4 1.5mm flat - small web holes (helical)')
skipped = []
for cen, r, h in small_round:
    if wall_dist(h) < 10.6 + r:
        skipped.append((cen, r))
        g.c(f'skip hole at {cen[0]:.2f},{cen[1]:.2f} r{r:.3f} (holder would hit pocket wall)')
        continue
    pr = r - 0.75 - 0.005
    g.g0(cen[0] + pr, cen[1], SAFE)
    g.g0(z=FLOOR + 1.0)
    g.helix(cen[0], cen[1], pr, FLOOR + 0.1, -0.3, 0.15, F)
    g.g1(cen[0], cen[1], -0.3, F)
    g.g0(z=SAFE)

g.c('T4 rest: small concave corners of the shaped cut-outs')
def densify(pts, step=0.25):
    out = []
    for a, b in zip(pts[:-1], pts[1:]):
        n = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / step))
        for t in range(n):
            out.append((a[0] + (b[0] - a[0]) * t / n, a[1] + (b[1] - a[1]) * t / n))
    out.append(out[0])
    return out
for h in [window] + t2_list + t3_list:
    rprev = 3.0 if any(h is q for q in t2_list) else 1.5
    env = h.buffer(-rprev, join_style=1, resolution=32).buffer(rprev, join_style=1, resolution=32)
    t4r = h.buffer(-0.755, join_style=1, resolution=32)
    res = t4r.buffer(0.755, join_style=1, resolution=32).difference(env).buffer(-0.02).buffer(0.02)
    res = [p for p in parts(res) if p.area > 0.03]
    if not res:
        continue
    res = unary_union(res)
    for ring_poly in parts(t4r):
        rp = densify(ring_pts(ring_poly))
        far = max(range(len(rp) - 1), key=lambda i: Point(rp[i]).distance(res))
        rp = rp[far:-1] + rp[:far]
        segs4, cur = [], []
        for p in rp:
            ok = Point(p).distance(res) < 1.0 and pk_bound.distance(Point(p)) >= 10.6
            if ok:
                cur.append(p)
            else:
                if len(cur) > 1:
                    segs4.append(cur)
                cur = []
        if len(cur) > 1:
            segs4.append(cur)
        for sg in segs4:
            g.g0(sg[0][0], sg[0][1], SAFE)
            g.g0(z=FLOOR + 1.0)
            for zl in (1.214, 0.714, 0.214, -0.3):
                g.g1(sg[0][0], sg[0][1], zl, FP)
                g.path(sg[1:], zl, F)
                g.path(list(reversed(sg[:-1])), zl, F)
            g.g0(z=SAFE)

# ---- T5 8 mm bull r1: pocket floor fillet r1.524
D, RPM, F, FP = TOOLS[5]
g.tool(5, RPM, 'T5 8mm bull r1 - pocket floor fillet')
for phi in (0, 25, 50, 72):
    ph = math.radians(phi)
    cw = 1.524 - 0.524 * math.sin(ph)
    tipz = FIL_TOP - 0.524 * math.cos(ph) - 1.0
    off = cw + 3.0
    ring = rotate_to(ring_pts(pocket.buffer(-off, join_style=1, resolution=32)), (0, -100))
    li = pocket.buffer(-(off + 2.0), join_style=1, resolution=16)
    lp = li.exterior.interpolate(li.exterior.project(Point(ring[0])))
    g.g0(lp.x, lp.y, SAFE)
    g.g0(z=FIL_TOP + 1.5)
    g.g1(z=tipz, f=FP)
    g.g1(ring[0][0], ring[0][1], tipz, F)
    g.path(ring[1:], tipz, F)
    g.g1(lp.x, lp.y, tipz, F)
    g.g0(z=SAFE)

# ================================================================ SIDE SETUPS (horizontal tool axis)
s2 = math.sqrt(0.5)
SIDES = []
for nx, ny, w in ((-1, 0, WALL_X), (1, 0, WALL_X), (0, -1, WALL_Y), (0, 1, WALL_Y)):
    SIDES.append(dict(n=(nx, ny), w0=w, kind='axis'))
for sx in (-1, 1):
    for sy in (-1, 1):
        n = (sx * s2, sy * s2)
        w0 = max(n[0] * x + n[1] * y for x, y in oct_outer.exterior.coords)
        SIDES.append(dict(n=n, w0=w0, kind='diag', sx=sx, sy=sy))

for S in SIDES:
    nx, ny = S['n']
    S['I'] = math.degrees(math.atan2(nx, -ny))
    S['xa'] = (-ny, nx)
    if S['kind'] == 'axis':
        S['o'] = (S['w0'] * nx, S['w0'] * ny, 0.0)
        if nx != 0:
            S['dstock'] = STK_X - WALL_X; S['half'] = STK_Y + 5.5; S['dlip'] = LIP_X - WALL_X
            S['wallhalf'] = 60.95; S['liphalf'] = 76.37
        else:
            S['dstock'] = STK_Y - WALL_Y; S['half'] = STK_X + 5.5; S['dlip'] = LIP_Y - WALL_Y
            S['wallhalf'] = 39.17; S['liphalf'] = 54.15
        S['dclear'] = 14.0
    else:
        sx, sy = S['sx'], S['sy']
        mid = np.array([45.525 * sx, 67.28 * sy])
        n = np.array(S['n'])
        mid = mid - (n @ mid - S['w0']) * n
        S['o'] = (mid[0], mid[1], 0.0)
        cornr = np.array([WALL_X * sx, WALL_Y * sy])
        S['dstock'] = n @ cornr - S['w0']
        S['half'] = S['dstock'] + 5.5 + 0.5
        S['wallhalf'] = 7.62
        S['dclear'] = 22.0


def side_name(S):
    nx, ny = S['n']
    return f"side n=({nx:+.3f},{ny:+.3f}) I{S['I']:.1f}"


def rows_pass(g, X0, X1, ys, d, f, dclear):
    """zig-zag rows along frame X at frame Z=d, frame Y in ys. Approach in air beyond X ends."""
    g.g0(X0, ys[0], dclear)
    g.g1(z=d, f=f)
    left = True
    for j, y in enumerate(ys):
        if j > 0:
            g.g1(g.pos[0], y, d, f)
        g.g1(X1 if left else X0, y, d, f)
        left = not left
    g.g0(z=dclear)


# ---- T1 on all 8 sides: slab under the lip, wall finish, lip underside
D, RPM, F, FP = TOOLS[1]
g.tool(1, RPM, 'T1 10mm flat - side walls (8 horizontal setups)')
for S in SIDES:
    g.frame(S['o'], S['I'], side_name(S) + ' T1 walls')
    dc = S['dclear']
    if S['kind'] == 'axis':
        dl = [round(S['dstock'] - 1.85 * k, 3) for k in range(1, 5) if S['dstock'] - 1.85 * k > 0.35] + [0.3]
    else:
        dl = [round(S['dstock'] - 1.8 * k, 3) for k in range(1, 6) if S['dstock'] - 1.8 * k > 0.35] + [0.3]
    g.g0(-S['half'], -4.0, 150.0)
    for d in dl:
        top = 18.85 if d >= 0.962 else 18.088
        if S['kind'] == 'diag':
            hw = max(S['dstock'] - d, 0) + 5.5 + 0.5
        else:
            hw = S['half']
        ys = [-4.0, 2.0, 8.0, top - 5.0]
        rows_pass(g, -hw, hw, ys, d, F, dc)
    # finish wall d=0, then lip underside d=0.762
    hw = S['half'] if S['kind'] == 'axis' else S['dstock'] + 6.0
    rows_pass(g, -hw, hw, [1.5, 7.4, 13.288], 0.0, F, dc)
    # lip underside; diagonal frames run 0.04 mm high so the T8 shank (later, from the axis frames) clears the voxels
    rows_pass(g, -hw, hw, [14.05 if S['kind'] == 'axis' else 14.09], 0.762, F, dc)
    g.g0(z=150.0)
    g.endframe()

# ---- T5 bull: bottom round (8 sides) and lip round (4 axis sides)
D, RPM, F, FP = TOOLS[5]
g.tool(5, RPM, 'T5 8mm bull r1 - convex rounds from the side')
R_ROUND, RC = 1.524, 1.0
for S in SIDES:
    g.frame(S['o'], S['I'], side_name(S) + ' T5 rounds')
    dc = S['dclear']
    traces = []
    gd, gz = -R_ROUND, R_ROUND
    hw = S['wallhalf'] + 3.0
    bt = []
    for a in range(0, -91, -15):
        ar = math.radians(a)
        cd, cz = gd + (R_ROUND + RC) * math.cos(ar), gz + (R_ROUND + RC) * math.sin(ar)
        bt.append((cd - RC, cz - 3.0))
    traces.append((hw, bt))
    if S['kind'] == 'axis':
        gd, gz = S['dlip'] - R_ROUND, 19.05 + R_ROUND
        lt = []
        for a in range(-90, 1, 15):
            ar = math.radians(a)
            cd, cz = gd + (R_ROUND + RC) * math.cos(ar), gz + (R_ROUND + RC) * math.sin(ar)
            lt.append((cd - RC, cz - 3.0))
        traces.append((S['liphalf'] + 3.0, lt))
    for hw, tr in traces:
        g.g0(-hw, tr[0][1], 150.0)
        g.g0(z=dc)
        g.g1(z=tr[0][0], f=FP)
        left = True
        for j, (dt, ya) in enumerate(tr):
            if j > 0:
                g.g1(g.pos[0], ya, dt, F)
            g.g1(hw if left else -hw, ya, dt, F)
            left = not left
        g.g0(z=dc)
    g.g0(z=150.0)
    g.endframe()

# ---- T8 1 mm ball: wall/lip-underside fillet r0.762, tool tilted 20 deg below horizontal (A110) so the shank
#      runs down and away from the lip underside; diagonal fillets split between the two adjacent axis frames.
D, RPM, F, FP = TOOLS[8]
g.tool(8, RPM, 'T8 1mm ball - under-lip fillet r0.762 (A105 frames)')
Fd, Fz, RF = 0.762, 18.288, 0.762
JT = 105.0
def Rmat(I, J):
    a, b = math.radians(I), math.radians(J)
    Rz = np.array([[math.cos(a), -math.sin(a), 0], [math.sin(a), math.cos(a), 0], [0, 0, 1]])
    Rx = np.array([[1, 0, 0], [0, math.cos(b), -math.sin(b)], [0, math.sin(b), math.cos(b)]])
    return Rz @ Rx
PSI = (0, 30, 60, 90)
def ball_pts(c3list, R, o3):
    return [tuple(R.T @ (np.array(c) - o3) - np.array([0, 0, 0.5])) for c in c3list]
for S in SIDES:
    if S['kind'] != 'axis':
        continue
    nx, ny = S['n']
    n = np.array([nx, ny], float); xa = np.array(S['xa'], float)
    o3 = np.array(S['o']); R = Rmat(S['I'], JT)
    g.frame(S['o'], S['I'], side_name(S) + ' T8 fillet, A105', J=JT)
    CL = 14.0
    passes = []   # list of (A3, B3) ball-centre segments in G54
    hw = S['wallhalf'] + 1.0
    wall0 = S['w0'] * n
    for psi in PSI:
        pr = math.radians(psi)
        cd, cz = Fd - (RF - 0.5) * math.cos(pr), Fz + (RF - 0.5) * math.sin(pr)
        A = np.r_[wall0 + (-hw) * xa + cd * n, cz]; B = np.r_[wall0 + hw * xa + cd * n, cz]
        passes.append((A, B))
    jobs = [passes]
    SPLIT = 45.3
    for sx in (-1, 1):
        for sy in (-1, 1):
            if (nx != 0 and sx != nx) or (ny != 0 and sy != ny):
                continue
            nc = np.array([sx * s2, sy * s2])
            w0c = [Q for Q in SIDES if Q['kind'] == 'diag' and Q['sx'] == sx and Q['sy'] == sy][0]['w0']
            tc = np.array([-nc[1], nc[0]]); base = w0c * nc
            def foot_at_x(ax):
                t = (sx * ax - base[0]) / tc[0]
                return base + t * tc
            xs_ = (52.9, SPLIT - 0.4) if nx != 0 else (SPLIT + 0.4, 38.3)
            Pa, Pb = foot_at_x(xs_[0]), foot_at_x(xs_[1])
            ps = []
            for psi in PSI:
                pr = math.radians(psi)
                cdc, cz = Fd - (RF - 0.5) * math.cos(pr), Fz + (RF - 0.5) * math.sin(pr)
                ps.append((np.r_[Pa + cdc * nc, cz], np.r_[Pb + cdc * nc, cz]))
            jobs.append(ps)
    for ps in jobs:
        fa = ball_pts([ps[0][0]], R, o3)[0]
        g.g0(fa[0], fa[1], 150.0)
        g.g0(z=CL)
        g.g1(z=fa[2] + 0.6, f=F)
        g.g1(z=fa[2], f=FP)
        fwd = True
        for j_, (A, B) in enumerate(ps):
            P0, P1 = (A, B) if fwd else (B, A)
            p0 = ball_pts([P0], R, o3)[0]
            if j_ > 0:
                g.g1(z=g.pos[2] + 0.6, f=F)
                g.g1(p0[0], p0[1], p0[2] + 0.6, F)
                g.g1(z=p0[2], f=FP)
            nn = int(np.linalg.norm(P1 - P0) / 0.2) + 1
            pts = ball_pts([P0 + (P1 - P0) * q / nn for q in range(1, nn + 1)], R, o3)
            for p in pts:
                g.g1(p[0], p[1], p[2], F)
            fwd = not fwd
        g.g1(z=g.pos[2] + 0.6, f=F)
        g.g0(z=CL)
    g.g0(z=150.0)
    g.endframe()

# ---- T4: engraving in the +Y wall (depth 1.27)
D, RPM, F, FP = TOOLS[4]
g.tool(4, RPM, 'T4 1.5mm flat - engraving on +Y wall')
s = M.section(plane_origin=[0, 72.3, 0], plane_normal=[0, 1, 0])
T = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1.]])
wp = max(s.to_2D(to_2D=T)[0].polygons_full, key=lambda p: p.area)
glyphs = [Polygon(h) for h in wp.interiors]
SY = [S for S in SIDES if S['kind'] == 'axis' and S['n'] == (0, 1)][0]
g.frame(SY['o'], SY['I'], side_name(SY) + ' T4 engraving')
ENG = -1.27
for gl in glyphs:
    # frame X = -x', frame Y = z
    gf = Polygon([(-x, z) for x, z in gl.exterior.coords])
    rr = offset_rings(gf, 0.755, 0.6)
    seq = [p for lev in reversed(rr) for p in lev]
    if not seq:
        continue
    for dz in (-0.45, -0.9, ENG):
        first = True
        for p in seq:
            pts = ring_pts(p, ccw=True)
            pts = rotate_to(pts, (g.pos[0], g.pos[1]))
            if g.pos[2] > 100:
                g.g0(pts[0][0], pts[0][1], 150.0)
                g.g0(z=1.0)
            else:
                g.g1(z=1.0, f=F)
                g.g1(pts[0][0], pts[0][1], 1.0, F)
            g.g1(z=dz, f=FP)
            g.path(pts[1:], dz, F)
            first = False
        g.g1(z=1.0, f=F)
g.g0(z=SY['dclear'])
g.g0(z=150.0)
g.endframe()

# ================================================================ PART-OFF
g.raw('(PART-OFF)')
D, RPM, F, FP = TOOLS[1]
g.tool(1, RPM, 'T1 10mm flat - part-off: through the window from +Z, then side slots')
ZS = 20.0   # zero-tilt frame lifted 20 mm (keeps programmed Z inside machine travel)
g.frame((0.0, 0.0, -ZS), 0.0, 'zero-tilt frame, origin Z-20: window pocket below the parting plane', J=0.0)
win_levels = [z + ZS for z in [-2.8, -5.3, -7.8, -10.3, -12.8, -15.3, -16.5]]
pocket_levels(g, lambda z: win_rings, win_levels, F * 0.8, FP, 0.5 + ZS, 6.0,
              lambda zl, k, lv: (lv[k - 1] if k > 0 else -0.3 + ZS) + 0.3, safe=SAFE + ZS)
g.g0(z=150.0)
g.endframe()
D2, RPM2, F2, FP2 = TOOLS[2]
g.tool(2, RPM2, 'T2 6mm flat - part-off: widen the window pocket below Z0 to the window edge')
g.frame((0.0, 0.0, -ZS), 0.0, 'zero-tilt frame, origin Z-20', J=0.0)
band = [lev for lev in offset_rings(window, 3.15, 2.0, medial=False)[:2]]
pocket_levels(g, lambda z: band, [z + ZS for z in [-2.3, -4.3, -6.3, -8.3, -10.3, -12.3, -14.3, -16.3]],
              F2 * 0.8, FP2, 0.5 + ZS, 6.0, lambda zl, k, lv: (lv[k - 1] if k > 0 else -0.3 + ZS) + 0.3, safe=SAFE + ZS)
g.g0(z=150.0)
g.endframe()
g.tool(1, RPM, 'T1 10mm flat - part-off side slots')
SLOT_Y = -11.0
for S in SIDES:
    if S['kind'] != 'axis':
        continue
    nx, ny = S['n']
    g.frame(S['o'], S['I'], side_name(S) + ' part-off slot')
    if nx != 0:
        dmin = -(WALL_X - 19.1)          # tip reaches |x'| = 19.6 ; holder face stays outside the stock
        hw = 63.5                        # holder clear of the jaws
    else:
        dmin = -5.2                      # holder face must stay beyond the vise body (|y'| > 106)
        hw = STK_X + 6.0
    d = S['dstock'] - 1.6
    g.g0(-hw, SLOT_Y, 150.0)
    g.g0(z=S['dclear'])
    g.g1(z=d, f=FP)
    left = True
    while True:
        g.g1(hw if left else -hw, SLOT_Y, d, F * 0.7)
        left = not left
        if d <= dmin + 1e-6:
            break
        d = max(dmin, d - 2.0)
        g.g1(z=d, f=FP)
    g.g1(z=S['dclear'], f=F)
    g.g0(z=150.0)
    g.endframe()

g.raw('M5')
g.raw('M30')
g.raw('%')

open(os.path.join(RUN, 'work/program.nc'), 'w').write('\n'.join(g.L) + '\n')

# ---- report helpers
sec = Polygon([(-STK_X, -STK_Y), (STK_X, -STK_Y), (STK_X, STK_Y), (-STK_X, STK_Y)])
cut = Polygon()
from shapely.ops import unary_union
pieces = [p.buffer(5.0) for lev in win_rings for p in lev] + [window.buffer(-3.15)]
pieces.append(Polygon([(-STK_X - 1, -63.5 - 5), (-19.1, -63.5 - 5), (-19.1, 63.5 + 5), (-STK_X - 1, 63.5 + 5)]))
pieces.append(Polygon([(STK_X + 1, -63.5 - 5), (19.1, -63.5 - 5), (19.1, 63.5 + 5), (STK_X + 1, 63.5 + 5)]))
YR = WALL_Y - 5.2
pieces.append(Polygon([(-STK_X - 1, YR), (STK_X + 1, YR), (STK_X + 1, STK_Y + 1), (-STK_X - 1, STK_Y + 1)]))
pieces.append(Polygon([(-STK_X - 1, -YR), (STK_X + 1, -YR), (STK_X + 1, -STK_Y - 1), (-STK_X - 1, -STK_Y - 1)]))
rem = sec.difference(unary_union(pieces))
print('stock section', round(sec.area, 1), 'remaining after part-off', round(rem.area, 1),
      f'{100 * rem.area / sec.area:.1f}%', [tuple(np.round(p.bounds, 1)) for p in parts(rem)], file=sys.stderr)
print('lines', len(g.L), 'skipped holes', [(tuple(np.round(c, 2)), round(r, 3)) for c, r in skipped],
      't2', len(t2_list), 't3', len(t3_list), 'small', len(small_round), 'corner segs', len(segs),
      'glyphs', len(glyphs), file=sys.stderr)
