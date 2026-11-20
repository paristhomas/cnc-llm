# Job brief: gimbal_arm

Camera gimbal arm 120 long, tapering from 40 wide at the motor end to 24 wide at the clamp end (tangent R arcs). Motor end: D30 boss 20 tall with a spherical-cap (R40) top, D12 through bore with 1 mm chamfer. Arm web 6 thick with three triangular lightening pockets (R2 corners) 4 mm deep, perimeter rib 3 wide at full 10 mm height. Clamp end: 12 thick lug with a D8 through hole and a 1.5 wide clamp slit.

- Material: **AL6061-T6**. Tolerance: **+-0.1 mm on every machinable surface**.
- Part bounding box: X [-65, 56.977], Y [-20, 20], Z [-0, 19.385] (mm).
- **Stock**: box X [-68, 60], Y [-23, 23], Z [0, 21].
- **Setup**: single setup, tool along +Z. Work coordinates = model coordinates (G54). Z0 = bottom of the stock =
  bottom of the part, held on a vacuum fixture plate (no clamps on top or sides). You may cut through the stock and up
  to 0.5 mm into the sacrificial plate (Z >= -0.5). The part's bottom face is the datum face and is not machined.
- Everything outside the part must be removed (outer profile cut through to Z0). Thin skins or tabs are not needed.
- Surface not reachable from +Z (undercuts) and sharp internal corners smaller than the smallest tool are excluded
  from the score (undercut: 0.0% of the non-datum surface,
  tool-limited: 0.0%).

