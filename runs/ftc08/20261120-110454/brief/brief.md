# Job brief (3+2 indexed 5-axis): ftc08

ftc08 (nist_ftc_08_asme1_rc.stp), machined 3+2 from AL6061 billet.

- Material **AL6061-T6**, tolerance **+-0.1 mm** on every scored surface.
- **Fixture frame (G54):** part bottom = parting plane at **Z0**, part centred in XY. Part bbox X [-55.67, 55.67]
  Y [-77.90, 77.90] Z [0.00, 24.13].
- **Orientation chosen:** model axis `-Z` points up, then rotated 90 deg about Z, scale 0.5.
- **Stock:** box X [-58.67, 58.67] Y [-80.90, 80.90] Z [-30.00, 25.63]: part + 3 mm sides,
  + 1.5 mm top, plus a **stub** below Z0: 22 mm clearance gap (Z -22..0) and 8 mm
  gripped in the vise (Z -30..-22).
- **Vise:** jaws clamp the stub on its -Y and +Y faces (jaws 15 mm thick, top at Z-22, extending 10 mm beyond the
  stock in X); vise body below; table below that. Boxes are in `setup.json` ("vise"). Tool and holder must never
  touch them, in any orientation.
- **Machine:** trunnion 5-axis (A tilt <= 110 deg, C unlimited), 3+2 only (no simultaneous 5-axis).
- Surface classes: scored 79.8%, parting face (hand-finished) 19.0%, **not reachable in 3+2 with
  the library 1.2%** (excluded; see `reachability.png`).

## Files
`part.step`, `part.stl` (fixture frame, mm), `faces.json`, `setup.json` (stock, vise boxes, fixture), images.

## Tool directions that reach the surface (greedy cover found by the harness - a hint, not a plan)
| tool axis (G54) | tilt A deg | share of surface first reached |
|---|---|---|
| (-0.707, -0.707, +0.000) | 90.0 | 30.2% |
| (-0.577, -0.577, +0.577) | 54.7 | 25.3% |
| (-1.000, +0.000, +0.000) | 90.0 | 6.1% |
| (-0.707, +0.000, +0.707) | 45.0 | 8.3% |
| (-0.707, +0.707, +0.000) | 90.0 | 1.5% |
| (-0.577, +0.577, +0.577) | 54.7 | 0.8% |
| (+0.000, -1.000, +0.000) | 90.0 | 9.2% |
| (+0.000, -0.707, +0.707) | 45.0 | 13.3% |
| (+0.000, +0.000, +1.000) | 0.0 | 3.5% |
| (+0.000, +1.000, +0.000) | 90.0 | 0.3% |

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
| 24.13 | 1 | 4077 | [-55.674,-77.899]-[55.674,77.899] |
| 9.878 | 1 | 9 | [-0.967,71.739]-[6.389,73.009] |
| 6.918 | 1 | 6 | [1.805,71.739]-[6.619,73.009] |
| 3.93 | 3 | 20 | [-5.651,71.739]-[-4.085,73.009]; [-3.079,71.739]-[-1.513,73.009]; [1.662,71.739]-[14.464,73.009] |
| 1.714 | 1 | 8134 | [-46.53,-68.31]-[46.53,68.31] |

### Downward-facing flat faces above Z0 (overhangs: not machinable from +Z)

- face 67: z 19.05, extent [-54.15,-76.375]-[54.15,76.375]
- face 83: z 0.635, extent [-39.307,-65.024]-[39.307,-59.436]
- face 236: z 11.43, extent [-13.97,71.739]-[-12.419,73.009]
- face 254: z 11.43, extent [-0.982,71.739]-[6.619,73.009]
- face 258: z 5.511, extent [1.863,71.739]-[9.708,73.009]
- face 260: z 11.43, extent [9.708,71.739]-[11.259,73.009]
- face 262: z 5.511, extent [11.259,71.739]-[14.464,73.009]
- face 266: z 8.47, extent [1.834,71.739]-[6.36,73.009]

### Vertical cylindrical faces (holes = concave, bosses/outer arcs = convex)

