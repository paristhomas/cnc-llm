# Independent review: per-run web report (ACCEPTANCE.md section A)

Date: 2026-11-20. Reviewer did not build the report.

Pages reviewed (file://, no server):
- `runs/mould_cavity/20261119-224900/report/index.html` (VALID, 99.665 %, 2 proud regions)
- `runs/heatsink/20261119-230530/report/index.html` (VALID, 100.000 %, no regions)
- `runs/gimbal_arm/20261120-050447-validation/report/index.html` (VALID, 100.000 %, no regions)

Method: Playwright + headless Chromium (SwiftShader software GL), 1440x900 and 390x844, light and dark
(`colorScheme: 'dark'`), `?static=1` for full-page shots. Interactions: play / pause, all speeds, step buttons,
arrow keys, scrubber (programmatic and mouse drag), Start / End, G-code row click, find box, problems-list line
buttons, region buttons, the sim "target" checkbox, the colour and path modes, the result modes
(deviation / machined), the overlay checkbox, and the Iso / Top / Front views. Every `href` was checked to exist on disk.
Screenshots are in the session scratchpad (`.../scratchpad/review/*.png`).

Caveat: SwiftShader renders at about 3.5 fps idle. Timing and playback-speed numbers are therefore pessimistic for a real laptop GPU.

## Scores

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| A1 | Static, no console errors, < 5 s | **PASS** | Opens from file://. All three pages have 0 console errors, 0 page errors and 0 failed requests, and every linked file exists. `load` takes 94–212 ms. Both 3D viewers are ready in 4.4–4.8 s (mould 4.8 s) under software GL. That is borderline but under 5 s; with the 3 pages in parallel it is 8–9 s. data.js is 4 MB. |
| A2 | Header: part, material, tol, model, date, score, VALID | **PASS** | All of these are in the hero, and the score card sits beside them at 1440 px. On a phone the score card comes below the long description and the fact grid, so it needs one scroll. |
| A3 | Animation, tool, play/pause/speed/scrub, line shown | **PASS (with defects)** | The stock visibly shrinks (cavity, fins, bosses and holes appear progressively). The tool and holder ride the path, and the tool sizes look right (1 mm ball vs 6 mm ball vs D10 flat). Play/pause, 8 speeds, scrubber with tool-change ticks, step buttons, arrow keys, Start/End, time display, a current-block panel with the line number, and a synced listing with follow all work. Defects D1, D2 and D6 below. |
| A4 | Rapids vs cuts, tools by colour, legend | **PASS** | Rapids are red dashed and cuts are coloured per tool, with a legend in the viewport plus ticks on the scrubber. Path modes: recent/all/past/off. Minor: two tool greens are close (D9). |
| A5 | Deviation-coloured result, colour bar, target overlay, undercut/tool-limited distinct | **FAIL** | The "Deviation on target" mode is good: diverging bar, clear gouge/in-tol/proud labels, and an undercut/tool-limited/datum legend. However, the "Machined surface" mode on heatsink (scored 100 %, no regions) paints the fin side walls red/proud (D3). That is exactly the "looks like LLM error but isn't" confusion A5 is meant to prevent. The target/stock overlay toggles in both viewers produce an almost invisible change (D4). None of the three runs contains visible undercut or tool-limited area, so that colouring could not be verified visually. |
| A6 | Iteration history chart + LLM notes | **PASS** | There is an SVG chart of score/gouge/proud per iteration and per-iteration cards with the LLM notes, a delta, stats, a thumbnail and links. The chart's 0–100 % axis makes it nearly useless (D5). |
| A7 | Metrics, safety issues w/ line numbers, tools, cycle time | **PASS** | A 17-row metrics table, a tools table (type, Ø, stick-out, time, removed) and cycle time are present. Region rows carry clickable "last cut by" G-code lines, and clicking jumps the listing and the animation. None of the three runs has safety issues, so that list's line links were only seen in its empty state. Some numbers disagree with each other (D7). |
| A8 | G-code downloadable and viewable | **PASS** | There are a download (.nc) button, "Open as text" and per-iteration downloads, and the full listing with search is in the sim panel. `gcode/final.nc` is byte-identical to the last iteration's program.nc on all three runs. |
| A9 | Professional, no overlap/clipping, phone, dark/light | **PASS (minor issues)** | Typography and colour tokens are consistent, and dark mode is fully themed and legible. At 390 px, `scrollWidth == innerWidth == 390` on all pages (the TOC links scroll inside their own strip), and tables collapse to cards. Minor: phone colour-bar ticks collide (D8). Matplotlib PNGs are white glare blocks in dark mode, use a different visual language (viridis, tiny axis text) and look like debug output (D10). The unmachined stock looks like translucent glass rather than a metal block (D6). |
| A10 | Reviewer understands part / quality / problems from page alone | **PASS** | The description, a plain-English verdict sentence ("99.665 % … largest proud area R1 31.65 mm² … up to +0.74 mm"), region table and markers, and notes make all three questions answerable. Numeric contradictions (D7) and the heatsink false-red (D3) undermine trust somewhat. |

## Defects (prioritised)

**D1 (P1). The current-line display freezes after you click a row in the G-code listing.**
Repro (mould_cavity): with playback paused, click listing row 20. Then click "Next move" and then "Jump to end". The move
counter goes 11 → 12 → 48,392 and the time reaches 18:30, but "Current block line 20" and the highlighted row stay at 20.
The line display only unfreezes after another jump (for example a problems-list line button).

**D2 (P1). The line ↔ move mapping is off by one and inconsistent.**
- Clicking problems-list line **23949** (or typing 23949 in the find box) lands on and highlights **23950**. 24853 lands on 24854, while 32922 is correct.
- At the same move index, the step button and the arrow key report different lines. Mould, move 3: the button shows line 13, ArrowRight shows line 12. Heatsink: the button goes to move 3 / line 13, then ArrowRight goes to move 4 / line **12** (the line goes backwards while the move goes forwards).
- The HUD shows the feed of the next line but the end position of the previous move (heatsink move 2: "F1000 … Z23").
A reviewer chasing a problem line is shown the wrong block.

**D3 (P1). The "Machined surface" result mode flags in-tolerance vertical walls as proud.**
Repro: on heatsink (100.000 %, "No out-of-tolerance regions"), go to Result → Machined surface → Top. Red strips run the full
length of several fin flanks (`heat_res_mach_top.png`). A top-down "machined top minus target top" difference is
meaningless on near-vertical walls. Mask the walls (or use the signed normal distance) and grey them out, or explain in the colour-bar title that
wall values are not evaluated.

**D4 (P2). The target/stock overlay toggles are almost invisible.**
In the sim, the "target" checkbox adds only a faint blue tint and outline. In the result view, "machined stock overlay" and "target overlay"
change little more than the texture, plus z-fighting speckle at the wall bases (`mould_res_dev_ovl.png` vs `mould_res_dev.png`). Use a
contrasting wireframe/edge overlay or a semi-transparent ghost in a distinct hue, and add a legend entry.

**D5 (P2). The iteration chart has a fixed 0–100 % y-axis.**
Mould goes from 98.44 → 99.66 % and heatsink from 99.41 → 100 %, so the lines are flat at the top, and the gouge and proud lines sit at 0. Auto-scale the score axis (for example
min − 1 pt to 100 %) and put gouge/proud on a secondary axis or a small-multiple chart. With 2–3 iterations, the points are pinned to the far edges.

**D6 (P2). The stock does not read as solid metal before it is cut, and playback speed is not honoured on slow GPUs.**
In the start frame, toolpaths and the cavity ellipse show through a grey-white translucent block (`mould_sim0.png`,
dark mode especially). Once the colouring is applied it reads well, especially in "aluminium" mode. Make the uncut stock opaque, with
paths depth-tested. Playback is frame-bound: `dt` is clamped to 100 ms per frame. In this environment, 1× advanced 1 s in 10.5 s and 16× advanced 27 s
in 11 s. Show the effective speed, or advance by wall-clock time with a cap on moves per frame instead.

**D7 (P2). Numbers on the same page contradict each other (mould_cavity).**
- The header says 99.665 %; the history chart, card and evaluated iteration 2 say 99.657 / 99.66 %. The integrity note does not explain the delta.
- Metrics "Max gouge depth 0.00 mm" vs iteration 2 "max gouge 0.07 mm".
- "Gouged volume 0.03 cm³" alongside 0.00 % gouged and 0.00 mm max gouge.
- Iteration 1 shows "gouge 0.00 %" with "max gouge 4.38 mm". The error that made it INVALID is not shown on the card (only in the feedback link).

Label which quantities are scored and which are raw, and show the error text on invalid iterations.

**D8 (P3).** At phone width the colour-bar labels "-0.10" and "+0.10" run together ("-0.10+0.10"), and "◀ gouge (cut too deep)" wraps awkwardly.

**D9 (P3).** The tool palette has two near-identical greens: T2 #008300 vs T6 #1baf7a (mould), and T3 vs T9 (gimbal).

**D10 (P3).** The Images section is matplotlib PNGs with tiny axis text, a viridis palette and white backgrounds. They glare in dark mode and duplicate the
3D views. Restyle them, or collapse them into a "debug images" disclosure.

**D11 (P3).** Region markers do not always sit on visible red. In the mould iso view the R1 pin sits on green, with its proud strip hidden behind the dome
crest. After clicking a region the camera stays zoomed in; "Iso" resets it, but there is no "reset view" affordance.

**D12 (P3).** On the heatsink the parked T1 and its holder fill about a third of the viewport at program end and hide the part (`heat_sim_end.png`).
Hide the tool at M30, or let the camera auto-frame. Height-field "barcode" streaks and dark speckle show on vertical walls in the sim (gimbal pockets).
The legend text "faint = not yet cut" is misleading once the program has finished.

## What works well
- 0 console errors; it is fully static and self-contained, and the sim reports "replay matches simulator on 99.8–100 % of cells".
- The clear verdict sentence, the VALID badge, the integrity and cross-check chips, and the harness hashes in the footer.
- The current-block panel, the virtualised and syntax-highlighted G-code listing with search and follow, and the tool-change ticks on the scrubber.
- The phone layout is genuinely usable: tables become cards, there is no horizontal scroll, and the controls wrap cleanly.
