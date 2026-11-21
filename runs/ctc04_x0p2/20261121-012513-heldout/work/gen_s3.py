from common import *
d = load_stage('s2'); P = d['P']; STATE.update(d['STATE']); LOG = d['LOG']; h14 = d['h14']
import common; common.P = P
ZS = 5.0
###########################################################################################
# SETUP 3 : tool from +X (flat face with the two pockets, flange outline, through holes)
###########################################################################################
F3 = Frame(90, 90, 0, (SX, 0, 0))   # frame x=+Y, y=+Z, z=+X
gz = lambda X: X - SX
G3 = Grid(F3, TRI, STUB, (-88, 88), (-8, 108), 0.05, holder_tris_g=HOLD)
fl3 = floors_of(G3)
log('floors +X (frame z):', [round(v, 3) for v in fl3])
M3 = Material(G3, 0.0, poly=stock_poly(F3))
GC3 = coarse(G3, 4)
setup('3: tool from +X (A90) - flat face, pockets, outline', F3)
tool(1, 'D10 flat rough')
lk = Linker(P, M3, ZS, 5.0, feed(1), feed(1, 0.35), D=10)
zb3 = gz(6.56)
lv = sorted(set([round(v, 3) for v in [-6.0, zb3] + [f + 0.3 for f in fl3 if f + 0.3 > zb3]]), reverse=True)
rough(P, GC3, M3, lk, 5.0, lv, 0.3, 4.5, log=LOG, holder=(40, 16))
P.g0(z=ZS)
tool(3, 'D3 flat rest rough')
lk = Linker(P, M3, ZS, 1.5, feed(3), feed(3, 0.35), D=3)
lvr = sorted(set([round(v, 3) for v in list(np.arange(-1.5, zb3, -1.5)) + [zb3] + [f + 0.15 for f in fl3 if f + 0.15 > zb3]]), reverse=True)
rough(P, coarse(G3, 2), M3, lk, 1.5, lvr, 0.25, 1.2, log=LOG, holder=(22, 16), rest_R=(5.0, 0.3))
P.g0(z=ZS)
fine3 = fine_levels([(gz(9.9), gz(10.9))], 0.07)
lev3 = merge_levels(fl3, fine3) + [round(zb3, 4)]
lev3 = sorted(set(lev3), reverse=True)
log('finish levels +X', lev3[:4], len(lev3))
tool(2, 'D6 flat finish')
lk = Linker(P, M3, ZS, 3.0, feed(2), feed(2, 0.35), D=6)
FULL3 = [lev3[-1]] + [z for z in lev3 if abs(z - gz(10.9)) < 0.002]
log('full3', FULL3)
finish(P, G3, lk, 3.0, lev3, 2.7, log=LOG, full_levels=FULL3, holder=(30, 16))
P.g0(z=ZS)
tool(3, 'D3 flat finish rest')
lk = Linker(P, M3, ZS, 1.5, feed(3), feed(3, 0.35), D=3)
finish(P, G3, lk, 1.5, lev3, 1.3, rest_of=3.0, log=LOG, full_levels=FULL3, holder=(22, 16))
P.g0(z=ZS)
# (T4 pocket-corner pass removed: 35 mm2 gain for ~30 min of cycle)
P.g0(z=ZS)
tool(4, 'D1.5 flat through holes (first half) ')
LK = Linker(P, M3, ZS, 0.75, feed(4), feed(4, 0.35), D=1.5)
for h in sorted(h14, key=lambda h: math.atan2(h['z'] - 50, h['y'])):
    helix(LK, h['y'], h['z'], gz(13.06), gz(9.56) if h['z'] >= 11.5 else gz(6.95), 0.65, 4, 0.15)
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
    tipz = gz(13.06) - (rtop - 0.1 - 0.25)
    P.g0(z=gz(13.06) + 3.0); P.g0(h['y'], h['z']); P.g0(z=gz(13.06) + 0.5)
    P.g1(h['y'] + 0.25, h['z'], gz(13.06) + 0.5, 600)
    zz = gz(13.06) + 0.5
    while zz > tipz + 1e-9:
        zz = max(tipz, zz - 0.3)
        P.w('G3 X%.4f Y%.4f Z%.4f I-0.25 J0 F400' % (h['y'] + 0.25, h['z'], zz))
    P.w('G3 X%.4f Y%.4f Z%.4f I-0.25 J0 F400' % (h['y'] + 0.25, h['z'], tipz))
    P.g1(h['y'], h['z'], tipz, 400); P.g1(h['y'], h['z'], gz(13.06) + 0.5, 600)
    done.append(round(rtop, 3))
log('countersinks', len(done), sorted(set(done)))
P.g0(z=ZS)
log('setup 3 lines', len(P.L))

save_stage('stage1', dict(h14=h14))
log('stage1 saved')
