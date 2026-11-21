# Simulation feedback - iteration 3: ctc04_x0p2 (3+2)

**Score: 94.203% of the whole part surface within +-0.1 mm.** Program valid: **NO** (3 errors, 0 warnings). Not scored: tab witness 0.15% and the 0.03 mm face-edge band 1.32% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 94.203 |
| whole_surface_gouge_pct | 0.0 |
| whole_surface_proud_pct | 5.797 |
| proud_area_mm2 | 2339.69 |
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
| cycle_time_min | 145.51 |

## Errors (must be fixed)

- line 119512: rapid (G0) move removes material - crash; first at line 119512 (frame 1, T4, move ends at G54 (6.56, -74.65, 13.00)), removed column up to 2.55 mm (material left by earlier setups counts too) x1 (lines 119512)
- line 47425: material contact above the flute length (shank rubbing / tool too short); first at line 47425 (frame 1, T3, move ends at G54 (-2.56, -63.56, 26.96)), removed column up to 10.50 mm (material left by earlier setups counts too) x2 (lines 47425, 47521)
- line 119514: cut cross-section > 0.75 D^2 for T4 (overloaded: too deep and too wide); worst 4.52 mm2 > limit 1.69 mm2 at line 119514 (move to 73.39, 13.22, -23.09, removed column up to 3.02 mm deep) x64 (lines 119514)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 13-120027 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T7, T8 | 187185 | 303.761 |
| 2 | 120034-120678 | (-0.9272, 0.3746, 0.0) | 90 / 158 | T2, T3, T4 | 25559 | 0.421 |
| 3 | 120685-153528 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4, T9 | 114481 | 91.368 |
| 4 | 153535-153890 | (-1.0, -0.0, 0.0) | 90 / -180 | T2 | 354 | 17.452 |
| 5 | 153894-154262 | (1.0, -0.0, 0.0) | 90 / -0 | T2, T3 | 354 | 5.395 |

## Rigidity / part-off (connection area in the stub gap; stock section 5203.6 mm2; part-off marker at line 153524)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 120027 | 5184.0 | 0.996 | [5184.0] | False |
| 2 | 120678 | 5184.0 | 0.996 | [5184.0] | False |
| 3 | 153528 | 5184.0 | 0.996 | [5184.0] | False |
| 4 | 153890 | 1174.5 | 0.226 | [1174.5] | True |
| 5 | 154262 | 35.75 | 0.007 | [17.88, 17.88] | True |

## Part-off: tabs and witness (OK)

