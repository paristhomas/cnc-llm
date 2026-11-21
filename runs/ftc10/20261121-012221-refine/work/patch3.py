o = open('ops.py').read()
o = o.replace('''def raster(ctx, T, hm, region, direction='x', step=0.3, zmin=-1e9, Ffac=1.0, name='', sample=0.2, zigzag=True, target=None, lift=0.5):
    """Ball/bull/flat drop-cutter raster finishing over tool-centre region `region` (polygon)."""
    H, x0, y0, res = hm
    tool = TOOLS[T]; R = tool['D'] / 2.0
    F = feed(T, Ffac)
    kern = tool_kernel(tool, res)
    p = ctx.p''', '''def clear_maps(ctx, tool):
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
    p = ctx.p''')
o = o.replace('''            z = drop_line(H, x0, y0, res, kern, q[:, 0], q[:, 1])
            ok = z > zmin
            if target is not None:
                ok &= keep''', '''            z = drop_line(H, x0, y0, res, kern, q[:, 0], q[:, 1])
            ok = z > zmin
            if target is not None:
                ok &= keep
            cl = clear_ok(ctx, tool, maps, q[:, 0], q[:, 1], z)
            nbad += int((ok & ~cl).sum())
            ok &= cl''')
o = o.replace('''                p.G1(z=pts[0, 2], F=F / 2)''', '''                p.G1(z=pts[0, 2], F=F / 3)''')
o = o.replace('''    ctx.log.append('%s T%d raster %s paths %d' % (name, T, direction, n))''', '''    ctx.log.append('%s T%d raster %s paths %d (dropped %d pts for holder/shank clearance)' % (name, T, direction, n, nbad))''')
open('ops.py', 'w').write(o)

s = open('gen.py').read()
s = s.replace('''def hm(fname, res=0.1):
    if fname not in HM:
        m = mesh_in(FR[fname]); b = m.bounds
        x0, y0 = b[0, 0] - 6, b[0, 1] - 6
        nx = int((b[1, 0] - b[0, 0] + 12) / res) + 1; ny = int((b[1, 1] - b[0, 1] + 12) / res) + 1
        H = zbuffer(m, x0, y0, nx, ny, res, fill=-1e9)
        HM[fname] = (H, x0, y0, res)
    return HM[fname]''', '''def hm(fname, res=0.05):
    if fname not in HM:
        import os
        from scipy.ndimage import maximum_filter
        fn = RUN + 'work/cache/hm005_%s.npz' % fname
        m = mesh_in(FR[fname]); b = m.bounds
        x0, y0 = b[0, 0] - 6, b[0, 1] - 6
        nx = int((b[1, 0] - b[0, 0] + 12) / res) + 1; ny = int((b[1, 1] - b[0, 1] + 12) / res) + 1
        if os.path.exists(fn):
            H = np.load(fn)['H']
        else:
            H = zbuffer(m, x0, y0, nx, ny, res, fill=-1e9)
            H = maximum_filter(H, size=3, mode='nearest')
            np.savez_compressed(fn, H=H)
        HM[fname] = (H, x0, y0, res)
    return HM[fname]''')
s = s.replace("rough(c, 1, [15.5], 0.0, 6.5, dom_face, top=18.5, name='PX face')",
              "area_clear(c, 1, 15.5, box(-40.5, 16.5, 40.5, 159.5).difference(c.sh.get(15.52)), domain=dom_face, name='PX face')")
s = s.replace("rough(c, 1, [37.5], 0.0, 6.5, box(-25, 5.0, 25, 166), top=40.5, name=fname + ' face')",
              "area_clear(c, 1, 37.5, box(-18.5, 0.0, 18.5, 159.5), domain=box(-25, 5.0, 25, 166), name=fname + ' face')")
s = s.replace("rough(c, 1, [15.5], 0.0, 6.5, box(-47, 5.0, 47, 22.0), top=18.5, name='PO1 face')",
              "area_clear(c, 1, 15.5, box(-40.5, 0.0, 40.5, 20.0), domain=box(-47, 5.0, 47, 22.0), name='PO1 face')")
s = s.replace("raster(c, 6, H, box(-41, 20.0, 41, 100.5), direction='x', step=0.4, zmin=-7.0, name='MX wave')",
              "raster(c, 6, H, box(-41, 20.0, 41, 106.0), direction='x', step=0.4, zmin=-7.0, name='MX wave')")
