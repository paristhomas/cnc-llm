import numpy as np, trimesh, os
from hm import Grid, heightmap, NEG
from shapely.geometry import LineString
RUN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def Rz(a):
    a = np.radians(a); c, s = np.cos(a), np.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
def Rx(a):
    a = np.radians(a); c, s = np.cos(a), np.sin(a)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])

FR = {  # name: (I,J,K)
    'TOP': (0, 0, 0),
    'MX': (-90, 90, 0),
    'PX': (90, 90, 0),
}
def R_of(name):
    I, J, K = FR[name]
    return Rz(I) @ Rx(J) @ Rz(K)

def to_frame(name, P):
    return np.asarray(P) @ R_of(name)   # origin = G54 0,0,0

_mesh = None
def mesh():
    global _mesh
    if _mesh is None:
        _mesh = trimesh.load(os.path.join(RUN, 'brief/part.stl'))
    return _mesh

def section0():
    m = mesh()
    s = m.section(plane_origin=[0, 0, 0.02], plane_normal=[0, 0, 1])
    P = s.to_2D(to_2D=np.eye(4))[0].polygons_full
    from shapely.ops import unary_union
    return unary_union(P).buffer(0)

GRIDS = {
    'TOP': (-30, 30, -95, 95),
    'MX': (-95, 95, -10, 92),
    'PX': (-95, 95, -10, 92),
}

def get_H(name, g=0.1):
    fn = os.path.join(RUN, 'work', f'H_{name}.npy')
    G = Grid(*GRIDS[name], g=g)
    if os.path.exists(fn):
        return G, np.load(fn)
    m = mesh()
    tris = to_frame(name, m.triangles.reshape(-1, 3)).reshape(-1, 3, 3)
    H = heightmap(tris, G)
    if name in ('MX', 'PX'):
        sec = section0()
        sgn = -1 if name == 'MX' else 1
        # u = -Y (MX) / Y (PX); v = Z
        for i, u in enumerate(G.u):
            Y = -u if name == 'MX' else u
            inter = sec.intersection(LineString([(-100, Y), (100, Y)]))
            if inter.is_empty:
                continue
            xs = np.array(inter.bounds)[[0, 2]]
            wv = -xs.min() if name == 'MX' else xs.max()
            sel = (G.v >= -16) & (G.v <= 0)
            H[sel, i] = np.maximum(H[sel, i], wv)
    np.save(fn, H)
    return G, H
