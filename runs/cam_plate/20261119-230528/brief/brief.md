# Job brief: cam_plate

Cam plate, 12 mm thick, outer profile a smooth closed spline cam lobe (no tangent breaks) with a D24 bore and a 6 wide keyway to R16.5, a hexagonal recess (30 mm across flats, 5 deep, R2 corners) around the bore, three kidney-shaped through windows (R1.9 corners), and a 1 mm x 45deg chamfer on the bore edge at the hex recess floor.

- Material: **AL6061-T6**. Tolerance: **+-0.1 mm on every machinable surface**.
- Part bounding box: X [-33, 43.966], Y [-27.037, 28.85], Z [-0, 12] (mm).
- **Stock**: box X [-37, 48], Y [-31, 33], Z [0, 13].
- **Setup**: single setup, tool along +Z. Work coordinates = model coordinates (G54). Z0 = bottom of the stock =
  bottom of the part, held on a vacuum fixture plate (no clamps on top or sides). You may cut through the stock and up
  to 0.5 mm into the sacrificial plate (Z >= -0.5). The part's bottom face is the datum face and is not machined.
- Everything outside the part must be removed (outer profile cut through to Z0). Thin skins or tabs are not needed.
- Surface not reachable from +Z (undercuts) and sharp internal corners smaller than the smallest tool are excluded
  from the score (undercut: 0.0% of the non-datum surface,
  tool-limited: 0.1%).

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
| 12 | 1 | 2333 | [-32.999,-27.036]-[43.966,28.85] |
| 7 | 1 | 235 | [-17.011,-15]-[17.011,15] |

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 14 | hole/concave | (-22.6119, -4.7237) | 1.9 | -0..12 | partial arc (corner/slot end) |
| 17 | hole/concave | (-20.4204, -4.4515) | 1.9 | -0..12 | partial arc (corner/slot end) |
| 10 | hole/concave | (-15.3968, -17.2206) | 1.9 | -0..12 | partial arc (corner/slot end) |
| 41 | hole/concave | (-15.0111, -0) | 2 | 7..12 | partial arc (corner/slot end) |
| 13 | hole/concave | (-14.0653, -15.4589) | 1.9 | -0..12 | partial arc (corner/slot end) |
| 45 | hole/concave | (-7.5056, -13) | 2 | 7..12 | partial arc (corner/slot end) |
| 37 | hole/concave | (-7.5056, 13) | 2 | 7..12 | partial arc (corner/slot end) |
| 26 | hole/concave | (-7.2151, 21.9443) | 1.9 | -0..12 | partial arc (corner/slot end) |
| 29 | hole/concave | (-6.3551, 19.9104) | 1.9 | -0..12 | partial arc (corner/slot end) |
| 12 | hole/concave | (0, 0) | 25 | -0.002..12.002 | partial arc (corner/slot end) |
| 25 | hole/concave | (0, 0) | 25 | -0.002..12.002 | partial arc (corner/slot end) |
| 28 | hole/concave | (0, 0) | 25 | -0.002..12.002 | partial arc (corner/slot end) |
| 15 | boss/convex | (0, 0) | 19 | -0.001..12.001 | partial arc (corner/slot end) |
| 21 | boss/convex | (0, 0) | 19 | -0.001..12.001 | partial arc (corner/slot end) |
| 31 | boss/convex | (0, 0) | 19 | -0.001..12.001 | partial arc (corner/slot end) |
| 1 | hole/concave | (0, 0) | 12 | -0.001..6.001 | partial arc (corner/slot end) |
| 33 | hole/concave | (6.3551, 19.9104) | 1.9 | -0..12 | partial arc (corner/slot end) |
| 30 | hole/concave | (7.2151, 21.9443) | 1.9 | -0..12 | partial arc (corner/slot end) |
| 42 | hole/concave | (7.5056, -13) | 2 | 7..12 | partial arc (corner/slot end) |
| 34 | hole/concave | (7.5056, 13) | 2 | 7..12 | partial arc (corner/slot end) |
| 22 | hole/concave | (14.0653, -15.4589) | 1.9 | -0..12 | partial arc (corner/slot end) |
| 38 | hole/concave | (15.0111, 0) | 2 | 7..12 | partial arc (corner/slot end) |
| 24 | hole/concave | (15.3968, -17.2206) | 1.9 | -0..12 | partial arc (corner/slot end) |
| 20 | hole/concave | (20.4204, -4.4515) | 1.9 | -0..12 | partial arc (corner/slot end) |
| 18 | hole/concave | (22.6119, -4.7237) | 1.9 | -0..12 | partial arc (corner/slot end) |

### Conical faces (chamfers, countersinks, drafts)

- face 2: area 103 mm2, bbox [-13.005, -13.005, 5.994, 13.005, 12.655, 7.006] {'half_angle_deg': 45.0, 'center': [0.0, 0.0]}

### Extruded free-form walls (vertical, spline profile)

- face 9: area 2546 mm2, bbox [-33.004, -27.04, -0.004, 43.97, 28.854, 12.004] 

### Vertical flat walls: 16 faces

- face 0: normal (-1, -0), from (3,11.619) to (3,16.5), Z -0..12
- face 5: normal (-0, -1), from (-3,16.5) to (3,16.5), Z -0..12
- face 6: normal (-0, -1), from (3,15) to (7.506,15), Z 7..12
- face 8: normal (1, 0), from (-3,11.619) to (-3,16.5), Z -0..12
- face 11: normal (-0.7978, 0.603), from (-13.881,-18.366) to (-12.55,-16.604), Z -0..12
- face 16: normal (0.1233, -0.9924), from (-22.846,-2.838) to (-20.655,-2.566), Z -0..12
- face 19: normal (-0.1233, -0.9924), from (20.655,-2.838) to (22.846,-2.566), Z -0..12
- face 23: normal (0.7978, 0.603), from (12.55,-18.366) to (13.881,-16.604), Z -0..12
- face 27: normal (0.9211, 0.3894), from (-8.965,19.17) to (-8.105,21.204), Z -0..12
- face 32: normal (-0.9211, 0.3894), from (8.105,19.17) to (8.965,21.204), Z -0..12
- face 35: normal (-0, -1), from (-7.506,15) to (-3,15), Z 7..12
- face 36: normal (-0.866, -0.5), from (9.238,1) to (16.743,14), Z 7..12
- face 39: normal (0.866, -0.5), from (-16.743,1) to (-9.238,14), Z 7..12
- face 40: normal (-0.866, 0.5), from (9.238,-14) to (16.743,-1), Z 7..12
- face 43: normal (0.866, 0.5), from (-16.743,-14) to (-9.238,-1), Z 7..12
- face 44: normal (0, 1), from (-7.506,-15) to (7.506,-15), Z 7..12
