"""G-code emitter for the 3+2 machine (own post-processor)."""
import numpy as np

TOOLS = {
    1: dict(D=10, kind='flat', fl=3, flute=25, stick=40, holder=32, chip=0.06, rpm=18000),
    2: dict(D=6, kind='flat', fl=3, flute=18, stick=30, holder=32, chip=0.04, rpm=24000),
    3: dict(D=3, kind='flat', fl=2, flute=10, stick=22, holder=32, chip=0.02, rpm=24000),
    4: dict(D=1.5, kind='flat', fl=2, flute=5, stick=14, holder=20, chip=0.01, rpm=24000),
    5: dict(D=8, kind='bull', r=1.0, fl=3, flute=20, stick=35, holder=32, chip=0.05, rpm=24000),
    6: dict(D=6, kind='ball', fl=2, flute=14, stick=32, holder=32, chip=0.03, rpm=24000),
    7: dict(D=3, kind='ball', fl=2, flute=8, stick=22, holder=32, chip=0.02, rpm=24000),
    8: dict(D=1, kind='ball', fl=2, flute=3, stick=12, holder=20, chip=0.008, rpm=24000),
    10: dict(D=5, kind='drill', fl=2, flute=30, stick=40, holder=32, chip=0.06, rpm=8000),
    11: dict(D=4, kind='flat', fl=2, flute=6, neck=40, stick=55, holder=22, chip=0.012, rpm=24000),
    12: dict(D=6, kind='flat', fl=3, flute=12, neck=50, stick=60, holder=22, chip=0.02, rpm=24000),
    13: dict(D=2, kind='ball', fl=2, flute=2, neck=20, stick=35, holder=16, chip=0.006, rpm=24000),
    14: dict(D=3, kind='ball', fl=2, flute=3, neck=30, stick=50, holder=22, chip=0.01, rpm=24000),
}


def feed(T, factor=1.0):
    t = TOOLS[T]
    return min(6000.0, t['chip'] * t['fl'] * t['rpm'] * factor)


def fmt(v):
    s = '%.4f' % v
    s = s.rstrip('0').rstrip('.')
    if s in ('-0', ''):
        s = '0'
    return s


