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
