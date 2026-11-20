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
