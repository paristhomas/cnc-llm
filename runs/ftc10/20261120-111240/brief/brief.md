# Job brief (3+2 indexed 5-axis): ftc10

ftc10 (nist_ftc_10_asme1_rb.stp), machined 3+2 from AL6061 billet.

- Material **AL6061-T6**, tolerance **+-0.1 mm** on every scored surface.
- **Fixture frame (G54):** part bottom = parting plane at **Z0**, part centred in XY. Part bbox X [-37.50, 37.50]
  Y [-79.00, 79.00] Z [0.00, 31.00].
- **Orientation chosen:** model axis `-Y` points up, then rotated 90 deg about Z, scale 1.0.
- **Stock:** box X [-40.50, 40.50] Y [-82.00, 82.00] Z [-43.00, 32.50]: part + 3 mm sides,
  + 1.5 mm top, plus a **stub** below Z0: 35 mm clearance gap (Z -35..0) and 8 mm
  gripped in the vise (Z -43..-35).
- **Vise:** jaws clamp the stub on its -Y and +Y faces (jaws 15 mm thick, top at Z-35, extending 10 mm beyond the
  stock in X); vise body below; table below that. Boxes are in `setup.json` ("vise"). Tool and holder must never
  touch them, in any orientation.
- **Machine:** trunnion 5-axis (A tilt <= 110 deg, C unlimited), 3+2 only (no simultaneous 5-axis).
- Surface classes: scored 95.6%, parting face (hand-finished) 0.7%, **not reachable in 3+2 with
  the library 3.7%** (excluded; see `reachability.png`).

## Files
`part.step`, `part.stl` (fixture frame, mm), `faces.json`, `setup.json` (stock, vise boxes, fixture), images.

## Tool directions that reach the surface (greedy cover found by the harness - a hint, not a plan)
| tool axis (G54) | tilt A deg | share of surface first reached |
|---|---|---|
| (-0.707, -0.707, +0.000) | 90.0 | 32.6% |
| (-0.577, -0.577, +0.577) | 54.7 | 8.5% |
| (-1.000, +0.000, +0.000) | 90.0 | 26.7% |
| (-0.707, +0.000, +0.707) | 45.0 | 3.6% |
| (-0.707, +0.707, +0.000) | 90.0 | 2.0% |
| (-0.577, +0.577, +0.577) | 54.7 | 0.1% |
| (+0.000, -1.000, +0.000) | 90.0 | 6.7% |
| (+0.000, -0.707, +0.707) | 45.0 | 4.8% |
| (+0.000, +0.000, +1.000) | 0.0 | 1.9% |
| (+0.000, +1.000, +0.000) | 90.0 | 5.6% |
| (+0.707, -0.707, +0.000) | 90.0 | 1.0% |
| (+0.577, -0.577, +0.577) | 54.7 | 0.2% |
| (+1.000, +0.000, +0.000) | 90.0 | 2.7% |
| (+0.707, +0.707, +0.000) | 90.0 | 0.0% |

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
- **Rigidity:** until the `(PART-OFF)` section the material connecting the part to the gripped stub (measured in the
  middle of the stub gap) must stay >= 50 % of the stock cross-section.
- **Part-off:** the program must end with a part-off section that cuts the stub gap down to <= 15 % of the section
  but leaves >= 2 mm2 (tabs or a thin web) so the part does not come loose in the machine; the operator breaks /
  saws it off and hand-finishes the bottom (parting) face, which is therefore not scored.
- Cutting data checks as in 3-axis (chip load, cut cross-section, plunges).
- Score: share of the **3+2-reachable** surface within +-0.1 mm (reachable = the smallest library flat or ball tool can
  reach it from some allowed tool direction without gouging the part or entering the vise). Surface no tool
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
| 31 | 1 | 6965 | [-37.5,-79]-[37.5,79] |
| 14 | 1 | 3365 | [-23,-56]-[23,18] |

### Downward-facing flat faces above Z0 (overhangs: not machinable from +Z)

