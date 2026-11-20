# Simulation feedback: ftc10 (3+2)

**Score: 96.285% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 84.802%). Program valid: **YES** (0 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 96.285 |
| machinable_gouge_pct | 0.01 |
| machinable_proud_pct | 3.705 |
| max_gouge_mm | 5.0 |
| unreachable_area_pct | 12.527 |
| parting_face_pct | 6.244 |
| setups | 7 |
| distinct_orientations | 5 |
| final_connection_mm2 | 13.0 |
| cycle_time_min | 85.84 |

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 11-45675 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T2, T3, T6 | 61943 | 74.21 |
| 2 | 45681-245527 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T6 | 267007 | 102.894 |
| 3 | 245535-253726 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3 | 7894 | 106.361 |
| 4 | 253733-253758 | (0.0, 0.8192, 0.5736) | 55 / 90 | T1 | 25 | 4.855 |
| 5 | 253762-253787 | (0.0, -0.8192, 0.5736) | 55 / -90 | T1 | 25 | 4.84 |
| 6 | 253791-253832 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 41 | 21.98 |
| 7 | 253836-253877 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 41 | 23.952 |

## Rigidity / part-off (connection area in the stub gap; stock section 6068.0 mm2; part-off marker at line 253724)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 45675 | 6068.0 | 1.000 | [6068.0] | False |
| 2 | 245527 | 4200.44 | 0.692 | [4200.44] | False |
| 3 | 253726 | 3605.81 | 0.594 | [3605.81] | False |
| 4 | 253758 | 3590.62 | 0.592 | [3590.62] | True |
| 5 | 253787 | 3575.44 | 0.589 | [3575.44] | True |
| 6 | 253832 | 2010.0 | 0.331 | [2010.0] | True |
| 7 | 253877 | 13.0 | 0.002 | [6.5, 6.5] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 855.9 | -15.36 -78.82 0 15.46 78.82 74.91 | (-0.87, -0.21, -0.45) | +0.561 / +4.881 | face 41 (cylinder r1); face 69 (cylinder r1); face 98 (cylinder r1) | line 220903 T6 frame 1 missed 0; line 220837 T6 frame 1 missed 0; line 220902 T6 frame 1 missed 0 |
| R2 | proud | 155.41 | -5.25 48.51 58.25 0.25 62.47 63.75 | (1.0, 0.0, -0.02) | +4.974 / +5.000 | face 177 (cylinder r2.75) | line 245478 T4 frame 1 missed 0.258; line 245476 T4 frame 1 missed 0.258; line 245379 T4 frame 1 missed 0.56 |
| R3 | proud | 104.32 | -2.25 54.8 9.75 3.25 62.46 18.22 | (-0.98, 0.0, 0.19) | +4.865 / +5.000 | face 175 (cylinder r2.75); face 198 (cone) | line 154355 T1 frame 1 missed 0.057; line 230691 T6 frame 1 missed 0.067; line 230685 T6 frame 1 missed 0.089 |
| R4 | proud | 63.72 | -13.64 19.14 24.7 -7.5 30.14 45.97 | (-0.83, 0.55, -0.12) | +0.326 / +0.877 | face 183 (bspline); face 94 (cylinder r6); face 105 (cylinder r8) | line 237002 T6 frame 1 missed 0; line 237003 T6 frame 1 missed 0; line 237004 T6 frame 1 missed 0 |
| R5 | proud | 45.07 | 7.59 69.42 30.16 15.46 78.26 63.42 | (-0.5, 0.79, -0.35) | +0.298 / +0.755 | face 71 (cylinder r1); face 89 (cylinder r1); face 129 (plane) | line 252353 T2 frame 2 missed 0.051; line 252354 T2 frame 2 missed 0.054; line 30442 T1 frame 0 missed 0.074 |
| R6 | proud | 19.43 | -10.33 31.25 30.6 -7.36 62.04 32.21 | (-0.63, 0.01, -0.78) | +0.121 / +0.166 | face 94 (cylinder r6); face 95 (cylinder r1); face 87 (torus) | line 234709 T6 frame 1 missed 0; line 234708 T6 frame 1 missed 0; line 234707 T6 frame 1 missed 0 |
| R7 | proud | 18.65 | -7.52 27.12 5.86 -7.5 28.7 18.95 | (-1.0, -0.02, 0.0) | +0.118 / +0.120 | face 24 (plane); face 15 (cylinder r1) | line 227780 T6 frame 1 missed 0; line 227647 T6 frame 1 missed 0; line 227779 T6 frame 1 missed 0 |
| R8 | proud | 15.54 | -7.65 22.42 2.4 -7.5 23.99 20.87 | (-1.0, 0.06, 0.0) | +0.117 / +0.120 | face 24 (plane); face 96 (cylinder r1) | line 230358 T6 frame 1 missed 0; line 229844 T6 frame 1 missed 0; line 230357 T6 frame 1 missed 0 |
| R9 | proud | 11.46 | -1.5 14.52 12.64 0.39 19.96 17 | (0.8, -0.41, 0.43) | +0.286 / +0.505 | face 151 (sphere r2); face 157 (cylinder r2); face 152 (cylinder r2) | line 253441 T2 frame 2 missed 0; line 253442 T2 frame 2 missed 0; line 253433 T2 frame 2 missed 0 |
| R10 | proud | 11.27 | -1.5 15.79 59.55 0.3 19.87 62.48 | (0.75, -0.41, -0.53) | +0.317 / +0.499 | face 150 (sphere r2); face 158 (cylinder r2); face 152 (cylinder r2) | line 253519 T2 frame 2 missed 0; line 253520 T2 frame 2 missed 0; line 253440 T2 frame 2 missed 0.014 |
| R11 | proud | 10.68 | -1.5 -57.99 12.51 0.43 -54.33 16.99 | (0.73, 0.47, 0.5) | +0.298 / +0.485 | face 154 (sphere r2); face 157 (cylinder r2); face 155 (cylinder r2) | line 253485 T2 frame 2 missed 0; line 253486 T2 frame 2 missed 0; line 253442 T2 frame 2 missed 0.016 |
| R12 | proud | 10.3 | -1.46 -57.96 58.71 0.46 -54.51 62.44 | (0.72, 0.49, -0.49) | +0.282 / +0.503 | face 153 (sphere r2); face 155 (cylinder r2); face 158 (cylinder r2) | line 253545 T2 frame 2 missed 0; line 253546 T2 frame 2 missed 0; line 253527 T2 frame 2 missed 0 |
| R13 | proud | 6.41 | 2.6 43.79 10.79 3.25 45.44 14.27 | (-0.99, 0.0, -0.11) | +4.959 / +5.000 | face 175 (cylinder r2.75) | line 253862 T1 frame 6 missed 11.601; line 253868 T1 frame 6 missed 11.601; line 253863 T1 frame 6 missed 11.701 |
| R14 | proud | 6.22 | -2.38 -31.16 20.75 -1.54 -28.76 23.25 | (0.0, -0.69, 0.73) | +5.000 / +5.000 | face 4 (cylinder r1.25) | line 251718 T2 frame 2 missed 0; line 251666 T2 frame 2 missed 1.236; line 251769 T2 frame 2 missed 1.764 |
| R15 | proud | 6.02 | -0.3 39.64 59.35 0.25 41.47 62.62 | (-1.0, -0.0, 0.1) | +4.948 / +5.000 | face 177 (cylinder r2.75) | line 30616 T1 frame 0 missed 10.066; line 30615 T1 frame 0 missed 10.066; line 18450 T1 frame 0 missed 10.61 |
| R16 | proud | 4.27 | -2.47 -9.25 20.76 -1.57 -6.76 23.04 | (0.0, -0.06, 1.0) | +5.000 / +5.000 | face 2 (cylinder r1.25) | line 253825 T1 frame 5 missed 21.754; line 253815 T1 frame 5 missed 21.754; line 253809 T1 frame 5 missed 21.754 |
| R17 | proud | 4.08 | 2.59 32.6 10.72 3.25 34.36 14.26 | (-1.0, -0.0, 0.05) | +4.979 / +5.000 | face 175 (cylinder r2.75) | line 253869 T1 frame 6 missed 11.545; line 253861 T1 frame 6 missed 11.545; line 253862 T1 frame 6 missed 11.546 |
| R18 | proud | 3.89 | -11 -54.85 44.88 -4.02 -48.5 45.29 | (0.8, -0.59, -0.0) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 45484 T2 frame 0 missed 0; line 45483 T2 frame 0 missed 0; line 219110 T6 frame 1 missed 4.46 |
| R19 | proud | 3.89 | -0.31 46.86 59.33 0.25 48.28 62.6 | (-1.0, 0.0, -0.0) | +4.950 / +5.000 | face 177 (cylinder r2.75) | line 163295 T2 frame 1 missed 11.388; line 163296 T2 frame 1 missed 11.388; line 163090 T2 frame 1 missed 11.388 |
| R20 | proud | 3.69 | -10.98 12 44.89 -7.52 17.5 45.3 | (0.87, -0.49, -0.0) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 45670 T2 frame 0 missed 0; line 236879 T6 frame 1 missed 4.381; line 237001 T6 frame 1 missed 4.415 |
| R21 | proud | 3.69 | 7.59 -76.64 71.48 8.03 -73.13 74.31 | (-0.72, -0.39, 0.57) | +0.181 / +0.343 | face 36 (torus) | line 29609 T1 frame 0 missed 0; line 29606 T1 frame 0 missed 0.006; line 29577 T1 frame 0 missed 0.024 |
| R22 | proud | 3.11 | -10.07 53.36 42.92 -7.5 60.17 44.37 | (-0.71, -0.0, 0.71) | +0.109 / +0.118 | face 94 (cylinder r6); face 93 (cylinder r1) | line 236766 T6 frame 1 missed 0; line 236767 T6 frame 1 missed 0; line 236768 T6 frame 1 missed 0 |
| R23 | proud | 2.91 | 0.6 34.13 16.69 0.9 36.15 18.46 | (-1.0, -0.08, 0.03) | +0.251 / +0.469 | face 194 (cone) | line 244799 T4 frame 1 missed 0; line 253574 T2 frame 2 missed 14.172; line 253583 T2 frame 2 missed 14.172 |
| R24 | proud | 2.91 | 0.6 42 6.5 0.87 43.81 8.31 | (-0.96, 0.09, 0.26) | +0.260 / +0.434 | face 190 (cone) | line 244691 T4 frame 1 missed 0; line 253828 T1 frame 5 missed 7.515; line 253863 T1 frame 6 missed 7.515 |
| R25 | proud | 2.72 | -10.78 -6.77 44.87 -4.92 -4.58 45.25 | (0.41, -0.91, -0.0) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 45608 T2 frame 0 missed 0; line 236999 T6 frame 1 missed 26.384; line 237002 T6 frame 1 missed 26.393 |
| R26 | proud | 2.53 | -10.07 44.68 42.92 -7.5 51.79 44.38 | (-0.55, -0.0, 0.84) | +0.107 / +0.119 | face 94 (cylinder r6); face 93 (cylinder r1) | line 236760 T6 frame 1 missed 0; line 236868 T6 frame 1 missed 0; line 237005 T6 frame 1 missed 0 |
| R27 | proud | 2.53 | -1.93 -31.25 51.81 -1.61 -28.82 54.24 | (0.0, 0.88, 0.48) | +5.000 / +5.000 | face 6 (cylinder r1.25) | line 45536 T2 frame 0 missed 2.082; line 45532 T2 frame 0 missed 2.082; line 45533 T2 frame 0 missed 2.082 |
| R28 | proud | 2.53 | 0.59 30.84 6.68 0.85 32.58 8.24 | (-0.97, 0.26, 0.03) | +0.253 / +0.406 | face 192 (cone) | line 244637 T4 frame 1 missed 0; line 244636 T4 frame 1 missed 0; line 244638 T4 frame 1 missed 0 |
| R29 | proud | 2.14 | -1.9 -53.22 20.8 -1.55 -50.76 23.23 | (0.0, -0.45, 0.89) | +5.000 / +5.000 | face 3 (cylinder r1.25) | line 253434 T2 frame 2 missed 0; line 251718 T2 frame 2 missed 0; line 251719 T2 frame 2 missed 0 |
| R30 | proud | 1.94 | -7.27 32.24 74.64 -6.92 36.59 74.91 | (-0.65, 0.0, 0.76) | +0.139 / +0.224 | face 54 (cylinder r1) | line 29945 T1 frame 0 missed 0; line 30057 T1 frame 0 missed 0; line 29951 T1 frame 0 missed 0 |

Cycle time 85.8 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
