"""Toolpath operations in a frame (my own 3-axis-per-frame CAM)."""
import numpy as np, shapely
from shapely.geometry import Polygon, MultiPolygon, LineString, box, Point
from shapely.geometry.polygon import orient
from shapely.ops import unary_union
from gcode import TOOLS, feed
from shadow import forbidden
from stock import mask_to_poly, poly_to_mask, VR


def polys(g):
    if g is None or g.is_empty:
        return []
    if g.geom_type == 'Polygon':
        return [g]
    if hasattr(g, 'geoms'):
        out = []
        for p in g.geoms:
            out += polys(p)
        return out
    return []


def oriented_rings(poly):
    p = orient(poly, 1.0)
    return [np.array(p.exterior.coords)[:, :2]] + [np.array(i.coords)[:, :2] for i in p.interiors]


def densify(pts, step):
    out = [pts[0]]
    for a, b in zip(pts[:-1], pts[1:]):
        d = np.linalg.norm(b - a)
        n = int(np.ceil(d / step))
        for k in range(1, n + 1):
            out.append(a + (b - a) * k / n)
    return np.array(out)


class Ctx:
    def __init__(self, prog, stock, sh, frame, safe, log):
        self.p = prog; self.st = stock; self.sh = sh; self.f = frame; self.safe = safe; self.log = log
        self.refresh_top()

    def refresh_top(self):
        self.top, self.cx, self.cy = self.st.top_map(self.f)

    def top_at(self, pts, rad):
        """max stock top within rad of the polyline pts (frame xy)."""
        pts = np.atleast_2d(pts)
        if len(pts) == 1:
            g = Point(pts[0]).buffer(rad, quad_segs=4)
        else:
            g = LineString(pts).buffer(rad, quad_segs=4)
        b = g.bounds
        i0 = max(0, int(np.searchsorted(self.cx, b[0] - VR))); i1 = int(np.searchsorted(self.cx, b[2] + VR))
        j0 = max(0, int(np.searchsorted(self.cy, b[1] - VR))); j1 = int(np.searchsorted(self.cy, b[3] + VR))
        if i1 <= i0 or j1 <= j0:
            return -1e9
        X, Y = np.meshgrid(self.cx[i0:i1], self.cy[j0:j1], indexing='ij')
        m = shapely.contains_xy(g.buffer(VR * 0.75), X, Y)
        if not m.any():
            return -1e9
        return float(self.top[i0:i1, j0:j1][m].max())

    def link(self, xy, z_start, R, z_min_clear=None):
        """Move from current position to above xy and down to z_start (rapid where safe)."""
        p = self.p
        cur = p.pos
        clear = max(self.top_at(np.array([cur[:2], xy]), R + 0.6) + 1.0, z_start)
        if z_min_clear is not None:
            clear = max(clear, z_min_clear)
        clear = min(clear, self.safe)
        if cur[2] < clear - 1e-6:
            p.G0(z=clear)
        p.G0(x=xy[0], y=xy[1])
        loc = max(self.top_at(np.array([xy]), R + 0.6) + 1.0, z_start)
        if loc < p.pos[2] - 1e-6:
            p.G0(z=min(p.pos[2], loc))
        return loc

    def retract(self):
        self.p.G0(z=self.safe)

    def remove_swept(self, paths, R, w):
        if not paths:
            return
        g = unary_union([LineString(q[:, :2]).buffer(R, quad_segs=8) if len(q) > 1 else Point(q[0, :2]).buffer(R) for q in paths])
        m = poly_to_mask(g.buffer(-0.15), self.cx, self.cy)
        self.st.remove_above(self.f, m, w)


