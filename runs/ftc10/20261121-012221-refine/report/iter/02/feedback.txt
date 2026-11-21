# Simulation feedback - iteration 2: ftc10 (3+2)

**Score: 98.986% of the whole part surface within +-0.1 mm.** Program valid: **NO** (3 errors, 1 warnings). Not scored: tab witness 0.21% and the 0.03 mm face-edge band 0.85% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 98.986 |
| whole_surface_gouge_pct | 0.016 |
| whole_surface_proud_pct | 0.998 |
| proud_area_mm2 | 478.95 |
| gouge_area_mm2 | 7.77 |
| max_gouge_mm | 0.433 |
| max_proud_mm | 1.7796 |
| tab_witness_pct | 0.214 |
| tabs | 2 |
| tab_total_mm2 | 22.88 |
| tab_max_width_mm | 2.6 |
| partoff_ok | True |
| setups | 8 |
| distinct_orientations | 5 |
| cycle_time_min | 92.92 |

## Errors (must be fixed)

- line 111674: material contact above the flute length (shank rubbing / tool too short); first at line 111674 (frame 7, T7, move ends at G54 (8.97, -31.57, -0.80)), removed column up to 26.82 mm (material left by earlier setups counts too) x89 (lines 111674, 111675, 111676, 111677, 111678, 111679, 111680, 111681, 111682, 111683, 111684, 111685)
- line 78502: tool holder collides with material (stick-out too short for this depth); first at line 78502 (frame 3, T7, move ends at G54 (8.62, -39.00, 140.60)), removed column up to 13.71 mm (material left by earlier setups counts too) x5439 (lines 78502, 78503, 78869, 78870, 79048, 79049, 79051, 79052, 79053, 79218, 79219, 79220)
- line 111674: cut cross-section > 0.75 D^2 for T7 (overloaded: too deep and too wide); worst 61.76 mm2 > limit 6.75 mm2 at line 111689 (move to 27.77, -0.80, -8.29, removed column up to 26.41 mm deep) x92 (lines 111674, 111675, 111676, 111677, 111678, 111679, 111680, 111681, 111682, 111683, 111684, 111685)

## Warnings

- line 77612: deep plunge (> 0.5 D) at > 50% of the recommended feed for T7; ramp or helix instead x10

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 12-6938 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T5, T10, T11 | 20673 | 48.41 |
| 2 | 6945-25164 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4, T7, T13 | 38657 | 102.59 |
| 3 | 25171-86717 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T5, T6, T7 | 107496 | 79.268 |
| 4 | 86724-96927 | (0.0, -1.0, 0.0) | 90 / -90 | T1, T2, T3, T7, T10, T12 | 25302 | 14.381 |
| 5 | 96934-104546 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T2, T7, T10, T12 | 22713 | 13.963 |
| 6 | 104552-104725 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T3 | 5735 | 4.56 |
| 7 | 104731-116024 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T5, T7 | 12956 | 58.407 |
| 8 | 116028-129513 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4 | 13471 | 11.353 |

## Rigidity / part-off (connection area in the stub gap; stock section 2997.0 mm2; part-off marker at line 104542)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 6938 | 2997.0 | 1.000 | [2997.0] | False |
| 2 | 25164 | 2997.0 | 1.000 | [2997.0] | False |
| 3 | 86717 | 2997.0 | 1.000 | [2997.0] | False |
| 4 | 96927 | 2997.0 | 1.000 | [2997.0] | False |
| 5 | 104546 | 2997.0 | 1.000 | [2997.0] | False |
| 6 | 104725 | 2997.0 | 1.000 | [2997.0] | True |
| 7 | 116024 | 627.75 | 0.209 | [627.75] | True |
| 8 | 129513 | 22.5 | 0.007 | [11.25, 11.25] | True |

## Part-off: tabs and witness (OK)

