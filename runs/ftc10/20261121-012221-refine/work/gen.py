"""FTC-10 3+2 program generator (own CAM). Writes program.nc."""
import numpy as np, sys, time, json
from shapely.geometry import box, Polygon, LineString, Point
from shapely.ops import unary_union
from geom import FR, mesh_in, zbuffer, RUN
from shadow import Shadow
from stock import Stock
from gcode import Prog, TOOLS, feed
import ops
from ops import Ctx, rough, contour, area_clear, helix_hole, peck_drill, raster, polys

T0 = time.time()
FR['TOP'].zshift = 20.0   # TOP frame emitted with G68.2 Z20 so that the M6 / park height Z150 lies above the 159.5 mm stock
P = Prog()
ST = Stock()
LOG = []
SH = {k: Shadow(k) for k in ['TOP', 'MX', 'PX', 'MY', 'PY']}
HM = {}


def hm(fname, res=0.05):
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
    return HM[fname]


def ctx(fname, safe):
    return Ctx(P, ST, SH[fname], FR[fname], safe, LOG)


def tool(c, T):
    P.use(c.f, T, c.safe)
    if P.pos[2] < c.safe:
        P.G0(z=c.safe)


def rest_floor(c, Ts, w, Tb, dom, keepout=None, name=''):
    from shadow import forbidden
    big = TOOLS[Tb]; Rb = big['D'] / 2.0
    allowed_big = dom.difference(forbidden(c.sh, big, w, extra=0.0, keepout=keepout))
    swept = allowed_big.buffer(Rb - big.get('r', 0) - 0.05)
    reg = floor_region(c.sh, w).intersection(dom).difference(swept).buffer(-0.05).buffer(0.05)
    if reg.area < 0.3:
        LOG.append('%s rest floor w=%.2f none' % (name, w)); return
    area_clear(c, Ts, w, reg, domain=dom, keepout=keepout, name=name + ' rest floor')
    contour(c, Ts, w, domain=dom, keepout=keepout, only=reg.buffer(TOOLS[Ts]['D'] + 0.5), name=name + ' rest wall')
    REST.append((name, w, reg))


def floor_region(sh, w):
    return sh.sec(w - 0.05).difference(sh.get(w + 0.02).buffer(0.01))


def slab_pass(c, w, xa, xb, Ff=0.45, start_z=None):
    c.link(np.array([xa, -5.0]), 25.0, 5.0)
    if start_z is not None:
        P.G0(z=start_z)
    P.G1(z=w, F=feed(1) / 3)
    P.G1(x=xb, y=-5.0, z=w, F=feed(1) * Ff)
    P.G0(z=25.0)
    c.remove_swept([np.array([[xa, -5.0], [xb, -5.0]])], 5.0, w)
    c.refresh_top()


REST = []


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
            P.helix(cx, cy, pr, z, F * pr / (pr + R))
        rc -= dr
    P.G1(cx, cy, P.pos[2], F=F / 2)
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

BIG = box(-500, -500, 500, 500)
KEEP_LOW = box(-500, -500, 500, 16.5)   # bottom-end bulk kept until the part-off (side frames, frame y = G54 Z)

