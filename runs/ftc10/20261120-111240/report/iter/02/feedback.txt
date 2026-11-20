# Simulation feedback - iteration 2: ftc10 (3+2)

**Score: 76.264% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 73.456%). Program valid: **NO** (4 errors, 2 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 76.264 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 23.736 |
| max_gouge_mm | 0.0135 |
| unreachable_area_pct | 3.683 |
| parting_face_pct | 0.681 |
| setups | 6 |
| distinct_orientations | 4 |
| final_connection_mm2 | 30.0 |
| cycle_time_min | 123.79 |

## Errors (must be fixed)

- line 56418: rapid (G0) move removes material - crash; first at line 56418 (frame 4, T1), removed column up to 0.50 mm x1 (lines 56418)
- line 15823: material contact above the flute length (shank rubbing / tool too short); first at line 15823 (frame 1, T1), removed column up to 27.00 mm x49 (lines 15823, 22331, 22333, 22350, 22412, 22474, 22505, 22598, 22616, 22620, 22623, 22627)
- line 32720: tool or holder hits the vise / table (check the tool axis, stick-out and the stub gap) x74 (lines 32720, 32721, 32722, 32985, 32986, 32987, 33116, 33117, 33118, 33379, 33380, 33381)
- line 56701: cut cross-section > 0.75 D^2 for T1 (overloaded: too deep and too wide); worst 226.51 mm2 > limit 75.00 mm2 at line 56721 (move to 1.00, -5.05, 2.50, removed column up to 25.13 mm deep) x8 (lines 56701, 56711, 56721, 56731, 56831, 56841, 56851, 56861)

## Warnings

- line 22331: cut cross-section > 0.75 D^2 for T7 (overloaded: too deep and too wide); worst 12.63 mm2 > limit 6.75 mm2 at line 22331 (move to -23.00, 18.00, 44.00, removed column up to 11.00 mm deep) x1
- line 56699: deep plunge (> 0.5 D) at > 50% of the recommended feed for T1; ramp or helix instead x8

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 13-22709 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T3, T4, T7 | 31878 | 165.47 |
| 2 | 22718-35961 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2 | 45992 | 84.418 |
| 3 | 35970-50592 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2 | 47372 | 89.564 |
| 4 | 50601-56603 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T3 | 9764 | 12.376 |
| 5 | 56613-56738 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 124 | 86.296 |
| 6 | 56743-56898 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 152 | 87.966 |

## Rigidity / part-off (connection area in the stub gap; stock section 13284.0 mm2; part-off marker at line 56601)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 22709 | 13284.0 | 1.000 | [13284.0] | False |
| 2 | 35961 | 12792.0 | 0.963 | [12792.0] | False |
| 3 | 50592 | 12300.0 | 0.926 | [12300.0] | False |
| 4 | 56603 | 12300.0 | 0.926 | [12300.0] | False |
| 5 | 56738 | 5934.0 | 0.447 | [5934.0] | True |
| 6 | 56898 | 30.0 | 0.002 | [15.0, 15.0] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 3297.59 | -37.41 -7.47 0.03 37.41 62.5 30.77 | (-0.07, 0.15, -0.99) | +3.175 / +5.000 | face 94 (cylinder r6); face 24 (plane); face 31 (plane) | line 48748 T1 frame 3 missed 0.12; line 48749 T1 frame 3 missed 0.12; line 49378 T1 frame 3 missed 0.12 |
| R2 | proud | 1116.87 | -37.41 -78.71 0.05 37.41 -30.89 23.93 | (0.01, -0.63, -0.77) | +0.753 / +4.008 | face 99 (cylinder r8); face 110 (plane); face 111 (plane) | line 34746 T1 frame 2 missed 0.049; line 28770 T1 frame 2 missed 0.069; line 28769 T1 frame 2 missed 0.069 |
| R3 | proud | 1064.44 | -25 -29.12 0.05 24.98 -8.89 3.2 | (-0.0, 0.0, -1.0) | +2.054 / +3.668 | face 102 (cylinder r12.5); face 103 (cylinder r8); face 101 (cylinder r8) | line 56715 T1 frame 5 missed 0.052; line 56711 T1 frame 5 missed 0.052; line 56713 T1 frame 5 missed 0.052 |
| R4 | proud | 1064.44 | -24.99 -7.11 0.05 25 13.11 3.2 | (-0.0, -0.0, -1.0) | +2.040 / +3.668 | face 104 (cylinder r12.5); face 103 (cylinder r8); face 105 (cylinder r8) | line 56721 T1 frame 5 missed 0.053; line 56723 T1 frame 5 missed 0.053; line 56725 T1 frame 5 missed 0.053 |
| R5 | proud | 1057.64 | -25 -51.12 0.05 25 -30.89 3.2 | (0.0, 0.0, -1.0) | +2.039 / +3.668 | face 100 (cylinder r12.5); face 99 (cylinder r8); face 101 (cylinder r8) | line 56835 T1 frame 6 missed 0.057; line 56831 T1 frame 6 missed 0.057; line 56833 T1 frame 6 missed 0.057 |
| R6 | proud | 520.47 | 22.25 25.95 13.25 27.75 58.19 18.75 | (0.13, 0.58, -0.81) | +5.000 / +5.000 | face 175 (cylinder r2.75); face 174 (cone); face 201 (cylinder r1.75) | line 33852 T1 frame 2 missed 4.476; line 33127 T1 frame 2 missed 4.476; line 33506 T1 frame 2 missed 4.476 |
| R7 | proud | 394.62 | -26.25 33.42 10.25 -20.75 58.18 15.75 | (0.14, 0.6, -0.79) | +5.000 / +5.000 | face 177 (cylinder r2.75); face 176 (cone); face 180 (cylinder r1.75) | line 48748 T1 frame 3 missed 4.553; line 48398 T1 frame 3 missed 4.553; line 48397 T1 frame 3 missed 4.553 |
| R8 | proud | 385.5 | -8.6 -11.5 4.5 8.6 -4.5 11.5 | (0.0, 0.86, 0.5) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 56725 T1 frame 5 missed 5.051; line 56723 T1 frame 5 missed 5.051; line 56721 T1 frame 5 missed 5.051 |
| R9 | proud | 385.5 | -8.6 10.5 4.5 8.6 17.5 11.5 | (-0.0, -0.64, 0.77) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 50587 T2 frame 3 missed 0; line 50586 T2 frame 3 missed 0; line 56865 T1 frame 6 missed 5.054 |
| R10 | proud | 379.86 | -8.58 -33.5 4.5 8.59 -26.5 11.5 | (-0.0, 0.48, -0.88) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 56843 T1 frame 6 missed 5.067; line 56845 T1 frame 6 missed 5.067; line 56841 T1 frame 6 missed 5.067 |
| R11 | proud | 378.12 | -8.6 -55.5 4.5 8.6 -48.5 11.5 | (0.0, -1.0, 0.07) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 50335 T2 frame 3 missed 0; line 49466 T1 frame 3 missed 5.018; line 49772 T1 frame 3 missed 5.019 |
| R12 | proud | 228.19 | -8.89 -55.46 14 8.56 -34.9 14 | (0.0, 0.0, 1.0) | +4.303 / +5.000 | face 164 (plane) | line 22333 T7 frame 1 missed 0; line 22364 T7 frame 1 missed 0; line 22395 T7 frame 1 missed 0 |
| R13 | proud | 200.03 | -8.34 -1.88 14 8.13 17.45 14 | (0.0, 0.0, 1.0) | +4.364 / +5.000 | face 164 (plane) | line 22331 T7 frame 1 missed 0; line 22350 T7 frame 1 missed 0; line 22381 T7 frame 1 missed 0 |
| R14 | proud | 161.0 | -37.41 61.92 11.21 37.4 64 23.57 | (-0.0, 0.6, -0.8) | +0.918 / +1.217 | face 69 (cylinder r1); face 112 (plane); face 70 (cylinder r1) | line 54046 T1 frame 4 missed 0; line 54045 T1 frame 4 missed 0; line 54047 T1 frame 4 missed 0 |
| R15 | proud | 30.88 | -9.18 69.42 23.09 26.84 78.75 23.95 | (-0.15, 0.68, -0.72) | +0.211 / +0.414 | face 71 (cylinder r1); face 66 (torus); face 61 (torus) | line 53171 T1 frame 4 missed 0; line 53172 T1 frame 4 missed 0; line 53173 T1 frame 4 missed 0 |
| R16 | proud | 25.83 | 36.88 -29.72 0.26 37.41 13.27 3.76 | (0.75, -0.03, -0.66) | +0.190 / +0.328 | face 78 (torus); face 76 (torus); face 77 (torus) | line 29077 T1 frame 2 missed 0; line 29078 T1 frame 2 missed 0; line 29076 T1 frame 2 missed 0 |
| R17 | proud | 22.33 | 14.25 -31.25 11.36 16.75 -28.75 13.9 | (0.84, -0.55, 0.0) | +4.922 / +5.000 | face 4 (cylinder r1.25) | line 35771 T2 frame 2 missed 0.036; line 35758 T2 frame 2 missed 0.036; line 35785 T2 frame 2 missed 0.036 |
| R18 | proud | 20.39 | -16.75 -9.25 11.44 -14.25 -6.75 13.96 | (-0.41, 0.91, 0.0) | +4.832 / +5.000 | face 0 (cylinder r1.25) | line 50481 T2 frame 3 missed 0.025; line 50495 T2 frame 3 missed 0.025; line 50478 T2 frame 3 missed 0.027 |
| R19 | proud | 20.0 | -16.75 12.75 11.42 -14.25 15.25 13.96 | (0.58, 0.81, 0.0) | +4.868 / +5.000 | face 7 (cylinder r1.25) | line 14426 T1 frame 1 missed 0; line 14427 T1 frame 1 missed 0; line 14428 T1 frame 1 missed 0 |
| R20 | proud | 19.61 | -16.75 -31.25 11.34 -14.25 -28.75 13.91 | (-0.07, -1.0, 0.0) | +4.861 / +5.000 | face 6 (cylinder r1.25) | line 50415 T2 frame 3 missed 0.187; line 50406 T2 frame 3 missed 0.187; line 50411 T2 frame 3 missed 0.187 |
| R21 | proud | 19.23 | -16.75 -53.25 11.4 -14.25 -50.75 13.95 | (-1.0, -0.06, 0.0) | +4.685 / +5.000 | face 1 (cylinder r1.25) | line 50310 T2 frame 3 missed 0.055; line 50334 T2 frame 3 missed 0.055; line 50333 T2 frame 3 missed 0.058 |
| R22 | proud | 19.23 | 14.25 -9.25 11.5 16.75 -6.75 13.93 | (0.34, 0.94, 0.0) | +5.000 / +5.000 | face 2 (cylinder r1.25) | line 35853 T2 frame 2 missed 0.082; line 35854 T2 frame 2 missed 0.082; line 35864 T2 frame 2 missed 0.091 |
| R23 | proud | 18.45 | 14.26 12.75 11.34 16.74 15.25 13.95 | (0.58, -0.82, 0.0) | +4.858 / +5.000 | face 5 (cylinder r1.25) | line 35954 T2 frame 2 missed 0.031; line 35933 T2 frame 2 missed 0.031; line 35955 T2 frame 2 missed 0.031 |
| R24 | proud | 18.26 | 14.25 -53.25 11.48 16.75 -50.75 13.95 | (-0.46, -0.89, 0.0) | +4.952 / +5.000 | face 3 (cylinder r1.25) | line 35693 T2 frame 2 missed 0.233; line 35697 T2 frame 2 missed 0.233; line 35680 T2 frame 2 missed 0.233 |
| R25 | proud | 18.06 | -37.39 -38.67 0.24 -36.87 -9.15 3.73 | (-0.72, -0.06, -0.69) | +0.198 / +0.327 | face 49 (torus); face 48 (torus); face 47 (torus) | line 42954 T1 frame 3 missed 0; line 42955 T1 frame 3 missed 0; line 42953 T1 frame 3 missed 0 |
| R26 | proud | 17.67 | -27.03 -78.72 23.09 -5.54 -69.42 23.96 | (0.24, -0.63, -0.74) | +0.221 / +0.469 | face 34 (cylinder r1); face 36 (torus); face 32 (torus) | line 22231 T4 frame 1 missed 0; line 22230 T4 frame 1 missed 0; line 22232 T4 frame 1 missed 0 |
| R27 | proud | 10.29 | -21.53 69.43 23.1 -10.86 75.15 23.79 | (0.35, 0.59, -0.73) | +0.227 / +0.390 | face 71 (cylinder r1); face 64 (torus); face 59 (torus) | line 49317 T1 frame 3 missed 0.049; line 49014 T1 frame 3 missed 0.049; line 53549 T1 frame 4 missed 0.049 |
| R28 | proud | 6.99 | -37.22 71.52 23.12 -30.38 78.58 23.62 | (-0.49, 0.54, -0.68) | +0.189 / +0.362 | face 64 (torus) | line 45235 T1 frame 3 missed 0; line 45236 T1 frame 3 missed 0; line 45234 T1 frame 3 missed 0 |
| R29 | proud | 6.8 | 30.02 71.31 23.1 37.28 78.71 23.51 | (0.47, 0.53, -0.71) | +0.198 / +0.375 | face 66 (torus) | line 28893 T1 frame 2 missed 0; line 28892 T1 frame 2 missed 0; line 28891 T1 frame 2 missed 0 |
| R30 | proud | 3.11 | -27.09 76.41 23.1 -22.43 78.74 23.55 | (0.29, 0.6, -0.74) | +0.176 / +0.370 | face 64 (torus) | line 48854 T1 frame 3 missed 0.048; line 47461 T1 frame 3 missed 0.048; line 49157 T1 frame 3 missed 0.048 |

Cycle time 123.8 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
