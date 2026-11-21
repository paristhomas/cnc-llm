# Job brief (3+2 indexed 5-axis): ftc10

NIST FTC-10 (ASME Y14.5 test case), native scale, AL6061

- Material **AL6061-T6**, tolerance **+-0.1 mm** on every scored surface.
- **Fixture frame (G54):** part bottom (the face towards the vise stub, machined in the part-off) at **Z0**, part centred in XY. Part bbox X [-15.50, 15.50]
  Y [-37.50, 37.50] Z [0.00, 158.00].
- **Orientation chosen:** model axis `+X` points up, then rotated 90 deg about Z, scale 1.0.
- **Stock:** box X [-18.50, 18.50] Y [-40.50, 40.50] Z [-36.00, 159.50]: part + 3 mm sides,
  + 1.5 mm top, plus a **stub** below Z0: 24 mm clearance gap (Z -24..0) and 12 mm
  gripped in the vise (Z -36..-24).
- **Vise:** jaws clamp the stub on its -Y and +Y faces (jaws 15 mm thick, top at Z-24, extending 10 mm beyond the
  stock in X); vise body below; table below that. Boxes are in `setup.json` ("vise"). Tool and holder must never
  touch them, in any orientation.
- **Machine:** trunnion 5-axis (A tilt <= 110 deg, C unlimited), 3+2 only (no simultaneous 5-axis).
- **Every face is scored, including the underside (the face towards the stub).** Only the 0.03 mm face-edge band and
  the tab witness are not scored. Reach hint: the harness's quick search (smallest tools, 26 cube directions + feature
  axes, holder-aware) found a tool and direction for 100.0% of the surface; for 0.0% it found
  none (`reach_hint.png`). That is a hint, not an excuse: those areas count, so plan them.

## Files
`part.step`, `part.stl` (fixture frame, mm), `faces.json`, `setup.json` (stock, vise boxes, fixture), images
(`target_iso.png`, `reach_hint.png`).

## Tool directions that reach the surface (greedy cover found by the harness's quick search - a hint, not a plan)
| tool axis (G54) | tilt A deg | share of surface first reached |
|---|---|---|
| (-0.707, -0.707, +0.000) | 90.0 | 39.1% |
| (-0.577, -0.577, +0.577) | 54.7 | 1.2% |
| (-1.000, +0.000, +0.000) | 90.0 | 12.0% |
| (-0.707, +0.000, +0.707) | 45.0 | 0.1% |
| (-0.707, +0.707, +0.000) | 90.0 | 0.9% |
| (-0.577, +0.577, +0.577) | 54.7 | 0.2% |
| (+0.000, -1.000, +0.000) | 90.0 | 20.0% |
| (+0.000, -0.707, +0.707) | 45.0 | 1.1% |
| (+0.000, +0.000, +1.000) | 0.0 | 2.5% |
| (+0.000, +1.000, +0.000) | 90.0 | 6.4% |
| (+0.707, -0.707, +0.000) | 90.0 | 10.5% |
| (+0.577, -0.577, +0.577) | 54.7 | 0.0% |
| (+1.000, +0.000, +0.000) | 90.0 | 6.1% |

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
- **Part-off (machine does the parting; the operator only snaps small tabs):** the program ends with a `(PART-OFF)`
  section that machines the underside (the face towards the stub) to size like any other face and cuts the stub gap
  down to small tabs. Validity rules, checked on the final material:
  - tabs total between 2 and 30 mm2 at the weakest plane of the stub gap (and <= 15 % of the stub section);
  - at most 4 tabs, each <= 3.0 mm across in its smallest direction (snap / cut by hand, no saw);
  - tab witness <= 1.5 % of the surface (target 0.5 %): the part surface within 1.0 mm of where proud material
    connected to the tabs touches the part. An unfinished underside connected to the tabs counts as tab joint, so it
    blows this limit.
  Review target (not a validity rule): 2-4 tabs, 20-30 mm2 in total.
- Cutting data checks as in 3-axis (chip load, cut cross-section, plunges).
- **Score: share of the WHOLE part surface within +-0.1 mm**, two-sided (proud and gouge both fail). The only areas
  not scored are the 0.03 mm face-edge band (metrology artefact, < 1 %) and the tab witness (only when the part-off
  is valid). The underside, undercuts and areas no tool reaches easily are all scored: surface the program did not
  finish is failed surface. The harness's reach search is a hint only (see `reach_hint.png`).

