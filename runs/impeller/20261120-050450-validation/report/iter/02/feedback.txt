# Simulation feedback - iteration 2: impeller

**Score: 98.490% of the machinable surface within +-0.1 mm** (all non-datum surface: 97.87%).  Program valid: **NO** (1 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 98.49 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 1.51 |
| max_gouge_mm | 0.0432 |
| tool_limited_area_pct | 0.632 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.158 |
| gouged_cm3 | 0.0831 |
| removed_cm3 | 114.028 |
| cycle_time_min | 45.85 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.

## Errors (the program would crash, break a tool or is not executable) - must be fixed

- line 119310: material contact above the flute length (shank rubbing / tool too short); first at line 119310: move (7.80, 8.23, 11.86) -> (7.69, 8.14, 11.88) with T4, removed 0.125 mm3, max 6.133 mm deep (flute length 5 mm) x2 (lines 119310, 119373)

## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines (gouge: lines that cut it; proud: closest passes that could have reached it) |
|---|---|---|---|---|---|---|---|---|
| R1 | proud | 22.64 | slope/curved (faces up) | -35.83 -13.67 6 -6.46 -5.3 17.76 | +0.359 | +5.000 | face 36 (cylinder r19.521); face 17 (cone); face 29 (cylinder r10) | nearest passes: line 149658 T7 missed by 0 mm, line 149659 T7 missed by 0 mm, line 149657 T7 missed by 0 mm |
| R2 | proud | 19.04 | slope/curved (faces up) | -13.01 -34.28 6 4.37 -11.29 11.73 | +0.310 | +1.149 | face 34 (cylinder r19.521); face 13 (cone); face 12 (cylinder r1.25) | nearest passes: line 149469 T7 missed by 0 mm, line 149468 T7 missed by 0 mm, line 152327 T8 missed by 0 mm |
| R3 | proud | 17.24 | slope/curved (faces up) | 9.8 -18.9 7.39 24.48 -1.54 17.82 | +0.271 | +1.293 | face 32 (cylinder r19.521); face 9 (cone); face 29 (cylinder r10) | nearest passes: line 149340 T7 missed by 0 mm, line 149341 T7 missed by 0 mm, line 149339 T7 missed by 0 mm |
| R4 | proud | 16.94 | slope/curved (faces up) | -4.37 9.38 7.93 1.09 27.83 17.68 | +0.358 | +5.000 | face 40 (cylinder r19.521); face 25 (cone); face 29 (cylinder r10) | nearest passes: line 149011 T7 missed by 0 mm, line 149010 T7 missed by 0 mm, line 149012 T7 missed by 0 mm |
| R5 | proud | 16.19 | slope/curved (faces up) | -23.84 1.54 7.9 -9.8 15.22 17.79 | +0.264 | +1.119 | face 38 (cylinder r19.521); face 21 (cone); face 29 (cylinder r10) | nearest passes: line 149838 T7 missed by 0 mm, line 149837 T7 missed by 0 mm, line 149839 T7 missed by 0 mm |
| R6 | proud | 15.89 | slope/curved (faces up) | 6.47 7.5 8.45 19.99 16.22 17.63 | +0.312 | +5.000 | face 5 (cone); face 30 (cylinder r19.521); face 25 (cone) | nearest passes: line 149183 T7 missed by 0 mm, line 149184 T7 missed by 0 mm, line 152107 T8 missed by 0 mm |
| R7 | proud | 8.4 | slope/curved (faces up) | 2.22 28.73 6 13.34 34.38 7.75 | +0.281 | +0.943 | face 40 (cylinder r19.521); face 25 (cone); face 3 (plane z6) | nearest passes: line 148972 T7 missed by 0 mm, line 148971 T7 missed by 0 mm, line 151930 T8 missed by 0 mm |
| R8 | proud | 6.15 | slope/curved (faces up) | -24.36 22.79 6 -22.26 28.43 7.12 | +0.404 | +1.191 | face 21 (cone); face 38 (cylinder r19.521); face 20 (cylinder r1.25) | nearest passes: line 149798 T7 missed by 0 mm, line 149799 T7 missed by 0 mm, line 152590 T8 missed by 0 mm |
| R9 | proud | 5.4 | slope/curved (faces up) | 31.66 5.17 6 36.17 9.93 7.15 | +0.492 | +5.000 | face 30 (cylinder r19.521); face 5 (cone); face 28 (cylinder r1.25) | nearest passes: line 149127 T7 missed by 0 mm, line 149126 T7 missed by 0 mm, line 149128 T7 missed by 0 mm |
| R10 | proud | 5.1 | slope/curved (faces up) | 11.33 -8.56 8.51 23.64 0.76 11.78 | +0.167 | +0.303 | face 5 (cone); face 6 (cylinder r22.021) | nearest passes: line 149212 T7 missed by 0 mm, line 149213 T7 missed by 0 mm, line 152149 T8 missed by 0 mm |
| R11 | proud | 4.65 | slope/curved (faces up) | 22.22 -28.42 6 24.53 -20.45 7.22 | +0.679 | +5.000 | face 32 (cylinder r19.521); face 9 (cone); face 8 (cylinder r1.25) | nearest passes: line 149310 T7 missed by 0 mm, line 149311 T7 missed by 0 mm, line 149309 T7 missed by 0 mm |
| R12 | proud | 4.2 | wall (vertical) | 3.18 -10.14 11.81 3.8 -9.38 17.86 | +0.211 | +0.391 | face 29 (cylinder r10); face 34 (cylinder r19.521); face 13 (cone) | nearest passes: line 119352 T4 missed by 0 mm, line 152377 T8 missed by 0.001 mm, line 119353 T4 missed by 0.014 mm |
| R13 | proud | 3.75 | slope/curved (faces up) | -13.8 -15.23 9.66 -5.08 -10.41 11.7 | +0.180 | +0.301 | face 14 (cylinder r22.021); face 13 (cone) | nearest passes: line 149551 T7 missed by 0 mm, line 149550 T7 missed by 0 mm, line 117661 T2 missed by 0 mm |
| R14 | proud | 3.6 | slope/curved (faces up) | -7.06 12.65 8.65 -4.53 24.43 10.97 | +0.175 | +0.344 | face 22 (cylinder r22.021); face 21 (cone) | nearest passes: line 149884 T7 missed by 0 mm, line 149885 T7 missed by 0 mm, line 118101 T2 missed by 0 mm |
| R15 | proud | 3.45 | slope/curved (faces up) | 21.74 10.89 7.05 29.63 13.61 8.75 | +0.158 | +0.268 | face 30 (cylinder r19.521); face 5 (cone) | nearest passes: line 149153 T7 missed by 0 mm, line 149152 T7 missed by 0 mm, line 152079 T8 missed by 0 mm |
| R16 | proud | 3.3 | slope/curved (faces up) | 6.37 -19.2 9.69 7.02 -10.36 11.48 | +0.169 | +0.255 | face 10 (cylinder r22.021); face 9 (cone) | nearest passes: line 149379 T7 missed by 0 mm, line 149380 T7 missed by 0 mm, line 149378 T7 missed by 0 mm |
| R17 | proud | 2.55 | slope/curved (faces up) | -22.27 1.4 8.95 -16.32 6.59 10.58 | +0.166 | +0.336 | face 17 (cone); face 18 (cylinder r22.021) | nearest passes: line 149709 T7 missed by 0 mm, line 149710 T7 missed by 0 mm, line 149708 T7 missed by 0 mm |
| R18 | proud | 2.4 | wall (vertical) | 9.92 1.03 12.12 10.13 1.26 17.97 | +0.157 | +0.216 | face 6 (cylinder r22.021); face 29 (cylinder r10) | nearest passes: line 118273 T2 missed by 0 mm, line 118274 T2 missed by 0 mm, line 118272 T2 missed by 0 mm |
| R19 | proud | 2.25 | wall (vertical) | -10.11 -1.26 12.35 -9.92 -1.04 17.91 | +0.171 | +0.220 | face 29 (cylinder r10); face 18 (cylinder r22.021) | nearest passes: line 133503 T6 missed by 0 mm, line 133504 T6 missed by 0 mm, line 118998 T4 missed by 0.049 mm |
| R20 | proud | 1.95 | wall (vertical) | -6.07 7.95 12.46 -5.92 8.28 17.6 | +0.161 | +0.217 | face 29 (cylinder r10); face 22 (cylinder r22.021) | nearest passes: line 119283 T4 missed by 0.046 mm, line 119282 T4 missed by 0.046 mm, line 119407 T4 missed by 0.046 mm |
| R21 | proud | 1.95 | wall (vertical) | 5.91 -8.25 12.65 6.02 -7.99 17.78 | +0.166 | +0.221 | face 10 (cylinder r22.021); face 29 (cylinder r10) | nearest passes: line 130273 T6 missed by 0.037 mm, line 130274 T6 missed by 0.037 mm, line 119148 T4 missed by 0.051 mm |
| R22 | proud | 1.5 | wall (vertical) | -4.17 -9.29 13.01 -3.85 -9.18 15.94 | +0.142 | +0.181 | face 29 (cylinder r10); face 14 (cylinder r22.021) | nearest passes: line 119252 T4 missed by 0.046 mm, line 119253 T4 missed by 0.046 mm, line 119361 T4 missed by 0.046 mm |
| R23 | proud | 1.2 | slope/curved (faces up) | -24.53 17.74 6.87 -24.2 21.25 7.71 | +0.160 | +0.232 | face 38 (cylinder r19.521); face 21 (cone) | nearest passes: line 149805 T7 missed by 0 mm, line 149804 T7 missed by 0 mm, line 152597 T8 missed by 0 mm |
| R24 | proud | 1.05 | wall (vertical) | 3.87 9.19 14.29 4.17 9.28 17.73 | +0.136 | +0.166 | face 26 (cylinder r22.021); face 29 (cylinder r10) | nearest passes: line 139154 T6 missed by 0 mm, line 139155 T6 missed by 0 mm, line 119298 T4 missed by 0.05 mm |
| R25 | proud | 0.6 | slope/curved (faces up) | -6.74 9.87 11.39 -6.42 10.69 11.59 | +0.159 | +0.209 | face 21 (cone); face 22 (cylinder r22.021) | nearest passes: line 149865 T7 missed by 0 mm, line 149866 T7 missed by 0 mm, line 152668 T8 missed by 0 mm |
| R26 | proud | 0.45 | slope/curved (faces up) | -18.62 -16.21 8.61 -16.52 -15.99 9 | +0.122 | +0.153 | face 13 (cone); face 14 (cylinder r22.021) | nearest passes: line 117668 T2 missed by 0 mm, line 149558 T7 missed by 0 mm, line 149559 T7 missed by 0 mm |
| R27 | proud | 0.45 | wall (vertical) | 4.13 9.24 12.05 4.18 9.3 12.64 | +0.132 | +0.148 | face 26 (cylinder r22.021) | nearest passes: line 119298 T4 missed by 0.047 mm, line 119299 T4 missed by 0.047 mm, line 119297 T4 missed by 0.138 mm |
| R28 | proud | 0.45 | slope/curved (faces up) | 4.23 -25.1 8.43 4.81 -23.85 8.76 | +0.135 | +0.158 | face 9 (cone); face 10 (cylinder r22.021) | nearest passes: line 117434 T2 missed by 0 mm, line 149394 T7 missed by 0 mm, line 149395 T7 missed by 0 mm |
| R29 | proud | 0.45 | slope/curved (faces up) | 5.53 10.88 11.35 6.16 11.3 11.52 | +0.125 | +0.163 | face 25 (cone); face 26 (cylinder r22.021) | nearest passes: line 116970 T2 missed by 0 mm, line 149039 T7 missed by 0 mm, line 149038 T7 missed by 0 mm |
| R30 | proud | 0.3 | slope/curved (faces up) | -24.62 10.1 8.19 -24.52 10.35 8.2 | +0.132 | +0.145 | face 18 (cylinder r22.021); face 17 (cone) | nearest passes: line 117893 T2 missed by 0 mm, line 149729 T7 missed by 0 mm, line 149730 T7 missed by 0 mm |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 515.0 | 21259.2 | 107.817 |
| T2 | 6 mm 3-flute flat endmill | 74.9 | 1888.9 | 4.58 |
| T3 | 3 mm 2-flute flat endmill | 62.6 | 377.4 | 0.056 |
| T4 | 1.5 mm 2-flute flat endmill | 241.4 | 714.1 | 0.02 |
| T6 | 6 mm ball endmill | 964.6 | 18282.5 | 1.359 |
| T7 | 3 mm ball endmill | 102.1 | 1534.0 | 0.119 |
| T8 | 1 mm ball endmill | 734.7 | 2514.8 | 0.077 |

Moves: 160125, cut length 46571 mm, rapid length 31229 mm, estimated cycle time 45.9 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
