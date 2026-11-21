# Handoff: 3+2 refinement phase (branch `claude/3plus2-refine`)

_Written 2026-11-21 by the lead agent. This was an overnight autonomous run; the owner was not available.
Brief: `docs/BRIEF_REFINE_3PLUS2.md`. Criteria fixed before any result: `docs/ACCEPTANCE_REFINE.md` and
`docs/reviews/CRITICAL_REVIEW_CHECKLIST.md`. Log: `PROGRESS.md`._

> **Not pushed.** A local hook on this machine blocks pushes to public repositories without the owner's consent, and
> I did not work around it. Everything is committed locally (WSL `~/cnc-llm` and the Windows clone
> `Documents/open_source/cnc-llm`). To publish: `git push origin claude/3plus2-refine`.

## The owner's 5-minute check
1. **Headline.** Open the FTC-10 report artifact (link below, or `runs/ftc10/20261121-012221-refine/report/index.html`).
   The headline is the **whole-surface** score, 99.89 %. The tab witness (0.16 %) is shown separately. The edge band
   is no longer excluded.
2. **Machine view.** Press "Play the first table move". At each change of orientation, the cradle (A) and the platter
   (C) carry the vise and the part, and the spindle never tilts.
3. **Result view.** Anything not green is a failure, except the purple tab witness. Click a region (R1 is the cone at
   the bottom of the deeper Ø5.5 hole) and the camera looks into it and says why it failed.
4. **Part-off.** Two tabs of 11.4 mm², each 2.6 mm wide, under the two bottom lobes. Snap by rocking the part towards
   +X, then file flush.
5. **Reviews.** The verdict tables are in `docs/reviews/critical_review_refine_v2.md` and
   `docs/reviews/critical_review_refine_page_v2.md` (re-reviews after fixes), and
   `docs/reviews/machinist_review_ftc10_refine.md`.

## Results (trusted evaluation, clean checkout of frozen harness v2.1 `29abeb2`)
| Part | Role | Whole surface in ±0.1 | Valid | Tabs | Witness | Cycle | MillBill | Iterations |
|---|---|---|---|---|---|---|---|---|
| **NIST FTC-10** (native) | showcase | **99.890 %** (proud 53 mm², no gouge) | yes | 2 × 11.44 mm², 2.6 mm wide | 0.157 % | 117.6 min | 100 % of 250k points | 8 loop + 2 post-review |
| **NIST CTC-04** ×0.2 | held-out validation | **99.132 %** (proud 355 mm², no gouge) | yes | 2 × 11.96 mm², 2.6 mm wide | 0.146 % | 114.3 min | 100 % | 6 |
| FTC-10 run 2 (previous phase), re-scored | baseline | 79.50 % (v1 rules) | **no**: underside left proud, joined to the tabs | 2 × 6.5 mm² | — | 85.8 min | — | — |
| FTC-08 ×0.5 (previous phase), re-scored | baseline | 80.06 % (v1 rules) | **no**: 2,651 mm² web | — | — | 40.5 min | — | — |

**The previous phase's "96.3 % of reachable surface" was 79.5 % of the whole surface. This phase's showcase is
99.89 % of the whole surface,** with the underside machined and only hand-removable tabs left.

### What is still failed, and why
- **FTC-10, region R1 (13.2 mm²).** The drill-point cone at the bottom of the deeper Ø5.5 axial hole, 36 mm below the
  top face. Only the outer ring was cut, with the flat T11.
  - The agent's geometric argument: T14's Ø6 shank would enter the Ø5.5 hole, T13's Ø16 holder would hit the top
    face, and the T10 drill holder hits the ears.
  - This was **not** demonstrated in the simulator. It still counts as failed.
  - A longer, thinner-necked ball (for example R1 with a 40 mm neck) would likely reach it.
- **FTC-10, the rest (about 40 mm²).** Edge rounds on the lobes and notch, and the ridge/wave B-spline blend, each
  under 3 mm², at +0.10 to +0.2 mm.
- **CTC-04.**
  - Four r1 holes along the vertical axis through the blocks: about 128 mm² in total.
  - Engraved lettering on an end face: 42 mm² (not programmed).
  - r1 plan-view corners and drill-point cones: small.
  - **The agent said the four holes were unreachable. The previous critical reviewer showed that is wrong.** Adding a
    top setup with straight T13 plunges gave 99.395 %, valid. Because CTC-04 is held out, I did not change its
    program; the result is reported as the agent left it.
  - The harness's reach hint can miss a tool whose radius equals the hole radius, which likely misled the agent. This
    is a next-phase fix.

### Post-review revisions (labelled in the run's notes)
FTC-10 iterations 9 and 10 were made after reviews, by the same agent, and the report marks them as post-review.
- **Iteration 9, machinist review:**
  - explicit retracts before every index and tool change;
  - arc-compensated helical feeds;
  - T1 moved off the stock's ~900 Hz bending mode;
  - a ramped web entry;
  - bottom finishing moved before the part-off slab.

  Cycle time went from 90.8 to 116 min.
- **Iteration 10, critical-review finding M5 (a silent miss):** long-neck ball passes in the drill-point cones.
  99.847 % → 99.890 %.

