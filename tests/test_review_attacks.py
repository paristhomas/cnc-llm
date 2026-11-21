"""Critical reviewer's extra attacks on the refine-phase evaluator (docs/reviews/critical_review_refine.md, section A2).

Written by the reviewer, not the developer. Each test builds a variant of the 80 x 50 x 20 box program of
tests/refine_fixture.py and states the behaviour the owner's rules require (docs/BRIEF_REFINE_3PLUS2.md R1/R2,
docs/ACCEPTANCE_REFINE.md H3/H4/I1). Attacks that currently get through are marked xfail(strict=True) with the
defect number of the review, so the suite stays green while the defect is open and turns red when it is fixed
(remove the marker then).
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent))
from refine_fixture import FIXTURE, L, W, F_CUT, F_PLUNGE, make_box_step  # noqa: E402

from cncllm import part5, sim5, x5  # noqa: E402
from cncllm.part import TOL  # noqa: E402

HX, HY = L / 2, W / 2
SX, SY = HX + 3, HY + 3


@pytest.fixture(scope="module")
def box():
    d = Path(tempfile.mkdtemp())
    step = make_box_step(d / "src" / "box.step")
    part5.place(step, FIXTURE, d / "p")
    return part5.load(d / "p", verbose=False)


def _index(ijk, origin):
    x, y, z = origin
    i, j, k = ijk
    return f"M5\nG68.2 X{x:g} Y{y:g} Z{z:g} I{i:g} J{j:g} K{k:g}\nG53.1\nS18000 M3\n"


def _end():
    return "G0 Z60\nM5\nG69\n"


def program(top_half=(52, 33), y_passes=None, low_window=None, tab_x=9.5, tab_hw=1.3, splits=(0.0,), split_tip=2.3):
    """Box program with hooks.
    top_half: half extents of the tool-centre area of the top facing (ideal: 52 x 33 = whole stock).
    y_passes: list of (ytip_abs, zc) for the +-Y part-off slab passes (ideal: tips 21, 14, 7, tab_hw at zc -5).
    low_window: (x0, x1, dz, tips) - on the -Y side, passes whose |ytip| is in `tips` run dz lower between X x0..x1
                (leaves a proud strip of dz on the underside there).
    tab_x: the +-X passes stop at |X| = tab_x (web |X| < tab_x).  splits: X of the T1 plunges that split the web."""
    g = ["(review attack program)", "G21 G90 G17 G94", "T1 M6", "G43 H1", "S18000 M3"]
    tx, ty = top_half
    g += [f"G0 X{-tx:g} Y{-ty:g} Z30", f"G1 Z20.0 F{F_PLUNGE}"]
    ys = np.linspace(-ty, ty, int(np.ceil(2 * ty / 6.0)) + 1)
    for i, y in enumerate(ys):
        g += [f"G1 Y{y:g} F{F_CUT}", f"G1 X{tx if i % 2 == 0 else -tx:g}"]
    g += ["G0 Z30"]
    off = 5.0
    for z in [18, 15, 12, 9, 6, 3, 0, -1]:
        g += [f"G0 X{-HX - off - 10:g} Y{-HY - off:g}", f"G0 Z{z:g}", f"G1 X{HX + off:g} F{F_CUT}", f"G1 Y{HY + off:g}",
              f"G1 X{-HX - off:g}", f"G1 Y{-HY - off:g}", "G0 Z30"]
    g += ["(PART-OFF)"]
    y_passes = y_passes or [(21, -5.0), (14, -5.0), (7, -5.0), (tab_hw, -5.0)]
    # from -Y: frame x = X, frame y = Z + 5, frame z = -SY - Y
    g += [_index((0, 90, 0), (0, -SY, -5))]
    for ytip, zc in y_passes:
        fy, fz = zc + 5.0, -SY + ytip
        if low_window and ytip in low_window[3]:
            x0, x1, dz = low_window[:3]
            g += [f"G0 X-62 Y{fy:g} Z10", f"G1 Z{fz:g} F{F_PLUNGE}", f"G1 X{x0:g} F{F_CUT}", f"G1 Y{fy - dz:g}",
                  f"G1 X{x1:g}", f"G1 Y{fy:g}", "G1 X62", "G0 Z10"]
        else:
            g += [f"G0 X-62 Y{fy:g} Z10", f"G1 Z{fz:g} F{F_PLUNGE}", f"G1 X62 F{F_CUT}", "G0 Z10"]
    g += [_end()]
    # from +Y: frame x = -X, frame y = Z + 5, frame z = Y - SY
    g += [_index((180, 90, 0), (0, SY, -5))]
    for ytip, zc in y_passes:
        fy, fz = zc + 5.0, ytip - SY
        g += [f"G0 X-62 Y{fy:g} Z10", f"G1 Z{fz:g} F{F_PLUNGE}", f"G1 X62 F{F_CUT}", "G0 Z10"]
    g += [_end()]
    xt = [x for x in (36, 29, 22, 15) if x > tab_x + 0.5] + [tab_x]
    for ijk, sgn in (((-90, 90, 0), -1), ((90, 90, 0), 1)):
        g += [_index(ijk, (sgn * SX, 0, -5))]
        for xtip in xt:
            g += ["G0 X-10 Y0 Z10", f"G1 Z{xtip - SX:g} F{F_PLUNGE}", f"G1 X10 F{F_CUT}", "G0 Z10"]
        g += [_end()]
    g += [_index((0, 90, 0), (0, -SY, -5))]
    for xs in splits:
        g += [f"G0 X{xs:g} Y0 Z10", f"G1 Z{-SY - split_tip:g} F{F_PLUNGE}", "G0 Z10"]
    g += [_end(), "M5", "M30", ""]
    return "\n".join(g)


_cache = {}


def sim(box, name, **kw):
    if name not in _cache:
        _cache[name] = sim5.run(program(**kw), box, verbose=False)
    return _cache[name]


def errors(r):
    return [i["msg"] for i in r["issues"] if i["severity"] == "error"]


def test_review_baseline_program_is_valid(box):
    """The builder reproduces the developer's ideal box program: VALID, two 2.6 mm tabs."""
    r = sim(box, "base")
    assert r["metrics"]["valid"], errors(r)
    assert len(r["partoff"]["tabs"]) == 2 and r["metrics"]["whole_surface_in_tol_pct"] > 99.9


