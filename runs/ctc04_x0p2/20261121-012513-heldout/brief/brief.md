# Job brief (3+2 indexed 5-axis): ctc04_x0p2

NIST CTC-04 (ASME test case) at scale 0.2, AL6061; held-out validation part

- Material **AL6061-T6**, tolerance **+-0.1 mm** on every scored surface.
- **Fixture frame (G54):** part bottom (the face towards the vise stub, machined in the part-off) at **Z0**, part centred in XY. Part bbox X [-13.06, 13.06]
  Y [-78.00, 78.00] Z [0.00, 100.00].
- **Orientation chosen:** model axis `-X` points up, then rotated 0 deg about Z, scale 0.2.
- **Stock:** box X [-16.06, 16.06] Y [-81.00, 81.00] Z [-36.00, 101.50]: part + 3 mm sides,
  + 1.5 mm top, plus a **stub** below Z0: 24 mm clearance gap (Z -24..0) and 12 mm
  gripped in the vise (Z -36..-24).
- **Vise:** jaws clamp the stub on its -Y and +Y faces (jaws 15 mm thick, top at Z-24, extending 10 mm beyond the
  stock in X); vise body below; table below that. Boxes are in `setup.json` ("vise"). Tool and holder must never
  touch them, in any orientation.
- **Machine:** trunnion 5-axis (A tilt <= 110 deg, C unlimited), 3+2 only (no simultaneous 5-axis).
- **Every face is scored, including the underside (the face towards the stub).** Only the 0.03 mm face-edge band and
  the tab witness are not scored. Reach hint: the harness's quick search (smallest tools, 26 cube directions + feature
  axes, holder-aware) found a tool and direction for 99.7% of the surface; for 0.3% it found
  none (`reach_hint.png`). That is a hint, not an excuse: those areas count, so plan them.

## Files
`part.step`, `part.stl` (fixture frame, mm), `faces.json`, `setup.json` (stock, vise boxes, fixture), images
(`target_iso.png`, `reach_hint.png`).

## Tool directions that reach the surface (greedy cover found by the harness's quick search - a hint, not a plan)
| tool axis (G54) | tilt A deg | share of surface first reached |
|---|---|---|
| (-0.707, -0.707, +0.000) | 90.0 | 50.5% |
| (-0.577, -0.577, +0.577) | 54.7 | 1.9% |
| (-1.000, +0.000, +0.000) | 90.0 | 9.7% |
| (-0.707, +0.000, +0.707) | 45.0 | 0.1% |
| (-0.707, +0.707, +0.000) | 90.0 | 0.3% |
| (-0.577, +0.577, +0.577) | 54.7 | 0.0% |
| (+0.000, -1.000, +0.000) | 90.0 | 8.4% |
| (+0.000, -0.707, +0.707) | 45.0 | 3.7% |
| (+0.000, +0.000, +1.000) | 0.0 | 4.5% |
| (+0.000, +1.000, +0.000) | 90.0 | 1.8% |
| (+0.707, -0.707, +0.000) | 90.0 | 17.4% |
| (+0.577, -0.577, +0.577) | 54.7 | 0.0% |
| (+1.000, +0.000, +0.000) | 90.0 | 0.7% |
| (-0.927, +0.375, +0.000) | 90.0 | 0.6% |
| (+0.927, -0.375, -0.000) | 90.0 | 0.0% |
| (-0.000, -0.500, +0.866) | 30.0 | 0.0% |
| (+0.000, -0.866, +0.500) | 60.0 | 0.0% |
| (+0.000, +0.947, -0.321) | 108.7 | 0.0% |
| (+0.000, -0.321, +0.947) | 18.7 | 0.0% |
| (-0.707, -0.227, +0.670) | 47.9 | 0.0% |
| (-0.677, +0.000, +0.736) | 42.6 | 0.0% |

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
| 100 | 1 | 442 | [7.06,-73]-[13.06,0.661] |
| 89 | 1 | 377 | [0.06,-64.4]-[6.06,-1.642] |
| 85 | 1 | 262 | [7.06,29.339]-[13.06,73] |
| 75 | 1 | 94 | [-10.636,-57]-[-1.94,-35.475] |
| 74 | 1 | 232 | [0.06,25.751]-[6.06,64.4] |
| 65.8 | 1 | 38 | [0.06,-22.4]-[3.31,-10.565] |
| 58 | 3 | 771 | [-10.94,23.8]-[-1.74,52.2]; [-10.94,-16.2]-[-1.74,12.2]; [10.898,-59.46]-[13.06,58.54] |
| 47.5 | 2 | 294 | [-10.94,23]-[-5.94,53]; [-10.94,-17]-[-5.94,13] |
| 45 | 1 | 136 | [-0.94,-67]-[3.585,-37] |
| 37 | 1 | 94 | [-10.636,-57]-[-1.94,-35.475] |
| 27 | 1 | 82 | [10.898,20.665]-[13.06,58.54] |
| 23.471 | 1 | 1 | [9.193,-78]-[11.56,-77.6] |
| 19.2 | 1 | 38 | [0.06,-22.4]-[3.31,-10.565] |
| 18.356 | 1 | 1 | [8.56,-78]-[10.721,-77.6] |
| 17.328 | 1 | 1 | [8.56,-78]-[10.842,-77.6] |
| 14 | 2 | 124 | [10.898,-59.46]-[13.06,-2.404]; [9.128,-78]-[11.56,-77.6] |

### Downward-facing flat faces above Z0 (overhangs: not machinable from +Z)

