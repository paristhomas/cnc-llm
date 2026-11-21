# CTC-04 x0.2 - 3+2 program generator (own code; numpy/scipy/shapely/trimesh only)
import sys, json, math, time
W = '/home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/work'
sys.path.insert(0, W)
import numpy as np, trimesh
from cam import Frame, Grid, Material, Prog, box_tris, coarse, raster_max, resample
from strat import Linker, rough, finish, floors_of

B = '/home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/brief/'
T0 = time.time()
def log(*a):
    print('[%6.1fs]' % (time.time() - T0), *a, flush=True)

mesh = trimesh.load(B + 'part.stl')
TRI = mesh.vertices[mesh.faces]
FACES = json.load(open(B + 'faces.json'))
SX = 16.0603933478048
STOCK_LO = np.array([-SX, -81.0, -36.0]); STOCK_HI = np.array([SX, 81.0, 101.5])
STUB = box_tris([-SX - 0.01, -81.01, -36.0], [SX + 0.01, 81.01, 0.0])

TOOLS = {  # T: (D, flutes, chip, rpm)
    1: (10, 3, 0.06, 18000), 2: (6, 3, 0.04, 24000), 3: (3, 2, 0.02, 24000), 4: (1.5, 2, 0.01, 24000),
    7: (3, 2, 0.02, 24000), 8: (1, 2, 0.008, 24000), 9: (6, 2, 0.02, 24000)}
def feed(t, k=1.0):
    D, z, c, n = TOOLS[t]
    return int(min(6000, c * z * n * k))

P = Prog()
P.w('%'); P.w('(CTC-04 x0.2 AL6061 - 3+2 indexed, vise on stub, part-off to 2 tabs)')
P.w('G21 G90 G17 G94'); P.w('G54')
STATE = {'frame': False}

def setup(name, fr):
    P.w('(SETUP %s)' % name)
    P.w('M5')
    if STATE['frame']:
        P.w('G69')
    P.w('G68.2 X%.4f Y%.4f Z%.4f I%.4f J%.4f K%.4f' % (fr.o[0], fr.o[1], fr.o[2], fr.I, fr.J, fr.K))
    P.w('G53.1')
    STATE['frame'] = True
    P.pos = [0.0, 0.0, 150.0]

def tool(t, note=''):
    D, z, c, n = TOOLS[t]
    P.w('M5')
    P.w('T%d M6 (%s)' % (t, note))
    P.w('G43 H%d' % t)
    P.w('S%d M3' % n)
    P.pos = [P.pos[0], P.pos[1], 150.0]

def holes(radius, axis_idx=0, tol=0.002):
    """group cylinder faces of given radius whose axis is along G54 axis_idx; returns list of dict"""
    hs = []
    for f in FACES:
        if f['type'] != 'cylinder' or abs(f['radius'] - radius) > tol or not f.get('concave'):
            continue
        if abs(abs(f['axis'][axis_idx]) - 1) > 1e-3:
            continue
        b = np.array(f['bbox'])
        hs.append(b)
    groups = []
    for b in hs:
        c = np.array([(b[1] + b[4]) / 2, (b[2] + b[5]) / 2])
        for g in groups:
            if np.linalg.norm(g['c'] - c) < radius * 1.5 and abs(g['x0'] - b[0]) < 0.5:
                g['bb'].append(b); break
        else:
            groups.append({'c': c, 'x0': b[0], 'bb': [b]})
    out = []
    for g in groups:
        bb = np.array(g['bb'])
        lo = bb[:, :3].min(0); hi = bb[:, 3:].max(0)
        out.append({'y': (lo[1] + hi[1]) / 2, 'z': (lo[2] + hi[2]) / 2, 'x0': lo[0], 'x1': hi[0],
                    'span': (hi[1] - lo[1], hi[2] - lo[2]), 'n': len(bb)})
    return out