## Tool library
| T | Tool | Kind | D (mm) | Flutes | Flute len | Neck: reach / shank D | Stick-out | Holder D | Chipload (mm/t) | Max rpm | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | flat | 10 | 3 | 25 | - | 40 | 32 | 0.06 | 18000 |  |
| T2 | 6 mm 3-flute flat endmill | flat | 6 | 3 | 18 | - | 30 | 32 | 0.04 | 24000 |  |
| T3 | 3 mm 2-flute flat endmill | flat | 3 | 2 | 10 | - | 22 | 32 | 0.02 | 24000 |  |
| T4 | 1.5 mm 2-flute flat endmill | flat | 1.5 | 2 | 5 | - | 14 | 20 | 0.01 | 24000 |  |
| T5 | 8 mm bull-nose endmill r1 | bull | 8 | 3 | 20 | - | 35 | 32 | 0.05 | 24000 | corner r1.0 |
| T6 | 6 mm ball endmill | ball | 6 | 2 | 14 | - | 32 | 32 | 0.03 | 24000 |  |
| T7 | 3 mm ball endmill | ball | 3 | 2 | 8 | - | 22 | 32 | 0.02 | 24000 |  |
| T8 | 1 mm ball endmill | ball | 1 | 2 | 3 | - | 12 | 20 | 0.008 | 24000 |  |
| T9 | 6 mm 90deg chamfer mill | cone | 6 | 2 | 3 | - | 25 | 32 | 0.02 | 24000 | cuts 45deg chamfers; tip flat 0.2 mm |
| T10 | 5 mm drill 118deg | cone | 5 | 2 | 30 | - | 40 | 32 | 0.06 | 8000 | drilling only (vertical moves / G81 / G83); no side milling |
| T11 | 4 mm 2-flute long-neck flat endmill, neck 40 mm | flat | 4 | 2 | 6 | 40 / 6 | 55 | 22 | 0.012 | 24000 | neck dia 3.8 to 40 mm, 6 mm shank, slim shrink-fit holder; finishing / light cuts only |
| T12 | 6 mm 3-flute long-reach flat endmill, reach 50 mm | flat | 6 | 3 | 12 | 50 / 6 | 60 | 22 | 0.02 | 24000 | neck dia 5.7 to 50 mm, 6 mm shank, slim shrink-fit holder |
| T13 | 2 mm ball long-neck endmill, neck 20 mm | ball | 2 | 2 | 2 | 20 / 4 | 35 | 16 | 0.006 | 24000 | R1 ball, neck dia 1.9 to 20 mm, 4 mm shank, slim shrink-fit holder |
| T14 | 3 mm ball long-neck endmill, neck 30 mm | ball | 3 | 2 | 3 | 30 / 6 | 50 | 22 | 0.01 | 24000 | R1.5 ball, neck dia 2.85 to 30 mm, 6 mm shank, slim shrink-fit holder |

Tool body: cutting profile up to the flute length, then the shank (same diameter) up to the stick-out, then the holder
cylinder of the holder diameter from the stick-out upwards (checked for 50 mm). Necked long-reach tools: a neck no
wider than the cutter up to the neck length (the reach), then a wider shank up to the stick-out; material contact
above the neck length is a crash. Against the vise and table the body is checked exactly (discs along the tool axis)
with a 1.0 mm safety clearance. All endmills are centre-cutting; T9 is not.

## Geometry digest (fixture frame)
### Upward-facing flat faces (floors / tops) by Z

| Z | faces | total area mm2 | XY extent of each face |
|---|---|---|---|
| 149 | 1 | 260 | [8.5,-18.55]-[15.5,18.55] |
| 141.5 | 1 | 952 | [-12.5,-36.5]-[6.5,36.5] |
| 138.5 | 1 | 39 | [-11.5,18.5]-[-8.5,31.5] |
| 129 | 1 | 46 | [-7.5,-36.5]-[15.5,-34.5] |
| 127.5 | 1 | 22 | [-11.5,17.5]-[-10,32.5] |
| 119 | 1 | 69 | [-7.5,-37.5]-[15.5,-34.5] |
| 116.5 | 1 | 22 | [-11.5,17.5]-[-10,32.5] |
| 21 | 1 | 690 | [0.5,-23]-[15.5,23] |

### Downward-facing flat faces above Z0 (overhangs: not machinable from +Z)

