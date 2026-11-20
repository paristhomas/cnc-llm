# Simulation feedback - iteration 1: ftc08 (3+2)

**Score: 99.449% of the 3+2-reachable surface within +-0.1 mm** (whole non-parting surface 98.005%). Program valid: **NO** (21927 errors, 50 warnings).

| metric | value |
|---|---|
| machinable_in_tol_pct | 99.449 |
| machinable_gouge_pct | 0.075 |
| machinable_proud_pct | 0.475 |
| max_gouge_mm | 2.4671 |
| unreachable_area_pct | 1.467 |
| parting_face_pct | 18.962 |
| setups | 27 |
| distinct_orientations | 9 |
| final_connection_mm2 | 4474.5 |
| cycle_time_min | 35.37 |

## Errors (must be fixed)

- line 45892: Z-5.3 outside machine travel [-5, 200]
- line 45893: Z-5.3 outside machine travel [-5, 200]
- line 45894: Z-5.3 outside machine travel [-5, 200]
- line 45895: Z-5.3 outside machine travel [-5, 200]
- line 45896: Z-5.3 outside machine travel [-5, 200]
- line 45897: Z-5.3 outside machine travel [-5, 200]
- line 45898: Z-5.3 outside machine travel [-5, 200]
- line 45899: Z-5.3 outside machine travel [-5, 200]
- line 45900: Z-5.3 outside machine travel [-5, 200]
- line 45901: Z-5.3 outside machine travel [-5, 200]
- line 45902: Z-5.3 outside machine travel [-5, 200]
- line 45903: Z-5.3 outside machine travel [-5, 200]
- line 45904: Z-5.3 outside machine travel [-5, 200]
- line 45905: Z-5.3 outside machine travel [-5, 200]
- line 45906: Z-5.3 outside machine travel [-5, 200]
- line 45907: Z-5.3 outside machine travel [-5, 200]
- line 45908: Z-5.3 outside machine travel [-5, 200]
- line 45909: Z-5.3 outside machine travel [-5, 200]
- line 45910: Z-5.3 outside machine travel [-5, 200]
- line 45911: Z-5.3 outside machine travel [-5, 200]
- line 45912: Z-5.3 outside machine travel [-5, 200]
- line 45913: Z-5.3 outside machine travel [-5, 200]
- line 45914: Z-5.3 outside machine travel [-5, 200]
- line 45915: Z-5.3 outside machine travel [-5, 200]
- line 45916: Z-5.3 outside machine travel [-5, 200]
- line 45917: Z-5.3 outside machine travel [-5, 200]
- line 45918: Z-5.3 outside machine travel [-5, 200]
- line 45919: Z-5.3 outside machine travel [-5, 200]
- line 45920: Z-5.3 outside machine travel [-5, 200]
- line 45921: Z-5.3 outside machine travel [-5, 200]
- line 45922: Z-5.3 outside machine travel [-5, 200]
- line 45923: Z-5.3 outside machine travel [-5, 200]
- line 45924: Z-5.3 outside machine travel [-5, 200]
- line 45925: Z-5.3 outside machine travel [-5, 200]
- line 45926: Z-5.3 outside machine travel [-5, 200]
- line 45927: Z-5.3 outside machine travel [-5, 200]
- line 45928: Z-5.3 outside machine travel [-5, 200]
- line 45929: Z-5.3 outside machine travel [-5, 200]
- line 45930: Z-5.3 outside machine travel [-5, 200]
- line 45931: Z-5.3 outside machine travel [-5, 200]

## Warnings

- line 33947: rotary indexing with the spindle running
- line 34002: rotary indexing with the spindle running
- line 34005: rotary indexing with the spindle running
- line 34060: rotary indexing with the spindle running
- line 34063: rotary indexing with the spindle running
- line 34128: rotary indexing with the spindle running
- line 34131: rotary indexing with the spindle running
- line 34196: rotary indexing with the spindle running
- line 34199: rotary indexing with the spindle running
- line 34264: rotary indexing with the spindle running
- line 34267: rotary indexing with the spindle running
- line 34332: rotary indexing with the spindle running
- line 34335: rotary indexing with the spindle running
- line 34400: rotary indexing with the spindle running
- line 34403: rotary indexing with the spindle running
- line 34468: rotary indexing with the spindle running
- line 34476: rotary indexing with the spindle running
- line 34512: rotary indexing with the spindle running
- line 34515: rotary indexing with the spindle running
- line 34551: rotary indexing with the spindle running

## Setups (contiguous segments of one tool orientation)

