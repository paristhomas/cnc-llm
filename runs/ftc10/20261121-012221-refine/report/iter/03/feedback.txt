# Simulation feedback - iteration 3: ftc10 (3+2)

**Score: 99.703% of the whole part surface within +-0.1 mm.** Program valid: **NO** (1 errors, 1 warnings). Not scored: tab witness 0.23% and the 0.03 mm face-edge band 0.85% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 99.703 |
| whole_surface_gouge_pct | 0.001 |
| whole_surface_proud_pct | 0.296 |
| proud_area_mm2 | 142.17 |
| gouge_area_mm2 | 0.58 |
| max_gouge_mm | 0.1152 |
| max_proud_mm | 1.7796 |
| tab_witness_pct | 0.227 |
| tabs | 2 |
| tab_total_mm2 | 22.88 |
| tab_max_width_mm | 2.6 |
| partoff_ok | True |
| setups | 8 |
| distinct_orientations | 5 |
| cycle_time_min | 104.4 |

## Errors (must be fixed)

- line 71234: material contact above the flute length (shank rubbing / tool too short); first at line 71234 (frame 3, T13, move ends at G54 (-7.50, 6.95, 101.94)), removed column up to 3.52 mm (material left by earlier setups counts too) x5 (lines 71234, 71235, 71494, 71495, 71498)

## Warnings

- line 89986: deep plunge (> 0.5 D) at > 50% of the recommended feed for T14; ramp or helix instead x4

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 12-6938 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T5, T10, T11 | 20673 | 48.41 |
| 2 | 6945-27101 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4, T7, T13 | 40594 | 102.591 |
| 3 | 27108-94658 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T5, T6, T7, T13, T14 | 113493 | 79.168 |
| 4 | 94665-103976 | (0.0, -1.0, 0.0) | 90 / -90 | T1, T2, T3, T7, T10, T12 | 24410 | 14.418 |
| 5 | 103983-110765 | (0.0, 1.0, 0.0) | 90 / 90 | T1, T2, T7, T10, T12 | 21883 | 13.994 |
| 6 | 110771-110923 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T3 | 5714 | 4.563 |
| 7 | 110929-122554 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T5, T7, T14 | 13285 | 58.418 |
| 8 | 122560-136045 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4 | 13471 | 11.353 |

## Rigidity / part-off (connection area in the stub gap; stock section 2997.0 mm2; part-off marker at line 110761)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 6938 | 2997.0 | 1.000 | [2997.0] | False |
| 2 | 27101 | 2997.0 | 1.000 | [2997.0] | False |
| 3 | 94658 | 2997.0 | 1.000 | [2997.0] | False |
| 4 | 103976 | 2997.0 | 1.000 | [2997.0] | False |
| 5 | 110765 | 2997.0 | 1.000 | [2997.0] | False |
| 6 | 110923 | 2997.0 | 1.000 | [2997.0] | True |
| 7 | 122554 | 627.75 | 0.209 | [627.75] | True |
| 8 | 136045 | 22.5 | 0.007 | [11.25, 11.25] | True |

## Part-off: tabs and witness (OK)

