# Progress log — LLM-driven CNC G-code (P0)

Autonomous overnight run. Newest entries at the bottom.

## Decisions (from the 2-minute Q&A, 2026-11-19)
- LLM = Claude Code subagents driven by a skill (no API key).
- Parts: MillBill repo checked first — it only ships *stocks* (`blank.step`) + GrabCAD links; part STEPs are not
  included and HuggingFace / GrabCAD are unreachable (proxy 403, login wall). => parts generated with CadQuery.
- Simulator: our own (exact column/height-field swept volume, numba), cross-checked against MillBill's independent
  parser + exact swept-volume `inside()` kernel (MIT).
- Delivery: static HTML reports committed under `runs/`; PR at the end.

## Log
- 22:45 Milestone 1: strict G-code parser, fixed tool library, exact swept-volume simulator (numba; grid replay +
  grid-free point queries), surface metric (two-sided, undercut/tool-limited exclusions), feedback (regions with
  G-code line attribution, images), brief generator, CLI. MillBill cross-check: 100% agreement (beyond 2 um) on a
  program with arcs, helices, G81/G83, ball/bull/cone tools. 7 CadQuery parts (5 dev, 2 validation).
  Acceptance criteria fixed in docs/ACCEPTANCE.md (user asked for independent agent verification; deadline 10:00 UTC).
- 23:00 GitHub push blocked: 403 "Resource not accessible by integration" (Claude GitHub App not installed on
  paristhomas/cnc-llm). Committing locally at each milestone; push retried each time. **User action needed.**
- 23:05 Subagents launched: viewer/report builder (Opus), analytic test suite (Sonnet), LLM runs on motor_mount and
  mould_cavity (Opus, following skills/cnc-gcode/SKILL.md). Packaging: plugin + marketplace manifests, README.
- 22:50 Test suite: tests/test_sim.py, 41 analytic + safety tests, all pass (~2 s). No simulator bugs found. Holder test needs a taller stock (T4 stickout 14 > 11 mm stock).
- 00:00 Dev runs (harness v1): motor_mount 99.998% valid (4 iters, 6.7 min cycle); mould_cavity 99.66% valid
  (2 iters, 19.3 min). Both agents' friction lists -> harness v2: edge-band exclusion (probes within 0.03 mm of a face
  edge read +-5 mm for micron wall offsets), crash/overload messages with numbers and coordinates, holder/shank model +
  dialect clarifications in the brief, robust `evaluate`, networkx, `pip install -e` works from any directory.
  Tried "reach-limited" classification from holder geometry: too noisy (flags areas the long tools reach) -> dropped,
  documented holder model instead.
- 00:05 Dev runs on v2 launched: heatsink, cam_plate, undercut_block.
- 00:30 cam_plate (dev): 99.87% valid, 2 iters, 12.5 min. MillBill cross-check showed 3/270k disagreements: traced to
  points within 3 um of a bore wall + different arc chord tolerances (ours 2 um, MillBill 0.5 um) -> our arc_tol is now
  0.5 um and the noise test nudges in XY too -> 100% agreement. Proud regions now name the nearest passes and by how
  much they missed (was: last move that lowered the column, often the facing pass). Skill: fixed trimesh section tip
  (to_2D(to_2D=eye(4)) keeps model XY), shank-through-cleared-space rule, full-circle helices.
- 05:10 Overnight a 5-hour usage limit stopped the viewer agent and the undercut run (resumed at 05:00).
  Dev results (all VALID): motor_mount 99.998%, mould_cavity 99.665%, cam_plate 99.87%, heatsink 100.000%,
  undercut_block 99.957% (19.6% undercut surface excluded). Fixes: edge band also excluded from region tables,
  evaluate tie-break on cycle time, skill hints (ball contact on slopes, plunge threshold, cycle-time iterations).
  Validation runs launched (gimbal_arm, impeller) with the skill frozen.
  Known: chip-load check uses tool-centre feed (internal small-radius arcs read as "rubbing" warnings);
  holder blocks full-depth small holes deeper than stick-out (counts against score, not tool-limited).
  GitHub push still 403; Google Drive upload blocked by connector size limits (4.2 MB per call).
