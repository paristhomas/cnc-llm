"""ftc10 program generator (own CAM).  python gen.py  ->  program.nc"""
import sys, time, json, math
import numpy as np
import trimesh
from cam import Frame, Stock, box_tris, TOOLS, GF, GC
from ops import Writer, rough, finish, helix, Cutter
import ops

RUN = '/home/user/cnc-llm/runs/ftc10/20261120-111240'
t0 = time.time()
def log(*a):
    print(f'[{time.time()-t0:6.1f}s]', *a, file=sys.stderr, flush=True)

setup = json.load(open(f'{RUN}/brief/setup.json'))
part = trimesh.load(f'{RUN}/brief/part.stl')

BUMPS = (-52.0, -30.0, -8.0, 14.0)
PED_TOP = -11.0
keep = [part.triangles,
        box_tris([-37.5, -82, -43], [37.5, 82, PED_TOP]),          # pedestal (stub kept below the access zone)
        box_tris([-40.5, -82, -43], [40.5, 82, -35.0]),            # full-width stub below
        box_tris([-31.0, 35.5, PED_TOP], [-16.0, 59.5, 0.0])]      # neck under the boss (parting face)
for c in BUMPS:                                                    # small necks under the bump bottoms
    keep.append(box_tris([-4.0, c - 1.5, PED_TOP], [4.0, c + 1.5, 0.0]))


class Job:
    pass


job = Job()
job.keep_tris = np.concatenate(keep)
job.vise_tris = np.concatenate([box_tris(lo, hi) for lo, hi in setup['vise']])
job.stock = Stock(setup['stock']['lo'], [40.5, 82.0, 32.5])

FR_TOP = Frame('top', 0, 0, 0, [0, 0, -30])
FR_PX = Frame('+X', 90, 90, 0, [0, 0, 0])
FR_MX = Frame('-X', -90, 90, 0, [0, 0, 0])
FR_PY = Frame('+Y', 180, 90, 0, [0, 0, 0])
for fr in (FR_TOP, FR_PX, FR_MX, FR_PY):
    log(fr.name, 'axes', fr.ax, fr.sg, 'tool axis', np.round(fr.R[:, 2], 3))


def floors(S, wmin, wmax, min_area=30.0):
    h = S.Hf[np.isfinite(S.Hf)]
    h = np.round(h, 3)
    vals, cnt = np.unique(h, return_counts=True)
    sel = vals[(cnt * GF * GF >= min_area) & (vals >= wmin) & (vals <= wmax)]
    return sorted(set(float(v) for v in sel), reverse=True)


def steps(top, bot, dz, extra=()):
    lv = list(np.arange(top, bot - 1e-6, -dz)) + [bot] + list(extra)
    lv = sorted(set(round(x, 3) for x in lv if bot - 1e-6 <= x <= top + 1e-6), reverse=True)
    out = []
    for z in lv:
        if not out or out[-1] - z > 0.15 or z in extra:
            out.append(z)
    return out


W = Writer()

# ================================================================ SETUP 1: top (+Z)
log('setup TOP')
W.c('SETUP 1 - TOP (+Z): face, outer profile, top pocket, ear holes, pocket-floor holes')
W.set_frame(FR_TOP)
S = ops.Setup(job, FR_TOP)
fl = floors(S, 19.0, 62.0)
log('top floors', fl)
rough(W, S, 1, allow=0.3, ap=2.0, wbot=19.0, floors=fl)
log('top rough done', len(W.L))
finish(W, S, 1, steps(61.0, 19.0, 3.0, extra=fl), allow=0.0)
log('top finish done', len(W.L))
# rest with T3 (pocket corners r2, ear relief notches, side-wall slot)
finish(W, S, 3, steps(61.0, 46.0, 1.0, extra=[f for f in fl if f >= 44]), allow=0.0, rest_of=1, ap=1.0)
log('top T3 rest done', len(W.L))
# ear holes r3 (Z31 -> into the counterbore below)
ears = [(sx * 28.5, sy * 70.0) for sx in (-1, 1) for sy in (-1, 1)]
helix(W, S, 3, [(x, y, 3.0, 61.0, 54.6) for x, y in ears], pitch=0.4)
# T4: rest in the r1 relief notches + the 8 small holes in the pocket floor
finish(W, S, 4, steps(61.0, 54.0, 0.4), allow=0.0, rest_of=3, ap=0.5)
log('top T4 done', len(W.L))
# T7 ball: r2 fillet between pocket floor (Z14) and walls
T7 = TOOLS[7]
C = Cutter(W, S, 7)
for phi in np.radians(np.arange(0, 31, 7.5)):
    n = 2.0 - 0.5 * math.sin(phi)
    z = 14.5 - 0.5 * math.cos(phi) + 30.0
    x0, x1 = -25 + n, 25 - n; y0, y1 = -58 + n, 20 - n
    rc = max(2.0 - n, 0.0)
    # CCW rounded rectangle
    pts = []
    for cx, cy, a0 in ((x1 - rc, y0 + rc, -90), (x1 - rc, y1 - rc, 0), (x0 + rc, y1 - rc, 90), (x0 + rc, y0 + rc, 180)):
        for a in np.radians(np.linspace(a0, a0 + 90, 7)):
            pts.append([cx + rc * math.cos(a), cy + rc * math.sin(a), z])
    pts.append(pts[0])
    P = np.array(pts)
    C.approach(P[0, 0], P[0, 1], z)
    C.path(P, record=False)