- face 111: z 16.5, extent [-6.5,-36.5]-[6.5,36.5]
- face 166: z 99, extent [0.5,-23]-[15.5,23]
- face 168: z 134, extent [-7.5,-37.5]-[15.5,-34.5]
- face 170: z 124, extent [-7.5,-36.5]-[15.5,-34.5]
- face 203: z 130.5, extent [-11.5,17.5]-[-10,32.5]
- face 205: z 108.5, extent [-11.5,18.5]-[-8.5,31.5]
- face 206: z 119.5, extent [-11.5,17.5]-[-10,32.5]
- face 212: z 9, extent [8.5,-18.55]-[15.5,18.55]

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 25 | hole/concave | (-8.5, -32) | 1 | 122..131 | partial arc (corner/slot end) |
| 27 | hole/concave | (-8.5, -15) | 1 | 122..131 | partial arc (corner/slot end) |
| 93 | hole/concave | (-8.5, -6.9282) | 1 | 101.944..140.5 | partial arc (corner/slot end) |
| 95 | hole/concave | (-8.5, 6.9282) | 1 | 101.944..140.5 | partial arc (corner/slot end) |
| 13 | hole/concave | (-8.5, 16.5) | 1 | 109.5..137.5 | partial arc (corner/slot end) |
| 11 | hole/concave | (-8.5, 33.5) | 1 | 109.5..137.5 | partial arc (corner/slot end) |
| 94 | boss/convex | (-7.5, -0) | 6 | 98.654..140.502 | partial arc (corner/slot end) |
| 90 | boss/convex | (-6.5, -36.5) | 1 | 134..140.5 | partial arc (corner/slot end) |
| 54 | boss/convex | (-6.5, -36.5) | 1 | 101.944..119 | partial arc (corner/slot end) |
| 44 | boss/convex | (-6.5, -36.5) | 1 | 17.5..18.056 | partial arc (corner/slot end) |
| 73 | boss/convex | (-6.5, 36.5) | 1 | 101.944..140.5 | partial arc (corner/slot end) |
| 83 | boss/convex | (-6.5, 36.5) | 1 | 17.5..18.056 | partial arc (corner/slot end) |
| 177 | hole/concave | (-2.5, -23.5) | 2.75 | 114..141.5 | full/near-full |
| 158 | hole/concave | (0.5, -23) | 2 | 23..97 | partial arc (corner/slot end) |
| 157 | hole/concave | (0.5, 23) | 2 | 23..97 | partial arc (corner/slot end) |
| 175 | hole/concave | (0.5, 25) | 2.75 | 106.5..141.5 | full/near-full |
| 63 | boss/convex | (8.5, -36.5) | 1 | 142.5..149 | partial arc (corner/slot end) |
| 37 | boss/convex | (8.5, -36.5) | 1 | 9..15.5 | partial arc (corner/slot end) |
| 67 | boss/convex | (8.5, 36.5) | 1 | 142.5..149 | partial arc (corner/slot end) |
| 39 | boss/convex | (8.5, 36.5) | 1 | 9..15.5 | partial arc (corner/slot end) |

### Non-vertical cylindrical faces (round-overs, fillets, crowns)

