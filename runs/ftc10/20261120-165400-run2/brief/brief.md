# Job brief (3+2 indexed 5-axis): ftc10

ftc10 (nist_ftc_10_asme1_rb.stp), machined 3+2 from AL6061 billet.

- Material **AL6061-T6**, tolerance **+-0.1 mm** on every scored surface.
- **Fixture frame (G54):** part bottom = parting plane at **Z0**, part centred in XY. Part bbox X [-15.50, 15.50]
  Y [-79.00, 79.00] Z [0.00, 75.00].
- **Orientation chosen:** model axis `+Z` points up, then rotated 90 deg about Z, scale 1.0.
- **Stock:** box X [-18.50, 18.50] Y [-82.00, 82.00] Z [-24.00, 76.50]: part + 3 mm sides,
  + 1.5 mm top, plus a **stub** below Z0: 16 mm clearance gap (Z -16..0) and 8 mm
  gripped in the vise (Z -24..-16).
- **Vise:** jaws clamp the stub on its -Y and +Y faces (jaws 15 mm thick, top at Z-16, extending 10 mm beyond the
  stock in X); vise body below; table below that. Boxes are in `setup.json` ("vise"). Tool and holder must never
  touch them, in any orientation.
- **Machine:** trunnion 5-axis (A tilt <= 110 deg, C unlimited), 3+2 only (no simultaneous 5-axis).
- Surface classes: scored 82.0%, parting face (hand-finished) 6.2%, **not reachable in 3+2 with
  the library 11.7%** (excluded; see `reachability.png`).

## Files
`part.step`, `part.stl` (fixture frame, mm), `faces.json`, `setup.json` (stock, vise boxes, fixture), images.

## Tool directions that reach the surface (greedy cover found by the harness - a hint, not a plan)
| tool axis (G54) | tilt A deg | share of surface first reached |
|---|---|---|
| (-0.707, -0.707, +0.000) | 90.0 | 31.0% |
| (-0.577, -0.577, +0.577) | 54.7 | 5.2% |
| (-1.000, +0.000, +0.000) | 90.0 | 10.8% |
| (-0.707, +0.000, +0.707) | 45.0 | 1.1% |
| (-0.707, +0.707, +0.000) | 90.0 | 0.4% |
| (-0.577, +0.577, +0.577) | 54.7 | 0.1% |
| (+0.000, -1.000, +0.000) | 90.0 | 3.4% |
| (+0.000, -0.707, +0.707) | 45.0 | 3.8% |
| (+0.000, +0.000, +1.000) | 0.0 | 7.7% |
| (+0.000, +1.000, +0.000) | 90.0 | 3.0% |
| (+0.000, +0.707, +0.707) | 45.0 | 0.0% |
| (+0.707, -0.707, +0.000) | 90.0 | 13.6% |
| (+0.577, -0.577, +0.577) | 54.7 | 1.1% |
| (+1.000, +0.000, +0.000) | 90.0 | 6.4% |
| (+0.707, +0.000, +0.707) | 45.0 | 0.0% |
| (+0.707, +0.707, +0.000) | 90.0 | 0.0% |
| (+0.577, +0.577, +0.577) | 54.7 | 0.0% |

## G-code dialect
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

