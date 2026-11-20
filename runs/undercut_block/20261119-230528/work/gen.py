#!/usr/bin/env python3
"""Toolpath generator for undercut_block. Prints G-code to program.nc next to this file."""
import math, os

T5 = math.tan(math.radians(5.0))
SAFE = 35.0
out = []


def e(s):
    out.append(s)


def f(v):
    s = f"{v:.4f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def g0(x=None, y=None, z=None):
    e("G0" + "".join(f" {a}{f(v)}" for a, v in (("X", x), ("Y", y), ("Z", z)) if v is not None))


def g1(x=None, y=None, z=None, F=None):
    s = "G1" + "".join(f" {a}{f(v)}" for a, v in (("X", x), ("Y", y), ("Z", z)) if v is not None)
    if F:
        s += f" F{int(F)}"
    e(s)


def tool(n, rpm, comment):
    e(f"( {comment} )")
    e("M5")
    e(f"T{n} M6")
    e(f"G43 H{n}")
    e(f"S{rpm} M3")


def w(z):      # half-width (Y) of drafted pocket at height z
    return 7.0 - (30.0 - z) * T5


def xa(z):     # pocket -X end wall
    return 10.0 + (30.0 - z) * T5


def xb(z):     # pocket +X end wall
    return 34.0 - (30.0 - z) * T5


def profile_loop(d, z, F):
    """Outside contour, climb (CW), offset d from the 80x50 rectangle, entering from (-50,0)."""
    g1(-40 - d, 0, None, F)
    g1(-40 - d, 25)
    e(f"G2 X-40 Y{f(25 + d)} I{f(d)} J0")
    g1(40, 25 + d)
    e(f"G2 X{f(40 + d)} Y25 I0 J{f(-d)}")
    g1(40 + d, -25)
    e(f"G2 X40 Y{f(-25 - d)} I{f(-d)} J0")
    g1(-40, -25 - d)
    e(f"G2 X{f(-40 - d)} Y-25 I0 J{f(d)}")
    g1(-40 - d, 0)
    g1(-50, 0)


e("%")
e("( undercut_block - AL6061 - stock 84x54x32, Z0 = part bottom on vacuum plate )")
e("G21 G90 G17 G94")
e("G54")

# ---------------------------------------------------------------- T1 D10 flat
F1 = 3240   # 0.06 x 3 x 18000
F1S = 2160  # full-width slotting 0.04 mm/t
F1P = 1000
tool(1, 18000, "T1 10mm flat: face, rough, finish prismatic features")
g0(-49, -27)
g0(z=SAFE)
for zf in (31.0, 30.0):
    g0(z=zf + 1.0)
    g1(z=zf, F=F1P)
    ys = [-27 + 6 * k for k in range(10)]
    for k, y in enumerate(ys):
        x0, x1 = (-49, 49) if k % 2 == 0 else (49, -49)
        g1(x0, y, None, F1)
        g1(x1, y)
    g1(-49, 27)
    g0(z=SAFE)
    g0(-49, -27)

# outer profile rough, offset 5.25
e("( outer profile rough )")
g0(-50, 0)
for zl in (22.0, 14.0, 6.0, -0.3):
    g1(z=zl, F=F1P)
    profile_loop(5.25, zl, F1)
g0(z=SAFE)

# Y-slot rough X-36..-20, floor 22
e("( Y slot rough )")
g0(-28, -33)
g0(z=31)
dirn = 1
for zl in (28.0, 26.0, 24.0, 22.25):
    for k, (x, F) in enumerate(((-28, F1S), (-25.25, F1), (-30.75, F1))):
        ya, yb = (-33, 33) if dirn > 0 else (33, -33)
        g1(x, ya, None, F1)
        if k == 0:
            g1(z=zl, F=F1P)
        g1(x, yb, None, F)
        dirn = -dirn
g0(z=SAFE)

# neck rough Y+-6, floor 21.01
e("( T-slot neck rough )")
g0(-47, 0)
g0(z=31)
dirn = 1
for zl in (27.75, 25.5, 23.25, 21.26):
    for k, (y, F) in enumerate(((0, F1S), (0.75, F1), (-0.75, F1))):
        xa_, xb_ = (-47, 47) if dirn > 0 else (47, -47)
        g1(xa_, y, None, F1)
        if k == 0:
            g1(z=zl, F=F1P)
        g1(xb_, y, None, F)
        dirn = -dirn
g0(z=SAFE)

