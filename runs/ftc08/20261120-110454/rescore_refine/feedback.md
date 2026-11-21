# Simulation feedback: ftc08 (3+2)

**Score: 80.059% of the whole part surface within +-0.1 mm.** Program valid: **NO** (3 errors, 0 warnings). Not scored: tab witness 0.00% and the 0.03 mm face-edge band 1.00% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 80.059 |
| whole_surface_gouge_pct | 0.001 |
| whole_surface_proud_pct | 19.94 |
| proud_area_mm2 | 9460.05 |
| gouge_area_mm2 | 0.38 |
| max_gouge_mm | 5.0 |
| max_proud_mm | 5.0 |
| tab_witness_pct | 0.0 |
| tabs | 2 |
| tab_total_mm2 | 2650.78 |
| tab_max_width_mm | 38.2 |
| partoff_ok | False |
| setups | 28 |
| distinct_orientations | 13 |
| cycle_time_min | 40.53 |

## Errors (must be fixed)

- line 124383: part-off: tabs total 2650.8 mm2 at the weakest plane Z-13.2 (max 30 mm2)
- line 124383: part-off: 2 tab(s) wider than 3 mm in their smallest direction (widest 38.20 mm): not removable by hand
- line 124383: part-off: tab witness 21.60% of the surface (10350 mm2; max 1.5%): proud material connected to the tabs covers too much of the part (an unfinished underside counts as tab joint)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 11-38743 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T2, T3, T4, T5 | 57706 | 343.957 |
| 2 | 38751-38804 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 54 | 33.84 |
| 3 | 38813-38866 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 54 | 34.871 |
| 4 | 38875-38938 | (0.0, -1.0, 0.0) | 90 / -90 | T1 | 64 | 22.998 |
| 5 | 38947-39010 | (0.0, 1.0, 0.0) | 90 / 90 | T1 | 64 | 23.341 |
| 6 | 39019-39082 | (-0.7071, -0.7071, 0.0) | 90 / -135 | T1 | 64 | 1.916 |
| 7 | 39091-39154 | (-0.7071, 0.7071, 0.0) | 90 / 135 | T1 | 64 | 1.904 |
| 8 | 39163-39226 | (0.7071, -0.7071, 0.0) | 90 / -45 | T1 | 64 | 1.89 |
| 9 | 39235-39298 | (0.7071, 0.7071, 0.0) | 90 / 45 | T1 | 64 | 1.871 |
| 10 | 39312-39346 | (-1.0, -0.0, 0.0) | 90 / -180 | T5 | 35 | 2.89 |
| 11 | 39355-39389 | (1.0, -0.0, 0.0) | 90 / -0 | T5 | 35 | 2.887 |
| 12 | 39398-39432 | (0.0, -1.0, 0.0) | 90 / -90 | T5 | 35 | 1.989 |
| 13 | 39441-39475 | (0.0, 1.0, 0.0) | 90 / 90 | T5 | 35 | 1.857 |
| 14 | 39484-39501 | (-0.7071, -0.7071, 0.0) | 90 / -135 | T5 | 18 | 0.256 |
| 15 | 39510-39527 | (-0.7071, 0.7071, 0.0) | 90 / 135 | T5 | 18 | 0.262 |
| 16 | 39536-39553 | (0.7071, -0.7071, 0.0) | 90 / -45 | T5 | 18 | 0.264 |
| 17 | 39562-39579 | (0.7071, 0.7071, 0.0) | 90 / 45 | T5 | 18 | 0.259 |
| 18 | 39593-42574 | (-0.9659, -0.0, -0.2588) | 105 / -180 | T8 | 2982 | 0.073 |
| 19 | 42583-45564 | (0.9659, -0.0, -0.2588) | 105 / -0 | T8 | 2982 | 0.061 |
| 20 | 45573-47650 | (0.0, -0.9659, -0.2588) | 105 / -90 | T8 | 2078 | 0.046 |
| 21 | 47659-49736 | (0.0, 0.9659, -0.2588) | 105 / 90 | T8 | 2078 | 0.041 |
| 22 | 49750-57515 | (0.0, 1.0, 0.0) | 90 / 90 | T4 | 7761 | 0.141 |
| 23 | 57530-83222 | (0.0, 0.0, 1.0) | 0 / 0 | T1 | 25693 | 56.862 |
| 24 | 83236-124222 | (0.0, 0.0, 1.0) | 0 / 0 | T2 | 40987 | 1.652 |
| 25 | 124236-124279 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 44 | 49.689 |
| 26 | 124288-124331 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 44 | 49.924 |
| 27 | 124340-124357 | (0.0, -1.0, 0.0) | 90 / -90 | T1 | 18 | 11.81 |
| 28 | 124366-124383 | (0.0, 1.0, 0.0) | 90 / 90 | T1 | 18 | 11.889 |

