"""Validation of the kinematic roughness measurement (cncllm/roughness.py) against cases with a known answer.

1. ideal circular-arc cusps: Ra = 4/(9 sqrt 3) h for s << R (exact numeric reference from cusp_reference)
2. analytic sinusoid on a plane: Ra = 2A/pi
3. a perfect cylinder measured against its 4 um-chord faceted mesh: the target facets must NOT show up (Ra ~ 0)
4. the real simulator kernel: a T6 (ball R3) raster with stepover 0.25 mm on a flat -> cusp Ra/Rz; along the lay ~0
5. the real simulator kernel: a flat end mill facing pass -> ~0
"""
from __future__ import annotations

import math
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from cncllm import gcode, roughness as rg  # noqa: E402
from cncllm.sim import Workpiece  # noqa: E402


def _square_target(half=4.0, z=0.0, density=6.0, seed=0):
    V = np.array([[-half, -half, z], [half, -half, z], [half, half, z], [-half, half, z]], float)
    F = np.array([[0, 1, 2], [0, 2, 3]])
    TF = np.zeros(2, int)
    rng = np.random.default_rng(seed)
    n = int(density * (2 * half) ** 2)
    P = np.c_[rng.uniform(-half, half, (n, 2)), np.full(n, z)]
    N = np.tile([0.0, 0.0, 1.0], (n, 1))
    return V, F, TF, P, N, np.zeros(n, int), np.full(n, (2 * half) ** 2 / n)


def _centres(P, pts):
    return np.array([int(np.argmin(np.linalg.norm(P[:, :2] - np.array(q), axis=1))) for q in pts])


def _measure(inside, target, pts, **kw):
    V, F, TF, P, N, pf, pa = target
    return rg.measure(kw.pop("surface", rg.SimSurface(inside)), V, F, TF, P, N, pf, pa,
                      centres=_centres(P, pts), verbose=False, **kw)


def test_cusp_reference():
    ref = rg.cusp_reference(3.0, 0.25)
    assert abs(ref["h"] - (3 - math.sqrt(9 - 0.125 ** 2))) < 1e-12
    assert abs(ref["Ra"] / ref["h"] - 4 / (9 * math.sqrt(3))) < 2e-3


def test_flat_plane_reads_zero():
    R = _measure(lambda Q: Q[:, 2] < 0.0, _square_target(), [(0, 0), (1.3, -0.7)])
    assert R["valid"].all()
    assert (R["Ra_um"] < 0.01).all() and (R["Rz_um"] < 0.05).all()


def test_sinusoid_ra():
    A, lam = 0.001, 0.2                     # 1 um amplitude, 0.2 mm wavelength (lay along Y)
    R = _measure(lambda Q: Q[:, 2] < A * np.sin(2 * np.pi * Q[:, 0] / lam), _square_target(), [(0, 0), (0.7, 0.4)])
    exp = 1e3 * 2 * A / math.pi
    assert R["valid"].all()
    assert np.allclose(R["Ra_um"], exp, rtol=0.03), (R["Ra_um"], exp)
    assert np.allclose(R["Rz_um"], 2e3 * A, rtol=0.03)
    # across the lay = along X
    assert (np.abs(R["dirs"][:, 0, 0]) > 0.95).all()
    assert (R["Ra_um_dir"][:, 1] < 0.02).all()


def test_cylinder_facets_do_not_leak():
    import trimesh
    r = 5.0
    sec = int(math.ceil(math.pi / math.acos(1 - 0.004 / r)))     # 4 um chord deflection, like the part meshes
    m = trimesh.creation.cylinder(radius=r, height=12.0, sections=sec)
    V, F = np.asarray(m.vertices), np.asarray(m.faces)
    fn = np.asarray(m.face_normals)
    TF = np.where(np.abs(fn[:, 2]) < 0.5, 0, np.where(fn[:, 2] > 0, 1, 2))
    rng = np.random.default_rng(1)
    side = np.where(TF == 0)[0]
    a = np.asarray(m.area_faces)[side]
    ti = rng.choice(side, size=6000, p=a / a.sum())
    r1, r2 = rng.random(len(ti)), rng.random(len(ti))
    s1 = np.sqrt(r1)
    tri = V[F[ti]]
    P = tri[:, 0] * (1 - s1)[:, None] + tri[:, 1] * (s1 * (1 - r2))[:, None] + tri[:, 2] * (s1 * r2)[:, None]
    N = fn[ti]
    pf = np.zeros(len(P), int)
    pa = np.full(len(P), a.sum() / len(P))
    ci = [int(np.argmin(np.linalg.norm(P - q, axis=1))) for q in ([r, 0, 0], [0, -r, 1.0], [-3.5, 3.5, -2.0])]
    R = rg.measure(rg.SimSurface(lambda Q: (Q[:, 0] ** 2 + Q[:, 1] ** 2 < r * r) & (np.abs(Q[:, 2]) < 6)),
                   V, F, TF, P, N, pf, pa, centres=np.array(ci), verbose=False)
    assert R["valid"].all()
    assert (R["lc_mm"] == 0.8).all()
    assert (R["Ra_um"] < 0.05).all(), R["Ra_um"]


class _Stock:
    def __init__(self, lo, hi):
        self.stock_lo, self.stock_hi = np.array(lo, float), np.array(hi, float)


def _sim_surface(program):
    M = gcode.parse(program).moves
    wp = Workpiece(M, _Stock([-5, -5, 0], [5, 5, 10.3]))
    return rg.SimSurface(wp, M)


def _raster(tool, step, z=10.0):
    g = ["G21 G90 G17 G94", f"T{tool} M6", f"G43 H{tool}", "S18000 M3", "G0 X-9 Y-7 Z15", f"G1 Z{z:g} F600"]
    for i, y in enumerate(np.arange(-7, 7.0001, step)):
        g += [f"G1 Y{y:.4f} F2000", f"G1 X{9 if i % 2 == 0 else -9}"]
    return "\n".join(g + ["G0 Z20", "M5", "M30", ""])


def test_sim_ball_raster_cusps():
    R_ball, s = 3.0, 0.25
    surf = _sim_surface(_raster(6, s))
    R = _measure(None, _square_target(z=10.0), [(0, 0), (0.9, -1.1), (-1.2, 0.6)], surface=surf)
    ref = rg.cusp_reference(R_ball, s)
    assert R["valid"].all()
    assert np.allclose(R["Ra_um"], 1e3 * ref["Ra"], rtol=0.04), (R["Ra_um"], 1e3 * ref["Ra"])
    assert np.allclose(R["Rz_um"], 1e3 * ref["h"], rtol=0.06), (R["Rz_um"], 1e3 * ref["h"])
    assert np.allclose(R["pitch_mm_dir"][:, 0], s, rtol=0.05)
    assert (np.abs(R["dirs"][:, 0, 1]) > 0.95).all()          # across the lay = across the passes (Y)
    assert (R["Ra_um_dir"][:, 1] < 0.02).all()                # along the passes: nothing
    assert (R["tool"] == 6).all()


def test_sim_flat_endmill_floor_zero():
    surf = _sim_surface(_raster(2, 3.0))
    R = _measure(None, _square_target(z=10.0), [(0, 0), (1.5, 1.5)], surface=surf)
    assert R["valid"].all()
    assert (R["Ra_um"] < 0.01).all() and (R["Rt_um"] < 0.05).all()
    assert (R["tool"] == 2).all()
