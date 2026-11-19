"""Toolpath generator for mould_cavity. Prints G-code to stdout.
Own CAM: z-level ring roughing from mesh sections (shapely offsets), drop-cutter rasters on target_height grid.
"""
import sys, math, json, os
from functools import reduce
import numpy as np
import trimesh
from shapely.geometry import LineString, Polygon, Point, box
from shapely.geometry.polygon import orient
from shapely.ops import polygonize, unary_union

HERE = os.path.dirname(os.path.abspath(__file__))
BRIEF = os.path.join(HERE, '..', 'brief')
CLR = 35.0          # safe clearance plane (stock top 31)
TOP = 30.0

out = []
def g(s): out.append(s)
def f3(v): return f"{v:.3f}".rstrip('0').rstrip('.') if abs(v) > 1e-9 else "0"

# ---------------------------------------------------------------- geometry
mesh = trimesh.load(os.path.join(BRIEF, 'part.stl'))
meta = json.load(open(os.path.join(BRIEF, 'target_height.json')))
H = np.load(os.path.join(BRIEF, 'target_height.npy')).astype(np.float64)
X0, Y0, RES, NX, NY = meta['x0'], meta['y0'], meta['res'], meta['nx'], meta['ny']
PAD = 120
# fill the guide-pin holes for 3D drops so the surface rasters never dive into them
_yy, _xx = np.mgrid[0:NY, 0:NX]
for (cx, cy) in [(-38, -28), (38, -28), (38, 28), (-38, 28)]:
    H[np.hypot(X0 + (_xx + 0.5) * RES - cx, Y0 + (_yy + 0.5) * RES - cy) < 4.4] = 30.0
Hp = np.pad(H, PAD, constant_values=0.0)
NXP = NX + 2 * PAD
Hflat = Hp.ravel()

def section(z):
    segs = np.round(trimesh.intersections.mesh_plane(mesh, [0, 0, 1], [0, 0, z])[:, :, :2], 4)
    lines = unary_union([LineString(s) for s in segs if np.linalg.norm(s[0] - s[1]) > 1e-6])
    polys = [Polygon(p.exterior) for p in polygonize(lines)]
    return reduce(lambda a, b: a.symmetric_difference(b), polys)

# ---------------------------------------------------------------- drop cutter
def footprint(profile, Rt):
    n = int(math.ceil(Rt / RES)) + 1
    di, dj = np.mgrid[-n:n + 1, -n:n + 1]
    rho = np.hypot(di, dj) * RES
    m = rho <= Rt
    return (di[m] * NXP + dj[m]).astype(np.int64), profile(rho[m])

def ball(R):
    return (lambda r: R - np.sqrt(np.maximum(R * R - r * r, 0.0))), R

def bull(Rf, r):
    return (lambda rho: np.where(rho <= Rf, 0.0, r - np.sqrt(np.maximum(r * r - (rho - Rf) ** 2, 0.0)))), Rf + r

def drop(ii, jj, prof):
    """ii, jj: grid indices (cell centres). returns tip z."""
    off, hh = footprint(*prof)
    base = (ii + PAD) * NXP + (jj + PAD)
    tip = np.full(base.shape, -1e9)
    for o, h in zip(off, hh):
        np.maximum(tip, Hflat[base + o] - h, out=tip)
    return tip

def xi(j): return X0 + (j + 0.5) * RES
def yi(i): return Y0 + (i + 0.5) * RES
def jx(x): return int(round((x - X0) / RES - 0.5))
def iy(y): return int(round((y - Y0) / RES - 0.5))

def simplify3(pts, tol=0.003):
    if len(pts) < 3: return pts
    keep = [pts[0]]
    a = 0
    for k in range(2, len(pts)):
        A = np.array(pts[a]); B = np.array(pts[k])
        seg = B - A; L = np.linalg.norm(seg)
        ok = True
        if L > 1e-9:
            for m in range(a + 1, k):
                P = np.array(pts[m]) - A
                d = np.linalg.norm(P - seg * np.dot(P, seg) / (L * L))
                if d > tol: ok = False; break
        if not ok or L > 8.0:
            keep.append(pts[k - 1]); a = k - 1
    keep.append(pts[-1])
    return keep

# ---------------------------------------------------------------- program pieces
def header():
    pass
    g("(mould_cavity - AL6061-T6 - single setup, G54 = model coords, Z0 = part bottom)")
    g("G21 G90 G17 G94")
    g("G54")

