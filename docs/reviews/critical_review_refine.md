# Critical review: 3+2 refinement phase (scope A, B, D, E)

Reviewer: a fresh adversarial agent. I did not build this work and did not see the developer's summary or conversation.
Date: 2026-11-21. Graded against `docs/reviews/CRITICAL_REVIEW_CHECKLIST.md`, `docs/ACCEPTANCE_REFINE.md` and the
OWNER rows of `docs/BRIEF_REFINE_3PLUS2.md` §6.

**Runs reviewed**
- Showcase: `runs/ftc10/20261121-012221-refine`. Final = iteration 9, the post-review revision. `final/program.nc` is
  byte-identical to `iter_09/program.nc` and `work/program.nc` (cmp).
- Held-out validation: `runs/ctc04_x0p2/20261121-012513-heldout`. Final = iteration 6.
- Comparison: `runs/ftc10/20261120-165400-run2/rescore_refine` (79.50 %, INVALID).

**Scope.** Section C (report page) was reviewed in parallel by another reviewer: see
`docs/reviews/critical_review_refine_page.md`.

**Scripts and logs.** All my scripts and logs are in `/home/paris/review_tmp/`:
- `a1.py`, `a1b.py`, `misc.py`: score recomputation and edge band.
- `eval_run.sh`, `eval_{control,tamper,genimport}.log`, `tamper2.sh`, `swap.py`: integrity attacks.
- `b1.py`, `b1_ftc.log`, `b1_ctc.log`: tab sections and the MillBill sensitivity check.
- `wit.py`: witness location.
- `aud2.py`, `holes.py`, `mkhole.py`, `holes_sim.log`, `holes2.py`: reach checks.
- `e1.py`, `e2.py`, `e3.py`: G-code read.
- `pytest.log`: full test suite.

New regression tests: `tests/test_review_attacks.py`. Images I opened are in the session scratchpad `review/`
(`ftc_partoff_report.png`, `ftc_dev.png`, `ctc_partoff.png`, `ctc_dev.png`).

## Verdict table

