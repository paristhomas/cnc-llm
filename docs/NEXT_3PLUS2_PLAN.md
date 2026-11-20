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

## Open questions → answers
(recorded below once answered)
