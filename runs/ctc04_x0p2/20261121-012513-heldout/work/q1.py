import re, sys, collections
L = open('/home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/work/program.nc').read().split('\n')
a, b = int(sys.argv[1]), int(sys.argv[2])
ylo, yhi, xlo, xhi = map(float, sys.argv[3:7])
c = collections.Counter()
for i in range(a - 1, b):
    s = L[i]
    if not s.startswith('G1'):
        continue
    m = dict(re.findall(r'([XYZ])(-?[\d.]+)', s))
    if len(m) < 3:
        continue
    x, y, z = float(m['X']), float(m['Y']), float(m['Z'])
    if ylo <= y <= yhi and xlo <= x <= xhi:
        c[(round(y, 3), round(z, 3))] += 1
for k, v in sorted(c.items()):
    print(k, v)
