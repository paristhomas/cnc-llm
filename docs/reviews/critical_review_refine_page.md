# Critical review: report pages (section C, W1, W2c, W9, W13)

Reviewer: independent page reviewer. I did not build this work and did not see the builder's summary. Another reviewer
covers sections A, B, D and E (`critical_review_refine.md`).

Pages reviewed (opened from `file://` in headless Chromium with SwiftShader WebGL):
- **FTC-10 showcase:** `runs/ftc10/20261121-012221-refine/report/index.html`
- **CTC-04 x0.2 held-out:** `runs/ctc04_x0p2/20261121-012513-heldout/report/index.html`

Evidence I collected:
- `tools/review_report.py` run once on FTC-10 (4 renders, 3 swings each at desktop). The summary is in
  `screens_refine/review_report_ftc10_summary.json`.
- My own Playwright scripts, in `/home/paris/review_tmp/refine_page/`:
  - `shots.py`: four renders per page, every re-orientation, an independent kinematics check, and the DRO during play.
  - `click.py`: clicks a region marker and a Problems row.
  - `lower.py`: zooms on regions with labels off, the Below view, the lower sections, and a wording grep of the
    held-out report.
  - `presets.py`: result-view presets with labels off, and a camera flown along a region's exact normal.
  - Their results are in `screens_refine/own_checks_*.json` and `screens_refine/lower_sections_and_grep.log`.
- Every screenshot cited below is in `docs/reviews/screens_refine/`, and I opened each one.

A note on one artifact: the `*_full.png` desktop capture wraps at 8192 px, so the header repeats in the middle of
"Iteration 5". The real document height is 11754 px. This comes from the capture, not the page, and I do not cite
anything below that line. I checked the lower sections with element screenshots instead.

## Verdict table

