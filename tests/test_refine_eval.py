"""Refine-phase evaluator: whole-surface score, part-off tabs and witness, and the critical reviewer's attacks
(docs/ACCEPTANCE_REFINE.md H and I4). Uses an 80 x 50 x 20 box with a hand-written ideal 3+2 program
(tests/refine_fixture.py); each attack is a variant of that program and must be scored failing or INVALID."""
import json
import sys
import tempfile
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent))
from refine_fixture import FIXTURE, box_program, make_box_step  # noqa: E402

from cncllm import part5, sim5, x5  # noqa: E402
from cncllm.part import TOL  # noqa: E402


@pytest.fixture(scope="module")
def box():
    d = Path(tempfile.mkdtemp())
    step = make_box_step(d / "src" / "box.step")
    part5.place(step, FIXTURE, d / "p")
    return part5.load(d / "p", verbose=False)


_cache = {}


def sim(box, variant):
    if variant not in _cache:
        _cache[variant] = sim5.run(box_program(variant), box, verbose=False)
    return _cache[variant]


def test_ideal_program_is_valid_and_complete(box):
    r = sim(box, "ideal")
    m, po = r["metrics"], r["partoff"]
    assert m["valid"], [i for i in r["issues"] if i["severity"] == "error"]
    assert m["whole_surface_in_tol_pct"] > 99.9
    assert po["ok"] and len(po["tabs"]) == 2
    assert all(abs(t["area_mm2"] - 11.7) < 1.0 and t["width_mm"] <= 2.7 for t in po["tabs"])
    assert 2.0 <= po["total_mm2"] <= 30.0
    assert 0.2 < m["tab_witness_pct"] < 1.0      # two small joints with a 1 mm ring
    assert m["edge_band_excluded_pct"] < 0.9


def test_score_is_whole_surface_and_recomputable(box):
    """Headline = in-tolerance share of every probe except edge band and witness; nothing else is excluded."""
    r = sim(box, "skip_face")
    dev, a = r["dev"], box.parea
    scored = (r["score_cls"] == 0)
    assert np.array_equal(r["score_cls"] == 2, box.pedge)
    assert np.array_equal(r["score_cls"] == 1, r["witness"] & ~box.pedge)
    mine = 100 * a[scored & (np.abs(dev) <= TOL)].sum() / a[scored].sum()
    assert abs(mine - r["metrics"]["whole_surface_in_tol_pct"]) < 1e-3
    # the underside is scored like any face
    under = (box.P[:, 2] < 1e-3) & (box.N[:, 2] < -0.99)
    assert scored[under].mean() > 0.95


def test_attack_big_tabs_invalid(box):
    """Attack a: the part left on a full web (no tab cuts) -> INVALID, nothing forgiven."""
    r = sim(box, "bigtabs")
    m = r["metrics"]
    assert not m["valid"] and not r["partoff"]["ok"]
    assert r["partoff"]["total_mm2"] > 30
    assert m["tab_witness_pct"] == 0.0
    assert any(e["kind"] == "part-off" for e in r["issues"] if e["severity"] == "error")


def test_attack_underside_skipped(box):
    """Attack b: the underside left 0.4 mm proud and connected to the tabs -> witness blows the 1.5 % limit, run
    INVALID, and the underside counts as failed surface."""
    r = sim(box, "underside_skipped")
    m = r["metrics"]
    assert not m["valid"]
    assert any("witness" in e["msg"] for e in r["issues"] if e["kind"] == "part-off")
    assert m["whole_surface_in_tol_pct"] < 75          # 4000 of 13200 mm2 is underside
    assert m["tab_witness_pct"] == 0.0


def test_attack_wall_skin_in_edge_band(box):
    """Attack c: a 0.25 mm skin left on every wall: the 0.03 mm edge band cannot hide it."""
    r = sim(box, "wall_skin")
    m = r["metrics"]
    assert m["whole_surface_in_tol_pct"] < 65
    assert m["edge_band_excluded_pct"] < 0.9


def test_attack_skip_face(box):
    """Attack d: the +X wall left 1 mm proud: its area (1000 / 13200 mm2) is failed."""
    r = sim(box, "skip_face")
    m = r["metrics"]
    assert 91.5 < m["whole_surface_in_tol_pct"] < 93.0
    assert m["whole_surface_proud_pct"] > 7


def test_witness_never_forgives_gouges(box):
    r = sim(box, "gouge_at_tab")
    assert r["metrics"]["whole_surface_gouge_pct"] > 0.5
    assert not (r["witness"] & (r["dev"] < -TOL)).any()


def test_no_partoff_invalid(box):
    r = sim(box, "no_partoff")
    assert not r["metrics"]["valid"]
    assert r["metrics"]["whole_surface_in_tol_pct"] < 75    # the unfinished underside is failed surface


def test_integrity_failures_invalidate():
    """Attacks e/f: harness edited after freezing, uncommitted harness edits, part changed, generator importing the
    simulator: each is a reason for INVALID."""
    meta = {"harness": {"sha256": "a" * 64}, "part_sha256": "p1"}
    clean = {"sha256": "a" * 64, "harness_modified": False}
    ok_scan = {"ok": True, "forbidden_imports": []}
    frozen = {"sha256": "a" * 64, "date": "2026-11-21"}
    assert x5.integrity_failures(clean, meta, "p1", ok_scan, frozen) == []
    assert x5.integrity_failures({**clean, "sha256": "b" * 64}, meta, "p1", ok_scan, frozen)
    assert x5.integrity_failures({**clean, "harness_modified": True, "modified_files": ["M cncllm/sim5.py"]}, meta,
                                 "p1", ok_scan, frozen)
    assert x5.integrity_failures(clean, meta, "p2", ok_scan, frozen)
    assert x5.integrity_failures(clean, meta, "p1", {"ok": False, "forbidden_imports": ["gen.py: cncllm"]}, frozen)
    # no frozen file: falls back to the harness recorded at run start
    assert x5.integrity_failures({**clean, "sha256": "c" * 64}, meta, "p1", ok_scan, None)


def test_generator_scan_catches_dynamic_imports(tmp_path):
    (tmp_path / "ok.py").write_text("import numpy as np\n# we call python -m cncllm.x5 sim from the shell\nprint(1)\n")
    assert x5.scan_generator5(tmp_path)["ok"]
    for bad in ["import cncllm.sim5\n", "from cncllm import sim5\n", "m = __import__('cnc' + 'llm')\n",
                "import importlib\nimportlib.import_module('x')\n", "import subprocess\nsubprocess.run(['python','-m','cncllm.x5'])\n"]:
        d = tmp_path / ("b%d" % abs(hash(bad)))
        d.mkdir()
        (d / "gen.py").write_text(bad)
        assert not x5.scan_generator5(d)["ok"], bad