## Rigidity / part-off (connection area in the stub gap; stock section 18986.5 mm2; part-off marker at line 57519)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 38743 | 14550.88 | 0.766 | [14550.88] | False |
| 2 | 38804 | 13337.75 | 0.703 | [13337.75] | False |
| 3 | 38866 | 12165.06 | 0.641 | [12165.06] | False |
| 4 | 38938 | 11345.06 | 0.598 | [11345.06] | False |
| 5 | 39010 | 10550.69 | 0.556 | [10550.69] | False |
| 6 | 39082 | 10486.0 | 0.552 | [10486.0] | False |
| 7 | 39154 | 10421.31 | 0.549 | [10421.31] | False |
| 8 | 39226 | 10356.62 | 0.545 | [10356.62] | False |
| 9 | 39298 | 10289.06 | 0.542 | [10289.06] | False |
| 10 | 39346 | 10038.56 | 0.529 | [10038.56] | False |
| 11 | 39389 | 9788.56 | 0.516 | [9788.56] | False |
| 12 | 39432 | 9645.94 | 0.508 | [9645.94] | False |
| 13 | 39475 | 9482.94 | 0.499 | [9482.94] | False |
| 14 | 39501 | 9458.19 | 0.498 | [9458.19] | False |
| 15 | 39527 | 9434.12 | 0.497 | [9434.12] | False |
| 16 | 39553 | 9409.38 | 0.496 | [9409.38] | False |
| 17 | 39579 | 9384.62 | 0.494 | [9384.62] | False |
| 18 | 42574 | 9384.62 | 0.494 | [9384.62] | False |
| 19 | 45564 | 9384.62 | 0.494 | [9384.62] | False |
| 20 | 47650 | 9384.62 | 0.494 | [9384.62] | False |
| 21 | 49736 | 9384.62 | 0.494 | [9384.62] | False |
| 22 | 57515 | 9384.62 | 0.494 | [9384.62] | False |
| 23 | 83222 | 9384.62 | 0.494 | [9384.62] | True |
| 24 | 124222 | 9384.62 | 0.494 | [9384.62] | True |
| 25 | 124279 | 6582.5 | 0.347 | [6582.5] | True |
| 26 | 124331 | 3192.0 | 0.168 | [2325.69, 866.31] | True |
| 27 | 124357 | 2972.0 | 0.157 | [2325.69, 646.31] | True |
| 28 | 124383 | 2660.06 | 0.140 | [2059.25, 600.81] | True |

## Part-off: tabs and witness (FAILED)

