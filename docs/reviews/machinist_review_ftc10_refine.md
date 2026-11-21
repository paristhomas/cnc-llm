# Machinist review: FTC-10 3+2 refine run (`runs/ftc10/20261121-012221-refine`)

Reviewer: fresh agent acting as CNC machinist / CAM programmer. I did not write this program. Date: 2026-11-21.

**Program reviewed:** `final/program.nc`
- 124,683 lines, 8 G68.2 setups (5 orientations), 48 tool changes.
- Simulator: VALID, 99.866 % of the surface in tolerance, cycle time 90.8 min.

**Verdict: RUN WITH MINOR EDITS.** The edits are listed in section 8.
- Indexing depends on the brief machine's automatic retract at G53.1/G69. Confirm this on the real control before running (see 5).
- I found no likely tool breakage or part release. The workholding and the part-off order are marginal: run the first article with the precautions in section 8.

## How the numbers were obtained
- **G-code statistics.** My own parser and my own voxel removal model, independent of the harness:
  - grid of 0.25 mm over the stock box;
  - real tool profiles (flat, ball, bull, drill point), swept along every G1/G2/G3 in its G68.2 frame;
  - scripts in `/home/paris/review_machinist/` (`ana.py`, `ana2.py`, `rep.py`, `rep2.py`, `arcs.py`, `m5.py`, `vol.py`).
- **Cross-check against the harness per-tool data** (`final/viewer_data/meta.json`, `per_tool`). My model agrees within a few percent:

  | Tool | Removed: my model | Removed: harness | Time: my model | Time: harness |
  |---|---|---|---|---|
  | T1 | 280.3 cm³ | 291.0 cm³ | 19.4 min | 20.0 min |
  | T7 | 0.77 cm³ | 0.81 cm³ | 16.8 min | 17.2 min |
  | T11 | 0.69 cm³ | 0.65 cm³ | – | – |
  | T12 | 4.14 cm³ | 4.29 cm³ | – | – |
  | T14 | 0.30 cm³ | 0.32 cm³ | 11.2 min | 11.7 min |

- **Part data** from `brief/part.stl`: 188.3 cm³, 0.51 kg, centroid at Z 84.

## 1. Feeds vs chip load

**Programmed chip load.** F/(flutes·S) was computed for every cutting move (121,226 moves).

| Tool | Library mm/t | Max programmed | Max / library | Time-weighted mean | Cutting time > 1.3× |
|---|---|---|---|---|---|
| T1 | 0.06 | 0.060 | 1.00 | 0.040 | 0 % |
| T2 | 0.04 | 0.040 | 1.00 | 0.023 | 0 % |
| T3 | 0.02 | 0.020 | 1.00 | 0.016 | 0 % |
| T4 | 0.01 | 0.010 | 1.00 | 0.009 | 0 % |
| T5 | 0.05 | 0.050 | 1.00 | 0.037 | 0 % |
| T6 | 0.03 | 0.030 | 1.00 | 0.027 | 0 % |
| T7 | 0.02 | 0.020 | 1.00 | 0.017 | 0 % |
| T10 | 0.06 | 0.060 | 1.00 | 0.060 | 0 % |
| T11 | 0.012 | 0.012 | 1.00 | 0.010 | 0 % |
| T12 | 0.02 | 0.020 | 1.00 | 0.020 | 0 % |
| T13 | 0.006 | 0.006 | 1.00 | 0.006 | 0 % |
| T14 | 0.01 | 0.010 | 1.00 | 0.007 | 0 % |

- No move exceeds the library chip load. By the checklist formula this item **passes**.

**Defect: feed on internal arcs.** Every helical hole is programmed with F at the tool centre, so the cutting edge at the hole wall runs faster by (R_path + r)/R_path. The edge chip load is then:

| Line(s) | Operation | Path R / tool r | Edge chip load |
|---|---|---|---|
| 72065… | T2 top-ear counterbores, `I-2 F2880` | 2 / 3 | 0.10 mm/t, **2.5×** |
| 20926, 100073… | T3 6 mm ear holes, `I-1.5 F960` | 1.5 / 1.5 | **2.0×** |
| 70177… | T4 2.46 mm holes, `I-0.48 F480` | 0.48 / 0.75 | **2.6×**, 3.25 min of cutting |
| 6765–6963 | T11 5.5 mm axial holes, `I-0.75 F576` | 0.75 / 2 | 0.044 mm/t, **3.7×** |
| 93632… | T12 7 mm cross holes, `I-0.5 F1440`, 1 mm pitch | 0.5 / 3 | **~7×** |

