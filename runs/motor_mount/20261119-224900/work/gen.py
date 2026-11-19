#!/usr/bin/env python3
"""Toolpath generator for motor_mount. Prints G-code to stdout."""
import math
import sys
from shapely.geometry import Point, Polygon, LineString, box
from shapely.geometry.polygon import orient

SAFE = 20.0
TOP = 16.0
QS = 64
out = []


def emit(s):
    out.append(s)


def f3(v):
    s = f"{v:.4f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


class M:
    x = 0.0
    y = 0.0
    z = 150.0


def g0(x=None, y=None, z=None):
    w = ["G0"]
    if x is not None: w.append("X" + f3(x)); M.x = x
    if y is not None: w.append("Y" + f3(y)); M.y = y
    if z is not None: w.append("Z" + f3(z)); M.z = z
    emit(" ".join(w))


def g1(x=None, y=None, z=None, f=None):
    w = ["G1"]
    if x is not None: w.append("X" + f3(x)); M.x = x
    if y is not None: w.append("Y" + f3(y)); M.y = y
    if z is not None: w.append("Z" + f3(z)); M.z = z
    if f is not None: w.append("F" + str(int(round(f))))
    emit(" ".join(w))


def arc(cw, x, y, i, j, z=None, f=None):
    w = ["G2" if cw else "G3", "X" + f3(x), "Y" + f3(y)]
    if z is not None: w.append("Z" + f3(z)); M.z = z
    w += ["I" + f3(i), "J" + f3(j)]
    if f is not None: w.append("F" + str(int(round(f))))
    M.x, M.y = x, y
    emit(" ".join(w))


def tool(n, rpm, comment):
    emit(f"( {comment} )")
    emit("M5")
    emit(f"T{n} M6")
    emit(f"G43 H{n}")
    emit(f"S{rpm} M3")
    M.z = 150.0
    g0(z=SAFE)


def retract():
    if M.z < SAFE:
        g0(z=SAFE)


# ---------------------------------------------------------------- circles
def circ_pocket(cx, cy, radii, z_prev, levels, F, Fr, pitch=1.0, first=True):
    """Inside-out concentric circles, helical entry on the innermost radius. CCW (climb)."""
    r0 = radii[0]
    if first:
        retract()
        g0(cx + r0, cy)
        g0(z=z_prev + 1.0)
        g1(z=z_prev, f=Fr)
    for z in levels:
        g1(cx + r0, cy, f=F)
        n = max(1, math.ceil((z_prev - z) / pitch - 1e-9))
        for k in range(1, n + 1):
            arc(False, cx + r0, cy, -r0, 0, z=z_prev - (z_prev - z) * k / n, f=Fr)
        arc(False, cx + r0, cy, -r0, 0, f=F)
        for r in radii[1:]:
            g1(cx + r, cy, f=F)
            arc(False, cx + r, cy, -r, 0)
        z_prev = z
    return z_prev


def circ_finish(cx, cy, r, rho, F, Fr):
    """At current Z: tangential arc lead-in onto circle r (CCW), full circle, arc lead-out, back to centre."""
    c = (cx + r - rho, cy)
    g1(c[0], cy - rho, f=F)
    arc(False, cx + r, cy, 0, rho, f=Fr)
    arc(False, cx + r, cy, -r, 0, f=F)
    arc(False, c[0], cy + rho, -rho, 0, f=Fr)
    g1(cx, cy, f=F)


# ---------------------------------------------------------------- rings (shapely)
def ring_pts(ring, ccw):
    pts = list(ring.coords)[:-1]
    # signed area
    a = sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
    if (a > 0) != ccw:
        pts = pts[::-1]
    return pts


def rotate_to(pts, p, insert=True):
    if insert:
        from shapely.geometry import LinearRing
        lr = LinearRing(pts)
        q = lr.interpolate(lr.project(Point(p)))
        # find segment containing q
        best, bi = 1e9, 0
        n = len(pts)
        for i in range(n):
            d = LineString([pts[i], pts[(i + 1) % n]]).distance(q)
            if d < best:
                best, bi = d, i
        qq = (q.x, q.y)
        if min(math.dist(qq, pts[bi]), math.dist(qq, pts[(bi + 1) % n])) > 1e-3:
            pts = pts[:bi + 1] + [qq] + pts[bi + 1:]
    k = min(range(len(pts)), key=lambda i: (pts[i][0] - p[0]) ** 2 + (pts[i][1] - p[1]) ** 2)
    return pts[k:] + pts[:k]