Everything from the 3-axis dialect (metric, absolute, G0/G1/G2/G3, G81-G83, T M6 + G43 H, S M3/M5, M30), plus
indexed 5-axis on a trunnion table (A tilt up to 110 deg from vertical, C unlimited):
- `G68.2 X.. Y.. Z.. I.. J.. K..` defines a tilted work plane: origin X Y Z in G54 (fixture) coordinates, Euler angles
  I J K in degrees (Z, then X', then Z''). The tool axis (frame +Z) in G54 is R[:,2] with R = Rz(I) Rx(J) Rz(K).
  Example: `I0 J90 K0` -> tool comes from -Y (frame X = +X, frame Y = +Z, frame Z = -Y);
  `I90 J90 K0` -> tool from +X; `I-90 J90 K0` -> tool from -X; `I180 J90 K0` -> from +Y; `I0 J45 K0` -> 45 deg
  towards -Y.
- `G53.1` then orients the machine: the tool first retracts to Z150 of the current frame, the table indexes, and the
  tool is parked at Z150 above the new frame origin. Program plain XYZ in the tilted frame afterwards.
- `G69` cancels (same retract/park). A new `G68.2` requires `G69` first. Motion between G68.2 and G53.1 is an error.
- Mark the part-off section with a comment `(PART-OFF)` before its first block.

## Checks and score
- Crashes are errors: rapids touching material, spindle stopped while cutting, material above the flute length,
  tool holder touching material, **tool or holder touching the vise or table** (all moves, all orientations).
  In tilted setups the material state is tracked on a 0.25 mm voxel grid, so keep rapids >= 0.5 mm clear.
- **Rigidity:** until the `(PART-OFF)` section the weakest material cross-section between the gripped stub and the
  part (minimum over planes spanning the stub gap) must stay >= 30 % of the stock cross-section.
- **Part-off:** the program must end with a part-off section that cuts the stub gap down to <= 15 % of the section
  but leaves >= 2 mm2 (tabs or a thin web) so the part does not come loose in the machine; the operator breaks /
  saws it off and hand-finishes the bottom (parting) face, which is therefore not scored.
- Cutting data checks as in 3-axis (chip load, cut cross-section, plunges).
- Score: share of the **3+2-reachable** surface within +-0.1 mm (reachable = the smallest library flat or ball tool can
  reach it from some allowed tool direction - with its holder and stick-out - without gouging the part or entering
  the vise). Surface no tool
  direction reaches is reported separately as "needs simultaneous 5-axis / a smaller tool".

## Tool library
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

Tool body: cutting profile up to the flute length, shank (same diameter) up to the stick-out, holder cylinder of the
holder diameter from the stick-out upwards (checked for 50 mm). All endmills are centre-cutting; T9 is not.

## Geometry digest (fixture frame)
### Upward-facing flat faces (floors / tops) by Z

| Z | faces | total area mm2 | XY extent of each face |
|---|---|---|---|
| 75 | 2 | 2686 | [-14.5,-70]-[15.5,40]; [-6.5,55]-[15.5,70] |
| 74 | 1 | 115 | [-7.5,45]-[15.5,50] |
| 72 | 2 | 230 | [-7.5,50]-[15.5,55]; [-7.5,40]-[15.5,45] |
| 68.5 | 1 | 63 | [-15.5,43]-[-8.5,52] |
| 65 | 4 | 160 | [-12.5,-35]-[-2.5,-25]; [-12.5,-57]-[-2.5,-47]; [-12.5,-13]-[-2.5,-3]; [-12.5,9]-[-2.5,19] |
| 20 | 1 | 75 | [-11.5,30.5]-[-8.5,58.5] |
| 12.5 | 1 | 1110 | [0.5,-56]-[15.5,18] |

### Downward-facing flat faces above Z0 (overhangs: not machinable from +Z)

- face 131: z 10, extent [-12.5,-35]-[-2.5,-25]
- face 133: z 10, extent [-12.5,9]-[-2.5,19]
- face 135: z 10, extent [-12.5,-13]-[-2.5,-3]
- face 137: z 10, extent [-12.5,-57]-[-2.5,-47]
- face 163: z 62.5, extent [0.5,-56]-[15.5,18]
- face 204: z 5, extent [-11.5,30.5]-[-8.5,58.5]
- face 209: z 53.5, extent [-15.5,43]-[-8.5,52]

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 100 | hole/concave | (-24.7988, -41) | 12.5 | 0.999..74.001 | partial arc (corner/slot end) |
| 102 | hole/concave | (-24.7988, -19) | 12.5 | 0.999..74.001 | partial arc (corner/slot end) |
| 104 | hole/concave | (-24.7988, 3) | 12.5 | 0.999..74.001 | partial arc (corner/slot end) |
| 98 | hole/concave | (-8.5, -60.9443) | 1 | 1..74 | partial arc (corner/slot end) |
| 106 | hole/concave | (-8.5, 22.9443) | 1 | 44.428..74 | partial arc (corner/slot end) |
| 96 | hole/concave | (-8.5, 22.9443) | 1 | 1..30.572 | partial arc (corner/slot end) |
| 15 | hole/concave | (-8.5, 28.5) | 1 | 6..19 | partial arc (corner/slot end) |
| 17 | hole/concave | (-8.5, 60.5) | 1 | 6..19 | partial arc (corner/slot end) |
| 140 | hole/concave | (-7.5, -52) | 5 | 65..75 | full/near-full |
| 99 | boss/convex | (-7.5, -52) | 8 | 0.999..74.001 | partial arc (corner/slot end) |
| 147 | hole/concave | (-7.5, -52) | 3.5 | 10..65 | full/near-full |
| 136 | hole/concave | (-7.5, -52) | 5 | -0..10 | full/near-full |
| 138 | hole/concave | (-7.5, -30) | 5 | 65..75 | full/near-full |
| 101 | boss/convex | (-7.5, -30) | 8 | 0.999..74.001 | partial arc (corner/slot end) |
| 148 | hole/concave | (-7.5, -30) | 3.5 | 10..65 | full/near-full |
| 130 | hole/concave | (-7.5, -30) | 5 | -0..10 | full/near-full |
| 142 | hole/concave | (-7.5, -8) | 5 | 65..75 | full/near-full |
| 103 | boss/convex | (-7.5, -8) | 8 | 0.999..74.001 | partial arc (corner/slot end) |
| 146 | hole/concave | (-7.5, -8) | 3.5 | 10..65 | full/near-full |
| 134 | hole/concave | (-7.5, -8) | 5 | -0..10 | full/near-full |
| 144 | hole/concave | (-7.5, 14) | 5 | 65..75 | full/near-full |
| 105 | boss/convex | (-7.5, 14) | 8 | 0.998..74.002 | partial arc (corner/slot end) |
| 149 | hole/concave | (-7.5, 14) | 3.5 | 10..65 | full/near-full |
| 132 | hole/concave | (-7.5, 14) | 5 | -0..10 | full/near-full |
| 57 | boss/convex | (-6.5, -61.5) | 1 | 1..74 | partial arc (corner/slot end) |
| 84 | boss/convex | (-6.5, 61.5) | 1 | 44.428..74 | partial arc (corner/slot end) |
| 88 | boss/convex | (-6.5, 61.5) | 1 | 1..30.572 | partial arc (corner/slot end) |
| 155 | hole/concave | (0.5, -56) | 2 | 14.5..60.5 | partial arc (corner/slot end) |
| 152 | hole/concave | (0.5, 18) | 2 | 14.5..60.5 | partial arc (corner/slot end) |
| 41 | hole/concave | (6.5, -63.5) | 1 | 1..74 | partial arc (corner/slot end) |
| 69 | hole/concave | (6.5, 63.5) | 1 | 1..74 | partial arc (corner/slot end) |
| 34 | boss/convex | (8.5, -69) | 1 | 18.95..56.05 | partial arc (corner/slot end) |
| 71 | boss/convex | (8.5, 69) | 1 | 18.95..56.05 | partial arc (corner/slot end) |

### Non-vertical cylindrical faces (round-overs, fillets, crowns)

- face 0: radius 1.25, axis [1.0, 0.0, 0.0], concave, bbox [-4.231, -9.25, 51.75, -1.5, -6.75, 54.25]
- face 1: radius 1.25, axis [1.0, 0.0, 0.0], concave, bbox [-4.231, -53.25, 51.75, -1.5, -50.75, 54.25]
- face 2: radius 1.25, axis [1.0, 0.0, 0.0], concave, bbox [-4.231, -9.25, 20.75, -1.5, -6.75, 23.25]
- face 3: radius 1.25, axis [1.0, 0.0, 0.0], concave, bbox [-4.231, -53.25, 20.75, -1.5, -50.75, 23.25]
- face 4: radius 1.25, axis [1.0, 0.0, 0.0], concave, bbox [-4.231, -31.25, 20.75, -1.5, -28.75, 23.25]
- face 5: radius 1.25, axis [1.0, 0.0, 0.0], concave, bbox [-4.231, 12.75, 20.75, -1.5, 15.25, 23.25]
- face 6: radius 1.25, axis [1.0, 0.0, 0.0], concave, bbox [-4.231, -31.25, 51.75, -1.5, -28.75, 54.25]
- face 7: radius 1.25, axis [1.0, 0.0, 0.0], concave, bbox [-4.231, 12.75, 51.75, -1.5, 15.25, 54.25]
- face 11: radius 1, axis [0.0, 1.0, -0.0], concave, bbox [-8.5, 30.5, 4, -7.5, 58.5, 5]
- face 13: radius 1, axis [-0.0, -1.0, 0.0], concave, bbox [-8.5, 30.5, 20, -7.5, 58.5, 21]
- face 14: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-11.5, 29.5, 19, -8.5, 30.5, 20]
- face 16: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-11.5, 29.5, 5, -8.5, 30.5, 6]
- face 18: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-11.5, 58.5, 19, -8.5, 59.5, 20]
- face 19: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-11.5, 58.5, 5, -8.5, 59.5, 6]
- face 25: radius 1, axis [-0.0, -1.0, 0.0], concave, bbox [-8.5, 43, 68.5, -7.5, 52, 69.5]
- face 27: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [-8.5, 43, 52.5, -7.5, 52, 53.5]
- face 29: radius 7.5, axis [-1.0, 0.0, 0.0], convex, bbox [-15.501, 35.499, 53.499, -8.499, 43.001, 68.501]
- face 37: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [7.5, -70, 74, 8.5, -63.5, 75]
- face 39: radius 1, axis [-0.0, -1.0, 0.0], convex, bbox [7.5, -70, -0, 8.5, -63.5, 1]
- face 43: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-6.5, -62.5, 74, 6.5, -61.5, 75]
- face 44: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-7.5, -61.5, 74, -6.5, -60.944, 75]
- face 54: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-7.5, 22.944, 74, -6.5, 40, 75]
- face 56: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-6.5, -62.5, -0, 6.5, -61.5, 1]
- face 63: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [7.5, 63.5, 74, 8.5, 70, 75]
- face 67: radius 1, axis [-0.0, -1.0, 0.0], convex, bbox [7.5, 63.5, -0, 8.5, 70, 1]
- face 68: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-6.5, 61.5, -0, 6.5, 62.5, 1]
- face 70: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-6.5, 61.5, 74, 6.5, 62.5, 75]
- face 72: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [8.5, 70, 17.955, 15.5, 70.9, 18.95]
- face 73: radius 1, axis [-0.0, -1.0, 0.0], convex, bbox [-7.5, 22.944, -0, -6.5, 61.5, 1]
- face 83: radius 1, axis [-0.0, -1.0, 0.0], convex, bbox [-7.5, -61.5, -0, -6.5, -60.944, 1]
- face 89: radius 1, axis [1.0, -0.0, 0.0], concave, bbox [8.5, 70, 56.05, 15.5, 70.9, 57.045]
- face 90: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-7.5, 55, 74, -6.5, 61.5, 75]
- face 91: radius 1, axis [1.0, -0.0, 0.0], concave, bbox [8.5, -70.9, 17.955, 15.5, -70, 18.95]
- face 92: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [8.5, -70.9, 56.05, 15.5, -70, 57.045]
- face 93: radius 1, axis [-0.0, -1.0, 0.0], concave, bbox [-8.357, 22.944, 43.438, -7.5, 61.5, 44.428]
- face 94: radius 6, axis [-0.0, -1.0, 0.0], convex, bbox [-13.502, 19.654, 31.56, -8.355, 61.502, 43.44]
- face 95: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [-8.357, 22.944, 30.572, -7.5, 61.5, 31.562]
- face 109: radius 9, axis [1.0, -0.0, 0.0], convex, bbox [8.499, -79.001, 57.044, 15.501, -69.999, 75.001]
- face 115: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [7.5, -75, 4, 9.5, -65, 14]
- face 116: radius 3, axis [-1.0, 0.0, 0.0], concave, bbox [9.5, -73, 6, 15.5, -67, 12]
- face 118: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [7.5, 65, 61, 9.5, 75, 71]
- face 119: radius 3, axis [-1.0, 0.0, 0.0], concave, bbox [9.5, 67, 63, 15.5, 73, 69]
- face 121: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [7.5, 65, 4, 9.5, 75, 14]
- face 122: radius 3, axis [-1.0, 0.0, 0.0], concave, bbox [9.5, 67, 6, 15.5, 73, 12]
- face 124: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [7.5, -75, 61, 9.5, -65, 71]
- face 125: radius 3, axis [-1.0, 0.0, 0.0], concave, bbox [9.5, -73, 63, 15.5, -67, 69]
- face 126: radius 9, axis [1.0, -0.0, 0.0], convex, bbox [8.499, 69.999, -0.001, 15.501, 79.001, 17.956]
- face 127: radius 9, axis [1.0, -0.0, 0.0], convex, bbox [8.499, 69.999, 57.044, 15.501, 79.001, 75.001]
- face 128: radius 9, axis [1.0, -0.0, 0.0], convex, bbox [8.499, -79.001, -0.001, 15.501, -69.999, 17.956]
- face 156: radius 2, axis [-1.0, -0.0, 0.0], concave, bbox [0.5, -58, 12.5, 15.5, -56, 14.5]
- face 157: radius 2, axis [-0.0, 1.0, 0.0], concave, bbox [-1.5, -56, 12.5, 0.5, 18, 14.5]
- face 158: radius 2, axis [0.0, -1.0, 0.0], concave, bbox [-1.5, -56, 60.5, 0.5, 18, 62.5]
- face 159: radius 2, axis [1.0, 0.0, 0.0], concave, bbox [0.5, -58, 60.5, 15.5, -56, 62.5]
- face 160: radius 2, axis [1.0, 0.0, 0.0], concave, bbox [0.5, 18, 12.5, 15.5, 20, 14.5]
- face 161: radius 2, axis [-1.0, -0.0, 0.0], concave, bbox [0.5, 18, 60.5, 15.5, 20, 62.5]
- face 175: radius 2.75, axis [0.0, 1.0, 0.0], concave, bbox [-2.25, 27.5, 9.75, 3.25, 62.5, 15.25]
- face 177: radius 2.75, axis [0.0, 1.0, 0.0], concave, bbox [-5.25, 35, 58.25, 0.25, 62.5, 63.75]
- face 178: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-15.5, 45.75, 59.25, -4.621, 49.25, 62.75]
- face 179: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-15.5, 38.75, 59.25, -4.621, 42.25, 62.75]
- face 180: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-15.5, 52.75, 59.25, -4.621, 56.25, 62.75]
- face 189: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 52.67, 6.27, 0.5, 55.13, 8.73]
- face 191: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 41.67, 6.27, 0.5, 44.13, 8.73]
- face 193: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 30.67, 6.27, 0.5, 33.13, 8.73]
- face 195: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 33.87, 16.27, 0.5, 36.33, 18.73]
- face 197: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 44.87, 16.27, 0.5, 47.33, 18.73]
- face 199: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 55.87, 16.27, 0.5, 58.33, 18.73]
- face 200: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 42.75, 10.75, -1.621, 46.25, 14.25]
- face 201: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 31.75, 10.75, -1.621, 35.25, 14.25]
- face 202: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 53.75, 10.75, -1.621, 57.25, 14.25]
- face 208: radius 7.5, axis [-1.0, 0.0, 0.0], convex, bbox [-15.501, 51.999, 53.499, -8.499, 59.501, 68.501]

