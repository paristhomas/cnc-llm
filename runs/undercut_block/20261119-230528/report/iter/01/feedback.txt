# Simulation feedback - iteration 1: undercut_block

**Score: 99.876% of the machinable surface within +-0.1 mm** (all non-datum surface: 80.22%).  Program valid: **NO** (1 errors, 1 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.876 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 0.124 |
| max_gouge_mm | 0.0012 |
| tool_limited_area_pct | 0.056 |
| undercut_area_pct | 19.623 |
| remaining_excess_cm3 | 0.071 |
| gouged_cm3 | 0.0268 |
| removed_cm3 | 45.166 |
| cycle_time_min | 10.86 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.

## Errors (the program would crash, break a tool or is not executable) - must be fixed

- line 220: rapid (G0) move removes material - crash; first at line 220: move (15.79, 0.00, 35.00) -> (15.79, 0.00, 17.00) with T1, removed 1.925 mm3, max 4.010 mm deep x1 (lines 220)

## Warnings

- line 346: feed per tooth < 0.2x recommended for T2 (rubbing); e.g. line 346: F200 S24000 -> 0.0028 mm/tooth vs recommended 0.04 x5640

## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines (gouge: lines that cut it; proud: closest passes that could have reached it) |
|---|---|---|---|---|---|---|---|---|
| R1 | proud | 4.8 | slope/curved (faces up) | 32.92 -6.99 21.04 33.9 -6.09 29.89 | +0.209 | +0.361 | face 33 (bspline); face 35 (bspline) | nearest passes: line 656 T4 missed by 0.002 mm, line 657 T4 missed by 0.002 mm, line 616 T4 missed by 0.028 mm |
| R2 | proud | 4.5 | slope/curved (faces up) | 10.13 6.01 21.44 11.09 6.99 29.89 | +0.201 | +0.394 | face 34 (bspline); face 21 (bspline) | nearest passes: line 214 T1 missed by 0.011 mm, line 632 T4 missed by 0.012 mm, line 633 T4 missed by 0.012 mm |
| R3 | proud | 3.9 | slope/curved (faces up) | 10.09 -6.99 21.65 10.97 -6.1 29.91 | +0.198 | +0.393 | face 35 (bspline); face 21 (bspline) | nearest passes: line 556 T4 missed by 0.007 mm, line 555 T4 missed by 0.007 mm, line 716 T4 missed by 0.029 mm |
| R4 | proud | 2.25 | slope/curved (faces up) | 33.36 6.31 25.33 33.92 6.97 29.66 | +0.222 | +0.328 | face 34 (bspline); face 33 (bspline) | nearest passes: line 612 T4 missed by 0.027 mm, line 611 T4 missed by 0.027 mm, line 601 T4 missed by 0.05 mm |
| R5 | proud | 1.05 | slope/curved (faces up) | 33.1 6.03 21.73 33.41 6.42 23.34 | +0.245 | +0.458 | face 33 (bspline); face 34 (bspline) | nearest passes: line 214 T1 missed by 0.025 mm, line 701 T4 missed by 0.059 mm, line 702 T4 missed by 0.059 mm |
| R6 | proud | 0.75 | wall (vertical) | 5.17 -16.5 0.01 7.04 -14.95 0.05 | +5.000 | +5.000 | face 22 (cylinder r3.2) | nearest passes: line 378 T2 missed by 0 mm |
| R7 | proud | 0.6 | wall (vertical) | 32.11 14.86 0.02 34.72 15.42 0.05 | +5.000 | +5.000 | face 25 (cylinder r3.2) | nearest passes: line 454 T2 missed by 0 mm, line 453 T2 missed by 0 mm |
| R8 | proud | 0.45 | wall (vertical) | 8.01 20.57 0.02 9.91 21.2 0.04 | +5.000 | +5.000 | face 24 (cylinder r3.2) | nearest passes: line 492 T2 missed by 0 mm |
| R9 | proud | 0.45 | wall (vertical) | 36.16 18.19 0 37.19 20.36 0.01 | +5.000 | +5.000 | face 25 (cylinder r3.2) | nearest passes: line 455 T2 missed by 0 mm, line 454 T2 missed by 0 mm, line 453 T2 missed by 0 mm |
| R10 | proud | 0.45 | wall (vertical) | 37.07 -18.89 0.03 37.15 -17.45 0.05 | +5.000 | +5.000 | face 23 (cylinder r3.2) | nearest passes: line 416 T2 missed by 0 mm, line 415 T2 missed by 0 mm |
| R11 | proud | 0.3 | wall (vertical) | 4.81 18.26 0.01 5.38 19.84 0.03 | +5.000 | +5.000 | face 24 (cylinder r3.2) | nearest passes: line 492 T2 missed by 0 mm |
| R12 | proud | 0.3 | wall (vertical) | 6.94 -21.05 0 7.02 -21.02 0.03 | +5.000 | +5.000 | face 22 (cylinder r3.2) | nearest passes: line 378 T2 missed by 0 mm |
| R13 | proud | 0.3 | floor/top (faces up) | 11.21 5.92 15 11.26 5.97 15 | +5.000 | +5.000 | face 9 (plane z15) | nearest passes: line 517 T3 missed by 0.081 mm, line 516 T3 missed by 0.081 mm, line 224 T1 missed by 1.527 mm |
| R14 | proud | 0.15 | wall (vertical) | 5.08 -19.31 0.04 5.08 -19.31 0.04 | +5.000 | +5.000 | face 22 (cylinder r3.2) | nearest passes: line 378 T2 missed by 0 mm |
| R15 | proud | 0.15 | wall (vertical) | 9.85 -15.39 0.02 9.85 -15.39 0.02 | +5.000 | +5.000 | face 22 (cylinder r3.2) | nearest passes: line 378 T2 missed by 0 mm |
| R16 | proud | 0.15 | floor/top (faces up) | 10.86 -5.23 15 10.86 -5.23 15 | +5.000 | +5.000 | face 9 (plane z15) | nearest passes: line 517 T3 missed by 0.018 mm, line 518 T3 missed by 0.018 mm, line 225 T1 missed by 1.356 mm |
| R17 | proud | 0.15 | floor/top (faces up) | 32.77 6.01 15 32.77 6.01 15 | +5.000 | +5.000 | face 9 (plane z15) | nearest passes: line 515 T3 missed by 0.175 mm, line 516 T3 missed by 0.175 mm, line 224 T1 missed by 1.618 mm |
| R18 | proud | 0.15 | wall (vertical) | 31.9 20.42 0.03 31.9 20.42 0.03 | +5.000 | +5.000 | face 25 (cylinder r3.2) | nearest passes: line 454 T2 missed by 0 mm |
| R19 | proud | 0.15 | floor/top (faces up) | 33.03 -5.5 15 33.03 -5.5 15 | +5.000 | +5.000 | face 9 (plane z15) | nearest passes: line 519 T3 missed by 0.038 mm, line 518 T3 missed by 0.038 mm, line 227 T1 missed by 1.452 mm |
| R20 | proud | 0.15 | wall (vertical) | 35.32 -15.09 0.02 35.32 -15.09 0.02 | +5.000 | +5.000 | face 23 (cylinder r3.2) | nearest passes: line 416 T2 missed by 0 mm |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 139.9 | 6606.4 | 40.242 |
| T2 | 6 mm 3-flute flat endmill | 73.4 | 696.3 | 1.692 |
| T3 | 3 mm 2-flute flat endmill | 13.5 | 181.1 | 0.117 |
| T4 | 1.5 mm 2-flute flat endmill | 196.8 | 1546.7 | 0.072 |
| T6 | 6 mm ball endmill | 124.5 | 2954.5 | 0.377 |
| T9 | 6 mm 90deg chamfer mill | 31.1 | 253.7 | 0.391 |
| T10 | 5 mm drill 118deg | 16.3 | 143.2 | 2.276 |

Moves: 9413, cut length 12382 mm, rapid length 4632 mm, estimated cycle time 10.9 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