C.retract()
log('top done', len(W.L))

# ================================================================ SETUP 2/3: sides +X / -X
import os
if os.environ.get('STOP') == 'top':
    np.save('/tmp/claude-0/-home-user-cnc-llm/2da81ada-c0c4-5aae-9ae8-f9e5d8619ed9/scratchpad/stock_top.npy', job.stock.v); sys.exit(0)
for fr in (FR_PX, FR_MX):
    log('setup', fr.name)
    W.c(f'SETUP - SIDE {fr.name}: underside access zone, wavy bottom, end walls, flange underside, cross holes')
    W.set_frame(fr)
    S = ops.Setup(job, fr, vmin=-40.0)
    fl = floors(S, -1.5, 40.0)
    log(fr.name, 'floors', fl)
    sg = 1 if fr is FR_PX else -1     # u = sg*Y
    uu = S.uc0 + np.arange(S.nu) * GC; vv = S.vc0 + np.arange(S.nv) * GC
    Yw = sg * uu[None, :]; Zw = vv[:, None]
    um = ~((Yw > 21.0) & (Yw < 68.0) & (Zw > -8.2))   # band under the box/boss: shank would rub; done from +Y
    rough(W, S, 1, allow=0.3, ap=2.0, wbot=-1.5, floors=fl, umask=um)
    log(fr.name, 'rough done', len(W.L))
    finish(W, S, 1, steps(40.0, -1.5, 3.0, extra=fl), allow=0.0, umask=um)
    log(fr.name, 'finish done', len(W.L))
    sg = 1 if fr is FR_PX else -1     # u = sg*Y
    cb = [(sg * c, 8.0, 5.0, 37.5, 27.5) for c in BUMPS]
    helix(W, S, 2, cb, pitch=0.6)
    hl = [(sg * c, 8.0, 3.5, 27.5, 8.6) for c in BUMPS]
    helix(W, S, 2, hl, pitch=0.25, Ffac=0.5)
    log(fr.name, 'holes done', len(W.L))

# ================================================================ SETUP 4: +Y (right-block underside channels)
if os.environ.get('STOP') == 'py':
    np.save('/tmp/claude-0/-home-user-cnc-llm/2da81ada-c0c4-5aae-9ae8-f9e5d8619ed9/scratchpad/stock_py.npy', job.stock.v); sys.exit(0)
log('setup +Y')
W.c('SETUP - END +Y: channels under the right block (rib, box, boss, Z8 faces)')
W.set_frame(FR_PY)
S = ops.Setup(job, FR_PY, vmin=-40.0)
fl = floors(S, 22.5, 82.0)
log('+Y floors', fl)
rough(W, S, 1, allow=0.3, ap=2.0, wbot=22.6, floors=fl)
finish(W, S, 1, steps(82.0, 22.6, 3.0, extra=fl), allow=0.0)
rough(W, S, 5, allow=0.15, ap=1.5, wbot=28.5, floors=fl)
finish(W, S, 5, steps(82.0, 28.5, 2.0, extra=fl), allow=0.0, ap=1.5)
helix(W, S, 3, [(-25.0, 16.0, 2.75, 62.5, 58.2), (23.5, 13.0, 2.75, 62.5, 58.2)], pitch=0.3)
log('+Y done', len(W.L))

