"""Second critical reviewer's attacks on the harness v2.1 evaluator (docs/reviews/critical_review_refine_v2.md).

Written by the reviewer, not the developer. Attacks that currently get through are marked xfail(strict=True) with the
defect number of the v2 review: the suite stays green while the defect is open and turns red when it is fixed (remove
the marker then).
"""
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent))
from test_review_attacks import SY, _end, _index, _scan, box, errors, program  # noqa: E402,F401

from cncllm import sim5  # noqa: E402


def _rib_program():
    """Tabs 2.6 mm wide, necked between Z-11.5 and Z-1.5 (2 x 4.5 x 2.6 mm at the weakest plane), that merge 1.5 mm
    below the part into a 30 mm long, 2.6 mm wide rib along the underside: 78 mm2 of material joins the part."""
    y_passes = [(21, -5.0), (14, -5.0), (7, -5.0), (1.3, -5.0),
                (21, -6.5), (14, -6.5), (7, -6.5), (2.6, -6.5), (1.3, -6.5)]
    g = program(y_passes=y_passes, tab_x=15.0, splits=())
    fy, fz = -6.5 + 5.0, -SY - 2.0          # tool centre Z-6.5 (cuts Z-11.5..-1.5), tip at Y+2 (through the web)
    neck = [_index((0, 90, 0), (0, -SY, -5))]
    neck += [f"G0 X-62 Y{fy:g} Z10", f"G1 Z{fz:g} F900", "G1 X-14.5 F2400", "G0 Z10"]
    neck += [f"G0 X0 Y{fy:g} Z10", f"G1 Z{fz:g} F900", "G0 Z10"]
    neck += [f"G0 X62 Y{fy:g} Z10", f"G1 Z{fz:g} F900", "G1 X14.5 F2400", "G0 Z10"]
    neck += [_end()]
    head, tail = g.rsplit("M5\nM30", 1)
    return head + "\n".join(neck) + "\nM5\nM30" + tail


def test_review_v2_necked_tabs_into_long_rib_invalid(box):
    """M1 was fixed for width only. A rib <= 3 mm wide but 30 mm long joins the part with 78 mm2 (> 30 mm2) 0.2 mm
    below it (checklist B1: 'section ... at 0.2 mm below the part ... total 2-30 mm2'). Must be INVALID."""
    r = sim5.run(_rib_program(), box, verbose=False)
    wp = r["workpiece"]
    xs, ys = np.arange(-20, 20, 0.05), np.arange(-4, 4, 0.05)
    X, Y = np.meshgrid(xs, ys)
    at_part = wp.inside(np.c_[X.ravel(), Y.ravel(), np.full(X.size, -0.2)]).reshape(X.shape)
    assert at_part.sum() * 0.05 ** 2 > 60, at_part.sum() * 0.05 ** 2     # the rib really is there
    other = [i["msg"] for i in r["issues"] if i["severity"] == "error" and i["kind"] != "part-off"]
    assert other == [], other
    assert not r["metrics"]["valid"], (r["partoff"]["tabs"], r["partoff"].get("max_width_to_part"),
                                       r["metrics"]["tab_witness_pct"])


def test_review_v2_scan_catches_pkgutil(tmp_path):
    body = "import pkgutil\nsim5 = pkgutil.resolve_name('cnc' + 'llm.sim5')\n"
    assert not _scan(tmp_path, "pk", {"gen.py": body})["ok"]


def test_review_v2_scan_catches_getattr_exec(tmp_path):
    body = "import builtins\ngetattr(builtins, 'ex' + 'ec')('from cnc' + 'llm import sim5')\n"
    assert not _scan(tmp_path, "ga", {"gen.py": body})["ok"]


def test_review_v2_scan_catches_shell_variable(tmp_path):
    body = "#!/bin/sh\nP=cnc\npython3 -c \"from ${P}llm import sim5; print(sim5.run)\"\n"
    assert not _scan(tmp_path, "sv", {"gen.sh": body})["ok"]
