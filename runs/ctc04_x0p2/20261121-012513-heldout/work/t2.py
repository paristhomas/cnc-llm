import sys
sys.path.insert(0, '/home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/work')
import numpy as np, trimesh, math
from cam import Frame
B = '/home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/brief/'
m = trimesh.load(B + 'part.stl')
nrm = np.array([-0.9272, 0.3746, 0.0]); nrm /= np.linalg.norm(nrm)
Ie = math.degrees(math.atan2(nrm[0], -nrm[1]))
F2 = Frame(Ie, 90, 0, (-3.5002, -39.391, 50.0))
fn = m.face_normals
sel = (fn @ nrm) > 0.9999
V = m.vertices[m.faces[sel]].reshape(-1, 3)
f = F2.to_f(V)
print('face verts frame z: min %.4f max %.4f n=%d' % (f[:, 2].min(), f[:, 2].max(), len(f)))
print('xy range', f[:, :2].min(0), f[:, :2].max(0))
c = V[:, 0] < -0.9
g = f[c]
print('ear verts z: min %.4f max %.4f' % (g[:, 2].min(), g[:, 2].max()))
print(np.percentile(g[:, 2], [5, 50, 95]))
