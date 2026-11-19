# Heatsink plan (AL6061, vacuum plate, Z0 = bottom)
Geometry: base 80x60x6, fin block X[-31.25,31.25] Y[-22,22] at Z6 (7 fins x=-27..27 pitch 9, 2.5 thick,
6.5 gaps, R3 root fillets leaving 0.5 mm floor strips), crown z = 22 - 60 + sqrt(3600 - x^2), 2x D5.5 at (+-34,0).
1. T1 D10 flat 18000 rpm: 3D z-level roughing, Y-direction raster (step 3.9 = 0.39D), 2 mm step-down,
   clamp z = max(level, dropped cutter on target dilated 0.3 / +0.3), 15 deg ramps where a descent re-enters
   material; F2900 (0.054 mm/t). Outside part left at Z0.3.
2. T1: floor finish Z6 as two CW rings around the fin block (offset 5 and 9) - also finishes fin end faces Y+-22.
3. T2 D6 flat 24000 rpm: slot each gap at centre, 2 mm step-down to Z8.2 (F2300); walls to size at Z9 full
   depth (F2400) incl. outer fin walls x=+-28.25 (semi pass + finish).
4. T6 D6 ball 24000 rpm: gap pre-pass tip Z7; R3 fillets with ball centre on the fillet centre offset 0.03 away
   from the wall (tip Z6) - keeps shank off the walls; crown: Y-lines per fin, 0.5 mm step-over, dropped on the
   analytic R60 crown, F1400.
5. T3 D3 flat: helical holes r1.15 pitch 0.5 to Z-0.2, finish circle r1.25 (G3 climb), F800/900.
6. T1: outer profile CW (climb) at Z-0.2: semi at offset 5.1 then finish at 5.0, F2500.
