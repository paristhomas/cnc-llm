# Simulation feedback: ftc10 (3+2)

**Score: 79.498% of the whole part surface within +-0.1 mm.** Program valid: **NO** (1 errors, 0 warnings). Not scored: tab witness 0.00% and the 0.03 mm face-edge band 0.86% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 79.498 |
| whole_surface_gouge_pct | 0.008 |
| whole_surface_proud_pct | 20.494 |
| proud_area_mm2 | 9859.77 |
| gouge_area_mm2 | 3.89 |
| max_gouge_mm | 5.0 |
| max_proud_mm | 5.0 |
| tab_witness_pct | 0.0 |
| tabs | 2 |
| tab_total_mm2 | 12.96 |
| tab_max_width_mm | 2.0 |
| partoff_ok | False |
| setups | 7 |
| distinct_orientations | 5 |
| cycle_time_min | 85.84 |

## Errors (must be fixed)

- line 253877: part-off: tab witness 17.69% of the surface (8587 mm2; max 1.5%): proud material connected to the tabs covers too much of the part (an unfinished underside counts as tab joint)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 11-45675 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T2, T3, T6 | 61943 | 74.21 |
| 2 | 45681-245527 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T6 | 267007 | 102.894 |
| 3 | 245535-253726 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3 | 7894 | 106.361 |
| 4 | 253733-253758 | (0.0, 0.8192, 0.5736) | 55 / 90 | T1 | 25 | 4.855 |
| 5 | 253762-253787 | (0.0, -0.8192, 0.5736) | 55 / -90 | T1 | 25 | 4.84 |
| 6 | 253791-253832 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 41 | 21.98 |
| 7 | 253836-253877 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 41 | 23.952 |

## Rigidity / part-off (connection area in the stub gap; stock section 6068.0 mm2; part-off marker at line 253724)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 45675 | 6068.0 | 1.000 | [6068.0] | False |
| 2 | 245527 | 4200.44 | 0.692 | [4200.44] | False |
| 3 | 253726 | 3605.81 | 0.594 | [3605.81] | False |
| 4 | 253758 | 3590.62 | 0.592 | [3590.62] | True |
| 5 | 253787 | 3575.44 | 0.589 | [3575.44] | True |
| 6 | 253832 | 2010.0 | 0.331 | [2010.0] | True |
| 7 | 253877 | 13.0 | 0.002 | [6.5, 6.5] | True |

## Part-off: tabs and witness (FAILED)

