---
name: cnc-gcode-3plus2
description: Write indexed 5-axis (3+2, G68.2 tilted work planes) G-code for an aluminium part held in a single vise, finish the WHOLE part including the underside, part it off onto small hand-removable tabs, refine against the cncllm 3+2 simulator (vise collisions, rigidity, part-off, whole-surface score), and produce a web report. Use when asked to machine a part on a 5-axis / 3+2 machine, or for parts with features on several faces or angled features.
---

# 3+2 CNC programming with simulator feedback (cncllm.x5)

You are the CAM programmer and the post-processor for a trunnion table-table 5-axis machine used in 3+2 mode:
- the A axis tilts the cradle (up to 110°);
- the C axis turns the platter;
- the spindle stays vertical.

Your job:
1. Choose how the part sits in the vise.
2. Write every toolpath yourself: your own Python that prints G-code, or hand-written G-code. No CAM libraries.
3. Machine **every face of the part, including the underside** (the face towards the vise stub).
4. Keep the part rigidly attached to the stub until the end.
5. Finish with a part-off that leaves only **small tabs an operator snaps or cuts by hand and files flush**.

Read the 3-axis skill (`skills/cnc-gcode/SKILL.md`) first. Its tool, cutting-data, iteration and integrity rules
apply, with **one exception**: in 3+2 nothing is "tool-limited" or "undercut". Ignore any 3-axis advice to leave
such areas alone.

## 0. The score and the rules (read this twice)
### The score
- **Score = share of the WHOLE part surface within ±0.1 mm**, two-sided: proud (material left) and gouged (too deep)
  both fail.
- Only two things are not scored:
  - the 0.03 mm face-edge band, a metrology artefact (< 1 %);
  - the **tab witness**: part surface within 1.0 mm of where your tabs meet the part. It is excused only if the
    part-off is valid.
- The underside, inside holes, undercuts and surfaces that are awkward to reach **all count**. There is no
  "unreachable".

### The reach hint
- The brief's `reach_hint.png` and the feedback's "no tool found by the quick search" are diagnostics from a coarse
  search. They are not excuses.
- If you believe an area truly cannot be machined in one vise fixture, say so in `notes.md` with the reason. It still
  counts as failed.

### Validity
These make the program INVALID:
- **Crashes:** a rapid into material; cutting with the spindle stopped; material above the flute length (or above the
  neck of a long-reach tool); holder contact.
- **Fixture contact:** tool, shank or holder within 1.0 mm of the vise jaws, vise body or table, in any orientation.
- **Rigidity:** before `(PART-OFF)`, the weakest plane of the stub gap must keep ≥ 30 % of the stock section after
  every setup.
- **Part-off,** checked on the final material:
  - tab total between 2 and 30 mm² at the weakest plane (and ≤ 15 % of the section);
  - ≤ 4 tabs, each ≤ 3.0 mm across in its smallest direction;
  - tab witness ≤ 1.5 % of the surface.

  An **unfinished underside that touches the tabs counts as tab joint**, so it blows the witness limit. Finish the
  underside before you leave the tabs.

### Targets the reviewer checks (not validity rules)
- 2–4 tabs, 20–30 mm² in total;
- witness ≤ 0.5 %;
- the machinist would run the program as it is.

## 1. Choose the fixture (orientation in the vise)
```bash
python -m cncllm.x5 fixture-suggest part.step          # a few minutes; ranks 12 orientations
```
For each orientation the output gives:
- `tool_found_pct` and `no_tool_found_mm2`: whole-surface coverage by the quick reach search, all faces including the
  bottom;
- `bottom_face_pct` and `bottom_width_mm`: the face you will finish from the side in the part-off;
- `downward_faces_low_mm2`: downward-facing surface low on the part (hard: needs a tilted or side approach);
- `slenderness`.

The face that goes towards the stub decides everything:
- **Bottom face.** The bottom face (Z0) must be finished by the **flank of a horizontal tool** (A90) running in the
  stub gap. So prefer an orientation whose bottom is **one plain flat face**, with **no holes, pockets or bosses opening
  downwards**: nothing points down into the stub. Features that open on the bottom can only be reached from below,
  and no setup reaches straight up.
- **Width.** The bottom must be narrow enough for side tools to reach from two opposite sides: width ≤ about twice the
  usable reach of the tool you will use (T1 reaches about 35 mm past its tip region before the holder; long-reach tools
  more).
- **Height.** Tall slender parts are allowed. Check rigidity, and use a deeper grip.
- **Holes.** Look at every hole axis. A deep hole needs a tool longer than the hole is deep from the side you can reach
  it. Through holes can be split: half from each end.

Write `plan.md` with the reasons (geometry + `fixture-suggest` numbers), then `fixture.json`:
```json
{"up": "-Y", "rot_z_deg": 0, "scale": 1.0, "margin": 3, "top": 1.5, "gap": 24, "grip": 10}
```
- `up`: which model axis points up.
- `gap`: clearance between the jaw tops and the part bottom. The side tools cutting the bottom have their centre at
  Z = −R. The holder (radius about 16 mm for 32 mm holders, 11 mm for the 22 mm slim holders) must clear the jaw tops
  by 1 mm, so gap ≥ R + holder radius + 1 (T1: 5 + 16 + 1 = 22 mm). Use 24 mm.
