# Simulation feedback - iteration 1: ftc10 (3+2)

**Score: 84.266% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 74.231%). Program valid: **NO** (4 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 84.266 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 15.733 |
| max_gouge_mm | 0.1656 |
| unreachable_area_pct | 12.527 |
| parting_face_pct | 6.244 |
| setups | 5 |
| distinct_orientations | 3 |
| final_connection_mm2 | 13.0 |
| cycle_time_min | 74.89 |

## Errors (must be fixed)

- line 224591: material contact above the flute length (shank rubbing / tool too short); first at line 224591 (frame 1, T4, move ends at G54 (-1.62, 33.50, 12.50)), removed column up to 9.43 mm (material left by earlier setups counts too) x6 (lines 224591, 224637, 224683, 224733, 224783, 224833)
- line 232790: tool holder (D32) of T1 hits the fixed vise jaw (-Y) (first at line 232790, frame 3; vise boxes are in setup.json; holder is a cylinder from the stick-out to 50 mm above it) x7 (lines 232790, 232791, 232792, 232826, 232827, 232845, 232846)
- line 232781: tool holder (D32) of T1 hits the moving vise jaw (+Y) (first at line 232781, frame 3; vise boxes are in setup.json; holder is a cylinder from the stick-out to 50 mm above it) x7 (lines 232781, 232782, 232800, 232801, 232835, 232836, 232837)
- line 224733: cut cross-section > 0.75 D^2 for T4 (overloaded: too deep and too wide); worst 1.69 mm2 > limit 1.69 mm2 at line 224733 (move to -40.50, 61.00, 4.62, removed column up to 10.57 mm deep) x3 (lines 224733, 224783, 224833)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 11-32414 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T2, T3 | 48478 | 73.271 |
| 2 | 32420-224882 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T6 | 240017 | 102.415 |
| 3 | 224890-232755 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3 | 7572 | 105.623 |
| 4 | 232762-232803 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 41 | 29.929 |
| 5 | 232807-232848 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 41 | 31.515 |

## Rigidity / part-off (connection area in the stub gap; stock section 6068.0 mm2; part-off marker at line 232753)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 32414 | 6068.0 | 1.000 | [6068.0] | False |
| 2 | 224882 | 4201.88 | 0.693 | [4201.88] | False |
| 3 | 232755 | 3607.25 | 0.595 | [3607.25] | False |
| 4 | 232803 | 2884.0 | 0.475 | [2884.0] | True |
| 5 | 232848 | 13.0 | 0.002 | [6.5, 6.5] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 3050.24 | -1.5 -58 12.5 15.47 20 62.5 | (0.58, 0.01, -0.82) | +0.469 / +3.091 | face 163 (plane); face 165 (plane); face 162 (plane) | line 231362 T2 frame 2 missed 0; line 231206 T2 frame 2 missed 0; line 231479 T2 frame 2 missed 0 |
| R2 | proud | 2110.23 | -15.36 -79 0 15.47 79 74.91 | (-0.96, -0.05, -0.28) | +0.837 / +5.000 | face 111 (plane); face 113 (plane); face 41 (cylinder r1) | line 29609 T1 frame 0 missed 0; line 207124 T6 frame 1 missed 0; line 206674 T6 frame 1 missed 0 |
| R3 | proud | 351.02 | -11.38 27.12 4.04 -7.5 60.47 20.97 | (-1.0, 0.01, -0.09) | +0.484 / +0.939 | face 204 (plane); face 21 (plane); face 11 (cylinder r1) | line 212012 T6 frame 1 missed 0; line 211635 T6 frame 1 missed 0; line 212013 T6 frame 1 missed 0 |
| R4 | proud | 243.79 | -15.29 34.63 52.55 -7.5 60.25 69.45 | (-0.64, -0.05, -0.76) | +0.416 / +1.074 | face 209 (plane); face 29 (cylinder r7.5); face 208 (cylinder r7.5) | line 217397 T6 frame 1 missed 0; line 217396 T6 frame 1 missed 0; line 217310 T6 frame 1 missed 0 |
| R5 | proud | 150.16 | -5.25 48.51 58.25 0.25 62.47 63.75 | (1.0, 0.0, -0.03) | +4.975 / +5.000 | face 177 (cylinder r2.75) | line 224782 T4 frame 1 missed 0.585; line 220496 T6 frame 1 missed 0.652; line 220506 T6 frame 1 missed 0.678 |
| R6 | proud | 34.38 | -6.97 40 72 14.89 40.09 74.8 | (0.0, 1.0, 0.09) | +0.318 / +2.945 | face 107 (plane); face 171 (plane) | line 223879 T6 frame 1 missed 0; line 223878 T6 frame 1 missed 0; line 224072 T6 frame 1 missed 0 |
| R7 | proud | 34.38 | -6.93 54.91 72 14.88 55 74.79 | (0.0, -1.0, 0.02) | +0.162 / +2.902 | face 168 (plane); face 169 (plane) | line 223697 T6 frame 1 missed 0; line 223818 T6 frame 1 missed 0; line 223696 T6 frame 1 missed 0 |
| R8 | proud | 22.92 | -6.77 44.9 72 14.91 45 73.91 | (0.0, -1.0, 0.07) | +0.226 / +1.984 | face 170 (plane); face 171 (plane) | line 32120 T3 frame 0 missed 0.006; line 142939 T2 frame 1 missed 0.054; line 142938 T2 frame 1 missed 0.054 |
| R9 | proud | 20.59 | -6.88 50 72 15.02 50.1 73.92 | (0.0, 0.99, 0.1) | +0.276 / +1.985 | face 167 (plane); face 169 (plane) | line 223690 T6 frame 1 missed 0; line 223691 T6 frame 1 missed 0; line 223692 T6 frame 1 missed 0 |
| R10 | proud | 15.93 | -10.99 10.5 44.89 -4 17.5 45.99 | (0.54, -0.84, -0.0) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 32409 T2 frame 0 missed 0; line 197924 T6 frame 1 missed 4.364; line 216517 T6 frame 1 missed 4.364 |
| R11 | proud | 14.57 | -10.99 -33.49 44.98 -4 -26.5 46 | (0.81, 0.59, -0.0) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 32289 T2 frame 0 missed 0; line 198749 T6 frame 1 missed 26.324; line 198821 T6 frame 1 missed 26.33 |
| R12 | proud | 13.79 | -11 -55.5 44.88 -4 -48.5 46 | (0.99, -0.11, -0.0) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 32229 T2 frame 0 missed 0; line 198822 T6 frame 1 missed 4.378; line 198748 T6 frame 1 missed 4.404 |
| R13 | proud | 12.04 | -15.43 -30.49 69.28 -11.86 -18.92 74.89 | (-0.84, 0.15, 0.53) | +0.185 / +0.412 | face 49 (torus); face 48 (torus); face 102 (cylinder r12.5) | line 29774 T1 frame 0 missed 0; line 29803 T1 frame 0 missed 0.023; line 29777 T1 frame 0 missed 0.024 |
| R14 | proud | 8.35 | -13.94 -47.55 72.35 -11.83 -38.94 74.9 | (-0.82, 0.16, 0.55) | +0.194 / +0.446 | face 47 (torus); face 100 (cylinder r12.5) | line 29739 T1 frame 0 missed 0; line 29746 T1 frame 0 missed 0.009; line 31074 T1 frame 0 missed 0.05 |
| R15 | proud | 6.8 | -10.82 -11.5 45.03 -4.28 -9.1 45.97 | (0.17, 0.98, 0.0) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 32349 T2 frame 0 missed 0; line 141904 T2 frame 1 missed 29.133; line 142898 T2 frame 1 missed 29.133 |
| R16 | proud | 6.8 | -11 -7.99 44.87 -4.01 -4.5 45.91 | (0.36, -0.93, -0.0) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 216637 T6 frame 1 missed 26.354; line 216738 T6 frame 1 missed 26.369; line 216639 T6 frame 1 missed 26.393 |
| R17 | proud | 6.41 | 2.6 43.79 10.79 3.25 45.44 14.27 | (-0.99, 0.0, -0.11) | +4.959 / +5.000 | face 175 (cylinder r2.75) | line 232833 T1 frame 4 missed 14.101; line 232839 T1 frame 4 missed 14.101; line 232834 T1 frame 4 missed 14.188 |
| R18 | proud | 6.22 | -2.38 -31.16 20.75 -1.54 -28.76 23.25 | (0.0, -0.69, 0.73) | +5.000 / +5.000 | face 4 (cylinder r1.25) | line 231073 T2 frame 2 missed 0; line 231021 T2 frame 2 missed 1.236; line 231124 T2 frame 2 missed 1.764 |
| R19 | proud | 6.02 | -14.67 4.39 74.3 -12.02 10.75 74.91 | (-0.72, -0.24, 0.65) | +0.214 / +0.453 | face 51 (torus); face 52 (torus) | line 29895 T1 frame 0 missed 0; line 29872 T1 frame 0 missed 0; line 29885 T1 frame 0 missed 0.025 |
| R20 | proud | 6.02 | -0.3 39.64 59.35 0.25 41.47 62.62 | (-1.0, -0.0, 0.1) | +4.948 / +5.000 | face 177 (cylinder r2.75) | line 30619 T1 frame 0 missed 10.207; line 30620 T1 frame 0 missed 10.207; line 27778 T1 frame 0 missed 10.61 |
| R21 | proud | 5.83 | -14.83 -15.75 74.22 -12.56 -10.76 74.91 | (-0.72, -0.33, 0.6) | +0.199 / +0.410 | face 49 (torus); face 50 (torus) | line 29829 T1 frame 0 missed 0; line 29813 T1 frame 0 missed 0; line 29838 T1 frame 0 missed 0.009 |
| R22 | proud | 5.24 | -0.29 53.69 59.37 0.25 55.3 62.59 | (-0.99, 0.0, 0.12) | +4.949 / +5.000 | face 177 (cylinder r2.75) | line 219984 T6 frame 1 missed 7.199; line 220498 T6 frame 1 missed 7.217; line 219978 T6 frame 1 missed 7.229 |
| R23 | proud | 5.05 | -14.38 -4.55 74.39 -12.03 1.34 74.91 | (-0.63, 0.25, 0.73) | +0.217 / +0.385 | face 51 (torus); face 50 (torus) | line 29858 T1 frame 0 missed 0; line 29856 T1 frame 0 missed 0; line 29855 T1 frame 0 missed 0.004 |
| R24 | proud | 4.27 | -2.47 -9.25 20.76 -1.57 -6.76 23.04 | (0.0, -0.06, 1.0) | +5.000 / +5.000 | face 2 (cylinder r1.25) | line 232796 T1 frame 3 missed 24.254; line 232786 T1 frame 3 missed 24.254; line 232780 T1 frame 3 missed 24.254 |
| R25 | proud | 4.08 | 2.59 32.6 10.72 3.25 34.36 14.26 | (-1.0, -0.0, 0.05) | +4.979 / +5.000 | face 175 (cylinder r2.75) | line 231042 T2 frame 2 missed 13.364; line 231041 T2 frame 2 missed 13.459; line 230357 T1 frame 2 missed 13.516 |
| R26 | proud | 3.89 | -0.31 46.86 59.33 0.25 48.28 62.6 | (-1.0, 0.0, -0.0) | +4.950 / +5.000 | face 177 (cylinder r2.75) | line 142931 T2 frame 1 missed 11.484; line 142930 T2 frame 1 missed 11.484; line 232641 T2 frame 2 missed 11.484 |
| R27 | proud | 3.5 | -14.72 -36.57 74.29 -12.79 -32.29 74.87 | (-0.68, -0.32, 0.67) | +0.202 / +0.431 | face 48 (torus); face 47 (torus) | line 29765 T1 frame 0 missed 0; line 29780 T1 frame 0 missed 0; line 29779 T1 frame 0 missed 0 |
| R28 | proud | 2.91 | 0.6 34.13 16.69 0.9 36.15 18.46 | (-1.0, -0.08, 0.03) | +0.251 / +0.469 | face 194 (cone) | line 224436 T4 frame 1 missed 0; line 231042 T2 frame 2 missed 14.215; line 231041 T2 frame 2 missed 14.315 |
| R29 | proud | 2.91 | 0.6 42 6.5 0.87 43.81 8.31 | (-0.96, 0.09, 0.26) | +0.260 / +0.434 | face 190 (cone) | line 224328 T4 frame 1 missed 0; line 232799 T1 frame 3 missed 9.935; line 232834 T1 frame 4 missed 9.935 |
| R30 | proud | 2.53 | -1.93 -31.25 51.81 -1.61 -28.82 54.24 | (0.0, 0.88, 0.48) | +5.000 / +5.000 | face 6 (cylinder r1.25) | line 32289 T2 frame 0 missed 2.082; line 32282 T2 frame 0 missed 2.082; line 32280 T2 frame 0 missed 2.196 |

Cycle time 74.9 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