Weakest plane Z-5.7: 2 tab(s), total 22.88 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 109.93 mm2 = 0.227% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 53.41 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 11.44 | 2.6 | 12 -28.5 -5.7 |
| 2 | 11.44 | 2.6 | 12 28.5 -5.7 |

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 34.18 | -13.62 -7.59 98.17 -9.02 8.12 104.85 | (-0.78, -0.03, 0.62) | +0.286 / +0.673 | face 183 (bspline); face 94 (cylinder r6); face 105 (cylinder r8) | failed: passes reach the area (line 85006, T6) but leave +0.29 mm on average: stepover / scallop, the tool radius, or a stop short |
| R2 | proud | 26.03 | -1.81 22.43 104.99 2.99 27.47 106.41 | (-0.0, -0.03, 1.0) | +0.729 / +1.762 | face 174 (cone) | failed: passes reach the area (line 6932, T11) but leave +0.73 mm on average: stepover / scallop, the tool radius, or a stop short |
| R3 | proud | 23.5 | -5.04 -26.08 112.47 0.04 -20.92 113.91 | (0.01, -0.06, 1.0) | +0.693 / +1.780 | face 176 (cone) | failed: no pass reached this; nearest pass line 44494 (T1, frame 3) missed by 12.541 mm |
| R4 | proud | 4.86 | 0.59 18.92 135.11 0.95 20.91 137.1 | (-1.0, -0.02, -0.07) | +0.287 / +0.531 | face 198 (cone) | failed: passes reach the area (line 70650, T4) but leave +0.29 mm on average: stepover / scallop, the tool radius, or a stop short |
| R5 | proud | 4.47 | 0.66 29.32 110.05 1.13 30.92 111.87 | (-1.0, 0.04, 0.06) | +0.449 / +0.730 | face 192 (cone) | failed: no pass reached this; nearest pass line 6931 (T11, frame 1) missed by 1.627 mm |
| R6 | proud | 4.47 | 0.59 29.01 120.98 1.07 30.8 122.82 | (-0.99, 0.05, 0.13) | +0.331 / +0.662 | face 190 (cone) | failed: passes reach the area (line 70302, T4) but leave +0.33 mm on average: stepover / scallop, the tool radius, or a stop short |
| R7 | proud | 3.11 | 0.62 19.11 113.43 1.11 20.69 115.08 | (-0.96, 0.09, -0.25) | +0.373 / +0.712 | face 194 (cone) | failed: no pass reached this; nearest pass line 6932 (T11, frame 1) missed by 1.638 mm |
| R8 | proud | 2.52 | 0.61 29.09 132.1 1.16 30.57 133.89 | (-0.99, -0.02, -0.11) | +0.374 / +0.767 | face 188 (cone) | failed: no pass reached this; nearest pass line 6932 (T11, frame 1) missed by 1.374 mm |
| R9 | proud | 2.14 | 0.61 19 124.13 1.07 21.03 125.93 | (-1.0, -0.01, -0.04) | +0.355 / +0.663 | face 196 (cone) | failed: no pass reached this; nearest pass line 6931 (T11, frame 1) missed by 1.253 mm |
| R10 | proud | 2.14 | 8.16 -19.81 6.71 8.45 -14.61 9 | (-0.19, 0.51, -0.84) | +0.166 / +0.293 | face 32 (torus); face 34 (cylinder r1); face 36 (torus) | failed: passes reach the area (line 120999, T14) but leave +0.17 mm on average: stepover / scallop, the tool radius, or a stop short |
| R11 | proud | 1.75 | 8.34 17.82 5.64 8.47 20.15 9 | (-0.09, -0.72, -0.69) | +0.204 / +0.292 | face 40 (torus); face 33 (torus); face 34 (cylinder r1) | failed: passes reach the area (line 121002, T14) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 1.36 | -9.27 -23.64 100.8 -9.17 -19.9 100.82 | (-0.22, 0.0, 0.98) | +0.105 / +0.111 | face 105 (cylinder r8) | failed: passes reach the area (line 82019, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R13 | proud | 1.17 | -5 -22.18 125.4 -4.78 -21.77 127.65 | (-0.0, -0.99, 0.13) | +0.215 / +0.320 | face 178 (cylinder r1.75) | failed: passes reach the area (line 70082, T3) but leave +0.21 mm on average: stepover / scallop, the tool radius, or a stop short |
| R14 | proud | 1.17 | -1.95 26.57 122.8 -1.75 26.75 124.28 | (-0.0, -1.0, 0.1) | +0.254 / +0.497 | face 200 (cylinder r1.75) | failed: passes reach the area (line 69961, T3) but leave +0.25 mm on average: stepover / scallop, the tool radius, or a stop short |
| R15 | proud | 1.17 | 8.36 -36.59 2.29 8.46 -34.49 5.08 | (-0.08, -0.84, -0.54) | +0.133 / +0.155 | face 36 (torus) | failed: passes reach the area (line 119532, T14) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |
| R16 | proud | 0.97 | 8.15 18.27 148.95 8.39 19.5 149.53 | (-0.29, -0.42, 0.86) | +0.143 / +0.173 | face 61 (torus); face 71 (cylinder r1) | failed: passes reach the area (line 91364, T14) but leave +0.14 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 0.97 | 15.35 -30.78 0.11 15.45 -29.87 0.29 | (0.0, -0.19, -0.98) | +0.178 / +0.304 | face 109 (cylinder r9) | failed: passes reach the area (line 110843, T1) but leave +0.18 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R18 | proud | 0.78 | -9.13 -13.89 19.16 -9.08 -11.78 19.17 | (-0.2, 0.0, -0.98) | +0.103 / +0.106 | face 99 (cylinder r8) | failed: passes reach the area (line 116921, T7) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R19 | proud | 0.78 | -9.11 5.78 113.86 -9.05 5.79 116.57 | (-0.26, 0.96, -0.0) | +0.104 / +0.109 | face 94 (cylinder r6) | failed: passes reach the area (line 82998, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R20 | proud | 0.78 | -4.93 -25.23 125.93 -4.73 -25.15 127.01 | (-0.0, 1.0, 0.03) | +0.248 / +0.393 | face 178 (cylinder r1.75) | failed: passes reach the area (line 6813, T11) but leave +0.25 mm on average: stepover / scallop, the tool radius, or a stop short |
| R21 | proud | 0.78 | 8.41 -3.2 149 8.46 -0.94 149 | (-0.06, -0.0, 1.0) | +0.122 / +0.138 | face 71 (cylinder r1) | failed: passes reach the area (line 15494, T1) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R22 | proud | 0.58 | -9.23 -27.56 100.81 -9.19 -26.97 100.82 | (-0.22, 0.0, 0.98) | +0.109 / +0.112 | face 105 (cylinder r8) | failed: passes reach the area (line 82019, T6) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 0.58 | -9.1 -5.8 123.35 -9.05 -5.78 125.86 | (-0.26, -0.96, -0.0) | +0.104 / +0.105 | face 94 (cylinder r6) | failed: passes reach the area (line 85391, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R24 | proud | 0.58 | -9.1 5.78 121.49 -9.05 5.8 122.92 | (-0.26, 0.97, -0.0) | +0.105 / +0.107 | face 94 (cylinder r6) | failed: passes reach the area (line 82998, T6) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | proud | 0.58 | -9.26 23.15 100.8 -9.18 23.36 100.82 | (-0.22, -0.0, 0.98) | +0.106 / +0.108 | face 105 (cylinder r8) | failed: passes reach the area (line 81956, T6) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R26 | proud | 0.58 | -1.96 23.27 112.25 -1.76 23.48 113.37 | (-0.0, 0.98, -0.22) | +0.242 / +0.333 | face 201 (cylinder r1.75) | failed: passes reach the area (line 69923, T3) but leave +0.24 mm on average: stepover / scallop, the tool radius, or a stop short |
| R27 | proud | 0.58 | -1.98 23.25 123.4 -1.85 23.74 124.71 | (-0.0, 0.93, -0.37) | +0.203 / +0.326 | face 200 (cylinder r1.75) | failed: passes reach the area (line 69961, T3) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R28 | proud | 0.58 | 8.04 -19.29 148.94 8.26 -18.62 149.17 | (-0.38, 0.27, 0.89) | +0.124 / +0.152 | face 59 (torus) | failed: passes reach the area (line 91304, T14) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R29 | proud | 0.58 | 8.32 32.19 0.79 8.45 34.37 2.2 | (-0.12, 0.51, -0.85) | +0.117 / +0.141 | face 40 (torus) | failed: passes reach the area (line 118214, T14) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R30 | proud | 0.58 | 8.39 -21.46 153.75 8.46 -20.86 154.6 | (-0.08, 0.81, 0.59) | +0.126 / +0.142 | face 64 (torus) | failed: passes reach the area (line 15444, T1) but leave +0.13 mm on average: stepover / scallop, the tool radius, or a stop short |

Cycle time 104.4 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
