# FTC-10 on the 3+2 machine - plan

## Part
158 x 31 x 75 mm (model X x Y x Z). A body (model x -62.5..62.5) on an 8 mm flange plate (model y 0..8) that ends in
four ears (R9 lobes, 6 mm through holes with 10 mm x 2 counterbores). Model -Y: one large flat face with a 74 x 46 x 17
pocket (R2 corners and floor fillets, eight 2.5 mm holes into the cross holes). Model +Y: four R8/R12.5 waves around
four 7 mm cross holes along model Z (10 x 10 counterbores at both ends, 75 mm long), a ridge, a comb of pads with
small holes, an obround boss with holes. Model +X end: two 5.5 x 35 mm axial holes with drill points.

## Fixture: up = +X, rot 90 (fixture.json: margin 3, top 1.5, gap 24, grip 12)
fixture-suggest ranking: +X/rot90 99.5 % reachable (243 mm2 none), next +X/rot0 99.0 %, -X 97.8 %, -Z 94.9 %,
-Y 95.6 % (14 700 mm2 downward faces), +Y 82.6 %.
- +/-Z up would put four 10 x 10 counterbores and the 7 mm cross holes straight down into the stub (~3 % lost
  outright, more for the deep half of the holes).
- +/-Y up puts the pocket or the waves/bosses into the stub (bottom width 75).
- -X up points the two 5.5 x 35 axial holes down.
- +X up: every hole axis is horizontal or points up. The cross holes are reached half from each side (+/-Y in G54,
  T12 6 mm long reach), the axial holes from the top (T11 long neck: holder stays above the ears).
  The bottom is not a flat face: it is the two R9 ear lobes of the flange, tangent to Z0. Tabs go there.
  Bottom width 31 mm. Tall (158) -> grip 12.
- G54 mapping: X = 15.5 - model y, Y = -model z, Z = model x + 79.

## Setups (final program; each G68.2 frame is a 3-axis job; all frames axis aligned)
1. TOP, emitted as G68.2 X0 Y0 Z20 I0 J0 K0 (the 159.5 mm stock is taller than the Z150 tool-change/park height, so
   the frame is shifted up 20 mm): rough above the body top face around the top-ears plate (T1), finish the top face
   (T5), pre-drill the two axial holes to Z119.5 (T10, holder kept 1.5 mm above the ears), helical finish of the
   5.5 mm holes (T11 long neck), outer ring of their drill-point cones traced by the flat-end corner (T11).
2. +X (I90 J90): face the model bottom face (T1), rough the pocket and the top-ears outline (T1), pocket floor (T1),
   pocket walls (T2, T3: R2 corners), pocket floor corners (T3), top outline corners (T3, T4: R1), 6 mm ear holes
   (T3), R2 floor fillets by ball waterlines (T7), 2.5 mm floor holes into the cross holes (T13).
3. -X (I-90 J90): rough the wave side (T1, 0.8 mm levels on the waves), rest rough (T2), floors and walls with R1
   base fillets with the 8 mm r1 bull nose (T5), T3 floors/walls where the bull cannot enter, comb slots (T3 exact
   width), 3.5 mm holes (T3), 2.46 mm holes + cone rings (T4), R1 fillets the bull cannot reach (T13), top ear
   counterbores (T2), waves along the crests and ridge (T6 ball), edge rounds and ridge junction (T7), R1-ball
   top-down waterlines at the crest/floor and ridge junctions (T13), outline edge rounds of the top ears (T14).
4. -Y and +Y (I0/I180 J90): face (T1), grooves on -Y (T3), 10 x 10 counterbores (T2), drill 5 mm to the centre
   (T10), 7 mm cross holes to the centre from each side (T12, 50 mm reach), edge rounds wave/side and body top (T7).
   The bottom-end block below G54 Z16.5 is kept (keep-out for the X frames) so the part stays stiff.
5. (PART-OFF)
   - PO-1 +X: face the bottom-end margin, 6 mm bottom ear holes (T3).
   - PO-2 -X: remove the bottom-end block (T1, T2), body end face + R1 fillet and plate face (T5), bottom ear
     counterbores (T2), slab pass from -X under the part (T1 centre at Z-5, flank tangent to Z0) up to X10.7,
     lowest wave and bottom edge rounds (T7), R1-ball waterlines at the lowest crest (T13), ear outline edge rounds
     pre-cut into the plate before the outline exists (T14).
   - PO-3 +X: rough/finish the bottom ear outline (T1), notch and lobes down to the tabs with T2/T3 (tab keep-outs),
     R1 notch corners (T4), slab from +X up to X13.3 (2.6 mm web), then cut the web through except two tabs under
     the lobe tips (middle segment last).
   Tabs: 2, at G54 Y = +-28.5, X 10.7..13.3 (2.6 mm), 4.4 mm long in Y, Z -10..0, 11.44 mm2 each, 22.9 mm2 total.
   Operator: the part hangs on two 2.6 x 4.4 mm tabs under the tips of the two bottom ear lobes (G54 Y = +-28.5).
   Hold the part and rock it about the line through the two tabs (the Y axis): push the top towards +X (the pocket
   face) to break, so both tabs bend across their 2.6 mm thickness at the same time. File the two small pads left on
   the lobe tips flush.
   Known shop caveat: PO-3 returns to +X for T2/T3/T4 work after the -X slab has opened the stub (to 21 % section).

## What the loop changed (summary)
- it1: path simplifier was 2D (flattened ball passes -> big wave gouge); M6/Z150 inside the 159.5 mm stock in TOP.
- it2: TOP frame shifted +20 (G68.2 Z20), rings cover region centres, ramps start above the real stock.
- it3: holder/shank check for every raster point against the voxel stock; T14 for outline edge rounds; exact face passes.
- it4: valid. T13 kept off the ridge junction; cone rings; split steep drops in rasters.
- it5/6: T13 (R1 ball) top-down waterlines at the crest/floor and ridge junctions (it5 invalid: missing T7 tool change).
- it7: cycle-time trims (stepovers) only. it8: same program, re-simulated only to publish the corrected notes.
