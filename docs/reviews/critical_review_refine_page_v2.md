# Critical review v2: report pages after fixes (section C, W1, W2c, W9, W13)

Reviewer: independent page reviewer, re-review. I did not build this work and did not see the builder's summary. I
read the previous page review (`critical_review_refine_page.md`) and checked each FAIL and each defect D1-D14 against
the pages as they are now (FTC-10 report rebuilt at `2e9ebef` with iteration 10; CTC-04 report rebuilt at `9722447`).
Grading inputs: `CRITICAL_REVIEW_CHECKLIST.md` §C, `ACCEPTANCE_REFINE.md` (including the v2/v2.1 addendum: the edge
band is now scored by its neighbours, not excluded), `BRIEF_REFINE_3PLUS2.md` §6.

Pages (opened from `file://`, headless Chromium + SwiftShader WebGL):
- **FTC-10 showcase:** `runs/ftc10/20261121-012221-refine/report/index.html` (99.89 %, iteration 10)
- **CTC-04 x0.2 held-out:** `runs/ctc04_x0p2/20261121-012513-heldout/report/index.html` (99.13 %)

Method:
- My own Playwright script `screens_refine_v2/data/v2.py` (copy of `/home/paris/review_tmp/refine_page_v2/v2.py`),
  one browser at a time. Renders: FTC 1440 light (twice: once with the swings, the self-check and an independent
  kinematics check; once for the result view and part-off), FTC 390 dark, FTC 1440 dark, FTC 390 light, CTC 1440
  light (with swings and checks), CTC 390 dark. That is 6 renders; CTC got 2 of the 4 viewport/scheme combinations.
  Both pages ship the same `viewer5.js`/`report5.css` (same commit), so the CTC light/dark and phone behaviour follows
  FTC's. Raw results are in `screens_refine_v2/data/*_res.json`.
- `close.py`: calls the page's own `focusRegion`, then hides the markers and dollies in 3x, to tell "no failure colour"
  apart from "failure colour hidden by the framing".
- `grep.py`: runs `tools/review_report.py:grep_report` (the forbidden-word grep) over both report folders.
- **I did not run `tools/review_report.py` in full.** It takes 25-50 min on this shared machine, and the targeted
  renders above cover everything it screenshots plus the result-view clicks it does not do.
- Every screenshot cited is in `docs/reviews/screens_refine_v2/`, and I opened each one. The sticky section bar sits
  over some element screenshots of long sections; that comes from the capture, not the page.
- One capture artefact, not a page defect: in my first FTC render, the result-view screenshot timed out because my
  script had pressed "Play the first table move" and left the playback running. The re-render paused playback first.

## Verdict table

