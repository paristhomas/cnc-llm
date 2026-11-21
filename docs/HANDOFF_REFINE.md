# Handoff: 3+2 refinement phase (branch `claude/3plus2-refine`)

_Written 2026-11-21 by the lead agent. This was an overnight autonomous run; the owner was not available.
Brief: `docs/BRIEF_REFINE_3PLUS2.md`. Criteria fixed before any result: `docs/ACCEPTANCE_REFINE.md` and
`docs/reviews/CRITICAL_REVIEW_CHECKLIST.md`. Log: `PROGRESS.md`._

> **Not pushed.** A local hook on this machine blocks pushes to public repositories without the owner's consent, and
> I did not work around it. Everything is committed locally (WSL `~/cnc-llm` and the Windows clone
> `Documents/open_source/cnc-llm`). To publish: `git push origin claude/3plus2-refine`.

## The owner's 5-minute check
1. **Headline.** Open the FTC-10 report (artifact https://claude.ai/artifact/8SUv9o6UWXEH1dwkh3xe2a, private to the owner until shared; or
   `runs/ftc10/20261121-012221-refine/report/index.html`). The headline is the **whole-surface** score, 99.89 %. The
   tab witness (0.16 %) is shown separately. Nothing else is excluded; the edge band is scored by its neighbours.
2. **Machine view.** Press "Play the first table move". At each change of orientation, the cradle (A) and the platter
   (C) carry the vise and the part, and the spindle never tilts.
3. **Result view.** Anything not green is a failure, except the purple tab witness. Click a region (R1 is the cone at
   the bottom of the deeper Ø5.5 hole) and the camera looks at it and says why it failed.
4. **Part-off.** Two tabs of 11.4 mm², each 2.6 mm wide, under the two bottom lobes. Snap by rocking the part towards
   +X, then file flush.
5. **Reviews.** Read the verdict tables in `docs/reviews/`. Round 1 is `critical_review_refine*.md`; round 2 is
   `*_v2.md`; the machinist review is `machinist_review_ftc10_refine.md`. Round 3 is pending; see the end of this file.

## Results (trusted evaluation, clean checkout of frozen harness v3 `2a3b37d`)
| Part | Role | Whole surface in ±0.1 | Valid | Tabs | Witness | Cycle | MillBill |
|---|---|---|---|---|---|---|---|
| **NIST FTC-10** (native) | showcase | **99.890 %** (proud 53 mm², no gouge) | **yes** | 2 × 11.44 mm², 2.6 mm wide; ≤ 24.4 mm² up to the part | 0.157 % | 117.6 min | 100 % of 250k points |
| **NIST CTC-04** ×0.2 | held-out validation | 99.061 % (no witness exclusion because invalid) | **no**: tabs total 31.2 mm² at Z−0.2, over the 30 mm² limit | 2 × 11.96 mm² at the weakest plane | — | 114.3 min | 100 % |
| FTC-10 run 2 (previous phase), re-scored | baseline | 79.50 % (v1 rules) | **no**: underside left proud, joined to the tabs | 2 × 6.5 mm² | — | 85.8 min | — |
| FTC-08 ×0.5 (previous phase), re-scored | baseline | 80.06 % (v1 rules) | **no**: 2,651 mm² web | — | — | 40.5 min | — |

**The previous phase's "96.3 % of reachable surface" was 79.5 % of the whole surface. This phase's showcase is
99.89 % of the whole surface,** with the underside machined and only two hand-removable tabs left.

**The held-out CTC-04 run fails validity under the final, strictest harness.** Its tabs flare to 31.2 mm² just under
the part. That is 1.2 mm² over the limit v3 now applies at every height, after the second review's attack N1.
- Under v2.1, which checked the total only at the weakest plane, it was VALID at 99.132 %.
- It is held out, so it was not re-run. The result is reported as it stands.

