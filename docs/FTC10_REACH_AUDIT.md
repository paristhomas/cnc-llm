# FTC-10 reach audit: can the whole surface be machined from one vise fixture?

_2026-11-21. Brief step 2 (`docs/BRIEF_REFINE_3PLUS2.md` §4). This audit exists so that "unreachable" cannot come back as
an excuse. Numbers are from `tools/reach_audit.py`. Raw data is in `runs/audit/` (`ftc10/` library only, `ftc10_ext*/`
with the added tools, `ftc10_run2_region_reach.json`)._

## Answer
**Yes, in principle.** With FTC-10 standing on its −X end in the vise (`up: +X`, 158 mm tall) and four long-reach
necked tools added to the library (T11–T14, below), the reach search finds a tool, a direction and a holder clearance
for **99.59 % of the part's surface**. The remaining 0.41 % (200 mm²) is three patches of 24, 10 and 8 mm². They are
most likely limits of the search raster (0.15 mm). They are not shown to be unmachinable, and they count as failed if
a program leaves them.

In the orientation of the previous run (`up: +Z`, standing on its long edge), the whole surface is **not** reachable:
- The four Ø10 × 10 mm counterbores open downwards onto the bottom face.
- No setup can point the tool upward into them. The 110° tilt limit gives at most 20° of upward pointing, and reaching
  a counterbore floor 10 mm deep through a Ø10 opening needs about 27 mm of horizontal clearance inside the opening.
- That caps the `+Z` orientation at about 97 %.

The previous phase's "12.5 % not reachable in 3+2" was therefore part orientation choice (the fixture), part missing
tools, and part the parting-face exclusion. It was never a property of the part.

## Method
- **Placement.** For each fixture orientation, the part is placed in the vise as the harness does it: stub gap 24 mm,
  grip 8 mm, the vise jaws, body and table as obstacles.
