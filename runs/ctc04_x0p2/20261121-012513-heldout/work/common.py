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
STUB = box_tris([-30.0, -200.0, -40.0], [30.0, 200.0, 0.0])
_st = json.load(open(B + 'setup.json'))
HOLD = np.concatenate([box_tris([-SX, -81.0, -36.0], [SX, 81.0, 0.0])] + [box_tris(lo, hi) for lo, hi in _st['vise'][:3]])
from shapely.geometry import MultiPoint
def stock_poly(fr):
    c = np.array([[x, y, z] for x in (-SX, SX) for y in (-81.0, 81.0) for z in (-36.0, 101.5)])
    return MultiPoint(fr.to_f(c)[:, :2]).convex_hull

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

import pickle
def save_stage(name, extra):
    pickle.dump(dict(P=P, STATE=STATE, LOG=LOG, **extra), open(W + '/%s.pkl' % name, 'wb'))
def load_stage(name):
    d = pickle.load(open(W + '/%s.pkl' % name, 'rb'))
    return d
