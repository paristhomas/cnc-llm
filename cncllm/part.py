"""Part loading and per-part preprocessing (target mesh, surface samples, accessibility, achievable envelope).

A part directory contains
  part.step      the target (mm). Z0 = bottom of the part = bottom of the stock (datum face on the fixture plate)
  stock.json     {"x": [lo, hi], "y": [lo, hi], "z": [0, top], "material": "...", "name": "...", "description": "..."}
Everything else is derived here and cached in <part>/.cache/ keyed by the STEP file hash.
"""
from __future__ import annotations

import hashlib
import json
import math
from dataclasses import dataclass
from pathlib import Path

import numpy as np

from . import kernel
from .tools import LIBRARY

TOL = 0.1
SURF_DENSITY = 0.15     # mm^2 of surface per probe point
MAX_POINTS = 250_000
TARGET_RES = 0.05
EDGE_BAND = 0.03        # mm       # target height-field resolution for accessibility (mm)


@dataclass
class Part:
    dir: Path
    name: str
    stock: dict
    V: np.ndarray            # mesh vertices
    F: np.ndarray            # triangles
    tri_face: np.ndarray     # B-rep face id per triangle
    faces: list              # face descriptors
    P: np.ndarray            # probe points (n, 3)
    N: np.ndarray            # outward normals (n, 3)
    pface: np.ndarray        # face id per probe point
    parea: np.ndarray        # area represented by each point (mm^2)
    pclass: np.ndarray       # 0 machinable, 1 datum (stock bottom), 2 undercut (not visible from +Z), 3 tool-limited
    Ht: np.ndarray           # target top height field at TARGET_RES
    Hach: np.ndarray         # lowest top achievable with the library without gouging (same grid)
    grid: dict               # x0 y0 res nx ny of Ht / Hach
    sha: str
    preach: np.ndarray = None
    pedge: np.ndarray = None   # probe within EDGE_BAND of its B-rep face boundary (normal probing is ill-posed there)  # machinable only by the smallest tools, whose holder reach is too short (informational)

    @property
    def stock_lo(self):
        s = self.stock
        return np.array([s["x"][0], s["y"][0], s["z"][0]])

    @property
    def stock_hi(self):
        s = self.stock
        return np.array([s["x"][1], s["y"][1], s["z"][1]])


def _sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _surface_info(face, fid: int) -> dict:
    from OCP.BRepAdaptor import BRepAdaptor_Surface
    from OCP.GeomAbs import GeomAbs_SurfaceType as ST
    from OCP.BRepGProp import BRepGProp
    from OCP.GProp import GProp_GProps
    from OCP.TopAbs import TopAbs_REVERSED

    s = BRepAdaptor_Surface(face.wrapped)
    t = s.GetType()
    bb = face.BoundingBox()
    props = GProp_GProps()
    BRepGProp.SurfaceProperties_s(face.wrapped, props)
    info = {"id": fid, "area": round(props.Mass(), 3),
            "bbox": [round(v, 3) for v in (bb.xmin, bb.ymin, bb.zmin, bb.xmax, bb.ymax, bb.zmax)]}
    rev = face.wrapped.Orientation() == TopAbs_REVERSED
    if t == ST.GeomAbs_Plane:
        pl = s.Plane()
        n = pl.Axis().Direction()
        nv = np.array([n.X(), n.Y(), n.Z()]) * (-1 if rev else 1)
        info["type"] = "plane"
        info["normal"] = [round(float(v), 4) for v in nv]
        if abs(nv[2]) > 0.999:
            info["z"] = round(bb.zmin, 4)
    elif t == ST.GeomAbs_Cylinder:
        cy = s.Cylinder()
        ax = cy.Axis()
        d, l = ax.Direction(), ax.Location()
        info["type"] = "cylinder"
        info["radius"] = round(cy.Radius(), 4)
        info["axis"] = [round(d.X(), 4), round(d.Y(), 4), round(d.Z(), 4)]
        info["center"] = [round(l.X(), 4), round(l.Y(), 4)]
        # concave (hole) if the outward normal points to the axis: sample the face middle
        u = (s.FirstUParameter() + s.LastUParameter()) / 2
        v = (s.FirstVParameter() + s.LastVParameter()) / 2
        p = s.Value(u, v)
        from OCP.BRepLProp import BRepLProp_SLProps
        pr = BRepLProp_SLProps(s, u, v, 1, 1e-6)
        nn = pr.Normal()
        nvec = np.array([nn.X(), nn.Y(), nn.Z()]) * (-1 if rev else 1)
        radial = np.array([p.X() - l.X(), p.Y() - l.Y(), p.Z() - l.Z()])
        dv = np.array([d.X(), d.Y(), d.Z()])
        radial -= dv * radial.dot(dv)
        info["concave"] = bool(nvec.dot(radial) < 0)
    elif t == ST.GeomAbs_Cone:
        co = s.Cone()
        info["type"] = "cone"
        info["half_angle_deg"] = round(math.degrees(co.SemiAngle()), 3)
        l = co.Axis().Location()
        info["center"] = [round(l.X(), 4), round(l.Y(), 4)]
    elif t == ST.GeomAbs_Torus:
        to = s.Torus()
        info["type"] = "torus"
        info["minor_radius"] = round(to.MinorRadius(), 4)
        info["major_radius"] = round(to.MajorRadius(), 4)
    elif t == ST.GeomAbs_Sphere:
        info["type"] = "sphere"
        info["radius"] = round(s.Sphere().Radius(), 4)
    else:
        info["type"] = {ST.GeomAbs_BSplineSurface: "bspline", ST.GeomAbs_BezierSurface: "bezier",
                        ST.GeomAbs_SurfaceOfExtrusion: "extrusion", ST.GeomAbs_SurfaceOfRevolution: "revolution",
                        ST.GeomAbs_OffsetSurface: "offset"}.get(t, "other")
    return info