### Conical faces (chamfers, countersinks, drafts)

- face 174: area 28 mm2, bbox [-2.254, 25.844, 9.746, 3.254, 27.504, 15.254] {'half_angle_deg': 59.0, 'center': [0.5, 26.6738]}
- face 176: area 28 mm2, bbox [-5.254, 33.344, 58.246, 0.254, 35.004, 63.754] {'half_angle_deg': 59.0, 'center': [-2.5, 34.1738]}
- face 188: area 6 mm2, bbox [0.498, 52.669, 6.269, 1.24, 55.131, 8.731] {'half_angle_deg': 59.0, 'center': [0.8694, 53.9]}
- face 190: area 6 mm2, bbox [0.498, 41.669, 6.269, 1.24, 44.131, 8.731] {'half_angle_deg': 59.0, 'center': [0.8694, 42.9]}
- face 192: area 6 mm2, bbox [0.498, 30.669, 6.269, 1.24, 33.131, 8.731] {'half_angle_deg': 59.0, 'center': [0.8694, 31.9]}
- face 194: area 6 mm2, bbox [0.498, 33.869, 16.269, 1.24, 36.331, 18.731] {'half_angle_deg': 59.0, 'center': [0.8694, 35.1]}
- face 196: area 6 mm2, bbox [0.498, 44.869, 16.269, 1.24, 47.331, 18.731] {'half_angle_deg': 59.0, 'center': [0.8694, 46.1]}
- face 198: area 6 mm2, bbox [0.498, 55.869, 16.269, 1.24, 58.331, 18.731] {'half_angle_deg': 59.0, 'center': [0.8694, 57.1]}