class Prog:
    RAPID = 15000.0

    def __init__(self):
        self.L = ['%', '(NIST FTC-10, AL6061, 3+2 indexed, single vise fixture)', 'G21 G90 G17 G94', 'G54']
        self.frame = None; self.tool = None; self.spin = False
        self.pos = None
        self.t_cut = 0.0; self.t_rapid = 0.0; self.dist_cut = 0.0
        self.cur_F = None
        self.moves = []   # (frame name, tool, kind, p0, p1)
        self.safe = 150.0
        self.ops_time = []
        self.tt = {}

    def c(self, s):
        self.L.append('(' + s.replace('(', '[').replace(')', ']') + ')')

    def zs(self):
        return getattr(self.frame, 'zshift', 0.0) if self.frame is not None else 0.0

    def set_frame(self, f, safe):
        if self.frame is not None and self.frame.name == f.name:
            self.safe = safe
            return
        if self.spin:
            self.L.append('M5'); self.spin = False
        if self.frame is not None and (self.frame.tilted or getattr(self.frame, 'zshift', 0.0)):
            self.L.append('G69')
        zsh = getattr(f, 'zshift', 0.0)
        if f.tilted or zsh:
            o = f.O
            self.L.append('G68.2 X%s Y%s Z%s I%s J%s K%s' % (fmt(o[0]), fmt(o[1]), fmt(o[2] + zsh), fmt(f.I), fmt(f.J), fmt(f.K)))
            self.L.append('G53.1')
            self.pos = np.array([0.0, 0.0, 150.0 + zsh])
        else:
            if self.frame is not None:
                self.pos = np.array([0.0, 0.0, 150.0])
        self.frame = f
        self.safe = safe

    def set_tool(self, T):
        if self.tool == T:
            if not self.spin:
                self.L.append('S%d M3' % TOOLS[T]['rpm']); self.spin = True
            return
        if self.spin:
            self.L.append('M5'); self.spin = False
        self.L.append('T%d M6' % T)
        self.L.append('G43 H%d' % T)
        self.tool = T
        if self.pos is None:
            self.pos = np.array([0.0, 0.0, 150.0])
        else:
            self.pos = np.array([self.pos[0], self.pos[1], max(self.pos[2], 150.0 + self.zs())])
        self.L.append('S%d M3' % TOOLS[T]['rpm']); self.spin = True

    def use(self, f, T, safe):
        self.set_frame(f, safe)
        self.set_tool(T)
        if not self.spin:
            self.L.append('S%d M3' % TOOLS[T]['rpm']); self.spin = True

    def G0(self, x=None, y=None, z=None):
        p = self.pos.copy()
        if x is not None: p[0] = x
        if y is not None: p[1] = y
        if z is not None: p[2] = z
        if np.allclose(p, self.pos, atol=1e-5):
            return
        w = []
        for a, v, o, s in zip('XYZ', p, self.pos, (0, 0, self.zs())):
            if abs(v - o) > 1e-5:
                w.append(a + fmt(v - s))
        self.L.append('G0 ' + ' '.join(w))
        self.t_rapid += np.linalg.norm(p - self.pos) / self.RAPID
        self.moves.append((self.frame.name, self.tool, 0, self.pos.copy(), p.copy()))
        self.pos = p

    def G1(self, x=None, y=None, z=None, F=None):
        p = self.pos.copy()
        if x is not None: p[0] = x
        if y is not None: p[1] = y
        if z is not None: p[2] = z
        if np.allclose(p, self.pos, atol=1e-5):
            return
        w = []
        for a, v, o, s in zip('XYZ', p, self.pos, (0, 0, self.zs())):
            if abs(v - o) > 1e-5:
                w.append(a + fmt(v - s))
        if F is not None and (self.cur_F is None or abs(F - self.cur_F) > 0.5):
            w.append('F%d' % round(F)); self.cur_F = F
        self.L.append('G1 ' + ' '.join(w))
        d = np.linalg.norm(p - self.pos)
        self.t_cut += d / self.cur_F; self.dist_cut += d
        self.tt[(self.frame.name, self.tool)] = self.tt.get((self.frame.name, self.tool), 0) + d / self.cur_F
        self.moves.append((self.frame.name, self.tool, 1, self.pos.copy(), p.copy()))
        self.pos = p

    def helix(self, cx, cy, r, z_end, F, ccw=True):
        """Full circle (helical if z changes) starting at current point (must be at cx+r, cy)."""
        p = self.pos
        I = cx - p[0]; J = cy - p[1]
        code = 'G3' if ccw else 'G2'
        w = '%s X%s Y%s Z%s I%s J%s' % (code, fmt(p[0]), fmt(p[1]), fmt(z_end - self.zs()), fmt(I), fmt(J))
        if self.cur_F is None or abs(F - self.cur_F) > 0.5:
            w += ' F%d' % round(F); self.cur_F = F
        self.L.append(w)
        L = np.hypot(2 * np.pi * r, z_end - p[2])
        self.t_cut += L / F; self.dist_cut += L
        self.tt[(self.frame.name, self.tool)] = self.tt.get((self.frame.name, self.tool), 0) + L / F
        q = p.copy(); q[2] = z_end
        # record as polygonal approximation for my own checks
        n = 16
        a0 = np.arctan2(p[1] - cy, p[0] - cx)
        prev = p.copy()
        for k in range(1, n + 1):
            a = a0 + (2 * np.pi * k / n) * (1 if ccw else -1)
            cur = np.array([cx + r * np.cos(a), cy + r * np.sin(a), p[2] + (z_end - p[2]) * k / n])
            self.moves.append((self.frame.name, self.tool, 1, prev, cur)); prev = cur
        self.pos = q

    def end(self):
        if self.spin:
            self.L.append('M5')
        if self.frame is not None and (self.frame.tilted or getattr(self.frame, 'zshift', 0.0)):
            self.L.append('G69')
        self.L.append('M30'); self.L.append('%')

    def text(self):
        return '\n'.join(self.L) + '\n'
