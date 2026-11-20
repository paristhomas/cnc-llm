# ftc10 (NIST FTC-10) - 3+2 plan

## Fixture choice
`fixture-suggest` ranked `-Y up` first: reachable 96.2%, parting face 0.7%, slenderness 0.41. That means the part sits
flat at 158 x 75 x 31 mm with the large flat flange top (Z31) facing the spindle. The other options:
- `+-Z up`: 89.9%, slender (75 mm tall), 5-6% parting face.
- `+-X up`: 99.97% reachable, but slenderness 5.1. That is a 158 mm tower on a stub, which chatters.
- `+Y up`: 80%. The top pocket would face the parting plane.

The `-Y up` parting face is only the small flat boss under the right block (24 x 15 mm, Z0), which is non-critical.

I chose rot_z 90 for the vise:
- The long axis of the part runs along Y, so the jaws clamp the stub ends.
- The long sides (+-X), where most of the underside work is done with horizontal tools, have no jaw under the holder.

I chose gap 35 mm, so a D32 holder at the mid-gap (Z-17.5) still clears the jaw tops (Z-35) and the part-off can run
the full length.

## Stub / rigidity concept
- A pedestal is kept below Z-11 (below Z-17 beyond the body ends, to give the +-Y holders room).
- The "access zone" Z-11..0 under the part is cleared from the sides, so the underside can be machined.
- The part stays attached through necks:
  - under the boss (the parting face);
  - 4 small 3 x 8 mm strips under the bump bottoms.
- Rigidity at the mid-gap stays at 92.6% until the part-off.

## Setups
1. TOP (+Z, G68.2 origin Z-30):
   - T1: face, outer profile and 17 mm pocket (rough 2 mm levels, 0.3 allowance, then waterline finish).
   - T3/T4: rest machining of the pocket r2 corners and the flange-end r1 relief notches.
   - T3: helical ear holes.
   - T7 ball: pocket floor r2 fillet.
2. +X and 3. -X (horizontal):
   - T1: rough and finish the access zone, the wavy bottom, the end walls and the flange undersides, reaching to X=-+1.5.
   - T2: helical counterbores (r5) and the cross holes (r3.5) as deep as the holder allows (X=+-8.6).
4. +Y:
   - T1, then T5 bull nose: the channels under the right block (rib, box, boss sides, Z8 faces) and the r1
     end-wall/flange fillet.
   - T3: the first 5 mm of the two Y-axis holes.
5. -Y: T5 for the left end wall and the flange fillet.

## Part-off
- (a) A slot through the pedestal at mid-gap (Z-22.5..-12.5) from +-X, leaving 2 tabs at the stub ends.
- (b) The necks are cut 0.35 mm under the part from +-X (T1 at Z-5.35), leaving 2 tabs of 2.5 x 1.5 mm at the boss
  (the parting face).

## Known limits
Holders make the following impossible with this library:
- the middle 17 mm of the four 7 mm cross holes;
- most of the two 5.5 mm Y-axis holes (the flange blocks the holder);
- the eight 2.5 mm pocket-floor holes (the T4 holder hits the pocket walls).

The harness nevertheless scores these as reachable.