- face 0: radius 1.25, axis [1.0, -0.0, 0.0], concave, bbox [-4.231, -16.75, 69.75, -1.5, -14.25, 72.25]
- face 1: radius 1.25, axis [1.0, -0.0, 0.0], concave, bbox [-4.231, -16.75, 25.75, -1.5, -14.25, 28.25]
- face 2: radius 1.25, axis [1.0, -0.0, 0.0], concave, bbox [-4.231, 14.25, 69.75, -1.5, 16.75, 72.25]
- face 3: radius 1.25, axis [1.0, -0.0, 0.0], concave, bbox [-4.231, 14.25, 25.75, -1.5, 16.75, 28.25]
- face 4: radius 1.25, axis [1.0, -0.0, 0.0], concave, bbox [-4.231, 14.25, 47.75, -1.5, 16.75, 50.25]
- face 5: radius 1.25, axis [1.0, -0.0, 0.0], concave, bbox [-4.231, 14.25, 91.75, -1.5, 16.75, 94.25]
- face 6: radius 1.25, axis [1.0, -0.0, 0.0], concave, bbox [-4.231, -16.75, 47.75, -1.5, -14.25, 50.25]
- face 7: radius 1.25, axis [1.0, -0.0, 0.0], concave, bbox [-4.231, -16.75, 91.75, -1.5, -14.25, 94.25]
- face 14: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-11.5, 17.5, 108.5, -8.5, 18.5, 109.5]
- face 15: radius 1, axis [0.0, 1.0, -0.0], concave, bbox [-8.5, 18.5, 107.5, -7.5, 31.5, 108.5]
- face 16: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-11.5, 31.5, 108.5, -8.5, 32.5, 109.5]
- face 17: radius 1, axis [-0.0, -1.0, 0.0], concave, bbox [-8.5, 18.5, 138.5, -7.5, 31.5, 139.5]
- face 18: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-11.5, 17.5, 137.5, -8.5, 18.5, 138.5]
- face 19: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-11.5, 31.5, 137.5, -8.5, 32.5, 138.5]
- face 29: radius 7.5, axis [-1.0, 0.0, 0.0], convex, bbox [-15.501, -31.001, 114.499, -8.499, -15.999, 122.001]
- face 34: radius 1, axis [-0.0, -1.0, 0.0], convex, bbox [7.5, -18.55, 9, 8.5, 18.55, 10]
- face 41: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [6.5, -36.5, 15.5, 7.5, 36.5, 16.5]
- face 43: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-6.5, -37.5, 16.5, 6.5, -36.5, 17.5]
- face 56: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-6.5, 36.5, 16.5, 6.5, 37.5, 17.5]
- face 57: radius 1, axis [-0.0, -1.0, 0.0], convex, bbox [-7.5, -36.5, 16.5, -6.5, 36.5, 17.5]
- face 68: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-6.5, 36.5, 140.5, 6.5, 37.5, 141.5]
- face 69: radius 1, axis [-0.0, -1.0, 0.0], concave, bbox [6.5, -36.5, 141.5, 7.5, 36.5, 142.5]
- face 70: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [-6.5, -37.5, 140.5, 6.5, -36.5, 141.5]
- face 71: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [7.5, -18.55, 148, 8.5, 18.55, 149]
- face 72: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [8.5, 18.55, 149, 15.5, 19.545, 149.9]
- face 84: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-7.5, -36.5, 140.5, -6.5, -6.928, 141.5]
- face 88: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-7.5, 6.928, 140.5, -6.5, 36.5, 141.5]
- face 89: radius 1, axis [1.0, -0.0, 0.0], concave, bbox [8.5, -19.545, 149, 15.5, -18.55, 149.9]
- face 91: radius 1, axis [1.0, -0.0, 0.0], concave, bbox [8.5, 18.55, 8.1, 15.5, 19.545, 9]
- face 92: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [8.5, -19.545, 8.1, 15.5, -18.55, 9]
- face 96: radius 1, axis [-0.0, -1.0, 0.0], concave, bbox [-8.389, 6.928, 100.95, -7.5, 36.5, 101.944]
- face 98: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [-8.389, -36.5, 18.056, -7.5, 36.5, 19.05]
- face 99: radius 8, axis [0.0, 1.0, 0.0], convex, bbox [-15.501, -36.501, 19.049, -8.388, 36.501, 31.293]
- face 100: radius 12.5, axis [0.0, 1.0, 0.0], concave, bbox [-14.252, -36.501, 31.292, -12.298, 36.501, 44.708]
- face 101: radius 8, axis [0.0, 1.0, 0.0], convex, bbox [-15.501, -36.501, 44.707, -14.25, 36.501, 53.293]
- face 102: radius 12.5, axis [0.0, 1.0, 0.0], concave, bbox [-14.252, -36.501, 53.292, -12.298, 36.501, 66.708]
- face 103: radius 8, axis [0.0, 1.0, 0.0], convex, bbox [-15.501, -36.501, 66.707, -14.25, 36.501, 75.293]
- face 104: radius 12.5, axis [0.0, 1.0, 0.0], concave, bbox [-14.252, -36.501, 75.292, -12.298, 36.501, 88.708]
- face 105: radius 8, axis [0.0, 1.0, 0.0], convex, bbox [-15.502, -36.502, 88.706, -8.387, 36.502, 100.952]
- face 106: radius 1, axis [-0.0, -1.0, 0.0], concave, bbox [-8.389, -36.5, 100.95, -7.5, -6.928, 101.944]
- face 109: radius 9, axis [1.0, -0.0, 0.0], convex, bbox [8.499, -37.501, -0.001, 15.501, -19.544, 9.001]
- face 115: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [7.5, 23.5, 4, 9.5, 33.5, 14]
- face 116: radius 3, axis [-1.0, 0.0, 0.0], concave, bbox [9.5, 25.5, 6, 15.5, 31.5, 12]
- face 118: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [7.5, -33.5, 144, 9.5, -23.5, 154]
- face 119: radius 3, axis [-1.0, 0.0, 0.0], concave, bbox [9.5, -31.5, 146, 15.5, -25.5, 152]
- face 121: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [7.5, 23.5, 144, 9.5, 33.5, 154]
- face 122: radius 3, axis [-1.0, 0.0, 0.0], concave, bbox [9.5, 25.5, 146, 15.5, 31.5, 152]
- face 124: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [7.5, -33.5, 4, 9.5, -23.5, 14]
- face 125: radius 3, axis [-1.0, 0.0, 0.0], concave, bbox [9.5, -31.5, 6, 15.5, -25.5, 12]
- face 126: radius 9, axis [1.0, -0.0, 0.0], convex, bbox [8.499, 19.544, 148.999, 15.501, 37.501, 158.001]
- face 127: radius 9, axis [1.0, -0.0, 0.0], convex, bbox [8.499, -37.501, 148.999, 15.501, -19.544, 158.001]
- face 128: radius 9, axis [1.0, -0.0, 0.0], convex, bbox [8.499, 19.544, -0.001, 15.501, 37.501, 9.001]
- face 130: radius 5, axis [0.0, 1.0, 0.0], concave, bbox [-12.5, 27.5, 44, -2.5, 37.5, 54]
- face 132: radius 5, axis [0.0, 1.0, 0.0], concave, bbox [-12.5, 27.5, 88, -2.5, 37.5, 98]
- face 134: radius 5, axis [0.0, 1.0, 0.0], concave, bbox [-12.5, 27.5, 66, -2.5, 37.5, 76]
- face 136: radius 5, axis [0.0, 1.0, 0.0], concave, bbox [-12.5, 27.5, 22, -2.5, 37.5, 32]
- face 138: radius 5, axis [-0.0, -1.0, 0.0], concave, bbox [-12.5, -37.5, 44, -2.5, -27.5, 54]
- face 140: radius 5, axis [-0.0, -1.0, 0.0], concave, bbox [-12.5, -37.5, 22, -2.5, -27.5, 32]
- face 142: radius 5, axis [-0.0, -1.0, 0.0], concave, bbox [-12.5, -37.5, 66, -2.5, -27.5, 76]
- face 144: radius 5, axis [-0.0, -1.0, 0.0], concave, bbox [-12.5, -37.5, 88, -2.5, -27.5, 98]
- face 146: radius 3.5, axis [-0.0, -1.0, 0.0], concave, bbox [-11, -27.5, 67.5, -4, 27.5, 74.5]
- face 147: radius 3.5, axis [-0.0, -1.0, 0.0], concave, bbox [-11, -27.5, 23.5, -4, 27.5, 30.5]
- face 148: radius 3.5, axis [-0.0, -1.0, 0.0], concave, bbox [-11, -27.5, 45.5, -4, 27.5, 52.5]
- face 149: radius 3.5, axis [-0.0, -1.0, 0.0], concave, bbox [-11, -27.5, 89.5, -4, 27.5, 96.5]
- face 152: radius 2, axis [-0.0, -1.0, 0.0], concave, bbox [-1.5, -23, 97, 0.5, 23, 99]
- face 155: radius 2, axis [-0.0, -1.0, 0.0], concave, bbox [-1.5, -23, 21, 0.5, 23, 23]
- face 156: radius 2, axis [-1.0, 0.0, -0.0], concave, bbox [0.5, 23, 21, 15.5, 25, 23]
- face 159: radius 2, axis [1.0, -0.0, 0.0], concave, bbox [0.5, -25, 21, 15.5, -23, 23]
- face 160: radius 2, axis [1.0, -0.0, 0.0], concave, bbox [0.5, 23, 97, 15.5, 25, 99]
- face 161: radius 2, axis [-1.0, 0.0, -0.0], concave, bbox [0.5, -25, 97, 15.5, -23, 99]
- face 178: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-15.5, -25.25, 124.75, -4.621, -21.75, 128.25]
- face 179: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-15.5, -25.25, 117.75, -4.621, -21.75, 121.25]
- face 180: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-15.5, -25.25, 131.75, -4.621, -21.75, 135.25]
- face 189: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 28.77, 131.67, 0.5, 31.23, 134.13]
- face 191: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 28.77, 120.67, 0.5, 31.23, 123.13]
- face 193: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 28.77, 109.67, 0.5, 31.23, 112.13]
- face 195: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 18.77, 112.87, 0.5, 21.23, 115.33]
- face 197: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 18.77, 123.87, 0.5, 21.23, 126.33]
- face 199: radius 1.2295, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 18.77, 134.87, 0.5, 21.23, 137.33]
- face 200: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 23.25, 121.75, -1.621, 26.75, 125.25]
- face 201: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 23.25, 110.75, -1.621, 26.75, 114.25]
- face 202: radius 1.75, axis [-1.0, 0.0, 0.0], concave, bbox [-11.5, 23.25, 132.75, -1.621, 26.75, 136.25]
- face 208: radius 7.5, axis [-1.0, 0.0, 0.0], convex, bbox [-15.501, -31.001, 130.999, -8.499, -15.999, 138.501]