- face 20: z 4, extent [17.5,29.5]-[32.5,37.5]
- face 22: z 4, extent [17.5,51.5]-[32.5,59.5]
- face 24: z 8, extent [6.928,22.944]-[36.5,61.5]
- face 31: z 8, extent [-36.5,22.944]-[-6.928,61.5]
- face 97: z 8, extent [-36.5,-61.5]-[36.5,-60.944]
- face 110: z 23, extent [-36.5,-78]-[36.5,-63.5]
- face 112: z 23, extent [-36.5,63.5]-[36.5,78]
- face 114: z 25, extent [23.5,-75]-[33.5,-65]
- face 117: z 25, extent [-33.5,65]-[-23.5,75]
- face 120: z 25, extent [23.5,65]-[33.5,75]
- face 123: z 25, extent [-33.5,-75]-[-23.5,-65]
- face 184: z 5.5, extent [17.5,48.5]-[32.5,51.5]
- face 185: z 5.5, extent [17.5,37.5]-[32.5,40.5]
- face 207: z 4, extent [17.5,40.5]-[32.5,48.5]

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 43 | boss/convex | (-36.5, -61.5) | 1 | 9..22 | partial arc (corner/slot end) |
| 70 | boss/convex | (-36.5, 61.5) | 1 | 9..22 | partial arc (corner/slot end) |
| 109 | boss/convex | (-28.5, -70) | 9 | 23.999..31.001 | partial arc (corner/slot end) |
| 125 | hole/concave | (-28.5, -70) | 3 | 25..31 | full/near-full |
| 124 | hole/concave | (-28.5, -70) | 5 | 23..25 | full/near-full |
| 127 | boss/convex | (-28.5, 70) | 9 | 23.999..31.001 | partial arc (corner/slot end) |
| 119 | hole/concave | (-28.5, 70) | 3 | 25..31 | full/near-full |
| 118 | hole/concave | (-28.5, 70) | 5 | 23..25 | full/near-full |
| 179 | hole/concave | (-23.5, 40.5) | 1.75 | -0..10.879 | full/near-full |
| 29 | boss/convex | (-23.5, 43) | 7.5 | -0.001..7.001 | partial arc (corner/slot end) |
| 178 | hole/concave | (-23.5, 47.5) | 1.75 | -0..10.879 | full/near-full |
| 208 | boss/convex | (-23.5, 52) | 7.5 | -0.001..7.001 | partial arc (corner/slot end) |
| 180 | hole/concave | (-23.5, 54.5) | 1.75 | -0..10.879 | full/near-full |
| 159 | hole/concave | (-23, -56) | 2 | 16..31 | partial arc (corner/slot end) |
| 161 | hole/concave | (-23, 18) | 2 | 16..31 | partial arc (corner/slot end) |
| 92 | hole/concave | (-18.5501, -71) | 1 | 24..31 | partial arc (corner/slot end) |
| 89 | hole/concave | (-18.5501, 71) | 1 | 24..31 | partial arc (corner/slot end) |
| 1 | hole/concave | (-15.5, -52) | 1.25 | 11.269..14 | full/near-full |
| 6 | hole/concave | (-15.5, -30) | 1.25 | 11.269..14 | full/near-full |
| 0 | hole/concave | (-15.5, -8) | 1.25 | 11.269..14 | full/near-full |
| 7 | hole/concave | (-15.5, 14) | 1.25 | 11.269..14 | full/near-full |
| 3 | hole/concave | (15.5, -52) | 1.25 | 11.269..14 | full/near-full |
| 4 | hole/concave | (15.5, -30) | 1.25 | 11.269..14 | full/near-full |
| 2 | hole/concave | (15.5, -8) | 1.25 | 11.269..14 | full/near-full |
| 5 | hole/concave | (15.5, 14) | 1.25 | 11.269..14 | full/near-full |
| 14 | boss/convex | (18.5, 30.5) | 1 | 4..7 | partial arc (corner/slot end) |
| 18 | boss/convex | (18.5, 58.5) | 1 | 4..7 | partial arc (corner/slot end) |
| 91 | hole/concave | (18.5501, -71) | 1 | 24..31 | partial arc (corner/slot end) |
| 72 | hole/concave | (18.5501, 71) | 1 | 24..31 | partial arc (corner/slot end) |
| 195 | hole/concave | (20, 35.1) | 1.2295 | 4..16 | full/near-full |
| 197 | hole/concave | (20, 46.1) | 1.2295 | 4..16 | full/near-full |
| 199 | hole/concave | (20, 57.1) | 1.2295 | 4..16 | full/near-full |
| 156 | hole/concave | (23, -56) | 2 | 16..31 | partial arc (corner/slot end) |
| 160 | hole/concave | (23, 18) | 2 | 16..31 | partial arc (corner/slot end) |
| 201 | hole/concave | (25, 33.5) | 1.75 | 4..13.879 | full/near-full |
| 200 | hole/concave | (25, 44.5) | 1.75 | 4..13.879 | full/near-full |
| 202 | hole/concave | (25, 55.5) | 1.75 | 4..13.879 | full/near-full |
| 128 | boss/convex | (28.5, -70) | 9 | 23.999..31.001 | partial arc (corner/slot end) |
| 116 | hole/concave | (28.5, -70) | 3 | 25..31 | full/near-full |
| 115 | hole/concave | (28.5, -70) | 5 | 23..25 | full/near-full |
| 126 | boss/convex | (28.5, 70) | 9 | 23.999..31.001 | partial arc (corner/slot end) |
| 122 | hole/concave | (28.5, 70) | 3 | 25..31 | full/near-full |
| 121 | hole/concave | (28.5, 70) | 5 | 23..25 | full/near-full |
| 193 | hole/concave | (30, 31.9) | 1.2295 | 4..16 | full/near-full |
| 191 | hole/concave | (30, 42.9) | 1.2295 | 4..16 | full/near-full |
| 189 | hole/concave | (30, 53.9) | 1.2295 | 4..16 | full/near-full |
| 16 | boss/convex | (31.5, 30.5) | 1 | 4..7 | partial arc (corner/slot end) |
| 19 | boss/convex | (31.5, 58.5) | 1 | 4..7 | partial arc (corner/slot end) |
| 56 | boss/convex | (36.5, -61.5) | 1 | 9..22 | partial arc (corner/slot end) |
| 68 | boss/convex | (36.5, 61.5) | 1 | 9..22 | partial arc (corner/slot end) |

