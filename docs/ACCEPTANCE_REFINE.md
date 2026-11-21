# Acceptance criteria: 3+2 refinement phase

_Fixed 2026-11-20 23:50 UTC, before any number from this phase was computed._ The git history shows that this file and
`docs/reviews/CRITICAL_REVIEW_CHECKLIST.md` were committed before any re-score, harness change or LLM run of this phase.

Source of the requirements: `docs/BRIEF_REFINE_3PLUS2.md`. Its §1 quotes and the OWNER rows of its §6 table are the
owner's. Every number below that is not in those quotes is **PROPOSED**, and is labelled as such. A proposed number
may be tightened but never loosened, except by the owner. Where this file and the owner's words disagree, the owner's
words win.

This file supersedes `ACCEPTANCE_3PLUS2.md` **E7** (score over the 3+2-reachable surface) and **F5** (result view
shows "not reachable" and "parting face" as their own categories). Everything else in `ACCEPTANCE.md` and
`ACCEPTANCE_3PLUS2.md` still applies.

## H. Scoring (OWNER rule R1; numbers PROPOSED)
1. **Headline = whole-surface score:** the share of the part's entire B-rep surface area within ±0.1 mm.
   - Denominator: all probes, minus only (a) the 0.03 mm face-edge band (metrology artefact) and (b) tab witness
     area as defined in H3.
   - Not excluded: the parting face, the underside, undercuts, "tool-limited" area, and surface that no library tool
     reaches.
2. **Reachability is a diagnostic only.**
   - It may appear in the brief and the feedback as a hint.
   - It never removes area from any score.
   - Generated text (brief, feedback, report) never calls failed area "unreachable" or "excluded".
3. **Tab witness area** is the only exclusion that depends on the program.
   - **Tab material:** material that remains after the program, lies outside the target part, and is connected to the
     gripped stub.
   - **Tab joint:** the part-surface probes that are proud (deviation > +0.1 mm), where the material covering them is
     tab material.
   - **Witness:** every probe within 1.0 mm (3D distance; PROPOSED) of a tab-joint probe.
   - Gouged probes are never forgiven, witness or not.
   - The witness is excluded only if the part-off passes H4. Otherwise nothing is excluded and the run is INVALID.
4. **Part-off (OWNER rule R2; numbers PROPOSED).** These are checked on the final material state.
   - **Validity rules.** Breaking any of these makes the program INVALID:
     - total tab cross-section is between 2 mm² and 30 mm², and never more than 15 % of the stub section;
     - each tab is at most 3.0 mm across in its smallest direction: twice the largest inscribed radius of its section;
     - there are at most 4 tabs;
     - the witness area is at most 1.5 % of the surface.
   - **Review pass (W3a, as stated in the brief).** This is reported by the simulator and checked by the reviewer:
     - 2–4 tabs, totalling 20–30 mm², each ≤ 3 mm wide;
     - witness ≤ 0.5 %.
5. **The underside is machined (OWNER R2).** The parting face, and every face towards the stub, is scored like any
   other face.

## I. Trust (OWNER W6; tightened)
1. A trusted evaluation whose harness hash differs from the frozen hash recorded in this file's addendum is
   **INVALID**. The same applies if the generator scan finds a simulator or CAM import, or if the part hash changed.
   "Recorded" is not enough; it must invalidate.
2. The final evaluation of every showcase and validation run is re-run from a **clean checkout of the frozen
   commit**, not from the tree the machining agent worked in.
3. The MillBill cross-check agrees on ≥ 99.99 % of the points for every final program. A new tool shape that MillBill
   lacks must have a brute-force test, as the documented equivalent.
4. These attacks are regression tests in `tests/`. Each must be scored failing or INVALID:
   - a. part left on large tabs;
   - b. underside or parting face skipped;
   - c. material hidden in the edge band;
   - d. a face skipped entirely;
   - e. the harness edited after freezing;
   - f. a generator that imports the simulator.

## J. Tools (OWNER rule R4)
1. Tools may be added **before** the LLM runs only. Each needs:
   - real catalogue dimensions (diameter, flute length, neck/reach, shank, holder);
   - conservative chip load;
   - exact simulator geometry;
   - tests against brute force.
