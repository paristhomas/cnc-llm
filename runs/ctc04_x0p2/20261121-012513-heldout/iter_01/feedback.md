# Simulation feedback - iteration 1: ctc04_x0p2 (3+2)

**Score: 89.572% of the whole part surface within +-0.1 mm.** Program valid: **NO** (8 errors, 1 warnings). Not scored: tab witness 0.00% and the 0.03 mm face-edge band 1.32% (metrology). Everything else counts, including the underside.

| metric | value |
|---|---|
| whole_surface_in_tol_pct | 89.572 |
| whole_surface_gouge_pct | 0.538 |
| whole_surface_proud_pct | 9.89 |
| proud_area_mm2 | 3997.39 |
| gouge_area_mm2 | 217.55 |
| max_gouge_mm | 5.0 |
| max_proud_mm | 5.0 |
| tab_witness_pct | 0.0 |
| tabs | 3 |
| tab_total_mm2 | 2190.31 |
| tab_max_width_mm | 32.2 |
| partoff_ok | False |
| setups | 5 |
| distinct_orientations | 3 |
| cycle_time_min | 113.24 |

## Errors (must be fixed)

- line 32188: material contact above the flute length (shank rubbing / tool too short); first at line 32188 (frame 1, T2, move ends at G54 (6.81, 14.74, 3.25)), removed column up to 23.00 mm (material left by earlier setups counts too) x7 (lines 32188, 53635, 53833, 60540, 60822, 80858, 80859)
- line 57421: tool holder collides with material (stick-out too short for this depth); first at line 57421 (frame 1, T3, move ends at G54 (6.13, 78.94, 16.05)), removed column up to 0.06 mm (material left by earlier setups counts too) x12757 (lines 57421, 57422, 57423, 57424, 57425, 57426, 57427, 57428, 57429, 57532, 57533, 57534)
- line 30314: tool holder (D32) of T2 hits the fixed vise jaw (-Y) (first at line 30314, frame 1; vise boxes are in setup.json; holder is a cylinder from the stick-out to 50 mm above it) x42 (lines 30314, 30315, 30647, 30648, 32159, 32160, 32457, 32458, 32755, 32756, 40767, 40768)
- line 30265: tool holder (D32) of T2 hits the moving vise jaw (+Y) (first at line 30265, frame 1; vise boxes are in setup.json; holder is a cylinder from the stick-out to 50 mm above it) x67 (lines 30265, 30267, 30268, 30598, 30600, 30601, 32110, 32112, 32113, 32162, 32163, 32164)
- line 106133: plunge with non-centre-cutting T9 x30 (lines 106133, 106139, 106145, 106151, 106157, 106163, 106169, 106175, 106181, 106187, 106193, 106199)
- line 107105: part-off: tabs total 2190.3 mm2 at the weakest plane Z-0.05 (max 30 mm2)
- line 107105: part-off: 42% of the stub section left (max 15%)
- line 107105: part-off: 1 tab(s) wider than 3 mm in their smallest direction (widest 32.20 mm): not removable by hand

## Warnings

- line 106955: feed per tooth < 0.2x recommended for T3 (rubbing); e.g. line 106955: F150 S24000 -> 0.0031 mm/tooth vs recommended 0.02 x4

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 13-95580 | (-1.0, -0.0, 0.0) | 90 / -180 | T1, T2, T3, T4, T7, T8 | 174793 | 307.826 |
| 2 | 95587-96307 | (-0.9272, 0.3746, 0.0) | 90 / 158 | T2, T3, T4 | 25653 | 0.275 |
| 3 | 96314-106315 | (1.0, -0.0, 0.0) | 90 / -0 | T1, T2, T3, T4, T9 | 69955 | 89.754 |
| 4 | 106322-106705 | (-1.0, -0.0, 0.0) | 90 / -180 | T2 | 382 | 13.286 |
| 5 | 106709-107105 | (1.0, -0.0, 0.0) | 90 / -0 | T2, T3 | 382 | 4.564 |