# =====================================================================================
P.c('SETUP 1: TOP (A0) - top of the part: face, body top face, axial holes')
c = ctx('TOP', 165.0)
P.set_frame(FR['TOP'], 165.0)
TOOLS[1]['rpm'] = 15000   # post-review: 750 Hz tooth passing, F = 0.06 x 3 x 15000 = 2700
tool(c, 1)
P.c('T1 rough above the body top face, around the top ears plate (S15000 F2700: off the stock bending mode)')
dom = box(-25, -47, 25, 47)
rough(c, 1, [156.5, 153.5, 150.5, 147.5, 144.5, 141.8], 0.3, 6.0, dom, top=159.5, name='TOP')
tool(c, 5)
TOOLS[1]['rpm'] = 18000
P.c('T5 finish body top face Z141.5')
area_clear(c, 5, 141.5, floor_region(c.sh, 141.5), domain=dom, name='TOP')
tool(c, 10)
P.c('T10 pre-drill the two axial holes (holder stays above the ears)')
peck_drill(c, 10, -2.5, -23.5, 141.5, 119.5, peck=3.0, name='TOP')
peck_drill(c, 10, 0.5, 25.0, 141.5, 119.5, peck=3.0, name='TOP')
tool(c, 11)
P.c('T11 long-neck helical finish of the 5.5 mm axial holes')
helix_hole(c, 11, -2.5, -23.5, 0.75, 141.5, 119.8, 0.6, name='TOP pre-drilled part', final_circle=False)
helix_hole(c, 11, -2.5, -23.5, 0.75, 119.8, 114.0, 0.2, name='TOP')
helix_hole(c, 11, 0.5, 25.0, 0.75, 141.5, 119.8, 0.6, name='TOP pre-drilled part', final_circle=False)
helix_hole(c, 11, 0.5, 25.0, 0.75, 119.8, 106.5, 0.2, name='TOP')
P.c('T11 drill-point cones: outer ring traced by the flat end corner')
cone_rings(c, 11, -2.5, -23.5, 114.0, 2.75, 2.0, 0.15)
cone_rings(c, 11, 0.5, 25.0, 106.5, 2.75, 2.0, 0.15)
c.retract()

# =====================================================================================
P.c('SETUP 2: +X (A90) - model bottom face, pocket, top ears outline')
c = ctx('PX', 25.0)
tool(c, 1)
P.c('T1 face the bottom face (3 mm)')
dom_face = box(-47, 16.5 + 5.0, 47, 166)
area_clear(c, 1, 15.5, box(-40.5, 16.5, 40.5, 159.5).difference(c.sh.get(15.52)), domain=dom_face, name='PX face')
P.c('T1 rough pocket and top-ears outline')
dom_px = unary_union([box(-33, 16.5, 33, 141.5), box(-47, 141.5, 47, 166)])
rough(c, 1, [12.5, 9.5, 7.3], 0.3, 6.0, dom_px, keepout=KEEP_LOW, top=15.5, name='PX')
rough(c, 1, [4.4, 1.5, -1.2], 0.3, 6.0, box(-30, 16.5, 30, 105), keepout=KEEP_LOW, top=7.3, name='PX pocket')
P.c('T1 finish pocket floor and top-ears outline walls')
area_clear(c, 1, -1.5, floor_region(c.sh, -1.5), domain=box(-30, 16.5, 30, 105), name='PX pocket floor')
contour(c, 1, 8.5, domain=box(-47, 141.5, 47, 166), only=box(-47, 140, 47, 170), name='PX outline')
tool(c, 2)
P.c('T2 pocket walls')
for w in (8.0, 0.6):
    contour(c, 2, w, domain=box(-30, 16.5, 30, 105), only=box(-30, 16.5, 30, 105), name='PX pocket')
tool(c, 3)
P.c('T3 pocket walls and R2 corners, outline corners')
for w in (10.5, 5.5, 0.6):
    contour(c, 3, w, domain=box(-30, 16.5, 30, 105), only=box(-30, 16.5, 30, 105), name='PX pocket')
rest_floor(c, 3, -1.5, 1, box(-30, 16.5, 30, 105), keepout=KEEP_LOW, name='PX pocket')
corners_top = unary_union([box(14, 144, 24, 153), box(-24, 144, -14, 153)])
for w in (12.0, 8.5):
    contour(c, 3, w, domain=box(-47, 141.5, 47, 166), only=corners_top, name='PX outline corners')
P.c('T3 through holes of the top ears (6 mm)')
for fx in (28.5, -28.5):
    helix_hole(c, 3, fx, 149.0, 1.5, 15.5, 9.3, 0.3, name='PX ear hole')
tool(c, 4)
P.c('T4 R1 corners between ears flat and lobes')
for w in (11.0, 8.5):
    contour(c, 4, w, domain=box(-47, 141.5, 47, 166), only=corners_top, name='PX outline corners')
tool(c, 7)
P.c('T7 R2 fillets around the pocket floor (ball waterlines)')
for phi in np.radians(np.arange(0, 91, 10)):
    w = -1.5 + 0.5 * (1 - np.cos(phi))
    contour(c, 7, w, domain=box(-30, 16.5, 30, 105), only=box(-30, 16.5, 30, 105), name='PX fillet')
