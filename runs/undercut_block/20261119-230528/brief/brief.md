# Job brief: undercut_block

Guide block 80 x 50 x 30 with R3 rounded top edges all round, a T-slot along X (12 wide neck, 20 wide x 6 high head, undercut: not machinable in this setup), a dovetail-free 16 wide x 8 deep slot along Y, 4 countersunk M6 holes (90deg countersink D12), and a 5deg-drafted rectangular pocket 24 x 14 x 10 deep.

- Material: **AL6061-T6**. Tolerance: **+-0.1 mm on every machinable surface**.
- Part bounding box: X [-40, 40], Y [-25, 25], Z [0, 30] (mm).
- **Stock**: box X [-42, 42], Y [-27, 27], Z [0, 32].
- **Setup**: single setup, tool along +Z. Work coordinates = model coordinates (G54). Z0 = bottom of the stock =
  bottom of the part, held on a vacuum fixture plate (no clamps on top or sides). You may cut through the stock and up
  to 0.5 mm into the sacrificial plate (Z >= -0.5). The part's bottom face is the datum face and is not machined.
- Everything outside the part must be removed (outer profile cut through to Z0). Thin skins or tabs are not needed.
- Surface not reachable from +Z (undercuts) and sharp internal corners smaller than the smallest tool are excluded
  from the score (undercut: 19.6% of the non-datum surface,
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
| 30 | 4 | 1447 | [-37,-22]-[-36,-6]; [-20,-22]-[37,-6]; [-37,6]-[-36,22]; [-20,6]-[37,22] |
| 22 | 2 | 608 | [-36,-25]-[-20,-6]; [-36,6]-[-20,25] |
| 21.01 | 2 | 691 | [-40,-6]-[10.787,6]; [33.213,-6]-[40,6] |
| 15 | 1 | 1600 | [-40,-10]-[40,10] |

### Downward-facing flat faces above Z0 (overhangs: not machinable from +Z)

- face 11: z 21, extent [-40,-10]-[40,10]

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 22 | hole/concave | (8, -18) | 3.2 | -0..27.2 | full/near-full |
| 24 | hole/concave | (8, 18) | 3.2 | -0..27.2 | full/near-full |
| 23 | hole/concave | (34, -18) | 3.2 | -0..27.2 | full/near-full |
| 25 | hole/concave | (34, 18) | 3.2 | -0..27.2 | full/near-full |

### Non-vertical cylindrical faces (round-overs, fillets, crowns)

- face 1: radius 3, axis [0.0, 1.0, 0.0], convex, bbox [-40, -25, 27, -37, -6, 30]
- face 8: radius 3, axis [0.0, 1.0, 0.0], convex, bbox [-40, 6, 27, -37, 25, 30]
- face 14: radius 3, axis [1.0, 0.0, 0.0], convex, bbox [-40, -25, 27, -36, -22, 30]
- face 15: radius 3, axis [1.0, 0.0, 0.0], convex, bbox [-20, -25, 27, 40, -22, 30]
- face 26: radius 3, axis [1.0, 0.0, 0.0], convex, bbox [-20, 22, 27, 40, 25, 30]
- face 30: radius 3, axis [1.0, 0.0, 0.0], convex, bbox [-40, 22, 27, -36, 25, 30]
- face 36: radius 3, axis [0.0, 1.0, 0.0], convex, bbox [37, -25, 27, 40, -6, 30]
- face 42: radius 3, axis [0.0, 1.0, 0.0], convex, bbox [37, 6, 27, 40, 25, 30]

### Conical faces (chamfers, countersinks, drafts)

- face 37: area 103 mm2, bbox [27.995, -23.567, 27.195, 39.126, -11.995, 30.005] {'half_angle_deg': 45.0, 'center': [34.0, -18.0]}
- face 38: area 111 mm2, bbox [1.995, -23.567, 27.195, 14.005, -11.995, 30.005] {'half_angle_deg': 45.0, 'center': [8.0, -18.0]}
- face 43: area 111 mm2, bbox [1.995, 11.995, 27.195, 14.005, 23.567, 30.005] {'half_angle_deg': 45.0, 'center': [8.0, 18.0]}
- face 44: area 103 mm2, bbox [27.995, 11.995, 27.195, 39.127, 23.567, 30.005] {'half_angle_deg': 45.0, 'center': [34.0, 18.0]}

### Free-form (B-spline) faces

- face 21: area 11 mm2, bbox [9.997, -7.003, 20.996, 10.791, 7.003, 30.004] 
- face 33: area 11 mm2, bbox [33.209, -7.003, 20.996, 34.003, 7.003, 30.004] 
- face 34: area 210 mm2, bbox [9.97, 6.182, 20.969, 34.03, 7.03, 30.031] 
- face 35: area 210 mm2, bbox [9.97, -7.03, 20.969, 34.03, -6.182, 30.031] 

### Vertical flat walls: 14 faces

- face 0: normal (-1, -0), from (-40,-25) to (-40,25), Z -0..27
- face 2: normal (-0, -1), from (-40,-25) to (40,-25), Z -0..27
- face 3: normal (0, 1), from (-40,-6) to (10.787,-6), Z 21.01..30
- face 6: normal (0, 1), from (-40,25) to (40,25), Z -0..27
- face 7: normal (-0, -1), from (-40,6) to (10.787,6), Z 21.01..30
- face 10: normal (-0, -1), from (-40,10) to (40,10), Z 15..21
- face 12: normal (0, 1), from (-40,-10) to (40,-10), Z 15..21
- face 16: normal (-1, -0), from (-20,-25) to (-20,-6), Z 22..30
- face 18: normal (1, 0), from (-36,-25) to (-36,-6), Z 22..30
- face 19: normal (1, 0), from (40,-25) to (40,25), Z -0..27
- face 27: normal (-1, -0), from (-20,6) to (-20,25), Z 22..30
- face 29: normal (1, 0), from (-36,6) to (-36,25), Z 22..30
- face 39: normal (0, 1), from (33.213,-6) to (40,-6), Z 21.01..30
- face 41: normal (-0, -1), from (33.213,6) to (40,6), Z 21.01..30
