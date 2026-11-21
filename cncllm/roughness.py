"""Kinematic (geometric) surface roughness of a simulated machined surface.

WHAT THIS IS: the roughness an ideal machine with ideal tools leaves - scallops/cusps between ball and bull-nose passes,
step marks, flat-end witness marks, chord facets of linearised arcs and polylines - measured on the exact swept-volume
workpiece of the simulator (grid-free point queries `inside(P)`).
WHAT THIS IS NOT: it does NOT include vibration/chatter, tool and part deflection, tool wear, runout, built-up edge,
tooth-pass (feed-per-tooth) marks (the simulator sweeps solids of revolution), material tearing or a stylus tip. A real
part measured with a profilometer will read HIGHER than these values; treat them as a lower bound.

Method (per patch, ISO 4287 / ISO 16610-21 style, profile method):
  * patch centres: probes of the target thinned per B-rep face on a voxel grid (one centre per `spacing`^2 of surface);
  * local frame: a quadratic fitted to the target probes of the same face around the centre gives a smooth normal n0,
    the curvature (limits the profile length so the profile slope stays <= ~31 deg) and a height seed;
  * the free room on the face: profiles must stay inside the disc that reaches the face's boundary (minus a margin), so
    no profile crosses a B-rep edge;
  * lay detection: four short profiles (0/45/90/135 deg) -> direction of maximum height variance (= across the lay);
  * two profiles, across and along the lay, are traced as parallel rays along n0 from points of the tangent plane; the
    machined height along each ray is found by bisection on the exact `inside` (resolution ~0.015 um). The heights are
    the MACHINED surface itself (the faceted target mesh is only used for seeding, so its 4 um chord facets do not
    enter the result);
  * form removal: 4th-order least-squares polynomial in the profile plane, residuals taken normal to the form and
    resampled uniformly in arc length (P profile); ISO 16610-21 Gaussian filter (truncated at +-lc/2) gives the mean
    line (W profile); roughness R = P - W, evaluated over the traced length minus lc/2 at each end;
  * cut-off by room available: lc = 0.8 mm (traced 2.4 .. 4.0 mm, dx 5 um) or lc = 0.25 mm (traced 0.75 .. 1.5 mm,
    dx 2.5 um); smaller room -> no profile. The curvature used for the length limit comes from a quadratic fitted
    over up to 2.5 mm, which over-estimates the curvature of small radii (r <~ 3 mm): profiles there are shorter
    than necessary (conservative; more of them fall in the lc 0.25 tier, which under-reads marks coarser than
    ~0.25 mm - see Pa). Patches with no room (near face edges) are represented by the nearest patch of the same
    face; faces with no patch at all are reported as not evaluated;
  * parameters: Ra, Rq, Rz (mean over the sampling lengths of the peak-to-valley), Rt (whole evaluation length),
    Pa/Pt (form removed, unfiltered) and Wt; the patch value is the max over the two directions (normally across lay).
    Pa >> Ra flags marks coarser than lc (e.g. step-downs >= ~1 mm), which the lc filter classes as waviness.
"""
from __future__ import annotations

import math
import time

import numpy as np
from scipy.spatial import cKDTree

CAVEAT = ("KINEMATIC (GEOMETRIC) ROUGHNESS ONLY: what an ideal machine with ideal, rigid, sharp tools leaves "
          "(scallops between passes, step marks, flat-end witness marks, chord facets). NOT included: vibration/chatter, "
          "tool or part deflection, tool wear, runout, built-up edge, tooth-pass (feed-per-tooth) marks, material "
          "tearing. A real part will measure rougher; read these numbers as a lower bound.")
ALPHA = math.sqrt(math.log(2) / math.pi)
N_GRADES = [(0.025, "N1"), (0.05, "N2"), (0.1, "N3"), (0.2, "N4"), (0.4, "N5"), (0.8, "N6"), (1.6, "N7"),
            (3.2, "N8"), (6.3, "N9"), (12.5, "N10"), (25.0, "N11"), (50.0, "N12")]
REASONS = {0: "ok", 1: "face too small for a profile", 2: "tab witness", 3: "out of tolerance (unfinished / gouge)",
           4: "no machined surface found along the profile"}
