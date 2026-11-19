"""Job brief for the LLM: what a CAM programmer would get (model, stock, fixture, machine, tools) + a geometry digest."""
from __future__ import annotations

import json
import shutil
from collections import defaultdict
from pathlib import Path

import numpy as np

from . import render
from .part import Part, TOL
from .tools import LIBRARY, MACHINE, library_table

DIALECT = """\
- Metric, absolute: start with `G21 G90 G17 G94`. Incremental (G91), inch (G20), cutter compensation (G41/G42),
  G28/G30/G53, work offsets other than G54, macros/variables/O-words and canned cycles other than G81/G82/G83 are
  rejected. Unknown words are errors, never ignored.
- Tool change: `T<n> M6` then `G43 H<n>` (same n) before cutting. M6 retracts Z to the machine home Z150 first.
- Spindle: `S<rpm> M3` before cutting (M4 is rejected), `M5` to stop. Feed `F` in mm/min (max 6000).
- Motion: G0 (rapid), G1, G2/G3 in the XY plane with I/J (incremental centre) or R, helical Z allowed.
  Drilling: `G81/G82/G83 X Y Z R [Q] [P] F` with G98/G99, cancel with G80.
- End with `M5` and `M30`.
- Machine starts at X0 Y0 Z150. Travel X[-300,300] Y[-200,200] Z[-5,200].
"""

RULES = """\
- **Crashes are errors**: a rapid (G0) that touches material, cutting with the spindle stopped, material contact
  above a tool's flute length (shank rubbing), the tool holder touching material (depth beyond stick-out), cutting
  more than 0.5 mm below Z0 (into the fixture plate).
- **Cutting data in aluminium are checked**: feed per tooth must stay below 2.5x the library chip load; cut
  cross-section (removed area per mm of travel) must stay below 0.75 x D^2; plunging with a non-centre-cutting tool is
  an error; deep plunges should be ramped or helical. Drill T10 must not side-mill.
- The program must be something a machinist would run: sensible step-downs and step-overs, clearance moves above the
  stock before rapids, roughing before finishing.
"""


def faces_digest(part: Part) -> str:
    F = part.faces
    L = []
    planes_h = defaultdict(list)
    for f in F:
        if f["type"] == "plane" and "z" in f and f.get("normal", [0, 0, 0])[2] > 0.99:
            planes_h[round(f["z"], 3)].append(f)
    L.append("### Upward-facing flat faces (floors / tops) by Z\n")
    L.append("| Z | faces | total area mm2 | XY extent of each face |\n|---|---|---|---|")
    for z in sorted(planes_h, reverse=True):
        fs = planes_h[z]
        ext = "; ".join(f"[{b[0]:g},{b[1]:g}]-[{b[3]:g},{b[4]:g}]" for b in (f["bbox"] for f in fs[:6]))
        L.append(f"| {z:g} | {len(fs)} | {sum(f['area'] for f in fs):.0f} | {ext}{' ...' if len(fs) > 6 else ''} |")
    down = [f for f in F if f["type"] == "plane" and f.get("normal", [0, 0, 0])[2] < -0.99 and f["bbox"][2] > 1e-3]
    if down:
        L.append("\n### Downward-facing flat faces above Z0 (overhangs: not machinable from +Z)\n")
        for f in down:
            L.append(f"- face {f['id']}: z {f['bbox'][2]:g}, extent [{f['bbox'][0]:g},{f['bbox'][1]:g}]-[{f['bbox'][3]:g},{f['bbox'][4]:g}]")
    cyl = [f for f in F if f["type"] == "cylinder"]
    vert = [f for f in cyl if abs(f["axis"][2]) > 0.999]
    if vert:
        L.append("\n### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)\n")
        L.append("| face | kind | centre XY | radius | Z range | angular extent |\n|---|---|---|---|---|---|")
        for f in sorted(vert, key=lambda f: (f["center"][0], f["center"][1], -f["bbox"][5])):
            b = f["bbox"]
            # rough extent: full circle if bbox spans 2r in both axes
            full = abs((b[3] - b[0]) - 2 * f["radius"]) < 0.02 and abs((b[4] - b[1]) - 2 * f["radius"]) < 0.02
            L.append(f"| {f['id']} | {'hole/concave' if f['concave'] else 'boss/convex'} | ({f['center'][0]:g}, {f['center'][1]:g}) | "
                     f"{f['radius']:g} | {b[2]:g}..{b[5]:g} | {'full/near-full' if full else 'partial arc (corner/slot end)'} |")
    other = [f for f in cyl if abs(f["axis"][2]) <= 0.999]
    if other:
        L.append("\n### Non-vertical cylindrical faces (round-overs, fillets, crowns)\n")
        for f in other:
            b = f["bbox"]
            L.append(f"- face {f['id']}: radius {f['radius']:g}, axis {f['axis']}, {'concave' if f['concave'] else 'convex'}, "
                     f"bbox [{', '.join(f'{v:g}' for v in b)}]")
    for typ, title in (("cone", "Conical faces (chamfers, countersinks, drafts)"), ("torus", "Toroidal faces (fillets, round-over corners)"),
                       ("sphere", "Spherical faces"), ("bspline", "Free-form (B-spline) faces"),
                       ("extrusion", "Extruded free-form walls (vertical, spline profile)"), ("revolution", "Surfaces of revolution"),
                       ("other", "Other faces")):
        fs = [f for f in F if f["type"] == typ]
        if not fs:
            continue
        L.append(f"\n### {title}\n")
        for f in fs[:40]:
            b = f["bbox"]
            extra = {k: f[k] for k in ("half_angle_deg", "minor_radius", "major_radius", "radius", "center") if k in f}
            L.append(f"- face {f['id']}: area {f['area']:.0f} mm2, bbox [{', '.join(f'{v:g}' for v in b)}] {extra if extra else ''}")
        if len(fs) > 40:
            L.append(f"- ... {len(fs) - 40} more")
    walls = [f for f in F if f["type"] == "plane" and abs(f.get("normal", [0, 0, 1])[2]) < 1e-3]
    if walls:
        L.append(f"\n### Vertical flat walls: {len(walls)} faces\n")
        for f in walls[:40]:
            b = f["bbox"]
            L.append(f"- face {f['id']}: normal ({f['normal'][0]:g}, {f['normal'][1]:g}), from ({b[0]:g},{b[1]:g}) to ({b[3]:g},{b[4]:g}), Z {b[2]:g}..{b[5]:g}")
    sloped = [f for f in F if f["type"] == "plane" and 1e-3 <= abs(f.get("normal", [0, 0, 1])[2]) <= 0.99]
    if sloped:
        L.append("\n### Inclined flat faces\n")
        for f in sloped:
            L.append(f"- face {f['id']}: normal {f['normal']}, bbox [{', '.join(f'{v:g}' for v in f['bbox'])}]")
    return "\n".join(L)