- **Probes.** 50,000 probes are sampled over the whole surface. Every face counts, including the bottom.
- **Directions.** For every candidate tool direction (26 cube directions, the part's own face normals and axes, and a
  hemisphere sample every 22° of tilt and 45° of azimuth, down to the 110° tilt limit), a column model is evaluated in
  that frame:
  - each tool's achievable surface (drop-cutter envelope);
  - holder-aware: no point of the holder (or of a necked tool's shank) may enter the part or the vise;
  - evaluated on a 0.075–0.5 mm raster depending on the tool size.
- **Criterion.** A probe counts as reached if some tool removes the material just outside it (tolerance + 0.03 mm)
  from some direction without gouging the part.
- **Limits.**
  - "In principle" only. The search does not know the material order, the stub, rigidity during the cut, or cutting
    loads. The simulator checks those for a real program.
  - The raster can miss narrow access, so the search is conservative about small patches. It is optimistic only in
    ignoring the stub, which the part-off removes anyway.

## Orientations (share of the surface with no tool and direction found)
| Orientation (`up`, rot Z) | What faces the stub | Library T1–T10 | + T11–T14 | Main misses |
|---|---|---|---|---|
| **+X, 0** (on the −X end, 158 mm tall) | −X end face (plain end, lugs) | 7.13 % | **0.41 %** | three patches ≤ 24 mm² |
| −X, 0 (on the +X end) | +X end face | 7.82 % | 2.31 % | parts of the two Ø5.5 holes (546 + 426 mm²) |
| −Y, 0 (lying flat) | a pocketed side | not run | 3.48 % | small features opening downwards (12 patches ≈ 100 mm² each) |
| +Y, 0 (lying flat) | the other pocketed side | 23.80 % | 16.38 % | a 7,646 mm² downward-facing region |
| **+Z, 90** (previous run, on the long edge) | bottom long edge with 4 counterbores | 12.45 % | 6.98 % | bottom halves of the 4 Ø7 bores including the Ø10 counterbores (770–826 mm² each) |
| +Z, 0 / −Z, 0 / −Z, 90 | | 12.37 / 12.41 / 12.53 % | – | as +Z, 90 |

The ±X, ±Y and ±Z labels are model axes. The model's long axis is X (158 mm), Y is the 31 mm thickness, and Z the
75 mm height.

## Every failed region of the FTC-10 run 2 program, and what reaches it
The run 2 program was re-scored under the whole-surface rule: **79.50 %, INVALID**
(`runs/ftc10/20261120-165400-run2/rescore_refine/`).

The table below gives, for the same fixture as run 2 (`+Z, 90`), the share of each failed region the reach search
covers, the tools, and the main tool directions (A tilt / C azimuth). Directions use `sim5.frame_angles` conventions.

| Region | Type, area | Faces | Reached in `+Z,90` | Tools | Main directions | Why run 2 missed it |
|---|---|---|---|---|---|---|
| R1 | proud 8,424 mm² | bottom face 213 (plane), Ø7 bores 147/148, Ø10 counterbores | 64 % | T11 29 %, T13 18 %, T4 10 % | A90 (sides) 34 %, A0 12 % | the underside was left ~0.3 mm proud (no finishing pass in the part-off); the bores were reached from the top only to ~45 mm (T2/T3 stick-out); the bottom counterbores face the stub (the 36 % not reached here, reachable in `+X,0`) |
| R2 | proud 618 mm² | Ø5.5 blind hole (face 175 + drill-point cone) | 86 % | T13 43 %, T11 35 % | A90/C90 (from the +Y end) 73 % | 36 mm deep from the end face: no library tool longer than 30 mm fits Ø5.5 |
| R3 | proud 468 mm² | second Ø5.5 blind hole (faces 177, 176) | 92 % | T13 37 %, T11 24 %, T4 24 % | A90/C90 80 % | same |
| R4 | proud 64 mm² | B-spline blend, r6/r8 | 97 % | T4 80 % | A90/C180, A90/C−135 | finish left +0.3 mm (stepover / ball radius) |
| R5 | proud 45 mm² | r1 corner fillets (faces 71, 89) | 96 % | T13 86 % | A90/C180 | r1 corners need a ≤ 2 mm tool at depth |
| R6–R9 | proud 19–20 mm² each | Ø2.5 cross holes (r1.25, axis X) | 92–98 % | T13 73–95 % | A90/C0 | no pass; they need a Ø2 tool from the side |
| R10–R12 | proud 16–19 mm² | r1 fillets, plane 24 | 93–95 % | T13 / T4 | A90/C−135, A90/C180 | +0.12 mm left: just out of tolerance |
| R13–R16 | proud 10–11 mm² | r2 ball-ended slots (spheres 150–154) | 90–100 % | T13, T14, T11 | A90/C−45, A90/C0 | +0.3 mm left at the ball ends |
| R17–R30 | proud 1–4 mm² each | tori, r1/r2 cylinders | 50–100 % | T13, T11, T4 | A90 | small leftovers |

**Conclusion for the showcase run.**
- **In `+Z, 90`**, every failed region of run 2 except the bottom counterbores (and the lowest part of the Ø7 bores) has
  a tool and direction in the frozen library. A program can reach about 97 % there.
- **In `+X, 0`**, the search finds the whole surface except 0.4 %.

Which orientation to use is the machining agent's decision. `fixture-suggest` now ranks orientations by whole-surface
coverage with the frozen library, and the skill explains why the face towards the stub must have nothing opening
downwards. The harness gives no hint about which orientation to pick for FTC-10 specifically.

## Tools added (R4), with the evidence
Probes that the library missed and the added tools reached, in `+X, 0`: 3,258 mm². They are attributed to the first
tool that reached them in the search order.

| Tool | Geometry (cutter / neck / shank / stick-out / holder) | Gained | Catalogue family | Cutting data |
|---|---|---|---|---|
| T11 4 mm 2-flute long-neck flat | Ø4, flute 6 / neck Ø3.8 to 40 mm / Ø6 shank / 55 mm / Ø22 shrink-fit | 1,911 mm² | NS Tool MHR230 long-neck square, Widin WE514 4 × 40 | 0.012 mm/t (≈ ½ of 1×D catalogue) |
| T13 2 mm ball long-neck | R1, flute 2 / neck Ø1.9 to 20 / Ø4 shank / 35 / Ø16 | 1,237 mm² | NS Tool MHR230 / MRBLN230 R1 × 20 | 0.006 mm/t |
| T12 6 mm 3-flute long-reach flat | Ø6, flute 12 / neck Ø5.7 to 50 / Ø6 shank / 60 / Ø22 | 86 mm² | Garant 202247 long reach, MISUMI long-neck aluminium | 0.02 mm/t |
| T14 3 mm ball long-neck | R1.5, flute 3 / neck Ø2.85 to 30 / Ø6 shank / 50 / Ø22 | 24 mm² | NS Tool MRBLN230-6 | 0.01 mm/t |

T12 and T14 carry little exclusive evidence: their gains overlap T11/T13 in the search order. They are added because:
- a Ø6 long-reach cutter is the productive choice for the Ø7 bores (T11 is Ø4);
- a 3 mm long-neck ball is the standard tool for deep 3D blends.

They change no rule, and no area is excused by them.

The simulator models each one exactly:
- the cutting profile is the plain flat or ball profile, so the MillBill cross-check covers it;
- material above the neck length and within the shank radius is a crash (flag 32);
- the vise/table check uses exact discs for the neck, shank and holder.

Tests: `tests/test_tools_refine.py`.

## Reproduce
```bash
python tools/reach_audit.py parts/incoming/nist/nist_ftc_10_asme1_rb.stp --tools library  --out runs/audit/ftc10
python tools/reach_audit.py parts/incoming/nist/nist_ftc_10_asme1_rb.stp --tools extended --orient "+X:0,-X:0" --out runs/audit/ftc10_ext2
```
