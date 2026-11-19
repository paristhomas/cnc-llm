# Job brief: mould_cavity

Injection-mould cavity insert 90 x 70 x 30. Elliptical cavity 70 x 50 at the top face, drafted down to a 50 x 30 floor at 14 mm depth (lofted walls), R4 blended floor edge, a spherical dome (R30) rising 6 mm from the floor in the middle. 2 mm x 45deg chamfer around the cavity rim. Four D8 guide-pin holes 12 deep near the corners.

- Material: **AL6061-T6**. Tolerance: **+-0.1 mm on every machinable surface**.
- Part bounding box: X [-45, 45], Y [-35, 35], Z [0, 30] (mm).
- **Stock**: box X [-47, 47], Y [-37, 37], Z [0, 31].
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
| 30 | 1 | 3027 | [-45,-35]-[45,35] |
| 18 | 4 | 201 | [-42,-32]-[-34,-24]; [34,-32]-[42,-24]; [-42,24]-[-34,32]; [34,24]-[42,32] |
| 16 | 2 | 129 | [15.292,-9.495]-[22.9,9.495]; [-22.899,-9.495]-[-15.292,9.495] |

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 11 | hole/concave | (-38, -28) | 4 | 18..30 | full/near-full |
| 13 | hole/concave | (-38, 28) | 4 | 18..30 | full/near-full |
| 12 | hole/concave | (38, -28) | 4 | 18..30 | full/near-full |
| 14 | hole/concave | (38, 28) | 4 | 18..30 | full/near-full |

### Spherical faces

- face 5: area 1032 mm2, bbox [-18.005, -15.954, 15.994, 18.006, 15.954, 22.006] {'radius': 30.0}

### Free-form (B-spline) faces

- face 0: area 2025 mm2, bbox [-33.527, -23.526, 17.721, 33.527, 23.527, 28.361] 
- face 1: area 674 mm2, bbox [-36.662, -26.664, 28.337, 36.664, 26.663, 30.008] 
- face 2: area 332 mm2, bbox [-26.196, -16.196, 15.996, 26.197, 16.196, 17.777] 

### Vertical flat walls: 4 faces

- face 7: normal (-1, -0), from (-45,-35) to (-45,35), Z -0..30
- face 8: normal (0, 1), from (-45,35) to (45,35), Z -0..30
- face 9: normal (-0, -1), from (-45,-35) to (45,-35), Z -0..30
- face 10: normal (1, 0), from (45,-35) to (45,35), Z -0..30
