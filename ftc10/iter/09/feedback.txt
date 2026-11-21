# Simulation feedback - iteration 9: ftc10 (3+2)

**Score: 99.866% of the whole part surface within +-0.1 mm.** Program valid: **YES** (0 errors, 4 warnings). Not scored: tab witness 0.23% and the 0.03 mm face-edge band 0.85% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 99.866 |
| whole_surface_gouge_pct | 0.0 |
| whole_surface_proud_pct | 0.134 |
| proud_area_mm2 | 64.29 |
| gouge_area_mm2 | 0.0 |
| max_gouge_mm | 0.0539 |
| max_proud_mm | 1.2539 |
| tab_witness_pct | 0.229 |
| tabs | 2 |
| tab_total_mm2 | 22.88 |
| tab_max_width_mm | 2.6 |
| partoff_ok | True |
| setups | 8 |
| distinct_orientations | 5 |
| cycle_time_min | 116.02 |

## Warnings

- line 6967: feed per tooth < 0.2x recommended for T11 (rubbing); e.g. line 6967: F80 S24000 -> 0.0017 mm/tooth vs recommended 0.012 x422
- line 69811: feed per tooth < 0.2x recommended for T3 (rubbing); e.g. line 69811: F137 S24000 -> 0.0029 mm/tooth vs recommended 0.02 x11154
- line 70129: feed per tooth < 0.2x recommended for T4 (rubbing); e.g. line 70129: F78 S24000 -> 0.0016 mm/tooth vs recommended 0.01 x564
- line 93340: feed per tooth < 0.2x recommended for T12 (rubbing); e.g. line 93340: F206 S24000 -> 0.0029 mm/tooth vs recommended 0.02 x53536

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 12-6994 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T5, T10, T11 | 22572 | 48.425 |
| 2 | 7001-27019 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4, T7, T13 | 33400 | 102.591 |
| 3 | 27026-90448 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T5, T6, T7, T13, T14 | 98128 | 79.181 |
| 4 | 90455-96601 | (0.0, -1.0, 0.0) | 90 / -90 | T1, T2, T3, T7, T10, T12 | 39445 | 14.424 |
| 5 | 96608-100205 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T2, T7, T10, T12 | 36898 | 13.991 |
| 6 | 100211-100365 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T3 | 5716 | 4.563 |
| 7 | 100371-111433 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T5, T7, T13, T14 | 12719 | 58.398 |
| 8 | 111439-124932 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4 | 13478 | 11.353 |

## Rigidity / part-off (connection area in the stub gap; stock section 2997.0 mm2; part-off marker at line 100200)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 6994 | 2997.0 | 1.000 | [2997.0] | False |
| 2 | 27019 | 2997.0 | 1.000 | [2997.0] | False |
| 3 | 90448 | 2997.0 | 1.000 | [2997.0] | False |
| 4 | 96601 | 2997.0 | 1.000 | [2997.0] | False |
| 5 | 100205 | 2997.0 | 1.000 | [2997.0] | False |
| 6 | 100365 | 2997.0 | 1.000 | [2997.0] | True |
| 7 | 111433 | 627.75 | 0.209 | [627.75] | True |
| 8 | 124932 | 22.5 | 0.007 | [11.25, 11.25] | True |

## Part-off: tabs and witness (OK)

