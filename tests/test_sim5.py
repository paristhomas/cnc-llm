"""3+2 (G68.2) simulator tests: frame maths against analytic truth, dialect errors, vise / rigidity / part-off checks."""
import json
import math
import tempfile
from pathlib import Path

import numpy as np
import pytest

from cncllm import gcode, part5, sim5

ROOT = Path(__file__).resolve().parents[1]
STEP = ROOT / "tests" / "parts" / "simple" / "part.step"   # 40 x 30 x 10 block with a pocket


@pytest.fixture(scope="module")
def part():
    d = Path(tempfile.mkdtemp()) / "p"
    part5.place(STEP, {"up": "+Z", "gap": 14, "grip": 8, "margin": 3, "top": 1}, d)
    return part5.load(d, verbose=False)


HEAD = "G21 G90 G17 G94\nT2 M6\nG43 H2\nS12000 M3\n"


def run(part, body, partoff=True):
    tail = "M5\nG69\n" if "G68.2" in body else "M5\n"
    return sim5.run(HEAD + body + tail + "M30\n", part, verbose=False)


def test_euler_examples():
    """Documented G68.2 examples give the stated tool axes."""
    for ijk, axis in [((0, 90, 0), (0, -1, 0)), ((90, 90, 0), (1, 0, 0)), ((-90, 90, 0), (-1, 0, 0)),
                      ((180, 90, 0), (0, 1, 0)), ((0, 0, 0), (0, 0, 1))]:
        R = gcode.euler_zxz(*ijk)
        assert np.allclose(R[:, 2], axis, atol=1e-12), (ijk, R[:, 2])
        assert np.allclose(R.T @ R, np.eye(3))


def test_side_slot_exact_geometry(part):
    """A 6 mm slot cut from -Y at depth 2 mm into the stock side: exact remaining material matches the analytic box."""
    lo = part.stock_lo
    yface = lo[1]                       # stock -Y face
    body = (f"G68.2 X0 Y{yface} Z5 I0 J90 K0\nG53.1\nS12000 M3\n"   # frame z = -(Y - yface): into the part
            "G0 X-30 Y0 Z10\nG0 Z5\nG1 Z-2 F500\nG1 X30 F1500\nG0 Z10\n")
    r = run(part, body)
    wp = r["workpiece"]
    # frame: x = X, y = Z - 5, z = yface - Y. Tool axis -Y, slot centre at Z=5, width 6, depth: Y up to yface + 2.
    pts = np.array([[0, yface + 1.9, 5.0], [0, yface + 2.1, 5.0], [0, yface + 1.0, 7.9], [0, yface + 1.0, 8.1],
                    [0, yface + 1.0, 2.1], [0, yface + 1.0, 1.9]])
    ins = wp.inside(pts)
    assert list(ins) == [False, True, False, True, False, True], ins


def test_tilt_45_ball_matches_bruteforce(part):
    """Inclined frame + ball tool: exact inside() equals brute-force sampling of the ball along the move."""
    body = ("T6 M6\nG43 H6\nS12000 M3\nG68.2 X0 Y0 Z11 I30 J45 K0\nG53.1\nS12000 M3\n"
            "G0 X-12 Y-4 Z6\nG1 Z0.5 F400\nG1 X12 Y5 Z-1.5 F1200\nG0 Z10\n")
    r = run(part, body)
    R, o = r["frames"][1]["R"], r["frames"][1]["origin"]
    p0, p1 = np.array([-12, -4, 0.5]), np.array([12, 5, -1.5])
    c0, c1 = o + R @ (p0 + [0, 0, 3]), o + R @ (p1 + [0, 0, 3])     # ball centre = tip + R along the axis
    rng = np.random.default_rng(3)
    lo, hi = part.stock_lo, part.stock_hi
    Q = lo + (hi - lo) * rng.random((20000, 3))
    t = np.linspace(0, 1, 4001)
    C = c0 + (c1 - c0) * t[:, None]
    d = np.min(np.linalg.norm(Q[:, None, :] - C[None, ::8, :], axis=2), axis=1)
    sure_cut, sure_keep = d < 3 - 0.02, d > 3 + 0.3      # away from the tolerance band / shank region
    # material above the ball in the frame (shank region) is also removed: only test points below the ball centre line
    q = (Q - o) @ R
    zc = np.interp(np.clip(((q[:, :2] - p0[:2]) @ (p1 - p0)[:2]) / ((p1 - p0)[:2] @ (p1 - p0)[:2]), 0, 1), [0, 1],
                   [p0[2] + 3, p1[2] + 3])
    below = q[:, 2] < zc - 0.1
    ins = r["workpiece"].inside(Q)
    assert not ins[sure_cut & below].any()
    # points far below the ball path and far from it keep their material
    assert ins[sure_keep & (q[:, 2] < zc - 3.5) & (q[:, 2] > -50)].all()