### Toroidal faces (fillets, round-over corners)

- face 8: area 3 mm2, bbox [-8.5, 58.5, 4, -7.5, 60.5, 6] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 9: area 3 mm2, bbox [-8.5, 58.5, 19, -7.5, 60.5, 21] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 10: area 3 mm2, bbox [-8.5, 28.5, 4, -7.5, 30.5, 6] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 12: area 3 mm2, bbox [-8.5, 28.5, 19, -7.5, 30.5, 21] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 26: area 39 mm2, bbox [-8.501, 34.499, 52.499, -7.499, 43.001, 69.501] {'minor_radius': 1.0, 'major_radius': 8.5}
- face 28: area 39 mm2, bbox [-8.501, 51.999, 52.499, -7.499, 60.501, 69.501] {'minor_radius': 1.0, 'major_radius': 8.5}
- face 32: area 3 mm2, bbox [7.5, -70.9, 56.05, 8.5, -69, 58.04] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 33: area 3 mm2, bbox [7.5, -70.9, 16.96, 8.5, -69, 18.95] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 35: area 3 mm2, bbox [6.5, -63.5, 74, 8.5, -61.5, 75] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 36: area 41 mm2, bbox [7.499, -79.001, 57.044, 8.501, -69.999, 75.001] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 38: area 3 mm2, bbox [6.5, -63.5, -0, 8.5, -61.5, 1] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 40: area 41 mm2, bbox [7.499, -79.001, -0.001, 8.501, -69.999, 17.956] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 45: area 3 mm2, bbox [-8.389, -60.945, 74, -6.5, -58.956, 75] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 46: area 24 mm2, bbox [-15.501, -59.951, 73.999, -8.277, -47.707, 75.001] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 47: area 23 mm2, bbox [-14.252, -48.245, 73.999, -11.298, -33.755, 75.001] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 48: area 14 mm2, bbox [-15.501, -34.293, 73.999, -13.406, -25.707, 75.001] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 49: area 23 mm2, bbox [-14.252, -26.245, 73.999, -11.298, -11.755, 75.001] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 50: area 14 mm2, bbox [-15.501, -12.293, 73.999, -13.406, -3.707, 75.001] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 51: area 23 mm2, bbox [-14.252, -4.245, 73.999, -11.298, 10.245, 75.001] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 52: area 24 mm2, bbox [-15.501, 9.707, 73.999, -8.277, 21.951, 75.001] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 53: area 3 mm2, bbox [-8.389, 20.956, 74, -6.5, 22.945, 75] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 59: area 3 mm2, bbox [7.5, 69, 56.05, 8.5, 70.9, 58.04] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 61: area 3 mm2, bbox [7.5, 69, 16.96, 8.5, 70.9, 18.95] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 62: area 3 mm2, bbox [6.5, 61.5, 74, 8.5, 63.5, 75] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 64: area 41 mm2, bbox [7.499, 69.999, 57.044, 8.501, 79.001, 75.001] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 65: area 3 mm2, bbox [6.5, 61.5, -0, 8.5, 63.5, 1] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 66: area 41 mm2, bbox [7.499, 69.999, -0.001, 8.501, 79.001, 17.956] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 74: area 3 mm2, bbox [-8.389, 20.956, -0, -6.5, 22.945, 1] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 75: area 24 mm2, bbox [-15.501, 9.707, -0.001, -8.277, 21.951, 1.001] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 76: area 23 mm2, bbox [-14.252, -4.245, -0.001, -11.298, 10.245, 1.001] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 77: area 14 mm2, bbox [-15.501, -12.293, -0.001, -13.406, -3.707, 1.001] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 78: area 23 mm2, bbox [-14.252, -26.245, -0.001, -11.298, -11.755, 1.001] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 79: area 14 mm2, bbox [-15.501, -34.293, -0.001, -13.406, -25.707, 1.001] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 80: area 23 mm2, bbox [-14.252, -48.245, -0.001, -11.298, -33.755, 1.001] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 81: area 24 mm2, bbox [-15.501, -59.951, -0.001, -8.277, -47.707, 1.001] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 82: area 3 mm2, bbox [-8.389, -60.945, -0, -6.5, -58.956, 1] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 85: area 3 mm2, bbox [-8.357, 61.5, 42.448, -6.5, 62.5, 44.428] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 86: area 25 mm2, bbox [-13.5, 61.499, 31.561, -8.214, 62.501, 43.439] {'minor_radius': 1.0, 'major_radius': 5.0}
- face 87: area 3 mm2, bbox [-8.357, 61.5, 30.572, -6.5, 62.5, 32.552] {'minor_radius': 1.0, 'major_radius': 2.0}

