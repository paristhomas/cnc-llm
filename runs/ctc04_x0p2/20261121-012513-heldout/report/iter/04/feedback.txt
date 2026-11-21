# Simulation feedback - iteration 4: ctc04_x0p2 (3+2)

**Score: 98.836% of the whole part surface within +-0.1 mm.** Program valid: **NO** (1 errors, 0 warnings). Not scored: tab witness 0.15% and the 0.03 mm face-edge band 1.32% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 98.836 |
| whole_surface_gouge_pct | 0.0 |
| whole_surface_proud_pct | 1.164 |
| proud_area_mm2 | 469.84 |
| gouge_area_mm2 | 0.0 |
| max_gouge_mm | 0.0212 |
| max_proud_mm | 5.0 |
| tab_witness_pct | 0.146 |
| tabs | 2 |
| tab_total_mm2 | 23.92 |
| tab_max_width_mm | 2.6 |
| partoff_ok | True |
| setups | 5 |
| distinct_orientations | 3 |
| cycle_time_min | 142.76 |

## Errors (must be fixed)

- line 47780: material contact above the flute length (shank rubbing / tool too short); first at line 47780 (frame 1, T3, move ends at G54 (-2.56, -63.56, 64.96)), removed column up to 10.50 mm (material left by earlier setups counts too) x2 (lines 47780, 47943)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 13-109094 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T7, T8 | 176215 | 308.024 |
| 2 | 109101-109745 | (-0.9272, 0.3746, 0.0) | 90 / 158 | T2, T3, T4 | 25559 | 0.421 |
| 3 | 109752-142947 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4, T9 | 114829 | 91.436 |
| 4 | 142954-143309 | (-1.0, -0.0, 0.0) | 90 / -180 | T2 | 354 | 17.162 |
| 5 | 143313-143681 | (1.0, -0.0, 0.0) | 90 / -0 | T2, T3 | 354 | 5.367 |

## Rigidity / part-off (connection area in the stub gap; stock section 5203.6 mm2; part-off marker at line 142943)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 109094 | 5184.0 | 0.996 | [5184.0] | False |
| 2 | 109745 | 5184.0 | 0.996 | [5184.0] | False |
| 3 | 142947 | 5184.0 | 0.996 | [5184.0] | False |
| 4 | 143309 | 1174.5 | 0.226 | [1174.5] | True |
| 5 | 143681 | 35.75 | 0.007 | [17.88, 17.88] | True |

## Part-off: tabs and witness (OK)