### Non-vertical cylindrical faces (round-overs, fillets, crowns)

- face 11: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [32.5, 30.5, 7, 33.5, 58.5, 8]
- face 13: radius 1, axis [-0.0, -1.0, 0.0], concave, bbox [16.5, 30.5, 7, 17.5, 58.5, 8]
- face 15: radius 1, axis [1.0, -0.0, -0.0], concave, bbox [18.5, 28.5, 7, 31.5, 29.5, 8]
- face 17: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [18.5, 59.5, 7, 31.5, 60.5, 8]
- face 25: radius 1, axis [-0.0, -1.0, 0.0], concave, bbox [-32, 43, 7, -31, 52, 8]
- face 27: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [-16, 43, 7, -15, 52, 8]
- face 34: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-18.55, -70, 23, 18.55, -69, 24]
- face 37: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-37.5, -70, 23, -36.5, -63.5, 24]
- face 39: radius 1, axis [-0.0, -1.0, 0.0], convex, bbox [36.5, -70, 23, 37.5, -63.5, 24]
- face 41: radius 1, axis [1.0, -0.0, 0.0], concave, bbox [-36.5, -63.5, 22, 36.5, -62.5, 23]
- face 44: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-37.5, -61.5, 8, -36.5, -60.944, 9]
- face 54: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-37.5, 22.944, 8, -36.5, 40, 9]
- face 57: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-36.5, -62.5, 8, 36.5, -61.5, 9]
- face 63: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-37.5, 63.5, 23, -36.5, 70, 24]
- face 67: radius 1, axis [-0.0, -1.0, 0.0], convex, bbox [36.5, 63.5, 23, 37.5, 70, 24]
- face 69: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [-36.5, 62.5, 22, 36.5, 63.5, 23]
- face 71: radius 1, axis [1.0, 0.0, 0.0], convex, bbox [-18.55, 69, 23, 18.55, 70, 24]
- face 73: radius 1, axis [-0.0, -1.0, 0.0], convex, bbox [36.5, 22.944, 8, 37.5, 61.5, 9]
- face 83: radius 1, axis [-0.0, -1.0, 0.0], convex, bbox [36.5, -61.5, 8, 37.5, -60.944, 9]
- face 84: radius 1, axis [1.0, -0.0, 0.0], convex, bbox [-36.5, 61.5, 8, -6.928, 62.5, 9]
- face 88: radius 1, axis [1.0, -0.0, 0.0], convex, bbox [6.928, 61.5, 8, 36.5, 62.5, 9]
- face 90: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-37.5, 55, 8, -36.5, 61.5, 9]
- face 93: radius 1, axis [-0.0, -1.0, 0.0], concave, bbox [-6.928, 22.944, 7.143, -5.938, 61.5, 8]
- face 94: radius 6, axis [-0.0, -1.0, 0.0], convex, bbox [-5.94, 19.654, 1.998, 5.94, 61.502, 7.145]
- face 95: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [5.938, 22.944, 7.143, 6.928, 61.5, 8]
- face 96: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [6.928, 21.95, 7.111, 36.5, 22.944, 8]
- face 98: radius 1, axis [1.0, -0.0, 0.0], concave, bbox [-36.5, -60.944, 7.111, 36.5, -59.95, 8]
- face 99: radius 8, axis [1.0, -0.0, 0.0], convex, bbox [-36.501, -59.951, -0.001, 36.501, -47.707, 7.112]
- face 100: radius 12.5, axis [1.0, -0.0, 0.0], concave, bbox [-36.501, -47.708, 1.248, 36.501, -34.292, 3.202]
- face 101: radius 8, axis [1.0, -0.0, 0.0], convex, bbox [-36.501, -34.293, -0.001, 36.501, -25.707, 1.25]
- face 102: radius 12.5, axis [1.0, -0.0, 0.0], concave, bbox [-36.501, -25.708, 1.248, 36.501, -12.292, 3.202]
- face 103: radius 8, axis [1.0, -0.0, 0.0], convex, bbox [-36.501, -12.293, -0.001, 36.501, -3.707, 1.25]
- face 104: radius 12.5, axis [1.0, -0.0, 0.0], concave, bbox [-36.501, -3.708, 1.248, 36.501, 9.708, 3.202]
- face 105: radius 8, axis [1.0, -0.0, 0.0], convex, bbox [-36.502, 9.706, -0.002, 36.502, 21.952, 7.113]
- face 106: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [-36.5, 21.95, 7.111, -6.928, 22.944, 8]
- face 130: radius 5, axis [1.0, -0.0, 0.0], concave, bbox [27.5, -35, 3, 37.5, -25, 13]
- face 132: radius 5, axis [1.0, -0.0, 0.0], concave, bbox [27.5, 9, 3, 37.5, 19, 13]
- face 134: radius 5, axis [1.0, -0.0, 0.0], concave, bbox [27.5, -13, 3, 37.5, -3, 13]
- face 136: radius 5, axis [1.0, -0.0, 0.0], concave, bbox [27.5, -57, 3, 37.5, -47, 13]
- face 138: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [-37.5, -35, 3, -27.5, -25, 13]
- face 140: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [-37.5, -57, 3, -27.5, -47, 13]
- face 142: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [-37.5, -13, 3, -27.5, -3, 13]
- face 144: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [-37.5, 9, 3, -27.5, 19, 13]
- face 146: radius 3.5, axis [-1.0, 0.0, 0.0], concave, bbox [-27.5, -11.5, 4.5, 27.5, -4.5, 11.5]
- face 147: radius 3.5, axis [-1.0, 0.0, 0.0], concave, bbox [-27.5, -55.5, 4.5, 27.5, -48.5, 11.5]
- face 148: radius 3.5, axis [-1.0, 0.0, 0.0], concave, bbox [-27.5, -33.5, 4.5, 27.5, -26.5, 11.5]
- face 149: radius 3.5, axis [-1.0, 0.0, 0.0], concave, bbox [-27.5, 10.5, 4.5, 27.5, 17.5, 11.5]
- face 152: radius 2, axis [-1.0, 0.0, 0.0], concave, bbox [-23, 18, 14, 23, 20, 16]
- face 155: radius 2, axis [-1.0, 0.0, 0.0], concave, bbox [-23, -58, 14, 23, -56, 16]
- face 157: radius 2, axis [0.0, 1.0, -0.0], concave, bbox [23, -56, 14, 25, 18, 16]
- face 158: radius 2, axis [-0.0, -1.0, 0.0], concave, bbox [-25, -56, 14, -23, 18, 16]
- face 175: radius 2.75, axis [0.0, 1.0, 0.0], concave, bbox [22.25, 27.5, 13.25, 27.75, 62.5, 18.75]
- face 177: radius 2.75, axis [0.0, 1.0, 0.0], concave, bbox [-26.25, 35, 10.25, -20.75, 62.5, 15.75]