### Spherical faces

- face 42: area 2 mm2, bbox [-7.5, -62.5, 74, -6.5, -61.5, 75] {'radius': 1.0}
- face 55: area 2 mm2, bbox [-7.5, -62.5, -0, -6.5, -61.5, 1] {'radius': 1.0}
- face 58: area 2 mm2, bbox [-7.5, 61.5, 74, -6.5, 62.5, 75] {'radius': 1.0}
- face 60: area 2 mm2, bbox [-7.5, 61.5, -0, -6.5, 62.5, 1] {'radius': 1.0}
- face 150: area 6 mm2, bbox [-1.501, 17.999, 60.499, 0.501, 20.001, 62.501] {'radius': 2.0}
- face 151: area 6 mm2, bbox [-1.501, 17.999, 12.499, 0.501, 20.001, 14.501] {'radius': 2.0}
- face 153: area 6 mm2, bbox [-1.501, -58.001, 60.499, 0.501, -55.999, 62.501] {'radius': 2.0}
- face 154: area 6 mm2, bbox [-1.501, -58.001, 12.499, 0.501, -55.999, 14.501] {'radius': 2.0}
- face 181: area 1 mm2, bbox [-8.39, 21.95, 30.571, -7.499, 22.945, 31.562] {'radius': 1.0}
- face 182: area 1 mm2, bbox [-8.39, 21.949, 43.437, -7.499, 22.945, 44.429] {'radius': 1.0}