def toolchange(t, rpm, desc):
    g(f"(---- T{t} {desc} ----)")
    g("M5")
    g(f"T{t} M6")
    g(f"G43 H{t}")
    g(f"S{rpm} M3")
    g(f"G0 Z{f3(CLR)}")

def face_top():
    # T1 facing 31 -> 30, stepover 6 (0.6D, 1 mm deep)
    F = 3240
    ys = np.arange(-36, 36.01, 6.0)
    g("(face top Z31 -> Z30)")
    g(f"G0 X-53 Y{f3(ys[0])}")
    g("G0 Z30")
    for k, y in enumerate(ys):
        xa, xb = (-53, 53) if k % 2 == 0 else (53, -53)
        if k: g(f"G1 Y{f3(y)} F{F}")
        g(f"G1 X{xb} F{F}")
    g(f"G0 Z{f3(CLR)}")

def ramp_ring(coords, zstart, zend, slope):
    """coords: closed ring list (first==last). Ramp down along ring, then a full loop at zend."""
    pts = [np.array(c) for c in coords[:-1]]
    n = len(pts)
    path = [(pts[0][0], pts[0][1], zstart)]
    z = zstart; k = 0; cur = pts[0]
    while z > zend + 1e-9:
        nxt = pts[(k + 1) % n]
        L = np.linalg.norm(nxt - cur)
        dz = L * slope
        if z - dz <= zend:
            t = (z - zend) / slope / L if L > 0 else 0
            P = cur + (nxt - cur) * t
            path.append((P[0], P[1], zend))
            # full loop at zend from P back to P
            loop = [nxt] + [pts[(k + 1 + m) % n] for m in range(1, n)] + [cur]
            # loop goes nxt ... cur (k) then back to P
            for q in [pts[(k + 1 + m) % n] for m in range(0, n)]:
                path.append((q[0], q[1], zend))
            path.append((P[0], P[1], zend))
            return path
        z -= dz
        path.append((nxt[0], nxt[1], z))
        cur = nxt; k += 1
    for m in range(1, n + 1):
        q = pts[(k + m) % n]
        path.append((q[0], q[1], zend))
    return path

def rough_cavity(R=5.0, a=0.3, stepover=4.0, levels=(28, 26, 24, 22, 20, 18, 16.3), F=3240, Framp=1100):
    g("(rough cavity: z-level offset rings, leave 0.3)")
    zprev = TOP
    first_level = True
    pos = None   # (x, y, z) or None when at clearance
    for z in levels:
        zs = max(z - a, 16.02)
        M = section(zs)
        free = box(-60, -50, 60, 50).difference(M.buffer(R + a, quad_segs=32))
        comps = [p for p in getattr(free, 'geoms', [free]) if p.area > 0.01 and abs(p.centroid.x) < 30 and abs(p.centroid.y) < 20]
        g(f"(level Z{f3(z)})")
        for P in comps:
            rings = []
            k = 0
            while True:
                b = P.buffer(-k * stepover, quad_segs=32)
                if b.is_empty: break
                lev = []
                for q in getattr(b, 'geoms', [b]):
                    q = orient(q.simplify(0.005), 1.0)   # exterior CCW (climb in pocket), holes CW (climb round island)
                    for r in [q.exterior] + list(q.interiors):
                        if r.length > 0.5: lev.append(list(r.coords))
                rings.append(lev)
                k += 1
            Pz = P.buffer(0.02)
            for lev in reversed(rings):
                for ring in lev:
                    cur = None if pos is None else np.array(pos[:2])
                    arr = np.array(ring[:-1])
                    if cur is not None:
                        s = int(np.argmin(np.linalg.norm(arr - cur, axis=1)))
                    else:
                        s = 0
                    arr = np.vstack([arr[s:], arr[:s]])
                    rc = [tuple(p) for p in arr] + [tuple(arr[0])]
                    start = rc[0]
                    if pos is not None and abs(pos[2] - z) < 1e-6 and Pz.contains(LineString([pos[:2], start])):
                        g(f"G1 X{f3(start[0])} Y{f3(start[1])} F{F}")
                        for p in rc[1:]:
                            g(f"G1 X{f3(p[0])} Y{f3(p[1])}")
                    else:
                        if pos is not None: g(f"G0 Z{f3(CLR)}")
                        g(f"G0 X{f3(start[0])} Y{f3(start[1])}")
                        zst = zprev + 0.5
                        g(f"G0 Z{f3(zst + 1.0)}")
                        path = ramp_ring(rc, zst, z, 0.07)
                        g(f"G1 Z{f3(zst)} F{Framp}")
                        for p in path[1:]:
                            g(f"G1 X{f3(p[0])} Y{f3(p[1])} Z{f3(p[2])} F{Framp if p[2] > z + 1e-6 else F}")
                    pos = (rc[-1][0], rc[-1][1], z)
        zprev = z
    g(f"G0 Z{f3(CLR)}")

