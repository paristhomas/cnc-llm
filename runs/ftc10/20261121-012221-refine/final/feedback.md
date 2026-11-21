# Simulation feedback: ftc10 (3+2)

**Score: 99.890% of the whole part surface within +-0.1 mm.** Program valid: **YES** (0 errors, 4 warnings). Not scored: tab witness 0.16% and the 0.03 mm face-edge band 0.00% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 99.89 |
| whole_surface_gouge_pct | 0.0 |
| whole_surface_proud_pct | 0.11 |
| proud_area_mm2 | 53.41 |
| gouge_area_mm2 | 0.0 |
| max_gouge_mm | 0.0539 |
| max_proud_mm | 1.2365 |
| tab_witness_pct | 0.157 |
| tabs | 2 |
| tab_total_mm2 | 22.88 |
| tab_max_width_mm | 2.6 |
| partoff_ok | True |
| setups | 8 |
| distinct_orientations | 5 |
| cycle_time_min | 117.59 |

## Warnings

- line 6967: feed per tooth < 0.2x recommended for T11 (rubbing); e.g. line 6967: F80 S24000 -> 0.0017 mm/tooth vs recommended 0.012 x422
- line 69860: feed per tooth < 0.2x recommended for T3 (rubbing); e.g. line 69860: F137 S24000 -> 0.0029 mm/tooth vs recommended 0.02 x11154
- line 70178: feed per tooth < 0.2x recommended for T4 (rubbing); e.g. line 70178: F78 S24000 -> 0.0016 mm/tooth vs recommended 0.01 x564
- line 93456: feed per tooth < 0.2x recommended for T12 (rubbing); e.g. line 93456: F206 S24000 -> 0.0029 mm/tooth vs recommended 0.02 x53536

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 12-7043 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T5, T10, T11, T13, T14 | 23619 | 48.43 |
| 2 | 7050-27068 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4, T7, T13 | 33400 | 102.591 |
| 3 | 27075-90564 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T5, T6, T7, T13, T14 | 98824 | 79.184 |
| 4 | 90571-96717 | (0.0, -1.0, 0.0) | 90 / -90 | T1, T2, T3, T7, T10, T12 | 39445 | 14.424 |
| 5 | 96724-100321 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T2, T7, T10, T12 | 36898 | 13.991 |
| 6 | 100327-100481 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T3 | 5716 | 4.563 |
| 7 | 100487-111549 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T5, T7, T13, T14 | 12719 | 58.398 |
| 8 | 111555-125048 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4 | 13478 | 11.353 |

## Rigidity / part-off (connection area in the stub gap; stock section 2997.0 mm2; part-off marker at line 100316)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 7043 | 2997.0 | 1.000 | [2997.0] | False |
| 2 | 27068 | 2997.0 | 1.000 | [2997.0] | False |
| 3 | 90564 | 2997.0 | 1.000 | [2997.0] | False |
| 4 | 96717 | 2997.0 | 1.000 | [2997.0] | False |
| 5 | 100321 | 2997.0 | 1.000 | [2997.0] | False |
| 6 | 100481 | 2997.0 | 1.000 | [2997.0] | True |
| 7 | 111549 | 627.75 | 0.209 | [627.75] | True |
| 8 | 125048 | 22.5 | 0.007 | [11.25, 11.25] | True |

## Part-off: tabs and witness (OK)