Weakest plane Z-5.7: 2 tab(s), total 12.96 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 8586.6 mm2 = 17.693% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 8121.16 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 6.48 | 2.0 | -0 -40 -5.7 |
| 2 | 6.48 | 2.0 | -0 40 -5.7 |
- FAILED: tab witness 17.69% of the surface (8587 mm2; max 1.5%): proud material connected to the tabs covers too much of the part (an unfinished underside counts as tab joint)

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 8423.82 | -15.36 -78.82 0 15.47 78.82 74.91 | (-0.12, -0.03, -0.99) | +2.976 / +5.000 | face 213 (plane); face 148 (cylinder r3.5); face 147 (cylinder r3.5) | failed: passes reach the area (line 204005, T6) but leave +2.98 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup; the harness's quick reach search found no tool for 54% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R2 | proud | 617.74 | -2.25 25.96 6.5 3.25 62.46 18.56 | (-0.89, 0.45, 0.01) | +4.828 / +5.000 | face 175 (cylinder r2.75); face 174 (cone); face 190 (cone) | failed: no pass reached this; nearest pass line 154355 (T1, frame 1) missed by 1.151 mm; the harness's quick reach search found no tool for 79% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R3 | proud | 467.58 | -5.25 33.51 58.25 0.25 62.47 63.75 | (-0.79, 0.61, -0.11) | +4.986 / +5.000 | face 177 (cylinder r2.75); face 176 (cone) | failed: no pass reached this; nearest pass line 245379 (T4, frame 1) missed by 0.657 mm; the harness's quick reach search found no tool for 65% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R4 | proud | 63.72 | -13.64 19.14 24.7 -7.5 30.14 45.97 | (-0.83, 0.55, -0.12) | +0.326 / +0.877 | face 183 (bspline); face 94 (cylinder r6); face 105 (cylinder r8) | failed: passes reach the area (line 237002, T6) but leave +0.33 mm on average: stepover / scallop, the tool radius, or a stop short |
| R5 | proud | 45.07 | 7.59 69.42 30.16 15.46 78.26 63.42 | (-0.5, 0.79, -0.35) | +0.298 / +0.755 | face 71 (cylinder r1); face 89 (cylinder r1); face 129 (plane) | failed: no pass reached this; nearest pass line 252353 (T2, frame 2) missed by 0.051 mm |
| R6 | proud | 20.4 | -4.12 -9.25 51.75 -1.56 -6.75 54.25 | (0.0, 1.0, -0.01) | +4.910 / +5.000 | face 0 (cylinder r1.25) | failed: no pass reached this; nearest pass line 45599 (T2, frame 0) missed by 0.1 mm; the harness's quick reach search found no tool for 93% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R7 | proud | 19.81 | -4.04 -31.25 51.75 -1.61 -28.75 54.25 | (0.0, -1.0, 0.07) | +4.869 / +5.000 | face 6 (cylinder r1.25) | failed: passes reach the area (line 45542, T2) but leave +4.87 mm on average: stepover / scallop, the tool radius, or a stop short; the harness's quick reach search found no tool for 87% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R8 | proud | 19.62 | -4.08 -53.25 51.75 -1.58 -50.75 54.25 | (0.0, 0.71, 0.7) | +4.863 / +5.000 | face 1 (cylinder r1.25) | failed: no pass reached this; nearest pass line 45478 (T2, frame 0) missed by 0.279 mm; the harness's quick reach search found no tool for 96% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R9 | proud | 19.62 | -4.09 12.75 51.75 -1.53 15.25 54.25 | (0.0, 1.0, 0.07) | +4.865 / +5.000 | face 7 (cylinder r1.25) | failed: passes reach the area (line 252080, T2) but leave +4.87 mm on average: stepover / scallop, the tool radius, or a stop short; the harness's quick reach search found no tool for 92% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R10 | proud | 19.43 | -10.33 31.25 30.6 -7.36 62.04 32.21 | (-0.63, 0.01, -0.78) | +0.121 / +0.166 | face 94 (cylinder r6); face 95 (cylinder r1); face 87 (torus) | failed: passes reach the area (line 234709, T6) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R11 | proud | 18.65 | -7.52 27.12 5.86 -7.5 28.7 18.95 | (-1.0, -0.02, 0.0) | +0.118 / +0.120 | face 24 (plane); face 15 (cylinder r1) | failed: passes reach the area (line 227780, T6) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 15.54 | -7.65 22.42 2.4 -7.5 23.99 20.87 | (-1.0, 0.06, 0.0) | +0.117 / +0.120 | face 24 (plane); face 96 (cylinder r1) | failed: passes reach the area (line 230358, T6) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R13 | proud | 11.46 | -1.5 14.52 12.64 0.39 19.96 17 | (0.8, -0.41, 0.43) | +0.286 / +0.505 | face 151 (sphere r2); face 157 (cylinder r2); face 152 (cylinder r2) | failed: passes reach the area (line 253441, T2) but leave +0.29 mm on average: stepover / scallop, the tool radius, or a stop short |
| R14 | proud | 11.27 | -1.5 15.79 59.55 0.3 19.87 62.48 | (0.75, -0.41, -0.53) | +0.317 / +0.499 | face 150 (sphere r2); face 158 (cylinder r2); face 152 (cylinder r2) | failed: passes reach the area (line 253519, T2) but leave +0.32 mm on average: stepover / scallop, the tool radius, or a stop short |
| R15 | proud | 10.68 | -1.5 -57.99 12.51 0.43 -54.33 16.99 | (0.73, 0.47, 0.5) | +0.298 / +0.485 | face 154 (sphere r2); face 157 (cylinder r2); face 155 (cylinder r2) | failed: passes reach the area (line 253485, T2) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R16 | proud | 10.3 | -1.46 -57.96 58.71 0.46 -54.51 62.44 | (0.72, 0.49, -0.49) | +0.282 / +0.503 | face 153 (sphere r2); face 155 (cylinder r2); face 158 (cylinder r2) | failed: passes reach the area (line 253545, T2) but leave +0.28 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 3.69 | 7.59 -76.64 71.48 8.03 -73.13 74.31 | (-0.72, -0.39, 0.57) | +0.181 / +0.343 | face 36 (torus) | failed: passes reach the area (line 29609, T1) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 3.11 | -10.07 53.36 42.92 -7.5 60.17 44.37 | (-0.71, -0.0, 0.71) | +0.109 / +0.118 | face 94 (cylinder r6); face 93 (cylinder r1) | failed: passes reach the area (line 236766, T6) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R19 | proud | 2.53 | -10.07 44.68 42.92 -7.5 51.79 44.38 | (-0.55, -0.0, 0.84) | +0.107 / +0.119 | face 94 (cylinder r6); face 93 (cylinder r1) | failed: passes reach the area (line 236760, T6) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R20 | proud | 1.94 | -7.27 32.24 74.64 -6.92 36.59 74.91 | (-0.65, 0.0, 0.76) | +0.139 / +0.224 | face 54 (cylinder r1) | failed: passes reach the area (line 29945, T1) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R21 | proud | 1.75 | -9.06 31.79 43.29 -7.5 34.44 44.34 | (-0.89, -0.0, 0.46) | +0.107 / +0.116 | face 93 (cylinder r1); face 94 (cylinder r6) | failed: passes reach the area (line 237005, T6) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R22 | proud | 1.75 | 7.84 77.2 68.17 8.04 78.57 71.21 | (-0.56, 0.77, 0.31) | +0.148 / +0.167 | face 64 (torus) | failed: passes reach the area (line 30273, T1) but leave +0.15 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 1.55 | 7.65 74.07 73.05 7.96 74.84 73.8 | (-0.74, 0.35, 0.57) | +0.252 / +0.373 | face 64 (torus) | failed: no pass reached this; nearest pass line 252584 (T2, frame 2) missed by 0.072 mm |
| R24 | proud | 1.36 | -7.52 34.64 59.9 -7.5 34.93 62.89 | (-0.99, -0.16, 0.01) | +0.108 / +0.116 | face 26 (torus) | failed: passes reach the area (line 240673, T6) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | proud | 1.36 | -7.25 24.89 74.66 -6.92 27.01 74.91 | (-0.57, 0.0, 0.82) | +0.133 / +0.200 | face 54 (cylinder r1) | failed: passes reach the area (line 45411, T6) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R26 | proud | 1.36 | -1.4 -14.33 13.34 -1.13 -9.17 13.87 | (0.91, -0.0, 0.41) | +0.110 / +0.114 | face 157 (cylinder r2) | failed: passes reach the area (line 253476, T2) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R27 | proud | 1.17 | -7.65 22.42 66.81 -7.5 22.87 68.49 | (-0.94, 0.34, 0.0) | +0.110 / +0.118 | face 106 (cylinder r1) | failed: passes reach the area (line 242444, T6) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R28 | proud | 1.17 | -1.39 -36.28 61.15 -1.13 -32.91 61.66 | (0.89, -0.0, -0.46) | +0.108 / +0.118 | face 158 (cylinder r2) | failed: passes reach the area (line 253483, T2) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R29 | proud | 1.17 | -1.4 -26.45 13.54 -1.26 -21.29 13.87 | (0.93, -0.0, 0.38) | +0.110 / +0.117 | face 157 (cylinder r2) | failed: passes reach the area (line 253476, T2) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R30 | proud | 1.17 | -1.39 11.22 61.15 -1.37 14.14 61.2 | (0.94, 0.0, -0.33) | +0.109 / +0.117 | face 158 (cylinder r2) | failed: passes reach the area (line 253459, T2) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |

Cycle time 85.8 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