def _mesh_from_step(step: Path, deflection: float = 0.004, angular: float = 0.05):
    """Mesh the whole solid with an ABSOLUTE chord deflection (shared edges => consistent faces)."""
    import cadquery as cq
    from OCP.BRep import BRep_Tool
    from OCP.BRepMesh import BRepMesh_IncrementalMesh
    from OCP.TopAbs import TopAbs_REVERSED
    from OCP.TopLoc import TopLoc_Location

    shape = cq.importers.importStep(str(step)).val()
    BRepMesh_IncrementalMesh(shape.wrapped, deflection, False, angular, True)
    Vs, Fs, TF, faces = [], [], [], []
    off = 0
    for fid, face in enumerate(shape.Faces()):
        loc = TopLoc_Location()
        tri = BRep_Tool.Triangulation_s(face.wrapped, loc)
        if tri is None:
            continue
        trsf = loc.Transformation()
        v = np.array([(lambda p: (p.X(), p.Y(), p.Z()))(tri.Node(i).Transformed(trsf))
                      for i in range(1, tri.NbNodes() + 1)])
        t = np.array([tri.Triangle(i).Get() for i in range(1, tri.NbTriangles() + 1)], np.int64) - 1
        if face.wrapped.Orientation() == TopAbs_REVERSED:
            t = t[:, ::-1]
        Vs.append(v)
        Fs.append(t + off)
        TF.append(np.full(len(t), fid))
        off += len(v)
        faces.append(_surface_info(face, fid))
    V = np.concatenate(Vs)
    F = np.concatenate(Fs)
    TFa = np.concatenate(TF)
    a, b, c = V[F[:, 0]], V[F[:, 1]], V[F[:, 2]]
    vol = np.einsum("ij,ij->i", a, np.cross(b, c)).sum() / 6
    if vol < 0:
        F = F[:, ::-1].copy()
    return V, F, TFa, faces, shape


def _sample(V, F, TF, n_target, rng):
    a, b, c = V[F[:, 0]], V[F[:, 1]], V[F[:, 2]]
    cr = np.cross(b - a, c - a)
    area = np.linalg.norm(cr, axis=1) / 2
    nrm = cr / np.maximum(2 * area[:, None], 1e-15)
    total = area.sum()
    n = int(min(max(total / SURF_DENSITY, 20000), MAX_POINTS))
    n = n if n_target is None else n_target
    # stratified: expected count per triangle, remainder by probability
    exp = area / total * n
    cnt = np.floor(exp).astype(np.int64)
    cnt += (rng.random(len(exp)) < (exp - cnt)).astype(np.int64)
    ti = np.repeat(np.arange(len(F)), cnt)
    r1, r2 = rng.random(len(ti)), rng.random(len(ti))
    s1 = np.sqrt(r1)
    w0, w1, w2 = 1 - s1, s1 * (1 - r2), s1 * r2
    P = a[ti] * w0[:, None] + b[ti] * w1[:, None] + c[ti] * w2[:, None]
    return P, nrm[ti], TF[ti], np.full(len(ti), total / max(len(ti), 1))