2. Each addition is listed in the addendum below, with its date and reason.
3. The library is frozen with the harness. Tools are chosen from FTC-10 and FTC-08 evidence only, never from the
   held-out CTC-04.

## K. Machine view (OWNER W1; checks PROPOSED)
1. **Default view.** The report opens in Machine view.
2. **Kinematics.**
   - Trunnion table-table: A tilts the cradle about machine X; C turns the platter.
   - The spindle stays vertical, with direction (0,0,−1) within 1e-6, through every move.
3. **Same tool tip as Part view.**
   - For every setup, A and C match `sim5.frame_angles`.
   - The tool tip relative to the part is the same as in Part view, within 1e-6 mm, for every move.
   - This is checked by a test, and by `window.__machineCheck` in the browser.
4. **Re-orientation animation.** Each re-orientation animates retract, then the table swing (cradle, platter, vise,
   stock and part rotate together), then re-approach.
5. **Drawing and DRO.**
   - Draw the cradle, trunnion supports, platter, vise, stock and stub, part, spindle nose and holder.
   - Show a DRO of X Y Z A C, the tool and the current line.
   - Keep live material removal and the G-code sync.
6. **Screenshots.** Three orientations, in both views, are committed to `docs/screenshots/`.

## L. Results (W8, W10; PROPOSED numbers)
1. **FTC-10 showcase.**
   - VALID.
   - Whole-surface score ≥ 95 %, aim 98 %.
   - No gouge region > 1 mm².
   - Tabs and witness as H4.
   - The real number is always reported.
2. **CTC-04 at ×0.2 held out.** Run with the frozen skill and harness, untouched by the developer, and reported
   honestly.
3. **"Best it can be".** Every failed region larger than 2 mm² is either:
   - shown by `docs/FTC10_REACH_AUDIT.md` to need something outside the frozen library and fixture, or
   - listed in the handoff as a known miss of the program, with its cause.

   Silent misses fail the review.

## M. Report and page quality
The rubric is in `docs/reviews/CRITICAL_REVIEW_CHECKLIST.md` §C. It is scored by a fresh reviewer agent from its own
screenshots.

## Addendum: changes after this date
Record each change with its date, its reason, and whether it tightens or loosens. Loosening needs the owner.

### 2026-11-21: implementation notes and corrections (before any LLM run of this phase)
- **H3 witness implementation (as specified, conservative).**
  - Tab tops: the material at Z−0.05 connected plane by plane (every 0.5 mm) to the stub just above the jaws.
  - Joint: every proud probe in a proud region (probes linked through 0.5 mm voxels) that touches a tab top.
  - Consequence: an unfinished underside that touches a tab counts entirely as joint, which blows the 1.5 % limit
    (attack b). A proud skin linked only through material thinner than the probe spacing is scored as failed, not
    forgiven, which is stricter.
- **H4 tab width.** Tab width is 2 × the largest inscribed radius of the island on a 0.1 mm raster. It is rounded up
  by up to 0.1 mm, which is stricter.
- **Fixture collision model: correction, flagged as both tighter and looser.**
  - The previous `kernel5.fixture_hits` treated each axial sample of the tool body as a sphere. That turned the body
    into a capsule reaching one radius past its ends: 5 mm below a T1 tip, and 16 mm below a 32 mm holder face. This
    is a modelling error, not a threshold.
  - Replaced by exact discs perpendicular to the tool axis, every 0.5 mm, against the boxes grown by an explicit
    **1.0 mm safety clearance** (`kernel5.FIXTURE_CLEARANCE`).
  - Net effect: stricter at the sides of the body (+1 mm everywhere), less over-conservative at the tip and holder
    face. Verified against brute force (`tests/test_tools_refine.py::test_disc_box_exact_against_bruteforce`).
  - Recorded here because it is a change to a safety check. It removes false positives only where the old model
    claimed contact with no real geometry.
