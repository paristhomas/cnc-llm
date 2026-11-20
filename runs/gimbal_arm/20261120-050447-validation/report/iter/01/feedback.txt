# Simulation feedback - iteration 1: gimbal_arm

**Score: 100.000% of the machinable surface within +-0.1 mm** (all non-datum surface: 100.00%).  Program valid: **YES** (0 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 100.0 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 0.0 |
| max_gouge_mm | 0.0354 |
| tool_limited_area_pct | 0.012 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.059 |
| gouged_cm3 | 0.0643 |
| removed_cm3 | 83.915 |
| cycle_time_min | 10.92 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.


## Out-of-tolerance regions (largest first)

None.


## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 325.3 | 13499.8 | 79.434 |
| T2 | 6 mm 3-flute flat endmill | 38.5 | 647.0 | 2.83 |
| T3 | 3 mm 2-flute flat endmill | 73.1 | 1011.9 | 1.275 |
| T4 | 1.5 mm 2-flute flat endmill | 26.7 | 177.9 | 0.085 |
| T6 | 6 mm ball endmill | 134.7 | 3190.9 | 0.274 |
| T9 | 6 mm 90deg chamfer mill | 8.9 | 77.1 | 0.017 |

Moves: 39461, cut length 18605 mm, rapid length 16417 mm, estimated cycle time 10.9 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