def _upward_blocked(V, F, TF, Q, qface):
    """True where a vertical ray from Q going +Z hits the target (point hidden from a 3-axis tool).
    Hits on the point's own B-rep face closer than 0.5 mm are tessellation artefacts (slightly slanted wall facets)."""
    import trimesh

    mesh = trimesh.Trimesh(V, F, process=False)
    hit = np.zeros(len(Q), bool)
    inter = trimesh.ray.ray_triangle.RayMeshIntersector(mesh)
    B = 20000
    for s in range(0, len(Q), B):
        q = Q[s:s + B]
        d = np.tile([0.0, 0.0, 1.0], (len(q), 1))
        loc, ri, ti = inter.intersects_location(q, d, multiple_hits=True)
        if not len(ri):
            continue
        dz = loc[:, 2] - q[ri, 2]
        same = TF[ti] == qface[s + ri]
        ok = ~(same & (dz < 0.5))
        ri, ti, dz = ri[ok], ti[ok], dz[ok]
        # first hit per ray must be a downward-facing facet (entering material from below = a real overhang);
        # an upward-facing first hit means the ray started inside the material (tessellation mismatch)
        tri = V[F[ti]]
        nz = np.cross(tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0])[:, 2]
        order = np.lexsort((dz, ri))
        ri, nz = ri[order], nz[order]
        first = np.r_[True, ri[1:] != ri[:-1]]
        blocked = ri[first][nz[first] < 0]
        hit[s + blocked] = True
    return hit


def edge_band(V, F, TF, P, PF, band=EDGE_BAND):
    """True for probes closer than `band` to the boundary of their own B-rep face. At a face edge the normal ray
    enters the neighbouring face's material/air, so a micron-level wall offset reads as a +-5 mm deviation."""
    from scipy.spatial import cKDTree

    out = np.zeros(len(P), bool)
    for f in np.unique(TF):
        tris = F[TF == f]
        e = np.sort(np.concatenate([tris[:, [0, 1]], tris[:, [1, 2]], tris[:, [2, 0]]]), axis=1)
        u, c = np.unique(e, axis=0, return_counts=True)
        b = u[c == 1]
        if not len(b):
            continue
        a, d = V[b[:, 0]], V[b[:, 1]]
        L = np.linalg.norm(d - a, axis=1)
        n = np.maximum(np.ceil(L / (band / 3)).astype(int), 1)
        pts = np.concatenate([a[i] + (d[i] - a[i]) * (np.arange(n[i] + 1)[:, None] / n[i]) for i in range(len(b))])
        k = np.where(PF == f)[0]
        if not len(k):
            continue
        dist, _ = cKDTree(pts).query(P[k], distance_upper_bound=band)
        out[k[np.isfinite(dist)]] = True
    return out


