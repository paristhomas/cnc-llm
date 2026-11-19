"""Simulator validation: analytic ground truth + safety-check coverage for cncllm."""
import dataclasses
import math
from pathlib import Path

import numpy as np
import pytest

from cncllm import gcode, sim
from cncllm.part import load
from cncllm.tools import LIBRARY

PART_DIR = Path(__file__).parent / "parts" / "simple"
TOP = 11.0  # stock top


@pytest.fixture(scope="module")
def part():
    return load(PART_DIR, verbose=False)


def prog(body, tool=2, rpm=12000, g43=True):
    head = f"G21 G90 G17 G40 G49 G80 G94\nT{tool} M6\n" + (f"G43 H{tool}\n" if g43 else "") + f"S{rpm} M3\n"
    return head + body + "\nM5\nM30\n"


def run(text, part):
    return sim.run(text, part, verbose=False)


def hts(r, pts):
    pts = np.asarray(pts, float).reshape(-1, 2)
    h, _ = r["workpiece"].heights(pts[:, 0], pts[:, 1])
    return np.asarray(h)


def h1(r, x, y):
    return float(hts(r, [[x, y]])[0])


def errors(r):
    return [i for i in r["issues"] if i["severity"] == "error"]


def has_error(r, *words):
    return any(all(w.lower() in i["msg"].lower() for w in words) for i in errors(r))


def ball_h(R, d):
    return R - math.sqrt(R * R - d * d)


def cone_h(d, tip=0.1, half=45.0):
    return max(d - tip, 0.0) / math.tan(math.radians(half))


def bull_h(d, R=4.0, cr=1.0):
    e = max(d - (R - cr), 0.0)
    return cr - math.sqrt(cr * cr - e * e)


def slot_prog(tool, z, y=0.0, rpm=12000, feed=800):
    return prog(f"G0 X-30 Y{y} Z15\nG1 Z{z} F300\nG1 X30 F{feed}\nG0 Z15", tool=tool, rpm=rpm)


# ---------------------------------------------------------------- 1
def test_flat_slot_width_and_floor(part):
    """T2 slot along X at Z=8: cut exactly for |y|<3, floor exactly 8, untouched beyond."""
    r = run(slot_prog(2, 8), part)
    assert not errors(r)
    for sy in (-1, 1):
        assert h1(r, 0, sy * 2.999) == pytest.approx(8.0, abs=1e-9)
        assert h1(r, 0, sy * 3.001) == pytest.approx(TOP, abs=1e-9)
    assert h1(r, 0, 0) == pytest.approx(8.0, abs=1e-9)
    assert h1(r, 15, 1.5) == pytest.approx(8.0, abs=1e-9)


# ---------------------------------------------------------------- 2
def test_ball_groove_profile(part):
    """T6 ball groove profile equals z + R - sqrt(R^2 - d^2)."""
    r = run(slot_prog(6, 8, feed=600), part)
    d = np.linspace(-2.95, 2.95, 41)
    got = hts(r, [[0, x] for x in d])
    exp = np.array([8 + ball_h(3, abs(x)) for x in d])
    assert np.allclose(got, exp, atol=1e-6)
    assert h1(r, 0, 3.001) == pytest.approx(TOP)


def test_ball_scallop_height(part):
    """Two parallel ball passes with step-over s leave scallop R - sqrt(R^2-(s/2)^2) at the midpoint."""
    R, s = 3.0, 2.0
    body = "G0 X-30 Y0 Z15\nG1 Z8 F300\nG1 X30 F600\nG0 Z15\nG0 X-30 Y2\nG1 Z8 F300\nG1 X30 F600\nG0 Z15"
    r = run(prog(body, tool=6), part)
    assert h1(r, 0, s / 2) == pytest.approx(8 + R - math.sqrt(R * R - (s / 2) ** 2), abs=1e-6)
    assert h1(r, 0, 0) == pytest.approx(8.0, abs=1e-9)
    assert h1(r, 0, 2) == pytest.approx(8.0, abs=1e-9)


# ---------------------------------------------------------------- 3
def test_bull_groove_profile(part):
    """T5 bull-nose (R4, r1) groove profile matches the analytic corner-radius profile."""
    r = run(slot_prog(5, 8, feed=1200), part)
    d = np.linspace(0, 3.95, 60)
    got = hts(r, [[0, x] for x in d])
    exp = np.array([8 + bull_h(x) for x in d])
    assert np.allclose(got, exp, atol=1e-6)
    assert h1(r, 0, 4.001) == pytest.approx(TOP)


