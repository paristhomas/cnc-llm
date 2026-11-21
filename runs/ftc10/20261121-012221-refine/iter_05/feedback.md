# Simulation feedback - iteration 5: ftc10 (3+2)

**Score: 99.755% of the whole part surface within +-0.1 mm.** Program valid: **NO** (1 errors, 0 warnings). Not scored: tab witness 0.23% and the 0.03 mm face-edge band 0.85% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 99.755 |
| whole_surface_gouge_pct | 0.0 |
| whole_surface_proud_pct | 0.245 |
| proud_area_mm2 | 117.5 |
| gouge_area_mm2 | 0.0 |
| max_gouge_mm | 0.0539 |
| max_proud_mm | 1.2539 |
| tab_witness_pct | 0.233 |
| tabs | 2 |
| tab_total_mm2 | 22.88 |
| tab_max_width_mm | 2.6 |
| partoff_ok | True |
| setups | 8 |
| distinct_orientations | 5 |
| cycle_time_min | 93.86 |

## Errors (must be fixed)

- line 87259: feed per tooth > 2.5x recommended for T13 (tool breakage); e.g. line 87259: F960 S24000 -> 0.0200 mm/tooth vs recommended 0.006 x342 (lines 87259, 87301, 87343, 87345, 87346, 87347, 87349, 87350, 87351, 87385, 87386, 87387)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 12-6966 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T5, T10, T11 | 21340 | 48.425 |
| 2 | 6973-27129 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4, T7, T13 | 40594 | 102.591 |
| 3 | 27136-91846 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T5, T6, T7, T13, T14 | 112884 | 79.181 |
| 4 | 91853-98022 | (0.0, -1.0, 0.0) | 90 / -90 | T1, T2, T3, T7, T10, T12 | 21268 | 14.43 |
| 5 | 98029-101733 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T2, T7, T10, T12 | 18805 | 13.996 |
| 6 | 101739-101891 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T3 | 5714 | 4.563 |
| 7 | 101897-113220 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T5, T7, T13, T14 | 12980 | 58.404 |
| 8 | 113226-126711 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4 | 13471 | 11.353 |

## Rigidity / part-off (connection area in the stub gap; stock section 2997.0 mm2; part-off marker at line 101729)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 6966 | 2997.0 | 1.000 | [2997.0] | False |
| 2 | 27129 | 2997.0 | 1.000 | [2997.0] | False |
| 3 | 91846 | 2997.0 | 1.000 | [2997.0] | False |
| 4 | 98022 | 2997.0 | 1.000 | [2997.0] | False |
| 5 | 101733 | 2997.0 | 1.000 | [2997.0] | False |
| 6 | 101891 | 2997.0 | 1.000 | [2997.0] | True |
| 7 | 113220 | 627.75 | 0.209 | [627.75] | True |
| 8 | 126711 | 22.5 | 0.007 | [11.25, 11.25] | True |

## Part-off: tabs and witness (OK)

