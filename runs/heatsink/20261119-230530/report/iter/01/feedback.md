# Simulation feedback - iteration 1: heatsink

**Score: 99.414% of the machinable surface within +-0.1 mm** (all non-datum surface: 99.41%).  Program valid: **YES** (0 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.414 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 0.586 |
| max_gouge_mm | 0.0 |
| tool_limited_area_pct | 0.0 |
| undercut_area_pct | 0.0 |
| remaining_excess_cm3 | 0.13 |
| gouged_cm3 | 0.2292 |
| removed_cm3 | 89.27 |
| cycle_time_min | 14.48 |

Gouges (target material removed) scrap the part: fix them first. 'tool_limited' surface needs a tool smaller than the library has (sharp internal corners); 'undercut' surface cannot be reached from +Z. Both are excluded from the score and shown as proud material, as is a 0.03 mm band along face edges (normal probing is ill-posed exactly at an edge). gouged_cm3 / remaining_excess_cm3 are height-field estimates on the simulation grid (they include wall-cell discretisation and in-tolerance deviations); the surface percentages are the exact measure.


## Out-of-tolerance regions (largest first)

| id | type | area mm2 | surface | bbox (xmin ymin zmin xmax ymax zmax) | mean dev | extreme | faces | G-code lines (gouge: lines that cut it; proud: closest passes that could have reached it) |
|---|---|---|---|---|---|---|---|---|
| R1 | proud | 31.95 | slope/curved (faces up) | -28.2 -21.53 14.96 -27.57 21.89 15.29 | +0.206 | +0.334 | face 38 (cylinder r60) | nearest passes: line 10857 T6 missed by 0 mm, line 10742 T2 missed by 0.024 mm, line 10788 T6 missed by 0.054 mm |
| R2 | proud | 21.3 | slope/curved (faces up) | 27.57 -21.88 14.96 28.2 5.51 15.29 | +0.200 | +0.333 | face 56 (cylinder r60) | nearest passes: line 10929 T6 missed by 0 mm, line 10754 T2 missed by 0.025 mm, line 10840 T6 missed by 0.055 mm |
| R3 | proud | 11.55 | slope/curved (faces up) | 27.59 7.37 14.97 28.19 21.89 15.28 | +0.205 | +0.328 | face 56 (cylinder r60) | nearest passes: line 10929 T6 missed by 0 mm, line 10754 T2 missed by 0.032 mm, line 10840 T6 missed by 0.062 mm |
| R4 | proud | 3.3 | slope/curved (faces up) | 19.04 -10.37 18.84 19.22 -1.17 18.9 | +0.125 | +0.149 | face 53 (cylinder r60) | nearest passes: line 10917 T6 missed by 0 mm, line 10730 T2 missed by 0.016 mm, line 10832 T6 missed by 0.046 mm |
| R5 | proud | 2.7 | slope/curved (faces up) | 19.06 2.14 18.84 19.21 9.82 18.89 | +0.123 | +0.150 | face 53 (cylinder r60) | nearest passes: line 10917 T6 missed by 0 mm, line 10730 T2 missed by 0.018 mm, line 10832 T6 missed by 0.048 mm |
| R6 | proud | 2.55 | slope/curved (faces up) | -19.2 0.25 18.84 -19.05 7.13 18.89 | +0.132 | +0.150 | face 41 (cylinder r60) | nearest passes: line 10869 T6 missed by 0 mm, line 10688 T2 missed by 0.025 mm, line 10796 T6 missed by 0.055 mm |
| R7 | proud | 1.95 | slope/curved (faces up) | -19.22 -20.94 18.84 -19.08 -15.11 18.89 | +0.126 | +0.149 | face 41 (cylinder r60) | nearest passes: line 10869 T6 missed by 0 mm, line 10688 T2 missed by 0.016 mm, line 10796 T6 missed by 0.046 mm |
| R8 | proud | 1.65 | slope/curved (faces up) | -19.22 -13.28 18.84 -19.09 -6.66 18.88 | +0.126 | +0.147 | face 41 (cylinder r60) | nearest passes: line 10688 T2 missed by 0.016 mm, line 10796 T6 missed by 0.046 mm, line 10764 T6 missed by 0.266 mm |
| R9 | proud | 1.65 | slope/curved (faces up) | 19.04 -20.81 18.84 19.2 -15.53 18.9 | +0.127 | +0.151 | face 53 (cylinder r60) | nearest passes: line 10917 T6 missed by 0 mm, line 10730 T2 missed by 0.024 mm, line 10832 T6 missed by 0.054 mm |
| R10 | proud | 1.5 | slope/curved (faces up) | -19.2 11.44 18.84 -19.04 15.98 18.9 | +0.124 | +0.150 | face 41 (cylinder r60) | nearest passes: line 10869 T6 missed by 0 mm, line 10688 T2 missed by 0.026 mm, line 10796 T6 missed by 0.056 mm |
| R11 | proud | 1.35 | slope/curved (faces up) | 19.05 13.39 18.84 19.21 18.16 18.89 | +0.127 | +0.140 | face 53 (cylinder r60) | nearest passes: line 10917 T6 missed by 0 mm, line 10730 T2 missed by 0.021 mm, line 10832 T6 missed by 0.051 mm |
| R12 | proud | 0.6 | slope/curved (faces up) | -19.22 -4.79 18.84 -19.08 -3.39 18.89 | +0.122 | +0.140 | face 41 (cylinder r60) | nearest passes: line 10869 T6 missed by 0 mm, line 10688 T2 missed by 0.017 mm, line 10796 T6 missed by 0.047 mm |
| R13 | proud | 0.6 | slope/curved (faces up) | -19.2 19.94 18.84 -19.04 21.45 18.9 | +0.133 | +0.148 | face 41 (cylinder r60) | nearest passes: line 10869 T6 missed by 0 mm, line 10688 T2 missed by 0.023 mm, line 10796 T6 missed by 0.053 mm |
| R14 | proud | 0.6 | slope/curved (faces up) | 19.14 20.3 18.84 19.2 21.87 18.86 | +0.138 | +0.144 | face 53 (cylinder r60) | nearest passes: line 10730 T2 missed by 0.023 mm, line 10832 T6 missed by 0.053 mm, line 10562 T1 missed by 0.131 mm |
| R15 | proud | 0.3 | slope/curved (faces up) | 19.06 0.44 18.85 19.2 0.69 18.89 | +0.126 | +0.149 | face 53 (cylinder r60) | nearest passes: line 10917 T6 missed by 0 mm, line 10730 T2 missed by 0.031 mm, line 10832 T6 missed by 0.061 mm |
| R16 | gouge | 0.15 | slope/curved (faces up) | -25.75 19.86 16.19 -25.75 19.86 16.19 | -5.000 | -5.000 | face 38 (cylinder r60) | cut by 10690 |
| R17 | gouge | 0.15 | wall (vertical) | -7.75 -9.77 21.5 -7.75 -9.77 21.5 | -5.000 | -5.000 | face 42 (plane) | cut by 10873 |
| R18 | proud | 0.15 | slope/curved (faces up) | -19.13 -1.2 18.87 -19.13 -1.2 18.87 | +0.125 | +0.125 | face 41 (cylinder r60) | nearest passes: line 10688 T2 missed by 0.105 mm, line 10796 T6 missed by 0.135 mm, line 10589 T2 missed by 0.355 mm |
| R19 | proud | 0.15 | slope/curved (faces up) | -19.1 9.53 18.88 -19.1 9.53 18.88 | +0.118 | +0.118 | face 41 (cylinder r60) | nearest passes: line 10688 T2 missed by 0.131 mm, line 10796 T6 missed by 0.161 mm, line 10579 T2 missed by 0.381 mm |
| R20 | proud | 0.15 | slope/curved (faces up) | 19.07 -13.4 18.89 19.07 -13.4 18.89 | +0.109 | +0.109 | face 53 (cylinder r60) | nearest passes: line 10917 T6 missed by 0 mm, line 10730 T2 missed by 0.159 mm, line 10832 T6 missed by 0.189 mm |

## Tools

| T | tool | time s | cut length mm | removed cm3 |
|---|---|---|---|---|
| T1 | 10 mm 3-flute flat endmill | 573.7 | 27342.5 | 63.278 |
| T2 | 6 mm 3-flute flat endmill | 95.7 | 3335.5 | 21.864 |
| T3 | 3 mm 2-flute flat endmill | 19.2 | 227.7 | 0.282 |
| T6 | 6 mm ball endmill | 148.3 | 3341.4 | 3.847 |

Moves: 15110, cut length 34247 mm, rapid length 3119 mm, estimated cycle time 14.5 min.

Images: `deviation_top.png` (probe points coloured by deviation, regions boxed), `height_error_top.png`, `machined_top.png`, `section_x.png`, `section_y.png`.
