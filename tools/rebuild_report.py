"""Rebuild a 3+2 run's report with the current report/viewer code (not part of the hashed harness), without touching
the trusted evaluation: the final program is re-simulated with the current harness (refused unless its hash equals
harness_frozen.json, so the numbers are the frozen harness's), then viewer data is exported and the page rebuilt.

  python tools/rebuild_report.py <run_dir> [--source final|rescore_refine]
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from cncllm import part5, report5, sim5, x5  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("run")
    ap.add_argument("--source", default="final")
    a = ap.parse_args()
    run = Path(a.run)
    frozen = json.loads((x5.REPO / "harness_frozen.json").read_text())
    hv = x5.harness_fp()
    if hv["sha256"] != frozen["sha256"]:
        sys.exit(f"harness {hv['sha256'][:12]} differs from frozen {frozen['sha256'][:12]}: refusing")
    meta = json.loads((run / "run.json").read_text())
    pdir = Path(meta["part_dir"]) if Path(meta["part_dir"]).exists() else run / "part"
    p = part5.load(pdir, verbose=False)
    src = run / a.source
    res = sim5.run((src / "program.nc").read_text(), p, verbose=True)
    old = json.loads((src / "metrics.json").read_text())
    for k in ("whole_surface_in_tol_pct", "tab_witness_pct", "tab_total_mm2"):
        if k in old and abs(old[k] - res["metrics"][k]) > 1e-6:
            sys.exit(f"re-simulation differs from {src}/metrics.json on {k}: {old[k]} vs {res['metrics'][k]}")
    report5.export_data(p, res, src)
    print("report:", report5.build(run, **({"source": a.source} if a.source != "final" else {})))


if __name__ == "__main__":
    main()