def holder_floor(Ht, res, holder_R, stickout, block=5):
    """Lowest tip height at which the holder (cylinder of holder_R starting stick-out above the tip) clears the target:
    max of Ht within holder_R, minus stick-out. Conservative block-max on a coarse grid."""
    from scipy import ndimage

    ny, nx = Ht.shape
    py, px = (-ny) % block, (-nx) % block
    Hp = np.pad(Ht, ((0, py), (0, px)), mode="edge")
    C = Hp.reshape(Hp.shape[0] // block, block, Hp.shape[1] // block, block).max(axis=(1, 3))
    r = int(np.ceil(holder_R / (res * block))) + 1
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    fp = np.hypot(yy, xx) * res * block <= holder_R + res * block
    M = ndimage.maximum_filter(C, footprint=fp, mode="nearest")
    U = np.repeat(np.repeat(M, block, 0), block, 1)[:ny, :nx]
    return np.ascontiguousarray(U - stickout)


def load(part_dir, rebuild: bool = False, verbose: bool = True) -> Part:
    pdir = Path(part_dir)
    step = pdir / "part.step"
    stock = json.loads((pdir / "stock.json").read_text())
    sha = _sha(step)
    cdir = pdir / ".cache"
    cfile = cdir / f"pre3_{sha[:16]}.npz"
    if cfile.exists() and not rebuild:
        z = np.load(cfile, allow_pickle=False)
        meta = json.loads(str(z["meta"]))
        return Part(pdir, stock.get("name", pdir.name), stock, z["V"], z["F"], z["TF"], meta["faces"], z["P"], z["N"],
                    z["pface"], z["parea"], z["pclass"], z["Ht"], z["Hach"], meta["grid"], sha, z["preach"], z["pedge"])
    import time
    t0 = time.time()
    V, F, TF, faces, _ = _mesh_from_step(step)
    rng = np.random.default_rng(12345)
    P, N, PF, PA = _sample(V, F, TF, None, rng)
    # target height field
    res = TARGET_RES
    lo = np.array([stock["x"][0], stock["y"][0]]) - 2.0
    hi = np.array([stock["x"][1], stock["y"][1]]) + 2.0
    nx, ny = int(math.ceil((hi[0] - lo[0]) / res)), int(math.ceil((hi[1] - lo[1]) / res))
    Ht = kernel.raster_top(V, F, lo[0], lo[1], res, nx, ny)
    grid = {"x0": float(lo[0]), "y0": float(lo[1]), "res": res, "nx": nx, "ny": ny}
    # achievable envelope with the smallest ball and smallest flat tool of the library
    Hach = np.full_like(Ht, 1e30)
    Hreach = np.full_like(Ht, 1e30)
    nofloor = np.full_like(Ht, -1e30)
    for tn in (4, 8):  # smallest flat and ball tool: geometric limit (tool radius), ignoring holder reach
        t = LIBRARY[tn]
        row = t.row()
        Hach = np.minimum(Hach, kernel.achievable(Ht, res, int(row[0]), row[1], row[2], row[3], row[4], nofloor))
        zfloor = holder_floor(Ht, res, t.holder_diameter / 2, t.stickout)
        Hreach = np.minimum(Hreach, kernel.achievable(Ht, res, int(row[0]), row[1], row[2], row[3], row[4], zfloor))
    # classify probe points
    cls = np.zeros(len(P), np.int8)
    datum = (P[:, 2] < 1e-3) & (N[:, 2] < -0.99)
    cls[datum] = 1
    Q = P + N * 0.02
    down = N[:, 2] < -0.05
    cand = ~datum
    blocked = np.zeros(len(P), bool)
    blocked[cand] = _upward_blocked(V, F, TF, Q[cand] + np.array([1.3e-7, 0.7e-7, 0.0]), PF[cand])
    cls[(blocked | down) & ~datum] = 2
    # tool-limited: just outside the surface (by the tolerance + margin) the library cannot remove material
    Qt = P + N * (TOL + 0.03)
    jj = np.clip(((Qt[:, 0] - lo[0]) / res - 0.5).round().astype(int), 0, nx - 1)
    ii = np.clip(((Qt[:, 1] - lo[1]) / res - 0.5).round().astype(int), 0, ny - 1)
    lim = (Hach[ii, jj] > Qt[:, 2] + 0.03) & (cls == 0)
    cls[lim] = 3
    # informational: needs the smallest tools but their holder/stick-out cannot get there (bigger tools may still not fit)
    reach = (Hreach[ii, jj] > Qt[:, 2] + 0.03) & (cls == 0)
    edge = edge_band(V, F, TF, P, PF)
    cdir.mkdir(exist_ok=True)
    meta = {"faces": faces, "grid": grid}
    np.savez_compressed(cfile, V=V, F=F, TF=TF, P=P, N=N, pface=PF, parea=PA, pclass=cls, Ht=Ht, Hach=Hach, preach=reach, pedge=edge,
                        meta=json.dumps(meta))
    if verbose:
        print(f"[part] {pdir.name}: {len(F)} tris, {len(P)} probes, classes "
              f"{np.bincount(cls, minlength=4).tolist()} in {time.time() - t0:.1f}s")
    return Part(pdir, stock.get("name", pdir.name), stock, V, F, TF, faces, P, N, PF, PA, cls, Ht, Hach, grid, sha, reach, edge)
