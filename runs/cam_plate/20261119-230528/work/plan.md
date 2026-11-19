# cam_plate plan (AL6061, stock 85x64x13, part 12 thick)
1. T1 D10 flat, 18000 rpm, F3000: face top Z13->Z12, X raster, stepover 6.
2. T2 D6 flat, 24000 rpm, F2400 (ramp 1000): rough hex recess (+keyway mouth) Z12->7 in 2 levels (2.5),
   contour-parallel stepover 2.4, wall allowance 0.2, floor to 7.0; ramp entry along innermost loop (<=3 deg).
3. T1: bore D24 rough Z7->-0.2: helix on r2.8 (pitch 0.8) + ring r6.8, 3 levels; finish circle r7.0 full depth (climb CCW).
4. T3 D3 flat, 24000 rpm, F900 (ramp 400): keyway loop x+-1.5, y10..15, Z12->-0.2 in ~1 mm levels (final offset each level
   so the shank never rubs; flute 10 < depth 12.2). Sharp keyway end corners are tool-limited.
5. T3: kidney windows (R1.9 corners) Z12->-0.2, 13 levels, per level ramp along innermost loop, then loops out to final offset.
6. T3: hex finish wall pass at Z7, single 5 mm deep pass, radial 0.2, climb.
7. T9 chamfer mill: bore chamfer 1x45: tip Z5.5, centre radius 11.4, entered from bore centre (air), CCW.
8. T1: outer profile rough Z12->-0.2 in 3 levels (4.1 max), contour offsets outer->inner stepover 4, allowance 0.25,
   CW (climb); finish pass at exact offset Z-0.2, CW.
