# Next task: complex parts on a 3+2 (indexed 5-axis) machine — what is needed

_Status: plan only. Nothing here is implemented yet. Answers to the open questions are recorded at the bottom._

## Why the current harness does not stretch to it
- **Material model.** Today's material is one height field seen from +Z. With 3+2, every setup cuts from a different
  direction, so the remaining material is no longer a height field.
- **Viewer.** The viewer renders and animates that single height field.
- **Dialect.** The dialect has no rotary axes or tilted work planes.
- **Score exclusions.** Undercut and tool-limited are defined for +Z only.

## Design

### 1. Material model and metric (exact, extends cleanly)
- In setup k (tool axis = +Z of frame k), each move removes the region above its swept profile in frame k.
- Remaining material is therefore: `stock ∩ ⋂_k { P : z_k(P) < H_k(x_k(P), y_k(P)) }`, where `H_k` is the exact
  column height of setup k's moves in frame k.
- This is MillBill's own multi-setup formulation, so the MillBill cross-check carries over unchanged.
- The current kernels (`zcut`, `column_heights`) are reused per frame. Only frame transforms are added.
- Stock can stay a box, or be a cylinder for round parts such as impellers (exact inside test).

### 2. Collision and crash checks
- These need the material state left by the earlier setups.
- **Per setup:** keep an exact point-query workpiece for the earlier setups, and a dexel grid in the current frame.
- **Holder / shank / rapid tests:** sample the tool body (cylinders) against `inside()` of the earlier setups and
  the current grid.
- **Fixture:** add the workholding (pedestal / dovetail, table) as a solid. The tool and holder must clear it in every
  orientation.
- **Machine:** add rotary-axis travel limits.

### 3. Kinematics and dialect (to confirm)
- **Default proposal:** a trunnion table (A tilt ±110°, C continuous) with a tilted-work-plane cycle.
- **Option A (proposed): Fanuc-style.** `G68.2 X Y Z I J K` (Euler ZXZ) with `G53.1`. The LLM then programs plain
  3-axis XYZ in the tilted frame, with `G69` to cancel. This is closest to how 3+2 is programmed in industry, and the
  LLM reuses everything it does today.
- **Option B: explicit rotary indexing.** `G0 A.. C..` with the LLM computing XYZ in machine coordinates. This is
  harder for the LLM, more error-prone, and a better test of its maths.
- **Indexing safety:** indexing is allowed only at the safe retract height. Any motion during indexing is checked
  for a swept collision.

### 4. Accessibility, exclusions and the score
- For candidate tool directions (a hemisphere sample, plus the axes the LLM chooses), compute which surface points
  each library tool can reach without the tool or holder hitting the target.
- **reachable_3+2:** the point is reachable from at least one direction.
- **Score:** the share of reachable_3+2 surface within tolerance. Report separately:
  - "needs simultaneous 5-axis or a different tool";
  - "hidden by the fixture".
- **Brief:** give the LLM an accessibility summary: which directions reach which faces, plus images.
- The LLM still chooses the setups.

### 5. Viewer
- Within setup k: render the current setup's height field as today, in frame k.
- Render the earlier setups' surface as a mesh, clipped in the shader by the current height field.
- Cut faces of the current height field are clipped by an occupancy / SDF 3D texture of the earlier state.
- Between setups: animate the trunnion rotation (part plus fixture rotating), so the reader sees each index.
- **Python:** precompute the per-setup state mesh with marching cubes on the exact `inside()`.

### 6. Tools
- Longer-reach and tapered ball mills are typical for impellers (for example 3 mm and 2 mm tapered ball, 40–50 mm
  reach).
- Possibly a lollipop cutter.
- Holder geometry becomes important.

### 7. Parts
- **Real parts need STEP files from you.** GrabCAD needs a login, and from this sandbox only GitHub is reachable.
  NIST, HuggingFace, Thingiverse and TraceParts are blocked by the proxy.
- **Drop zone:** put files in `parts/incoming/<name>/part.step` (or upload them to the session). They go through
  `cncllm init-part`.
- **Fallback:** a parametric impeller in CadQuery with true twisted B-spline blades, and GitHub-hosted CAD libraries.
- **Held-out validation:** keep at least one part unseen, as before.

## Effort estimate (agent time)
| Work | Estimate |
|---|---|
| Multi-frame simulator, metric, cross-check | half a day |
| Accessibility analysis and brief | half a day |
| Dialect and kinematics | a few hours |
| Viewer upgrade | the largest piece, about a day |
| LLM runs | about 150–250k tokens per part (more setups, more iterations) |

Start after the usage limit resets.

## Open questions → answers (2026-11-20)
- **Parts:** a real impeller is probably too complex and not the right target. Use recognised 3+2 / 5-axis
  benchmark or training parts instead; the user downloads the STEP files (candidates below).
