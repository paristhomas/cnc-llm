# Simulation feedback - iteration 6: ftc08 (3+2)

**Score: 99.803% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 98.354%). Program valid: **NO** (1 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.803 |
| machinable_gouge_pct | 0.001 |
| machinable_proud_pct | 0.196 |
| max_gouge_mm | 5.0 |
| unreachable_area_pct | 1.467 |
| parting_face_pct | 18.962 |
| setups | 28 |
| distinct_orientations | 9 |
| final_connection_mm2 | 2660.06 |
| cycle_time_min | 40.11 |

## Errors (must be fixed)

- line 41076: material contact above the flute length (shank rubbing / tool too short); first at line 41076 (frame 20, T8), removed column up to 3.38 mm x1 (lines 41076)

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
| 18 | 39593-40085 | (-1.0, -0.0, 0.0) | 90 / -180 | T8 | 491 | 0.065 |
| 19 | 40094-40586 | (1.0, -0.0, 0.0) | 90 / -0 | T8 | 491 | 0.065 |
| 20 | 40595-41055 | (0.0, -1.0, 0.0) | 90 / -90 | T8 | 459 | 0.057 |
| 21 | 41064-41524 | (0.0, 1.0, 0.0) | 90 / 90 | T8 | 459 | 0.047 |
| 22 | 41538-49303 | (0.0, 1.0, 0.0) | 90 / 90 | T4 | 7761 | 0.141 |
| 23 | 49318-75010 | (0.0, 0.0, 1.0) | 0 / 0 | T1 | 25693 | 56.862 |
| 24 | 75024-116010 | (0.0, 0.0, 1.0) | 0 / 0 | T2 | 40987 | 1.652 |
| 25 | 116024-116067 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 44 | 49.689 |
| 26 | 116076-116119 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 44 | 49.924 |
| 27 | 116128-116145 | (0.0, -1.0, 0.0) | 90 / -90 | T1 | 18 | 11.81 |
| 28 | 116154-116171 | (0.0, 1.0, 0.0) | 90 / 90 | T1 | 18 | 11.889 |

## Rigidity / part-off (connection area in the stub gap; stock section 18986.5 mm2; part-off marker at line 49307)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 38743 | 18965.19 | 0.999 | [18965.19] | False |
| 2 | 38804 | 18965.19 | 0.999 | [18965.19] | False |
| 3 | 38866 | 18965.19 | 0.999 | [18965.19] | False |
| 4 | 38938 | 18965.19 | 0.999 | [18965.19] | False |
| 5 | 39010 | 18965.19 | 0.999 | [18965.19] | False |
| 6 | 39082 | 18965.19 | 0.999 | [18965.19] | False |
| 7 | 39154 | 18965.19 | 0.999 | [18965.19] | False |
| 8 | 39226 | 18965.19 | 0.999 | [18965.19] | False |
| 9 | 39298 | 18965.19 | 0.999 | [18965.19] | False |
| 10 | 39346 | 18965.19 | 0.999 | [18965.19] | False |
| 11 | 39389 | 18965.19 | 0.999 | [18965.19] | False |
| 12 | 39432 | 18965.19 | 0.999 | [18965.19] | False |
| 13 | 39475 | 18965.19 | 0.999 | [18965.19] | False |
| 14 | 39501 | 18965.19 | 0.999 | [18965.19] | False |
| 15 | 39527 | 18965.19 | 0.999 | [18965.19] | False |
| 16 | 39553 | 18965.19 | 0.999 | [18965.19] | False |
| 17 | 39579 | 18965.19 | 0.999 | [18965.19] | False |
| 18 | 40085 | 18965.19 | 0.999 | [18965.19] | False |
| 19 | 40586 | 18965.19 | 0.999 | [18965.19] | False |
| 20 | 41055 | 18965.19 | 0.999 | [18965.19] | False |
| 21 | 41524 | 18965.19 | 0.999 | [18965.19] | False |
| 22 | 49303 | 18965.19 | 0.999 | [18965.19] | False |
| 23 | 75010 | 15440.0 | 0.813 | [15440.0] | True |
| 24 | 116010 | 15340.69 | 0.808 | [15340.69] | True |
| 25 | 116067 | 10473.38 | 0.552 | [10473.38] | True |
| 26 | 116119 | 5609.81 | 0.295 | [3524.25, 2085.56] | True |
| 27 | 116145 | 4125.06 | 0.217 | [3524.25, 600.81] | True |
| 28 | 116171 | 2660.06 | 0.140 | [2059.25, 600.81] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 15.9 | -40.64 53.02 0.03 -37.47 56.2 1.68 | (0.98, -0.2, -0.0) | +5.000 / +5.000 | face 179 (cylinder r1.5875); face 180 (cylinder r1.5875) | line 116051 T1 frame 24 missed 6.035; line 116053 T1 frame 24 missed 6.035; line 116057 T1 frame 24 missed 6.035 |
| R2 | proud | 6.7 | -19.93 59.41 0.05 -17.78 61.6 1.65 | (-0.6, -0.8, -0.0) | +0.596 / +0.970 | face 227 (plane); face 228 (plane); face 14 (cylinder r0.7938) | line 36477 T4 frame 0 missed 0.047; line 36478 T4 frame 0 missed 0.047; line 36473 T4 frame 0 missed 0.047 |
| R3 | proud | 6.13 | 30.25 47.15 0.04 33.23 48.22 1.54 | (0.23, 0.97, -0.0) | +0.573 / +0.815 | face 234 (cylinder r1.5875); face 0 (cylinder r1.5875) | line 6995 T2 frame 0 missed 0.062; line 6996 T2 frame 0 missed 0.062; line 6994 T2 frame 0 missed 0.068 |
| R4 | proud | 4.21 | -31.75 59.48 0.14 -29.77 61.6 1.57 | (0.68, -0.74, 0.0) | +0.654 / +0.948 | face 227 (plane); face 230 (plane); face 11 (cylinder r0.7938) | line 5825 T2 frame 0 missed 0.064; line 5826 T2 frame 0 missed 0.064; line 36512 T4 frame 0 missed 0.072 |
| R5 | proud | 2.87 | 37.71 -69.82 1.93 38.86 -69.08 3.2 | (-0.25, 0.9, 0.36) | +0.161 / +0.228 | face 112 (sphere r1.524); face 145 (cylinder r1.524) | line 38724 T5 frame 0 missed 0; line 38723 T5 frame 0 missed 0; line 38701 T5 frame 0 missed 0 |
| R6 | proud | 2.68 | -39.03 68.81 1.82 -37.61 69.83 3.29 | (0.32, -0.8, 0.51) | +0.155 / +0.229 | face 108 (sphere r1.524); face 123 (plane); face 101 (cylinder r1.524) | line 38710 T5 frame 0 missed 0; line 38709 T5 frame 0 missed 0; line 38688 T5 frame 0 missed 0 |
| R7 | proud | 2.3 | 47.43 59.6 2.01 48.04 60.58 3.3 | (-0.84, -0.36, 0.41) | +0.176 / +0.223 | face 114 (sphere r1.524); face 143 (cylinder r1.524); face 150 (cylinder r1.524) | line 38728 T5 frame 0 missed 0; line 38727 T5 frame 0 missed 0; line 38706 T5 frame 0 missed 0 |
| R8 | proud | 2.11 | 37.66 68.82 1.86 38.84 69.83 3.13 | (-0.31, -0.84, 0.45) | +0.151 / +0.200 | face 115 (sphere r1.524); face 149 (cylinder r1.524) | line 38730 T5 frame 0 missed 0; line 38729 T5 frame 0 missed 0; line 38708 T5 frame 0 missed 0 |
| R9 | proud | 1.72 | -4.09 72.29 3.93 -1.51 72.92 4.32 | (0.0, 0.0, 1.0) | +0.201 / +0.317 | face 249 (plane); face 250 (plane); face 253 (plane) | line 45555 T4 frame 21 missed 0.045; line 43966 T4 frame 21 missed 0.045; line 45556 T4 frame 21 missed 0.045 |
| R10 | proud | 1.53 | -48.05 -60.54 1.85 -47.04 -59.51 3.13 | (0.74, 0.18, 0.65) | +0.137 / +0.173 | face 110 (sphere r1.524); face 147 (cylinder r1.524) | line 38736 T5 frame 0 missed 0; line 38735 T5 frame 0 missed 0; line 38713 T5 frame 0 missed 0 |
| R11 | proud | 1.53 | -48.05 59.45 1.98 -47.38 60.46 3.28 | (0.86, -0.29, 0.41) | +0.162 / +0.205 | face 109 (sphere r1.524); face 147 (cylinder r1.524); face 121 (plane) | line 38734 T5 frame 0 missed 0; line 38733 T5 frame 0 missed 0; line 38711 T5 frame 0 missed 0 |
| R12 | proud | 1.53 | -38.69 -69.81 1.85 -37.77 -68.81 3 | (0.4, 0.66, 0.63) | +0.141 / +0.187 | face 111 (sphere r1.524); face 145 (cylinder r1.524) | line 38737 T5 frame 0 missed 0; line 38738 T5 frame 0 missed 0; line 38715 T5 frame 0 missed 0 |
| R13 | proud | 1.53 | 47.32 -60.8 2.29 47.98 -60.09 3.14 | (-0.8, 0.48, 0.35) | +0.166 / +0.227 | face 113 (sphere r1.524); face 144 (cylinder r1.524) | line 38725 T5 frame 0 missed 0; line 38726 T5 frame 0 missed 0; line 38703 T5 frame 0 missed 0 |
| R14 | proud | 1.15 | 14.17 71.95 3.93 14.46 72.86 5.51 | (-1.0, 0.0, 0.0) | +0.248 / +0.317 | face 263 (plane); face 264 (plane); face 262 (plane) | line 43163 T4 frame 21 missed 0.066; line 43164 T4 frame 21 missed 0.066; line 44752 T4 frame 21 missed 0.066 |
| R15 | proud | 1.15 | 51.1 61.47 6.7 51.14 61.57 10.73 | (0.93, 0.37, 0.0) | +0.111 / +0.123 | face 81 (cylinder r1.524) | line 38858 T1 frame 2 missed 0; line 38860 T1 frame 2 missed 0; line 38856 T1 frame 2 missed 2.435 |
| R16 | proud | 0.96 | -13.97 72.09 11.08 -12.42 72.9 11.43 | (0.89, 0.0, -0.45) | +0.240 / +0.532 | face 239 (plane); face 238 (plane); face 236 (plane) | line 48536 T4 frame 21 missed 0.053; line 48537 T4 frame 21 missed 0.053; line 47537 T4 frame 21 missed 0.053 |
| R17 | proud | 0.96 | 9.71 71.97 11.12 10.92 72.87 11.43 | (0.24, 0.0, -0.97) | +0.148 / +0.178 | face 260 (plane); face 259 (plane) | line 43144 T4 frame 21 missed 0.05; line 43145 T4 frame 21 missed 0.05; line 44733 T4 frame 21 missed 0.05 |
| R18 | proud | 0.96 | 54.73 -77.56 19.39 55.29 -77.13 19.94 | (0.55, -0.62, -0.55) | +0.155 / +0.214 | face 126 (sphere r1.524) | line 39379 T5 frame 10 missed 0; line 39381 T5 frame 10 missed 0; line 39382 T5 frame 10 missed 0 |
| R19 | proud | 0.77 | -51.12 61.5 2.07 -51.09 61.57 3.86 | (-0.92, 0.39, 0.0) | +0.114 / +0.123 | face 78 (cylinder r1.524) | line 39144 T1 frame 6 missed 0; line 39513 T5 frame 14 missed 0; line 39317 T5 frame 9 missed 0.198 |
| R20 | proud | 0.77 | -51.12 61.51 8.39 -51.09 61.57 9.54 | (-0.92, 0.39, 0.0) | +0.115 / +0.125 | face 78 (cylinder r1.524) | line 39146 T1 frame 6 missed 0; line 39148 T1 frame 6 missed 0; line 39145 T1 frame 6 missed 1.456 |
| R21 | proud | 0.77 | -39.8 72.85 1.26 -39.72 72.91 4.03 | (-0.41, 0.91, -0.05) | +0.107 / +0.111 | face 79 (cylinder r1.524); face 138 (sphere r1.524) | line 39144 T1 frame 6 missed 0; line 39146 T1 frame 6 missed 0; line 39446 T5 frame 12 missed 0 |
| R22 | proud | 0.77 | -39.8 72.87 10.51 -39.71 72.91 12.78 | (-0.39, 0.92, 0.0) | +0.109 / +0.124 | face 79 (cylinder r1.524) | line 39004 T1 frame 4 missed 0; line 39148 T1 frame 6 missed 0; line 39146 T1 frame 6 missed 0 |
| R23 | proud | 0.77 | 51.1 -61.55 6.71 51.13 -61.49 8.48 | (0.93, -0.37, 0.0) | +0.112 / +0.115 | face 65 (cylinder r1.524) | line 33604 T3 frame 0 missed 3.49; line 33605 T3 frame 0 missed 3.49; line 33633 T3 frame 0 missed 3.49 |
| R24 | proud | 0.57 | -55.21 77.07 19.4 -54.77 77.12 19.74 | (-0.53, 0.47, -0.7) | +0.193 / +0.235 | face 124 (sphere r1.524) | line 39336 T5 frame 9 missed 0; line 39340 T5 frame 9 missed 0; line 39338 T5 frame 9 missed 0 |
| R25 | proud | 0.57 | -51.13 -61.56 14.52 -51.1 -61.49 16.28 | (-0.93, -0.38, 0.0) | +0.110 / +0.114 | face 77 (cylinder r1.524) | line 38798 T1 frame 1 missed 0; line 39597 T8 frame 17 missed 1.509; line 39625 T8 frame 17 missed 1.515 |
| R26 | proud | 0.57 | -51.13 -61.52 5.73 -51.12 -61.48 6.36 | (-0.93, -0.36, 0.0) | +0.111 / +0.123 | face 77 (cylinder r1.524) | line 38796 T1 frame 1 missed 0; line 38794 T1 frame 1 missed 0; line 38798 T1 frame 1 missed 2.17 |
| R27 | proud | 0.57 | -51.13 61.49 14.1 -51.1 61.56 16.44 | (-0.93, 0.37, 0.0) | +0.110 / +0.114 | face 78 (cylinder r1.524) | line 38798 T1 frame 1 missed 0; line 39597 T8 frame 17 missed 1.351; line 39862 T8 frame 17 missed 1.358 |
| R28 | proud | 0.57 | -39.79 -72.9 0.64 -39.64 -72.63 1.72 | (-0.38, -0.9, -0.23) | +0.114 / +0.114 | face 141 (sphere r1.524); face 76 (cylinder r1.524) | line 39405 T5 frame 11 missed 0; line 39404 T5 frame 11 missed 0; line 39407 T5 frame 11 missed 0 |
| R29 | proud | 0.57 | -39.81 -72.91 3.73 -39.72 -72.87 5.02 | (-0.39, -0.92, 0.0) | +0.110 / +0.117 | face 76 (cylinder r1.524) | line 39072 T1 frame 5 missed 0; line 39074 T1 frame 5 missed 0; line 39073 T1 frame 5 missed 1.068 |
| R30 | proud | 0.57 | -39.78 72.88 6.21 -39.77 72.89 6.68 | (-0.39, 0.92, 0.0) | +0.114 / +0.118 | face 79 (cylinder r1.524) | line 28016 T3 frame 0 missed 3.492; line 28083 T3 frame 0 missed 3.492; line 28084 T3 frame 0 missed 3.492 |

Cycle time 40.1 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
