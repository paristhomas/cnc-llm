#!/usr/bin/env python3
"""Heatsink toolpath generator (own CAM). Prints G-code to stdout."""
import json, math, os, sys
import numpy as np
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
BRIEF = os.path.join(HERE, "..", "brief")

SAFE = 26.0
STOCK_TOP = 24.0
FINS = [-27.0 + 9 * k for k in range(7)]
GAPS = [-22.5 + 9 * k for k in range(6)]
FIN_HALF = 1.25

out = []
def g(s): out.append(s)
def f3(v): return f"{v:.3f}".rstrip("0").rstrip(".") if abs(v) > 1e-9 else "0"

def crown(x):
    return -38.0 + math.sqrt(3600.0 - x * x)

def toolchange(t, rpm, name):
    g("M5")
    g(f"T{t} M6 ({name})")
    g(f"G43 H{t}")
    g(f"S{rpm} M3")

def approach(x, y, z, fplunge):
    """Go to x,y above, then down to z. Caller guarantees (x,y) column is air down to z."""
    g(f"G0 Z{f3(SAFE)}")
    g(f"G0 X{f3(x)} Y{f3(y)}")
    g(f"G0 Z{f3(z + 1.0)}")
    g(f"G1 Z{f3(z)} F{fplunge}")

def retract():
    g(f"G0 Z{f3(SAFE)}")

