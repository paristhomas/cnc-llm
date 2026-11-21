# Simulation feedback - iteration 6: ctc04_x0p2 (3+2)

**Score: 99.180% of the whole part surface within +-0.1 mm.** Program valid: **YES** (0 errors, 0 warnings). Not scored: tab witness 0.15% and the 0.03 mm face-edge band 1.32% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 99.18 |
| whole_surface_gouge_pct | 0.0 |
| whole_surface_proud_pct | 0.82 |
| proud_area_mm2 | 330.92 |
| gouge_area_mm2 | 0.0 |
| max_gouge_mm | 0.0212 |
| max_proud_mm | 5.0 |
| tab_witness_pct | 0.146 |
| tabs | 2 |
| tab_total_mm2 | 23.92 |
| tab_max_width_mm | 2.6 |
| partoff_ok | True |
| setups | 6 |
| distinct_orientations | 3 |
| cycle_time_min | 114.32 |

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 13-99863 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T7, T8 | 189303 | 308.061 |
| 2 | 99870-100514 | (-0.9272, 0.3746, 0.0) | 90 / 158 | T2, T3, T4 | 25559 | 0.421 |
| 3 | 100521-132188 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4, T9 | 113330 | 91.435 |
| 4 | 132195-132564 | (-1.0, -0.0, 0.0) | 90 / -180 | T2 | 368 | 23.902 |
| 5 | 132571-132601 | (-1.0, -0.0, 0.0) | 90 / -180 | T4 | 1504 | 0.014 |
| 6 | 132609-132977 | (1.0, -0.0, 0.0) | 90 / -0 | T2, T3 | 354 | 5.367 |

## Rigidity / part-off (connection area in the stub gap; stock section 5203.6 mm2; part-off marker at line 132184)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 99863 | 5184.0 | 0.996 | [5184.0] | False |
| 2 | 100514 | 5184.0 | 0.996 | [5184.0] | False |
| 3 | 132188 | 5184.0 | 0.996 | [5184.0] | False |
| 4 | 132564 | 1174.5 | 0.226 | [1174.5] | True |
| 5 | 132601 | 1174.5 | 0.226 | [1174.5] | True |
| 6 | 132977 | 35.75 | 0.007 | [17.88, 17.88] | True |

## Part-off: tabs and witness (OK)

