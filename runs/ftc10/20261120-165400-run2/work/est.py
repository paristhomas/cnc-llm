import re,numpy as np,sys
L=open(sys.argv[1] if len(sys.argv)>1 else 'program.nc').read().split('\n')
pos=np.array([0,0,150.]);F=1;t=0;byF={};n0=0
for l in L:
    m=dict(re.findall(r'([XYZF])(-?[\d.]+)',l))
    if 'F' in m: F=float(m['F'])
    if l.startswith('G1') or l.startswith('G0'):
        p=pos.copy()
        for i,k in enumerate('XYZ'):
            if k in m: p[i]=float(m[k])
        d=np.linalg.norm(p-pos)
        if l.startswith('G1'): t+=d/F; byF[F]=byF.get(F,0)+d
        else: n0+=1
        pos=p
    if l.startswith('(') : print(l, round(t,1),'min', n0)
print({k:int(v) for k,v in byF.items()}, len(L))