Weakest plane Z-5.7: 2 tab(s), total 22.88 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 76.33 mm2 = 0.157% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 37.87 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 11.44 | 2.6 | 12 -28.5 -5.7 |
| 2 | 11.44 | 2.6 | 12 28.5 -5.7 |

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 13.21 | -1.13 23.19 104.99 2.21 26.67 105.96 | (-0.0, -0.01, 1.0) | +0.539 / +1.236 | face 174 (cone) | failed: a pass (line 6988, T11) touches the edge of this area but +0.54 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined; the harness's quick reach search found no tool for 91% of it (smallest tools, 26 cube directions + feature axes); the search is coarse, so try another direction, a longer or smaller library tool, or a different fixture orientation (the area is scored either way) |
| R2 | proud | 2.72 | -12.88 -4.52 99.03 -11.61 -2.94 100.49 | (-0.83, -0.44, 0.34) | +0.120 / +0.150 | face 183 (bspline); face 94 (cylinder r6) | failed: passes reach the area (line 79200, T6) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R3 | proud | 2.72 | 8.16 -19.71 7.12 8.51 -14.61 9.01 | (-0.16, 0.47, -0.87) | +0.181 / +0.328 | face 34 (cylinder r1); face 32 (torus); face 36 (torus) | failed: passes reach the area (line 110521, T14) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R4 | proud | 2.33 | 8.16 25.22 0.11 8.89 27.37 0.62 | (-0.1, -0.25, -0.96) | +0.188 / +0.320 | face 128 (cylinder r9); face 40 (torus) | failed: passes reach the area (line 108525, T14) but leave +0.19 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R5 | proud | 2.14 | 8.31 17.72 5.64 8.47 20.15 9.01 | (-0.11, -0.7, -0.71) | +0.202 / +0.343 | face 40 (torus); face 33 (torus); face 34 (cylinder r1) | failed: passes reach the area (line 110581, T14) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R6 | proud | 1.94 | 8.3 10.27 9 8.48 13.46 9.02 | (-0.1, -0.0, -0.99) | +0.139 / +0.157 | face 34 (cylinder r1) | failed: passes reach the area (line 110583, T14) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R7 | proud | 1.75 | 8.14 -31.23 0.1 8.94 -29.84 0.44 | (-0.06, -0.2, -0.98) | +0.159 / +0.194 | face 109 (cylinder r9); face 36 (torus) | failed: passes reach the area (line 108615, T14) but leave +0.16 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R8 | proud | 1.55 | 14.93 -31.06 0.11 15.45 -29.87 0.37 | (0.0, -0.21, -0.98) | +0.195 / +0.304 | face 109 (cylinder r9) | failed: passes reach the area (line 100399, T1) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R9 | proud | 1.36 | 8.15 18.64 148.95 8.44 19.99 151.93 | (-0.28, -0.77, 0.57) | +0.132 / +0.182 | face 61 (torus); face 66 (torus) | failed: passes reach the area (line 88324, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R10 | proud | 1.17 | 8.02 -27.79 0.15 8.72 -25.63 0.47 | (-0.2, 0.24, -0.95) | +0.205 / +0.269 | face 36 (torus); face 109 (cylinder r9) | failed: passes reach the area (line 108510, T14) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R11 | proud | 0.97 | -12.44 3.44 99.73 -11.66 4.97 100.1 | (-0.76, 0.33, 0.55) | +0.143 / +0.180 | face 183 (bspline) | failed: passes reach the area (line 78055, T6) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 0.97 | 8.41 -36.52 2.29 8.46 -34.49 4.92 | (-0.06, -0.83, -0.56) | +0.131 / +0.152 | face 36 (torus) | failed: passes reach the area (line 109845, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R13 | proud | 0.97 | 8.31 1.89 9 8.46 4.25 9.02 | (-0.13, -0.0, -0.99) | +0.128 / +0.155 | face 34 (cylinder r1) | failed: passes reach the area (line 110583, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R14 | proud | 0.78 | -9.11 5.78 113.86 -9.05 5.79 116.57 | (-0.26, 0.96, -0.0) | +0.104 / +0.109 | face 94 (cylinder r6) | failed: passes reach the area (line 77542, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R15 | proud | 0.78 | 8.41 -3.2 149 8.46 -0.94 149 | (-0.06, -0.0, 1.0) | +0.122 / +0.138 | face 71 (cylinder r1) | failed: passes reach the area (line 15599, T1) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R16 | proud | 0.78 | 8.42 10.37 149 8.53 12.42 149 | (-0.06, -0.0, 1.0) | +0.116 / +0.124 | face 71 (cylinder r1); face 129 (plane) | failed: passes reach the area (line 15628, T1) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 0.78 | 8.4 22.23 1.7 8.53 23.23 2.55 | (-0.07, -0.65, -0.76) | +0.126 / +0.135 | face 40 (torus); face 128 (cylinder r9) | failed: passes reach the area (line 109211, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 0.78 | 8.31 34.32 152.44 8.46 36.81 155.86 | (-0.11, 0.81, 0.57) | +0.142 / +0.161 | face 66 (torus) | failed: passes reach the area (line 15791, T1) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R19 | proud | 0.78 | 15.14 25.88 0.16 15.23 26.79 0.39 | (0.0, -0.25, -0.97) | +0.219 / +0.322 | face 128 (cylinder r9) | failed: no pass reached this; nearest pass line 123579 (T3, frame 8) missed by 0.064 mm; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R20 | proud | 0.58 | -9.1 -5.8 123.35 -9.05 -5.78 125.86 | (-0.26, -0.96, -0.0) | +0.104 / +0.105 | face 94 (cylinder r6) | failed: passes reach the area (line 79935, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R21 | proud | 0.58 | -9.1 5.78 121.49 -9.05 5.8 122.92 | (-0.26, 0.97, -0.0) | +0.105 / +0.107 | face 94 (cylinder r6) | failed: passes reach the area (line 77542, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R22 | proud | 0.58 | 8.04 -19.29 148.94 8.26 -18.62 149.17 | (-0.38, 0.27, 0.89) | +0.115 / +0.121 | face 59 (torus) | failed: passes reach the area (line 88329, T14) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 0.58 | 8.4 -37.4 7.25 8.53 -37.32 7.66 | (-0.04, -0.99, -0.16) | +0.118 / +0.141 | face 36 (torus); face 109 (cylinder r9) | failed: passes reach the area (line 90594, T1) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R24 | proud | 0.58 | 8.39 -21.46 153.75 8.46 -20.86 154.6 | (-0.08, 0.81, 0.59) | +0.130 / +0.144 | face 64 (torus) | failed: passes reach the area (line 15549, T1) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | proud | 0.58 | 8.42 -15.32 149 8.45 -13.54 149 | (-0.06, -0.0, 1.0) | +0.121 / +0.131 | face 71 (cylinder r1) | failed: passes reach the area (line 88385, T14) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R26 | proud | 0.58 | 8.44 -5.15 9 8.49 -5.03 9 | (-0.04, 0.0, -1.0) | +0.153 / +0.153 | face 34 (cylinder r1) | failed: passes reach the area (line 110524, T14) but leave +0.15 mm on average: stepover / scallop, the tool radius, or a stop short |
| R27 | proud | 0.58 | 8.32 32.19 0.79 8.45 34.37 2.2 | (-0.11, 0.53, -0.84) | +0.129 / +0.154 | face 40 (torus) | failed: passes reach the area (line 108699, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R28 | proud | 0.58 | 14.61 30.72 0.28 15.08 31.19 0.41 | (0.0, 0.28, -0.96) | +0.227 / +0.289 | face 128 (cylinder r9) | failed: passes reach the area (line 123454, T3) but leave +0.23 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R29 | proud | 0.58 | 15.18 -27.12 0.11 15.34 -26.39 0.25 | (0.0, 0.19, -0.98) | +0.161 / +0.258 | face 109 (cylinder r9) | failed: no pass reached this; nearest pass line 125027 (T1, frame 8) missed by 0.054 mm; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R30 | proud | 0.39 | -9.06 -5.79 113.14 -9.06 -5.79 113.86 | (-0.26, -0.97, -0.0) | +0.105 / +0.106 | face 94 (cylinder r6) | failed: passes reach the area (line 79935, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |

Cycle time 117.6 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
