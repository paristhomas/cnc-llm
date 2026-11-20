# Simulation feedback - iteration 4: ftc10 (3+2)

**Score: 85.993% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 82.827%). Program valid: **NO** (1 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 85.993 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 14.007 |
| max_gouge_mm | 0.0165 |
| unreachable_area_pct | 3.683 |
| parting_face_pct | 0.681 |
| setups | 7 |
| distinct_orientations | 5 |
| final_connection_mm2 | 102.0 |
| cycle_time_min | 130.12 |

## Errors (must be fixed)

- line 25121: material contact above the flute length (shank rubbing / tool too short); first at line 25121 (frame 2, T1), removed column up to 28.00 mm x6 (lines 25121, 25710, 41745, 50701, 70595, 70605)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 13-19595 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T3, T4, T7 | 28764 | 178.929 |
| 2 | 19604-35332 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2 | 48480 | 129.761 |
| 3 | 35341-51581 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2 | 48992 | 118.398 |
| 4 | 51590-64745 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T3, T5 | 16891 | 6.176 |
| 5 | 64754-70495 | (0.0, -1.0, 0.0) | 90 / -90 | T5 | 5730 | 0.751 |
| 6 | 70505-70630 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 124 | 64.116 |
| 7 | 70635-70790 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 152 | 67.104 |

## Rigidity / part-off (connection area in the stub gap; stock section 13284.0 mm2; part-off marker at line 70493)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 19595 | 13284.0 | 1.000 | [13284.0] | False |
| 2 | 35332 | 12792.0 | 0.963 | [12792.0] | False |
| 3 | 51581 | 12300.0 | 0.926 | [12300.0] | False |
| 4 | 64745 | 12300.0 | 0.926 | [12300.0] | False |
| 5 | 70495 | 12300.0 | 0.926 | [12300.0] | False |
| 6 | 70630 | 6006.0 | 0.452 | [6006.0] | True |
| 7 | 70790 | 102.0 | 0.008 | [51.0, 51.0] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 2490.09 | -37.41 -7.47 0.03 37.41 62.4 30.77 | (-0.13, 0.14, -0.98) | +1.768 / +5.000 | face 94 (cylinder r6); face 24 (plane); face 31 (plane) | line 62746 T5 frame 4 missed 0.056; line 62745 T5 frame 4 missed 0.056; line 63733 T5 frame 4 missed 0.056 |
| R2 | proud | 524.74 | -37.41 -64.56 0.05 37.41 -52.88 23.56 | (0.01, -0.67, -0.74) | +0.542 / +1.266 | face 99 (cylinder r8); face 41 (cylinder r1); face 98 (cylinder r1) | line 50958 T1 frame 3 missed 0; line 50959 T1 frame 3 missed 0; line 50957 T1 frame 3 missed 0 |
| R3 | proud | 520.47 | 22.25 25.95 13.25 27.75 58.19 18.75 | (0.13, 0.58, -0.81) | +5.000 / +5.000 | face 175 (cylinder r2.75); face 174 (cone); face 201 (cylinder r1.75) | line 30559 T1 frame 2 missed 4.476; line 31728 T1 frame 2 missed 4.476; line 33479 T1 frame 2 missed 4.476 |
| R4 | proud | 394.62 | -26.25 33.42 10.25 -20.75 58.18 15.75 | (0.14, 0.6, -0.79) | +5.000 / +5.000 | face 177 (cylinder r2.75); face 176 (cone); face 180 (cylinder r1.75) | line 47995 T1 frame 3 missed 4.553; line 47996 T1 frame 3 missed 4.553; line 49031 T1 frame 3 missed 4.553 |
| R5 | proud | 385.5 | -8.6 -11.5 4.5 8.6 -4.5 11.5 | (0.0, 0.86, 0.5) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 33685 T1 frame 2 missed 5.016; line 34186 T1 frame 2 missed 5.016; line 34192 T1 frame 2 missed 5.02 |
| R6 | proud | 385.5 | -8.6 10.5 4.5 8.6 17.5 11.5 | (-0.0, -0.64, 0.77) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 51576 T2 frame 3 missed 0; line 51575 T2 frame 3 missed 0; line 34133 T1 frame 2 missed 5.009 |
| R7 | proud | 379.86 | -8.58 -33.5 4.5 8.59 -26.5 11.5 | (-0.0, 0.48, -0.88) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 34243 T1 frame 2 missed 5.01; line 50431 T1 frame 3 missed 5.017; line 34239 T1 frame 2 missed 5.018 |
| R8 | proud | 378.12 | -8.6 -55.5 4.5 8.6 -48.5 11.5 | (0.0, -1.0, 0.07) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 51327 T2 frame 3 missed 0; line 34287 T1 frame 2 missed 5.002; line 33867 T1 frame 2 missed 5.01 |
| R9 | proud | 240.23 | -25 -58 15.06 25 20 15.97 | (-0.0, -0.02, 1.0) | +0.188 / +0.251 | face 157 (cylinder r2); face 158 (cylinder r2); face 152 (cylinder r2) | line 17592 T3 frame 1 missed 0; line 11191 T1 frame 1 missed 0; line 11189 T1 frame 1 missed 0 |
| R10 | proud | 160.8 | -37.4 61.93 11.21 37.4 64 23.57 | (-0.0, 0.6, -0.8) | +0.919 / +1.217 | face 69 (cylinder r1); face 112 (plane); face 70 (cylinder r1) | line 54851 T1 frame 4 missed 0; line 61207 T5 frame 4 missed 0; line 58397 T5 frame 4 missed 0 |
| R11 | proud | 82.34 | -3.97 -51.09 0.05 3.98 -30.92 3.2 | (0.0, -0.01, -1.0) | +0.521 / +0.958 | face 100 (cylinder r12.5); face 101 (cylinder r8); face 99 (cylinder r8) | line 70597 T1 frame 6 missed 0.052; line 70595 T1 frame 6 missed 0.052; line 70593 T1 frame 6 missed 0.052 |
| R12 | proud | 77.1 | -3.98 -7.11 0.05 4 13.11 3.2 | (0.0, -0.01, -1.0) | +0.537 / +0.955 | face 104 (cylinder r12.5); face 105 (cylinder r8); face 103 (cylinder r8) | line 34745 T1 frame 2 missed 0; line 34746 T1 frame 2 missed 0; line 34744 T1 frame 2 missed 0 |
| R13 | proud | 76.91 | -4 -29.08 0.05 3.95 -8.9 3.2 | (-0.0, -0.0, -1.0) | +0.498 / +0.948 | face 103 (cylinder r8); face 102 (cylinder r12.5); face 101 (cylinder r8) | line 34708 T1 frame 2 missed 0; line 34707 T1 frame 2 missed 0; line 34709 T1 frame 2 missed 0 |
| R14 | proud | 30.88 | -9.18 69.42 23.09 26.84 78.75 23.95 | (-0.15, 0.68, -0.72) | +0.210 / +0.416 | face 71 (cylinder r1); face 66 (torus); face 61 (torus) | line 60495 T5 frame 4 missed 0; line 54259 T1 frame 4 missed 0; line 54260 T1 frame 4 missed 0 |
| R15 | proud | 26.41 | -4.14 -78.51 23.1 26.54 -69.43 23.93 | (-0.17, -0.64, -0.75) | +0.230 / +0.430 | face 34 (cylinder r1); face 40 (torus); face 33 (torus) | line 66338 T5 frame 5 missed 0; line 66337 T5 frame 5 missed 0; line 66339 T5 frame 5 missed 0 |
| R16 | proud | 25.83 | 36.88 -29.72 0.26 37.41 13.27 3.76 | (0.75, -0.03, -0.66) | +0.190 / +0.328 | face 78 (torus); face 76 (torus); face 77 (torus) | line 26679 T1 frame 2 missed 0; line 26680 T1 frame 2 missed 0; line 26678 T1 frame 2 missed 0 |
| R17 | proud | 22.33 | 14.25 -31.25 11.36 16.75 -28.75 13.9 | (0.84, -0.55, 0.0) | +4.922 / +5.000 | face 4 (cylinder r1.25) | line 35145 T2 frame 2 missed 0.036; line 35161 T2 frame 2 missed 0.036; line 35143 T2 frame 2 missed 0.098 |
| R18 | proud | 20.39 | -16.75 -9.25 11.44 -14.25 -6.75 13.96 | (-0.41, 0.91, 0.0) | +4.832 / +5.000 | face 0 (cylinder r1.25) | line 51472 T2 frame 3 missed 0.025; line 51480 T2 frame 3 missed 0.025; line 51471 T2 frame 3 missed 0.027 |
| R19 | proud | 20.0 | -16.75 12.75 11.42 -14.25 15.25 13.96 | (0.58, 0.81, 0.0) | +4.868 / +5.000 | face 7 (cylinder r1.25) | line 11594 T1 frame 1 missed 0; line 4678 T1 frame 1 missed 0; line 4377 T1 frame 1 missed 0 |
| R20 | proud | 19.61 | -16.75 -31.25 11.34 -14.25 -28.75 13.91 | (-0.07, -1.0, 0.0) | +4.861 / +5.000 | face 6 (cylinder r1.25) | line 51397 T2 frame 3 missed 0.187; line 51390 T2 frame 3 missed 0.187; line 51391 T2 frame 3 missed 0.187 |
| R21 | proud | 19.23 | -16.75 -53.25 11.4 -14.25 -50.75 13.95 | (-1.0, -0.06, 0.0) | +4.685 / +5.000 | face 1 (cylinder r1.25) | line 51301 T2 frame 3 missed 0.055; line 51300 T2 frame 3 missed 0.055; line 51307 T2 frame 3 missed 0.058 |
| R22 | proud | 19.23 | 14.25 -9.25 11.5 16.75 -6.75 13.93 | (0.34, 0.94, 0.0) | +5.000 / +5.000 | face 2 (cylinder r1.25) | line 35216 T2 frame 2 missed 0.082; line 35233 T2 frame 2 missed 0.082; line 35225 T2 frame 2 missed 0.082 |
| R23 | proud | 18.45 | 14.26 12.75 11.34 16.74 15.25 13.95 | (0.58, -0.82, 0.0) | +4.858 / +5.000 | face 5 (cylinder r1.25) | line 35326 T2 frame 2 missed 0.031; line 35307 T2 frame 2 missed 0.031; line 35316 T2 frame 2 missed 0.031 |
| R24 | proud | 18.26 | 14.25 -53.25 11.48 16.75 -50.75 13.95 | (-0.46, -0.89, 0.0) | +4.952 / +5.000 | face 3 (cylinder r1.25) | line 35076 T2 frame 2 missed 0.233; line 35065 T2 frame 2 missed 0.233; line 35075 T2 frame 2 missed 0.321 |
| R25 | proud | 18.06 | -37.39 -38.67 0.24 -36.87 -9.15 3.73 | (-0.72, -0.06, -0.69) | +0.198 / +0.327 | face 49 (torus); face 48 (torus); face 47 (torus) | line 42658 T1 frame 3 missed 0; line 42659 T1 frame 3 missed 0; line 42657 T1 frame 3 missed 0 |
| R26 | proud | 17.67 | -27.03 -78.72 23.09 -5.54 -69.42 23.96 | (0.24, -0.63, -0.74) | +0.211 / +0.380 | face 34 (cylinder r1); face 36 (torus); face 32 (torus) | line 19365 T4 frame 1 missed 0; line 19364 T4 frame 1 missed 0; line 19366 T4 frame 1 missed 0 |
| R27 | proud | 13.59 | 36.87 -50.23 0.27 37.41 -30.89 3.66 | (0.75, -0.01, -0.66) | +0.175 / +0.312 | face 80 (torus); face 81 (torus); face 79 (torus) | line 19647 T1 frame 2 missed 0; line 26717 T1 frame 2 missed 0; line 26716 T1 frame 2 missed 0 |
| R28 | proud | 10.29 | -21.53 69.43 23.1 -10.86 75.15 23.79 | (0.35, 0.59, -0.73) | +0.223 / +0.390 | face 71 (cylinder r1); face 64 (torus); face 59 (torus) | line 60226 T5 frame 4 missed 0; line 60227 T5 frame 4 missed 0; line 60228 T5 frame 4 missed 0 |
| R29 | proud | 6.99 | -37.22 71.52 23.12 -30.38 78.58 23.62 | (-0.49, 0.54, -0.68) | +0.186 / +0.362 | face 64 (torus) | line 44907 T1 frame 3 missed 0; line 44908 T1 frame 3 missed 0; line 44906 T1 frame 3 missed 0 |
| R30 | proud | 6.99 | 30.68 -78.34 23.14 37.27 -71.38 23.61 | (0.53, -0.48, -0.7) | +0.214 / +0.370 | face 40 (torus) | line 27451 T1 frame 2 missed 0; line 27450 T1 frame 2 missed 0; line 27449 T1 frame 2 missed 0 |

Cycle time 130.1 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