- The T11 holes are cut with the tool at a 51 mm gauge length (see 2).
- The T12 path radius is so small that the cut behaves like a plunge, but the side still cuts a 1 mm radial wall 37 mm deep.
- The forces are small: T11 is about 1–2 N at 1.2 cm³/min.
- Even so, a CAM system would reduce these feeds. Proposed values are edit 3.

## 2. Stick-out and reach

**Method.**
- The required gauge length is the height of the highest remaining material within the holder radius + 0.5 mm, above the tool tip.
- It was sampled on every 15th cutting move, with the material state at that moment.
- `ap` is the axial engagement of material actually removed, on non-plunge feed moves.

| Tool | D | Library stick-out | Max gauge needed (line) | Max gauge / D | Cutting time with gauge > 4D | Max ap (p99) |
|---|---|---|---|---|---|---|
| T1 | 10 | 40 | 25.6 (103070) | 2.6 | 0 % | 6.4 (2.9) |
| T2 | 6 | 30 | 27.9 (105797) | 4.7 | 5 % | 6.4 |
| T3 | 3 | 22 | 19.8 (19744, pocket walls) | **6.6** | 1 % | 4.9 (2.7) |
| T4 | 1.5 | 14 | 12.1 (70371, 2.46 mm holes) | **8.1** | **51 %** | 0.3 (p95) |
| T5 | 8 | 35 | 25.9 (104278) | 3.2 | 0 % | 17.9, wall finish, ae ≈ 0.25 |
| T6 | 6 | 32 | 9.5 | 1.6 | 0 % | 4.7 |
| T7 | 3 ball | 22 | 19.9 (21420, pocket floor fillets) | **6.6** | **46 %** | 2.2 |
| T10 | 5 drill | 40 | 37.4 (93619, cross holes) | 7.5 | 67 % | pecks of 4 mm, full retract |
| T11 | 4 long-neck | 55 | 51.3 (6927) | **12.8** | 100 % | 0.7 |
| T12 | 6 long-reach | 60 | 35.7 (93729) | **6.0** | 53 % | 1.9 |
| T13 | 2 ball long-neck | 35 | 20.1 (26825) | **10** | 16 % | 1.0, full ball radius in R1 fillets |
| T14 | 3 ball long-neck | 50 | 27.3 (108499) | **9.1** | 78 % | 1.9 |

**Standard tools beyond 4×D.**
- **T3** (6.6D) finishes the 17 mm pocket walls with ap up to 4.9 mm at ae ≈ 1 mm (line 17328: 4.7 mm² cross-section at 4.9 mm ap). Expect wall taper and chatter. Use 2–3 axial steps and a spring pass.
- **T4** (8D) is fragile. Its light ap (p95 0.3 mm) is acceptable, but its arcs run at 2.6× edge chip load (section 1).
- **T7** at 6.6D is finishing only, which is acceptable.

**Long-neck tools.**
- **T13 and T14** are used for light finishing only:
  - T13 removes 0.20 cm³ in 8.0 min;
  - T14 removes 0.30 cm³ in 11.2 min;
  - maximum material removal rate is ≤ 3.3 cm³/min.

  T13 runs with the full ball radius engaged in R1 fillets at 10D. Chatter marks are likely, but these surfaces are small.
- **T11 is not used for light cuts only.**
  - T10 pre-drills only to G54 Z119.5 (lines 6708–6760, frame Z99.5 + 20). Its 32 mm holder would otherwise hit the top ears.
  - T11 then bores from solid by helical interpolation (lines 6765–6963):
    - hole 175 from Z119.5 down to ~Z106, about 13 mm;
    - hole 177 for about 5.5 mm.
  - This happens at 12.8D gauge, 0.4 mm pitch, and 3.7× edge chip load. The neck is 3.8 mm in a 5.5 mm hole, which leaves 0.85 mm of chip space.
  - The forces are tiny. The risk is chip packing in a 35 mm blind hole.
- **T12** opens 5 → 7 mm (1 mm radial wall) at 6D in one 1 mm-pitch helix per side. That is more than "light" for a necked 6 mm tool.

## 3. Workholding

