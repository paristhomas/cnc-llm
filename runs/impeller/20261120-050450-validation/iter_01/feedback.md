# Simulation feedback - iteration 1: impeller

**Score: 97.767% of the machinable surface within +-0.1 mm** (all non-datum surface: 97.15%).  Program valid: **NO** (2 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 97.767 |
| machinable_gouge_pct | 0.362 |
| machinable_proud_pct | 1.871 |
| max_gouge_mm | 5.0 |
| tool_limited_area_pct | 0.632 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.165 |
| gouged_cm3 | 0.0977 |
| removed_cm3 | 114.036 |
| cycle_time_min | 40.15 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.

## Errors (the program would crash, break a tool or is not executable) - must be fixed

- line 118310: material contact above the flute length (shank rubbing / tool too short); first at line 118310: move (-2.67, 12.02, 11.81) -> (-2.57, 11.40, 11.95) with T3, removed 5.423 mm3, max 10.276 mm deep (flute length 10 mm) x64 (lines 118310, 118311, 118312, 118327, 118328, 118523, 118524, 118525, 118537, 118538, 118771, 118772...)
- line 142057: cut cross-section > 0.75 D^2 for T8 (overloaded: too deep and too wide); worst 3.92 mm2 > limit 0.75 mm2 at line 142184 (move to 7.06, 7.85, 11.88, removed column up to 8.60 mm deep) x18 (lines 142057, 142058, 142059, 142074, 142184, 142185, 142310, 142311, 142312, 142437, 142438, 142439...)

## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines (gouge: lines that cut it; proud: closest passes that could have reached it) |
|---|---|---|---|---|---|---|---|---|
| R1 | proud | 32.24 | slope/curved (faces up) | -6.2 7.93 7.93 1.09 27.83 21.33 | +0.300 | +5.000 | face 29 (cylinder r10); face 40 (cylinder r19.521); face 39 (plane z18) | nearest passes: line 132038 T6 missed by 0 mm, line 132276 T6 missed by 0 mm, line 132037 T6 missed by 0 mm |
| R2 | proud | 30.74 | slope/curved (faces up) | -23.84 -1.24 7.9 -9.82 15.22 20.89 | +0.324 | +3.441 | face 29 (cylinder r10); face 38 (cylinder r19.521); face 37 (plane z18) | nearest passes: line 142691 T8 missed by 0 mm, line 142690 T8 missed by 0 mm, line 129114 T6 missed by 0 mm |
| R3 | proud | 30.44 | slope/curved (faces up) | 9.82 -18.9 7.39 24.48 1.26 21.09 | +0.292 | +2.465 | face 29 (cylinder r10); face 9 (cone); face 32 (cylinder r19.521) | nearest passes: line 128953 T6 missed by 0 mm, line 128847 T6 missed by 0 mm, line 129021 T6 missed by 0 mm |
| R4 | proud | 25.04 | slope/curved (faces up) | 3.89 7.13 8.75 19.99 13.64 21.41 | +0.408 | +5.000 | face 29 (cylinder r10); face 41 (plane z18); face 5 (cone) | nearest passes: line 132082 T6 missed by 0 mm, line 132083 T6 missed by 0 mm, line 131871 T6 missed by 0 mm |
| R5 | proud | 19.49 | slope/curved (faces up) | 3.33 -11.39 11.81 6.25 -7.89 21.16 | +0.408 | +3.918 | face 29 (cylinder r10); face 33 (plane z18); face 10 (cylinder r22.021) | nearest passes: line 126598 T6 missed by 0 mm, line 126599 T6 missed by 0 mm, line 126722 T6 missed by 0 mm |
| R6 | proud | 18.29 | slope/curved (faces up) | -35.78 -13.67 6 -6.46 -5.54 15.7 | +0.340 | +5.000 | face 17 (cone); face 36 (cylinder r19.521); face 29 (cylinder r10) | nearest passes: line 139715 T7 missed by 0 mm, line 139716 T7 missed by 0 mm, line 139706 T7 missed by 0 mm |
| R7 | proud | 16.49 | slope/curved (faces up) | -13.01 -34.28 6 4.37 -11.29 11.73 | +0.203 | +0.613 | face 13 (cone); face 34 (cylinder r19.521); face 3 (plane z6) | nearest passes: line 139573 T7 missed by 0 mm, line 139572 T7 missed by 0 mm, line 142417 T8 missed by 0 mm |
| R8 | proud | 15.14 | slope/curved (faces up) | -7.94 -10.65 17.07 -3.9 -7.61 21.23 | +0.311 | +2.382 | face 29 (cylinder r10); face 35 (plane z18); face 36 (cylinder r19.521) | nearest passes: line 126554 T6 missed by 0 mm, line 126553 T6 missed by 0 mm, line 126767 T6 missed by 0 mm |
| R9 | proud | 6.45 | slope/curved (faces up) | 2.22 28.73 6 12.97 34.38 7.75 | +0.199 | +0.518 | face 40 (cylinder r19.521); face 25 (cone); face 3 (plane z6) | nearest passes: line 139052 T7 missed by 0 mm, line 139051 T7 missed by 0 mm, line 142010 T8 missed by 0 mm |
| R10 | gouge | 4.8 | wall (vertical) | -36.5 -9.79 15.28 -35.6 -6 18 | -0.313 | -2.555 | face 15 (cylinder r37); face 16 (cylinder r1.25); face 35 (plane z18) | cut by 128004, 127452, 127189, 127160, 126833 |
| R11 | gouge | 4.65 | slope/curved (faces up) | -27.04 19.03 14.76 -26.92 22.25 18 | -0.368 | -4.643 | face 18 (cylinder r22.021); face 37 (plane z18) | cut by 135167, 134907, 134479 |
| R12 | proud | 4.2 | slope/curved (faces up) | -24.36 22.79 6.04 -22.26 28.29 7 | +0.263 | +0.722 | face 21 (cone); face 38 (cylinder r19.521); face 20 (cylinder r1.25) | nearest passes: line 139878 T7 missed by 0 mm, line 139877 T7 missed by 0 mm, line 142643 T8 missed by 0 mm |
| R13 | proud | 4.05 | slope/curved (faces up) | 31.66 5.9 6 36.17 9.93 6.96 | +0.424 | +5.000 | face 30 (cylinder r19.521); face 5 (cone); face 28 (cylinder r1.25) | nearest passes: line 139215 T7 missed by 0 mm, line 139214 T7 missed by 0 mm, line 142135 T8 missed by 0 mm |
| R14 | proud | 3.6 | slope/curved (faces up) | 22.36 -27.59 6.05 24.53 -20.45 7.22 | +0.281 | +0.827 | face 9 (cone); face 32 (cylinder r19.521) | nearest passes: line 139378 T7 missed by 0 mm, line 142259 T8 missed by 0 mm, line 142260 T8 missed by 0 mm |
| R15 | gouge | 3.45 | slope/curved (faces up) | 26.77 -20.57 16.02 27.04 -17.52 18 | -0.421 | -3.264 | face 6 (cylinder r22.021); face 31 (plane z18) | cut by 124495, 123955, 123918, 123730, 124158 |
| R16 | proud | 3.45 | slope/curved (faces up) | 21.74 10.89 7.05 29.63 13.61 8.75 | +0.158 | +0.268 | face 30 (cylinder r19.521); face 5 (cone) | nearest passes: line 139228 T7 missed by 0 mm, line 139229 T7 missed by 0 mm, line 142150 T8 missed by 0 mm |
| R17 | gouge | 3.15 | wall (vertical) | 6.76 -15.42 17.02 6.87 -12.3 18 | -0.151 | -0.701 | face 10 (cylinder r22.021); face 33 (plane z18) | cut by 125350, 126015 |
| R18 | gouge | 2.7 | wall (vertical) | 25.76 -14.01 16.5 26.09 -13 18 | -0.151 | -0.657 | face 6 (cylinder r22.021); face 31 (plane z18) | cut by 125946, 125982, 126280 |
| R19 | gouge | 2.25 | slope/curved (faces up) | 26.7 -24.2 16.49 26.99 -21.83 18 | -0.620 | -3.898 | face 6 (cylinder r22.021); face 31 (plane z18) | cut by 123280, 122828 |
| R20 | gouge | 1.8 | wall (vertical) | -24.44 17.67 16.56 -24.35 18.42 17.97 | -0.129 | -0.150 | face 38 (cylinder r19.521) | cut by 134417 |
| R21 | proud | 1.8 | slope/curved (faces up) | -5.31 -10.41 11.7 -3.84 -9.18 15.94 | +0.133 | +0.163 | face 29 (cylinder r10); face 14 (cylinder r22.021); face 13 (cone) | nearest passes: line 142455 T8 missed by 0 mm, line 142456 T8 missed by 0 mm, line 142454 T8 missed by 0 mm |
| R22 | gouge | 1.65 | slope/curved (faces up) | -26.13 26.19 17.05 -25.48 26.77 18 | -0.711 | -4.746 | face 19 (cylinder r37); face 37 (plane z18) | cut by 136742 |
| R23 | gouge | 1.65 | slope/curved (faces up) | -25.21 9.74 16.45 -24.22 11.6 18 | -0.502 | -3.935 | face 18 (cylinder r22.021); face 37 (plane z18) | cut by 131632, 131290 |
| R24 | gouge | 1.35 | slope/curved (faces up) | -6.87 9.77 17.29 -6.3 14.07 18 | -0.405 | -0.758 | face 39 (plane z18); face 22 (cylinder r22.021) | cut by 132397, 131666, 131562, 133015 |
| R25 | gouge | 1.2 | slope/curved (faces up) | 8.13 2.93 20.99 9.5 5.72 22 | -0.724 | -2.952 | face 29 (cylinder r10); face 4 (plane z22) | cut by 130399, 130828, 129938 |
| R26 | proud | 1.2 | slope/curved (faces up) | -24.53 17.74 6.87 -24.2 21.25 7.71 | +0.160 | +0.232 | face 38 (cylinder r19.521); face 21 (cone) | nearest passes: line 139881 T7 missed by 0 mm, line 139880 T7 missed by 0 mm, line 142646 T8 missed by 0 mm |
| R27 | proud | 1.2 | slope/curved (faces up) | 7.29 12.08 9.96 12.07 14.63 11.05 | +0.134 | +0.172 | face 26 (cylinder r22.021); face 25 (cone) | nearest passes: line 134076 T6 missed by 0 mm, line 139127 T7 missed by 0 mm, line 118348 T3 missed by 0 mm |
| R28 | gouge | 1.05 | slope/curved (faces up) | -24.15 24.57 16.4 -23.82 25.63 18 | -0.284 | -1.298 | face 38 (cylinder r19.521); face 37 (plane z18) | cut by 135789, 135648 |
| R29 | gouge | 1.05 | wall (vertical) | 35.22 6.01 17.14 36.47 6.95 17.82 | -0.110 | -0.123 | face 28 (cylinder r1.25); face 27 (cylinder r37); face 30 (cylinder r19.521) | cut by 130892, 130151, 129919 |
| R30 | proud | 0.9 | slope/curved (faces up) | -9.63 -13.49 10.52 -6.88 -11.72 11.21 | +0.144 | +0.208 | face 14 (cylinder r22.021); face 13 (cone) | nearest passes: line 125203 T6 missed by 0 mm, line 139616 T7 missed by 0 mm, line 119064 T3 missed by 0 mm |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 515.0 | 21259.2 | 107.816 |
| T2 | 6 mm 3-flute flat endmill | 69.6 | 1730.1 | 4.512 |
| T3 | 3 mm 2-flute flat endmill | 34.7 | 510.8 | 0.236 |
| T6 | 6 mm ball endmill | 966.9 | 18025.9 | 1.399 |
| T7 | 3 mm ball endmill | 102.1 | 1534.0 | 0.015 |
| T8 | 1 mm ball endmill | 672.5 | 2389.4 | 0.058 |

Moves: 150174, cut length 45449 mm, rapid length 28846 mm, estimated cycle time 40.1 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