- 05:55 Validation (held out, skill frozen): gimbal_arm 100.000% VALID (2 iters, 9.9 min); impeller 99.177% VALID
  (7 iters; 6 spent clearing shank-contact errors between blades; residual = acute dish/blade corners).
  Independent reviews: report page A1-A10 (first pass A5 FAIL + defects -> fixed -> re-check PASS);
  machinist: both reviewed programs "RUN WITH MINOR EDITS" (one wrong claim fact-checked; valid points -> skill).
  Engagement check now windowed over 0.5 D of travel (0.5 um arc chords had inflated it). runs/index.html added.
  Artifact (mould_cavity report): https://claude.ai/artifact/QQG1hjNEzEUt5V9KzT7yb7. HANDOFF.md written.

## 3+2 indexed 5-axis (branch claude/3plus2-indexed-5axis)
- 2026-11-20 ~10:30 Start. User decisions: G68.2 tilted work planes; single vise; rigid stub until a final
  part-off that leaves tabs for the operator; fixture placement chosen from the geometry; NIST MBE PMI models as
  parts (public domain; found on GitHub mirrors); FTC-10 is the showcase part at native scale.
- 11:30 Core done:
  - parser: `G68.2` / `G53.1` / `G69` with a tilt limit;
  - `part5`: fixture placement with rigid rotation, plus the vise and table model;
  - reachability classes: smallest tools from 26 directions plus feature axes, with the vise as an obstacle;
  - `sim5`: exact per-frame metric; each segment's crash replay seeded from 0.25 mm voxels; vise and table
    collisions; rigidity and part-off checks;
  - `x5` CLI: fixture-suggest, new-run, sim, evaluate;
  - brief and feedback;
  - MillBill cross-check per frame: 100 % agreement on a 4-frame test;
  - 10 new tests, all passing.
- Fixture-suggest on FTC-10: raw reachability prefers standing it up on its end (99.98 %), but that is slender
  (158 mm tall). A slenderness penalty was added; lying flat ("-Y") reaches 96.2 %.
- Launched: the 3+2 viewer/report agent; LLM runs on FTC-10 (showcase, native) and FTC-08 (×0.5).
  Acceptance criteria: `docs/ACCEPTANCE_3PLUS2.md`.
- 12:00 3+2 viewer/report done (report5.py, viewer5 bundle; each setup's exact cut surface is clipped in the shader,
  so material removal is exact at grid resolution; replay matched the simulator on 100% of cells).
  FTC-08 (×0.5, dev): VALID, 99.803% of the reachable surface in tolerance (98.35% of the whole surface), 28
  segments over 13 orientations, 40.5 min, MillBill 100%. The part-off left 14% (two webs to saw; the 156 mm
  footprint is beyond side-tool reach). It used about 300k tokens.
  Harness v5.1 from its frictions:
  - machine travel no longer checked in 3+2 mode, since the stub gap sits below G54 Z0;
  - the shank check allows an inclined move's own vertical travel;
  - vise-hit messages name the box and say whether the tool or the holder hit it;
  - the exported STL is welded;
  - the brief's face bounding boxes are worded clearly;
  - skill notes added: M5 before indexing, 0.3 mm shank clearance on 0.25 mm voxels, part-off reach.
- 17:00 FTC-10 showcase run 1 (360k tokens, 8 iterations): best valid result 81.3% (iteration 5); 86% iterations kept
  one shank error. Its key friction was an eval flaw: reachability ignored holders, so cross-hole middles counted
  as reachable. Harness v5.2:
  - holder-aware reachability over 7 tools, each at its own raster resolution;
  - the rigidity and part-off connection is now the weakest plane over the gap (rigidity limit 30 %);
  - crash messages give G54 locations.
  Re-scored without LLM cost:
  - FTC-08: 99.78 %, still VALID.
  - FTC-10: 87.15 % of the reachable surface (11.2 % now unreachable), but INVALID on rigidity: the part hung on
    thin necks.
  Acceptance doc annotated with both revisions. FTC-10 rerun launched with these lessons.
- 22:45 FTC-10 run 2 (showcase): VALID, 96.285 % of the reachable surface, 7 setups, part-off 2×6.5 mm² tabs,
  MillBill 100 %. Machinist review: RUN WITH MINOR EDITS. 3+2 report review: all criteria pass (5 defects fixed).
  Showcase artifact published. docs/HANDOFF_3PLUS2.md written. CTC-04 validation not run (usage).

## Refine phase (branch `claude/3plus2-refine`; brief `docs/BRIEF_REFINE_3PLUS2.md`)
Times are UTC. Pushing is blocked on this machine: a local hook refuses pushes to public repositories without the
owner's OK. Everything is committed locally in the WSL clone `~/cnc-llm` and mirrored to the Windows clone.