tool(c, 13)
P.c('T13 small holes in the pocket floor (into the cross holes)')
for fx in (15.5, -15.5):
    for fy in (27, 49, 71, 93):
        helix_hole(c, 13, fx, fy, 0.25, -1.5, -5.0, 0.2, name='PX ceiling hole')
c.retract()

# =====================================================================================
P.c('SETUP 3: -X (A90) - wave side, right-hand features, top ears counterbores')
c = ctx('MX', 25.0)
tool(c, 1)
P.c('T1 rough')
dom_mx = box(-47, 0, 47, 166)
lv = [16.0, 15.0, 14.2, 13.4, 12.6, 11.8, 10.3, 9.0, 7.8, 5.5, 3.0, 0.5, -2.0, -4.5, -7.2]
rough(c, 1, lv, 0.3, 6.0, dom_mx, keepout=KEEP_LOW, top=18.5, name='MX')
tool(c, 2)
P.c('T2 rest rough corners')
rough(c, 2, [14.0, 12.0, 10.3, 9.0, 7.8], 0.3, 3.5, box(-47, 95, 47, 166), keepout=KEEP_LOW, top=15.5, name='MX rest', erode=0.6)
tool(c, 5)
P.c('T5 bull nose: floors and walls with R1 base fillets')
for w in (15.5, 11.5, 7.5):
    area_clear(c, 5, w, floor_region(c.sh, w), domain=box(-47, 95, 47, 145), keepout=KEEP_LOW, name='MX floor')
for w in (11.5, 7.5):
    contour(c, 5, w, domain=box(-47, 95, 47, 145), keepout=KEEP_LOW, only=box(-47, 95, 47, 145), name='MX walls')
area_clear(c, 5, -7.5, floor_region(c.sh, -7.5).intersection(box(-47, 141, 47, 166)), domain=box(-47, 141, 47, 166), name='MX plate face')
contour(c, 5, -7.5, domain=box(-47, 135, 47, 166), only=box(-38, 135, 38, 166), name='MX plate wall')
tool(c, 3)
P.c('T3 floors and walls the bull nose cannot reach')
for w in (15.5, 11.5, 7.5):
    rest_floor(c, 3, w, 5, box(-47, 95, 47, 145), keepout=KEEP_LOW, name='MX')
for nm, w, reg in REST:
    if nm == 'MX':
        contour(c, 3, w + 1.05, domain=box(-47, 95, 47, 145), keepout=KEEP_LOW, only=reg.buffer(3.5), name='MX rest wall above fillet')
P.c('T3 comb slots (3 mm wide)')
for fy in (118.0, 129.0):
    c.link(np.array([-36.0, fy]), 11.5 + 1.0, 1.5)
    P.G1(z=10.0, F=feed(3) / 3)
    P.G1(x=-14.0, y=fy, z=10.0, F=feed(3) * 0.7)
    P.G0(z=13.0)
P.c('T3 3.5 mm holes in pads and boss (break into the axial holes)')
for fy in (112.5, 123.5, 134.5):
    helix_hole(c, 3, -25.0, fy, 0.25, 11.5, 1.3, 0.3, name='MX pad hole')
for fy in (119.5, 126.5, 133.5):
    helix_hole(c, 3, 23.5, fy, 0.25, 15.5, 4.2, 0.3, name='MX boss hole')
tool(c, 4)
P.c('T4 2.46 mm holes in pads')
for fx, fys in ((-30.0, (110.9, 121.9, 132.9)), (-20.0, (114.1, 125.1, 136.1))):
    for fy in fys:
        helix_hole(c, 4, fx, fy, 0.48, 11.5, -0.5, 0.25, name='MX small hole')
        cone_rings(c, 4, fx, fy, -0.5, 1.2295, 0.75, 0.1)
tool(c, 13)
P.c('T13 R1 ball: base fillets where the bull nose cannot reach')
for nm, w, reg in REST:
    if nm == 'MX':
        contour(c, 13, w, domain=box(-47, 95, 47, 145), keepout=KEEP_LOW, only=reg.buffer(2.0).difference(box(-9.5, 90, 9.5, 145)), name='MX rest fillet')
