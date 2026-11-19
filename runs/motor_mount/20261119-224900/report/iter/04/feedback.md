# Simulation feedback - iteration 4: motor_mount

**Score: 100.00% of the machinable surface within +-0.1 mm** (all non-datum surface: 100.00%).  Program valid: **YES** (0 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.998 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 0.002 |
| max_gouge_mm | 0.002 |
| tool_limited_area_pct | 0.006 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.05 |
| gouged_cm3 | 0.0583 |
| removed_cm3 | 50.001 |
| cycle_time_min | 6.69 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material.


## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines |
|---|---|---|---|---|---|---|---|---|
| R1 | proud | 0.15 | floor/top (faces up) | -22.11 18.69 10 -22.11 18.69 10 | +5.000 | +5.000 | face 42 (plane z10) | last cut by 91 |
| R2 | proud | 0.15 | floor/top (faces up) | -1.44 14.69 10 -1.44 14.69 10 | +5.000 | +5.000 | face 42 (plane z10) | last cut by 91 |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 113.7 | 5366.6 | 38.745 |
| T2 | 6 mm 3-flute flat endmill | 86.3 | 2015.8 | 9.365 |
| T3 | 3 mm 2-flute flat endmill | 133.0 | 1431.3 | 1.026 |
| T9 | 6 mm 90deg chamfer mill | 22.3 | 339.5 | 0.162 |
| T10 | 5 mm drill 118deg | 6.3 | 51.6 | 0.702 |

Moves: 22579, cut length 9205 mm, rapid length 3625 mm, estimated cycle time 6.7 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
