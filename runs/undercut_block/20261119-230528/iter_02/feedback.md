# Simulation feedback - iteration 2: undercut_block

**Score: 99.957% of the machinable surface within +-0.1 mm** (all non-datum surface: 80.29%).  Program valid: **YES** (0 errors, 1 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.957 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 0.043 |
| max_gouge_mm | 0.0012 |
| tool_limited_area_pct | 0.056 |
| undercut_area_pct | 19.623 |
| remaining_excess_cm3 | 0.068 |
| gouged_cm3 | 0.0271 |
| removed_cm3 | 45.169 |
| cycle_time_min | 12.63 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.


## Warnings

- line 347: feed per tooth < 0.2x recommended for T2 (rubbing); e.g. line 347: F200 S24000 -> 0.0028 mm/tooth vs recommended 0.04 x5640

## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines (gouge: lines that cut it; proud: closest passes that could have reached it) |
|---|---|---|---|---|---|---|---|---|
| R1 | proud | 1.05 | slope/curved (faces up) | 33 -6.44 21.04 33.57 -6.09 25.04 | +0.143 | +0.217 | face 33 (bspline); face 35 (bspline) | nearest passes: line 1653 T8 missed by 0 mm, line 1654 T8 missed by 0 mm, line 1593 T8 missed by 0 mm |
| R2 | proud | 0.75 | wall (vertical) | 5.17 -16.5 0.01 7.04 -14.95 0.05 | +5.000 | +5.000 | face 22 (cylinder r3.2) | nearest passes: line 379 T2 missed by 0 mm |
| R3 | proud | 0.75 | slope/curved (faces up) | 10.57 -6.44 21.65 10.77 -6.14 23.6 | +0.137 | +0.167 | face 21 (bspline); face 35 (bspline) | nearest passes: line 1157 T8 missed by 0 mm, line 1158 T8 missed by 0 mm, line 1148 T8 missed by 0 mm |
| R4 | proud | 0.6 | wall (vertical) | 32.11 14.86 0.02 34.72 15.42 0.05 | +5.000 | +5.000 | face 25 (cylinder r3.2) | nearest passes: line 455 T2 missed by 0 mm, line 454 T2 missed by 0 mm |
| R5 | proud | 0.45 | wall (vertical) | 8.01 20.57 0.02 9.91 21.2 0.04 | +5.000 | +5.000 | face 24 (cylinder r3.2) | nearest passes: line 493 T2 missed by 0 mm |
| R6 | proud | 0.45 | slope/curved (faces up) | 10.62 6.17 21.7 10.87 6.27 22.94 | +0.139 | +0.163 | face 21 (bspline); face 34 (bspline) | nearest passes: line 940 T8 missed by 0 mm, line 939 T8 missed by 0 mm, line 969 T8 missed by 0.007 mm |
| R7 | proud | 0.45 | slope/curved (faces up) | 10.5 6.34 24.28 10.56 6.68 26.34 | +0.119 | +0.136 | face 34 (bspline); face 21 (bspline) | nearest passes: line 869 T8 missed by 0 mm, line 870 T8 missed by 0 mm, line 854 T8 missed by 0 mm |
| R8 | proud | 0.45 | wall (vertical) | 36.16 18.19 0 37.19 20.36 0.01 | +5.000 | +5.000 | face 25 (cylinder r3.2) | nearest passes: line 455 T2 missed by 0 mm, line 454 T2 missed by 0 mm, line 456 T2 missed by 0 mm |
| R9 | proud | 0.45 | wall (vertical) | 37.07 -18.89 0.03 37.15 -17.45 0.05 | +5.000 | +5.000 | face 23 (cylinder r3.2) | nearest passes: line 416 T2 missed by 0 mm, line 417 T2 missed by 0 mm, line 418 T2 missed by 0 mm |
| R10 | proud | 0.3 | wall (vertical) | 4.81 18.26 0.01 5.38 19.84 0.03 | +5.000 | +5.000 | face 24 (cylinder r3.2) | nearest passes: line 493 T2 missed by 0 mm |
| R11 | proud | 0.3 | wall (vertical) | 6.94 -21.05 0 7.02 -21.02 0.03 | +5.000 | +5.000 | face 22 (cylinder r3.2) | nearest passes: line 379 T2 missed by 0 mm |
| R12 | proud | 0.3 | wall (vertical) | 10.19 6.87 28.53 10.31 6.99 29.88 | +0.121 | +0.123 | face 34 (bspline) | nearest passes: line 799 T8 missed by 0 mm, line 800 T8 missed by 0 mm, line 770 T8 missed by 0.022 mm |
| R13 | proud | 0.3 | floor/top (faces up) | 11.21 5.92 15 11.26 5.97 15 | +5.000 | +5.000 | face 9 (plane z15) | nearest passes: line 518 T3 missed by 0.081 mm, line 517 T3 missed by 0.081 mm, line 225 T1 missed by 1.527 mm |
| R14 | proud | 0.3 | slope/curved (faces up) | 33.5 6.62 26.37 33.81 6.68 27.8 | +0.112 | +0.113 | face 34 (bspline); face 33 (bspline) | nearest passes: line 1261 T8 missed by 0 mm, line 1260 T8 missed by 0 mm, line 1295 T8 missed by 0 mm |
| R15 | proud | 0.3 | slope/curved (faces up) | 33.73 6.77 29.13 33.92 6.94 29.32 | +0.127 | +0.152 | face 34 (bspline); face 33 (bspline) | nearest passes: line 1226 T8 missed by 0 mm, line 1225 T8 missed by 0 mm, line 1231 T8 missed by 0.007 mm |
| R16 | proud | 0.15 | wall (vertical) | 5.08 -19.31 0.04 5.08 -19.31 0.04 | +5.000 | +5.000 | face 22 (cylinder r3.2) | nearest passes: line 379 T2 missed by 0 mm |
| R17 | proud | 0.15 | wall (vertical) | 9.85 -15.39 0.02 9.85 -15.39 0.02 | +5.000 | +5.000 | face 22 (cylinder r3.2) | nearest passes: line 379 T2 missed by 0 mm |
| R18 | proud | 0.15 | wall (vertical) | 10.3 -6.89 28.78 10.3 -6.89 28.78 | +0.103 | +0.103 | face 35 (bspline) | nearest passes: line 1012 T8 missed by 0 mm, line 1013 T8 missed by 0 mm, line 1017 T8 missed by 0.006 mm |
| R19 | proud | 0.15 | floor/top (faces up) | 10.86 -5.23 15 10.86 -5.23 15 | +5.000 | +5.000 | face 9 (plane z15) | nearest passes: line 518 T3 missed by 0.018 mm, line 519 T3 missed by 0.018 mm, line 226 T1 missed by 1.356 mm |
| R20 | proud | 0.15 | floor/top (faces up) | 32.77 6.01 15 32.77 6.01 15 | +5.000 | +5.000 | face 9 (plane z15) | nearest passes: line 516 T3 missed by 0.175 mm, line 517 T3 missed by 0.175 mm, line 224 T1 missed by 1.618 mm |
| R21 | proud | 0.15 | wall (vertical) | 31.9 20.42 0.03 31.9 20.42 0.03 | +5.000 | +5.000 | face 25 (cylinder r3.2) | nearest passes: line 455 T2 missed by 0 mm |
| R22 | proud | 0.15 | wall (vertical) | 33.59 -6.79 27.55 33.59 -6.79 27.55 | +0.107 | +0.107 | face 35 (bspline) | nearest passes: line 1489 T8 missed by 0 mm, line 1488 T8 missed by 0 mm, line 1494 T8 missed by 0 mm |
| R23 | proud | 0.15 | floor/top (faces up) | 33.03 -5.5 15 33.03 -5.5 15 | +5.000 | +5.000 | face 9 (plane z15) | nearest passes: line 520 T3 missed by 0.038 mm, line 519 T3 missed by 0.038 mm, line 228 T1 missed by 1.452 mm |
| R24 | proud | 0.15 | wall (vertical) | 33.28 6.17 21.73 33.28 6.17 21.73 | +0.209 | +0.209 | face 33 (bspline) | nearest passes: line 1416 T8 missed by 0.019 mm, line 1415 T8 missed by 0.019 mm, line 1421 T8 missed by 0.043 mm |
| R25 | proud | 0.15 | wall (vertical) | 33.84 -6.99 29.89 33.84 -6.99 29.89 | +0.147 | +0.147 | face 35 (bspline) | nearest passes: line 1439 T8 missed by 0.03 mm, line 1438 T8 missed by 0.03 mm, line 1444 T8 missed by 0.054 mm |
| R26 | proud | 0.15 | wall (vertical) | 35.32 -15.09 0.02 35.32 -15.09 0.02 | +5.000 | +5.000 | face 23 (cylinder r3.2) | nearest passes: line 417 T2 missed by 0 mm |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 140.3 | 6612.0 | 40.242 |
| T2 | 6 mm 3-flute flat endmill | 73.4 | 696.3 | 1.692 |
| T3 | 3 mm 2-flute flat endmill | 13.5 | 181.1 | 0.117 |
| T4 | 1.5 mm 2-flute flat endmill | 196.8 | 1546.7 | 0.072 |
| T6 | 6 mm ball endmill | 124.5 | 2954.5 | 0.377 |
| T8 | 1 mm ball endmill | 97.8 | 538.2 | 0.003 |
| T9 | 6 mm 90deg chamfer mill | 31.1 | 253.7 | 0.391 |
| T10 | 5 mm drill 118deg | 16.3 | 143.2 | 2.276 |

Moves: 10303, cut length 12926 mm, rapid length 4998 mm, estimated cycle time 12.6 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