Weakest plane Z-13.2: 2 tab(s), total 2650.78 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 10350.24 mm2 = 21.598% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 9466.95 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 2053.14 | 38.2 | 0.03 40.9 -13.2 |
| 2 | 597.64 | 15.4 | 0.02 -59.87 -13.2 |
- FAILED: tabs total 2650.8 mm2 at the weakest plane Z-13.2 (max 30 mm2)
- FAILED: 2 tab(s) wider than 3 mm in their smallest direction (widest 38.20 mm): not removable by hand
- FAILED: tab witness 21.60% of the surface (10350 mm2; max 1.5%): proud material connected to the tabs covers too much of the part (an unfinished underside counts as tab joint)

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 9427.49 | -49.27 -71.04 0 49.27 71.05 3.29 | (0.0, -0.0, -1.0) | +4.862 / +5.000 | face 1 (plane); face 83 (plane); face 85 (cylinder r0.381) | failed: passes reach the area (line 39499, T5) but leave +4.86 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R2 | proud | 2.49 | -4.09 71.78 3.93 -1.51 72.92 4.32 | (0.24, 0.0, 0.97) | +0.235 / +0.515 | face 249 (plane); face 250 (plane); face 253 (plane) | failed: passes reach the area (line 52178, T4) but leave +0.23 mm on average: stepover / scallop, the tool radius, or a stop short |
| R3 | proud | 2.3 | 47.43 59.6 2.01 48.04 60.58 3.3 | (-0.84, -0.36, 0.41) | +0.176 / +0.223 | face 114 (sphere r1.524); face 143 (cylinder r1.524); face 150 (cylinder r1.524) | failed: passes reach the area (line 38728, T5) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R4 | proud | 2.11 | 9.71 71.74 11.12 11.26 72.87 11.43 | (0.14, 0.14, -0.98) | +0.363 / +1.270 | face 260 (plane); face 259 (plane); face 261 (plane) | failed: passes reach the area (line 52946, T4) but leave +0.36 mm on average: stepover / scallop, the tool radius, or a stop short |
| R5 | proud | 1.92 | -13.97 71.74 10.99 -12.42 72.9 11.43 | (0.53, 0.27, -0.8) | +0.352 / +1.270 | face 239 (plane); face 236 (plane); face 238 (plane) | failed: passes reach the area (line 55750, T4) but leave +0.35 mm on average: stepover / scallop, the tool radius, or a stop short |
| R6 | proud | 1.92 | 14.17 71.94 3.93 14.46 72.86 5.51 | (-1.0, 0.0, 0.0) | +0.329 / +0.527 | face 263 (plane); face 264 (plane); face 262 (plane) | failed: no pass reached this; nearest pass line 52964 (T4, frame 21) missed by 0.066 mm |
| R7 | proud | 1.53 | 47.32 -60.8 2.29 47.98 -60.09 3.14 | (-0.8, 0.48, 0.35) | +0.166 / +0.227 | face 113 (sphere r1.524); face 144 (cylinder r1.524) | failed: passes reach the area (line 38725, T5) but leave +0.17 mm on average: stepover / scallop, the tool radius, or a stop short |
| R8 | proud | 0.96 | -39.81 -72.91 3.73 -39.72 -72.87 6.24 | (-0.39, -0.92, 0.0) | +0.111 / +0.117 | face 76 (cylinder r1.524) | failed: passes reach the area (line 39072, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R9 | proud | 0.96 | 54.73 -77.56 19.39 55.29 -77.13 19.94 | (0.55, -0.62, -0.55) | +0.155 / +0.214 | face 126 (sphere r1.524) | failed: passes reach the area (line 39379, T5) but leave +0.15 mm on average: stepover / scallop, the tool radius, or a stop short |
| R10 | proud | 0.77 | -51.12 61.5 2.07 -51.09 61.57 3.86 | (-0.92, 0.39, 0.0) | +0.114 / +0.123 | face 78 (cylinder r1.524) | failed: passes reach the area (line 39144, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R11 | proud | 0.77 | -51.12 61.51 8.39 -51.09 61.57 9.54 | (-0.92, 0.39, 0.0) | +0.115 / +0.125 | face 78 (cylinder r1.524) | failed: passes reach the area (line 39146, T1) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 0.77 | -39.8 72.87 10.51 -39.71 72.91 12.78 | (-0.39, 0.92, 0.0) | +0.109 / +0.124 | face 79 (cylinder r1.524) | failed: passes reach the area (line 39004, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R13 | proud | 0.77 | 51.1 -61.55 6.71 51.13 -61.49 8.48 | (0.93, -0.37, 0.0) | +0.112 / +0.115 | face 65 (cylinder r1.524) | failed: no pass reached this; nearest pass line 33604 (T3, frame 0) missed by 3.49 mm |
| R14 | proud | 0.77 | 51.1 61.48 6.7 51.13 61.57 8.98 | (0.93, 0.37, 0.0) | +0.110 / +0.123 | face 81 (cylinder r1.524) | failed: passes reach the area (line 38858, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R15 | proud | 0.57 | -55.21 77.07 19.4 -54.77 77.12 19.74 | (-0.53, 0.47, -0.7) | +0.193 / +0.235 | face 124 (sphere r1.524) | failed: passes reach the area (line 39336, T5) but leave +0.19 mm on average: stepover / scallop, the tool radius, or a stop short |
| R16 | proud | 0.57 | -51.13 -61.56 14.52 -51.1 -61.49 16.28 | (-0.93, -0.38, 0.0) | +0.110 / +0.114 | face 77 (cylinder r1.524) | failed: passes reach the area (line 38798, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 0.57 | -51.13 -61.52 5.73 -51.12 -61.48 6.36 | (-0.93, -0.36, 0.0) | +0.111 / +0.123 | face 77 (cylinder r1.524) | failed: passes reach the area (line 38796, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 0.57 | -51.13 61.49 14.1 -51.1 61.56 16.44 | (-0.93, 0.37, 0.0) | +0.110 / +0.114 | face 78 (cylinder r1.524) | failed: passes reach the area (line 38798, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R19 | proud | 0.57 | -39.79 -72.9 0.64 -39.64 -72.63 1.72 | (-0.38, -0.9, -0.23) | +0.114 / +0.114 | face 141 (sphere r1.524); face 76 (cylinder r1.524) | failed: passes reach the area (line 39405, T5) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R20 | proud | 0.57 | -39.8 72.85 1.26 -39.72 72.91 2.96 | (-0.4, 0.91, -0.06) | +0.108 / +0.111 | face 79 (cylinder r1.524); face 138 (sphere r1.524) | failed: passes reach the area (line 39144, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R21 | proud | 0.57 | -39.78 72.88 6.21 -39.77 72.89 6.68 | (-0.39, 0.92, 0.0) | +0.114 / +0.118 | face 79 (cylinder r1.524) | failed: no pass reached this; nearest pass line 28016 (T3, frame 0) missed by 3.492 mm |
| R22 | proud | 0.57 | 39.76 -72.89 15.2 39.8 -72.87 16.24 | (0.4, -0.92, 0.0) | +0.112 / +0.120 | face 75 (cylinder r1.524) | failed: passes reach the area (line 39220, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 0.57 | 39.72 72.87 5.09 39.8 72.9 5.97 | (0.39, 0.92, 0.0) | +0.114 / +0.125 | face 80 (cylinder r1.524) | failed: passes reach the area (line 39290, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R24 | proud | 0.57 | 39.77 72.87 16.33 39.81 72.88 16.99 | (0.41, 0.91, 0.0) | +0.106 / +0.116 | face 80 (cylinder r1.524) | failed: passes reach the area (line 39292, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | proud | 0.38 | -55.02 -77.49 19.8 -54.99 -77.35 19.97 | (-0.57, -0.69, -0.45) | +0.194 / +0.249 | face 125 (sphere r1.524) | failed: passes reach the area (line 39338, T5) but leave +0.19 mm on average: stepover / scallop, the tool radius, or a stop short |
| R26 | proud | 0.38 | -51.11 -61.57 12.83 -51.1 -61.53 12.92 | (-0.91, -0.41, 0.0) | +0.117 / +0.125 | face 77 (cylinder r1.524) | failed: no pass reached this; nearest pass line 30119 (T3, frame 0) missed by 3.491 mm |
| R27 | proud | 0.38 | -51.12 -61.56 9.27 -51.1 -61.5 9.72 | (-0.92, -0.38, 0.0) | +0.113 / +0.113 | face 77 (cylinder r1.524) | failed: no pass reached this; nearest pass line 30095 (T3, frame 0) missed by 3.493 mm |
| R28 | proud | 0.38 | -39.77 -72.91 12.37 -39.72 -72.88 13.41 | (-0.38, -0.92, 0.0) | +0.112 / +0.115 | face 76 (cylinder r1.524) | failed: no pass reached this; nearest pass line 31312 (T3, frame 0) missed by 3.491 mm |
| R29 | proud | 0.38 | -39.74 72.9 16.03 -39.7 72.91 17.3 | (-0.36, 0.93, 0.0) | +0.113 / +0.121 | face 79 (cylinder r1.524) | failed: passes reach the area (line 39004, T1) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R30 | proud | 0.38 | -5.65 71.96 3.93 -5.51 72.92 4.29 | (0.71, 0.0, 0.71) | +0.219 / +0.322 | face 245 (plane); face 244 (plane) | failed: passes reach the area (line 57195, T4) but leave +0.22 mm on average: stepover / scallop, the tool radius, or a stop short |

Cycle time 40.5 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
