"""Command line: python -m cncllm <command> ...

  new-run  <part_dir> [--runs DIR] [--label L]   create a run folder with the job brief, print its path
  sim      <run_dir> <program.nc> [--note FILE]  simulate one iteration, write feedback into run_dir/iter_NN/
  evaluate <run_dir> [--iter N]                  trusted final evaluation (fresh process, integrity + cross-check) + report
  report   <run_dir>                             (re)build the HTML report
  check    <part_dir> <program.nc>               one-off simulation, prints metrics (no run folder)
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

PKG = Path(__file__).resolve().parent
REPO = PKG.parent


# modules that decide the score (the report/viewer code is not part of the trust boundary)
CORE = ["gcode.py", "kernel.py", "part.py", "sim.py", "tools.py", "feedback.py", "crosscheck.py"]


def harness_fingerprint() -> dict:
    h = hashlib.sha256()
    for name in CORE:
        p = PKG / name
        h.update(name.encode())
        h.update(p.read_bytes())
    info = {"sha256": h.hexdigest()}
    try:
        info["git_head"] = subprocess.run(["git", "-C", str(REPO), "rev-parse", "--short", "HEAD"], capture_output=True,
                                          text=True, timeout=10).stdout.strip()
        st = subprocess.run(["git", "-C", str(REPO), "status", "--porcelain", "--"] + [f"cncllm/{c}" for c in CORE], capture_output=True,
                            text=True, timeout=10).stdout.strip()
        info["harness_modified"] = bool(st)
        info["modified_files"] = st.splitlines()[:20]
    except Exception as e:  # not a git checkout
        info["git_error"] = str(e)
    return info


def _run_meta(run: Path) -> dict:
    return json.loads((run / "run.json").read_text())


def cmd_new_run(a):
    from . import brief, part

    p = part.load(a.part_dir)
    runs = Path(a.runs)
    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    run = runs / p.name / (stamp + (f"-{a.label}" if a.label else ""))
    run.mkdir(parents=True, exist_ok=False)
    brief.write(p, run / "brief")
    meta = {"part": p.name, "part_dir": str(Path(a.part_dir).resolve()), "part_sha256": p.sha, "created": stamp,
            "label": a.label, "harness": harness_fingerprint(), "model": a.model}
    (run / "run.json").write_text(json.dumps(meta, indent=1))
    (run / "history.json").write_text("[]")
    print(run)


def cmd_sim(a):
    from . import feedback, part, sim

    run = Path(a.run_dir)
    meta = _run_meta(run)
    p = part.load(meta["part_dir"], verbose=False)
    hist = json.loads((run / "history.json").read_text())
    n = len(hist) + 1
    it = run / f"iter_{n:02d}"
    it.mkdir()
    shutil.copy(a.program, it / "program.nc")
    if a.note and Path(a.note).exists():
        shutil.copy(a.note, it / "notes.md")
    res = sim.run((it / "program.nc").read_text(), p)
    fb = feedback.write(p, res, it, iteration=n)
    m = fb["metrics"]
    hist.append({"iter": n, "time": dt.datetime.now().isoformat(timespec="seconds"), "metrics": m,
                 "lines": res["program"].n_lines, "moves": int(len(res["moves"]))})
    (run / "history.json").write_text(json.dumps(hist, indent=1))
    print(f"iteration {n}: score {m['machinable_in_tol_pct']:.2f}% in tolerance, gouge {m['machinable_gouge_pct']:.2f}%, "
          f"proud {m['machinable_proud_pct']:.2f}%, valid={m['valid']} ({m['errors']} errors), "
          f"cycle {m['cycle_time_min']:.1f} min")
    print(f"feedback: {it / 'feedback.md'}")


def pick_iteration(hist: list) -> int:
    valid = [h for h in hist if h["metrics"]["valid"]]
    pool = valid or hist
    best = max(pool, key=lambda h: (h["metrics"]["machinable_in_tol_pct"] - 5 * h["metrics"]["machinable_gouge_pct"]))
    return best["iter"]


def cmd_evaluate(a):
    run = Path(a.run_dir)
    hist = json.loads((run / "history.json").read_text())
    if not hist:
        sys.exit("no iterations to evaluate")
    n = a.iter or pick_iteration(hist)
    # trusted evaluation in a fresh interpreter from the repository's harness code
    final = run / "final"
    final.mkdir(exist_ok=True)
    shutil.copy(run / f"iter_{n:02d}" / "program.nc", final / "program.nc")
    env = dict(os.environ, PYTHONPATH=str(REPO))
    r = subprocess.run([sys.executable, "-I", "-c",
                        "import sys; sys.path.insert(0, %r); from cncllm import cli; cli._trusted_eval(%r, %d)"
                        % (str(REPO), str(run), n)], env=env)
    if r.returncode:
        sys.exit("trusted evaluation failed")
    cmd_report(a)


def _trusted_eval(run_dir: str, n: int):
    from . import crosscheck, feedback, part, sim

    run = Path(run_dir)
    meta = _run_meta(run)
    p = part.load(meta["part_dir"], verbose=False)
    integrity = {"harness": harness_fingerprint(), "part_sha256_now": p.sha,
                 "part_sha256_at_start": meta["part_sha256"]}
    integrity["part_unchanged"] = p.sha == meta["part_sha256"]
    integrity["harness_unchanged_since_run_start"] = integrity["harness"]["sha256"] == meta["harness"]["sha256"]
    integrity["generator_scan"] = scan_generator(run / "work")
    final = run / "final"
    res = sim.run((final / "program.nc").read_text(), p)
    feedback.write(p, res, final)
    ev = {"iteration": n, "metrics": res["metrics"], "integrity": integrity}
    mb = os.environ.get("MILLBILL_DIR")
    if mb and Path(mb).exists():
        try:
            ev["crosscheck_millbill"] = crosscheck.run(meta["part_dir"], final / "program.nc", mb)
        except Exception as e:
            ev["crosscheck_millbill"] = {"error": repr(e)}
    else:
        ev["crosscheck_millbill"] = {"skipped": "MILLBILL_DIR not set"}
    (final / "evaluation.json").write_text(json.dumps(ev, indent=1))
    # viewer data
    from . import report
    report.export_data(p, res, final)
    print(json.dumps({k: ev[k] for k in ("iteration", "metrics")}, indent=1))


FORBIDDEN = ["cncllm", "opencamlib", "ocl", "pycam", "Path.Op", "PathScripts", "pyactp", "freecad"]


def scan_generator(work: Path) -> dict:
    """Flag imports of the simulator or of CAM libraries in the LLM's own toolpath code."""
    import re

    hits = []
    files = sorted(work.rglob("*.py")) if work.exists() else []
    pat = re.compile(r"^\s*(?:import|from)\s+([\w\.]+)", re.M)
    for f in files:
        for mod in pat.findall(f.read_text(errors="replace")):
            root = mod.split(".")[0].lower()
            if any(root == b.lower() or mod.startswith(b) for b in FORBIDDEN):
                hits.append(f"{f.name}: {mod}")
    return {"files": [f.name for f in files], "forbidden_imports": hits, "ok": not hits}