def offset_rings(P, stepover, R):
    """Contour-parallel rings of polygon P (tool-centre region) that cover it completely for a tool of radius R."""
    rings = []
    k = 0; cur = P; last_d = 0.0
    while not cur.is_empty and k < 300:
        for q in polys(cur):
            if q.area < 0.01:
                continue
            for r in oriented_rings(q):
                rings.append((k, r))
        last_d = k * stepover
        k += 1
        cur = P.buffer(-k * stepover, quad_segs=8)
    # remainder deeper than last ring + 0.9 R is not covered
    rem = P.buffer(-(last_d + 0.9 * R), quad_segs=8)
    for q in polys(rem):
        if q.area < 1e-4:
            continue
        for r in oriented_rings(q):
            rings.append((k, r))
        # thin remainder: add its own inner rings
        kk = 1
        cur = q.buffer(-kk * stepover)
        while not cur.is_empty and kk < 50:
            for qq in polys(cur):
                for r in oriented_rings(qq):
                    rings.append((k + kk, r))
            kk += 1; cur = q.buffer(-kk * stepover)
    return rings


def run_ring_ramp(ctx, ring, w, z_from, T, F, Framp, ang=4.0):
    """Cut a closed ring at level w entering by ramping along it from z_from."""
    p = ctx.p
    pts = ring
    if np.linalg.norm(pts[0] - pts[-1]) > 1e-6:
        pts = np.vstack([pts, pts[:1]])
    seg = np.linalg.norm(np.diff(pts, axis=0), axis=1)
    Ltot = seg.sum()
    dz = max(z_from - w, 0)
    Lr = dz / np.tan(np.radians(ang)) if dz > 0 else 0
    p.G0(x=pts[0, 0], y=pts[0, 1])
    if p.pos[2] > z_from:
        p.G0(z=z_from)
    if dz <= 0.01:
        p.G1(z=w, F=Framp)
    else:
        # ramp along ring, possibly multiple laps
        s = 0.0; z = z_from
        k = 0
        while z > w + 1e-6:
            a = pts[k % (len(pts) - 1)]; b = pts[(k % (len(pts) - 1)) + 1]
            d = np.linalg.norm(b - a)
            zn = max(w, z - d * np.tan(np.radians(ang)))
            p.G1(b[0], b[1], zn, F=Framp)
            z = zn; k += 1
            if k > 20000:
                break
        # continue from where we are around the full ring at level w
        k0 = k % (len(pts) - 1)
        order = list(range(k0 + 1, len(pts))) + list(range(1, k0 + 1))
        for i in order:
            p.G1(pts[i, 0], pts[i, 1], w, F=F)
        return
    for q in pts[1:]:
        p.G1(q[0], q[1], w, F=F)


def rough(ctx, T, levels, allow, stepover, domain, keepout=None, top=None, Ffac=1.0, min_area=0.5, name='', erode=0.0):
    tool = TOOLS[T]; R = tool['D'] / 2.0
    F = feed(T, Ffac); Fr = feed(T) / 3.0
    p = ctx.p
    prev = top if top is not None else None
    ncut = 0
    for li, w in enumerate(levels):
        w_hi = prev if prev is not None else w + 50
        mask, cx, cy = ctx.st.slab_mask(ctx.f, w, w_hi + 0.01)
        prev = w
        if not mask.any():
            continue
        mat = mask_to_poly(mask, cx, cy)
        if erode > 0:
            mat = mat.buffer(-erode).buffer(erode)
        allowed = domain.difference(forbidden(ctx.sh, tool, w, extra=allow, keepout=keepout))
        clear = allowed.intersection(mat.buffer(R * 0.9))
        clear = clear.buffer(-0.02).buffer(0.02)
        pl = [q for q in polys(clear) if q.area > min_area]
        if not pl:
            continue
        rings = []  # (k, ring)
        for P in pl:
            rings += offset_rings(P, stepover, R)
        rings.sort(key=lambda t: -t[0])
        cut_paths = []
        for k, r in rings:
            r = densify(r, 2.0) if len(r) < 4 else r
            # nearest point to current pos as start
            cur = p.pos[:2]
            i = int(np.argmin(np.linalg.norm(r[:-1] - cur, axis=1)))
            rr = np.vstack([r[i:-1], r[:i + 1]])
            d = np.linalg.norm(rr[0] - cur)
            if p.pos[2] <= w + 1e-6 and d < stepover * 1.6:
                p.G1(rr[0, 0], rr[0, 1], w, F=F)
                for q in rr[1:]:
                    p.G1(q[0], q[1], w, F=F)
            else:
                ztop = ctx.top_at(rr[:1], R + 0.6)
                z_from = max(ztop + 0.5, w)
                ctx.link(rr[0], z_from + 0.5, R)
                run_ring_ramp(ctx, rr, w, z_from, T, F, Fr)
            cut_paths.append(rr)
            ncut += 1
        ctx.remove_swept(cut_paths, R, w)
        ctx.refresh_top()
    ctx.log.append('%s T%d rough levels %d rings %d' % (name, T, len(levels), ncut))


