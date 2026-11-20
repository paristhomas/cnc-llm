# Simulation feedback - iteration 2: ftc08 (3+2)

**Score: 99.681% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 98.233%). Program valid: **NO** (2 errors, 0 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.681 |
| machinable_gouge_pct | 0.14 |
| machinable_proud_pct | 0.18 |
| max_gouge_mm | 2.4671 |
| unreachable_area_pct | 1.467 |
| parting_face_pct | 18.962 |
| setups | 27 |
| distinct_orientations | 9 |
| final_connection_mm2 | 1894.75 |
| cycle_time_min | 39.01 |

## Errors (must be fixed)

- line 39666: material contact above the flute length (shank rubbing / tool too short); first at line 39666 (frame 17, T8), removed column up to 8.57 mm x23 (lines 39666, 39667, 39668, 39679, 39680, 39713, 39714, 39726, 39727, 39728, 39759, 39760)
- line 73440: tool or holder hits the vise / table (check the tool axis, stick-out and the stub gap) x26 (lines 73440, 73441, 73442, 73443, 73444, 73445, 73446, 73447, 73448, 73449, 73450, 73451)

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 11-38796 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T2, T3, T4, T5 | 57759 | 344.006 |
| 2 | 38804-38857 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 54 | 33.84 |
| 3 | 38866-38919 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 54 | 34.871 |
| 4 | 38928-38991 | (0.0, -1.0, 0.0) | 90 / -90 | T1 | 64 | 22.998 |
| 5 | 39000-39063 | (0.0, 1.0, 0.0) | 90 / 90 | T1 | 64 | 23.341 |
| 6 | 39072-39135 | (-0.7071, -0.7071, 0.0) | 90 / -135 | T1 | 64 | 1.903 |
| 7 | 39144-39207 | (-0.7071, 0.7071, 0.0) | 90 / 135 | T1 | 64 | 1.888 |
| 8 | 39216-39279 | (0.7071, -0.7071, 0.0) | 90 / -45 | T1 | 64 | 1.875 |
| 9 | 39288-39351 | (0.7071, 0.7071, 0.0) | 90 / 45 | T1 | 64 | 1.858 |
| 10 | 39365-39399 | (-1.0, -0.0, 0.0) | 90 / -180 | T5 | 35 | 2.895 |
| 11 | 39408-39442 | (1.0, -0.0, 0.0) | 90 / -0 | T5 | 35 | 2.891 |
| 12 | 39451-39485 | (0.0, -1.0, 0.0) | 90 / -90 | T5 | 35 | 1.997 |
| 13 | 39494-39528 | (0.0, 1.0, 0.0) | 90 / 90 | T5 | 35 | 1.863 |
| 14 | 39537-39554 | (-0.7071, -0.7071, 0.0) | 90 / -135 | T5 | 18 | 0.256 |
| 15 | 39563-39580 | (-0.7071, 0.7071, 0.0) | 90 / 135 | T5 | 18 | 0.262 |
| 16 | 39589-39606 | (0.7071, -0.7071, 0.0) | 90 / -45 | T5 | 18 | 0.264 |
| 17 | 39615-39632 | (0.7071, 0.7071, 0.0) | 90 / 45 | T5 | 18 | 0.259 |
| 18 | 39646-39684 | (-1.0, -0.0, 0.0) | 90 / -180 | T8 | 37 | 0.076 |
| 19 | 39693-39731 | (1.0, -0.0, 0.0) | 90 / -0 | T8 | 37 | 0.076 |
| 20 | 39740-39778 | (0.0, -1.0, 0.0) | 90 / -90 | T8 | 37 | 0.078 |
| 21 | 39787-39825 | (0.0, 1.0, 0.0) | 90 / 90 | T8 | 37 | 0.066 |
| 22 | 39839-47604 | (0.0, 1.0, 0.0) | 90 / 90 | T4 | 7761 | 0.141 |
| 23 | 47619-73311 | (0.0, 0.0, 1.0) | 0 / 0 | T1 | 25693 | 56.862 |
| 24 | 73320-73363 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 44 | 49.015 |
| 25 | 73372-73415 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 44 | 49.25 |
| 26 | 73424-73453 | (0.0, -1.0, 0.0) | 90 / -90 | T1 | 30 | 23.517 |
| 27 | 73462-73491 | (0.0, 1.0, 0.0) | 90 / 90 | T1 | 30 | 23.604 |

## Rigidity / part-off (connection area in the stub gap; stock section 18986.5 mm2; part-off marker at line 47608)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 38796 | 18965.19 | 0.999 | [18965.19] | False |
| 2 | 38857 | 18965.19 | 0.999 | [18965.19] | False |
| 3 | 38919 | 18965.19 | 0.999 | [18965.19] | False |
| 4 | 38991 | 18965.19 | 0.999 | [18965.19] | False |
| 5 | 39063 | 18965.19 | 0.999 | [18965.19] | False |
| 6 | 39135 | 18965.19 | 0.999 | [18965.19] | False |
| 7 | 39207 | 18965.19 | 0.999 | [18965.19] | False |
| 8 | 39279 | 18965.19 | 0.999 | [18965.19] | False |
| 9 | 39351 | 18965.19 | 0.999 | [18965.19] | False |
| 10 | 39399 | 18965.19 | 0.999 | [18965.19] | False |
| 11 | 39442 | 18965.19 | 0.999 | [18965.19] | False |
| 12 | 39485 | 18965.19 | 0.999 | [18965.19] | False |
| 13 | 39528 | 18965.19 | 0.999 | [18965.19] | False |
| 14 | 39554 | 18965.19 | 0.999 | [18965.19] | False |
| 15 | 39580 | 18965.19 | 0.999 | [18965.19] | False |
| 16 | 39606 | 18965.19 | 0.999 | [18965.19] | False |
| 17 | 39632 | 18965.19 | 0.999 | [18965.19] | False |
| 18 | 39684 | 18965.19 | 0.999 | [18965.19] | False |
| 19 | 39731 | 18965.19 | 0.999 | [18965.19] | False |
| 20 | 39778 | 18965.19 | 0.999 | [18965.19] | False |
| 21 | 39825 | 18965.19 | 0.999 | [18965.19] | False |
| 22 | 47604 | 18965.19 | 0.999 | [18965.19] | False |
| 23 | 73311 | 15440.0 | 0.813 | [15440.0] | True |
| 24 | 73363 | 10564.75 | 0.556 | [10564.75] | True |
| 25 | 73415 | 5699.44 | 0.300 | [3586.5, 2112.94] | True |
| 26 | 73453 | 3782.44 | 0.199 | [3586.5, 195.94] | True |
| 27 | 73491 | 1894.75 | 0.100 | [1698.81, 195.94] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | gouge | 28.35 | 27.47 46.24 0.04 36 49.54 1.71 | (0.06, 0.74, 0.67) | -1.798 / -2.467 | face 2 (plane); face 231 (cylinder r7.6397); face 234 (cylinder r1.5875) | line 7037 T2 frame 0 missed 0; line 7038 T2 frame 0 missed 0; line 7039 T2 frame 0 missed 0 |
| R2 | proud | 15.9 | -40.64 53.02 0.03 -37.47 56.2 1.68 | (0.98, -0.2, -0.0) | +5.000 / +5.000 | face 179 (cylinder r1.5875); face 180 (cylinder r1.5875) | line 73347 T1 frame 23 missed 6.035; line 73349 T1 frame 23 missed 6.035; line 73353 T1 frame 23 missed 6.035 |
| R3 | proud | 6.7 | -19.93 59.41 0.05 -17.78 61.6 1.65 | (-0.6, -0.8, -0.0) | +0.596 / +0.970 | face 227 (plane); face 228 (plane); face 14 (cylinder r0.7938) | line 36540 T4 frame 0 missed 0.047; line 36526 T4 frame 0 missed 0.047; line 36531 T4 frame 0 missed 0.047 |
| R4 | gouge | 6.51 | -27.13 33.66 0.06 -25.42 34.84 1.71 | (0.55, -0.78, 0.31) | -1.298 / -2.014 | face 155 (plane); face 156 (cylinder r2.54); face 2 (plane) | line 23603 T3 frame 0 missed 0; line 23604 T3 frame 0 missed 0; line 23605 T3 frame 0 missed 0 |
| R5 | gouge | 6.51 | 19.18 33.66 0.12 21.02 34.99 1.71 | (0.54, -0.66, 0.52) | -1.416 / -2.014 | face 222 (cylinder r2.54); face 221 (plane); face 2 (plane) | line 20871 T3 frame 0 missed 0; line 20872 T3 frame 0 missed 0; line 20873 T3 frame 0 missed 0 |
| R6 | gouge | 6.32 | -20.9 33.66 0.05 -19.23 34.89 1.71 | (-0.51, -0.71, 0.48) | -1.300 / -2.014 | face 151 (plane); face 156 (cylinder r2.54); face 2 (plane) | line 23610 T3 frame 0 missed 0; line 23609 T3 frame 0 missed 0; line 23611 T3 frame 0 missed 0 |
| R7 | gouge | 5.17 | 25.43 33.66 0.13 27.07 34.83 1.71 | (-0.56, -0.8, 0.21) | -1.082 / -2.014 | face 223 (plane); face 222 (cylinder r2.54); face 2 (plane) | line 20878 T3 frame 0 missed 0; line 20877 T3 frame 0 missed 0; line 19481 T3 frame 0 missed 0 |
| R8 | proud | 4.21 | -31.75 59.48 0.14 -29.77 61.6 1.57 | (0.68, -0.74, 0.0) | +0.654 / +0.948 | face 227 (plane); face 230 (plane); face 11 (cylinder r0.7938) | line 5825 T2 frame 0 missed 0.064; line 5826 T2 frame 0 missed 0.064; line 36557 T4 frame 0 missed 0.072 |
| R9 | proud | 2.87 | 37.71 -69.82 1.93 38.86 -69.08 3.2 | (-0.25, 0.9, 0.36) | +0.161 / +0.228 | face 112 (sphere r1.524); face 145 (cylinder r1.524) | line 38776 T5 frame 0 missed 0; line 38777 T5 frame 0 missed 0; line 38755 T5 frame 0 missed 0 |
| R10 | proud | 2.68 | -39.03 68.81 1.82 -37.61 69.83 3.29 | (0.32, -0.8, 0.51) | +0.155 / +0.229 | face 108 (sphere r1.524); face 123 (plane); face 101 (cylinder r1.524) | line 38762 T5 frame 0 missed 0; line 38763 T5 frame 0 missed 0; line 38740 T5 frame 0 missed 0 |
| R11 | proud | 2.3 | 47.43 59.6 2.01 48.04 60.58 3.3 | (-0.84, -0.36, 0.41) | +0.176 / +0.223 | face 114 (sphere r1.524); face 143 (cylinder r1.524); face 150 (cylinder r1.524) | line 38781 T5 frame 0 missed 0; line 38780 T5 frame 0 missed 0; line 38759 T5 frame 0 missed 0 |
| R12 | proud | 2.11 | 37.66 68.82 1.86 38.84 69.83 3.13 | (-0.31, -0.84, 0.45) | +0.151 / +0.200 | face 115 (sphere r1.524); face 149 (cylinder r1.524) | line 38782 T5 frame 0 missed 0; line 38783 T5 frame 0 missed 0; line 38761 T5 frame 0 missed 0 |
| R13 | proud | 1.72 | -4.09 72.29 3.93 -1.51 72.92 4.32 | (0.0, 0.0, 1.0) | +0.201 / +0.317 | face 249 (plane); face 250 (plane); face 253 (plane) | line 43856 T4 frame 21 missed 0.045; line 42267 T4 frame 21 missed 0.045; line 43857 T4 frame 21 missed 0.045 |
| R14 | proud | 1.53 | -48.05 -60.54 1.85 -47.04 -59.51 3.13 | (0.74, 0.18, 0.65) | +0.137 / +0.173 | face 110 (sphere r1.524); face 147 (cylinder r1.524) | line 38789 T5 frame 0 missed 0; line 38788 T5 frame 0 missed 0; line 38766 T5 frame 0 missed 0 |
| R15 | proud | 1.53 | -48.05 59.45 1.98 -47.38 60.46 3.28 | (0.86, -0.29, 0.41) | +0.162 / +0.205 | face 109 (sphere r1.524); face 147 (cylinder r1.524); face 121 (plane) | line 38787 T5 frame 0 missed 0; line 38786 T5 frame 0 missed 0; line 38765 T5 frame 0 missed 0 |
| R16 | proud | 1.53 | -38.69 -69.81 1.85 -37.77 -68.81 3 | (0.4, 0.66, 0.63) | +0.141 / +0.187 | face 111 (sphere r1.524); face 145 (cylinder r1.524) | line 38791 T5 frame 0 missed 0; line 38790 T5 frame 0 missed 0; line 38769 T5 frame 0 missed 0 |
| R17 | proud | 1.53 | 47.32 -60.8 2.29 47.98 -60.09 3.14 | (-0.8, 0.48, 0.35) | +0.166 / +0.227 | face 113 (sphere r1.524); face 144 (cylinder r1.524) | line 38779 T5 frame 0 missed 0; line 38778 T5 frame 0 missed 0; line 38757 T5 frame 0 missed 0 |
| R18 | proud | 1.15 | 14.17 71.95 3.93 14.46 72.86 5.51 | (-1.0, 0.0, 0.0) | +0.248 / +0.317 | face 263 (plane); face 264 (plane); face 262 (plane) | line 41464 T4 frame 21 missed 0.066; line 41465 T4 frame 21 missed 0.066; line 43053 T4 frame 21 missed 0.066 |
| R19 | proud | 1.15 | 51.1 61.47 6.7 51.14 61.57 10.73 | (0.93, 0.37, 0.0) | +0.111 / +0.123 | face 81 (cylinder r1.524) | line 38911 T1 frame 2 missed 0; line 38913 T1 frame 2 missed 0; line 38909 T1 frame 2 missed 2.435 |
| R20 | proud | 0.96 | -13.97 72.09 11.08 -12.42 72.9 11.43 | (0.89, 0.0, -0.45) | +0.240 / +0.532 | face 239 (plane); face 238 (plane); face 236 (plane) | line 46837 T4 frame 21 missed 0.053; line 46838 T4 frame 21 missed 0.053; line 45838 T4 frame 21 missed 0.053 |
| R21 | proud | 0.96 | 9.71 71.97 11.12 10.92 72.87 11.43 | (0.24, 0.0, -0.97) | +0.148 / +0.178 | face 260 (plane); face 259 (plane) | line 41445 T4 frame 21 missed 0.05; line 41446 T4 frame 21 missed 0.05; line 43034 T4 frame 21 missed 0.05 |
| R22 | proud | 0.96 | 54.73 -77.56 19.39 55.29 -77.13 19.94 | (0.55, -0.62, -0.55) | +0.155 / +0.214 | face 126 (sphere r1.524) | line 39432 T5 frame 10 missed 0; line 39434 T5 frame 10 missed 0; line 39435 T5 frame 10 missed 0 |
| R23 | proud | 0.77 | -51.12 61.5 2.07 -51.09 61.57 3.86 | (-0.92, 0.39, 0.0) | +0.114 / +0.123 | face 78 (cylinder r1.524) | line 39197 T1 frame 6 missed 0; line 39566 T5 frame 14 missed 0; line 39370 T5 frame 9 missed 0.198 |
| R24 | proud | 0.77 | -51.12 61.51 8.39 -51.09 61.57 9.54 | (-0.92, 0.39, 0.0) | +0.115 / +0.125 | face 78 (cylinder r1.524) | line 39199 T1 frame 6 missed 0; line 39201 T1 frame 6 missed 0; line 39198 T1 frame 6 missed 1.456 |
| R25 | proud | 0.77 | -39.8 72.85 1.26 -39.72 72.91 4.03 | (-0.41, 0.91, -0.05) | +0.107 / +0.111 | face 79 (cylinder r1.524); face 138 (sphere r1.524) | line 39197 T1 frame 6 missed 0; line 39199 T1 frame 6 missed 0; line 39499 T5 frame 12 missed 0 |
| R26 | proud | 0.77 | -39.8 72.87 10.51 -39.71 72.91 12.78 | (-0.39, 0.92, 0.0) | +0.109 / +0.124 | face 79 (cylinder r1.524) | line 39057 T1 frame 4 missed 0; line 39201 T1 frame 6 missed 0; line 39199 T1 frame 6 missed 0 |
| R27 | proud | 0.77 | 51.1 -61.55 6.71 51.13 -61.49 8.48 | (0.93, -0.37, 0.0) | +0.112 / +0.115 | face 65 (cylinder r1.524) | line 33599 T3 frame 0 missed 3.49; line 33804 T3 frame 0 missed 3.49; line 33803 T3 frame 0 missed 3.49 |
| R28 | proud | 0.57 | -55.21 77.07 19.4 -54.77 77.12 19.74 | (-0.53, 0.47, -0.7) | +0.193 / +0.235 | face 124 (sphere r1.524) | line 39389 T5 frame 9 missed 0; line 39393 T5 frame 9 missed 0; line 39391 T5 frame 9 missed 0 |
| R29 | proud | 0.57 | -51.13 -61.56 14.52 -51.1 -61.49 16.28 | (-0.93, -0.38, 0.0) | +0.110 / +0.114 | face 77 (cylinder r1.524) | line 38851 T1 frame 1 missed 0; line 39650 T8 frame 17 missed 1.509; line 39662 T8 frame 17 missed 1.509 |
| R30 | proud | 0.57 | -51.13 -61.52 5.73 -51.12 -61.48 6.36 | (-0.93, -0.36, 0.0) | +0.111 / +0.123 | face 77 (cylinder r1.524) | line 38849 T1 frame 1 missed 0; line 38847 T1 frame 1 missed 0; line 38851 T1 frame 1 missed 2.17 |

Cycle time 39.0 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