def test_cone_groove_profile(part):
    """T9 chamfer mill (45 deg, tip flat 0.2) groove profile matches max(d-0.1,0)*cot(45)."""
    r = run(slot_prog(9, 8.5, feed=500), part)
    d = np.linspace(0, 2.95, 60)
    got = hts(r, [[0, x] for x in d])
    exp = np.array([min(TOP, 8.5 + cone_h(x)) for x in d])
    assert np.allclose(got, exp, atol=1e-6)
    assert h1(r, 0, 0.05) == pytest.approx(8.5)


# ---------------------------------------------------------------- 4
def radial_edge(r, ang, lo, hi, n=40):
    """Radius along a ray where the workpiece top crosses TOP-0.5 (bisection)."""
    c, s = math.cos(ang), math.sin(ang)
    inner_cut = h1(r, hi * c, hi * s) < TOP - 0.5
    for _ in range(n):
        m = (lo + hi) / 2
        cut = h1(r, m * c, m * s) < TOP - 0.5
        if cut == inner_cut:
            hi = m
        else:
            lo = m
    return (lo + hi) / 2


def test_full_circle_annulus(part):
    """Full-circle G2 (I/J) with T2 at radius 10 cuts an annulus of radii 7 and 13 (+-0.003)."""
    r = run(prog("G0 X10 Y0 Z15\nG1 Z8 F300\nG2 X10 Y0 I-10 J0 F800\nG0 Z15"), part)
    assert not errors(r)
    for ang in np.radians(np.arange(0, 360, 17.0)):
        assert abs(radial_edge(r, ang, 5, 9) - 7.0) < 0.003
        assert abs(radial_edge(r, ang, 11, 15) - 13.0) < 0.003
    assert h1(r, 0, 0) == pytest.approx(TOP)
    assert h1(r, 10, 0) == pytest.approx(8.0, abs=1e-6)


@pytest.mark.parametrize("code,end,mid_cut,mid_uncut", [
    ("G2", (0, -10), (7.071, -7.071), (2.929, -2.929)),
    ("G3", (0, 10), (7.071, 7.071), (2.929, 2.929)),
    # R10 <=180 deg arc: CCW from (10,0) to (0,-10) must use centre (10,-10)
    ("G3", (0, -10), (2.929, -2.929), (7.071, -7.071)),
    ("G2", (0, 10), (2.929, 2.929), (7.071, 7.071)),
])
def test_r_arcs_direction(part, code, end, mid_cut, mid_uncut):
    """R-format quarter arcs: G2 = clockwise, G3 = counter-clockwise, short arc for R>0."""
    r = run(prog(f"G0 X10 Y0 Z15\nG1 Z8 F300\n{code} X{end[0]} Y{end[1]} R10 F800\nG0 Z15"), part)
    assert not errors(r)
    assert h1(r, *mid_cut) == pytest.approx(8.0, abs=2e-3)
    assert h1(r, *mid_uncut) == pytest.approx(TOP)


def test_helix_depth_linear(part):
    """Helical G2 full turn (r=10) from Z10.5 to Z8.5: depth is linear in arc length."""
    r = run(prog("G0 X10 Y0 Z15\nG1 Z10.5 F300\nG2 X10 Y0 Z8.5 I-10 J0 F600\nG0 Z15"), part)
    assert not errors(r)
    rad, dz, Rt = 10.0, -2.0, 3.0
    s_look = 2 * rad * math.asin(Rt / (2 * rad))  # flat tool sees the lowest point this far ahead along the path
    for frac in (0.1, 0.25, 0.5, 0.75):
        a = -2 * math.pi * frac  # CW
        exp = 10.5 + dz * (frac + s_look / (2 * math.pi * rad))
        assert h1(r, rad * math.cos(a), rad * math.sin(a)) == pytest.approx(exp, abs=5e-3)


def test_arc_radius_mismatch_error():
    """Arc whose end radius differs from the start radius is a parse error."""
    p = gcode.parse(prog("G0 X10 Y0 Z15\nG1 Z8 F300\nG2 X0 Y-12 I-10 J0 F800"))
    assert any("mismatch" in e["msg"] for e in p.errors)


# ---------------------------------------------------------------- 5
def drill_prog(cycle, extra=""):
    return prog(f"G0 X0 Y0 Z15\n{extra}{cycle}\nG80", tool=10, rpm=6000)