## Rigidity / part-off (connection area in the stub gap; stock section 5203.6 mm2; part-off marker at line 106311)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 95580 | 5184.0 | 0.996 | [5184.0] | False |
| 2 | 96307 | 5184.0 | 0.996 | [5184.0] | False |
| 3 | 106315 | 5184.0 | 0.996 | [5184.0] | False |
| 4 | 106705 | 2838.94 | 0.546 | [2838.94] | True |
| 5 | 107105 | 2188.44 | 0.421 | [2152.69, 17.88, 17.88] | True |

## Part-off: tabs and witness (FAILED)

Weakest plane Z-0.05: 3 tab(s), total 2190.31 mm2 (limits: 2-30 mm2, <= 4 tabs, each <= 3.0 mm wide; review target 2-4 tabs, 20-30 mm2). Tab witness 59.96 mm2 = 0.146% of the surface (limit 1.5 %, target 0.5 %); tab joint (proud material connected to the tabs) 29.32 mm2. Image: `partoff_closeup.png`.

| tab | area mm2 | width mm (smallest direction) | centre X Y Z |
|---|---|---|---|
| 1 | 2154.95 | 32.2 | -0.01 47.43 -0.05 |
| 2 | 17.68 | 2.6 | 10.04 -62 -0.05 |
| 3 | 17.68 | 2.6 | 10.04 -10 -0.05 |
- FAILED: tabs total 2190.3 mm2 at the weakest plane Z-0.05 (max 30 mm2)
- FAILED: 42% of the stub section left (max 15%)
- FAILED: 1 tab(s) wider than 3 mm in their smallest direction (widest 32.20 mm): not removable by hand