def comp_rings(comp, stepover, max_k=99):
    """Outside-in list of rings (point lists, closed implicitly). Exterior CCW, interiors CW."""
    rings = []
    k = 0
    cur = comp
    while not cur.is_empty and k < max_k:
        geoms = cur.geoms if hasattr(cur, "geoms") else [cur]
        lvl = []
        for g in geoms:
            if g.area < 1e-3:
                continue
            lvl.append(ring_pts(g.exterior, True))
            for it in g.interiors:
                lvl.append(ring_pts(it, False))
        rings.append(lvl)
        k += 1
        cur = comp.buffer(-stepover * k, quad_segs=QS)
    return rings


def lap(pts, F):
    for p in pts[1:]:
        g1(p[0], p[1], f=F)
    g1(pts[0][0], pts[0][1], f=F)


def ramp_lap(pts, z_from, z_to, F, Fr, angle_deg=3.0):
    """Ramp down along closed ring from z_from to z_to, then one full lap at z_to."""
    L = (z_from - z_to) / math.tan(math.radians(angle_deg))
    n = len(pts)
    seg = [math.dist(pts[i], pts[(i + 1) % n]) for i in range(n)]
    per = sum(seg)
    # ensure ramp is at least one lap if ring short: fine either way
    s = 0.0
    i = 0
    g1(pts[0][0], pts[0][1], z_from, f=Fr)
    while s < L - 1e-9:
        j = (i + 1) % n
        d = seg[i]
        if s + d >= L:
            t = (L - s) / d
            px = pts[i][0] + t * (pts[j][0] - pts[i][0])
            py = pts[i][1] + t * (pts[j][1] - pts[i][1])
            g1(px, py, z_to, f=Fr)
            k = j
            for _ in range(n):
                g1(pts[k][0], pts[k][1], f=F)
                k = (k + 1) % n
            g1(px, py, f=F)
            return
        s += d
        g1(pts[j][0], pts[j][1], z_from - (z_from - z_to) * s / L, f=Fr)
        i = j
    lap(rotate_to(pts, (M.x, M.y)), F)


def ring_pocket(levels, z_prev, stepover, F, Fr, max_k=99, approach=None):
    """levels: list of (z, region of tool centres). Nested regions assumed unless approach given
    (then the first entry rapids above `approach`, which must be in cleared air down to z_prev)."""
    for z, C0 in levels:
        comps = C0.geoms if hasattr(C0, "geoms") else [C0]
        for comp in comps:
            rings = comp_rings(comp, stepover, max_k)
            first = True
            for lvl in rings:
                todo = list(lvl)
                while todo:
                    cur = (M.x, M.y)
                    todo.sort(key=lambda r: min((p[0] - cur[0]) ** 2 + (p[1] - cur[1]) ** 2 for p in r))
                    r = todo.pop(0)
                    zz = z_prev if first else z
                    inside = abs(M.z - zz) < 1e-6 and \
                        LineString([cur, rotate_to(r, cur, False)[0]]).within(comp.buffer(0.02, quad_segs=QS))
                    r = rotate_to(r, cur if inside or approach is None else approach)
                    if inside and not first:
                        g1(r[0][0], r[0][1], f=F)
                        lap(r, F)
                    elif inside and first:
                        g1(r[0][0], r[0][1], f=F)
                        ramp_lap(r, z_prev, z, F, Fr)
                    else:
                        retract()
                        if approach is not None:
                            g0(*approach)
                            g0(z=z_prev + 0.5)
                            g1(z=z_prev, f=Fr)
                        else:
                            g0(r[0][0], r[0][1])
                            g0(z=z_prev + 0.5)
                        ramp_lap(r, z_prev, z, F, Fr)
                    first = False
        z_prev = z
    retract()
    return z_prev