Weakest plane Z-1.7: 2 tab(s), total 23.92 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 59.96 mm2 = 0.146% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 29.32 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 11.96 | 2.6 | 10.04 -62 -1.7 |
| 2 | 11.96 | 2.6 | 10.04 -10 -1.7 |

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 1914.74 | -0.94 -77.95 0.03 11.36 25.46 19.22 | (-0.89, 0.02, -0.46) | +2.616 / +5.000 | face 249 (plane); face 273 (plane); face 469 (plane) | failed: no pass reached this; nearest pass line 74803 (T2, frame 1) missed by 0.069 mm |
| R2 | proud | 35.22 | 8.49 -77.97 14 11.56 -77.6 25.37 | (0.04, -1.0, -0.04) | +2.610 / +5.000 | face 499 (plane); face 484 (plane); face 511 (plane) | failed: passes reach the area (line 138062, T2) but leave +2.61 mm on average: stepover / scallop, the tool radius, or a stop short |
| R3 | proud | 33.26 | -9.54 41.5 42.1 -7.54 43.5 47.44 | (0.86, 0.51, -0.0) | +4.668 / +5.000 | face 159 (cylinder r1); face 160 (cylinder r1) | failed: no pass reached this; nearest pass line 61736 (T2, frame 1) missed by 0.099 mm; the harness's quick reach search found no tool for 83% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R4 | proud | 31.45 | -9.54 41.5 52.6 -7.54 43.5 57.95 | (-0.91, 0.42, 0.0) | +4.642 / +5.000 | face 164 (cylinder r1); face 163 (cylinder r1) | failed: no pass reached this; nearest pass line 102088 (T3, frame 1) missed by 0.175 mm; the harness's quick reach search found no tool for 86% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R5 | proud | 30.8 | -9.54 1.5 52.54 -7.54 3.5 57.95 | (-0.56, 0.83, -0.0) | +4.647 / +5.000 | face 157 (cylinder r1); face 158 (cylinder r1) | failed: passes reach the area (line 97419, T3) but leave +4.65 mm on average: stepover / scallop, the tool radius, or a stop short; the harness's quick reach search found no tool for 91% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R6 | proud | 29.0 | -9.54 1.5 42.05 -7.54 3.5 47.41 | (-1.0, -0.03, 0.0) | +4.609 / +5.000 | face 152 (cylinder r1); face 153 (cylinder r1) | failed: no pass reached this; nearest pass line 102442 (T3, frame 1) missed by 0.19 mm; the harness's quick reach search found no tool for 85% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R7 | proud | 13.76 | -8.5 -11.66 54.59 -5.71 -10.34 55.91 | (-0.77, -0.5, -0.38) | +4.158 / +5.000 | face 128 (cylinder r0.6647); face 129 (cylinder r0.6647); face 98 (cone) | failed: passes reach the area (line 119035, T8) but leave +4.16 mm on average: stepover / scallop, the tool radius, or a stop short |
| R8 | proud | 13.76 | -8.52 28.34 44.09 -5.59 29.66 45.41 | (-0.53, 0.7, 0.48) | +4.007 / +5.000 | face 135 (cylinder r0.6647); face 134 (cylinder r0.6647); face 112 (cone) | failed: passes reach the area (line 118851, T8) but leave +4.01 mm on average: stepover / scallop, the tool radius, or a stop short |
| R9 | proud | 13.27 | -8.52 46.34 44.09 -5.63 47.66 45.41 | (-0.68, 0.51, -0.53) | +4.130 / +5.000 | face 131 (cylinder r0.6647); face 130 (cylinder r0.6647); face 110 (cone) | failed: passes reach the area (line 118972, T8) but leave +4.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R10 | proud | 12.29 | -8.53 28.34 54.59 -5.66 29.66 55.91 | (-0.73, -0.3, 0.61) | +4.218 / +5.000 | face 137 (cylinder r0.6647); face 136 (cylinder r0.6647); face 94 (cone) | failed: passes reach the area (line 119214, T8) but leave +4.22 mm on average: stepover / scallop, the tool radius, or a stop short |
| R11 | proud | 12.29 | -8.47 37.34 54.59 -5.58 38.66 55.91 | (-0.62, -0.7, -0.35) | +4.250 / +5.000 | face 138 (cylinder r0.6647); face 139 (cylinder r0.6647); face 114 (cone) | failed: passes reach the area (line 119278, T8) but leave +4.25 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 11.8 | -8.44 -2.66 54.59 -5.75 -1.34 55.91 | (-0.42, -0.49, -0.77) | +4.261 / +5.000 | face 126 (cylinder r0.6647); face 127 (cylinder r0.6647); face 99 (cone) | failed: passes reach the area (line 119097, T8) but leave +4.26 mm on average: stepover / scallop, the tool radius, or a stop short |
| R13 | proud | 11.8 | -8.51 46.34 54.59 -5.59 47.66 55.91 | (-0.91, -0.24, -0.34) | +4.227 / +5.000 | face 141 (cylinder r0.6647); face 140 (cylinder r0.6647); face 92 (cone) | failed: passes reach the area (line 119340, T8) but leave +4.23 mm on average: stepover / scallop, the tool radius, or a stop short |
| R14 | proud | 11.47 | -8.51 6.34 44.09 -5.65 7.66 45.41 | (-0.44, 0.76, -0.48) | +4.237 / +5.000 | face 123 (cylinder r0.6647); face 122 (cylinder r0.6647); face 101 (cone) | failed: passes reach the area (line 118789, T8) but leave +4.24 mm on average: stepover / scallop, the tool radius, or a stop short |
| R15 | proud | 11.14 | -8.51 -11.66 44.09 -5.58 -10.34 45.41 | (-0.69, -0.41, 0.6) | +4.209 / +5.000 | face 118 (cylinder r0.6647); face 119 (cylinder r0.6647); face 103 (cone) | failed: passes reach the area (line 118665, T8) but leave +4.21 mm on average: stepover / scallop, the tool radius, or a stop short |
| R16 | proud | 10.98 | -8.5 -2.66 44.09 -5.65 -1.34 45.41 | (-0.97, 0.12, 0.2) | +4.234 / +5.000 | face 121 (cylinder r0.6647); face 120 (cylinder r0.6647); face 105 (cone) | failed: passes reach the area (line 118730, T8) but leave +4.23 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 10.65 | -8.51 37.34 44.09 -5.61 38.66 45.41 | (-0.88, 0.35, -0.31) | +4.179 / +5.000 | face 133 (cylinder r0.6647); face 132 (cylinder r0.6647); face 96 (cone) | failed: passes reach the area (line 118909, T8) but leave +4.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 10.16 | -8.49 6.34 54.59 -5.78 7.66 55.91 | (-0.51, -0.86, 0.06) | +4.286 / +5.000 | face 124 (cylinder r0.6647); face 125 (cylinder r0.6647); face 107 (cone) | failed: passes reach the area (line 119153, T8) but leave +4.29 mm on average: stepover / scallop, the tool radius, or a stop short |
| R19 | proud | 8.35 | 0.02 -23.39 65.8 4.3 -22.07 66.98 | (-0.18, 0.7, 0.7) | +0.191 / +0.283 | face 443 (cylinder r1); face 426 (sphere r1); face 456 (cone) | failed: no pass reached this; nearest pass line 108688 (T3, frame 1) missed by 0.058 mm |
| R20 | proud | 7.86 | -0.16 -23.4 79.56 4.3 -22.27 80.93 | (-0.32, 0.66, -0.68) | +0.180 / +0.262 | face 444 (cylinder r1); face 424 (sphere r1); face 446 (cone) | failed: passes reach the area (line 108327, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R21 | proud | 7.7 | -0.19 -23.43 18.99 4.31 -22.15 20.43 | (-0.26, 0.68, 0.68) | +0.182 / +0.225 | face 468 (cylinder r1); face 430 (sphere r1); face 471 (cone) | failed: passes reach the area (line 107874, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R22 | proud | 7.54 | -0.19 -23.5 33.11 4.26 -22.49 34.2 | (-0.26, 0.7, -0.67) | +0.185 / +0.273 | face 467 (cylinder r1); face 432 (sphere r1); face 481 (cone) | failed: passes reach the area (line 107883, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 7.04 | 9.96 58.25 58 12.98 59.54 59.51 | (0.28, -0.66, 0.7) | +0.182 / +0.242 | face 392 (cylinder r1); face 388 (sphere r1); face 389 (cylinder r1) | failed: passes reach the area (line 145547, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R24 | proud | 6.06 | 9.93 -60.46 58 12.91 -59.02 59.41 | (0.31, 0.76, 0.56) | +0.184 / +0.248 | face 391 (cylinder r1); face 384 (cylinder r1); face 390 (sphere r1) | failed: passes reach the area (line 147920, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | proud | 5.41 | -0.1 1.98 75.88 3.98 2.58 76.61 | (-0.17, -0.71, -0.69) | +0.138 / +0.168 | face 435 (cylinder r1); face 407 (sphere r1); face 450 (cone) | failed: passes reach the area (line 107988, T3) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R26 | proud | 5.41 | 9.95 -60.46 14 12.96 -59.15 15.18 | (0.36, 0.63, 0.69) | +0.181 / +0.244 | face 380 (cylinder r1); face 376 (sphere r1); face 374 (cylinder r1) | failed: passes reach the area (line 144492, T3) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short |
| R27 | proud | 5.41 | 9.93 -60.46 40.47 12.99 -59.24 42 | (0.33, 0.64, -0.7) | +0.203 / +0.280 | face 379 (cylinder r1); face 378 (sphere r1); face 372 (cylinder r1) | failed: passes reach the area (line 148964, T3) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R28 | proud | 5.41 | 9.93 58.5 41.05 12.99 59.54 41.99 | (0.22, -0.82, -0.53) | +0.198 / +0.256 | face 357 (cylinder r1); face 356 (sphere r1); face 372 (cylinder r1) | failed: passes reach the area (line 138975, T3) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R29 | proud | 5.08 | 9.93 58.43 27.02 13 59.54 28.38 | (0.26, -0.76, 0.59) | +0.216 / +0.269 | face 369 (cylinder r1); face 363 (sphere r1); face 362 (cylinder r1) | failed: passes reach the area (line 149635, T3) but leave +0.22 mm on average: stepover / scallop, the tool radius, or a stop short |
| R30 | proud | 4.91 | 9.9 58.46 71.76 13.03 59.49 73 | (0.33, -0.69, -0.64) | +0.186 / +0.257 | face 354 (cylinder r1); face 353 (sphere r1); face 386 (cylinder r1) | failed: passes reach the area (line 143206, T3) but leave +0.19 mm on average: stepover / scallop, the tool radius, or a stop short |

Cycle time 145.5 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
