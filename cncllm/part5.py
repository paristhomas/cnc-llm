"""3+2 part setup: fixture placement (part orientation in a vise-held stock), vise model, surface probes and the
reachability classification used by the score.

Fixture frame (= G54 work coordinates):
  part bottom (the parting plane) at Z0, part XY bounding-box centre at X0 Y0, part above Z0.
  stock = part bbox + margin (XY) and + top allowance (Z), extended below Z0 by a stub: gap (clearance between the vise
  jaws and the part) + grip (height held in the jaws).
  vise jaws clamp the stub on its +-Y faces from Z = -(gap+grip) to Z = -gap; vise body below.
fixture.json (chosen by the LLM; defaults shown):
  {"up": "+Z", "rot_z_deg": 0, "scale": 1.0, "margin": 3.0, "top": 1.5, "gap": 8.0, "grip": 8.0}
  "up" = which part-model axis points up in the vise (+X -X +Y -Y +Z -Z), rot_z_deg = rotation about the vertical after.
Probe classes: 0 machinable (scored), 1 parting face (part bottom, finished by hand after break-off), 2 not reachable in
3+2 with the library's smallest tools from any allowed direction (needs simultaneous 5-axis / a smaller tool / is
hidden by the vise). Plus the 0.03 mm face-edge band (excluded), as in the 3-axis harness.
"""
from __future__ import annotations

import hashlib
import json
import math
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np

from . import kernel
from .part import TOL, _mesh_from_step, _sample, edge_band
from .tools import LIBRARY

MAX_TILT = 110.0
REACH_RES = 0.075
DEFAULT_FIXTURE = {"up": "+Z", "rot_z_deg": 0.0, "scale": 1.0, "margin": 3.0, "top": 1.5, "gap": 8.0, "grip": 8.0}
UP_ROT = {  # rotation taking the named model axis to +Z
    "+Z": np.eye(3),
    "-Z": np.array([[1, 0, 0], [0, -1, 0], [0, 0, -1]], float),
    "+X": np.array([[0, 0, -1], [0, 1, 0], [1, 0, 0]], float),
    "-X": np.array([[0, 0, 1], [0, 1, 0], [-1, 0, 0]], float),
    "+Y": np.array([[1, 0, 0], [0, 0, -1], [0, 1, 0]], float),
    "-Y": np.array([[1, 0, 0], [0, 0, 1], [0, -1, 0]], float),
}


@dataclass
class Part5:
    dir: Path
    name: str
    fixture: dict
    stock: dict          # {"lo": [x,y,z], "hi": [x,y,z]}
    vise: list           # boxes [[lo3, hi3], ...] in the fixture frame (jaws, body, table)
    V: np.ndarray
    F: np.ndarray
    tri_face: np.ndarray
    faces: list
    P: np.ndarray
    N: np.ndarray
    pface: np.ndarray
    parea: np.ndarray
    pclass: np.ndarray
    pedge: np.ndarray
    reach_dirs: np.ndarray   # candidate tool directions used for reachability
    pdir: np.ndarray         # per probe: index of a direction that reaches it (-1 none)
    sha: str
    meta: dict = field(default_factory=dict)

    @property
    def stock_lo(self):
        return np.array(self.stock["lo"], float)

    @property
    def stock_hi(self):
        return np.array(self.stock["hi"], float)


def fixture_transform(fx: dict) -> np.ndarray:
    R = UP_ROT[fx.get("up", "+Z")]
    a = math.radians(fx.get("rot_z_deg", 0.0))
    Rz = np.array([[math.cos(a), -math.sin(a), 0], [math.sin(a), math.cos(a), 0], [0, 0, 1]])
    return Rz @ R * fx.get("scale", 1.0)