def arc_lead_lap(pts, z, hint, rho, F, Fr, ztop):
    """Finish lap with tangential arc lead-in/out on the free (left) side of the travel direction."""
    retract()
    pts = rotate_to(pts, hint)
    p0, p1 = pts[0], pts[1]
    L = math.dist(p0, p1)
    tx, ty = (p1[0] - p0[0]) / L, (p1[1] - p0[1]) / L
    nx, ny = -ty, tx
    cx, cy = p0[0] + rho * nx, p0[1] + rho * ny
    sx, sy = cx - rho * tx, cy - rho * ty
    ex, ey = cx + rho * tx, cy + rho * ty
    g0(sx, sy)
    g0(z=ztop + 1.0)
    g1(z=z, f=F)
    arc(False, p0[0], p0[1], cx - sx, cy - sy, f=Fr)
    lap(pts, F)
    arc(False, ex, ey, cx - p0[0], cy - p0[1], f=Fr)
    retract()


def lead_lap(pts, z, lead, F, Fr, ztop):
    """Finish lap: rapid above lead point (in cleared air), feed down, line to ring, lap, back to lead."""
    retract()
    pts = rotate_to(pts, lead)
    g0(lead[0], lead[1])
    g0(z=ztop + 1.0)
    g1(z=z, f=F)
    g1(pts[0][0], pts[0][1], f=Fr)
    lap(pts, F)
    g1(lead[0], lead[1], f=F)
    retract()


# ---------------------------------------------------------------- rounded rect (outer)
def rrect_cw(hx, hy, R, z, F, lead_r=3.0, Fl=None):
    """CW rounded rect around corners (+-hx, +-hy) with radius R, tangential arc lead-in/out at left middle."""
    Fl = Fl or F
    x0 = -hx - R
    # lead-in arc: from (x0-lr, -lr) centre (x0-lr, 0) CCW to (x0, 0)
    lr = lead_r
    g1(x0 - lr, -lr, f=Fl)
    arc(False, x0, 0, 0, lr, f=Fl)
    g1(x0, hy, f=F)
    arc(True, -hx, hy + R, R, 0, f=F)
    g1(hx, hy + R, f=F)
    arc(True, hx + R, hy, 0, -R, f=F)
    g1(hx + R, -hy, f=F)
    arc(True, hx, -hy - R, -R, 0, f=F)
    g1(-hx, -hy - R, f=F)
    arc(True, -hx - R, -hy, 0, R, f=F)
    g1(x0, 0, f=F)
    arc(False, x0 - lr, lr, -lr, 0, f=Fl)


# ================================================================= program
emit("(motor_mount - AL6061 - stock 104x74x18 - G54 Z0 = part bottom)")
emit("G21 G90 G17 G94")
emit("G54")

# ---------------- T1
T1F, T1R = 3240, 1080
tool(1, 18000, "T1 D10 flat: face, D40 counterbore, D22 bore")
# facing
rows = 11
ys = [-33 + 66 * k / (rows - 1) for k in range(rows)]
for zf, F in ((16.3, T1F), (16.0, T1F)):
    retract()
    g0(-58, ys[0])
    g0(z=zf)
    for k, y in enumerate(ys):
        xa, xb = (-58, 58) if k % 2 == 0 else (58, -58)
        if k > 0:
            g1(xa, y, f=F)
        g1(xb, y, f=F)
retract()

CBX, CBY = -15.0, 0.0
zp = circ_pocket(CBX, CBY, [2.75, 6.75, 10.75, 14.75], TOP, [13.0, 10.2], T1F, T1R)
zp = circ_pocket(CBX, CBY, [3.0, 7.0, 11.0, 14.997], zp, [10.0], T1F, T1R, first=False)
# bore D22 (through)
g1(CBX + 1.75, CBY, f=T1F)
zp = circ_pocket(CBX, CBY, [1.75, 5.75], 10.0, [6.6, 3.2, -0.2], T1F, T1R, first=False)
circ_finish(CBX, CBY, 6.0, 2.5, T1F, T1R)
retract()

# ---------------- T2
T2F, T2R = 2880, 960
tool(2, 24000, "T2 D6 flat: rect pocket, slot, counterbores")
rect = box(18, -19, 42, -5).buffer(3, quad_segs=QS)
island = Point(30, -12).buffer(5, quad_segs=QS)
pocket_lo = rect.difference(island)
A2 = 0.25
C_hi = rect.buffer(-(3 + A2), quad_segs=QS)
C_lo = pocket_lo.buffer(-(3 + A2), quad_segs=QS)
ring_pocket([(14.5, C_hi), (13.0, C_hi), (10.6, C_lo), (8.2, C_lo), (8.0, C_lo)], TOP, 2.4, T2F, T2R)

