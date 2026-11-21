import cadquery as cq, numpy as np, trimesh, time
W = '/home/paris/cnc-llm/runs/ftc10/20261121-012221-refine/'
t = time.time()
s = cq.importers.importStep(W + 'brief/part.step')
bb = s.val().BoundingBox(); print('step bbox', bb.xmin, bb.xmax, bb.ymin, bb.ymax, bb.zmin, bb.zmax)
cq.exporters.export(s, W + 'work/part_fine.stl', tolerance=0.01, angularTolerance=0.05)
m = trimesh.load(W + 'work/part_fine.stl')
print(len(m.faces), m.bounds, m.is_watertight, time.time() - t)
b = trimesh.load(W + 'brief/part.stl')
print('brief', len(b.faces), b.bounds, b.is_watertight)
for mm in (m, b):
    t = time.time(); s2 = mm.section(plane_origin=[0, 0, 80], plane_normal=[0, 0, 1]); print('sec', time.time() - t)
