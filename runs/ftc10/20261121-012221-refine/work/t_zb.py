import time, numpy as np
from geom import *
m = mesh_in(FR['MX']); b = m.bounds; res = 0.05
x0, y0 = b[0, 0] - 6, b[0, 1] - 6
nx = int((b[1, 0] - b[0, 0] + 12) / res) + 1; ny = int((b[1, 1] - b[0, 1] + 12) / res) + 1
t = time.time(); H = zbuffer(m, x0, y0, nx, ny, res); print('zb', time.time() - t, H.shape, np.isfinite(H).sum())