slot = LineString([(21.5, 16), (38.5, 16)]).buffer(4, quad_segs=QS)
C_slot = slot.buffer(-(3 + A2), quad_segs=QS)
slot_levels = [16 - 2.7 * k for k in range(1, 6)] + [-0.2]
ring_pocket([(z, C_slot) for z in slot_levels], TOP, 2.4, T2F, T2R)
# slot finish, full depth
fin = ring_pts(slot.buffer(-3.0, quad_segs=QS).exterior, True)
arc_lead_lap(fin, -0.2, (30, 15), 0.9, T2F, T2R, TOP)

for (hx, hy) in ((-38, -25), (-38, 25), (8, 25), (8, -25)):
    retract()
    g0(hx + 2.25, hy)
    g0(z=TOP + 1)
    g1(z=TOP, f=T2R)
    n = 7
    for k in range(1, n + 1):
        arc(False, hx + 2.25, hy, -2.25, 0, z=TOP - (TOP - 9.5) * k / n, f=T2R)
    arc(False, hx + 2.25, hy, -2.25, 0, f=T2F)
    g1(hx, hy, f=T2F)
    circ_finish(hx, hy, 2.5, 1.2, T2F, T2R)
    retract()

# ---------------- T10 pre-drill the D6.6 through holes
tool(10, 8000, "T10 D5 drill: pre-drill D6.6 through holes")
holes = ((-38, -25), (-38, 25), (8, 25), (8, -25))
emit("G98 G83 X-38 Y-25 Z-0.4 R10.5 Q2.5 F960")
for hx, hy in holes[1:]:
    emit(f"X{hx} Y{hy}")
emit("G80")
M.z = SAFE

# ---------------- T3
T3F, T3R = 960, 320
tool(3, 24000, "T3 D3 flat: pocket rest + finish, D6.6 through holes")
C3 = pocket_lo.buffer(-1.65, quad_segs=QS)
ring_pocket([(z, C3) for z in (12.0, 11.0, 10.0, 9.0, 8.0)], 13.0, 1.0, T3F, T3R, max_k=1,
            approach=(18.0, -12.0))
wall = ring_pts(rect.buffer(-1.5, quad_segs=QS).exterior, True)
arc_lead_lap(wall, 8.0, (16.5, -12), 1.0, T3F, T3R, TOP)
isl = ring_pts(island.buffer(1.5, quad_segs=QS).exterior, False)
arc_lead_lap(isl, 8.0, (23.5, -12), 1.0, T3F, T3R, TOP)

for (hx, hy) in ((-38, -25), (-38, 25), (8, 25), (8, -25)):
    retract()
    g0(hx + 1.65, hy)
    g0(z=10.5)
    g1(z=9.5, f=T3R)
    n = 10
    for k in range(1, n + 1):
        arc(False, hx + 1.65, hy, -1.65, 0, z=9.5 - 9.7 * k / n, f=480)
    arc(False, hx + 1.65, hy, -1.65, 0, f=T3F)
    g1(hx, hy, f=T3F)
    circ_finish(hx, hy, 1.795, 0.9, T3F, T3R)
    retract()

# ---------------- T1 outer profile
tool(1, 18000, "T1 D10 flat: outer profile")
for z, off in ((10.6, 5.25), (5.2, 5.25), (-0.2, 5.25), (-0.2, 5.0)):
    retract()
    x0 = -42 - 8 - off
    g0(x0 - 3, -3)
    g0(z=z)
    rrect_cw(42, 27, 8 + off, z, T1F, Fl=T1R if off == 5.0 else T1F)
retract()

# ---------------- T9 chamfer
tool(9, 24000, "T9 chamfer mill: 1x45 outer top edge")
zt, off = 14.5, 0.6
x0 = -42 - 8 - off
g0(x0 - 3, -3)
g0(z=zt)
rrect_cw(42, 27, 8 + off, zt, 960)
retract()

emit("M5")
emit("G0 Z150")
emit("M30")
print("\n".join(out))
