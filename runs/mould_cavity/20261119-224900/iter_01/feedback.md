# Simulation feedback - iteration 1: mould_cavity

**Score: 98.44% of the machinable surface within +-0.1 mm** (all non-datum surface: 98.42%).  Program valid: **NO** (1 errors, 5 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 98.444 |
| machinable_gouge_pct | 0.002 |
| machinable_proud_pct | 1.554 |
| max_gouge_mm | 4.3814 |
| tool_limited_area_pct | 0.026 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.163 |
| gouged_cm3 | 0.0285 |
| removed_cm3 | 52.422 |
| cycle_time_min | 13.63 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material.

## Errors (the program would crash, break a tool or is not executable) - must be fixed

- line 9213: cut cross-section > 0.75 D^2 for T6 (overloaded: too deep and too wide) x10 (lines 9213, 9214, 9263, 9264, 19813, 19814, 19861, 19862, 19902, 19952)

## Warnings

- line 5459: tool change with spindle running (stopped automatically)
- line 9186: tool change with spindle running (stopped automatically)
- line 20067: tool change with spindle running (stopped automatically)
- line 20181: tool change with spindle running (stopped automatically)
- line 9213: deep plunge (> 0.5 D) at > 50% of the recommended feed for T6; ramp or helix instead x10

## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines |
|---|---|---|---|---|---|---|---|---|
| R1 | proud | 283.09 | floor/top (faces up) | -18.2 -17.26 16 18.14 17.04 19.33 | +0.531 | +2.078 | face 5 (sphere r30); face 2 (bspline); face 0 (bspline) | last cut by 17849, 11354, 11535, 11560, 11764, 17929 |
| R2 | gouge | 0.15 | floor/top (faces up) | -40.89 25.22 30 -40.89 25.22 30 | -0.165 | -0.165 | face 3 (plane z30) | cut by 19953 |
| R3 | gouge | 0.15 | floor/top (faces up) | 33.99 -28.29 30 33.99 -28.29 30 | -4.381 | -4.381 | face 3 (plane z30) | cut by 9263 |
| R4 | gouge | 0.15 | floor/top (faces up) | 33.97 28.07 30 33.97 28.07 30 | -4.053 | -4.053 | face 3 (plane z30) | cut by 20043 |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 356.0 | 18141.9 | 44.459 |
| T2 | 6 mm 3-flute flat endmill | 25.1 | 561.7 | 0.442 |
| T5 | 8 mm bull-nose endmill r1 | 46.6 | 2257.5 | 4.184 |
| T6 | 6 mm ball endmill | 357.8 | 8557.7 | 3.336 |

Moves: 25453, cut length 29519 mm, rapid length 3267 mm, estimated cycle time 13.6 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
