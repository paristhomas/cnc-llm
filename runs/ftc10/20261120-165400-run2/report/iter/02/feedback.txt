# Simulation feedback - iteration 2: ftc10 (3+2)

**Score: 93.875% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 82.694%). Program valid: **NO** (2 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 93.875 |
| machinable_gouge_pct | 0.01 |
| machinable_proud_pct | 6.115 |
| max_gouge_mm | 5.0 |
| unreachable_area_pct | 12.527 |
| parting_face_pct | 6.244 |
| setups | 7 |
| distinct_orientations | 5 |
| final_connection_mm2 | 13.0 |
| cycle_time_min | 82.65 |

## Errors (must be fixed)

- line 247716: tool holder (D32) of T1 hits the fixed vise jaw (-Y) (first at line 247716, frame 4; vise boxes are in setup.json; holder is a cylinder from the stick-out to 50 mm above it) x5 (lines 247716, 247717, 247718, 247719, 247720)
- line 247691: tool holder (D32) of T1 hits the moving vise jaw (+Y) (first at line 247691, frame 3; vise boxes are in setup.json; holder is a cylinder from the stick-out to 50 mm above it) x5 (lines 247691, 247692, 247693, 247694, 247695)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 11-45675 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T2, T3, T6 | 61943 | 74.21 |
| 2 | 45681-239630 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T6 | 261110 | 102.713 |
| 3 | 239638-247669 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3 | 7739 | 106.003 |
| 4 | 247676-247697 | (0.0, 1.0, 0.0) | 90 / 90 | T1 | 21 | 4.038 |
| 5 | 247701-247722 | (0.0, -1.0, 0.0) | 90 / -90 | T1 | 21 | 4.017 |
| 6 | 247726-247767 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 41 | 22.204 |
| 7 | 247771-247812 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 41 | 24.14 |

## Rigidity / part-off (connection area in the stub gap; stock section 6068.0 mm2; part-off marker at line 247667)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 45675 | 6068.0 | 1.000 | [6068.0] | False |
| 2 | 239630 | 4201.06 | 0.692 | [4201.06] | False |
| 3 | 247669 | 3606.44 | 0.594 | [3606.44] | False |
| 4 | 247697 | 3606.44 | 0.594 | [3606.44] | True |
| 5 | 247722 | 3606.44 | 0.594 | [3606.44] | True |
| 6 | 247767 | 1939.88 | 0.320 | [1939.88] | True |
| 7 | 247812 | 13.0 | 0.002 | [6.5, 6.5] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 1134.86 | -15.36 -78.82 0 15.46 78.82 74.91 | (-0.93, -0.04, -0.36) | +0.530 / +2.234 | face 41 (cylinder r1); face 69 (cylinder r1); face 98 (cylinder r1) | line 170545 T6 frame 1 missed 0; line 170544 T6 frame 1 missed 0; line 172225 T6 frame 1 missed 0 |
| R2 | proud | 310.42 | -1.5 -58 12.5 0.47 20 44.69 | (0.77, 0.16, 0.61) | +1.477 / +3.091 | face 157 (cylinder r2); face 155 (cylinder r2); face 152 (cylinder r2) | line 247419 T2 frame 2 missed 0; line 245252 T1 frame 2 missed 0; line 245781 T2 frame 2 missed 0.02 |
| R3 | proud | 289.64 | -1.5 -58 46.1 0.47 20 62.5 | (0.79, -0.01, -0.62) | +0.449 / +0.917 | face 158 (cylinder r2); face 152 (cylinder r2); face 155 (cylinder r2) | line 246110 T2 frame 2 missed 0; line 246111 T2 frame 2 missed 0.059; line 247534 T2 frame 2 missed 0.064 |
| R4 | proud | 155.41 | -5.25 48.51 58.25 0.25 62.47 63.75 | (1.0, 0.0, -0.02) | +4.974 / +5.000 | face 177 (cylinder r2.75) | line 239580 T4 frame 1 missed 0.258; line 239581 T4 frame 1 missed 0.258; line 239579 T4 frame 1 missed 0.258 |
| R5 | proud | 146.86 | -8.47 27.12 4.12 -7.5 60.37 20.88 | (-1.0, 0.0, -0.02) | +0.664 / +0.919 | face 11 (cylinder r1); face 13 (cylinder r1); face 15 (cylinder r1) | line 221750 T6 frame 1 missed 0; line 221436 T6 frame 1 missed 0; line 221883 T6 frame 1 missed 0 |
| R6 | proud | 104.32 | -2.25 54.8 9.75 3.25 62.46 18.22 | (-0.98, 0.0, 0.19) | +4.865 / +5.000 | face 175 (cylinder r2.75); face 198 (cone) | line 154355 T1 frame 1 missed 0.057; line 224794 T6 frame 1 missed 0.067; line 224788 T6 frame 1 missed 0.089 |
| R7 | proud | 79.84 | -8.46 34.64 52.62 -7.5 60.25 69.39 | (-0.99, -0.02, -0.1) | +0.621 / +0.929 | face 26 (torus); face 28 (torus); face 27 (cylinder r1) | line 30081 T1 frame 0 missed 0; line 30084 T1 frame 0 missed 0; line 232643 T6 frame 1 missed 0 |
| R8 | proud | 51.67 | -1.5 18.13 19.33 0.46 20 44.77 | (0.61, -0.8, 0.0) | +0.354 / +0.880 | face 152 (cylinder r2) | line 245804 T2 frame 2 missed 0; line 245902 T2 frame 2 missed 0; line 245800 T2 frame 2 missed 0.009 |
| R9 | proud | 45.07 | 7.59 69.42 30.16 15.46 78.26 63.42 | (-0.5, 0.79, -0.35) | +0.298 / +0.755 | face 71 (cylinder r1); face 89 (cylinder r1); face 129 (plane) | line 246456 T2 frame 2 missed 0.051; line 246457 T2 frame 2 missed 0.054; line 30442 T1 frame 0 missed 0.074 |
| R10 | proud | 6.6 | -8.36 45.86 68.51 -7.51 50.96 69.35 | (-0.74, 0.0, 0.67) | +0.479 / +0.819 | face 25 (cylinder r1) | line 30081 T1 frame 0 missed 0; line 237655 T6 frame 1 missed 0; line 30110 T1 frame 0 missed 0.003 |
| R11 | proud | 6.41 | 2.6 43.79 10.79 3.25 45.44 14.27 | (-0.99, 0.0, -0.11) | +4.959 / +5.000 | face 175 (cylinder r2.75) | line 247797 T1 frame 6 missed 11.601; line 247803 T1 frame 6 missed 11.601; line 247798 T1 frame 6 missed 11.701 |
| R12 | proud | 6.22 | -2.38 -31.16 20.75 -1.54 -28.76 23.25 | (0.0, -0.69, 0.73) | +5.000 / +5.000 | face 4 (cylinder r1.25) | line 245821 T2 frame 2 missed 0; line 245769 T2 frame 2 missed 1.236; line 245872 T2 frame 2 missed 1.764 |
| R13 | proud | 6.02 | -0.3 39.64 59.35 0.25 41.47 62.62 | (-1.0, -0.0, 0.1) | +4.948 / +5.000 | face 177 (cylinder r2.75) | line 30616 T1 frame 0 missed 10.066; line 30615 T1 frame 0 missed 10.066; line 18450 T1 frame 0 missed 10.61 |
| R14 | proud | 4.27 | -2.47 -9.25 20.76 -1.57 -6.76 23.04 | (0.0, -0.06, 1.0) | +5.000 / +5.000 | face 2 (cylinder r1.25) | line 247760 T1 frame 5 missed 21.754; line 247750 T1 frame 5 missed 21.754; line 247744 T1 frame 5 missed 21.754 |
| R15 | proud | 4.08 | 2.59 32.6 10.72 3.25 34.36 14.26 | (-1.0, -0.0, 0.05) | +4.979 / +5.000 | face 175 (cylinder r2.75) | line 247804 T1 frame 6 missed 11.545; line 247796 T1 frame 6 missed 11.545; line 247797 T1 frame 6 missed 11.546 |
| R16 | proud | 3.89 | -11 -54.85 44.88 -4.02 -48.5 45.29 | (0.8, -0.59, -0.0) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 45484 T2 frame 0 missed 0; line 45483 T2 frame 0 missed 0; line 213213 T6 frame 1 missed 4.46 |
| R17 | proud | 3.89 | -0.31 46.86 59.33 0.25 48.28 62.6 | (-1.0, 0.0, -0.0) | +4.950 / +5.000 | face 177 (cylinder r2.75) | line 157193 T2 frame 1 missed 11.388; line 157194 T2 frame 1 missed 11.388; line 157398 T2 frame 1 missed 11.388 |
| R18 | proud | 3.69 | -10.98 12 44.89 -7.52 17.5 45.3 | (0.87, -0.49, -0.0) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 45670 T2 frame 0 missed 0; line 230982 T6 frame 1 missed 4.381; line 231104 T6 frame 1 missed 4.415 |
| R19 | proud | 3.69 | 7.59 -76.64 71.48 8.03 -73.13 74.31 | (-0.72, -0.39, 0.57) | +0.181 / +0.343 | face 36 (torus) | line 29609 T1 frame 0 missed 0; line 29606 T1 frame 0 missed 0.006; line 29577 T1 frame 0 missed 0.024 |
| R20 | proud | 2.91 | 0.6 34.13 16.69 0.9 36.15 18.46 | (-1.0, -0.08, 0.03) | +0.251 / +0.469 | face 194 (cone) | line 238902 T4 frame 1 missed 0; line 247418 T2 frame 2 missed 14.172; line 245790 T2 frame 2 missed 14.215 |
| R21 | proud | 2.91 | 0.6 42 6.5 0.87 43.81 8.31 | (-0.96, 0.09, 0.26) | +0.260 / +0.434 | face 190 (cone) | line 238794 T4 frame 1 missed 0; line 247763 T1 frame 5 missed 7.515; line 247798 T1 frame 6 missed 7.515 |
| R22 | proud | 2.72 | -10.78 -6.77 44.87 -4.92 -4.58 45.25 | (0.41, -0.91, -0.0) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 45608 T2 frame 0 missed 0; line 231102 T6 frame 1 missed 26.384; line 231105 T6 frame 1 missed 26.393 |
| R23 | proud | 2.53 | -1.93 -31.25 51.81 -1.61 -28.82 54.24 | (0.0, 0.88, 0.48) | +5.000 / +5.000 | face 6 (cylinder r1.25) | line 45536 T2 frame 0 missed 2.082; line 45532 T2 frame 0 missed 2.082; line 45533 T2 frame 0 missed 2.082 |
| R24 | proud | 2.53 | 0.59 30.84 6.68 0.85 32.58 8.24 | (-0.97, 0.26, 0.03) | +0.253 / +0.406 | face 192 (cone) | line 238740 T4 frame 1 missed 0; line 238741 T4 frame 1 missed 0; line 238739 T4 frame 1 missed 0 |
| R25 | proud | 2.14 | -1.9 -53.22 20.8 -1.55 -50.76 23.23 | (0.0, -0.45, 0.89) | +5.000 / +5.000 | face 3 (cylinder r1.25) | line 247537 T2 frame 2 missed 0; line 245821 T2 frame 2 missed 0; line 245822 T2 frame 2 missed 0 |
| R26 | proud | 1.94 | -7.27 32.24 74.64 -6.92 36.59 74.91 | (-0.65, 0.0, 0.76) | +0.139 / +0.224 | face 54 (cylinder r1) | line 29945 T1 frame 0 missed 0; line 30057 T1 frame 0 missed 0; line 29951 T1 frame 0 missed 0 |
| R27 | proud | 1.75 | -10.98 -29.6 44.98 -9.54 -27.16 45.23 | (0.82, -0.57, -0.0) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 213206 T6 frame 1 missed 28.542; line 211561 T6 frame 1 missed 28.546; line 213296 T6 frame 1 missed 28.553 |
| R28 | proud | 1.75 | -7.29 -33.49 45.04 -4.02 -30.32 45.27 | (-0.6, 0.8, 0.0) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 45546 T2 frame 0 missed 0; line 213220 T6 frame 1 missed 26.606; line 211547 T6 frame 1 missed 26.611 |
| R29 | proud | 1.75 | 7.84 77.2 68.17 8.04 78.57 71.21 | (-0.56, 0.77, 0.31) | +0.148 / +0.167 | face 64 (torus) | line 30273 T1 frame 0 missed 0; line 30268 T1 frame 0 missed 0; line 30264 T1 frame 0 missed 0.017 |
| R30 | proud | 1.55 | -6.32 15.66 45.13 -4.42 17.29 45.3 | (-0.68, -0.73, 0.0) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 45670 T2 frame 0 missed 0; line 239382 T4 frame 1 missed 26.743; line 239380 T4 frame 1 missed 26.743 |

Cycle time 82.7 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