# pocket opening into the T-slot head, Z21 -> 15 (rect X10.787..33.213 Y+-6.212 at Z21)
e("( pocket opening rough by ramping )")
OX0, OX1, OY = xa(21.0), xb(21.0), w(21.0)
rx0, rx1, ry = OX0 + 5.25, OX1 - 5.25, OY - 5.25
g0(rx0, 0)
g0(z=23.0)
g1(z=21.26, F=F1P)
z = 21.26
side = 0
while z > 15.25 + 1e-9:
    z = max(z - 0.75, 15.25)
    side ^= 1
    g1(rx1 if side else rx0, 0, z, F1P)
g1(rx0 if side else rx1, 0, None, F1S)
g1(rx0, 0)
g1(rx0, -ry, None, F1)
g1(rx1, -ry)
g1(rx1, ry)
g1(rx0, ry)
g1(rx0, 0)
g0(z=SAFE)

# finish Y-slot floor+walls at Z22
e("( Y slot finish )")
g0(-28, -33)
g0(z=24)
g1(z=22.0, F=F1P)
g1(-28, 33, None, F1)
g1(-31, 33)
g1(-31, -33)
g1(-25, -33)
g1(-25, 33)
g0(z=SAFE)

# finish neck floor+walls at Z21.01
e("( T-slot neck finish )")
g0(-47, 0)
g0(z=23)
g1(z=21.01, F=F1P)
g1(47, 0, None, F1)
g1(47, 1)
g1(-47, 1)
g1(-47, -1)
g1(47, -1)
g0(z=SAFE)

# finish opening floor Z15
e("( pocket opening floor finish Z15 )")
fx0, fx1, fy = OX0 + 5, OX1 - 5, OY - 5
g0(fx0 + 0.5, 0)
g0(z=22.5)
g1(fx0 + 0.5, 0, 16.0, F1P)
g1(fx0, 0, 15.0)
g1(fx1, 0, None, F1)
g1(fx1, fy)
g1(fx0, fy)
g1(fx0, -fy)
g1(fx1, -fy)
g1(fx1, 0)
g0(z=SAFE)

# outer profile finish: upper (tip Z5, offset 5.00) and lower (tip -0.3, offset 5.01)
e("( outer profile finish )")
g0(-50, 0)
g0(z=8)
g1(z=5.0, F=F1P)
profile_loop(5.0, 5.0, F1)
g1(z=-0.3, F=F1P)
profile_loop(5.01, -0.3, F1)
g0(z=SAFE)

# ---------------------------------------------------------------- T10 drill
HOLES = [(8, -18), (34, -18), (34, 18), (8, 18)]
tool(10, 8000, "T10 5mm drill: pre-drill M6 clearance holes")
g0(HOLES[0][0], HOLES[0][1])
g0(z=SAFE)
e(f"G98 G83 X{HOLES[0][0]} Y{HOLES[0][1]} Z0.2 R31 Q3 F960")
for hx, hy in HOLES[1:]:
    e(f"X{hx} Y{hy}")
e("G80")
g0(z=SAFE)

# ---------------------------------------------------------------- T2 D6 flat
F2 = 2880
tool(2, 24000, "T2 6mm flat: drafted pocket walls semi-finish, bore D6.4 holes")
e("( drafted pocket walls semi-finish, 0.15 left )")
R, A = 3.0, 0.15
levels = [29.0, 28.0, 27.0, 26.0, 25.0, 24.0, 23.0, 22.0, 21.1]
first = True
for zl in levels:
    cy = w(zl) - R - A
    dy = 6.0 - cy
    dx = math.sqrt(R * R - dy * dy) if dy < R else 0.0
    cx0 = xa(zl) + A + dx
    cx1 = xb(zl) - A - dx
    if first:
        g0(cx1, 0)
        g0(z=31)
        first = False
    g1(cx1, 0, None, F2)
    g1(z=zl, F=1000)
    g1(cx1, cy, None, F2)
    g1(cx0, cy)
    g1(cx0, -cy)
    g1(cx1, -cy)
    g1(cx1, 0)
g0(z=SAFE)