| # | lines | tool axis (G54) | A / C deg | tools | moves | removed cm3 |
|---|---|---|---|---|---|---|
| 1 | 11-33942 | (0.0, 0.0, 1.0) | 0 / 0 | T1, T2, T3, T4, T5 | 52907 | 343.975 |
| 2 | 33948-34001 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 54 | 33.84 |
| 3 | 34006-34059 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 54 | 34.871 |
| 4 | 34064-34127 | (0.0, -1.0, 0.0) | 90 / -90 | T1 | 64 | 22.998 |
| 5 | 34132-34195 | (0.0, 1.0, 0.0) | 90 / 90 | T1 | 64 | 23.341 |
| 6 | 34200-34263 | (-0.7071, -0.7071, 0.0) | 90 / -135 | T1 | 64 | 1.903 |
| 7 | 34268-34331 | (-0.7071, 0.7071, 0.0) | 90 / 135 | T1 | 64 | 1.888 |
| 8 | 34336-34399 | (0.7071, -0.7071, 0.0) | 90 / -45 | T1 | 64 | 1.875 |
| 9 | 34404-34467 | (0.7071, 0.7071, 0.0) | 90 / 45 | T1 | 64 | 1.858 |
| 10 | 34477-34511 | (-1.0, -0.0, 0.0) | 90 / -180 | T5 | 35 | 2.895 |
| 11 | 34516-34550 | (1.0, -0.0, 0.0) | 90 / -0 | T5 | 35 | 2.891 |
| 12 | 34555-34589 | (0.0, -1.0, 0.0) | 90 / -90 | T5 | 35 | 1.997 |
| 13 | 34594-34628 | (0.0, 1.0, 0.0) | 90 / 90 | T5 | 35 | 1.863 |
| 14 | 34633-34650 | (-0.7071, -0.7071, 0.0) | 90 / -135 | T5 | 18 | 0.256 |
| 15 | 34655-34672 | (-0.7071, 0.7071, 0.0) | 90 / 135 | T5 | 18 | 0.262 |
| 16 | 34677-34694 | (0.7071, -0.7071, 0.0) | 90 / -45 | T5 | 18 | 0.264 |
| 17 | 34699-34716 | (0.7071, 0.7071, 0.0) | 90 / 45 | T5 | 18 | 0.259 |
| 18 | 34726-34738 | (-1.0, -0.0, 0.0) | 90 / -180 | T8 | 13 | 0.063 |
| 19 | 34743-34755 | (1.0, -0.0, 0.0) | 90 / -0 | T8 | 13 | 0.063 |
| 20 | 34760-34772 | (0.0, -1.0, 0.0) | 90 / -90 | T8 | 13 | 0.062 |
| 21 | 34777-34789 | (0.0, 1.0, 0.0) | 90 / 90 | T8 | 13 | 0.053 |
| 22 | 34799-42228 | (0.0, 1.0, 0.0) | 90 / 90 | T4 | 7421 | 0.141 |
| 23 | 42236-67818 | (0.0, 0.0, 1.0) | 0 / 0 | T1 | 3658 | 8.566 |
| 24 | 67819-67862 | (-1.0, -0.0, 0.0) | 90 / -180 | T1 | 44 | 49.015 |
| 25 | 67867-67910 | (1.0, -0.0, 0.0) | 90 / -0 | T1 | 44 | 49.25 |
| 26 | 67915-67944 | (0.0, -1.0, 0.0) | 90 / -90 | T1 | 30 | 23.517 |
| 27 | 67949-67978 | (0.0, 1.0, 0.0) | 90 / 90 | T1 | 30 | 23.604 |

## Rigidity / part-off (connection area in the stub gap; stock section 18986.5 mm2; part-off marker at line 42230)

