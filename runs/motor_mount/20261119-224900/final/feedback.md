# Simulation feedback: motor_mount

**Score: 100.000% of the machinable surface within +-0.1 mm** (all non-datum surface: 100.00%).  Program valid: **YES** (0 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 100.0 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 0.0 |
| max_gouge_mm | 0.0 |
| tool_limited_area_pct | 0.0 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.051 |
| gouged_cm3 | 0.0582 |
| removed_cm3 | 50.0 |
| cycle_time_min | 6.69 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.


## Out-of-tolerance regions (largest first)

None.


## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 113.7 | 5366.6 | 38.743 |
| T2 | 6 mm 3-flute flat endmill | 86.3 | 2015.9 | 9.365 |
| T3 | 3 mm 2-flute flat endmill | 133.1 | 1431.4 | 1.027 |
| T9 | 6 mm 90deg chamfer mill | 22.3 | 339.5 | 0.162 |
| T10 | 5 mm drill 118deg | 6.3 | 51.6 | 0.702 |

Moves: 33534, cut length 9205 mm, rapid length 3625 mm, estimated cycle time 6.7 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