tool(c, 2)
P.c('T2 counterbores of the top ears')
for fx in (28.5, -28.5):
    helix_hole(c, 2, fx, 149.0, 2.0, -7.5, -9.5, 0.5, name='MX cbore')
tool(c, 6)
P.c('T6 ball: wave (passes along the crests) and the ridge')
H = hm('MX')
raster(c, 6, H, box(-41, 20.0, 41, 106.0), direction='x', step=0.75, zmin=-7.0, name='MX wave')
raster(c, 6, H, box(-8.5, 96.0, 8.5, 142.5), direction='y', step=0.2, zmin=7.0, name='MX ridge')
tool(c, 7)
P.c('T7 ball: edge rounds at the body top and the top ears')
raster(c, 7, H, box(-41, 139.0, 41, 144.5), direction='x', step=0.2, zmin=5.5, name='MX top edge')
raster(c, 7, H, box(-9.5, 95.0, 9.5, 107.0), direction='y', step=0.25, zmin=6.0, name='MX ridge junction')
tool(c, 13)
P.c('T13 R1 ball waterlines: last wave crest down to its R1 floor fillet (the 6 mm ball cannot reach the corner)')
for w in (11.0, 10.2, 9.5, 8.9, 8.4, 8.0, 7.7, 7.5):
    contour(c, 13, w, domain=box(-47, 95, 47, 145), keepout=KEEP_LOW, only=box(-38, 98.5, 38, 106).difference(box(-9.5, 90, 9.5, 145)), name='MX crest junction')
P.c('T13 R1 ball waterlines (top down): ridge / last crest / floor junction')
for w in (13.0, 12.0, 11.0, 10.2, 9.5, 8.9, 8.4, 8.0, 7.7, 7.5):
    contour(c, 13, w, domain=box(-47, 95, 47, 145), keepout=KEEP_LOW, only=box(-9.5, 97.0, 9.5, 106.0), name='MX ridge junction')

tool(c, 7)
for xa, xb in ((33.5, 41.0), (-41.0, -33.5)):
    raster(c, 7, H, box(xa, 100.0, xb, 141.0), direction='y', step=0.3, zmin=5.0, name='MX side edge')
ol_t = [q for q in polys(SH['MX'].sec(-8.0)) if q.bounds[3] > 150]
band_t = unary_union([q.exterior.buffer(1.9) for q in ol_t]).intersection(box(-41, 142.0, 41, 161.0))
tool(c, 14)
raster(c, 14, H, band_t.envelope, direction='x', step=0.3, zmin=-9.3, name='MX top outline rounds', target=band_t)
c.retract()

# =====================================================================================
for fname, side in (('MY', -1), ('PY', 1)):
    P.c('SETUP %s: %s (A90) - side face, counterbores and cross holes, edge rounds' % (fname, '-Y' if side < 0 else '+Y'))
    c = ctx(fname, 46.0)
    tool(c, 1)
    P.c('T1 face')
    area_clear(c, 1, 37.5, box(-18.5, 0.0, 18.5, 159.5), domain=box(-25, 5.0, 25, 166), name=fname + ' face')
    hx = -7.5 if fname == 'MY' else 7.5   # frame x of the cross holes
    if fname == 'MY':
        tool(c, 3)
        P.c('T3 grooves')
        gd = box(-8.5, 117.0, 17.0, 136.0)
        rough(c, 3, [36.5, 35.5, 34.8], 0.2, 1.5, gd, top=37.5, name='MY groove')
        for w in (36.5, 34.5):
            area_clear(c, 3, w, floor_region(c.sh, w).intersection(gd), domain=gd, name='MY groove floor')
            contour(c, 3, w, domain=gd, only=gd, name='MY groove wall')
    tool(c, 2)
    P.c('T2 counterbores 10 mm x 10')
    for fy in (27.0, 49.0, 71.0, 93.0):
        helix_hole(c, 2, hx, fy, 2.0, 37.5, 27.5, 1.0, name=fname + ' cbore')
    tool(c, 10)
    P.c('T10 drill 5 mm to the centre')
    for fy in (27.0, 49.0, 71.0, 93.0):
        peck_drill(c, 10, hx, fy, 27.5, -1.0, peck=4.0, name=fname)
    tool(c, 12)
    P.c('T12 long-reach helical finish of the 7 mm cross holes')
    for fy in (27.0, 49.0, 71.0, 93.0):
        helix_hole(c, 12, hx, fy, 0.5, 27.5, -0.5, 0.3, name=fname + ' hole')
    tool(c, 7)
    P.c('T7 edge rounds wave / side face and body top edge')
    H = hm(fname)
    band = box(-17.0, 17.5, -11.0, 102.0) if fname == 'MY' else box(11.0, 17.5, 17.0, 102.0)
    raster(c, 7, H, band, direction='y', step=0.35, zmin=30.0, name=fname + ' wave edge')
    raster(c, 7, H, box(-9.0, 139.0, 9.0, 145.0), direction='x', step=0.2, zmin=30.0, name=fname + ' top edge')
    c.retract()