## Files in this folder
- `part.step` (B-rep), `part.stl` (mesh, mm), `faces.json` (B-rep face list), `target_height.npy` + `target_height.json`
  (height of the part's top surface seen from +Z on a 0.05 mm grid), `target_top.png`, `target_iso.png`.
- You may read these with numpy / trimesh / cadquery in your own toolpath code.

## Machine and G-code dialect
- Metric, absolute: start with `G21 G90 G17 G94`. Incremental (G91), inch (G20), cutter compensation (G41/G42),
  G28/G30/G53, work offsets other than G54, macros/variables/O-words and canned cycles other than G81/G82/G83 are
  rejected. Unknown words are errors, never ignored.
- Tool change: `M5` then `T<n> M6` then `G43 H<n>` (same n) before cutting. M6 retracts Z to the machine home Z150
  first (and stops the spindle if you forgot M5 - a warning).
- Accepted: `%` tape markers, `( ... )` and `;` comments, `N` numbers, `G54` alone on a line, full circles
  (G2/G3 with end point = start point and I/J), `G64 P..`, `G4 P<seconds>`.
- Spindle: `S<rpm> M3` before cutting (M4 is rejected), `M5` to stop. Feed `F` in mm/min (max 6000).
- Motion: G0 (rapid), G1, G2/G3 in the XY plane with I/J (incremental centre) or R, helical Z allowed.
  Drilling: `G81/G82/G83 X Y Z R [Q] [P] F` with G98/G99, cancel with G80.
- End with `M5` and `M30`.
- Machine starts at X0 Y0 Z150. Travel X[-300,300] Y[-200,200] Z[-5,200].

## Tool model used by the simulator
Each tool is a solid of revolution along +Z: the cutting profile (flat / ball / bull nose / cone) up to the flute
length, then the shank (same diameter as the cutter) up to the stick-out, then a holder cylinder of the holder diameter
from the stick-out upwards. Material touched above the flute length is a shank error, material inside the holder
cylinder a holder collision. All endmills (T1-T8) are centre-cutting; the chamfer mill T9 is not (cone with a 0.2 mm
flat tip: radius at height h above the tip = 0.1 + h for its 45 deg flank); the drill T10 has a 118 deg point.

## Checks applied by the simulator
- **Crashes are errors**: a rapid (G0) that touches material, cutting with the spindle stopped, material contact
  above a tool's flute length (shank rubbing), the tool holder touching material (depth beyond stick-out), cutting
  more than 0.5 mm below Z0 (into the fixture plate).
- **Cutting data in aluminium are checked**: feed per tooth must stay below 2.5x the library chip load; cut
  cross-section (removed area per mm of travel) must stay below 0.75 x D^2; plunging with a non-centre-cutting tool is
  an error; deep plunges should be ramped or helical. Drill T10 must not side-mill.
- The program must be something a machinist would run: sensible step-downs and step-overs, clearance moves above the
  stock before rapids, roughing before finishing.

## Tool library (the only tools available)
| T | Tool | Kind | D (mm) | Flutes | Flute len | Stick-out | Holder D | Chipload (mm/t) | Max rpm | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | flat | 10 | 3 | 25 | 40 | 32 | 0.06 | 18000 |  |
| T2 | 6 mm 3-flute flat endmill | flat | 6 | 3 | 18 | 30 | 32 | 0.04 | 24000 |  |
| T3 | 3 mm 2-flute flat endmill | flat | 3 | 2 | 10 | 22 | 32 | 0.02 | 24000 |  |
| T4 | 1.5 mm 2-flute flat endmill | flat | 1.5 | 2 | 5 | 14 | 20 | 0.01 | 24000 |  |
| T5 | 8 mm bull-nose endmill r1 | bull | 8 | 3 | 20 | 35 | 32 | 0.05 | 24000 | corner r1.0 |
| T6 | 6 mm ball endmill | ball | 6 | 2 | 14 | 32 | 32 | 0.03 | 24000 |  |
| T7 | 3 mm ball endmill | ball | 3 | 2 | 8 | 22 | 32 | 0.02 | 24000 |  |
| T8 | 1 mm ball endmill | ball | 1 | 2 | 3 | 12 | 20 | 0.008 | 24000 |  |
| T9 | 6 mm 90deg chamfer mill | cone | 6 | 2 | 3 | 25 | 32 | 0.02 | 24000 | cuts 45deg chamfers; tip flat 0.2 mm |
| T10 | 5 mm drill 118deg | cone | 5 | 2 | 30 | 40 | 32 | 0.06 | 8000 | drilling only (vertical moves / G81 / G83); no side milling |

Recommended spindle speed in aluminium: as high as the tool allows (max rpm column). Feed = chipload x flutes x rpm.
Conservative step-downs: roughing up to 1 x D (flat, with step-over <= 0.4 D) or 0.25 x D full slotting.

## Geometry digest (from the B-rep)
### Upward-facing flat faces (floors / tops) by Z

| Z | faces | total area mm2 | XY extent of each face |
|---|---|---|---|
| 12 | 1 | 244 | [40,-11]-[54,11] |
| 10 | 3 | 2407 | [-65,-20]-[49.796,20]; [54,0.75]-[56.977,7.937]; [54,-7.937]-[56.977,-0.75] |
| 6 | 3 | 319 | [-22.848,-8.5]-[-9.152,5.803]; [17.737,-6]-[30.263,4.394]; [-2.554,-4.969]-[10.554,7] |

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 0 | hole/concave | (-45, 0) | 6 | -0..18.548 | full/near-full |
| 21 | boss/convex | (-45, 0) | 15 | 9.999..16.082 | full/near-full |
| 11 | boss/convex | (-45, -0) | 20 | -0.002..10.002 | partial arc (corner/slot end) |
| 26 | hole/concave | (-20.8484, -6.5) | 2 | 6..10 | partial arc (corner/slot end) |
| 27 | hole/concave | (-16, 3.8029) | 2 | 6..10 | partial arc (corner/slot end) |
| 23 | hole/concave | (-11.1516, -6.5) | 2 | 6..10 | partial arc (corner/slot end) |
| 37 | hole/concave | (-0.5536, 5) | 2 | 6..10 | partial arc (corner/slot end) |
| 40 | hole/concave | (4, -2.9689) | 2 | 6..10 | partial arc (corner/slot end) |
| 36 | hole/concave | (8.5536, 5) | 2 | 6..10 | partial arc (corner/slot end) |
| 32 | hole/concave | (19.737, -4) | 2 | 6..10 | partial arc (corner/slot end) |
| 33 | hole/concave | (24, 2.3944) | 2 | 6..10 | partial arc (corner/slot end) |
| 29 | hole/concave | (28.263, -4) | 2 | 6..10 | partial arc (corner/slot end) |
| 5 | boss/convex | (45, 0) | 12 | -0.001..12.001 | partial arc (corner/slot end) |
| 9 | boss/convex | (45, 0) | 12 | -0.001..12.001 | partial arc (corner/slot end) |
| 7 | hole/concave | (48, 0) | 4 | -0..12 | partial arc (corner/slot end) |

### Spherical faces

- face 3: area 488 mm2, bbox [-59.072, -14.072, 17.44, -30.927, 14.073, 19.389] {'radius': 40.0}

### Free-form (B-spline) faces

- face 1: area 53 mm2, bbox [-51.99, -6.991, 18.543, -38.009, 6.991, 19.389] 
- face 12: area 151 mm2, bbox [-60.004, -15.004, 16.077, -29.996, 15.004, 17.448] 

### Vertical flat walls: 18 faces

- face 4: normal (0.0885, 0.9961), from (-45,12) to (45,20), Z -0..10
- face 6: normal (-0, -1), from (51.929,0.75) to (56.977,0.75), Z -0..12
- face 8: normal (0, 1), from (51.929,-0.75) to (56.977,-0.75), Z -0..12
- face 10: normal (0.0885, -0.9961), from (-45,-20) to (45,-12), Z -0..10
- face 14: normal (0, 1), from (40,11) to (49.796,11), Z 10..12
- face 16: normal (1, 0), from (54,0.75) to (54,7.937), Z 10..12
- face 19: normal (1, 0), from (54,-7.937) to (54,-0.75), Z 10..12
- face 20: normal (-0, -1), from (40,-11) to (49.796,-11), Z 10..12
- face 22: normal (-1, -0), from (40,-11) to (40,11), Z 10..12
- face 24: normal (0, 1), from (-20.848,-8.5) to (-11.152,-8.5), Z 6..10
- face 25: normal (-0.9048, -0.4258), from (-14.19,-5.648) to (-9.342,4.655), Z 6..10
- face 28: normal (0.9048, -0.4258), from (-22.658,-5.648) to (-17.81,4.655), Z 6..10
- face 30: normal (0, 1), from (19.737,-6) to (28.263,-6), Z 6..10
- face 31: normal (-0.8321, -0.5547), from (25.664,-2.891) to (29.927,3.504), Z 6..10
- face 34: normal (0.8321, -0.5547), from (18.073,-2.891) to (22.336,3.504), Z 6..10
- face 35: normal (-0, -1), from (-0.554,7) to (8.554,7), Z 6..10
- face 38: normal (-0.8682, 0.4961), from (5.736,-3.961) to (10.29,4.008), Z 6..10
- face 39: normal (0.8682, 0.4961), from (-2.29,-3.961) to (2.264,4.008), Z 6..10