- `grip`: stub height held in the jaws. 8 mm is the minimum. **Use 10–12 mm on tall parts or under heavy side
  roughing** (machinist: chatter and vise slip).

Then:
```bash
RUN=$(python -m cncllm.x5 new-run part.step --fixture fixture.json --name <name> --model "LLM agent")
```
Read `$RUN/brief/brief.md` completely. Look at `target_iso.png` and `reach_hint.png`.

## 2. Plan the setups
Group the features by tool direction, and use as few orientations as is sensible. Each `G68.2` frame is a 3-axis job
in that frame's coordinates.

Typical order:
1. **+Z.** Face the top; rough and finish the top features; holes and bores from the top.
2. **Side and angled faces,** one orientation each: rough, rest-rough, finish, holes, chamfers.
   - Keep the stub gap mostly intact (rigidity).
   - Holes along a horizontal axis that runs through the part: machine half from each end.
3. **`(PART-OFF)` last.** This section does three things, in this order:
   1. **Underside features** that need the gap opened, if any.
   2. **Finish the bottom face from the sides.** Use A90 setups from two opposite sides (for example −Y and +Y).
      - The tool axis is horizontal and the tool centre line sits at Z = −R (frame coordinates: put the frame origin
        at Z−R on the stock side face). The flank is then exactly tangent to Z0, so the bottom is finished to size.
      - Step in along the tool axis in depth increments: cross-section ≤ 0.75 D², and only the flute length may
        touch new material.
      - Run each pass right across the footprint, outside the stock at both ends.
      - From each side, go in until the tool tips are 1.0–1.5 mm short of the centre line where the tabs will be.
        This leaves a web 2–3 mm thick.
   3. **Cut the web down to tabs.** From the two other sides (for example −X and +X), with the same Z = −R centre line,
      cut the web back so that 2–4 tabs of about 2.6 × 4–5 mm remain, about 20–30 mm² in total.
      - Put tabs near the ends of a long part, so it cannot rock.
      - To split a web into two tabs, plunge through its middle along a horizontal axis.
      - The flank leaves a small flare at each tab: under 0.1 mm within 1 mm of where a pass stops. A small tool (T3)
        keeps it smallest.

Machinist guidance (from the review of the last phase):
- one part-off pass per side, with the smallest section last;
- do not revisit side setups after the stub is opened;
- tell the operator which side to break from (in `notes.md`).

Frame maths:
- R = Rz(I) · Rx(J) · Rz(K), and the tool axis is R[:, 2].
- A point p in G54 has frame coordinates Rᵀ(p − origin).
- Documented axes: `I0 J90 K0` → the tool comes from −Y (frame x = +X, frame y = +Z, frame z = −Y); `I180 J90` → from
  +Y; `I-90 J90` → from −X; `I90 J90` → from +X.
- Compute every coordinate with numpy, and test each frame transform on a known feature first.

## 3. Simulate, read the feedback, revise
```bash
python -m cncllm.x5 sim $RUN $RUN/work/program.nc --note $RUN/work/notes.md
```
`iter_NN/feedback.md` has:
- metrics and errors;
- the setups table (tool axis, A/C);
- rigidity;
- the **part-off table** (tabs, widths, witness, and the reasons if it failed);
- the **failed regions**, each with a diagnostic hint such as "no pass reached this; nearest pass line N missed by
  0.3 mm".

The images:
- `deviation_views.png`: six z-buffered views. Green = in tolerance, orange/red = proud, blue = gouge, purple = tab
  witness. Anything not green is failed.
- `partoff_closeup.png`: the underside from below with the tabs, and the material section through the gap.

Practical notes:
- **Indexing.** Put `M5` before every `G68.2` / `G69`, and restart the spindle after `G53.1`.
- **Clearances.** In tilted setups the material state is tracked on 0.25 mm voxels. Keep shanks and holders ≥ 0.3 mm
  off finished faces and rapids ≥ 0.5 mm clear. The fixture check uses exact discs along the tool with a 1 mm
  clearance.
- **Machine travel** is not limited in 3+2 mode. G54 Z below zero (the stub gap) is fine.
- **Long-reach necked tools** (neck length in the tool table): only the neck may enter a deep feature. Material above
  the neck length is a crash. Use them for finishing and light cuts, at their own conservative chip load.
- **Finishing feeds at the library chip load.** The last machinist flagged ball and flat finishing at 2–3× the chip
  load.
- **Mesh hygiene.** `part.stl` is welded. Clean shapely offsets (`buffer(0)`, drop tiny rings).

Fix the problems in this order:
1. vise or holder collisions;
2. other crashes;
3. rigidity;
4. part-off validity;
5. gouges;
6. the largest failed (proud) regions first.

Do at most 8 iterations. Stop early when the score is ≥ 99 % with 0 errors, or when two iterations in a row bring no
gain.

## 4. Finish
```bash
MILLBILL_DIR=~/millbill python -m cncllm.x5 evaluate $RUN    # trusted re-run, integrity checks, cross-check, report
```
Never edit anything under `cncllm/`, `parts/`, `tools/` or another run, and never import `cncllm` (or use `importlib`
/ `__import__`) in your generator. The trusted evaluation re-runs the frozen harness, and any change or import makes
the run INVALID.

Report back:
- the whole-surface score;
- validity;
- the number of setups;
- the cycle time;
- the tabs: count, sizes, where they are, and which side to break from;
- the witness %;
- every failed region over 2 mm², with its cause.
