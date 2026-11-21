import pickle, sys, numpy as np, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection
W = '/home/paris/cnc-llm/runs/ftc10/20261121-012221-refine/work/'
OUT = '/mnt/c/Users/paris/AppData/Local/Temp/claude/594286e22a81bd8d/752c6114-cb25-4409-ada6-ba040a67e76b/scratchpad/ftc10/'
fr = sys.argv[1]; tools = [int(t) for t in sys.argv[2].split(',')]
rng = [float(v) for v in sys.argv[3].split(',')] if len(sys.argv) > 3 and sys.argv[3] != '-' else None
tag = sys.argv[4] if len(sys.argv) > 4 else ''
mv = pickle.load(open(W + 'moves.pkl', 'rb'))
H = np.load(W + 'hm_%s.npy' % fr)
fig, ax = plt.subplots(figsize=(10, 16))
import geom
m = geom.mesh_in(geom.FR[fr]); b = m.bounds
x0, y0 = b[0, 0] - 3, b[0, 1] - 3
ax.imshow(H.T, origin='lower', extent=[x0, x0 + H.shape[0] * 0.25, y0, y0 + H.shape[1] * 0.25], cmap='gray', alpha=0.6)
segs = []; cols = []
for f, t, k, p0, p1, i in mv:
    if f != fr or t not in tools:
        continue
    if rng and not (rng[0] <= max(p0[2], p1[2]) and min(p0[2], p1[2]) <= rng[1]):
        continue
    segs.append([p0[:2], p1[:2]]); cols.append('r' if k == 0 else 'b')
ax.add_collection(LineCollection(segs, colors=cols, linewidths=0.3))
ax.set_xlim(x0 - 10, x0 + H.shape[0] * 0.25 + 10); ax.set_ylim(y0 - 10, y0 + H.shape[1] * 0.25 + 10); ax.set_aspect('equal')
ax.set_title('%s tools %s z %s' % (fr, tools, rng))
plt.savefig(OUT + 'mv_%s_%s%s.png' % (fr, sys.argv[2].replace(',', '-'), tag), dpi=60)
