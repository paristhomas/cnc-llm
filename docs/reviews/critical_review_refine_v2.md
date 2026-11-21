# Critical re-review: 3+2 refinement phase, after fixes (scope A, B, D, E and OWNER W2–W7, W10, W11, W14)

Reviewer: a fresh adversarial agent. I did not build this work and did not see the developer's summary or conversation.
Date: 2026-11-21. Graded against `docs/reviews/CRITICAL_REVIEW_CHECKLIST.md`, `docs/ACCEPTANCE_REFINE.md` (including
the dated v2 / v2.1 addendum entries) and the OWNER rows of `docs/BRIEF_REFINE_3PLUS2.md` §6. This is a re-review: I
checked every FAIL item and defect M1–M7 of `critical_review_refine.md`, and looked for anything new, including
anything the fixes broke.

**Runs reviewed**
- Showcase: `runs/ftc10/20261121-012221-refine`. Final = iteration 10. Iterations 9 and 10 are labelled post-review.
- Held-out: `runs/ctc04_x0p2/20261121-012513-heldout`. Final = iteration 6. Re-evaluated under v2.1 only:
  `git diff 4e4dafe HEAD` over its `work/`, `run.json`, every `iter_*/program.nc` and `notes.md` and
  `final/program.nc` is empty.
- Frozen harness v2.1: sha `f99d7751…cd6cd`, commit `87fb673`. I recomputed the sha in a fresh worktree of `87fb673`,
  and it matches the addendum, `harness_frozen.json` and both `evaluation.json` files. No harness file, skill or prompt
  has changed since `87fb673` (skill and prompts since `1cbfa1d`).

**Section C, W1, W9 and W13** are re-reviewed in parallel by another reviewer.

**Scripts and logs** are in `/home/paris/review_tmp/v2/`:
- `a1.py`, `a1c.py`, `band.py`: score recomputation and the edge band.
- `feval.sh` → `feval.log`: my trusted re-evaluation of FTC-10.
- `a3.sh` → `a3.log`: tamper attack and generator-import attack.
- `scan.py`, `swap2.py`: scan bypasses and part swap.
- `b1e4.py` → `b1e4.log`: tab sections and air cutting.
- `e1b.py`, plus `../e1.py` and `../e3.py`: G-code read.
- `regions.py`.
- `pytest.log`.

**New regression tests:** `tests/test_review_v2_attacks.py`, four strict xfails. **Images I opened** (session
scratchpad `review_v2/`): `ftc_dev.png`, `ftc_partoff.png`, `ctc_dev.png`, `ctc_partoff.png`.

## Status of the previous review's defects