- face 156: z 52.5, extent [-10.94,-17]-[-5.94,13]
- face 162: z 52.5, extent [-10.94,23]-[-5.94,53]
- face 244: z 15, extent [7.06,29.339]-[13.06,73]
- face 269: z 26, extent [0.06,25.751]-[6.06,64.4]
- face 273: z 11, extent [0.06,-64.4]-[6.06,-1.642]
- face 301: z 55, extent [-0.94,-67]-[3.585,-37]
- face 315: z 42, extent [-10.94,23.8]-[-1.74,52.2]
- face 329: z 42, extent [-10.94,-16.2]-[-1.74,12.2]
- face 344: z 73, extent [10.898,20.665]-[13.06,58.54]
- face 346: z 86, extent [10.898,-59.46]-[13.06,-2.404]
- face 371: z 42, extent [10.898,-59.46]-[13.06,58.54]
- face 396: z 25, extent [-10.636,-57]-[-1.94,-35.475]
- face 401: z 63, extent [-10.636,-57]-[-1.94,-35.475]
- face 441: z 80.8, extent [0.06,-22.4]-[3.31,-10.565]
- face 465: z 34.2, extent [0.06,-22.4]-[3.31,-10.565]
- face 485: z 14.62, extent [9.312,-78]-[11.56,-77.6]
- face 490: z 17.954, extent [8.56,-78]-[10.857,-77.6]
- face 500: z 18.983, extent [8.56,-78]-[10.721,-77.6]
- face 508: z 24.092, extent [9.193,-78]-[11.56,-77.6]
- face 510: z 25.373, extent [8.56,-78]-[9.193,-77.6]

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 157 | hole/concave | (-8.5396, 2.5) | 1 | 52.5..58 | partial arc (corner/slot end) |
| 158 | hole/concave | (-8.5396, 2.5) | 1 | 52.5..58 | partial arc (corner/slot end) |
| 152 | hole/concave | (-8.5396, 2.5) | 1 | 42..47.5 | partial arc (corner/slot end) |
| 153 | hole/concave | (-8.5396, 2.5) | 1 | 42..47.5 | partial arc (corner/slot end) |
| 163 | hole/concave | (-8.5396, 42.5) | 1 | 52.5..58 | partial arc (corner/slot end) |
| 164 | hole/concave | (-8.5396, 42.5) | 1 | 52.5..58 | partial arc (corner/slot end) |
| 159 | hole/concave | (-8.5396, 42.5) | 1 | 42..47.5 | partial arc (corner/slot end) |
| 160 | hole/concave | (-8.5396, 42.5) | 1 | 42..47.5 | partial arc (corner/slot end) |
| 338 | hole/concave | (-1.7396, -17.8) | 0.8 | 42.8..57.2 | partial arc (corner/slot end) |
| 334 | hole/concave | (-1.7396, 13.8) | 0.8 | 42.8..57.2 | partial arc (corner/slot end) |
| 322 | hole/concave | (-1.7396, 22.2) | 0.8 | 42.8..57.2 | partial arc (corner/slot end) |
| 318 | hole/concave | (-1.7396, 53.8) | 0.8 | 42.8..57.2 | partial arc (corner/slot end) |
| 281 | boss/convex | (0.0604, -66) | 1 | 55..86.4 | partial arc (corner/slot end) |
| 297 | boss/convex | (0.0604, -66) | 1 | 13.6..45 | partial arc (corner/slot end) |
| 289 | boss/convex | (0.0604, 66) | 1 | 28.6..71.4 | partial arc (corner/slot end) |
| 425 | hole/concave | (3.3104, -22.4) | 1 | 66.8..79.8 | partial arc (corner/slot end) |
| 431 | hole/concave | (3.3104, -22.4) | 1 | 20.2..33.2 | partial arc (corner/slot end) |
| 413 | hole/concave | (3.3104, 1.6) | 1 | 70.917..75.683 | partial arc (corner/slot end) |
| 417 | hole/concave | (3.3104, 1.6) | 1 | 24.317..29.083 | partial arc (corner/slot end) |
| 255 | hole/concave | (6.0604, -68) | 1 | 13.6..86.4 | partial arc (corner/slot end) |
| 263 | hole/concave | (6.0604, 68) | 1 | 28.6..71.4 | partial arc (corner/slot end) |
| 384 | hole/concave | (10.8982, -59.4596) | 1 | 59..85 | partial arc (corner/slot end) |
| 377 | hole/concave | (10.8982, -59.4596) | 1 | 15..41 | partial arc (corner/slot end) |
| 386 | hole/concave | (10.8982, 58.5404) | 1 | 59..72 | partial arc (corner/slot end) |
| 362 | hole/concave | (10.8982, 58.5404) | 1 | 28..41 | partial arc (corner/slot end) |

### Non-vertical cylindrical faces (round-overs, fillets, crowns)

