# Simulation feedback: ftc10 (3+2)

**Score: 87.152% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 78.300%). Program valid: **NO** (3 errors, 1 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 87.152 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 12.848 |
| max_gouge_mm | 0.0151 |
| unreachable_area_pct | 11.204 |
| parting_face_pct | 0.681 |
| setups | 7 |
| distinct_orientations | 5 |
| final_connection_mm2 | 102.0 |
| cycle_time_min | 117.67 |

## Errors (must be fixed)

- line 51077: part connection to the vise stub is only 7% of the stock section after segment 3 (before the part-off): the part would flex / chatter (weakest plane Z-5.87). Keep >= 30% of the section at every height of the stub gap until the part-off.
- line 65295: part connection to the vise stub is only 5% of the stock section after segment 4 (before the part-off): the part would flex / chatter (weakest plane Z-5.87). Keep >= 30% of the section at every height of the stub gap until the part-off.
- line 71280: part connection to the vise stub is only 5% of the stock section after segment 5 (before the part-off): the part would flex / chatter (weakest plane Z-5.87). Keep >= 30% of the section at every height of the stub gap until the part-off.

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
| 1 | 19137 | 11413.38 | 0.859 | [11413.38] | False |
| 2 | 34877 | 5619.0 | 0.423 | [5619.0] | False |
| 3 | 51077 | 927.38 | 0.070 | [717.38, 52.5, 52.5, 52.5] | False |
| 4 | 65295 | 684.12 | 0.051 | [474.12, 52.5, 52.5, 52.5] | False |
| 5 | 71280 | 657.12 | 0.050 | [474.12, 52.5, 52.5, 52.5] | False |
| 6 | 71415 | 542.38 | 0.041 | [474.12, 20.25, 20.25, 20.25] | True |
| 7 | 71575 | 102.0 | 0.008 | [51.0, 51.0] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 4449.81 | -37.41 -65.62 0 37.41 62.4 30.77 | (-0.08, -0.06, -1.0) | +1.006 / +5.000 | face 99 (cylinder r8); face 105 (cylinder r8); face 94 (cylinder r6) | line 69118 T5 frame 5 missed 0; line 69117 T5 frame 5 missed 0.014; line 28464 T1 frame 2 missed 0.047 |
| R2 | proud | 408.8 | -25 -58 15.06 25 20 21.99 | (-0.11, -0.09, 0.99) | +0.208 / +0.252 | face 157 (cylinder r2); face 158 (cylinder r2); face 152 (cylinder r2) | line 19126 T7 frame 1 missed 0; line 19122 T7 frame 1 missed 0.008; line 19123 T7 frame 1 missed 0.008 |
| R3 | proud | 140.41 | -37.4 61.93 11.21 37.4 65.27 23.17 | (-0.01, 0.62, -0.78) | +0.273 / +2.020 | face 69 (cylinder r1); face 112 (plane); face 70 (cylinder r1) | line 62034 T5 frame 4 missed 0; line 62033 T5 frame 4 missed 0; line 54894 T1 frame 4 missed 0 |
| R4 | proud | 73.02 | -26.25 48.6 10.25 -20.76 58.18 15.75 | (-0.01, 0.0, 1.0) | +5.000 / +5.000 | face 177 (cylinder r2.75); face 180 (cylinder r1.75) | line 49865 T1 frame 3 missed 4.4; line 48757 T1 frame 3 missed 4.4; line 49311 T1 frame 3 missed 4.4 |
| R5 | proud | 33.21 | -9.18 69.42 23.09 26.84 78.75 26.14 | (-0.18, 0.7, -0.69) | +0.207 / +0.416 | face 71 (cylinder r1); face 66 (torus); face 72 (cylinder r1) | line 60899 T5 frame 4 missed 0; line 54358 T1 frame 4 missed 0; line 54359 T1 frame 4 missed 0 |
| R6 | proud | 28.94 | -4.14 -78.51 23.1 26.54 -69.43 25.94 | (-0.22, -0.68, -0.7) | +0.224 / +0.430 | face 34 (cylinder r1); face 40 (torus); face 91 (cylinder r1) | line 67653 T5 frame 5 missed 0; line 68269 T5 frame 5 missed 0; line 68268 T5 frame 5 missed 0 |
| R7 | proud | 25.83 | 36.88 -29.72 0.26 37.41 13.27 3.76 | (0.75, -0.03, -0.66) | +0.190 / +0.328 | face 78 (torus); face 76 (torus); face 77 (torus) | line 27378 T1 frame 2 missed 0; line 27379 T1 frame 2 missed 0; line 27377 T1 frame 2 missed 0 |
| R8 | proud | 23.5 | -8.6 10.5 4.5 -7.38 17.5 11.5 | (0.0, -0.02, 1.0) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 51072 T2 frame 3 missed 0; line 71538 T1 frame 7 missed 5.351; line 71540 T1 frame 7 missed 5.351 |
| R9 | proud | 20.59 | -27.03 -78.72 23.09 -5.54 -69.42 25.94 | (0.31, -0.69, -0.66) | +0.205 / +0.380 | face 34 (cylinder r1); face 36 (torus); face 92 (cylinder r1) | line 65715 T5 frame 5 missed 0; line 67631 T5 frame 5 missed 0; line 67632 T5 frame 5 missed 0 |
| R10 | proud | 19.23 | -8.6 -55.5 4.5 -7.33 -48.5 11.49 | (0.0, -0.87, 0.49) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 71113 T5 frame 5 missed 5.018; line 71114 T5 frame 5 missed 5.018; line 70811 T5 frame 5 missed 5.018 |
| R11 | proud | 18.06 | -37.39 -38.67 0.24 -36.87 -9.15 3.73 | (-0.72, -0.06, -0.69) | +0.198 / +0.327 | face 49 (torus); face 48 (torus); face 47 (torus) | line 43251 T1 frame 3 missed 0; line 43252 T1 frame 3 missed 0; line 43250 T1 frame 3 missed 0 |
| R12 | proud | 17.09 | 22.25 56.97 13.29 27.75 58.19 18.75 | (-0.15, 0.0, -0.99) | +5.000 / +5.000 | face 175 (cylinder r2.75) | line 65268 T3 frame 4 missed 0; line 32342 T1 frame 2 missed 4.327; line 32343 T1 frame 2 missed 4.327 |
| R13 | proud | 16.7 | -8.6 -11.5 4.57 -7.51 -4.5 11.5 | (0.0, 0.62, -0.78) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 50989 T2 frame 3 missed 0; line 50988 T2 frame 3 missed 0; line 71528 T1 frame 7 missed 5.457 |
| R14 | proud | 14.95 | -8.58 -33.18 4.5 -7.48 -26.51 11.5 | (0.0, -0.96, 0.27) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 71522 T1 frame 7 missed 5.353; line 71518 T1 frame 7 missed 5.353; line 71520 T1 frame 7 missed 5.353 |
| R15 | proud | 14.95 | 7.31 -33.5 4.5 8.56 -26.51 11.5 | (-0.0, -0.85, -0.53) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 71392 T1 frame 6 missed 5.351; line 71388 T1 frame 6 missed 5.351; line 71390 T1 frame 6 missed 5.351 |
| R16 | proud | 13.4 | 36.87 -50.23 0.27 37.41 -30.89 3.66 | (0.75, -0.01, -0.66) | +0.176 / +0.312 | face 80 (torus); face 81 (torus); face 79 (torus) | line 27427 T1 frame 2 missed 0; line 27426 T1 frame 2 missed 0; line 27425 T1 frame 2 missed 0 |
| R17 | proud | 13.01 | 7.5 10.5 4.5 8.58 17.5 11.5 | (-0.0, -0.77, 0.64) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 34872 T2 frame 2 missed 0; line 71408 T1 frame 6 missed 5.35; line 71410 T1 frame 6 missed 5.35 |
| R18 | proud | 12.62 | -21.53 69.43 23.1 -10.86 75.15 26.14 | (0.44, 0.65, -0.62) | +0.210 / +0.390 | face 71 (cylinder r1); face 64 (torus); face 89 (cylinder r1) | line 60374 T5 frame 4 missed 0; line 60375 T5 frame 4 missed 0; line 60376 T5 frame 4 missed 0 |
| R19 | proud | 7.96 | 7.47 -11.49 4.51 8.6 -7.79 11.5 | (-0.0, 1.0, -0.02) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 34788 T2 frame 2 missed 0; line 71398 T1 frame 6 missed 5.355; line 71400 T1 frame 6 missed 5.355 |
| R20 | proud | 7.77 | 7.33 -55.42 4.8 8.57 -48.5 11.5 | (-0.0, -0.44, -0.9) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 34620 T2 frame 2 missed 0; line 71038 T5 frame 5 missed 5.265; line 71037 T5 frame 5 missed 5.265 |
| R21 | proud | 6.99 | -37.22 71.52 23.12 -30.38 78.58 23.62 | (-0.49, 0.54, -0.68) | +0.186 / +0.362 | face 64 (torus) | line 45761 T1 frame 3 missed 0; line 45762 T1 frame 3 missed 0; line 45760 T1 frame 3 missed 0 |
| R22 | proud | 6.99 | 30.68 -78.34 23.14 37.27 -71.38 23.61 | (0.53, -0.48, -0.7) | +0.214 / +0.370 | face 40 (torus) | line 28281 T1 frame 2 missed 0; line 28280 T1 frame 2 missed 0; line 28279 T1 frame 2 missed 0 |
| R23 | proud | 6.8 | 30.02 71.31 23.1 37.28 78.71 23.51 | (0.47, 0.53, -0.71) | +0.191 / +0.358 | face 66 (torus) | line 27194 T1 frame 2 missed 0; line 27193 T1 frame 2 missed 0; line 27192 T1 frame 2 missed 0 |
| R24 | proud | 6.6 | -37.29 -78.71 23.1 -30.13 -71.28 23.6 | (-0.55, -0.48, -0.68) | +0.202 / +0.350 | face 36 (torus) | line 44669 T1 frame 3 missed 0; line 44670 T1 frame 3 missed 0; line 44671 T1 frame 3 missed 0 |
| R25 | proud | 6.02 | -37.4 -50.3 0.48 -36.89 -40.2 3.71 | (-0.72, 0.19, -0.67) | +0.193 / +0.321 | face 47 (torus); face 46 (torus) | line 43178 T1 frame 3 missed 0; line 43176 T1 frame 3 missed 0; line 43177 T1 frame 3 missed 0 |
| R26 | proud | 5.83 | 7.51 -6.63 5.41 8.55 -4.5 11.22 | (-0.0, -0.99, -0.15) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 34788 T2 frame 2 missed 0; line 26090 T1 frame 2 missed 6.11; line 26091 T1 frame 2 missed 6.11 |
| R27 | proud | 5.05 | 14.25 -31.25 13.09 16.75 -28.76 13.9 | (-0.91, 0.41, 0.0) | +5.000 / +5.000 | face 4 (cylinder r1.25) | line 34679 T2 frame 2 missed 1.587; line 34682 T2 frame 2 missed 1.587; line 34675 T2 frame 2 missed 1.587 |
| R28 | proud | 4.66 | 14.25 -9.25 13.18 16.74 -6.75 13.93 | (-0.31, 0.95, 0.0) | +5.000 / +5.000 | face 2 (cylinder r1.25) | line 34764 T2 frame 2 missed 1.696; line 34785 T2 frame 2 missed 1.696; line 34758 T2 frame 2 missed 1.696 |
| R29 | proud | 4.66 | 36.93 32.28 8.09 37.41 39.8 8.58 | (0.77, -0.0, -0.63) | +0.194 / +0.292 | face 73 (cylinder r1) | line 27241 T1 frame 2 missed 0; line 19191 T1 frame 2 missed 0; line 19193 T1 frame 2 missed 0 |
| R30 | proud | 3.5 | -16.75 -31.17 13.22 -14.37 -28.75 13.91 | (0.89, 0.45, 0.0) | +5.000 / +5.000 | face 6 (cylinder r1.25) | line 50893 T2 frame 3 missed 1.725; line 50875 T2 frame 3 missed 1.725; line 50880 T2 frame 3 missed 1.725 |

Cycle time 117.7 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
