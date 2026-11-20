# Handoff: 3+2 indexed 5-axis (branch `claude/3plus2-indexed-5axis`)

## Results
| Part | Scale | Result | Notes |
|---|---|---|---|
| **FTC-10 (showcase)** | native | **VALID, 96.285 %** of the 3+2-reachable surface (84.8 % of the whole surface), 7 setups / 5 orientations, 85.8 min, MillBill 100 % | run 2; report: https://claude.ai/artifact/WtZBbWpDbBYqNup4BeiQyq (`runs/ftc10/20261120-165400-run2`) |
| FTC-10, run 1 | native | 81.3 % VALID under v5.1 → **87.2 % but INVALID** under v5.2 | rigidity: the part hung on thin necks (5–7 % of the section) |
| FTC-08 (dev) | ×0.5 | **VALID, 99.78 %**, 28 segments / 13 orientations, 40.5 min | part-off left 14 % (webs need sawing; the footprint exceeds side-tool reach) |
| CTC-04 (held-out validation) | ×0.2 | **not run** (usage) | next step |

Acceptance (`docs/ACCEPTANCE_3PLUS2.md`):
- **E (simulator):** E1–E7 met. 10 new tests; MillBill per-frame cross-check 100 % on every final program.
- **F (report):** independent review passed all criteria, and 5 small defects were fixed (`docs/reviews/report5_review.md`).
- **G1 (showcase):** met.
- **G2 (validation):** not done.
- **G3 (machinist review):** "RUN WITH MINOR EDITS" (`docs/reviews/machinist_review_ftc10_3plus2.md`). The reviewer
  wants 2–4 tabs totalling 20–30 mm², up from 13 mm²; is worried about chatter from an 8 mm grip under 10 mm
  roughing; flags ball and flat finishing feeds about 2× the library chip load; and wants the part-off in one pass
  per side.

## What was built
| Piece | File | Notes |
|---|---|---|
| Parser | `cncllm/gcode.py` (`tilt=True`) | `G68.2 X Y Z I J K` (Fanuc Euler ZXZ), `G53.1`, `G69`; A ≤ 110° |
| Fixture | `part5.py` | rigid placement of the part (orientation, scale) in a box stock with a vise-gripped stub; jaws, body and table boxes |
| Reachability | `part5.py` | holder-aware: 7 library tools × (26 cube directions + feature axes), vise as an obstacle |
| Simulator | `sim5.py`, `kernel5.py` | exact per-frame material model (metric); per-segment crash/engagement replay seeded from 0.25 mm voxels; tool and holder vs vise/table on every move; rigidity = weakest plane over the stub gap (≥ 30 % until `(PART-OFF)`); part-off between 2 mm² and 15 % |
| CLI | `x5.py` | `fixture-suggest`, `new-run`, `sim`, `evaluate` (`python -m cncllm.x5`); brief and feedback |
| Cross-check | `crosscheck5.py` | MillBill's kernel per frame |
| Report | `report5.py`, `viewer/src/*5.js`, `dist/viewer5.js` | vise, tilted tool, re-orientation animation, exact multi-setup material shown via shader clipping, setup timeline, rigidity chart and maps |
| Skill | `skills/cnc-gcode-3plus2/SKILL.md` | |

## Eval changes made after seeing results (recorded in the acceptance doc)
1. **Reachability made holder-aware.** Run 1 showed cross-hole middles counted as reachable when no holder can get
   there.
2. **Rigidity uses the weakest plane, limit 30 %.** The mid-gap plane let a part hang on necks.
3. **Simulator fixes:**
   - no machine travel check in 3+2 mode;
   - an inclined move's own vertical travel is allowed in the shank check;
   - vise and crash messages name the box and the tool part, and give G54 locations.

## Known gaps / next
- **Superseded by `docs/BRIEF_REFINE_3PLUS2.md` (new owner rules: no unreachable exclusion; Machine view).**
- Run CTC-04 (×0.2) as held-out validation with the frozen skill, about 300k tokens.
- Machinist feedback for the skill:
  - more and larger tabs;
  - grip guidance;
  - feeds at the library chip load for finishing.
- No slitting-saw tool, so the part-off on large footprints leaves webs to saw.
- The voxel-seeded crash replay in tilted setups runs at 0.25 mm. Shanks must stay at least 0.3 mm off finished faces.
- Usage: about 300–360k tokens per LLM run on these parts. Hitting the 5-hour limit paused the work twice.
