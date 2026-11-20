# Brief: 3+2 refinement phase (for a fresh machine and agent)

Written 2026-11-20, at the end of the first 3+2 phase. Read this whole file before doing anything.
The owner's two new requirements are in §1. They override anything in older docs that disagrees.

## 0. Pick up
```bash
git clone https://github.com/paristhomas/cnc-llm && cd cnc-llm
git checkout claude/3plus2-indexed-5axis          # all 3+2 work is here (not on main)
pip install -e .                                  # Python >= 3.10; cadquery brings OCP
git clone https://github.com/kulibinai/millbill ~/millbill   # MIT; independent cross-check
python -m pytest -q tests                         # 51 tests must pass before you change anything
```
Then read, in this order:
1. `docs/HANDOFF_3PLUS2.md`: what exists and the results so far.
2. `docs/ACCEPTANCE_3PLUS2.md`: the old criteria. §2 below supersedes parts of it.
3. `skills/cnc-gcode-3plus2/SKILL.md` and `skills/cnc-gcode/SKILL.md`.
4. `docs/reviews/machinist_review_ftc10_3plus2.md`.
5. The current showcase run: `runs/ftc10/20261120-165400-run2/`. Open `report/index.html` in a browser.

Viewer sources are in `cncllm/viewer/src/*5.js`. Rebuild them with esbuild into `cncllm/viewer/dist/viewer5.js` with
`cncllm/viewer/build.sh`. The report must keep working offline from `file://`.

Branch for this phase: create `claude/3plus2-refine` from `claude/3plus2-indexed-5axis`. Push at every
milestone. Do not open PRs unless the owner asks.

## 0a. You have full admin access: use it (owner's instruction)
The owner: "This agent will have full admin access. I suggest you use it". Use that access for these things:
- **Isolate the LLM from the evaluator.**
  - Run the generator subagent's work as a separate unprivileged OS user. Its workspace is the run's `work/` directory.
  - Install the harness (`cncllm/`, `tests/`, the parts and the tool library) read-only, owned by root.
  - Trusted evaluation runs as another user that the LLM user cannot write to.
  - This is a much stronger guard against reward hacking (W6) than the current sha256 check. Keep the sha256 check as well.
- **CI on GitHub.**
  - Add a GitHub Actions workflow on the work branch that runs `pytest` and re-runs the trusted evaluation of every
    final program from a clean checkout.
  - The reported score is the one CI reproduces.
  - Branch protection on `main` is fine, **but merge to `main` only if the owner asks**.
- **Install whatever open-source tooling helps.** For example:
  - node/esbuild for the viewer;
  - ffmpeg, to record a Machine-view video of the FTC-10 job for the friend demo (W9);
  - Playwright/Chromium for the reviewer's screenshots;
  - FreeCAD/OCP for B-rep work;
  - extra cores for long simulations.
- **Run long jobs unattended**: tmux or background processes, with logs. Snapshot-commit progress.

Do not use admin access to:
- force-push or rewrite any branch history;
- delete branches, runs or reviews;
- touch other repositories;
- change billing or org settings;
- weaken any check.

Ask the owner first for anything irreversible or outward-facing beyond pushing your own branch and publishing artifacts.

## 1. What the owner said (exact words, typos kept)
This phase:
> "I was kinda hoping I would see the +2 axis  and I would see how they moved the work piece."

> "Also new rule you can't just say things are unrwchable that is not true, its a failed area. For example this part
> is machineable such that only small easy to hand removed tabs are left but you haven't managed that. You're mission
> now is to write brief to refine this with more critical agent then new machine and agent will pull and continue work"

> "And how toncheck and what I actually want not some inference you've made"

Still in force from the 3+2 phase:
> "single fixture vice" · "make sure we consider things like keeping part to vice mount rigid to start with then
> parting off at end and where is best to fixture based on geometry" · "should include final op that does most of
> partinf so it's easy for operator to do final bit manually out of machine" · "we need good eval" · "Bottom centre
> part should be main one I will use as example to show friend" (= NIST FTC-10) · "Keep eye on usage" · dialect G68.2.