- **Dialect:** the Fanuc-style tilted work plane, `G68.2 X Y Z I J K` + `G53.1`, cancelled with `G69`.
- **Workholding:** a single fixture, a 5-axis vise.
  - The part must stay rigidly connected to the vise-held stock until the end.
  - The program finishes with a part-off op that removes most of the connection. It leaves small tabs or a thin web
    the operator can break or saw by hand outside the machine.
  - Where to fixture (part orientation in the stock, stub location) is chosen from the geometry.
- **Eval:** left to the agent (design below).

## Fixturing and part-off design
- **Stock:** a box or round bar with extra length below the part, giving a grip stub of 6–10 mm in the vise jaws plus
  a clearance gap so the tool and holder clear the jaws.
- **Choosing the fixture:** the LLM proposes the part orientation and the grip side in a `fixture.json`. The harness
  scores the proposal for:
  - reachable surface over the candidate 3+2 directions;
  - jaw and holder clearance;
  - the stub cross-section left after all ops.
- **Placement tool:** the harness also offers a `cncllm fixture-suggest` that ranks orientations by reachable surface
  and stub size, so the LLM can start from a good placement.
- **Rigidity:** after each op, compute the minimum material cross-section linking the part to the gripped stub, and
  its slenderness. If it falls below a threshold, while cutting continues on the part side, that is an error ("part
  flexes / chatters").
- **Part-off op:** must leave a web or tabs of at most about 1 mm and at most about 15 % of the original connection
  area. Their location is reported for the operator (it must sit on a non-critical face).
- **Score:** web and tab material on the declared parting face is excluded, like the datum face today. Everything
  else is scored.

## Evaluation design (proposed)
1. **Headline:** the share of the **3+2-reachable** surface within ±0.1 mm. Reachable means some library tool
   reaches the point from some direction within the A ±110° tilt range, without the tool or holder hitting the
   part, stock, vise or table.
2. **Also reported:** a whole-surface score, and the area that needs simultaneous 5-axis or a smaller tool.
3. **Validity (pass/fail):**
   - no crash, including the vise, the table and the indexing sweeps;
   - rigid connection maintained;
   - part-off leaves the specified web or tabs;
   - cutting-data checks as today.
4. **Machinist review agent** on the final program and fixture plan, as before.

## Parts found and committed: NIST MBE PMI test models (public domain)
11 STEP models are in `parts/incoming/nist/`; see its README for the assessment.

Proposed set (3+2 from aluminium billet, scaled to fit a desktop 5-axis machine of about 200 mm):
- **development:** ftc_10 (native size), ftc_06 (×0.5), ftc_08 (×0.5), ctc_01 (×0.15)
- **validation (held out):** ctc_04 (×0.2), plus the Autodesk Fusion 3+2 tutorial part if the user downloads it

## Other candidates (the user would need to download them)
| Part | Why | Where |
|---|---|---|
| UNSW Making "Haas 5-axis 3+2 induction" part | Real 3+2 training part with re-registration slots. The download folder includes vise and holder models plus the UMC-350 machine (check the file format). | https://www.making.unsw.edu.au/learn/haas-5-axis-32-induction/ |
| Autodesk Fusion "3+2 machining" tutorial part | Two features on tilted planes in one setup; a clean first 3+2 case. | https://help.autodesk.com/cloudhelp/ENU/Fusion-CAM/files/GUIDE3719BFB-5D75-46B6-9161-11A560C2D884.htm |
| Cal Poly 5-axis demo part (thesis) | Designed for an indexed-machining course (Haas). Geometry is in the thesis; the CAD may need to be requested or remodelled. | https://core.ac.uk/download/77510587.pdf |
| GrabCAD "5 axis" / "3+2" demo parts | Many community demo parts (pick 2–3 non-trivial ones with angled holes, pockets and chamfers on several faces). | grabcad.com library search "5 axis demo part", "3+2" |
| NAS 979 cone frustum / NIST truncated square pyramid | Accuracy artifacts; geometry is simple to model ourselves; simultaneous-5-axis oriented, so a secondary choice. | https://www.nist.gov/node/594146 |
| ISO 10791-7 S-shaped test piece | Simultaneous flank milling; not a 3+2 target. Skip unless simultaneous 5-axis is added later. | https://www.iso.org/standard/73814.html |
| Zenodo 10 multi-feature models | Single-setup 3-axis benchmark; useful to check the current harness on third-party parts. | https://zenodo.org/records/17035762 |

**Suggested set:**
- development: the Autodesk 3+2 tutorial part, the UNSW part, and one or two GrabCAD demo parts;
- validation: one GrabCAD demo part kept unseen.

**Drop zone:** put files in `parts/incoming/<name>/` (STEP plus any drawing), commit or upload them to the
session, and say which are held out.