Weakest plane Z-5.7: 2 tab(s), total 22.88 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 103.71 mm2 = 0.214% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 51.08 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 11.44 | 2.6 | 12 -28.5 -5.7 |
| 2 | 11.44 | 2.6 | 12 28.5 -5.7 |

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 248.02 | -13.62 -32.93 98.17 -7.5 32.81 104.6 | (-0.51, 0.0, 0.86) | +0.372 / +1.320 | face 105 (cylinder r8); face 96 (cylinder r1); face 183 (bspline) | failed: passes reach the area (line 77258, T6) but leave +0.37 mm on average: stepover / scallop, the tool radius, or a stop short |
| R2 | proud | 55.74 | -11.47 18.58 107.68 -7.52 31.47 108.5 | (-0.2, -0.0, -0.98) | +0.348 / +0.573 | face 205 (plane); face 15 (cylinder r1) | failed: no pass reached this; nearest pass line 58341 (T5, frame 3) missed by 0.088 mm |
| R3 | proud | 26.03 | -1.81 22.43 104.99 2.99 27.47 106.41 | (-0.0, -0.03, 1.0) | +0.729 / +1.762 | face 174 (cone) | failed: passes reach the area (line 6932, T11) but leave +0.73 mm on average: stepover / scallop, the tool radius, or a stop short |
| R4 | proud | 23.5 | -5.04 -26.08 112.47 0.04 -20.92 113.91 | (0.01, -0.06, 1.0) | +0.693 / +1.780 | face 176 (cone) | failed: no pass reached this; nearest pass line 43616 (T1, frame 3) missed by 12.541 mm |
| R5 | proud | 12.82 | 0.8 -37.5 77.46 1.98 -37.5 86.85 | (0.0, -1.0, 0.0) | +0.300 / +0.300 | face 108 (plane) | failed: passes reach the area (line 86894, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R6 | proud | 12.24 | 0.84 37.5 33.34 1.96 37.5 42.63 | (0.0, 1.0, 0.0) | +0.300 / +0.300 | face 213 (plane) | failed: passes reach the area (line 97127, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R7 | proud | 10.1 | 0.75 -37.5 55.56 1.97 -37.5 64.62 | (0.0, -1.0, 0.0) | +0.300 / +0.300 | face 108 (plane) | failed: passes reach the area (line 86843, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R8 | proud | 9.32 | 0.86 37.5 55.46 1.97 37.5 64.25 | (0.0, 1.0, 0.0) | +0.300 / +0.300 | face 213 (plane) | failed: passes reach the area (line 97148, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R9 | proud | 9.13 | 0.83 -37.5 33.42 2 -37.5 42.65 | (0.0, -1.0, 0.0) | +0.300 / +0.300 | face 108 (plane) | failed: passes reach the area (line 86894, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R10 | proud | 6.41 | 0.75 37.5 77.46 1.99 37.5 84.07 | (0.0, 1.0, 0.0) | +0.300 / +0.300 | face 213 (plane) | failed: passes reach the area (line 97080, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R11 | proud | 4.86 | 0.59 18.92 135.11 0.95 20.91 137.1 | (-1.0, -0.02, -0.07) | +0.287 / +0.531 | face 198 (cone) | failed: passes reach the area (line 66933, T4) but leave +0.29 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 4.47 | 0.66 29.32 110.05 1.13 30.92 111.87 | (-1.0, 0.04, 0.06) | +0.449 / +0.730 | face 192 (cone) | failed: no pass reached this; nearest pass line 6931 (T11, frame 1) missed by 1.627 mm |
| R13 | proud | 4.47 | 0.59 29.01 120.98 1.07 30.8 122.82 | (-0.99, 0.05, 0.13) | +0.331 / +0.662 | face 190 (cone) | failed: passes reach the area (line 66584, T4) but leave +0.33 mm on average: stepover / scallop, the tool radius, or a stop short |
| R14 | gouge | 3.11 | -6.81 37.37 140.16 -0.43 37.5 141 | (-0.03, 0.99, 0.11) | -0.118 / -0.158 | face 68 (cylinder r1); face 213 (plane); face 73 (cylinder r1) | failed (gouge): line 78415 (T7, frame 3) cut into the part here |
| R15 | proud | 3.11 | 0.62 19.11 113.43 1.11 20.69 115.08 | (-0.96, 0.09, -0.25) | +0.373 / +0.712 | face 194 (cone) | failed: no pass reached this; nearest pass line 6932 (T11, frame 1) missed by 1.638 mm |
| R16 | proud | 2.91 | -9.22 -5.82 119.27 -8.94 -5.75 125.86 | (-0.26, -0.97, -0.0) | +0.121 / +0.147 | face 94 (cylinder r6) | failed: passes reach the area (line 77386, T6) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 2.52 | -1.5 -22.46 95.11 -1.5 -21.26 96.48 | (1.0, 0.0, 0.0) | +0.254 / +0.300 | face 164 (plane) | failed: passes reach the area (line 22506, T7) but leave +0.25 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 2.52 | 0.61 29.09 132.1 1.16 30.57 133.89 | (-0.99, -0.02, -0.11) | +0.374 / +0.767 | face 188 (cone) | failed: no pass reached this; nearest pass line 6932 (T11, frame 1) missed by 1.374 mm |
| R19 | proud | 2.33 | -9.17 -5.83 106.58 -8.93 -5.76 110.75 | (-0.26, -0.97, -0.0) | +0.123 / +0.140 | face 94 (cylinder r6) | failed: passes reach the area (line 77386, T6) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R20 | proud | 2.33 | -9.2 -5.82 113.06 -8.94 -5.75 117.86 | (-0.26, -0.96, -0.0) | +0.126 / +0.145 | face 94 (cylinder r6) | failed: passes reach the area (line 77386, T6) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R21 | proud | 2.14 | 0.61 19 124.13 1.07 21.03 125.93 | (-1.0, -0.01, -0.04) | +0.355 / +0.663 | face 196 (cone) | failed: no pass reached this; nearest pass line 6931 (T11, frame 1) missed by 1.253 mm |
| R22 | proud | 2.14 | 1.16 37.5 85.42 1.96 37.5 87.31 | (0.0, 1.0, 0.0) | +0.300 / +0.300 | face 213 (plane) | failed: passes reach the area (line 97096, T1) but leave +0.30 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 1.94 | 7.16 37.14 14.72 8.04 37.4 16.93 | (-0.53, 0.82, -0.22) | +0.182 / +0.344 | face 38 (torus); face 39 (cylinder r1) | failed: passes reach the area (line 97099, T1) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R24 | proud | 1.94 | 8.34 7.76 148.99 8.44 12.42 149 | (-0.12, -0.0, 0.99) | +0.142 / +0.198 | face 71 (cylinder r1) | failed: passes reach the area (line 83488, T7) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | proud | 1.75 | -1.5 21.22 23.46 -1.5 22.52 24.76 | (1.0, 0.0, 0.0) | +0.187 / +0.300 | face 164 (plane) | failed: passes reach the area (line 20104, T7) but leave +0.19 mm on average: stepover / scallop, the tool radius, or a stop short |
| R26 | gouge | 1.55 | -4.39 -37.5 140.27 -1.19 -37.48 140.69 | (0.0, -0.99, 0.1) | -0.127 / -0.146 | face 70 (cylinder r1); face 211 (plane) | failed (gouge): line 78502 (T7, frame 3) cut into the part here |
| R27 | proud | 1.55 | 7.43 -37.41 14.81 8.08 -36.97 16.63 | (-0.56, -0.81, -0.17) | +0.162 / +0.376 | face 37 (cylinder r1); face 35 (torus) | failed: passes reach the area (line 86891, T1) but leave +0.16 mm on average: stepover / scallop, the tool radius, or a stop short |
| R28 | gouge | 1.36 | -6.88 -37.5 140.33 -5.53 -37.39 140.96 | (-0.07, -0.96, 0.26) | -0.134 / -0.179 | face 70 (cylinder r1); face 90 (cylinder r1); face 58 (sphere r1) | failed (gouge): line 78871 (T7, frame 3) cut into the part here |
| R29 | proud | 1.36 | 8.22 -19.58 7.82 8.44 -17.83 9.01 | (-0.18, 0.46, -0.87) | +0.176 / +0.297 | face 32 (torus); face 34 (cylinder r1); face 36 (torus) | failed: passes reach the area (line 114811, T7) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R30 | proud | 1.36 | 8.35 10.27 9 8.47 13.46 9.01 | (-0.09, -0.0, -1.0) | +0.144 / +0.156 | face 34 (cylinder r1) | failed: passes reach the area (line 114811, T7) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |

Cycle time 92.9 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