**Clamping.**
- Stock is 37 (X) × 81 (Y) × 195.5 mm. It is gripped 12 mm deep on its ±Y faces, so each jaw contact patch is only **37 × 12 mm**.
- The top of the stock is **183.5 mm above the jaws**, a 15 : 1 ratio of overhang to grip.
- The stock bottom (Z-36) sits 2 mm above the vise body (Z-38) per `setup.json`. Nothing under it takes axial load.

**Slip.**
- Load case: T1 roughing at the top (setup 1). The 99th-percentile cross-section is 29.9 mm² at F3240, which gives ≈ 97 cm³/min, ≈ 0.5 kW, and ≈ 50 N tangential (≈ 70 N resultant).
- That load acts ≈ 180 mm above mid-grip, which gives **≈ 12.6 N·m**.
- Resistance: friction torque in the jaw plane (forces along X) is about 2 × 0.2 × 10 kN × ≈10 mm ≈ 40 N·m at a moderate 10 kN clamp force.
- The safety factor is about 3. That is acceptable, but only with a properly torqued vise and serrated or clean jaws.

**Chatter.**
- The first bending mode of the stock as a cantilever, with an ideal clamp, is **≈ 900 Hz** for bending in X (37 mm direction): EI = 23.6 kN·m², 8.1 kg/m, L = 183.5 mm.
- T1 at 18,000 rpm × 3 flutes has a **tooth-passing frequency of exactly 900 Hz**.
- A 12 mm grip makes the mode softer, and removing material shifts it. Even so, the top-of-part roughing (setup 1, and the upper Z range in setups 2 and 3) runs near resonance.
- This is the main chatter risk in the job.

**Rigidity during setups 1–5.** The stub stays at 100 % (`final/setups.json`). Keeping the block below the body (Z0–16.5) until the part-off is good practice.

**Orientation (+X up).**
- `work/plan.md` justifies it from the geometry: all hole axes are horizontal or point up, and `fixture-suggest` gives 99.5 %.
- I agree that it is the best single-clamp orientation.
- The price is a tall, slim part on a short grip. In a real shop this would be two operations in soft jaws.
- Within the single-clamp rule, a 20 mm grip would cost 8 mm more stock and would substantially stiffen the clamp and raise its moment capacity.

## 4. Air cutting

| Measure | Share of cutting time (85.5 min of motion) |
|---|---|
| Moves that remove no 0.25 mm voxel (`vol == 0`, the checklist definition) | **45.0 %** (70.7 % of moves) |
| Moves where the tool, enlarged by 0.3 mm, touches no material at all (true air) | **4.8 %** (4.1 min) |

- The checklist threshold is 40 % for `vol == 0`. That threshold is **nominally exceeded**.
- The gap between 45 % and 4.8 % comes from finishing skims thinner than the voxel and from repeated passes over finished surfaces. It is not air.

| Tool | `vol == 0` time | True air time |
|---|---|---|
| T1 | 26.7 % | 9.0 % |
| T2 | 41 % | 15 % |
| T3 | 55 % | 7 % |
| T7 | 81 % | 2.4 % |
| T13 | 45 % | 9 % |
| T14 | 59 % | 0 % |

- **Largest true-air blocks** are T1 ramp loops around the outside of setup 3 (43242–46364): 120 mm moves at F1080, 6.7 s each, about 1 min in total.
- **Real cost of finishing:** T7, T13 and T14 together run for **36 min (42 % of cutting time)** to remove 1.27 cm³. That is how the 99.87 % score is reached. A shop would accept it for a NIST test part, but it is the main lever on cycle time.

## 5. Safe indexing and tool changes

**Indexing.**
- All 8 `G69` are immediately preceded by `M5` (lines 6965, 27128, 90743, 96630, 99969, 100127, 111188, 124679).
- Every `G53.1` is followed by `T M6`, `G43 H`, `S M3` before any feed move.
- My parser counts **0 cutting moves with the spindle off**.
- **Retract before indexing: safe in the dialect only.**
  - The last move before each `G69` is a frame-Z retract to only 25 mm in the ±X frames (6.5 mm above the stock face) or 46 mm in the ±Y frames.
  - The program relies on the brief's rule that G53.1/G69 retract to frame Z150. The brief's machine does this.
  - Many real controls rotate the table in place on the tilted-plane command and leave the retract to the program or the post. This is from my experience, not verified for a specific control (Siemens uses CYCLE800 instead).
  - The stock top swings on a radius of ≈ 165 mm about the G54 origin, and more about a real A pivot below the platter.
  - On a control that does not retract, **the table would index into the tool**. Confirm the target control's behaviour. If it rotates in place, the post must insert `G53 Z0` or the machine's safe-retract before every `G69`/`G53.1` (edit 1). The dialect forbids G53, so this has to be done outside the program.

