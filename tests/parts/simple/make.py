import cadquery as cq, json, pathlib
d = pathlib.Path(__file__).parent
p = (cq.Workplane().box(40, 30, 10, centered=(True, True, False))
     .faces(">Z").workplane().rect(20, 10).cutBlind(-3)
     .edges("|Z and (not <X) and (not >X) and (not <Y) and (not >Y)").fillet(3.0))
cq.exporters.export(p, str(d / "part.step"))
json.dump({"name": "simple", "x": [-22, 22], "y": [-17, 17], "z": [0, 11], "material": "AL6061-T6"}, open(d / "stock.json", "w"))
