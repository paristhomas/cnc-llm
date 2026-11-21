# CTC-04 x0.2 - plan

## Part
Flange plate 100 x 156 x 6 (model Z 0..6) with ~30 D2.8 through holes and countersinks, two 2.2 mm deep pockets on
its flat face; on the other side a body (8 mm), two blocks with an arched slot (r2.5) and D1.33 blind holes, two
"ears" with a 22 deg sloped face carrying counterbored holes, trapezoid/U pockets with r1 fillets, r1 round-overs.

## Orientation: up = model -X, rot 0 (fixture-suggest best: tool_found 99.76 %, score 98.93)
- up = +/-Z puts a face with pockets/holes or the ears on the stub (bottom_face 0-19 %, 6000-14000 mm2 downward
  faces): rejected.
- up = +/-Y: 156 mm tall, slenderness 6, score 96.7.
- up = -X: 100 mm tall, bottom = the 6 mm thick flange edge (plain flat strip 74 x 6 at Z0), bottom width 26 mm
  (two side tools reach 13 mm each). Nearly every face is either normal to G54 X (floors for tools along X) or
  parallel to X (walls for the flank). gap 24, grip 12 (tall part, side roughing).

## Setups (G54: X = model z, Y = model y, Z = up)
1. A90 from -X: T1 rough, T2/T3 rest rough, T2 z-level finish (floors exact, 0.07 mm steps through fillets,
   round-overs and chamfers, 0.35 mm steps over the 22 deg ear faces), T3 rest finish, T7 ball for the arch
   roofs, T8 helix for the D1.33 holes (flute-limited depth), T4 helix: second half of the flange holes, blind holes.
2. A90 tilted normal to the ear faces (axis (-0.927,0.375,0)): T2 face finish, T3 counterbores, T4 holes.
3. A90 from +X: T1 rough, T2 finish (face, pocket floors, fillets, flange outline to X6.56), T3 rest,
   T4 through holes (first half), T9 countersinks.
4. PART-OFF: T2 from -X and +X, centre line Z-3 following the lower silhouette (so the end radii and the taper
   wedges are cut too), leaving a 2.6 mm web X 8.76..11.36 under the flange strip; T3 from +X cuts the web down to
   two tabs (2.6 x 7.5 at the face, Y -62 and -10).

Engine: my own heightmap (z-buffer of the STL in each frame) + Euclidean distance field; tool-centre rings are
iso-lines of the distance field; each finishing ring is kept only in the depth band of its own drop height, so walls
get one pass at their foot and slopes get stepped passes. Links use a coarse stock model.
