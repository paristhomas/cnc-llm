# Acceptance criteria (fixed 2026-11-19 22:45 UTC, before results were seen)

The work is checked by **independent reviewer agents**, not by the agent that built it. Reviewers get these criteria, the
repository and the published report pages, and nothing else (no build conversation). Each criterion is PASS / FAIL with
evidence (a screenshot, a command output, a file path). Deadline for the final version: **10:00 UTC, 2026-11-20**.

## A. Per-run web report (primary success measure)
Reviewed in headless Chromium at 1440x900 and 390x844 (phone), screenshots attached.
1. Opens from the file system (static HTML, no server), no console errors, loads in < 5 s on a laptop.
2. Header states part, material, tolerance, model/agent, date, final score and VALID/INVALID in one glance.
3. 3D cutting animation: stock block visibly shrinks as the tool moves along the LLM's G-code; tool model (correct
   type/diameter) rides the path; play/pause, speed, scrubber with program line number; current G-code line shown.
4. Toolpath view distinguishes rapids from cutting moves and tools by colour, with a legend.
5. Final result view: machined surface coloured by deviation (gouge / in tolerance / proud) with a colour bar; the
   target part can be overlaid or toggled; undercut and tool-limited regions are distinguishable from LLM error.
6. Iteration history: score per iteration (chart) and what the LLM changed each time (its notes).
7. Metrics table, safety/plausibility issues with G-code line numbers, tool list, cycle time.
8. G-code is downloadable and viewable.
9. Looks professional: consistent typography/colours, no overlapping or clipped elements, readable at phone width,
   dark and light mode both legible.
10. Reviewer can say from the page alone what the part is, how good the result is and where the problems are.

## B. Simulator trustworthiness and anti-reward-hacking
1. Analytic tests pass (`pytest`): slot width = tool diameter, ball-nose scallop height formula, arc/helix geometry,
   drill cycles, R-format arcs, full circles.
2. Independent cross-check against MillBill's parser + exact swept-volume kernel agrees on >= 99.99 % of query points
   (beyond 2 um) for every final program.
3. Unsupported G-code is an error, never ignored; tools come only from the fixed library.
4. Crash checks fire on crafted bad programs: rapid through material, spindle off, shank/holder collision, below
   fixture, overloaded cut. A program with errors is reported INVALID regardless of surface score.
5. Score is two-sided (gouge and proud both fail); undercut / tool-limited exclusions are computed from geometry only.
6. Final evaluation re-runs in a fresh process from the repository code and records a harness hash + git status, so
   a modified simulator would be visible in the report.

## C. LLM loop and results
1. The LLM (a Claude Code subagent) writes the G-code itself or writes its own toolpath code (no CAM libraries);
   every iteration is simulated and the feedback is what drives the next revision.
2. At least 4 development parts and 2 held-out validation parts (not used while refining the skill), none trivial.
3. Validation targets: VALID program and >= 90 % of machinable surface within 0.1 mm, no gouge region > 1 mm2.
   (Reported honestly whatever the outcome.)
4. Plausibility: a machinist-reviewer agent reads one final program and judges it runnable (sane feeds/speeds,
   step-downs, clearances, tool order).

## D. Packaging
1. `skills/cnc-gcode/SKILL.md` + plugin marketplace manifest installable from GitHub; README quick start works on a
   fresh clone (`pip install -e .`, run a part, open the report).
2. A user can bring their own STEP + stock box.
3. `PROGRESS.md` kept up to date; `HANDOFF.md` written at the end with results, known gaps and next steps.