| Defect | Status | Evidence |
|---|---|---|
| M1: tab rules at the weakest plane only | **Half fixed** | Width is now checked on every plane up to Z−0.05; the pads attack is INVALID. **Total and count are still checked at the weakest plane only.** New attack N1: a 2.6 mm rib, 30 mm long, joins the part with 78 mm² and is VALID. Real case: on CTC-04 the tabs reach **31.2 mm² at Z−0.2** and 34.8 mm² at Z−0.05, unchanged and still VALID. |
| M2: witness overreach | **Fixed** | The joint is limited to the tab-body footprint at Z−1 dilated by 1 mm (`sim5.tab_witness`). The reviewer's strip test passes. FTC-10 witness dropped from 111.1 to **76.33 mm²**. On the real run (`../wit.py`), witness more than 1 mm (XY) from the tab footprints is 17.67 mm² (v1: 52.3), and more than 2 mm away is 0 (the design allows 1 mm dilation plus the 1 mm witness); the patches in `ftc_partoff.png` are compact around the two tabs, and the proud specks beside them are now scored as failed. |
| M3: scan bypass | **Listed bypasses closed; the class is still open (disclosed)** | The exec-string and heredoc tests pass. New bypasses in scanned files get through (`scan.py`), and each one really imports `cncllm.sim5`: `pkgutil.resolve_name('cnc'+'llm.sim5')`, `getattr(builtins,'ex'+'ec')(...)`, and a shell variable `P=cnc; python3 -c "from ${P}llm import sim5"`. Files with no code extension and no `#!`, and files over 5 MB, are not scanned at all. The addendum names this residual risk. A deny-list cannot close it; only OS-user isolation can. Neither run's `work/` contains any of these patterns. |
| M4: self-referential anchors | **Harness side fixed; part side partly fixed** | `frozen_eval.sh` now requires an explicit commit and `CNCLLM_EXPECTED_HARNESS`. The tampered-commit attack is INVALID (A3). **But** `verify_part` re-derives the part from `run.json`'s `source_step` and from the fixture in the run's own `part/setup.json`, and both files are written by the run. N3: re-placing the part at **scale 1.3** and rewriting `run.json`'s `part_sha256` gives `verify_part = []` and `integrity_failures = []` (`swap2.py`). For these two runs I checked by hand that the scored parts are the real ones (D3/A6). |
| M5: FTC-10 silent miss (shallower cone, face 176) | **Fixed** | Iteration 10 adds T14/T13 cone rings. Face 176 now has **0.00 mm²** proud (was 12.04); max dev 0.065. |
| M6: false CTC-04 "unreachable" claim | **Disclosed** | `HANDOFF_REFINE.md` reports the 99.395 % counter-example and the reach-hint defect, and leaves the held-out program unchanged. **But** it says "the agent said the four holes were unreachable". No such statement exists in the run's `plan.md`, `notes.md` or `iter_*/notes.md`. I grepped for unreach, reach, cannot and vertical. The attribution cannot be verified from the repo. |
| M7: handoff, usage, push | **Done or disclosed** | `docs/HANDOFF_REFINE.md` exists, with the 5-minute check at the top. Usage is in `PROGRESS.md` and the handoff. The push is disclosed as blocked by a local hook that needs the owner's consent (handoff, top; `PROGRESS.md`). 34 commits are unpushed. The handoff's promised "Summary at the end of this file" is not there yet; it is pending this review. |
| m1: CTC-04 edge band 1.32 % | **Fixed** | The band is no longer excluded; it is scored with the nearest non-band deviation. This is stricter than v1: CTC-04 goes from 99.180 to 99.132, FTC-10 from 99.893 to 99.890 with the band excluded. |
| m2–m5 | **Mostly open, partly disclosed** | Still open: the pin; T11 boring from solid; the 12 mm grip; T1 S18000 in setups 2–8; PO-3 on the opened stub; the slab holder margin not recorded. The rigidity check still stops at the marker. The handoff lists the pin, T11, the grip, the 8 minutes after the slab and the CTC-04 indexing. It **omits T1 in setups 2–3** and the slab holder note, while claiming "every edit was applied". |

## Verdict table

