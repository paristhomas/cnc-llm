# Machinist review: AL6061-T6, 3-axis VMC, vacuum fixture

Reviewer stance: would I press cycle start on this on a real machine. The briefs say the simulator already checks crashes and chip-load limits, so this review looks at what the simulator does not: process sense, finish, tool life, and holding.

Programs reviewed:
1. `runs/motor_mount/20261119-224900/final/program.nc` (11,757 lines)
2. `runs/gimbal_arm/20261120-050447-validation/final/program.nc` (20,833 lines)

Method: tool sequence, feeds, Z levels, entries, rapids and end sequence were extracted with scripts. Chip load = F / (rpm x flutes). I compared the T6 dome toolpath against `target_height.npy` and the T1 Z10 finish coverage against the target Z10 faces. Climb/conventional was judged from arc and travel direction. With M3 (CW) spindle, climb means the material is on the LEFT of the travel direction.

---

## 1. motor_mount: verdict RUN WITH MINOR EDITS

Sequence: T1 face (Z16.3 then Z16.0), D40 counterbore and D22 bore by helix and spiral. T2 pocket, island and slot rough, then counterbore rough and finish. T10 pre-drill. T3 pocket rest and finish, D6.6 holes. T1 outer profile (Z10.6, 5.2, -0.2 rough, then finish at Z-0.2). T9 chamfer. Ends `M5`, `G0 Z150`, `M30`. M5, T M6, G43 H, S M3 are in the correct order everywhere.

Why it is runnable:
- Chip loads are at or below library values on every cut (table below). Spindle is at max rpm for T2, T3 and T9; T1 and T10 are at their limits.
- Entries are good. Counterbore, bore and holes use helical entry. Pocket and slot use shallow ramps (about 3 deg). The profile uses tangent arc lead-in and lead-out outside the stock. The only straight plunges are in air or already-cleared space.
- Roughing comes before finishing everywhere. Step-over is 40% of D and step-down is at most 0.4 D on the pockets (1.5 to 2.4 mm with D6). The D10 profile roughing is ap 5.4 and ae 1.75, which is light.
- Z0 handling is sensible. The deepest cut is Z-0.2, within the 0.5 mm allowance. Drill depth Z-0.4 is within the allowance.
- The drill R plane (10.5) is above the counterbore floor (9.5). The counterbores are milled before the drill, so the drill does not rapid into material.
- The chamfer geometry checks out. T9 tip at Z14.5, centre offset 0.6 from the part edge. The cone passes exactly through the 1 mm chamfer plane and the tip stays 0.5 mm clear of the vertical wall.
- Total cut time is about 6 to 7 minutes. Rapid moves are short and well clear of the stock.

Edits I would make before running:
1. All finish passes are conventional. This is the main quality issue.
   - Outer profile: CW around the part (G2 on outside corners), so the part is on the right of travel.
   - Holes, bores and counterbores: G3 (CCW) inside the feature, so the wall is on the right of travel.
   - Pocket walls (T3) and the chamfer (T9) show the same pattern.
   - Climb is the opposite arc direction for each of these.
   - Effect: poorer wall finish and more push-off on the 0.25 mm skim. It will probably still hold +-0.1 mm, but I would flip the direction on finish passes.
2. No coolant or air blast anywhere.
   - M7/M8/M9 are not in the dialect, so enable air or mist at the machine.
   - Dry 24,000 rpm in the 16 mm deep slot and the D3 tool in the pocket (4,900 lines at D3) invites chip packing and built-up edge.
   - Also needs a way to keep chips off the vacuum plate.
3. Retract height is Z20 over an 18 mm stock top (2 mm). The first approach to the facing pass is also close to stock top (Z16.3, outside the stock, so acceptable). I would raise the general retract to Z25 or higher.
4. Holding. The vacuum seal is the real risk. D22 bore, 4 through holes and the 25 mm slot are all cut through before the profile. Each one breaks the vacuum seal and the part is completely free after the last profile pass. The chamfer (T9) then runs on a free part held by vacuum alone. Confirm the fixture has a gasket zone that survives these through-features, or add a tab, or run the chamfer from a clamp.

---

## 2. gimbal_arm: verdict RUN WITH MINOR EDITS

Sequence: T1 rough stripes (levels 19.7, 16.0, dome rest rings 19.0 to 16.9, 12.3, 10.3, 5.0, -0.3), T1 finish (lug top Z12, Z10 face raster, R15 boss wall and ring, lug walls, outer profile to Z-0.3), T2 D12 bore and D8 hole by helix, T3 three lightening pockets, T4 clamp slit, T6 ball dome and fillet, T9 bore chamfer. Ends `M5`, `G0 Z150`, `M30`. Starts with `%` and the same safe header. M5, T M6, G43 H, S M3 order is correct for every tool.