**No retract before M5.** Six tool changes go `G1 …` → `M5` → `T M6` with no retract:
- lines 5892, 46503, 52959, 103202, 103603, 122972;
- at **46502 and 103201** the last move was a cutting move: my model removes 0.54 and 0.86 cm³ on it. I did not test whether the end point is still in contact;
- the spindle stops at or next to the cut, and the M6 Z-retract then pulls a stopped cutter out. That risks a dwell or drag mark;
- fix: insert `G0` axial retract lines before `M5` (edit 2).

**Tool changes.** 48 changes, of which about 6 are avoidable:
- setup 3 loads T2 twice (46504, and 72058 for 24 lines), T13 twice (70781, 84480), and T7 twice (80266, 86382);
- PO-2 loads T2 twice (103203, 105776) and T1 twice (100131, 105801).

## 6. Part-off

### Sequence (marker at line 99966)

1. **PO-1 +X, lines 99971–100127.** T1 faces the bottom-end margin; T3 cuts the bottom ear holes. The stub is still at 100 %.
2. **PO-2 −X, lines 100129–111188.**
   - Removes the block under the body, finishes the end face (T5) and the counterbores (T2).
   - **Slab** with T1 (lines 105805–105825): 5 full-width 10 mm slots, at ap 6.5 / 6.5 / 6.5 / 6.5 / 3.2 mm, from the −X face to G54 X10.7, at Z −10..0. This leaves **627.75 mm² (21 %)**.
   - It then **continues finishing on the opened stub** with T7, T13 and T14 for 10.7 min of cutting (105827–111188).
     - T14 reaches G54 Z −2.2 (line 108129), on the downward-facing lobe rounds (R15, R26, R27). That work needs the opened gap.
     - T7 (min Z 13.6) and T13 (min Z 17.0) stay well above Z0. They could run before the slab.
   - The slab runs 29.2 mm deep with a 25 mm flute: the shank runs 4.2 mm into its own 10 mm slot.
   - **Holder clearance on the Z-10.7 pass:** the Ø32 holder nose is at G54 X-29.3 and spans Z −21..11. That is **3.0 mm** above the jaw top (Z-24) and **0.8 mm** beyond the jaw end (X-28.5).
   - A collision needs both of these at once:
     - a holder nose larger than ≈ Ø38, which loses the Z gap;
     - a stick-out under ≈ 39.2 mm, which loses the X gap.

     Neither one alone collides. A Ø32 nose clears at any stick-out, and an ER32 nut (Ø50) clears at 40 mm. The margins are small, so the shop's real T1 assembly must be checked against them.
3. **PO-3 +X, lines 111190–124680.** This is the return to +X that the programmer admits to.
   - 13,471 moves, 2.5 min of cutting and 9.1 cm³ removed on the 21 % web: T1 bottom-ear outline, T2 notch and lobes, T3, T4 R1 corners.
   - Then the T1 slab from +X to X13.3 (line 124663) leaves a 2.6 mm web (≈ 210 mm²).
   - Then the web is cut through, outer ends first and **middle last** (124666–124678).

### Judgement on the order

**Physical risk of the +X return is low:**
- The 7.8 × 81 mm web is stiff in-plane. It is weak only in rotation about Y: k ≈ 22 kN·m/rad, first mode of the part on the web ≈ 370 Hz.
- That weak direction lines up with the +X tool axis, where the axial forces of T2, T3 and T4 are tens of N.
- Deflection is in microns, because the work is low on the part (Z < 25).

**But too much work runs after the stub is opened:**
- Checklist E6 asks for one pass per side. No order can meet that with a two-sided slab, so +X → −X → +X is the minimum, and the order is not the defect.
- The defect is the amount of work done after the −X slab: 10.7 min in PO-2 and 2.5 min / 9.1 cm³ in PO-3.
- Re-plan (not a line edit):
  - move the PO-3 T1/T2/T3/T4 outline, lobe and corner work into PO-1;
  - move the PO-2 T7/T13 finishing ahead of the −X slab;
  - leave after the slab only T14 (which goes below Z0), the +X slab and the web cut.

  The number of indexes is unchanged.
