# Simulation feedback - iteration 1: ftc10 (3+2)

**Score: 75.317% of the whole part surface within +-0.1 mm.** Program valid: **NO** (5 errors, 1 warnings). Not scored: tab witness 0.19% and the 0.03 mm face-edge band 0.85% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 75.317 |
| whole_surface_gouge_pct | 22.816 |
| whole_surface_proud_pct | 1.867 |
| proud_area_mm2 | 896.53 |
| gouge_area_mm2 | 10957.65 |
| max_gouge_mm | 5.0 |
| max_proud_mm | 5.0 |
| tab_witness_pct | 0.187 |
| tabs | 2 |
| tab_total_mm2 | 22.88 |
| tab_max_width_mm | 2.6 |
| partoff_ok | True |
| setups | 8 |
| distinct_orientations | 5 |
| cycle_time_min | 75.57 |

## Errors (must be fixed)

- line 9: rapid (G0) move removes material - crash; first at line 9 (frame 0, T1, move ends at G54 (0.00, 0.00, 165.00)), removed column up to 9.50 mm (material left by earlier setups counts too) x8 (lines 9, 7459, 47638, 61698, 64772, 66987, 67679, 69121)
- line 55000: material contact above the flute length (shank rubbing / tool too short); first at line 55000 (frame 2, T7, move ends at G54 (-5.00, -39.00, 139.00)), removed column up to 10.40 mm (material left by earlier setups counts too) x20 (lines 55000, 55032, 65974, 65978, 65982, 65986, 65990, 65994, 65998, 66002, 66006, 66010)
- line 55032: tool holder collides with material (stick-out too short for this depth); first at line 55032 (frame 2, T7, move ends at G54 (8.62, -39.00, 140.60)), removed column up to 13.79 mm (material left by earlier setups counts too) x889 (lines 55032, 55033, 55051, 55052, 55056, 55057, 55059, 55060, 55064, 55065, 55067, 55068)
- line 55000: cut cross-section > 0.75 D^2 for T7 (overloaded: too deep and too wide); worst 64.23 mm2 > limit 6.75 mm2 at line 65974 (move to 25.17, -0.80, -9.13, removed column up to 27.75 mm deep) x4 (lines 55000, 55032, 65974, 65978)
- line 74797: cut cross-section > 0.75 D^2 for T3 (overloaded: too deep and too wide); worst 10.96 mm2 > limit 6.75 mm2 at line 74808 (move to 10.67, 7.50, 12.00, removed column up to 3.63 mm deep) x122 (lines 74797, 74798, 74799, 74800, 74801, 74802, 74803, 74804, 74805, 74806, 74807, 74808)

## Warnings

- line 53937: cut cross-section > 0.75 D^2 for T6 (overloaded: too deep and too wide); worst 42.33 mm2 > limit 27.00 mm2 at line 53937 (move to 40.40, 20.00, 7.87, removed column up to 8.13 mm deep) x1

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 9-6936 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T5, T10, T11 | 20672 | 48.41 |
| 2 | 6941-22723 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4, T7, T13 | 33476 | 102.483 |
| 3 | 22730-55114 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T5, T6, T7 | 78335 | 105.857 |
| 4 | 55121-59301 | (0.0, -1.0, 0.0) | 90 / -90 | T1, T2, T3, T7, T10, T12 | 19279 | 14.259 |
| 5 | 59308-61193 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T2, T7, T10, T12 | 16986 | 13.827 |
| 6 | 61199-61372 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T3 | 5735 | 4.56 |
| 7 | 61378-66889 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T5, T7 | 7174 | 58.156 |
| 8 | 66893-76172 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4 | 9265 | 9.364 |

## Rigidity / part-off (connection area in the stub gap; stock section 2997.0 mm2; part-off marker at line 61189)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 6936 | 2997.0 | 1.000 | [2997.0] | False |
| 2 | 22723 | 2997.0 | 1.000 | [2997.0] | False |
| 3 | 55114 | 2997.0 | 1.000 | [2997.0] | False |
| 4 | 59301 | 2997.0 | 1.000 | [2997.0] | False |
| 5 | 61193 | 2997.0 | 1.000 | [2997.0] | False |
| 6 | 61372 | 2997.0 | 1.000 | [2997.0] | True |
| 7 | 66889 | 627.75 | 0.209 | [627.75] | True |
| 8 | 76172 | 22.5 | 0.007 | [11.25, 11.25] | True |

## Part-off: tabs and witness (OK)

