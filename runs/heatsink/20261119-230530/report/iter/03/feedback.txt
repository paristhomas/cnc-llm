# Simulation feedback - iteration 3: heatsink

**Score: 100.000% of the machinable surface within +-0.1 mm** (all non-datum surface: 100.00%).  Program valid: **YES** (0 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 100.0 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 0.0 |
| max_gouge_mm | 0.0 |
| tool_limited_area_pct | 0.0 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.112 |
| gouged_cm3 | 0.2299 |
| removed_cm3 | 89.288 |
| cycle_time_min | 14.41 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.


## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines (gouge: lines that cut it; proud: closest passes that could have reached it) |
|---|---|---|---|---|---|---|---|---|
| R1 | gouge | 0.15 | wall (vertical) | -25.75 -10.74 16.19 -25.75 -10.74 16.19 | -5.000 | -5.000 | face 36 (plane) | cut by 10899 |
| R2 | gouge | 0.15 | slope/curved (faces up) | -25.75 19.86 16.19 -25.75 19.86 16.19 | -5.000 | -5.000 | face 38 (cylinder r60) | cut by 10736 |
| R3 | gouge | 0.15 | wall (vertical) | -7.75 -9.77 21.5 -7.75 -9.77 21.5 | -5.000 | -5.000 | face 42 (plane) | cut by 10933 |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 529.8 | 27342.5 | 63.278 |
| T2 | 6 mm 3-flute flat endmill | 95.7 | 3335.5 | 21.864 |
| T3 | 3 mm 2-flute flat endmill | 19.2 | 227.7 | 0.282 |
| T6 | 6 mm ball endmill | 188.0 | 4268.0 | 3.865 |

Moves: 15192, cut length 35174 mm, rapid length 3122 mm, estimated cycle time 14.4 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