@pytest.mark.parametrize("cycle", ["G81 Z4 R12 F300", "G83 Z4 R12 Q2 F300"])
def test_drill_hole(part, cycle):
    """G81/G83 with T10: 5 mm hole, tip at Z4, 118 deg point profile r/tan(59deg)."""
    r = run(drill_prog(cycle), part)
    assert not errors(r)
    k = 1 / math.tan(math.radians(59))
    assert h1(r, 0, 0) == pytest.approx(4.0, abs=1e-6)
    for d in (0.5, 1.0, 2.0, 2.49):
        assert h1(r, d, 0) == pytest.approx(4 + k * d, abs=1e-6)
        assert h1(r, 0, -d) == pytest.approx(4 + k * d, abs=1e-6)
    assert h1(r, 2.501, 0) == pytest.approx(TOP)


@pytest.mark.parametrize("mode,cyc,z_end", [("G98", "G81", 15), ("G99", "G81", 12),
                                           ("G98", "G83", 15), ("G99", "G83", 12)])
def test_drill_retract(mode, cyc, z_end):
    """G98 returns to the initial Z (15), G99 to the R plane (12)."""
    q = " Q2" if cyc == "G83" else ""
    p = gcode.parse(drill_prog(f"{cyc} Z4 R12{q} F300", extra=mode + "\n"))
    assert not p.errors
    drill_lines = p.moves[(p.moves[:, gcode.C["tool"]] == 10)]
    final = drill_lines[drill_lines[:, gcode.C["z1"]] > 4.0 + 1e-6][-1]
    assert final[gcode.C["rapid"]] == 1.0
    assert final[gcode.C["z1"]] == pytest.approx(z_end)


def test_g98_g99_between_holes():
    """With G99 the tool stays at R between holes; with G98 it returns to the initial Z."""
    for mode, z in (("G98", 15), ("G99", 12)):
        p = gcode.parse(drill_prog("G81 Z4 R12 F300\nX10", extra=mode + "\n"))
        assert not p.errors
        rapids_up = [m for m in p.moves if m[gcode.C["rapid"]] == 1.0 and m[gcode.C["z0"]] == 4.0]
        assert [m[gcode.C["z1"]] for m in rapids_up] == [z, z]


# ---------------------------------------------------------------- 6
def test_ball_ramp_matches_bruteforce(part):
    """Exact heights along an inclined ball-tool ramp agree with 1e5-sample brute force within 1e-4."""
    r = run(prog("G0 X-25 Y-3 Z15\nG1 Z10 F300\nG1 X20 Y6 Z7 F600\nG0 Z15", tool=6), part)
    p0, p1 = np.array([-25.0, -3.0, 10.0]), np.array([20.0, 6.0, 7.0])
    t = np.linspace(0, 1, 100_000)
    C = p0[None] + t[:, None] * (p1 - p0)[None]
    rng = np.random.default_rng(1)
    pts = np.column_stack([rng.uniform(-20, 20, 400), rng.uniform(-12, 12, 400)])
    exp = np.empty(len(pts))
    for i, (x, y) in enumerate(pts):
        d = np.hypot(C[:, 0] - x, C[:, 1] - y)
        ok = d <= 3.0
        v = C[ok, 2] + (3 - np.sqrt(np.maximum(9 - d[ok] ** 2, 0)))
        exp[i] = min(TOP, v.min() if len(v) else TOP)
    got = hts(r, pts)
    assert np.abs(got - exp).max() < 1e-4


# ---------------------------------------------------------------- 7
def test_safety_rapid_through_stock(part):
    """G0 plunging into the stock is a crash error."""
    r = run(prog("G0 X0 Y0 Z15\nG0 Z5"), part)
    assert has_error(r, "rapid", "crash") and r["metrics"]["valid"] is False


def test_safety_spindle_off(part):
    """Cutting with the spindle stopped is an error."""
    r = run(prog("G0 X0 Y0 Z15\nM5\nG1 Z8 F300"), part)
    assert has_error(r, "spindle") and r["metrics"]["valid"] is False


def test_safety_shank(part):
    """T3 (flute length 10) cutting an 11 mm deep slot in one pass is a shank error."""
    r = run(slot_prog(3, 0, feed=400), part)
    assert has_error(r, "flute length") and r["metrics"]["valid"] is False