| # | Item | Verdict | Evidence |
|---|---|---|---|
| A1 | Headline recomputed from `probes.npz` | **FAIL** (CTC-04 edge band); FTC-10 PASS | **FTC-10.** My numpy gives 99.8661 % against `metrics.json` 99.866. Excluded area is 525.18 mm²: edge band 414.08 mm² (0.853 %) plus witness 111.10 mm² (0.229 %). The 1.36 mm² that is both edge and witness is counted once. No witness probe has dev < −0.1 (minimum witness dev 0.000). **CTC-04.** The score matches (99.1800 / 99.180), but the edge band is **1.323 %**, above the 0.9 % limit. With the edge band scored, CTC-04 is 99.129 % and FTC-10 99.856 %. The band hides little: 25.2 mm² of failing probes on CTC-04. Script: `a1.py`, `misc.py`. |
| A2 | Attack tests a–d, plus my additions | **FAIL** | Existing a–d (`tests/test_refine_eval.py`) pass. I added `tests/test_review_attacks.py`: a literal edge-band ridge (0.5 mm × 1 mm skin along the top edges), wide tabs (3.4 mm), five tabs, a nested import, and a tampered harness copy. All of these are caught. **Two attacks get through** (strict xfail): **M1**, tabs necked to 2.6 mm low down that carry 4.5 × 5.2 × 1.5 mm pads at the part, VALID with witness 1.06 % and no other error; **M2**, a 0.4 mm proud strip running 12 mm away from a tab, excluded as witness instead of failed. I checked with `pytest --runxfail` that every xfail fails at its intended assertion: the pads test at `not valid`, the strip test at "100 % of the far strip excluded as witness", and the scan tests at `not ok`. |
| A3 | Harness tampering / generator import | **PASS** for the literal attacks, with major gaps (M3, M4) | Worktree at `1cbfa1d` (`/home/paris/review_tmp/wt`), copy of the CTC-04 run, each trusted evaluation importing `review_tmp/wt/cncllm` (printed): **control** valid, 99.18 %; **one line of sim5.py edited** (`WITNESS_MAX_PCT = 15.0`): `valid=False`, failures "harness code differs from the frozen harness (now 0efc172b2fb4…)" and "uncommitted changes… sim5.py"; **`work/review_gen.py` with `import cncllm.sim5`**: `valid=False`, "generator code uses the simulator". **Gaps.** If I commit the edit and re-freeze `harness_frozen.json` in the tree, the integrity check returns `[]`, and `tools/frozen_eval.sh` would default to that commit. `exec('from '+'cnc'+'llm import sim5')` and shell heredocs are not scanned. Changing `run.json`'s `part_dir` and `part_sha256` to another part also returns `[]`. Scripts: `tamper2.sh`, `swap.py`. |
| A4 | Wording grep | **PASS** (minor note) | `a4.sh` over brief, feedback, metrics, regions, issues, `report/index.html`, `assets/*.js`, iteration notes and plan for both runs. Hits only "tab witness excluded" and "edge band (metrology) excluded". Hints say "found no tool for 91 % … It still counts". **Note.** The report page shows the agent's iteration-7 and iteration-8 notes: "no 118-degree tool fits there" and "the flat end mills can only trace the outer ring of each cone". The flat-mill statement is true. But the note leaves out the ball tools, which the audit says reach the inner cone of the shallower hole (see D2). The area still counts as failed. |
| A5 | MillBill ≥ 99.99 %, re-run myself | **PASS** | Both `final/evaluation.json`: 250,000 points, 0 disagreements, 100 %. My re-run on the CTC-04 copy (three times) also gave 100 %, 0 of 250,000. **The check is sensitive.** MillBill against our workpiece with the last setup dropped gives 99.08 % (FTC-10) and 99.49 % (CTC-04), which fails the gate (`b1_*.log`). **Limit.** Moves and frames come from our own G68.2 parser (`crosscheck5.py` docstring), so the parser and frame maths are not cross-checked. |
| A6 | Clean checkout, hashes vs addendum | **PASS** | Both `evaluation.json` files: sha `0b28d03c…8605`, the same as the `ACCEPTANCE_REFINE.md` addendum and `harness_frozen.json`. `git_head` and `frozen_checkout_commit` are `1cbfa1d`, and the repo is `/tmp/cncllm-frozen-*`. `git diff 1cbfa1d HEAD` over the 13 hashed files, the skill and both prompts is empty. My own clean-worktree re-evaluation of CTC-04 reproduced 99.18 %, valid, integrity ok. FTC-10 was not re-evaluated by me; its identical hash and program make that low risk. The scored parts are the real ones: B-rep area × scale² from the source STEP is 48,531.2 / 40,960.5 mm², against `surface_area_mm2` 48,530.6 / 40,960.3. |
| B1 | Tabs recomputed from the exact workpiece | **FAIL** (CTC-04, literal); FTC-10 PASS | **Method.** `b1.py`: `gcode.parse` + `sim5.Workpiece5`, 0.05 mm raster, planes every 0.25 mm, own inscribed-radius width. **FTC-10.** Weakest Z−5.45: 2 tabs × 11.44 mm², width 2.6 mm, total 22.88 mm² (harness 22.88 at Z−5.7). At Z−0.2: 2 × 12.22 mm², width 2.6. 0.76 % of the 2,997 mm² section. W3a met. **CTC-04.** Weakest Z−1.7: 2 × 11.70 mm², width 2.6 (harness 2 × 11.96). At Z−0.2 the tabs flare to **2 × 15.6 = 31.2 mm²**, above the 30 mm² limit at the plane the checklist names. I grade this as a literal breach, the same way as A1. H4 itself measures the weakest plane only (see M1). |
| B2 | Witness | **PASS** (minor M2 note) | FTC-10: 111.1 mm², 0.229 % (target ≤ 0.5 %). CTC-04: 59.96 mm², 0.146 %. **But** 52.3 mm² of the FTC-10 witness lies more than 1 mm (XY) from the tab footprints, and 15.3 mm² of that is proud by up to 0.32 mm (`wit.py`). Counting it as failed gives 99.835 % instead of 99.866 %. |
| B3 | Part-off close-up, machinist read | **PASS** (minor) | Opened `ftc_partoff_report.png`. Two 2.6 × 4.4 mm tabs under the R9 ear lobes. The underside is green except the witness patches and a few small proud specks along X≈8. These can be snapped or folded by hand: the machinist estimates about 25 N at the top of the part. No saw is needed. **But** the section is nearly constant (22.9–24.4 mm²) from Z−6.2 to Z0 (`b1_ftc.log`). The break can therefore leave a pin up to about 6 mm long that must be nipped before filing. The machinist flagged this and it was not addressed. |
| B4 | Rigidity | **PASS** | `final/setups.json` FTC-10: fraction 1.000 after setups 1–6. The first value below 30 % (0.209) is after setup 7, past the `(PART-OFF)` marker at line 100200. CTC-04: 0.996 until the marker. No rigidity issue in `issues.json`. **Note (m3).** The rule is not applied after the marker however much machining follows. On FTC-10, 8.3 min of cutting runs on the 21 % stub after the −X slab (`e3.py`). |
| B5 | Fixture | **PASS** | One `work/fixture.json` per run (`+X`/rot 90, grip 12; `−X`/rot 0, scale 0.2, grip 12), and every setup is a G68.2 frame of the same fixture. The `plan.md` reasons follow the geometry and the `fixture-suggest` ranking (+X/rot90 99.5 %; ±Z puts the counterbores down into the stub; −X points the Ø5.5 axial holes down). I agree. The cost is a 12 mm grip under 183.5 mm of overhang (E3). |
| C1–C9 | Report and page quality | see `critical_review_refine_page.md` | Out of my scope. |
| D1 | FTC-10 VALID, ≥ 95 %, no gouge region > 1 mm² | **PASS** | VALID, 99.866 % (recomputed). Gouge area 0.00 mm², maximum gouge 0.054 mm. |
| D2 | Failed regions > 2 mm² vs G-code and the reach audit | **FAIL** | There are six regions above 2 mm² (`regions.py`). **R2 (12.04 mm², face 176, drill-point cone of the shallower Y−23.5 axial hole).** T11 traced only the outer ring. Its deepest moves step down 0.45 mm over 0.75 mm of radius, slope 0.60 = cot 59°, ending at G54 Z113.55. A Ø4 flat cannot cut inside r < 2 of a concave cone, which leaves a 1.2 mm peak; this matches `dev_extreme` 1.25. The audit raw data (`runs/audit/ftc10_ext2/reach_+X_0_extended.npz`, 0-based tool index: 8 = T11, 10 = T13, 11 = T14) reaches **100 % of this cone from +Z**, and gives the inner part to T13 and T14. Top-down access is the same in this fixture (+X, rot 90) as in the audited +X, rot 0. No ball tool was ever tried there. `docs/HANDOFF_REFINE.md` does not exist, and the iteration-8 note gives only the T10-holder and flat-mill reasons and leaves out the ball tools. That is a silent miss under L3. **R1 (13.21 mm², face 174).** This is the same inner cone on the deeper hole. It coincides with the audit's own no-tool patch (hint: no tool for 91 %), so it is not a silent miss. **R3–R6 (2.1–3.1 mm²).** Scallop or radius leftovers, reached by T4/T6/T14 (hint: "passes reach the area"). They are not listed in any handoff. |
| D3 | CTC-04 held out | **FAIL** | The frozen harness was used: `run.json` sha `0b28d03c`, and the trusted evaluation came from `1cbfa1d`. The run directory has a single commit (`4e4dafe`, at the end), so git cannot show the absence of intervention, only that nothing was committed in between. There is no handoff, so it is not "reported in the handoff". The claim that the four vertical r1 hole segments are unreachable was relayed in my assignment. It does not appear in the run files or the report: I grepped notes, plan and page. I tested it, and it is **false for two segments, mostly false for a third, and true for one**. I added one top setup with straight T13 (Ø2 ball, neck 20) plunges along the hole axes, before the part-off: **99.395 %, VALID, 0 errors, 0 warnings** (was 99.18 %) (`holes_sim.log`, `holes2.py`). The Y42.5 hole (faces 159, 160, 163, 164, about 65 mm²) is fully in tolerance. The Y2.5 upper segment drops from 30.8 to 8.85 mm² failed, limited by my conservative stop 1 mm above the holder limit. That is 71 % recovered. Only the Y2.5 lower segment (29 mm²) stays blocked: the part rises to Z87.4 within the Ø16 holder radius. The plunge is valid under the harness, but it is a 16 mm full-diameter plunge with a 2 mm-flute long-neck ball, which a shop would peck or replace with a drill and finisher. |
| D4 | Visual sanity | **PASS** | Opened `ftc_dev.png` and `ctc_dev.png`. FTC-10: all six views green apart from small orange specks (cone bottoms, edge rounds) and the purple witness patches on the two lowest lobes. The underside view is machined. CTC-04: green, with one dark-red patch (region 1, 35 mm², +2.6 mm, on the −Y end) and the unmachined r1 holes. The 3D result was not inspected by me (page review). |
| E1 | Feeds vs chip load | **PASS** | `e1.py` on iteration 9. Every tool's maximum F/(flutes·S) is 1.00× the library value (T11 and T12 0.33×). Arc edge chip load F·(R+r)/R is at most 1.00× for T2, T3, T4, T11 and T12 (T13 1.01×). The machinist's 2–7× arc defect is fixed. Side effect: the harness now warns "rubbing" (<0.2×) at 4 places (`issues.json`), and cycle time rose from 90.8 to 116 min, about 30 min of it slower helices. |
| E2 | Stick-out and reach | **FAIL** (flag) | Unchanged from the machinist's table: T3 at 6.6D, T4 at 8D and T7 at 6.6D, with no stated reason. T11 still bores Ø5.5 from solid at 12.8D, because T10 still pre-drills only to G54 Z119.5 (frame Z99.5, line ~6740). |
| E3 | Grip and stub | **FAIL** (marginal) | Grip is still 12 mm (`fixture.json`) under 183.5 mm of overhang. T1 was moved to S15000 only in setup 1. Setups 2–8 still run T1 at S18000 (900 Hz tooth passing, `e1.py`), and the machinist asked for the high-Z passes of setups 2 and 3 as well. |
| E4 | Air cutting | **NOT VERIFIED** | I did not recompute `vol == 0` for iteration 9. The machinist measured 45.0 % on iteration 8 (> 40 % nominally), with 4.8 % true air. Iteration 9 adds about 30 min of slower helices that do remove material, so the share is likely lower. It is unknown until recomputed. |
| E5 | Safe indexing | **PASS** | Each of the 8 `G69` is preceded by `M5` and by a `G0` to frame Z170.598 (TOP frame Z151.43 = G54 Z171.4). 0 of 48 `M5` follow a feed move. 0 cutting moves with the spindle off. `S… M3` comes before every first cut. Machinist edits 1 and 2 are done. |
| E6 | Part-off | **FAIL** (nominal) | The order is +X → −X → +X, not one pass per side. The smallest section is last (middle web segment ramped in, lines 124922–124929, edit 5 done). Tabs are reachable for the operator. After the −X slab (line 108344), 8.3 min of cutting still runs on the 21 % stub: T14 5.7 min, then PO-3 T1/T2/T3/T4 2.4 min over 13.5k lines. Before the revision it was 13.2 min. The PO-3 re-plan was not done. |
| E7 | Machinist verdict | **RUN WITH MINOR EDITS** | Safe-indexing, arc-feed and ramp edits are in. Still open: the 6 mm pin, T11 boring from solid, the 12 mm grip, T1 at 900 Hz in setups 2–3, the PO-3 work on the opened stub, and the PO-2 slab holder margin (3.0 / 0.8 mm), which is not recorded in `plan.md` or the notes. |
| W1 | See the +2 axes move the workpiece | see page review | Section C scope. |
| W2 | No "unreachable"; unfinished = failed | **PASS** (with M2) | A1 recomputation: excluded area = edge band + witness only. Wording is clean (A4). The skip-face test passes. The witness rule forgives a little more than the brief's 1.0 mm, a PROPOSED number (B2, M2). |
| W3 | Only small hand-removable tabs; machine does the parting | **PASS** (minor) | B1 and B3: 2.6 mm tabs, 22.9 mm², hand-breakable, underside machined. Pin up to 6 mm (m2). |
| W4 | Rigid until the part-off at the end | **PASS** (note) | B4. Note m3: 16.5k lines after the marker run on a 21 % stub. |
| W5 | Single vise fixture chosen from geometry | **PASS** | B5. |
| W6 | Eval resists reward hacking | **FAIL** | M1, M2, M3, M4 are attacks of the listed kinds (big tabs, unfinished underside, generator import, harness edit) that the automatic checks do not catch. The actual runs are only marginally affected: M2 on FTC-10 is −0.03 pp, and I verified M4 manually against the addendum hash and the STEP area. |
| W7 | ±0.1 mm two-sided | **PASS** | Recomputed with \|dev\| ≤ 0.1 on every scored probe. Gouged probes are never in the witness. |
| W9 | Showcase good enough for a friend | **owner's call** | My opinion: the result is impressive (99.87 % of the whole surface, two 2.6 mm tabs). I would show it once D2 is fixed or honestly listed, and once the handoff exists. |
| W10 | Held-out validation reported honestly | **FAIL** | D3. The run was done, but there is no handoff, and the relayed "unreachable" claim is wrong for 2½ of the 4 hole segments (D3). |
| W11 | Independent critical verification vs criteria fixed upfront | **FAIL** (pass condition) | The order is right: criteria were committed in `8dfa829` (23:39), with no change since except the dated addendum: `git diff 8dfa829 HEAD` shows the checklist unchanged and `ACCEPTANCE_REFINE.md` with 47 inserted lines only, all in the addendum (`c2ae31a`, `bd4ac64`, 00:56). The runs were created at 01:22 and 01:25. The addendum's fixture-collision change says it is "both tighter and looser" and has no recorded owner sign-off. The row's pass condition ("all OWNER rows PASS") is not met: W6, W10 and W14 fail. |
| W14 | Usage, open source, push, subagents | **FAIL** | `PROGRESS.md` ends at 01:00, with no results and no token usage for either refine run. `git ls-remote origin`: there is no `claude/3plus2-refine` branch, and the remote head is `7ccec4f`, so the 21 refine commits are unpushed. There is no `docs/HANDOFF_REFINE.md`. Open-source tools only: yes. |

