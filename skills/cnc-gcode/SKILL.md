---
name: cnc-gcode
description: Write 3-axis milling G-code for an aluminium part yourself and refine it in a closed loop with the cncllm machining simulator, then produce a web report with 3D cutting visualisation. Use when asked to program/machine/CNC a part from a STEP file, generate G-code, or run the cncllm harness on a part.
---

# CNC G-code with simulator feedback (cncllm)

You are the CAM programmer **and** the post-processor. You write the toolpaths yourself (G-code directly, or your own
Python that computes every coordinate and prints G-code). The `cncllm` simulator removes material exactly as a 3-axis
machine would and tells you where the part is gouged, where material is left, and which program lines are unsafe.
You iterate until the part is right.

## 0. Setup (once)
```bash
pip install -e <repo>            # repo = this skill's repository (github.com/paristhomas/cnc-llm); needs Python >= 3.10
python -m cncllm --help
```
Your own part: `python -m cncllm init-part my_part.step parts/mine/my_part` (moves the part bottom to Z0, centres it in
XY, makes a box stock with 2 mm side and 1 mm top allowance; edit `stock.json` if needed).

## 1. Start a run
```bash
RUN=$(python -m cncllm new-run parts/dev/motor_mount --model "<your model name>")
```
Read `$RUN/brief/brief.md` completely, and look at `$RUN/brief/target_top.png` and `target_iso.png`. The brief has the
stock, fixture (vacuum plate, bottom face is the datum, cut through to Z0, max 0.5 mm into the plate), the G-code
dialect, the tool library (the only tools that exist), the checks, and a B-rep geometry digest (floor heights, holes,
fillets, free-form faces). Geometry files you may load in your own code: `part.stl`, `part.step`, `faces.json`,
`target_height.npy` (+ `.json`: top surface height on a 0.05 mm grid).

## 2. Plan (write it down in `$RUN/work/plan.md`)
Feature by feature: which tool, which strategy, depths, step-downs, step-overs, feeds/speeds, order. Typical order:
face the top -> rough everything with the biggest tool that fits (leave 0.2-0.3 mm) -> rest-rough corners and narrow
gaps with smaller tools -> finish floors -> finish walls at full depth (one or two light spring passes) -> 3D surfaces
with a ball (or bull) nose -> chamfers with the chamfer mill -> holes (helical interpolation with an endmill, or drill)
-> outer profile last (cut through to Z-0.2 or so).
Speeds: max rpm of each tool; feed = chipload x flutes x rpm (stay within 0.5-1.5x); plunge/ramp at about a third.

## 3. Write the program
Write `$RUN/work/gen.py` (or several) that prints G-code to `$RUN/work/program.nc`. Allowed: Python standard library,
numpy, scipy, shapely (2D offsets/booleans), trimesh / cadquery **only to read the part geometry**. **Not allowed:**
CAM/toolpath libraries (opencamlib, pycam, FreeCAD Path, pyactp, ...) and importing `cncllm` (the simulator) in your
generator - the loop below is the only way to use the simulator, so every attempt is recorded. Hand-written G-code is
also fine for simple features.

Geometry you must handle yourself: tool-radius offsets (no G41/G42), corner radii (an internal corner of radius r needs
a tool radius <= r, or leaves material), ball-nose 3D finishing (drop the tool on the surface: for each XY on a raster,
tip Z = max over the tool footprint of target_height(x+u) - h(|u|) with h the ball profile), ramp/helix entries,
clearance moves (rapids only above the stock top or in already-cleared air - a rapid that touches material is a crash).

## 4. Simulate, read the feedback, revise
```bash
python -m cncllm sim $RUN $RUN/work/program.nc --note $RUN/work/notes.md
```
`notes.md`: 2-6 lines on what you changed in this iteration and why (shown in the report). Then read
`$RUN/iter_NN/feedback.md` and look at `deviation_top.png` (blue = gouge, red = proud) and `height_error_top.png`.
- Fix **errors** first (crashes, overloaded cuts, unsupported codes): an invalid program scores nothing.
- Then **gouges** (scrap): the regions table lists the program lines that cut too deep.
- Then **proud regions** (material left): bbox, surface type and B-rep faces tell you which feature.
- Tool-limited and undercut surface cannot be fixed; do not chase it.
Do at most ~8 iterations; stop when >= 99% in tolerance with 0 errors, or when two iterations in a row give no gain.
Never edit anything under `cncllm/`, `parts/` or another run - the final evaluation re-runs from the repository code
in a fresh process, records a hash of the harness and the git status, and scans `work/` for forbidden imports.

## 5. Finish
```bash
python -m cncllm evaluate $RUN      # trusted re-evaluation of the best valid iteration + cross-check + report
```
Open `$RUN/report/index.html`. Report back: final score, validity, cycle time, what is left out of tolerance and why.