- Whether the outline can be cut from +X before PO-2 is not verified. The PO-3 entries assume PO-2's clearance, for example `G0 Z9.5` at 111196. The entries must be regenerated and the program **re-simulated**.

### Tabs

- 2 tabs, 11.44 mm² each (22.9 mm² total), 2.6 mm (X) × 4.4 mm (Y), centred at Y = ±28.5 and X 10.7..13.3.
- They sit under the bottom R9 lobes (lobe plate X 8.5..15.5), which is a sensible location. The witness is 0.23 %.
- The tabs are inside the 20–30 mm² review target and all validity limits.

**Holding during the final cut** (A90, part horizontal, gravity along −X, bending in the tabs' weak direction):
- Self-weight moment is 0.51 kg × 9.81 × 84 mm ≈ 0.42 N·m. That gives σ ≈ 42 MPa in the two tabs (Z_el = 2 × 4.96 mm³), a **safety factor ≈ 6.5 to yield**.
- The part sags ≈ 0.75 mm at the top. Its pendulum mode on the tabs is only ≈ 23 Hz, but nothing is cut after the web cut.
- In the final slot, T1 runs at ap 2.6, fz 0.024, ≈ 60 N, mostly in the tabs' strong YZ plane.
- **Part release during the last passes is unlikely.**
- The plunge at 124676 (`G1 Z10.2 F1080`, a full-diameter plunge 2.6 mm into the web next to tab 1) should be a ramp.

**Breaking by hand:**
- The plastic moment of both tabs about Y is ≈ 4.1 N·m. That is **≈ 25 N pushed at the top of the part**: easy, no saw.
- 6061-T6 is ductile, so the tabs will fold before they break. Expect 2–3 bends back and forth, or use flush cutters.

**Tab length.**
- From `setups.json`, `rigidity.partoff.planes`, the section is almost constant over **Z −6.2..0**: 22.9–25.0 mm² for both tabs together. Below that it flares through the R5 ends of the T1 slots (26 mm² at Z-6.7, 57 mm² at Z-9.7) into the full stub at Z-10.2.
- The stub end is reinforced. The break will therefore fall somewhere in a **6 mm band** of nearly constant section, with minima at Z-5.7/-4.7 and at Z-1.2/-0.7.
- In the worst case the break leaves a pin up to ≈ 6 mm long on the lobe, which needs nipping before filing.
- Optional improvement: separate the web near the part with T3 at Z −3..0, or neck the tabs just below Z0, so the break lands at the part face. This needs re-simulation.
- The filing itself is an R9 convex blend over 2 × ~55 mm². That is feasible with a file and some care.

## 7. Cycle time

- **Simulator: 90.8 min.**
- My motion sum is 88.0 min: cutting 85.5 min, rapids 2.5 min. With 8 indexes × 6 s that is 88.8 min. I infer that the simulator counts only about 2 min for 48 tool changes, or none; I did not check its model.
- **Realistic floor-to-floor estimate: ≈ 100–105 min:**
  - 48 chip-to-chip changes × 6–8 s = 5–6 min;
  - 8 real indexes with safe retract ≈ 2 min;
  - 120k short G1 segments, where the controller will not hold F3240 in 0.2–0.5 mm moves: +3–5 %.
- For a one-off NIST test part with this many features at ±0.1 mm, under two hours of spindle time is reasonable. Setup and prove-out will dominate.
- Where the time goes:
  - setup 3 (−X) takes 44 of the 85.5 cutting minutes;
  - ball and long-neck finishing takes 36 min for 1.3 cm³ (section 4);
  - only about 1 min is avoidable tool changes.

## 8. Verdict: RUN WITH MINOR EDITS

**Why not DO NOT RUN:**
- Chip loads match the library.
- There are no spindle-off cuts.
- Long-neck tools are light (except T11, which carries tiny forces).
- The part-off is valid and holds the part with a safety factor of about 6.
- Rigidity stays at 100 % until the part-off.

**Why not RUN AS IS:**
- Indexing safety relies on the brief machine's automatic retract. That must be confirmed on the real control.
- Six tool changes stop the spindle with no retract, two of them right after a cutting move.
- Internal arcs run at 2–7× edge chip load.
- The PO-2 slab has a 0.8 mm / 3 mm holder-to-jaw margin.
- 13 min of work runs on the opened stub.
- Tabs leave pins up to 6 mm long.

### Five most important edits (line edits; no re-plan needed)

1. **Safe retract before every `G69` and `G53.1`, if the control rotates in place.** Lines 6965, 27128, 90743, 96630, 99969, 100127, 111188, 124679.
   - Confirm how the target control handles G68.2/G53.1. If it does not retract, the post must insert `G53 Z0` or the machine's safe-retract.
   - Prove each index in single block with the rapid override at 25 %.
2. **Retract before `M5` at the 6 tool changes that follow a feed move.** Lines 5892, 46503, 52959, 103202, 103603, 122972. Add `G0` along the tool axis to clearance before `M5`.
3. **Arc feed compensation, and T11/T12 loads.**
   - T2 counterbores: F2880 → 1150.
   - T3 ear holes: F960 → 480.
   - T4 holes: F480 → 190.
   - T11 helix (6765–6963): F576 → 160, with pitch 0.4 → 0.2 mm and an air blast.
   - T12 cross holes: F1440 → 200, with pitch 1.0 → 0.3 mm.
4. **T1 top-of-part roughing.** Lines 10–5891 in setup 1, and the high-Z passes of setups 2 and 3.
   - Change S18000 to S15000, with F scaled to keep 0.06 mm/t (F3240 → 2700).
   - This moves the tooth-passing frequency from 900 Hz to 750 Hz, away from the ≈ 900 Hz first bending mode of the stock on a 12 mm grip.
   - Alternatively, prove the spindle speed with a test cut.
5. **Ramp instead of plunge at 124676, and record the PO-2 slab holder limit on the setup sheet.**
   - At 124676, `G1 Z10.2 F1080` is a full-diameter plunge into the web next to tab 1. Replace it with a ramp.
   - Setup sheet: the T1 holder for the slab (105805–105825) needs either a nose ≤ Ø38 or a stick-out ≥ 40 mm. The model gives 3.0 mm / 0.8 mm to the jaw.

### Re-plan items (recommended, need regeneration and re-simulation)
- **Move work off the opened stub.**
  - Move the PO-3 T1/T2/T3/T4 outline, lobe and corner work (111192–124655) and the PO-2 T7/T13 finishing ahead of the −X slab (105805–105825).
  - Only T14, which goes to Z −2.2, the +X slab and the web cut need to come after it.
  - The order stays +X → −X → +X and the number of indexes is unchanged.
- **Tab break location.** Separate near the part (T3 at Z −3..0) or neck the tabs just below Z0, so that no pin of up to 6 mm is left.
- **5.5 mm axial holes.** Drill them deeper, with a longer drill or a slim holder, so that T11 only finishes and never bores from solid.
- **Grip.** Use a 20 mm grip, at the cost of 8 mm more stock.

### First-article precautions
- Take a 20 mm grip if stock allows. Otherwise torque the vise to spec on clean serrated jaws and put a parallel or stop under the stub (the 2 mm gap to the vise body).
- Run the setup 1 and early setup 2/3 T1 roughing at 70–80 % feed. If the top chatters, change T1 to 15,000–16,000 rpm, which moves the tooth-passing frequency off the ≈ 900 Hz bending mode.
- Add flood coolant or air blast: the dialect has no M8, and the slab, slots and blind holes need it.

## Checklist E summary

| Item | Result | Evidence |
|---|---|---|
| E1 feeds vs chip load | PASS (programmed), with a defect on arc edge feed | Section 1; maximum 1.00× on every tool; arcs 2–7× |
| E2 stick-out / reach | PASS with notes | T3 6.6D finishing walls; T11 bores from solid at 12.8D; T12 1 mm wall at 6D |
| E3 grip and stub | MARGINAL | 12 mm grip / 183.5 mm overhang; slip safety factor ≈ 3; chatter at ≈ 900 Hz |
| E4 air cutting | FAIL nominally (45.0 % `vol == 0` > 40 %) / PASS in substance (4.8 % true air) | Section 4 |
| E5 safe indexing | PASS in the dialect; to confirm on the real control (no explicit retract); M5 without retract ×6 | Section 5 |
| E6 part-off | "One pass per side" cannot be met with a two-sided slab (+X → −X → +X is the minimum); 13 min of work on the opened stub. PASS smallest section last; tabs reachable and hand-breakable; pin up to 6 mm | Section 6 |
| E7 verdict | RUN WITH MINOR EDITS | Section 8 |