| after setup | line | area mm2 | fraction | islands | part-off |
|---|---|---|---|---|---|
| 1 | 33942 | 18965.19 | 0.999 | [18965.19] | False |
| 2 | 34001 | 18965.19 | 0.999 | [18965.19] | False |
| 3 | 34059 | 18965.19 | 0.999 | [18965.19] | False |
| 4 | 34127 | 18965.19 | 0.999 | [18965.19] | False |
| 5 | 34195 | 18965.19 | 0.999 | [18965.19] | False |
| 6 | 34263 | 18965.19 | 0.999 | [18965.19] | False |
| 7 | 34331 | 18965.19 | 0.999 | [18965.19] | False |
| 8 | 34399 | 18965.19 | 0.999 | [18965.19] | False |
| 9 | 34467 | 18965.19 | 0.999 | [18965.19] | False |
| 10 | 34511 | 18965.19 | 0.999 | [18965.19] | False |
| 11 | 34550 | 18965.19 | 0.999 | [18965.19] | False |
| 12 | 34589 | 18965.19 | 0.999 | [18965.19] | False |
| 13 | 34628 | 18965.19 | 0.999 | [18965.19] | False |
| 14 | 34650 | 18965.19 | 0.999 | [18965.19] | False |
| 15 | 34672 | 18965.19 | 0.999 | [18965.19] | False |
| 16 | 34694 | 18965.19 | 0.999 | [18965.19] | False |
| 17 | 34716 | 18965.19 | 0.999 | [18965.19] | False |
| 18 | 34738 | 18965.19 | 0.999 | [18965.19] | False |
| 19 | 34755 | 18965.19 | 0.999 | [18965.19] | False |
| 20 | 34772 | 18965.19 | 0.999 | [18965.19] | False |
| 21 | 34789 | 18965.19 | 0.999 | [18965.19] | False |
| 22 | 42228 | 18965.19 | 0.999 | [18965.19] | False |
| 23 | 67818 | 18965.19 | 0.999 | [18965.19] | True |
| 24 | 67862 | 13622.19 | 0.718 | [13622.19] | True |
| 25 | 67910 | 8279.19 | 0.436 | [8279.19] | True |
| 26 | 67944 | 6362.19 | 0.335 | [6362.19] | True |
| 27 | 67978 | 4474.5 | 0.236 | [4474.5] | True |

## Out-of-tolerance regions (largest first; scored surface only)

