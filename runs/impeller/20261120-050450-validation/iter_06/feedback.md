# Simulation feedback - iteration 6: impeller

**Score: 99.169% of the machinable surface within +-0.1 mm** (all non-datum surface: 98.55%).  Program valid: **NO** (1 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.169 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 0.831 |
| max_gouge_mm | 0.0432 |
| tool_limited_area_pct | 0.632 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.136 |
| gouged_cm3 | 0.0843 |
| removed_cm3 | 114.052 |
| cycle_time_min | 54.31 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.

## Errors (the program would crash, break a tool or is not executable) - must be fixed

- line 165810: material contact above the flute length (shank rubbing / tool too short); first at line 165810: move (6.91, -7.93, 11.89) -> (6.55, -8.23, 11.89) with T8, removed 0.057 mm3, max 5.653 mm deep (flute length 3 mm) x2 (lines 165810, 166239)

## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines (gouge: lines that cut it; proud: closest passes that could have reached it) |
|---|---|---|---|---|---|---|---|---|
| R1 | proud | 8.55 | slope/curved (faces up) | 11.65 -14.51 7.96 23.62 -2.12 11.57 | +0.264 | +1.278 | face 9 (cone); face 32 (cylinder r19.521) | nearest passes: line 157127 T7 missed by 0 mm, line 157128 T7 missed by 0 mm, line 157126 T7 missed by 0 mm |
| R2 | proud | 7.95 | slope/curved (faces up) | -23.75 1.54 8.12 -10.1 14.92 12.54 | +0.202 | +0.712 | face 38 (cylinder r19.521); face 21 (cone) | nearest passes: line 157629 T7 missed by 0 mm, line 166208 T8 missed by 0 mm, line 166209 T8 missed by 0 mm |
| R3 | proud | 7.65 | slope/curved (faces up) | -22.63 -13.67 8.45 -12.2 -11.72 10.56 | +0.309 | +1.144 | face 17 (cone); face 36 (cylinder r19.521) | nearest passes: line 166056 T8 missed by 0 mm, line 157453 T7 missed by 0 mm, line 157454 T7 missed by 0 mm |
| R4 | proud | 6.75 | slope/curved (faces up) | 2.63 -20.79 9.45 4.37 -11.29 11.62 | +0.312 | +1.022 | face 34 (cylinder r19.521); face 13 (cone) | nearest passes: line 157296 T7 missed by 0 mm, line 157297 T7 missed by 0 mm, line 157295 T7 missed by 0 mm |
| R5 | proud | 5.4 | slope/curved (faces up) | -4.21 15.88 8.41 -0.17 26.63 10.56 | +0.423 | +5.000 | face 25 (cone); face 40 (cylinder r19.521) | nearest passes: line 156796 T7 missed by 0 mm, line 156795 T7 missed by 0 mm, line 156794 T7 missed by 0 mm |
| R6 | proud | 5.25 | slope/curved (faces up) | 11.4 11.59 8.75 19.99 13.63 10.71 | +0.515 | +5.000 | face 5 (cone); face 30 (cylinder r19.521) | nearest passes: line 156963 T7 missed by 0 mm, line 156964 T7 missed by 0 mm, line 156962 T7 missed by 0 mm |
| R7 | proud | 4.5 | slope/curved (faces up) | 7.29 12.02 8.45 19.53 16.22 11.19 | +0.175 | +0.343 | face 26 (cylinder r22.021); face 25 (cone) | nearest passes: line 165556 T8 missed by 0 mm, line 156855 T7 missed by 0 mm, line 156856 T7 missed by 0 mm |
| R8 | proud | 4.35 | slope/curved (faces up) | 12.62 -8.56 8.51 23.64 0.28 11.43 | +0.157 | +0.303 | face 5 (cone); face 6 (cylinder r22.021) | nearest passes: line 157013 T7 missed by 0 mm, line 165692 T8 missed by 0 mm, line 157014 T7 missed by 0 mm |
| R9 | proud | 3.75 | slope/curved (faces up) | -35.83 -13.14 6 -24.67 -5.52 8.06 | +0.146 | +0.278 | face 36 (cylinder r19.521); face 17 (cone); face 16 (cylinder r1.25) | nearest passes: line 166022 T8 missed by 0 mm, line 157421 T7 missed by 0 mm, line 166021 T8 missed by 0 mm |
| R10 | proud | 3.3 | slope/curved (faces up) | -13.8 -15.23 9.66 -6.75 -11.61 11.31 | +0.168 | +0.301 | face 14 (cylinder r22.021); face 13 (cone) | nearest passes: line 157337 T7 missed by 0 mm, line 165969 T8 missed by 0 mm, line 157336 T7 missed by 0 mm |
| R11 | proud | 3.3 | slope/curved (faces up) | -6.96 13.44 8.65 -4.53 24.43 10.96 | +0.160 | +0.235 | face 22 (cylinder r22.021); face 21 (cone) | nearest passes: line 166263 T8 missed by 0 mm, line 157677 T7 missed by 0 mm, line 157678 T7 missed by 0 mm |
| R12 | proud | 2.85 | slope/curved (faces up) | 3.23 30 6.33 11.09 33.63 7.66 | +0.142 | +0.195 | face 40 (cylinder r19.521); face 25 (cone) | nearest passes: line 165463 T8 missed by 0 mm, line 165464 T8 missed by 0 mm, line 165462 T8 missed by 0 mm |
| R13 | proud | 2.85 | slope/curved (faces up) | 6.37 -19.2 9.69 7.02 -11.46 11.24 | +0.148 | +0.220 | face 10 (cylinder r22.021); face 9 (cone) | nearest passes: line 157164 T7 missed by 0 mm, line 165819 T8 missed by 0 mm, line 157163 T7 missed by 0 mm |
| R14 | proud | 2.4 | slope/curved (faces up) | -22.27 1.4 8.95 -16.32 6.59 10.58 | +0.157 | +0.224 | face 17 (cone); face 18 (cylinder r22.021) | nearest passes: line 166109 T8 missed by 0 mm, line 157499 T7 missed by 0 mm, line 157500 T7 missed by 0 mm |
| R15 | proud | 2.25 | slope/curved (faces up) | 31.66 5.9 6 36.17 9.93 6.96 | +0.170 | +0.374 | face 30 (cylinder r19.521); face 28 (cylinder r1.25); face 5 (cone) | nearest passes: line 165598 T8 missed by 0 mm, line 156927 T7 missed by 0 mm, line 156928 T7 missed by 0 mm |
| R16 | proud | 1.65 | slope/curved (faces up) | -7.04 -32.29 6.93 -2.19 -28.8 7.64 | +0.138 | +0.181 | face 34 (cylinder r19.521); face 13 (cone) | nearest passes: line 165898 T8 missed by 0 mm, line 165899 T8 missed by 0 mm, line 157273 T7 missed by 0 mm |
| R17 | proud | 1.65 | slope/curved (faces up) | -4.37 11.51 10.86 -4.04 14.38 11.49 | +0.172 | +0.272 | face 40 (cylinder r19.521); face 25 (cone) | nearest passes: line 162714 T8 missed by 0 mm, line 161342 T8 missed by 0 mm, line 164086 T8 missed by 0 mm |
| R18 | proud | 1.5 | slope/curved (faces up) | -10.34 -11.02 10.85 -7.29 -8.76 11.68 | +0.194 | +0.262 | face 17 (cone); face 36 (cylinder r19.521) | nearest passes: line 165004 T8 missed by 0 mm, line 163632 T8 missed by 0 mm, line 162260 T8 missed by 0 mm |
| R19 | proud | 1.5 | slope/curved (faces up) | 24.48 11.39 7.18 29.04 13.19 8.11 | +0.153 | +0.203 | face 5 (cone); face 30 (cylinder r19.521) | nearest passes: line 165614 T8 missed by 0 mm, line 165615 T8 missed by 0 mm, line 156942 T7 missed by 0 mm |
| R20 | proud | 1.05 | slope/curved (faces up) | -24.34 22.79 6.44 -23.92 25.01 6.81 | +0.169 | +0.206 | face 38 (cylinder r19.521); face 21 (cone) | nearest passes: line 166171 T8 missed by 0 mm, line 157592 T7 missed by 0 mm, line 166170 T8 missed by 0 mm |
| R21 | proud | 1.05 | wall (vertical) | -3.74 9.38 12.24 -3.39 9.58 16.96 | +0.135 | +0.176 | face 40 (cylinder r19.521); face 29 (cylinder r10) | nearest passes: line 165509 T8 missed by 0.034 mm, line 165508 T8 missed by 0.034 mm, line 162738 T8 missed by 0.034 mm |
| R22 | proud | 1.05 | slope/curved (faces up) | 3.41 -10.14 11.81 3.8 -9.38 14.61 | +0.132 | +0.167 | face 29 (cylinder r10); face 34 (cylinder r19.521); face 13 (cone) | nearest passes: line 162051 T8 missed by 0 mm, line 164795 T8 missed by 0 mm, line 164796 T8 missed by 0 mm |
| R23 | proud | 1.05 | slope/curved (faces up) | 12.55 33.92 6 12.97 34.38 6.48 | +0.327 | +0.611 | face 3 (plane z6); face 24 (cylinder r1.25) | nearest passes: line 156746 T7 missed by 0 mm, line 156745 T7 missed by 0 mm, line 156747 T7 missed by 0 mm |
| R24 | proud | 0.9 | slope/curved (faces up) | -24.53 18.1 6.87 -24.2 21.25 7.53 | +0.131 | +0.184 | face 38 (cylinder r19.521); face 21 (cone) | nearest passes: line 166181 T8 missed by 0 mm, line 157603 T7 missed by 0 mm, line 157602 T7 missed by 0 mm |
| R25 | proud | 0.9 | slope/curved (faces up) | -23.44 26.79 6 -23.07 28.43 6.43 | +0.307 | +0.855 | face 20 (cylinder r1.25); face 21 (cone); face 38 (cylinder r19.521) | nearest passes: line 157579 T7 missed by 0 mm, line 157578 T7 missed by 0 mm, line 157577 T7 missed by 0 mm |
| R26 | proud | 0.9 | slope/curved (faces up) | -12.96 -34.28 6 -9.64 -32.93 6.47 | +0.164 | +0.372 | face 3 (plane z6); face 13 (cone); face 34 (cylinder r19.521) | nearest passes: line 157247 T7 missed by 0 mm, line 157248 T7 missed by 0 mm, line 157246 T7 missed by 0 mm |
| R27 | proud | 0.9 | slope/curved (faces up) | 1.84 -23.71 8.82 2.76 -22.3 9.35 | +0.152 | +0.223 | face 34 (cylinder r19.521); face 13 (cone) | nearest passes: line 165910 T8 missed by 0 mm, line 165911 T8 missed by 0 mm, line 157284 T7 missed by 0 mm |
| R28 | proud | 0.75 | wall (vertical) | -9.94 -1.14 15.9 -9.93 -1.11 17.44 | +0.133 | +0.139 | face 29 (cylinder r10) | nearest passes: line 166098 T8 missed by 0.048 mm, line 163789 T8 missed by 0.048 mm, line 165161 T8 missed by 0.048 mm |
| R29 | proud | 0.75 | wall (vertical) | 9.84 -1.76 12.66 10.18 -1.54 15.42 | +0.132 | +0.177 | face 29 (cylinder r10); face 32 (cylinder r19.521) | nearest passes: line 161819 T8 missed by 0.044 mm, line 163191 T8 missed by 0.044 mm, line 163192 T8 missed by 0.044 mm |
| R30 | proud | 0.75 | wall (vertical) | 9.93 1.06 16.11 10.02 1.16 17.51 | +0.117 | +0.135 | face 29 (cylinder r10); face 6 (cylinder r22.021) | nearest passes: line 161732 T8 missed by 0.043 mm, line 161731 T8 missed by 0.043 mm, line 165668 T8 missed by 0.043 mm |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 515.0 | 21259.2 | 107.817 |
| T2 | 6 mm 3-flute flat endmill | 74.9 | 1888.9 | 4.58 |
| T3 | 3 mm 2-flute flat endmill | 90.7 | 543.1 | 0.056 |
| T4 | 1.5 mm 2-flute flat endmill | 316.3 | 1346.0 | 0.022 |
| T6 | 6 mm ball endmill | 964.6 | 18282.5 | 1.359 |
| T7 | 3 mm ball endmill | 102.1 | 1533.9 | 0.122 |
| T8 | 1 mm ball endmill | 1139.0 | 4102.3 | 0.096 |

Moves: 174799, cut length 48956 mm, rapid length 32198 mm, estimated cycle time 54.3 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