# ================================================================ SETUP 5: -Y (left end wall / flange underside fillet)
FR_MY = Frame('-Y', 0, 90, 0, [0, 0, 0])
log('setup -Y')
W.c('SETUP - END -Y: left end wall, flange underside and r1 fillet (bull nose)')
W.set_frame(FR_MY)
S = ops.Setup(job, FR_MY, vmin=-40.0)
fl = floors(S, 28.0, 82.0)
log('-Y floors', fl)
rough(W, S, 5, allow=0.15, ap=1.5, wbot=28.5, floors=fl)
finish(W, S, 5, steps(82.0, 28.5, 2.0, extra=fl), allow=0.0, ap=1.5)
log('-Y done', len(W.L))

# ================================================================ PART-OFF
W.c('PART-OFF')
for fr in (FR_PX, FR_MX):
    W.set_frame(fr)
    W.tool(1)
    T = TOOLS[1]; F = T['feed']; Fp = F / 3
    sg = 1 if fr is FR_PX else -1
    # (a) slot through the stub at mid-gap (Z-17.5), leaving 2 tabs at the stub ends (|Y| 77..82, |X|<1.5)
    W.c(f'part-off (a) {fr.name}: mid-gap slot Z-17.5, tabs at stub ends')
    v = -17.5
    lv = list(np.arange(35.5, -1.5, -2.0)) + [-1.5]
    flip = False
    for w in lv:
        lim = 87.0 if w >= 0.6 else 60.0
        ua, ub = (-lim, lim) if not flip else (lim, -lim)
        W.mv('G0', [W.pos[0], W.pos[1], 45.0]); W.mv('G0', [ua, v, 45.0])
        W.mv('G0', [ua, v, w + 2.5]); W.mv('G1', [ua, v, w], Fp)
        W.mv('G1', [ub, v, w], F)
        flip = not flip
    W.mv('G0', [W.pos[0], W.pos[1], 45.0])
    # (b) cut the necks just below the part (Z-5.05 -> tool top at Z-0.05)
    W.c(f'part-off (b) {fr.name}: necks under the part')
    v = -5.35
    for c in BUMPS:
        u0, u1 = sg * c - 9.0, sg * c + 9.0
        W.mv('G0', [W.pos[0], W.pos[1], 45.0]); W.mv('G0', [u0, v, 45.0]); W.mv('G0', [u0, v, 41.0]); W.mv('G1', [u0, v, 6.0], F)
        flip = False
        for w in (2.5, 0.5, -1.5):
            a, b = (u0, u1) if not flip else (u1, u0)
            W.mv('G1', [a, v, w], Fp); W.mv('G1', [b, v, w], F); flip = not flip
        W.mv('G0', [W.pos[0], W.pos[1], 45.0])
    if fr is FR_MX:
        # boss neck X-31..-16 (w 16..31), u=-Y in [-59.5,-35.5]; tabs Y[35.5,38] & [57,59.5], X[-17.5,-16]
        W.c('part-off (b) boss neck, leaving 2 tabs 2.5 x 1.5 mm')
        u0, u1 = -65.5, -29.5
        W.mv('G0', [u0, v, 45.0]); W.mv('G0', [u0, v, 41.0]); W.mv('G1', [u0, v, 33.0], F)
        flip = False
        for w in list(np.arange(29.5, 17.4, -2.0)) + [17.5]:
            a, b = (u0, u1) if not flip else (u1, u0)
            W.mv('G1', [a, v, w], Fp); W.mv('G1', [b, v, w], F); flip = not flip
        # through, between the tabs (tool centre Y 43..52)
        W.mv('G1', [-47.5, v, 17.5], F)
        for w in (16.5, 15.7):
            W.mv('G1', [-47.5, v, w], Fp)
            W.mv('G1', [-52.0, v, w], F); W.mv('G1', [-43.0, v, w], F); W.mv('G1', [-47.5, v, w], F)
        W.mv('G0', [W.pos[0], W.pos[1], 45.0])

open(f'{RUN}/work/program.nc', 'w').write(W.finish())
log('written', len(W.L), 'lines')

def remaining(lo, hi):
    st = job.stock
    a = np.floor((np.array(lo) - st.lo) / 0.5).astype(int); b = np.ceil((np.array(hi) - st.lo) / 0.5).astype(int)
    sub = st.v[a[0]:b[0], a[1]:b[1], a[2]:b[2]]
    return int(sub.sum()), sub.size
for nm, lo, hi in [('access zone', [-36, -60, -9], [36, 60, -1]), ('pocket', [-20, -50, 15], [20, 15, 30]),
                   ('channels+Y', [7, 25, 1], [17, 60, 7]), ('under +Y flange', [-30, 64, -9], [30, 78, 21]),
                   ('under -Y flange', [-30, -78, -9], [30, -64, 21])]:
    log('remaining voxels', nm, remaining(lo, hi))
