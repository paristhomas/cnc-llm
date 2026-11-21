# POST-REVIEW: ball passes in the drill-point cones (reviewer finding M5)
import shutil
shutil.copy('gen.py', 'gen_iter09.py')
s = open('gen.py').read()
old = s[s.index('def cone_ball('):s.index('BIG = box(')]
new = '''def cone_ball(c, T, cx, cy, w_top, r_top, Rb, rc_max, rc_min, dr, apex=True):
    """Ball rings tangent to a 118-deg drill-point cone (contact radius rc from rc_max down to rc_min)."""
    k = 1.0 / np.tan(np.radians(59.0))
    apex_z = w_top - r_top * k
    sa, ca = np.sin(np.radians(59.0)), np.cos(np.radians(59.0))
    F = feed(T)
    rc = rc_max
    c.link(np.array([cx + rc - Rb * ca, cy]), w_top + 1.0, Rb)
    while rc >= rc_min - 1e-9:
        zc = apex_z + rc * k
        cr = rc - Rb * ca
        tip = zc + Rb * sa - Rb
        P.G1(cx + max(cr, 0), cy, tip, F=F / 3)
        if cr > 0.02:
            P.helix(cx, cy, cr, tip, max(F * cr / rc, 0.25 * F))
        rc -= dr
    if apex:
        tip = apex_z + Rb / sa - Rb
        P.G1(cx, cy, tip, F=F / 3)
    else:
        P.G1(cx, cy, P.pos[2], F=F / 3)
    P.G0(z=w_top + 1.0)
    c.retract()


'''
s = s.replace(old, new)
a = "cone_rings(c, 11, 0.5, 25.0, 106.5, 2.75, 2.0, 0.15)"
assert a in s
s = s.replace(a, a + '''
P.c('post-review M5: ball passes in the drill-point cone of the shallower axial hole (T14 then T13)')
tool(c, 14)
cone_ball(c, 14, -2.5, -23.5, 114.0, 2.75, 1.5, 1.95, 0.95, 0.12, apex=False)
tool(c, 13)
cone_ball(c, 13, -2.5, -23.5, 114.0, 2.75, 1.0, 1.0, 0.55, 0.09, apex=True)''')
b = "contour(c, 13, w, domain=box(-47, 95, 47, 145), keepout=KEEP_LOW, only=reg.buffer(2.0).difference(box(-9.5, 90, 9.5, 145)), name='MX rest fillet')"
assert b in s
s = s.replace(b, b + '''
P.c('post-review M5: R1 ball in the drill-point cones of the six 2.46 mm holes')
for fx, fys in ((-30.0, (110.9, 121.9, 132.9)), (-20.0, (114.1, 125.1, 136.1))):
    for fy in fys:
        cone_ball(c, 13, fx, fy, -0.5, 1.2295, 1.0, 0.72, 0.52, 0.07, apex=True)''')
open('gen.py', 'w').write(s)
print('ok')