def helix(lk, cx, cy, ztop, zbot, r, t, pitch, F=None, Fp=None, final=True):
    """helical bore in frame coords: centre (cx,cy), orbit radius r, from ztop down to zbot (G3 = climb inside)"""
    F = F or feed(t); Fp = Fp or int(F / 3)
    tgt = np.array([cx + r, cy])
    if P.pos[2] > 100:
        P.g0(z=lk.zsafe); P.g0(tgt[0], tgt[1])
    else:
        seg = resample(np.vstack([np.array(P.pos[:2]), tgt]), 0.5)
        zt = max(min(lk.top_at(seg) + 1.0, lk.zsafe), P.pos[2])
        P.g0(z=zt); P.g0(tgt[0], tgt[1])
    P.g0(z=ztop + 0.5)
    P.g1(cx + r, cy, ztop + 0.1, Fp)
    z = ztop + 0.1
    while z > zbot + 1e-9:
        z = max(zbot, z - pitch)
        P.w('G3 X%.4f Y%.4f Z%.4f I%.4f J0 F%d' % (cx + r, cy, z, -r, F))
    if final:
        P.w('G3 X%.4f Y%.4f Z%.4f I%.4f J0 F%d' % (cx + r, cy, zbot, -r, F))
    P.g1(cx, cy, zbot, F)
    P.pos = [cx, cy, zbot]
    P.g0(z=ztop + 1.0)

def fine_levels(ranges, dz):
    out = []
    for a, b in ranges:  # a < b (frame z)
        n = int(math.ceil((b - a) / dz))
        out += list(np.linspace(b, a, n + 1))
    return out

def merge_levels(floors, fine, top=None):
    L = sorted(set([round(f + 0.0005, 4) for f in floors]), reverse=True)
    for z in fine:
        if all(abs(z - f) > 0.012 for f in L):
            L.append(round(z, 4))
    L = sorted(L, reverse=True)
    if top is not None:
        L = [z for z in L if z < top]
    return L

LOG = []
###########################################################################################
# SETUP 1 : tool from -X (complex side: body, blocks, ears, pockets, flange underside)
###########################################################################################
F1 = Frame(-90, 90, 0, (-SX, 0, 0))          # frame x=-Y, y=+Z, z=-X ; stock face X=-SX at z=0
fz = lambda X: -SX - X                        # G54 X -> frame z
log('grid -X')
G1 = Grid(F1, TRI, STUB, (-88, 88), (-8, 108), 0.05)
fl1 = floors_of(G1)
log('floors -X (frame z):', [round(v, 3) for v in fl1])
M1 = Material(G1, 0.0)
GC1 = coarse(G1, 4)
setup('1: tool from -X (A90) - complex side', F1)
ZS = 5.0
# --- T1 rough
tool(1, 'D10 flat rough')
lk = Linker(P, M1, ZS, 5.0, feed(1), feed(1, 0.35), D=10)
zb1 = fz(7.5)
lv = sorted(set([round(v, 3) for v in list(np.arange(-6, zb1, -6.0)) + [zb1] + [f + 0.3 for f in fl1 if f + 0.3 > zb1]]), reverse=True)
log('T1 levels', lv)
rough(P, GC1, M1, lk, 5.0, lv, 0.3, 4.5, log=LOG)
P.g0(z=ZS)
log('T1 done lines', len(P.L))
# --- T2 rest rough
tool(2, 'D6 flat rest rough')
lk = Linker(P, M1, ZS, 3.0, feed(2), feed(2, 0.35), D=6)
lv2 = sorted(set([round(v, 3) for v in list(np.arange(-3, zb1, -3.0)) + [zb1] + [f + 0.25 for f in fl1 if f + 0.25 > zb1]]), reverse=True)
rough(P, GC1, M1, lk, 3.0, lv2, 0.25, 2.4, log=LOG)
P.g0(z=ZS)
log('T2 rest done lines', len(P.L))
# --- T3 rest rough (slots, narrow areas), extra levels in the arch range
tool(3, 'D3 flat rest rough')
lk = Linker(P, M1, ZS, 1.5, feed(3), feed(3, 0.35), D=3)
GC1b = coarse(G1, 2)
arch = list(np.arange(fz(-5.94), fz(-3.44) - 0.01, -0.4))
lv3 = sorted(set([round(v, 3) for v in list(np.arange(-1.5, zb1, -1.5)) + [zb1] + arch + [f + 0.15 for f in fl1 if f + 0.15 > zb1]]), reverse=True)
rough(P, GC1b, M1, lk, 1.5, lv3, 0.15, 1.2, log=LOG)
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
finish(P, G1, lk, 3.0, lev1, 2.7, log=LOG)
P.g0(z=ZS)
log('T2 finish done lines', len(P.L))
tool(3, 'D3 flat finish rest')
lk = Linker(P, M1, ZS, 1.5, feed(3), feed(3, 0.35), D=3)
finish(P, G1, lk, 1.5, lev1, 1.3, rest_of=3.0, log=LOG)
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
    ztop = fz(h['x0']); zbot = ztop - 2.6
    helix(LK, -h['y'], h['z'], ztop, zbot, 0.165, 8, 0.05)