| # | Item | Verdict | Evidence |
|---|---|---|---|
| A1 | Headline recomputed from `probes.npz` | **PASS** | **Scores** (`a1.py`). FTC-10: mine **99.8898 %**, `metrics.json` 99.890. CTC-04: **99.1316 %**, `metrics.json` 99.132. **Excluded area is the witness only:** 76.33 mm² (0.157 %) on FTC-10 and 59.96 mm² (0.146 %) on CTC-04, so `edge_band_excluded_pct` is 0. Scored area 48,454.2 and 40,900.4 mm², equal to the metrics. No witness probe has dev or raw dev < −0.1. **Edge band.** Outside the band, `dev == dev_raw` exactly. Inside it, 100 % of probes carry the deviation of the nearest non-band probe, which I checked with my own KD-tree. The neighbour can be up to 0.7 mm away. The rule forgives 24 raw-proud band probes (4.66 mm²) on FTC-10, and on CTC-04 8 raw-gouge probes (1.31 mm², all at the march clamp of −5.0 on scattered faces, so artefacts). Net, it is stricter than v1's exclusion (above). |
| A2 | Attack tests a–d, plus mine | **FAIL** | The previous reviewer's tests now pass as normal tests. `git diff b1cebcd HEAD` shows that against the reviewer's original copy (`review_tmp/orig/`) only the xfail markers were removed; parameters and assertions are unchanged. `test_refine_eval.py` attack b changed from "INVALID" to "underside scored failed, witness < 1 %". The addendum declares this as validity looser but score stricter. This is declared but **validity-looser, with no owner sign-off** (the acceptance doc says loosening needs the owner). In substance it follows the owner's R1 wording, because the underside still counts as failed. **New attack N1 gets through:** `test_review_v2_necked_tabs_into_long_rib_invalid` (strict xfail; with `--runxfail` it fails at `assert not valid`). Two 11.7 mm² tabs, necked between Z−11.5 and Z−1.5, merge into a 30 × 2.6 mm rib under the part. That is more than 60 mm² of material at Z−0.2 (asserted; 78 mm² by design), 0 non-part-off errors, **VALID**, with witness 1.05 %. That witness is 139 mm² of the box's underside excused, against 23 mm² of tabs. |
| A3 | Harness tampering / generator import (v2.1) | **PASS** (literal); see M4/N3 and M3/N2 | Scratch clone, so the real object store is untouched (`a3.sh`, `a3.log`). **Control:** my clean `87fb673` evaluation of an FTC-10 copy gives VALID, 99.89, integrity ok (`feval.log`). **Attack 1:** commit a one-line `sim5.py` edit (`WITNESS_MAX_PCT = 15.0`), re-freeze `harness_frozen.json` in the tree, and run `frozen_eval.sh` on that commit with the published sha: **valid=False**, "harness 22a7b7c8a7d0 is not the expected published harness f99d775150b7". **Attack 2:** clean `87fb673`, plus `work/review_gen.py` with `from cncllm import sim5`: **valid=False**, "generator code uses the simulator…: review_gen.py:1". No worktree was left behind in the real repository. |
| A4 | Wording grep | **FAIL** (minor, literal) | Run over brief, feedback, metrics, regions, issues, `report/index.html`, notes and plan of both runs. Allowed hits: "Tab witness excluded" and "edge_band_excluded_pct: 0.0". **Two problems.** (1) The FTC-10 page shows the iteration-10 note "Deeper axial hole …: **not reachable by a ball**" about region R1, which is failed area. It sits under "the agent's own notes… Every area counts in every score". R1 lets the agent argue in run notes, but the report must not call failed area unreachable. I checked the argument and it is geometrically right (D2), but graded literally this is a hit. (2) **Stale text on both pages:** "Only this area and the edge band are left out of the score". Under v2 the band is not left out, and the same page says, two sections earlier, "The edge band (0.85 %) is scored by its neighbours". |
| A5 | MillBill ≥ 99.99 %, re-run myself | **PASS** | Both `final/evaluation.json`: 250,000 points, 0 disagreements, 100 %. My own clean-checkout run on FTC-10 (`feval.log`): 100.0 %, 0 of 250,000. The previous reviewer showed that the check is sensitive (a dropped setup gives 99.1–99.5 %). |
| A6 | Clean checkout, hashes vs addendum | **PASS** | The evaluation sha `f99d775…` equals the addendum. `frozen_checkout_commit` is `87fb673`, repo `/tmp/cncllm-frozen-*`. **My reproduction:** `CNCLLM_EXPECTED_HARNESS=f99d… bash tools/frozen_eval.sh <copy> 87fb673 --iter 10` gives **metrics identical to the committed ones (no field differs)**, `dev` and `witness` arrays bit-identical, and the same `program.nc`. **Part identity:** B-rep area × scale² is 48,531.2 / 40,960.5 mm², against `surface_area_mm2` 48,530.6 / 40,960.3, with fixture scales 1.0 and 0.2. **Defect (minor; already so at `1cbfa1d`):** `tools/frozen_eval.sh` is committed as mode 100644, so the documented command `tools/frozen_eval.sh …` fails with "Permission denied". I had to run it with `bash`. |
| B1 | Tabs recomputed from the exact workpiece | **FAIL** (CTC-04, literal, unchanged); FTC-10 PASS | `b1e4.py`: independent `sim5.run`, 0.05 mm raster, own inscribed-radius widths, every 0.25 mm plus Z−0.2/−0.1/−0.05. **FTC-10:** weakest Z−5.45, 2 × 11.44 = 22.88 mm², width 2.6. At Z−0.2: 24.44 mm². Above the weakest plane: at most 24.96 mm², 2 islands, 2.6 mm. W3a met. **CTC-04:** weakest Z−1.7, 2 × 11.7 = 23.4 mm², width 2.6. **At Z−0.2: 31.20 mm²; at Z−0.05: 34.84 mm²**, above the 30 mm² validity total at the plane the checklist names. The harness's own section plot (`ctc_partoff.png`) shows the curve leaving the green 2–30 band near Z0, and `metrics.json` has `final_connection_mm2` 35.75. Still VALID, and not disclosed in the handoff, which gives "2 × 11.96 mm²". |
| B2 | Witness | **PASS** | FTC-10: 76.33 mm², 0.157 % (target ≤ 0.5 %). CTC-04: 59.96 mm², 0.146 %. Joint 37.87 / 29.32 mm². |
| B3 | Part-off close-up, machinist read | **PASS** (minor) | I opened `ftc_partoff.png`. Two 2.6 mm tabs under the lobes. The underside is machined: green, purple witness only around the tabs, and a few failed orange specks. They can be snapped and filed by hand; no saw is needed. **Still open:** the section stays at 22.9–25 mm² from Z−5.45 to Z0, so the break can leave a pin up to about 5.5 mm. The handoff discloses this. CTC-04 (`ctc_partoff.png`): 2.6 mm tabs flaring to 17.4 mm² each at the part. They are still hand-removable, but see B1. Its underside has two orange patches, R6 12.6 mm² and R13 6.1 mm², proud 0.19–0.24 mm. |
| B4 | Rigidity | **PASS** (note m3) | FTC-10: fraction 1.000 after setups 1–6. The first value below 30 % is 0.2095 after setup 7, past the `(PART-OFF)` marker (line 100316). CTC-04: 0.9962 until the marker. **Note:** after the −X slab (line 108460) there is still 8.3 min of cutting (T14 5.7 min, PO-3 2.6 min; `e3.py`) on a 21 % stub, the same as iteration 9. Disclosed. |
| B5 | Fixture | **PASS** | Unchanged from round 1: one `fixture.json` per run, every setup a G68.2 frame of it, and reasons in `plan.md` tied to `fixture-suggest`. I agree with the orientation; its cost is the 12 mm grip (E3). |
| C1–C9 | Report and page | other reviewer | Out of scope. |
| D1 | FTC-10 VALID, ≥ 95 %, no gouge region > 1 mm² | **PASS** | VALID, **99.890 %**, recomputed and reproduced from a clean checkout. Gouge 0.00 mm², maximum 0.054 mm. |
| D2 | Failed regions > 2 mm² vs G-code and audit | **PASS** | Five regions (`regions.py`). **R1, 13.21 mm²:** face 174, the drill-point cone of the deeper Ø5.5 hole, Z104.99–105.96. The hint says "found no tool for 91 %", matching the audit's no-tool patch. The handoff lists it with its cause. My check of the cause against `tools.py`: the top face is Z141.5, so the cone is 35.5–36.5 mm deep. T13's holder face is at 35 mm stick-out, so it reaches the top face. T14's Ø6 shank starts 30 mm above the tip, so it would enter the Ø5.5 hole. T11 (flat) can only ring it. The argument holds. **R2–R5 (2.1–2.7 mm²):** the B-spline blend and lobe edge rounds. Passes reach them (gap 0; T6/T14), leaving +0.12 to +0.20 mm mean and +0.33 mm extreme. They were attempted, so they are not silent misses. The handoff lists them collectively as "+0.10 to +0.2", which understates the extremes. **M5 region:** face 176 is now 0 mm² proud. |
| D3 | CTC-04 held out | **PASS** (with minor accuracy defects) | Frozen skill (unchanged since `1cbfa1d`). Program untouched since `4e4dafe` (git, above). As in v1: the run directory was first committed at the end of the run, so git cannot show that nobody intervened before `4e4dafe`. Trusted v2.1 re-evaluation: VALID 99.132 %. The handoff reports the agent's result unchanged and adds the M6 counter-example. **Defects in the report:** (a) The "agent said unreachable" attribution is not in the run files. (b) The handoff names the holes (128 mm², which I confirm as R2–R5 = 127.95) and the lettering (42.27 mm²). It calls the rest "small", but the rest is about 185 mm², 52 % of the 355 mm² proud, and includes two underside patches (R6, R13) and three cones that "no pass reached" (R22, R23, R29). (c) The tab section above 30 mm² at the part (B1) is not mentioned. (d) `regions.json` is capped at 30 (`x5.regions5(max_regions=30)`) and all 30 are > 2 mm² (sum 315.7 of 355 proud), so the region list is truncated without saying so. |
| D4 | Visual sanity | **PASS** | I opened `ftc_dev.png`: all six views green, small orange specks on edge rounds, one dark-red spot (R1, seen from the top), purple only at the two tabs, underside machined. `ctc_dev.png`: the dark lettering patch on the −Y end, the r1 holes, scattered small orange corners, and two orange underside patches. Both match `regions.json`. |
| E1 | Feeds vs chip load | **FAIL** (minor flag; regression in iteration 10) | `e1.py`: every tool's max F/(flutes·S) is ≤ 1.00× library. Edge-compensated arcs are ≤ 1.00× for T2, T3, T4, T11 and T12. **New:** the iteration-10 ball-in-cone helices floor the feed at 0.25 F. At the contact radius (path r + Rb·cos 59°), **7 arcs exceed 1.3×, up to 3.9×** (T13, line 7036, path r 0.035 mm, F72 S24000) and 2.2× (T13, lines 71812–71867, pad holes) (`e1b.py`). The amount is tiny, but it is the same arc-feed error the machinist had fixed in iteration 9. |
| E2 | Stick-out and reach | **FAIL** (flag; carried from v1, not recomputed) | I did not recompute stick-out per move. The v1 findings stand on unchanged code: T3, T4 and T7 stick-outs, with no stated reason. Iteration 10 adds T14/T13 rings deep in the shallower Ø5.5 hole (lowest frame Z86.05, lines 6993–7038). Their neck and holder clearance is argued in the notes, but I did not verify it independently. T11 still bores the deeper Ø5.5 hole from solid below the T10 pre-drill. The handoff lists T11 only. |
| E3 | Grip and stub | **FAIL** (marginal, unchanged) | 12 mm grip under 183.5 mm. T1 runs at S15000 only in setup 1; setups 2–8 run S18000, which is 900 Hz tooth passing, the stock's estimated first bending mode (`e1.py`). Machinist edit 4 asked for setups 2 and 3 as well. |
| E4 | Air cutting | **PASS** | Recomputed with the harness's own per-move removed volume from an independent `sim5.run` (`b1e4.log`): FTC-10 **22.3 %** of 112.3 min of cutting time has `vol == 0` (21.7 % of moves); CTC-04 28.1 %. Both are under 40 %. The machinist measured 45 % on iteration 8, and per tool the two measurements differ by about 2× (T7 40 % here against 81 %). The discrepancy is **unexplained**. The PASS rests on the simulator's own `vol`. |
| E5 | Safe indexing | **PASS** | All 8 `G69` follow a `G0` to frame Z170.598 (the first is Z151.43, which is G54 Z171.4). 50 `M5`, 0 after a feed move. 0 cutting moves with the spindle off. |
| E6 | Part-off | **FAIL** (nominal, unchanged) | +X → −X → +X. The smallest section is last (ramped web, line 125038). The tabs are reachable for the operator. 8.3 min of cutting runs after the −X slab opens the stub. Disclosed in the handoff. |
| E7 | Machinist verdict | **RUN WITH MINOR EDITS** | Safe indexing, ramps and most arc feeds are good. Before running: cap the cone-helix feed at the contact radius (E1); T1 at 15k rpm in setups 2–3 (E3). Known and accepted: the pin, T11 from solid, the 12 mm grip, the PO-3 work on the opened stub. |
| W2 | No "unreachable"; unfinished = failed | **PASS** (see A4) | Excluded area is the witness only: the recomputation gives exactly the witness, and the band is now scored. Every failed region's hint starts "failed:". The one "not reachable" phrase is the agent's own note, framed as not changing any number, and it is geometrically correct. It still has to go from the page (A4). |
| W3 | Only small hand-removable tabs | **PASS** | FTC-10: 2 × 11.44 mm², 2.6 mm, underside machined (B1, B3). CTC-04 is hand-removable but over the PROPOSED 30 mm² total at the part (B1). |
| W4 | Rigid until the part-off | **PASS** | B4. |
| W5 | Single vise fixture from the geometry | **PASS** | B5. |
| W6 | Eval resists reward hacking | **FAIL** | N1: big-attachment tabs are VALID if necked low (the M1 class, half-fixed), and the real CTC-04 run sits in that gap at 31–35 mm². N3: the part identity is still taken from run-written files (scale swap passes). N2 (deny-list scan bypasses) is disclosed as residual risk, and I do not grade on it alone. A3's literal attacks are caught. MillBill is 100 %. |
| W7 | ±0.1 mm two-sided | **PASS** | Recomputed with \|dev\| ≤ 0.1 on every scored probe. No witness probe is gouged. The band carries neighbour values (A1). |
| W10 | Held-out validation reported honestly | **PASS** (minor corrections needed) | D3. The number reported is the trusted, untouched result, and the false "unreachable" claim is corrected in the handoff. Items (a)–(d) in D3 should be fixed in the handoff. |
| W11 | Independent verification vs criteria fixed upfront | **FAIL** (pass condition) | **Order:** the checklist and brief are unchanged since `8dfa829` (23:39, before the runs). `ACCEPTANCE_REFINE.md` has only additions (88 lines, all after line 108, in the dated addendum), and every v2 entry is labelled tightening. Exceptions: the attack-b validity change (declared, looser, no owner sign-off), and v1's fixture-collision "tighter and looser" entry, which still has no owner sign-off. **Pass condition** "all OWNER rows PASS" is not met: W6 fails here; W1 and W9 belong to the other reviewer. |
| W1 | See the +2 axes move the workpiece | other reviewer | See `critical_review_refine_page_v2.md`. |
| W9 | Showcase good enough for a friend | **owner's call** | My opinion: the FTC-10 result (99.89 %, two 2.6 mm tabs, underside machined) is worth showing once the stale page wording (A4) is fixed. See also the page re-review. |
| W14 | Usage, open source, push, subagents | **PASS** (disclosed) | Usage per run is in `PROGRESS.md` (FTC-10 about 0.49M, CTC-04 about 0.45M) and in the handoff table. Open-source tools only. Subagents were used (handoff, review list). **Push:** not done. It is disclosed at the top of the handoff and in `PROGRESS.md` as blocked by a local hook that needs the owner's consent, with the exact command to run. **Minor:** brief §7 says "never put model identifiers in commits"; the refine commits carry co-author trailers naming the model (33 `Co-Authored-By` lines). |

