# motor_mount plan (AL6061, stock 104x74x18, part 100x70x16)
1. T1 D10 flat, 18000 rpm, F3240 (0.06x3), ramp F1080
   - Face Z18->16.3 (rough, stepover 6.6) and Z16.0 finish, zigzag beyond stock.
   - D40 counterbore (-15,0): inside-out concentric circles r 2.75..14.75 (stepover 4), helix entry pitch 1,
     levels Z13, Z10.2; floor/wall finish at Z10.0 (r 3..15, last circle = wall finish).
   - D22 bore: circles r1.75/5.75, levels 6.6, 3.2, -0.2 (helix pitch 1), finish circle r6.0 at Z-0.2.
2. T2 D6 flat, 24000 rpm, F2880, ramp F960
   - Rect pocket 30x20 R3 + island D10 (top Z13): offset rings (shapely, stepover 2.4, wall allowance 0.25),
     ramp entry 3deg along the ring; levels 14.5, 13.0 (island top final), 10.6, 8.2, 8.0 (floor).
   - Slot 8x25 through: stadium rings, levels of 2.7 to Z-0.2; finish stadium at full depth.
   - 4x D11 counterbores: helix r2.25 to Z9.7, then r2.5 helix to Z9.5 + full circle (wall+floor finish).
3. T3 D3 flat, 24000 rpm, F960, ramp F320
   - Rect pocket rest (channels between island and walls, 5 mm): rings at 1.65 from walls/island, Z12..8 step 1.
   - Finish walls (ring 1.5 from walls, CCW) and island (CW) full depth at Z8.0, radial 0.15.
   - 4x D6.6 through holes: helix r1.0 pitch 0.5 to Z-0.2, helix r1.65 pitch 1, finish circle r1.8.
4. T1: outer profile R8 rounded rect, climb (CW), arc lead-in from outside, levels 10.6/5.2/-0.2 at offset 5.25,
   finish offset 5.0 full depth Z-0.2.
5. T9 chamfer mill: 1x45 top edge, tip at Z14.5, path offset +0.6 (cone r = 0.1 + h).