def place(step_in: Path, fx: dict, out_dir: Path) -> dict:
    """Write the part in the fixture frame (out_dir/part.step) and the stock / vise definition (out_dir/setup.json)."""
    import cadquery as cq
    from OCP.gp import gp_GTrsf, gp_Mat, gp_XYZ
    from OCP.BRepBuilderAPI import BRepBuilderAPI_GTransform

    fx = {**DEFAULT_FIXTURE, **fx}
    shape = cq.importers.importStep(str(step_in)).val()
    M = fixture_transform(fx)
    g = gp_GTrsf()
    g.SetVectorialPart(gp_Mat(*[float(v) for v in M.ravel()]))
    shp = cq.Shape.cast(BRepBuilderAPI_GTransform(shape.wrapped, g, True).Shape())
    bb = shp.BoundingBox()
    shp = shp.translate(cq.Vector(-(bb.xmin + bb.xmax) / 2, -(bb.ymin + bb.ymax) / 2, -bb.zmin))
    bb = shp.BoundingBox()
    out_dir.mkdir(parents=True, exist_ok=True)
    cq.exporters.export(cq.Workplane().add(shp), str(out_dir / "part.step"))
    m, top, gap, grip = fx["margin"], fx["top"], fx["gap"], fx["grip"]
    lo = [bb.xmin - m, bb.ymin - m, -(gap + grip)]
    hi = [bb.xmax + m, bb.ymax + m, bb.zmax + top]
    jaw_t, jaw_w = 15.0, (hi[0] - lo[0]) + 20.0
    zj0, zj1 = lo[2], -gap                      # jaws grip the stub over its lower `grip` mm
    cx = (lo[0] + hi[0]) / 2
    vise = [
        [[cx - jaw_w / 2, lo[1] - jaw_t, zj0 - 2.0], [cx + jaw_w / 2, lo[1], zj1]],      # fixed jaw (-Y)
        [[cx - jaw_w / 2, hi[1], zj0 - 2.0], [cx + jaw_w / 2, hi[1] + jaw_t, zj1]],      # moving jaw (+Y)
        [[cx - jaw_w / 2 - 10, lo[1] - jaw_t - 10, zj0 - 40.0], [cx + jaw_w / 2 + 10, hi[1] + jaw_t + 10, zj0 - 2.0]],  # body
        [[-200.0, -200.0, zj0 - 80.0], [200.0, 200.0, zj0 - 40.0]],                     # trunnion table
    ]
    setup = {"fixture": fx, "stock": {"lo": lo, "hi": hi}, "vise": vise,
             "part_bbox": [bb.xmin, bb.ymin, bb.zmin, bb.xmax, bb.ymax, bb.zmax],
             "parting_z": 0.0, "max_tilt_deg": MAX_TILT}
    (out_dir / "setup.json").write_text(json.dumps(setup, indent=1))
    return setup


def box_mesh(lo, hi):
    lo, hi = np.asarray(lo, float), np.asarray(hi, float)
    V = np.array([[lo[0] if i & 1 == 0 else hi[0], lo[1] if i & 2 == 0 else hi[1], lo[2] if i & 4 == 0 else hi[2]]
                  for i in range(8)])
    F = np.array([[0, 2, 1], [1, 2, 3], [4, 5, 6], [5, 7, 6], [0, 1, 4], [1, 5, 4], [2, 6, 3], [3, 6, 7],
                  [0, 4, 2], [2, 4, 6], [1, 3, 5], [3, 7, 5]])
    return V, F


def frame_of(d) -> np.ndarray:
    """Rotation whose third column is the unit direction d (tool axis); columns = frame axes in fixture coordinates."""
    d = np.asarray(d, float)
    d = d / np.linalg.norm(d)
    a = np.array([1.0, 0, 0]) if abs(d[0]) < 0.9 else np.array([0, 1.0, 0])
    x = np.cross(a, d)
    x /= np.linalg.norm(x)
    y = np.cross(d, x)
    return np.stack([x, y, d], 1)


def candidate_dirs(faces: list, Rfix: np.ndarray, max_tilt=MAX_TILT) -> np.ndarray:
    """26 cube directions + the part's own feature axes (both senses), kept if within the tilt limit."""
    D = []
    for i in (-1, 0, 1):
        for j in (-1, 0, 1):
            for k in (-1, 0, 1):
                if i or j or k:
                    D.append(np.array([i, j, k], float))
    for f in faces:
        ax = f.get("normal") if f["type"] == "plane" else f.get("axis")
        if ax is None:
            continue
        v = Rfix @ np.asarray(ax, float)
        if np.linalg.norm(v) > 1e-9:
            D += [v, -v]
    out = []
    for d in D:
        d = d / np.linalg.norm(d)
        if math.degrees(math.acos(max(-1, min(1, d[2])))) > max_tilt + 1e-6:
            continue
        if not any(abs(d @ o - 1) < 1e-4 for o in out):
            out.append(d)
    return np.array(out)