### Conical faces (chamfers, countersinks, drafts)

- face 174: area 28 mm2, bbox [-2.254, 22.246, 104.844, 3.254, 27.754, 106.504] {'half_angle_deg': 59.0, 'center': [0.5, 25.0]}
- face 176: area 28 mm2, bbox [-5.254, -26.254, 112.344, 0.254, -20.746, 114.004] {'half_angle_deg': 59.0, 'center': [-2.5, -23.5]}
- face 188: area 6 mm2, bbox [0.498, 28.769, 131.669, 1.24, 31.231, 134.131] {'half_angle_deg': 59.0, 'center': [0.8694, 30.0]}
- face 190: area 6 mm2, bbox [0.498, 28.769, 120.669, 1.24, 31.231, 123.131] {'half_angle_deg': 59.0, 'center': [0.8694, 30.0]}
- face 192: area 6 mm2, bbox [0.498, 28.769, 109.669, 1.24, 31.231, 112.131] {'half_angle_deg': 59.0, 'center': [0.8694, 30.0]}
- face 194: area 6 mm2, bbox [0.498, 18.769, 112.869, 1.24, 21.231, 115.331] {'half_angle_deg': 59.0, 'center': [0.8694, 20.0]}
- face 196: area 6 mm2, bbox [0.498, 18.769, 123.869, 1.24, 21.231, 126.331] {'half_angle_deg': 59.0, 'center': [0.8694, 20.0]}
- face 198: area 6 mm2, bbox [0.498, 18.769, 134.869, 1.24, 21.231, 137.331] {'half_angle_deg': 59.0, 'center': [0.8694, 20.0]}

