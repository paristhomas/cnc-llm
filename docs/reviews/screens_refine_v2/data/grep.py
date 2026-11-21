import sys, json
sys.path.insert(0, "/home/paris/cnc-llm/tools")
from review_report import grep_report
from pathlib import Path
for r in sys.argv[1:]:
    g = grep_report(Path(r))
    print(r, "forbidden:", len(g["forbidden_hits"]), "allowed:", len(g["allowed_hits"]), "model:", len(g["model_id_hits"]))
    for h in g["forbidden_hits"] + g["model_id_hits"]:
        print("  ", h["file"], h["line"], h["match"], "|", h["context"][:170])