| face | kind | centre XY | radius | Z range | angular extent |
|---|---|---|---|---|---|
| 98 | boss/convex | (-54.1496, -76.3746) | 1.524 | 20.574..24.13 | partial arc (corner/slot end) |
| 99 | boss/convex | (-54.1496, 76.3746) | 1.524 | 20.574..24.13 | partial arc (corner/slot end) |
| 77 | boss/convex | (-49.7046, -60.9479) | 1.524 | 1.524..18.288 | partial arc (corner/slot end) |
| 78 | boss/convex | (-49.7046, 60.9479) | 1.524 | 1.524..18.288 | partial arc (corner/slot end) |
| 127 | hole/concave | (-49.2125, -71.4375) | 1.5081 | 19.05..24.13 | partial arc (corner/slot end) |
| 128 | hole/concave | (-49.2125, -71.4375) | 1.5081 | 19.05..24.13 | partial arc (corner/slot end) |
| 129 | hole/concave | (-49.2125, 71.4375) | 1.5081 | 19.05..24.13 | partial arc (corner/slot end) |
| 130 | hole/concave | (-49.2125, 71.4375) | 1.5081 | 19.05..24.13 | partial arc (corner/slot end) |
| 103 | hole/concave | (-46.5296, -59.6327) | 1.524 | 3.238..24.13 | partial arc (corner/slot end) |
| 102 | hole/concave | (-46.5296, 59.6327) | 1.524 | 3.238..24.13 | partial arc (corner/slot end) |
| 76 | boss/convex | (-39.1674, -71.4851) | 1.524 | 1.524..18.288 | partial arc (corner/slot end) |
| 79 | boss/convex | (-39.1674, 71.4851) | 1.524 | 1.524..18.288 | partial arc (corner/slot end) |
| 179 | hole/concave | (-39.0525, 54.61) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 180 | hole/concave | (-39.0525, 54.61) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 19 | hole/concave | (-38.1, -63.8175) | 1.5875 | -0..0.254 | partial arc (corner/slot end) |
| 18 | hole/concave | (-38.1, -60.6425) | 1.5875 | -0..0.254 | partial arc (corner/slot end) |
| 104 | hole/concave | (-37.8522, -68.3101) | 1.524 | 3.238..24.13 | partial arc (corner/slot end) |
| 101 | hole/concave | (-37.8522, 68.3101) | 1.524 | 3.238..24.13 | partial arc (corner/slot end) |
| 183 | hole/concave | (-33.655, 34.925) | 1.4478 | -0..1.715 | partial arc (corner/slot end) |
| 184 | hole/concave | (-33.655, 34.925) | 1.4478 | -0..1.715 | partial arc (corner/slot end) |
| 12 | hole/concave | (-30.9563, 48.4188) | 0.7938 | -0..1.715 | partial arc (corner/slot end) |
| 11 | hole/concave | (-30.9563, 60.8013) | 0.7938 | -0..1.715 | partial arc (corner/slot end) |
| 173 | hole/concave | (-27.813, -41.275) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 174 | hole/concave | (-27.813, -41.275) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 189 | boss/convex | (-27.813, -41.275) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 175 | hole/concave | (-27.813, -19.05) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 176 | hole/concave | (-27.813, -19.05) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 191 | boss/convex | (-27.813, -19.05) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 163 | hole/concave | (-27.813, 3.175) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 164 | hole/concave | (-27.813, 3.175) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 193 | boss/convex | (-27.813, 3.175) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 154 | hole/concave | (-27.305, 29.845) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 22 | hole/concave | (-26.9875, -52.3875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 21 | hole/concave | (-26.9875, -46.609) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 44 | hole/concave | (-26.9875, -35.941) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 43 | hole/concave | (-26.9875, -24.384) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 42 | hole/concave | (-26.9875, -13.716) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 41 | hole/concave | (-26.9875, -2.159) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 40 | hole/concave | (-26.9875, 8.509) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 39 | hole/concave | (-26.9875, 14.2875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 156 | hole/concave | (-23.1775, 33.655) | 2.54 | -0..1.715 | partial arc (corner/slot end) |
| 152 | hole/concave | (-19.05, 29.845) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 13 | hole/concave | (-18.5738, 48.4188) | 0.7938 | -0..1.715 | partial arc (corner/slot end) |
| 14 | hole/concave | (-18.5738, 60.8013) | 0.7938 | -0..1.715 | partial arc (corner/slot end) |
| 23 | hole/concave | (-18.034, -52.3875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 38 | hole/concave | (-18.034, 14.2875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 169 | hole/concave | (-12.7, -53.213) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 170 | hole/concave | (-12.7, -53.213) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 210 | boss/convex | (-12.7, -53.213) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 165 | hole/concave | (-12.7, 15.113) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 166 | hole/concave | (-12.7, 15.113) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 196 | boss/convex | (-12.7, 15.113) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 187 | hole/concave | (-12.7, 34.925) | 1.5367 | -0..1.715 | partial arc (corner/slot end) |
| 188 | hole/concave | (-12.7, 34.925) | 1.5367 | -0..1.715 | partial arc (corner/slot end) |
| 177 | hole/concave | (-10.4775, 54.61) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 178 | hole/concave | (-10.4775, 54.61) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 24 | hole/concave | (-7.366, -52.3875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 37 | hole/concave | (-7.366, 14.2875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 25 | hole/concave | (7.366, -52.3875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 36 | hole/concave | (7.366, 14.2875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 171 | hole/concave | (12.7, -53.213) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 172 | hole/concave | (12.7, -53.213) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 208 | boss/convex | (12.7, -53.213) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 167 | hole/concave | (12.7, 15.113) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 168 | hole/concave | (12.7, 15.113) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 198 | boss/convex | (12.7, 15.113) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 181 | hole/concave | (12.7, 34.925) | 1.4478 | -0..1.715 | partial arc (corner/slot end) |
| 182 | hole/concave | (12.7, 34.925) | 1.4478 | -0..1.715 | partial arc (corner/slot end) |
| 26 | hole/concave | (18.034, -52.3875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 35 | hole/concave | (18.034, 14.2875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 220 | hole/concave | (19.05, 29.845) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 16 | hole/concave | (20.7963, 24.2888) | 0.7938 | -0..1.715 | partial arc (corner/slot end) |
| 222 | hole/concave | (23.1775, 33.655) | 2.54 | -0..1.715 | partial arc (corner/slot end) |
| 15 | hole/concave | (25.5588, 24.2888) | 0.7938 | -0..1.715 | partial arc (corner/slot end) |
| 27 | hole/concave | (26.9875, -52.3875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 28 | hole/concave | (26.9875, -46.609) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 29 | hole/concave | (26.9875, -35.941) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 30 | hole/concave | (26.9875, -24.384) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 31 | hole/concave | (26.9875, -13.716) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 32 | hole/concave | (26.9875, -2.159) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 33 | hole/concave | (26.9875, 8.509) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 34 | hole/concave | (26.9875, 14.2875) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 224 | hole/concave | (27.305, 29.845) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 161 | hole/concave | (27.813, -41.275) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 162 | hole/concave | (27.813, -41.275) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 205 | boss/convex | (27.813, -41.275) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 159 | hole/concave | (27.813, -19.05) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 160 | hole/concave | (27.813, -19.05) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 203 | boss/convex | (27.813, -19.05) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 157 | hole/concave | (27.813, 3.175) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 158 | hole/concave | (27.813, 3.175) | 1.3525 | -0..1.715 | partial arc (corner/slot end) |
| 201 | boss/convex | (27.813, 3.175) | 3.81 | -0..1.715 | partial arc (corner/slot end) |
| 0 | hole/concave | (31.75, 48.7363) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 234 | hole/concave | (31.75, 48.7363) | 1.5875 | -0..1.715 | partial arc (corner/slot end) |
| 231 | hole/concave | (31.75, 55.88) | 7.6397 | -0.001..1.715 | partial arc (corner/slot end) |
| 232 | hole/concave | (31.75, 55.88) | 7.6397 | -0.001..1.715 | partial arc (corner/slot end) |
| 233 | hole/concave | (31.75, 55.88) | 7.6397 | -0.001..1.715 | partial arc (corner/slot end) |
| 185 | hole/concave | (33.655, 34.925) | 1.5367 | -0..1.715 | partial arc (corner/slot end) |
| 186 | hole/concave | (33.655, 34.925) | 1.5367 | -0..1.715 | partial arc (corner/slot end) |
| 105 | hole/concave | (37.8522, -68.3101) | 1.524 | 3.238..24.13 | partial arc (corner/slot end) |
| 100 | hole/concave | (37.8522, 68.3101) | 1.524 | 3.238..24.13 | partial arc (corner/slot end) |
| 20 | hole/concave | (38.1, -63.8175) | 1.5875 | -0..0.254 | partial arc (corner/slot end) |
| 17 | hole/concave | (38.1, -60.6425) | 1.5875 | -0..0.254 | partial arc (corner/slot end) |
| 75 | boss/convex | (39.1674, -71.4851) | 1.524 | 1.524..18.288 | partial arc (corner/slot end) |
| 80 | boss/convex | (39.1674, 71.4851) | 1.524 | 1.524..18.288 | partial arc (corner/slot end) |
| 106 | hole/concave | (46.5296, -59.6327) | 1.524 | 3.238..24.13 | partial arc (corner/slot end) |
| 107 | hole/concave | (46.5296, 59.6327) | 1.524 | 3.238..24.13 | partial arc (corner/slot end) |
| 131 | hole/concave | (49.2125, -71.4375) | 1.5081 | 19.05..24.13 | partial arc (corner/slot end) |
| 132 | hole/concave | (49.2125, -71.4375) | 1.5081 | 19.05..24.13 | partial arc (corner/slot end) |
| 133 | hole/concave | (49.2125, 71.4375) | 1.5081 | 19.05..24.13 | partial arc (corner/slot end) |
| 134 | hole/concave | (49.2125, 71.4375) | 1.5081 | 19.05..24.13 | partial arc (corner/slot end) |
| 65 | boss/convex | (49.7046, -60.9479) | 1.524 | 1.524..18.288 | partial arc (corner/slot end) |
| 81 | boss/convex | (49.7046, 60.9479) | 1.524 | 1.524..18.288 | partial arc (corner/slot end) |
| 96 | boss/convex | (54.1496, -76.3746) | 1.524 | 20.574..24.13 | partial arc (corner/slot end) |
| 95 | boss/convex | (54.1496, 76.3746) | 1.524 | 20.574..24.13 | partial arc (corner/slot end) |

### Non-vertical cylindrical faces (round-overs, fillets, crowns)

- face 3: radius 1.524, axis [-0.7071, -0.7071, -0.0], convex, bbox [39.167, -72.563, -0, 50.782, -60.948, 1.524]
- face 4: radius 1.524, axis [-1.0, 0.0, 0.0], convex, bbox [-39.167, -73.009, -0, 39.167, -71.485, 1.524]
- face 5: radius 1.524, axis [-0.7071, 0.7071, 0.0], convex, bbox [-50.782, -72.563, -0, -39.167, -60.948, 1.524]
- face 6: radius 1.524, axis [-0.0, -1.0, 0.0], convex, bbox [-51.229, -60.948, -0, -49.705, 60.948, 1.524]
- face 7: radius 1.524, axis [-0.7071, -0.7071, -0.0], convex, bbox [-50.782, 60.948, -0, -39.167, 72.563, 1.524]
- face 8: radius 1.524, axis [1.0, -0.0, 0.0], convex, bbox [-39.167, 71.485, -0, 39.167, 73.009, 1.524]
- face 9: radius 1.524, axis [-0.7071, 0.7071, 0.0], convex, bbox [39.167, 60.948, -0, 50.782, 72.563, 1.524]
- face 10: radius 1.524, axis [0.0, 1.0, 0.0], convex, bbox [49.705, -60.948, -0, 51.229, 60.948, 1.524]
- face 47: radius 0.762, axis [-0.7071, -0.7071, 0.0], concave, bbox [40.245, -73.102, 18.288, 51.321, -62.025, 19.05]
- face 49: radius 0.762, axis [-1.0, 0.0, 0.0], concave, bbox [-39.167, -73.771, 18.288, 39.167, -73.009, 19.05]
- face 51: radius 0.762, axis [-0.7071, 0.7071, 0.0], concave, bbox [-51.321, -73.102, 18.288, -40.245, -62.025, 19.05]
- face 53: radius 0.762, axis [-0.0, -1.0, 0.0], concave, bbox [-51.991, -60.948, 18.288, -51.229, 60.948, 19.05]
- face 55: radius 0.762, axis [-0.7071, -0.7071, 0.0], concave, bbox [-51.321, 62.025, 18.288, -40.245, 73.102, 19.05]
- face 56: radius 0.762, axis [1.0, -0.0, 0.0], concave, bbox [-39.167, 73.009, 18.288, 39.167, 73.771, 19.05]
- face 58: radius 0.762, axis [-0.7071, 0.7071, 0.0], concave, bbox [40.245, 62.025, 18.288, 51.321, 73.102, 19.05]
- face 60: radius 0.762, axis [0.0, 1.0, 0.0], concave, bbox [51.229, -60.948, 18.288, 51.991, 60.948, 19.05]
- face 82: radius 0.381, axis [1.0, -0.0, 0.0], concave, bbox [-38.1, -59.436, 0.254, 38.1, -59.055, 0.635]
- face 84: radius 0.381, axis [-0.0, -1.0, 0.0], concave, bbox [-39.688, -63.818, 0.254, -39.306, -60.642, 0.635]
- face 85: radius 0.381, axis [-1.0, 0.0, 0.0], concave, bbox [-38.1, -65.405, 0.254, 38.1, -65.024, 0.635]
- face 86: radius 1.524, axis [0.0, 1.0, 0.0], convex, bbox [54.15, -76.375, 19.05, 55.674, 76.375, 20.574]
- face 87: radius 1.524, axis [-1.0, 0.0, 0.0], convex, bbox [-54.15, -77.899, 19.05, 54.15, -76.375, 20.574]
- face 88: radius 1.524, axis [-0.0, -1.0, 0.0], convex, bbox [-55.674, -76.375, 19.05, -54.15, 76.375, 20.574]
- face 89: radius 1.524, axis [1.0, -0.0, 0.0], convex, bbox [-54.15, 76.375, 19.05, 54.15, 77.899, 20.574]
- face 135: radius 0.381, axis [0.0, 1.0, 0.0], concave, bbox [39.306, -63.818, 0.254, 39.688, -60.642, 0.635]
- face 143: radius 1.524, axis [-0.0, -1.0, 0.0], concave, bbox [46.53, -59.633, 1.714, 48.054, 59.633, 3.239]
- face 144: radius 1.524, axis [-0.7071, -0.7071, -0.0], concave, bbox [37.852, -69.388, 1.714, 47.607, -59.633, 3.239]
- face 145: radius 1.524, axis [-1.0, 0.0, 0.0], concave, bbox [-37.852, -69.834, 1.714, 37.852, -68.31, 3.239]
- face 146: radius 1.524, axis [-0.7071, 0.7071, 0.0], concave, bbox [-47.607, -69.388, 1.714, -37.852, -59.633, 3.239]
- face 147: radius 1.524, axis [0.0, 1.0, 0.0], concave, bbox [-48.054, -59.633, 1.714, -46.53, 59.633, 3.239]
- face 148: radius 1.524, axis [0.7071, 0.7071, 0.0], concave, bbox [-47.607, 59.633, 1.714, -37.852, 69.388, 3.239]
- face 149: radius 1.524, axis [1.0, -0.0, 0.0], concave, bbox [-37.852, 68.31, 1.714, 37.852, 69.834, 3.239]
- face 150: radius 1.524, axis [0.7071, -0.7071, 0.0], concave, bbox [37.852, 59.633, 1.714, 47.607, 69.388, 3.239]
- face 240: radius 0.2699, axis [0.0, 1.0, 0.0], convex, bbox [-12.419, 71.739, 5.538, -11.95, 73.009, 5.808]
- face 242: radius 1.7586, axis [0.0, 1.0, 0.0], concave, bbox [-7.217, 71.739, 9.671, -4.085, 73.009, 11.43]
- face 246: radius 0.2073, axis [0.0, 1.0, 0.0], convex, bbox [-6.01, 71.739, 9.634, -5.65, 73.009, 9.859]
- face 248: radius 1.6305, axis [0.0, 1.0, 0.0], concave, bbox [-13.97, 71.739, 3.718, -11.142, 73.009, 5.349]
- face 251: radius 2.0979, axis [0.0, 1.0, 0.0], concave, bbox [-3.08, 71.739, 9.332, -0.981, 73.009, 11.43]
- face 255: radius 2.2842, axis [0.0, 1.0, 0.0], concave, bbox [6.618, 71.739, 6.918, 8.544, 73.009, 11.43]
- face 257: radius 0.7052, axis [0.0, 1.0, 0.0], convex, bbox [1.1, 71.739, 5.508, 1.863, 73.009, 6.919]
- face 265: radius 2.2734, axis [0.0, 1.0, 0.0], concave, bbox [-0.611, 71.739, 3.93, 1.834, 73.009, 8.477]
- face 267: radius 0.7083, axis [0.0, 1.0, 0.0], convex, bbox [6.36, 71.739, 8.47, 7.007, 73.009, 9.878]
- face 269: radius 0.5463, axis [0.0, 1.0, 0.0], convex, bbox [-1.513, 71.739, 9.332, -0.967, 73.009, 9.878]

### Toroidal faces (fillets, round-over corners)

- face 61: area 1 mm2, bbox [38.1, -60.643, 0.254, 39.688, -59.055, 0.635] {'minor_radius': 0.381, 'major_radius': 1.2065}
- face 62: area 1 mm2, bbox [-39.688, -60.643, 0.254, -38.1, -59.055, 0.635] {'minor_radius': 0.381, 'major_radius': 1.2065}
- face 63: area 1 mm2, bbox [-39.688, -65.405, 0.254, -38.1, -63.817, 0.635] {'minor_radius': 0.381, 'major_radius': 1.2065}
- face 64: area 1 mm2, bbox [38.1, -65.405, 0.254, 39.688, -63.817, 0.635] {'minor_radius': 0.381, 'major_radius': 1.2065}
- face 66: area 2 mm2, bbox [50.782, -62.565, 18.288, 51.991, -60.948, 19.05] {'minor_radius': 0.762, 'major_radius': 2.286}
- face 68: area 2 mm2, bbox [39.167, -73.771, 18.288, 40.784, -72.563, 19.05] {'minor_radius': 0.762, 'major_radius': 2.286}
- face 69: area 2 mm2, bbox [-40.784, -73.771, 18.288, -39.167, -72.563, 19.05] {'minor_radius': 0.762, 'major_radius': 2.286}
- face 70: area 2 mm2, bbox [-51.991, -62.565, 18.288, -50.782, -60.948, 19.05] {'minor_radius': 0.762, 'major_radius': 2.286}
- face 71: area 2 mm2, bbox [-51.991, 60.948, 18.288, -50.782, 62.565, 19.05] {'minor_radius': 0.762, 'major_radius': 2.286}
- face 72: area 2 mm2, bbox [-40.784, 72.563, 18.288, -39.167, 73.771, 19.05] {'minor_radius': 0.762, 'major_radius': 2.286}
- face 73: area 2 mm2, bbox [39.167, 72.563, 18.288, 40.784, 73.771, 19.05] {'minor_radius': 0.762, 'major_radius': 2.286}
- face 74: area 2 mm2, bbox [50.782, 60.948, 18.288, 51.991, 62.565, 19.05] {'minor_radius': 0.762, 'major_radius': 2.286}

### Spherical faces

- face 45: area 2 mm2, bbox [49.704, -62.026, -0, 51.229, -60.947, 1.524] {'radius': 1.524}
- face 90: area 4 mm2, bbox [54.149, 76.374, 19.05, 55.674, 77.899, 20.574] {'radius': 1.524}
- face 108: area 2 mm2, bbox [-38.93, 68.31, 1.714, -37.852, 69.835, 3.239] {'radius': 1.524}
- face 109: area 2 mm2, bbox [-48.054, 59.632, 1.714, -46.529, 60.711, 3.239] {'radius': 1.524}
- face 110: area 2 mm2, bbox [-48.054, -60.711, 1.714, -46.529, -59.632, 3.239] {'radius': 1.524}
- face 111: area 2 mm2, bbox [-38.93, -69.835, 1.714, -37.852, -68.31, 3.239] {'radius': 1.524}
- face 112: area 2 mm2, bbox [37.852, -69.835, 1.714, 38.93, -68.31, 3.239] {'radius': 1.524}
- face 113: area 2 mm2, bbox [46.529, -60.711, 1.714, 48.054, -59.632, 3.239] {'radius': 1.524}
- face 114: area 2 mm2, bbox [46.529, 59.632, 1.714, 48.054, 60.711, 3.239] {'radius': 1.524}
- face 115: area 2 mm2, bbox [37.852, 68.31, 1.714, 38.93, 69.835, 3.239] {'radius': 1.524}
- face 124: area 4 mm2, bbox [-55.674, 76.374, 19.05, -54.149, 77.899, 20.574] {'radius': 1.524}
- face 125: area 4 mm2, bbox [-55.674, -77.899, 19.05, -54.149, -76.374, 20.574] {'radius': 1.524}
- face 126: area 4 mm2, bbox [54.149, -77.899, 19.05, 55.674, -76.374, 20.574] {'radius': 1.524}
- face 136: area 2 mm2, bbox [49.704, 60.947, -0, 51.229, 62.026, 1.524] {'radius': 1.524}
- face 137: area 2 mm2, bbox [39.167, 71.485, -0, 40.245, 73.01, 1.524] {'radius': 1.524}
- face 138: area 2 mm2, bbox [-40.245, 71.485, -0, -39.167, 73.01, 1.524] {'radius': 1.524}
- face 139: area 2 mm2, bbox [-51.229, 60.947, -0, -49.704, 62.026, 1.524] {'radius': 1.524}
- face 140: area 2 mm2, bbox [-51.229, -62.026, -0, -49.704, -60.947, 1.524] {'radius': 1.524}
- face 141: area 2 mm2, bbox [-40.245, -73.01, -0, -39.167, -71.485, 1.524] {'radius': 1.524}
- face 142: area 2 mm2, bbox [39.167, -73.01, -0, 40.245, -71.485, 1.524] {'radius': 1.524}

### Vertical flat walls: 63 faces

- face 46: normal (0.7071, -0.7071), from (40.245,-72.563) to (50.782,-62.025), Z 1.524..18.288
- face 48: normal (-0, -1), from (-39.167,-73.009) to (39.167,-73.009), Z 1.524..18.288
- face 50: normal (-0.7071, -0.7071), from (-50.782,-72.563) to (-40.245,-62.025), Z 1.524..18.288
- face 52: normal (-1, 0), from (-51.229,-60.948) to (-51.229,60.948), Z 1.524..18.288
- face 54: normal (-0.7071, 0.7071), from (-50.782,62.025) to (-40.245,72.563), Z 1.524..18.288
- face 57: normal (0.7071, 0.7071), from (40.245,62.025) to (50.782,72.563), Z 1.524..18.288
- face 59: normal (1, -0), from (51.229,-60.948) to (51.229,60.948), Z 1.524..18.288
- face 91: normal (1, -0), from (55.674,-76.375) to (55.674,76.375), Z 20.574..24.13
- face 92: normal (-0, -1), from (-54.15,-77.899) to (54.15,-77.899), Z 20.574..24.13
- face 93: normal (-1, 0), from (-55.674,-76.375) to (-55.674,76.375), Z 20.574..24.13
- face 94: normal (0, 1), from (-54.15,77.899) to (54.15,77.899), Z 20.574..24.13
- face 116: normal (-0.7071, -0.7071), from (38.93,60.71) to (47.607,69.388), Z 3.238..24.13
- face 117: normal (-1, 0), from (48.054,-59.633) to (48.054,59.633), Z 3.238..24.13
- face 118: normal (-0.7071, 0.7071), from (38.93,-69.388) to (47.607,-60.71), Z 3.238..24.13
- face 119: normal (0, 1), from (-37.852,-69.834) to (37.852,-69.834), Z 3.238..24.13
- face 120: normal (0.7071, 0.7071), from (-47.607,-69.388) to (-38.93,-60.71), Z 3.238..24.13
- face 121: normal (1, -0), from (-48.054,-59.633) to (-48.054,59.633), Z 3.238..24.13
- face 122: normal (0.7071, -0.7071), from (-47.607,60.71) to (-38.93,69.388), Z 3.238..24.13
- face 123: normal (-0, -1), from (-37.852,69.834) to (37.852,69.834), Z 3.238..24.13
- face 151: normal (-0, -1), from (-20.638,33.655) to (-19.05,33.655), Z -0..1.715
- face 153: normal (0, 1), from (-27.305,26.035) to (-19.05,26.035), Z -0..1.715
- face 155: normal (-0, -1), from (-27.305,33.655) to (-25.717,33.655), Z -0..1.715
- face 190: normal (1, -0), from (-28.575,-35.941) to (-28.575,-24.384), Z -0..1.715
- face 192: normal (1, -0), from (-28.575,-13.716) to (-28.575,-2.159), Z -0..1.715
- face 194: normal (1, -0), from (-28.575,8.509) to (-28.575,14.288), Z -0..1.715
- face 195: normal (-0, -1), from (-26.988,15.875) to (-18.034,15.875), Z -0..1.715
- face 197: normal (-0, -1), from (-7.366,15.875) to (7.366,15.875), Z -0..1.715
- face 199: normal (-0, -1), from (18.034,15.875) to (26.988,15.875), Z -0..1.715
- face 200: normal (-1, 0), from (28.575,8.509) to (28.575,14.288), Z -0..1.715
- face 202: normal (-1, 0), from (28.575,-13.716) to (28.575,-2.159), Z -0..1.715
- face 204: normal (-1, 0), from (28.575,-35.941) to (28.575,-24.384), Z -0..1.715
- face 206: normal (-1, 0), from (28.575,-52.388) to (28.575,-46.609), Z -0..1.715
- face 207: normal (0, 1), from (18.034,-53.975) to (26.988,-53.975), Z -0..1.715
- face 209: normal (0, 1), from (-7.366,-53.975) to (7.366,-53.975), Z -0..1.715
- face 211: normal (0, 1), from (-26.988,-53.975) to (-18.034,-53.975), Z -0..1.715
- face 212: normal (1, -0), from (-28.575,-52.388) to (-28.575,-46.609), Z -0..1.715
- face 213: normal (-1, 0), from (39.687,-63.818) to (39.688,-60.642), Z -0..0.254
- face 214: normal (0, 1), from (-38.1,-65.405) to (38.1,-65.405), Z -0..0.254
- face 215: normal (1, -0), from (-39.688,-63.818) to (-39.687,-60.642), Z -0..0.254
- face 216: normal (-0, -1), from (-38.1,-59.055) to (38.1,-59.055), Z -0..0.254

### Inclined flat faces

- face 241: normal [0.7359, -0.0, -0.6771], bbox [-11.95, 71.739, 5.625, -7.217, 73.009, 10.77]
- face 247: normal [-0.7342, 0.0, 0.6789], bbox [-11.142, 71.739, 4.242, -6.01, 73.009, 9.792]
