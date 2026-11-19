# Simulation feedback - iteration 2: motor_mount

**Score: 100.00% of the machinable surface within +-0.1 mm** (all non-datum surface: 100.00%).  Program valid: **YES** (0 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.998 |
| machinable_gouge_pct | 0.002 |
| machinable_proud_pct | 0.0 |
| max_gouge_mm | 5.0 |
| tool_limited_area_pct | 0.006 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.044 |
| gouged_cm3 | 0.0617 |
| removed_cm3 | 50.011 |
| cycle_time_min | 8.56 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material.


## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines |
|---|---|---|---|---|---|---|---|---|
| R1 | gouge | 0.15 | floor/top (faces up) | -34.7 25.02 9.5 -34.7 25.02 9.5 | -5.000 | -5.000 | face 43 (plane z9.5) | cut by 11660 |
| R2 | gouge | 0.15 | floor/top (faces up) | -1.34 14.6 16 -1.34 14.6 16 | -5.000 | -5.000 | face 7 (plane z16) | cut by 91 |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 113.7 | 5366.6 | 38.748 |
| T2 | 6 mm 3-flute flat endmill | 86.3 | 2015.8 | 9.365 |
| T3 | 3 mm 2-flute flat endmill | 259.5 | 1968.3 | 1.735 |
| T9 | 6 mm 90deg chamfer mill | 22.3 | 339.5 | 0.162 |

Moves: 26729, cut length 9690 mm, rapid length 2910 mm, estimated cycle time 8.6 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