- face 1: radius 5, axis [1.0, 0.0, 0.0], concave, bbox [7.06, 26.84, 14.331, 13.061, 29.339, 15]
- face 2: radius 5, axis [1.0, 0.0, 0.0], concave, bbox [7.06, 26.84, 85, 13.061, 29.339, 85.669]
- face 3: radius 1.21, axis [1.0, 0.0, 0.0], concave, bbox [7.06, 71.839, 78.656, 10.06, 73.629, 80.928]
- face 4: radius 1.21, axis [1.0, 0.0, 0.0], concave, bbox [7.06, 71.209, 78.508, 10.06, 72.999, 80.78]
- face 5: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -75.4, 41.771, 12.461, -73.329, 44.4]
- face 6: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -74.671, 41.6, 12.461, -72.6, 44.229]
- face 7: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -74.671, 26.6, 12.461, -72.6, 29.229]
- face 8: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -75.4, 26.771, 12.461, -73.329, 29.4]
- face 9: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -74.671, 11.6, 12.461, -72.6, 14.229]
- face 10: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -75.4, 11.771, 12.461, -73.329, 14.4]
- face 11: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -66.671, 2.6, 12.461, -64.6, 5.229]
- face 12: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -67.4, 2.771, 12.461, -65.329, 5.4]
- face 13: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -51.671, 2.6, 12.461, -49.6, 5.229]
- face 14: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -52.4, 2.771, 12.461, -50.329, 5.4]
- face 15: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -36.671, 2.6, 12.461, -34.6, 5.229]
- face 16: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -37.4, 2.771, 12.461, -35.329, 5.4]
- face 17: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -21.671, 2.6, 12.461, -19.6, 5.229]
- face 18: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -22.4, 2.771, 12.461, -20.329, 5.4]
- face 19: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -6.671, 2.6, 12.461, -4.6, 5.229]
- face 20: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -7.4, 2.771, 12.461, -5.329, 5.4]
- face 21: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 8.329, 7.2, 12.461, 10.4, 9.829]
- face 22: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 7.6, 7.371, 12.461, 9.671, 10]
- face 23: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 21.329, 14.8, 12.461, 23.4, 17.429]
- face 24: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 20.6, 14.971, 12.461, 22.671, 17.6]
- face 25: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 33.329, 17.6, 12.461, 35.4, 20.229]
- face 26: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 32.6, 17.771, 12.461, 34.671, 20.4]
- face 27: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 48.329, 17.6, 12.461, 50.4, 20.229]
- face 28: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 47.6, 17.771, 12.461, 49.671, 20.4]
- face 29: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 63.329, 17.6, 12.461, 65.4, 20.229]
- face 30: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 62.6, 17.771, 12.461, 64.671, 20.4]
- face 31: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 73.329, 26.6, 12.461, 75.4, 29.229]
- face 32: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 72.6, 26.771, 12.461, 74.671, 29.4]
- face 33: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 73.329, 41.6, 12.461, 75.4, 44.229]
- face 34: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 72.6, 41.771, 12.461, 74.671, 44.4]
- face 35: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 73.329, 55.6, 12.461, 75.4, 58.229]
- face 36: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 72.6, 55.771, 12.461, 74.671, 58.4]
- face 37: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 73.329, 70.6, 12.461, 75.4, 73.229]
- face 38: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 72.6, 70.771, 12.461, 74.671, 73.4]
- face 39: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 63.329, 79.6, 12.461, 65.4, 82.229]
- face 40: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 62.6, 79.771, 12.461, 64.671, 82.4]
- face 41: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 48.329, 79.6, 12.461, 50.4, 82.229]
- face 42: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 47.6, 79.771, 12.461, 49.671, 82.4]
- face 43: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 33.329, 79.6, 12.461, 35.4, 82.229]
- face 44: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 32.6, 79.771, 12.461, 34.671, 82.4]
- face 45: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 21.329, 82.4, 12.461, 23.4, 85.029]
- face 46: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 20.6, 82.571, 12.461, 22.671, 85.2]
- face 47: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 8.329, 90, 12.461, 10.4, 92.629]
- face 48: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, 7.6, 90.171, 12.461, 9.671, 92.8]
- face 49: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -6.671, 94.6, 12.461, -4.6, 97.229]
- face 50: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -7.4, 94.771, 12.461, -5.329, 97.4]
- face 51: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -21.671, 94.6, 12.461, -19.6, 97.229]
- face 52: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -22.4, 94.771, 12.461, -20.329, 97.4]
- face 53: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -36.671, 94.6, 12.461, -34.6, 97.229]
- face 54: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -37.4, 94.771, 12.461, -35.329, 97.4]
- face 55: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -51.671, 94.6, 12.461, -49.6, 97.229]
- face 56: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -52.4, 94.771, 12.461, -50.329, 97.4]
- face 57: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -66.671, 94.6, 12.461, -64.6, 97.229]
- face 58: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -67.4, 94.771, 12.461, -65.329, 97.4]
- face 59: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -74.671, 85.6, 12.461, -72.6, 88.229]
- face 60: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -75.4, 85.771, 12.461, -73.329, 88.4]
- face 61: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -74.671, 70.6, 12.461, -72.6, 73.229]
- face 62: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -75.4, 70.771, 12.461, -73.329, 73.4]
- face 63: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -74.671, 55.6, 12.461, -72.6, 58.229]
- face 64: radius 1.4, axis [-1.0, 0.0, 0.0], concave, bbox [7.06, -75.4, 55.771, 12.461, -73.329, 58.4]
- face 69: radius 1.2, axis [0.9272, -0.3746, 0.0], concave, bbox [-2.273, -48.477, 67.947, 2.101, -45.332, 70.2]
- face 70: radius 1.2, axis [0.9272, -0.3746, 0.0], concave, bbox [-2.507, -49.056, 67.8, 1.867, -45.912, 70.053]
- face 74: radius 1.2, axis [0.9272, -0.3746, 0.0], concave, bbox [-4.895, -54.967, 67.947, -0.522, -51.823, 70.2]
- face 75: radius 1.2, axis [0.9272, -0.3746, 0.0], concave, bbox [-5.129, -55.546, 67.8, -0.756, -52.402, 70.053]
- face 83: radius 1.2, axis [0.9272, -0.3746, 0.0], concave, bbox [-4.895, -54.967, 29.947, -0.522, -51.823, 32.2]
- face 84: radius 1.2, axis [0.9272, -0.3746, 0.0], concave, bbox [-5.129, -55.546, 29.8, -0.756, -52.402, 32.053]
- face 88: radius 1.2, axis [0.9272, -0.3746, 0.0], concave, bbox [-2.273, -48.477, 29.947, 2.101, -45.332, 32.2]
- face 89: radius 1.2, axis [0.9272, -0.3746, 0.0], concave, bbox [-2.507, -49.056, 29.8, 1.867, -45.912, 32.053]
- face 118: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, -11.319, 44.167, -5.94, -10.335, 45.415]
- face 119: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, -11.665, 44.085, -5.94, -10.681, 45.333]
- face 120: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, -2.319, 44.167, -5.94, -1.335, 45.415]
- face 121: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, -2.665, 44.085, -5.94, -1.681, 45.333]
- face 122: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 6.681, 44.167, -5.94, 7.665, 45.415]
- face 123: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 6.335, 44.085, -5.94, 7.319, 45.333]
- face 124: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 6.681, 54.667, -5.94, 7.665, 55.915]
- face 125: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 6.335, 54.585, -5.94, 7.319, 55.833]
- face 126: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, -2.319, 54.667, -5.94, -1.335, 55.915]
- face 127: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, -2.665, 54.585, -5.94, -1.681, 55.833]
- face 128: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, -11.319, 54.667, -5.94, -10.335, 55.915]
- face 129: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, -11.665, 54.585, -5.94, -10.681, 55.833]
- face 130: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 46.681, 44.167, -5.94, 47.665, 45.415]
- face 131: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 46.335, 44.085, -5.94, 47.319, 45.333]
- face 132: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 37.681, 44.167, -5.94, 38.665, 45.415]
- face 133: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 37.335, 44.085, -5.94, 38.319, 45.333]
- face 134: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 28.681, 44.167, -5.94, 29.665, 45.415]
- face 135: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 28.335, 44.085, -5.94, 29.319, 45.333]
- face 136: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 28.681, 54.667, -5.94, 29.665, 55.915]
- face 137: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 28.335, 54.585, -5.94, 29.319, 55.833]
- face 138: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 37.681, 54.667, -5.94, 38.665, 55.915]
- face 139: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 37.335, 54.585, -5.94, 38.319, 55.833]
- face 140: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 46.335, 54.585, -5.94, 47.319, 55.833]
- face 141: radius 0.6647, axis [1.0, 0.0, 0.0], concave, bbox [-10.94, 46.681, 54.667, -5.94, 47.665, 55.915]
- face 144: radius 2, axis [0.9272, -0.3746, 0.0], concave, bbox [-6.126, -47.334, 29.245, -1.308, -43.092, 33]
- face 145: radius 2, axis [0.9272, -0.3746, 0.0], concave, bbox [-6.516, -48.3, 29, -1.698, -44.057, 32.755]
- face 146: radius 2, axis [0.9272, -0.3746, 0.0], concave, bbox [-8.748, -53.825, 29.245, -3.93, -49.582, 33]
- face 147: radius 2, axis [0.9272, -0.3746, 0.0], concave, bbox [-9.138, -54.79, 29, -4.321, -50.548, 32.755]
- face 148: radius 1.0106, axis [0.9272, -0.3746, 0.0], concave, bbox [-3.7, -42.08, 30.113, 2.423, -38.446, 32.011]
- face 149: radius 1.0106, axis [0.9272, -0.3746, 0.0], concave, bbox [-3.897, -42.568, 29.989, 2.226, -38.934, 31.887]
- face 150: radius 1.0106, axis [0.9272, -0.3746, 0.0], concave, bbox [-10.818, -59.697, 30.113, -4.694, -56.063, 32.011]
- face 151: radius 1.0106, axis [0.9272, -0.3746, 0.0], concave, bbox [-11.015, -60.185, 29.989, -4.892, -56.551, 31.887]
- face 155: radius 2.5, axis [0.0, -1.0, 0.0], concave, bbox [-5.94, -17, 47.5, -3.439, 13, 52.5]
- face 161: radius 2.5, axis [0.0, -1.0, 0.0], concave, bbox [-5.94, 23, 47.5, -3.439, 53, 52.5]
- face 165: radius 1.0106, axis [0.9272, -0.3746, 0.0], concave, bbox [-11.015, -60.185, 67.989, -4.892, -56.551, 69.887]
- face 166: radius 1.0106, axis [0.9272, -0.3746, 0.0], concave, bbox [-10.818, -59.697, 68.113, -4.694, -56.063, 70.011]
- face 167: radius 1.0106, axis [0.9272, -0.3746, 0.0], concave, bbox [-3.7, -42.08, 68.113, 2.423, -38.446, 70.011]
- face 168: radius 1.0106, axis [0.9272, -0.3746, 0.0], concave, bbox [-3.897, -42.568, 67.989, 2.226, -38.934, 69.887]
- face 169: radius 2, axis [0.9272, -0.3746, 0.0], concave, bbox [-9.138, -54.79, 67, -4.321, -50.548, 70.755]
- face 170: radius 2, axis [0.9272, -0.3746, 0.0], concave, bbox [-8.748, -53.825, 67.245, -3.93, -49.582, 71]
- face 171: radius 2, axis [0.9272, -0.3746, 0.0], concave, bbox [-6.126, -47.334, 67.245, -1.308, -43.092, 71]
- face 172: radius 2, axis [0.9272, -0.3746, 0.0], concave, bbox [-6.516, -48.3, 67, -1.698, -44.057, 70.755]
- face 233: radius 5, axis [1.0, 0.0, 0.0], convex, bbox [7.06, 0.661, -0, 13.061, 3.16, 0.669]
- face 235: radius 5, axis [1.0, 0.0, 0.0], convex, bbox [7.06, -78, -0, 13.061, -73, 5]
- face 236: radius 5, axis [1.0, 0.0, 0.0], convex, bbox [7.06, -78, 95, 13.061, -73, 100]
- face 238: radius 5, axis [1.0, 0.0, 0.0], convex, bbox [7.06, 0.661, 99.331, 13.061, 3.16, 100]
- face 241: radius 5, axis [1.0, 0.0, 0.0], convex, bbox [7.06, 73, 80, 13.061, 78, 85]
- face 243: radius 5, axis [1.0, 0.0, 0.0], convex, bbox [7.06, 73, 15, 13.061, 78, 20]
- face 246: radius 1.21, axis [1.0, 0.0, 0.0], concave, bbox [7.06, -74.21, 4.072, 10.06, -72.42, 6.344]
- face 247: radius 1.21, axis [1.0, 0.0, 0.0], concave, bbox [7.06, -73.58, 4.22, 10.06, -71.79, 6.492]
- face 251: radius 1, axis [0.0, -0.8662, -0.4997], concave, bbox [6.06, -0.343, 10.482, 7.06, 24.951, 25.652]
- face 253: radius 1, axis [0.0, -1.0, 0.0], concave, bbox [6.06, -64.4, 10, 7.06, -1.642, 11]
- face 257: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [6.06, -64.4, 89, 7.06, -1.642, 90]
- face 259: radius 1, axis [0.0, -0.8662, 0.4997], concave, bbox [6.06, -0.343, 74.348, 7.06, 24.951, 89.518]
- face 261: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [6.06, 25.751, 74, 7.06, 64.4, 75]
- face 265: radius 1, axis [0.0, -1.0, 0.0], concave, bbox [6.06, 25.751, 25, 7.06, 64.4, 26]
- face 266: radius 2.6, axis [-1.0, 0.0, 0.0], convex, bbox [0.06, 64.4, 26, 6.061, 67, 28.6]
- face 268: radius 2.6, axis [-1.0, 0.0, 0.0], convex, bbox [0.06, 64.4, 71.4, 6.061, 67, 74]
- face 270: radius 2.6, axis [-1.0, 0.0, 0.0], concave, bbox [0.06, 24.451, 25.652, 6.061, 25.751, 26]
- face 272: radius 2.6, axis [-1.0, 0.0, 0.0], convex, bbox [0.06, -1.642, 11, 6.061, -0.342, 11.348]
- face 274: radius 2.6, axis [-1.0, 0.0, 0.0], convex, bbox [0.06, -67, 11, 6.061, -64.4, 13.6]
- face 275: radius 2.6, axis [-1.0, 0.0, 0.0], convex, bbox [0.06, -67, 86.4, 6.061, -64.4, 89]
- face 277: radius 2.6, axis [-1.0, 0.0, 0.0], convex, bbox [0.06, -1.642, 88.652, 6.061, -0.342, 89]
- face 280: radius 2.6, axis [-1.0, 0.0, 0.0], concave, bbox [0.06, 24.451, 74, 6.061, 25.751, 74.348]
- face 283: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-0.94, -64.4, 88, 0.06, -1.642, 89]
- face 285: radius 1, axis [0.0, -0.8662, 0.4997], convex, bbox [-0.94, -0.842, 73.482, 0.06, 24.451, 88.652]
- face 287: radius 1, axis [0.0, 1.0, 0.0], convex, bbox [-0.94, 25.751, 73, 0.06, 64.4, 74]
- face 291: radius 1, axis [0.0, -1.0, 0.0], convex, bbox [-0.94, 25.751, 26, 0.06, 64.4, 27]
- face 293: radius 1, axis [0.0, -0.8662, -0.4997], convex, bbox [-0.94, -0.842, 11.348, 0.06, 24.451, 26.518]
- face 295: radius 1, axis [0.0, -1.0, 0.0], convex, bbox [-0.94, -64.4, 11, 0.06, -1.642, 12]
- face 300: radius 5, axis [-1.0, 0.0, 0.0], concave, bbox [-0.94, -37, 45, 3.586, -32, 55]
- face 304: radius 0.5, axis [0.0, 1.0, 0.0], concave, bbox [3.585, -67, 54.5, 4.085, -37, 55]
- face 305: radius 0.5, axis [0.0, -1.0, 0.0], concave, bbox [3.585, -67, 45, 4.085, -37, 45.5]
- face 310: radius 0.8, axis [-1.0, 0.0, 0.0], convex, bbox [-10.94, 52.2, 57.2, -1.74, 53, 58]
- face 312: radius 0.8, axis [-1.0, 0.0, 0.0], convex, bbox [-10.94, 52.2, 42, -1.74, 53, 42.8]
- face 314: radius 0.8, axis [-1.0, 0.0, 0.0], convex, bbox [-10.94, 23, 57.2, -1.74, 23.8, 58]
- face 317: radius 0.8, axis [-1.0, 0.0, 0.0], convex, bbox [-10.94, 23, 42, -1.74, 23.8, 42.8]
- face 320: radius 0.8, axis [0.0, 1.0, 0.0], concave, bbox [-1.74, 23.8, 58, -0.94, 52.2, 58.8]
- face 324: radius 0.8, axis [0.0, -1.0, 0.0], concave, bbox [-1.74, 23.8, 41.2, -0.94, 52.2, 42]
- face 326: radius 0.8, axis [-1.0, 0.0, 0.0], convex, bbox [-10.94, 12.2, 42, -1.74, 13, 42.8]
- face 328: radius 0.8, axis [-1.0, 0.0, 0.0], convex, bbox [-10.94, 12.2, 57.2, -1.74, 13, 58]
- face 330: radius 0.8, axis [-1.0, 0.0, 0.0], convex, bbox [-10.94, -17, 42, -1.74, -16.2, 42.8]
- face 333: radius 0.8, axis [-1.0, 0.0, 0.0], convex, bbox [-10.94, -17, 57.2, -1.74, -16.2, 58]
- face 336: radius 0.8, axis [0.0, 1.0, 0.0], concave, bbox [-1.74, -16.2, 58, -0.94, 12.2, 58.8]
- face 340: radius 0.8, axis [0.0, -1.0, 0.0], concave, bbox [-1.74, -16.2, 41.2, -0.94, 12.2, 42]
- face 343: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [10.898, -60.46, 85, 13.06, -59.46, 86]
- face 345: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [10.898, 20.165, 73, 13.06, 20.665, 73.134]
- face 348: radius 1, axis [0.0, -1.0, 0.0], concave, bbox [9.898, -59.46, 85, 10.898, -2.404, 86]
- face 350: radius 1, axis [0.0, -0.8662, 0.4997], concave, bbox [9.898, -2.404, 72.268, 10.898, 20.166, 85.866]
- face 352: radius 1, axis [0.0, -1.0, 0.0], concave, bbox [9.898, 20.665, 72, 10.898, 58.54, 73]
- face 354: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [10.898, 58.54, 72, 13.06, 59.54, 73]
- face 355: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [10.898, -2.404, 85.866, 13.06, -1.904, 86]
- face 357: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [10.898, 58.54, 41, 13.06, 59.54, 42]
- face 359: radius 1, axis [-1.0, 0.0, 0.0], convex, bbox [10.898, 20.165, 26.866, 13.06, 20.665, 27]
- face 364: radius 1, axis [0.0, -1.0, 0.0], concave, bbox [9.898, 20.665, 27, 10.898, 58.54, 28]
- face 366: radius 1, axis [0.0, -0.8662, -0.4997], concave, bbox [9.898, -2.404, 14.134, 10.898, 20.166, 27.732]
- face 368: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [10.898, -2.404, 14, 13.06, -1.904, 14.134]
- face 369: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [10.898, 58.54, 27, 13.06, 59.54, 28]
- face 372: radius 1, axis [0.0, -1.0, 0.0], concave, bbox [9.898, -59.46, 41, 10.898, 58.54, 42]
- face 374: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [9.898, -59.46, 14, 10.898, -2.403, 15]
- face 379: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [10.898, -60.46, 41, 13.06, -59.46, 42]
- face 380: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [10.898, -60.46, 14, 13.06, -59.46, 15]
- face 389: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [9.898, -59.46, 58, 10.898, 58.54, 59]
- face 391: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [10.898, -60.46, 58, 13.06, -59.46, 59]
- face 392: radius 1, axis [-1.0, 0.0, 0.0], concave, bbox [10.898, 58.54, 58, 13.06, 59.54, 59]
- face 395: radius 6, axis [1.0, 0.0, 0.0], convex, bbox [-13.061, -63, 25, -1.939, -57, 37]
- face 398: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [-1.94, -57, 37, -0.939, -33, 38]
- face 399: radius 1, axis [0.0, -1.0, 0.0], concave, bbox [-1.94, -57, 24, -0.939, -33, 25]
- face 402: radius 6, axis [-1.0, 0.0, 0.0], convex, bbox [-13.061, -63, 63, -1.939, -57, 75]
- face 405: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [-1.94, -57, 62, -0.939, -33, 63]
- face 406: radius 1, axis [0.0, -1.0, 0.0], concave, bbox [-1.94, -57, 75, -0.939, -33, 76]
- face 408: radius 1, axis [0.0, 0.9472, -0.3206], concave, bbox [3.31, -10.565, 75.683, 4.31, 1.921, 80.747]
- face 411: radius 1, axis [0.0, 0.9472, -0.3206], concave, bbox [3.31, -10.565, 29.083, 4.31, 1.921, 34.147]
- face 415: radius 1, axis [0.0, 0.9472, 0.3206], concave, bbox [3.31, -10.565, 65.853, 4.31, 1.921, 70.917]
- face 419: radius 1, axis [0.0, 0.9472, 0.3206], concave, bbox [3.31, -10.565, 19.253, 4.31, 1.921, 24.317]
- face 421: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [3.31, -22.4, 79.8, 4.31, -10.564, 80.8]
- face 422: radius 1, axis [0.0, -1.0, 0.0], concave, bbox [3.31, -22.4, 65.8, 4.31, -10.565, 66.8]
- face 427: radius 1, axis [0.0, -1.0, 0.0], concave, bbox [3.31, -22.4, 33.2, 4.31, -10.564, 34.2]
- face 428: radius 1, axis [0.0, 1.0, 0.0], concave, bbox [3.31, -22.4, 19.2, 4.31, -10.565, 20.2]
- face 434: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, -10.565, 80.747, 3.31, -10.244, 80.8]
- face 435: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, 1.921, 75.683, 3.31, 2.6, 76.63]
- face 438: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, 1.921, 69.97, 3.31, 2.6, 70.917]
- face 439: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, -10.565, 65.8, 3.31, -10.244, 65.853]
- face 443: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, -23.4, 65.8, 3.31, -22.4, 66.8]
- face 444: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, -23.4, 79.8, 3.31, -22.4, 80.8]
- face 458: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, 1.921, 29.083, 3.31, 2.6, 30.03]
- face 459: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, -10.565, 34.147, 3.31, -10.244, 34.2]
- face 462: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, -10.565, 19.2, 3.31, -10.244, 19.253]
- face 463: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, 1.921, 23.37, 3.31, 2.6, 24.317]
- face 467: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, -23.4, 33.2, 3.31, -22.4, 34.2]
- face 468: radius 1, axis [1.0, 0.0, 0.0], concave, bbox [0.06, -23.4, 19.2, 3.31, -22.4, 20.2]
- face 487: radius 0.108, axis [0.0, -1.0, 0.0], convex, bbox [9.204, -78, 14.62, 9.312, -77.6, 14.808]
- face 489: radius 0.7034, axis [0.0, -1.0, 0.0], concave, bbox [10.857, -78, 16.701, 11.56, -77.6, 17.954]
- face 493: radius 0.0829, axis [0.0, -1.0, 0.0], convex, bbox [10.842, -78, 17.184, 10.932, -77.6, 17.328]
- face 495: radius 0.6522, axis [0.0, -1.0, 0.0], concave, bbox [8.476, -78, 14, 9.128, -77.6, 15.131]
- face 498: radius 0.8391, axis [0.0, -1.0, 0.0], concave, bbox [10.721, -78, 18.356, 11.56, -77.6, 19.195]
- face 502: radius 0.9137, axis [0.0, -1.0, 0.0], concave, bbox [9.756, -78, 22.235, 11.56, -77.6, 23.006]
- face 504: radius 0.2821, axis [0.0, -1.0, 0.0], convex, bbox [9.192, -78, 20.028, 9.756, -77.6, 20.333]
- face 512: radius 0.9093, axis [0.0, -1.0, 0.0], concave, bbox [8.56, -78, 19.343, 10.379, -77.6, 20.322]
- face 514: radius 0.2833, axis [0.0, -1.0, 0.0], convex, bbox [10.376, -78, 22.132, 10.94, -77.6, 22.391]
- face 516: radius 0.2185, axis [0.0, -1.0, 0.0], convex, bbox [10.721, -78, 18.983, 10.94, -77.6, 19.201]