Weakest plane Z-5.7: 2 tab(s), total 22.88 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 111.1 mm2 = 0.229% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 54.19 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 11.44 | 2.6 | 12 -28.5 -5.7 |
| 2 | 11.44 | 2.6 | 12 28.5 -5.7 |

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 13.21 | -1.13 23.19 104.99 2.21 26.67 105.96 | (-0.0, -0.01, 1.0) | +0.539 / +1.236 | face 174 (cone) | failed: passes reach the area (line 6988, T11) but leave +0.54 mm on average: stepover / scallop, the tool radius, or a stop short; the harness's quick reach search found no tool for 91% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R2 | proud | 12.04 | -4.27 -25.15 112.47 -0.67 -21.89 113.46 | (0.01, -0.08, 1.0) | +0.495 / +1.254 | face 176 (cone) | failed: no pass reached this; nearest pass line 69970 (T3, frame 3) missed by 4.278 mm |
| R3 | proud | 3.11 | 0.83 29.32 110.35 1.13 30.51 111.56 | (-0.99, 0.03, 0.1) | +0.252 / +0.449 | face 192 (cone) | failed: passes reach the area (line 70133, T4) but leave +0.25 mm on average: stepover / scallop, the tool radius, or a stop short |
| R4 | proud | 2.52 | -12.88 -4.52 99.03 -11.61 -2.94 100.35 | (-0.83, -0.41, 0.37) | +0.119 / +0.150 | face 183 (bspline) | failed: passes reach the area (line 79115, T6) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R5 | proud | 2.52 | 8.16 -19.71 7.12 8.45 -14.61 9.01 | (-0.18, 0.43, -0.88) | +0.179 / +0.328 | face 34 (cylinder r1); face 32 (torus); face 36 (torus) | failed: passes reach the area (line 110467, T14) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R6 | proud | 2.14 | 8.31 17.72 5.64 8.47 20.15 9.01 | (-0.11, -0.7, -0.71) | +0.202 / +0.343 | face 40 (torus); face 33 (torus); face 34 (cylinder r1) | failed: passes reach the area (line 110465, T14) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R7 | proud | 1.75 | 8.3 10.27 9 8.47 13.46 9.02 | (-0.11, -0.0, -0.99) | +0.142 / +0.157 | face 34 (cylinder r1) | failed: passes reach the area (line 110467, T14) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R8 | proud | 1.36 | 0.83 19.55 135.8 0.95 20.41 136.68 | (-0.94, 0.0, -0.35) | +0.196 / +0.250 | face 198 (cone) | failed: passes reach the area (line 70473, T4) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R9 | proud | 1.36 | 0.88 29.47 121.31 1.07 30.36 122.24 | (-0.98, 0.08, 0.2) | +0.249 / +0.381 | face 190 (cone) | failed: no pass reached this; nearest pass line 6900 (T11, frame 1) missed by 1.781 mm |
| R10 | proud | 1.36 | 8.15 18.64 148.95 8.44 19.99 151.93 | (-0.28, -0.77, 0.57) | +0.132 / +0.182 | face 61 (torus); face 66 (torus) | failed: passes reach the area (line 88208, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R11 | proud | 0.97 | -12.44 3.44 99.73 -11.66 4.97 100.1 | (-0.76, 0.33, 0.55) | +0.143 / +0.180 | face 183 (bspline) | failed: passes reach the area (line 77939, T6) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 0.97 | 0.83 19.38 113.81 1.11 20.14 114.41 | (-0.94, 0.1, -0.33) | +0.324 / +0.432 | face 194 (cone) | failed: passes reach the area (line 70336, T4) but leave +0.32 mm on average: stepover / scallop, the tool radius, or a stop short |
| R13 | proud | 0.97 | 0.87 19.48 124.77 1.07 20.51 125.63 | (-1.0, -0.07, -0.01) | +0.223 / +0.383 | face 196 (cone) | failed: no pass reached this; nearest pass line 6956 (T11, frame 1) missed by 1.81 mm |
| R14 | proud | 0.97 | 0.87 29.4 132.88 1.16 30.55 133.22 | (-0.96, -0.17, -0.22) | +0.295 / +0.486 | face 188 (cone) | failed: no pass reached this; nearest pass line 6928 (T11, frame 1) missed by 1.7 mm |
| R15 | proud | 0.97 | 8.41 -36.52 2.29 8.46 -34.49 4.92 | (-0.06, -0.83, -0.56) | +0.131 / +0.152 | face 36 (torus) | failed: passes reach the area (line 109729, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R16 | proud | 0.97 | 8.31 1.89 9 8.46 4.25 9.02 | (-0.13, -0.0, -0.99) | +0.128 / +0.155 | face 34 (cylinder r1) | failed: passes reach the area (line 110467, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 0.78 | -9.11 5.78 113.86 -9.05 5.79 116.57 | (-0.26, 0.96, -0.0) | +0.104 / +0.109 | face 94 (cylinder r6) | failed: passes reach the area (line 77426, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 0.78 | 8.41 -3.2 149 8.46 -0.94 149 | (-0.06, -0.0, 1.0) | +0.122 / +0.138 | face 71 (cylinder r1) | failed: passes reach the area (line 15550, T1) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R19 | proud | 0.78 | 8.31 34.32 152.44 8.46 36.81 155.86 | (-0.11, 0.81, 0.57) | +0.142 / +0.161 | face 66 (torus) | failed: passes reach the area (line 15742, T1) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R20 | proud | 0.58 | -9.1 -5.8 123.35 -9.05 -5.78 125.86 | (-0.26, -0.96, -0.0) | +0.104 / +0.105 | face 94 (cylinder r6) | failed: passes reach the area (line 79819, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R21 | proud | 0.58 | -9.1 5.78 121.49 -9.05 5.8 122.92 | (-0.26, 0.97, -0.0) | +0.105 / +0.107 | face 94 (cylinder r6) | failed: passes reach the area (line 77426, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R22 | proud | 0.58 | 8.04 -19.29 148.94 8.26 -18.62 149.17 | (-0.38, 0.27, 0.89) | +0.115 / +0.121 | face 59 (torus) | failed: passes reach the area (line 88213, T14) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 0.58 | 8.39 -21.46 153.75 8.46 -20.86 154.6 | (-0.08, 0.81, 0.59) | +0.130 / +0.144 | face 64 (torus) | failed: passes reach the area (line 15500, T1) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R24 | proud | 0.58 | 8.42 -15.32 149 8.45 -13.54 149 | (-0.06, -0.0, 1.0) | +0.121 / +0.131 | face 71 (cylinder r1) | failed: passes reach the area (line 88269, T14) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | proud | 0.58 | 8.42 10.37 149 8.44 12.42 149 | (-0.08, -0.0, 1.0) | +0.114 / +0.124 | face 71 (cylinder r1) | failed: passes reach the area (line 88269, T14) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R26 | proud | 0.58 | 8.4 22.36 1.7 8.44 23.23 2.43 | (-0.09, -0.64, -0.77) | +0.123 / +0.135 | face 40 (torus) | failed: passes reach the area (line 109094, T14) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R27 | proud | 0.58 | 8.32 32.19 0.79 8.45 34.37 2.2 | (-0.11, 0.53, -0.84) | +0.129 / +0.154 | face 40 (torus) | failed: passes reach the area (line 108583, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R28 | proud | 0.39 | -9.06 -5.79 113.14 -9.06 -5.79 113.86 | (-0.26, -0.97, -0.0) | +0.105 / +0.106 | face 94 (cylinder r6) | failed: passes reach the area (line 79819, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R29 | proud | 0.39 | -9.12 -5.78 117.55 -9.11 -5.78 117.85 | (-0.27, -0.96, -0.0) | +0.101 / +0.102 | face 94 (cylinder r6) | failed: passes reach the area (line 79819, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R30 | proud | 0.39 | -9.06 -5.8 120.29 -9.04 -5.79 121.32 | (-0.26, -0.97, -0.0) | +0.103 / +0.106 | face 94 (cylinder r6) | failed: passes reach the area (line 79819, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |

Cycle time 116.0 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