## Defects, ranked

### Blocker
None in the machining result. Under the checklist's rule, the FAILs on OWNER rows **W6** and **W11** block the
showcase claim until they are fixed and re-reviewed.

### Major
1. **N1: tab total and count are checked at the weakest plane only. M1 is half-fixed.**
   - **Reproduce.** `pytest --runxfail tests/test_review_v2_attacks.py -k rib`. A rib 2.6 mm wide and 30 mm long joins the part with 78 mm², above two 11.7 mm² necks. The run is VALID, witness 1.05 %. On FTC-10 the witness cap is 728 mm² (1.5 %), so a much longer rib would still be VALID.
   - **Real case.** CTC-04 has 31.2 mm² at Z−0.2 and 34.8 mm² at Z−0.05, and is VALID.
   - **Fix.** Apply the 2–30 mm² total and the ≤ 4 island count on every plane from the weakest plane to Z−0.05, as the previous review proposed. Tightening only. CTC-04 would then become INVALID under the rule as written, and must be reported as such. It must not be re-run as held-out.
2. **N3: part identity still comes from run-written files (M4, part side).**
   - **Reproduce.** `review_tmp/v2/swap2.py`: re-place the same STEP at scale 1.3, then rewrite `run.json`'s `part_sha256`. Both `verify_part` and `integrity_failures` return `[]`. By code reading (not run), pointing `source_step` at another tracked STEP works the same way, because `verify_part` takes it from `run.json`.
   - **Fix.** Give the trusted evaluation the expected part identity from outside the run, as is now done for the harness, for example `CNCLLM_EXPECTED_PART=<source path>:<scale>:<sha>` recorded in the addendum or in the run-creation commit. Compare the fixture's `scale` against it. Orientation and grip may stay the agent's choice.
   - **For these two runs** I verified the identity by hand (A6), so the numbers stand.