### Conical faces (chamfers, countersinks, drafts)

- face 0: area 3 mm2, bbox [10.054, -73.586, 4.214, 10.793, -71.784, 6.498] {'half_angle_deg': 59.0, 'center': [10.7874, -73.0]}
- face 65: area 3 mm2, bbox [10.054, 71.833, 78.65, 10.793, 73.635, 80.934] {'half_angle_deg': 59.0, 'center': [10.7874, 72.419]}
- face 66: area 3 mm2, bbox [10.054, 71.203, 78.502, 10.793, 73.005, 80.786] {'half_angle_deg': 59.0, 'center': [10.7874, 72.419]}
- face 71: area 3 mm2, bbox [1.43, -48.483, 67.941, 2.326, -46.825, 70.206] {'half_angle_deg': 59.0, 'center': [2.3197, -48.2136]}
- face 72: area 3 mm2, bbox [1.196, -49.062, 67.794, 2.326, -47.404, 70.059] {'half_angle_deg': 59.0, 'center': [2.3197, -48.2136]}
- face 76: area 3 mm2, bbox [-1.193, -54.973, 67.941, -0.297, -53.315, 70.206] {'half_angle_deg': 59.0, 'center': [-0.3026, -54.7039]}
- face 77: area 3 mm2, bbox [-1.427, -55.552, 67.794, -0.297, -53.894, 70.059] {'half_angle_deg': 59.0, 'center': [-0.3026, -54.7039]}
- face 78: area 2 mm2, bbox [1.661, -42.573, 67.984, 2.612, -41.177, 69.892] {'half_angle_deg': 59.0, 'center': [2.6074, -41.8586]}
- face 79: area 2 mm2, bbox [-5.26, -59.702, 68.108, -4.505, -58.306, 70.016] {'half_angle_deg': 59.0, 'center': [-4.5101, -59.4751]}
- face 80: area 2 mm2, bbox [-5.457, -60.19, 29.984, -4.505, -58.793, 31.892] {'half_angle_deg': 59.0, 'center': [-4.5101, -59.4751]}
- face 81: area 2 mm2, bbox [1.661, -42.573, 29.984, 2.612, -41.177, 31.892] {'half_angle_deg': 59.0, 'center': [2.6074, -41.8586]}
- face 85: area 3 mm2, bbox [-1.193, -54.973, 29.941, -0.297, -53.315, 32.206] {'half_angle_deg': 59.0, 'center': [-0.3026, -54.7039]}
- face 86: area 3 mm2, bbox [-1.427, -55.552, 29.794, -0.297, -53.894, 32.059] {'half_angle_deg': 59.0, 'center': [-0.3026, -54.7039]}
- face 90: area 3 mm2, bbox [1.43, -48.483, 29.941, 2.326, -46.825, 32.206] {'half_angle_deg': 59.0, 'center': [2.3197, -48.2136]}
- face 91: area 3 mm2, bbox [1.196, -49.062, 29.794, 2.326, -47.404, 32.059] {'half_angle_deg': 59.0, 'center': [2.3197, -48.2136]}
- face 92: area 1 mm2, bbox [-5.943, 46.678, 54.663, -5.537, 47.668, 55.918] {'half_angle_deg': 59.0, 'center': [-5.5402, 47.0]}
- face 93: area 1 mm2, bbox [-5.943, 37.332, 54.582, -5.537, 38.322, 55.837] {'half_angle_deg': 59.0, 'center': [-5.5402, 38.0]}
- face 94: area 1 mm2, bbox [-5.943, 28.332, 54.582, -5.537, 29.322, 55.837] {'half_angle_deg': 59.0, 'center': [-5.5402, 29.0]}
- face 95: area 1 mm2, bbox [-5.943, 28.332, 44.082, -5.537, 29.322, 45.337] {'half_angle_deg': 59.0, 'center': [-5.5402, 29.0]}
- face 96: area 1 mm2, bbox [-5.943, 37.332, 44.082, -5.537, 38.322, 45.337] {'half_angle_deg': 59.0, 'center': [-5.5402, 38.0]}
- face 97: area 1 mm2, bbox [-5.943, 46.332, 44.082, -5.537, 47.322, 45.337] {'half_angle_deg': 59.0, 'center': [-5.5402, 47.0]}
- face 98: area 1 mm2, bbox [-5.943, -11.668, 54.582, -5.537, -10.678, 55.837] {'half_angle_deg': 59.0, 'center': [-5.5402, -11.0]}
- face 99: area 1 mm2, bbox [-5.943, -2.668, 54.582, -5.537, -1.678, 55.837] {'half_angle_deg': 59.0, 'center': [-5.5402, -2.0]}
- face 100: area 1 mm2, bbox [-5.943, 6.332, 54.582, -5.537, 7.322, 55.837] {'half_angle_deg': 59.0, 'center': [-5.5402, 7.0]}
- face 101: area 1 mm2, bbox [-5.943, 6.332, 44.082, -5.537, 7.322, 45.337] {'half_angle_deg': 59.0, 'center': [-5.5402, 7.0]}
- face 102: area 1 mm2, bbox [-5.943, -2.668, 44.082, -5.537, -1.678, 45.337] {'half_angle_deg': 59.0, 'center': [-5.5402, -2.0]}
- face 103: area 1 mm2, bbox [-5.943, -11.668, 44.082, -5.537, -10.678, 45.337] {'half_angle_deg': 59.0, 'center': [-5.5402, -11.0]}
- face 104: area 1 mm2, bbox [-5.943, -11.322, 44.163, -5.537, -10.332, 45.418] {'half_angle_deg': 59.0, 'center': [-5.5402, -11.0]}
- face 105: area 1 mm2, bbox [-5.943, -2.322, 44.163, -5.537, -1.332, 45.418] {'half_angle_deg': 59.0, 'center': [-5.5402, -2.0]}
- face 106: area 1 mm2, bbox [-5.943, 6.678, 44.163, -5.537, 7.668, 45.418] {'half_angle_deg': 59.0, 'center': [-5.5402, 7.0]}
- face 107: area 1 mm2, bbox [-5.943, 6.678, 54.663, -5.537, 7.668, 55.918] {'half_angle_deg': 59.0, 'center': [-5.5402, 7.0]}
- face 108: area 1 mm2, bbox [-5.943, -2.322, 54.663, -5.537, -1.332, 55.918] {'half_angle_deg': 59.0, 'center': [-5.5402, -2.0]}
- face 109: area 1 mm2, bbox [-5.943, -11.322, 54.663, -5.537, -10.332, 55.918] {'half_angle_deg': 59.0, 'center': [-5.5402, -11.0]}
- face 110: area 1 mm2, bbox [-5.943, 46.678, 44.163, -5.537, 47.668, 45.418] {'half_angle_deg': 59.0, 'center': [-5.5402, 47.0]}
- face 111: area 1 mm2, bbox [-5.943, 37.678, 44.163, -5.537, 38.668, 45.418] {'half_angle_deg': 59.0, 'center': [-5.5402, 38.0]}
- face 112: area 1 mm2, bbox [-5.943, 28.678, 44.163, -5.537, 29.668, 45.418] {'half_angle_deg': 59.0, 'center': [-5.5402, 29.0]}
- face 113: area 1 mm2, bbox [-5.943, 28.678, 54.663, -5.537, 29.668, 55.918] {'half_angle_deg': 59.0, 'center': [-5.5402, 29.0]}
- face 114: area 1 mm2, bbox [-5.943, 37.678, 54.663, -5.537, 38.668, 55.918] {'half_angle_deg': 59.0, 'center': [-5.5402, 38.0]}
- face 115: area 1 mm2, bbox [-5.943, 46.332, 54.582, -5.537, 47.322, 55.837] {'half_angle_deg': 59.0, 'center': [-5.5402, 47.0]}
- face 116: area 2 mm2, bbox [1.858, -42.085, 30.108, 2.612, -40.689, 32.016] {'half_angle_deg': 59.0, 'center': [2.6074, -41.8586]}
- ... 76 more

