import time, numpy as np
from geom import *
from shapely.ops import unary_union
m = mesh_in(FR['MX'])
t = time.time()
ss = [section(m, z) for z in np.arange(10.013, 9.0, -0.1)]
print('10 sections', time.time() - t, [len(s.geoms) if hasattr(s, 'geoms') else 1 for s in ss][:3])
print('verts', [shapely.get_num_coordinates(s) for s in ss][:3])
t = time.time()
cur = ss[0]
for s in ss[1:]:
    cur = unary_union([cur, s])
print('unions', time.time() - t, shapely.get_num_coordinates(cur))