def raster(prof, leave, stepover, F, ylo=-28.0, yhi=28.0, xlim=42.0, dx=0.1, label=""):
    """Zig-zag raster along X, drop-cutter on target grid; links follow the surface."""
    g(f"(3D raster {label}: stepover {stepover}, leave {leave})")
    pr, Rt = prof
    di = max(1, int(round(stepover / RES)))
    dj = max(1, int(round(dx / RES)))
    i_rows = list(range(iy(ylo), iy(yhi) + 1, di))
    jj = np.arange(jx(-xlim), jx(xlim) + 1, dj)
    II, JJ = np.meshgrid(np.array(i_rows), jj, indexing='ij')
    tip = drop(II.ravel(), JJ.ravel(), prof).reshape(II.shape) + leave
    rows = []
    for r in range(len(i_rows)):
        cut = np.where(tip[r] < TOP + leave - 0.01)[0]
        if len(cut) == 0: continue
        a = max(cut[0] - 10, 0); b = min(cut[-1] + 10, len(jj) - 1)
        rows.append((i_rows[r], a, b))
    path = []
    for k, (i, a, b) in enumerate(rows):
        r = i_rows.index(i)
        idx = list(range(a, b + 1)) if k % 2 == 0 else list(range(b, a - 1, -1))
        if path:
            # link from previous end to this row start, densified and dropped
            x1, y1 = path[-1][0], path[-1][1]
            x2, y2 = xi(jj[idx[0]]), yi(i)
            n = max(2, int(math.hypot(x2 - x1, y2 - y1) / 0.05))
            li = np.array([iy(y1 + (y2 - y1) * t) for t in np.linspace(0, 1, n)])
            lj = np.array([jx(x1 + (x2 - x1) * t) for t in np.linspace(0, 1, n)])
            lt = drop(li, lj, prof) + leave
            for q in range(1, n - 1):
                path.append((xi(lj[q]), yi(li[q]), lt[q]))
        for c in idx:
            path.append((xi(jj[c]), yi(i), tip[r, c]))
    path = simplify3(path)
    x, y, z = path[0]
    g(f"G0 X{f3(x)} Y{f3(y)}")
    g(f"G0 Z{f3(z + 1.0)}")
    g(f"G1 Z{f3(z)} F{F // 3}")
    first = True
    for (x, y, z) in path[1:]:
        g(f"G1 X{f3(x)} Y{f3(y)} Z{f3(z)}" + (f" F{F}" if first else ""))
        first = False
    g(f"G0 Z{f3(CLR)}")

def crease(nth=720):
    """Crease where the dome meets the wall/fillet/floor: first radial minimum of the target along rays."""
    th = np.linspace(0, 2 * np.pi, nth, endpoint=False)
    rs = np.arange(10, 28, 0.05)
    rc = []
    for t in th:
        z = H[[iy(r * np.sin(t)) for r in rs], [jx(r * np.cos(t)) for r in rs]]
        rc.append(rs[np.argmax(z <= z.min() + 0.005)])
    return th, np.array(rc)

