"""CadQuery generators for the development and validation parts.

Run:  python parts/src/make_parts.py [name ...]
Writes parts/<set>/<name>/{part.step, stock.json}. Coordinates: Z0 = part bottom = stock bottom (datum face on the
fixture plate), XY origin at the part centre.  All parts are AL6061-T6, general tolerance +-0.1 mm.
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import cadquery as cq

ROOT = Path(__file__).resolve().parents[1]
PARTS = {}


def part(set_, name, stock, description):
    def deco(fn):
        PARTS[name] = (set_, fn, stock, description)
        return fn
    return deco


# ------------------------------------------------------------------------------------------- development set
@part("dev", "motor_mount", {"x": [-52, 52], "y": [-37, 37], "z": [0, 18]},
      "Motor mount plate 100 x 70 x 16. Outer profile with R8 corners and a 1 mm x 45deg chamfer on the top outer edge. "
      "Central counterbore pocket D40 x 6 deep with a D22 through bore. Four D6.6 through holes with D11 x 6.5 deep "
      "counterbores. Rectangular pocket 30 x 20 x 8 deep (corner R3) with a D10 island standing 5 mm high. One through "
      "slot 8 wide x 25 long (obround).")
def motor_mount():
    p = (cq.Workplane().box(100, 70, 16, centered=(True, True, False))
         .edges("|Z").fillet(8))
    p = p.faces(">Z").edges().chamfer(1.0)
    p = p.faces(">Z").workplane().center(-15, 0).hole(22)
    p = (p.faces(">Z").workplane(origin=(0, 0, 16)).center(-15, 0).circle(20).cutBlind(-6))
    pts = [(-38, -25), (-38, 25), (8, -25), (8, 25)]
    p = p.faces(">Z").workplane(origin=(0, 0, 16)).pushPoints(pts).cboreHole(6.6, 11, 6.5)
    pocket = (cq.Workplane().box(30, 20, 8, centered=(True, True, False)).edges("|Z").fillet(3)
              .translate((30, -12, 8)))
    island = cq.Workplane().circle(5).extrude(5).translate((30, -12, 8))
    p = p.cut(pocket).union(island)
    slots = (cq.Workplane().pushPoints([(30, 17), (30, 27)])
             .slot2D(25, 8, 0).extrude(20).translate((0, 0, -2)))
    slots = cq.Workplane().center(30, 16).slot2D(25, 8, 0).extrude(20).translate((0, 0, -2))
    p = p.cut(slots)
    return p


@part("dev", "heatsink", {"x": [-42, 42], "y": [-32, 32], "z": [0, 24]},
      "Heat sink 80 x 60. 6 mm base, seven 2.5 mm thick fins 6.5 mm apart rising to a crowned (R60 cylindrical) top that "
      "peaks at Z22 in the middle of the part, R3 fillets at the fin roots, two end mounting lugs with D5.5 holes.")
def heatsink():
    base = cq.Workplane().box(80, 60, 6, centered=(True, True, False))
    pitch = 9.0
    fins = None
    for i in range(7):
        x = (i - 3) * pitch
        f = cq.Workplane().box(2.5, 44, 17, centered=(True, True, False)).translate((x, 0, 5.9))
        fins = f if fins is None else fins.union(f)
    # crown: intersect with a big cylinder (axis along Y) whose top is at z=22
    crown = cq.Workplane("XZ").center(0, 22 - 60).circle(60).extrude(40, both=True)
    fins = fins.intersect(crown)
    body = base.union(fins)
    # root fillets: edges at z=6 parallel to Y between fins
    body = body.edges(cq.selectors.BoxSelector((-35, -23, 5.5), (35, 23, 6.5))).edges("|Y").fillet(3.0)
    holes = cq.Workplane().pushPoints([(-34, 0), (34, 0)]).circle(2.75).extrude(30).translate((0, 0, -5))
    return body.cut(holes)


@part("dev", "mould_cavity", {"x": [-47, 47], "y": [-37, 37], "z": [0, 31]},
      "Injection-mould cavity insert 90 x 70 x 30. Elliptical cavity 70 x 50 at the top face, drafted down to a 50 x 30 "
      "floor at 14 mm depth (lofted walls), R4 blended floor edge, a spherical dome (R30) rising 6 mm from the floor in "
      "the middle. 2 mm x 45deg chamfer around the cavity rim. Four D8 guide-pin holes 12 deep near the corners.")
def mould_cavity():
    blk = cq.Workplane().box(90, 70, 30, centered=(True, True, False))
    cav = (cq.Workplane().workplane(offset=16).ellipse(25, 15)
           .workplane(offset=14.5).ellipse(35, 25).loft())
    blk = blk.cut(cav)
    try:
        blk = blk.edges(cq.selectors.BoxSelector((-26, -16, 15.5), (26, 16, 16.5))).fillet(4.0)
    except Exception:
        pass
    dome = (cq.Workplane().sphere(30).translate((0, 0, 16 + 6 - 30))
            .intersect(cq.Workplane().box(80, 80, 20, centered=(True, True, False)).translate((0, 0, 15.99))))
    blk = blk.union(dome)
    blk = blk.faces(">Z").edges("not(<X or >X or <Y or >Y)").chamfer(2.0)
    blk = blk.faces(">Z").workplane().pushPoints([(-38, -28), (-38, 28), (38, -28), (38, 28)]).hole(8, 12)
    return blk


@part("dev", "cam_plate", {"x": [-37, 48], "y": [-31, 33], "z": [0, 13]},
      "Cam plate, 12 mm thick, outer profile a smooth closed spline cam lobe (no tangent breaks) with a D24 bore and a "
      "6 wide keyway to R16.5, a hexagonal recess (30 mm across flats, 5 deep, R2 corners) around the bore, three kidney-shaped "
      "through windows (R1.9 corners), and a 1 mm x 45deg chamfer on the bore edge at the hex recess floor.")
def cam_plate():
    pts = []
    for k in range(48):
        a = 2 * math.pi * k / 48
        r = 30 + 12 * math.exp(-((math.atan2(math.sin(a - 0.3), math.cos(a - 0.3))) ** 2) / 0.6) + 3 * math.cos(2 * a)
        pts.append((r * math.cos(a), r * math.sin(a)))
    outer = cq.Workplane().spline(pts, periodic=True).close().extrude(12)
    p = outer
    hexp = cq.Workplane().polygon(6, 30 / math.cos(math.pi / 6)).extrude(5).edges("|Z").fillet(2).translate((0, 0, 7))
    p = p.cut(hexp)
    p = p.cut(cq.Workplane().circle(12).extrude(14).translate((0, 0, -1)))
    p = p.cut(cq.Workplane().box(6, 6, 14, centered=(True, True, False)).translate((0, 13.5, -1)))
    # kidney windows
    for k in range(3):
        a0 = math.radians(90 + 120 * k)
        w = (cq.Workplane().moveTo(19.5 * math.cos(a0 - 0.45), 19.5 * math.sin(a0 - 0.45))
             .threePointArc((19.5 * math.cos(a0), 19.5 * math.sin(a0)), (19.5 * math.cos(a0 + 0.45), 19.5 * math.sin(a0 + 0.45)))
             .close())
        path = cq.Workplane().center(0, 0)
        # build kidney as difference of annulus sector
        sector = (cq.Workplane().moveTo(0, 0).lineTo(40 * math.cos(a0 - 0.4), 40 * math.sin(a0 - 0.4))
                  .threePointArc((40 * math.cos(a0), 40 * math.sin(a0)), (40 * math.cos(a0 + 0.4), 40 * math.sin(a0 + 0.4)))
                  .close().extrude(14).translate((0, 0, -1)))
        ann = cq.Workplane().circle(25).circle(19).extrude(14).translate((0, 0, -1))
        kid = ann.intersect(sector).edges("|Z").fillet(1.9)
        p = p.cut(kid)
    # 1 mm x 45deg chamfer on the bore top edge
    p = p.edges(cq.selectors.BoxSelector((-12.5, -12.5, 6.5), (12.5, 12.5, 7.5))).edges("%CIRCLE").chamfer(1.0)
    return p


@part("dev", "undercut_block", {"x": [-42, 42], "y": [-27, 27], "z": [0, 32]},
      "Guide block 80 x 50 x 30 with R3 rounded top edges all round, a T-slot along X (12 wide neck, 20 wide x 6 high "
      "head, undercut: not machinable in this setup), a dovetail-free 16 wide x 8 deep slot along Y, 4 countersunk "
      "M6 holes (90deg countersink D12), and a 5deg-drafted rectangular pocket 24 x 14 x 10 deep.")
def undercut_block():
    b = cq.Workplane().box(80, 50, 30, centered=(True, True, False))
    b = b.faces(">Z").edges().fillet(3.0)
    neck = cq.Workplane().box(90, 12, 9, centered=(True, True, False)).translate((0, 0, 21.01))
    head = cq.Workplane().box(90, 20, 6, centered=(True, True, False)).translate((0, 0, 15))
    b = b.cut(neck).cut(head)
    b = b.cut(cq.Workplane().box(16, 60, 8, centered=(True, True, False)).translate((-28, 0, 22)))
    pk = (cq.Workplane().workplane(offset=20).rect(24 - 2 * 10 * math.tan(math.radians(5)), 14 - 2 * 10 * math.tan(math.radians(5)))
          .workplane(offset=10.01).rect(24, 14).loft())
    b = b.cut(pk.translate((22, 0, 0)))
    b = b.cut(cq.Workplane().box(24, 14, 1, centered=(True, True, False)).translate((22, 0, 30)))
    b = b.faces(">Z").workplane(origin=(0, 0, 30)).pushPoints([(8, -18), (8, 18), (34, -18), (34, 18)]).cskHole(6.4, 12, 90)
    return b


# ------------------------------------------------------------------------------------------- validation set
@part("validation", "gimbal_arm", {"x": [-68, 60], "y": [-23, 23], "z": [0, 21]},
      "Camera gimbal arm 120 long, tapering from 40 wide at the motor end to 24 wide at the clamp end (tangent R arcs). "
      "Motor end: D30 boss 20 tall with a spherical-cap (R40) top, D12 through bore with 1 mm chamfer. Arm web 6 thick "
      "with three triangular lightening pockets (R2 corners) 4 mm deep, perimeter rib 3 wide at full 10 mm height. "
      "Clamp end: 12 thick lug with a D8 through hole and a 1.5 wide clamp slit.")
def gimbal_arm():
    def outline():
        return (cq.Workplane().moveTo(-45, -20).lineTo(45, -12).threePointArc((57, 0), (45, 12)).lineTo(-45, 20)
                .threePointArc((-65, 0), (-45, -20)).close())
    arm = outline().extrude(10)
    # web pockets: inside offset region at z 6..10 (three triangles)
    tris = []
    for (cx, flip) in [(-16, 1), (4, -1), (24, 1)]:
        h = 8.5 if cx < 0 else (7 if cx < 20 else 6)
        t = (cq.Workplane().polyline([(cx - 8, -flip * h), (cx + 8, -flip * h), (cx, flip * h)]).close()
             .extrude(4.01).edges("|Z").fillet(2.0).translate((0, 0, 6)))
        arm = arm.cut(t)
    boss = cq.Workplane().circle(15).extrude(20).translate((-45, 0, 0))
    cap = cq.Workplane().sphere(40).translate((-45, 0, 20 - 40))
    boss = boss.intersect(cap.union(cq.Workplane().box(40, 40, 15, centered=(True, True, False)).translate((-45, 0, 0))))
    arm = arm.union(boss)
    lug = cq.Workplane().box(14, 22, 12, centered=(True, True, False)).translate((47, 0, 0))
    arm = arm.union(lug.intersect(outline().extrude(12)))
    arm = arm.cut(cq.Workplane().circle(6).extrude(30).translate((-45, 0, -1)))
    arm = arm.edges(cq.selectors.BoxSelector((-52, -7, 17), (-38, 7, 21))).chamfer(1.0)
    arm = arm.cut(cq.Workplane().circle(4).extrude(20).translate((48, 0, -1)))
    arm = arm.cut(cq.Workplane().box(14, 1.5, 20, centered=(True, True, False)).translate((56, 0, -1)))
    return arm


@part("validation", "impeller", {"x": [-42, 42], "y": [-42, 42], "z": [0, 23]},
      "Open impeller disc D80. Hub D20 (rising to Z22) with a D8 bore. The disc surface between hub and rim is a "
      "concave conical dish falling from Z12 at the hub to Z6 at R36, then flat to the rim. Six backward-curved blades "
      "2.5 mm thick (circular-arc camber) stand on the dish with tops at Z18, R0.8 not required (sharp). Rim edge "
      "chamfer: intended but not in the CAD.")
def impeller():
    prof = (cq.Workplane("XZ").moveTo(0, 0).lineTo(40, 0).lineTo(40, 6).lineTo(36, 6).lineTo(10, 12)
            .lineTo(10, 22).lineTo(0, 22).close())
    disc = prof.revolve(360, (0, 0, 0), (0, 1, 0))
    blades = None
    for k in range(6):
        a = 2 * math.pi * k / 6
        # circular-arc camber line from r=9 to r=37, swept back 50deg
        def pt(r, da):
            ang = a + da
            return (r * math.cos(ang), r * math.sin(ang))
        c0, c1, c2 = pt(9, 0), pt(23, -0.35), pt(37, -0.85)
        bl = (cq.Workplane().moveTo(*c0).threePointArc(c1, c2)
              .offset2D(1.25, "arc").extrude(18))
        blades = bl if blades is None else blades.union(bl)
    keep = cq.Workplane().circle(37).extrude(18)
    blades = blades.intersect(keep)
    imp = disc.union(blades)
    imp = imp.cut(cq.Workplane().circle(4).extrude(30).translate((0, 0, -1)))
    imp = imp.faces(">Z[-4]").edges() if False else imp
    try:
        imp = imp.edges(cq.selectors.BoxSelector((-41, -41, 5.5), (41, 41, 6.5))).edges("%CIRCLE").chamfer(1.0)
    except Exception:
        pass
    return imp


def build(name):
    set_, fn, stock, desc = PARTS[name]
    out = ROOT / set_ / name
    out.mkdir(parents=True, exist_ok=True)
    shape = fn()
    solids = shape.solids().vals()
    assert len(solids) == 1, f"{name}: {len(solids)} solids"
    bb = shape.val().BoundingBox()
    cq.exporters.export(shape, str(out / "part.step"))
    s = {"name": name, **stock, "material": "AL6061-T6", "description": desc,
         "part_bbox": [round(v, 3) for v in (bb.xmin, bb.ymin, bb.zmin, bb.xmax, bb.ymax, bb.zmax)]}
    assert bb.zmin > -1e-6 and abs(bb.zmin) < 1e-6, f"{name}: part bottom not at Z0 ({bb.zmin})"
    assert stock["x"][0] < bb.xmin and stock["x"][1] > bb.xmax and stock["y"][0] < bb.ymin and stock["y"][1] > bb.ymax
    assert stock["z"][1] >= bb.zmax
    (out / "stock.json").write_text(json.dumps(s, indent=1))
    print(f"{name}: bbox {s['part_bbox']} volume {shape.val().Volume():.0f} mm3, faces {len(shape.faces().vals())}")


if __name__ == "__main__":
    for n in (sys.argv[1:] or list(PARTS)):
        build(n)