### What is still failed, and why
- **FTC-10, R1 (13.2 mm²).** The drill-point cone at the bottom of the deeper Ø5.5 axial hole, 36 mm below the top
  face. Only the outer ring was cut, with the flat T11.
  - The agent's argument: T14's Ø6 shank would enter the hole, T13's Ø16 holder would hit the top face, and the T10
    drill's holder hits the ears.
  - The second reviewer checked this against the tool dimensions and agrees. It is not demonstrated in the simulator,
    and it still counts as failed.
  - A longer-necked R1 ball would likely reach it.
- **FTC-10, the rest (40.2 mm²).** About 30 small regions: lobe and notch edge rounds, and the ridge/wave B-spline
  blend, each under 3 mm², at +0.10 to +0.2 mm. The report's Problems list shows the largest ones;
  `final/regions.json` has all of them (v3 lists up to 100).
- **CTC-04.**
  - Four r1 holes along the vertical axis through the blocks: 128 mm², up to +5 mm.
  - Engraved lettering: 42 mm², not programmed.
  - r1 plan-view corners: about 75 mm², +0.13 to +0.22 mm.
  - Drill-point cones: about 25 mm², about +0.35 mm.
  - Taper and end radius next to the tabs: about 19 mm².
  - **The CTC-04 agent's final report to me said the four holes are unreachable ("From +Z every library holder hits
    the body").** That sentence is not in its run files. The first critical reviewer showed it is wrong: one added top
    setup with T13 plunges gave 99.395 %, valid under v2.
  - The harness's reach hint can miss a tool whose radius equals the hole radius, which likely misled the agent.

### Post-review revisions of FTC-10 (labelled in the run's notes and in the report)
- **Iteration 9, machinist review.** All five listed edits were made:
  - explicit retracts before every index and tool change;
  - arc-compensated helical feeds;
  - T1 at S15000 for the top-of-part roughing in setup 1;
  - a ramped web entry;
  - bottom finishing moved before the part-off slab.

  Not done:
  - T1 still runs at 18,000 rpm in setups 2–8, where the ~900 Hz concern may also apply;
  - the grip is still 12 mm (20 mm suggested);
  - T11 still bores about 13 mm from solid;
  - the tab pin can be up to 6 mm long;
  - about 8 min of +X work still follows the −X slab.

  Cycle time went from 90.8 to 116 min.
- **Iteration 10, critical-review finding M5 (a silent miss).**
  - Long-neck ball passes in the drill-point cones: 99.847 % → 99.890 %.
  - New in iteration 10: seven small cone helices run at up to 3.9× the library chip load (second review, E1).
    Reduce them before running the program.

## Harness versions (all changes tighten; each is dated in `docs/ACCEPTANCE_REFINE.md`)
| Version | Frozen | Why |
|---|---|---|
| v1 | `1cbfa1d` | Before any LLM run: whole-surface score, part-off and tab witness, integrity, long-reach tools, exact fixture check. |
| v2 / v2.1 | `87fb673` | Round 1 findings M1–M4: tab pads, witness growth, scan bypasses, in-tree trust. The edge band is now scored. v2.1 fixed my own part-verification bug, which had rejected every run. |
| v3 | `2a3b37d` | Round 2 findings: tab total and count at every height (N1), parts manifest (N3), wider scan (N2), 100 regions. |

The final evaluations use v3:
```bash
CNCLLM_EXPECTED_HARNESS=63bd0ddc6479d309e2f6091ddf771cadce756f4c3af560610fb38f2ab2e619a0 \
  tools/frozen_eval.sh runs/ftc10/20261121-012221-refine 2a3b37d --iter 10
```
The expected sha256 is taken from this file and the acceptance addendum, never from `harness_frozen.json` in the tree
being evaluated.

