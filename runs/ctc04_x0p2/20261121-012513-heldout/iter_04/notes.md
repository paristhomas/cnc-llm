Iteration 4: iteration 3 dropped to 94.2 %: the new holder check used the tool keep-out box (stub extended to X+-30 and
Y+-200 so tool centres stay above Z0), which made every holder near the stub look blocked, so T2/T3 left the bottom
19 mm of the part unfinished (1915 mm2) and the leftovers caused a rapid crash and an overloaded T4 entry.
- Holder clearance is now checked against the real geometry: part + real stub (X+-16.06) + vise boxes.
- Everything else as in iteration 3 (flush stub, holder-aware fields, low flange holes from +X, T3 rest rough on +X).