def pencil(prof, offsets, F, holder=None, label=""):
    """Closed loops parallel to the crease (radial offsets), drop-cutter Z. holder=(stickout, holderR)."""
    g(f"(rest/pencil {label}: {len(offsets)} loops around dome-wall crease)")
    th, rc = crease()
    path = []
    for k, d in enumerate(offsets):
        tt = th if k % 2 == 0 else th[::-1]
        rr = rc if k % 2 == 0 else rc[::-1]
        for t, r in zip(list(tt) + [tt[0]], list(rr) + [rr[0]]):
            path.append(((r + d) * np.cos(t), (r + d) * np.sin(t)))
    ii = np.array([iy(p[1]) for p in path]); jj = np.array([jx(p[0]) for p in path])
    tip = drop(ii, jj, prof)
    if holder:
        so, hr = holder
        hz = drop(ii, jj, (lambda r: np.zeros_like(r), hr))
        bad = hz > tip + so - 0.08
        if bad.any():
            g(f"(holder clearance: {int(bad.sum())} points lifted)")
            tip = np.maximum(tip, np.where(bad, hz - so + 0.08, tip))
    pts = simplify3([(xi(j), yi(i), z) for i, j, z in zip(ii, jj, tip)], 0.002)
    x, y, z = pts[0]
    g(f"G0 X{f3(x)} Y{f3(y)}")
    g("G0 Z31")
    g(f"G1 Z{f3(z + 0.5)} F{F}")
    g(f"G1 Z{f3(z)} F{F // 3}")
    g(f"F{F}")
    for (x, y, z) in pts[1:]:
        g(f"G1 X{f3(x)} Y{f3(y)} Z{f3(z)}")
    g(f"G0 Z{f3(CLR)}")

def holes(F=1500):
    g("(guide-pin holes D8 x 12 deep: helical, path radius 1, 0.6 mm/rev)")
    for (cx, cy) in [(-38, -28), (38, -28), (38, 28), (-38, 28)]:
        g(f"G0 X{f3(cx + 1)} Y{f3(cy)}")
        g("G0 Z31")
        g(f"G1 Z30.3 F{F // 2}")
        z = 30.3
        while z > 18.0 + 1e-9:
            z = max(z - 0.6, 18.0)
            g(f"G3 X{f3(cx + 1)} Y{f3(cy)} Z{f3(z)} I-1 J0 F{F}")
        g(f"G3 X{f3(cx + 1)} Y{f3(cy)} I-1 J0")
        g(f"G1 X{f3(cx)} Y{f3(cy)}")
        g(f"G0 Z{f3(CLR)}")

def profile(off, levels, F=3240, label=""):
    """External rectangle 90x70, tool-centre offset `off`, climb (CW)."""
    g(f"(outer profile {label}, offset {off})")
    ax, ay = 45.0, 35.0
    g(f"G0 X-60 Y0")
    for z in levels:
        g(f"G0 Z{f3(z + 1)}" if z + 1 > 31 else f"G0 Z{f3(z)}")
        if z + 1 > 31: g(f"G1 Z{f3(z)} F{F}")
        x = -ax - off
        g(f"G1 X{f3(x)} Y0 F{F}")
        g(f"G1 Y{f3(ay)}")
        g(f"G2 X{f3(-ax)} Y{f3(ay + off)} I{f3(off)} J0")
        g(f"G1 X{f3(ax)}")
        g(f"G2 X{f3(ax + off)} Y{f3(ay)} I0 J{f3(-off)}")
        g(f"G1 Y{f3(-ay)}")
        g(f"G2 X{f3(ax)} Y{f3(-ay - off)} I{f3(-off)} J0")
        g(f"G1 X{f3(-ax)}")
        g(f"G2 X{f3(-ax - off)} Y{f3(-ay)} I0 J{f3(off)}")
        g(f"G1 Y0")
        g(f"G1 X-60")
    g(f"G0 Z{f3(CLR)}")

# ---------------------------------------------------------------- program
header()
toolchange(1, 18000, "D10 3FL flat: face, rough cavity")
face_top()
rough_cavity()

toolchange(5, 24000, "D8 bull r1: 3D semi-finish leave 0.15")
raster(bull(3.0, 1.0 + 0.15), 0.15, 1.5, 3000, label="semi-finish T5")

toolchange(6, 24000, "D6 ball: 3D finish")
raster(ball(3.0), 0.0, 0.5, 1440, label="finish T6")

toolchange(7, 24000, "D3 ball: rest finish at dome/wall crease")
pencil(ball(1.5), list(np.arange(-3.0, 3.01, 0.3)), 960, label="T7")

toolchange(8, 24000, "D1 ball: pencil at dome/wall crease")
pencil(ball(0.5), list(np.arange(-0.9, 0.91, 0.15)), 384, holder=(12.0, 10.0), label="T8")

toolchange(2, 24000, "D6 3FL flat: guide-pin holes")
holes()

toolchange(1, 18000, "D10 3FL flat: outer profile")
profile(5.25, [25, 20, 15, 10, 5, -0.2], label="rough")
profile(5.0, [15, -0.2], label="finish")

g("M5")
g("G0 Z150")
g("M30")

print("\n".join(out))