### Conical faces (chamfers, countersinks, drafts)

- face 174: area 28 mm2, bbox [22.246, 25.844, 13.246, 27.754, 27.504, 18.754] {'half_angle_deg': 59.0, 'center': [25.0, 26.6738]}
- face 176: area 28 mm2, bbox [-26.254, 33.344, 10.246, -20.746, 35.004, 15.754] {'half_angle_deg': 59.0, 'center': [-23.5, 34.1738]}
- face 188: area 6 mm2, bbox [28.769, 52.669, 15.998, 31.231, 55.131, 16.74] {'half_angle_deg': 59.0, 'center': [30.0, 53.9]}
- face 190: area 6 mm2, bbox [28.769, 41.669, 15.998, 31.231, 44.131, 16.74] {'half_angle_deg': 59.0, 'center': [30.0, 42.9]}
- face 192: area 6 mm2, bbox [28.769, 30.669, 15.998, 31.231, 33.131, 16.74] {'half_angle_deg': 59.0, 'center': [30.0, 31.9]}
- face 194: area 6 mm2, bbox [18.769, 33.869, 15.998, 21.231, 36.331, 16.74] {'half_angle_deg': 59.0, 'center': [20.0, 35.1]}
- face 196: area 6 mm2, bbox [18.769, 44.869, 15.998, 21.231, 47.331, 16.74] {'half_angle_deg': 59.0, 'center': [20.0, 46.1]}
- face 198: area 6 mm2, bbox [18.769, 55.869, 15.998, 21.231, 58.331, 16.74] {'half_angle_deg': 59.0, 'center': [20.0, 57.1]}