TIERS = [  # lc (mm), min traced, max traced, dx (mm)
    (0.8, 2.4, 4.0, 0.005),
    (0.25, 0.75, 1.5, 0.0025),
]
EDGE_MARGIN = 0.05
SLOPE_LIM = 0.6          # max |kappa| * half-length (profile slope <= ~31 deg)
STAR_LEN = 0.6
STAR_DX = 0.01


def n_grade(ra):
    for v, g in N_GRADES:
        if ra <= v * 1.0001:
            return g
    return ">N12"


# ------------------------------------------------------------------ surfaces (inside + owning move)
class SimSurface:
    """Adapter around a simulator workpiece: exact inside() and the move that forms the surface at a point."""

    def __init__(self, wp, M=None):
        self.wp = wp
        self.M = M
        self.kind = "wp5" if hasattr(wp, "frames") else ("wp3" if hasattr(wp, "heights") else "fn")
        if self.kind == "wp5" and M is not None:
            Ma = M[M[:, 6] > 0]
            self.subs = [Ma[Ma[:, 12] == k] for k in np.unique(Ma[:, 12]).astype(int)] if len(Ma) else []

    def inside(self, P):
        return self.wp.inside(P) if self.kind != "fn" else self.wp(P)

    def owner(self, P):
        """(tool, line, frame) of the move whose swept volume forms the surface at P (-1 where unknown)."""
        n = len(P)
        tool, line, frame = np.full(n, -1), np.full(n, -1), np.full(n, -1)
        if self.M is None or self.kind == "fn":
            return tool, line, frame
        if self.kind == "wp3":
            h, who = self.wp.heights(P[:, 0], P[:, 1])
            ok = who >= 0
            tool[ok] = self.M[who[ok], 6]
            line[ok] = self.M[who[ok], 10]
            frame[ok] = 0
            return tool, line, frame
        best = np.full(n, -np.inf)
        for fi, (R, o, fs) in enumerate(self.wp.frames):
            q = (P - o) @ R
            h, who = fs.heights(q[:, 0], q[:, 1])
            v = q[:, 2] - h
            b = v > best
            best[b] = v[b]
            sub = self.subs[fi]
            ok = b & (who >= 0)
            tool[b], line[b], frame[b] = -1, -1, fi
            tool[ok] = sub[who[ok], 6]
            line[ok] = sub[who[ok], 10]
        return tool, line, frame


def surface_heights(inside, S, D, w0, half=0.03, wide=0.3, iters=12, chunk=1_000_000):
    """Height w along unit rays S + w D where the material ends (inside below, outside above), searched around w0.
    Returns (w, ok). Bisection on the exact inside(): +-half bracket (iters steps), failures retried on +-wide."""
    n = len(S)
    w = np.full(n, np.nan)
    ok = np.zeros(n, bool)
    for s in range(0, n, chunk):
        sl = slice(s, min(n, s + chunk))
        Ss, Ds, ws = S[sl], D[sl], w0[sl]
        lo, hi = ws - half, ws + half
        good = inside(Ss + Ds * lo[:, None]) & ~inside(Ss + Ds * hi[:, None])
        bad = np.where(~good)[0]
        if len(bad):
            lo2, hi2 = ws[bad] - wide, ws[bad] + wide
            g2 = inside(Ss[bad] + Ds[bad] * lo2[:, None]) & ~inside(Ss[bad] + Ds[bad] * hi2[:, None])
            k = bad[g2]
            lo[k], hi[k] = lo2[g2], hi2[g2]
            # extra bisection steps for the wide bracket so the final resolution matches
            extra = int(math.ceil(math.log2(wide / half)))
            for _ in range(extra):
                m = (lo[k] + hi[k]) / 2
                r = inside(Ss[k] + Ds[k] * m[:, None])
                lo[k] = np.where(r, m, lo[k])
                hi[k] = np.where(r, hi[k], m)
            good[k] = True
        idx = np.where(good)[0]
        a, b = lo[idx], hi[idx]
        for _ in range(iters):
            m = (a + b) / 2
            r = inside(Ss[idx] + Ds[idx] * m[:, None])
            a = np.where(r, m, a)
            b = np.where(r, b, m)
        ww = np.full(len(Ss), np.nan)
        ww[idx] = (a + b) / 2
        w[sl] = ww
        ok[sl] = good
    return w, ok


# ------------------------------------------------------------------ profile evaluation
def gaussian_kernel(lc, dx):
    k = int(round(0.5 * lc / dx))
    x = np.arange(-k, k + 1) * dx
    g = np.exp(-math.pi * (x / (ALPHA * lc)) ** 2)
    return g / g.sum(), k