## Defects, ranked

### Blocker
None in the machining result itself. The FAILs on OWNER rows W6, W10, W11 and W14 block the showcase claim under the
checklist's rule, until fixed and re-reviewed.

### Major
1. **M1: tab size is checked at the weakest plane only.**
   - **Reproduce.** `tests/test_review_attacks.py::test_review_necked_tabs_with_big_pads_invalid` (xfail). Tabs are 2.6 mm wide at Z−11.5..−1.5, then 4.5 × 5.2 mm pads, 1.5 mm thick, at the part. More than 40 mm² of section lies 0.2 mm below the part, each pad is 4.5 mm across in its smallest direction, and the program is VALID (0 errors).
   - **Real case.** The CTC-04 tabs reach 31.2 mm² at Z−0.2.
   - **Fix.** Apply the width and total rules on every plane between the weakest plane and Z−0.05, or at Z−0.2 as the checklist B1 says. Tightening only.
2. **M2: witness overreach.**
   - **What happens.** `sim5.tab_witness` grows the joint over the whole proud region connected to a tab top. Up to 1.5 % of unfinished surface next to a tab is excluded instead of failed.
   - **Reproduce.** `test_review_proud_strip_next_to_tab_is_failed` (xfail).
   - **FTC-10.** 15.3 mm² of proud surface more than 1 mm from the tab footprint is excluded (−0.03 pp).
   - **Fix.** Joint = proud probes inside the tab's own section footprint, grown by the tab width or 1 mm at most. Score the rest of the region as failed. This matches the brief's R1 wording, "within 1.0 mm of where a tab joins the part". R1 is the owner's rule; the 1.0 mm is PROPOSED.
