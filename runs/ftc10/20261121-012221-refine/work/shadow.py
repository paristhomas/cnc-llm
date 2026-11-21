"""Per-frame part shadow (union of part sections above a level), cached. Tool-centre allowed regions."""
import numpy as np, os, pickle, time
from multiprocessing import Pool
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union
import shapely
from geom import FR, mesh_in, section, RUN

CACHE = RUN + 'work/cache/'
os.makedirs(CACHE, exist_ok=True)
STEP = 0.1
OFF = 0.013

_MF = None


def _sec(z):
    return section(_MF, z)


class Shadow:
    def __init__(self, fname, zlo=None, zhi=None):
        global _MF
        self.f = FR[fname]
        fn = CACHE + 'shadow_%s.pkl' % fname
        if os.path.exists(fn):
            d = pickle.load(open(fn, 'rb'))
            self.levels, self.cum, self.secs = d['levels'], d['cum'], d['secs']
            return
        t = time.time()
        mf = mesh_in(self.f)
        _MF = mf
        b = mf.bounds
        top = b[1, 2]; bot = b[0, 2]
        levels = np.arange(np.floor(top / STEP) * STEP + OFF, bot - STEP, -STEP)
        with Pool(16) as p:
            secs = p.map(_sec, list(levels), chunksize=4)
        secs = [s.simplify(0.002) for s in secs]
        cum = []
        cur = Polygon()
        for s in secs:
            if not s.is_empty:
                if cur.is_empty or not cur.buffer(1e-6).contains(s):
                    cur = unary_union([cur, s]).simplify(0.002).buffer(0)
            cum.append(cur)
        self.levels, self.cum, self.secs = levels, cum, secs
        pickle.dump(dict(levels=levels, cum=cum, secs=secs), open(fn, 'wb'))
        print('shadow', fname, len(levels), 'levels', time.time() - t, 's')

    def get(self, w):
        """Union of part material strictly above frame level w (sampled every 0.1 mm)."""
        # levels descending; want all levels > w
        k = np.searchsorted(-self.levels, -w, side='left') - 1  # last index with level > w
        if k < 0:
            return Polygon()
        return self.cum[k]

    def sec(self, w):
        k = int(np.argmin(np.abs(self.levels - w)))
        return self.secs[k]


def rho_profile(tool, h):
    """Horizontal radius of the tool body at height h above its tip."""
    R = tool['D'] / 2.0
    kind = tool['kind']
    if kind == 'flat' or kind == 'drill':
        return R
    r = R if kind == 'ball' else tool.get('r', 0)
    if h >= r:
        return R
    return (R - r) + np.sqrt(max(r * r - (r - h) ** 2, 0))


def forbidden(sh, tool, w, extra=0.0, keepout=None, hmax=None):
    """Region where the tool centre may NOT be with its tip at level w (frame), part offset by `extra`."""
    R = tool['D'] / 2.0
    kind = tool['kind']
    parts = []
    if kind in ('flat', 'drill'):
        hs = [0.005]
    else:
        r = R if kind == 'ball' else tool.get('r', 0)
        hs = [0.005, 0.05 * r, 0.15 * r, 0.3 * r, 0.5 * r, 0.7 * r, 0.85 * r, r]
    for h in hs:
        g = sh.get(w + h)
        if g.is_empty:
            continue
        rad = rho_profile(tool, h) + extra
        parts.append(g.buffer(rad, quad_segs=16))
    if keepout is not None and not keepout.is_empty:
        parts.append(keepout.buffer(R + max(extra, 0), quad_segs=16))
    if not parts:
        return Polygon()
    return unary_union(parts)


if __name__ == '__main__':
    import sys
    for k in sys.argv[1:]:
        s = Shadow(k)
        print(k, s.levels[0], s.levels[-1], len(s.levels))
