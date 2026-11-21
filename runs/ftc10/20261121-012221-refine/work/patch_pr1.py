# POST-REVIEW REVISION (machinist review): safe retracts, arc feed compensation, T1 S15000 at the top, web ramp.
import shutil
shutil.copy('gen.py', 'gen_prereview.py'); shutil.copy('gcode.py', 'gcode_prereview.py'); shutil.copy('ops.py', 'ops_prereview.py')

g = open('gcode.py').read()
# 1. explicit retract along the tool axis to a frame Z clearing the whole stock sweep before every index
old = '''        if self.spin:
            self.L.append('M5'); self.spin = False
        if self.frame is not None and (self.frame.tilted or getattr(self.frame, 'zshift', 0.0)):
            self.L.append('G69')'''
assert old in g
g = g.replace(old, '''        if self.frame is not None and self.pos is not None:
            zc = self.index_clear(self.frame)
            if self.pos[2] < zc - 1e-6:
                self.G0(z=zc)
        if self.spin:
            self.L.append('M5'); self.spin = False
        if self.frame is not None and (self.frame.tilted or getattr(self.frame, 'zshift', 0.0)):
            self.L.append('G69')''')
g = g.replace('''    def set_frame(self, f, safe):''', '''    def index_clear(self, f):
        """Frame Z (geometric) beyond the sweep radius of the whole stock box about the frame origin, + 5 mm."""
        import itertools, json
        st = json.load(open('/home/paris/cnc-llm/runs/ftc10/20261121-012221-refine/brief/setup.json'))['stock']
        O = f.O + np.array([0, 0, getattr(f, 'zshift', 0.0)])
        r = max(np.linalg.norm(np.array(c) - O) for c in itertools.product(*zip(st['lo'], st['hi'])))
        # TOP frame: the tool axis is +Z, the stock top is the binding limit as well
        return r + 5.0 + getattr(f, 'zshift', 0.0)

    def set_frame(self, f, safe):''')
# 2. retract to the frame safe height before M5 at tool changes
old = '''        if self.spin:
            self.L.append('M5'); self.spin = False
        self.L.append('T%d M6' % T)'''
assert old in g
g = g.replace(old, '''        if self.pos is not None and self.frame is not None and self.pos[2] < self.safe - 1e-6:
            self.G0(z=self.safe)
        if self.spin:
            self.L.append('M5'); self.spin = False
        self.L.append('T%d M6' % T)''')
# end of program: retract before M5
old = '''    def end(self):
        if self.spin:'''
g = g.replace(old, '''    def end(self):
        if self.pos is not None and self.frame is not None:
            zc = self.index_clear(self.frame)
            if self.pos[2] < zc:
                self.G0(z=zc)
        if self.spin:''')
open('gcode.py', 'w').write(g)

o = open('ops.py').read()
# 3. helical feed: programmed centre feed so the peripheral feed at the wall equals the library feed
old = '''    tool = TOOLS[T]; R = tool['D'] / 2.0
    F = feed(T, Ffac)
    p = ctx.p
    ctx.link(np.array([cx + r_path, cy]), w_top + start_above, R)'''
assert old in o
o = o.replace(old, '''    tool = TOOLS[T]; R = tool['D'] / 2.0
    F_edge = feed(T, Ffac)
    F = F_edge * r_path / (r_path + R) if r_path >= 0.05 else F_edge
    p = ctx.p
    ctx.link(np.array([cx + r_path, cy]), w_top + start_above, R)''')
o = o.replace('''    p.G1(cx + r_path, cy, w_top + 0.2, F=F / 2)
    if r_path < 0.05:
        p.G1(z=w_bot, F=F / 3)''', '''    p.G1(cx + r_path, cy, w_top + 0.2, F=F_edge / 3)
    if r_path < 0.05:
        p.G1(z=w_bot, F=F_edge / 3)''')
open('ops.py', 'w').write(o)

s = open('gen.py').read()
# cone rings: same arc feed compensation
old = '''        if pr > 0.02:
            P.helix(cx, cy, pr, z, F)
        rc -= dr
    P.G1(cx, cy, P.pos[2], F=F)'''
assert old in s
s = s.replace(old, '''        if pr > 0.02:
            P.helix(cx, cy, pr, z, F * pr / (pr + R))
        rc -= dr
    P.G1(cx, cy, P.pos[2], F=F / 2)''')
# hole pitches per review
s = s.replace("helix_hole(c, 11, -2.5, -23.5, 0.75, 141.5, 114.0, 0.4, name='TOP')", "helix_hole(c, 11, -2.5, -23.5, 0.75, 141.5, 114.0, 0.2, name='TOP')")
s = s.replace("helix_hole(c, 11, 0.5, 25.0, 0.75, 141.5, 106.5, 0.4, name='TOP')", "helix_hole(c, 11, 0.5, 25.0, 0.75, 141.5, 106.5, 0.2, name='TOP')")
s = s.replace("helix_hole(c, 12, hx, fy, 0.5, 27.5, -0.5, 1.0, name=fname + ' hole')", "helix_hole(c, 12, hx, fy, 0.5, 27.5, -0.5, 0.3, name=fname + ' hole')")
# 4. T1 at S15000 / F2700 in the top setup (tooth passing 750 Hz, off the ~900 Hz stock bending mode)
old = '''tool(c, 1)
P.c('T1 rough above the body top face, around the top ears plate')'''
assert old in s
s = s.replace(old, '''TOOLS[1]['rpm'] = 15000   # post-review: 750 Hz tooth passing, F = 0.06 x 3 x 15000 = 2700
tool(c, 1)
P.c('T1 rough above the body top face, around the top ears plate (S15000 F2700: off the stock bending mode)')''')
old = '''tool(c, 5)
P.c('T5 finish body top face Z141.5')'''
assert old in s
s = s.replace(old, '''tool(c, 5)
TOOLS[1]['rpm'] = 18000
P.c('T5 finish body top face Z141.5')''')
# optional: T7/T13 finishing ahead of the -X slab (only T14, which goes below Z0, runs after it)
old_slab = '''tool(c, 1)
P.c('PO-2 slab pass from -X under the part (tool centre Z-5, flank tangent to Z0)')
for w in (12.0, 5.5, -1.0, -7.5, -(TAB_X0)):
    slab_pass(c, w, -47.0, 47.0)
'''
assert old_slab in s
s = s.replace(old_slab, '')
old = '''tool(c, 14)
paths = raster(c, 14, H, band.envelope'''
assert old in s
s = s.replace(old, old_slab + old)
# 5. ramp into the web instead of the full-diameter plunge
old = "slab_pass(c, wfin, -xin, xin, Ff=0.4, start_z=TAB_X1 + 1.0)"
assert old in s
s = s.replace(old, '''P.c('PO-3 middle web segment: ramp in along Y (no plunge), then clean the ramp back at depth')
c.link(np.array([-xin, -5.0]), 25.0, 5.0)
P.G0(z=TAB_X1 + 1.0)
P.G1(z=TAB_X1 + 0.3, F=feed(1) / 3)
L_r = (TAB_X1 + 0.3 - wfin) / np.tan(np.radians(5.0))
P.G1(x=-xin + L_r, y=-5.0, z=wfin, F=feed(1) * 0.35)
P.G1(x=xin, y=-5.0, z=wfin, F=feed(1) * 0.4)
P.G1(x=-xin, y=-5.0, z=wfin, F=feed(1) * 0.4)
P.G0(z=25.0)
c.remove_swept([np.array([[-xin, -5.0], [xin, -5.0]])], 5.0, wfin)''')
open('gen.py', 'w').write(s)
print('patched')
