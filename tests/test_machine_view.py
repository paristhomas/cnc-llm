"""Machine view kinematics (cncllm/viewer/src/kin5.mjs) run under node and checked against the simulator:
displayed A / C equal sim5.frame_angles for every setup, the table rotation brings every G68.2 tool axis to +Z, the
platter always takes the short way, and machine tip <-> G54 tip round-trips exactly."""
import json
import math
import shutil
import subprocess
from pathlib import Path

import numpy as np
import pytest

from cncllm import gcode, sim5

ROOT = Path(__file__).resolve().parents[1]
KIN = ROOT / "cncllm" / "viewer" / "src" / "kin5.mjs"
NODE = shutil.which("node")

def run_node(frames, pivot=(0.0, 0.0, 10.0), pts=None):
    """frames: list of 3x3 R (columns = frame axes in G54). Returns the kin5 results per frame."""
    data = {"Rs": [np.asarray(R, float).tolist() for R in frames], "pivot": list(pivot),
            "pts": [list(map(float, p)) for p in (pts if pts is not None else [])]}
    script = (
        "import * as K from " + json.dumps(KIN.as_uri()) + ";\n"
        "let s = ''; process.stdin.on('data', (c) => (s += c)); process.stdin.on('end', () => {\n"
        "  const inp = JSON.parse(s);\n"
        "  const ang = K.setupAngles(inp.Rs);\n"
        "  const out = inp.Rs.map((R, i) => {\n"
        "    const d = [R[0][2], R[1][2], R[2][2]], a = ang[i];\n"
        "    const T = K.tableRot(a.Ak, a.Ck);\n"
        "    const rt = K.matVec(T, d);\n"
        "    const tips = inp.pts.map((p) => { const m = K.machineTip(p, a.Ak, a.Ck, inp.pivot);\n"
        "      const Tt = [[T[0][0], T[1][0], T[2][0]], [T[0][1], T[1][1], T[2][1]], [T[0][2], T[1][2], T[2][2]]];\n"
        "      const b = K.matVec(Tt, m); return [b[0] + inp.pivot[0], b[1] + inp.pivot[1], b[2] + inp.pivot[2]]; });\n"
        "    // swing endpoints and mid-swing: the table angles and the spindle-parked tip\n"
        "    const prev = ang[Math.max(i - 1, 0)];\n"
        "    const s0 = K.swingState(0.24, prev, a, [1, 2, 3], [4, 5, 6], 50), s1 = K.swingState(0.76, prev, a, [1, 2, 3], [4, 5, 6], 50);\n"
        "    return { A: a.A, C: a.C, Ak: a.Ak, Ck: a.Ck, Cwrap: K.wrap180(a.Ck), rt, tips, s0: [s0.A, s0.C], s1: [s1.A, s1.C] };\n"
        "  });\n"
        "  process.stdout.write(JSON.stringify(out));\n"
        "});\n")
    r = subprocess.run([NODE, "--input-type=module", "-e", script], input=json.dumps(data), capture_output=True,
                       text=True, timeout=60)
    assert r.returncode == 0, r.stderr
    return json.loads(r.stdout)


def synthetic_frames():
    """Frames from real G68.2 blocks through the parser: axis-aligned, +-180 azimuths, oblique, near-vertical, A > 90."""
    ijks = [(0, 0, 0), (-90, 90, 0), (90, 90, 0), (0, 90, 0), (180, 90, 0), (-180, 90, 0), (30, 45, 0), (-150, 60, 17),
            (135, 105, 0), (-45, 105, 90), (12.5, 0.4, 0), (77, 0.004, 0), (0, 0.0, 33), (179.9, 90, 0), (-179.9, 90, 0),
            (54.7356, 54.7356, 0), (-120, 110, -45), (200, 30, 10), (0, 180 - 70, 0)]
    body = "G21 G90 G17 G94\nT2 M6\nG43 H2\n"
    for i, j, k in ijks:
        body += f"G68.2 X1 Y-2 Z3 I{i} J{j} K{k}\nG53.1\nS12000 M3\nG0 X0 Y0 Z20\nM5\nG69\n"
    body += "M30\n"
    prog = gcode.parse(body, tilt=True, max_tilt_deg=180)
    assert not prog.errors, prog.errors
    return [fr["R"] for fr in prog.frames]