e("( D6.4 holes: helical r0.2 after drill; centre feed 200 = ~0.045 mm/t at the wall )")
for hx, hy in HOLES:
    g0(hx + 0.2, hy)
    g0(z=31)
    g1(z=30.2, F=500)
    zc = 30.2
    r = 0.2
    while zc > 0.05 + 1e-9:
        if r == 0.2 and zc <= 12.2 + 1e-9:
            g1(hx + 0.19, hy, None, 200)
            r = 0.19
        zn = max(zc - 1.0, 0.05)
        if r == 0.2 and zn < 12.2:
            zn = 12.2
        e(f"G3 X{f(hx + r)} Y{f(hy)} Z{f(zn)} I{f(-r)} J0 F200")
        zc = zn
    e(f"G3 X{f(hx + r)} Y{f(hy)} I{f(-r)} J0")
    g1(hx, hy)
    g0(z=SAFE)

# ---------------------------------------------------------------- T3 D3 flat
tool(3, 24000, "T3 3mm flat: corners of the pocket opening floor Z15")
cx0, cx1, cy = OX0 + 1.5, OX1 - 1.5, OY - 1.5
g0(cx1, 0)
g0(z=23)
for zl in (19.0, 17.0, 15.0):
    g1(z=zl, F=320)
    g1(cx1, cy, None, 960)
    g1(cx0, cy)
    g1(cx0, -cy)
    g1(cx1, -cy)
    g1(cx1, 0)
g0(z=SAFE)

# ---------------------------------------------------------------- T4 D1.5 flat
tool(4, 24000, "T4 1.5mm flat: drafted pocket walls finish, 0.4 mm z-steps")
R = 0.75
YN = 6.0 - R   # in the neck (air)
levels = []
zl = 29.8
while zl > 21.02:
    levels.append(zl)
    zl -= 0.4
levels.append(21.02)
first = True
for zl in levels:
    a, b, ww = xa(zl) + R, xb(zl) - R, w(zl) - R
    if first:
        g0(b, -YN)
        g0(z=31)
        first = False
    g1(b, -YN, None, 480)
    g1(z=zl, F=160)
    g1(b, YN, None, 480)
    g1(b, ww)
    g1(a, ww)
    g1(a, YN)
    g1(a, -YN)
    g1(a, -ww)
    g1(b, -ww)
    g1(b, -YN)
g0(z=SAFE)

# ---------------------------------------------------------------- T8 D1 ball
tool(8, 24000, "T8 1mm ball: sharp corners of the drafted pocket, 0.2 mm z-steps")
d = 0.5 / math.cos(math.radians(5.0))
for x0f, sx in ((xa, 1), (xb, -1)):
    for sy in (1, -1):
        first = True
        zt = 29.6
        while zt > 20.99:
            zc = zt + 0.5
            cx = x0f(zc) + sx * d
            cy = sy * (w(zc) - d)
            if first:
                g0(cx, sy * 5.3)
                g0(z=31)
                first = False
            g1(cx, sy * 5.3, None, 384)
            g1(z=zt, F=130)
            g1(cx, cy, None, 384)
            g1(cx + sx * 0.6, cy)
            g1(cx + sx * 0.6, sy * 5.3)
            zt = round(zt - 0.2, 4)
        g0(z=SAFE)

# ---------------------------------------------------------------- T6 D6 ball
tool(6, 24000, "T6 6mm ball: R3 top round-overs, waterline passes")
first = True
for deg in range(10, 91, 10):
    th = math.radians(deg)
    c = 6 * math.cos(th)
    zt = 24 + 6 * math.sin(th)
    if first:
        g0(-45, 22 + c)
        g0(z=zt + 1)
        g1(z=zt, F=500)
        first = False
    else:
        g1(-45, 22 + c, zt, 1440)
    g1(45, 22 + c, None, 1440)
    g1(45, 29)
    g1(37 + c, 29)
    g1(37 + c, -29)
    g1(45, -29)
    g1(45, -22 - c)
    g1(-45, -22 - c)
    g1(-45, -29)
    g1(-37 - c, -29)
    g1(-37 - c, 29)
    g1(-45, 29)
g0(z=SAFE)

# ---------------------------------------------------------------- T9 chamfer
tool(9, 24000, "T9 90deg chamfer mill: D12 countersinks")
for hx, hy in HOLES:
    g0(hx, hy)
    g0(z=31)
    for zt in (28.2, 27.2):
        rp = zt - 24.1
        g1(z=zt, F=300)
        g1(hx + rp, hy, None, 300)
        e(f"G3 X{f(hx + rp)} Y{f(hy)} I{f(-rp)} J0 F600")
        g1(hx, hy)
    g0(z=SAFE)

e("M5")
g0(0, 0)
e("M30")
e("%")

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "program.nc"), "w") as fh:
    fh.write("\n".join(out) + "\n")
print(len(out), "lines")
