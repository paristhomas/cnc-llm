# Part-off section (appended to the stage-1 program). Own code.
import sys, json, math, pickle
W = '/home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/work'
sys.path.insert(0, W)
import numpy as np, trimesh
from cam import Frame, raster_max, Prog

B = '/home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/brief/'
SX = 16.0603933478048
st = pickle.load(open(W + '/stage1.pkl', 'rb'))
P = st['P']; STATE = st['STATE']
mesh = trimesh.load(B + 'part.stl')
TRI = mesh.vertices[mesh.faces]

# lower silhouette Zmin(Y) of the whole part (min over X)
FU = Frame(0, 180, 0, (0, 0, 0))          # frame x=X, y=-Y, z=-Z
Tf = FU.to_f(TRI.reshape(-1, 3)).reshape(-1, 3, 3)
n = np.cross(Tf[:, 1] - Tf[:, 0], Tf[:, 2] - Tf[:, 0]); Tf = Tf[n[:, 2] > 1e-12]
px = 0.05
H = raster_max(Tf, -14.0, -82.0, int(28 / px), int(164 / px), px)   # rows: frame y = -Y
negZ = H.max(axis=1)                       # max(-Z) over X
Ys = -(-82.0 + (np.arange(H.shape[0]) + 0.5) * px)
order = np.argsort(Ys); Ys = Ys[order]; Zmin = np.where(negZ[order] < -1e8, 1e9, -negZ[order])

def cz_profile(R, cap, Yq):
    out = []
    for y in Yq:
        m = (Ys >= y - R) & (Ys <= y + R)
        u = Ys[m] - y
        v = Zmin[m] - np.sqrt(np.maximum(R * R - u * u, 0))
        c = v.min() if len(v) else 1e9
        out.append(min(c, cap))
    return np.array(out)

Yq = np.arange(-86.0, 86.0001, 0.25)
cz2 = cz_profile(3.0, 0.5, Yq)
cz3u = np.minimum(cz_profile(1.5, 4.5, Yq), cz2 + 1.5)
cz3l = cz2 - 1.5
print('cz2 flat', cz2[(Yq > -60) & (Yq < -10)].min(), cz2[(Yq > -60) & (Yq < -10)].max())

def simp(Y, Z, tol=0.002):
    from shapely.geometry import LineString
    return np.asarray(LineString(np.column_stack([Y, Z])).simplify(tol).coords)

def setup(name, fr):
    P.w('(%s)' % name)
    P.w('M5')
    if STATE['frame']:
        P.w('G69')
    P.w('G68.2 X%.4f Y%.4f Z%.4f I%.4f J%.4f K%.4f' % (fr.o[0], fr.o[1], fr.o[2], fr.I, fr.J, fr.K))
    P.w('G53.1'); STATE['frame'] = True
    P.pos = [0.0, 0.0, 150.0]

def tool(t, rpm, note):
    P.w('M5'); P.w('T%d M6 (%s)' % (t, note)); P.w('G43 H%d' % t); P.w('S%d M3' % rpm)

R2 = 3.0
P.w('(PART-OFF)')
P.w('(underside finished by the flank of horizontal tools, centre line at Z-R; web cut down to 2 tabs)')
# ---------------- from -X side
FA = Frame(-90, 90, 0, (-SX, 0, -R2))     # frame x=-Y, y=Z+3, z=-SX-X
setup('PART-OFF A: from -X, T2 flank on Z0', FA)
tool(2, 24000, 'D6 flat part-off')
path = simp(Yq, cz2)
tips = [-12.0, -8.0, -4.0, 0.0, 4.0, 7.06, 8.76]
F = 1700
fwd = True
P.g0(z=5.0)
flat = simp(Yq, np.minimum(cz2, -3.0))[::-1]
for k, xt in enumerate(tips):
    zf = -SX - xt
    pts = path
    if k == 0:
        P.g0(-pts[0][0], pts[0][1] + R2); P.g1(-pts[0][0], pts[0][1] + R2, zf, 800)
    else:
        P.g1(-pts[0][0], pts[0][1] + R2, zf, 800)
    for y, z in pts[1:]:
        P.g1(-y, z + R2, zf, F)
    for y, z in flat:          # back along Z-3 so the slab Z-6..0 is open over the full length
        P.g1(-y, z + R2, zf, F)
