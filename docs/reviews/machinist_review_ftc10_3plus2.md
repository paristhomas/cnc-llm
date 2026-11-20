# Machinist review: ftc10 3+2 (run2)
Verdict: RUN WITH MINOR EDITS (dry-run first). Sim: 0 errors/0 warnings, 96.3% reachable in tol, 7 setups / 5 orientations, 85.8 min.

Structure: +Z (T1 rough/finish, T3, T6, T2) -> -X (A90) -> +X (A90) -> part-off: 2x A55 (+-Y) roughing in the stub gap, then -X and +X slot passes with T1 leaving 2 tabs of 6.5 mm2 each (13 mm2 total). Every index has M5 / G69 / G68.2 / G53.1; M3 restored after. Tool changes M5, T M6, G43.
Cutting data (Al): T1 S18000 F3240 side / F1080 plunge (0.06 mm/t, ok); T2 S24000 up to F4000 (about 0.055 mm/t vs 0.04 library); T6 ball F4000 (0.083 mm/t vs 0.03, finishing raster, high); T3 F320-960; T4 (1.5 mm) F160-288 helical 0.25 mm per rev (ok but slow); rough passes 1-2 mm deep, 5 mm stepover on a 10 mm cutter.

Top issues
1. Part-off leaves only 13 mm2 in two thin tabs (6.5 mm2 each). Breakable by hand, but a 75 mm tall x 158 mm long part hangs on them: it can crack off or vibrate during the last +X passes, and the tab break leaves witness marks on the face. Use 2-4 tabs of about 20-30 mm2 total, placed at the ends. Also say which side the operator should break from.
2. Only an 8 mm grip below a 16 mm gap, with 10 mm roughing from +-X at F3240 and 18000 rpm. Rigidity check passes (minimum 59% before part-off), but chatter and vise slip are plausible. Keep the first -X/+X roughing at reduced stepover, or fixture a clamp with a taller jaw (deeper grip).
3. About 3.7% of the reachable surface is proud, up to +5 mm (R1 855 mm2 on r1 cylinders, R2, R25, R27, R29 +5.0 mm). Several of these are T2/T6 passes that skip material or are not covered at all. Inspect before finishing; some features will need a re-run or a manual pass.
4. T6 ball raster feed (0.083 mm/t) and T2 at F4000 exceed the library chip load by 1.5-3x. Probably fine at finishing depths, but check the spindle load and surface on the first part. Drop the T6 feed to about 2000-2500.
5. Setup order revisits -X/+X after the A55 pair (setups 6-7), which adds 4 extra indexes; fine in time, but each re-index with the stub already cut to 33% (setup 6) weakens the part. Prefer to do all part-off passes in one pass per side, ending with the smallest section last. Index retracts to Z150, clearance is ok (no crash flagged).

Positives: step-downs and entries are helical or ramped, there are no rapids into material, and climb-milling direction was not checked in detail (spot-check inside profiles are CCW).
