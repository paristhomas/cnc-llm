# Job brief: motor_mount

Motor mount plate 100 x 70 x 16. Outer profile with R8 corners and a 1 mm x 45deg chamfer on the top outer edge. Central counterbore pocket D40 x 6 deep with a D22 through bore. Four D6.6 through holes with D11 x 6.5 deep counterbores. Rectangular pocket 30 x 20 x 8 deep (corner R3) with a D10 island standing 5 mm high. One through slot 8 wide x 25 long (obround).

- Material: **AL6061-T6**. Tolerance: **+-0.1 mm on every machinable surface**.
- Part bounding box: X [-50, 50], Y [-35, 35], Z [0, 16] (mm).
- **Stock**: box X [-52, 52], Y [-37, 37], Z [0, 18].
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
- Tool change: `T<n> M6` then `G43 H<n>` (same n) before cutting. M6 retracts Z to the machine home Z150 first.
- Spindle: `S<rpm> M3` before cutting (M4 is rejected), `M5` to stop. Feed `F` in mm/min (max 6000).
- Motion: G0 (rapid), G1, G2/G3 in the XY plane with I/J (incremental centre) or R, helical Z allowed.
  Drilling: `G81/G82/G83 X Y Z R [Q] [P] F` with G98/G99, cancel with G80.
- End with `M5` and `M30`.
- Machine starts at X0 Y0 Z150. Travel X[-300,300] Y[-200,200] Z[-5,200].

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
| 16 | 1 | 4207 | [-49,-34]-[49,34] |
| 13 | 1 | 79 | [25,-17]-[35,-7] |
| 10 | 1 | 877 | [-35,-20]-[5,20] |
| 9.5 | 4 | 243 | [-43.5,-30.5]-[-32.5,-19.5]; [2.5,-30.5]-[13.5,-19.5]; [-43.5,19.5]-[-32.5,30.5]; [2.5,19.5]-[13.5,30.5] |
| 8 | 1 | 514 | [15,-22]-[45,-2] |

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 1 | boss/convex | (-42, -27) | 8 | -0.001..15.001 | partial arc (corner/slot end) |
| 4 | boss/convex | (-42, 27) | 8 | -0.001..15.001 | partial arc (corner/slot end) |
| 27 | hole/concave | (-38, -25) | 5.5 | 9.5..16 | full/near-full |
| 13 | hole/concave | (-38, -25) | 3.3 | -0..9.5 | full/near-full |
| 38 | hole/concave | (-38, 25) | 5.5 | 9.5..16 | full/near-full |
| 16 | hole/concave | (-38, 25) | 3.3 | -0..9.5 | full/near-full |
| 37 | hole/concave | (-15, 0) | 20 | 9.998..16.002 | full/near-full |
| 15 | hole/concave | (-15, 0) | 11 | -0.001..10.001 | full/near-full |
| 28 | hole/concave | (8, -25) | 5.5 | 9.5..16 | full/near-full |
| 14 | hole/concave | (8, -25) | 3.3 | -0..9.5 | full/near-full |
| 39 | hole/concave | (8, 25) | 5.5 | 9.5..16 | full/near-full |
| 17 | hole/concave | (8, 25) | 3.3 | -0..9.5 | full/near-full |
| 29 | hole/concave | (18, -19) | 3 | 8..16 | partial arc (corner/slot end) |
| 32 | hole/concave | (18, -5) | 3 | 8..16 | partial arc (corner/slot end) |
| 19 | hole/concave | (21.5, 16) | 4 | -0..16 | partial arc (corner/slot end) |
| 46 | boss/convex | (30, -12) | 5 | 8..13 | full/near-full |
| 21 | hole/concave | (38.5, 16) | 4 | -0..16 | partial arc (corner/slot end) |
| 10 | boss/convex | (42, -27) | 8 | -0.001..15.001 | partial arc (corner/slot end) |
| 33 | hole/concave | (42, -19) | 3 | 8..16 | partial arc (corner/slot end) |
| 36 | hole/concave | (42, -5) | 3 | 8..16 | partial arc (corner/slot end) |
| 11 | boss/convex | (42, 27) | 8 | -0.001..15.001 | partial arc (corner/slot end) |

### Conical faces (chamfers, countersinks, drafts)

- face 5: area 17 mm2, bbox [-50.008, -35.008, 14.992, -41.992, -26.992, 16.008] {'half_angle_deg': 45.0, 'center': [-42.0, -27.0]}
- face 8: area 17 mm2, bbox [-50.008, 26.992, 14.992, -41.992, 35.008, 16.008] {'half_angle_deg': 45.0, 'center': [-42.0, 27.0]}
- face 24: area 17 mm2, bbox [41.992, -35.008, 14.992, 50.008, -26.992, 16.008] {'half_angle_deg': 45.0, 'center': [42.0, -27.0]}
- face 25: area 17 mm2, bbox [41.992, 26.992, 14.992, 50.008, 35.008, 16.008] {'half_angle_deg': 45.0, 'center': [42.0, 27.0]}

### Vertical flat walls: 10 faces

- face 0: normal (-1, -0), from (-50,-27) to (-50,27), Z -0..15
- face 6: normal (-0, -1), from (-42,-35) to (42,-35), Z -0..15
- face 9: normal (0, 1), from (-42,35) to (42,35), Z -0..15
- face 12: normal (1, 0), from (50,-27) to (50,27), Z -0..15
- face 18: normal (-0, -1), from (21.5,20) to (38.5,20), Z -0..16
- face 20: normal (-0, 1), from (21.5,12) to (38.5,12), Z -0..16
- face 30: normal (1, 0), from (15,-19) to (15,-5), Z 8..16
- face 31: normal (0, 1), from (18,-22) to (42,-22), Z 8..16
- face 34: normal (-0, -1), from (18,-2) to (42,-2), Z 8..16
- face 35: normal (-1, -0), from (45,-19) to (45,-5), Z 8..16

### Inclined flat faces

- face 2: normal [-0.7071, -0.0, 0.7071], bbox [-50, -27, 15, -49, 27, 16]
- face 22: normal [-0.0, -0.7071, 0.7071], bbox [-42, -35, 15, 42, -34, 16]
- face 23: normal [0.0, 0.7071, 0.7071], bbox [-42, 34, 15, 42, 35, 16]
- face 26: normal [0.7071, 0.0, 0.7071], bbox [49, -27, 15, 50, 27, 16]