### Toroidal faces (fillets, round-over corners)

- face 8: area 3 mm2, bbox [31.5, 58.5, 7, 33.5, 60.5, 8] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 9: area 3 mm2, bbox [16.5, 58.5, 7, 18.5, 60.5, 8] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 10: area 3 mm2, bbox [31.5, 28.5, 7, 33.5, 30.5, 8] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 12: area 3 mm2, bbox [16.5, 28.5, 7, 18.5, 30.5, 8] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 26: area 39 mm2, bbox [-32.001, 34.499, 6.999, -14.999, 43.001, 8.001] {'minor_radius': 1.0, 'major_radius': 8.5}
- face 28: area 39 mm2, bbox [-32.001, 51.999, 6.999, -14.999, 60.501, 8.001] {'minor_radius': 1.0, 'major_radius': 8.5}
- face 32: area 3 mm2, bbox [-20.54, -70.9, 23, -18.55, -69, 24] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 33: area 3 mm2, bbox [18.55, -70.9, 23, 20.54, -69, 24] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 35: area 3 mm2, bbox [-37.5, -63.5, 22, -36.5, -61.5, 24] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 36: area 41 mm2, bbox [-37.501, -79.001, 22.999, -19.544, -69.999, 24.001] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 38: area 3 mm2, bbox [36.5, -63.5, 22, 37.5, -61.5, 24] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 40: area 41 mm2, bbox [19.544, -79.001, 22.999, 37.501, -69.999, 24.001] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 45: area 3 mm2, bbox [-37.5, -60.945, 7.111, -36.5, -58.956, 9] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 46: area 24 mm2, bbox [-37.501, -59.951, -0.001, -36.499, -47.707, 7.223] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 47: area 23 mm2, bbox [-37.501, -48.245, 1.248, -36.499, -33.755, 4.202] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 48: area 14 mm2, bbox [-37.501, -34.293, -0.001, -36.499, -25.707, 2.094] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 49: area 23 mm2, bbox [-37.501, -26.245, 1.248, -36.499, -11.755, 4.202] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 50: area 14 mm2, bbox [-37.501, -12.293, -0.001, -36.499, -3.707, 2.094] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 51: area 23 mm2, bbox [-37.501, -4.245, 1.248, -36.499, 10.245, 4.202] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 52: area 24 mm2, bbox [-37.501, 9.707, -0.001, -36.499, 21.951, 7.223] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 53: area 3 mm2, bbox [-37.5, 20.956, 7.111, -36.5, 22.945, 9] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 59: area 3 mm2, bbox [-20.54, 69, 23, -18.55, 70.9, 24] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 61: area 3 mm2, bbox [18.55, 69, 23, 20.54, 70.9, 24] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 62: area 3 mm2, bbox [-37.5, 61.5, 22, -36.5, 63.5, 24] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 64: area 41 mm2, bbox [-37.501, 69.999, 22.999, -19.544, 79.001, 24.001] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 65: area 3 mm2, bbox [36.5, 61.5, 22, 37.5, 63.5, 24] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 66: area 41 mm2, bbox [19.544, 69.999, 22.999, 37.501, 79.001, 24.001] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 74: area 3 mm2, bbox [36.5, 20.956, 7.111, 37.5, 22.945, 9] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 75: area 24 mm2, bbox [36.499, 9.707, -0.001, 37.501, 21.951, 7.223] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 76: area 23 mm2, bbox [36.499, -4.245, 1.248, 37.501, 10.245, 4.202] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 77: area 14 mm2, bbox [36.499, -12.293, -0.001, 37.501, -3.707, 2.094] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 78: area 23 mm2, bbox [36.499, -26.245, 1.248, 37.501, -11.755, 4.202] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 79: area 14 mm2, bbox [36.499, -34.293, -0.001, 37.501, -25.707, 2.094] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 80: area 23 mm2, bbox [36.499, -48.245, 1.248, 37.501, -33.755, 4.202] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 81: area 24 mm2, bbox [36.499, -59.951, -0.001, 37.501, -47.707, 7.223] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 82: area 3 mm2, bbox [36.5, -60.945, 7.111, 37.5, -58.956, 9] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 85: area 3 mm2, bbox [-6.928, 61.5, 7.143, -4.948, 62.5, 9] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 86: area 25 mm2, bbox [-5.939, 61.499, 2, 5.939, 62.501, 7.286] {'minor_radius': 1.0, 'major_radius': 5.0}
- face 87: area 3 mm2, bbox [4.948, 61.5, 7.143, 6.928, 62.5, 9] {'minor_radius': 1.0, 'major_radius': 2.0}

