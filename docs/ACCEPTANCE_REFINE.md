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
