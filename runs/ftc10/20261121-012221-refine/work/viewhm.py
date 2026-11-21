import numpy as np, time, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from geom import *
OUT = '/mnt/c/Users/paris/AppData/Local/Temp/claude/594286e22a81bd8d/752c6114-cb25-4409-ada6-ba040a67e76b/scratchpad/ftc10/'
fig, axs = plt.subplots(1, 5, figsize=(30, 14))
for ax, k in zip(axs, ['TOP', 'MX', 'PX', 'MY', 'PY']):
    f = FR[k]; m = mesh_in(f); b = m.bounds
    res = 0.25
    x0, y0 = b[0, 0] - 3, b[0, 1] - 3
    nx = int((b[1, 0] - b[0, 0] + 6) / res) + 1; ny = int((b[1, 1] - b[0, 1] + 6) / res) + 1
    t = time.time(); H = zbuffer(m, x0, y0, nx, ny, res, fill=np.nan); print(k, time.time() - t, b)
    np.save(RUN + 'work/hm_%s.npy' % k, H)
    im = ax.imshow(H.T, origin='lower', extent=[x0, x0 + nx * res, y0, y0 + ny * res], cmap='viridis')
    ax.set_title(k + ' frame (x right, y up), color = frame z'); plt.colorbar(im, ax=ax, shrink=0.5); ax.grid(True, alpha=0.3)
    ax.set_xticks(np.arange(np.floor(x0 / 10) * 10, x0 + nx * res, 10)); ax.set_yticks(np.arange(np.floor(y0 / 10) * 10, y0 + ny * res, 10))
plt.tight_layout(); plt.savefig(OUT + 'hm.png', dpi=50)