### Spherical faces

- face 42: area 2 mm2, bbox [-37.5, -62.5, 8, -36.5, -61.5, 9] {'radius': 1.0}
- face 55: area 2 mm2, bbox [36.5, -62.5, 8, 37.5, -61.5, 9] {'radius': 1.0}
- face 58: area 2 mm2, bbox [-37.5, 61.5, 8, -36.5, 62.5, 9] {'radius': 1.0}
- face 60: area 2 mm2, bbox [36.5, 61.5, 8, 37.5, 62.5, 9] {'radius': 1.0}
- face 150: area 6 mm2, bbox [-25.001, 17.999, 13.999, -22.999, 20.001, 16.001] {'radius': 2.0}
- face 151: area 6 mm2, bbox [22.999, 17.999, 13.999, 25.001, 20.001, 16.001] {'radius': 2.0}
- face 153: area 6 mm2, bbox [-25.001, -58.001, 13.999, -22.999, -55.999, 16.001] {'radius': 2.0}
- face 154: area 6 mm2, bbox [22.999, -58.001, 13.999, 25.001, -55.999, 16.001] {'radius': 2.0}
- face 181: area 1 mm2, bbox [5.938, 21.95, 7.11, 6.929, 22.945, 8.001] {'radius': 1.0}
- face 182: area 1 mm2, bbox [-6.929, 21.949, 7.11, -5.937, 22.945, 8.001] {'radius': 1.0}