Why it is runnable:
- Chip loads are at or below library on every cut.
- T6 dome finish matches the target. I checked the ball path against `target_height.npy`: from r 7.6 to 17 mm the tip is 0.00 to 0.04 mm above the required height, and the worst gouge is 0.017 mm. The first 1 mm near the bore (r 6 to 7.1) is left for the T9 chamfer.
- T9 bore chamfer: second pass is centred so the cone hits (r 6.0, Z18.54), which matches the CAD chamfer face. The first pass leaves 0.3 mm.
- The Z10 face finish leaves nothing behind. The T1 Z10 raster plus the R20 ring pass cover all Z10 target faces.
- Pockets use helical entry, 1.3 mm layers, 37% step-over and a floor and wall finish. No vertical plunges into stock other than the 0.25 mm floor skim at F350.
- Roughing is stripes of ap 1.3 to 5.3 and ae 3.94 (39% of D) at 0.06 mm/tooth, about 2 kW of cut. Stripes start and end outside the stock, so there are no slot entries.
- Cut time is about 8 to 10 minutes plus rapid returns.

Edits I would make:
1. Retract and rapid height is Z22 over a Z21 stock top (1 mm). The very first traverse from Z150 to Z22 and every inter-operation rapid is only 1 mm above the stock. Raise to Z26 or more, because stock height tolerance and a bad touch-off will crash the D10 into the top. Rough stripes also lift only 1 mm and rapid back along the cut channel; safe in theory, tight in practice.
2. T4 D1.5 clamp slit is the riskiest cut in the job.
   - Slot width equals tool diameter (1.5 mm, full slotting).
   - Depth is 12.3 mm, which is 8.2 x D, with a 5 mm flute and 14 mm stick-out. After the first few passes the shank runs in a slot of its own width.
   - Step-down is 0.5 mm (0.33 D, above the 0.25 D full-slotting guideline).
   - Dry, with no chip clearance and no peck retract.
   - Chip packing and a broken 1.5 mm cutter is a likely outcome. Use air or mist, a lower step-down (0.25 to 0.3), retract between layers to clear chips, or cut the slit with a slitting saw or in a second operation.
3. Finish passes are conventional, the same pattern as motor_mount.
   - Outer profile: CW around the part, part on the right of travel.
   - Bores and boss wall ring: G2 around the boss or G3 in the hole, both conventional.
   - 0.3 mm skim at Z-0.3 full depth (10.3 mm) with conventional cut: expect a rough wall and deflection on the thin tapered end.
   - Flip arc directions on finish passes.
4. Operation order for holding. The outer profile is cut free first, then the D12 bore, D8 hole, pockets, slit, dome and chamfer are machined on a loose part held by vacuum only. The slit splits the lug into two prongs while the part is held by vacuum. Cut the bore, hole and pockets first and the profile last, or confirm vacuum strength.
5. No coolant or air (same as motor_mount). Dome ball finish at 0.3 mm step-over takes about 100 s; that is slow but harmless.

---

## 3. Per-tool cutting data

Chip load ratio = actual / library chip load.

### motor_mount

| Tool | Operation | rpm | Feed (mm/min) | mm/tooth | x library | Notes |
|---|---|---|---|---|---|---|
| T1 D10 3F | face, ring spiral, bore, profile | 18000 | 3240 | 0.060 | 1.00 | Facing ae 6.6 (66%), ap 1.7 then 0.3; ring ae 4.0; profile rough ap 5.4 ae 1.75, finish 0.25 |
| T1 | helix / lead-in | 18000 | 1080 | 0.020 | 0.33 | 1 mm per rev (0.85 in the bore) |
| T2 D6 3F | pocket / slot / counterbore cut | 24000 | 2880 | 0.040 | 1.00 | ae 2.4 (40%), ap 1.5 to 2.4 |
| T2 | ramp / helix | 24000 | 960 | 0.013 | 0.33 | ramp about 3 deg |
| T10 D5 drill | pre-drill D6.6 holes | 8000 | 960 | 0.06/tooth (0.12/rev) | 1.00 | G83 Q2.5, R10.5, Z-0.4 |
| T3 D3 2F | pocket rest and finish | 24000 | 960 | 0.020 | 1.00 | |
| T3 | hole helix | 24000 | 480 | 0.010 | 0.50 | |
| T3 | plunge / lead-in arc | 24000 | 320 | 0.007 | 0.33 | |
| T9 chamfer | 1 mm outer chamfer | 24000 | 960 | 0.020 | 1.00 | tip Z14.5 |

