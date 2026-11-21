"""Voxel stock model (G54, 0.5 mm) with axis-aligned frame views."""
import numpy as np
import shapely
from shapely.geometry import box, Polygon
from shapely.ops import unary_union
from geom import setup

VR = 0.5


class Stock:
    def __init__(self):
        st = setup()['stock']
        lo = np.array(st['lo']); hi = np.array(st['hi'])
        self.lo = np.round(lo, 3); self.hi = np.round(hi, 3)
        self.n = np.round((self.hi - self.lo) / VR).astype(int)
        self.occ = np.ones(self.n, bool)
        self.c = [self.lo[i] + VR * (np.arange(self.n[i]) + 0.5) for i in range(3)]

    def view(self, f):
        """Return (A, cx, cy, cz): array view indexed [i,j,k] along frame x,y,z with ascending frame coords."""
        R = f.R; O = f.O
        A = self.occ
        perm = []; signs = []
        for fa in range(3):
            col = R[:, fa]
            ga = int(np.argmax(np.abs(col)))
            perm.append(ga); signs.append(np.sign(col[ga]))
        A = np.transpose(A, perm)
        coords = []
        sl = []
        for fa in range(3):
            ga = perm[fa]; s = signs[fa]
            cc = s * (self.c[ga] - O[ga])
            if s < 0:
                sl.append(slice(None, None, -1)); cc = cc[::-1]
            else:
                sl.append(slice(None))
            coords.append(cc)
        A = A[tuple(sl)]
        return A, coords[0], coords[1], coords[2]

    def slab_mask(self, f, w0, w1):
        A, cx, cy, cz = self.view(f)
        k = (cz >= w0) & (cz < w1)
        if not k.any():
            return np.zeros((len(cx), len(cy)), bool), cx, cy
        return A[:, :, k].any(axis=2), cx, cy

    def top_map(self, f):
        A, cx, cy, cz = self.view(f)
        anyv = A.any(axis=2)
        kk = A.shape[2] - 1 - np.argmax(A[:, :, ::-1], axis=2)
        top = np.where(anyv, cz[kk] + VR / 2, -1e9)
        return top, cx, cy

    def remove_above(self, f, mask2d, w):
        """Remove voxels with frame z >= w - small in columns of mask2d."""
        A, cx, cy, cz = self.view(f)
        k0 = int(np.searchsorted(cz, w - 0.1))
        ii, jj = np.nonzero(mask2d)
        if len(ii) and k0 < len(cz):
            A[ii, jj, k0:] = False

    def remove_env(self, f, env):
        """env: 2D array (frame columns) of lowest tool-bottom height; remove voxels above it."""
        A, cx, cy, cz = self.view(f)
        ii, jj = np.nonzero(env < 1e8)
        for i, j in zip(ii, jj):
            k0 = int(np.searchsorted(cz, env[i, j] - 0.05))
            A[i, j, k0:] = False


def mask_to_poly(mask, cx, cy, res=VR):
    rects = []
    for i in range(mask.shape[0]):
        row = mask[i]
        if not row.any():
            continue
        d = np.diff(np.r_[0, row.astype(np.int8), 0])
        s = np.nonzero(d == 1)[0]; e = np.nonzero(d == -1)[0]
        for a, b in zip(s, e):
            rects.append(box(cx[i] - res / 2, cy[a] - res / 2, cx[i] + res / 2, cy[b - 1] + res / 2))
    if not rects:
        return Polygon()
    return unary_union(rects).buffer(0)


def poly_to_mask(poly, cx, cy):
    X, Y = np.meshgrid(cx, cy, indexing='ij')
    if poly.is_empty:
        return np.zeros(X.shape, bool)
    return shapely.contains_xy(poly, X, Y)
