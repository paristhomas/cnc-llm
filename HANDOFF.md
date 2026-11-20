# Handoff: LLM-driven CNC G-code generation with simulation feedback (P0)

_Written 2026-11-20 by the lead agent (Claude Code, autonomous overnight run). Log: `PROGRESS.md`. Criteria:
`docs/ACCEPTANCE.md`. Independent reviews: `docs/reviews/`._

## TL;DR
- A Claude Code subagent, following `skills/cnc-gcode/SKILL.md`, writes its own toolpaths (its own Python, no CAM
  libraries) for non-trivial aluminium parts. It refines them against an exact 3-axis material-removal simulator.
- **All 7 parts ended with a VALID program and >= 99.18 % of the machinable surface within ±0.1 mm**, with no
  gouges. Dev parts took 2–4 simulator iterations; the held-out validation parts scored 100.000 % (gimbal_arm, 2
  iterations) and 99.18 % (impeller, 7 iterations, needed 6 to clear shank-contact errors between the blades).
- The simulator agrees exactly with an independent implementation: MillBill's parser + swept-volume kernel, 100 % of
  roughly 270–300k query points per run.
- Every run has a static web report: header verdict, 3D cutting replay with the G-code listing, a deviation-coloured
  result view, iteration history with the LLM's notes, issues and metrics. `runs/index.html` lists all runs.
- **Not pushed to GitHub**: every push returns 403 because the Claude GitHub App is not installed on
  `paristhomas/cnc-llm`. All work is committed on the local branch `claude/llm-cnc-gcode-simulation-y34uu9`.

## Results (trusted final evaluation, fresh process)
| Set | Part | Score (machinable in ±0.1) | Program | Gouge | Max gouge mm | Undercut / tool-limited excl. | Iter used / run | Cycle min | MillBill agree |
|---|---|---|---|---|---|---|---|---|---|
| validation | gimbal_arm | **100.000%** | VALID | 0.00% | 0.039 | 0.0% / 0.01% | 2 / 2 | 9.9 | 100.0% |
| validation | impeller | **99.177%** | VALID | 0.00% | 0.043 | 0.0% / 0.63% | 7 / 7 | 54.3 | 100.0% |
| dev | cam_plate | **99.871%** | VALID | 0.00% | 0.003 | 0.0% / 0.10% | 2 / 2 | 12.5 | 100.0% |
| dev | heatsink | **100.000%** | VALID | 0.00% | 0.000 | 0.0% / 0.00% | 3 / 3 | 14.4 | 100.0% |
| dev | motor_mount | **100.000%** | VALID | 0.00% | 0.000 | 0.0% / 0.00% | 3 / 4 | 6.7 | 100.0% |
| dev | mould_cavity | **99.665%** | VALID | 0.00% | 0.004 | 0.0% / 0.01% | 2 / 2 | 19.3 | 100.0% |
| dev | undercut_block | **99.957%** | VALID | 0.00% | 0.001 | 19.6% / 0.06% | 2 / 2 | 12.6 | 100.0% |

Published report artifacts (private to the owner until shared):
- mould_cavity: https://claude.ai/artifact/QQG1hjNEzEUt5V9KzT7yb7
- heatsink: https://claude.ai/artifact/HLsS6HPbCQzJMUedGY879x
- motor_mount: https://claude.ai/artifact/XTERMGHa919kD3RBrFTRVj
- cam_plate: https://claude.ai/artifact/7zMRczNHDkJZsfaRsoLBEG
- undercut_block: https://claude.ai/artifact/8p1ESCVssaKnbtviiNjUxn
- gimbal_arm (validation): https://claude.ai/artifact/WReobKHDMkX5S1RziRLweg
- impeller (validation): https://claude.ai/artifact/CpYchaiUiq8b5fYMPZTQhY