### gimbal_arm

| Tool | Operation | rpm | Feed (mm/min) | mm/tooth | x library | Notes |
|---|---|---|---|---|---|---|
| T1 D10 3F | rough stripes and finish | 18000 | 3240 | 0.060 | 1.00 | ae 3.94 (39%), ap 1.3 / 3.7 / 3.7 / 2.0 / 5.3 / 5.3; Z10 finish pitch 7.5 (75%) |
| T1 | plunge (outside stock) | 18000 | 1000 | 0.019 | 0.31 | 346 plunges |
| T2 D6 3F | D12 bore and D8 hole helix | 24000 | 800 | 0.011 | 0.28 | 0.88 mm/rev bore, 0.5 mm/rev hole |
| T2 | lead-in | 24000 | 1200 | 0.017 | 0.42 | |
| T3 D3 2F | pocket clear / finish | 24000 | 960 | 0.020 | 1.00 | ae 1.1 (37%), ap 1.3 |
| T3 | helix | 24000 | 525 | 0.011 | 0.55 | 0.3 mm/rev |
| T3 | plunge | 24000 | 350 | 0.007 | 0.36 | 0.25 mm floor skim |
| T4 D1.5 2F | clamp slit | 24000 | 480 | 0.010 | 1.00 | full slot, ap 0.5 |
| T4 | plunge | 24000 | 160 | 0.003 | 0.33 | |
| T6 D6 ball | dome / fillet | 24000 | 1440 | 0.030 | 1.00 | 0.3 mm step-over |
| T9 chamfer | bore chamfer | 24000 | 600 | 0.0125 | 0.62 | two passes |

---

## 4. Issues by severity

### motor_mount

| Sev | Issue |
|---|---|
| Medium | All finish passes (outer profile, holes, counterbores, pocket walls, chamfer) are conventional. Flip arc direction for climb. |
| Medium | Vacuum hold: through bore, holes and slot are cut before the profile, then the chamfer runs on a free part. Check gasket zone. |
| Low | No coolant or air blast; dialect has no M7/M8, so use machine air. |
| Low | Retract Z20 is only 2 mm above stock top Z18. |
| Low | Slot and pockets are written as thousands of short linearised G1 segments (about 5,700 lines per tool) at 0.02 to 0.05 mm chord. Large file, can starve the control; arcs would be better. |
| Info | Bore finish is single-pass at full size with 0.25 mm skim; no spring pass. Fine for +-0.1. |

### gimbal_arm

| Sev | Issue |
|---|---|
| High | T4 D1.5 slit: 12.3 mm deep (8x D), full slot, 0.5 mm step, dry. High chance of a broken cutter. |
| Medium | Z22 retract and rapid height is only 1 mm above the Z21 stock top. |
| Medium | Outer profile is cut free first, then everything else is machined on a loose part held only by vacuum. The slit then splits the lug. |
| Medium | Finish passes conventional (outer profile, boss wall, bore, hole). |
| Low | No coolant or air blast. |
| Low | Rough stripes lift only 1 mm and rapid back along the channel (346 passes, about 20 m of rapids). Wasteful rather than unsafe. |
| Low | T6 dome 0.3 mm step-over is far finer than needed (cusp about 0.004 mm); about 100 s. A 0.5 to 0.6 mm step-over would halve the time. |
| Low | Bore helix path radius equals tool radius (3.0), so the tool edge passes exactly through the axis. Expect a thin pip; a real tool with runout normally clears it. |
| Info | Plunge at Z19.0 / 18.3 / 17.6 / 16.9 (dome rest rings) is a 0.7 mm vertical plunge of a D10 into fresh material at F1000. Light, but a short ramp would be cleaner. |

Nothing found that would crash the machine or break a tool in motor_mount. In gimbal_arm the only item likely to break a tool is the T4 slit.

---
**Lead's note (fact check):** the "conventional milling" finding is incorrect. With M3 (clockwise spindle seen from
above), climb milling means traversing outside profiles clockwise and inside contours/holes counter-clockwise (G3),
which is what both programs do. The other findings (profile cut before inner features, 1 mm retract on gimbal_arm,
risky 8xD slit with the 1.5 mm tool, over-fine dome step-over) are valid and were added to the skill as shop-practice
guidance.