def cmd_init_part(a):
    """Import a user's STEP: bottom -> Z0, XY centred, box stock with allowances."""
    import cadquery as cq

    shape = cq.importers.importStep(a.step)
    solids = shape.solids().vals()
    if len(solids) != 1:
        sys.exit(f"expected one solid, found {len(solids)}")
    bb = shape.val().BoundingBox()
    shape = shape.translate((-(bb.xmin + bb.xmax) / 2, -(bb.ymin + bb.ymax) / 2, -bb.zmin))
    bb = shape.val().BoundingBox()
    out = Path(a.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    cq.exporters.export(shape, str(out / "part.step"))
    m, t = a.margin, a.top
    stock = {"name": out.name, "x": [round(bb.xmin - m, 3), round(bb.xmax + m, 3)], "y": [round(bb.ymin - m, 3), round(bb.ymax + m, 3)],
             "z": [0.0, round(bb.zmax + t, 3)], "material": a.material, "description": a.description or f"User part {out.name}",
             "part_bbox": [round(v, 3) for v in (bb.xmin, bb.ymin, bb.zmin, bb.xmax, bb.ymax, bb.zmax)]}
    (out / "stock.json").write_text(json.dumps(stock, indent=1))
    print(out)


def cmd_report(a):
    from . import report

    out = report.build(Path(a.run_dir))
    print(f"report: {out}")


def cmd_check(a):
    from . import part, sim

    p = part.load(a.part_dir)
    res = sim.run(Path(a.program).read_text(), p)
    print(json.dumps(res["metrics"], indent=1))
    for i in res["issues"][:30]:
        print(i)


def main(argv=None):
    ap = argparse.ArgumentParser(prog="cncllm")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("new-run"); s.add_argument("part_dir"); s.add_argument("--runs", default=str(REPO / "runs"))
    s.add_argument("--label", default=""); s.add_argument("--model", default=""); s.set_defaults(f=cmd_new_run)
    s = sub.add_parser("sim"); s.add_argument("run_dir"); s.add_argument("program"); s.add_argument("--note")
    s.set_defaults(f=cmd_sim)
    s = sub.add_parser("evaluate"); s.add_argument("run_dir"); s.add_argument("--iter", type=int); s.set_defaults(f=cmd_evaluate)
    s = sub.add_parser("report"); s.add_argument("run_dir"); s.set_defaults(f=cmd_report)
    s = sub.add_parser("init-part"); s.add_argument("step"); s.add_argument("out_dir")
    s.add_argument("--margin", type=float, default=2.0); s.add_argument("--top", type=float, default=1.0)
    s.add_argument("--material", default="AL6061-T6"); s.add_argument("--description", default="")
    s.set_defaults(f=cmd_init_part)
    s = sub.add_parser("check"); s.add_argument("part_dir"); s.add_argument("program"); s.set_defaults(f=cmd_check)
    a = ap.parse_args(argv)
    a.f(a)


if __name__ == "__main__":
    main()
