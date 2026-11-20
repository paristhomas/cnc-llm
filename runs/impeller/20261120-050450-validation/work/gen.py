#!/usr/bin/env python3
"""Impeller toolpath generator (own code: shapely offsets + heightmap drop-cutter)."""
import json, math, os, sys
import numpy as np
import trimesh
from shapely.geometry import Polygon, MultiPolygon, LineString, MultiLineString, Point, box
from shapely.ops import unary_union, linemerge

HERE = os.path.dirname(os.path.abspath(__file__))
BRIEF = os.path.join(HERE, '..', 'brief')
OUT = os.path.join(HERE, 'program.nc')
CFG = json.load(open(os.path.join(HERE, 'cfg.json'))) if os.path.exists(os.path.join(HERE, 'cfg.json')) else {}

mesh = trimesh.load(os.path.join(BRIEF, 'part.stl'))
H = np.load(os.path.join(BRIEF, 'target_height.npy')).astype(np.float64)
HJ = json.load(open(os.path.join(BRIEF, 'target_height.json')))
X0, Y0, RES = HJ['x0'], HJ['y0'], HJ['res']
NY, NX = H.shape
# fill the bore (hub top) so tools never dive in
yy = Y0 + (np.arange(NY) + 0.5) * RES
xx = X0 + (np.arange(NX) + 0.5) * RES
XX, YYg = np.meshgrid(xx, yy)
RR = np.hypot(XX, YYg)
H[(RR < 4.3)] = 22.0
# coarse (0.1) max-pooled grid
Hc = H.reshape(NY // 2, 2, NX // 2, 2).max(axis=(1, 3))
RESc = RES * 2

SAFE = 25.0
STOCK_TOP = 23.0


def section(z):
    s = mesh.section(plane_origin=[0, 0, z], plane_normal=[0, 0, 1])
    if s is None:
        return Polygon()
    polys = s.to_2D(to_2D=np.eye(4))[0].polygons_full
    return unary_union([Polygon(p.exterior) for p in polys]).buffer(0)


def drop(pts, R, kind, grid='fine', rfoot=None, extra=0.0):
    """tip z for each XY point. kind 'ball' or 'flat'. rfoot = footprint radius (<=R)."""
    if grid == 'fine':
        G, x0, y0, res = H, X0, Y0, RES
    else:
        G, x0, y0, res = Hc, X0, Y0, RESc
    rf = R if rfoot is None else rfoot
    rf_s = rf + extra
    k = int(math.ceil(rf_s / res)) + 1
    du = np.arange(-k, k + 1)
    DU, DV = np.meshgrid(du, du)
    DU = DU.ravel(); DV = DV.ravel()
    pts = np.asarray(pts, float)
    out = np.empty(len(pts))
    ny, nx = G.shape
    ch = max(1, int(2e7 // len(DU)))
    for a in range(0, len(pts), ch):
        p = pts[a:a + ch]
        ci = np.floor((p[:, 0] - x0) / res).astype(int)
        cj = np.floor((p[:, 1] - y0) / res).astype(int)
        I = ci[:, None] + DU[None, :]
        J = cj[:, None] + DV[None, :]
        cx = x0 + (I + 0.5) * res - p[:, 0:1]
        cy = y0 + (J + 0.5) * res - p[:, 1:2]
        d = np.hypot(cx, cy)
        valid = (I >= 0) & (I < nx) & (J >= 0) & (J < ny) & (d <= rf_s)
        Ic = np.clip(I, 0, nx - 1); Jc = np.clip(J, 0, ny - 1)
        hv = G[Jc, Ic]
        if kind == 'ball':
            dd = np.minimum(d, R)
            prof = R - np.sqrt(np.maximum(R * R - dd * dd, 0))
        else:
            prof = 0.0
        v = np.where(valid, hv - prof, -1e9)
        out[a:a + ch] = v.max(axis=1)
    return out


class G:
    def __init__(s):
        s.L = ['%', '(impeller - own generator)', 'G21 G90 G17 G94', 'G54']
        s.x = 0; s.y = 0; s.z = 150; s.f = None
        s.tool = None

    def c(s, t):
        s.L.append('(' + t + ')')

    def tool_change(s, n, rpm, name):
        if s.tool is not None:
            s.L.append('M5')
        s.L.append(f'T{n} M6')
        s.L.append(f'G43 H{n}')
        s.L.append(f'S{rpm} M3')
        s.z = 150; s.tool = n
        s.c(name)

    def rapid(s, x=None, y=None, z=None):
        w = []
        if x is not None and abs(x - s.x) > 1e-4: w.append(f'X{x:.3f}'); s.x = x
        if y is not None and abs(y - s.y) > 1e-4: w.append(f'Y{y:.3f}'); s.y = y
        if z is not None and abs(z - s.z) > 1e-4: w.append(f'Z{z:.3f}'); s.z = z
        if w: s.L.append('G0 ' + ' '.join(w))

    def lin(s, x, y, z, f):
        w = []
        if abs(x - s.x) > 1e-4: w.append(f'X{x:.3f}')
        if abs(y - s.y) > 1e-4: w.append(f'Y{y:.3f}')
        if abs(z - s.z) > 1e-4: w.append(f'Z{z:.3f}')
        if not w: return
        s.x, s.y, s.z = x, y, z
        fs = ''
        if s.f != f: fs = f' F{f:.0f}'; s.f = f
        s.L.append('G1 ' + ' '.join(w) + fs)

    def raw(s, t, x, y, z, f=None):
        s.L.append(t + (f' F{f:.0f}' if f else ''))
        if f: s.f = f
        s.x, s.y, s.z = x, y, z

    def retract(s):
        s.rapid(z=SAFE)

    def go_to(s, x, y, zfree):
        """rapid at SAFE to x,y then rapid down to zfree (known cleared)."""
        if s.z < SAFE - 1e-6:
            s.retract()
        s.rapid(x, y)
        s.rapid(z=zfree)

    def end(s):
        s.retract()
        s.L += ['M5', 'M30', '%']


def lines_of(geom):
    if geom.is_empty:
        return []
    if isinstance(geom, LineString):
        return [geom]
    if hasattr(geom, 'geoms'):
        out = []
        for g in geom.geoms:
            out += lines_of(g)
        return out
    return []


def boundary_lines(poly):
    return lines_of(poly.boundary)


def densify(coords, step):
    coords = np.asarray(coords)
    out = [coords[0]]
    for a, b in zip(coords[:-1], coords[1:]):
        L = np.hypot(*(b - a))
        n = max(1, int(math.ceil(L / step)))
        for t in range(1, n + 1):
            out.append(a + (b - a) * t / n)
    return np.array(out)


def simplify3(P, tol=0.003):
    """drop points that lie on the line between neighbours (3D)."""
    if len(P) < 3:
        return P
    keep = [0]
    i = 0
    n = len(P)
    while i < n - 1:
        j = i + 2
        while j < n:
            a = P[i]; b = P[j]
            seg = P[i + 1:j]
            ab = b - a
            L2 = (ab ** 2).sum()
            if L2 < 1e-12:
                j += 1; continue
            t = np.clip(((seg - a) @ ab) / L2, 0, 1)
            dev = np.linalg.norm(seg - (a + t[:, None] * ab), axis=1).max()
            if dev > tol or j - i > 400:
                break
            j += 1
        i = j - 1
        keep.append(i)
    return P[keep]


# ------------------------------------------------------------------ roughing
STOCK = box(-42, -42, 42, 42)
VA = 0.2
RA = 0.3
LEVELS = [22.2, 20.2, 18.2, 16.2, 14.2, 12.2, 11.2, 10.2, 9.2, 8.2, 7.2, 6.2, 4.2, 2.2, -0.2]
SECS = {}
for z in LEVELS:
    zs = max(z - VA + 0.013, 0.5)
    SECS[z] = section(zs) if zs < 22.0 else Polygon()


def rings_for(keep, region, s, clip):
    """offset rings of keep at d = 0, s, 2s ... ; clipped to clip; returned outer->inner."""
    base = keep if not keep.is_empty else Point(0, 0).buffer(0.05)
    out = []
    d = 0.0
    while True:
        g = base.buffer(d, quad_segs=16) if d > 0 else base
        ls = [l for l in lines_of(g.boundary.intersection(clip)) if l.length > 0.3]
        out.append(ls)
        if region.difference(g).area < 1e-3:
            break
        d += s
    return out[::-1]


def cut_rings(g, rings, z, zprev, f, fpl):
    for ring in rings:
        # greedy order inside a ring level
        segs = list(ring)
        while segs:
            best = None
            for k, l in enumerate(segs):
                for rev in (False, True):
                    c = list(l.coords)
                    if rev: c = c[::-1]
                    dd = math.hypot(c[0][0] - g.x, c[0][1] - g.y)
                    if best is None or dd < best[0]:
                        best = (dd, k, c)
            _, k, c = best
            segs.pop(k)
            sx, sy = c[0]
            if g.z <= z + 1e-6 and math.hypot(sx - g.x, sy - g.y) < 0.01:
                pass
            else:
                g.go_to(sx, sy, min(zprev + 1.0, SAFE))
                g.lin(sx, sy, z, fpl)
            for (x, y) in c[1:]:
                g.lin(x, y, z, f)
    g.retract()


g = G()
# T1 roughing
R1 = 5.0
g.tool_change(1, 18000, 'T1 10mm flat - Z-level offset roughing')
F1, F1p = 3240, 1080
clip1 = STOCK.buffer(R1 - 1.0, join_style=2)
CLEARED1 = {}
zprev = STOCK_TOP
for z in LEVELS:
    keep = SECS[z].buffer(R1 + RA, quad_segs=16) if not SECS[z].is_empty else Polygon()
    region = clip1.difference(keep)
    rings = rings_for(keep, region, 4.0, clip1)
    g.c(f'level Z{z}')
    cut_rings(g, rings, z, zprev, F1, F1p)
    allr = [l for r in rings for l in r]
    CLEARED1[z] = unary_union([l.buffer(R1, quad_segs=8) for l in allr]) if allr else Polygon()
    zprev = z

# T2 rest roughing
R2 = 3.0
g.tool_change(2, 24000, 'T2 6mm flat - rest roughing')
F2, F2p = 2880, 960
zprev = STOCK_TOP
for z in LEVELS:
    free = STOCK.difference(SECS[z].buffer(RA, quad_segs=16)) if not SECS[z].is_empty else STOCK
    rem = free.difference(CLEARED1[z].buffer(-0.02))
    rem = rem.buffer(-0.04).buffer(0.04)
    parts = [p for p in (rem.geoms if hasattr(rem, 'geoms') else [rem]) if p.area > 0.2]
    if not parts:
        zprev = z; continue
    rem = unary_union(parts)
    keep = SECS[z].buffer(R2 + RA, quad_segs=16)
    clip = rem.buffer(R2 - 0.15).difference(keep.buffer(-1e-3))
    region = rem
    rings = rings_for(keep, clip, 2.4, clip)
    g.c(f'rest level Z{z}')
    cut_rings(g, rings, z, zprev, F2, F2p)
    zprev = z

# bore D8 : helix r=1.0
g.c('bore D8 helix')
g.go_to(1.0, 0.0, 23.0)
zc = 23.0
pitch = 0.6
while zc > -0.3 + 1e-6:
    zn = max(zc - pitch, -0.3)
    g.raw(f'G3 X1.000 Y0.000 Z{zn:.3f} I-1.000 J0.000', 1.0, 0.0, zn, F2p)
    zc = zn
g.raw('G3 X1.000 Y0.000 I-1.000 J0.000', 1.0, 0.0, -0.3, F2p)
g.lin(0.0, 0.0, -0.3, F2p)
g.retract()

# ------------------------------------------------------------------ finishing helpers
ISL = section(15.0)
ISL = max(ISL.geoms, key=lambda p: p.area) if hasattr(ISL, 'geoms') else ISL
HUB = section(20.0)
HUB = Polygon(max(HUB.geoms, key=lambda p: p.area).exterior) if hasattr(HUB, 'geoms') else Polygon(HUB.exterior)


def refine(P, z, f, thr=0.15, it=7):
    """insert midpoints where linear interpolation would undercut the drop surface; staircase leftovers."""
    P = np.asarray(P, float); z = np.asarray(z, float)
    for _ in range(it):
        dz = np.abs(np.diff(z))
        L = np.hypot(*(np.diff(P, axis=0).T))
        idx = np.where((dz > thr) & (L > 0.01))[0]
        if len(idx) == 0:
            break
        M = (P[idx] + P[idx + 1]) / 2
        zm = f(M)
        need = zm > (z[idx] + z[idx + 1]) / 2 + 0.002
        idx = idx[need]; M = M[need]; zm = zm[need]
        if len(idx) == 0:
            break
        P = np.insert(P, idx + 1, M, axis=0)
        z = np.insert(z, idx + 1, zm)
    pts = [np.array([P[0, 0], P[0, 1], z[0]])]
    for k in range(1, len(P)):
        a = pts[-1]; b = np.array([P[k, 0], P[k, 1], z[k]])
        if abs(b[2] - a[2]) > thr:
            if b[2] > a[2]:
                pts.append(np.array([a[0], a[1], b[2]]))
            else:
                pts.append(np.array([b[0], b[1], a[2]]))
        pts.append(b)
    return np.array(pts)


def emit_runs(g, runs, f, fpl, tol=0.003):
    for r in runs:
        r = simplify3(r, tol)
        rr0 = math.hypot(r[0, 0], r[0, 1])
        g.go_to(r[0, 0], r[0, 1], 19.0 if rr0 > 21 else 23.0)
        g.lin(r[0, 0], r[0, 1], r[0, 2], fpl)
        prev = r[0]
        for q in r[1:]:
            dz = q[2] - prev[2]; dxy = math.hypot(q[0] - prev[0], q[1] - prev[1])
            g.lin(q[0], q[1], q[2], fpl if (dz < -0.5 and -dz > dxy) else f)
            prev = q
        g.retract()


def contour_pass(g, isl, d, R, kind, f, fpl, rfoot, holder=None, step=0.1, mask=None, levels=(), avoid=None, tol=None):
    ring = isl.buffer(d, quad_segs=64).exterior
    c = np.array(ring.coords)
    P = densify(c, step)[:-1]
    fz = lambda Q: drop(Q, R, kind, 'fine', rfoot=rfoot)
    z = fz(P)
    ok = np.ones(len(P), bool)
    if holder is not None:
        hr, so = holder
        hz = drop(P, hr + 0.5, 'flat', 'coarse')
        ok &= z + so >= hz + 0.02
    if mask is not None:
        ok &= np.array([mask.distance(Point(*p)) < 1e-9 for p in P])
    if avoid is not None:
        ok &= np.array([avoid.distance(Point(*p)) > 1e-9 for p in P])
    # start at farthest-from-centre point; closed loop
    i0 = int(np.argmax(np.hypot(P[:, 0], P[:, 1])))
    P = np.roll(P, -i0, axis=0); z = np.roll(z, -i0); ok = np.roll(ok, -i0)
    if ok.all():
        P = np.vstack([P, P[:1]]); z = np.append(z, z[0]); ok = np.append(ok, True)
    for lev in list(levels) + [None]:
        if lev is None:
            zz = z.copy(); use = ok.copy()
        else:
            zz = np.maximum(z, lev); use = ok.copy()
        runs = []
        cur = []
        for k in range(len(P)):
            if use[k]:
                cur.append(k)
            else:
                if len(cur) > 2: runs.append(cur)
                cur = []
        if len(cur) > 2: runs.append(cur)
        out = []
        for idx in runs:
            Q = P[idx]
            fzl = fz if lev is None else (lambda X, lev=lev: np.maximum(fz(X), lev))
            out.append(refine(Q, zz[idx], fzl))
        emit_runs(g, out, f, fpl, tol=tol if tol is not None else (0.0003 if levels else 0.003))


def leftover(isl, d, R):
    """material near isl's walls not swept by a flat tool of radius R running at offset d."""
    ring = isl.buffer(d, quad_segs=64).exterior
    lo = isl.buffer(d + R, quad_segs=64).difference(isl.buffer(d - R + 0.02, quad_segs=64)).difference(ring.buffer(R, quad_segs=32))
    lo = lo.buffer(-0.04).buffer(0.04)
    parts = [p for p in (lo.geoms if hasattr(lo, 'geoms') else [lo]) if p.area > 0.003]
    return unary_union(parts) if parts else Polygon()


LO2 = leftover(ISL, 3.0, 3.0)
LO3 = leftover(ISL, 1.53, 1.5)
LO4 = leftover(ISL, 0.78, 0.75)
HUBZ = Point(0, 0).buffer(13.0, quad_segs=32)
print('leftover areas', LO2.area, LO3.area, LO4.area, file=sys.stderr)

g.c('wall finish T2 (hub+blades)')
contour_pass(g, ISL, 3.1, 3.0, 'flat', F2, F2p, 3.0)
contour_pass(g, ISL, 3.0, 3.0, 'flat', F2, F2p, 2.95)
g.c('hub wall above blades + blade tops at hub')
contour_pass(g, HUB, 3.0, 3.0, 'flat', F2, F2p, 2.95)

# T3 corners (only where T2 left corner material), in levels for the 10 mm flute
g.tool_change(3, 24000, 'T3 3mm flat - concave vertical corners')
contour_pass(g, ISL, 1.53, 1.5, 'flat', 960, 320, 1.48, mask=LO2.buffer(1.7), levels=(18.5, 15.0, 11.5))

# T4 corners
g.tool_change(4, 24000, 'T4 1.5mm flat - concave vertical corners')
contour_pass(g, ISL, 0.78, 0.75, 'flat', 480, 160, 0.73, mask=LO3.buffer(0.95).union(HUBZ), holder=(10.0, 14.0),
             levels=(20.5, 19.0, 17.5, 16.0, 14.5, 13.0, 11.5, 10.0, 8.5, 7.0), step=0.05)

# T6 ball raster
g.tool_change(6, 24000, 'T6 6mm ball - drop-cutter raster')
F6, F6p = 1440, 480
R6 = 3.0
so = CFG.get('so6', 0.5)
ys = np.arange(-43.0, 43.0 + 1e-6, so)
f6 = lambda Q: np.maximum(drop(Q, R6, 'ball', 'coarse', extra=0.05), 3.0)
first = True
for li, y in enumerate(ys):
    xm = math.sqrt(max(43.5 ** 2 - y * y, 0))
    xs = np.arange(-xm, xm + 1e-6, 0.25)
    if len(xs) < 2: continue
    P = np.column_stack([xs, np.full_like(xs, y)])
    pts = refine(P, f6(P), f6)
    if li % 2: pts = pts[::-1]
    pts = simplify3(pts, 0.003)
    if first:
        g.go_to(pts[0, 0], pts[0, 1], 6.0)
        g.lin(pts[0, 0], pts[0, 1], pts[0, 2], F6p)
        first = False
    else:
        g.lin(pts[0, 0], pts[0, 1], pts[0, 2], F6)
    prev = pts[0]
    for q in pts[1:]:
        dz = q[2] - prev[2]
        dxy = math.hypot(q[0] - prev[0], q[1] - prev[1])
        g.lin(q[0], q[1], q[2], F6p if (dz < -0.5 and -dz > dxy) else F6)
        prev = q
g.retract()

# T7 ball pencils
g.tool_change(7, 24000, 'T7 3mm ball - wall/dish pencils')
for d in CFG.get('t7', [1.52, 1.9, 2.3]):
    contour_pass(g, ISL, d, 1.5, 'ball', 960, 320, min(1.5, d - 0.03))

# T8 (away from vertical corner leftovers)
t8 = CFG.get('t8', [0.52, 0.75, 1.0, 1.25, 1.5])
if t8:
    g.tool_change(8, 24000, 'T8 1mm ball - corner pencils')
    av = LO4.buffer(0.65) if not LO4.is_empty else None
    if av is not None:
        g.c('T8 vertical corner levels')
        contour_pass(g, ISL, 0.52, 0.5, 'ball', 384, 128, 0.49, holder=(10.0, 12.0), step=0.04,
                     mask=LO4.buffer(0.7).union(HUBZ), levels=(20.0, 17.5, 15.0, 12.5, 10.0, 7.5))
    for d in t8:
        contour_pass(g, ISL, d, 0.5, 'ball', 384, 128, min(0.5, d - 0.03), holder=(10.0, 12.0), step=0.04 if d < 0.6 else 0.08, tol=0.0003 if d < 0.6 else 0.003)

# T1 outer profile
g.tool_change(1, 18000, 'T1 outer profile R40')
for rr in (45.15, 45.0):
    g.go_to(rr, 0.0, 7.0)
    g.lin(rr, 0.0, -0.2, F1p)
    g.raw(f'G2 X{rr:.3f} Y0.000 I{-rr:.3f} J0.000', rr, 0.0, -0.2, F1)
    g.retract()
g.end()
open(OUT, 'w').write('\n'.join(g.L) + '\n')
print('lines', len(g.L))