Still in force from the original spec (paraphrased; exact text is not in the repo):
- aluminium, ±0.1 mm;
- a closed loop with a trustworthy simulator that resists reward hacking;
- a 3D cutting visualisation that an agent evaluates;
- a web report per run;
- development parts plus held-out validation parts;
- open-source tools only;
- independent agent verification against criteria fixed upfront;
- push at every milestone;
- use subagents.

**Everything else in this brief is the previous agent's interpretation.** That includes every number not in the quotes
above. §6 labels each item OWNER or PROPOSED.

The headline result so far:
- FTC-10 claims 96.3 % "of reachable surface".
- But 12.5 % of the surface was excluded as "not reachable in 3+2", and another 6.2 % as the "parting face".
- So the honest whole-surface number is **84.8 %**. Under the new rule that run scores ~85 %, not 96 %.

## 2. New rules (supersede ACCEPTANCE_3PLUS2 E7 and F5)
R1 and "the underside is machined, leaving only tabs" are the owner's rules. Every number in R1–R4 (1.0 mm witness,
20–30 mm², ≤ 3 mm, 0.5 %/1.5 %, 30 %) is **PROPOSED**; see §6. §3 (Machine view design) and §4 (order of work) are also the
previous agent's plan, not the owner's.

### R1. No reachability exclusion
- The score is over the **whole part surface**.
- The only exclusions are:
  - **tab witness areas:** part surface within 1.0 mm of where a part-off tab joins the part;
  - the existing 0.03 mm edge band, a metrology artefact that stays.
- Nothing else is excluded:
  - no "not reachable in 3+2";
  - no "parting face";
  - no "tool-limited";
  - no "undercut".
