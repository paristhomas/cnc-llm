# Simulation feedback - iteration 1: ftc10 (3+2)

**Score: 61.756% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 59.482%). Program valid: **NO** (6 errors, 10 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 61.756 |
| machinable_gouge_pct | 0.0 |
| machinable_proud_pct | 38.244 |
| max_gouge_mm | 0.0135 |
| unreachable_area_pct | 3.683 |
| parting_face_pct | 0.681 |
| setups | 6 |
| distinct_orientations | 4 |
| final_connection_mm2 | 30.0 |
| cycle_time_min | 77.13 |

## Errors (must be fixed)

- line 31959: rapid (G0) move removes material - crash; first at line 31959 (frame 5, T1), removed column up to 25.13 mm x8 (lines 31959, 31968, 31977, 31986, 32083, 32092, 32101, 32110)
- line 11569: material contact above the flute length (shank rubbing / tool too short); first at line 11569 (frame 1, T4), removed column up to 12.00 mm x361 (lines 11569, 11570, 11599, 11600, 11658, 11659, 11688, 11689, 11719, 11777, 11778, 11812)
- line 11569: tool holder collides with material (stick-out too short for this depth); first at line 11569 (frame 1, T4), removed column up to 12.00 mm x13272 (lines 11569, 11570, 11571, 11572, 11573, 11574, 11575, 11576, 11577, 11578, 11579, 11580)
- line 16648: tool or holder hits the vise / table (check the tool axis, stick-out and the stub gap) x90 (lines 16648, 16649, 16650, 16800, 16801, 16802, 16878, 16879, 16880, 17030, 17031, 17032)
- line 4399: cut cross-section > 0.75 D^2 for T1 (overloaded: too deep and too wide); worst 305.49 mm2 > limit 75.00 mm2 at line 32085 (move to 61.00, -5.05, 2.50, removed column up to 31.50 mm deep) x25 (lines 4399, 4619, 4620, 4621, 4622, 4623, 4624, 4625, 4627, 4806, 4807, 4808)
- line 11814: cut cross-section > 0.75 D^2 for T7 (overloaded: too deep and too wide); worst 29.66 mm2 > limit 6.75 mm2 at line 11815 (move to -23.00, 18.00, 44.00, removed column up to 14.00 mm deep) x4 (lines 11814, 11815, 11816, 11817)

## Warnings

- line 12192: rotary indexing with the spindle running
- line 12194: rotary indexing with the spindle running
- line 18927: rotary indexing with the spindle running
- line 18929: rotary indexing with the spindle running
- line 26457: rotary indexing with the spindle running
- line 26459: rotary indexing with the spindle running
- line 31870: rotary indexing with the spindle running
- line 31872: rotary indexing with the spindle running
- line 31994: rotary indexing with the spindle running
- line 31996: rotary indexing with the spindle running

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 13-12192 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T3, T4, T7 | 35352 | 125.662 |
| 2 | 12200-18927 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2 | 39465 | 47.881 |
| 3 | 18935-26457 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2 | 40261 | 43.058 |
| 4 | 26465-31870 | (0.0, 1.0, 0.0) | 90 / 90 | T1 | 5401 | 25.922 |
| 5 | 31874-31994 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 120 | 93.74 |
| 6 | 31998-32148 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 147 | 100.788 |

## Rigidity / part-off (connection area in the stub gap; stock section 13284.0 mm2; part-off marker at line 31869)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 12192 | 13284.0 | 1.000 | [13284.0] | False |
| 2 | 18927 | 12792.0 | 0.963 | [12792.0] | False |
| 3 | 26457 | 12300.0 | 0.926 | [12300.0] | False |
| 4 | 31870 | 12300.0 | 0.926 | [12300.0] | False |
| 5 | 31994 | 5934.0 | 0.447 | [5934.0] | True |
| 6 | 32148 | 30.0 | 0.002 | [15.0, 15.0] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | proud | 5453.85 | -37.41 -7.47 0.03 37.41 67 30.77 | (-0.05, 0.38, -0.93) | +4.135 / +5.000 | face 94 (cylinder r6); face 105 (cylinder r8); face 31 (plane) | line 23159 T1 frame 3 missed 0.078; line 23160 T1 frame 3 missed 0.082; line 15110 T1 frame 2 missed 0.104 |
| R2 | proud | 3242.63 | -22.46 -55.46 14 22.46 17.45 14 | (0.0, 0.0, 1.0) | +4.350 / +5.000 | face 164 (plane) | line 11814 T7 frame 1 missed 0; line 11827 T7 frame 1 missed 0; line 11858 T7 frame 1 missed 0 |
| R3 | proud | 2515.34 | -37.41 -78.72 0.05 37.41 -30.89 27.99 | (0.0, -0.82, -0.58) | +3.880 / +5.000 | face 111 (plane); face 99 (cylinder r8); face 110 (plane) | line 15480 T1 frame 2 missed 0.055; line 14909 T1 frame 2 missed 0.055; line 14908 T1 frame 2 missed 0.055 |
| R4 | proud | 1390.12 | -33.99 -29.12 0.05 31 -8.89 3.2 | (-0.0, 0.0, -1.0) | +2.039 / +3.668 | face 102 (cylinder r12.5); face 101 (cylinder r8); face 103 (cylinder r8) | line 32096 T1 frame 6 missed 0.052; line 32098 T1 frame 6 missed 0.052; line 32094 T1 frame 6 missed 0.052 |
| R5 | proud | 1385.46 | -33.99 -7.11 0.05 30.99 13.12 3.2 | (0.0, 0.0, -1.0) | +2.041 / +3.668 | face 104 (cylinder r12.5); face 103 (cylinder r8); face 105 (cylinder r8) | line 32107 T1 frame 6 missed 0.055; line 32105 T1 frame 6 missed 0.055; line 32103 T1 frame 6 missed 0.055 |
| R6 | proud | 1384.1 | -34 -51.12 0.05 31 -30.89 3.2 | (0.0, 0.0, -1.0) | +2.037 / +3.668 | face 100 (cylinder r12.5); face 101 (cylinder r8); face 99 (cylinder r8) | line 32089 T1 frame 6 missed 0.056; line 32085 T1 frame 6 missed 0.056; line 32087 T1 frame 6 missed 0.056 |
| R7 | proud | 595.24 | 22.25 25.95 13.25 27.75 62.46 18.75 | (0.09, 0.56, -0.83) | +5.000 / +5.000 | face 175 (cylinder r2.75); face 174 (cone); face 201 (cylinder r1.75) | line 12174 T7 frame 1 missed 7.079; line 12173 T7 frame 1 missed 7.079; line 12143 T7 frame 1 missed 7.083 |
| R8 | proud | 385.5 | -8.6 -11.5 4.5 8.6 -4.5 11.5 | (0.0, 0.86, 0.5) | +5.000 / +5.000 | face 146 (cylinder r3.5) | line 31981 T1 frame 5 missed 5.051; line 31983 T1 frame 5 missed 5.051; line 31979 T1 frame 5 missed 5.051 |
| R9 | proud | 385.5 | -8.6 10.5 4.5 8.6 17.5 11.5 | (-0.0, -0.64, 0.77) | +5.000 / +5.000 | face 149 (cylinder r3.5) | line 26453 T2 frame 3 missed 0; line 26452 T2 frame 3 missed 0; line 32114 T1 frame 6 missed 5.054 |
| R10 | proud | 379.86 | -8.58 -33.5 4.5 8.59 -26.5 11.5 | (-0.0, 0.48, -0.88) | +5.000 / +5.000 | face 148 (cylinder r3.5) | line 32096 T1 frame 6 missed 5.067; line 32098 T1 frame 6 missed 5.067; line 32094 T1 frame 6 missed 5.067 |
| R11 | proud | 378.12 | -8.6 -55.5 4.5 8.6 -48.5 11.5 | (0.0, -1.0, 0.07) | +5.000 / +5.000 | face 147 (cylinder r3.5) | line 26201 T2 frame 3 missed 0; line 31965 T1 frame 5 missed 5.052; line 31961 T1 frame 5 missed 5.052 |
| R12 | proud | 30.88 | -9.18 69.42 23.09 26.84 78.75 23.95 | (-0.15, 0.68, -0.72) | +0.211 / +0.414 | face 71 (cylinder r1); face 66 (torus); face 61 (torus) | line 28681 T1 frame 4 missed 0; line 28682 T1 frame 4 missed 0; line 28683 T1 frame 4 missed 0 |
| R13 | proud | 25.83 | 36.88 -29.72 0.26 37.41 13.27 3.76 | (0.75, -0.03, -0.66) | +0.190 / +0.328 | face 78 (torus); face 76 (torus); face 77 (torus) | line 14052 T1 frame 2 missed 0; line 14053 T1 frame 2 missed 0; line 14051 T1 frame 2 missed 0 |
| R14 | proud | 18.06 | -37.39 -38.67 0.24 -36.87 -9.15 3.73 | (-0.72, -0.06, -0.69) | +0.198 / +0.327 | face 49 (torus); face 48 (torus); face 47 (torus) | line 20995 T1 frame 3 missed 0; line 20996 T1 frame 3 missed 0; line 20994 T1 frame 3 missed 0 |
| R15 | proud | 10.29 | -21.53 69.43 23.1 -10.86 75.15 23.79 | (0.35, 0.59, -0.73) | +0.227 / +0.390 | face 71 (cylinder r1); face 64 (torus); face 59 (torus) | line 28935 T1 frame 4 missed 0.049; line 4810 T1 frame 1 missed 0.055; line 9163 T3 frame 1 missed 0.058 |
| R16 | proud | 6.99 | -37.22 71.52 23.12 -30.38 78.58 23.62 | (-0.49, 0.54, -0.68) | +0.189 / +0.363 | face 64 (torus) | line 23280 T1 frame 3 missed 0; line 23279 T1 frame 3 missed 0; line 23281 T1 frame 3 missed 0 |
| R17 | proud | 6.8 | 30.02 71.31 23.1 37.28 78.71 23.51 | (0.47, 0.53, -0.71) | +0.197 / +0.374 | face 66 (torus) | line 13868 T1 frame 2 missed 0; line 13867 T1 frame 2 missed 0; line 13866 T1 frame 2 missed 0 |
| R18 | proud | 3.11 | -27.09 76.41 23.1 -22.43 78.74 23.55 | (0.29, 0.6, -0.74) | +0.176 / +0.370 | face 64 (torus) | line 28469 T1 frame 4 missed 0.048; line 28843 T1 frame 4 missed 0.048; line 28089 T1 frame 4 missed 0.048 |
| R19 | proud | 2.72 | 36.92 61.99 8.68 37.37 62.41 13.72 | (0.75, 0.66, -0.04) | +0.205 / +0.299 | face 68 (cylinder r1); face 60 (sphere r1) | line 27344 T1 frame 4 missed 0; line 27345 T1 frame 4 missed 0; line 27331 T1 frame 4 missed 0 |
| R20 | proud | 1.55 | -37.38 61.97 8.84 -36.93 62.4 9.96 | (-0.72, 0.69, -0.03) | +0.208 / +0.298 | face 70 (cylinder r1); face 58 (sphere r1) | line 21123 T1 frame 3 missed 0; line 21122 T1 frame 3 missed 0; line 21121 T1 frame 3 missed 0 |
| R21 | proud | 0.78 | -37.38 -62.26 15.18 -37.16 -61.97 16.21 | (-0.78, -0.63, 0.0) | +0.206 / +0.289 | face 43 (cylinder r1) | line 20837 T1 frame 3 missed 0.047; line 6389 T1 frame 1 missed 0.059; line 5281 T1 frame 1 missed 0.059 |
| R22 | proud | 0.78 | -37.37 32.33 8.25 -37.16 33.25 8.51 | (-0.78, -0.0, -0.62) | +0.203 / +0.272 | face 54 (cylinder r1) | line 20692 T1 frame 3 missed 0.05; line 6389 T1 frame 1 missed 0.064; line 5558 T1 frame 1 missed 0.064 |
| R23 | proud | 0.39 | 36.94 32.28 8.1 36.95 32.76 8.11 | (0.45, -0.0, -0.9) | +0.108 / +0.111 | face 73 (cylinder r1) | line 13915 T1 frame 2 missed 0; line 14493 T1 frame 2 missed 0.05; line 31859 T1 frame 4 missed 0.129 |
| R24 | proud | 0.39 | 36.92 39.34 8.09 36.93 40.11 8.09 | (0.42, 0.0, -0.91) | +0.102 / +0.104 | face 73 (cylinder r1) | line 14493 T1 frame 2 missed 0.045; line 31818 T1 frame 4 missed 0.102; line 31817 T1 frame 4 missed 0.102 |
| R25 | proud | 0.19 | -36.93 34.46 8.1 -36.93 34.46 8.1 | (-0.42, 0.0, -0.91) | +0.108 / +0.108 | face 54 (cylinder r1) | line 20692 T1 frame 3 missed 0; line 22645 T1 frame 3 missed 0.049; line 21376 T1 frame 3 missed 0.049 |

Cycle time 77.1 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