def test_safety_holder_collision(part):
    """T4 (stickout 14, holder dia 20) plunged to Z0 beside 20 mm walls collides with the holder.

    The 11 mm 'simple' stock cannot trigger this (stickout 14 > 11), so use a taller stock of the same part.
    """
    tall = dataclasses.replace(part, stock={**part.stock, "z": [0, 20]})
    r = run(prog("G0 X0 Y0 Z25\nG1 Z0 F100", tool=4, rpm=12000), tall)
    assert has_error(r, "holder") and r["metrics"]["valid"] is False


def test_safety_holder_not_triggered_below_stickout(part):
    """Sanity: with the 11 mm stock, T4 plunged to Z0 has no holder collision."""
    r = run(prog("G0 X0 Y0 Z15\nG1 Z0 F100", tool=4, rpm=12000), part)
    assert not has_error(r, "holder")


def test_safety_fixture(part):
    """Z below -0.5 is a fixture error."""
    r = run(prog("G0 X-30 Y0 Z15\nG1 Z-1 F300"), part)
    assert any(i["kind"] == "fixture" for i in errors(r)) and r["metrics"]["valid"] is False


def test_safety_noncentre_plunge(part):
    """Plunging the non-centre-cutting chamfer mill T9 is an error."""
    r = run(prog("G0 X0 Y0 Z15\nG1 Z8 F200", tool=9), part)
    assert has_error(r, "non-centre") and r["metrics"]["valid"] is False


def test_safety_feed_too_high(part):
    """F above 6000 mm/min is an error."""
    r = run(prog("G0 X-30 Y0 Z15\nG1 X30 F7000"), part)
    assert has_error(r, "feed") and r["metrics"]["valid"] is False


@pytest.mark.parametrize("tool,rpm", [(2, 30000), (1, 20000), (10, 9000)])
def test_safety_rpm(part, tool, rpm):
    """S above the machine or tool maximum rpm is an error."""
    r = run(prog("G0 X-30 Y0 Z15", tool=tool, rpm=rpm), part)
    assert has_error(r, "rpm") and r["metrics"]["valid"] is False


@pytest.mark.parametrize("line", ["G41 D1", "G91", "G20", "M4", "#1=2"])
def test_safety_unsupported_codes(part, line):
    """Unsupported codes are errors, never silently ignored."""
    r = run(prog(f"G0 X-30 Y0 Z15\n{line}\nG0 Z20"), part)
    assert errors(r) and r["metrics"]["valid"] is False


def test_safety_unknown_tool(part):
    """T99 is not in the library."""
    r = run("G21 G90\nT99 M6\nG0 X0 Y0 Z15\nM30\n", part)
    assert has_error(r, "T99") and r["metrics"]["valid"] is False


def test_safety_missing_g43(part):
    """Cutting after a tool change without G43 H<n> is an error."""
    r = run(prog("G0 X-30 Y0 Z15\nG1 X30 F500", g43=False), part)
    assert has_error(r, "length offset") and r["metrics"]["valid"] is False


def test_safety_missing_feed(part):
    """A G1 with no F ever set is an error."""
    r = run(prog("G0 X-30 Y0 Z15\nG1 X30"), part)
    assert has_error(r, "feed") and r["metrics"]["valid"] is False


# ---------------------------------------------------------------- 8
def test_reference_program_valid(part):
    """The conservative reference program is valid, error-free and machines the part."""
    r = run((PART_DIR / "prog.nc").read_text(), part)
    assert not errors(r)
    assert r["metrics"]["valid"] is True
    assert r["metrics"]["machinable_in_tol_pct"] > 99.9


# ---------------------------------------------------------------- 9
def test_metric_two_sided(part):
    """Pocket 0.3 mm too deep -> gouge; 0.3 mm shy -> proud; neither is in tolerance on the floor."""
    base = (PART_DIR / "prog.nc").read_text()
    ok = run(base, part)["metrics"]
    assert "G1 Z7 F300" in base
    deep = run(base.replace("G1 Z7 F300", "G1 Z6.7 F300"), part)["metrics"]
    shy = run(base.replace("G1 Z7 F300", "G1 Z7.3 F300"), part)["metrics"]
    assert deep["machinable_gouge_pct"] > 3 and deep["machinable_proud_pct"] == 0
    assert shy["machinable_proud_pct"] > 3 and shy["machinable_gouge_pct"] == 0
    assert deep["max_gouge_mm"] == pytest.approx(0.3, abs=0.02)
    for m in (deep, shy):
        assert m["machinable_in_tol_pct"] < ok["machinable_in_tol_pct"] - 3