3. **M3: the generator scan is easy to bypass.**
   - **What gets through.** It scans only `*.py` for literal tokens, so `exec` of a built string and a Python heredoc in a `.sh` file both pass.
   - **Reproduce.** `test_review_scan_catches_exec_string_import` and `test_review_scan_catches_shell_heredoc_import` (xfail).
   - **Fix.** Scan every text file, and flag `exec`/`eval`/`compile`/`runpy`/`sys.path` manipulation. Better: run the generator as a separate OS user with no read access to `cncllm/`, which the brief's admin-access note allows.
4. **M4: the integrity anchors are self-referential or agent-writable.**
   - **The hash check.** It compares against `harness_frozen.json` in the same tree. A committed edit plus a re-freeze passes (`tamper2.sh`), and `frozen_eval.sh` then picks that commit by default (`git log -1 -- harness_frozen.json`).
   - **The part.** It is identified by `run.json` (`part_dir`, `part_sha256`), which the agent can write. A swapped part passes (`swap.py`).
   - **Fix.** Hard-code the frozen commit and sha from the acceptance addendum into `frozen_eval.sh`, and fail on mismatch. Recompute the part sha from `source_step` + `fixture.json` in the clean checkout, never from `run.json`.
   - **For these two runs** I verified this manually (A6), so the numbers stand.