### Toroidal faces (fillets, round-over corners)

- face 250: area 2 mm2, bbox [6.06, 24.451, 24.786, 7.061, 25.751, 26] {'minor_radius': 1.0, 'major_radius': 1.6}
- face 252: area 2 mm2, bbox [6.06, -1.642, 10, 7.061, 0.158, 11.348] {'minor_radius': 1.0, 'major_radius': 3.6}
- face 254: area 7 mm2, bbox [6.06, -68, 10, 7.061, -64.4, 13.6] {'minor_radius': 1.0, 'major_radius': 3.6}
- face 256: area 7 mm2, bbox [6.06, -68, 86.4, 7.061, -64.4, 90] {'minor_radius': 1.0, 'major_radius': 3.6}
- face 258: area 2 mm2, bbox [6.06, -1.642, 88.652, 7.061, 0.158, 90] {'minor_radius': 1.0, 'major_radius': 3.6}
- face 260: area 2 mm2, bbox [6.06, 24.451, 74, 7.061, 25.751, 75.214] {'minor_radius': 1.0, 'major_radius': 1.6}
- face 262: area 7 mm2, bbox [6.06, 64.4, 71.4, 7.061, 68, 75] {'minor_radius': 1.0, 'major_radius': 3.6}
- face 264: area 7 mm2, bbox [6.06, 64.4, 25, 7.061, 68, 28.6] {'minor_radius': 1.0, 'major_radius': 3.6}
- face 282: area 6 mm2, bbox [-0.94, -67, 86.4, 0.061, -64.4, 89] {'minor_radius': 1.0, 'major_radius': 1.6}
- face 284: area 2 mm2, bbox [-0.94, -1.642, 87.786, 0.061, -0.342, 89] {'minor_radius': 1.0, 'major_radius': 1.6}
- face 286: area 2 mm2, bbox [-0.94, 23.951, 73, 0.061, 25.751, 74.348] {'minor_radius': 1.0, 'major_radius': 3.6}
- face 288: area 6 mm2, bbox [-0.94, 64.4, 71.4, 0.061, 67, 74] {'minor_radius': 1.0, 'major_radius': 1.6}
- face 290: area 6 mm2, bbox [-0.94, 64.4, 26, 0.061, 67, 28.6] {'minor_radius': 1.0, 'major_radius': 1.6}
- face 292: area 2 mm2, bbox [-0.94, 23.951, 25.652, 0.061, 25.751, 27] {'minor_radius': 1.0, 'major_radius': 3.6}
- face 294: area 2 mm2, bbox [-0.94, -1.642, 11, 0.061, -0.342, 12.214] {'minor_radius': 1.0, 'major_radius': 1.6}
- face 296: area 6 mm2, bbox [-0.94, -67, 11, 0.061, -64.4, 13.6] {'minor_radius': 1.0, 'major_radius': 1.6}
- face 303: area 12 mm2, bbox [3.585, -37, 45, 4.086, -32, 55] {'minor_radius': 0.5, 'major_radius': 4.5}
- face 319: area 2 mm2, bbox [-1.74, 52.2, 57.2, -0.939, 53.8, 58.8] {'minor_radius': 0.8, 'major_radius': 1.6}
- face 321: area 2 mm2, bbox [-1.74, 22.2, 57.2, -0.939, 23.8, 58.8] {'minor_radius': 0.8, 'major_radius': 1.6}
- face 323: area 2 mm2, bbox [-1.74, 22.2, 41.2, -0.939, 23.8, 42.8] {'minor_radius': 0.8, 'major_radius': 1.6}
- face 325: area 2 mm2, bbox [-1.74, 52.2, 41.2, -0.939, 53.8, 42.8] {'minor_radius': 0.8, 'major_radius': 1.6}
- face 335: area 2 mm2, bbox [-1.74, 12.2, 57.2, -0.939, 13.8, 58.8] {'minor_radius': 0.8, 'major_radius': 1.6}
- face 337: area 2 mm2, bbox [-1.74, -17.8, 57.2, -0.939, -16.2, 58.8] {'minor_radius': 0.8, 'major_radius': 1.6}
- face 339: area 2 mm2, bbox [-1.74, -17.8, 41.2, -0.939, -16.2, 42.8] {'minor_radius': 0.8, 'major_radius': 1.6}
- face 341: area 2 mm2, bbox [-1.74, 12.2, 41.2, -0.939, 13.8, 42.8] {'minor_radius': 0.8, 'major_radius': 1.6}
- face 351: area 1 mm2, bbox [9.898, 19.666, 72, 10.898, 20.665, 73.134] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 365: area 1 mm2, bbox [9.898, 19.666, 26.866, 10.898, 20.665, 28] {'minor_radius': 1.0, 'major_radius': 2.0}
- face 397: area 31 mm2, bbox [-1.94, -64.001, 23.999, -0.939, -56.999, 38.001] {'minor_radius': 1.0, 'major_radius': 7.0}
- face 404: area 31 mm2, bbox [-1.94, -64.001, 61.999, -0.939, -56.999, 76.001] {'minor_radius': 1.0, 'major_radius': 7.0}

