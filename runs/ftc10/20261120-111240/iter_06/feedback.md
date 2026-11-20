# Simulation feedback - iteration 6: ftc10 (3+2)

**Score: 86.141% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 82.969%). Program valid: **NO** (1 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 86.141 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 13.859 |
| max_gouge_mm | 0.0151 |
| unreachable_area_pct | 3.683 |
| parting_face_pct | 0.681 |
| setups | 7 |
| distinct_orientations | 5 |
| final_connection_mm2 | 102.0 |
| cycle_time_min | 139.03 |

## Errors (must be fixed)

- line 29788: material contact above the flute length (shank rubbing / tool too short); first at line 29788 (frame 2, T1), removed column up to 28.00 mm x4 (lines 29788, 30439, 30741, 48229)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 13-23445 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T3, T4, T7 | 32614 | 179.893 |
| 2 | 23454-40648 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2 | 49944 | 137.526 |
| 3 | 40657-58427 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2 | 50519 | 126.376 |
| 4 | 58436-75745 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T3, T5 | 21012 | 11.111 |
| 5 | 75754-81344 | (0.0, -1.0, 0.0) | 90 / -90 | T5 | 5588 | 1.596 |
| 6 | 81354-81479 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 124 | 57.765 |
| 7 | 81484-81639 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 152 | 60.783 |

## Rigidity / part-off (connection area in the stub gap; stock section 13284.0 mm2; part-off marker at line 81342)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 23445 | 13284.0 | 1.000 | [13284.0] | False |
| 2 | 40648 | 12792.0 | 0.963 | [12792.0] | False |
| 3 | 58427 | 12300.0 | 0.926 | [12300.0] | False |
| 4 | 75745 | 12300.0 | 0.926 | [12300.0] | False |
| 5 | 81344 | 12300.0 | 0.926 | [12300.0] | False |
| 6 | 81479 | 6006.0 | 0.452 | [6006.0] | True |
| 7 | 81639 | 102.0 | 0.008 | [51.0, 51.0] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 2350.07 | -37.41 -64.56 0 37.41 62.4 23.56 | (-0.03, -0.06, -1.0) | +0.895 / +5.000 | face 24 (plane); face 94 (cylinder r6); face 105 (cylinder r8) | line 39673 T1 frame 2 missed 0; line 39674 T1 frame 2 missed 0; line 39672 T1 frame 2 missed 0 |
| R2 | proud | 855.28 | -37.39 27.98 0.03 -12.07 60.98 30.77 | (-0.36, 0.04, -0.93) | +1.311 / +5.000 | face 31 (plane); face 208 (cylinder r7.5); face 29 (cylinder r7.5) | line 21113 T3 frame 1 missed 0; line 21114 T3 frame 1 missed 0; line 21115 T3 frame 1 missed 0 |
| R3 | proud | 520.47 | 22.25 25.95 13.25 27.75 58.19 18.75 | (0.13, 0.58, -0.81) | +5.000 / +5.000 | face 175 (cylinder r2.75); face 174 (cone); face 201 (cylinder r1.75) | line 35958 T1 frame 2 missed 4.476; line 38305 T1 frame 2 missed 4.476; line 37719 T1 frame 2 missed 4.476 |
| R4 | proud | 394.62 | -26.25 33.42 10.25 -20.75 58.18 15.75 | (0.14, 0.6, -0.79) | +5.000 / +5.000 | face 177 (cylinder r2.75); face 176 (cone); face 180 (cylinder r1.75) | line 46487 T1 frame 3 missed 5.335; line 46488 T1 frame 3 missed 5.335; line 44778 T1 frame 3 missed 5.335 |
| R5 | proud | 385.5 | -8.6 -11.5 4.5 8.6 -4.5 11.5 | (0.0, 0.86, 0.5) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 39134 T1 frame 2 missed 5.016; line 38564 T1 frame 2 missed 5.016; line 39140 T1 frame 2 missed 5.02 |
| R6 | proud | 385.5 | -8.6 10.5 4.5 8.6 17.5 11.5 | (-0.0, -0.64, 0.77) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 58422 T2 frame 3 missed 0; line 58421 T2 frame 3 missed 0; line 39081 T1 frame 2 missed 5.009 |
| R7 | proud | 379.86 | -8.58 -33.5 4.5 8.59 -26.5 11.5 | (-0.0, 0.48, -0.88) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 39193 T1 frame 2 missed 5.01; line 57106 T1 frame 3 missed 5.016; line 57105 T1 frame 3 missed 5.016 |
| R8 | proud | 378.12 | -8.6 -55.5 4.5 8.6 -48.5 11.5 | (0.0, -1.0, 0.07) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 58173 T2 frame 3 missed 0; line 39242 T1 frame 2 missed 5.002; line 39250 T1 frame 2 missed 5.01 |
| R9 | proud | 240.23 | -25 -58 15.06 25 20 15.97 | (-0.0, -0.02, 1.0) | +0.188 / +0.251 | face 157 (cylinder r2); face 158 (cylinder r2); face 152 (cylinder r2) | line 11191 T1 frame 1 missed 0; line 21314 T3 frame 1 missed 0; line 11189 T1 frame 1 missed 0 |
| R10 | proud | 140.22 | -37.4 61.93 11.21 37.4 64 23.17 | (-0.01, 0.62, -0.78) | +0.271 / +0.500 | face 69 (cylinder r1); face 112 (plane); face 70 (cylinder r1) | line 71214 T5 frame 4 missed 0; line 63163 T1 frame 4 missed 0; line 70849 T5 frame 4 missed 0 |
| R11 | proud | 30.88 | -9.18 69.42 23.09 26.84 78.75 23.95 | (-0.15, 0.68, -0.72) | +0.210 / +0.416 | face 71 (cylinder r1); face 66 (torus); face 61 (torus) | line 70079 T5 frame 4 missed 0; line 62440 T1 frame 4 missed 0; line 62441 T1 frame 4 missed 0 |
| R12 | proud | 26.41 | -4.14 -78.51 23.1 26.54 -69.43 23.93 | (-0.17, -0.64, -0.75) | +0.230 / +0.430 | face 34 (cylinder r1); face 40 (torus); face 33 (torus) | line 77161 T5 frame 5 missed 0; line 77160 T5 frame 5 missed 0; line 77162 T5 frame 5 missed 0 |
| R13 | proud | 25.83 | 36.88 -29.72 0.26 37.41 13.27 3.76 | (0.75, -0.03, -0.66) | +0.190 / +0.328 | face 78 (torus); face 76 (torus); face 77 (torus) | line 31295 T1 frame 2 missed 0; line 31296 T1 frame 2 missed 0; line 31294 T1 frame 2 missed 0 |
| R14 | proud | 22.33 | 14.25 -31.25 11.36 16.75 -28.75 13.9 | (0.84, -0.55, 0.0) | +4.922 / +5.000 | face 4 (cylinder r1.25) | line 40477 T2 frame 2 missed 0.036; line 40469 T2 frame 2 missed 0.036; line 40464 T2 frame 2 missed 0.098 |
| R15 | proud | 20.39 | -16.75 -9.25 11.44 -14.25 -6.75 13.96 | (-0.41, 0.91, 0.0) | +4.832 / +5.000 | face 0 (cylinder r1.25) | line 58329 T2 frame 3 missed 0.025; line 58324 T2 frame 3 missed 0.025; line 58338 T2 frame 3 missed 0.027 |
| R16 | proud | 20.0 | -16.75 12.75 11.42 -14.25 15.25 13.96 | (0.58, 0.81, 0.0) | +4.868 / +5.000 | face 7 (cylinder r1.25) | line 11594 T1 frame 1 missed 0; line 4678 T1 frame 1 missed 0; line 4377 T1 frame 1 missed 0 |
| R17 | proud | 19.61 | -16.75 -31.25 11.34 -14.25 -28.75 13.91 | (-0.07, -1.0, 0.0) | +4.861 / +5.000 | face 6 (cylinder r1.25) | line 58254 T2 frame 3 missed 0.187; line 58235 T2 frame 3 missed 0.187; line 58244 T2 frame 3 missed 0.187 |
| R18 | proud | 19.23 | -16.75 -53.25 11.4 -14.25 -50.75 13.95 | (-1.0, -0.06, 0.0) | +4.685 / +5.000 | face 1 (cylinder r1.25) | line 58159 T2 frame 3 missed 0.055; line 58172 T2 frame 3 missed 0.055; line 58152 T2 frame 3 missed 0.058 |
| R19 | proud | 19.23 | 14.25 -9.25 11.5 16.75 -6.75 13.93 | (0.34, 0.94, 0.0) | +5.000 / +5.000 | face 2 (cylinder r1.25) | line 40541 T2 frame 2 missed 0.082; line 40553 T2 frame 2 missed 0.082; line 40550 T2 frame 2 missed 0.082 |
| R20 | proud | 18.45 | 14.26 12.75 11.34 16.74 15.25 13.95 | (0.58, -0.82, 0.0) | +4.858 / +5.000 | face 5 (cylinder r1.25) | line 40640 T2 frame 2 missed 0.031; line 40635 T2 frame 2 missed 0.031; line 40623 T2 frame 2 missed 0.031 |
| R21 | proud | 18.26 | 14.25 -53.25 11.48 16.75 -50.75 13.95 | (-0.46, -0.89, 0.0) | +4.952 / +5.000 | face 3 (cylinder r1.25) | line 40385 T2 frame 2 missed 0.233; line 40392 T2 frame 2 missed 0.233; line 40394 T2 frame 2 missed 0.233 |
| R22 | proud | 17.87 | -37.39 -38.67 0.24 -36.87 -9.15 3.73 | (-0.72, -0.06, -0.69) | +0.198 / +0.327 | face 49 (torus); face 48 (torus); face 47 (torus) | line 48923 T1 frame 3 missed 0; line 48922 T1 frame 3 missed 0; line 48921 T1 frame 3 missed 0 |
| R23 | proud | 17.67 | -27.03 -78.72 23.09 -5.54 -69.42 23.96 | (0.24, -0.63, -0.74) | +0.211 / +0.380 | face 34 (cylinder r1); face 36 (torus); face 32 (torus) | line 23215 T4 frame 1 missed 0; line 23214 T4 frame 1 missed 0; line 23216 T4 frame 1 missed 0 |
| R24 | proud | 13.4 | 36.87 -50.23 0.27 37.41 -30.89 3.66 | (0.75, -0.01, -0.66) | +0.175 / +0.312 | face 80 (torus); face 81 (torus); face 79 (torus) | line 31343 T1 frame 2 missed 0; line 31344 T1 frame 2 missed 0; line 31342 T1 frame 2 missed 0 |
| R25 | proud | 10.29 | -21.53 69.43 23.1 -10.86 75.15 23.79 | (0.35, 0.59, -0.73) | +0.223 / +0.390 | face 71 (cylinder r1); face 64 (torus); face 59 (torus) | line 69843 T5 frame 4 missed 0; line 69844 T5 frame 4 missed 0; line 69845 T5 frame 4 missed 0 |
| R26 | proud | 6.99 | -37.22 71.52 23.12 -30.38 78.58 23.62 | (-0.49, 0.54, -0.68) | +0.186 / +0.361 | face 64 (torus) | line 51082 T1 frame 3 missed 0; line 51083 T1 frame 3 missed 0; line 51081 T1 frame 3 missed 0 |
| R27 | proud | 6.99 | 30.68 -78.34 23.14 37.27 -71.38 23.61 | (0.53, -0.48, -0.7) | +0.213 / +0.370 | face 40 (torus) | line 32696 T1 frame 2 missed 0; line 32695 T1 frame 2 missed 0; line 32694 T1 frame 2 missed 0 |
| R28 | proud | 6.8 | 30.02 71.31 23.1 37.28 78.71 23.51 | (0.47, 0.53, -0.71) | +0.190 / +0.358 | face 66 (torus) | line 31581 T1 frame 2 missed 0; line 31580 T1 frame 2 missed 0; line 31582 T1 frame 2 missed 0 |
| R29 | proud | 6.6 | -37.29 -78.71 23.1 -30.13 -71.28 23.6 | (-0.55, -0.48, -0.68) | +0.202 / +0.350 | face 36 (torus) | line 49977 T1 frame 3 missed 0; line 49978 T1 frame 3 missed 0; line 49979 T1 frame 3 missed 0 |
| R30 | proud | 6.02 | -37.4 -50.3 0.48 -36.89 -40.2 3.71 | (-0.72, 0.19, -0.67) | +0.193 / +0.320 | face 47 (torus); face 46 (torus) | line 48834 T1 frame 3 missed 0; line 48832 T1 frame 3 missed 0; line 48831 T1 frame 3 missed 0 |

Cycle time 139.0 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