5. **M5: FTC-10 silent miss, region 2.**
   - **What was missed.** Region 2 is the inner drill-point cone of the shallower Y−23.5 axial hole, 12.04 mm². T11 traced only the outer ring; a Ø4 flat cannot do more on a concave cone. The audit shows the inner cone reachable from +Z by T13/T14, and no ball tool was ever tried there.
   - **What is written about it.** No handoff lists it. The notes shown on the report give only the T10-holder and flat-mill reasons and leave out the ball tools.
   - **Fix.** Either cut it (T14 rings inside the cone, neck 30 mm; re-simulate), or list it in `docs/HANDOFF_REFINE.md` as a known program miss with the true cause, and correct the page text.
6. **M6: the CTC-04 claim "four vertical r1 hole segments unreachable" (relayed in my assignment; not in the run files) is false for 2½ of 4.**
   - **Result.** Y42.5 hole: both segments fully in tolerance. Y2.5 upper segment: 71 % recovered. Y2.5 lower segment: blocked.
   - **Reproduce.** Insert the block from `mkhole.py` before `(PART-OFF)` and run `x5 sim` on a copy: 99.395 %, VALID, 0 errors.
   - **Contributing harness defect.** The reach hint ("found no tool for 83–86 %") cannot see a tool whose radius equals the hole radius on its 0.15 mm raster, so it misled the agent. Add the feature-axis plunge of a tool with R = hole radius as an explicit hint case.
   - **Fix.** Report the held-out result with this correction. Do not re-run it as held-out.