# =====================================================================================
P.c('PART-OFF')
P.L.append('(PART-OFF)')
TAB_Y = 28.5; TAB_HL = 2.2; TAB_X0, TAB_X1 = 10.7, 13.3
P.c('PO-1 +X: face the bottom-end margin and drill the bottom ear holes')
c = ctx('PX', 25.0)
tool(c, 1)
area_clear(c, 1, 15.5, box(-40.5, 0.0, 40.5, 20.0), domain=box(-47, 5.0, 47, 22.0), name='PO1 face')
tool(c, 3)
for fx in (28.5, -28.5):
    helix_hole(c, 3, fx, 9.0, 1.5, 15.5, 9.3, 0.3, name='PO1 ear hole')
c.retract()

P.c('PO-2 -X: remove the bottom-end bulk, finish the bottom end, pre-cut outline edge rounds, slab from -X')
c = ctx('MX', 25.0)
tool(c, 1)
lv = [16.0, 13.4, 10.8, 8.2, 5.6, 3.0, 0.4, -2.2, -4.8, -7.2]
rough(c, 1, lv, 0.3, 6.0, box(-47, 5.0, 47, 30), top=18.5, name='PO2 bulk')
tool(c, 2)
rough(c, 2, [14.0, 10.3, 7.8, 3.0, -2.0, -7.2], 0.3, 3.5, box(-47, 3.0, 47, 26), top=16.0, name='PO2 rest', erode=0.6)
tool(c, 5)
area_clear(c, 5, 7.5, floor_region(c.sh, 7.5).intersection(box(-47, 15, 47, 20)), domain=box(-47, 15, 47, 22), name='PO2 strip')
contour(c, 5, 7.5, domain=box(-47, 14, 47, 24), only=box(-47, 14, 47, 24), name='PO2 strip wall')
area_clear(c, 5, -7.5, floor_region(c.sh, -7.5).intersection(box(-47, 0, 47, 17)), domain=box(-47, 4.0, 47, 20), name='PO2 plate face')
contour(c, 5, -7.5, domain=box(-47, 4.0, 47, 24), only=box(-38, 12, 38, 24), name='PO2 plate wall')
tool(c, 2)
for fx in (28.5, -28.5):
    helix_hole(c, 2, fx, 9.0, 2.0, -7.5, -9.5, 0.5, name='PO2 cbore')
tool(c, 7)
H = hm('MX')
raster(c, 7, H, box(-41, 14.5, 41, 23.0), direction='x', step=0.3, zmin=-7.0, name='PO2 bottom edge')
# outline edge rounds at the bottom ears, cut into the plate before the outline exists
outline = SH['MX'].sec(-8.0)  # plate section just behind the face
ol = [q for q in polys(outline) if q.bounds[1] < 10]
band = unary_union([q.exterior.buffer(1.9) for q in ol]).intersection(box(-41, -1.0, 41, 16.4))
tool(c, 13)
for w in (11.0, 10.2, 9.5, 8.9, 8.4, 8.0, 7.7, 7.5):
    contour(c, 13, w, domain=box(-47, 4.0, 47, 30), only=box(-38, 14.0, 38, 21.5), name='PO2 crest junction')
