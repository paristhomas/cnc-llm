# Simulation feedback: ftc08 (3+2)

**Score: 99.778% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 98.354%). Program valid: **YES** (0 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.778 |
| machinable_gouge_pct | 0.001 |
| machinable_proud_pct | 0.221 |
| max_gouge_mm | 5.0 |
| unreachable_area_pct | 1.444 |
| parting_face_pct | 18.962 |
| setups | 28 |
| distinct_orientations | 13 |
| final_connection_mm2 | 2660.06 |
| cycle_time_min | 40.53 |

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 11-38743 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T2, T3, T4, T5 | 57706 | 343.957 |
| 2 | 38751-38804 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 54 | 33.84 |
| 3 | 38813-38866 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 54 | 34.871 |
| 4 | 38875-38938 | (0.0, -1.0, 0.0) | 90 / -90 | T1 | 64 | 22.998 |
| 5 | 38947-39010 | (0.0, 1.0, 0.0) | 90 / 90 | T1 | 64 | 23.341 |
| 6 | 39019-39082 | (-0.7071, -0.7071, 0.0) | 90 / -135 | T1 | 64 | 1.916 |
| 7 | 39091-39154 | (-0.7071, 0.7071, 0.0) | 90 / 135 | T1 | 64 | 1.904 |
| 8 | 39163-39226 | (0.7071, -0.7071, 0.0) | 90 / -45 | T1 | 64 | 1.89 |
| 9 | 39235-39298 | (0.7071, 0.7071, 0.0) | 90 / 45 | T1 | 64 | 1.871 |
| 10 | 39312-39346 | (-1.0, -0.0, 0.0) | 90 / -180 | T5 | 35 | 2.89 |
| 11 | 39355-39389 | (1.0, -0.0, 0.0) | 90 / -0 | T5 | 35 | 2.887 |
| 12 | 39398-39432 | (0.0, -1.0, 0.0) | 90 / -90 | T5 | 35 | 1.989 |
| 13 | 39441-39475 | (0.0, 1.0, 0.0) | 90 / 90 | T5 | 35 | 1.857 |
| 14 | 39484-39501 | (-0.7071, -0.7071, 0.0) | 90 / -135 | T5 | 18 | 0.256 |
| 15 | 39510-39527 | (-0.7071, 0.7071, 0.0) | 90 / 135 | T5 | 18 | 0.262 |
| 16 | 39536-39553 | (0.7071, -0.7071, 0.0) | 90 / -45 | T5 | 18 | 0.264 |
| 17 | 39562-39579 | (0.7071, 0.7071, 0.0) | 90 / 45 | T5 | 18 | 0.259 |
| 18 | 39593-42574 | (-0.9659, -0.0, -0.2588) | 105 / -180 | T8 | 2982 | 0.073 |
| 19 | 42583-45564 | (0.9659, -0.0, -0.2588) | 105 / -0 | T8 | 2982 | 0.061 |
| 20 | 45573-47650 | (0.0, -0.9659, -0.2588) | 105 / -90 | T8 | 2078 | 0.046 |
| 21 | 47659-49736 | (0.0, 0.9659, -0.2588) | 105 / 90 | T8 | 2078 | 0.041 |
| 22 | 49750-57515 | (0.0, 1.0, 0.0) | 90 / 90 | T4 | 7761 | 0.141 |
| 23 | 57530-83222 | (0.0, 0.0, 1.0) | 0 / 0 | T1 | 25693 | 56.862 |
| 24 | 83236-124222 | (0.0, 0.0, 1.0) | 0 / 0 | T2 | 40987 | 1.652 |
| 25 | 124236-124279 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 44 | 49.689 |
| 26 | 124288-124331 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 44 | 49.924 |
| 27 | 124340-124357 | (0.0, -1.0, 0.0) | 90 / -90 | T1 | 18 | 11.81 |
| 28 | 124366-124383 | (0.0, 1.0, 0.0) | 90 / 90 | T1 | 18 | 11.889 |

## Rigidity / part-off (connection area in the stub gap; stock section 18986.5 mm2; part-off marker at line 57519)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 38743 | 14550.88 | 0.766 | [14550.88] | False |
| 2 | 38804 | 13337.75 | 0.703 | [13337.75] | False |
| 3 | 38866 | 12165.06 | 0.641 | [12165.06] | False |
| 4 | 38938 | 11345.06 | 0.598 | [11345.06] | False |
| 5 | 39010 | 10550.69 | 0.556 | [10550.69] | False |
| 6 | 39082 | 10486.0 | 0.552 | [10486.0] | False |
| 7 | 39154 | 10421.31 | 0.549 | [10421.31] | False |
| 8 | 39226 | 10356.62 | 0.545 | [10356.62] | False |
| 9 | 39298 | 10289.06 | 0.542 | [10289.06] | False |
| 10 | 39346 | 10038.56 | 0.529 | [10038.56] | False |
| 11 | 39389 | 9788.56 | 0.516 | [9788.56] | False |
| 12 | 39432 | 9645.94 | 0.508 | [9645.94] | False |
| 13 | 39475 | 9482.94 | 0.499 | [9482.94] | False |
| 14 | 39501 | 9458.19 | 0.498 | [9458.19] | False |
| 15 | 39527 | 9434.12 | 0.497 | [9434.12] | False |
| 16 | 39553 | 9409.38 | 0.496 | [9409.38] | False |
| 17 | 39579 | 9384.62 | 0.494 | [9384.62] | False |
| 18 | 42574 | 9384.62 | 0.494 | [9384.62] | False |
| 19 | 45564 | 9384.62 | 0.494 | [9384.62] | False |
| 20 | 47650 | 9384.62 | 0.494 | [9384.62] | False |
| 21 | 49736 | 9384.62 | 0.494 | [9384.62] | False |
| 22 | 57515 | 9384.62 | 0.494 | [9384.62] | False |
| 23 | 83222 | 9384.62 | 0.494 | [9384.62] | True |
| 24 | 124222 | 9384.62 | 0.494 | [9384.62] | True |
| 25 | 124279 | 6582.5 | 0.347 | [6582.5] | True |
| 26 | 124331 | 3192.0 | 0.168 | [2325.69, 866.31] | True |
| 27 | 124357 | 2972.0 | 0.157 | [2325.69, 646.31] | True |
| 28 | 124383 | 2660.06 | 0.140 | [2059.25, 600.81] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 9.96 | -40.64 53.02 0.03 -37.47 56.16 1.68 | (1.0, -0.09, -0.0) | +5.000 / +5.000 | face 179 (cylinder r1.5875); face 180 (cylinder r1.5875) | line 124263 T1 frame 24 missed 6.035; line 124265 T1 frame 24 missed 6.035; line 124269 T1 frame 24 missed 6.035 |
| R2 | proud | 6.7 | -19.93 59.41 0.05 -17.78 61.6 1.65 | (-0.6, -0.8, -0.0) | +0.596 / +0.970 | face 227 (plane); face 228 (plane); face 14 (cylinder r0.7938) | line 36477 T4 frame 0 missed 0.047; line 36478 T4 frame 0 missed 0.047; line 36473 T4 frame 0 missed 0.047 |
| R3 | proud | 6.13 | 30.25 47.15 0.04 33.23 48.22 1.54 | (0.23, 0.97, -0.0) | +0.573 / +0.815 | face 234 (cylinder r1.5875); face 0 (cylinder r1.5875) | line 6995 T2 frame 0 missed 0.062; line 6996 T2 frame 0 missed 0.062; line 6994 T2 frame 0 missed 0.068 |
| R4 | proud | 4.21 | -31.75 59.48 0.14 -29.77 61.6 1.57 | (0.68, -0.74, 0.0) | +0.654 / +0.948 | face 227 (plane); face 230 (plane); face 11 (cylinder r0.7938) | line 5825 T2 frame 0 missed 0.064; line 5826 T2 frame 0 missed 0.064; line 36512 T4 frame 0 missed 0.072 |
| R5 | proud | 2.87 | 37.71 -69.82 1.93 38.86 -69.08 3.2 | (-0.25, 0.9, 0.36) | +0.161 / +0.228 | face 112 (sphere r1.524); face 145 (cylinder r1.524) | line 38724 T5 frame 0 missed 0; line 38723 T5 frame 0 missed 0; line 38701 T5 frame 0 missed 0 |
| R6 | proud | 2.68 | -39.03 68.81 1.82 -37.61 69.83 3.29 | (0.32, -0.8, 0.51) | +0.155 / +0.229 | face 108 (sphere r1.524); face 123 (plane); face 101 (cylinder r1.524) | line 38710 T5 frame 0 missed 0; line 38709 T5 frame 0 missed 0; line 38688 T5 frame 0 missed 0 |
| R7 | proud | 2.3 | 47.43 59.6 2.01 48.04 60.58 3.3 | (-0.84, -0.36, 0.41) | +0.176 / +0.223 | face 114 (sphere r1.524); face 143 (cylinder r1.524); face 150 (cylinder r1.524) | line 38728 T5 frame 0 missed 0; line 38727 T5 frame 0 missed 0; line 38706 T5 frame 0 missed 0 |
| R8 | proud | 2.11 | 37.66 68.82 1.86 38.84 69.83 3.13 | (-0.31, -0.84, 0.45) | +0.151 / +0.200 | face 115 (sphere r1.524); face 149 (cylinder r1.524) | line 38730 T5 frame 0 missed 0; line 38729 T5 frame 0 missed 0; line 38708 T5 frame 0 missed 0 |
| R9 | proud | 1.72 | -4.09 72.29 3.93 -1.51 72.92 4.32 | (0.0, 0.0, 1.0) | +0.201 / +0.317 | face 249 (plane); face 250 (plane); face 253 (plane) | line 53767 T4 frame 21 missed 0.045; line 52178 T4 frame 21 missed 0.045; line 53768 T4 frame 21 missed 0.045 |
| R10 | proud | 1.53 | -48.05 -60.54 1.85 -47.04 -59.51 3.13 | (0.74, 0.18, 0.65) | +0.137 / +0.173 | face 110 (sphere r1.524); face 147 (cylinder r1.524) | line 38736 T5 frame 0 missed 0; line 38735 T5 frame 0 missed 0; line 38713 T5 frame 0 missed 0 |
| R11 | proud | 1.53 | -48.05 59.45 1.98 -47.38 60.46 3.28 | (0.86, -0.29, 0.41) | +0.162 / +0.205 | face 109 (sphere r1.524); face 147 (cylinder r1.524); face 121 (plane) | line 38734 T5 frame 0 missed 0; line 38733 T5 frame 0 missed 0; line 38711 T5 frame 0 missed 0 |
| R12 | proud | 1.53 | -38.69 -69.81 1.85 -37.77 -68.81 3 | (0.4, 0.66, 0.63) | +0.141 / +0.187 | face 111 (sphere r1.524); face 145 (cylinder r1.524) | line 38737 T5 frame 0 missed 0; line 38738 T5 frame 0 missed 0; line 38715 T5 frame 0 missed 0 |
| R13 | proud | 1.53 | 47.32 -60.8 2.29 47.98 -60.09 3.14 | (-0.8, 0.48, 0.35) | +0.166 / +0.227 | face 113 (sphere r1.524); face 144 (cylinder r1.524) | line 38725 T5 frame 0 missed 0; line 38726 T5 frame 0 missed 0; line 38703 T5 frame 0 missed 0 |
| R14 | proud | 1.34 | 9.71 71.97 11.12 10.92 72.87 11.43 | (0.37, 0.0, -0.93) | +0.208 / +0.401 | face 260 (plane); face 259 (plane) | line 52945 T4 frame 21 missed 0.05; line 51356 T4 frame 21 missed 0.05; line 52946 T4 frame 21 missed 0.05 |
| R15 | proud | 1.34 | 14.17 71.95 3.93 14.46 72.86 5.51 | (-1.0, 0.0, 0.0) | +0.270 / +0.403 | face 263 (plane); face 264 (plane); face 262 (plane) | line 51376 T4 frame 21 missed 0.066; line 52965 T4 frame 21 missed 0.066; line 52964 T4 frame 21 missed 0.066 |
| R16 | proud | 1.15 | 8.41 -65.41 0.03 11.4 -65.41 0.09 | (0.0, 1.0, 0.0) | +5.000 / +5.000 | face 214 (plane) | line 34110 T4 frame 0 missed 10.416; line 34109 T4 frame 0 missed 10.416; line 34108 T4 frame 0 missed 10.416 |
| R17 | proud | 1.15 | 51.1 61.47 6.7 51.14 61.57 10.73 | (0.93, 0.37, 0.0) | +0.111 / +0.123 | face 81 (cylinder r1.524) | line 38858 T1 frame 2 missed 0; line 38860 T1 frame 2 missed 0; line 38856 T1 frame 2 missed 2.435 |
| R18 | proud | 0.96 | -17.06 -59.06 0.04 -13.33 -59.06 0.12 | (0.0, -1.0, 0.0) | +5.000 / +5.000 | face 216 (plane) | line 33920 T4 frame 0 missed 5.026; line 33921 T4 frame 0 missed 5.026; line 33919 T4 frame 0 missed 5.026 |
| R19 | proud | 0.96 | -13.97 72.09 11.08 -12.42 72.9 11.43 | (0.89, 0.0, -0.45) | +0.240 / +0.532 | face 239 (plane); face 238 (plane); face 236 (plane) | line 56748 T4 frame 21 missed 0.053; line 56749 T4 frame 21 missed 0.053; line 55749 T4 frame 21 missed 0.053 |
| R20 | proud | 0.96 | 26.41 -65.41 0.04 27.99 -65.41 0.12 | (0.0, 1.0, 0.0) | +5.000 / +5.000 | face 214 (plane) | line 124330 T1 frame 25 missed 6.128; line 124327 T1 frame 25 missed 6.128; line 124329 T1 frame 25 missed 6.128 |
| R21 | proud | 0.96 | 54.73 -77.56 19.39 55.29 -77.13 19.94 | (0.55, -0.62, -0.55) | +0.155 / +0.214 | face 126 (sphere r1.524) | line 39379 T5 frame 10 missed 0; line 39381 T5 frame 10 missed 0; line 39382 T5 frame 10 missed 0 |
| R22 | proud | 0.77 | -51.12 61.5 2.07 -51.09 61.57 3.86 | (-0.92, 0.39, 0.0) | +0.114 / +0.123 | face 78 (cylinder r1.524) | line 39144 T1 frame 6 missed 0; line 39513 T5 frame 14 missed 0; line 39317 T5 frame 9 missed 0.198 |
| R23 | proud | 0.77 | -51.12 61.51 8.39 -51.09 61.57 9.54 | (-0.92, 0.39, 0.0) | +0.115 / +0.125 | face 78 (cylinder r1.524) | line 39146 T1 frame 6 missed 0; line 39148 T1 frame 6 missed 0; line 39145 T1 frame 6 missed 1.456 |
| R24 | proud | 0.77 | -39.8 72.85 1.26 -39.72 72.91 4.03 | (-0.41, 0.91, -0.05) | +0.107 / +0.111 | face 79 (cylinder r1.524); face 138 (sphere r1.524) | line 39144 T1 frame 6 missed 0; line 39146 T1 frame 6 missed 0; line 39446 T5 frame 12 missed 0 |
| R25 | proud | 0.77 | -39.8 72.87 10.51 -39.71 72.91 12.78 | (-0.39, 0.92, 0.0) | +0.109 / +0.124 | face 79 (cylinder r1.524) | line 39004 T1 frame 4 missed 0; line 39148 T1 frame 6 missed 0; line 39146 T1 frame 6 missed 0 |
| R26 | proud | 0.77 | 28.04 -59.06 0.04 29.63 -59.06 0.09 | (0.0, -1.0, 0.0) | +5.000 / +5.000 | face 216 (plane) | line 18485 T3 frame 0 missed 5.656; line 18484 T3 frame 0 missed 5.656; line 18486 T3 frame 0 missed 5.656 |
| R27 | proud | 0.77 | 51.1 -61.55 6.71 51.13 -61.49 8.48 | (0.93, -0.37, 0.0) | +0.112 / +0.115 | face 65 (cylinder r1.524) | line 33604 T3 frame 0 missed 3.49; line 33605 T3 frame 0 missed 3.49; line 33633 T3 frame 0 missed 3.49 |
| R28 | proud | 0.57 | -55.21 77.07 19.4 -54.77 77.12 19.74 | (-0.53, 0.47, -0.7) | +0.193 / +0.235 | face 124 (sphere r1.524) | line 39336 T5 frame 9 missed 0; line 39340 T5 frame 9 missed 0; line 39338 T5 frame 9 missed 0 |
| R29 | proud | 0.57 | -51.13 -61.56 14.52 -51.1 -61.49 16.28 | (-0.93, -0.38, 0.0) | +0.110 / +0.114 | face 77 (cylinder r1.524) | line 38798 T1 frame 1 missed 0; line 40214 T8 frame 17 missed 1.583; line 40215 T8 frame 17 missed 1.583 |
| R30 | proud | 0.57 | -51.13 -61.52 5.73 -51.12 -61.48 6.36 | (-0.93, -0.36, 0.0) | +0.111 / +0.123 | face 77 (cylinder r1.524) | line 38796 T1 frame 1 missed 0; line 38794 T1 frame 1 missed 0; line 38798 T1 frame 1 missed 2.17 |

Cycle time 40.5 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
