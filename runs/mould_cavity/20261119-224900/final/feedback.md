# Simulation feedback: mould_cavity

**Score: 99.665% of the machinable surface within +-0.1 mm** (all non-datum surface: 99.65%).  Program valid: **YES** (0 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.665 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 0.335 |
| max_gouge_mm | 0.0035 |
| tool_limited_area_pct | 0.011 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.07 |
| gouged_cm3 | 0.0287 |
| removed_cm3 | 52.515 |
| cycle_time_min | 19.31 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.


## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines |
|---|---|---|---|---|---|---|---|---|
| R1 | proud | 32.55 | floor/top (faces up) | -14.94 -16.13 16.02 14.89 -10.05 17.65 | +0.267 | +0.739 | face 2 (bspline); face 5 (sphere r30) | last cut by 24052, 24865, 23954, 24747, 25145, 24740 |
| R2 | proud | 30.0 | floor/top (faces up) | -14.72 10.05 16.02 14.96 16.07 17.66 | +0.248 | +0.668 | face 2 (bspline); face 5 (sphere r30) | last cut by 24613, 25274, 24610, 25429, 24323, 24486 |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 356.0 | 18141.9 | 44.459 |
| T2 | 6 mm 3-flute flat endmill | 24.9 | 561.7 | 2.412 |
| T5 | 8 mm bull-nose endmill r1 | 41.8 | 2025.0 | 4.154 |
| T6 | 6 mm ball endmill | 299.1 | 7148.7 | 1.394 |
| T7 | 3 mm ball endmill | 153.8 | 2441.6 | 0.082 |
| T8 | 1 mm ball endmill | 235.0 | 1496.3 | 0.014 |

Moves: 43096, cut length 31815 mm, rapid length 3733 mm, estimated cycle time 19.3 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