def _lead(allowed, p0, d):
    n = np.array([-d[1], d[0]])
    nn = np.linalg.norm(n)
    if nn < 1e-9:
        return p0
    n = n / nn
    for L in (1.0, 0.6, 0.3):
        q = p0 + n * L
        if allowed.buffer(1e-4).contains(Point(q)):
            return q
    return p0


def contour(ctx, T, w, allow=0.0, domain=None, keepout=None, only=None, Ffac=1.0, name='', min_len=0.5, closed_overlap=1.0):
    """Finish contour (waterline) at level w along part walls, climb milling."""
    tool = TOOLS[T]; R = tool['D'] / 2.0
    F = feed(T, Ffac); Fp = feed(T) / 3.0
    p = ctx.p
    Fpart = forbidden(ctx.sh, tool, w, extra=allow)
    Fall = forbidden(ctx.sh, tool, w, extra=allow, keepout=keepout)
    allowed = domain.difference(Fall)
    bnd = Fpart.boundary
    n = 0
    paths = []
    for P in polys(allowed):
        if P.area < 0.01:
            continue
        for r in oriented_rings(P):
            r = densify(r, 0.5)
            dist = shapely.distance(bnd, shapely.points(r))
            good = dist < 0.02
            if only is not None:
                good &= shapely.contains_xy(only, r[:, 0], r[:, 1])
            if not good.any():
                continue
            closed = good.all()
            if closed:
                runs = [np.vstack([r, densify(r[:max(2, int(closed_overlap / 0.5) + 1)], 0.5)[1:]])]
            else:
                runs = []
                # rotate so that we start at a bad point
                i0 = int(np.argmin(good))
                rr = np.vstack([r[i0:-1], r[:i0 + 1]]); gg = np.r_[good[i0:-1], good[:i0 + 1]]
                cur = []
                for q, g in zip(rr, gg):
                    if g:
                        cur.append(q)
                    elif cur:
                        runs.append(np.array(cur)); cur = []
                if cur:
                    runs.append(np.array(cur))
            for run in runs:
                if len(run) < 2 or np.linalg.norm(np.diff(run, axis=0), axis=1).sum() < min_len:
                    continue
                a = _lead(allowed, run[0], run[1] - run[0])
                b = _lead(allowed, run[-1], run[-1] - run[-2])
                ctx.link(a, w + 1.0, R)
                p.G1(z=w, F=Fp)
                p.G1(run[0, 0], run[0, 1], w, F=F)
                for q in run[1:]:
                    p.G1(q[0], q[1], w, F=F)
                p.G1(b[0], b[1], w, F=F)
                p.G0(z=min(ctx.safe, w + 1.0))
                paths.append(run); n += 1
    ctx.remove_swept(paths, R, w)
    ctx.refresh_top()
    ctx.log.append('%s T%d contour w=%.3f runs %d' % (name, T, w, n))
    return n