### Free-form (B-spline) faces

- face 183: area 21 mm2, bbox [-13.727, 19.023, 30.568, -8.316, 22.949, 44.432] 

### Vertical flat walls: 33 faces

- face 20: normal (-1, 0), bbox X -11.5..-11.5, Y 29.5..37.5, Z 5..20
- face 22: normal (-1, 0), bbox X -11.5..-11.5, Y 51.5..59.5, Z 5..20
- face 23: normal (0, 1), bbox X -11.5..-8.5, Y 59.5..59.5, Z 6..19
- face 24: normal (-1, 0), bbox X -7.5..-7.5, Y 22.944..61.5, Z 1..30.572
- face 31: normal (-1, 0), bbox X -7.5..-7.5, Y 22.944..61.5, Z 44.428..74
- face 97: normal (-1, 0), bbox X -7.5..-7.5, Y -61.5..-60.944, Z 1..74
- face 107: normal (0, 1), bbox X -7.5..15.5, Y 40..40, Z 72..75
- face 110: normal (-1, 0), bbox X 7.5..7.5, Y -78..-63.5, Z 1..74
- face 111: normal (-0, -1), bbox X -6.5..6.5, Y -62.5..-62.5, Z 1..74
- face 112: normal (-1, 0), bbox X 7.5..7.5, Y 63.5..78, Z 1..74
- face 113: normal (0, 1), bbox X -12.5..6.5, Y 62.5..62.5, Z 1..74
- face 114: normal (-1, 0), bbox X 9.5..9.5, Y -75..-65, Z 4..14
- face 117: normal (-1, 0), bbox X 9.5..9.5, Y 65..75, Z 61..71
- face 120: normal (-1, 0), bbox X 9.5..9.5, Y 65..75, Z 4..14
- face 123: normal (-1, 0), bbox X 9.5..9.5, Y -75..-65, Z 61..71
- face 129: normal (0, 1), bbox X 8.5..15.5, Y 70..70, Z 18.95..56.05
- face 162: normal (0, 1), bbox X 0.5..15.5, Y -58..-58, Z 14.5..60.5
- face 164: normal (1, -0), bbox X -1.5..-1.5, Y -56..18, Z 14.5..60.5
- face 166: normal (-0, -1), bbox X 0.5..15.5, Y 20..20, Z 14.5..60.5
- face 167: normal (0, 1), bbox X -7.5..15.5, Y 50..50, Z 72..74
- face 168: normal (-0, -1), bbox X -7.5..15.5, Y 55..55, Z 72..75
- face 170: normal (-0, -1), bbox X -7.5..15.5, Y 45..45, Z 72..74
- face 172: normal (1, -0), bbox X 15.5..15.5, Y -79..79, Z -0..75
- face 184: normal (-1, 0), bbox X -10..-10, Y 48.5..51.5, Z 5..20
- face 185: normal (-1, 0), bbox X -10..-10, Y 37.5..40.5, Z 5..20
- face 186: normal (0, 1), bbox X -11.5..-10, Y 48.5..48.5, Z 5..20
- face 187: normal (0, 1), bbox X -11.5..-10, Y 37.5..37.5, Z 5..20
- face 203: normal (-0, -1), bbox X -11.5..-10, Y 51.5..51.5, Z 5..20
- face 205: normal (-0, -1), bbox X -11.5..-8.5, Y 29.5..29.5, Z 6..19
- face 206: normal (-0, -1), bbox X -11.5..-10, Y 40.5..40.5, Z 5..20
- face 207: normal (-1, 0), bbox X -11.5..-11.5, Y 40.5..48.5, Z 5..20
- face 210: normal (-1, 0), bbox X -15.5..-15.5, Y 35.5..59.5, Z 53.5..68.5
- face 212: normal (-0, -1), bbox X 8.5..15.5, Y -70..-70, Z 18.95..56.05
