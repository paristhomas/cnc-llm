"""Heightmap + drop-cutter utilities (own code; numpy/scipy/shapely/trimesh only for geometry)."""
import numpy as np
from scipy.ndimage import maximum_filter1d

NEG = -1e6


class Grid:
    def __init__(self, u0, u1, v0, v1, g=0.1):
        self.g = g
        self.u0, self.v0 = u0, v0
        self.nu = int(round((u1 - u0) / g)) + 1
        self.nv = int(round((v1 - v0) / g)) + 1
        self.u = u0 + g * np.arange(self.nu)
        self.v = v0 + g * np.arange(self.nv)

    def iu(self, u):
        return np.clip(np.round((np.asarray(u) - self.u0) / self.g).astype(int), 0, self.nu - 1)

    def iv(self, v):
        return np.clip(np.round((np.asarray(v) - self.v0) / self.g).astype(int), 0, self.nv - 1)


def _scatter(H, G, u, v, w):
    iu = np.round((u - G.u0) / G.g).astype(np.int64)
    iv = np.round((v - G.v0) / G.g).astype(np.int64)
    ok = (iu >= 0) & (iu < G.nu) & (iv >= 0) & (iv < G.nv)
    idx = iv[ok] * G.nu + iu[ok]
    np.maximum.at(H.ravel(), idx, w[ok].astype(np.float32))


def heightmap(tris, G):
    """tris: (N,3,3) in frame coords (u,v,w). Returns H[nv,nu] = max w."""
    H = np.full((G.nv, G.nu), NEG, np.float32)
    g = G.g
    # vertices
    P = tris.reshape(-1, 3)
    _scatter(H, G, P[:, 0], P[:, 1], P[:, 2])
    # edges sampled at <= 0.4 g
    for a, b in ((0, 1), (1, 2), (2, 0)):
        A, B = tris[:, a], tris[:, b]
        L = np.linalg.norm((B - A)[:, :2], axis=1)
        n = np.ceil(L / (0.4 * g)).astype(int)
        sel = n > 1
        A, B, n = A[sel], B[sel], n[sel]
        # bucket by n
        for nn in np.unique(np.minimum(n, 4096)):
            m = np.minimum(n, 4096) == nn
            t = (np.arange(1, nn) / nn)[None, :, None]
            S = A[m][:, None, :] + t * (B[m] - A[m])[:, None, :]
            S = S.reshape(-1, 3)
            for k in range(0, len(S), 5_000_000):
                s = S[k:k + 5_000_000]
                _scatter(H, G, s[:, 0], s[:, 1], s[:, 2])
    # interior cell centres for triangles whose bbox spans > 1 cell
    uv = tris[:, :, :2]
    lo = np.floor((uv.min(1) - [G.u0, G.v0]) / g).astype(int)
    hi = np.ceil((uv.max(1) - [G.u0, G.v0]) / g).astype(int)
    span = hi - lo + 1
    big = (span[:, 0] > 2) | (span[:, 1] > 2)
    idxs = np.nonzero(big)[0]
    # bucket by span
    su = np.minimum(span[idxs, 0], 20000)
    sv = np.minimum(span[idxs, 1], 20000)
    keyu = 2 ** np.ceil(np.log2(su)).astype(int)
    keyv = 2 ** np.ceil(np.log2(sv)).astype(int)
    for ku in np.unique(keyu):
        for kv in np.unique(keyv[keyu == ku]):
            sel = idxs[(keyu == ku) & (keyv == kv)]
            per = ku * kv
            chunk = max(1, 4_000_000 // per)
            ou, ov = np.meshgrid(np.arange(ku), np.arange(kv))
            ou = ou.ravel()
            ov = ov.ravel()
            for c in range(0, len(sel), chunk):
                s = sel[c:c + chunk]
                T = tris[s]
                cu = G.u0 + g * (lo[s, 0][:, None] + ou[None, :])
                cv = G.v0 + g * (lo[s, 1][:, None] + ov[None, :])
                a, b, cc = T[:, 0], T[:, 1], T[:, 2]
                v0x = (b - a)[:, 0][:, None]; v0y = (b - a)[:, 1][:, None]
                v1x = (cc - a)[:, 0][:, None]; v1y = (cc - a)[:, 1][:, None]
                px = cu - a[:, 0][:, None]; py = cv - a[:, 1][:, None]
                den = v0x * v1y - v1x * v0y
                good = np.abs(den) > 1e-12
                den = np.where(good, den, 1.0)
                l1 = (px * v1y - v1x * py) / den
                l2 = (v0x * py - px * v0y) / den
                ins = good & (l1 >= -1e-9) & (l2 >= -1e-9) & (l1 + l2 <= 1 + 1e-9)
                w = a[:, 2][:, None] + l1 * (b - a)[:, 2][:, None] + l2 * (cc - a)[:, 2][:, None]
                _scatter(H, G, cu[ins], cv[ins], w[ins])
    return H


def shift_max(T, A, du, dv, sub=0.0):
    """T[v,u] = max(T, A[v+dv,u+du] - sub) with NEG padding."""
    nv, nu = A.shape
    if abs(du) >= nu or abs(dv) >= nv:
        return
    sv_src = slice(max(dv, 0), nv + min(dv, 0))
    sv_dst = slice(max(-dv, 0), nv + min(-dv, 0))
    su_src = slice(max(du, 0), nu + min(du, 0))
    su_dst = slice(max(-du, 0), nu + min(-du, 0))
    np.maximum(T[sv_dst, su_dst], A[sv_src, su_src] - sub, out=T[sv_dst, su_dst])


def tip_flat(H, g, R):
    r = R / g + 1e-6
    ri = int(np.floor(r))
    T = np.full_like(H, NEG)
    for dv in range(-ri, ri + 1):
        w = int(np.floor(np.sqrt(max(r * r - dv * dv, 0))))
        rm = maximum_filter1d(H, size=2 * w + 1, axis=1, mode='constant', cval=NEG)
        shift_max(T, rm, 0, dv)
    return T


def tip_ball(H, g, R):
    r = R / g
    ri = int(np.floor(r))
    T = np.full_like(H, NEG)
    for dv in range(-ri, ri + 1):
        for du in range(-ri, ri + 1):
            d2 = (du * du + dv * dv) * g * g
            if d2 > R * R:
                continue
            sub = R - np.sqrt(R * R - d2)
            shift_max(T, H, du, dv, np.float32(sub))
    return T


def tip_map(H, g, kind, R, allow=0.0):
    if allow > 0:
        Hd = H + np.float32(allow)
        Hd[H <= NEG / 2] = NEG
    else:
        Hd = H
    if kind == 'flat':
        T = tip_flat(Hd, g, R + allow)
    else:
        T = tip_ball(Hd, g, R + allow) + 0.0
        if allow > 0:
            T = T - 0  # ball of radius R+a over H+a: tip ok
    return T