Weakest plane Z-5.7: 2 tab(s), total 22.88 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 90.9 mm2 = 0.187% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 46.22 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 11.44 | 2.6 | 12 -28.5 -5.7 |
| 2 | 11.44 | 2.6 | 12 28.5 -5.7 |

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | gouge | 8725.64 | -15.5 -37.5 16.5 -5.05 37.5 103.35 | (-1.0, 0.0, -0.04) | -3.710 / -5.000 | face 99 (cylinder r8); face 105 (cylinder r8); face 104 (cylinder r12.5) | failed (gouge): line 54658 (T6, frame 2) cut into the part here |
| R2 | gouge | 2028.27 | -15.5 -37.5 132.96 9.4 37.5 146.18 | (-0.44, 0.01, 0.9) | -2.712 / -5.000 | face 113 (plane); face 112 (plane); face 69 (cylinder r1) | failed (gouge): line 55032 (T7, frame 2) cut into the part here |
| R3 | proud | 410.0 | -13.5 -7.51 102.41 -7.5 6.78 136.76 | (-1.0, -0.01, -0.0) | +0.398 / +0.876 | face 94 (cylinder r6); face 95 (cylinder r1); face 93 (cylinder r1) | failed: passes reach the area (line 54832, T6) but leave +0.40 mm on average: stepover / scallop, the tool radius, or a stop short |
| R4 | proud | 109.54 | -11.47 18.58 102.4 -7.5 31.47 108.5 | (-0.78, -0.0, -0.62) | +0.320 / +0.573 | face 24 (plane); face 205 (plane); face 15 (cylinder r1) | failed: passes reach the area (line 51110, T5) but leave +0.32 mm on average: stepover / scallop, the tool radius, or a stop short |
| R5 | gouge | 103.33 | 7.5 -37.5 0.01 9.21 -19.59 15.06 | (-0.93, -0.11, -0.34) | -1.053 / -5.000 | face 110 (plane); face 36 (torus); face 109 (cylinder r9) | failed (gouge): line 66098 (T7, frame 6) cut into the part here |
| R6 | gouge | 100.41 | 7.5 19.62 0 9.23 37.5 14.98 | (-0.96, 0.07, -0.27) | -1.040 / -5.000 | face 110 (plane); face 40 (torus); face 39 (cylinder r1) | failed (gouge): line 66078 (T7, frame 6) cut into the part here |
| R7 | proud | 97.5 | 7.59 -37.35 148.42 8.47 37.19 157.98 | (-0.63, 0.01, 0.78) | +0.407 / +1.809 | face 71 (cylinder r1); face 66 (torus); face 64 (torus) | failed: passes reach the area (line 52409, T5) but leave +0.41 mm on average: stepover / scallop, the tool radius, or a stop short |
| R8 | proud | 37.1 | 7.59 -12.32 8.52 8.47 19.69 9.58 | (-0.56, -0.02, -0.83) | +1.386 / +5.000 | face 34 (cylinder r1); face 33 (torus) | failed: passes reach the area (line 66527, T7) but leave +1.39 mm on average: stepover / scallop, the tool radius, or a stop short |
| R9 | proud | 27.19 | -7.4 36.93 101.67 -6.92 37.41 137.4 | (-0.7, 0.71, 0.0) | +0.229 / +0.404 | face 73 (cylinder r1); face 74 (torus) | failed: passes reach the area (line 50889, T5) but leave +0.23 mm on average: stepover / scallop, the tool radius, or a stop short |
| R10 | proud | 26.03 | -1.81 22.43 104.99 2.99 27.47 106.41 | (-0.0, -0.03, 1.0) | +0.729 / +1.762 | face 174 (cone) | failed: passes reach the area (line 6929, T11) but leave +0.73 mm on average: stepover / scallop, the tool radius, or a stop short |
| R11 | proud | 23.5 | -5.04 -26.08 112.47 0.04 -20.92 113.91 | (0.01, -0.06, 1.0) | +0.693 / +1.780 | face 176 (cone) | failed: no pass reached this; nearest pass line 37359 (T1, frame 2) missed by 12.541 mm |
| R12 | proud | 22.14 | 15.5 -0.99 99.1 15.5 1 110.88 | (1.0, 0.0, 0.0) | +3.000 / +3.000 | face 172 (plane) | failed: passes reach the area (line 6949, T1) but leave +3.00 mm on average: stepover / scallop, the tool radius, or a stop short |
| R13 | proud | 12.82 | 0.8 -37.5 77.46 1.98 -37.5 86.85 | (0.0, -1.0, 0.0) | +0.300 / +0.300 | face 108 (plane) | failed: passes reach the area (line 55291, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R14 | proud | 12.62 | -7.4 -37.4 101.72 -6.93 -36.93 118.96 | (-0.71, -0.71, 0.0) | +0.228 / +0.410 | face 54 (cylinder r1); face 53 (torus) | failed: passes reach the area (line 54757, T6) but leave +0.23 mm on average: stepover / scallop, the tool radius, or a stop short |
| R15 | proud | 12.24 | 0.84 37.5 33.34 1.96 37.5 42.63 | (0.0, 1.0, 0.0) | +0.300 / +0.300 | face 213 (plane) | failed: passes reach the area (line 59501, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R16 | proud | 10.1 | 0.75 -37.5 55.56 1.97 -37.5 64.62 | (0.0, -1.0, 0.0) | +0.300 / +0.300 | face 108 (plane) | failed: passes reach the area (line 55240, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 9.32 | 0.86 37.5 55.46 1.97 37.5 64.25 | (0.0, 1.0, 0.0) | +0.300 / +0.300 | face 213 (plane) | failed: passes reach the area (line 59522, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 9.13 | 0.83 -37.5 33.42 2 -37.5 42.65 | (0.0, -1.0, 0.0) | +0.300 / +0.300 | face 108 (plane) | failed: passes reach the area (line 55291, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R19 | proud | 6.99 | 7.61 -19.71 8.78 8.45 -13.65 9.55 | (-0.55, 0.08, -0.83) | +0.614 / +2.230 | face 34 (cylinder r1); face 32 (torus) | failed: passes reach the area (line 66523, T7) but leave +0.61 mm on average: stepover / scallop, the tool radius, or a stop short |
| R20 | proud | 6.41 | 0.75 37.5 77.46 1.99 37.5 84.07 | (0.0, 1.0, 0.0) | +0.300 / +0.300 | face 213 (plane) | failed: passes reach the area (line 59454, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R21 | proud | 4.86 | 0.59 18.92 135.11 0.95 20.91 137.1 | (-1.0, -0.02, -0.07) | +0.287 / +0.531 | face 198 (cone) | failed: passes reach the area (line 53900, T4) but leave +0.29 mm on average: stepover / scallop, the tool radius, or a stop short |
| R22 | proud | 4.47 | 0.66 29.32 110.05 1.13 30.92 111.87 | (-1.0, 0.04, 0.06) | +0.449 / +0.730 | face 192 (cone) | failed: no pass reached this; nearest pass line 6928 (T11, frame 0) missed by 1.627 mm |
| R23 | proud | 4.47 | 0.59 29.01 120.98 1.07 30.8 122.82 | (-0.99, 0.05, 0.13) | +0.331 / +0.662 | face 190 (cone) | failed: passes reach the area (line 53552, T4) but leave +0.33 mm on average: stepover / scallop, the tool radius, or a stop short |
| R24 | proud | 3.88 | -4.1 14.3 25.81 -3.78 16.74 28.25 | (0.0, 0.57, -0.82) | +0.226 / +0.396 | face 3 (cylinder r1.25) | failed: passes reach the area (line 22471, T13) but leave +0.23 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | proud | 3.5 | -4.15 14.26 69.76 -3.75 16.26 72.21 | (0.0, 0.6, 0.8) | +0.210 / +0.352 | face 2 (cylinder r1.25) | failed: passes reach the area (line 22540, T13) but leave +0.21 mm on average: stepover / scallop, the tool radius, or a stop short |
| R26 | proud | 3.3 | -4.09 14.27 91.75 -3.78 16.71 94.24 | (0.0, 0.56, -0.83) | +0.194 / +0.304 | face 5 (cylinder r1.25) | failed: passes reach the area (line 22575, T13) but leave +0.19 mm on average: stepover / scallop, the tool radius, or a stop short |
| R27 | proud | 3.11 | -7.32 -37.41 134.24 -6.92 -37.08 137.18 | (-0.68, -0.73, 0.0) | +0.273 / +0.383 | face 90 (cylinder r1) | failed: passes reach the area (line 55412, T1) but leave +0.27 mm on average: stepover / scallop, the tool radius, or a stop short |
| R28 | proud | 3.11 | -4.17 14.25 47.75 -3.78 16.61 50.25 | (0.0, 0.98, 0.19) | +0.216 / +0.332 | face 4 (cylinder r1.25) | failed: passes reach the area (line 22501, T13) but leave +0.22 mm on average: stepover / scallop, the tool radius, or a stop short |
| R29 | proud | 3.11 | 0.62 19.11 113.43 1.11 20.69 115.08 | (-0.96, 0.09, -0.25) | +0.373 / +0.712 | face 194 (cone) | failed: no pass reached this; nearest pass line 6929 (T11, frame 0) missed by 1.638 mm |
| R30 | proud | 2.91 | -4.11 -16.75 69.99 -3.74 -14.28 72.24 | (0.0, -0.95, -0.3) | +0.215 / +0.340 | face 0 (cylinder r1.25) | failed: passes reach the area (line 22681, T13) but leave +0.21 mm on average: stepover / scallop, the tool radius, or a stop short |

Cycle time 75.6 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