def eval_profile(u, w, lc, dx):
    """Roughness parameters of a traced profile (u along the trace, w = height along the fixed ray direction, mm).
    Returns a dict in um (and the dominant mark pitch in mm)."""
    sc = max(np.abs(u).max(), 1e-9)
    c = np.polynomial.polynomial.polyfit(u / sc, w, 4)
    f = np.polynomial.polynomial.polyval(u / sc, c)
    fp = np.polynomial.polynomial.polyval(u / sc, np.polynomial.polynomial.polyder(c)) / sc
    cos = 1.0 / np.sqrt(1.0 + fp * fp)
    r = (w - f) * cos                                         # normal residual from the form
    s = np.r_[0.0, np.cumsum(np.sqrt(np.diff(u) ** 2 + np.diff(f) ** 2))]
    ns = int(s[-1] / dx) + 1
    su = np.arange(ns) * dx
    p = np.interp(su, s, r)                                   # primary profile, uniform in arc length
    g, k = gaussian_kernel(lc, dx)
    if ns <= 2 * k + 4:
        return None
    wl = np.convolve(p, g, mode="valid")                      # mean line on [k, ns-k)
    pe = p[k:ns - k]
    rr = pe - wl
    rr -= rr.mean()
    L = len(rr) * dx
    nsl = max(1, int(round(L / lc)))
    seg = np.array_split(rr, nsl)
    rz = float(np.mean([q.max() - q.min() for q in seg]))
    pe0 = pe - pe.mean()
    # dominant pitch of the roughness profile
    spec = np.abs(np.fft.rfft(rr * np.hanning(len(rr)))) ** 2
    fr = np.fft.rfftfreq(len(rr), dx)
    sel = (fr > 1.0 / lc) & (fr < 1.0 / (10 * dx))
    pitch = float(1.0 / fr[sel][np.argmax(spec[sel])]) if sel.any() else float("nan")
    return {"Ra": 1e3 * float(np.abs(rr).mean()), "Rq": 1e3 * float(np.sqrt((rr ** 2).mean())), "Rz": 1e3 * rz,
            "Rt": 1e3 * float(rr.max() - rr.min()), "Pa": 1e3 * float(np.abs(pe0).mean()),
            "Pt": 1e3 * float(pe0.max() - pe0.min()), "Wt": 1e3 * float(wl.max() - wl.min()), "pitch": pitch,
            "eval_mm": L, "nsl": nsl, "slope_max_deg": float(np.degrees(np.arccos(cos.min())))}


def cusp_reference(R, s, n=200001):
    """Exact Ra, Rz (=Rt) of an ideal circular-arc cusp profile (ball radius R, stepover s), in the same units as R.
    h = R - sqrt(R^2 - (s/2)^2); for s << R, Ra -> 4/(9 sqrt 3) h = 0.2566 h."""
    x = np.linspace(-s / 2, s / 2, n)
    z = R - np.sqrt(R * R - x * x)
    h = R - math.sqrt(R * R - (s / 2) ** 2)
    return {"h": h, "Ra": float(np.abs(z - z.mean()).mean()), "Rz": h, "Ra_over_h_small_s": 4 / (9 * math.sqrt(3))}


# ------------------------------------------------------------------ target geometry helpers
def face_boundaries(V, F, TF, step=0.05):
    """Per B-rep face: points sampled along its mesh boundary edges -> {face: cKDTree}."""
    trees = {}
    for f in np.unique(TF):
        tri = F[TF == f]
        e = np.sort(np.concatenate([tri[:, [0, 1]], tri[:, [1, 2]], tri[:, [2, 0]]]), axis=1)
        ue, cnt = np.unique(e, axis=0, return_counts=True)
        be = ue[cnt == 1]
        if not len(be):
            continue
        a, b = V[be[:, 0]], V[be[:, 1]]
        ln = np.linalg.norm(b - a, axis=1)
        m = np.maximum(1, np.ceil(ln / step).astype(int))
        tt = np.concatenate([np.arange(k) / k for k in m])
        rep = np.repeat(np.arange(len(be)), m)
        pts = a[rep] + (b[rep] - a[rep]) * tt[:, None]
        trees[int(f)] = cKDTree(pts)
    return trees