tool(c, 1)
P.c('PO-2 slab pass from -X under the part (tool centre Z-5, flank tangent to Z0)')
for w in (12.0, 5.5, -1.0, -7.5, -(TAB_X0)):
    slab_pass(c, w, -47.0, 47.0)
tool(c, 14)
paths = raster(c, 14, H, band.envelope.intersection(box(-41, -1.0, 41, 16.4)), direction='x', step=0.3, zmin=-9.3, name='PO2 outline rounds', target=band)
c.retract()

P.c('PO-3 +X: bottom ears outline, lobes down to the tabs, slab from +X, web to tabs')
c = ctx('PX', 25.0)
tool(c, 1)
rough(c, 1, [12.5, 9.5, 7.3], 0.3, 6.0, box(-47, 5.0, 47, 17.0), top=15.5, name='PO3 outline')
contour(c, 1, 8.5, domain=box(-47, 5.0, 47, 17.0), only=box(-47, 0, 47, 17.0), name='PO3 outline wall')
tabs_px = unary_union([box(TAB_Y - TAB_HL, -40, TAB_Y + TAB_HL, 0.0), box(-TAB_Y - TAB_HL, -40, -TAB_Y + TAB_HL, 0.0)])
lobe_dom = box(-41, -3.0, 41, 12.0)
tool(c, 2)
rough(c, 2, [12.0, 9.5, 7.3], 0.15, 3.0, lobe_dom, keepout=tabs_px, top=15.5, name='PO3 lobes')
tool(c, 3)
for w in (12.0, 8.5):
    contour(c, 3, w, domain=box(-47, -1.5, 47, 17.0), keepout=tabs_px, only=box(-47, -2, 47, 17.0), name='PO3 lobes fin')
corners_bot = unary_union([box(14, 5, 24, 14), box(-24, 5, -14, 14)])
tool(c, 4)
for w in (11.0, 8.5):
    contour(c, 4, w, domain=box(-47, 0.0, 47, 17.0), only=corners_bot, name='PO3 corners')
tool(c, 1)
P.c('PO-3 slab from +X leaves a 2.6 mm web under the lobes')
slab_pass(c, TAB_X1, -47.0, 47.0)
P.c('PO-3 final: cut the web through except the two tabs (Y=+-28.5)')
wfin = TAB_X0 - 0.5
xin = TAB_Y - TAB_HL - 5.0; xout = TAB_Y + TAB_HL + 5.0
for a, b in ((-47.0, -xout), (47.0, xout)):
    slab_pass(c, wfin, a, b, Ff=0.4)
P.c('PO-3 middle web segment: ramp in along Y (no plunge), then clean the ramp back at depth')
c.link(np.array([-xin, -5.0]), 25.0, 5.0)
P.G0(z=TAB_X1 + 1.0)
P.G1(z=TAB_X1 + 0.3, F=feed(1) / 3)
L_r = (TAB_X1 + 0.3 - wfin) / np.tan(np.radians(5.0))
P.G1(x=-xin + L_r, y=-5.0, z=wfin, F=feed(1) * 0.35)
P.G1(x=xin, y=-5.0, z=wfin, F=feed(1) * 0.4)
P.G1(x=-xin, y=-5.0, z=wfin, F=feed(1) * 0.4)
P.G0(z=25.0)
c.remove_swept([np.array([[-xin, -5.0], [xin, -5.0]])], 5.0, wfin)
P.end()

open(RUN + 'work/program.nc', 'w').write(P.text())
json.dump(LOG, open(RUN + 'work/gen_log.json', 'w'), indent=0)
print('\n'.join(LOG))
print(sorted([(round(v,1), k) for k, v in P.tt.items()], reverse=True))
print('lines', len(P.L), 'cut time %.1f min, rapid %.1f min, total %.1f s gen' % (P.t_cut, P.t_rapid, time.time() - T0))
np.save(RUN + 'work/stock_final.npy', ST.occ)
import pickle
pickle.dump([(m[0], m[1], m[2], m[3], m[4], i) for i, m in enumerate(P.moves)], open(RUN + 'work/moves.pkl', 'wb'))