### Toroidal faces (fillets, round-over corners)

- face 8: area 3 mm2, bbox [-8.5, 31.5, 137.5, -7.5, 33.5, 139.5] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 9: area 3 mm2, bbox [-8.5, 16.5, 137.5, -7.5, 18.5, 139.5] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 10: area 3 mm2, bbox [-8.5, 31.5, 107.5, -7.5, 33.5, 109.5] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 12: area 3 mm2, bbox [-8.5, 16.5, 107.5, -7.5, 18.5, 109.5] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 26: area 39 mm2, bbox [-8.501, -32.001, 113.499, -7.499, -14.999, 122.001] {'minor_radius': 1.0, 'major_radius': 8.5}
- face 28: area 39 mm2, bbox [-8.501, -32.001, 130.999, -7.499, -14.999, 139.501] {'minor_radius': 1.0, 'major_radius': 8.5}
- face 32: area 3 mm2, bbox [7.5, -20.54, 8.1, 8.5, -18.55, 10] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 33: area 3 mm2, bbox [7.5, 18.55, 8.1, 8.5, 20.54, 10] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 35: area 3 mm2, bbox [6.5, -37.5, 15.5, 8.5, -36.5, 17.5] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 36: area 41 mm2, bbox [7.499, -37.501, -0.001, 8.501, -19.544, 9.001] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 38: area 3 mm2, bbox [6.5, 36.5, 15.5, 8.5, 37.5, 17.5] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 40: area 41 mm2, bbox [7.499, 19.544, -0.001, 8.501, 37.501, 9.001] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 45: area 3 mm2, bbox [-8.389, -37.5, 18.055, -6.5, -36.5, 20.044] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 46: area 24 mm2, bbox [-15.501, -37.501, 19.049, -8.277, -36.499, 31.293] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 47: area 23 mm2, bbox [-14.252, -37.501, 30.755, -11.298, -36.499, 45.245] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 48: area 14 mm2, bbox [-15.501, -37.501, 44.707, -13.406, -36.499, 53.293] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 49: area 23 mm2, bbox [-14.252, -37.501, 52.755, -11.298, -36.499, 67.245] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 50: area 14 mm2, bbox [-15.501, -37.501, 66.707, -13.406, -36.499, 75.293] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 51: area 23 mm2, bbox [-14.252, -37.501, 74.755, -11.298, -36.499, 89.245] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 52: area 24 mm2, bbox [-15.501, -37.501, 88.707, -8.277, -36.499, 100.951] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 53: area 3 mm2, bbox [-8.389, -37.5, 99.956, -6.5, -36.5, 101.945] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 59: area 3 mm2, bbox [7.5, -20.54, 148, 8.5, -18.55, 149.9] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 61: area 3 mm2, bbox [7.5, 18.55, 148, 8.5, 20.54, 149.9] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 62: area 3 mm2, bbox [6.5, -37.5, 140.5, 8.5, -36.5, 142.5] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 64: area 41 mm2, bbox [7.499, -37.501, 148.999, 8.501, -19.544, 158.001] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 65: area 3 mm2, bbox [6.5, 36.5, 140.5, 8.5, 37.5, 142.5] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 66: area 41 mm2, bbox [7.499, 19.544, 148.999, 8.501, 37.501, 158.001] {'minor_radius': 1.0, 'major_radius': 8.0}
- face 74: area 3 mm2, bbox [-8.389, 36.5, 99.956, -6.5, 37.5, 101.945] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 75: area 24 mm2, bbox [-15.501, 36.499, 88.707, -8.277, 37.501, 100.951] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 76: area 23 mm2, bbox [-14.252, 36.499, 74.755, -11.298, 37.501, 89.245] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 77: area 14 mm2, bbox [-15.501, 36.499, 66.707, -13.406, 37.501, 75.293] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 78: area 23 mm2, bbox [-14.252, 36.499, 52.755, -11.298, 37.501, 67.245] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 79: area 14 mm2, bbox [-15.501, 36.499, 44.707, -13.406, 37.501, 53.293] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 80: area 23 mm2, bbox [-14.252, 36.499, 30.755, -11.298, 37.501, 45.245] {'minor_radius': 1.0, 'major_radius': 13.5}
- face 81: area 24 mm2, bbox [-15.501, 36.499, 19.049, -8.277, 37.501, 31.293] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 82: area 3 mm2, bbox [-8.389, 36.5, 18.055, -6.5, 37.5, 20.044] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 85: area 3 mm2, bbox [-8.357, -6.928, 140.5, -6.5, -4.948, 141.5] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 86: area 25 mm2, bbox [-13.5, -5.939, 140.499, -8.214, 5.939, 141.501] {'minor_radius': 1.0, 'major_radius': 5.0}
- face 87: area 3 mm2, bbox [-8.357, 4.948, 140.5, -6.5, 6.928, 141.5] {'minor_radius': 1.0, 'major_radius': 2.0}