### Spherical faces

- face 342: area 2 mm2, bbox [9.898, -60.46, 85, 10.898, -59.459, 86] {'radius': 1.0}
- face 349: area 1 mm2, bbox [9.898, -2.404, 85, 10.899, -1.904, 86] {'radius': 1.0}
- face 353: area 2 mm2, bbox [9.898, 58.54, 72, 10.898, 59.541, 73] {'radius': 1.0}
- face 356: area 2 mm2, bbox [9.898, 58.54, 41, 10.898, 59.541, 42] {'radius': 1.0}
- face 363: area 2 mm2, bbox [9.898, 58.54, 27, 10.898, 59.541, 28] {'radius': 1.0}
- face 367: area 1 mm2, bbox [9.898, -2.404, 14, 10.899, -1.904, 15] {'radius': 1.0}
- face 376: area 2 mm2, bbox [9.898, -60.46, 14, 10.898, -59.459, 15] {'radius': 1.0}
- face 378: area 2 mm2, bbox [9.898, -60.46, 41, 10.898, -59.459, 42] {'radius': 1.0}
- face 388: area 2 mm2, bbox [9.898, 58.54, 58, 10.898, 59.541, 59] {'radius': 1.0}
- face 390: area 2 mm2, bbox [9.898, -60.46, 58, 10.898, -59.459, 59] {'radius': 1.0}
- face 407: area 1 mm2, bbox [3.31, 1.6, 75.682, 4.311, 2.6, 76.63] {'radius': 1.0}
- face 409: area 0 mm2, bbox [3.31, -10.565, 79.8, 4.311, -10.244, 80.8] {'radius': 1.0}
- face 410: area 0 mm2, bbox [3.31, -10.565, 33.2, 4.311, -10.244, 34.2] {'radius': 1.0}
- face 412: area 1 mm2, bbox [3.31, 1.6, 29.082, 4.311, 2.6, 30.03] {'radius': 1.0}
- face 414: area 0 mm2, bbox [3.31, -10.565, 65.8, 4.311, -10.244, 66.8] {'radius': 1.0}
- face 416: area 1 mm2, bbox [3.31, 1.6, 69.97, 4.311, 2.6, 70.918] {'radius': 1.0}
- face 418: area 1 mm2, bbox [3.31, 1.6, 23.37, 4.311, 2.6, 24.318] {'radius': 1.0}
- face 420: area 0 mm2, bbox [3.31, -10.565, 19.2, 4.311, -10.244, 20.2] {'radius': 1.0}
- face 424: area 2 mm2, bbox [3.31, -23.4, 79.8, 4.311, -22.4, 80.8] {'radius': 1.0}
- face 426: area 2 mm2, bbox [3.31, -23.4, 65.8, 4.311, -22.4, 66.8] {'radius': 1.0}
- face 430: area 2 mm2, bbox [3.31, -23.4, 19.2, 4.311, -22.4, 20.2] {'radius': 1.0}
- face 432: area 2 mm2, bbox [3.31, -23.4, 33.2, 4.311, -22.4, 34.2] {'radius': 1.0}