P.g0(z=5.0)
# ---------------- blind hole r1.21 near Z0 from -X (holder of T4 needs the opened slab under the part)
FA2 = Frame(-90, 90, 0, (-SX, 0, 0))      # frame x=-Y, y=Z, z=-SX-X
setup('PART-OFF A2: from -X, T4 blind hole Y-73 Z5.28 (holder clears the stub only after the slab is open)', FA2)
tool(4, 24000, 'D1.5 flat blind hole')
cy, cz_, r = -73.0, 5.28, 1.21 - 0.75
ztop, zbot = -SX - 7.06, -SX - 10.06
P.g0(z=5.0); P.g0(-cy + r, cz_); P.g0(z=ztop + 1.0); P.g1(-cy + r, cz_, ztop + 0.1, 160)
zz = ztop + 0.1
while zz > zbot + 1e-9:
    zz = max(zbot, zz - 0.15)
    P.w('G3 X%.4f Y%.4f Z%.4f I%.4f J0 F480' % (-cy + r, cz_, zz, -r))
P.w('G3 X%.4f Y%.4f Z%.4f I%.4f J0 F480' % (-cy + r, cz_, zbot, -r))
P.g1(-cy, cz_, zbot, 480); P.g0(z=ztop + 1.0); P.g0(z=5.0)
P.w('M5'); P.w('T2 M6 (D6 flat part-off)'); P.w('G43 H2')
# ---------------- from +X side
FB = Frame(90, 90, 0, (SX, 0, -R2))       # frame x=+Y, y=Z+3, z=X-SX
setup('PART-OFF B: from +X, T2 flank on Z0', FB)
P.w('S24000 M3')
tips = [12.06, 11.36]
fwd = True
P.g0(z=5.0)
for k, xt in enumerate(tips):
    zf = xt - SX
    pts = path if fwd else path[::-1]
    if k == 0:
        P.g0(pts[0][0], pts[0][1] + R2); P.g1(pts[0][0], pts[0][1] + R2, zf, 800)
    else:
        P.g1(pts[0][0], pts[0][1] + R2, zf, 800)
    for y, z in pts[1:]:
        P.g1(y, z + R2, zf, F)
    fwd = not fwd
P.g0(z=5.0)
# ---------------- web X 8.76..11.36 cut down to two tabs with T3 from +X (two Z levels, two axial steps)
T1c, T2c, L0 = -62.0, -10.0, 7.5
tab1 = (T1c - L0 / 2, T1c + L0 / 2); tab2 = (T2c - L0 / 2, T2c + L0 / 2)
segs = [(-86.0, tab1[0]), (86.0, tab2[1]), (tab1[1], tab2[0])]   # (start, end) - last one needs an axial plunge
tool(3, 24000, 'D3 flat web to tabs')
F3 = 600
for xt in (10.06, 8.46):
    zf = xt - SX
    for (ya, yb) in segs:
        lo, hi = min(ya, yb), max(ya, yb)
        m = (Yq >= lo - 1e-9) & (Yq <= hi + 1e-9)
        for prof in (cz3u, cz3l):
            pts = simp(Yq[m], prof[m])
            if ya > yb:
                pts = pts[::-1]
            P.g0(z=5.0); P.g0(pts[0][0], pts[0][1] + R2)
            outside = abs(ya) > 82
            if outside:
                P.g0(z=2.0); P.g1(pts[0][0], pts[0][1] + R2, zf, 400)
            else:
                P.g0(z=(10.06 + 0.6 - SX) if xt < 10 else (11.36 + 0.6 - SX))
                P.g1(pts[0][0], pts[0][1] + R2, zf, 250)
            for y, z in pts[1:]:
                P.g1(y, z + R2, zf, F3)
            P.g0(z=5.0)
P.w('M5')
P.w('G69')
P.w('M30')
P.w('%')
open(W + '/program.nc', 'w').write('\n'.join(P.L) + '\n')
print('lines', len(P.L))
print('tabs', tab1, tab2)