| # | Item | Verdict | Evidence |
|---|---|---|---|
| C1 | Machine view is the default; ≥ 3 re-orientations; `__machineCheck` | **PASS** | Default mode is `machine` in all 8 renders (both pages, 1440/390, light/dark). **Re-orientations, before/mid/after, all opened:** (1) A 0→90 into FTC setup 2: `ftc_swingA_s2_{before,mid,after}.png` (A 0 → 45 → 90; cradle, platter, vise and stock tilt together; spindle vertical). (2) C 0→−180 into setup 3: `ftc_swingC_s3_*`. (3) C −90→+90 into setup 5: `ftc_swingC_s5_*`. (4) Held-out C 158→0: `ctc_swingC_s3_*`. **`window.__machineCheck`:** FTC: spindle-direction error 1.6e-16, tool axis in part 3.5e-16, tip vs Part view 4.9e-14 mm, A/C vs `setups.json` 0°, 641 samples + 35 swing samples, `pass: true`. Held-out: 3.7e-11, 6.6e-11, 6.4e-14 mm, A/C vs `setups.json` 7e-4°, which is rounding (setups.json stores C=158; exact 158.0007). **My own check, independent of the page's self-check:** reads `toolObj.matrixWorld` at 320 cutting positions and 133 swing positions → max spindle error 1.6e-16. The part-local direction that the part group's world matrix turns to +Z equals `setups.json tool_axis` for all 8 FTC setups (error ≤ 3e-16) and all 6 held-out setups (≤ 1.25e-5, from 4-dp rounding in the JSON). The DRO A/C equals `frame_angles` for every FTC setup (`dro_vs_frame_angles.all_ok`). |
| C2 | Machine drawing; DRO; removal visible when tilted | **PASS** | **Drawing:** cradle, trunnion supports, dial platter, vise, stock, stub, part, spindle nose and holder are all drawn (`ftc_swingA_s2_before.png`, `ftc_machine_cut_s3.png`). **DRO:** X Y Z A C, tool name, current block; it updates in play (N56473 → N70547 after 8 s of play, `own_checks_ftc10_dro_play.json`). **Removal:** cut wave surfaces are visible at A90 (`ftc_machine_cut_s3.png`, `ftc_machine_cut_s7.png`). **Craft issues are under C7.** |
| C3 | Headline = whole-surface score; witness and edge band separate and small; no "of reachable" | **PASS** | FTC 99.87 % = `metrics.whole_surface_in_tol_pct` 99.866; held-out 99.18 % = 99.18. Witness 0.23 % / 0.15 % and edge band 0.85 % / 1.32 % are on a separate small line (`ftc_header_1440_light.png`). The forbidden-word grep finds 0 hits on both report folders; the only "excluded" hits are the two allow-listed phrases. **Wording nit:** "a 0.03 mm band along face edges (edge band (metrology) excluded 0.85%)" reads as if written for the grep allow-list, not for a reader. |
| C4 | Every failed region shows failure colour; witness colour + legend; click explains | **FAIL (FTC-10)** | **Legend, witness and explanation:** the legend and the purple witness colour are present (`ftc_result_below.png`, purple on the lobe tips). Clicking explains the failure (card with nearest passes and hint: `ftc_result_R2_clicked.png`). **Colouring is correct:** looking straight down the bore along R1's normal, R1 is clearly orange/red at the hole bottom (`ftc_result_R1_along_normal.png`), and the Top preset shows one faint orange speck in a hole (`ftc_result_preset_top.png`). **The page's own navigation never shows the two biggest FTC failures (R1 and R2, 25 of 55 mm²):** clicking R2's marker, or the Problems row for R1, flies to a view where everything is green (`ftc_result_R2_clicked.png`). The same holds with labels off (`ftc_result_R1_zoom_nolabels.png`, `ftc_result_R2_zoom_nolabels.png`), and in the Iso, Side and Below presets (`ftc_result_1440.png`, `ftc_result_preset_side.png`, `ftc_result_below.png`). Both regions are drill-point cones at the bottom of blind holes. `focusRegion` adds a fixed offset (−0.3, −0.4, 0.4) to the region normal (`cncllm/viewer/src/resultview5.js:264`), which tilts the camera off the bore axis, so the hole wall hides the cone. The 2D map that does show them (`img/deviation_views.png`, "top" view) is in a collapsed `<details>` in Images. **Held-out:** clicking works there. Zoomed on R1 and R2, the orange/red is plainly visible (`ctc_result_R1_zoom_nolabels.png`, `ctc_result_R2_zoom_nolabels.png`); in the overview it shows only as specks (`ctc_result_1440.png`, `ctc_result_below.png`). A friend doing owner check step 3 on FTC-10 ("anything not green is a failure … click a spot") sees an all-green part. |
| C5 | Part-off: tab count, sizes, witness, close-up image | **FAIL (minor)** | **Data:** count, section, width, centres and witness are all present (`ftc_partoff_1440.png`). **No close-up:** the "Close-up of the tabs" is a matplotlib probe map plus a log-scale section plot, not an image of the part. It is unreadable at 390 px and a white slab in dark mode (`ftc_partoff_390_dark.png`, `ftc_partoff_1440_dark.png`). Nothing on the page shows what the tabs look like on the part, so owner check step 4 ("are the tabs small enough to snap?") cannot be answered by eye. **Thumbnails contradict their captions** (honesty, see D2): "After setup 8: 22.5 mm² (1%) · 2 pieces" is drawn as a fully solid section, identical to "After setup 1: 2997 mm² (100%)". `report5.py:_conn_masks` draws a fixed plane at Z −12 (inside the uncut stub), while the caption numbers are from the weakest plane (Z −5.7). The footnote does say "Seen from above at Z −12 mm … the rigidity check uses the weakest plane", but a picture of a solid section next to "1 % · 2 pieces" still tells a reader the opposite of its caption. On the held-out page the caption says 35.75 mm², under a stated 2–30 mm² tab limit, next to a tab table that says 23.92 mm². The page does not explain the difference. |
| C6 | 60-second test | **PASS (marginal)** | From the FTC page alone in 60 s I wrote down: **part:** "NIST FTC-10 test case, AL6061, 37×81×195.5 stock"; **score:** 99.87 %; **valid:** yes; **biggest problems:** R1 13.21 mm², R2 12.04, R3 3.11 mm² proud; **holding and part-off:** one vise, 12 mm grip, 24 mm stub, 2 tabs 22.88 mm² to break off and file. This matches `metrics.json` (99.866, valid, tabs 2 / 22.88) and `regions.json` (13.21 / 12.04 / 3.11). **Marginal because:** I could not say *what the part looks like* (no picture above the fold) or *where* the problems are in plain words. "face 174 (cone)" means "the bottom tip of a drilled hole", and the page never says so. |
| C7 | Craft (scores 1–5; < 4 = FAIL) | **FAIL** | Typography/hierarchy **4** · alignment/spacing **3** · colour/contrast light+dark **3** · 3D legibility **3** · phone layout **3** · honesty **3**. Details below. |
| C8 | Five best changes; a cheap major one left unfixed = FAIL | **FAIL** | The cheapest major one: `img/target_iso.png`, a clean render of the finished part, already exists in the report folder, but it appears only inside the collapsed "Show simulator plots" in the Images section (`index.html` line 307). The header has no picture of the part. The list is below. |
| C9 | Technical | **PASS** | **file://:** opens from `file://`. **Console:** 0 errors and 0 warnings in all 4 review_report renders, all 8 of my `shots.py` renders, and the presets run. The other helper scripts had no console listener. **Ready time (SwiftShader, shared machine):** viewer ready 1.7–3.9 s and first frame 3.2–4.7 s (review_report); ready 1.7–7.1 s and first frame 3.4–7.9 s in my runs; keyframes ready at 8.4–10.3 s. All are within the 15 s SwiftShader allowance. I could not measure "< 5 s on a laptop GPU" here. **G-code:** "Download final program (.nc)" → `gcode/final.nc`, byte-identical to `final/program.nc` (`cmp`) on both runs; every iteration also has a download. **Scrubber:** real clicks at 10/37/62/90 % land at exactly those fractions. **Phone:** `scrollWidth` = 390 in every phone render. |
| W1 | See the +2 axes move the workpiece | **PASS** | As C1. **A tilt:** the tilt of the whole cradle (A 0→45→90) is clearly visible in `ftc_swingA_s2_*`. **C turns:** visible in `ftc_swingC_s3_*`, `ftc_swingC_s5_*`, `ctc_swingC_s3_*`. **Real playback:** at default speed, playback through swing 3 takes 20.5 s of SwiftShader wall time, with phases retract → swing → approach (`playback_swing.ok`). **Spindle:** stays (0,0,−1) within 1.6e-16. **Caveats (C7):** the part is small in the frame. The banner says "A and C turn the part" during swings where only C moves. In the held-out run A never changes (every setup is A90), so that page shows only C. |
| W2(c) | Wording on the page | **PASS (with a nit)** | **Grep:** `unreach|not reachable|excluded|hand-finish|parting face` finds 0 non-allowed hits in either report folder, and no model identifiers. **Failure labels:** every failed region is labelled "failed: …". **Nits:** the hint text "the harness's quick reach search found no tool for 91% of it … It still counts" (`cncllm/x5.py:427-429`) is not an excuse, but it reads as cut off; it should say "It still counts as failed". The reach-hint image says "diagnostic only, every area is scored", but its legend is clipped at the right edge ("still scored" cut off). R1's card says "passes reach the area … stepover / scallop" and in the same breath "no tool found for 91 %", which contradicts itself. On the held-out page, "+2.61 mm on average: stepover / scallop, the tool radius, or a stop short" offers scallop for 2.6 mm of leftover material, and scallop cannot leave that much. **Iteration notes:** the grep cannot catch the agent's notes in the History section ("cannot reach that corner" in iteration 5, "no 118-degree tool fits there" in iteration 7, "can only trace the outer ring" in iteration 8). I ruled these acceptable: they are the agent's working notes on why it had not yet finished an area, not labels on scored areas; those areas still count as failed in the score and the Problems table. A friend reading them could still take them as excuses, and a one-line "every area counts; these notes do not change the score" above the History section would close that. |
| W9 | Good enough to show a friend? (owner's call) | **Owner's call. My opinion: not yet.** | The Machine view is genuinely impressive, and the swing is the "wow" moment the owner asked for. The page around it is an engineer's report: the title is `ftc10`, there is no picture of the part, the headline paragraph is jargon, clicking the biggest failures in the result view shows all green, and the part-off "close-up" is a chart. A friend would need the owner standing beside them. The five changes below are about a day's work and would make it showable. |
| W13 | Cycle ≤ 86 min or reason; viewer < 5 s and works on phone; non-machinist understands in 60 s | **FAIL** | **Cycle time:** FTC-10 takes 116.0 min, against the 86 min baseline (an FTC-10 number; the held-out 114.3 min is reported for information only). The FTC cycle jumped from 90.8 to 116.0 min between iterations 8 and 9 under a "+0.00 pts" badge. The iteration-9 note lists the machinist-review fixes (retract to the sweep radius before every index, lower T1 rpm, centre-feed correction), which explains it implicitly, but nothing on the page says "cycle time +25 min because …". **Load and phone:** within the SwiftShader allowance; works on phone (no horizontal scroll, controls usable). **60-second test:** a non-machinist cannot get *what the part looks like* or *what went wrong* in 60 s (see C6, C8). |

### C7 craft scores, with screenshots and fixes

1. **Typography and hierarchy: 4.**
   - The big score, the VALID badge and the section headings are clear (`ftc_header_1440_light.png`).
   - It loses a point because the title is the code name `ftc10`, the eyebrow is a run ID, and the most important
     prose is one 90-word block.
2. **Alignment and spacing: 3 (FAIL).**
   - Result-view region labels overlap: R1 under R12, R4 under R11, R6 under R7, R3 under R9
     (`ftc_result_1440.png`, `ftc_result_390_dark.png`).
   - The two rigidity thumbnails have different widths, and the second card overruns the column
     (`ftc_partoff_1440.png`).
   - Setup-strip chips are truncated ("1 A0 …", "5 A9…", "6") (`ftc_page_top_with_sim_1440.png`).
   - The DRO tool name is clipped with no ellipsis ("T13 · 2 mm ball long-neck endm") at both widths.
   - *Fix:* de-collide labels (offset or leader lines, or merge labels closer than ~30 px into "R4/R11"); give the
     cmaps a grid with equal columns; use `text-overflow: ellipsis` and a `title` on chips and the DRO.
3. **Colour and contrast, light and dark: 3 (FAIL).**
   - The page's own UI themes well (`ftc_header_1440_dark.png`, `ftc_swingC_s8_mid_dark.png`).
   - But the matplotlib part-off figure is a full-width white slab in dark mode (`ftc_partoff_1440_dark.png`,
     `ftc_partoff_390_dark.png`).
   - The light-mode 3D result is a single uniform green with nothing to read (`ftc_result_1440.png`).
   - *Fix:* render the plots with a transparent background and theme-aware ink (or two PNGs switched with
     `<picture>` and `prefers-color-scheme`). See D1 for the result view.
4. **3D scene legibility: 3 (FAIL).**
   - The default first frame is a blank grey block in a big machine (`ftc_machine_default_1440.png`).
   - At A90 the part fills about 10 % of the frame. The spindle head is cropped at the top and hides the cut
     (`ftc_machine_cut_s3.png`).
   - In the C-swing "after" frames you mostly see the uncut back of the stock (`ftc_swingC_s3_after.png`,
     `ctc_swingC_s3_after.png`).
   - The legend bar lists 12 tool colours and sits over the machine base.
   - The Part view is much more legible (`ftc_part_view_s3.png`).
   - *Fix:* frame the Machine-view camera on the platter, vise and part (about 2× closer), from slightly in front
     and above the cradle so the working face is visible at A90. Open on a poster frame of the finished part, or
     autoplay the first swing. Collapse the tool legend into the DRO, showing only the current tool.
5. **Phone layout: 3 (FAIL).**
   - There is no horizontal scroll. But in the Machine view the DRO covers the top third and the spindle, the C
     value touches the panel edge, and the "replay matches simulator…" chip covers the bottom right
     (`ftc_phone_machine_swing_dark.png`, `ftc_phone_machine_cut.png`).
   - The region card covers the entire 3D view (`ftc_result_R1_card_390.png`).
   - The part-off figure's text is about 3 px high (`ftc_partoff_390_dark.png`).
   - The header metadata pushes the score to the bottom of the first screen (`ftc_header_390_dark.png`).
   - *Fix:* on phones, use a compact one-line DRO ("A90 C-180 · T4") and drop the status chip. Show the region card
     below the canvas, not over it. Put the score card first and the metadata after.
6. **Honesty: 3 (FAIL).** Nothing inflates the score, and failures are called failures. But:
   - the rigidity thumbnails show a solid section captioned "1 % · 2 pieces" (C5);
   - on FTC-10, clicking the two biggest failures shows an all-green view (C4);
   - the diagnostic "stepover / scallop" is offered for +2.6 mm leftovers;
   - the cycle-time jump is not called out (W13);
   - the "4 warnings" hide that about 65,700 of 262,356 moves (422 + 11,154 + 564 + 53,536) run below 0.2× the
     recommended chip load. The prose summary does not mention this.

## Ranked defects

### Blocker for the friend demo (cheap fix)
**D1. Clicking the biggest FTC-10 failures shows an all-green part (C4).**
- *Repro:* on the FTC-10 page, open Final result and click R1 or R2 (marker or Problems row). The view that appears
  is all green (`ftc_result_R2_clicked.png`, `ftc_result_R1_zoom_nolabels.png`).
- *Cause:* the regions are cones at the bottom of blind holes. `focusRegion` adds a fixed (−0.3, −0.4, 0.4) offset to
  the normal (`resultview5.js:264`), so the camera looks past the bore wall.
- *Evidence the colouring itself is right:* a camera along the exact normal shows R1 bright orange/red
  (`ftc_result_R1_along_normal.png`).
- *Fix (about 10 lines):*
  - when the region lies at the bottom of a cavity, fly along the region normal (test: a ray from the region centre
    along `normal + offset` hits the target mesh);
  - otherwise make the target semi-transparent while a region is focused;
  - also move `deviation_views.png` out of the collapsed gallery, next to the 3D view.

### Major
**D2. The rigidity thumbnails contradict their captions (honesty).**
- *Repro:* see the Part-off section, right-hand cards (`ftc_partoff_1440.png`, `ctc_partoff_1440.png`).
  `report5.py:_conn_masks` samples a fixed Z (middle of the stub gap), but the captions use the weakest-plane numbers.
- *Fix:* draw the section at each check's `weakest_z`, or caption it with the area at the drawn Z.
- Also explain why the "final connection" (22.5 / 35.75 mm²) differs from the tab total (22.88 / 23.92 mm²). On the
  held-out page, 35.75 is above the 30 mm² limit printed just above it. I flag this for the A/B/D/E reviewer too.

**D3. No picture of the part above the fold (C8; a cheap major fix not done).**
- *Fix:* put `img/target_iso.png`, or better a render of the simulated finished part coloured by deviation, in the
  header next to the score.
- Title the page "NIST FTC-10 test part" and move `ftc10 · run id` to the eyebrow.

**D4. The part-off "close-up" is a chart (C5).**
- *Fix:* add a real 3D close-up. The result viewer already has the mesh and the tab positions: add a "Tabs" camera
  preset and a static render of the simulated part after `(PART-OFF)` showing the two 2.6 mm tabs. Keep the
  probe-map chart in a "details" fold.

**D5. Machine-view framing (C7.4).**
- The part is too small in the frame, and the head hides the cut.
- The default frame is a blank block.
- The swing banner says "A and C turn the part" when only C moves.
- *Fix:* frame the camera as in C7.4, open on a poster frame, and make the banner name the axis that actually
  moves ("platter turns C 0 → −180°").

**D6. The headline paragraph is jargon (W13, C6).**
- "proud", "stepover / scallop", "T11", "line 6988", "edge band (metrology)", "24 mm stub gap" all appear unexplained.
- *Fix:* add a two-sentence plain summary above it, for example: "The machine cut 99.87 % of the surface to within a
  tenth of a millimetre. What is left is a small amount of extra metal at the bottom of two drilled holes and along
  a few rounded edges. The part comes off the block on two matchstick-sized tabs that you snap and file." Keep the
  technical paragraph under it.
- The problem list should say *where* each region is in words ("bottom of the Ø5.5 axial hole", "edge round on the
  underside"); the face type and normal can be mapped to such words.

### Minor
- **D7.** Region-label collisions in the result view (C7.2).
- **D8.** The setup-strip chips and the DRO tool name truncate without an ellipsis (C7.2).
- **D9.** The part-off matplotlib figure is white in dark mode (seen). The reach-hint figure has the same white
  background (not checked in dark mode), and its legend is clipped ("still scored" cut off) (C7.3).
- **D10.** On phones the DRO and region card cover the 3D view (C7.5).
- **D11.** "It still counts" reads as truncated (`cncllm/x5.py:429`). The hint "stepover / scallop" is offered for
  multi-mm leftovers, and R1's hint contradicts itself (W2c).
- **D12.** The cycle-time jump (+25 min, iteration 8 → 9) under a "+0.00 pts" badge has no explicit reason on the
  page (W13).
- **D13.** The Problems table lists 55.3 mm² of regions against 64.29 mm² proud in Metrics. The page does not say
  that regions below a threshold are not listed.
- **D14.** The 30 % rigidity line on the bar chart has no tick label; the axis shows only 0/15/50/100.

## The five changes that would most improve the page for a non-machinist friend
1. **Show the part first.** Put a picture of the finished part in the header, next to the score, titled
   "NIST FTC-10 test part" (D3). Cheap: the image already exists.
2. **Make the failures visible.** Fly down the bore axis (or X-ray the part) when a region is clicked, and bring the
   2D deviation map out of the collapsed gallery (D1).
3. **Write a two-sentence plain-English summary** above the technical paragraph, and describe where each top problem
   is in everyday words (D6).
4. **Frame the Machine view on the work.** Open on a poster frame or autoplay the first A tilt, bring the camera
   closer to the vise and part, and name the moving axis in the banner (D5). The swing is the best thing on the
   page; let it fill the frame.
5. **Show a real close-up of the tabs** after the part-off, and fix the rigidity thumbnails so they agree with their
   captions (D4, D2).

## Overall
- **What works:** the kinematics are right and verifiably so. The checks I made independently of the page's own
  self-check agree with it to 1e-16. The +2 axes visibly carry the vise, stock and part while the spindle stays
  vertical. The headline is the whole-surface score with no "reachable" wording. The page loads from `file://`
  with no console errors, and the G-code downloads.
- **What fails:** **C4, C5, C7 (four of six craft scores at 3), C8 and W13.** The failures are presentation and
  honesty-of-figures problems, not wrong numbers. The worst for the friend demo is that on FTC-10, clicking the biggest
  failures flies to an all-green view. The colours are right, but the camera looks past the hole wall, and the fix is
  cheap.