### Vertical flat walls: 52 faces

- face 68: normal (-0.9272, 0.3746), bbox X -2.807..-1.308, Y -48.299..-44.591, Z 67..71
- face 73: normal (-0.9272, 0.3746), bbox X -5.429..-3.931, Y -54.79..-51.081, Z 67..71
- face 82: normal (-0.9272, 0.3746), bbox X -5.429..-3.931, Y -54.79..-51.081, Z 29..33
- face 87: normal (-0.9272, 0.3746), bbox X -2.807..-1.308, Y -48.299..-44.591, Z 29..33
- face 242: normal (0, 1), bbox X 7.06..13.06, Y 78..78, Z 20..80
- face 249: normal (-1, -0), bbox X 7.06..7.06, Y -78..78, Z -0..100
- face 267: normal (0, 1), bbox X 0.06..6.06, Y 67..67, Z 28.6..71.4
- face 298: normal (-0, -1), bbox X 0.06..6.06, Y -67..-67, Z 13.6..86.4
- face 299: normal (-1, 0), bbox X 4.085..4.085, Y -67..-32.5, Z 45.5..54.5
- face 306: normal (-1, 0), bbox X -10.94..-10.94, Y 23..53, Z 52.5..58
- face 307: normal (-1, 0), bbox X -10.94..-10.94, Y 23..53, Z 42..47.5
- face 308: normal (-1, 0), bbox X -10.94..-10.94, Y -17..13, Z 42..47.5
- face 309: normal (-1, 0), bbox X -10.94..-10.94, Y -17..13, Z 52.5..58
- face 311: normal (0, 1), bbox X -10.94..-1.74, Y 53..53, Z 42.8..57.2
- face 316: normal (0, -1), bbox X -10.94..-1.74, Y 23..23, Z 42.8..57.2
- face 327: normal (0, 1), bbox X -10.94..-1.74, Y 13..13, Z 42.8..57.2
- face 332: normal (0, -1), bbox X -10.94..-1.74, Y -17..-17, Z 42.8..57.2
- face 360: normal (0, -1), bbox X 10.898..13.06, Y 59.54..59.54, Z 28..41
- face 370: normal (0, 1), bbox X 10.898..13.06, Y -60.46..-60.46, Z 15..41
- face 375: normal (1, 0), bbox X 9.898..9.898, Y -59.46..58.54, Z 15..41
- face 381: normal (1, 0), bbox X 13.06..13.06, Y -78..78, Z -0..100
- face 383: normal (0, 1), bbox X 10.898..13.06, Y -60.46..-60.46, Z 59..85
- face 385: normal (0, -1), bbox X 10.898..13.06, Y 59.54..59.54, Z 59..72
- face 387: normal (1, 0), bbox X 9.898..9.898, Y -59.46..58.54, Z 59..85
- face 393: normal (-0.9272, 0.3746), bbox X -13.06..-0.94, Y -63..-33, Z 24..38
- face 400: normal (-0.9272, 0.3746), bbox X -13.06..-0.94, Y -63..-33, Z 62..76
- face 423: normal (-1, 0), bbox X 4.31..4.31, Y -22.4..1.6, Z 66.8..79.8
- face 429: normal (-1, 0), bbox X 4.31..4.31, Y -22.4..1.6, Z 20.2..33.2
- face 437: normal (-0, -1), bbox X 0.06..3.31, Y 2.6..2.6, Z 70.917..75.683
- face 440: normal (-0, 1), bbox X 0.06..3.31, Y -23.4..-23.4, Z 66.8..79.8
- face 445: normal (-0.7071, 0.7071), bbox X -0.94..0.06, Y -24.4..-23.4, Z 66.8..79.8
- face 451: normal (-0.7071, -0.7071), bbox X -0.94..0.06, Y 2.6..3.6, Z 70.917..75.683
- face 461: normal (-0, -1), bbox X 0.06..3.31, Y 2.6..2.6, Z 24.317..29.083
- face 464: normal (-0, 1), bbox X 0.06..3.31, Y -23.4..-23.4, Z 20.2..33.2
- face 469: normal (-1, 0), bbox X -0.94..-0.94, Y -66..66, Z 12..88
- face 470: normal (-0.7071, 0.7071), bbox X -0.94..0.06, Y -24.4..-23.4, Z 20.2..33.2
- face 476: normal (-0.7071, -0.7071), bbox X -0.94..0.06, Y 2.6..3.6, Z 24.317..29.083
- face 482: normal (0, -1), bbox X 7.06..13.06, Y -78..-78, Z 5..95
- face 483: normal (-1, 0), bbox X 11.56..11.56, Y -78..-77.6, Z 14..14.62
- face 484: normal (0, -1), bbox X 8.476..11.56, Y -77.6..-77.6, Z 14..17.954