def choose_centres(P, pface, spacing, seed=0):
    """One probe per (face, voxel of size `spacing`): the probe nearest the voxel's probe mean."""
    key = np.floor(P / spacing).astype(np.int64)
    key = np.c_[pface.astype(np.int64), key]
    _, inv = np.unique(key, axis=0, return_inverse=True)
    inv = inv.ravel()
    ng = inv.max() + 1
    cnt = np.bincount(inv, minlength=ng)
    mean = np.stack([np.bincount(inv, P[:, j], ng) for j in range(3)], 1) / cnt[:, None]
    d = np.linalg.norm(P - mean[inv], axis=1)
    order = np.lexsort((d, inv))
    first = np.r_[True, inv[order][1:] != inv[order][:-1]]
    return np.sort(order[first])


def _frame(n):
    a = np.where(np.abs(n[:, 0:1]) < 0.9, np.array([[1.0, 0, 0]]), np.array([[0, 1.0, 0]]))
    e1 = np.cross(n, a)
    e1 /= np.linalg.norm(e1, axis=1, keepdims=True)
    e2 = np.cross(n, e1)
    return e1, e2


def local_fits(P, N, pface, parea, ci, redge):
    """Smooth normal, tangent frame, quadratic height coefficients (w = a + b u + c v + d u^2 + e uv + f v^2) and max
    |normal curvature| at each centre, from the target probes of the same face within a radius."""
    nC = len(ci)
    n0 = N[ci].astype(float).copy()
    coef = np.zeros((nC, 6))
    kmax = np.zeros(nC)
    order = np.argsort(pface, kind="stable")
    bounds = np.searchsorted(pface[order], np.arange(pface.max() + 2))
    for f in np.unique(pface[ci]):
        pid = order[bounds[f]:bounds[f + 1]]
        tree = cKDTree(P[pid])
        for j in np.where(pface[ci] == f)[0]:
            c = P[ci[j]]
            rad = float(np.clip(redge[j], 0.6, 2.5))
            nb = pid[tree.query_ball_point(c, rad)]
            if len(nb) < 3:
                continue
            nn = (N[nb] * parea[nb, None]).sum(0)
            nn /= np.linalg.norm(nn)
            for _ in range(2):
                e1, e2 = _frame(nn[None])
                e1, e2 = e1[0], e2[0]
                d = P[nb] - c
                uu, vv, ww = d @ e1, d @ e2, d @ nn
                if len(nb) >= 10:
                    A = np.c_[np.ones_like(uu), uu, vv, uu * uu, uu * vv, vv * vv]
                else:
                    A = np.c_[np.ones_like(uu), uu, vv, 0 * uu, 0 * uu, 0 * uu]
                cf = np.linalg.lstsq(A, ww, rcond=None)[0]
                nn2 = nn - cf[1] * e1 - cf[2] * e2
                nn = nn2 / np.linalg.norm(nn2)
            e1, e2 = _frame(nn[None])
            d = P[nb] - c
            uu, vv, ww = d @ e1[0], d @ e2[0], d @ nn
            if len(nb) >= 10:
                A = np.c_[np.ones_like(uu), uu, vv, uu * uu, uu * vv, vv * vv]
                cf = np.linalg.lstsq(A, ww, rcond=None)[0]
            else:
                cf = np.r_[np.linalg.lstsq(np.c_[np.ones_like(uu), uu, vv], ww, rcond=None)[0], 0, 0, 0]
            n0[j], coef[j] = nn, cf
            Hs = np.array([[2 * cf[3], cf[4]], [cf[4], 2 * cf[5]]])
            kmax[j] = np.abs(np.linalg.eigvalsh(Hs)).max()
    e1, e2 = _frame(n0)
    return n0, e1, e2, coef, kmax


def _seed(coef, u, v):
    return coef[0] + coef[1] * u + coef[2] * v + coef[3] * u * u + coef[4] * u * v + coef[5] * v * v