def run_frames():
    """Every setup of the committed runs that have viewer data (frame matrices as exported for the viewer)."""
    out = []
    for meta in sorted((ROOT / "runs").glob("*/*/final/viewer_data/meta.json")):
        m = json.loads(meta.read_text())
        if m.get("mode") != "3+2":
            continue
        out += [np.array(s["R"], float) for s in m["segments"]]
    return out


@pytest.mark.skipif(NODE is None, reason="node not installed")
@pytest.mark.parametrize("source", ["synthetic", "runs"])
def test_machine_kinematics_match_simulator(source):
    frames = synthetic_frames() if source == "synthetic" else run_frames()
    if not frames:
        pytest.skip("no 3+2 runs with viewer data")
    rng = np.random.default_rng(3)
    pts = rng.uniform(-80, 80, (5, 3))
    res = run_node(frames, pts=pts)
    ez = np.array([0.0, 0.0, 1.0])
    prev = None
    for R, r in zip(frames, res):
        R = np.asarray(R, float)
        A, C = sim5.frame_angles(R)
        # displayed angles are the simulator's
        assert abs(r["A"] - A) < 1e-9 and abs(r["C"] - C) < 1e-9, (R[:, 2], r, (A, C))
        # the table brings the tool axis to +Z (spindle vertical)
        assert np.linalg.norm(np.array(r["rt"]) - ez) < 1e-9, (R[:, 2], r["rt"])
        # kinematic angles agree with the displayed ones except C for (near-)vertical axes
        assert abs(r["Ak"] - A) < 1e-9
        if abs(R[2, 2]) < 0.9999:
            assert abs((r["Ck"] - C + 180) % 360 - 180) < 1e-9, (r, C)
            assert abs((r["Cwrap"] - C + 180) % 360 - 180) < 1e-9 and -180 < r["Cwrap"] <= 180
        # short way between setups
        if prev is not None:
            assert abs(r["Ck"] - prev) <= 180 + 1e-9
            assert abs(r["s1"][1] - r["Ck"]) < 1e-9 and abs(r["s0"][1] - prev) < 1e-9
        prev = r["Ck"]
        # machine tip maps back to the same G54 point
        assert np.abs(np.array(r["tips"]) - pts).max() < 1e-9


def test_table_rotation_closed_form():
    """Rt = Rx(A) Rz(90 - C) brings d(A, C) = (sinA cosC, sinA sinC, cosA) to +Z (numpy twin of kin5.tableRot)."""
    def rx(a):
        c, s = math.cos(a), math.sin(a)
        return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])

    def rz(a):
        c, s = math.cos(a), math.sin(a)
        return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

    for A in np.linspace(0, 180, 13):
        for C in np.linspace(-180, 180, 17):
            a, c = math.radians(A), math.radians(C)
            d = np.array([math.sin(a) * math.cos(c), math.sin(a) * math.sin(c), math.cos(a)])
            Rt = rx(a) @ rz(math.radians(90 - C))
            assert np.allclose(Rt @ d, [0, 0, 1], atol=1e-12)


@pytest.mark.skipif(NODE is None, reason="node not installed")
def test_platter_does_not_wind_up():
    """Alternating half turns (azimuth 180, 0, 180, ...) must not accumulate platter angle over the program."""
    frames = [gcode.euler_zxz(*ijk) for ijk in [(-90, 90, 0), (90, 90, 0)] * 6 + [(0, 0, 0), (-90, 90, 0)]]
    res = run_node(frames)
    assert max(abs(r["Ck"]) for r in res) <= 180 + 1e-9, [r["Ck"] for r in res]