### Inclined flat faces

- face 239: normal [-0.0, 0.4997, 0.8662], bbox [7.06, 3.16, 85.669, 13.06, 26.84, 99.331]
- face 245: normal [-0.0, 0.4997, -0.8662], bbox [7.06, 3.16, 0.669, 13.06, 26.84, 14.331]
- face 271: normal [0.0, 0.4997, -0.8662], bbox [0.06, -0.342, 11.348, 6.06, 24.451, 25.652]
- face 279: normal [-0.0, 0.4997, 0.8662], bbox [0.06, -0.342, 74.348, 6.06, 24.451, 88.652]
- face 347: normal [0.0, -0.4997, -0.8662], bbox [10.898, -1.904, 73.134, 13.06, 20.165, 85.866]
- face 358: normal [-0.0, -0.4997, 0.8662], bbox [10.898, -1.904, 14.134, 13.06, 20.165, 26.866]
- face 433: normal [0.0, -0.3206, -0.9472], bbox [0.06, -10.244, 76.63, 3.31, 1.921, 80.747]
- face 436: normal [-0.0, -0.3206, 0.9472], bbox [0.06, -10.244, 65.853, 3.31, 1.921, 69.97]
- face 447: normal [-0.7071, 0.0, -0.7071], bbox [-0.94, -22.4, 80.8, 0.06, -10.565, 81.8]
- face 449: normal [-0.7071, -0.2267, -0.6698], bbox [-0.94, -10.244, 76.63, 0.06, 2.241, 81.694]
- face 453: normal [-0.7071, -0.2267, 0.6698], bbox [-0.94, -10.244, 64.906, 0.06, 2.241, 69.97]
- face 455: normal [-0.7071, 0.0, 0.7071], bbox [-0.94, -22.4, 64.8, 0.06, -10.565, 65.8]
- face 457: normal [0.0, -0.3206, -0.9472], bbox [0.06, -10.244, 30.03, 3.31, 1.921, 34.147]
- face 460: normal [-0.0, -0.3206, 0.9472], bbox [0.06, -10.244, 19.253, 3.31, 1.921, 23.37]
- face 472: normal [-0.7071, -0.0, 0.7071], bbox [-0.94, -22.4, 18.2, 0.06, -10.565, 19.2]
- face 474: normal [-0.7071, -0.2267, 0.6698], bbox [-0.94, -10.244, 18.306, 0.06, 2.241, 23.37]
- face 478: normal [-0.7071, -0.2267, -0.6698], bbox [-0.94, -10.244, 30.03, 0.06, 2.241, 35.094]
- face 480: normal [-0.7071, -0.0, -0.7071], bbox [-0.94, -22.4, 34.2, 0.06, -10.565, 35.2]
- face 488: normal [-0.6771, -0.0, 0.7359], bbox [9.239, -78, 14.808, 11.297, -77.6, 16.701]
- face 494: normal [0.6789, -0.0, -0.7342], bbox [8.685, -78, 15.131, 10.905, -77.6, 17.184]
