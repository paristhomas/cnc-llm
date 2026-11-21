from common import *
###########################################################################################
# SETUP 1 : tool from -X (complex side: body, blocks, ears, pockets, flange underside)
###########################################################################################
F1 = Frame(-90, 90, 0, (-SX, 0, 0))          # frame x=-Y, y=+Z, z=-X ; stock face X=-SX at z=0
fz = lambda X: -SX - X                        # G54 X -> frame z
log('grid -X')
G1 = Grid(F1, TRI, STUB, (-88, 88), (-8, 108), 0.05, holder_tris_g=HOLD)
fl1 = floors_of(G1)
log('floors -X (frame z):', [round(v, 3) for v in fl1])
M1 = Material(G1, 0.0, poly=stock_poly(F1))
GC1 = coarse(G1, 4)
setup('1: tool from -X (A90) - complex side', F1)
ZS = 5.0
# --- T1 rough
tool(1, 'D10 flat rough')
lk = Linker(P, M1, ZS, 5.0, feed(1), feed(1, 0.35), D=10)
zb1 = fz(7.5)
lv = sorted(set([round(v, 3) for v in list(np.arange(-6, zb1, -6.0)) + [zb1] + [f + 0.3 for f in fl1 if f + 0.3 > zb1]]), reverse=True)
log('T1 levels', lv)
rough(P, GC1, M1, lk, 5.0, lv, 0.3, 4.5, log=LOG, holder=(40, 16))
P.g0(z=ZS)
log('T1 done lines', len(P.L))
# --- T2 rest rough
tool(2, 'D6 flat rest rough')
lk = Linker(P, M1, ZS, 3.0, feed(2), feed(2, 0.35), D=6)
lv2 = sorted(set([round(v, 3) for v in list(np.arange(-3, zb1, -3.0)) + [zb1] + [f + 0.25 for f in fl1 if f + 0.25 > zb1]]), reverse=True)
rough(P, GC1, M1, lk, 3.0, lv2, 0.25, 2.4, log=LOG, holder=(30, 16))
P.g0(z=ZS)
log('T2 rest done lines', len(P.L))
# --- T3 rest rough (slots, narrow areas), extra levels in the arch range
tool(3, 'D3 flat rest rough')
lk = Linker(P, M1, ZS, 1.5, feed(3), feed(3, 0.35), D=3)
GC1b = coarse(G1, 2)
arch = list(np.arange(fz(-5.94), fz(-3.44) - 0.01, -0.4))
lv3 = sorted(set([round(v, 3) for v in list(np.arange(-1.5, zb1, -1.5)) + [zb1] + arch + [f + 0.15 for f in fl1 if f + 0.15 > zb1]]), reverse=True)
lv3 = [z for z in lv3 if z >= -20.5]
rough(P, GC1b, M1, lk, 1.5, lv3, 0.25, 1.2, log=LOG, holder=(22, 16), rest_R=(3.0, 0.25))
P.g0(z=ZS)
log('T3 rest done lines', len(P.L))
# --- finishing levels
fine1 = fine_levels([(fz(0.07), fz(-1.94)), (fz(4.31), fz(3.31)), (fz(7.06), fz(6.06))], 0.07)
ear = fine_levels([(fz(-0.94), fz(-13.06))], 0.35)
lev1 = merge_levels(fl1, fine1 + ear, top=-0.5)
lev1 = [z for z in lev1 if z >= fz(7.06) - 0.01]
log('finish levels -X', len(lev1))
tool(2, 'D6 flat finish')
lk = Linker(P, M1, ZS, 3.0, feed(2), feed(2, 0.35), D=6)
FULL1 = [lev1[-1]] + [z for z in lev1 if any(abs(z - t) < 0.002 for t in (fz(-1.94), fz(3.31), fz(6.06), fz(-0.94) + 0.0005))]
log('full levels', FULL1)
finish(P, G1, lk, 3.0, lev1, 2.7, log=LOG, full_levels=FULL1, holder=(30, 16))
P.g0(z=ZS)
log('T2 finish done lines', len(P.L))
tool(3, 'D3 flat finish rest')
lk = Linker(P, M1, ZS, 1.5, feed(3), feed(3, 0.35), D=3)
finish(P, G1, lk, 1.5, [z for z in lev1 if z >= -20.5], 1.3, rest_of=3.0, log=LOG, full_levels=FULL1, holder=(22, 16))
P.g0(z=ZS)
log('T3 finish done lines', len(P.L))
# --- T7 ball: arch roofs of the two block slots (concave cylinder r2.5, axis G54 Y, centre X=-5.9396 Z=50)
tool(7, 'D3 ball arch roof')
FB = feed(7)
xa, za, ra, rb = -5.9396, 50.0, 2.5, 1.5
for (y0, y1) in [(-17.0, 13.0), (23.0, 53.0)]:
    phis = np.radians(np.linspace(-90, 90, 31))
    ys = [y0 - 2.0, y1 + 2.0]
    P.g0(z=ZS)
    first = True
    for k, ph in enumerate(phis):
        cxg = xa + (ra - rb) * math.cos(ph); czg = za + (ra - rb) * math.sin(ph)
        tipz = fz(cxg + rb)
        yy = ys if k % 2 == 0 else ys[::-1]
        # frame x = -Y
        if first:
            P.g0(-yy[0], czg); P.g0(z=fz(-10.94) + 1.0); P.g1(-yy[0], czg, tipz, int(FB / 3)); first = False
        else:
            P.g1(-yy[0], czg, tipz, FB)
        P.g1(-yy[1], czg, tipz, FB)
    P.g0(z=fz(-10.94) + 1.0); P.g0(z=ZS)
log('T7 arch done')
# --- T8: D1.33 blind holes in the blocks (axis X), as deep as the 3 mm flute allows
tool(8, 'D1 ball small holes')
LK = Linker(P, M1, ZS, 0.5, feed(8), feed(8, 0.35), D=1)
h8 = holes(0.665, 0)
log('r0.665 holes', len(h8))
for h in sorted(h8, key=lambda h: (h['z'], h['y'])):
    ztop = fz(h['x0']); zbot = ztop - 4.9
    helix(LK, -h['y'], h['z'], ztop, zbot, 0.165, 8, 0.05)
P.g0(z=ZS)
# --- T4: flange through holes, second half from the underside; blind holes r1.21
tool(4, 'D1.5 flat holes')
LK = Linker(P, M1, ZS, 0.75, feed(4), feed(4, 0.35), D=1.5)
h14 = [h for h in holes(1.4, 0)]
log('r1.4 holes', len(h14))
for h in sorted([h for h in h14 if h['z'] >= 11.5], key=lambda h: math.atan2(h['z'] - 50, -h['y'])):
    ztop = fz(7.06); zbot = fz(9.86)
    helix(LK, -h['y'], h['z'], ztop, zbot, 0.65, 4, 0.15)
h121 = holes(1.21, 0)
log('r1.21 holes', len(h121), [(round(h['y'], 2), round(h['z'], 2), round(h['x0'], 2), round(h['x1'], 2)) for h in h121])
for h in [h for h in h121 if h['z'] >= 11.5]:
    ztop = fz(7.06); zbot = fz(h['x1'])
    helix(LK, -h['y'], h['z'], ztop, zbot, 1.21 - 0.75, 4, 0.15)
P.g0(z=ZS)
log('setup 1 lines', len(P.L))

save_stage('s1', dict(h14=h14))
log('saved s1')
