# Simulation feedback - iteration 2: cam_plate

**Score: 99.871% of the machinable surface within +-0.1 mm** (all non-datum surface: 99.77%).  Program valid: **YES** (0 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.871 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 0.129 |
| max_gouge_mm | 0.0027 |
| tool_limited_area_pct | 0.098 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.058 |
| gouged_cm3 | 0.0475 |
| removed_cm3 | 40.58 |
| cycle_time_min | 12.47 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.


## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines |
|---|---|---|---|---|---|---|---|---|
| R1 | proud | 5.1 | wall (vertical) | -3 16.14 1.18 -2.65 16.5 11.82 | +0.166 | +0.238 | face 5 (plane); face 8 (plane) | last cut by 27 |
| R2 | proud | 3.6 | wall (vertical) | 2.65 16.14 0.48 3 16.5 7.78 | +0.168 | +0.238 | face 5 (plane); face 0 (plane) | last cut by 27 |
| R3 | proud | 1.35 | wall (vertical) | 2.67 16.16 9.5 3 16.5 11.9 | +0.167 | +0.238 | face 5 (plane); face 0 (plane) | last cut by 27 |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 198.5 | 8965.0 | 34.989 |
| T2 | 6 mm 3-flute flat endmill | 21.8 | 652.4 | 1.549 |
| T3 | 3 mm 2-flute flat endmill | 454.7 | 4775.4 | 3.998 |
| T4 | 1.5 mm 2-flute flat endmill | 24.3 | 156.0 | 0.008 |
| T9 | 6 mm 90deg chamfer mill | 8.7 | 96.9 | 0.036 |

Moves: 39776, cut length 14646 mm, rapid length 2062 mm, estimated cycle time 12.5 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