def test_review_edge_ridge_is_failed(box):
    """Attack c, literal form: face the top everywhere except a 0.5 mm skin (1 mm proud) along its four edges. The
    0.03 mm edge band must not hide it: about 260 x 0.47 = 122 mm2 of the top must be scored proud."""
    r = sim(box, "edge_ridge", top_half=(HX - 5.5, HY - 5.5))
    dev, a, P, N = r["dev"], box.parea, box.P, box.N
    scored = r["score_cls"] == 0
    top = (N[:, 2] > 0.99) & (P[:, 2] > 19.9)
    ring = top & ((np.abs(P[:, 0]) > HX - 0.5) | (np.abs(P[:, 1]) > HY - 0.5))
    failed_ring = a[ring & scored & (dev > TOL)].sum()
    assert failed_ring > 100, failed_ring
    assert a[ring & ~scored].sum() < 15        # only the 0.03 mm band itself is excluded
    assert r["metrics"]["whole_surface_proud_pct"] > 0.75


def test_review_wide_tabs_invalid(box):
    """Tabs 3.4 x 3.6 mm (each > 3 mm across in its smallest direction) must make the program INVALID."""
    r = sim(box, "wide_tabs", tab_hw=1.7, tab_x=8.6)
    po = r["partoff"]
    assert max(t["width_mm"] for t in po["tabs"]) > 3.0
    assert not r["metrics"]["valid"]
    assert any("wider than" in e for e in errors(r))


def test_review_five_tabs_invalid(box):
    """Five small tabs (total < 30 mm2, each < 3 mm) must be INVALID (max 4 tabs)."""
    s = 5.75
    r = sim(box, "five_tabs", tab_x=25.0, splits=(-3 * s, -s, s, 3 * s))
    po = r["partoff"]
    assert len(po["tabs"]) == 5, po["tabs"]
    assert not r["metrics"]["valid"]
    assert any("separate tabs" in e for e in errors(r))


