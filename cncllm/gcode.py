"""Strict G-code reader for the harness dialect (a LinuxCNC/Fanuc-compatible subset, metric, absolute).

Strictness is a trust feature: anything the simulator does not model is an ERROR, never silently ignored, so a program
cannot score well by using a code the simulator misreads.

Supported
  G0 G1 G2 G3 (XY plane, I/J incremental centre or R, helical Z allowed)   G4 P (dwell)
  G17 G21 G40 G49 G54 G64 [P] G61 G80 G90 G91.1 G94 G43 H<n>
  G81 / G82 / G83 canned drilling with G98 / G99 retract, R, Q (G83), P (G82); modal repeats on X/Y-only lines
  M3 S<rpm>  M5  M6 T<n>  M7 M8 M9 (coolant, no effect)  M0 M1 (pause, no effect)  M2 M30 (end)
  F (mm/min) S T N, comments ( ... ) and ; ... , '%' lines
Rejected (error): G20 (inch), G91 (incremental), G18/G19, G41/G42 (cutter comp), G28/G30, G53, G55-G59, G10, G90.1,
  macros/O-words/parameters (#), M4 (reverse spindle), anything else.
"""
from __future__ import annotations

import math
import re
from dataclasses import dataclass, field

import numpy as np

from .tools import LIBRARY, MACHINE

_WORD = re.compile(r"([A-Za-z])\s*([-+]?(?:\d+\.?\d*|\.\d+))")
ALLOWED_G = {0, 1, 2, 3, 4, 17, 21, 40, 43, 49, 54, 61, 64, 80, 81, 82, 83, 90, 94, 98, 99}
ALLOWED_G_FRAC = {91.1}
ALLOWED_M = {0, 1, 2, 3, 5, 6, 7, 8, 9, 30}
MOTION = {0, 1, 2, 3, 81, 82, 83}

# move row layout
COLS = ["x0", "y0", "z0", "x1", "y1", "z1", "tool", "rapid", "feed", "rpm", "line", "spindle"]
C = {k: i for i, k in enumerate(COLS)}


@dataclass
class Program:
    moves: np.ndarray                    # (n, len(COLS)) float64
    errors: list = field(default_factory=list)    # {"line", "msg"}
    warnings: list = field(default_factory=list)
    tools_used: list = field(default_factory=list)
    n_lines: int = 0
    tool_changes: list = field(default_factory=list)  # (line, tool)
    dwell_s: float = 0.0
    ended: bool = False
    frames: list = field(default_factory=list)   # tilt mode: [{"R": 3x3, "origin": [x,y,z], "line": n}], 0 = G54

    @property
    def ok(self) -> bool:
        return not self.errors


def _strip(line: str) -> str:
    out, depth = [], 0
    for ch in line:
        if ch == "(":
            depth += 1
            continue
        if ch == ")":
            depth = max(depth - 1, 0)
            continue
        if depth:
            continue
        if ch == ";":
            break
        out.append(ch)
    return "".join(out).strip()


def euler_zxz(i_deg, j_deg, k_deg):
    """Fanuc G68.2 Euler angles (Z, X', Z''): columns of R are the tilted frame axes in work coordinates."""
    a, b, c = (math.radians(v) for v in (i_deg, j_deg, k_deg))
    def rz(t):
        return np.array([[math.cos(t), -math.sin(t), 0], [math.sin(t), math.cos(t), 0], [0, 0, 1]])
    def rx(t):
        return np.array([[1, 0, 0], [0, math.cos(t), -math.sin(t)], [0, math.sin(t), math.cos(t)]])
    return rz(a) @ rx(b) @ rz(c)


