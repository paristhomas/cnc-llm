POST-REVIEW REVISION 1 (addresses the machinist review, docs/reviews/machinist_review_ftc10_refine.md):
explicit G0 retract along the tool axis before every index, to a frame Z beyond the sweep radius of the whole stock (frame Z 170.6; TOP frame Z151.4 = G54 Z171.4), and to the frame safe height before every M5/T M6.
Helical holes and cone rings: feed programmed at the tool centre so the peripheral feed at the wall equals chip load x flutes x rpm (T2 1152, T3 480 (6 mm holes), T4 187, T11 157, T12 206); T11 pitch 0.2 below the pre-drill, T12 pitch 0.3.
T1 top roughing at S15000 F2700 (750 Hz tooth passing, off the ~900 Hz stock bending mode). Ramp into the web instead of the plunge.
T7/T13 bottom finishing moved ahead of the -X part-off slab; only T14 (goes below Z0), the +X work, slab and web cut follow it.