def area_clear(ctx, T, w, region, allow=0.0, domain=None, keepout=None, stepover=None, Ffac=1.0, name=''):
    """Clear (finish) a floor at level w over `region` (the area to be swept by the tool)."""
    tool = TOOLS[T]; R = tool['D'] / 2.0
    F = feed(T, Ffac); Fp = feed(T) / 3.0
    if stepover is None:
        stepover = 0.6 * tool['D'] if tool['kind'] == 'flat' else 0.6 * (tool['D'] - 2 * tool.get('r', 0))
    p = ctx.p
    allowed = (domain if domain is not None else box(-1e3, -1e3, 1e3, 1e3)).difference(forbidden(ctx.sh, tool, w, extra=allow, keepout=keepout))
    clear = allowed.intersection(region.buffer(R * 0.95)).buffer(-0.01).buffer(0.01)
    rings = []
    for P in polys(clear):
        rings += offset_rings(P, stepover, R * (0.95 if tool['kind'] == 'flat' else 0.6))
    rings.sort(key=lambda t: -t[0])
    paths = []
    for k, r in rings:
        cur = p.pos[:2]
        i = int(np.argmin(np.linalg.norm(r[:-1] - cur, axis=1)))
        rr = np.vstack([r[i:-1], r[:i + 1]])
        d = np.linalg.norm(rr[0] - cur)
        if abs(p.pos[2] - w) < 1e-6 and d < stepover * 1.6:
            p.G1(rr[0, 0], rr[0, 1], w, F=F)
        else:
            ztop = ctx.top_at(rr[:1], R + 0.3)
            ctx.link(rr[0], w + 1.0, R)
            if ztop > w + 0.6:
                run_ring_ramp(ctx, rr, w, ztop + 0.5, T, F, Fp)
                paths.append(rr)
                continue
            p.G1(z=w, F=Fp)
        for q in rr[1:]:
            p.G1(q[0], q[1], w, F=F)
        paths.append(rr)
    if paths:
        p.G0(z=min(ctx.safe, w + 1.0))
    ctx.remove_swept(paths, R, w)
    ctx.refresh_top()
    ctx.log.append('%s T%d area w=%.3f rings %d' % (name, T, w, len(paths)))


def helix_hole(ctx, T, cx, cy, r_path, w_top, w_bot, pitch, Ffac=1.0, name='', start_above=1.0, final_circle=True):
    tool = TOOLS[T]; R = tool['D'] / 2.0
    F_edge = feed(T, Ffac)
    F = F_edge * r_path / (r_path + R) if r_path >= 0.05 else F_edge
    p = ctx.p
    ctx.link(np.array([cx + r_path, cy]), w_top + start_above, R)
    p.G1(cx + r_path, cy, w_top + 0.2, F=F_edge / 3)
    if r_path < 0.05:
        p.G1(z=w_bot, F=F_edge / 3)
    else:
        z = w_top + 0.2
        while z > w_bot + 1e-6:
            zn = max(w_bot, z - pitch)
            p.helix(cx, cy, r_path, zn, F)
            z = zn
        if final_circle:
            p.helix(cx, cy, r_path, w_bot, F)
        p.G1(cx, cy, w_bot, F=F)
    p.G0(z=w_top + start_above)
    ctx.remove_swept([np.array([[cx, cy]])], r_path + R, w_bot)
    ctx.refresh_top()
    ctx.log.append('%s T%d helix hole (%.2f,%.2f) r%.2f %.2f->%.2f' % (name, T, cx, cy, r_path, w_top, w_bot))


def peck_drill(ctx, T, cx, cy, w_top, w_bot, peck=3.0, name=''):
    tool = TOOLS[T]
    F = tool['chip'] * tool['fl'] * tool['rpm']
    p = ctx.p
    ctx.link(np.array([cx, cy]), w_top + 1.0, tool['D'] / 2)
    z = w_top + 0.5
    p.G1(z=z, F=F)
    while z > w_bot + 1e-6:
        zn = max(w_bot, z - peck)
        p.G1(z=zn, F=F)
        z = zn
        if z > w_bot + 1e-6:
            p.G0(z=w_top + 1.0)
            p.G0(z=z + 0.3)
    p.G0(z=w_top + 1.0)
    ctx.remove_swept([np.array([[cx, cy]])], tool['D'] / 2, w_bot)
    ctx.refresh_top()
    ctx.log.append('%s T%d drill (%.2f,%.2f) %.2f->%.2f' % (name, T, cx, cy, w_top, w_bot))


