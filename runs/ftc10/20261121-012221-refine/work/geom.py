"""Geometry helpers: frames, mesh in frame coords, z-buffer heightmaps, sections (own code, no CAM libs)."""
import numpy as np, trimesh, json
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union

RUN = '/home/paris/cnc-llm/runs/ftc10/20261121-012221-refine/'


def rz(a):
    a = np.radians(a); c, s = np.cos(a), np.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1.0]])


def rx(a):
    a = np.radians(a); c, s = np.cos(a), np.sin(a)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])


class Frame:
    def __init__(self, name, I, J, K, origin=(0, 0, 0)):
        self.name = name; self.I, self.J, self.K = I, J, K
        self.R = rz(I) @ rx(J) @ rz(K)
        self.R[np.abs(self.R) < 1e-12] = 0
        self.O = np.array(origin, float)
        self.axis = self.R[:, 2]

    def to_f(self, p):
        return (np.asarray(p, float) - self.O) @ self.R

    def to_g(self, q):
        return np.asarray(q, float) @ self.R.T + self.O

    @property
    def tilted(self):
        return not (self.I == 0 and self.J == 0 and self.K == 0 and not self.O.any())


_mesh = None


def part_mesh():
    global _mesh
    if _mesh is None:
        m = trimesh.load(RUN + 'brief/part.stl')
        m.merge_vertices()
        _mesh = m
    return _mesh


def mesh_in(frame):
    m = part_mesh().copy()
    T = np.eye(4); T[:3, :3] = frame.R.T; T[:3, 3] = -frame.R.T @ frame.O
    m.apply_transform(T)
    return m


def zbuffer(mesh_f, x0, y0, nx, ny, res, fill=-1e9, tri=None):
    """Max frame-z of the part surface per pixel (pixel centres x0+i*res, y0+j*res). Scan rasteriser, grouped by size."""
    H = np.full(nx * ny, -np.inf)
    if tri is None:
        tri = mesh_f.triangles
    A = tri[:, 0]; B = tri[:, 1]; C = tri[:, 2]
    det = (B[:, 0] - A[:, 0]) * (C[:, 1] - A[:, 1]) - (C[:, 0] - A[:, 0]) * (B[:, 1] - A[:, 1])
    ok = np.abs(det) > 1e-12
    tri = tri[ok]; A = A[ok]; B = B[ok]; C = C[ok]; det = det[ok]
    xs = tri[:, :, 0]; ys = tri[:, :, 1]
    i0 = np.ceil((xs.min(1) - x0) / res - 1e-9).astype(int); i1 = np.floor((xs.max(1) - x0) / res + 1e-9).astype(int)
    j0 = np.ceil((ys.min(1) - y0) / res - 1e-9).astype(int); j1 = np.floor((ys.max(1) - y0) / res + 1e-9).astype(int)
    wi = np.maximum(i1 - i0 + 1, 0); wj = np.maximum(j1 - j0 + 1, 0)
    has = (wi > 0) & (wj > 0)
    buckets = np.array([1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 2048, 4096, 8192])
    bi_ = np.searchsorted(buckets, wi); bj_ = np.searchsorted(buckets, wj)
    for bi in np.unique(bi_[has]):
        for bj in np.unique(bj_[has & (bi_ == bi)]):
            sel = np.where(has & (bi_ == bi) & (bj_ == bj))[0]
            if len(sel) == 0:
                continue
            _zb_block(H, sel, int(buckets[bi]), int(buckets[bj]), i0, j0, i1, j1, A, B, C, det, x0, y0, res, nx, ny)
    H = H.reshape(nx, ny)
    H[~np.isfinite(H)] = fill
    return H


def _zb_block(H, sel, bki, bkj, i0, j0, i1, j1, A, B, C, det, x0, y0, res, nx, ny):
    if True:
        di, dj = np.meshgrid(np.arange(bki), np.arange(bkj), indexing='ij'); di = di.ravel(); dj = dj.ravel()
        chunk = max(1, 4000000 // (bki * bkj))
        for c0 in range(0, len(sel), chunk):
            s = sel[c0:c0 + chunk]
            I = i0[s, None] + di[None, :]; J = j0[s, None] + dj[None, :]
            px = x0 + I * res; py = y0 + J * res
            a = A[s]; b = B[s]; c = C[s]; d = det[s][:, None]
            l1 = ((px - a[:, None, 0]) * (c[:, None, 1] - a[:, None, 1]) - (c[:, None, 0] - a[:, None, 0]) * (py - a[:, None, 1])) / d
            l2 = ((b[:, None, 0] - a[:, None, 0]) * (py - a[:, None, 1]) - (px - a[:, None, 0]) * (b[:, None, 1] - a[:, None, 1])) / d
            inside = (l1 >= -1e-9) & (l2 >= -1e-9) & (l1 + l2 <= 1 + 1e-9) & (I <= i1[s, None]) & (J <= j1[s, None]) & (I >= 0) & (I < nx) & (J >= 0) & (J < ny)
            z = a[:, None, 2] + l1 * (b[:, None, 2] - a[:, None, 2]) + l2 * (c[:, None, 2] - a[:, None, 2])
            idx = (I * ny + J)[inside]; zz = z[inside]
            if len(idx):
                o = np.lexsort((zz, idx)); idx = idx[o]; zz = zz[o]
                last = np.r_[idx[1:] != idx[:-1], True]
                H[idx[last]] = np.maximum(H[idx[last]], zz[last])


def section(mesh_f, z):
    s = mesh_f.section(plane_origin=[0, 0, z], plane_normal=[0, 0, 1])
    if s is None:
        return Polygon()
    p2, _ = s.to_2D(to_2D=np.eye(4))
    polys = [p.buffer(0) for p in p2.polygons_full]
    if not polys:
        return Polygon()
    return unary_union(polys)


def faces():
    return json.load(open(RUN + 'brief/faces.json'))


def setup():
    return json.load(open(RUN + 'brief/setup.json'))


FR = {
    'TOP': Frame('TOP', 0, 0, 0),
    'MX': Frame('MX', -90, 90, 0),   # tool from -X
    'PX': Frame('PX', 90, 90, 0),    # tool from +X
    'MY': Frame('MY', 0, 90, 0),     # tool from -Y
    'PY': Frame('PY', 180, 90, 0),   # tool from +Y
}

if __name__ == '__main__':
    for k, f in FR.items():
        print(k, 'axis', f.axis, '\nR=\n', f.R)