### Free-form (B-spline) faces

- face 183: area 21 mm2, bbox [-6.932, 19.023, 1.773, 6.932, 22.949, 7.184] 

### Vertical flat walls: 36 faces

- face 21: normal (-1, 0), from (17.5,30.5) to (17.5,58.5), Z 4..7
- face 23: normal (0, 1), from (18.5,59.5) to (31.5,59.5), Z 4..7
- face 30: normal (-1, 0), from (-31,43) to (-31,52), Z -0..7
- face 107: normal (0, 1), from (-37.5,40) to (-34.5,40), Z 8..31
- face 108: normal (-1, 0), from (-37.5,-70) to (-37.5,40), Z 1..31
- face 111: normal (-0, -1), from (-36.5,-62.5) to (36.5,-62.5), Z 9..22
- face 113: normal (0, 1), from (-36.5,62.5) to (36.5,62.5), Z 3..22
- face 129: normal (0, 1), from (-18.55,70) to (18.55,70), Z 24..31
- face 131: normal (1, -0), from (27.5,-35) to (27.5,-25), Z 3..13
- face 133: normal (1, -0), from (27.5,9) to (27.5,19), Z 3..13
- face 135: normal (1, -0), from (27.5,-13) to (27.5,-3), Z 3..13
- face 137: normal (1, -0), from (27.5,-57) to (27.5,-47), Z 3..13
- face 139: normal (-1, 0), from (-27.5,-35) to (-27.5,-25), Z 3..13
- face 141: normal (-1, 0), from (-27.5,-57) to (-27.5,-47), Z 3..13
- face 143: normal (-1, 0), from (-27.5,-13) to (-27.5,-3), Z 3..13
- face 145: normal (-1, 0), from (-27.5,9) to (-27.5,19), Z 3..13
- face 162: normal (0, 1), from (-23,-58) to (23,-58), Z 16..31
- face 163: normal (1, -0), from (-25,-56) to (-25,18), Z 16..31
- face 165: normal (-1, 0), from (25,-56) to (25,18), Z 16..31
- face 166: normal (-0, -1), from (-23,20) to (23,20), Z 16..31
- face 167: normal (0, 1), from (-36.5,50) to (-34.5,50), Z 8..31
- face 168: normal (-0, -1), from (-37.5,55) to (-34.5,55), Z 8..31
- face 169: normal (-1, 0), from (-34.5,50) to (-34.5,55), Z 8..31
- face 170: normal (-0, -1), from (-36.5,45) to (-34.5,45), Z 8..31
- face 171: normal (-1, 0), from (-34.5,40) to (-34.5,45), Z 8..31
- face 173: normal (-1, 0), from (-36.5,45) to (-36.5,50), Z 8..31
- face 186: normal (0, 1), from (17.5,48.5) to (32.5,48.5), Z 4..5.5
- face 187: normal (0, 1), from (17.5,37.5) to (32.5,37.5), Z 4..5.5
- face 203: normal (-0, -1), from (17.5,51.5) to (32.5,51.5), Z 4..5.5
- face 204: normal (1, -0), from (32.5,30.5) to (32.5,58.5), Z 4..7
- face 205: normal (-0, -1), from (18.5,29.5) to (31.5,29.5), Z 4..7
- face 206: normal (-0, -1), from (17.5,40.5) to (32.5,40.5), Z 4..5.5
- face 209: normal (1, -0), from (-16,43) to (-16,52), Z -0..7
- face 211: normal (-1, 0), from (-37.5,55) to (-37.5,70), Z 9..31
- face 212: normal (-0, -1), from (-18.55,-70) to (18.55,-70), Z 24..31
- face 213: normal (1, -0), from (37.5,-70) to (37.5,70), Z 1..31
