# ftc08 (NIST FTC-08, scale 0.5) - 3+2 plan

## Fixture: `up -Z`, `rot_z 90`, gap 22, grip 8 (fixture.json)
fixture-suggest (scale 0.5): `-Z` up = 98.5 % reachable, slenderness 0.22 (part 155.8 x 111.3 x 24.1). The `+-X`/`+-Y`
stances reach ~100 % but stand the tray on edge (slenderness 4.6-6.5, chatter, 111-156 mm tall). `+Z` up (pocket facing
down) reaches only 63 %. With `-Z` up the tray opens upward: the big pocket, floor, web cut-outs and lip are cut from +Z,
the outer walls under the lip from horizontal setups, and the parting face is the flat bottom of the web/rim (no
critical features apart from a 0.6 mm recess the harness already marks unreachable).
`rot 90` instead of 0 (same reachability): the jaws then grip the short stock faces, so the long sides are free for the
horizontal part-off slots and the window pocket lines up with the remaining band - part-off leaves ~10-14 % instead of ~13-17 %.
Gap 22 (not 14): the T5/T7-class tools working the bottom round from the side put the 32 mm holder down to Z-20.

## Setups
1. +Z (G54): T1 face 25.63->24.13, lip profile (outside lip, down to Z18.5), pocket rough (offset rings, ap 3, 0.3/0.2 allowance,
   fillet-safe last levels), floor finish Z1.714, wall finish (offset 5.0, Z24.13->3.3), window rough through the web;
   T2 cut-outs near the pocket wall (T3 holder would hit it); T3 window finish ring, keyholes, vertical r1.524 corner rest,
   lip corner holes (peck); T4 helical small holes + concave-corner rest of cut-outs; T5 bull traces the r1.524 floor fillet.
2. 8 horizontal setups (A90, C = 0/90/180/270 and the four 45 deg chamfer walls): T1 slab under the lip (rough d-levels,
   finish wall d=0, lip underside d=0.762), T5 bull upper corner traces the convex r1.524 bottom round (all 8) and lip round (4).
3. 4 setups at A105 (15 deg below horizontal): T8 ball traces the r0.762 wall/lip-underside fillet; each axis frame also does
   half of the two adjacent chamfer fillets (the lip corner blocks the holder from the 45 deg direction). The tilt keeps the
   shank away from the lip underside.
4. +Y wall (A90): T4 engraving, 1.27 deep, 3 levels.
5. (PART-OFF): T1 pocket below the big window from +Z (zero-tilt G68.2 frame, origin Z-20, to stay inside Z travel) to Z-16.5,
   T2 widening; T1 horizontal slots at Z-11 from +-X (reach |x| = 19.1; holder stays outside the stock) and +-Y (reach
   |y| = 67.8; holder must stay outside the vise body). Remaining: two webs under the part, ~2060 + ~600 mm2 (14 %).

## Cutting data
T1 18000 rpm 3240 mm/min (0.06 mm/t), plunge 1080; T2 24000/2880; T3 24000/960; T4 24000/480; T5 24000/3600; T8 24000/384.
Plunges <= 0.35 D at 1/3 feed; holes helical (T4) or pecked (T3).

## Left by design
Hole (-39.05, 54.6) d3.18 next to the pocket wall (no tool with a holder that clears the wall), square cut-out corners r0.79
near the wall, floor-fillet sphere corners, engraving sharp corners, outer convex wall-corner arcs (22.5 deg between setups).