## What was built this phase
| Piece | Where | Notes |
|---|---|---|
| Whole-surface score | `sim5.surface_metrics5` | Nothing is excluded except the tab witness. Edge-band probes are scored with the nearest non-band deviation (v2). |
| Part-off analysis | `sim5.tab_sections`, `tab_witness`, `partoff_analysis` | Exact sections every 0.5 mm. Tabs at the weakest plane: count, area, width (2 × inscribed radius). Width also checked at every height up to the part (v2). The joint is limited to tab-body footprints (v2). Validity: 2–30 mm², ≤ 4 tabs, ≤ 3 mm wide, witness ≤ 1.5 %. |
| Integrity | `x5._trusted_eval`, `integrity_failures`, `verify_part`, `scan_generator5`, `tools/frozen_eval.sh` | INVALID on any of: harness hash ≠ expected; uncommitted harness edits; a part not re-derivable from the tracked STEP and fixture; generator code touching the simulator (any code file, dynamic execution). The final evaluation always runs from a clean checkout of the frozen commit. |
| Long-reach tools T11–T14 | `cncllm/tools.py` | Catalogue long-neck families, conservative chip loads. Neck and shank modelled in the simulator (flag 32) and in the fixture check. Evidence in `docs/FTC10_REACH_AUDIT.md`. |
| Exact fixture check | `kernel5.fixture_hits2` | Discs along the tool against the vise and table boxes, with 1 mm clearance. Replaces a capsule model that reached 16 mm below holder faces. |
| Reach audit | `tools/reach_audit.py`, `docs/FTC10_REACH_AUDIT.md` | FTC-10 standing on its −X end, with T11–T14: the search reaches 99.6 % of the surface. The previous `+Z` orientation is capped near 97 %. |
| Images | `x5._views_png`, `iso_png`, `partoff_png`, `cncllm/figs.py` | Z-buffered six views, shaded iso brief image, part-off close-up with per-tab zooms. |
| Machine view and report | `cncllm/viewer/src/{kin5.mjs,machine5.js,simview5.js,resultview5.js}`, `report5.py` | Trunnion A/C table motion; DRO readout; `window.__machineCheck` self-check (spindle 1.6e-16, tip vs part view 5e-14 mm); honest headline; plain-English summary; clickable failures; tab close-up. |
| Review tooling | `tools/review_report.py`, `tools/rebuild_report.py`, `docs/reviews/CRITICAL_REVIEWER_PROMPT.md`, `docs/LLM_AGENT_PROMPT.md` | |
| Tests | `tests/test_refine_eval.py`, `test_review_attacks.py`, `test_tools_refine.py`, `test_machine_view.py` | 80+ tests. Every reviewer attack is a regression test. |

## Reviews (fresh agents, no access to the build conversation)
- **Machinist (FTC-10, iteration 8):** RUN WITH MINOR EDITS. Every edit was applied in iteration 9; see the table above.
- **Critical review, round 1:** `critical_review_refine.md` (evaluator and results) and `critical_review_refine_page.md`
  (page). They found evaluator loopholes M1–M4, the silent miss M5, the wrong CTC-04 claim M6, the missing handoff
  M7, the edge band over its limit, and page failures C4/C5/C7/C8/W13.
  - M1–M4 and the edge band are closed in harness v2/v2.1 (dated in the acceptance addendum).
  - M5 is addressed by iteration 10.
  - M6 is disclosed above.
  - The page was reworked.
- **Critical re-review, round 2:** `critical_review_refine_v2.md` and `critical_review_refine_page_v2.md`. Summary at the
  end of this file.

## Known gaps and next steps
- **Chip-load check.** It uses the tool-centre feed, so edge-compensated helical feeds read as "rubbing" (65k warnings
  on FTC-10). Make it arc-aware: use the peripheral feed at the wall.
- **Rigidity check.** It stops at the `(PART-OFF)` marker no matter how much machining follows. FTC-10 still does
  about 8 min of +X work after the −X slab opens the stub to 21 %. Physically low risk per the machinist, but it should
  be limited.
- **Reach hint.** It misses exact-fit tools (tool radius = hole radius), and the search runs on a coarse raster.
- **Remaining machinist points not done:**
  - the tab pin can be up to 6 mm long (neck the tabs at the part face);
  - T11 still bores about 13 mm from solid in the deeper hole;
  - a 20 mm grip would be stiffer.
- **CTC-04 indexing** retracts only a little before indexing (the same issue the machinist found on FTC-10). It is
  held out, so it was left as is.
- **Speed.** Simulations take 1–3 min per iteration on these parts. A full LLM run is 2–3.5 h and about 450–550k
  tokens.

## Usage (approximate, subagent tokens)
| Agent | Tokens |
|---|---|
| FTC-10 run, including two post-review iterations | ~0.55M |
| CTC-04 run | ~0.45M |
| Viewer and report | ~0.7M |
| Machinist reviewer | 0.23M |
| Critical reviews, round 1 | 0.6M |
| Re-reviews | see the review files |

## Reproduce
```bash
cd ~/cnc-llm && .venv/bin/python -m pytest -q tests
S=$(python3 -c "import json;print(json.load(open('harness_frozen.json'))['sha256'])")
CNCLLM_EXPECTED_HARNESS=$S tools/frozen_eval.sh runs/ftc10/20261121-012221-refine 29abeb2 --iter 10
.venv/bin/python tools/rebuild_report.py runs/ftc10/20261121-012221-refine
```