- Reachability analysis may stay as a **diagnostic hint** in the brief and feedback ("no library tool reached this
  from the 26 cube directions"). It must never remove area from the score, and the report must not call failed area
  "unreachable".
- In the result view, every out-of-tolerance region is shown as a failure (proud or gouge). Tab witness areas get their own colour.
- If an agent believes a region truly cannot be machined with a single vise fixture, it may *argue* that in the
  run notes. The area still counts as failed. Only the owner can grant an exclusion.

### R2. The parting face is machined
- The underside of the part, the face towards the stub, must be finished by the machine like any other face. The
  part-off op cuts it to size.
- Only the tabs are left for the operator, and it must be easy to break them and file flush.
- Part-off acceptance:
  - total tab section between 2 mm² and the machinist's 20–30 mm² guidance (hard cap 15 % of the stock section, as before);
  - each tab ≤ 3 mm across in its smallest direction, so it can be snapped or cut by hand;
  - after the tabs are cut flush, everything except the tab witness areas is in tolerance.
- The simulator already reports tab sizes. It must also report the **tab witness area** (mm² and % of surface), and
  this must stay small. Target ≤ 0.5 % of surface; it is a hard failure above 1.5 %.

### R3. Same safety and trust rules as before
These are unchanged:
- vise, holder and table collisions;
- rigidity (weakest plane ≥ 30 % until `(PART-OFF)`);
- strict dialect;
- trusted re-evaluation in a fresh process;
- the MillBill cross-check at ≥ 99.99 % agreement.

The tolerance is still ±0.1 mm, two-sided.

### R4. Tooling may grow, honestly
If the whole surface needs tools the library lacks, add them **before** the LLM run, with real catalogue dimensions
(diameter, flute length, reach/neck, holder) and conservative cutting data. Candidates:
- long-reach necked small ball mills;
- a lollipop or undercut cutter;
- a slitting saw or T-slot cutter for the part-off.

The simulator must support each new tool's exact geometry:
- extend `zcut` / the holder model;
- add tests against brute force;
- add MillBill agreement checks, or a documented equivalent where MillBill lacks the shape.

Each addition is recorded in the acceptance doc with its date and reason, and is frozen before the run.

## 3. Visualisation: show the machine moving the part
The current viewer keeps the part fixed and tilts the tool. The owner wants to see the **two rotary axes moving the
workpiece**, as on a real trunnion machine. Build a "Machine view" and make it the default in the report. Keep the
current "Part view" as a toggle.

### Kinematics
- The machine is a trunnion table-table:
  - the A axis tilts the cradle about machine X;
  - the C axis is a rotary platter on the cradle;
  - the vise sits on the platter.
- The spindle stays vertical. It moves in X, Y and Z only.
- For each setup, take A and C from the `G68.2` tool axis. `sim5.frame_angles` already gives A = tilt and C = azimuth.
  Document the sign conventions, and resolve the C ambiguity consistently.
- Machine-view tool position = `Rtable(A, C) · p_G54`, where `p_G54` is the tool tip in G54/fixture coordinates. Check this:
  - the tool must stay vertical;
  - the tool must touch the same material as in Part view.
- During a re-orientation, animate:
  1. retract;
  2. A and C swinging with the table, vise, stock and part all rotating together;
  3. re-approach.

  It must read clearly as "the table moved".

### What to draw and show
- Draw the cradle, the trunnion supports, the platter, the vise, the stock and stub, the part, the spindle nose and
  the holder, all to plausible proportions.
- Show a DRO: X Y Z A C, the active tool, and the current G-code line.
- Keep live material removal in every orientation; the current shader clipping per segment can stay.
- Keep the timeline sync with the G-code listing.

### Checks
- Add a unit test or JS self-check that, for every move, Machine view and Part view give the same tool-tip position
  relative to the part.
- Take screenshots of three different orientations in both views and commit them to `docs/screenshots/`.

## 4. The work, in order
1. **Re-score under R1/R2 with no new G-code.** Re-score the existing FTC-10 run 2 and FTC-08 programs and record the
   honest numbers. Break the failed area into regions, with area, location, normal, and why the program missed each one
   (no pass there, wrong tool, holder conflict, underside or parting face, and so on).
2. **Show that the whole surface is reachable in principle.** For each failed region, find a tool, direction and
   holder that can reach it, or a new tool under R4. Write this up as `docs/FTC10_REACH_AUDIT.md`. This audit is what
   stops the "unreachable" excuse coming back.
3. **Simulator and eval changes.** Implement R1, R2 and R4:
   - tab witness measurement;
   - new scoring;
   - new feedback wording ("failed: no pass reached this", not "unreachable");
   - new tools, if any.
   Write tests. Freeze them, commit, and record the harness sha256.
4. **Viewer: Machine view (§3).**
5. **Skill update:**
   - the new rules;
   - the machinist feedback: tabs 20–30 mm² over 2–4 tabs, at most 3 mm wide; grip/stub guidance against chatter;
     finishing feeds at the library chip load; a single-pass part-off per side;
   - how to finish the underside from the side before the part-off.
   Freeze the skill.
6. **FTC-10 showcase LLM run** with the frozen skill. A subagent plays the LLM, as before.
7. **Held-out validation:** CTC-04 at ×0.2 with the same frozen skill, untouched by the developer.
8. **Critical review (§5), then fixes, then the report artifact.**

## 5. The critical reviewer (new, stricter)
The last phase's reviewers passed things the owner did not accept. This time, before step 6, set up an
**adversarial reviewer agent** with a fixed checklist written down now. It does not see the developer's summary.
It sees only:
- the repo;
- the run directories;
- the rendered report (screenshots it takes itself with Playwright).

Its job is to **find reasons to fail the work**. It must:
1. Recompute the score itself from `metrics.json`, the probe data and the exclusion masks. Confirm the total excluded
   area is tab witness plus edge band only, and is ≤ 1.5 % + 0.9 %.
2. Try to **game the evaluator**:
   - a program that leaves the part on large tabs;
   - one that skips the underside;
   - one that hides material in the edge band.
   Confirm each is scored as failing. Add each attack as a regression test.
3. Check that the report never uses "unreachable" or "excluded" for failed area. Check that the headline number is the
   whole-surface score.
4. Check that Machine view really shows A and C moving the table, vise and part, with the spindle vertical. Check
   this in at least three re-orientations, from its own screenshots.
5. Check the part-off:
   - the tab count and sizes;
   - each tab is hand-removable (≤ 3 mm wide);
   - the witness area;
   - the part is rigid until the marker.
6. Read the G-code for machinist-level issues:
   - feeds versus chip load;
   - stick-out;
   - grip;
   - air cutting;
   - safe indexing (M5, retract before G68.2).
7. Give a verdict per item, PASS or FAIL with evidence (file:line, a screenshot path, or numbers). Write it to
   `docs/reviews/critical_review_refine.md`.

Any FAIL blocks the showcase claim until it is fixed and re-reviewed. Fixing the eval after seeing results is allowed
only to close loopholes, never to loosen. Record each such change in the acceptance doc with its date.

## 6. What the owner wants, and how to check it
Only the rows marked **OWNER** are the owner's requirements. A **PROPOSED** row is the previous agent's attempt to make
a requirement measurable. Rules for PROPOSED rows:
- A proposed number may be tightened. It may only be loosened by the owner.
- Never report a proposed number as "what the owner asked for".
- Where a proposed number and the owner's words disagree, the owner's words win.

| # | Requirement | Source | How to check (method and who) | Pass |
|---|---|---|---|---|
| W1 | See the +2 rotary axes move the workpiece | **OWNER** | Reviewer opens the report in Machine view and takes Playwright screenshots before, during and after ≥ 3 re-orientations. A JS self-check exposes `window.__machineCheck` per frame: spindle direction, and table A/C versus the `G68.2` axis. | The table, vise and part visibly rotate; the spindle direction stays (0,0,−1) within 1e-6; A/C match `sim5.frame_angles` for every setup. |
| W2 | No "unreachable": surface the program did not finish counts as failed | **OWNER** | (a) Recompute the score independently from the probe dump and the exclusion mask. (b) `grep -riE "unreach\|not reachable\|excluded"` over the generated report, feedback and brief text. (c) Regression test: a program that skips a face scores that face as failed. | Excluded area = tab witness + edge band only. The headline is the whole-surface score. No failed area carries an excusing label. |
| W3 | Only small tabs, easy to remove by hand, are left; the machine does the rest of the parting | **OWNER** | The simulator's part-off table gives tab count, section and smallest width. The reviewer looks at a close-up render of the final part. The machinist reviewer agent answers: "can an operator break and file these by hand, without a saw?" | Machinist says yes; nothing needs a saw; the underside faces are machined. |
| W3a | Tab sizes: 2–4 tabs, 20–30 mm² total, each ≤ 3 mm wide; witness ≤ 0.5 % (hard 1.5 %) | PROPOSED (from the machinist reviewer agent and the previous agent) | Simulator part-off table and metrics. | As stated. |
| W4 | Part rigidly attached to the vise mount until the part-off at the end | **OWNER** | Simulator rigidity table, after every setup. | No rigidity error before `(PART-OFF)`. |
| W4a | Rigidity = weakest plane ≥ 30 % of the stock section | PROPOSED | As W4. | As stated. |
| W5 | Single vise fixture; fixture position chosen from the geometry | **OWNER** | One `fixture.json` per run, with no re-clamping. `plan.md` gives the reasons, tied to `fixture-suggest` output. | The reviewer agrees the reasons follow from the geometry. |
| W6 | Good eval that resists reward hacking | **OWNER** | The critical reviewer (§5) tries attacks: big tabs, skipping the underside, hiding material in the edge band, editing the harness, a generator importing the simulator. Each becomes a test in `tests/`. Trusted re-eval checks the harness sha256. MillBill cross-check. | Every attack is caught; MillBill agrees ≥ 99.99 %. |
| W7 | ±0.1 mm on aluminium | **OWNER** | Simulator metrics, two-sided deviation. | Applies to every scored point. |
| W8 | Score target: FTC-10 whole surface ≥ 95 %, aim 98 %; no gouge region > 1 mm² | PROPOSED (the owner gave no number; the owner's words imply "everything except tabs") | `metrics.json`, recomputed by the reviewer. | As stated. Always report the real number. |
| W9 | FTC-10 is the showcase to show a friend | **OWNER** | Publish the report as an artifact. **Only the owner can judge this.** Give the link, and the 5-minute check below. | The owner says it is good enough. |
| W10 | Held-out validation part | **OWNER** (original spec) | CTC-04 ×0.2 run with the frozen skill; the developer does not touch it. | Run, and reported honestly whatever the score. |
| W11 | A more critical independent agent verifies against criteria fixed upfront | **OWNER** | `docs/reviews/critical_review_refine.md`, written by an agent that did not do the work and did not see the developer's summary. Criteria = this table plus §5, committed **before** the LLM runs (the git history shows the order). | All OWNER rows PASS with evidence. |
| W12 | Machinist would run it as is | PROPOSED | Machinist reviewer agent verdict. | "Run as is". |
| W13 | Cycle time no worse than 86 min without a reason; Machine view loads < 5 s and works on a phone; non-machinist understands it in 60 s | PROPOSED | Report metrics; Playwright timing; phone-viewport screenshot. | As stated. |
| W15 | Use the full admin access (isolation, CI, tooling) | **OWNER** | `docs/HANDOFF_REFINE.md` lists what was set up; the reviewer verifies that the LLM user cannot write to the harness (it tries and fails) and that CI reproduces the score. | Both verified. |
| W14 | Watch usage; open-source tools; push at milestones; use subagents | **OWNER** | Usage noted in `PROGRESS.md` for each run; commit history. | Followed. |

### Questions the owner has not answered
Ask these at the start, briefly; the owner has little time. If no answer comes, keep the PROPOSED values.
1. Is there a score number you want for FTC-10? (Proposed: ≥ 95 %, aim 98 %.)
2. What tab size and count do you want? (Proposed: 2–4 tabs, 20–30 mm², each ≤ 3 mm.)
3. May we add tools to the library, such as a slitting saw, long-reach ball mills or a lollipop cutter?
4. What does the friend demo need: a video, the interactive page, or both?

### The owner's own 5-minute check (put this at the top of the final handoff)
1. Open the artifact link. The headline number is the **whole-surface** score, with the tab witness shown separately.
2. Press play in Machine view. At each change of orientation, the table should swing the part, and the spindle should not tilt.
3. Open the final result view. Anything not green is a failure, apart from the marked tabs. Click a spot to see why.
4. Look at the part-off close-up: are the tabs small enough to snap by hand?
5. Read the verdict table in `docs/reviews/critical_review_refine.md`. Every OWNER row should say PASS, with evidence.

## 7. Constraints
- Open-source tools only.
- Use subagents to protect your context. Size each one to its job.
- Watch usage: each LLM machining run is about 300–360k tokens.
  - Do steps 1–5 and 8's reviewer set-up first. They are cheap.
  - Start the expensive runs only when there is headroom.
  - Snapshot-commit if paused by a limit.
- Push at every milestone to `claude/3plus2-refine`.
- Never put model identifiers in commits or docs.
- Publish the final report as an artifact. Update `PROGRESS.md`, and write `docs/HANDOFF_REFINE.md` at the end.