@pytest.mark.parametrize("body,msg", [
    ("G68.2 X0 Y0 Z0 I0 J90\nG53.1\n", "missing K"),
    ("G68.2 X0 Y0 Z0 I0 J120 K0\nG53.1\n", "A-axis limit"),
    ("G68.2 X0 Y0 Z0 I0 J90 K0\nG0 X1\n", "before G53.1"),
    ("G53.1\n", "without a preceding G68.2"),
    ("G68.2 X0 Y0 Z0 I0 J90 K0\nG53.1\nG68.2 X0 Y0 Z0 I0 J45 K0\n", "G69 first"),
])
def test_dialect_errors(part, body, msg):
    r = run(part, body)
    assert any(msg in e["msg"] for e in r["issues"] if e["severity"] == "error"), r["issues"]
    assert not r["metrics"]["valid"]


def test_vise_collision(part):
    """Cutting the stub just above the jaws from the side with a 32 mm holder hits the jaw."""
    lo = part.stock_lo
    body = (f"G68.2 X0 Y{lo[1]} Z-12 I0 J90 K0\nG53.1\nS12000 M3\nG0 X-40 Y0 Z10\nG0 Z1\nG1 Z-1 F400\nG1 X40 F1500\nG0 Z10\n")
    r = run(part, body)
    assert any(e["kind"] == "fixture" for e in r["issues"]), r["issues"]


def test_rigidity_and_partoff(part):
    lo, hi = part.stock_lo, part.stock_hi
    gapz = -7.0
    def slot(sign, depth):
        y = lo[1] if sign < 0 else hi[1]
        i = 0 if sign < 0 else 180
        return (f"G68.2 X0 Y{y} Z{gapz} I{i} J90 K0\nG53.1\nS12000 M3\nG0 X-40 Y0 Z10\nG0 Z1\n" +
                "".join(f"G1 Z{-z:g} F400\nG1 X40 F1500\nG0 Z10\nG0 X-40\nG0 Z1\n" for z in np.arange(2, depth + 0.01, 2)) +
                "G0 Z20\nG69\n")
    w = hi[1] - lo[1]
    # no part-off marker -> error
    r = run(part, slot(-1, 6))
    assert any(e["kind"] == "part-off" for e in r["issues"])
    # rigidity: cutting most of the stub before the marker -> error
    r = run(part, slot(-1, w / 2 - 1) + slot(1, w / 2 - 1) + "(PART-OFF)\n")
    assert any(e["kind"] == "rigidity" for e in r["issues"]), r["issues"]
    # marker first, leave a ~2 mm web across the whole stub -> no rigidity error, but (refine phase, ACCEPTANCE_REFINE
    # H4) a full-length web is not hand-removable tabs: the part-off check must reject it
    r = run(part, "(PART-OFF)\n" + slot(-1, w / 2 - 1) + slot(1, w / 2 - 1))
    kinds = {e["kind"] for e in r["issues"] if e["severity"] == "error"}
    assert "rigidity" not in kinds, r["issues"]
    assert 2.0 <= r["rigidity"]["checks"][-1]["area_mm2"] <= 0.15 * r["rigidity"]["stock_section_mm2"]
    msgs = " ".join(e["msg"] for e in r["issues"] if e["kind"] == "part-off")
    assert "mm2" in msgs and not r["partoff"]["ok"], msgs
