# Simulation feedback - iteration 1: motor_mount

**Score: 100.00% of the machinable surface within +-0.1 mm** (all non-datum surface: 100.00%).  Program valid: **NO** (2 errors, 4 warnings).

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
| cycle_time_min | 8.62 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material.

## Errors (the program would crash, break a tool or is not executable) - must be fixed

- line 6147: rapid (G0) move removes material - crash x1 (lines 6147)
- line 11525: cut cross-section > 0.75 D^2 for T3 (overloaded: too deep and too wide) x4 (lines 11525, 11568, 11611, 11654)

## Warnings

- line 121: tool change with spindle running (stopped automatically)
- line 6142: tool change with spindle running (stopped automatically)
- line 11659: tool change with spindle running (stopped automatically)
- line 11724: tool change with spindle running (stopped automatically)

## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines |
|---|---|---|---|---|---|---|---|---|
| R1 | gouge | 0.15 | floor/top (faces up) | -34.7 25.02 9.5 -34.7 25.02 9.5 | -5.000 | -5.000 | face 43 (plane z9.5) | cut by 11568 |
| R2 | gouge | 0.15 | floor/top (faces up) | -1.34 14.6 16 -1.34 14.6 16 | -5.000 | -5.000 | face 7 (plane z16) | cut by 90 |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 113.3 | 5357.3 | 38.748 |
| T2 | 6 mm 3-flute flat endmill | 90.5 | 2073.9 | 9.366 |
| T3 | 3 mm 2-flute flat endmill | 259.4 | 1975.6 | 1.734 |
| T9 | 6 mm 90deg chamfer mill | 22.3 | 339.5 | 0.162 |

Moves: 26661, cut length 9746 mm, rapid length 3192 mm, estimated cycle time 8.6 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