# ---------------- drop cutter raster ----------------
def tool_kernel(tool, res):
    R = tool['D'] / 2.0
    n = int(np.ceil(R / res))
    dx, dy = np.meshgrid(np.arange(-n, n + 1), np.arange(-n, n + 1), indexing='ij')
    d = np.hypot(dx, dy) * res
    m = d <= R + 1e-9
    kind = tool['kind']
    if kind == 'ball':
        prof = R - np.sqrt(np.maximum(R * R - d * d, 0))
    elif kind == 'bull':
        r = tool['r']
        prof = np.where(d <= R - r, 0.0, r - np.sqrt(np.maximum(r * r - (d - (R - r)) ** 2, 0)))
    else:
        prof = np.zeros_like(d)
    return dx[m], dy[m], prof[m]


def drop_line(H, x0, y0, res, kern, xs, ys):
    """tip z for tool centres (xs, ys) on heightmap H (part top, -inf where none)."""
    dx, dy, prof = kern
    i = np.rint((xs - x0) / res).astype(int); j = np.rint((ys - y0) / res).astype(int)
    I = i[:, None] + dx[None, :]; J = j[:, None] + dy[None, :]
    ok = (I >= 0) & (I < H.shape[0]) & (J >= 0) & (J < H.shape[1])
    I = np.clip(I, 0, H.shape[0] - 1); J = np.clip(J, 0, H.shape[1] - 1)
    v = np.where(ok, H[I, J] - prof[None, :], -1e9)
    return v.max(axis=1)


def simplify_path(pts, tol=0.003):
    """3D Ramer-Douglas-Peucker."""
    n = len(pts)
    if n < 3:
        return pts
    keep = np.zeros(n, bool); keep[0] = keep[-1] = True
    stack = [(0, n - 1)]
    while stack:
        a, b = stack.pop()
        if b <= a + 1:
            continue
        A = pts[a]; B = pts[b]; d = B - A; L = np.linalg.norm(d)
        seg = pts[a + 1:b] - A
        if L < 1e-12:
            dist = np.linalg.norm(seg, axis=1)
        else:
            dist = np.linalg.norm(np.cross(seg, d / L), axis=1)
        i = int(np.argmax(dist))
        if dist[i] > tol:
            k = a + 1 + i
            keep[k] = True
            stack.append((a, k)); stack.append((k, b))
    return pts[keep]


def clear_maps(ctx, tool):
    from scipy.ndimage import maximum_filter
    top = ctx.top
    def disk(r):
        n = int(np.ceil(r / VR))
        dx, dy = np.meshgrid(np.arange(-n, n + 1), np.arange(-n, n + 1), indexing='ij')
        return np.hypot(dx, dy) * VR <= r + 1e-9
    rh = tool['holder'] / 2.0 + 0.8
    Mh = maximum_filter(top, footprint=disk(rh), mode='constant', cval=-1e9)
    if 'neck' in tool:
        shank_d = 6.0 if tool['D'] >= 3 else 4.0
        Ls = tool['neck']
    else:
        shank_d = tool['D']; Ls = tool['flute']
    Ms = maximum_filter(top, footprint=disk(shank_d / 2.0 + 0.4), mode='constant', cval=-1e9)
    return Mh, Ms, Ls


def clear_ok(ctx, tool, maps, xs, ys, zs):
    Mh, Ms, Ls = maps
    i = np.clip(np.rint((xs - ctx.cx[0]) / VR).astype(int), 0, len(ctx.cx) - 1)
    j = np.clip(np.rint((ys - ctx.cy[0]) / VR).astype(int), 0, len(ctx.cy) - 1)
    return (Mh[i, j] < zs + tool['stick'] - 0.6) & (Ms[i, j] < zs + Ls - 0.3)


