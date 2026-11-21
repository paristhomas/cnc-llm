# Simulation feedback: ctc04_x0p2 (3+2)

**Score: 99.061% of the whole part surface within +-0.1 mm.** Program valid: **NO** (1 errors, 0 warnings). Not scored: tab witness 0.00% and the 0.03 mm face-edge band 0.00% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 99.061 |
| whole_surface_gouge_pct | 0.0 |
| whole_surface_proud_pct | 0.939 |
| proud_area_mm2 | 384.49 |
| gouge_area_mm2 | 0.0 |
| max_gouge_mm | 0.0212 |
| max_proud_mm | 5.0 |
| tab_witness_pct | 0.0 |
| tabs | 2 |
| tab_total_mm2 | 23.92 |
| tab_max_width_mm | 2.6 |
| partoff_ok | False |
| setups | 6 |
| distinct_orientations | 3 |
| cycle_time_min | 114.32 |

## Errors (must be fixed)

- line 132977: part-off: tabs total 31.2 mm2 at Z-0.2 between the weakest plane and the part (max 30 mm2 at every height up to 0.2 mm below the part)

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

## Part-off: tabs and witness (FAILED)

Weakest plane Z-1.7: 2 tab(s), total 23.92 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 59.96 mm2 = 0.146% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 29.32 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 11.96 | 2.6 | 10.04 -62 -1.7 |
| 2 | 11.96 | 2.6 | 10.04 -10 -1.7 |
- FAILED: tabs total 31.2 mm2 at Z-0.2 between the weakest plane and the part (max 30 mm2 at every height up to 0.2 mm below the part)

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 42.27 | 8.47 -78 14 11.56 -77.6 25.37 | (-0.01, -1.0, -0.04) | +2.554 / +5.000 | face 499 (plane); face 484 (plane); face 511 (plane) | failed: a pass (line 116414, T2) touches the edge of this area but +2.55 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined |
| R2 | proud | 33.75 | -9.54 41.5 42.1 -7.54 43.5 47.44 | (0.91, 0.41, -0.0) | +4.671 / +5.000 | face 159 (cylinder r1); face 160 (cylinder r1) | failed: no pass reached this; nearest pass line 90641 (T3, frame 1) missed by 0.145 mm; the harness's quick reach search found no tool for 83% of it (smallest tools, 26 cube directions + feature axes); the search is coarse, so try another direction, a longer or smaller library tool, or a different fixture orientation (the area is scored either way) |
| R3 | proud | 32.93 | -9.54 41.5 52.5 -7.54 43.5 58 | (-0.89, 0.41, 0.2) | +4.651 / +5.000 | face 164 (cylinder r1); face 163 (cylinder r1); face 313 (plane) | failed: a pass (line 89183, T3) touches the edge of this area but +4.65 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined; the harness's quick reach search found no tool for 84% of it (smallest tools, 26 cube directions + feature axes); the search is coarse, so try another direction, a longer or smaller library tool, or a different fixture orientation (the area is scored either way) |
| R4 | proud | 31.13 | -9.54 1.5 52.54 -7.54 3.5 57.95 | (-0.45, 0.89, -0.0) | +4.649 / +5.000 | face 157 (cylinder r1); face 158 (cylinder r1) | failed: no pass reached this; nearest pass line 90236 (T3, frame 1) missed by 0.151 mm; the harness's quick reach search found no tool for 91% of it (smallest tools, 26 cube directions + feature axes); the search is coarse, so try another direction, a longer or smaller library tool, or a different fixture orientation (the area is scored either way) |
| R5 | proud | 30.14 | -9.54 1.5 42.01 -7.54 3.5 47.41 | (-0.99, -0.13, 0.0) | +4.621 / +5.000 | face 152 (cylinder r1); face 153 (cylinder r1) | failed: a pass (line 47361, T2) touches the edge of this area but +4.62 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined; the harness's quick reach search found no tool for 85% of it (smallest tools, 26 cube directions + feature axes); the search is coarse, so try another direction, a longer or smaller library tool, or a different fixture orientation (the area is scored either way) |
| R6 | proud | 15.56 | 8.82 -13.12 0 11.31 -6.83 0 | (0.0, 0.0, -1.0) | +3.632 / +5.000 | face 234 (plane) | failed: a pass (line 132682, T2) touches the edge of this area but +3.63 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R7 | proud | 13.76 | 8.82 -65.13 0 11.36 -58.8 0 | (0.0, 0.0, -1.0) | +4.185 / +5.000 | face 234 (plane) | failed: a pass (line 132682, T2) touches the edge of this area but +4.18 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R8 | proud | 12.61 | 8.77 2.7 0.44 11.34 6.44 2.56 | (0.0, 0.5, -0.87) | +0.191 / +0.201 | face 245 (plane); face 233 (cylinder r5) | failed: passes reach the area (line 132556, T2) but leave +0.19 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R9 | proud | 8.35 | -0.19 -23.5 33.11 4.29 -22.49 34.2 | (-0.28, 0.7, -0.66) | +0.183 / +0.273 | face 467 (cylinder r1); face 432 (sphere r1); face 481 (cone) | failed: passes reach the area (line 95319, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R10 | proud | 8.35 | 0.02 -23.39 65.8 4.3 -22.07 66.98 | (-0.18, 0.7, 0.7) | +0.191 / +0.283 | face 443 (cylinder r1); face 426 (sphere r1); face 456 (cone) | failed: no pass reached this; nearest pass line 95915 (T3, frame 1) missed by 0.058 mm |
| R11 | proud | 8.19 | -0.19 -23.43 18.99 4.31 -22.15 20.43 | (-0.27, 0.65, 0.71) | +0.179 / +0.225 | face 468 (cylinder r1); face 430 (sphere r1); face 428 (cylinder r1) | failed: passes reach the area (line 95313, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 8.03 | -0.16 -23.4 79.56 4.3 -22.27 80.93 | (-0.32, 0.68, -0.67) | +0.179 / +0.262 | face 444 (cylinder r1); face 424 (sphere r1); face 446 (cone) | failed: passes reach the area (line 97138, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R13 | proud | 7.54 | 9.96 58.25 58 12.98 59.54 59.51 | (0.33, -0.66, 0.67) | +0.184 / +0.242 | face 392 (cylinder r1); face 388 (sphere r1); face 389 (cylinder r1) | failed: passes reach the area (line 126993, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R14 | proud | 6.23 | 9.93 -60.46 58 12.91 -59.02 59.41 | (0.31, 0.78, 0.55) | +0.184 / +0.248 | face 391 (cylinder r1); face 384 (cylinder r1); face 390 (sphere r1) | failed: passes reach the area (line 118562, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R15 | proud | 6.06 | 8.76 -77.01 0.46 11.36 -75.1 2.01 | (0.0, -0.64, -0.76) | +0.236 / +0.381 | face 235 (cylinder r5) | failed: passes reach the area (line 132515, T2) but leave +0.24 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R16 | proud | 5.9 | 9.93 -60.46 40.47 13.06 -59.24 42 | (0.34, 0.61, -0.72) | +0.203 / +0.280 | face 379 (cylinder r1); face 378 (sphere r1); face 372 (cylinder r1) | failed: passes reach the area (line 107009, T2) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 5.9 | 9.93 58.5 40.98 12.99 59.54 41.99 | (0.25, -0.81, -0.53) | +0.196 / +0.256 | face 357 (cylinder r1); face 356 (sphere r1); face 362 (cylinder r1) | failed: passes reach the area (line 123438, T3) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 5.73 | -0.1 1.91 75.88 3.98 2.58 76.63 | (-0.18, -0.69, -0.7) | +0.138 / +0.168 | face 435 (cylinder r1); face 407 (sphere r1); face 450 (cone) | failed: passes reach the area (line 95642, T3) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R19 | proud | 5.73 | 9.93 58.43 27.02 13.06 59.54 28.38 | (0.3, -0.76, 0.58) | +0.213 / +0.269 | face 369 (cylinder r1); face 363 (sphere r1); face 362 (cylinder r1) | failed: passes reach the area (line 107063, T2) but leave +0.21 mm on average: stepover / scallop, the tool radius, or a stop short |
| R20 | proud | 5.41 | 9.95 -60.46 14 12.96 -59.15 15.18 | (0.36, 0.63, 0.69) | +0.181 / +0.244 | face 380 (cylinder r1); face 376 (sphere r1); face 374 (cylinder r1) | failed: passes reach the area (line 122376, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R21 | proud | 5.41 | 9.9 58.46 71.76 13.03 59.49 73 | (0.39, -0.66, -0.64) | +0.183 / +0.257 | face 354 (cylinder r1); face 353 (sphere r1); face 387 (plane) | failed: passes reach the area (line 121599, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R22 | proud | 5.24 | 0.06 1.59 70.01 4.29 2.59 70.96 | (-0.3, -0.74, 0.61) | +0.133 / +0.190 | face 438 (cylinder r1); face 416 (sphere r1); face 415 (cylinder r1) | failed: passes reach the area (line 97155, T3) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 4.91 | 0.05 1.36 29.06 4.31 2.6 29.97 | (-0.29, -0.82, -0.5) | +0.142 / +0.164 | face 458 (cylinder r1); face 412 (sphere r1); face 461 (plane) | failed: passes reach the area (line 97638, T3) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R24 | proud | 4.26 | 1.43 -48.81 68.11 2.28 -47.41 69.78 | (-0.93, 0.32, -0.18) | +0.425 / +0.758 | face 71 (cone); face 72 (cone) | failed: no pass reached this; nearest pass line 75966 (T2, frame 1) missed by 13.146 mm |
| R25 | proud | 4.26 | 1.7 -48.58 30.16 2.31 -47.31 31.91 | (-0.94, 0.33, 0.05) | +0.391 / +0.621 | face 90 (cone); face 91 (cone) | failed: no pass reached this; nearest pass line 73926 (T2, frame 1) missed by 13.137 mm |
| R26 | proud | 4.26 | 10.15 71.43 78.94 10.66 73.4 80.7 | (-1.0, 0.01, 0.02) | +0.390 / +0.699 | face 65 (cone); face 66 (cone) | failed: passes reach the area (line 99857, T4) but leave +0.39 mm on average: stepover / scallop, the tool radius, or a stop short |
| R27 | proud | 4.1 | 9.9 -60.46 84.83 13.05 -59.42 86 | (0.27, 0.65, -0.71) | +0.211 / +0.273 | face 343 (cylinder r1); face 342 (sphere r1); face 346 (plane) | failed: passes reach the area (line 128201, T3) but leave +0.21 mm on average: stepover / scallop, the tool radius, or a stop short |
| R28 | proud | 3.93 | -1.16 -55.26 29.8 -0.43 -53.73 31.93 | (-0.91, 0.34, 0.25) | +0.332 / +0.661 | face 86 (cone); face 85 (cone); face 84 (cylinder r1.2) | failed: passes reach the area (line 100192, T4) but leave +0.33 mm on average: stepover / scallop, the tool radius, or a stop short |
| R29 | proud | 3.93 | -0.07 1.7 23.35 4.31 2.6 24.35 | (-0.24, -0.82, 0.52) | +0.135 / +0.170 | face 463 (cylinder r1); face 418 (sphere r1); face 475 (cone) | failed: passes reach the area (line 95453, T3) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R30 | proud | 3.77 | -6.22 37.67 54.6 -5.58 38.66 55.91 | (-0.87, -0.43, -0.26) | +0.698 / +3.535 | face 138 (cylinder r0.6647); face 114 (cone); face 139 (cylinder r0.6647) | failed: a pass (line 99069, T8) touches the edge of this area but +0.70 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined |
| R31 | proud | 3.77 | 10.18 -73.89 4.5 10.69 -72.08 5.79 | (-1.0, -0.02, -0.02) | +0.383 / +0.612 | face 0 (cone); face 248 (cone) | failed: no pass reached this; nearest pass line 116360 (T2, frame 3) missed by 4.137 mm |
| R32 | proud | 3.6 | -1.24 -55.39 67.92 -0.41 -53.65 70.05 | (-0.88, 0.48, -0.01) | +0.311 / +0.690 | face 77 (cone); face 76 (cone); face 75 (cylinder r1.2) | failed: passes reach the area (line 100392, T4) but leave +0.31 mm on average: stepover / scallop, the tool radius, or a stop short |
| R33 | proud | 3.6 | 1.96 -42.31 30.16 2.54 -40.91 31.83 | (-0.91, 0.41, -0.01) | +0.325 / +0.588 | face 81 (cone); face 116 (cone) | failed: passes reach the area (line 100250, T4) but leave +0.33 mm on average: stepover / scallop, the tool radius, or a stop short |
| R34 | proud | 3.28 | -6.23 -11.66 44.1 -5.58 -10.34 45.3 | (-0.94, -0.03, 0.34) | +0.981 / +5.000 | face 103 (cone); face 118 (cylinder r0.6647); face 104 (cone) | failed: a pass (line 97999, T8) touches the edge of this area but +0.98 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined |
| R35 | proud | 3.11 | -6.21 46.39 44.09 -5.63 47.42 45.41 | (-0.99, 0.05, 0.15) | +0.287 / +0.476 | face 97 (cone); face 131 (cylinder r0.6647); face 110 (cone) | failed: passes reach the area (line 98534, T8) but leave +0.29 mm on average: stepover / scallop, the tool radius, or a stop short |
| R36 | proud | 2.95 | -6.21 46.43 54.66 -5.55 47.42 55.91 | (-0.99, -0.09, -0.12) | +0.691 / +3.420 | face 92 (cone); face 115 (cone); face 141 (cylinder r0.6647) | failed: a pass (line 99176, T8) touches the edge of this area but +0.69 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined |
| R37 | proud | 2.78 | -6.22 -2.6 44.09 -5.65 -1.35 45.29 | (-0.8, -0.41, 0.44) | +0.277 / +0.458 | face 120 (cylinder r0.6647); face 105 (cone); face 121 (cylinder r0.6647) | failed: passes reach the area (line 98106, T8) but leave +0.28 mm on average: stepover / scallop, the tool radius, or a stop short |
| R38 | proud | 2.78 | -6.23 28.37 54.59 -5.59 29.63 55.91 | (-1.0, 0.07, 0.04) | +0.852 / +5.000 | face 94 (cone); face 137 (cylinder r0.6647); face 136 (cylinder r0.6647) | failed: a pass (line 98959, T8) touches the edge of this area but +0.85 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined |
| R39 | proud | 2.78 | -5.26 -60.04 68.22 -4.54 -58.77 69.61 | (-0.86, 0.47, 0.2) | +0.305 / +0.494 | face 142 (cone); face 79 (cone) | failed: no pass reached this; nearest pass line 53023 (T2, frame 1) missed by 3.021 mm |
| R40 | proud | 2.62 | -6.23 -11.61 54.59 -5.71 -10.46 55.86 | (-0.88, 0.01, 0.48) | +0.280 / +0.391 | face 129 (cylinder r0.6647); face 128 (cylinder r0.6647); face 98 (cone) | failed: passes reach the area (line 98640, T8) but leave +0.28 mm on average: stepover / scallop, the tool radius, or a stop short |
| R41 | proud | 2.62 | -5.46 -60.16 30.21 -4.62 -58.62 31.33 | (-0.77, 0.58, 0.26) | +0.261 / +0.591 | face 80 (cone); face 117 (cone); face 151 (cylinder r1.0106) | failed: passes reach the area (line 100308, T4) but leave +0.26 mm on average: stepover / scallop, the tool radius, or a stop short |
| R42 | proud | 2.46 | -6.23 28.4 44.15 -5.59 29.58 45.41 | (-0.89, -0.43, -0.15) | +0.881 / +5.000 | face 134 (cylinder r0.6647); face 112 (cone); face 95 (cone) | failed: a pass (line 98319, T8) touches the edge of this area but +0.88 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined |
| R43 | proud | 2.29 | -6.2 -2.48 54.59 -5.75 -1.34 55.84 | (-0.74, -0.64, 0.21) | +1.535 / +4.883 | face 126 (cylinder r0.6647); face 127 (cylinder r0.6647); face 108 (cone) | failed: a pass (line 98748, T8) touches the edge of this area but +1.53 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined |
| R44 | proud | 2.29 | 1.71 -42.4 68.25 2.57 -40.97 69.58 | (-0.9, 0.43, -0.0) | +0.256 / +0.647 | face 143 (cone); face 78 (cone); face 168 (cylinder r1.0106) | failed: passes reach the area (line 100450, T4) but leave +0.26 mm on average: stepover / scallop, the tool radius, or a stop short |
| R45 | proud | 2.13 | -6.23 6.42 54.65 -5.78 7.64 55.9 | (-0.8, -0.54, -0.26) | +0.596 / +5.000 | face 107 (cone); face 124 (cylinder r0.6647); face 125 (cylinder r0.6647) | failed: a pass (line 98853, T8) touches the edge of this area but +0.60 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined |
| R46 | proud | 2.13 | -6.22 37.42 44.11 -5.61 38.61 45.41 | (-0.98, 0.04, -0.18) | +1.183 / +5.000 | face 96 (cone); face 132 (cylinder r0.6647); face 111 (cone) | failed: a pass (line 98425, T8) touches the edge of this area but +1.18 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined |
| R47 | proud | 1.64 | -6.23 6.38 44.16 -5.65 7.64 45.03 | (-0.93, -0.03, 0.36) | +0.757 / +5.000 | face 123 (cylinder r0.6647); face 101 (cone); face 106 (cone) | failed: a pass (line 98213, T8) touches the edge of this area but +0.76 mm is left on average: the pass stops short of it, the tool cannot form this shape, or the feature was not machined |

Cycle time 114.3 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