def parse(text: str, arc_tol: float = 0.0005, max_moves: int = 20_000_000, tilt: bool = False,
          max_tilt_deg: float = 110.0) -> Program:
    """tilt=True: 3+2 dialect. `G68.2 X Y Z I J K` defines a tilted work plane (origin XYZ in G54, Euler ZXZ angles
    I J K), `G53.1` orients the tool along its +Z (implicit retract to Z150 of the current frame first, the tool is
    then parked at Z150 above the new frame origin), `G69` cancels (same retract/park). Coordinates are in the
    active frame; every move row gets the frame index as an extra last column."""
    rows: list[tuple] = []
    errors: list[dict] = []
    warnings: list[dict] = []
    pos = list(MACHINE.home)
    tool = 0          # loaded tool number (0 = none)
    pre_tool = None
    tlo = None        # active tool length offset H
    spindle = False
    rpm = 0.0
    feed = None
    motion = None
    retract_mode = 98
    cyc = {}          # canned cycle modal words
    tools_used: list[int] = []
    tchanges = []
    dwell = 0.0
    ended = False
    lines = text.splitlines()
    frames = [{"R": np.eye(3), "origin": np.zeros(3), "line": 0, "ijk": [0.0, 0.0, 0.0]}]
    frame = 0
    pending = None    # G68.2 defined, waiting for G53.1

    def err(ln, msg):
        errors.append({"line": ln, "msg": msg})

    def add(p0, p1, rapid, ln):
        row = (p0[0], p0[1], p0[2], p1[0], p1[1], p1[2], tool, 1.0 if rapid else 0.0,
               0.0 if rapid else (feed or 0.0), rpm if spindle else 0.0, ln, 1.0 if spindle else 0.0)
        rows.append(row + (float(frame),) if tilt else row)

    def check_cut_state(ln) -> bool:
        if tool == 0:
            err(ln, "feed move with no tool loaded (use T<n> M6)")
            return False
        if tlo != tool:
            err(ln, f"feed move without matching tool length offset (G43 H{tool}) for T{tool}")
        if feed is None or feed <= 0:
            err(ln, "feed move with no feed rate F set")
            return False
        if feed > MACHINE.max_feed + 1e-9:
            err(ln, f"feed F{feed:g} exceeds machine max {MACHINE.max_feed:g} mm/min")
        return True

    for ln0, raw in enumerate(lines):
        ln = ln0 + 1
        s = raw.strip()
        if not s or s == "%":
            continue
        if s.startswith("/"):
            err(ln, "block delete '/' not supported")
            continue
        body = _strip(s).upper()
        if not body:
            continue
        if ended:
            err(ln, "code after program end (M2/M30)")
            break
        if any(c in body for c in "#[]<>=") or body.startswith("O"):
            err(ln, "macros / parameters / O-words not supported")
            continue
        words = _WORD.findall(body)
        rest = _WORD.sub("", body).strip()
        if rest:
            err(ln, f"unparseable text: {rest!r}")
            continue
        g_codes, m_codes, w = [], [], {}
        bad = False
        for letter, val in words:
            v = float(val)
            if letter == "G":
                g_codes.append(v)
            elif letter == "M":
                m_codes.append(v)
            elif letter in "XYZIJRFSTPQHN":
                if letter in w:
                    err(ln, f"word {letter} repeated")
                    bad = True
                w[letter] = v
            elif letter == "K":
                if tilt and any(abs(g - 68.2) < 1e-6 for g in (float(v2) for l2, v2 in words if l2 == "G")):
                    w["K"] = v
                else:
                    err(ln, "K word not supported (XY plane only)" + ("" if not tilt else "; K is only allowed in G68.2"))
                    bad = True
            else:
                err(ln, f"word {letter} not supported")
                bad = True
        if bad:
            continue
        # --- validate G codes
        new_motion = None
        for g in g_codes:
            gi = int(round(g))
            if abs(g - gi) > 1e-6:
                if round(g, 1) in ALLOWED_G_FRAC:
                    continue
                if tilt and round(g, 1) in (68.2, 53.1):
                    continue
                err(ln, f"G{g:g} not supported")
                bad = True
                continue
            if tilt and gi == 69:
                continue
            if gi not in ALLOWED_G:
                hint = {20: "inch units", 91: "incremental mode", 41: "cutter compensation", 42: "cutter compensation",
                        28: "reference return", 30: "reference return", 18: "XZ plane", 19: "YZ plane"}.get(gi, "")
                err(ln, f"G{gi} not supported" + (f" ({hint})" if hint else ""))
                bad = True
                continue
            if gi in MOTION:
                if new_motion is not None:
                    err(ln, "two motion codes on one line")
                    bad = True
                new_motion = gi
            elif gi in (98, 99):
                retract_mode = gi
            elif gi == 80:
                motion = None
                cyc = {}
            elif gi == 43:
                if "H" not in w:
                    err(ln, "G43 without H")
                    bad = True
                else:
                    tlo = int(w["H"])
                    if tlo != tool:
                        err(ln, f"G43 H{tlo} does not match loaded tool T{tool}")
            elif gi == 49:
                tlo = None
            elif gi == 4:
                dwell += float(w.get("P", 0.0))
        for m in m_codes:
            mi = int(round(m))
            if abs(m - mi) > 1e-6 or mi not in ALLOWED_M:
                err(ln, f"M{m:g} not supported" + (" (reverse spindle)" if mi == 4 else ""))
                bad = True
        if bad:
            continue
        if "F" in w:
            feed = w["F"]
        if "S" in w:
            rpm = w["S"]
            if rpm > MACHINE.max_rpm:
                err(ln, f"S{rpm:g} exceeds machine max {MACHINE.max_rpm} rpm")
        if "T" in w:
            t = int(w["T"])
            if t not in LIBRARY:
                err(ln, f"T{t} is not in the tool library")
            else:
                pre_tool = t
        # M codes in execution order: M6, M3/M5, ...
        for m in sorted(int(round(x)) for x in m_codes):
            if m == 6:
                if pre_tool is None:
                    err(ln, "M6 without a T word")
                    continue
                if spindle:
                    warnings.append({"line": ln, "msg": "tool change with spindle running (stopped automatically)"})
                    spindle = False
                p1 = [pos[0], pos[1], MACHINE.home[2]]
                if p1 != pos:
                    add(pos, p1, True, ln)
                    pos = p1
                tool = pre_tool
                tlo = None
                tchanges.append((ln, tool))
                if tool not in tools_used:
                    tools_used.append(tool)
            elif m == 3:
                if tool == 0:
                    err(ln, "M3 with no tool loaded")
                if rpm <= 0:
                    err(ln, "M3 without spindle speed S")
                elif tool and rpm > LIBRARY[tool].max_rpm:
                    err(ln, f"S{rpm:g} exceeds max rpm {LIBRARY[tool].max_rpm} of T{tool}")
                spindle = True
            elif m == 5:
                spindle = False
            elif m in (2, 30):
                ended = True
        if tilt:
            gset = {round(g, 1) for g in g_codes}
            if 68.2 in gset:
                need = [k for k in "XYZIJK" if k not in w]
                if need:
                    err(ln, f"G68.2 needs X Y Z I J K (missing {' '.join(need)})")
                    continue
                if frame != 0 or pending is not None:
                    err(ln, "G68.2 while a tilted plane is active: cancel with G69 first")
                    continue
                R = euler_zxz(w["I"], w["J"], w["K"])
                tiltdeg = math.degrees(math.acos(max(-1.0, min(1.0, R[2, 2]))))
                if tiltdeg > max_tilt_deg + 1e-6:
                    err(ln, f"G68.2 tool axis is {tiltdeg:.1f} deg from +Z, beyond the A-axis limit of {max_tilt_deg:g} deg")
                    continue
                pending = {"R": R, "origin": np.array([w["X"], w["Y"], w["Z"]]), "line": ln,
                           "ijk": [w["I"], w["J"], w["K"]]}
                continue
            if 53.1 in gset or 69.0 in gset:
                if 53.1 in gset and pending is None:
                    err(ln, "G53.1 without a preceding G68.2")
                    continue
                if spindle:
                    warnings.append({"line": ln, "msg": "rotary indexing with the spindle running"})
                p1 = [pos[0], pos[1], MACHINE.home[2]]
                if p1 != pos:
                    add(pos, p1, True, ln)
                if 53.1 in gset:
                    frames.append(pending)
                    frame = len(frames) - 1
                    pending = None
                else:
                    frame = 0
                    pending = None
                pos = [0.0, 0.0, MACHINE.home[2]]
                motion = None
                continue
            if pending is not None and (any(k in w for k in "XYZ") or new_motion is not None):
                err(ln, "motion after G68.2 before G53.1 (orient the tool first)")
                continue
        if new_motion is not None:
            motion = new_motion
            if motion in (81, 82, 83):
                cyc = {"initial_z": pos[2]}
        has_axis = any(k in w for k in "XYZ")
        if motion is None:
            if has_axis:
                err(ln, "axis words without an active motion mode")
            continue
        if not has_axis and new_motion is None:
            continue
        if not has_axis and motion in (0, 1, 2, 3):
            continue
        tgt = [w.get("X", pos[0]), w.get("Y", pos[1]), w.get("Z", pos[2])]
        for i, (lo, hi) in enumerate([MACHINE.x_travel, MACHINE.y_travel, MACHINE.z_travel]):
            if tilt:
                break
            if not (lo - 1e-9 <= tgt[i] <= hi + 1e-9):
                err(ln, f"{'XYZ'[i]}{tgt[i]:g} outside machine travel [{lo:g}, {hi:g}]")
                bad = True
        if bad:
            continue
        if motion == 0:
            if pos != tgt:
                add(pos, tgt, True, ln)
            pos = tgt
        elif motion == 1:
            if not check_cut_state(ln):
                continue
            if pos != tgt:
                add(pos, tgt, False, ln)
            pos = tgt
        elif motion in (2, 3):
            if not check_cut_state(ln):
                continue
            pts = _arc(pos, tgt, w, motion == 2, arc_tol, ln, err)
            if pts is None:
                continue
            prev = pos
            for p in pts:
                add(prev, p, False, ln)
                prev = p
            pos = tgt
        else:  # canned drilling
            for k in ("Z", "R", "Q", "P"):
                if k in w:
                    cyc[k] = w[k]
            if "Z" not in cyc or "R" not in cyc:
                err(ln, f"G{motion} needs Z and R")
                continue
            if motion == 83 and cyc.get("Q", 0) <= 0:
                err(ln, "G83 needs Q > 0")
                continue
            if not check_cut_state(ln):
                continue
            zr, zb = cyc["R"], cyc["Z"]
            if zb > zr:
                err(ln, "canned cycle Z above R")
                continue
            x, y = tgt[0], tgt[1]
            # LinuxCNC: if below R plane, first rapid up to R
            if pos[2] < zr:
                p = [pos[0], pos[1], zr]
                add(pos, p, True, ln)
                pos = p
            if (pos[0], pos[1]) != (x, y):
                p = [x, y, pos[2]]
                add(pos, p, True, ln)
                pos = p
            if pos[2] != zr:
                p = [x, y, zr]
                add(pos, p, True, ln)
                pos = p
            if motion == 83:
                q = cyc["Q"]
                depth = zr
                while depth > zb + 1e-9:
                    start = depth + 0.5 if depth < zr else zr
                    if start != pos[2]:
                        p = [x, y, start]
                        add(pos, p, True, ln)
                        pos = p
                    depth = max(depth - q, zb)
                    p = [x, y, depth]
                    add(pos, p, False, ln)
                    pos = p
                    if depth > zb + 1e-9:
                        p = [x, y, zr]
                        add(pos, p, True, ln)
                        pos = p
            else:
                p = [x, y, zb]
                add(pos, p, False, ln)
                pos = p
                if motion == 82:
                    dwell += float(cyc.get("P", 0.0))
            ret = cyc["initial_z"] if retract_mode == 98 else zr
            ret = max(ret, zr)
            p = [x, y, ret]
            add(pos, p, True, ln)
            pos = p
        if len(rows) > max_moves:
            err(ln, f"program exceeds {max_moves} moves")
            break
    if not ended:
        warnings.append({"line": len(lines), "msg": "program has no M30/M2 end"})
    if tilt and frame:
        warnings.append({"line": len(lines), "msg": "program ends with a tilted plane active (G69 missing)"})
    M = np.asarray(rows, np.float64).reshape(-1, len(COLS) + (1 if tilt else 0))
    return Program(M, errors, warnings, tools_used, len(lines), tchanges, dwell, ended, frames if tilt else [])