def test_review_necked_tabs_with_big_pads_invalid(box):
    """Tabs necked to 2.6 mm between Z-11.5 and Z-1.5, but 5.2 mm wide (4.5 x 5.2 mm pads, 1.5 mm thick) where they
    meet the part. The operator snaps the neck and is left with two 1.5 mm thick 4.5 x 5.2 mm pads on the part, each
    > 3 mm across in its smallest direction: not 'small tabs easy to remove by hand' (owner R2), so the program must
    be INVALID. (Second row of -6.5 passes clears the band below Z-10 so no shank rubs.)"""
    y_passes = [(21, -5.0), (14, -5.0), (7, -5.0), (2.6, -5.0),
                (21, -6.5), (14, -6.5), (7, -6.5), (2.6, -6.5), (1.3, -6.5)]
    r = sim(box, "pads", y_passes=y_passes, split_tip=2.9)
    # the material just below the part really is wide: check it on the exact workpiece
    wp = r["workpiece"]
    xs, ys = np.arange(-12, 12, 0.05), np.arange(-6, 6, 0.05)
    X, Y = np.meshgrid(xs, ys)
    at_part = wp.inside(np.c_[X.ravel(), Y.ravel(), np.full(X.size, -0.2)]).reshape(X.shape)
    assert at_part.sum() * 0.05 ** 2 > 40          # > 40 mm2 of tab section 0.2 mm below the part (2 x 4.5 x 5.2)
    other = [i["msg"] for i in r["issues"] if i["severity"] == "error" and i["kind"] != "part-off"]
    assert other == [], other                       # nothing but the part-off may be wrong ...
    assert not r["metrics"]["valid"], (r["partoff"]["tabs"], r["metrics"]["tab_witness_pct"])   # ... so this fails


def test_review_proud_strip_next_to_tab_is_failed(box):
    """The underside under -Y, X 5..9.5 is left 0.4 mm proud from Y-14 to the tab (about 57 mm2, < 1.5 %). Probes more
    than 2 mm from the tab are not 'where a tab joins the part' and must be scored as failed, not excluded."""
    r = sim(box, "strip", low_window=(2.0, 12.0, 0.4, (7, 1.3)))
    dev, P, N = r["dev"], box.P, box.N
    under = (N[:, 2] < -0.99) & (P[:, 2] < 1e-3)
    strip = under & (P[:, 0] > 5.3) & (P[:, 0] < 9.2) & (P[:, 1] < -3.5) & (P[:, 1] > -13.5)
    assert strip.sum() > 50 and (dev[strip] > TOL).mean() > 0.9     # the strip really is proud
    # brief R1: these probes are > 2 mm from the tab, so they must not be excluded (failed, or the run INVALID, which
    # leaves the witness empty; either way the test passes once the defect is fixed)
    assert not r["witness"][strip].any(), f"{r['witness'][strip].mean():.0%} of the far strip excluded as witness"


def _scan(tmp_path, name, text):
    d = tmp_path / name
    d.mkdir()
    for fn, body in text.items():
        p = d / fn
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(body)
    return x5.scan_generator5(d)


def test_review_scan_catches_nested_import(tmp_path):
    assert not _scan(tmp_path, "nested", {"lib/deep/gen.py": "from cncllm.kernel import column_heights\n"})["ok"]


def test_review_scan_catches_exec_string_import(tmp_path):
    assert not _scan(tmp_path, "exec", {"gen.py": "m = 'cnc' + 'llm'\nexec(f'from {m} import sim5')\n"})["ok"]


def test_review_scan_catches_shell_heredoc_import(tmp_path):
    body = "#!/bin/sh\npython - <<'EOF'\nfrom cncllm import sim5, part5\nprint(sim5.run)\nEOF\n"
    assert not _scan(tmp_path, "sh", {"gen.sh": body})["ok"]


def test_review_edited_harness_copy_is_invalid(tmp_path):
    """Attack e on a real file edit: copy the package, change one line of sim5.py, fingerprint the copy in a fresh
    process; the integrity check against harness_frozen.json must fail."""
    import json
    import shutil
    src = Path(x5.__file__).resolve().parent
    dst = tmp_path / "cncllm"
    shutil.copytree(src, dst, ignore=shutil.ignore_patterns("__pycache__", "viewer"))
    s = (dst / "sim5.py").read_text()
    assert "WITNESS_MAX_PCT = 1.5" in s
    (dst / "sim5.py").write_text(s.replace("WITNESS_MAX_PCT = 1.5", "WITNESS_MAX_PCT = 15.0", 1))
    out = subprocess.run([sys.executable, "-I", "-c", "import sys, json; sys.path.insert(0, %r); from cncllm import x5; "
                          "assert x5.__file__.startswith(%r); print(json.dumps(x5.harness_fp()))" % (str(tmp_path), str(tmp_path))],
                         capture_output=True, text=True, timeout=300)
    assert out.returncode == 0, out.stderr[-2000:]
    hv = json.loads(out.stdout.strip().splitlines()[-1])
    frozen = json.loads((src.parent / "harness_frozen.json").read_text())
    assert hv["sha256"] != frozen["sha256"]
    meta = {"harness": {"sha256": frozen["sha256"]}, "part_sha256": "p"}
    fails = x5.integrity_failures(hv, meta, "p", {"ok": True, "forbidden_imports": []}, frozen)
    assert any("differs from the frozen harness" in f for f in fails)