| id | type | area mm2 | bbox | normal | mean / extreme | faces | nearest passes |
|---|---|---|---|---|---|---|---|
| R1 | gouge | 28.54 | 27.47 46.19 0.04 36 49.54 1.71 | (0.06, 0.73, 0.68) | -1.804 / -2.467 | face 2 (plane); face 231 (cylinder r7.6397); face 234 (cylinder r1.5875) | line 6731 T2 frame 0 missed 0; line 6730 T2 frame 0 missed 0; line 6732 T2 frame 0 missed 0 |
| R2 | proud | 20.31 | -1.38 15.92 1.71 1.39 23.03 1.71 | (0.0, 0.0, 1.0) | +0.401 / +1.723 | face 2 (plane) | line 1833 T1 frame 0 missed 0.011; line 8295 T3 frame 0 missed 0.041; line 14505 T3 frame 0 missed 0.041 |
| R3 | proud | 19.73 | -51.43 61.92 17.3 -39.7 73.29 19.05 | (-0.49, 0.5, -0.72) | +0.687 / +0.762 | face 55 (cylinder r0.762); face 71 (torus); face 72 (torus) | line 34329 T1 frame 6 missed 0; line 34734 T8 frame 17 missed 0; line 34732 T8 frame 17 missed 0 |
| R4 | proud | 18.58 | 39.74 61.85 18.24 51.2 73.02 19.05 | (0.53, 0.53, -0.66) | +0.725 / +0.762 | face 58 (cylinder r0.762); face 74 (torus); face 80 (cylinder r1.524) | line 34465 T1 frame 8 missed 0; line 34783 T8 frame 20 missed 0; line 34784 T8 frame 20 missed 0 |
| R5 | proud | 17.82 | -51.38 -72.95 18.33 -39.79 -61.73 19.05 | (-0.46, -0.47, -0.75) | +0.713 / +0.762 | face 51 (cylinder r0.762); face 69 (torus); face 70 (torus) | line 34261 T1 frame 5 missed 0; line 34730 T8 frame 17 missed 0; line 34731 T8 frame 17 missed 0 |
| R6 | proud | 16.67 | 39.84 -73.26 18.32 51.42 -61.61 19.05 | (0.49, -0.49, -0.72) | +0.712 / +0.762 | face 47 (cylinder r0.762); face 66 (torus); face 68 (torus) | line 34397 T1 frame 7 missed 0; line 34766 T8 frame 19 missed 0; line 34764 T8 frame 19 missed 0 |
| R7 | proud | 15.9 | -40.64 53.02 0.03 -37.47 56.2 1.68 | (0.98, -0.2, -0.0) | +5.000 / +5.000 | face 179 (cylinder r1.5875); face 180 (cylinder r1.5875) | line 67846 T1 frame 22 missed 6.035; line 67848 T1 frame 22 missed 6.035; line 67852 T1 frame 22 missed 6.035 |
| R8 | proud | 7.85 | -19.85 47.63 0.06 -17.78 49.74 1.64 | (-0.63, 0.77, -0.0) | +0.553 / +0.954 | face 229 (plane); face 228 (plane); face 13 (cylinder r0.7938) | line 5759 T2 frame 0 missed 0.065; line 5760 T2 frame 0 missed 0.065; line 5761 T2 frame 0 missed 2.644 |
| R9 | proud | 6.9 | -31.75 47.63 0.03 -29.69 49.77 1.65 | (0.67, 0.74, 0.0) | +0.610 / +0.963 | face 12 (cylinder r0.7938); face 229 (plane); face 230 (plane) | line 5758 T2 frame 0 missed 0.06; line 5757 T2 frame 0 missed 0.06; line 5756 T2 frame 0 missed 2.706 |
| R10 | proud | 6.7 | -19.93 59.41 0.05 -17.78 61.6 1.65 | (-0.6, -0.8, -0.0) | +0.596 / +0.970 | face 227 (plane); face 228 (plane); face 14 (cylinder r0.7938) | line 5762 T2 frame 0 missed 0.054; line 5761 T2 frame 0 missed 0.054; line 5760 T2 frame 0 missed 2.675 |
| R11 | proud | 4.41 | -31.75 59.37 0.14 -29.77 61.6 1.57 | (0.71, -0.71, 0.0) | +0.630 / +0.948 | face 230 (plane); face 227 (plane); face 11 (cylinder r0.7938) | line 5755 T2 frame 0 missed 0.05; line 5756 T2 frame 0 missed 0.05; line 5757 T2 frame 0 missed 2.557 |
| R12 | proud | 3.06 | 25.45 23.5 0.29 26.35 24.36 1.65 | (-0.63, 0.77, -0.0) | +0.234 / +0.292 | face 15 (cylinder r0.7938); face 226 (plane); face 217 (plane) | line 21652 T3 frame 0 missed 0.057; line 21651 T3 frame 0 missed 0.057; line 20270 T3 frame 0 missed 0.064 |
| R13 | proud | 2.87 | 37.71 -69.82 1.93 38.86 -69.08 3.2 | (-0.25, 0.9, 0.36) | +0.161 / +0.228 | face 112 (sphere r1.524); face 145 (cylinder r1.524) | line 33923 T5 frame 0 missed 0; line 33922 T5 frame 0 missed 0; line 33901 T5 frame 0 missed 0 |
| R14 | proud | 2.68 | -39.03 68.81 1.82 -37.61 69.83 3.29 | (0.32, -0.8, 0.51) | +0.155 / +0.229 | face 108 (sphere r1.524); face 123 (plane); face 101 (cylinder r1.524) | line 33908 T5 frame 0 missed 0; line 33909 T5 frame 0 missed 0; line 33886 T5 frame 0 missed 0 |
| R15 | proud | 2.3 | 47.43 59.6 2.01 48.04 60.58 3.3 | (-0.84, -0.36, 0.41) | +0.176 / +0.223 | face 114 (sphere r1.524); face 143 (cylinder r1.524); face 150 (cylinder r1.524) | line 33927 T5 frame 0 missed 0; line 33926 T5 frame 0 missed 0; line 33905 T5 frame 0 missed 0 |
| R16 | proud | 2.11 | 37.66 68.82 1.86 38.84 69.83 3.13 | (-0.31, -0.84, 0.45) | +0.151 / +0.200 | face 115 (sphere r1.524); face 149 (cylinder r1.524) | line 33929 T5 frame 0 missed 0; line 33928 T5 frame 0 missed 0; line 33907 T5 frame 0 missed 0 |
| R17 | proud | 1.72 | -4.09 72.29 3.93 -1.51 72.92 4.32 | (0.0, 0.0, 1.0) | +0.201 / +0.317 | face 249 (plane); face 250 (plane); face 253 (plane) | line 38748 T4 frame 21 missed 0.045; line 37165 T4 frame 21 missed 0.045; line 37166 T4 frame 21 missed 0.045 |
| R18 | proud | 1.53 | -48.05 -60.54 1.85 -47.04 -59.51 3.13 | (0.74, 0.18, 0.65) | +0.137 / +0.173 | face 110 (sphere r1.524); face 147 (cylinder r1.524) | line 33935 T5 frame 0 missed 0; line 33934 T5 frame 0 missed 0; line 33912 T5 frame 0 missed 0 |
| R19 | proud | 1.53 | -48.05 59.45 1.98 -47.38 60.46 3.28 | (0.86, -0.29, 0.41) | +0.162 / +0.205 | face 109 (sphere r1.524); face 147 (cylinder r1.524); face 121 (plane) | line 33932 T5 frame 0 missed 0; line 33933 T5 frame 0 missed 0; line 33910 T5 frame 0 missed 0 |
| R20 | proud | 1.53 | -38.69 -69.81 1.85 -37.77 -68.81 3 | (0.4, 0.66, 0.63) | +0.141 / +0.187 | face 111 (sphere r1.524); face 145 (cylinder r1.524) | line 33937 T5 frame 0 missed 0; line 33936 T5 frame 0 missed 0; line 33914 T5 frame 0 missed 0 |
| R21 | proud | 1.53 | 20 23.5 0.38 20.96 24.34 1.47 | (0.77, 0.63, 0.0) | +0.196 / +0.292 | face 16 (cylinder r0.7938); face 217 (plane); face 218 (plane) | line 21649 T3 frame 0 missed 0.048; line 21650 T3 frame 0 missed 0.048; line 20267 T3 frame 0 missed 0.048 |
| R22 | proud | 1.53 | 47.32 -60.8 2.29 47.98 -60.09 3.14 | (-0.8, 0.48, 0.35) | +0.166 / +0.227 | face 113 (sphere r1.524); face 144 (cylinder r1.524) | line 33925 T5 frame 0 missed 0; line 33924 T5 frame 0 missed 0; line 33902 T5 frame 0 missed 0 |
| R23 | proud | 1.15 | 14.17 71.95 3.93 14.46 72.86 5.51 | (-1.0, 0.0, 0.0) | +0.248 / +0.317 | face 263 (plane); face 264 (plane); face 262 (plane) | line 37941 T4 frame 21 missed 0.066; line 37942 T4 frame 21 missed 0.066; line 39524 T4 frame 21 missed 0.066 |
| R24 | proud | 1.15 | 51.1 61.47 6.7 51.14 61.57 10.73 | (0.93, 0.37, 0.0) | +0.111 / +0.123 | face 81 (cylinder r1.524) | line 34051 T1 frame 2 missed 0; line 34053 T1 frame 2 missed 0; line 34049 T1 frame 2 missed 2.435 |
| R25 | proud | 0.96 | -13.97 72.09 11.08 -12.42 72.9 11.43 | (0.89, 0.0, -0.45) | +0.240 / +0.532 | face 239 (plane); face 238 (plane); face 236 (plane) | line 40886 T4 frame 21 missed 0.053; line 40887 T4 frame 21 missed 0.053; line 41779 T4 frame 21 missed 0.053 |
| R26 | proud | 0.96 | 9.71 71.97 11.12 10.92 72.87 11.43 | (0.24, 0.0, -0.97) | +0.148 / +0.178 | face 260 (plane); face 259 (plane) | line 39506 T4 frame 21 missed 0.05; line 39505 T4 frame 21 missed 0.05; line 37923 T4 frame 21 missed 0.05 |
| R27 | proud | 0.96 | 54.73 -77.56 19.39 55.29 -77.13 19.94 | (0.55, -0.62, -0.55) | +0.155 / +0.214 | face 126 (sphere r1.524) | line 34540 T5 frame 10 missed 0; line 34542 T5 frame 10 missed 0; line 34543 T5 frame 10 missed 0 |
| R28 | proud | 0.77 | -51.12 61.5 2.07 -51.09 61.57 3.86 | (-0.92, 0.39, 0.0) | +0.114 / +0.123 | face 78 (cylinder r1.524) | line 34321 T1 frame 6 missed 0; line 34658 T5 frame 14 missed 0; line 34482 T5 frame 9 missed 0.198 |
| R29 | proud | 0.77 | -51.12 61.51 8.39 -51.09 61.57 9.54 | (-0.92, 0.39, 0.0) | +0.115 / +0.125 | face 78 (cylinder r1.524) | line 34323 T1 frame 6 missed 0; line 34325 T1 frame 6 missed 0; line 34322 T1 frame 6 missed 1.456 |
| R30 | proud | 0.77 | -39.8 72.85 1.26 -39.72 72.91 4.03 | (-0.41, 0.91, -0.05) | +0.107 / +0.111 | face 79 (cylinder r1.524); face 138 (sphere r1.524) | line 34321 T1 frame 6 missed 0; line 34323 T1 frame 6 missed 0; line 34599 T5 frame 12 missed 0 |

Cycle time 35.4 min (incl. 6 s per re-orientation). Images: `deviation_views.png` (4 views; grey = not reachable).
