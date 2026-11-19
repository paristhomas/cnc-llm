"""Fixed tool library and machine definition.

The LLM may only use tools from this library (selected by `T<n> M6`). Tool geometry is owned by the harness, never by
the program, so a program cannot "invent" a zero-radius or infinitely long tool.

Cutting profile h(r): height of the cutting surface above the tool tip at radial distance r (0 <= r <= R).
  flat : 0
  ball : R - sqrt(R^2 - r^2)
  bull : corner radius cr at the periphery
  cone : (r - tip_r) * cot(half_angle)  (chamfer mill, spot drill, drill point)
"""
from __future__ import annotations

import math
from dataclasses import dataclass, asdict

KIND = {"flat": 0, "ball": 1, "bull": 2, "cone": 3}


@dataclass(frozen=True)
class Tool:
    number: int
    name: str
    kind: str              # flat | ball | bull | cone
    diameter: float        # cutting diameter (mm)
    flutes: int
    flute_length: float    # length of cutting edge from the tip (mm); material above this touches the shank
    stickout: float        # tip to holder face (mm)
    shank_diameter: float  # non-cutting body diameter above the flutes
    holder_diameter: float = 32.0
    corner_radius: float = 0.0   # bull nose
    half_angle: float = 0.0      # cone tools: half of the included angle (deg)
    tip_diameter: float = 0.0    # cone tools: flat at the tip
    chipload: float = 0.03       # recommended chip load in aluminium (mm/tooth)
    max_rpm: int = 24000
    center_cutting: bool = True
    note: str = ""

    @property
    def R(self) -> float:
        return self.diameter / 2.0

    def h(self, r: float) -> float:
        R = self.R
        if self.kind == "flat":
            return 0.0
        if self.kind == "ball":
            return R - math.sqrt(max(R * R - r * r, 0.0))
        if self.kind == "bull":
            e = max(r - (R - self.corner_radius), 0.0)
            c = self.corner_radius
            return c - math.sqrt(max(c * c - e * e, 0.0))
        return max(r - self.tip_diameter / 2.0, 0.0) / math.tan(math.radians(self.half_angle))

    def row(self) -> list[float]:
        """Numeric row for the numba kernels: kind R cr tip_r cot."""
        cot = 1.0 / math.tan(math.radians(self.half_angle)) if self.kind == "cone" else 0.0
        return [KIND[self.kind], self.R, self.corner_radius, self.tip_diameter / 2.0, cot]

    def recommended_feed(self, rpm: float) -> float:
        return self.chipload * self.flutes * rpm

    def to_dict(self) -> dict:
        d = asdict(self)
        d["profile_height_at_R"] = round(self.h(self.R), 4)
        return d


# Carbide tools for aluminium on a rigid 24k rpm VMC / high-end router.  Chip loads are conservative catalogue values.
LIBRARY: dict[int, Tool] = {t.number: t for t in [
    Tool(1, "10 mm 3-flute flat endmill", "flat", 10.0, 3, 25.0, 40.0, 10.0, chipload=0.06, max_rpm=18000),
    Tool(2, "6 mm 3-flute flat endmill", "flat", 6.0, 3, 18.0, 30.0, 6.0, chipload=0.04),
    Tool(3, "3 mm 2-flute flat endmill", "flat", 3.0, 2, 10.0, 22.0, 3.0, chipload=0.02),
    Tool(4, "1.5 mm 2-flute flat endmill", "flat", 1.5, 2, 5.0, 14.0, 1.5, holder_diameter=20.0, chipload=0.01),
    Tool(5, "8 mm bull-nose endmill r1", "bull", 8.0, 3, 20.0, 35.0, 8.0, corner_radius=1.0, chipload=0.05),
    Tool(6, "6 mm ball endmill", "ball", 6.0, 2, 14.0, 32.0, 6.0, chipload=0.03),
    Tool(7, "3 mm ball endmill", "ball", 3.0, 2, 8.0, 22.0, 3.0, chipload=0.02),
    Tool(8, "1 mm ball endmill", "ball", 1.0, 2, 3.0, 12.0, 1.0, holder_diameter=20.0, chipload=0.008),
    Tool(9, "6 mm 90deg chamfer mill", "cone", 6.0, 2, 3.0, 25.0, 6.0, half_angle=45.0, tip_diameter=0.2, chipload=0.02,
         center_cutting=False, note="cuts 45deg chamfers; tip flat 0.2 mm"),
    Tool(10, "5 mm drill 118deg", "cone", 5.0, 2, 30.0, 40.0, 5.0, half_angle=59.0, chipload=0.06, max_rpm=8000,
         note="drilling only (vertical moves / G81 / G83); no side milling"),
]}


@dataclass(frozen=True)
class Machine:
    name: str = "Generic 3-axis VMC (LinuxCNC-style dialect)"
    x_travel: tuple = (-300.0, 300.0)
    y_travel: tuple = (-200.0, 200.0)
    z_travel: tuple = (-5.0, 200.0)
    max_rpm: int = 24000
    max_feed: float = 6000.0       # mm/min, cutting
    rapid_rate: float = 15000.0    # mm/min, used for cycle time
    home: tuple = (0.0, 0.0, 150.0)
    spoilboard_allowance: float = 0.5   # may cut this far below Z0 (stock bottom / sacrificial plate)


MACHINE = Machine()


def library_table() -> str:
    """Markdown table of the tool library for the LLM."""
    rows = ["| T | Tool | Kind | D (mm) | Flutes | Flute len | Stick-out | Holder D | Chipload (mm/t) | Max rpm | Notes |",
            "|---|---|---|---|---|---|---|---|---|---|---|"]
    for t in LIBRARY.values():
        extra = t.note
        if t.kind == "bull":
            extra = f"corner r{t.corner_radius}"
        rows.append(f"| T{t.number} | {t.name} | {t.kind} | {t.diameter:g} | {t.flutes} | {t.flute_length:g} | {t.stickout:g} | "
                    f"{t.holder_diameter:g} | {t.chipload:g} | {min(t.max_rpm, MACHINE.max_rpm)} | {extra} |")
    return "\n".join(rows)