## What was built this phase
| Piece | Where | Notes |
|---|---|---|
| Whole-surface score | `sim5.surface_metrics5`, `edge_scored_dev` | Nothing is excluded except the tab witness (only if the part-off is valid). |
| Part-off analysis | `sim5.tab_sections`, `tab_witness`, `partoff_analysis` | Exact sections every 0.5 mm. Validity, checked at every height from the weakest plane to Z−0.2: 2–30 mm² in total, ≤ 4 tabs, each ≤ 3 mm wide; witness ≤ 1.5 %. The joint is limited to tab-body footprints. |
| Integrity | `x5._trusted_eval`, `integrity_failures`, `verify_part`, `scan_generator5`, `parts/manifest.json`, `tools/frozen_eval.sh` | INVALID if the harness hash differs from the expected one, harness files have uncommitted edits, the part is not re-derivable from the manifest STEP, scale and fixture, or generator code touches the simulator. |
| Long-reach tools T11–T14 | `cncllm/tools.py` | Catalogue long-neck families, conservative chip loads. Neck and shank modelled (flag 32). Evidence in `docs/FTC10_REACH_AUDIT.md`. |
| Exact fixture check | `kernel5.fixture_hits2` | Discs against the vise and table boxes, 1 mm clearance. Replaces a capsule model that reached 16 mm below holder faces. |
| Reach audit | `tools/reach_audit.py`, `docs/FTC10_REACH_AUDIT.md` | FTC-10 standing on its −X end, with T11–T14: 99.6 % reachable. The previous `+Z` orientation is capped near 97 %. |
| Images | `x5._views_png`, `iso_png`, `partoff_png`, `cncllm/figs.py` | Z-buffered six views; shaded iso; part-off with per-tab zooms; transparent hero render of the finished part. |
| Machine view and report | `cncllm/viewer/src/{kin5.mjs,machine5.js,simview5.js,resultview5.js}`, `report5.py` | Trunnion A/C table motion; DRO readout; `window.__machineCheck` self-check (spindle error 1.6e-16, tip vs Part view 5e-14 mm); honest headline; plain-English summary; clickable failures; 3D tab close-up. |
| Review tooling | `tools/review_report.py`, `tools/rebuild_report.py`, `docs/reviews/CRITICAL_REVIEWER_PROMPT.md`, `docs/LLM_AGENT_PROMPT.md` | |
| Tests | `tests/test_refine_eval.py`, `test_review_attacks.py`, `test_review_v2_attacks.py`, `test_tools_refine.py`, `test_machine_view.py` | Every reviewer attack is a regression test. |

## Known gaps and next steps
- **Chip-load check.** It uses the tool-centre feed, so edge-compensated helical feeds read as "rubbing" (65k warnings
  on FTC-10). Make it arc-aware.
- **Rigidity check.** It stops at the `(PART-OFF)` marker no matter how much machining follows. Limit the work after
  the stub is opened.
- **Reach hint.** It misses exact-fit tools and runs on a coarse raster. It is a hint only, but it misled the CTC-04
  agent.
- **Generator scan.** It is a deny-list. An agent with a shell can still reach the simulator by other means. OS-level
  isolation (a separate user with no read access to `cncllm/`) would close it.
- **Tab flare.** Horizontal side-milling flares tabs towards the part. The skill should tell agents to keep the
  flared joint under 30 mm² (CTC-04 missed by 1.2 mm²).
- **Commit trailers.** They carry a model name, because the harness attribution requires it. This conflicts with
  brief §7 ("never put model identifiers in commits"); the owner should decide which rule wins.
- **Speed.** Simulations take 1–3 min per iteration. A full LLM run is 2–3.5 h and about 0.45–0.55M tokens.

## Usage (approximate, subagent tokens)
| Agent | Tokens |
|---|---|
| FTC-10 run, including two post-review iterations | ~0.55M |
| CTC-04 run | ~0.45M |
| Viewer and report | ~0.9M |
| Machinist reviewer | 0.23M |
| Critical reviews | round 1 ~0.6M, round 2 ~0.55M |

## Reviews, final round
_Pending; filled in after the round-3 verification._