# ------------------------------------------------------------------ main measurement
def measure(surface, V, F, TF, P, N, pface, parea, spacing=1.8, witness=None, dev=None, tol=0.1, centres=None,
            batch_points=1_500_000, verbose=True, face_types=None):
    """Roughness patches over the target. `surface` is a SimSurface (or anything with inside()/owner()).
    witness/dev: per-probe tab-witness mask and signed deviation (mm) for the validity flags."""
    t0 = time.time()
    P = np.asarray(P, float)
    N = np.asarray(N, float)
    ci = choose_centres(P, pface, spacing) if centres is None else np.asarray(centres)
    nC = len(ci)
    C = P[ci]
    cf = pface[ci]
    trees = face_boundaries(V, F, TF)
    redge = np.array([trees[int(f)].query(c)[0] if int(f) in trees else 1e9 for c, f in zip(C, cf)])
    n0, e1, e2, coef, kmax = local_fits(P, N, pface, parea, ci, redge)
    t_fit = time.time() - t0
    half_avail = np.minimum(0.95 * (redge - EDGE_MARGIN), SLOPE_LIM / np.maximum(kmax, 1e-9))
    avail = 2 * half_avail
    lc = np.zeros(nC)
    L = np.zeros(nC)
    dx = np.zeros(nC)
    for lc_, lmin, lmax, dx_ in reversed(TIERS):
        ok = avail >= lmin
        lc[ok], dx[ok] = lc_, dx_
        L[ok] = np.minimum(lmax, np.floor(avail[ok] / lc_ + 1e-9) * lc_)
    reason = np.where(L > 0, 0, 1).astype(np.int8)
    # validity from probes around the patch (same face, within the traced half-length)
    if witness is not None or dev is not None:
        tree = cKDTree(P)
        for j in np.where(reason == 0)[0]:
            nb = np.array(tree.query_ball_point(C[j], max(L[j] / 2, 0.3)), int)
            nb = nb[pface[nb] == cf[j]]
            if witness is not None and witness[nb].any():
                reason[j] = 2
            elif dev is not None and (np.abs(dev[nb]) > tol).any():
                reason[j] = 3
    meas = np.where((reason == 0) | (reason == 3))[0]       # out-of-tolerance patches are traced too (not scored)
    # ---- 1. lay detection (star of 4 short profiles)
    angs = np.radians([0.0, 45.0, 90.0, 135.0])
    lay = np.zeros(nC)
    aniso = np.zeros(nC)
    star_fail = np.zeros(nC, bool)
    pts_total = 0
    per = int(STAR_LEN / STAR_DX) + 1
    bsz = max(1, batch_points // (4 * per))
    for s in range(0, len(meas), bsz):
        J = meas[s:s + bsz]
        sl = np.minimum(STAR_LEN, L[J]) / 2
        tt = np.linspace(-1, 1, per)
        U = sl[:, None, None] * tt[None, None, :] * np.cos(angs)[None, :, None]   # (j, a, k)
        Vv = sl[:, None, None] * tt[None, None, :] * np.sin(angs)[None, :, None]
        W0 = _seed(coef[J][:, :, None, None].transpose(1, 0, 2, 3), U, Vv)
        S = (C[J][:, None, None, :] + U[..., None] * e1[J][:, None, None, :] + Vv[..., None] * e2[J][:, None, None, :])
        D = np.broadcast_to(n0[J][:, None, None, :], S.shape)
        w, ok = surface_heights(surface.inside, S.reshape(-1, 3), np.ascontiguousarray(D.reshape(-1, 3)),
                                np.zeros(S[..., 0].size) + W0.reshape(-1))
        pts_total += len(w)
        w = w.reshape(len(J), 4, per)
        ok = ok.reshape(len(J), 4, per)
        var = np.zeros((len(J), 4))
        for a in range(4):
            for jj in range(len(J)):
                if not ok[jj, a].all():
                    star_fail[J[jj]] = True
                    continue
                x = tt * sl[jj]
                cfp = np.polynomial.polynomial.polyfit(x, w[jj, a], 2)
                var[jj, a] = np.var(w[jj, a] - np.polynomial.polynomial.polyval(x, cfp))
        lay[J] = 0.5 * np.arctan2(var[:, 1] - var[:, 3], var[:, 0] - var[:, 2])
        aniso[J] = np.hypot(var[:, 1] - var[:, 3], var[:, 0] - var[:, 2]) / np.maximum(var.sum(1) / 2, 1e-30)
    t_star_abs = time.time()
    t_star = t_star_abs - t0
    # ---- 2. two full profiles: across the lay (max variance) and along it
    res = {k: np.full((nC, 2), np.nan) for k in ("Ra", "Rq", "Rz", "Rt", "Pa", "Pt", "Wt", "pitch", "slope_max_deg")}
    eval_mm = np.zeros(nC)
    nsl = np.zeros(nC, np.int16)
    dirs = np.zeros((nC, 2, 3), np.float32)
    tool_c = np.full(nC, -1)
    line_c = np.full(nC, -1)
    frame_c = np.full(nC, -1)
    tool_mode = np.full(nC, -1)
    n_lines = np.zeros(nC, np.int32)
    tools_seen = [[] for _ in range(nC)]
    dev_c = np.full(nC, np.nan)
    npts = np.where(dx > 0, np.rint(L / np.where(dx > 0, dx, 1)), 0).astype(int) + 1
    s = 0
    while s < len(meas):
        acc, e = 0, s
        while e < len(meas) and (acc == 0 or acc + 2 * npts[meas[e]] <= batch_points):
            acc += 2 * npts[meas[e]]
            e += 1
        J = meas[s:e]
        s = e
        Ss, W0s, Ds = [], [], []
        for j in J:
            th = (lay[j], lay[j] + math.pi / 2)
            uu = (np.arange(npts[j]) - (npts[j] - 1) / 2) * dx[j]
            for d_i, a in enumerate(th):
                t = math.cos(a) * e1[j] + math.sin(a) * e2[j]
                dirs[j, d_i] = t
                pu, pv = uu * math.cos(a), uu * math.sin(a)
                Ss.append(C[j] + uu[:, None] * t)
                W0s.append(_seed(coef[j], pu, pv))
                Ds.append(np.broadcast_to(n0[j], (len(uu), 3)))
        S = np.concatenate(Ss)
        D = np.ascontiguousarray(np.concatenate(Ds))
        W0 = np.concatenate(W0s)
        w, ok = surface_heights(surface.inside, S, D, W0)
        pts_total += len(w)
        Q = S + D * np.where(ok, w, W0)[:, None]
        k0 = 0
        # owners on the across-lay profiles (tool / line / frame forming the surface)
        own_idx = []
        kk = 0
        for j in J:
            own_idx.append(np.arange(kk, kk + npts[j]))
            kk += 2 * npts[j]
        oi = np.concatenate(own_idx)
        tool_o, line_o, frame_o = surface.owner(Q[oi] - D[oi] * 2e-5)
        ko = 0
        for j in J:
            m = npts[j]
            mid = (m - 1) // 2
            for d_i in range(2):
                ww, okk = w[k0:k0 + m], ok[k0:k0 + m]
                if d_i == 0:
                    dev_c[j] = float(ww[mid]) if okk[mid] else np.nan
                if okk.all():
                    r = eval_profile((np.arange(m) - (m - 1) / 2) * dx[j], ww, lc[j], dx[j])
                    if r is not None:
                        for key in res:
                            res[key][j, d_i] = r[key]
                        eval_mm[j], nsl[j] = r["eval_mm"], r["nsl"]
                k0 += m
            tl, ln, fr = tool_o[ko:ko + m], line_o[ko:ko + m], frame_o[ko:ko + m]
            ko += m
            tool_c[j], line_c[j], frame_c[j] = tl[mid], ln[mid], fr[mid]
            v = tl[tl >= 0]
            if len(v):
                vals, cnt = np.unique(v, return_counts=True)
                tool_mode[j] = vals[np.argmax(cnt)]
                tools_seen[j] = [int(x) for x in vals[np.argsort(-cnt)]]
            n_lines[j] = len(np.unique(ln[ln >= 0]))
        if verbose:
            print(f"[roughness] {s}/{len(meas)} patches traced, {pts_total / 1e6:.1f} M ray points, "
                  f"{time.time() - t0:.0f}s", flush=True)
    failed = (reason == 0) & (np.isnan(res["Ra"]).any(1))
    reason[failed] = 4
    out = {"P": C.astype(np.float32), "normal": n0.astype(np.float32), "probe_index": ci.astype(np.int64),
           "face": cf.astype(np.int32), "dirs": dirs, "lay_angle": lay.astype(np.float32),
           "lay_anisotropy": aniso.astype(np.float32), "lc_mm": lc.astype(np.float32),
           "traced_mm": L.astype(np.float32), "dx_mm": dx.astype(np.float32), "eval_mm": eval_mm.astype(np.float32),
           "n_sampling_lengths": nsl, "edge_dist_mm": np.minimum(redge, 99).astype(np.float32),
           "kappa_max": kmax.astype(np.float32), "reason": reason, "valid": reason == 0,
           "dev_centre_um": (1e3 * dev_c).astype(np.float32), "tool": tool_c.astype(np.int16),
           "tool_mode": tool_mode.astype(np.int16), "line": line_c.astype(np.int64), "frame": frame_c.astype(np.int16),
           "n_lines_crossed": n_lines}
    for key in ("Ra", "Rq", "Rz", "Rt", "Pa", "Pt", "Wt"):
        out[key + "_um_dir"] = res[key].astype(np.float32)
    out["pitch_mm_dir"] = res["pitch"].astype(np.float32)
    out["slope_max_deg_dir"] = res["slope_max_deg"].astype(np.float32)
    import warnings
    with warnings.catch_warnings(), np.errstate(invalid="ignore"):
        warnings.simplefilter("ignore", RuntimeWarning)
        for key in ("Ra", "Rq", "Rz", "Rt", "Pa", "Pt", "Wt"):
            out[key + "_um"] = np.nanmax(res[key], axis=1).astype(np.float32) if nC else np.zeros(0, np.float32)
    out["coarse_marks"] = (out["Pa_um"] > np.maximum(2.0 * out["Ra_um"], out["Ra_um"] + 0.4)) & out["valid"]
    out["_tools_seen"] = tools_seen
    out["_timing"] = {"fit_s": round(t_fit, 1), "star_s": round(t_star - t_fit, 1),
                      "profiles_s": round(time.time() - t_star_abs, 1), "total_s": round(time.time() - t0, 1),
                      "ray_points": int(pts_total)}
    if verbose:
        print(f"[roughness] {nC} patches, {int((reason == 0).sum())} valid, {pts_total / 1e6:.1f} M ray points, "
              f"{time.time() - t0:.0f}s", flush=True)
    return out


# ------------------------------------------------------------------ mapping to probes / vertices
def _face_centres(R, f):
    """Centres of face f that represent its surface: patches that had no room for a profile (near the face's edges)
    are dropped when the face has other patches, so the neighbouring same-face patches cover that area."""
    ca = np.where(R["face"] == f)[0]
    keep = ca[R["reason"][ca] != 1]
    return keep if len(keep) else ca


def map_to_points(R, Q, qface, values, k=4):
    """Per point (same-face only): status from the nearest centre; value by inverse-distance weighting (log space) of
    the k nearest VALID centres of the same face. Returns (value, status) with status = REASONS code, 5 = no centre."""
    val = np.full(len(Q), np.nan)
    st = np.full(len(Q), 5, np.int8)
    cf, valid = R["face"], R["valid"]
    CP = R["P"].astype(float)
    for f in np.unique(qface):
        qi = np.where(qface == f)[0]
        ca = _face_centres(R, f)
        if not len(ca):
            continue
        d, nn = cKDTree(CP[ca]).query(Q[qi])
        st[qi] = R["reason"][ca[nn]]
        cv = ca[valid[ca]]
        if not len(cv):
            continue
        kk = min(k, len(cv))
        d, nn = cKDTree(CP[cv]).query(Q[qi], k=kk)
        if kk == 1:
            d, nn = d[:, None], nn[:, None]
        wgt = 1.0 / np.maximum(d, 0.05) ** 2
        lv = np.log(np.maximum(values[cv][nn], 1e-3))
        v = np.exp((wgt * lv).sum(1) / wgt.sum(1))
        ok = st[qi] == 0
        val[qi[ok]] = v[ok]
    return val, st


def area_weights(R, P, pface, parea, drop_no_room=True):
    """Probe -> nearest same-face centre; area of each centre's cell (mm^2). drop_no_room=False keeps the patches that
    had no room for a profile as owners (-> the area actually traced vs. merely represented by a same-face patch)."""
    w = np.zeros(len(R["P"]))
    owner = np.full(len(P), -1)
    CP = R["P"].astype(float)
    for f in np.unique(pface):
        qi = np.where(pface == f)[0]
        ca = _face_centres(R, f) if drop_no_room else np.where(R["face"] == f)[0]
        if not len(ca):
            continue
        _, nn = cKDTree(CP[ca]).query(P[qi])
        owner[qi] = ca[nn]
    ok = owner >= 0
    np.add.at(w, owner[ok], parea[ok])
    return w, owner


def wpercentile(x, w, q):
    o = np.argsort(x)
    cw = np.cumsum(w[o])
    cw /= cw[-1]
    return [float(np.interp(qq / 100.0, cw, x[o])) for qq in q]
