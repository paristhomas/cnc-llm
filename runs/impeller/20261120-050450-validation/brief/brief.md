# Job brief: impeller

Open impeller disc D80. Hub D20 (rising to Z22) with a D8 bore. The disc surface between hub and rim is a concave conical dish falling from Z12 at the hub to Z6 at R36, then flat to the rim. Six backward-curved blades 2.5 mm thick (circular-arc camber) stand on the dish with tops at Z18, R0.8 not required (sharp). Rim edge chamfer 1 mm.

- Material: **AL6061-T6**. Tolerance: **+-0.1 mm on every machinable surface**.
- Part bounding box: X [-40, 40], Y [-40, 40], Z [0, 22] (mm).
- **Stock**: box X [-42, 42], Y [-42, 42], Z [0, 23].
- **Setup**: single setup, tool along +Z. Work coordinates = model coordinates (G54). Z0 = bottom of the stock =
  bottom of the part, held on a vacuum fixture plate (no clamps on top or sides). You may cut through the stock and up
  to 0.5 mm into the sacrificial plate (Z >= -0.5). The part's bottom face is the datum face and is not machined.
- Everything outside the part must be removed (outer profile cut through to Z0). Thin skins or tabs are not needed.
- Surface not reachable from +Z (undercuts) and sharp internal corners smaller than the smallest tool are excluded
  from the score (undercut: 0.0% of the non-datum surface,
  tool-limited: 0.7%).

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
| 22 | 1 | 264 | [-10,-10]-[10,10] |
| 18 | 6 | 524 | [9.89,-28.606]-[27.035,1.078]; [-13.041,-35.79]-[6.875,-8.071]; [-36.507,-16.172]-[-4.038,-5.999]; [-27.035,-1.078]-[-9.89,28.606]; [-6.875,8.071]-[13.041,35.79]; [4.038,5.999]-[36.507,16.172] |
| 6 | 1 | 928 | [-39.998,-40]-[40,40] |

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 16 | boss/convex | (-36.2829, -7.2491) | 1.25 | 6..18 | partial arc (corner/slot end) |
| 20 | boss/convex | (-24.4194, 27.7974) | 1.25 | 6..18 | partial arc (corner/slot end) |
| 14 | boss/convex | (-20.1621, 5.8488) | 22.021 | 5.998..18.002 | partial arc (corner/slot end) |
| 36 | hole/concave | (-20.1621, 5.8488) | 19.521 | 6.022..18.002 | partial arc (corner/slot end) |
| 10 | boss/convex | (-15.1462, -14.5365) | 22.021 | 5.998..18.002 | partial arc (corner/slot end) |
| 34 | hole/concave | (-15.1462, -14.5365) | 19.521 | 6.022..18.002 | partial arc (corner/slot end) |
| 12 | boss/convex | (-11.8635, -35.0465) | 1.25 | 6..18 | partial arc (corner/slot end) |
| 18 | boss/convex | (-5.0159, 20.3853) | 22.021 | 5.998..18.002 | partial arc (corner/slot end) |
| 38 | hole/concave | (-5.0159, 20.3853) | 19.521 | 6.022..18.002 | partial arc (corner/slot end) |
| 29 | boss/convex | (0, 0) | 10 | 11.999..22.001 | full/near-full |
| 2 | hole/concave | (0, 0) | 4 | -0..22 | full/near-full |
| 7 | boss/convex | (0, 0) | 37 | 5.998..18.002 | partial arc (corner/slot end) |
| 11 | boss/convex | (0, 0) | 37 | 5.998..18.002 | partial arc (corner/slot end) |
| 15 | boss/convex | (0, 0) | 37 | 5.998..18.002 | partial arc (corner/slot end) |
| 19 | boss/convex | (0, 0) | 37 | 5.998..18.002 | partial arc (corner/slot end) |
| 23 | boss/convex | (0, 0) | 37 | 5.998..18.002 | partial arc (corner/slot end) |
| 27 | boss/convex | (0, 0) | 37 | 5.998..18.002 | partial arc (corner/slot end) |
| 1 | boss/convex | (0, 0) | 40 | -0.002..6.002 | full/near-full |
| 6 | boss/convex | (5.0159, -20.3853) | 22.021 | 5.998..18.002 | partial arc (corner/slot end) |
| 32 | hole/concave | (5.0159, -20.3853) | 19.521 | 6.022..18.002 | partial arc (corner/slot end) |
| 24 | boss/convex | (11.8635, 35.0465) | 1.25 | 6..18 | partial arc (corner/slot end) |
| 22 | boss/convex | (15.1462, 14.5365) | 22.021 | 5.998..18.002 | partial arc (corner/slot end) |
| 40 | hole/concave | (15.1462, 14.5365) | 19.521 | 6.022..18.002 | partial arc (corner/slot end) |
| 26 | boss/convex | (20.1621, -5.8488) | 22.021 | 5.998..18.002 | partial arc (corner/slot end) |
| 30 | hole/concave | (20.1621, -5.8488) | 19.521 | 6.022..18.002 | partial arc (corner/slot end) |
| 8 | boss/convex | (24.4194, -27.7974) | 1.25 | 6..18 | partial arc (corner/slot end) |
| 28 | boss/convex | (36.2829, 7.2491) | 1.25 | 6..18 | partial arc (corner/slot end) |

### Conical faces (chamfers, countersinks, drafts)

- face 5: area 558 mm2, bbox [6.194, -24.165, 5.965, 36.033, 13.707, 12.035] {'half_angle_deg': 77.005, 'center': [0.0, 0.0]}
- face 9: area 558 mm2, bbox [-7.574, -36.035, 5.965, 24.572, -1.447, 12.035] {'half_angle_deg': 77.005, 'center': [0.0, 0.0]}
- face 13: area 558 mm2, bbox [-34.29, -33.89, 5.965, 4.409, -9.114, 12.035] {'half_angle_deg': 77.005, 'center': [0.0, 0.0]}
- face 17: area 558 mm2, bbox [-36.033, -13.707, 5.965, -6.194, 24.165, 12.035] {'half_angle_deg': 77.005, 'center': [0.0, 0.0]}
- face 21: area 558 mm2, bbox [-24.572, 1.447, 5.965, 7.574, 36.035, 12.035] {'half_angle_deg': 77.005, 'center': [0.0, 0.0]}
- face 25: area 558 mm2, bbox [-4.409, 9.114, 5.965, 34.29, 33.89, 12.035] {'half_angle_deg': 77.005, 'center': [0.0, 0.0]}