- 2026-11-20 23:30 Set-up.
  - cadquery's OCP DLL is blocked on Windows by Smart App Control, so all work runs in WSL Ubuntu (Python 3.12 venv).
  - All 51 existing tests pass.
  - Playwright/Chromium with SwiftShader WebGL is installed for screenshot reviews.
- 23:50 Fixed before any number: `docs/ACCEPTANCE_REFINE.md` (whole-surface score, tab witness, part-off, trust,
  Machine view, results) and `docs/reviews/CRITICAL_REVIEW_CHECKLIST.md` (including the page and results quality
  rubric).
- 00:10 Viewer and report agent started in its own worktree (`refine-viewer`): Machine view, honest wording, review
  script.
- 00:20 Evaluator implemented (R1/R2):
  - whole-surface score;
  - tab sections and widths;
  - tab witness (proud regions touching stub-connected tab tops);
  - part-off validity;
  - integrity failures that invalidate;
  - a stronger generator scan;
  - region hints instead of "unreachable";
  - z-buffered six-view, part-off and isometric images.

  Attack tests a–f pass (`tests/test_refine_eval.py`): big tabs, skipped underside, wall skin in the edge band,
  skipped face, gouge at a tab, and integrity.
- 00:25 Honest re-scores, no new G-code:
  - FTC-10 run 2: **79.50 %, INVALID**. The underside was left about 0.3 mm proud and touches the tabs (witness
    17.7 %); the bores and Ø5.5 holes were unfinished.
  - FTC-08: **80.06 %, INVALID**, with a 2,651 mm² web.
- 00:30–00:55 Reach audit over 12 orientations (`docs/FTC10_REACH_AUDIT.md`).
  - The previous `+Z` orientation is capped near 97 %: the bottom counterbores open into the stub.
  - Standing FTC-10 on its −X end, with four catalogue long-reach necked tools (T11–T14), the search reaches
    99.59 % of the surface.
  - Simulator support for necked tools: shank stage, flag 32.
  - The vise check now uses exact discs plus a 1 mm clearance, replacing the old capsule model that over-reached
    16 mm below holder faces.
  - 65 tests pass.
- 00:58 Harness frozen: sha `0b28d03c…`, commit `1cbfa1d`. Skill rewritten; reviewer and agent prompts committed.
- 01:00 LLM runs launched with the frozen skill: FTC-10 showcase (native) and CTC-04 ×0.2 held-out (not looked at by
  the developer).
- 03:20 FTC-10 showcase, LLM run with the frozen skill (it chose to stand the part on its −X end, grip 12):
  - **VALID, 99.866 %** whole surface; 2 tabs of 11.4 mm²; witness 0.23 %; 90.8 min; MillBill 100 %.
  - The trusted evaluation from a clean checkout of `1cbfa1d` reproduces it.
  - Usage: about 0.49M tokens.
- 03:40 Machinist review of FTC-10: RUN WITH MINOR EDITS.
  - Post-review iteration 9 applies all five edits: retracts, arc-compensated hole feeds, T1 off the 900 Hz mode,
    ramped web entry, finishing before the part-off slab.
  - Still 99.866 %; cycle 116 min.
- 04:00 CTC-04 ×0.2 held-out run: **VALID, 99.18 %**; 2 tabs of 12 mm²; witness 0.15 %; MillBill 100 %. Usage about
  0.45M tokens.
- 04:10–05:30 Critical review, round 1, by fresh agents.
  - Page: C4, C5, C7, C8 and W13 fail on presentation. The page was reworked by the viewer agent.
  - Evaluator: loopholes M1–M4 (tab pads, witness growth, scan bypass, trust of in-tree files), FTC-10 silent miss M5,
    a wrong CTC-04 "unreachable" claim M6, missing handoff M7, and the edge band over its limit at ×0.2.
- 05:30–06:30 **Harness v2/v2.1.** All loopholes closed (tightening only); the edge band is now scored by its
  neighbours. The reviewer's xfail attacks pass, and 80 tests pass. Frozen at `87fb673`. Both runs re-evaluated from
  a clean checkout: FTC-10 99.847 %, CTC-04 99.132 %, both VALID.
- 06:40 FTC-10 post-review iteration 10 (M5: ball passes in drill-point cones): **99.890 %, VALID** (trusted v2.1).
- 06:50 Reports rebuilt. Re-reviews by fresh agents started. `docs/HANDOFF_REFINE.md` written.
