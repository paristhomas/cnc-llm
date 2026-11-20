# Review of 3+2 report ftc08/20261120-110454 (A1-A10, F1-F5)
Headless Chromium swiftshader, 1440x900 / 390x844, light+dark. Screenshots: scratchpad/review5/.

| # | Verdict | Evidence |
|---|---|---|
| A1 | PASS (marginal) | file:// opens; 0 console errors (only swiftshader "GPU stall" perf notes); viewer-ready after 7.4 s under software GL (limit 5 s; not measured on a GPU) |
| A2 | PASS | header: part, AL6061, +-0.1, claude-opus-5-5, date, 99.778 %, VALID badge |
| A3 | PASS | play advances (32035->39666 moves), speed/scrubber/line number/current block shown; tool model + diameter shown; stock visibly cut |
| A4 | PASS | legend T1-T8 colours + dotted rapid; rapid toggle |
| A5 | PASS | deviation colour bar, target overlay, not-reachable and parting-face categories in separate colours |
| A6 | PASS | history section with 7 iterations |
| A7 | PASS | metrics, problems with G-code line buttons (120), tools, cycle time 40.5 min |
| A8 | PASS | final.nc + per-iteration program.nc links, G-code viewer |
| A9 | PASS (minor) | dark mode legible; phone scrollWidth 390 = viewport; scrubber setup-mark strip very dense |
| A10 | PASS | summary paragraph says part, score, problems |
| F1 | PASS | see above |
| F2 | PASS (caveats) | vise/stock/part visible; tool axis changes per setup (horizontal tool at A90); each setup re-orients; wall removal visible as stripes in tilted setups. Caveats D2, D4 |
| F3 | PASS | 28-row setup table + chip strip; click row seeks (57702) and G-code follows; line link -> "Line 124263 positioned" |
| F4 | PASS | per-setup connection % bar chart vs 30 %/15 % limits + cross-section images after setups 1, 23-28 |
| F5 | PASS | legend: gouge/in tol/proud, "not reachable in 3+2", "parting face" |

## Defects (prioritised)
1. Scrubber track clicks did not seek (clicked 5 %-99 % of the track; position stayed at line 5234). Likely the scrub-marks overlay (28 marks, 40-100 % crammed) intercepts. Repro: click anywhere on the range in #simcontrols. Setup-chip row works, so impact is medium.
2. Final-result view opens at an over-zoomed camera showing one pocket corner, not the whole part. Repro: scroll to "Final result", no interaction.
3. Setups 2-28 occupy ~40-100 % of the track but only 4 % of the moves-per-setup text; setup 1 holds 57k moves, so the animation spends most time in setup 1. At setup start the tilted tool is parked at X-86 and barely in frame (setup 2, 6): hard to see the tilt unless following.
4. Load 7.4 s under software GL; confirm on a GPU. A 120-button problems list and 28-bar chart are dense (rigidity bars labels overlap at 1 %).
5. Header "Harness changed since run start" warning is amber on a VALID run; fine but alarming; wording OK.
