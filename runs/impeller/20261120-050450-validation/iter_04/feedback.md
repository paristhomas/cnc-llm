# Simulation feedback - iteration 4: impeller

**Score: 98.879% of the machinable surface within +-0.1 mm** (all non-datum surface: 98.25%).  Program valid: **NO** (1 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 98.879 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 1.121 |
| max_gouge_mm | 0.0432 |
| tool_limited_area_pct | 0.632 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.146 |
| gouged_cm3 | 0.0835 |
| removed_cm3 | 114.04 |
| cycle_time_min | 58.21 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.

## Errors (the program would crash, break a tool or is not executable) - must be fixed

- line 153166: material contact above the flute length (shank rubbing / tool too short); first at line 153166: move (-3.30, 10.10, 11.87) -> (-3.28, 10.03, 11.88) with T8, removed 0.059 mm3, max 5.690 mm deep (flute length 3 mm) x20 (lines 153166, 153183, 153184, 153308, 153309, 153325, 153450, 153451, 153452, 153468, 153594, 153611...)

## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines (gouge: lines that cut it; proud: closest passes that could have reached it) |
|---|---|---|---|---|---|---|---|---|
| R1 | proud | 16.04 | slope/curved (faces up) | -35.83 -13.67 6 -6.46 -5.52 15.7 | +0.288 | +5.000 | face 36 (cylinder r19.521); face 17 (cone); face 29 (cylinder r10) | nearest passes: line 150285 T7 missed by 0 mm, line 150286 T7 missed by 0 mm, line 150284 T7 missed by 0 mm |
| R2 | proud | 12.75 | slope/curved (faces up) | -4.37 9.38 7.95 1.03 27.71 16.96 | +0.335 | +5.000 | face 40 (cylinder r19.521); face 25 (cone); face 29 (cylinder r10) | nearest passes: line 149628 T7 missed by 0 mm, line 149629 T7 missed by 0 mm, line 153144 T8 missed by 0 mm |
| R3 | proud | 11.4 | slope/curved (faces up) | 9.83 -14.51 7.96 23.62 -1.54 15.42 | +0.254 | +1.278 | face 9 (cone); face 32 (cylinder r19.521); face 29 (cylinder r10) | nearest passes: line 149967 T7 missed by 0 mm, line 149966 T7 missed by 0 mm, line 149965 T7 missed by 0 mm |
| R4 | proud | 11.1 | slope/curved (faces up) | -23.84 1.54 8.1 -9.83 15.22 14.95 | +0.205 | +0.712 | face 38 (cylinder r19.521); face 21 (cone); face 29 (cylinder r10) | nearest passes: line 150462 T7 missed by 0 mm, line 150461 T7 missed by 0 mm, line 150463 T7 missed by 0 mm |
| R5 | proud | 10.2 | slope/curved (faces up) | -0.11 -26.99 8.36 4.37 -11.29 11.73 | +0.269 | +1.022 | face 34 (cylinder r19.521); face 13 (cone) | nearest passes: line 150132 T7 missed by 0 mm, line 150133 T7 missed by 0 mm, line 150131 T7 missed by 0 mm |
| R6 | proud | 8.25 | slope/curved (faces up) | 6.48 7.42 8.75 19.99 13.64 15.61 | +0.377 | +5.000 | face 5 (cone); face 30 (cylinder r19.521); face 29 (cylinder r10) | nearest passes: line 149798 T7 missed by 0 mm, line 149799 T7 missed by 0 mm, line 117138 T2 missed by 0 mm |
| R7 | proud | 5.1 | slope/curved (faces up) | 11.33 -8.56 8.51 23.64 0.76 11.78 | +0.163 | +0.303 | face 5 (cone); face 6 (cylinder r22.021) | nearest passes: line 149838 T7 missed by 0 mm, line 149839 T7 missed by 0 mm, line 153339 T8 missed by 0 mm |
| R8 | proud | 4.65 | slope/curved (faces up) | -13.8 -15.23 9.66 -3.91 -9.18 15.94 | +0.167 | +0.301 | face 14 (cylinder r22.021); face 13 (cone); face 29 (cylinder r10) | nearest passes: line 150166 T7 missed by 0 mm, line 150167 T7 missed by 0 mm, line 153619 T8 missed by 0 mm |
| R9 | proud | 4.65 | slope/curved (faces up) | 7.29 12.02 8.45 19.53 16.22 11.19 | +0.179 | +0.343 | face 25 (cone); face 26 (cylinder r22.021) | nearest passes: line 149667 T7 missed by 0 mm, line 149668 T7 missed by 0 mm, line 153190 T8 missed by 0 mm |
| R10 | proud | 4.05 | slope/curved (faces up) | 2.22 28.73 6.33 11.09 33.63 7.75 | +0.158 | +0.231 | face 40 (cylinder r19.521); face 25 (cone) | nearest passes: line 149602 T7 missed by 0 mm, line 153117 T8 missed by 0 mm, line 149601 T7 missed by 0 mm |
| R11 | proud | 3.6 | slope/curved (faces up) | -7.06 12.65 8.65 -4.53 24.43 10.97 | +0.166 | +0.261 | face 22 (cylinder r22.021); face 21 (cone) | nearest passes: line 150513 T7 missed by 0 mm, line 150514 T7 missed by 0 mm, line 153919 T8 missed by 0 mm |
| R12 | proud | 3.3 | slope/curved (faces up) | -12.96 -34.28 6 -1.93 -28.8 7.96 | +0.163 | +0.372 | face 34 (cylinder r19.521); face 13 (cone); face 3 (plane z6) | nearest passes: line 150099 T7 missed by 0 mm, line 153544 T8 missed by 0 mm, line 153545 T8 missed by 0 mm |
| R13 | proud | 3.3 | slope/curved (faces up) | 6.37 -19.2 9.69 7.02 -10.36 11.48 | +0.164 | +0.245 | face 10 (cylinder r22.021); face 9 (cone) | nearest passes: line 150006 T7 missed by 0 mm, line 150007 T7 missed by 0 mm, line 153482 T8 missed by 0 mm |
| R14 | proud | 3.15 | slope/curved (faces up) | 21.74 11.22 7.18 29.63 13.61 8.75 | +0.151 | +0.247 | face 30 (cylinder r19.521); face 5 (cone) | nearest passes: line 153272 T8 missed by 0 mm, line 153271 T8 missed by 0 mm, line 149777 T7 missed by 0 mm |
| R15 | proud | 2.7 | slope/curved (faces up) | 3.33 -10.14 11.81 3.8 -9.38 17.75 | +0.162 | +0.235 | face 29 (cylinder r10); face 34 (cylinder r19.521); face 13 (cone) | nearest passes: line 153595 T8 missed by 0 mm, line 153594 T8 missed by 0 mm, line 152910 T8 missed by 0 mm |
| R16 | proud | 2.55 | slope/curved (faces up) | 31.66 5.9 6 36.17 9.93 6.96 | +0.188 | +0.374 | face 30 (cylinder r19.521); face 28 (cylinder r1.25); face 5 (cone) | nearest passes: line 153258 T8 missed by 0 mm, line 153259 T8 missed by 0 mm, line 149764 T7 missed by 0 mm |
| R17 | proud | 2.4 | slope/curved (faces up) | -22.27 1.4 8.95 -16.32 6.59 10.58 | +0.163 | +0.251 | face 17 (cone); face 18 (cylinder r22.021) | nearest passes: line 150335 T7 missed by 0 mm, line 150336 T7 missed by 0 mm, line 153766 T8 missed by 0 mm |
| R18 | proud | 2.25 | slope/curved (faces up) | 22.88 -28.42 6 24.53 -20.45 7.22 | +0.159 | +0.269 | face 32 (cylinder r19.521); face 9 (cone); face 3 (plane z6) | nearest passes: line 149928 T7 missed by 0 mm, line 153398 T8 missed by 0 mm, line 153397 T8 missed by 0 mm |
| R19 | proud | 1.8 | slope/curved (faces up) | -6.2 7.93 11.97 -5.92 8.29 17.6 | +0.154 | +0.183 | face 29 (cylinder r10); face 22 (cylinder r22.021); face 21 (cone) | nearest passes: line 153897 T8 missed by 0 mm, line 153896 T8 missed by 0 mm, line 153098 T8 missed by 0 mm |
| R20 | proud | 1.8 | wall (vertical) | 9.92 1.04 12.12 10.09 1.26 17.51 | +0.147 | +0.183 | face 6 (cylinder r22.021); face 29 (cylinder r10) | nearest passes: line 153327 T8 missed by 0.004 mm, line 153326 T8 missed by 0.004 mm, line 153047 T8 missed by 0.016 mm |
| R21 | proud | 1.65 | wall (vertical) | -10.05 -1.21 12.35 -9.93 -1.05 17.44 | +0.157 | +0.188 | face 29 (cylinder r10); face 18 (cylinder r22.021) | nearest passes: line 153754 T8 missed by 0.051 mm, line 153755 T8 missed by 0.051 mm, line 134127 T6 missed by 0.052 mm |
| R22 | proud | 1.65 | wall (vertical) | 5.91 -8.2 12.65 6.02 -7.99 17.78 | +0.142 | +0.188 | face 10 (cylinder r22.021); face 29 (cylinder r10) | nearest passes: line 130897 T6 missed by 0.046 mm, line 130898 T6 missed by 0.046 mm, line 153468 T8 missed by 0.048 mm |
| R23 | proud | 1.5 | slope/curved (faces up) | -24.34 22.79 6.31 -23.5 25.46 6.81 | +0.177 | +0.253 | face 38 (cylinder r19.521); face 21 (cone) | nearest passes: line 153829 T8 missed by 0 mm, line 153830 T8 missed by 0 mm, line 154676 T8 missed by 0 mm |
| R24 | proud | 1.05 | slope/curved (faces up) | -24.53 17.74 6.87 -24.2 21.25 7.71 | +0.156 | +0.220 | face 38 (cylinder r19.521); face 21 (cone) | nearest passes: line 150438 T7 missed by 0 mm, line 150439 T7 missed by 0 mm, line 153837 T8 missed by 0 mm |
| R25 | proud | 1.05 | slope/curved (faces up) | -23.44 26.79 6 -23.07 28.43 6.43 | +0.292 | +0.855 | face 20 (cylinder r1.25); face 21 (cone); face 38 (cylinder r19.521) | nearest passes: line 150419 T7 missed by 0 mm, line 150420 T7 missed by 0 mm, line 150418 T7 missed by 0 mm |
| R26 | proud | 1.05 | slope/curved (faces up) | 12.55 33.92 6 12.97 34.38 6.48 | +0.353 | +0.611 | face 3 (plane z6); face 24 (cylinder r1.25) | nearest passes: line 149582 T7 missed by 0 mm, line 149581 T7 missed by 0 mm, line 149583 T7 missed by 0 mm |
| R27 | proud | 0.9 | wall (vertical) | -10.25 1.57 16.54 -9.83 1.84 17.73 | +0.153 | +0.254 | face 38 (cylinder r19.521); face 29 (cylinder r10) | nearest passes: line 153879 T8 missed by 0.047 mm, line 153880 T8 missed by 0.047 mm, line 153092 T8 missed by 0.061 mm |
| R28 | proud | 0.6 | slope/curved (faces up) | -6.74 9.87 11.39 -6.42 10.69 11.59 | +0.152 | +0.209 | face 21 (cone); face 22 (cylinder r22.021) | nearest passes: line 150494 T7 missed by 0 mm, line 150495 T7 missed by 0 mm, line 153900 T8 missed by 0 mm |
| R29 | proud | 0.45 | slope/curved (faces up) | -18.62 -16.21 8.61 -16.52 -15.99 9 | +0.122 | +0.153 | face 13 (cone); face 14 (cylinder r22.021) | nearest passes: line 117668 T2 missed by 0 mm, line 150186 T7 missed by 0 mm, line 150187 T7 missed by 0 mm |
| R30 | proud | 0.45 | wall (vertical) | 4.13 9.24 12.05 4.18 9.3 12.64 | +0.137 | +0.157 | face 26 (cylinder r22.021) | nearest passes: line 153184 T8 missed by 0.001 mm, line 153183 T8 missed by 0.001 mm, line 152878 T8 missed by 0.013 mm |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 515.0 | 21259.2 | 107.817 |
| T2 | 6 mm 3-flute flat endmill | 74.9 | 1888.9 | 4.58 |
| T3 | 3 mm 2-flute flat endmill | 90.7 | 543.1 | 0.056 |
| T4 | 1.5 mm 2-flute flat endmill | 452.2 | 1302.7 | 0.014 |
| T6 | 6 mm ball endmill | 964.6 | 18282.5 | 1.359 |
| T7 | 3 mm ball endmill | 102.1 | 1533.9 | 0.122 |
| T8 | 1 mm ball endmill | 1236.9 | 4000.1 | 0.092 |

Moves: 162455, cut length 48810 mm, rapid length 34173 mm, estimated cycle time 58.2 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