### Minor
- **N2: generator scan.** It still has deny-list bypasses that really import the simulator: `pkgutil.resolve_name`, `getattr(builtins,'exec')`, a shell-variable package name, unscanned file types, and files over 5 MB. This is disclosed as residual risk in the addendum; three strict-xfail tests are added. **Fix:** run the generator as a separate OS user without read access to `cncllm/`, which the brief's admin-access note allows.
- **N4: iteration-10 cone helices exceed chip load** at the contact radius: 7 arcs, up to 3.9× (E1). **Fix:** compute the feed at the contact radius with no 0.25 F floor, or replace the last rings with a straight plunge at the apex.
- **N5: the reproduction path is broken or self-referential.**
  - `tools/frozen_eval.sh` is mode 644, so the documented command fails.
  - The handoff's "Reproduce" block reads the expected sha from the in-tree `harness_frozen.json`, the self-reference M4 was meant to remove. The sha must be taken from the addendum.
  - **Fix:** `git update-index --chmod=+x tools/frozen_eval.sh`, and quote the sha literally.
- **N6: stale or overstated text.**
  - Both report pages say "Only this area and the edge band are left out of the score" (A4).
  - The FTC-10 page shows "not reachable by a ball" (A4).
  - The handoff says "every edit was applied", but T1 is at 18k rpm in setups 2–3 and the slab holder margin is not recorded.
  - It gives FTC leftovers as "+0.10 to +0.2", where the extremes are +0.33.
  - It calls the CTC-04 remainder "small" (about 185 mm²); attributes the "unreachable" claim to the agent without evidence; leaves the B1 breach on CTC-04 unmentioned; and does not say that `regions.json` is truncated at 30.