# ---------------------------------------------------------------- T1 roughing
def rough_T1():
    meta = json.load(open(os.path.join(BRIEF, "target_height.json")))
    H = np.load(os.path.join(BRIEF, "target_height.npy"))
    res = meta["res"]; x0 = meta["x0"]; y0 = meta["y0"]
    b = 5  # 0.25 mm cells
    ny, nx = (H.shape[0] // b) * b, (H.shape[1] // b) * b
    Hc = H[:ny, :nx].reshape(ny // b, b, nx // b, b).max(axis=(1, 3))
    cr = res * b
    pad = int(round(10.0 / cr))
    Hc = np.pad(Hc, pad, constant_values=0.0)
    gx0 = x0 - pad * cr + cr / 2  # x of column 0 centre
    gy0 = y0 - pad * cr + cr / 2
    R = 5.0 + 0.3 + cr  # tool radius + radial allowance + one cell
    n = int(math.ceil(R / cr))
    yy, xx = np.mgrid[-n:n + 1, -n:n + 1]
    fp = (xx * xx + yy * yy) * cr * cr <= R * R
    D = ndimage.maximum_filter(Hc + 0.3, footprint=fp, mode="constant", cval=0.3)

    def dline(x, ys):
        j = (x - gx0) / cr
        j0 = int(math.floor(j)); j1 = j0 + 1
        i = np.round((ys - gy0) / cr).astype(int)
        col = np.maximum(D[i, j0], D[i, j1])
        # conservative along y: neighbours
        c = col.copy()
        c[1:] = np.maximum(c[1:], col[:-1]); c[:-1] = np.maximum(c[:-1], col[1:])
        return c

    XL = 45.6
    nlines = int(math.ceil(2 * XL / 4.0))
    xs = np.linspace(-XL, XL, nlines + 1)
    dy = 0.25
    ys = np.arange(-38.0, 38.0 + 1e-9, dy)
    dl = [dline(x, ys) for x in xs]
    prev = [np.full_like(ys, STOCK_TOP) for _ in xs]
    levels = [22.0, 20.0, 18.0, 16.0, 14.0, 12.0, 10.0, 8.0, 6.3, 4.3, 2.3, 0.3]
    k = math.tan(math.radians(15))
    F, FP = 2900, 1000
    toolchange(1, 18000, "D10 flat - roughing")
    # start
    g(f"G0 X{f3(xs[0])} Y{f3(ys[0])}")
    g(f"G0 Z{f3(levels[0] + 1)}")
    g(f"G1 Z{f3(levels[0])} F{FP}")
    cur_y_end = 0  # 0 -> at ys[0] side
    order = list(range(len(xs)))
    first = True
    for li, L in enumerate(levels):
        if not first:
            g(f"G1 Z{f3(L)} F{FP}")
        first = False
        # material top estimate for each line: max of prev over neighbour lines and +-5 mm window
        newprev = [p.copy() for p in prev]
        for idx in order:
            # direction: start from the side where the tool currently is
            fwd = (cur_y_end == 0)
            z = np.maximum(L, dl[idx])
            lo, hi = max(0, idx - 1), min(len(xs), idx + 2)
            M = np.max(np.stack(prev[lo:hi]), axis=0)
            M = ndimage.maximum_filter1d(M, size=41)
            zz = z if fwd else z[::-1]
            Mm = M if fwd else M[::-1]
            zz = zz.copy()
            for i in range(1, len(zz)):
                zz[i] = max(zz[i], min(zz[i - 1], Mm[i]) - k * dy)
            zpath = zz if fwd else zz[::-1]
            if np.all(zpath >= prev[idx] - 0.02):
                continue  # nothing to cut on this line
            newprev[idx] = np.minimum(prev[idx], zpath)
            yseq = ys if fwd else ys[::-1]
            # move to line start (at end side, in air outside the stock)
            g(f"G1 X{f3(xs[idx])} Y{f3(yseq[0])} F{F}")
            # air (tool above every nearby material) -> faster feed
            air = zz >= Mm - 0.01
            curF = F
            for i in range(1, len(yseq)):
                seg_air = air[i] and air[i - 1]
                fe = 5000 if seg_air else F
                keep = (i == len(yseq) - 1) or abs(zz[i] - zz[i - 1]) > 1e-6 or abs(zz[i + 1] - zz[i]) > 1e-6
                nxt_air = (i + 1 < len(yseq)) and air[i] and air[i + 1]
                if (5000 if nxt_air else F) != fe:
                    keep = True
                if keep:
                    fs = f" F{fe}" if fe != curF else ""
                    curF = fe
                    g(f"G1 Y{f3(yseq[i])} Z{f3(zz[i])}{fs}")
            if curF != F:
                g(f"G1 F{F}")
            cur_y_end = 1 - cur_y_end
        prev = newprev
        order = order[::-1]
    retract()

# ------------------------------------------------------------- T1 floor rings
def ring(d, F):
    """CW loop around fin block offset d, starting/ending at (-31.25-d, 0)."""
    xa, ya = 31.25, 22.0
    x = -xa - d
    g(f"G1 X{f3(x)} Y{f3(ya)} F{F}")
    g(f"G2 X{f3(-xa)} Y{f3(ya + d)} I{f3(d)} J0")
    g(f"G1 X{f3(xa)}")
    g(f"G2 X{f3(xa + d)} Y{f3(ya)} I0 J{f3(-d)}")
    g(f"G1 Y{f3(-ya)}")
    g(f"G2 X{f3(xa)} Y{f3(-ya - d)} I{f3(-d)} J0")
    g(f"G1 X{f3(-xa)}")
    g(f"G2 X{f3(-xa - d)} Y{f3(-ya)} I0 J{f3(d)}")
    g(f"G1 Y2")

def floor_T1():
    g("(T1 floor finish Z6 + fin end faces)")
    approach(-50.0, 0.0, 6.0, 1000)
    g(f"G1 X{f3(-40.25)} F2500")
    ring(9.0, 2500)
    g(f"G1 X{f3(-36.25)}")
    ring(5.0, 2500)
    g("G1 X-50")
    retract()

# ------------------------------------------------------------- T2 gaps
def gaps_T2():
    toolchange(2, 24000, "D6 flat - gap slots and walls")
    F, FP = 2300, 800
    for xg in GAPS:
        top = max(crown(x) for x in np.linspace(xg - 8, xg + 8, 161)) + 0.3
        lv = []
        z = top - 2.0
        while z > 8.2 + 0.3:
            lv.append(z); z -= 2.0
        lv.append(8.2)
        y = -28.0
        approach(xg, y, lv[0], FP)
        for i, L in enumerate(lv):
            if i:
                g(f"G1 Z{f3(L)} F{FP}")
            y = -y
            g(f"G1 Y{f3(y)} F{F}")
        retract()
    # walls (climb): right wall of a gap (material +x) travel +y; left wall travel -y
    Fw = 2400
    g("(T2 walls to size, Z9)")
    for xg in GAPS:
        approach(xg + 0.25, -28.0, 9.0, FP)
        g(f"G1 Y28 F{Fw}")
        g(f"G1 X{f3(xg - 0.25)}")
        g("G1 Y-28")
        retract()
    # outer walls of end fins: x=-28.25 (material +x, travel +y), x=+28.25 (material -x, travel -y)
    for c in (-31.5, -31.25):
        approach(c, -28.0, 9.0, FP)
        g(f"G1 Y28 F{Fw}")
        retract()
    for c in (31.5, 31.25):
        approach(c, 28.0, 9.0, FP)
        g(f"G1 Y-28 F{Fw}")
        retract()

# ------------------------------------------------------------- T6 ball
def ball_tip(xc):
    best = -1e9
    for xf in FINS:
        lo, hi = max(xf - FIN_HALF, xc - 3.0), min(xf + FIN_HALF, xc + 3.0)
        if lo > hi:
            continue
        for x in np.linspace(lo, hi, 301):
            u = x - xc
            z = crown(x) - (3.0 - math.sqrt(max(0.0, 9.0 - u * u)))
            best = max(best, z)
    return best

def ball_T6():
    toolchange(6, 24000, "D6 ball - fillets and crown")
    F, FP = 1400, 600
    # fillet / floor-strip passes, tip Z6 ; links at y=+-27 lifted to Z7
    passes = []
    for xg in GAPS:
        passes.append((xg, 7.0))
    for xg in GAPS:
        passes.append((xg - 0.22, 6.0))
        passes.append((xg + 0.22, 6.0))
    passes.append((-31.28, 6.0))
    passes.append((31.28, 6.0))
    passes.sort(key=lambda p: (p[1] < 6.5, p[0]))  # pre-passes first, then left to right
    y = -27.0
    approach(passes[0][0], y, passes[0][1], FP)
    for i, (x, z) in enumerate(passes):
        if i:
            g(f"G1 Z7.5 F{FP}")
            g(f"G0 X{f3(x)}")
            g(f"G1 Z{f3(z)} F{FP}")
        y = -y
        g(f"G1 Y{f3(y)} F{F}")
    retract()
    # crown: per fin, Y lines, high side first
    g("(T6 crown finish)")
    y = -25.5
    firstline = True
    for xf in FINS:
        # low-side edge: ball contact sits 3*sin(theta) inboard of the centre -> extend centres outboard
        if xf == 0:
            xsl = list(np.linspace(-FIN_HALF, FIN_HALF, 6))
        else:
            sgn = 1.0 if xf > 0 else -1.0
            xe = xf + sgn * FIN_HALF
            sl = abs(xe) / math.sqrt(3600 - xe * xe)
            ext = 3.0 * sl / math.sqrt(1 + sl * sl) + 0.1
            x_hi, x_lo = xf - sgn * FIN_HALF, xe + sgn * ext
            n = int(math.ceil(abs(x_lo - x_hi) / 0.5)) + 1
            xsl = list(np.linspace(x_hi, x_lo, n))
        if False:
            xsl = xsl[::-1]
        for x in xsl:
            z = ball_tip(x)
            if firstline:
                approach(x, y, z, FP)
                firstline = False
            else:
                g(f"G1 X{f3(x)} Z{f3(z)} F{F}")
            y = -y
            g(f"G1 Y{f3(y)} F{F}")
    retract()

# ------------------------------------------------------------- T3 holes
def holes_T3():
    toolchange(3, 24000, "D3 flat - helical holes")
    for hx in (-34.0, 34.0):
        r = 1.15
        approach(hx + r, 0.0, 6.3, 400)
        z = 6.3
        while z > -0.2 + 1e-6:
            z = max(-0.2, z - 0.5)
            g(f"G3 X{f3(hx + r)} Y0 Z{f3(z)} I{f3(-r)} J0 F800")
        g(f"G3 X{f3(hx + r)} Y0 I{f3(-r)} J0")
        g(f"G1 X{f3(hx)} F800")
        r = 1.25
        g(f"G1 X{f3(hx + r)} F400")
        g(f"G3 X{f3(hx + r)} Y0 I{f3(-r)} J0 F900")
        g(f"G1 X{f3(hx)}")
        retract()

# ------------------------------------------------------------- T1 profile
def profile_loop(d):
    a, b = 40.0, 30.0
    g(f"G1 X{f3(-a - d)} Y{f3(-40)} F2500")
    g(f"G1 Y{f3(b)}")
    g(f"G2 X{f3(-a)} Y{f3(b + d)} I{f3(d)} J0")
    g(f"G1 X{f3(a)}")
    g(f"G2 X{f3(a + d)} Y{f3(b)} I0 J{f3(-d)}")
    g(f"G1 Y{f3(-b)}")
    g(f"G2 X{f3(a)} Y{f3(-b - d)} I{f3(-d)} J0")
    g(f"G1 X{f3(-a)}")
    g(f"G2 X{f3(-a - d)} Y{f3(-b)} I0 J{f3(d)}")
    g("G1 Y-20")
    g("G1 X-52")
    g("G1 Y-40")

def profile_T1():
    toolchange(1, 18000, "D10 flat - outer profile")
    approach(-52.0, -40.0, -0.2, 800)
    profile_loop(5.1)
    profile_loop(5.0)
    retract()

def main():
    g("%")
    g("(heatsink - AL6061 - own CAM)")
    g("G21 G90 G17 G94")
    g("G54")
    rough_T1()
    floor_T1()
    gaps_T2()
    ball_T6()
    holes_T3()
    profile_T1()
    g("M5")
    g("M30")
    g("%")
    print("\n".join(out))

if __name__ == "__main__":
    main()
