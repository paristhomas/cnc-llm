# Acceptance criteria: 3+2 indexed 5-axis (fixed 2026-11-20, before any 3+2 LLM results)

Independent reviewer agents check these. Criteria A–D of `docs/ACCEPTANCE.md` still apply wherever relevant. This
file lists only what is new.

## E. Simulator and evaluation (3+2)
1. **Frame maths.**
   - `G68.2` Euler ZXZ examples give the documented tool axes.
   - Exact material checks in a tilted frame agree with analytic and brute-force geometry (`tests/test_sim5.py`).
2. **Independent cross-check.** MillBill's kernel, evaluated per frame, agrees on ≥ 99.99 % of query points for every
   final 3+2 program.
3. **Strict dialect.** Malformed `G68.2`, tilt beyond A 110°, motion before `G53.1`, and a second `G68.2` without
   `G69` are all errors.
4. **Collisions.** Tool or holder contact with the vise jaws, vise body or table is detected for every move,
   including rapids, in every orientation.
5. **Rigidity.**
   - The connection area in the stub gap is measured after every setup.
   - Before the `(PART-OFF)` marker it stays at or above 50 % of the stock section; otherwise the run is INVALID.
6. **Part-off.** It is required, and must leave between 2 mm² and 15 % of the section. Tab sizes are reported.
7. **Score.**
   - The headline is the share of the 3+2-reachable surface within ±0.1 mm.
   - Reachability is computed from geometry only: the smallest library tools, from 26 cube directions plus the part's
     own feature axes within the tilt limit, with the vise as an obstacle.
   - The whole-surface score is also reported.
   - The parting face is excluded (hand-finished), as is the 0.03 mm edge band.
8. **Fixture choice.** It is made by the LLM from the geometry, supported by `fixture-suggest` (reachability and
   slenderness). The reasons are written down in the run's `plan.md`.

## F. Report (3+2)
1. Everything in A1–A10 also holds for 3+2 reports.
2. **Animation.**
   - The animation shows the vise, stock and part, and the tool tilted along each setup's axis.
   - Each re-orientation is clearly visible.
   - Material is removed live in every orientation.
3. The setup timeline shows which orientation and tools are active, with the G-code listing synced to it.
4. The rigidity and part-off section shows the connection after each setup against the limits, plus a visual of the
   final tabs or web.
5. The final result view distinguishes three things: "not reachable in 3+2", the parting face, and LLM error.

## G. LLM results (3+2)
1. **Showcase.** FTC-10 at native scale finishes with a VALID program and ≥ 95 % of the reachable surface in
   tolerance, with no gouge region larger than 1 mm².
2. **Validation.** At least one held-out part (CTC-04 at ×0.2) is run with the frozen skill and reported honestly.
3. **Machinist review.** A machinist reviewer agent reviews the FTC-10 program and fixture plan. Its verdict covers:
   workholding, setup order, tool reach, the part-off, and whether the program would run.