- **Carried over** (disclosed in the handoff unless noted):
  - the pin of about 5.5 mm;
  - T11 boring from solid;
  - the 12 mm grip;
  - T1 at 900 Hz in setups 2–8 (not disclosed);
  - 8.3 min of cutting on the opened stub, with the rigidity check stopping at the marker;
  - "rubbing" warnings from centre feeds;
  - the CTC-04 short retract before indexing.
- **Model identifiers** appear in commit trailers, against brief §7.

## Test suite
I ran `/home/paris/cnc-llm/.venv/bin/python -m pytest -q tests` once, with no other heavy job of mine running (another reviewer's browser was active) (`review_tmp/v2/tests.sh`,
log `review_tmp/v2/pytest.log`). Result: **80 passed, 4 xfailed in 855 s, exit 0**.
- **The 4 strict xfails** are my new `tests/test_review_v2_attacks.py`: N1 (rib) and three N2 scan bypasses. With
  `--runxfail`, each one fails at its intended assertion (`assert not valid` / `assert not ok`). They turn red when the
  defects are fixed; remove the markers then.
- **The previous reviewer's tests** (`test_review_attacks.py`) all pass with no markers.

## Overall verdict
**Much improved, and the showcase numbers are real. The showcase claim is still blocked, on the evaluator.**
- **The number reproduces.** I reproduced FTC-10 bit-for-bit from a clean checkout of the frozen v2.1 commit: 99.890 %, VALID, MillBill 100 %.
- **The tabs are hand-removable.** Two 2.6 mm tabs of 11.4 mm² each, and the underside is machined.
- **Previous defects.** M2, M5 and the edge band are properly fixed. M6 and M7 are honestly disclosed, although the handoff needs some factual corrections.
- **Still open.** The evaluator still accepts large attachments above a low neck (N1). M1's total and count were never fixed, and the held-out CTC-04 run sits in exactly that gap (31–35 mm² at the part). The evaluator also still takes the part identity from files the run writes (N3).
- **Unblocking.** Both fixes are small and tightening only. Once they are in, W6 and W11 can pass on a fresh re-review.