s = s.replace("raster(c, 6, H, box(-8.5, 96.0, 8.5, 142.5), direction='y', step=0.3, zmin=7.0, name='MX ridge')",
              "raster(c, 6, H, box(-8.5, 96.0, 8.5, 142.5), direction='y', step=0.2, zmin=7.0, name='MX ridge')")
s = s.replace("raster(c, 7, H, box(-41, 139.0, 41, 144.5), direction='x', step=0.2, zmin=-9.0, name='MX top edge')",
              "raster(c, 7, H, box(-41, 139.0, 41, 144.5), direction='x', step=0.2, zmin=5.5, name='MX top edge')")
s = s.replace("band = unary_union([q.exterior.buffer(2.2) for q in ol]).intersection(box(-41, -1.0, 41, 14.0))",
              "band = unary_union([q.exterior.buffer(2.2) for q in ol]).intersection(box(-41, -1.0, 41, 16.4))")
s = s.replace("paths = raster(c, 7, H, band.envelope.intersection(box(-41, -1.0, 41, 14.0)), direction='x', step=0.2, zmin=-9.3, name='PO2 outline rounds', target=band)",
              "paths = raster(c, 7, H, band.envelope.intersection(box(-41, -1.0, 41, 16.4)), direction='x', step=0.2, zmin=-9.3, name='PO2 outline rounds', target=band)")
s = s.replace('''    area_clear(c, Ts, w, reg, domain=dom, keepout=keepout, name=name + ' rest floor')
    contour(c, Ts, w, domain=dom, keepout=keepout, only=reg.buffer(TOOLS[Ts]['D'] + 0.5), name=name + ' rest wall')''', '''    area_clear(c, Ts, w, reg, domain=dom, keepout=keepout, name=name + ' rest floor')
    contour(c, Ts, w, domain=dom, keepout=keepout, only=reg.buffer(TOOLS[Ts]['D'] + 0.5), name=name + ' rest wall')
    REST.append((name, w, reg))''')
s = s.replace('''BIG = box(''', '''REST = []

BIG = box(''', 1)
s = s.replace('''P.c('T3 comb slots (3 mm wide)')''', '''for nm, w, reg in REST:
    if nm == 'MX':
        contour(c, 3, w + 1.05, domain=box(-47, 95, 47, 145), keepout=KEEP_LOW, only=reg.buffer(3.5), name='MX rest wall above fillet')
P.c('T3 comb slots (3 mm wide)')''')
s = s.replace('''tool(c, 2)
P.c('T2 counterbores of the top ears')''', '''tool(c, 13)
P.c('T13 R1 ball: base fillets where the bull nose cannot reach')
for nm, w, reg in REST:
    if nm == 'MX':
        contour(c, 13, w, domain=box(-47, 95, 47, 145), keepout=KEEP_LOW, only=reg.buffer(2.0), name='MX rest fillet')
tool(c, 2)
P.c('T2 counterbores of the top ears')''')
s = s.replace('''corners_top = unary_union([box(14, 144, 24, 153), box(-24, 144, -14, 153)])''', '''rest_floor(c, 3, -1.5, 1, box(-30, 16.5, 30, 105), keepout=KEEP_LOW, name='PX pocket')
corners_top = unary_union([box(14, 144, 24, 153), box(-24, 144, -14, 153)])''', 1)
old_slab = '''tool(c, 1)
P.c('PO-2 slab pass from -X under the part (tool centre Z-5, flank tangent to Z0)')
for w in (12.0, 5.5, -1.0, -7.5, -(TAB_X0)):
    slab_pass(c, w, -47.0, 47.0)
c.retract()'''
assert old_slab in s
s = s.replace(old_slab, '''c.retract()''')
old_r = '''tool(c, 7)
H = hm('MX')
raster(c, 7, H, box(-41, 14.5, 41, 26.0), direction='x', step=0.25, zmin=-7.0, name='PO2 bottom edge')'''
assert old_r in s
s = s.replace(old_r, '''tool(c, 1)
P.c('PO-2 slab pass from -X under the part (tool centre Z-5, flank tangent to Z0)')
for w in (12.0, 5.5, -1.0, -7.5, -(TAB_X0)):
    slab_pass(c, w, -47.0, 47.0)
tool(c, 7)
H = hm('MX')
raster(c, 7, H, box(-41, 14.5, 41, 26.0), direction='x', step=0.25, zmin=-7.0, name='PO2 bottom edge')''')
open('gen.py', 'w').write(s)
print(s.count('slab_pass(c, w'), s.count('REST'), s.count('area_clear(c, 1, 37.5'), s.count("PX face')"))