- **Necked long-reach tools** are supported by the simulator (shank stage, flag 32) and by the fixture check, with
  tests. They are added to the library only as recorded below.
- **Integrity (I1).** The trusted evaluation now invalidates on:
  - a harness hash differing from `harness_frozen.json`;
  - uncommitted harness edits;
  - a changed part;
  - a generator scan hit (imports, `importlib`, `__import__`, or any `cncllm` / `millbill` mention in code).

  Tests: `tests/test_refine_eval.py`.
- **Re-scores under H (no new G-code):**
  - FTC-10 run 2: **79.50 % whole surface, INVALID.** Witness 17.7 %: the underside was left about 0.3 mm proud and
    touches the tabs.
  - FTC-08 ×0.5: **80.06 %, INVALID.** The part-off left 2,651 mm² of web.

  Files: `runs/<part>/<run>/rescore_refine/`.

### 2026-11-21 00:58 UTC: tools adopted and harness frozen (before any LLM run of this phase)
- **J. Tools T11–T14 adopted** (long-reach necked: 4 mm flat neck 40, 6 mm flat reach 50, 2 mm ball neck 20, 3 mm
  ball neck 30). Real catalogue families, conservative chip loads. Evidence and reasons are in
  `docs/FTC10_REACH_AUDIT.md`: they gain 3,258 mm² of FTC-10 surface the library missed. They were chosen from
  FTC-10 evidence only. CTC-04 was not looked at.
- **Fingerprint.** `cli.py` added to the hashed harness core (it holds the generator scan). This tightens the check.
- **Frozen harness:** sha256 `0b28d03c4c1fbdc6822025f0d56a623c323fcd606c7c008b6bb2848223bc8605`, file
  `harness_frozen.json`, freeze commit `1cbfa1d`.
  - Final evaluations re-run from a clean checkout of `1cbfa1d` with `tools/frozen_eval.sh <run>`.
  - The skill `skills/cnc-gcode-3plus2/SKILL.md` and the prompts `docs/LLM_AGENT_PROMPT.md` and
    `docs/reviews/CRITICAL_REVIEWER_PROMPT.md` are frozen at the same commit.

### 2026-11-21: harness v2. Loopholes closed after the critical review (tightening only)
The fresh adversarial reviewer (`docs/reviews/critical_review_refine.md`) found four evaluator gaps (M1–M4) and an
edge-band issue. Each fix below makes the evaluation stricter; none loosens a rule. The reviewer's attack tests
(`tests/test_review_attacks.py`), which were marked xfail, now pass as normal tests.

- **M1: tab width at every height.** Each stub-connected tab must be ≤ 3.0 mm across, in its smallest direction, at
  every plane from its weakest section up to 0.05 mm below the part, not only at the weakest plane. A neck with a big
  pad at the part is INVALID.
- **M2: tab joint definition.** Proud probes count as joint only if they lie over the footprint of a tab body:
  stub-connected material still present 1.0 mm below the part, dilated by 1.0 mm for the side tool's flare. The joint
  no longer grows over connected proud regions.
  - Unfinished skin next to a tab, or an unfinished underside, is failed surface. It is not excused.
  - Consequence for attack b: an unfinished underside no longer makes the run INVALID through the witness limit. It
    makes the underside count as failed surface. That is the owner's rule R1, and it is stricter for the score.
- **M3: generator scan.**
  - It covers every code file under `work/`: `.py`, `.sh`, `.bash`, `.zsh`, `.ipynb`, and any file starting with
    `#!`.
  - It flags `exec(`, `eval(`, `compile(`, `runpy`, `__import__`, `importlib`, `millbill` and `cam_agent`.
  - It flags any mention of the harness package except the documented CLI calls
    (`-m cncllm.x5 sim|evaluate|new-run|fixture-suggest`), and the `MILLBILL_DIR=` assignment for the documented
    evaluate call.
  - **Residual risk:** an agent with a shell can still reach the simulator by other means. The defences are the
    logged iterations, this scan, and review of `work/`.
