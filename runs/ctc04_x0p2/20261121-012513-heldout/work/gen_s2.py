from common import *
d = load_stage('s1'); P = d['P']; STATE.update(d['STATE']); LOG = d['LOG']; h14 = d['h14']
import common; common.P = P
ZS = 5.0
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
G2 = Grid(F2, TRI, STUB, (ex0, ex1), (ey0, ey1), 0.05, holder_tris_g=HOLD)
M2 = Material(G2, 0.0)
from strat import floors_of
ZF = min(floors_of(G2), key=lambda v: abs(v - 0.02))
log('ear face frame z', ZF)
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
finish(P, G2, lk, 3.0, [ZF + 0.0005], 2.7, domain=dom, log=LOG)
P.g0(z=ZS2)
# holes: counterbore r2 depth 4 + r1.2 to depth 8 ; r1.0106 depth 6
cb = [(-5.7478, -44.9541), (-8.3701, -51.4444)]
th = [(-3.5002, -39.391), (-10.6177, -57.0075)]
tool(3, 'D3 flat counterbores')
LK = Linker(P, M2, ZS2, 1.5, feed(3), feed(3, 0.35), D=3)
for zc in (31.0, 69.0):
    for (x, y) in cb:
        c = F2.to_f([[x, y, zc]])[0]
        helix(LK, c[0], c[1], ZF, ZF - 4.0, 0.5, 3, 0.25)
        P.w('G3 X%.4f Y%.4f Z%.4f I%.4f J0 F%d' % (c[0] + 0.5, c[1], c[2] - 4.0, -0.5, feed(3))) if False else None
P.g0(z=ZS2)
tool(4, 'D1.5 flat ear holes')
LK = Linker(P, M2, ZS2, 0.75, feed(4), feed(4, 0.35), D=1.5)
for zc in (31.0, 69.0):
    for (x, y) in cb:
        c = F2.to_f([[x, y, zc]])[0]
        helix(LK, c[0], c[1], ZF - 4.0, ZF - 8.0, 0.45, 4, 0.12)
    for (x, y) in th:
        c = F2.to_f([[x, y, zc]])[0]
        helix(LK, c[0], c[1], ZF, ZF - 6.0, 1.0106 - 0.75, 4, 0.12)
P.g0(z=ZS2)
log('setup 2 lines', len(P.L))

save_stage('s2', dict(h14=h14))
log('saved s2')
