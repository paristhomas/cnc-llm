import sys, time, json
sys.path.insert(0, '/home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/work')
import numpy as np, trimesh
from cam import *
from strat import floors_of
B = '/home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/brief/'
m = trimesh.load(B + 'part.stl')
T = m.vertices[m.faces]
setup = json.load(open(B + 'setup.json'))
fr = Frame(-90, 90, 0, (-16.0603933478048, 0, 0))
print(np.round(fr.R, 4))
print('tool axis', fr.R[:, 2])
print('stock corner', fr.to_f([[-16.06, -81, -36], [16.06, 81, 101.5]]))
t = time.time()
g = Grid(fr, T, box_tris([-16.07, -81.01, -36], [16.07, 81.01, 0]), (-88, 88), (-8, 108), 0.05)
print('grid', g.nx, g.ny, time.time() - t)
print('floors', [round(f, 3) for f in floors_of(g)])
H = g.Hp
print('Hp range', H[H > -1e8].min(), H.max())
np.save('/home/paris/agent_ctc04/Hmx.npy', g.Hk.astype(np.float32))