### Spherical faces

- face 42: area 2 mm2, bbox [-7.5, -37.5, 16.5, -6.5, -36.5, 17.5] {'radius': 1.0}
- face 55: area 2 mm2, bbox [-7.5, 36.5, 16.5, -6.5, 37.5, 17.5] {'radius': 1.0}
- face 58: area 2 mm2, bbox [-7.5, -37.5, 140.5, -6.5, -36.5, 141.5] {'radius': 1.0}
- face 60: area 2 mm2, bbox [-7.5, 36.5, 140.5, -6.5, 37.5, 141.5] {'radius': 1.0}
- face 150: area 6 mm2, bbox [-1.501, -25.001, 96.999, 0.501, -22.999, 99.001] {'radius': 2.0}
- face 151: area 6 mm2, bbox [-1.501, 22.999, 96.999, 0.501, 25.001, 99.001] {'radius': 2.0}
- face 153: area 6 mm2, bbox [-1.501, -25.001, 20.999, 0.501, -22.999, 23.001] {'radius': 2.0}
- face 154: area 6 mm2, bbox [-1.501, 22.999, 20.999, 0.501, 25.001, 23.001] {'radius': 2.0}
- face 181: area 1 mm2, bbox [-8.39, 5.938, 100.95, -7.499, 6.929, 101.945] {'radius': 1.0}
- face 182: area 1 mm2, bbox [-8.39, -6.929, 100.949, -7.499, -5.937, 101.945] {'radius': 1.0}

### Free-form (B-spline) faces

