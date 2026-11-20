import trimesh, numpy as np
from shapely.geometry import Polygon
m = trimesh.load('brief/part.stl')
for z in [10, 21]:
    s = m.section(plane_origin=[0,0,z], plane_normal=[0,0,1]); P = s.to_2D(to_2D=np.eye(4))[0].polygons_full
    for p in P:
        print('z',z,'outer', np.round(np.array(p.exterior.simplify(0.05).coords),2).tolist())
        for h in p.interiors:
            print('  hole', np.round(np.array(Polygon(h).simplify(0.05).exterior.coords),2).tolist()[:40])
for y in [72.3, 73.05, 71.0]:
    s = m.section(plane_origin=[0,y,0], plane_normal=[0,1,0])
    T=np.array([[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1.]])
    P = s.to_2D(to_2D=T)[0].polygons_full
    for p in P: print('y',y,np.round(p.bounds,2),round(p.area,1),len(p.interiors))
    if y==72.3:
        for p in P:
            for h in p.interiors: print('  hole', np.round(Polygon(h).bounds,2), np.round(np.array(Polygon(h).simplify(0.02).exterior.coords),3).tolist())
