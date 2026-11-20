# Simulation feedback - iteration 3: ftc10 (3+2)

**Score: 85.720% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 82.564%). Program valid: **NO** (4 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 85.72 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 14.28 |
| max_gouge_mm | 0.0165 |
| unreachable_area_pct | 3.683 |
| parting_face_pct | 0.681 |
| setups | 6 |
| distinct_orientations | 4 |
| final_connection_mm2 | 30.0 |
| cycle_time_min | 122.16 |

## Errors (must be fixed)

- line 19750: material contact above the flute length (shank rubbing / tool too short); first at line 19750 (frame 1, T7), removed column up to 15.14 mm x26 (lines 19750, 19754, 19757, 19761, 19764, 19768, 19771, 19775, 19782, 19783, 19784, 19789)
- line 58686: tool holder collides with material (stick-out too short for this depth); first at line 58686 (frame 5, T1), removed column up to 2.00 mm x12 (lines 58686, 58687, 58688, 58690, 58691, 58692, 58816, 58817, 58818, 58820, 58821, 58822)
- line 31726: tool holder (D32) of T1 hits the fixed vise jaw (-Y) (first at line 31726, frame 2; vise boxes are in setup.json; holder is a cylinder from the stick-out to 50 mm above it) x12 (lines 31726, 31727, 31728, 32329, 32330, 32331, 48343, 48344, 48345, 48866, 48867, 48868)
- line 31805: tool holder (D32) of T1 hits the moving vise jaw (+Y) (first at line 31805, frame 2; vise boxes are in setup.json; holder is a cylinder from the stick-out to 50 mm above it) x50 (lines 31805, 31806, 31807, 32408, 32409, 32410, 47824, 47825, 47826, 48347, 48348, 48349)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 13-19843 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T3, T4, T7 | 29012 | 178.989 |
| 2 | 19852-35637 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2 | 48537 | 129.81 |
| 3 | 35646-51901 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2 | 49007 | 118.447 |
| 4 | 51910-58600 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T3 | 10453 | 6.235 |
| 5 | 58610-58735 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 124 | 64.871 |
| 6 | 58740-58895 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 152 | 67.806 |

## Rigidity / part-off (connection area in the stub gap; stock section 13284.0 mm2; part-off marker at line 58598)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 19843 | 13284.0 | 1.000 | [13284.0] | False |
| 2 | 35637 | 12792.0 | 0.963 | [12792.0] | False |
| 3 | 51901 | 12300.0 | 0.926 | [12300.0] | False |
| 4 | 58600 | 12300.0 | 0.926 | [12300.0] | False |
| 5 | 58735 | 5934.0 | 0.447 | [5934.0] | True |
| 6 | 58895 | 30.0 | 0.002 | [15.0, 15.0] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 2536.51 | -37.41 -7.47 0.03 37.41 62.4 30.77 | (-0.13, 0.14, -0.98) | +1.795 / +5.000 | face 24 (plane); face 94 (cylinder r6); face 31 (plane) | line 19236 T4 frame 1 missed 0.046; line 19427 T4 frame 1 missed 0.046; line 19331 T4 frame 1 missed 0.046 |
| R2 | proud | 877.03 | -37.41 -78.71 0.05 37.41 -30.89 23.61 | (0.01, -0.7, -0.71) | +0.788 / +1.991 | face 111 (plane); face 110 (plane); face 99 (cylinder r8) | line 35079 T1 frame 2 missed 0.059; line 35080 T1 frame 2 missed 0.059; line 51456 T1 frame 3 missed 0.059 |
| R3 | proud | 520.47 | 22.25 25.95 13.25 27.75 58.19 18.75 | (0.13, 0.58, -0.81) | +5.000 / +5.000 | face 175 (cylinder r2.75); face 174 (cone); face 201 (cylinder r1.75) | line 31411 T1 frame 2 missed 4.476; line 33784 T1 frame 2 missed 4.476; line 33201 T1 frame 2 missed 4.476 |
| R4 | proud | 394.62 | -26.25 33.42 10.25 -20.75 58.18 15.75 | (0.14, 0.6, -0.79) | +5.000 / +5.000 | face 177 (cylinder r2.75); face 176 (cone); face 180 (cylinder r1.75) | line 48823 T1 frame 3 missed 4.553; line 48824 T1 frame 3 missed 4.553; line 48301 T1 frame 3 missed 4.553 |
| R5 | proud | 385.5 | -8.6 -11.5 4.5 8.6 -4.5 11.5 | (0.0, 0.86, 0.5) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 34491 T1 frame 2 missed 5.016; line 33990 T1 frame 2 missed 5.016; line 34497 T1 frame 2 missed 5.02 |
| R6 | proud | 385.5 | -8.6 10.5 4.5 8.6 17.5 11.5 | (-0.0, -0.64, 0.77) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 51896 T2 frame 3 missed 0; line 51895 T2 frame 3 missed 0; line 34438 T1 frame 2 missed 5.009 |
| R7 | proud | 379.86 | -8.58 -33.5 4.5 8.59 -26.5 11.5 | (-0.0, 0.48, -0.88) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 34548 T1 frame 2 missed 5.01; line 50751 T1 frame 3 missed 5.017; line 34544 T1 frame 2 missed 5.018 |
| R8 | proud | 378.12 | -8.6 -55.5 4.5 8.6 -48.5 11.5 | (0.0, -1.0, 0.07) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 51647 T2 frame 3 missed 0; line 34592 T1 frame 2 missed 5.002; line 34172 T1 frame 2 missed 5.01 |
| R9 | proud | 161.0 | -37.41 61.92 11.21 37.4 64 23.57 | (-0.0, 0.6, -0.8) | +0.918 / +1.217 | face 69 (cylinder r1); face 112 (plane); face 70 (cylinder r1) | line 55489 T1 frame 4 missed 0; line 55488 T1 frame 4 missed 0; line 55490 T1 frame 4 missed 0 |
| R10 | proud | 82.34 | -3.97 -51.09 0.05 3.98 -30.92 3.2 | (0.0, -0.01, -1.0) | +0.521 / +0.958 | face 100 (cylinder r12.5); face 101 (cylinder r8); face 99 (cylinder r8) | line 58702 T1 frame 5 missed 0.052; line 58700 T1 frame 5 missed 0.052; line 58698 T1 frame 5 missed 0.052 |
| R11 | proud | 77.1 | -3.98 -7.11 0.05 4 13.11 3.2 | (0.0, -0.01, -1.0) | +0.537 / +0.955 | face 104 (cylinder r12.5); face 105 (cylinder r8); face 103 (cylinder r8) | line 35050 T1 frame 2 missed 0; line 35051 T1 frame 2 missed 0; line 35049 T1 frame 2 missed 0 |
| R12 | proud | 76.91 | -4 -29.08 0.05 3.95 -8.9 3.2 | (-0.0, -0.0, -1.0) | +0.498 / +0.948 | face 103 (cylinder r8); face 102 (cylinder r12.5); face 101 (cylinder r8) | line 35013 T1 frame 2 missed 0; line 35012 T1 frame 2 missed 0; line 35014 T1 frame 2 missed 0 |
| R13 | proud | 30.88 | -9.18 69.42 23.09 26.84 78.75 23.95 | (-0.15, 0.68, -0.72) | +0.211 / +0.416 | face 71 (cylinder r1); face 66 (torus); face 61 (torus) | line 54663 T1 frame 4 missed 0; line 54664 T1 frame 4 missed 0; line 54665 T1 frame 4 missed 0 |
| R14 | proud | 26.41 | -4.14 -78.51 23.1 26.54 -69.43 23.93 | (-0.17, -0.64, -0.75) | +0.234 / +0.464 | face 34 (cylinder r1); face 40 (torus); face 33 (torus) | line 10741 T1 frame 1 missed 0.048; line 12346 T1 frame 1 missed 0.048; line 13522 T1 frame 1 missed 0.048 |
| R15 | proud | 25.83 | 36.88 -29.72 0.26 37.41 13.27 3.76 | (0.75, -0.03, -0.66) | +0.190 / +0.328 | face 78 (torus); face 76 (torus); face 77 (torus) | line 26927 T1 frame 2 missed 0; line 26928 T1 frame 2 missed 0; line 26926 T1 frame 2 missed 0 |
| R16 | proud | 22.33 | 14.25 -31.25 11.36 16.75 -28.75 13.9 | (0.84, -0.55, 0.0) | +4.922 / +5.000 | face 4 (cylinder r1.25) | line 35465 T2 frame 2 missed 0.036; line 35466 T2 frame 2 missed 0.036; line 35458 T2 frame 2 missed 0.098 |
| R17 | proud | 20.39 | -16.75 -9.25 11.44 -14.25 -6.75 13.96 | (-0.41, 0.91, 0.0) | +4.832 / +5.000 | face 0 (cylinder r1.25) | line 51793 T2 frame 3 missed 0.025; line 51810 T2 frame 3 missed 0.025; line 51799 T2 frame 3 missed 0.027 |
| R18 | proud | 20.0 | -16.75 12.75 11.42 -14.25 15.25 13.96 | (0.58, 0.81, 0.0) | +4.868 / +5.000 | face 7 (cylinder r1.25) | line 11594 T1 frame 1 missed 0; line 4678 T1 frame 1 missed 0; line 4377 T1 frame 1 missed 0 |
| R19 | proud | 19.61 | -16.75 -31.25 11.34 -14.25 -28.75 13.91 | (-0.07, -1.0, 0.0) | +4.861 / +5.000 | face 6 (cylinder r1.25) | line 51708 T2 frame 3 missed 0.187; line 51723 T2 frame 3 missed 0.187; line 51712 T2 frame 3 missed 0.187 |
| R20 | proud | 19.23 | -16.75 -53.25 11.4 -14.25 -50.75 13.95 | (-1.0, -0.06, 0.0) | +4.685 / +5.000 | face 1 (cylinder r1.25) | line 51636 T2 frame 3 missed 0.055; line 51619 T2 frame 3 missed 0.055; line 51647 T2 frame 3 missed 0.058 |
| R21 | proud | 19.23 | 14.25 -9.25 11.5 16.75 -6.75 13.93 | (0.34, 0.94, 0.0) | +5.000 / +5.000 | face 2 (cylinder r1.25) | line 35536 T2 frame 2 missed 0.082; line 35527 T2 frame 2 missed 0.082; line 35523 T2 frame 2 missed 0.091 |
| R22 | proud | 18.45 | 14.26 12.75 11.34 16.74 15.25 13.95 | (0.58, -0.82, 0.0) | +4.858 / +5.000 | face 5 (cylinder r1.25) | line 35630 T2 frame 2 missed 0.031; line 35631 T2 frame 2 missed 0.031; line 35611 T2 frame 2 missed 0.031 |
| R23 | proud | 18.26 | 14.25 -53.25 11.48 16.75 -50.75 13.95 | (-0.46, -0.89, 0.0) | +4.952 / +5.000 | face 3 (cylinder r1.25) | line 35365 T2 frame 2 missed 0.233; line 35376 T2 frame 2 missed 0.233; line 35359 T2 frame 2 missed 0.321 |
| R24 | proud | 18.06 | -37.39 -38.67 0.24 -36.87 -9.15 3.73 | (-0.72, -0.06, -0.69) | +0.198 / +0.327 | face 49 (torus); face 48 (torus); face 47 (torus) | line 42963 T1 frame 3 missed 0; line 42964 T1 frame 3 missed 0; line 42962 T1 frame 3 missed 0 |
| R25 | proud | 17.67 | -27.03 -78.72 23.09 -5.54 -69.42 23.96 | (0.24, -0.63, -0.74) | +0.221 / +0.469 | face 34 (cylinder r1); face 36 (torus); face 32 (torus) | line 19364 T4 frame 1 missed 0; line 19365 T4 frame 1 missed 0; line 19366 T4 frame 1 missed 0 |
| R26 | proud | 10.29 | -21.53 69.43 23.1 -10.86 75.15 23.79 | (0.35, 0.59, -0.73) | +0.227 / +0.390 | face 71 (cylinder r1); face 64 (torus); face 59 (torus) | line 51335 T1 frame 3 missed 0.049; line 49969 T1 frame 3 missed 0.049; line 49452 T1 frame 3 missed 0.049 |
| R27 | proud | 6.99 | -37.22 71.52 23.12 -30.38 78.58 23.62 | (-0.49, 0.54, -0.68) | +0.190 / +0.362 | face 64 (torus) | line 45212 T1 frame 3 missed 0; line 45213 T1 frame 3 missed 0; line 45211 T1 frame 3 missed 0 |
| R28 | proud | 6.8 | 30.02 71.31 23.1 37.28 78.71 23.51 | (0.47, 0.53, -0.71) | +0.198 / +0.375 | face 66 (torus) | line 26743 T1 frame 2 missed 0; line 26742 T1 frame 2 missed 0; line 26741 T1 frame 2 missed 0 |
| R29 | proud | 3.11 | -27.09 76.41 23.1 -22.43 78.74 23.55 | (0.29, 0.6, -0.74) | +0.176 / +0.370 | face 64 (torus) | line 51106 T1 frame 3 missed 0.048; line 49969 T1 frame 3 missed 0.048; line 50485 T1 frame 3 missed 0.048 |
| R30 | proud | 2.91 | -22.45 -55.45 14 -21.15 -53.45 14 | (0.0, 0.0, 1.0) | +0.206 / +0.420 | face 164 (plane) | line 19467 T7 frame 1 missed 0; line 19498 T7 frame 1 missed 0; line 19529 T7 frame 1 missed 0 |

Cycle time 122.2 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