- face 183: area 21 mm2, bbox [-13.727, -6.932, 98.023, -8.316, 6.932, 101.948] 

### Vertical flat walls: 37 faces

- face 20: normal (-1, 0), bbox X -11.5..-11.5, Y 17.5..32.5, Z 108.5..116.5
- face 21: normal (-0, -1), bbox X -11.5..-8.5, Y 17.5..17.5, Z 109.5..137.5
- face 22: normal (-1, 0), bbox X -11.5..-11.5, Y 17.5..32.5, Z 130.5..138.5
- face 24: normal (-1, 0), bbox X -7.5..-7.5, Y 6.928..36.5, Z 101.944..140.5
- face 30: normal (-0, -1), bbox X -15.5..-8.5, Y -31..-31, Z 122..131
- face 31: normal (-1, 0), bbox X -7.5..-7.5, Y -36.5..-6.928, Z 101.944..140.5
- face 97: normal (-1, 0), bbox X -7.5..-7.5, Y -36.5..36.5, Z 17.5..18.056
- face 108: normal (-0, -1), bbox X -14.5..15.5, Y -37.5..-37.5, Z 9..119
- face 110: normal (-1, 0), bbox X 7.5..7.5, Y -36.5..36.5, Z 1..15.5
- face 112: normal (-1, 0), bbox X 7.5..7.5, Y -36.5..36.5, Z 142.5..157
- face 114: normal (-1, 0), bbox X 9.5..9.5, Y 23.5..33.5, Z 4..14
- face 117: normal (-1, 0), bbox X 9.5..9.5, Y -33.5..-23.5, Z 144..154
- face 120: normal (-1, 0), bbox X 9.5..9.5, Y 23.5..33.5, Z 144..154
- face 123: normal (-1, 0), bbox X 9.5..9.5, Y -33.5..-23.5, Z 4..14
- face 131: normal (0, 1), bbox X -12.5..-2.5, Y 27.5..27.5, Z 44..54
- face 133: normal (0, 1), bbox X -12.5..-2.5, Y 27.5..27.5, Z 88..98
- face 135: normal (0, 1), bbox X -12.5..-2.5, Y 27.5..27.5, Z 66..76
- face 137: normal (0, 1), bbox X -12.5..-2.5, Y 27.5..27.5, Z 22..32
- face 139: normal (-0, -1), bbox X -12.5..-2.5, Y -27.5..-27.5, Z 44..54
- face 141: normal (-0, -1), bbox X -12.5..-2.5, Y -27.5..-27.5, Z 22..32
- face 143: normal (-0, -1), bbox X -12.5..-2.5, Y -27.5..-27.5, Z 66..76
- face 145: normal (-0, -1), bbox X -12.5..-2.5, Y -27.5..-27.5, Z 88..98
- face 163: normal (0, 1), bbox X 0.5..15.5, Y -25..-25, Z 23..97
- face 164: normal (1, -0), bbox X -1.5..-1.5, Y -23..23, Z 23..97
- face 165: normal (-0, -1), bbox X 0.5..15.5, Y 25..25, Z 23..97
- face 169: normal (-0, -1), bbox X -7.5..15.5, Y -34.5..-34.5, Z 129..134
- face 171: normal (-0, -1), bbox X -7.5..15.5, Y -34.5..-34.5, Z 119..124
- face 172: normal (1, -0), bbox X 15.5..15.5, Y -37.5..37.5, Z 0..158
- face 173: normal (-0, -1), bbox X -7.5..15.5, Y -36.5..-36.5, Z 124..129
- face 184: normal (-1, 0), bbox X -10..-10, Y 17.5..32.5, Z 127.5..130.5
- face 185: normal (-1, 0), bbox X -10..-10, Y 17.5..32.5, Z 116.5..119.5
- face 204: normal (0, 1), bbox X -11.5..-8.5, Y 32.5..32.5, Z 109.5..137.5
- face 207: normal (-1, 0), bbox X -11.5..-11.5, Y 17.5..32.5, Z 119.5..127.5
- face 209: normal (0, 1), bbox X -15.5..-8.5, Y -16..-16, Z 122..131
- face 210: normal (-1, 0), bbox X -15.5..-15.5, Y -31..-16, Z 114.5..138.5
- face 211: normal (-0, -1), bbox X -6.5..15.5, Y -37.5..-37.5, Z 134..149
- face 213: normal (0, 1), bbox X -14.5..15.5, Y 37.5..37.5, Z 9..149
