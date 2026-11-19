# Job brief: heatsink

Heat sink 80 x 60. 6 mm base, seven 2.5 mm thick fins 6.5 mm apart rising to a crowned (R60 cylindrical) top that peaks at Z22 in the middle of the part, R3 fillets at the fin roots, two end mounting lugs with D5.5 holes.

- Material: **AL6061-T6**. Tolerance: **+-0.1 mm on every machinable surface**.
- Part bounding box: X [-40, 40], Y [-30, 30], Z [0, 22] (mm).
- **Stock**: box X [-42, 42], Y [-32, 32], Z [0, 24].
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
| 6 | 1 | 2134 | [-40,-30]-[40,30] |

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 5 | hole/concave | (-34, 0) | 2.75 | -0..6 | full/near-full |
| 34 | hole/concave | (34, 0) | 2.75 | -0..6 | full/near-full |

### Non-vertical cylindrical faces (round-overs, fillets, crowns)

- face 6: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [-25.75, -22, 6, -22.75, 22, 9]
- face 8: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [-31.25, -22, 6, -28.25, 22, 9]
- face 11: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [-16.75, -22, 6, -13.75, 22, 9]
- face 12: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [-22.25, -22, 6, -19.25, 22, 9]
- face 15: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [-7.75, -22, 6, -4.75, 22, 9]
- face 16: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [-13.25, -22, 6, -10.25, 22, 9]
- face 19: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [1.25, -22, 6, 4.25, 22, 9]
- face 20: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [-4.25, -22, 6, -1.25, 22, 9]
- face 23: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [10.25, -22, 6, 13.25, 22, 9]
- face 24: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [4.75, -22, 6, 7.75, 22, 9]
- face 27: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [19.25, -22, 6, 22.25, 22, 9]
- face 28: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [13.75, -22, 6, 16.75, 22, 9]
- face 30: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [28.25, -22, 6, 31.25, 22, 9]
- face 32: radius 3, axis [0.0, 1.0, 0.0], concave, bbox [22.75, -22, 6, 25.75, 22, 9]
- face 38: radius 60, axis [-0.0, 1.0, -0.0], convex, bbox [-28.252, -22.002, 14.932, -25.748, 22.002, 16.195]
- face 41: radius 60, axis [-0.0, 1.0, -0.0], convex, bbox [-19.252, -22.002, 18.827, -16.748, 22.002, 19.616]
- face 44: radius 60, axis [-0.0, 1.0, -0.0], convex, bbox [-10.251, -22.001, 21.117, -7.749, 22.001, 21.499]
- face 47: radius 60, axis [-0.0, 1.0, -0.0], convex, bbox [-1.251, -22.001, 21.986, 1.251, 22.001, 22]
- face 50: radius 60, axis [-0.0, 1.0, -0.0], convex, bbox [7.749, -22.001, 21.117, 10.251, 22.001, 21.499]
- face 53: radius 60, axis [-0.0, 1.0, -0.0], convex, bbox [16.748, -22.002, 18.827, 19.252, 22.002, 19.616]
- face 56: radius 60, axis [-0.0, 1.0, -0.0], convex, bbox [25.748, -22.002, 14.932, 28.252, 22.002, 16.195]

### Vertical flat walls: 32 faces

- face 1: normal (-1, -0), from (-40,-30) to (-40,30), Z -0..6
- face 2: normal (0, 1), from (-40,30) to (40,30), Z -0..6
- face 3: normal (-0, -1), from (-40,-30) to (40,-30), Z -0..6
- face 4: normal (1, 0), from (40,-30) to (40,30), Z -0..6
- face 7: normal (0, 1), from (-31.25,22) to (-22.75,22), Z 6..16.194
- face 9: normal (-0, -1), from (-31.25,-22) to (-22.75,-22), Z 6..16.194
- face 10: normal (-0, -1), from (-22.25,-22) to (-13.75,-22), Z 6..19.615
- face 13: normal (0, 1), from (-22.25,22) to (-13.75,22), Z 6..19.615
- face 14: normal (-0, -1), from (-13.25,-22) to (-4.75,-22), Z 6..21.497
- face 17: normal (0, 1), from (-13.25,22) to (-4.75,22), Z 6..21.497
- face 18: normal (-0, -1), from (-4.25,-22) to (4.25,-22), Z 6..21.999
- face 21: normal (0, 1), from (-4.25,22) to (4.25,22), Z 6..21.999
- face 22: normal (-0, -1), from (4.75,-22) to (13.25,-22), Z 6..21.497
- face 25: normal (0, 1), from (4.75,22) to (13.25,22), Z 6..21.497
- face 26: normal (-0, -1), from (13.75,-22) to (22.25,-22), Z 6..19.615
- face 29: normal (0, 1), from (13.75,22) to (22.25,22), Z 6..19.615
- face 31: normal (0, 1), from (22.75,22) to (31.25,22), Z 6..16.194
- face 33: normal (-0, -1), from (22.75,-22) to (31.25,-22), Z 6..16.194
- face 36: normal (1, 0), from (-25.75,-22) to (-25.75,22), Z 9..16.194
- face 37: normal (-1, -0), from (-28.25,-22) to (-28.25,22), Z 9..14.933
- face 39: normal (1, 0), from (-16.75,-22) to (-16.75,22), Z 9..19.615
- face 40: normal (-1, -0), from (-19.25,-22) to (-19.25,22), Z 9..18.828
- face 42: normal (1, 0), from (-7.75,-22) to (-7.75,22), Z 9..21.497
- face 43: normal (-1, -0), from (-10.25,-22) to (-10.25,22), Z 9..21.118
- face 45: normal (1, 0), from (1.25,-22) to (1.25,22), Z 9..21.987
- face 46: normal (-1, -0), from (-1.25,-22) to (-1.25,22), Z 9..21.987
- face 48: normal (1, 0), from (10.25,-22) to (10.25,22), Z 9..21.118
- face 49: normal (-1, -0), from (7.75,-22) to (7.75,22), Z 9..21.497
- face 51: normal (1, 0), from (19.25,-22) to (19.25,22), Z 9..18.828
- face 52: normal (-1, -0), from (16.75,-22) to (16.75,22), Z 9..19.615
- face 54: normal (1, 0), from (28.25,-22) to (28.25,22), Z 9..14.933
- face 55: normal (-1, -0), from (25.75,-22) to (25.75,22), Z 9..16.194
