o = open('ops.py').read()
old = '''            for s0, e0 in zip(starts, ends):
                if e0 - s0 < 1:
                    continue
                pts = np.column_stack([q[s0:e0 + 1], z[s0:e0 + 1]])
                pts = simplify_path(pts)
                paths.append(pts)'''
new = '''            for s0, e0 in zip(starts, ends):
                if e0 - s0 < 1:
                    continue
                pts = np.column_stack([q[s0:e0 + 1], z[s0:e0 + 1]])
                # split where the tool would drop steeply (plunge) inside a pass
                dz = np.diff(pts[:, 2])
                cut = np.nonzero(dz < -0.4 * R)[0]
                pieces = np.split(pts, cut + 1) if len(cut) else [pts]
                for pc in pieces:
                    if len(pc) >= 2:
                        paths.append(simplify_path(pc))'''
assert old in o
o = o.replace(old, new)
open('ops.py', 'w').write(o)

s = open('gen.py').read()
# 1. T13 rest fillets: keep away from the ridge / wave junction
old = "contour(c, 13, w, domain=box(-47, 95, 47, 145), keepout=KEEP_LOW, only=reg.buffer(2.0), name='MX rest fillet')"
assert old in s
s = s.replace(old, "contour(c, 13, w, domain=box(-47, 95, 47, 145), keepout=KEEP_LOW, only=reg.buffer(2.0).difference(box(-9.5, 90, 9.5, 145)), name='MX rest fillet')")
# 2. T7 raster on the ridge / last wave junction
old = "raster(c, 7, H, box(-41, 139.0, 41, 144.5), direction='x', step=0.2, zmin=5.5, name='MX top edge')"
assert old in s
s = s.replace(old, old + "\nraster(c, 7, H, box(-9.5, 95.0, 9.5, 107.0), direction='y', step=0.15, zmin=6.0, name='MX ridge junction')")
# 3. hole depths
s = s.replace("helix_hole(c, 3, -25.0, fy, 0.25, 11.5, 2.0, 0.3, name='MX pad hole')", "helix_hole(c, 3, -25.0, fy, 0.25, 11.5, 1.3, 0.3, name='MX pad hole')")
s = s.replace("helix_hole(c, 3, 23.5, fy, 0.25, 15.5, 5.0, 0.3, name='MX boss hole')", "helix_hole(c, 3, 23.5, fy, 0.25, 15.5, 4.2, 0.3, name='MX boss hole')")
# 4. cones
old = "helix_hole(c, 11, 0.5, 25.0, 0.75, 141.5, 106.5, 0.4, name='TOP')"
assert old in s
s = s.replace(old, old + '''
P.c('T11 drill-point cones: outer ring traced by the flat end corner')
cone_rings(c, 11, -2.5, -23.5, 114.0, 2.75, 2.0, 0.15)
cone_rings(c, 11, 0.5, 25.0, 106.5, 2.75, 2.0, 0.15)''')
old = '''        helix_hole(c, 4, fx, fy, 0.48, 11.5, -0.5, 0.15, name='MX small hole')'''
assert old in s
s = s.replace(old, old + '''
        cone_rings(c, 4, fx, fy, -0.5, 1.2295, 0.75, 0.1)''')
s = s.replace('''REST = []
''', '''REST = []


def cone_rings(c, T, cx, cy, w_top, r_top, r_min, dr, down=1):
    """Drill-point cone (118 deg) at the bottom of a hole: rings traced by the flat end's corner.
    down=1: frame z decreases into the hole (TOP); down=-1: frame z increases into the hole (no)."""
    tool_ = TOOLS[T]; R = tool_['D'] / 2.0
    k = 1.0 / np.tan(np.radians(59.0))
    F = feed(T) * 0.6
    rc = r_top
    c.link(np.array([cx + max(rc - R, 0), cy]), w_top + 1.0, R)
    while rc >= r_min - 1e-9:
        z = w_top - (r_top - rc) * k
        pr = rc - R
        P.G1(cx + max(pr, 0), cy, z, F=F / 2)
        if pr > 0.02:
            P.helix(cx, cy, pr, z, F)
        rc -= dr
    P.G1(cx, cy, P.pos[2], F=F)
    P.G0(z=w_top + 1.0)


def cone_ball(c, T, cx, cy, w_top, r_top, Rb, rc_max, rc_min, dr):
    k = 1.0 / np.tan(np.radians(59.0))
    apex = w_top - r_top * k
    sa, ca = np.sin(np.radians(59.0)), np.cos(np.radians(59.0))
    F = feed(T)
    rc = rc_max
    c.link(np.array([cx + rc - Rb * ca, cy]), w_top + 1.0, Rb)
    while rc >= rc_min - 1e-9:
        zc = apex + rc * k
        cr = rc - Rb * ca
        tip = zc + Rb * sa - Rb
        P.G1(cx + max(cr, 0), cy, tip, F=F / 2)
        if cr > 0.02:
            P.helix(cx, cy, cr, tip, F)
        rc -= dr
    zc = apex + Rb / sa - Rb
    P.G1(cx, cy, max(zc, P.pos[2] - 0.5), F=F / 2)
    P.G0(z=w_top + 1.0)
''')
# 5. cycle time
s = s.replace("raster(c, 6, H, box(-41, 20.0, 41, 106.0), direction='x', step=0.4, zmin=-7.0, name='MX wave')",
              "raster(c, 6, H, box(-41, 20.0, 41, 106.0), direction='x', step=0.6, zmin=-7.0, name='MX wave')")
s = s.replace("band = box(-17.0, 17.5, -10.5, 102.0) if fname == 'MY' else box(10.5, 17.5, 17.0, 102.0)",
              "band = box(-17.0, 17.5, -11.0, 102.0) if fname == 'MY' else box(11.0, 17.5, 17.0, 102.0)")
s = s.replace("raster(c, 7, H, band, direction='y', step=0.15, zmin=30.0, name=fname + ' wave edge')",
              "raster(c, 7, H, band, direction='y', step=0.3, zmin=30.0, name=fname + ' wave edge')")
open('gen.py', 'w').write(s)
print('ok')