## How it works
| Piece | File | Notes |
|---|---|---|
| Job brief | `cncllm/brief.py` | stock, fixture, machine/dialect, tool library, holder model, B-rep geometry digest, images, STL + 0.05 mm height map |
| Parser | `cncllm/gcode.py` | strict LinuxCNC subset; anything unmodelled is an **error**; arcs linearised at 0.5 µm chord |
| Tools | `cncllm/tools.py` | fixed library of 10 tools (flat 10/6/3/1.5, bull 8 r1, ball 6/3/1, 90° chamfer, 5 mm drill) |
| Kernel | `cncllm/kernel.py` | exact column height of the swept volume of a tool of revolution (flat/ball/bull/cone), numba |
| Simulator | `cncllm/sim.py` | grid replay (0.1 mm) for maps, crashes and engagement; grid-free exact point queries for the metric |
| Metric | `sim.signed_deviation` | probes on the B-rep surface (about 0.15 mm²/probe) marched along the normal: + proud / − gouge, capped at 5 mm |
| Exclusions | `cncllm/part.py` | datum (bottom) face; undercut (vertical ray hits the part); tool-limited (smallest flat/ball cannot reach); 0.03 mm face-edge band |
| Feedback | `cncllm/feedback.py` | regions (3D connected components), G-code lines that cut gouges, nearest passes for proud areas, images |
| Checks | `sim.py` | rapid into material, spindle off, shank above flute length, holder collision, below fixture, chip load, windowed cut cross-section, plunges |
| Trust | `cli._trusted_eval`, `crosscheck.py` | re-runs in a fresh interpreter, core-harness sha256 + git status, part hash, scan of generator imports, MillBill cross-check |
| Report | `report.py`, `viewer/` | three.js r170 bundled (esbuild), works offline from file:// |
| Skill | `skills/cnc-gcode/SKILL.md` | the loop: new-run → plan → generator → sim → read feedback → revise → evaluate |

## Anti-reward-hacking measures
1. The program text is the only artifact that crosses the boundary. The LLM never touches the simulator's state. The
   final score comes from a fresh-process re-run of the repository code.
2. Strict dialect and a fixed tool library: no unmodelled codes, no invented tools, no cutter compensation to
   misinterpret.
3. Two-sided metric: gouge and proud both fail. Volumes are reported, so "remove everything" or "remove nothing"
   cannot score.
4. Exclusions depend on geometry only, never on the program.
5. Safety errors make the program INVALID whatever its surface score.
6. Generator code is scanned for simulator or CAM-library imports. The harness hash and git status are recorded.
7. Independent re-implementation cross-check (MillBill) on every final program.
8. Validation parts were held out: their agents were told not to read the CAD sources, other runs or the harness
   source.

## Independent reviews (agents that did not build the work)
- Report pages, criteria A: `docs/reviews/report_review.md`. First pass: 8 of 10 criteria passed outright, A3/A9 with defects and A5 FAILED (false red walls in the machined-surface view, line/move off-by-one, weak overlays). All fixed; the independent re-check marks A3, A5 and A9 PASS, so A1–A10 all pass.
- Machinist, criteria C4: `docs/reviews/machinist_review.md`. Both reviewed programs were judged **RUN WITH MINOR
  EDITS**: no crash risks, and chip loads at or below the library values. Valid points were folded into the skill:
  profile last, higher retract, slender-tool caution. One finding was wrong and is fact-checked in the file: the
  passes are climb, not conventional.

## Notes from the validation runs
- impeller: the rim chamfer named in the part description is missing from the CAD (CadQuery chamfer failed silently
  in the generator). The description is wrong, not the score. The remaining 0.82 % is proud material in the acute
  (~77°) dish/blade corners; even the 1 mm ball cannot reach it, and the tool-limited exclusion (0.63 %) only partly
  covers it.
- The shank-contact check fires on 0.06 mm³ slivers left where two passes' chords differ by about 3 µm. That is
  physically real but costly to diagnose. Next: report the sliver size and say "chord mismatch" in the feedback.

## Known gaps / next steps
- **GitHub push** needs the Claude GitHub App installed on the repo (https://github.com/apps/claude/installations/select_target).
- Height-field model: one setup from +Z with a box stock. Undercuts are excluded, not machined. Multi-setup would
  need a tri-dexel model or MillBill's setup frames.
- The chip-load check uses tool-centre feed, so small internal arcs read as "rubbing" (warning only). Make it
  arc-aware.
- Holes deeper than a small tool's stick-out count against the score rather than as tool-limited. Make the
  tool-limited classification holder-aware: an attempt was too noisy and was reverted.
- The deviation cap of 5 mm shows as "+5.000" on tiny residual regions. Display it as "≥ 5 (cap)".
- The parts are generated (CadQuery), because MillBill's part STEPs are not distributed and GrabCAD/HuggingFace were
  unreachable. Next: run on real customer or GrabCAD parts via `cncllm init-part`.
- Usage: one Opus subagent run costs about 100–150k tokens per part (2–4 iterations).

## Reproduce
```bash
pip install -e .
python -m pytest -q tests/test_sim.py                  # 41 analytic + safety tests
RUN=$(python -m cncllm new-run parts/validation/impeller)
# ... let Claude follow skills/cnc-gcode/SKILL.md ...
MILLBILL_DIR=~/millbill python -m cncllm evaluate $RUN && python -m cncllm index
```
