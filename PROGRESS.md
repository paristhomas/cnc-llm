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
