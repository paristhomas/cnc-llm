"""Test fixture for the refine-phase evaluator (whole-surface score, part-off tabs, tab witness, attacks).

An 80 x 50 x 20 mm box held in the vise on a 24 mm stub gap. `box_program()` is an "ideal" 3+2 program written by
hand: face the top, profile the walls to Z-1, then a part-off that finishes the underside with the flank of
horizontal T1 passes (tool centre at Z-5, so the flank is tangent to Z0) and leaves two tabs about 2.6 mm wide in the
gap. Variants are the reviewer's attacks (ACCEPTANCE_REFINE I4).
"""
from __future__ import annotations

from pathlib import Path

import numpy as np

FIXTURE = {"up": "+Z", "rot_z_deg": 0, "scale": 1.0, "margin": 3, "top": 1, "gap": 24, "grip": 8}
L, W, H = 80.0, 50.0, 20.0
F_CUT, F_PLUNGE = 2400, 900


def make_box_step(path: Path) -> Path:
    import cadquery as cq
    path.parent.mkdir(parents=True, exist_ok=True)
    cq.exporters.export(cq.Workplane("XY").box(L, W, H, centered=(True, True, False)), str(path))
    return path


def _index(ijk, origin):
    x, y, z = origin
    i, j, k = ijk
    return f"M5\nG68.2 X{x:g} Y{y:g} Z{z:g} I{i:g} J{j:g} K{k:g}\nG53.1\nS18000 M3\n"


def _end_frame():
    return "G0 Z60\nM5\nG69\n"


def box_program(variant: str = "ideal") -> str:
    """variants: ideal | bigtabs | underside_skipped | wall_skin | skip_face | gouge_at_tab | no_partoff"""
    hx, hy = L / 2, W / 2
    sx, sy = hx + 3, hy + 3                      # stock half sizes
    g = ["(box test program: " + variant + ")", "G21 G90 G17 G94", "T1 M6", "G43 H1", "S18000 M3"]
    # ---- setup 1 from +Z: face the top at Z20
    g += ["G0 X-52 Y-33 Z30", "G0 Z20.0"]
    ys = np.arange(-33, 33.01, 6.0)
    for i, y in enumerate(ys):
        x = 52 if i % 2 == 0 else -52
        g += [f"G1 Y{y:g} F{F_CUT}", f"G1 X{x:g}"]
    g += ["G0 Z30"]
    # ---- profile the walls to Z-1 (tool centre path = part outline + R5)
    off = 5.0 + (0.25 if variant == "wall_skin" else 0.0)
    xR = hx + off + (1.0 if variant == "skip_face" else 0.0)    # skip_face: +X wall left 1 mm proud
    for z in [18, 15, 12, 9, 6, 3, 0, -1]:
        g += [f"G0 X{-hx - off - 10:g} Y{-hy - off:g}", f"G0 Z{z:g}",
              f"G1 X{xR:g} F{F_CUT}", f"G1 Y{hy + off:g}", f"G1 X{-hx - off:g}", f"G1 Y{-hy - off:g}", "G0 Z30"]
    if variant == "no_partoff":
        return "\n".join(g + ["M5", "M30", ""])
    # ---- part-off: finish the underside from the sides, leave two tabs
    g += ["(PART-OFF)"]
    zc = -5.0 if variant != "underside_skipped" else -5.4    # tool centre height: flank tangent to Z0 (or 0.4 low)
    fy = zc + 5.0                                             # frame y of the tool centre line (frame origin Z-5)
    tab_hw = 1.3                                              # half thickness of the tab web (Y)
    # from -Y (tool axis -Y; frame x = X, frame y = Z+5, frame z = -28 - Y)
    g += [_index((0, 90, 0), (0, -sy, -5))]
    for ytip in (-21, -14, -7, -tab_hw):
        fz = -sy - ytip
        g += ["G0 X-62 Y%g Z10" % fy, f"G1 Z{fz:g} F{F_PLUNGE}", f"G1 X62 F{F_CUT}", "G0 Z10"]
    if variant == "gouge_at_tab":    # a strip 0.3 mm above Z0 right beside a tab: must count as gouge, never witness
        g += ["G0 X3 Y0.3 Z10", f"G1 Z{-sy + 0.8:g} F{F_PLUNGE}", f"G1 X7 F{F_CUT}", "G0 Z10"]
    g += [_end_frame()]
    # from +Y (frame x = -X, frame y = Z+5, frame z = Y - 28)
    g += [_index((180, 90, 0), (0, sy, -5))]
    for ytip in (21, 14, 7, tab_hw):
        fz = ytip - sy
        g += ["G0 X-62 Y%g Z10" % fy, f"G1 Z{fz:g} F{F_PLUNGE}", f"G1 X62 F{F_CUT}", "G0 Z10"]
    g += [_end_frame()]
    if variant != "bigtabs":
        tab_x = 6.5
        # from -X (frame x = -Y, frame y = Z+5, frame z = -43 - X) and +X (frame x = Y, frame z = X - 43)
        for ijk, sgn in (((-90, 90, 0), -1), ((90, 90, 0), 1)):
            g += [_index(ijk, (sgn * sx, 0, -5))]
            for xtip in (36, 29, 22, 15, tab_x):
                fz = xtip - sx
                g += ["G0 X-10 Y%g Z10" % fy, f"G1 Z{fz:g} F{F_PLUNGE}", f"G1 X10 F{F_CUT}", "G0 Z10"]
            g += [_end_frame()]
        # split the remaining web in the middle with a plunge from -Y through it -> two tabs
        g += [_index((0, 90, 0), (0, -sy, -5))]
        g += ["G0 X0 Y%g Z10" % fy, f"G1 Z{-sy - 2.3:g} F{F_PLUNGE}", "G0 Z10", _end_frame()]
    g += ["M5", "M30", ""]
    return "\n".join(g)
