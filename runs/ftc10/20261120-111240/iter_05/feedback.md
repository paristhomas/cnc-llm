# Simulation feedback - iteration 5: ftc10 (3+2)

**Score: 81.293% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 78.300%). Program valid: **YES** (0 errors, 1 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 81.293 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 18.707 |
| max_gouge_mm | 0.0151 |
| unreachable_area_pct | 3.683 |
| parting_face_pct | 0.681 |
| setups | 7 |
| distinct_orientations | 5 |
| final_connection_mm2 | 102.0 |
| cycle_time_min | 117.67 |

## Warnings

- line 71386: deep plunge (> 0.5 D) at > 50% of the recommended feed for T1; ramp or helix instead x7

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 13-19137 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T3, T4, T7 | 28306 | 173.68 |
| 2 | 19146-34877 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2 | 48481 | 135.669 |
| 3 | 34886-51077 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2 | 48942 | 124.309 |
| 4 | 51086-65295 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T3, T5 | 17941 | 11.06 |
| 5 | 65304-71280 | (0.0, -1.0, 0.0) | 90 / -90 | T5 | 5941 | 4.057 |
| 6 | 71290-71415 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 124 | 58.949 |
| 7 | 71420-71575 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 152 | 62.009 |

## Rigidity / part-off (connection area in the stub gap; stock section 13284.0 mm2; part-off marker at line 71278)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 19137 | 13284.0 | 1.000 | [13284.0] | False |
| 2 | 34877 | 12792.0 | 0.963 | [12792.0] | False |
| 3 | 51077 | 12300.0 | 0.926 | [12300.0] | False |
| 4 | 65295 | 12300.0 | 0.926 | [12300.0] | False |
| 5 | 71280 | 12300.0 | 0.926 | [12300.0] | False |
| 6 | 71415 | 6006.0 | 0.452 | [6006.0] | True |
| 7 | 71575 | 102.0 | 0.008 | [51.0, 51.0] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 5253.43 | -37.41 -64.56 0 37.41 62.4 30.77 | (-0.06, -0.04, -1.0) | +1.086 / +5.000 | face 105 (cylinder r8); face 99 (cylinder r8); face 102 (cylinder r12.5) | line 64247 T5 frame 4 missed 0.06; line 64248 T5 frame 4 missed 0.06; line 64519 T5 frame 4 missed 0.06 |
| R2 | proud | 520.47 | 22.25 25.95 13.25 27.75 58.19 18.75 | (0.13, 0.58, -0.81) | +5.000 / +5.000 | face 175 (cylinder r2.75); face 174 (cone); face 201 (cylinder r1.75) | line 33599 T1 frame 2 missed 4.476; line 32343 T1 frame 2 missed 4.476; line 32971 T1 frame 2 missed 4.476 |
| R3 | proud | 408.8 | -25 -58 15.06 25 20 21.99 | (-0.11, -0.09, 0.99) | +0.208 / +0.252 | face 157 (cylinder r2); face 158 (cylinder r2); face 152 (cylinder r2) | line 19126 T7 frame 1 missed 0; line 19122 T7 frame 1 missed 0.008; line 19123 T7 frame 1 missed 0.008 |
| R4 | proud | 394.62 | -26.25 33.42 10.25 -20.75 58.18 15.75 | (0.14, 0.6, -0.79) | +5.000 / +5.000 | face 177 (cylinder r2.75); face 176 (cone); face 180 (cylinder r1.75) | line 50282 T1 frame 3 missed 4.553; line 50281 T1 frame 3 missed 4.553; line 49175 T1 frame 3 missed 4.553 |
| R5 | proud | 385.5 | -8.6 -11.5 4.5 8.6 -4.5 11.5 | (0.0, 0.86, 0.5) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 71402 T1 frame 6 missed 5.351; line 71400 T1 frame 6 missed 5.351; line 71398 T1 frame 6 missed 5.351 |
| R6 | proud | 385.5 | -8.6 10.5 4.5 8.6 17.5 11.5 | (-0.0, -0.64, 0.77) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 51072 T2 frame 3 missed 0; line 51071 T2 frame 3 missed 0; line 71542 T1 frame 7 missed 5.354 |
| R7 | proud | 379.86 | -8.58 -33.5 4.5 8.59 -26.5 11.5 | (-0.0, 0.48, -0.88) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 71520 T1 frame 7 missed 5.367; line 71522 T1 frame 7 missed 5.367; line 71518 T1 frame 7 missed 5.367 |
| R8 | proud | 378.12 | -8.6 -55.5 4.5 8.6 -48.5 11.5 | (0.0, -1.0, 0.07) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 50823 T2 frame 3 missed 0; line 71382 T1 frame 6 missed 5.352; line 71378 T1 frame 6 missed 5.352 |
| R9 | proud | 140.22 | -37.4 61.93 11.21 37.4 64 23.17 | (-0.01, 0.62, -0.78) | +0.271 / +0.500 | face 69 (cylinder r1); face 112 (plane); face 70 (cylinder r1) | line 62034 T5 frame 4 missed 0; line 55081 T1 frame 4 missed 0; line 61669 T5 frame 4 missed 0 |
| R10 | proud | 33.21 | -9.18 69.42 23.09 26.84 78.75 26.14 | (-0.18, 0.7, -0.69) | +0.207 / +0.416 | face 71 (cylinder r1); face 66 (torus); face 72 (cylinder r1) | line 60899 T5 frame 4 missed 0; line 54358 T1 frame 4 missed 0; line 54359 T1 frame 4 missed 0 |
| R11 | proud | 28.94 | -4.14 -78.51 23.1 26.54 -69.43 25.94 | (-0.22, -0.68, -0.7) | +0.224 / +0.430 | face 34 (cylinder r1); face 40 (torus); face 91 (cylinder r1) | line 67653 T5 frame 5 missed 0; line 68269 T5 frame 5 missed 0; line 68268 T5 frame 5 missed 0 |
| R12 | proud | 25.83 | 36.88 -29.72 0.26 37.41 13.27 3.76 | (0.75, -0.03, -0.66) | +0.190 / +0.328 | face 78 (torus); face 76 (torus); face 77 (torus) | line 27378 T1 frame 2 missed 0; line 27379 T1 frame 2 missed 0; line 27377 T1 frame 2 missed 0 |
| R13 | proud | 22.33 | 14.25 -31.25 11.36 16.75 -28.75 13.9 | (0.84, -0.55, 0.0) | +4.922 / +5.000 | face 4 (cylinder r1.25) | line 34677 T2 frame 2 missed 0.036; line 34693 T2 frame 2 missed 0.036; line 34684 T2 frame 2 missed 0.036 |
| R14 | proud | 20.59 | -27.03 -78.72 23.09 -5.54 -69.42 25.94 | (0.31, -0.69, -0.66) | +0.205 / +0.380 | face 34 (cylinder r1); face 36 (torus); face 92 (cylinder r1) | line 65715 T5 frame 5 missed 0; line 67631 T5 frame 5 missed 0; line 67632 T5 frame 5 missed 0 |
| R15 | proud | 20.39 | -16.75 -9.25 11.44 -14.25 -6.75 13.96 | (-0.41, 0.91, 0.0) | +4.832 / +5.000 | face 0 (cylinder r1.25) | line 50981 T2 frame 3 missed 0.025; line 50980 T2 frame 3 missed 0.025; line 50979 T2 frame 3 missed 0.027 |
| R16 | proud | 20.0 | -16.75 12.75 11.42 -14.25 15.25 13.96 | (0.58, 0.81, 0.0) | +4.868 / +5.000 | face 7 (cylinder r1.25) | line 12280 T1 frame 1 missed 0; line 4678 T1 frame 1 missed 0; line 4377 T1 frame 1 missed 0 |
| R17 | proud | 19.61 | -16.75 -31.25 11.34 -14.25 -28.75 13.91 | (-0.07, -1.0, 0.0) | +4.861 / +5.000 | face 6 (cylinder r1.25) | line 50892 T2 frame 3 missed 0.187; line 50906 T2 frame 3 missed 0.187; line 50883 T2 frame 3 missed 0.187 |
| R18 | proud | 19.23 | -16.75 -53.25 11.4 -14.25 -50.75 13.95 | (-1.0, -0.06, 0.0) | +4.685 / +5.000 | face 1 (cylinder r1.25) | line 50822 T2 frame 3 missed 0.055; line 50799 T2 frame 3 missed 0.055; line 50802 T2 frame 3 missed 0.055 |
| R19 | proud | 19.23 | 14.25 -9.25 11.5 16.75 -6.75 13.93 | (0.34, 0.94, 0.0) | +5.000 / +5.000 | face 2 (cylinder r1.25) | line 34787 T2 frame 2 missed 0.082; line 34767 T2 frame 2 missed 0.082; line 34769 T2 frame 2 missed 0.091 |
| R20 | proud | 18.45 | 14.26 12.75 11.34 16.74 15.25 13.95 | (0.58, -0.82, 0.0) | +4.858 / +5.000 | face 5 (cylinder r1.25) | line 34871 T2 frame 2 missed 0.031; line 34857 T2 frame 2 missed 0.031; line 34864 T2 frame 2 missed 0.031 |
| R21 | proud | 18.26 | 14.25 -53.25 11.48 16.75 -50.75 13.95 | (-0.46, -0.89, 0.0) | +4.952 / +5.000 | face 3 (cylinder r1.25) | line 34590 T2 frame 2 missed 0.233; line 34589 T2 frame 2 missed 0.233; line 34606 T2 frame 2 missed 0.233 |
| R22 | proud | 18.06 | -37.39 -38.67 0.24 -36.87 -9.15 3.73 | (-0.72, -0.06, -0.69) | +0.198 / +0.327 | face 49 (torus); face 48 (torus); face 47 (torus) | line 43251 T1 frame 3 missed 0; line 43252 T1 frame 3 missed 0; line 43250 T1 frame 3 missed 0 |
| R23 | proud | 13.4 | 36.87 -50.23 0.27 37.41 -30.89 3.66 | (0.75, -0.01, -0.66) | +0.176 / +0.312 | face 80 (torus); face 81 (torus); face 79 (torus) | line 27427 T1 frame 2 missed 0; line 27426 T1 frame 2 missed 0; line 27425 T1 frame 2 missed 0 |
| R24 | proud | 12.62 | -21.53 69.43 23.1 -10.86 75.15 26.14 | (0.44, 0.65, -0.62) | +0.210 / +0.390 | face 71 (cylinder r1); face 64 (torus); face 89 (cylinder r1) | line 60374 T5 frame 4 missed 0; line 60375 T5 frame 4 missed 0; line 60376 T5 frame 4 missed 0 |
| R25 | proud | 6.99 | -37.22 71.52 23.12 -30.38 78.58 23.62 | (-0.49, 0.54, -0.68) | +0.186 / +0.362 | face 64 (torus) | line 45761 T1 frame 3 missed 0; line 45762 T1 frame 3 missed 0; line 45760 T1 frame 3 missed 0 |
| R26 | proud | 6.99 | 30.68 -78.34 23.14 37.27 -71.38 23.61 | (0.53, -0.48, -0.7) | +0.214 / +0.370 | face 40 (torus) | line 28281 T1 frame 2 missed 0; line 28280 T1 frame 2 missed 0; line 28279 T1 frame 2 missed 0 |
| R27 | proud | 6.8 | 30.02 71.31 23.1 37.28 78.71 23.51 | (0.47, 0.53, -0.71) | +0.191 / +0.358 | face 66 (torus) | line 27194 T1 frame 2 missed 0; line 27193 T1 frame 2 missed 0; line 27192 T1 frame 2 missed 0 |
| R28 | proud | 6.6 | -37.29 -78.71 23.1 -30.13 -71.28 23.6 | (-0.55, -0.48, -0.68) | +0.202 / +0.350 | face 36 (torus) | line 44669 T1 frame 3 missed 0; line 44670 T1 frame 3 missed 0; line 44671 T1 frame 3 missed 0 |
| R29 | proud | 6.02 | -37.4 -50.3 0.48 -36.89 -40.2 3.71 | (-0.72, 0.19, -0.67) | +0.193 / +0.321 | face 47 (torus); face 46 (torus) | line 43178 T1 frame 3 missed 0; line 43176 T1 frame 3 missed 0; line 43177 T1 frame 3 missed 0 |
| R30 | proud | 4.66 | 36.93 32.28 8.09 37.41 39.8 8.58 | (0.77, -0.0, -0.63) | +0.194 / +0.292 | face 73 (cylinder r1) | line 27241 T1 frame 2 missed 0; line 19191 T1 frame 2 missed 0; line 19193 T1 frame 2 missed 0 |

Cycle time 117.7 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