7. **M7: missing handoff, usage log and push.**
   - **What is missing.** There is no `docs/HANDOFF_REFINE.md` with the owner's 5-minute check and known misses, no usage in `PROGRESS.md`, and the branch is not pushed.
   - **Fix.** Write them, then push `claude/3plus2-refine`.

### Minor
- **m1.** The CTC-04 edge band is 1.32 % (> 0.9 %), because the 0.03 mm band does not scale with ×0.2. Report it, or score CTC-04 with the band included (99.129 %).
- **m2.** These machinist items were not addressed in iteration 9:
  - the pin left by the tab, up to 6 mm (neck the tabs just below Z0);
  - T11 still bores from solid;
  - the grip is still 12 mm;
  - T1 runs at 900 Hz in setups 2–8;
  - PO-3 work runs on the opened stub;
  - the slab holder margin is not on the setup sheet.
- **m3.** The rigidity rule stops at the `(PART-OFF)` marker whatever follows it. Suggest a 30 % rule up to the first slab move, or a cap on the work done after the marker.
- **m4.** The arc-compensated centre feeds trigger the harness's own "rubbing" warnings. The harness should judge arc feeds at the cutting edge.
- **m5.** CTC-04 indexes after only a frame-Z5 retract (for example lines 132183–132188). It relies on the machine's automatic retract, the same issue the machinist flagged on FTC-10.
- **m6 (transparency).** My tamper demonstration left an unreferenced commit object `b8e8457` in the repository's object store. No branch points at the object and the worktree has been removed (`git worktree prune`). The uncommitted report and viewer changes in the tree at the end of this review (`cncllm/report5.py`, `cncllm/viewer/*`, `runs/*/report/*`, `final/viewer_data/rigidity.json`) are not mine: they appeared during the review, alongside the page reviewer's commit `b1cebcd`. The hashed harness files, final programs and metrics are unchanged since `4e4dafe`.

## Test suite
`/home/paris/cnc-llm/.venv/bin/python -m pytest -q tests` (`/home/paris/review_tmp/tests.sh`, log `pytest.log`): **75 passed, 4 xfailed in 705 s, exit 0**. The 4 strict xfails are review defects M1, M2, M3 (two). They turn red when the defects are fixed; remove the markers then. The 6 other new review tests pass: baseline, edge ridge, wide tabs, five tabs, nested import, tampered harness copy.

## Overall verdict
**Not yet acceptable as the showcase claim. The machining itself is strong.**
- **The FTC-10 number is real.** I recomputed 99.866 % VALID from the probes. I reproduced the clean-checkout pipeline on CTC-04; FTC-10 was not re-run, but its hash and program are the same. The tabs are 2 × 11.44 mm² and 2.6 mm wide. The post-review revision really applied the safe-indexing and arc-feed edits.
- **The evaluator is not yet attack-proof.** It has four gaps (M1–M4), even though these runs exploit them only marginally.
- **Two misses are excused or unlisted.** On FTC-10, one reachable miss is excused with a wrong cause and not listed (M5). On the held-out CTC-04, the relayed claim that 4 hole segments are "unreachable" is wrong: one frozen-library tool recovers 2 fully and a third mostly (M6).
- **The phase is not finished.** The handoff, usage log and push are missing (M7).
