# cnc-llm — an LLM writes the G-code, a simulator keeps it honest

A P0 prototype showing that a large language model can write 3-axis milling G-code for non-trivial aluminium parts
by itself, refining it in a closed loop with an exact material-removal simulator, with every run published as a
web report that includes a 3D animation of the tool cutting the part.

- **The LLM is the CAM programmer.** It reads a job brief (stock, fixture, machine, tool library, B-rep geometry
  digest) and writes the G-code, either directly or as its own Python that computes every coordinate. CAM
  libraries are not allowed.
- **Closed loop.** `cncllm sim` replays the program on the stock, checks it for crashes and implausible cutting, and
  measures the surface against the target within ±0.1 mm. Its feedback is a table of defect regions, each tied to
  the program lines responsible, plus images. The LLM revises and runs it again.
- **Trustworthy simulator.**
  - The swept volume of each move is exact: the minimum of the tool profile over each column, evaluated with no
    voxels.
  - The parser is strict: unknown codes are errors, and only tools from a fixed library exist.
  - Crash checks: rapids into material, cutting with the spindle stopped, shank or holder contact, cuts below the
    fixture, overloaded cuts.
  - Independent cross-check: MillBill's own parser and exact swept-volume kernel
    ([kulibinai/millbill](https://github.com/kulibinai/millbill), MIT) re-classify the same points.
  - The final evaluation runs in a fresh process and records a hash of the harness.
- **Report.** `runs/<part>/<run>/report/index.html` is a static page that also works offline. It shows the cutting
  animation, toolpaths, deviation maps, iteration history and issues.

## Quick start
```bash
git clone https://github.com/paristhomas/cnc-llm && cd cnc-llm
pip install -e .                      # Python >= 3.10 (numpy, numba, scipy, trimesh, matplotlib, cadquery)
python -m cncllm new-run parts/dev/motor_mount        # prints the run folder; read brief/brief.md
python -m cncllm sim <run> my_program.nc --note notes.md
python -m cncllm evaluate <run>                       # trusted re-evaluation + report/index.html
```
Use it with Claude Code: add this repository as a plugin marketplace (`/plugin marketplace add paristhomas/cnc-llm`,
then install `cnc-gcode`), or copy `skills/cnc-gcode/` into `~/.claude/skills/`. Then ask Claude: *"Use the
cnc-gcode skill to machine parts/dev/heatsink"*.

To bring your own part, run `python -m cncllm init-part my.step parts/mine/my_part`. It writes the part STEP and a
box stock (`stock.json`).

## Scope (P0)
3-axis, single setup from +Z, box stock on a vacuum plate (Z0 = part bottom = datum), aluminium, ±0.1 mm. A
LinuxCNC-compatible metric subset is used (see `cncllm/gcode.py`). Undercuts, and internal corners sharper than the
smallest tool, are reported as unmachinable proud material and are excluded from the score.

## Layout
| Path | What |
|---|---|
| `cncllm/` | parser, kernels, simulator, metric, feedback, brief, report/viewer, CLI |
| `parts/dev/`, `parts/validation/` | test parts (CadQuery sources in `parts/src/`); validation parts are held out |
| `skills/cnc-gcode/SKILL.md` | the agent skill |
| `runs/` | LLM runs with their reports |
| `docs/ACCEPTANCE.md` | acceptance criteria used by the independent reviewer agents |
| `PROGRESS.md`, `HANDOFF.md` | log and handoff |