Weakest plane Z-5.7: 2 tab(s), total 22.88 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 112.84 mm2 = 0.233% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 54.38 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 11.44 | 2.6 | 12 -28.5 -5.7 |
| 2 | 11.44 | 2.6 | 12 28.5 -5.7 |

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 16.9 | -12.88 -8.82 99.03 -7.5 -2.94 103.97 | (-0.71, -0.46, 0.54) | +0.210 / +0.448 | face 183 (bspline); face 106 (cylinder r1); face 93 (cylinder r1) | failed: passes reach the area (line 81392, T6) but leave +0.21 mm on average: stepover / scallop, the tool radius, or a stop short |
| R2 | proud | 14.96 | -12.44 3.44 99.67 -7.5 8.64 103.94 | (-0.7, 0.42, 0.58) | +0.217 / +0.453 | face 183 (bspline); face 96 (cylinder r1); face 95 (cylinder r1) | failed: passes reach the area (line 79005, T6) but leave +0.22 mm on average: stepover / scallop, the tool radius, or a stop short |
| R3 | proud | 13.21 | -1.13 23.19 104.99 2.21 26.67 105.96 | (-0.0, -0.01, 1.0) | +0.539 / +1.236 | face 174 (cone) | failed: passes reach the area (line 6961, T11) but leave +0.54 mm on average: stepover / scallop, the tool radius, or a stop short; the harness's quick reach search found no tool for 91% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R4 | proud | 12.04 | -4.27 -25.15 112.47 -0.67 -21.89 113.46 | (0.01, -0.08, 1.0) | +0.495 / +1.254 | face 176 (cone) | failed: no pass reached this; nearest pass line 70077 (T3, frame 3) missed by 4.278 mm |
| R5 | proud | 10.49 | -7.29 37.12 106.56 -6.92 37.41 127.09 | (-0.62, 0.78, -0.0) | +0.142 / +0.199 | face 73 (cylinder r1) | failed: passes reach the area (line 88218, T13) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R6 | proud | 5.63 | -7.28 -37.39 106.77 -6.95 -37.13 118.96 | (-0.62, -0.79, -0.0) | +0.150 / +0.202 | face 54 (cylinder r1) | failed: passes reach the area (line 87952, T13) but leave +0.15 mm on average: stepover / scallop, the tool radius, or a stop short |
| R7 | proud | 4.47 | -7.28 37.12 130.26 -6.96 37.39 138.36 | (-0.62, 0.78, -0.0) | +0.152 / +0.199 | face 73 (cylinder r1) | failed: passes reach the area (line 88208, T13) but leave +0.15 mm on average: stepover / scallop, the tool radius, or a stop short |
| R8 | proud | 3.11 | 0.83 29.32 110.35 1.13 30.51 111.56 | (-0.99, 0.03, 0.1) | +0.252 / +0.449 | face 192 (cone) | failed: passes reach the area (line 70272, T4) but leave +0.25 mm on average: stepover / scallop, the tool radius, or a stop short |
| R9 | proud | 2.91 | -7.26 -37.41 134.24 -6.92 -37.14 138.2 | (-0.64, -0.77, 0.0) | +0.141 / +0.197 | face 90 (cylinder r1) | failed: passes reach the area (line 88005, T13) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R10 | proud | 2.72 | 8.16 -20.18 5.61 8.45 -14.61 9.01 | (-0.18, 0.48, -0.86) | +0.174 / +0.328 | face 34 (cylinder r1); face 32 (torus); face 36 (torus) | failed: passes reach the area (line 112193, T14) but leave +0.17 mm on average: stepover / scallop, the tool radius, or a stop short |
| R11 | proud | 2.14 | 8.31 17.72 5.64 8.47 20.15 9.01 | (-0.11, -0.7, -0.71) | +0.202 / +0.343 | face 40 (torus); face 33 (torus); face 34 (cylinder r1) | failed: passes reach the area (line 112253, T14) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 1.75 | 8.3 10.27 9 8.47 13.46 9.02 | (-0.11, -0.0, -0.99) | +0.142 / +0.157 | face 34 (cylinder r1) | failed: passes reach the area (line 112255, T14) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R13 | proud | 1.36 | 0.83 19.55 135.8 0.95 20.41 136.68 | (-0.94, 0.0, -0.35) | +0.196 / +0.250 | face 198 (cone) | failed: passes reach the area (line 70777, T4) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R14 | proud | 1.36 | 0.88 29.47 121.31 1.07 30.36 122.24 | (-0.98, 0.08, 0.2) | +0.249 / +0.381 | face 190 (cone) | failed: no pass reached this; nearest pass line 6907 (T11, frame 1) missed by 1.781 mm |
| R15 | proud | 1.36 | 8.15 18.64 148.95 8.44 19.99 151.93 | (-0.28, -0.77, 0.57) | +0.132 / +0.182 | face 61 (torus); face 66 (torus) | failed: passes reach the area (line 89607, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R16 | proud | 1.17 | -7.24 37.17 128.36 -6.93 37.4 129.1 | (-0.56, 0.83, -0.0) | +0.133 / +0.201 | face 73 (cylinder r1) | failed: passes reach the area (line 88208, T13) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 0.97 | 0.83 19.38 113.81 1.11 20.14 114.41 | (-0.94, 0.1, -0.33) | +0.324 / +0.432 | face 194 (cone) | failed: passes reach the area (line 70574, T4) but leave +0.32 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 0.97 | 0.87 19.48 124.77 1.07 20.51 125.63 | (-1.0, -0.07, -0.01) | +0.223 / +0.383 | face 196 (cone) | failed: no pass reached this; nearest pass line 6918 (T11, frame 1) missed by 1.81 mm |
| R19 | proud | 0.97 | 0.87 29.4 132.88 1.16 30.55 133.22 | (-0.96, -0.17, -0.22) | +0.295 / +0.486 | face 188 (cone) | failed: no pass reached this; nearest pass line 6893 (T11, frame 1) missed by 1.7 mm |
| R20 | proud | 0.97 | 8.41 -36.52 2.29 8.46 -34.49 4.92 | (-0.06, -0.83, -0.56) | +0.131 / +0.152 | face 36 (torus) | failed: passes reach the area (line 111517, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R21 | proud | 0.97 | 8.31 1.89 9 8.46 4.25 9.02 | (-0.13, -0.0, -0.99) | +0.128 / +0.155 | face 34 (cylinder r1) | failed: passes reach the area (line 112255, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R22 | proud | 0.78 | -9.11 5.78 113.86 -9.05 5.79 116.57 | (-0.26, 0.96, -0.0) | +0.104 / +0.109 | face 94 (cylinder r6) | failed: passes reach the area (line 79138, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 0.78 | 8.41 -3.2 149 8.46 -0.94 149 | (-0.06, -0.0, 1.0) | +0.122 / +0.138 | face 71 (cylinder r1) | failed: passes reach the area (line 15522, T1) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R24 | proud | 0.78 | 8.31 34.32 152.44 8.46 36.81 155.86 | (-0.11, 0.81, 0.57) | +0.142 / +0.161 | face 66 (torus) | failed: passes reach the area (line 15714, T1) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | proud | 0.58 | -9.1 -5.8 123.35 -9.05 -5.78 125.86 | (-0.26, -0.96, -0.0) | +0.104 / +0.105 | face 94 (cylinder r6) | failed: passes reach the area (line 81531, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R26 | proud | 0.58 | -9.1 5.78 121.49 -9.05 5.8 122.92 | (-0.26, 0.97, -0.0) | +0.105 / +0.107 | face 94 (cylinder r6) | failed: passes reach the area (line 79138, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R27 | proud | 0.58 | 8.04 -19.29 148.94 8.26 -18.62 149.17 | (-0.38, 0.27, 0.89) | +0.115 / +0.121 | face 59 (torus) | failed: passes reach the area (line 89612, T14) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R28 | proud | 0.58 | 8.39 -21.46 153.75 8.46 -20.86 154.6 | (-0.08, 0.81, 0.59) | +0.130 / +0.144 | face 64 (torus) | failed: passes reach the area (line 15472, T1) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R29 | proud | 0.58 | 8.42 -15.32 149 8.45 -13.54 149 | (-0.06, -0.0, 1.0) | +0.121 / +0.131 | face 71 (cylinder r1) | failed: passes reach the area (line 89668, T14) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R30 | proud | 0.58 | 8.42 10.37 149 8.44 12.42 149 | (-0.08, -0.0, 1.0) | +0.114 / +0.124 | face 71 (cylinder r1) | failed: passes reach the area (line 89668, T14) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |

Cycle time 93.9 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