def reachability(V, F, vise, stock_lo, stock_hi, P, N, dirs, res=REACH_RES, tools=(4, 8), verbose=False):
    """Per probe: index of a direction from which the library's smallest flat or ball tool can remove the material
    just outside the surface (tol + 0.03 mm) without gouging the part or entering the vise; -1 if none."""
    import time

    Vv, Fv = [V], [F]
    off = len(V)
    for lo, hi in vise:
        bv, bf = box_mesh(lo, hi)
        Vv.append(bv)
        Fv.append(bf + off)
        off += 8
    VA, FA = np.concatenate(Vv), np.concatenate(Fv)
    corners = np.array([[x, y, z] for x in (stock_lo[0], stock_hi[0]) for y in (stock_lo[1], stock_hi[1])
                        for z in (stock_lo[2], stock_hi[2])])
    best = np.full(len(P), -1, np.int64)
    Q = P + N * (TOL + 0.03)
    for di, d in enumerate(dirs):
        t0 = time.time()
        R = frame_of(d)
        Vk = VA @ R            # fixture -> frame coordinates (R orthonormal)
        C = corners @ R
        lo2 = C[:, :2].min(0) - 3.0
        hi2 = C[:, :2].max(0) + 3.0
        nx, ny = int(math.ceil((hi2[0] - lo2[0]) / res)), int(math.ceil((hi2[1] - lo2[1]) / res))
        Ht = kernel.raster_top(np.ascontiguousarray(Vk), FA, lo2[0], lo2[1], res, nx, ny, -1e6)
        floor = np.full_like(Ht, -1e30)
        Hach = np.full_like(Ht, 1e30)
        for tn in tools:
            row = LIBRARY[tn].row()
            Hach = np.minimum(Hach, kernel.achievable(Ht, res, int(row[0]), row[1], row[2], row[3], row[4], floor))
        todo = np.where(best < 0)[0]
        q = Q[todo] @ R
        jj = np.clip(((q[:, 0] - lo2[0]) / res - 0.5).round().astype(int), 0, nx - 1)
        ii = np.clip(((q[:, 1] - lo2[1]) / res - 0.5).round().astype(int), 0, ny - 1)
        ok = Hach[ii, jj] <= q[:, 2] + 0.03
        best[todo[ok]] = di
        if verbose:
            print(f"  dir {di} {np.round(d, 3)}: +{ok.sum()} reachable, {np.sum(best < 0)} left ({time.time() - t0:.1f}s)")
        if not (best < 0).any():
            break
    return best


def load(run_part_dir, rebuild=False, verbose=True) -> Part5:
    pdir = Path(run_part_dir)
    step = pdir / "part.step"
    setup = json.loads((pdir / "setup.json").read_text())
    sha = hashlib.sha256(step.read_bytes() + json.dumps(setup, sort_keys=True).encode()).hexdigest()
    cfile = pdir / ".cache" / f"pre5_{sha[:16]}.npz"
    if cfile.exists() and not rebuild:
        z = np.load(cfile, allow_pickle=False)
        meta = json.loads(str(z["meta"]))
        return Part5(pdir, meta["name"], setup["fixture"], setup["stock"], setup["vise"], z["V"], z["F"], z["TF"],
                     meta["faces"], z["P"], z["N"], z["pface"], z["parea"], z["pclass"], z["pedge"], z["dirs"],
                     z["pdir"], sha, setup)
    import time
    t0 = time.time()
    V, F, TF, faces, _ = _mesh_from_step(step)
    rng = np.random.default_rng(12345)
    P, N, PF, PA = _sample(V, F, TF, None, rng)
    edge = edge_band(V, F, TF, P, PF)
    cls = np.zeros(len(P), np.int8)
    parting = (P[:, 2] < 1e-3) & (N[:, 2] < -0.99)
    cls[parting] = 1
    dirs = candidate_dirs(faces, np.eye(3))
    if verbose:
        print(f"[part5] {len(P)} probes, {len(dirs)} candidate directions")
    lo, hi = np.array(setup["stock"]["lo"]), np.array(setup["stock"]["hi"])
    idx = np.where(cls == 0)[0]
    pd = np.full(len(P), -1, np.int64)
    pd[idx] = reachability(V, F, setup["vise"], lo, hi, P[idx], N[idx], dirs, verbose=verbose)
    cls[(cls == 0) & (pd < 0)] = 2
    cfile.parent.mkdir(exist_ok=True)
    name = setup.get("name", pdir.name)
    np.savez_compressed(cfile, V=V, F=F, TF=TF, P=P, N=N, pface=PF, parea=PA, pclass=cls, pedge=edge, dirs=dirs,
                        pdir=pd, meta=json.dumps({"faces": faces, "name": name}))
    if verbose:
        print(f"[part5] classes {np.bincount(cls, minlength=3).tolist()} in {time.time() - t0:.0f}s")
    return Part5(pdir, name, setup["fixture"], setup["stock"], setup["vise"], V, F, TF, faces, P, N, PF, PA, cls, edge,
                 dirs, pd, sha, setup)
