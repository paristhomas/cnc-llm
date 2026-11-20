# Simulation feedback - iteration 8: ftc10 (3+2)

**Score: 83.980% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 80.888%). Program valid: **NO** (1 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 83.98 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 16.02 |
| max_gouge_mm | 0.0153 |
| unreachable_area_pct | 3.683 |
| parting_face_pct | 0.681 |
| setups | 7 |
| distinct_orientations | 5 |
| final_connection_mm2 | 102.0 |
| cycle_time_min | 129.79 |

## Errors (must be fixed)

- line 29055: material contact above the flute length (shank rubbing / tool too short); first at line 29055 (frame 2, T1), removed column up to 28.00 mm x3 (lines 29055, 29648, 44537)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 13-23445 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T3, T4, T7 | 32614 | 179.893 |
| 2 | 23454-38175 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2 | 47473 | 127.548 |
| 3 | 38184-53519 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2 | 48086 | 116.431 |
| 4 | 53528-67116 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T3, T5 | 17310 | 8.008 |
| 5 | 67125-72743 | (0.0, -1.0, 0.0) | 90 / -90 | T5 | 5608 | 0.751 |
| 6 | 72753-72878 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 124 | 64.118 |
| 7 | 72883-73038 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 152 | 67.215 |

## Rigidity / part-off (connection area in the stub gap; stock section 13284.0 mm2; part-off marker at line 72741)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 23445 | 13284.0 | 1.000 | [13284.0] | False |
| 2 | 38175 | 12792.0 | 0.963 | [12792.0] | False |
| 3 | 53519 | 12300.0 | 0.926 | [12300.0] | False |
| 4 | 67116 | 12300.0 | 0.926 | [12300.0] | False |
| 5 | 72743 | 12300.0 | 0.926 | [12300.0] | False |
| 6 | 72878 | 6006.0 | 0.452 | [6006.0] | True |
| 7 | 73038 | 102.0 | 0.008 | [51.0, 51.0] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 4344.16 | -37.41 -64.56 0 37.41 64 30.77 | (-0.06, 0.08, -0.99) | +1.564 / +5.000 | face 31 (plane); face 105 (cylinder r8); face 24 (plane) | line 37231 T1 frame 2 missed 0.056; line 37230 T1 frame 2 missed 0.056; line 33473 T1 frame 2 missed 0.063 |
| R2 | proud | 520.47 | 22.25 25.95 13.25 27.75 58.19 18.75 | (0.13, 0.58, -0.81) | +5.000 / +5.000 | face 175 (cylinder r2.75); face 174 (cone); face 201 (cylinder r1.75) | line 37195 T1 frame 2 missed 4.993; line 37579 T1 frame 2 missed 4.993; line 37741 T1 frame 2 missed 4.993 |
| R3 | proud | 394.62 | -26.25 33.42 10.25 -20.75 58.18 15.75 | (0.14, 0.6, -0.79) | +5.000 / +5.000 | face 177 (cylinder r2.75); face 176 (cone); face 180 (cylinder r1.75) | line 42085 T1 frame 3 missed 5.335; line 42086 T1 frame 3 missed 5.335; line 41788 T1 frame 3 missed 5.335 |
| R4 | proud | 385.5 | -8.6 -11.5 4.5 8.6 -4.5 11.5 | (0.0, 0.86, 0.5) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 36783 T1 frame 2 missed 5.015; line 36291 T1 frame 2 missed 5.015; line 36297 T1 frame 2 missed 5.02 |
| R5 | proud | 385.5 | -8.6 10.5 4.5 8.6 17.5 11.5 | (-0.0, -0.64, 0.77) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 53514 T2 frame 3 missed 0; line 53513 T2 frame 3 missed 0; line 36732 T1 frame 2 missed 5.009 |
| R6 | proud | 379.86 | -8.58 -33.5 4.5 8.59 -26.5 11.5 | (-0.0, 0.48, -0.88) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 36841 T1 frame 2 missed 5.008; line 52290 T1 frame 3 missed 5.016; line 52289 T1 frame 3 missed 5.016 |
| R7 | proud | 378.12 | -8.6 -55.5 4.5 8.6 -48.5 11.5 | (0.0, -1.0, 0.07) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 53265 T2 frame 3 missed 0; line 36887 T1 frame 2 missed 5.002; line 36897 T1 frame 2 missed 5.01 |
| R8 | proud | 240.23 | -25 -58 15.06 25 20 15.97 | (-0.0, -0.02, 1.0) | +0.188 / +0.251 | face 157 (cylinder r2); face 158 (cylinder r2); face 152 (cylinder r2) | line 11191 T1 frame 1 missed 0; line 21314 T3 frame 1 missed 0; line 11189 T1 frame 1 missed 0 |
| R9 | proud | 30.88 | -9.18 69.42 23.09 26.84 78.75 23.95 | (-0.15, 0.68, -0.72) | +0.210 / +0.416 | face 71 (cylinder r1); face 66 (torus); face 61 (torus) | line 62859 T5 frame 4 missed 0; line 56688 T1 frame 4 missed 0; line 56689 T1 frame 4 missed 0 |
| R10 | proud | 26.41 | -4.14 -78.51 23.1 26.54 -69.43 23.93 | (-0.17, -0.64, -0.75) | +0.230 / +0.430 | face 34 (cylinder r1); face 40 (torus); face 33 (torus) | line 68586 T5 frame 5 missed 0; line 68585 T5 frame 5 missed 0; line 68587 T5 frame 5 missed 0 |
| R11 | proud | 25.83 | 36.88 -29.72 0.26 37.41 13.27 3.76 | (0.75, -0.03, -0.66) | +0.190 / +0.328 | face 78 (torus); face 76 (torus); face 77 (torus) | line 30370 T1 frame 2 missed 0; line 30371 T1 frame 2 missed 0; line 30369 T1 frame 2 missed 0 |
| R12 | proud | 22.33 | 14.25 -31.25 11.36 16.75 -28.75 13.9 | (0.84, -0.55, 0.0) | +4.922 / +5.000 | face 4 (cylinder r1.25) | line 37995 T2 frame 2 missed 0.036; line 37987 T2 frame 2 missed 0.036; line 37975 T2 frame 2 missed 0.036 |
| R13 | proud | 20.39 | -16.75 -9.25 11.44 -14.25 -6.75 13.96 | (-0.41, 0.91, 0.0) | +4.832 / +5.000 | face 0 (cylinder r1.25) | line 53407 T2 frame 3 missed 0.025; line 53422 T2 frame 3 missed 0.025; line 53423 T2 frame 3 missed 0.025 |
| R14 | proud | 20.0 | -16.75 12.75 11.42 -14.25 15.25 13.96 | (0.58, 0.81, 0.0) | +4.868 / +5.000 | face 7 (cylinder r1.25) | line 11594 T1 frame 1 missed 0; line 4678 T1 frame 1 missed 0; line 4377 T1 frame 1 missed 0 |
| R15 | proud | 19.61 | -16.75 -31.25 11.34 -14.25 -28.75 13.91 | (-0.07, -1.0, 0.0) | +4.861 / +5.000 | face 6 (cylinder r1.25) | line 53335 T2 frame 3 missed 0.187; line 53337 T2 frame 3 missed 0.187; line 53324 T2 frame 3 missed 0.187 |
| R16 | proud | 19.23 | -16.75 -53.25 11.4 -14.25 -50.75 13.95 | (-1.0, -0.06, 0.0) | +4.685 / +5.000 | face 1 (cylinder r1.25) | line 53258 T2 frame 3 missed 0.055; line 53241 T2 frame 3 missed 0.055; line 53259 T2 frame 3 missed 0.055 |
| R17 | proud | 19.23 | 14.25 -9.25 11.5 16.75 -6.75 13.93 | (0.34, 0.94, 0.0) | +5.000 / +5.000 | face 2 (cylinder r1.25) | line 38062 T2 frame 2 missed 0.082; line 38061 T2 frame 2 missed 0.082; line 38084 T2 frame 2 missed 0.082 |
| R18 | proud | 18.45 | 14.26 12.75 11.34 16.74 15.25 13.95 | (0.58, -0.82, 0.0) | +4.858 / +5.000 | face 5 (cylinder r1.25) | line 38169 T2 frame 2 missed 0.031; line 38168 T2 frame 2 missed 0.031; line 38156 T2 frame 2 missed 0.031 |
| R19 | proud | 18.26 | 14.25 -53.25 11.48 16.75 -50.75 13.95 | (-0.46, -0.89, 0.0) | +4.952 / +5.000 | face 3 (cylinder r1.25) | line 37909 T2 frame 2 missed 0.233; line 37891 T2 frame 2 missed 0.233; line 37917 T2 frame 2 missed 0.321 |
| R20 | proud | 18.06 | -37.39 -38.67 0.24 -36.87 -9.15 3.73 | (-0.72, -0.06, -0.69) | +0.198 / +0.327 | face 49 (torus); face 48 (torus); face 47 (torus) | line 45374 T1 frame 3 missed 0; line 45375 T1 frame 3 missed 0; line 45373 T1 frame 3 missed 0 |
| R21 | proud | 14.76 | -27.03 -78.72 23.09 -10.5 -69.42 23.96 | (0.29, -0.61, -0.74) | +0.211 / +0.380 | face 36 (torus); face 34 (cylinder r1); face 32 (torus) | line 23215 T4 frame 1 missed 0; line 23214 T4 frame 1 missed 0; line 23216 T4 frame 1 missed 0 |
| R22 | proud | 13.59 | 36.87 -50.23 0.27 37.41 -30.89 3.66 | (0.75, -0.01, -0.66) | +0.175 / +0.312 | face 80 (torus); face 81 (torus); face 79 (torus) | line 23509 T1 frame 2 missed 0; line 30404 T1 frame 2 missed 0; line 30403 T1 frame 2 missed 0 |
| R23 | proud | 10.29 | -21.53 69.43 23.1 -10.86 75.15 23.79 | (0.35, 0.59, -0.73) | +0.223 / +0.390 | face 71 (cylinder r1); face 64 (torus); face 59 (torus) | line 62590 T5 frame 4 missed 0; line 62591 T5 frame 4 missed 0; line 62592 T5 frame 4 missed 0 |
| R24 | proud | 6.99 | -37.22 71.52 23.12 -30.38 78.58 23.62 | (-0.49, 0.54, -0.68) | +0.187 / +0.363 | face 64 (torus) | line 47498 T1 frame 3 missed 0; line 47499 T1 frame 3 missed 0; line 47497 T1 frame 3 missed 0 |
| R25 | proud | 6.99 | 30.68 -78.34 23.14 37.27 -71.38 23.61 | (0.53, -0.48, -0.7) | +0.213 / +0.370 | face 40 (torus) | line 31517 T1 frame 2 missed 0; line 31516 T1 frame 2 missed 0; line 31515 T1 frame 2 missed 0 |
| R26 | proud | 6.8 | 30.02 71.31 23.1 37.28 78.71 23.51 | (0.47, 0.53, -0.71) | +0.190 / +0.358 | face 66 (torus) | line 30735 T1 frame 2 missed 0; line 30734 T1 frame 2 missed 0; line 30733 T1 frame 2 missed 0 |
| R27 | proud | 6.6 | -37.29 -78.71 23.1 -30.13 -71.28 23.6 | (-0.55, -0.48, -0.68) | +0.201 / +0.350 | face 36 (torus) | line 46218 T1 frame 3 missed 0; line 46217 T1 frame 3 missed 0; line 46219 T1 frame 3 missed 0 |
| R28 | proud | 6.02 | -37.4 -50.3 0.48 -36.89 -40.2 3.71 | (-0.72, 0.19, -0.67) | +0.194 / +0.322 | face 47 (torus); face 46 (torus) | line 45306 T1 frame 3 missed 0; line 45304 T1 frame 3 missed 0; line 45303 T1 frame 3 missed 0 |
| R29 | proud | 3.11 | -27.09 76.41 23.1 -22.43 78.74 23.55 | (0.29, 0.6, -0.74) | +0.176 / +0.369 | face 64 (torus) | line 61592 T5 frame 4 missed 0; line 61591 T5 frame 4 missed 0; line 61593 T5 frame 4 missed 0 |
| R30 | proud | 2.91 | -22.45 -55.45 14 -21.15 -53.45 14 | (0.0, 0.0, 1.0) | +0.206 / +0.420 | face 164 (plane) | line 23317 T7 frame 1 missed 0; line 23348 T7 frame 1 missed 0; line 23379 T7 frame 1 missed 0 |

Cycle time 129.8 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