P.g0(z=ZS)
# --- T4: flange through holes, second half from the underside; blind holes r1.21
tool(4, 'D1.5 flat holes')
LK = Linker(P, M1, ZS, 0.75, feed(4), feed(4, 0.35), D=1.5)
h14 = [h for h in holes(1.4, 0)]
log('r1.4 holes', len(h14))
for h in sorted(h14, key=lambda h: math.atan2(h['z'] - 50, -h['y'])):
    ztop = fz(7.06); zbot = fz(9.86)
    helix(LK, -h['y'], h['z'], ztop, zbot, 0.65, 4, 0.15)
h121 = holes(1.21, 0)
log('r1.21 holes', len(h121), [(round(h['y'], 2), round(h['z'], 2), round(h['x0'], 2), round(h['x1'], 2)) for h in h121])
for h in h121:
    ztop = fz(7.06); zbot = fz(h['x1'])
    helix(LK, -h['y'], h['z'], ztop, zbot, 1.21 - 0.75, 4, 0.15)
P.g0(z=ZS)
log('setup 1 lines', len(P.L))

###########################################################################################
# SETUP 2 : ear slope faces (normal (-0.9272, 0.3746, 0)) and their counterbored holes
###########################################################################################
nrm = np.array([-0.9272, 0.3746, 0.0]); nrm /= np.linalg.norm(nrm)
Ie = math.degrees(math.atan2(nrm[0], -nrm[1]))
F2 = Frame(Ie, 90, 0, (-3.5002, -39.391, 50.0))
log('ear frame I=%.4f axis' % Ie, np.round(F2.R[:, 2], 4))
# domain: ears in frame coords
ear_pts = F2.to_f([[-13.06, -63, 24], [-0.94, -33, 24], [-13.06, -63, 76], [-0.94, -33, 76], [-13.06, -63, 38], [-0.94, -33, 62]])
ex0, ey0 = ear_pts[:, :2].min(0) - 8; ex1, ey1 = ear_pts[:, :2].max(0) + 8
G2 = Grid(F2, TRI, STUB, (ex0, ex1), (ey0, ey1), 0.05)
M2 = Material(G2, 0.0)
M2.M[:] = -1e3
Hc = coarse(G2, 5).Hk
jj, ii = np.mgrid[0:M2.ny, 0:M2.nx]
jc = np.clip((jj * M2.px / (G2.px * 5)).astype(int), 0, Hc.shape[0] - 1); ic = np.clip((ii * M2.px / (G2.px * 5)).astype(int), 0, Hc.shape[1] - 1)
M2.M = Hc[jc, ic] + 0.8
ZS2 = float(np.nanmax(np.where(G2.Hk > -1e8, G2.Hk, np.nan))) + 5.0
setup('2: ear slope faces, tool normal to the 22 deg face (A90)', F2)
tool(2, 'D6 flat ear faces')
dom = np.zeros_like(G2.Hp, bool)
from shapely.geometry import Polygon
import shapely
for zc in (31.0, 69.0):
    q = F2.to_f([[-13.06, -63, zc - 7], [-0.94, -33, zc - 7], [-0.94, -33, zc + 7], [-13.06, -63, zc + 7]])[:, :2]
    poly = Polygon(q).buffer(3.5)
    X, Y = np.meshgrid(G2.xs, G2.ys)
    dom |= shapely.contains_xy(poly, X, Y)
lk = Linker(P, M2, ZS2, 3.0, feed(2), feed(2, 0.35), D=6)
finish(P, G2, lk, 3.0, [0.0005], 2.7, domain=dom, log=LOG)
P.g0(z=ZS2)
# holes: counterbore r2 depth 4 + r1.2 to depth 8 ; r1.0106 depth 6
cb = [(-5.7478, -44.9541), (-8.3701, -51.4444)]
th = [(-3.5002, -39.391), (-10.6177, -57.0075)]
tool(3, 'D3 flat counterbores')
LK = Linker(P, M2, ZS2, 1.5, feed(3), feed(3, 0.35), D=3)
for zc in (31.0, 69.0):
    for (x, y) in cb:
        c = F2.to_f([[x, y, zc]])[0]
        helix(LK, c[0], c[1], c[2], c[2] - 4.0, 0.5, 3, 0.25)
        P.w('G3 X%.4f Y%.4f Z%.4f I%.4f J0 F%d' % (c[0] + 0.5, c[1], c[2] - 4.0, -0.5, feed(3))) if False else None
