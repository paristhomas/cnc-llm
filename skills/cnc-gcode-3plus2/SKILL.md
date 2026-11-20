---
name: cnc-gcode-3plus2
description: Write indexed 5-axis (3+2, G68.2 tilted work planes) G-code for an aluminium part held in a vise, refine it against the cncllm 3+2 machining simulator (vise collisions, rigidity, part-off), and produce a web report. Use when asked to machine a part on a 5-axis / 3+2 machine, or for parts with features on several faces or angled features.
---

# 3+2 CNC programming with simulator feedback (cncllm.x5)

You are the CAM programmer and the post-processor for a trunnion 5-axis machine used in 3+2 mode.
- Pick how the part sits in the vise.
- Write every toolpath yourself: your own Python that prints G-code, or hand-written G-code.
- Machine the part from several tilted planes, keeping it rigidly attached to the vise stub.
- Finish with a part-off that leaves small tabs for the operator.

The simulator checks for:
- gouges, and material left behind;
- crashes, including tool or holder against the vise and table;
- rigidity;
- the part-off.

Read the 3-axis skill (`skills/cnc-gcode/SKILL.md`) first. Everything in it applies: tool library, cutting data, iteration loop and rules. This page covers only what 3+2 adds.

## 1. Choose the fixture (orientation in the vise)
```bash
python -m cncllm.x5 fixture-suggest part.step          # ~1-2 min; ranks 12 orientations
```
For each orientation the output gives:
- `reachable_pct`: surface reachable in 3+2 by the smallest tools;
- `slenderness`: height / smallest footprint (tall slender parts chatter);
- `parting_face_pct`: share of surface on the parting plane, finished by hand after break-off.

Prefer:
- high reachability;
- a low, stable stance;
- a parting face that is plain and non-critical: a flat bottom with no features is ideal.

Write `fixture.json`:
```json
{"up": "-Y", "rot_z_deg": 0, "scale": 1.0, "margin": 3, "top": 1.5, "gap": 14, "grip": 8}
```
- `up`: the model axis that points up.
- `gap`: clearance between the jaw tops and the part bottom. Make it big enough for the holder to clear the jaws when cutting the lowest side features and the part-off slot from the side: a 32 mm holder needs about 16 mm plus the tool's distance below the holder face.
- `grip`: the stub height held in the jaws.

```bash
RUN=$(python -m cncllm.x5 new-run part.step --fixture fixture.json --name <name> --model "<model>")
```
Read `$RUN/brief/brief.md`. It covers:
- fixture frame, stock, vise boxes, dialect, checks, tools;
- a greedy list of tool directions that reach the surface;
- the B-rep digest in the fixture frame.

Look at `brief/target_iso.png` and `brief/reachability.png`.

## 2. Plan the setups
Group features by tool direction, and use as few orientations as is sensible. Each `G68.2` frame is a 3-axis job in that frame's coordinates, so everything from the 3-axis skill applies inside it.

Typical order:
1. From +Z: face the top; rough and finish the top features.
2. Side and angled faces, one orientation each:
   - rough, finish, holes and chamfers;
   - keep a rigid connection, never cutting into the stub gap more than needed.
3. Last, behind a `(PART-OFF)` comment: cut through the stub gap from the sides, leaving tabs or a web of a few mm²
   (≥ 2 mm² in total, ≤ 15 % of the stock section). Place the tabs where breaking and filing them is easy. The parting
   face is not scored.

Frame maths:
- R = Rz(I) · Rx(J) · Rz(K), and the tool axis is R[:,2].
- A point p in G54 has frame coordinates Rᵀ(p − origin).
- Put the frame origin on the face you machine (for example the face centre), so frame Z0 is that face.
- Compute every coordinate in your generator with numpy. Test each frame transform on a known feature before writing paths.

## 3. Simulate, read the feedback, revise
```bash
python -m cncllm.x5 sim $RUN $RUN/work/program.nc --note $RUN/work/notes.md
```
`iter_NN/feedback.md` has:
- metrics and errors;
- a setups table, giving tool axis and A/C angles for each orientation;
- a rigidity / part-off table;
- regions, each with its nearest passes per frame.

`deviation_views.png` shows four views.

Fix the problems in this order:
1. vise or holder collisions;
2. other crashes;
3. rigidity;
4. gouges;
5. proud regions.

Surface marked "not reachable in 3+2" is excluded; don't chase it. Do at most 8 iterations.

## 4. Finish
```bash
MILLBILL_DIR=~/millbill python -m cncllm.x5 evaluate $RUN    # trusted re-run, cross-check, report
```
Report back:
- score (reachable surface in tolerance) and whole-surface score;
- validity;
- number of setups;
- cycle time;
- part-off tabs: where and how big;
- what is left and why.