def raster(ctx, T, hm, region, direction='x', step=0.3, zmin=-1e9, Ffac=1.0, name='', sample=0.2, zigzag=True, target=None, lift=0.5):
    """Ball/bull/flat drop-cutter raster finishing over tool-centre region `region` (polygon)."""
    H, x0, y0, res = hm
    tool = TOOLS[T]; R = tool['D'] / 2.0
    F = feed(T, Ffac)
    kern = tool_kernel(tool, res)
    maps = clear_maps(ctx, tool)
    nbad = 0
    p = ctx.p
    b = region.bounds
    if direction == 'x':
        lines = np.arange(b[1], b[3] + 1e-9, step)
    else:
        lines = np.arange(b[0], b[2] + 1e-9, step)
    paths = []
    flip = False
    for c in lines:
        if direction == 'x':
            seg = region.intersection(LineString([(b[0] - 1, c), (b[2] + 1, c)]))
        else:
            seg = region.intersection(LineString([(c, b[1] - 1), (c, b[3] + 1)]))
        segs = []
        if seg.is_empty:
            continue
        for g in (seg.geoms if hasattr(seg, 'geoms') else [seg]):
            if g.geom_type != 'LineString':
                continue
            q = np.array(g.coords)
            if len(q) < 2:
                continue
            segs.append(q)
        segs.sort(key=lambda q: q[0, 0] if direction == 'x' else q[0, 1])
        if flip:
            segs = [q[::-1] for q in segs[::-1]]
        for q in segs:
            if flip:
                pass
            q = densify(q, sample)
            if target is not None:
                keep = shapely.contains_xy(target, q[:, 0], q[:, 1])
                if not keep.any():
                    continue
            z = drop_line(H, x0, y0, res, kern, q[:, 0], q[:, 1])
            ok = z > zmin
            if target is not None:
                ok &= keep
            cl = clear_ok(ctx, tool, maps, q[:, 0], q[:, 1], z)
            nbad += int((ok & ~cl).sum())
            ok &= cl
            if not ok.any():
                continue
            # split into runs
            idx = np.nonzero(ok)[0]
            br = np.nonzero(np.diff(idx) > 1)[0]
            starts = np.r_[idx[0], idx[br + 1]]; ends = np.r_[idx[br], idx[-1]]
            for s0, e0 in zip(starts, ends):
                if e0 - s0 < 1:
                    continue
                pts = np.column_stack([q[s0:e0 + 1], z[s0:e0 + 1]])
                # split where the tool would drop steeply (plunge) inside a pass
                dz = np.diff(pts[:, 2])
                cut = np.nonzero(dz < -0.4 * R)[0]
                pieces = np.split(pts, cut + 1) if len(cut) else [pts]
                for pc in pieces:
                    if len(pc) >= 2:
                        paths.append(simplify_path(pc))
        if zigzag:
            flip = not flip
    # emit with short links
    n = 0
    for pts in paths:
        cur = p.pos
        d = np.linalg.norm(pts[0, :2] - cur[:2])
        if d < 3 * step + 0.5 and n > 0:
            # local link: lift over the surface between the two points
            q = densify(np.array([cur[:2], pts[0, :2]]), sample)
            zl = drop_line(H, x0, y0, res, kern, q[:, 0], q[:, 1]).max()
            zl = max(zl, cur[2], pts[0, 2]) + lift
            if ctx.top_at(np.array([cur[:2], pts[0, :2]]), R + 0.3) < zl - 0.3:
                p.G1(z=zl, F=F)
                p.G1(pts[0, 0], pts[0, 1], zl, F=F)
                p.G1(z=pts[0, 2], F=F / 3)
            else:
                ctx.link(pts[0, :2], pts[0, 2] + 1.0, R)
                p.G1(z=pts[0, 2], F=F / 3)
        else:
            ctx.link(pts[0, :2], pts[0, 2] + 1.0, R)
            p.G1(z=pts[0, 2], F=F / 3)
        for q in pts[1:]:
            p.G1(q[0], q[1], q[2], F=F)
        n += 1
    if n:
        p.G0(z=min(ctx.safe, p.pos[2] + 2))
    ctx.log.append('%s T%d raster %s paths %d (dropped %d pts for holder/shank clearance)' % (name, T, direction, n, nbad))
    return paths
