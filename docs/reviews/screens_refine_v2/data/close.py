"""Close look at small regions after the page's own focusRegion: markers/pin hidden, camera dollied in."""
import json, sys
from pathlib import Path
sys.path.insert(0, "/home/paris/cnc-llm/tools")
from review_report import GL_ARGS
from playwright.sync_api import sync_playwright

RUN = Path(sys.argv[1]); OUT = Path(sys.argv[2]); TAG = sys.argv[3]; IDS = [int(x) for x in sys.argv[4].split(",")]
url = (RUN / "report/index.html").resolve().as_uri()
res = {}


def frames(pg):
    for _ in range(3):
        f0 = pg.evaluate("() => { const s = window.CNCViewer.result.stage; s.invalidate(); return s.frames || 0; }")
        try:
            pg.wait_for_function(f"() => (window.CNCViewer.result.stage.frames || 0) > {f0}", timeout=90000)
        except Exception:
            pass


with sync_playwright() as p:
    b = p.chromium.launch(args=GL_ARGS)
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.set_default_timeout(240000)
    pg.goto(url)
    pg.wait_for_function("() => window.CNCViewer && window.CNCViewer.ready", timeout=180000)
    pg.evaluate("() => document.getElementById('result').scrollIntoView()")
    pg.wait_for_function("() => window.CNCViewer.result && window.CNCViewer.result.stage", timeout=120000)
    pg.add_style_tag(content=".toc{position:static!important}")
    for rid in IDS:
        pg.evaluate(f"() => window.CNCViewer.result.focusRegion({rid}, false)")
        pg.wait_for_timeout(1500); frames(pg)
        info = pg.evaluate("""() => { const r = window.CNCViewer.result, s = r.stage;
            return {dist: s.camera.position.distanceTo(s.controls.target), diag: s.diag}; }""")
        for k, f in (("page", 1.0), ("x3", 0.33)):
            pg.evaluate(f"""() => {{ const r = window.CNCViewer.result, s = r.stage;
                document.querySelector('#resview .markers').style.visibility = '{'hidden' if f < 1 else 'visible'}';
                r.pin.style.visibility = '{'hidden' if f < 1 else 'visible'}'; r.card.style.visibility = '{'hidden' if f < 1 else 'visible'}';
                const t = s.controls.target.clone(); const d = s.camera.position.clone().sub(t);
                if ({f} < 1) {{ s.camera.position.copy(t.clone().add(d.multiplyScalar({f}))); s.controls.update(); }}
                s.invalidate(); }}""")
            pg.wait_for_timeout(800); frames(pg)
            box = pg.query_selector("#resview").bounding_box()
            pg.screenshot(path=str(OUT / f"{TAG}_close_R{rid}_{k}.png"), clip=box)
        pg.evaluate("""() => { const r = window.CNCViewer.result; document.querySelector('#resview .markers').style.visibility='visible';
            r.pin.style.visibility='visible'; r.card.style.visibility='visible'; }""")
        res[rid] = info
    (OUT / f"{TAG}_close.json").write_text(json.dumps(res))
    b.close()
print("DONE")