Weakest plane Z-1.7: 2 tab(s), total 23.92 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 59.96 mm2 = 0.146% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 29.32 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 11.96 | 2.6 | 10.04 -62 -1.7 |
| 2 | 11.96 | 2.6 | 10.04 -10 -1.7 |

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 35.22 | 8.49 -77.97 14 11.56 -77.6 25.37 | (0.04, -1.0, -0.04) | +2.610 / +5.000 | face 499 (plane); face 484 (plane); face 511 (plane) | failed: passes reach the area (line 127444, T2) but leave +2.61 mm on average: stepover / scallop, the tool radius, or a stop short |
| R2 | proud | 33.26 | -9.54 41.5 42.1 -7.54 43.5 47.44 | (0.86, 0.51, -0.0) | +4.668 / +5.000 | face 159 (cylinder r1); face 160 (cylinder r1) | failed: no pass reached this; nearest pass line 61763 (T2, frame 1) missed by 0.099 mm; the harness's quick reach search found no tool for 83% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R3 | proud | 31.45 | -9.54 41.5 52.6 -7.54 43.5 57.95 | (-0.91, 0.42, 0.0) | +4.642 / +5.000 | face 164 (cylinder r1); face 163 (cylinder r1) | failed: no pass reached this; nearest pass line 95899 (T3, frame 1) missed by 0.175 mm; the harness's quick reach search found no tool for 86% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R4 | proud | 30.8 | -9.54 1.5 52.54 -7.54 3.5 57.95 | (-0.56, 0.83, -0.0) | +4.647 / +5.000 | face 157 (cylinder r1); face 158 (cylinder r1) | failed: passes reach the area (line 96755, T3) but leave +4.65 mm on average: stepover / scallop, the tool radius, or a stop short; the harness's quick reach search found no tool for 91% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R5 | proud | 29.0 | -9.54 1.5 42.05 -7.54 3.5 47.41 | (-1.0, -0.03, 0.0) | +4.609 / +5.000 | face 152 (cylinder r1); face 153 (cylinder r1) | failed: no pass reached this; nearest pass line 100022 (T3, frame 1) missed by 0.19 mm; the harness's quick reach search found no tool for 85% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R6 | proud | 26.38 | 7.11 -74.21 4.07 10.58 -71.79 6.49 | (-0.87, -0.49, 0.02) | +4.815 / +5.000 | face 247 (cylinder r1.21); face 246 (cylinder r1.21); face 0 (cone) | failed: no pass reached this; nearest pass line 127444 (T2, frame 3) missed by 4.316 mm |
| R7 | proud | 13.76 | -8.5 -11.66 54.59 -5.71 -10.34 55.91 | (-0.77, -0.5, -0.38) | +4.158 / +5.000 | face 128 (cylinder r0.6647); face 129 (cylinder r0.6647); face 98 (cone) | failed: passes reach the area (line 108102, T8) but leave +4.16 mm on average: stepover / scallop, the tool radius, or a stop short |
| R8 | proud | 13.76 | -8.52 28.34 44.09 -5.59 29.66 45.41 | (-0.53, 0.7, 0.48) | +4.007 / +5.000 | face 135 (cylinder r0.6647); face 134 (cylinder r0.6647); face 112 (cone) | failed: passes reach the area (line 107915, T8) but leave +4.01 mm on average: stepover / scallop, the tool radius, or a stop short |
| R9 | proud | 13.27 | -8.52 46.34 44.09 -5.63 47.66 45.41 | (-0.68, 0.51, -0.53) | +4.130 / +5.000 | face 131 (cylinder r0.6647); face 130 (cylinder r0.6647); face 110 (cone) | failed: passes reach the area (line 108041, T8) but leave +4.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R10 | proud | 12.45 | 8.77 2.7 0.44 11.34 6.44 2.56 | (0.0, 0.5, -0.87) | +0.191 / +0.201 | face 245 (plane); face 233 (cylinder r5) | failed: passes reach the area (line 143631, T3) but leave +0.19 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R11 | proud | 12.29 | -8.53 28.34 54.59 -5.66 29.66 55.91 | (-0.73, -0.3, 0.61) | +4.218 / +5.000 | face 137 (cylinder r0.6647); face 136 (cylinder r0.6647); face 94 (cone) | failed: passes reach the area (line 108283, T8) but leave +4.22 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 12.29 | -8.47 37.34 54.59 -5.58 38.66 55.91 | (-0.62, -0.7, -0.35) | +4.250 / +5.000 | face 138 (cylinder r0.6647); face 139 (cylinder r0.6647); face 114 (cone) | failed: passes reach the area (line 108345, T8) but leave +4.25 mm on average: stepover / scallop, the tool radius, or a stop short |
| R13 | proud | 11.8 | -8.44 -2.66 54.59 -5.75 -1.34 55.91 | (-0.42, -0.49, -0.77) | +4.261 / +5.000 | face 126 (cylinder r0.6647); face 127 (cylinder r0.6647); face 99 (cone) | failed: passes reach the area (line 108162, T8) but leave +4.26 mm on average: stepover / scallop, the tool radius, or a stop short |
| R14 | proud | 11.8 | -8.51 46.34 54.59 -5.59 47.66 55.91 | (-0.91, -0.24, -0.34) | +4.227 / +5.000 | face 141 (cylinder r0.6647); face 140 (cylinder r0.6647); face 92 (cone) | failed: passes reach the area (line 108407, T8) but leave +4.23 mm on average: stepover / scallop, the tool radius, or a stop short |
| R15 | proud | 11.47 | -8.51 6.34 44.09 -5.65 7.66 45.41 | (-0.44, 0.76, -0.48) | +4.237 / +5.000 | face 123 (cylinder r0.6647); face 122 (cylinder r0.6647); face 101 (cone) | failed: passes reach the area (line 107855, T8) but leave +4.24 mm on average: stepover / scallop, the tool radius, or a stop short |
| R16 | proud | 11.14 | -8.51 -11.66 44.09 -5.58 -10.34 45.41 | (-0.69, -0.41, 0.6) | +4.209 / +5.000 | face 118 (cylinder r0.6647); face 119 (cylinder r0.6647); face 103 (cone) | failed: passes reach the area (line 107731, T8) but leave +4.21 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 10.98 | -8.5 -2.66 44.09 -5.65 -1.34 45.41 | (-0.97, 0.12, 0.2) | +4.234 / +5.000 | face 121 (cylinder r0.6647); face 120 (cylinder r0.6647); face 105 (cone) | failed: passes reach the area (line 107797, T8) but leave +4.23 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 10.65 | -8.51 37.34 44.09 -5.61 38.66 45.41 | (-0.88, 0.35, -0.31) | +4.179 / +5.000 | face 133 (cylinder r0.6647); face 132 (cylinder r0.6647); face 96 (cone) | failed: passes reach the area (line 107977, T8) but leave +4.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R19 | proud | 10.16 | -8.49 6.34 54.59 -5.78 7.66 55.91 | (-0.51, -0.86, 0.06) | +4.286 / +5.000 | face 124 (cylinder r0.6647); face 125 (cylinder r0.6647); face 107 (cone) | failed: passes reach the area (line 108220, T8) but leave +4.29 mm on average: stepover / scallop, the tool radius, or a stop short |
| R20 | proud | 8.35 | 0.02 -23.39 65.8 4.3 -22.07 66.98 | (-0.18, 0.7, 0.7) | +0.191 / +0.283 | face 443 (cylinder r1); face 426 (sphere r1); face 456 (cone) | failed: no pass reached this; nearest pass line 105680 (T3, frame 1) missed by 0.058 mm |
| R21 | proud | 7.86 | -0.16 -23.4 79.56 4.3 -22.27 80.93 | (-0.32, 0.66, -0.68) | +0.180 / +0.262 | face 444 (cylinder r1); face 424 (sphere r1); face 446 (cone) | failed: passes reach the area (line 105483, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R22 | proud | 7.7 | -0.19 -23.43 18.99 4.31 -22.15 20.43 | (-0.26, 0.68, 0.68) | +0.182 / +0.225 | face 468 (cylinder r1); face 430 (sphere r1); face 471 (cone) | failed: passes reach the area (line 105281, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 7.54 | -0.19 -23.5 33.11 4.26 -22.49 34.2 | (-0.26, 0.7, -0.67) | +0.185 / +0.273 | face 467 (cylinder r1); face 432 (sphere r1); face 481 (cone) | failed: passes reach the area (line 105272, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R24 | proud | 7.04 | 9.96 58.25 58 12.98 59.54 59.51 | (0.28, -0.66, 0.7) | +0.182 / +0.242 | face 392 (cylinder r1); face 388 (sphere r1); face 389 (cylinder r1) | failed: passes reach the area (line 134930, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | proud | 6.06 | 8.76 -77.01 0.46 11.36 -75.1 2.01 | (0.0, -0.64, -0.76) | +0.236 / +0.381 | face 235 (cylinder r5) | failed: passes reach the area (line 143262, T2) but leave +0.24 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R26 | proud | 6.06 | 9.93 -60.46 58 12.91 -59.02 59.41 | (0.31, 0.76, 0.56) | +0.184 / +0.248 | face 391 (cylinder r1); face 384 (cylinder r1); face 390 (sphere r1) | failed: passes reach the area (line 137301, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R27 | proud | 5.41 | -0.1 1.98 75.88 3.98 2.58 76.61 | (-0.17, -0.71, -0.69) | +0.138 / +0.168 | face 435 (cylinder r1); face 407 (sphere r1); face 450 (cone) | failed: passes reach the area (line 105381, T3) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R28 | proud | 5.41 | 9.95 -60.46 14 12.96 -59.15 15.18 | (0.36, 0.63, 0.69) | +0.181 / +0.244 | face 380 (cylinder r1); face 376 (sphere r1); face 374 (cylinder r1) | failed: passes reach the area (line 133873, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R29 | proud | 5.41 | 9.93 -60.46 40.47 12.99 -59.24 42 | (0.33, 0.64, -0.7) | +0.203 / +0.280 | face 379 (cylinder r1); face 378 (sphere r1); face 372 (cylinder r1) | failed: passes reach the area (line 138347, T3) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R30 | proud | 5.41 | 9.93 58.5 41.05 12.99 59.54 41.99 | (0.22, -0.82, -0.53) | +0.198 / +0.256 | face 357 (cylinder r1); face 356 (sphere r1); face 372 (cylinder r1) | failed: passes reach the area (line 128357, T3) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |

Cycle time 142.8 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