def _arc(p0, p1, w, cw, tol, ln, err):
    x0, y0, z0 = p0
    x1, y1, z1 = p1
    if "R" in w and ("I" in w or "J" in w):
        err(ln, "arc with both R and I/J")
        return None
    if "R" in w:
        r = w["R"]
        dx, dy = x1 - x0, y1 - y0
        d = math.hypot(dx, dy)
        if d < 1e-9:
            err(ln, "R-format arc with coincident endpoints (use I/J for full circles)")
            return None
        if abs(r) * 2 < d - 1e-6:
            err(ln, f"arc radius {abs(r):g} too small for chord {d:.4f}")
            return None
        h = math.sqrt(max(r * r - d * d / 4, 0.0))
        mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        ux, uy = -dy / d, dx / d
        # LinuxCNC: positive R => arc <= 180deg; centre on the right of chord for CW
        sgn = -1.0 if cw else 1.0
        if r < 0:
            sgn = -sgn
        cx, cy = mx + sgn * h * ux, my + sgn * h * uy
    else:
        if "I" not in w and "J" not in w:
            err(ln, "arc without I/J or R")
            return None
        cx, cy = x0 + w.get("I", 0.0), y0 + w.get("J", 0.0)
    r0 = math.hypot(x0 - cx, y0 - cy)
    r1 = math.hypot(x1 - cx, y1 - cy)
    if r0 < 1e-6:
        err(ln, "arc with zero radius")
        return None
    if abs(r0 - r1) > max(0.005, 0.001 * r0):
        err(ln, f"arc end radius mismatch: start r={r0:.4f}, end r={r1:.4f}")
        return None
    a0 = math.atan2(y0 - cy, x0 - cx)
    a1 = math.atan2(y1 - cy, x1 - cx)
    if cw:
        sweep = a0 - a1
    else:
        sweep = a1 - a0
    sweep %= 2 * math.pi
    if sweep < 1e-9:
        sweep = 2 * math.pi  # full circle
    # chord tolerance: sag = r (1 - cos(da/2)) <= tol
    da = 2 * math.acos(max(min(1 - tol / r0, 1.0), -1.0)) if r0 > tol else math.pi / 2
    n = max(int(math.ceil(sweep / max(da, 1e-4))), 2)
    pts = []
    rr = (r0 + r1) / 2
    for i in range(1, n + 1):
        t = i / n
        a = a0 - sweep * t if cw else a0 + sweep * t
        if i == n:
            pts.append([x1, y1, z1])
        else:
            pts.append([cx + rr * math.cos(a), cy + rr * math.sin(a), z0 + (z1 - z0) * t])
    return pts
