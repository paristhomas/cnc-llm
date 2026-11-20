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

## 1. What the owner said (verbatim intent)
> "I was kinda hoping I would see the +2 axis and I would see how they moved the workpiece."

> "New rule: you can't just say things are unreachable — that is not true, it's a failed area. For example this
> part is machinable such that only small, easy-to-hand-remove tabs are left, but you haven't managed that."

The headline result so far:
- FTC-10 claims 96.3 % "of reachable surface".
- But 12.5 % of the surface was excluded as "not reachable in 3+2", and another 6.2 % as the "parting face".
- So the honest whole-surface number is **84.8 %**. Under the new rule that run scores ~85 %, not 96 %.

## 2. New rules (supersede ACCEPTANCE_3PLUS2 E7 and F5)
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

## 6. Targets
| Item | Target |
|---|---|
| FTC-10 whole-surface score (R1) | **≥ 95 %**, stretch ≥ 98 %; no gouge region > 1 mm² |
| Tab witness area | ≤ 0.5 % of surface (hard limit 1.5 %) |
| Tabs | 2–4 tabs, total 20–30 mm², each ≤ 3 mm wide |
| Validity | VALID: no crash, no vise or holder hit, rigid until part-off |
| MillBill agreement | ≥ 99.99 % |
| CTC-04 ×0.2 held-out | run and reported honestly, whatever the score |
| Report | Machine view default, A/C motion visible, honest headline; critical review all PASS |

If ≥ 95 % turns out impossible, report the real number and the reach audit. Do not shrink the scored surface.

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
