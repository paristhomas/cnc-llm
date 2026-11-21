"""Necked long-reach tools (R4): the shank stage between the neck and the holder is checked against material (grid
replay) and against the fixture boxes; the cutting geometry is the plain flat / ball profile (cross-checked against
MillBill by the existing cross-check)."""
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent))
from refine_fixture import FIXTURE, make_box_step  # noqa: E402

from cncllm import kernel5, part5, sim5, tools  # noqa: E402


@pytest.fixture(scope="module")
def box(tmp_path_factory):
    d = tmp_path_factory.mktemp("necked")
    step = make_box_step(d / "src" / "box.step")
    part5.place(step, FIXTURE, d / "p")
    return part5.load(d / "p", verbose=False)


@pytest.fixture()
def necked(monkeypatch):
    t = next(c for c in tools.CANDIDATES if c.number == 11)   # 4 mm, neck 40 mm, 6 mm shank
    monkeypatch.setitem(tools.LIBRARY, 11, t)                 # the dict is shared by every harness module
    return t


def _hole(depth):
    # helical-free test: a slow plunge of the 4 mm tool into the top of the stock (Z21 down by `depth`)
    steps = "".join(f"G1 Z{21 - z:g} F150\n" for z in np.arange(1, depth + 1e-9, 1.0))
    return ("G21 G90 G17 G94\nT11 M6\nG43 H11\nS20000 M3\nG0 X0 Y0 Z30\nG0 Z21.5\n" + steps + "G0 Z60\nM5\nM30\n")


def test_neck_reaches_below_flutes_without_error(box, necked):
    r = sim5.run(_hole(36), box, verbose=False)
    errs = [i["msg"] for i in r["issues"] if i["severity"] == "error" and i["kind"] != "part-off"]
    assert errs == [], errs
    assert r["vol"].sum() > 300          # the hole was really cut


def test_shank_beyond_neck_collides(box, necked):
    r = sim5.run(_hole(45), box, verbose=False)
    assert any("shank of a necked long-reach tool" in i["msg"] for i in r["issues"] if i["severity"] == "error"), \
        [i["msg"] for i in r["issues"]]


def test_fixture_check_has_shank_stage():
    """A box between the neck radius and the shank radius, above the neck: hit only with the shank stage. The body is
    exact discs (no capsule over-reach below the tip or the holder face) with a 1 mm clearance around the boxes."""
    A = np.array([[0.0, 0.0, 0.0]])
    B = np.array([[0.0, 0.0, 0.0]])
    D = np.array([[0.0, 0.0, 1.0]])
    box = np.array([[[3.5, -1.0, 44.0], [5.0, 1.0, 48.0]]])        # grown by 1 mm: x 2.5..6, z 43..49
    rad, so, hr = np.array([2.0]), np.array([55.0]), np.array([11.0])
    no_neck = kernel5.fixture_hits2(A, B, D, rad, so, hr, 50.0, box, np.array([0.0]), np.array([2.0]))
    neck = kernel5.fixture_hits2(A, B, D, rad, so, hr, 50.0, box, np.array([40.0]), np.array([3.0]))
    assert no_neck[0] == 0 and neck[0] == 1
    assert kernel5.fixture_hits(A, B, D, rad, so, hr, 50.0, box)[0] == 0
    # a box 3 mm below the tip is not hit (the old capsule model reached a full radius below the tip)
    below = np.array([[[-1.0, -1.0, -6.0], [1.0, 1.0, -3.0]]])
    assert kernel5.fixture_hits2(A, B, D, np.array([5.0]), so, hr, 50.0, below, np.array([0.0]), np.array([5.0]))[0] == 0
    # a box 0.5 mm below the tip is inside the 1 mm clearance: hit
    below2 = np.array([[[-1.0, -1.0, -6.0], [1.0, 1.0, -0.5]]])
    assert kernel5.fixture_hits2(A, B, D, np.array([5.0]), so, hr, 50.0, below2, np.array([0.0]), np.array([5.0]))[0] == 1


def test_disc_box_exact_against_bruteforce():
    """_disc_box_hit against dense sampling of the disc, for random discs, axes and boxes."""
    rng = np.random.default_rng(11)
    disagree_far = 0
    for _ in range(1500):
        c = rng.uniform(-6, 6, 3)
        d = rng.normal(size=3)
        d /= np.linalg.norm(d)
        r = rng.uniform(0.5, 6.0)
        lo = rng.uniform(-6, 4, 3)
        hi = lo + rng.uniform(0.2, 5.0, 3)
        exact = kernel5._disc_box_hit(c[0], c[1], c[2], d[0], d[1], d[2], r, lo, hi)
        a = np.array([1.0, 0, 0]) if abs(d[0]) < 0.9 else np.array([0, 1.0, 0])
        u = np.cross(d, a); u /= np.linalg.norm(u)
        v = np.cross(d, u)
        rr, th = np.meshgrid(np.linspace(0, r, 60), np.linspace(0, 2 * np.pi, 240, endpoint=False))
        pts = c + (rr * np.cos(th)).reshape(-1, 1) * u + (rr * np.sin(th)).reshape(-1, 1) * v
        inside = ((pts >= lo) & (pts <= hi)).all(1)
        brute = bool(inside.any())
        if brute and not exact:
            raise AssertionError((c, d, r, lo, hi))
        if exact and not brute:
            # allowed only when the contact is within the sampling resolution
            g = ((pts >= lo - 0.08) & (pts <= hi + 0.08)).all(1)
            if not g.any():
                disagree_far += 1
    assert disagree_far == 0
