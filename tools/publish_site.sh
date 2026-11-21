#!/usr/bin/env bash
# Assemble a static website from the built run reports (nothing is pushed or uploaded):
#   bash tools/publish_site.sh [OUT_DIR]        (default: site/)
# OUT_DIR/index.html links the reports; OUT_DIR/<part>/ is each report folder with only what its page needs.
# Per-iteration G-code (program.nc + program.txt, ~5 MB each) is left out to keep the site small; the final program
# (.nc and .txt) is kept, and the iteration cards on the copied pages say where the iteration programs are.
# Works from file:// and from any static host (all links are relative).
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-$REPO/site}"
RUNS=(
  "ftc10|runs/ftc10/20261121-012221-refine|NIST FTC-10 test part (showcase)"
  "ctc04|runs/ctc04_x0p2/20261121-012513-heldout|NIST CTC-04 test part at 0.2 scale (held-out validation)"
)
rm -rf "$OUT"
mkdir -p "$OUT"
for e in "${RUNS[@]}"; do
  IFS='|' read -r slug run label <<<"$e"
  src="$REPO/$run/report"
  [ -f "$src/index.html" ] || { echo "missing $src/index.html (build the report first)" >&2; exit 1; }
  mkdir -p "$OUT/$slug"
  # everything except the per-iteration programs
  (cd "$src" && find . -type f ! -path './iter/*/program.nc' ! -path './iter/*/program.txt' -print0 | \
     while IFS= read -r -d '' f; do mkdir -p "$OUT/$slug/$(dirname "$f")"; cp "$f" "$OUT/$slug/$f"; done)
done
python3 - "$OUT" "${RUNS[@]}" <<'EOF'
import html, json, re, sys
from pathlib import Path
out = Path(sys.argv[1])
cards = []
for e in sys.argv[2:]:
    slug, run, label = e.split("|")
    page = out / slug / "index.html"
    t = page.read_text()
    # iteration program links point at files the site leaves out: replace them with a short note
    t = re.sub(r'<a href="iter/\d+/program\.(?:txt|nc)"[^>]*>[^<]*</a>', "", t)
    t = re.sub(r'<a class="btn ghost" href="iter/\d+/program\.nc"[^>]*>[^<]*</a>', "", t)
    t = t.replace('<footer class="links">', '<footer class="links"><span class="muted">iteration G-code: in the repository run folder</span>', )
    page.write_text(t)
    m = re.search(r'<div class="tb-num">([^<]*)<span>', t)
    b = re.search(r'<span class="badge lg (\w+)">', t)
    cards.append((slug, label, m.group(1) if m else "", b.group(1) if b else ""))
rows = "".join(
    f'<a class="card" href="{s}/index.html"><span class="b {v}">{v.upper()}</span><b>{html.escape(l)}</b>'
    f'<span class="n">{n}% of the surface within ±0.1 mm</span></a>' for s, l, n, v in cards)
(out / "index.html").write_text(f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark">
<title>CNC-LLM: 3+2 machining by an LLM agent</title><style>
:root {{ --bg:#f6f6f4; --fg:#111214; --mut:#5d5e62; --card:#fff; --line:#e1e0d9; --good:#11753a; --bad:#b42323; }}
@media (prefers-color-scheme: dark) {{ :root {{ --bg:#0f1012; --fg:#f0efec; --mut:#a6a6a0; --card:#18191c; --line:#2c2d31; --good:#4cc47a; --bad:#f07a6e; }} }}
body {{ margin:0; background:var(--bg); color:var(--fg); font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif; }}
main {{ max-width:860px; margin:0 auto; padding:32px 16px; }} h1 {{ font-size:28px; margin:0 0 6px; }} p {{ color:var(--mut); margin:0 0 22px; }}
.card {{ display:grid; grid-template-columns:auto 1fr; gap:2px 12px; align-items:center; padding:16px 18px; margin:0 0 12px; background:var(--card);
  border:1px solid var(--line); border-radius:12px; color:inherit; text-decoration:none; }} .card:hover {{ border-color:#1f5fbf; }}
.b {{ grid-row:1/3; font:750 12px/1 system-ui; letter-spacing:.06em; color:#fff; padding:5px 9px; border-radius:6px; }}
.b.valid {{ background:var(--good); }} .b.invalid {{ background:var(--bad); }} .n {{ color:var(--mut); font-size:14px; }}
</style></head><body><main><h1>3+2 machining programs written by an LLM agent</h1>
<p>Each report replays the program on a simulated trunnion 5-axis machine and scores the whole part surface against ±0.1 mm.
Open one and press play.</p>{rows}</main></body></html>
""")
EOF
du -sh "$OUT"/* "$OUT"