P.g0(z=ZS2)
tool(4, 'D1.5 flat ear holes')
LK = Linker(P, M2, ZS2, 0.75, feed(4), feed(4, 0.35), D=1.5)
for zc in (31.0, 69.0):
    for (x, y) in cb:
        c = F2.to_f([[x, y, zc]])[0]
        helix(LK, c[0], c[1], c[2] - 4.0, c[2] - 8.0, 0.45, 4, 0.12)
    for (x, y) in th:
        c = F2.to_f([[x, y, zc]])[0]
        helix(LK, c[0], c[1], c[2], c[2] - 6.0, 1.0106 - 0.75, 4, 0.12)
P.g0(z=ZS2)
log('setup 2 lines', len(P.L))

###########################################################################################
# SETUP 3 : tool from +X (flat face with the two pockets, flange outline, through holes)
###########################################################################################
F3 = Frame(90, 90, 0, (SX, 0, 0))   # frame x=+Y, y=+Z, z=+X
gz = lambda X: X - SX
G3 = Grid(F3, TRI, STUB, (-88, 88), (-8, 108), 0.05)
fl3 = floors_of(G3)
log('floors +X (frame z):', [round(v, 3) for v in fl3])
M3 = Material(G3, 0.0)
GC3 = coarse(G3, 4)
setup('3: tool from +X (A90) - flat face, pockets, outline', F3)
tool(1, 'D10 flat rough')
lk = Linker(P, M3, ZS, 5.0, feed(1), feed(1, 0.35), D=10)
zb3 = gz(6.56)
lv = sorted(set([round(v, 3) for v in [-6.0, zb3] + [f + 0.3 for f in fl3 if f + 0.3 > zb3]]), reverse=True)
rough(P, GC3, M3, lk, 5.0, lv, 0.3, 4.5, log=LOG)
P.g0(z=ZS)
fine3 = fine_levels([(gz(10.9), gz(9.9))], 0.07)
lev3 = merge_levels(fl3, fine3) + [round(zb3, 4)]
lev3 = sorted(set(lev3), reverse=True)
log('finish levels +X', lev3[:4], len(lev3))
tool(2, 'D6 flat finish')
lk = Linker(P, M3, ZS, 3.0, feed(2), feed(2, 0.35), D=6)
finish(P, G3, lk, 3.0, lev3, 2.7, log=LOG)
P.g0(z=ZS)
tool(3, 'D3 flat finish rest')
lk = Linker(P, M3, ZS, 1.5, feed(3), feed(3, 0.35), D=3)
finish(P, G3, lk, 1.5, lev3, 1.3, rest_of=3.0, log=LOG)
P.g0(z=ZS)
tool(4, 'D1.5 flat through holes (first half) ')
LK = Linker(P, M3, ZS, 0.75, feed(4), feed(4, 0.35), D=1.5)
for h in sorted(h14, key=lambda h: math.atan2(h['z'] - 50, h['y'])):
    helix(LK, h['y'], h['z'], gz(13.06), gz(9.56), 0.65, 4, 0.15)
P.g0(z=ZS)
# countersinks: 45 deg cones on the +X face
cones = [f for f in FACES if f['type'] == 'cone' and abs(f.get('half_angle_deg', 0) - 45) < 0.5 and f['bbox'][3] > 13.0]
tool(9, 'D6 90deg chamfer mill countersinks')
done = []
for h in h14:
    cs = [f for f in cones if abs((f['bbox'][1] + f['bbox'][4]) / 2 - h['y']) < 2.2 and abs((f['bbox'][2] + f['bbox'][5]) / 2 - h['z']) < 2.2]
    if not cs:
        continue
    bb = np.array([f['bbox'] for f in cs])
    rtop = max(bb[:, 4].max() - bb[:, 1].min(), bb[:, 5].max() - bb[:, 2].min()) / 2
    tipz = gz(13.06) - (rtop - 0.1)
    P.g0(z=gz(13.06) + 3.0); P.g0(h['y'], h['z']); P.g0(z=gz(13.06) + 0.5)
    P.g1(h['y'], h['z'], tipz, 300); P.w('G4 P0.2'); P.g1(h['y'], h['z'], gz(13.06) + 0.5, 600)
    done.append(round(rtop, 3))
log('countersinks', len(done), sorted(set(done)))
P.g0(z=ZS)
log('setup 3 lines', len(P.L))

json.dump(LOG, open(W + '/oplog.json', 'w'))
import pickle
pickle.dump({'P': P, 'STATE': STATE}, open(W + '/stage1.pkl', 'wb'))
log('stage1 saved')