def write(part: Part, out_dir) -> Path:
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    shutil.copy(part.dir / "part.step", out / "part.step")
    # STL for the LLM's own geometry code
    import trimesh

    trimesh.Trimesh(part.V, part.F, process=False).export(out / "part.stl")
    g = part.grid
    np.save(out / "target_height.npy", part.Ht.astype(np.float32))
    (out / "target_height.json").write_text(json.dumps({**g, "note": "Ht[i, j] = highest target surface at x = x0 + (j + 0.5) res, "
                                                        "y = y0 + (i + 0.5) res; 0 where there is no part"}, indent=1))
    (out / "faces.json").write_text(json.dumps(part.faces, indent=1))
    zs = sorted({round(f["z"], 2) for f in part.faces if "z" in f})
    render.height_map_png(part.Ht, g, out / "target_top.png", f"{part.name}: target seen from above (height map)",
                          stock=part.stock, levels=[z + 0.01 for z in zs if z > 0][:12] or None)
    render.iso_png(part.V, part.F, out / "target_iso.png", f"{part.name}: isometric")
    s = part.stock
    cls = np.bincount(part.pclass, minlength=4)
    area = lambda c: part.parea[part.pclass == c].sum()
    bb = s.get("part_bbox") or np.r_[part.V.min(0), part.V.max(0)].round(3).tolist()
    md = f"""# Job brief: {part.name}

{s.get('description', '')}

- Material: **{s.get('material', 'AL6061-T6')}**. Tolerance: **+-{TOL} mm on every machinable surface**.
- Part bounding box: X [{bb[0]:g}, {bb[3]:g}], Y [{bb[1]:g}, {bb[4]:g}], Z [{bb[2]:g}, {bb[5]:g}] (mm).
- **Stock**: box X [{s['x'][0]:g}, {s['x'][1]:g}], Y [{s['y'][0]:g}, {s['y'][1]:g}], Z [{s['z'][0]:g}, {s['z'][1]:g}].
- **Setup**: single setup, tool along +Z. Work coordinates = model coordinates (G54). Z0 = bottom of the stock =
  bottom of the part, held on a vacuum fixture plate (no clamps on top or sides). You may cut through the stock and up
  to 0.5 mm into the sacrificial plate (Z >= -0.5). The part's bottom face is the datum face and is not machined.
- Everything outside the part must be removed (outer profile cut through to Z0). Thin skins or tabs are not needed.
- Surface not reachable from +Z (undercuts) and sharp internal corners smaller than the smallest tool are excluded
  from the score (undercut: {100 * area(2) / max(area(0) + area(2) + area(3), 1e-9):.1f}% of the non-datum surface,
  tool-limited: {100 * area(3) / max(area(0) + area(2) + area(3), 1e-9):.1f}%).

## Files in this folder
- `part.step` (B-rep), `part.stl` (mesh, mm), `faces.json` (B-rep face list), `target_height.npy` + `target_height.json`
  (height of the part's top surface seen from +Z on a {g['res']} mm grid), `target_top.png`, `target_iso.png`.
- You may read these with numpy / trimesh / cadquery in your own toolpath code.

## Machine and G-code dialect
{DIALECT}
## Checks applied by the simulator
{RULES}
## Tool library (the only tools available)
{library_table()}

Recommended spindle speed in aluminium: as high as the tool allows (max rpm column). Feed = chipload x flutes x rpm.
Conservative step-downs: roughing up to 1 x D (flat, with step-over <= 0.4 D) or 0.25 x D full slotting.

## Geometry digest (from the B-rep)
{faces_digest(part)}
"""
    (out / "brief.md").write_text(md)
    return out
