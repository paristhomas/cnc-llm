# mould_cavity plan (AL6061-T6, stock 94x74x31, vacuum plate, G54 = model)
1. T1 D10 3FL, S18000 F3240: face Z31->Z30, rows Y step 6 (0.6D x 1 mm).
2. T1: cavity z-level roughing, levels 28/26/24/22/20/18/16.3, contour-parallel offset rings (stepover 4 = 0.4D)
   from STL sections (section at z-0.3, buffered R+0.3), ramp entry along ring at ~4 deg (F1100), climb.
3. T5 D8 bull r1, S24000 F3000: drop-cutter X raster, stepover 1.5, leave 0.15 (offset torus).
4. T6 D6 ball, S24000 F1440: drop-cutter X raster, stepover 0.5 (scallop < 0.05 on 55 deg walls), finish everything
   incl. chamfer, R4 fillet, dome.
5. T7 D3 ball F960: crease-parallel loops +-3 mm around the sharp dome/wall intersection (step 0.3).
6. T8 D1 ball F384: pencil loops +-0.9 mm (step 0.15); lifted where the D20 holder (stick-out 12) would touch the rim.
7. T2 D6 3FL F1500: helical interpolation of the 4 D8 holes (path R1, 0.6 mm/rev) to Z18 + flat bottom circle.
8. T1: outer profile CW (climb), rough offset 5.25 in 5 mm steps to Z-0.2, finish offset 5.0 in 2 axial steps.