## Failed regions: out of tolerance (largest first; every face counts)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | why (diagnostic) |
|---|---|---|---|---|---|---|---|
| R1 | proud | 2349.03 | 7.09 -78 0.44 13.03 78 100 | (0.0, -0.0, 1.0) | +0.368 / +5.000 | face 482 (plane); face 237 (plane); face 242 (plane) | failed: no pass reached this; nearest pass line 107046 (T3, frame 5) missed by 0.1 mm |
| R2 | proud | 218.21 | -12.86 -62.5 63.04 -1.89 -35.57 74.97 | (-0.93, 0.37, 0.03) | +0.209 / +0.335 | face 400 (plane); face 402 (cylinder r6); face 404 (torus) | failed: passes reach the area (line 96301, T4) but leave +0.21 mm on average: stepover / scallop, the tool radius, or a stop short |
| R3 | proud | 216.41 | -12.94 -62.7 24.93 -1.45 -35.55 37.13 | (-0.93, 0.37, 0.03) | +0.207 / +0.345 | face 393 (plane); face 395 (cylinder r6); face 398 (cylinder r1) | failed: passes reach the area (line 62587, T2) but leave +0.21 mm on average: stepover / scallop, the tool radius, or a stop short |
| R4 | proud | 139.9 | -0.35 4.02 13.94 6.45 25.47 26.01 | (-0.01, 0.5, -0.87) | +0.108 / +0.172 | face 271 (plane); face 293 (cylinder r1); face 270 (cylinder r2.6) | failed: passes reach the area (line 77890, T2) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R5 | proud | 131.22 | 10.56 -56.5 14 13.03 -1.86 14.16 | (0.02, -0.0, 1.0) | +0.148 / +0.152 | face 373 (plane); face 374 (cylinder r1); face 368 (cylinder r1) | failed: passes reach the area (line 102066, T2) but leave +0.15 mm on average: stepover / scallop, the tool radius, or a stop short |
| R6 | proud | 91.74 | -10.91 24.38 52.6 -1.77 51.62 58 | (-0.02, 0.01, 1.0) | +1.657 / +5.000 | face 313 (plane); face 164 (cylinder r1); face 163 (cylinder r1) | failed: passes reach the area (line 66990, T2) but leave +1.66 mm on average: stepover / scallop, the tool radius, or a stop short |
| R7 | gouge | 90.59 | -13 -63.1 66.3 -1.49 -60.6 73.92 | (-0.03, -0.98, 0.2) | -0.379 / -5.000 | face 402 (cylinder r6); face 404 (torus); face 400 (plane) | failed (gouge): line 66709 (T2, frame 1) cut into the part here |
| R8 | proud | 86.66 | -10.91 -14.58 52.54 -1.78 11.62 58 | (-0.02, 0.03, 1.0) | +1.716 / +5.000 | face 331 (plane); face 157 (cylinder r1); face 158 (cylinder r1) | failed: passes reach the area (line 67018, T2) but leave +1.72 mm on average: stepover / scallop, the tool radius, or a stop short |
| R9 | proud | 58.16 | -0.37 14.09 75.3 6.15 22.76 80.33 | (-0.02, 0.5, 0.87) | +0.107 / +0.195 | face 279 (plane); face 285 (cylinder r1); face 259 (cylinder r1) | failed: passes reach the area (line 77720, T2) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R10 | gouge | 53.24 | -13.02 -63.09 29.37 -1.45 -62.16 33.95 | (-0.05, -0.99, 0.14) | -0.531 / -5.000 | face 395 (cylinder r6); face 397 (torus); face 393 (plane) | failed (gouge): line 66627 (T2, frame 1) cut into the part here |
| R11 | proud | 41.94 | 10.65 1.69 73.19 13.03 20.06 83.79 | (0.01, -0.5, -0.87) | +0.113 / +0.139 | face 347 (plane); face 350 (cylinder r1) | failed: passes reach the area (line 100978, T2) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R12 | proud | 33.26 | -9.54 41.5 42.1 -7.54 43.5 47.44 | (0.86, 0.51, -0.0) | +4.668 / +5.000 | face 159 (cylinder r1); face 160 (cylinder r1) | failed: no pass reached this; nearest pass line 65954 (T2, frame 1) missed by 0.1 mm; the harness's quick reach search found no tool for 83% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R13 | proud | 30.63 | -0.39 -1.88 84.95 6.31 5.98 89 | (-0.03, 0.44, 0.9) | +0.112 / +0.218 | face 279 (plane); face 277 (cylinder r2.6); face 285 (cylinder r1) | failed: passes reach the area (line 74693, T2) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R14 | proud | 29.0 | -9.54 1.5 42.05 -7.54 3.5 47.41 | (-1.0, -0.03, 0.0) | +4.609 / +5.000 | face 152 (cylinder r1); face 153 (cylinder r1) | failed: no pass reached this; nearest pass line 93840 (T7, frame 1) missed by 0.191 mm; the harness's quick reach search found no tool for 85% of it (smallest tools, 26 cube directions + feature axes): consider another direction, a longer / smaller library tool, or a different fixture orientation. It still counts |
| R15 | gouge | 23.59 | -12.32 -61.57 63.03 -1.35 -58.66 65.09 | (-0.04, -0.62, -0.78) | -0.225 / -5.000 | face 402 (cylinder r6); face 404 (torus); face 400 (plane) | failed (gouge): line 66227 (T2, frame 1) cut into the part here |
| R16 | proud | 22.12 | 10.98 -56.25 58 13.01 -21.38 58 | (0.0, 0.0, 1.0) | +0.100 / +0.100 | face 382 (plane) | failed: passes reach the area (line 101968, T2) but leave +0.10 mm on average: stepover / scallop, the tool radius, or a stop short |
| R17 | proud | 20.64 | -0.43 -40.43 88.87 0.03 -3.19 89 | (-0.27, 0.0, 0.96) | +0.149 / +0.226 | face 283 (cylinder r1) | failed: passes reach the area (line 74602, T2) but leave +0.15 mm on average: stepover / scallop, the tool radius, or a stop short |
| R18 | proud | 19.82 | 10.38 12.18 22.26 13.01 23.81 27.15 | (0.04, -0.47, 0.88) | +0.112 / +0.177 | face 358 (plane); face 366 (cylinder r1); face 364 (cylinder r1) | failed: passes reach the area (line 101772, T2) but leave +0.11 mm on average: stepover / scallop, the tool radius, or a stop short |
| R19 | proud | 17.2 | -0.43 31.35 73.87 0.03 63.83 74 | (-0.27, -0.0, 0.96) | +0.147 / +0.227 | face 287 (cylinder r1) | failed: passes reach the area (line 74551, T2) but leave +0.15 mm on average: stepover / scallop, the tool radius, or a stop short |
| R20 | gouge | 16.55 | -0.94 -67.06 85.98 6.43 -65.09 88.55 | (-0.15, -0.87, 0.46) | -0.221 / -0.384 | face 275 (cylinder r2.6); face 282 (torus); face 256 (torus) | failed (gouge): line 78011 (T2, frame 1) cut into the part here |
| R21 | proud | 16.22 | 0.11 0.15 69.37 4.29 2.6 71.92 | (-0.08, -0.66, 0.74) | +0.201 / +0.332 | face 436 (plane); face 438 (cylinder r1); face 437 (plane) | failed: passes reach the area (line 92692, T3) but leave +0.20 mm on average: stepover / scallop, the tool radius, or a stop short |
| R22 | proud | 15.89 | -0.33 24.18 73.92 6.28 29.68 74.5 | (-0.03, 0.22, 0.97) | +0.117 / +0.192 | face 280 (cylinder r2.6); face 278 (plane); face 279 (plane) | failed: passes reach the area (line 77947, T2) but leave +0.12 mm on average: stepover / scallop, the tool radius, or a stop short |
| R23 | proud | 15.56 | 8.82 -13.12 0 11.31 -6.83 0 | (0.0, 0.0, -1.0) | +3.632 / +5.000 | face 234 (plane) | failed: passes reach the area (line 106786, T2) but leave +3.63 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R24 | proud | 14.09 | -0.07 0.3 22.82 4.31 2.6 25.3 | (-0.09, -0.76, 0.65) | +0.186 / +0.332 | face 460 (plane); face 461 (plane); face 463 (cylinder r1) | failed: passes reach the area (line 92005, T3) but leave +0.19 mm on average: stepover / scallop, the tool radius, or a stop short |
| R25 | gouge | 13.92 | -0.71 -66.96 11.1 6.48 -65.12 13.08 | (-0.04, -0.72, -0.7) | -0.140 / -0.192 | face 274 (cylinder r2.6); face 254 (torus); face 296 (torus) | failed (gouge): line 78267 (T2, frame 1) cut into the part here |
| R26 | proud | 13.76 | -8.5 -11.66 54.59 -5.71 -10.34 55.91 | (-0.77, -0.5, -0.38) | +4.189 / +5.000 | face 128 (cylinder r0.6647); face 129 (cylinder r0.6647); face 98 (cone) | failed: passes reach the area (line 94397, T8) but leave +4.19 mm on average: stepover / scallop, the tool radius, or a stop short |
| R27 | proud | 13.76 | -8.52 28.34 44.09 -5.59 29.66 45.41 | (-0.53, 0.7, 0.48) | +4.008 / +5.000 | face 135 (cylinder r0.6647); face 134 (cylinder r0.6647); face 112 (cone) | failed: passes reach the area (line 94215, T8) but leave +4.01 mm on average: stepover / scallop, the tool radius, or a stop short |
| R28 | proud | 13.76 | 0.11 -6.68 20.46 3.7 -1.53 22.2 | (-0.02, -0.32, 0.95) | +0.148 / +0.178 | face 460 (plane); face 419 (cylinder r1) | failed: passes reach the area (line 76380, T2) but leave +0.15 mm on average: stepover / scallop, the tool radius, or a stop short |
| R29 | proud | 13.76 | 8.82 -65.13 0 11.36 -58.8 0 | (0.0, 0.0, -1.0) | +4.185 / +5.000 | face 234 (plane) | failed: passes reach the area (line 106786, T2) but leave +4.18 mm on average: stepover / scallop, the tool radius, or a stop short; underside: finish it before the tabs, from the side (flank of a horizontal tool tangent to the face) or with a tilted setup |
| R30 | proud | 13.27 | -8.52 46.34 44.09 -5.63 47.66 45.41 | (-0.68, 0.51, -0.53) | +4.130 / +5.000 | face 131 (cylinder r0.6647); face 130 (cylinder r0.6647); face 110 (cone) | failed: passes reach the area (line 94336, T8) but leave +4.13 mm on average: stepover / scallop, the tool radius, or a stop short |

Cycle time 113.2 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (6 views: green = in tolerance, orange/red = proud, blue = gouge, purple = tab witness), `partoff_closeup.png`.