Weakest plane Z-1.7: 2 tab(s), total 23.92 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 59.96 mm2 = 0.146% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 29.32 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 11.96 | 2.6 | 10.04 -62 -1.7 |
| 2 | 11.96 | 2.6 | 10.04 -10 -1.7 |

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 35.22 | 8.49 -77.97 14 11.56 -77.6 25.37 | (0.04, -1.0, -0.04) | +2.610 / +5.000 | face 499 (plane); face 484 (plane); face 511 (plane) | failed: passes reach the area (line 116414, T2) but leave +2.61 mm on average: stepover / scallop, the tool radius, or a stop short |
| R2 | proud | 33.26 | -9.54 41.5 42.1 -7.54 43.5 47.44 | (0.86, 0.51, -0.0) | +4.668 / +5.000 | face 159 (cylinder r1); face 160 (cylinder r1) | failed: no pass reached this; nearest pass line 47509 (T2, frame 1) missed by 0.099 mm; the harness's quick reach search found no tool for 83% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R3 | proud | 31.45 | -9.54 41.5 52.6 -7.54 43.5 57.95 | (-0.91, 0.42, 0.0) | +4.641 / +5.000 | face 164 (cylinder r1); face 163 (cylinder r1) | failed: no pass reached this; nearest pass line 97888 (T7, frame 1) missed by 0.176 mm; the harness's quick reach search found no tool for 86% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R4 | proud | 30.8 | -9.54 1.5 52.54 -7.54 3.5 57.95 | (-0.56, 0.83, -0.0) | +4.646 / +5.000 | face 157 (cylinder r1); face 158 (cylinder r1) | failed: passes reach the area (line 90236, T3) but leave +4.65 mm on average: stepover / scallop, the tool radius, or a stop short; the harness's quick reach search found no tool for 91% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R5 | proud | 29.0 | -9.54 1.5 42.05 -7.54 3.5 47.41 | (-1.0, -0.03, 0.0) | +4.608 / +5.000 | face 152 (cylinder r1); face 153 (cylinder r1) | failed: no pass reached this; nearest pass line 90567 (T3, frame 1) missed by 0.191 mm; the harness's quick reach search found no tool for 85% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R6 | proud | 12.45 | 8.77 2.7 0.44 11.34 6.44 2.56 | (0.0, 0.5, -0.87) | +0.191 / +0.201 | face 245 (plane); face 233 (cylinder r5) | failed: passes reach the area (line 132927, T3) but leave +0.19 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R7 | proud | 8.35 | 0.02 -23.39 65.8 4.3 -22.07 66.98 | (-0.18, 0.7, 0.7) | +0.191 / +0.283 | face 443 (cylinder r1); face 426 (sphere r1); face 456 (cone) | failed: no pass reached this; nearest pass line 95915 (T3, frame 1) missed by 0.058 mm |
| R8 | proud | 7.86 | -0.16 -23.4 79.56 4.3 -22.27 80.93 | (-0.32, 0.66, -0.68) | +0.180 / +0.262 | face 444 (cylinder r1); face 424 (sphere r1); face 446 (cone) | failed: passes reach the area (line 95504, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R9 | proud | 7.7 | -0.19 -23.43 18.99 4.31 -22.15 20.43 | (-0.26, 0.68, 0.68) | +0.182 / +0.225 | face 468 (cylinder r1); face 430 (sphere r1); face 471 (cone) | failed: passes reach the area (line 95312, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R10 | proud | 7.54 | -0.19 -23.5 33.11 4.26 -22.49 34.2 | (-0.26, 0.7, -0.67) | +0.185 / +0.273 | face 467 (cylinder r1); face 432 (sphere r1); face 481 (cone) | failed: passes reach the area (line 95320, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R11 | proud | 7.04 | 9.96 58.25 58 12.98 59.54 59.51 | (0.28, -0.66, 0.7) | +0.182 / +0.242 | face 392 (cylinder r1); face 388 (sphere r1); face 389 (cylinder r1) | failed: passes reach the area (line 123469, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 6.06 | 8.76 -77.01 0.46 11.36 -75.1 2.01 | (0.0, -0.64, -0.76) | +0.236 / +0.381 | face 235 (cylinder r5) | failed: passes reach the area (line 132515, T2) but leave +0.24 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R13 | proud | 6.06 | 9.93 -60.46 58 12.91 -59.02 59.41 | (0.31, 0.76, 0.56) | +0.184 / +0.248 | face 391 (cylinder r1); face 384 (cylinder r1); face 390 (sphere r1) | failed: passes reach the area (line 126388, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R14 | proud | 5.41 | -0.1 1.98 75.88 3.98 2.58 76.61 | (-0.17, -0.71, -0.69) | +0.138 / +0.168 | face 435 (cylinder r1); face 407 (sphere r1); face 450 (cone) | failed: passes reach the area (line 95403, T3) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R15 | proud | 5.41 | 9.95 -60.46 14 12.96 -59.15 15.18 | (0.36, 0.63, 0.69) | +0.181 / +0.244 | face 380 (cylinder r1); face 376 (sphere r1); face 374 (cylinder r1) | failed: passes reach the area (line 122376, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R16 | proud | 5.41 | 9.93 -60.46 40.47 12.99 -59.24 42 | (0.33, 0.64, -0.7) | +0.203 / +0.280 | face 379 (cylinder r1); face 378 (sphere r1); face 372 (cylinder r1) | failed: passes reach the area (line 127050, T3) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 5.41 | 9.93 58.5 41.05 12.99 59.54 41.99 | (0.22, -0.82, -0.53) | +0.198 / +0.256 | face 357 (cylinder r1); face 356 (sphere r1); face 372 (cylinder r1) | failed: passes reach the area (line 117942, T3) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 5.08 | 9.93 58.43 27.02 13 59.54 28.38 | (0.26, -0.76, 0.59) | +0.216 / +0.269 | face 369 (cylinder r1); face 363 (sphere r1); face 362 (cylinder r1) | failed: passes reach the area (line 128768, T3) but leave +0.22 mm on average: stepover / scallop, the tool radius, or a stop short |
| R19 | proud | 4.91 | 9.9 58.46 71.76 13.03 59.49 73 | (0.33, -0.69, -0.64) | +0.186 / +0.257 | face 354 (cylinder r1); face 353 (sphere r1); face 386 (cylinder r1) | failed: passes reach the area (line 121599, T3) but leave +0.19 mm on average: stepover / scallop, the tool radius, or a stop short |
| R20 | proud | 4.75 | 0.12 1.59 70.01 4.29 2.59 70.96 | (-0.25, -0.77, 0.59) | +0.134 / +0.190 | face 438 (cylinder r1); face 416 (sphere r1); face 415 (cylinder r1) | failed: passes reach the area (line 97155, T3) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R21 | proud | 4.26 | 10.15 71.43 78.94 10.66 73.4 80.7 | (-1.0, 0.01, 0.02) | +0.390 / +0.699 | face 65 (cone); face 66 (cone) | failed: passes reach the area (line 99857, T4) but leave +0.39 mm on average: stepover / scallop, the tool radius, or a stop short |
| R22 | proud | 4.1 | 0.29 1.36 29.18 4.27 2.58 29.97 | (-0.21, -0.81, -0.55) | +0.146 / +0.164 | face 458 (cylinder r1); face 412 (sphere r1); face 411 (cylinder r1) | failed: passes reach the area (line 97611, T3) but leave +0.15 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 4.1 | 1.7 -48.58 30.16 2.25 -47.31 31.91 | (-0.94, 0.32, 0.08) | +0.382 / +0.621 | face 90 (cone); face 91 (cone) | failed: no pass reached this; nearest pass line 73926 (T2, frame 1) missed by 13.137 mm |
| R24 | proud | 3.77 | -1.16 -55.26 30.04 -0.43 -53.73 31.93 | (-0.92, 0.35, 0.2) | +0.339 / +0.661 | face 86 (cone); face 85 (cone) | failed: passes reach the area (line 100192, T4) but leave +0.34 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | proud | 3.77 | -0.07 1.7 23.35 4.31 2.58 24.35 | (-0.25, -0.8, 0.54) | +0.137 / +0.170 | face 463 (cylinder r1); face 418 (sphere r1); face 475 (cone) | failed: passes reach the area (line 95453, T3) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R26 | proud | 3.77 | 1.43 -48.81 68.11 2.28 -47.41 69.78 | (-0.94, 0.3, -0.18) | +0.410 / +0.758 | face 71 (cone); face 72 (cone) | failed: no pass reached this; nearest pass line 75966 (T2, frame 1) missed by 13.146 mm |
| R27 | proud | 3.6 | 10.01 -60.44 84.85 12.92 -59.42 86 | (0.24, 0.65, -0.72) | +0.211 / +0.273 | face 343 (cylinder r1); face 342 (sphere r1); face 384 (cylinder r1) | failed: passes reach the area (line 124629, T3) but leave +0.21 mm on average: stepover / scallop, the tool radius, or a stop short |
| R28 | proud | 3.44 | -6.22 37.67 54.6 -5.58 38.66 55.91 | (-0.84, -0.43, -0.32) | +0.585 / +3.535 | face 138 (cylinder r0.6647); face 114 (cone); face 93 (cone) | failed: passes reach the area (line 99069, T8) but leave +0.58 mm on average: stepover / scallop, the tool radius, or a stop short |
| R29 | proud | 3.44 | 1.96 -42.31 30.16 2.54 -40.91 31.83 | (-0.91, 0.4, 0.02) | +0.318 / +0.588 | face 81 (cone); face 116 (cone) | failed: passes reach the area (line 100250, T4) but leave +0.32 mm on average: stepover / scallop, the tool radius, or a stop short |
| R30 | proud | 3.28 | 10.18 -73.89 4.5 10.58 -72.08 5.79 | (-1.0, -0.04, -0.0) | +0.374 / +0.612 | face 248 (cone); face 0 (cone) | failed: no pass reached this; nearest pass line 116360 (T2, frame 3) missed by 4.137 mm |

Cycle time 114.3 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