| # | Item | Verdict | Evidence |
|---|---|---|---|
| C1 | Machine view default; ≥ 3 re-orientations; `__machineCheck` | **PASS** | **Default mode** is `machine` in all 6 renders. **The page now opens at the end of setup 1, framed on the work, with a "Play the first table move" button** (`ftc_1440_light_sim_default.png`). **Re-orientations, before/mid/after, all opened:** (1) FTC A 0→90 into setup 2: `ftc_1440_light_swing_s2_{before,mid,after}.png`. The cradle, platter, vise and stock tilt together and the tool stays vertical. (2) FTC C 0→−180 into setup 3: `ftc_1440_light_swing_s3_*`. (3) FTC C −90→+90 into setup 5: `ftc_1440_light_swing_s5_*`. (4) CTC C 158→0 into setup 3: `ctc_1440_light_swing_s3_*`. **Real playback via the button:** retract (Z up), then swing A 0→89.99, then playback continues (`ftc_1440_light_res.json` `cta.poses`). **`window.__machineCheck`:** FTC `pass: true`, spindle-direction error 1.6e-16, tool axis in part 3.5e-16, tip vs Part view 4.9e-14 mm, A/C vs setups.json 0°, 641 samples + 35 swing samples. CTC `pass: true`, 3.7e-11 / 6.6e-11 / 6.4e-14 mm, A/C 7e-4° (setups.json rounds C to 158). **My own check** reads `toolObj.matrixWorld` at 320 cutting + 133 swing positions on FTC and 240 + 95 on CTC: max spindle error 1.6e-16 and 3.7e-11. The part-local direction that the part group turns to +Z matches `tool_axis` for every setup (≤ 3.1e-16 FTC, ≤ 1.25e-5 CTC, which is JSON rounding). Displayed A/C match setups.json for every setup. |
| C2 | Machine drawing; DRO; removal visible when tilted | **PASS** | **Drawing:** cradle, trunnion supports, dial platter, vise, stock, stub, part, spindle cartridge and holder are all drawn. The spindle cartridge and nose are now see-through, so they no longer hide the cut (`ftc_1440_light_cut_s3.png`). **DRO:** X Y Z A C, the tool (with ellipsis), the current block and the phase. It updates in play: N70005 T3 → N70491 T4 after 8 s (`tilted.dro0/dro1`). **Removal at A90:** pocket and wave surfaces are visible (`ftc_1440_light_cut_s3.png`, `ftc_1440_light_cut_late.png`, `ftc_1440_light_cta_7.png`). Minor: the phone DRO shows only A, C and the tool, not X Y Z (`ftc_390_light_sim_default.png`). That is a deliberate compact form; the desktop DRO is complete. |
| C3 | Headline = whole-surface score; witness separate and small; no "of reachable" | **PASS** | FTC 99.89 % = `metrics.whole_surface_in_tol_pct` 99.89; CTC 99.13 % = 99.132. Tab witness 0.16 % / 0.15 % (metrics 0.157 / 0.146) is on its own small line. The edge band is described as "scored by its neighbours", which matches the v2.1 addendum and `edge_band_excluded_pct: 0` (`ftc_1440_light_top.png`). No "reachable" wording. **But** the part-off section still says "Only this area **and the edge band** are left out of the score" on both pages (`ftcR_1440_light_partoff_full.png`, `ctc_1440_light_partoff_full.png`, `cncllm/report5.py:566`). That is stale text that contradicts the headline (counted under honesty, D17). Nit: "Not scored: tab witness excluded 0.16% only." reads as if written for the grep allow-list. |
| C4 | Every failed region shows failure colour; witness colour + legend; click explains | **PASS (with a major craft defect)** | **D1 fixed:** clicking R1, the biggest FTC failure (a drill-point cone), now looks straight down the bore, and the cone is plainly orange/red (`ftcR_1440_light_result_R1.png`; phone: `ftc_390_dark_result_R1_section.png`). CTC R1 is shown in orange on the flat face (`ctc_1440_light_result_R1.png`, `ctc_390_dark_result_R1_section.png`). The witness is purple, with a legend (`ftc_close_R4_x3.png`). The card explains the failure: where, why, nearest passes. The six-view 2D map is now shown under the 3D view, not in a collapsed gallery (`ftc_1440_light_result_section.png`). **Still weak:** clicking R2 or R3 (#2 and #3) shows an all-green view. The region is about one marker wide, and the pin sits on it (`ftcR_1440_light_result_R2.png`, `ftcR_1440_light_result_R3.png`). The colour is there: with the markers hidden and the camera 3x closer, both are clearly orange (`ftc_close_R2_x3.png`, `ftc_close_R3_x3.png`). The cause: `focusRegion` sets `dist = ext*1.6 + stage.diag*0.3` (`resultview5.js` focusRegion). For FTC the second term is 64 mm, so every region is viewed from about 74 mm (`ftc_close.json`: 74.05 mm for R2, R3 and R4), whatever its size. I grade the criterion itself as met: the colouring is right and the click explains. The framing problem is scored in C7.4 and listed as D15. |
| C5 | Part-off: tab count, sizes, witness, close-up image | **PASS** | Tab table (2 × 11.44 mm², 2.6 mm, centres), widest section checked at every height, witness 76.33 mm² = 0.16 %, limits (`ftcR_1440_light_partoff_full.png`). **D4 fixed:** a real 3D close-up of the simulated part after the part-off, with per-tab buttons and labels. "All" shows the two necks under the ear lobes with the stub below, which answers "small enough to snap?" by eye (`ftcR_1440_light_tabview_-1.png`, `ftcR_1440_light_tabview_0.png`; CTC `ctc_1440_light_partoff_full.png`). The matplotlib plot is in a fold. **D2 fixed:** each stub-gap section is drawn at the plane its caption names, so the last one shows two dots for 22.88 mm². The 7-plane 22.5 / 35.75 mm² figures are explained ("includes material not connected to the part"). Dark mode is fine (`ftc_1440_dark_partoff_full.png`). The stale "and the edge band" sentence sits in this section (see C3). |
| C6 | 60-second test | **PASS** | From the FTC page alone in 60 s: **part:** "NIST FTC-10 test part", with a picture; **score:** 99.89 %; **valid:** yes; **biggest problems:** R1 13.21 mm² "the conical bottom of a drilled hole", R2 2.72 mm² "a blended / fillet surface and a curved wall … on a side", R3 2.72 mm² "small rounded edge … on the underside"; **holding and part-off:** one vise, 12 mm grip, 2 tabs about 2.6 mm wide that the operator snaps off and files flush. Checked against `metrics.json` (99.89, valid, 2 tabs, 22.88 mm²) and `regions.json` (13.21 / 2.72 / 2.72): all correct. |
| C7 | Craft (1-5; < 4 = FAIL) | **FAIL** | Typography/hierarchy **4** · alignment/spacing **3** · colour/contrast light+dark **3** · 3D legibility **3** · phone layout **4** · honesty **3**. Details and fixes below. |
| C8 | Five best changes; a cheap major one left unfixed = FAIL | **FAIL** | The first sentence a friend reads is visibly broken on the showcase. It has an unclosed parenthesis and a truncated phrase: "(13.21 mm² on the conical bottom of a drilled hole (drill point); 2.72 mm² on a blended / fillet surface and a curved wall (radius 6 mm: a hole). It comes off …" (`ftc_1440_light_top.png`). The cause is `where_words(r).split(",")[0]` at `cncllm/report5.py:1040`, which cuts inside "(radius 6 mm: a hole, bore or round)". The fix is one line. The list is below. |
| C9 | Technical | **PASS** | **file://:** both pages load. **Console:** 0 errors and 0 warnings in every render whose log I kept (FTC 1440 light re-render, 1440 dark, 390 dark, 390 light; CTC 1440 light, 390 dark). The first FTC render was stopped before its console list was saved. **Ready (SwiftShader, shared machine):** viewer ready 2.6-5.0 s; first frame 4.4-5.8 s, and 8.5 s on CTC 1440. All are under the 15 s allowance; "< 5 s on a laptop GPU" cannot be measured here. **G-code:** "Download final program (.nc)" → `gcode/final.nc`, byte-identical to `final/program.nc` on both runs (`cmp`). **Phone:** `scrollWidth` = 390 in all 3 phone renders. |
| W1 | See the +2 axes move the workpiece | **PASS** | As C1. The A tilt carries the cradle, platter, vise and stock (`ftc_1440_light_swing_s2_mid.png`, A 45°). The C turns are visible (`ftc_1440_light_swing_s3_mid.png`, `…s5_mid.png`, `ctc_1440_light_swing_s3_mid.png`). **D5 fixed:** the banner names the axis that moves ("cradle tilts A 0° → 90°", "platter turns C 0° → −180°"), and the camera is framed on the work. In the held-out run every setup is at A90, so that page shows only C turns. That is a property of the program, not a page defect. |
| W2(c) | Wording on the page | **PASS (one item to annotate)** | `grep_report` (`screens_refine_v2/data/grep.py`): CTC 0 forbidden hits; FTC **1 forbidden hit**: `index.html:135` "Deeper axial hole (0.5,25 …): **not reachable by a ball**." That is the agent's iteration-10 note in History (`ftcR_1440_light_history_top_crop.png`). No model identifiers. **My ruling: acceptable.** The brief lets the agent argue this in its own notes. The page puts "Every area counts in every score; the notes are the agent's working comments and do not change any number." at the top of History. The same cone is R1, labelled "failed" in the hero, the summary, the Problems table and the region card, and the reach-search text ends "(the area is scored either way)". **But the owner's own W2(b) grep and `review_report.py` now report it as a forbidden hit on the showcase page.** The previous page had none. A friend scrolling History could read it as an excuse. Fix: annotate such notes in place, e.g. "→ this cone is R1 (13.21 mm²), counted as failed". That is better than allow-listing History. The older notes ("cannot reach that corner" in iteration 5; "no 118-degree tool fits there" in iteration 7) fall under the same disclaimer. **D11 fixed:** "It still counts as failed."; no "stepover / scallop" for mean leftovers above 0.5 mm (CTC R1 +2.55 mm now reads "the pass stops short of it, the tool cannot form this shape, or the feature was not machined"); R1's hint no longer contradicts itself. |
| W9 | Good enough to show a friend? (owner's call) | **Owner's call. My opinion: nearly; fix three things first.** | The Machine view is now genuinely showable. It opens on the work with one obvious button, the swing names the moving axis, and the cut is visible through the see-through spindle. The page has a human title, a picture, a plain summary and a real tab close-up. Before showing it: (1) fix the broken first sentence (C8); (2) make clicked small regions visible (D15/D16); (3) stop the dark-mode white slabs (D18). About half a day of work. |
| W13 | Cycle ≤ 86 min or a reason; viewer < 5 s and works on a phone; a non-machinist understands it in 60 s | **PASS (marginal)** | **Cycle time:** FTC 117.6 min against the 86 min baseline. A reason is on the page, but only in History: the iteration-9 card says "Cycle time +25.2 min against iteration 8 (score unchanged): POST-REVIEW REVISION 1 (addresses the machinist review …)", and the note under it lists the retracts to beyond the sweep radius before every index, the lower T1 rpm and the feed corrections (`ftcR_1440_light_history_top_crop.png`). Nothing near the headline mentions the 86 min baseline or the reason ("about 118 min" only). The callout box itself is weak (D12). **Load and phone:** within the SwiftShader allowance; no horizontal scroll; the region card now sits under the canvas on phones (`ftc_390_dark_result_R1_section.png`). **60 s:** passes now (C6). |

### C7 craft scores, with screenshots and fixes

1. **Typography and hierarchy: 4 (PASS).**
   - Big gains. The title is "NIST FTC-10 test part" and the run ID has moved to the eyebrow. A plain summary comes
     first. The facts follow the score. The technical paragraph is boxed below (`ftc_1440_light_top.png`).
   - It loses a point for three things: the broken first sentence (C8); the technical paragraph, still about 170 words
     of jargon (acceptable now that a plain summary precedes it); and the browser `<title>`, still
     "ftc10 · 3+2 CNC run report".

2. **Alignment and spacing: 3 (FAIL).**
   - **Region labels.** The old overlaps (D7) are gone. The new de-collision pushes each colliding label straight down
     by 23 px, up to 8 times, with no leader line. Labels now hang away from their regions in vertical chains.
     R7/R8/R10/R12 float in empty space under the part; R4/R5/R6 form a column (`ftc_1440_light_result_section.png`,
     `ftc_390_dark_result_section.png`).
   - **Setup strip (D8).** The chips have an ellipsis now, but 7 of 8 are still cut ("1 A0 …", "4 A90 …", "6", "8"),
     so they are unreadable (`ftc_1440_light_sim_section.png`; `res.json overflow`: every `sb-l` overflows).
   - **Phone part-off table.** At 390 px the "Centre X, Y, Z" column is cut off inside its box
     (`ftc_390_dark_partoff_full.png`).
   - *Fix:* draw a short leader line from each moved label to its anchor, or merge labels within ~30 px into "R4·R5·R6".
     Give strip chips a minimum width that fits "A90 C-180", and drop the tool list from the chip into a tooltip.
     Wrap the tab table or stack it on phones.

3. **Colour and contrast, light and dark: 3 (FAIL).**
   - The page UI and the part-off section now theme well (`ftc_1440_dark_partoff_full.png`).
   - **The white slab has moved instead of going away (D9).** The six-view deviation map is now shown by default, and
     in dark mode it is a white block about 1150 px tall that dominates the Result section
     (`ftc_1440_dark_result_section.png`). At 390 px it is also unreadable: axis text about 2 px high
     (`ftc_390_dark_result_section.png`).
   - The hero picture is the engineering figure, white on dark, with the title
     "ftc10 in the fixture frame (G54): Z0 = bottom of the part …" in tiny type and about 60 % white margin
     (`ftc_1440_dark_top.png`, `ftc_390_dark_top.png`).
   - The reach-hint legend is still clipped ("(still scored" cut off).
   - *Fix:* render both figures with a transparent background and theme-aware ink, or ship a dark variant through
     `<picture>` with `prefers-color-scheme`. Cap the deviation map at about 760 px wide, show only the top and
     underside views by default, and put the full six views behind the click. For the hero, crop to the single
     back-left view without a title. Better still, use a snapshot of the result view.

4. **3D scene legibility: 3 (FAIL).**
   - **Machine view: 4-5.** It is framed on the work, the spindle is see-through, A/C are readable and removal shows
     at A90 (`ftc_1440_light_swing_s5_after.png`, `ftc_1440_light_cut_s3.png`).
   - **Result view: 2-3.**
     - (a) Clicked small regions are framed from a fixed ~74 mm, and the pin covers them: R2 and R3 look all green
       (`ftcR_1440_light_result_R2.png`, `ftcR_1440_light_result_R3.png`, against `ftc_close_R2_x3.png`,
       `ftc_close_R3_x3.png`).
     - (b) Labels of regions on the far side of the part are drawn over the visible faces. In the R1 view (looking
       down at the top), R3, R4, R5, R6 and R7, which are underside regions 100 mm away, sit on the top face next to
       R1 (`ftcR_1440_light_result_R1.png`; also in the Top preset, `ftcR_1440_light_result_preset_top.png`).
       `placeMarkers` hides only labels behind the camera plane, not occluded ones.
     - (c) The region card and its pin persist across presets. The "Tabs" preset shows the machined part with R2's
       card still open (`ftcR_1440_light_result_preset_tabs.png`, `…preset_under.png`).
   - *Fix:* set `dist` from the region size (for example `max(ext*5, 15 mm)`), and draw the focused region as a ring
     outline beside it rather than as a pin on top. Raycast each marker against the target and hide or dim the
     occluded ones. Close the card when a preset or mode button is pressed.

5. **Phone layout: 4 (PASS).**
   - No horizontal scroll at 390.
   - The compact DRO no longer covers the spindle, and the status chip is gone (`ftc_390_light_sim_default.png`,
     `ftc_390_dark_sim_section.png`).
   - The region card sits under the canvas (`ftc_390_dark_result_R1_section.png`).
   - The score is now in the first screen, below the picture (`ftc_390_dark_top.png`).
   - Remaining nits: the unreadable deviation map and the clipped tab table (items 2 and 3), and 12 labels chained
     over the part.

6. **Honesty: 3 (FAIL).** The numbers are honest and every failure is called a failure, but the text overstates or
   contradicts in four places.
   - **"Mostly a little extra metal".** The hero says this whatever the size. On CTC it introduces 42.27 and
     33.75 mm² areas left up to **+5.00 mm** proud, out of 355 mm² proud in total (`ctc_1440_light_top.png`,
     `ctc_390_dark_top.png`). On FTC, the two areas it names are 30 % of the 53.41 mm² proud, but the sentence reads
     as if they were most of it (`report5.py:1042`).
   - **Edge band contradiction.** The part-off text says the edge band is left out of the score; the headline says
     it is scored (D17).
   - **Regions vs proud area (D13, not fixed).** The Problems table totals 44.67 mm² against 53.41 mm² proud on FTC,
     and 315.69 against 355.16 mm² on CTC. The page does not say that small regions are not listed.
   - **Cycle-time callout (D12, partly fixed).** The callout is just the first 160 characters of the agent's note
     (`report5.py:788`). Iteration 3's stops mid-word ("every raster point is now che"); iteration 9's stops at a
     file path, so neither states a reason (`ftcR_1440_light_history_iter3-4_crop.png`,
     `ftcR_1440_light_history_top_crop.png`). The callout then repeats the note's own first line underneath.
   - *Fix:* use "a little" only when `max_proud_mm` ≤ 0.5, otherwise "extra metal, up to 5 mm in places". Say "the
     largest are …". Delete "and the edge band" in `report5.py:566`. Add "N smaller regions (8.7 mm²) are not listed"
     under the table. Write the cycle-time reason as a sentence, cut at a word or sentence boundary, and do not repeat
     it in the note.

## Status of the previous FAILs and defects

| Previous | Now | Evidence |
|---|---|---|
| C4 FAIL (D1, R1/R2 all green) | **Fixed for R1** (biggest); #2/#3 still look green → D15 | `ftcR_1440_light_result_R1.png`, `…R2.png`, `ftc_close_R2_x3.png` |
| C5 FAIL (no close-up, D2 thumbnails) | **Fixed** | `ftcR_1440_light_tabview_-1.png`, `ftcR_1440_light_partoff_full.png` |
| C7 FAIL (four 3s) | **Still FAIL** (three 3s; typography 4, phone 4) | above |
| C8 FAIL (no part picture) | **Picture fixed**; C8 now fails on the broken hero sentence | `ftc_1440_light_top.png` |
| W13 FAIL | **PASS (marginal)** | above |
| D1 click shows green | Fixed for R1 (camera along normal, X-ray when occluded) | `ftcR_1440_light_result_R1.png` |
| D2 thumbnails vs captions | Fixed | `ftcR_1440_light_partoff_full.png` |
| D3 no picture / code title | Fixed (an engineering figure, see C7.3); `<title>` still "ftc10 · …" | `ftc_1440_light_top.png` |
| D4 part-off close-up a chart | Fixed | `ftcR_1440_light_tabview_-1.png` |
| D5 machine framing / banner | Fixed | `ftc_1440_light_sim_default.png`, `…swing_s2_mid.png` |
| D6 jargon headline | Mostly fixed: plain summary and plain "where" per region; but the first sentence is broken (C8) | `ftc_1440_light_top.png`, `ftcR_1440_light_sec_problems.png` |
| D7 label collisions | Replaced by detached label chains (C7.2) | `ftc_1440_light_result_section.png` |
| D8 chip/DRO truncation | DRO fixed (ellipsis); strip chips still unreadable | `ftc_1440_light_sim_section.png` |
| D9 white figures in dark mode | Part-off plot folded (fixed); deviation map and hero picture are new white slabs; reach-hint legend still clipped | `ftc_1440_dark_result_section.png` |
| D10 phone DRO/card cover view | Fixed | `ftc_390_dark_result_R1_section.png`, `ftc_390_light_sim_default.png` |
| D11 hint wording | Fixed | Problems text |
| D12 cycle jump unexplained | Partly: callout added but truncated and reason-less (C7.6) | `ftcR_1440_light_history_iter3-4_crop.png` |
| D13 regions vs proud total | Not fixed | `index.html` has no "not listed" text |
| D14 no 30 % tick label | Not fixed (axis 0/15/50/100; the dashed 30 % line is unlabelled) | `ftcR_1440_light_partoff_full.png` |

## Ranked defects (current)

### Fix before showing the friend (cheap)
**D19. The first sentence of the showcase hero is broken (C8).**
- *Repro:* open the FTC page and read the paragraph under the title (`ftc_1440_light_top.png`).
- *Cause:* `report5.py:1040` `where_words(r).split(",")[0]` cuts inside a parenthesis.
- *Fix:* cut on ", " only outside parentheses, or use a short `where_short` field ("bottom of a drilled hole", "a
  fillet beside a 12 mm bore"). Close the outer bracket, and say "the largest are …".

### Major
**D15. Clicked small regions look all green (C4, C7.4).**
- *Repro:* in Final result, click R2 or R3 in Problems (`ftcR_1440_light_result_R2.png`, `…R3.png`).
- *Cause:* `focusRegion` distance = `ext*1.6 + diag*0.3` gives ~74 mm for every region, and the pin sits on the
  region.
- *Fix:* `dist = clamp(ext*5, 12, 60)` mm; show a ring beside the region rather than a pin on it.

**D16. Labels of occluded regions are drawn on visible faces (C7.4).** Underside labels appear on the top face
(`ftcR_1440_light_result_R1.png`, `…preset_top.png`).
- *Fix:* raycast from the camera to each marker's anchor and hide the label when the target mesh is hit first. Also
  close the card when a preset is pressed (`…preset_tabs.png`).

**D17. Stale "and the edge band are left out of the score" in Part-off (honesty).** It contradicts the headline and
the v2.1 addendum, on both pages.
- *Fix:* `report5.py:566`.

**D18. Dark mode: the six-view map and the hero figure are large white slabs; the map is unreadable on phones
(C7.3).** `ftc_1440_dark_result_section.png`, `ftc_390_dark_result_section.png`.
- *Fix:* as in C7.3.

**D20. "Mostly a little extra metal" for leftovers of up to +5 mm on CTC (honesty).** `ctc_1440_light_top.png`.
- *Fix:* as in C7.6.

### Minor
- **D12** (partly fixed). The cycle-time callout is cut mid-word and has no reason. No 86 min baseline is mentioned
  near the headline. Suggested wording: "about 118 min (the 86 min baseline is exceeded because the machinist review
  asked for full retracts before each index)".
- **D13.** No note that small regions are not listed (44.67 of 53.41 mm²).
- **D14.** The 30 % rigidity line has no tick label.
- **D21.** Region labels move away from their anchors without leader lines, and the setup chips are unreadable.
- **D22.** The phone tab table hides the Centre column. The reach-hint legend is clipped. The browser `<title>` is
  still the code name.
- **D23.** The FTC History note "not reachable by a ball" trips the owner's grep. Annotate it in place (W2c).

## The five changes that would most improve the page for a non-machinist friend
1. **Fix the first sentence** (D19) and make it honest about size (D20). It is the first thing anyone reads; one line
   of code.
2. **Make every clicked region visible:** size-aware zoom, a ring instead of a pin, hidden occluded labels, and the
   card closed on preset (D15, D16). Today only the biggest failure works.
3. **Theme the two figures and shrink the deviation map** (D18). In dark mode, the white 1150 px block is the most
   visible thing in the Result section. For the hero, a crisp single view of the part, or a snapshot of the 3D result,
   would look far better than the engineering figure.
4. **Clean up the text contradictions:** the edge-band sentence (D17), "N smaller regions not listed" (D13), a one-line
   cycle-time reason next to the cycle figure (D12), and an inline "→ R1, counted as failed" after agent notes that
   discuss unfinished areas (D23).
5. **Tidy the labels and the strip:** leader lines or merged labels, readable setup chips, and a stacked tab table on
   phones (D21, D22).

## Overall
- **Fixed since the last review:**
  - the Machine view (framing, see-through spindle, button, axis-naming banner, phone readout);
  - the part identity (title, picture, plain summary, plain "where" per region);
  - the R1 click (looks down the bore);
  - a real 3D tab close-up;
  - rigidity sections that agree with their captions;
  - hint wording.
- **Verified independently:** the kinematics and self-check (my matrix check agrees with the page to 1e-16), the
  headline numbers and the G-code downloads.
- **Still failing:**
  - **C7** (alignment 3, colour 3, result-view legibility 3, honesty 3);
  - **C8** (a broken hero sentence, cheap to fix).
- **Passing:** C1-C6, C9, W1, W2(c) (one note to annotate), W13 (marginal). W9 is the owner's call; my opinion is
  that it is nearly showable once D19, D15/D16 and D18 are fixed.