- **M4: integrity no longer trusts the run's own tree.**
  - The trusted evaluation always scores the run's own `part/` folder, and ignores `part_dir` in `run.json`.
  - It regenerates the part from the tracked, unmodified source STEP with the recorded fixture. Volume, area, bounding
    box, stock, vise and part bounding box must all match.
  - `tools/frozen_eval.sh` requires the frozen commit and `CNCLLM_EXPECTED_HARNESS=<sha256>` explicitly. Both are
    taken from this addendum. A harness whose hash differs from the expected one is INVALID.
- **Edge band.** The 0.03 mm face-edge band is no longer excluded. Its probes are scored with the deviation of the
  nearest probe outside the band. At ×0.2 scale the band reached 1.32 % on CTC-04, over the 0.9 % review limit; it is
  now 0 % excluded. `probes.npz` carries both `dev` (the scored value) and `dev_raw`.
- **Not changed, recorded for the next phase:**
  - the rigidity check still stops at the `(PART-OFF)` marker;
  - the chip-load check still uses the tool-centre feed, which flags edge-compensated helical feeds as "rubbing";
  - the reach hint can miss tools whose radius equals a hole's radius;
- **Region hints (wording, fixed in v2).** Leftovers over 0.5 mm now say that the pass stops short, the tool cannot
  form the shape, or the feature was not machined. They no longer say "stepover / scallop".

### 2026-11-21 06:22 UTC: harness v2 frozen
- sha256 `2d1c96e2c70975b1e36abb62d260dd0e68b5b9908a2d63c69095a131b6d4fc8b`, freeze commit `9c0dad0`. All final evaluations of the refine phase are re-run with
  `CNCLLM_EXPECTED_HARNESS=2d1c96e2c70975b1e36abb62d260dd0e68b5b9908a2d63c69095a131b6d4fc8b tools/frozen_eval.sh <run> 9c0dad0`. The v1 evaluations (frozen `1cbfa1d`) are kept in the
  git history.
- **v2.1 (06:33 UTC).** The v2 part verification rejected every run: it compared the run's absolute source
  path with the root of the frozen checkout. It now looks up the same tracked file inside the evaluating checkout,
  which is the frozen commit's copy. The check is unchanged otherwise. Frozen sha256 `f99d775150b78d84ac985e5a024b05bb6414960ecf0f1eedc7f85dd7b5dce6cd`, freeze commit `87fb673`.
  The v2 freeze `9c0dad0` is superseded.

### 2026-11-21: harness v3. Loopholes closed after the re-review (tightening only)
The re-review (`docs/reviews/critical_review_refine_v2.md`) found these gaps. All fixes are stricter. The reviewer's
attack tests (`tests/test_review_v2_attacks.py`) were marked xfail and now pass.
- **N1: tab total and count at every height.** The 2–30 mm² total and the ≤ 4-tab count now apply on every plane
  from the weakest section up to 0.2 mm below the part, as checklist B1 says, not only at the weakest plane. A long
  rib joining the part is INVALID.
- **N2: generator scan.** It now also flags `pkgutil`, `builtins` / `__builtins__`, `sys.modules`, `python -c` in
  shell code, and `-m $VAR`. The residual risk is still disclosed.
- **N3: parts manifest.** The trusted evaluation requires the run's part name, its source STEP and its fixture scale to
  match `parts/manifest.json` of the evaluating checkout, which is the frozen commit. Files the run wrote can no
  longer rescale or swap the part.
- **Other changes.**
  - `regions.json` now lists up to 100 regions; it used to stop at 30.
  - `tools/frozen_eval.sh` is executable.
- **v3 frozen - **v3 frozen 08:24 UTC:** sha256 `63bd0ddc6479d309e2f6091ddf771cadce756f4c3af560610fb38f2ab2e619a0`, freeze commit `2a3b37d`. It supersedes v2.1 (`87fb673`).
- **Skill updated after the runs.** `skills/cnc-gcode-3plus2/SKILL.md` now states the v3 rules: the edge band is scored
  by its neighbours, the tab total, count and width apply at every height, and tabs flare towards the part. The two
  LLM runs of this phase used the skill text frozen at `1cbfa1d`, which described v1.
