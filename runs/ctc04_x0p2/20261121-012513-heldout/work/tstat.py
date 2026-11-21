import re, math, collections
L = open('/home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/work/program.nc').read().split('\n')
pos = [0, 0, 150]; F = 1000; tool = None; sec = 'start'
t = collections.OrderedDict()
for s in L:
    if 'M6' in s:
        sec = s.strip(); t.setdefault(sec, 0.0)
    if s.startswith('G68.2'):
        pos = [0, 0, 150]
    m = dict(re.findall(r'([XYZIF])(-?[\d.]+)', s))
    if not (s.startswith('G0') or s.startswith('G1') or s.startswith('G2') or s.startswith('G3')):
        continue
    new = [float(m.get('X', pos[0])), float(m.get('Y', pos[1])), float(m.get('Z', pos[2]))]
    if 'F' in m:
        F = float(m['F'])
    d = math.dist(pos, new)
    if s.startswith('G0'):
        dt = d / 20000
    elif s.startswith('G1'):
        dt = d / F
    else:
        r = abs(float(m.get('I', 0)))
        dt = math.hypot(2 * math.pi * r, new[2] - pos[2]) / F
    t[sec] = t.get(sec, 0) + dt
    pos = new
for k, v in t.items():
    print('%7.1f min  %s' % (v, k))
print('total %.1f' % sum(t.values()))
