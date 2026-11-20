import trimesh, numpy as np
m = trimesh.load('brief/part.stl')
print(m.bounds, m.is_watertight, m.area)
def sec(z, o=(0,0), n=(0,0,1)):
    s = m.section(plane_origin=[o[0],o[1],z], plane_normal=n)
    return s
for z in [0.85, 1.0, 2.5, 10, 18.6, 21, 23.5]:
    s = sec(z); P = s.to_2D(to_2D=np.eye(4))[0].polygons_full
    print('z',z)
    for p in P:
        print('  ext', np.round(p.bounds,3), 'area', round(p.area,1), 'holes', len(p.interiors))
        if z==0.85:
            for h in p.interiors:
                from shapely.geometry import Polygon
                hp=Polygon(h); print('     hole', np.round(hp.bounds,2), round(hp.area,1), len(h.coords))
