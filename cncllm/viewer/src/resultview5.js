// 3+2 final result: the target part coloured by the signed deviation of the simulated part (blue gouge / green in
// tolerance / red proud), with the surface no 3+2 direction reaches (hatched grey) and the parting face that is
// hand-finished after the part-off (tan) shown as excluded classes; or the machined part itself (exact intersection of
// the stock and every setup's height field) coloured by setup. Vise / table and stock ghosts can be toggled.
import * as THREE from 'three';
import { Stage } from './scene.js';
import { devColor, devGradientCSS, hexRgb } from './colors.js';
import { buildGhost } from './simview.js';
import { Material5 } from './material5.js';
import { SETUP_PALETTE, armZoom, buildVise, setupLabel } from './simview5.js';

export const CLS5 = { parting: '#c9a46c', unreach: '#8e939c' };

function hatchMaterial(opts) {
  const m = new THREE.MeshStandardMaterial(opts);
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aHatch;\nvarying float vHatch;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvHatch = aHatch;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vHatch;')
      .replace('#include <color_fragment>', '#include <color_fragment>\nif (vHatch > 0.5 && mod(gl_FragCoord.x + gl_FragCoord.y, 9.0) < 3.5) diffuseColor.rgb *= 0.55;');
  };
  return m;
}

export class ResultView5 {
  constructor(D, els) {
    this.D = D;
    const meta = D.meta, tol = this.tol = meta.tolerance || 0.1;
    const st = this.stage = new Stage(els.view, meta.stock);
    st.plate.visible = false;
    armZoom(st, els.view);
    // frame the whole part when the view first scrolls in (unless the reader already moved the camera)
    this.touched = false;
    els.view.addEventListener('pointerdown', () => { this.touched = true; });
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { if (!this.touched) { st.resize(); this.view('iso', false); } io.disconnect(); } });
    io.observe(els.view);
    const lo = new THREE.Vector3(...meta.stock.lo), hi = new THREE.Vector3(...meta.stock.hi);
    this.partLo = lo.clone(); this.partHi = hi.clone();
    for (const b of meta.vise || []) if (b.kind === 'jaw') { lo.min(new THREE.Vector3(...b.lo)); hi.max(new THREE.Vector3(...b.hi)); }
    st.fitLo = this.partLo.clone(); st.fitHi = this.partHi.clone();
    st.view('iso', false);
    const k = st.key.shadow.camera, s = st.diag * 1.1;
    Object.assign(k, { left: -s, right: s, top: s, bottom: -s, far: st.diag * 6 });
    k.updateProjectionMatrix();
    // target coloured by deviation / class
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(D.meshV, 3));
    g.setIndex(new THREE.BufferAttribute(D.meshF, 1));
    g.computeVertexNormals();
    const nv = D.meshDev.length, col = new Float32Array(nv * 3), hatch = new Float32Array(nv);
    const PART = hexRgb(CLS5.parting), UNR = hexRgb(CLS5.unreach), tmp = new THREE.Color();
    for (let i = 0; i < nv; i++) {
      const c = D.meshCls[i] === 1 ? PART : D.meshCls[i] === 2 ? UNR : devColor(D.meshDev[i], tol);
      tmp.setRGB(c[0], c[1], c[2], THREE.SRGBColorSpace);
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
      hatch[i] = D.meshCls[i] === 2 ? 1 : 0;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aHatch', new THREE.BufferAttribute(hatch, 1));
    this.target = new THREE.Mesh(g, hatchMaterial({ vertexColors: true, metalness: 0.1, roughness: 0.55, side: THREE.DoubleSide }));
    this.target.castShadow = true; this.target.receiveShadow = true;
    st.scene.add(this.target);
    // machined part: every setup final
    const toolRGB = [];
    this.mach = new Material5(st.renderer, D.segs, meta.stock, toolRGB, SETUP_PALETTE.map(hexRgb));
    D.segs.forEach((sg, i) => { if (sg.grid) this.mach.write(i, sg.finalH, sg.finalOwn); });
    this.mach.setActive(D.segs.length);
    this.mach.setMode(1);
    this.mach.group.visible = false;
    st.scene.add(this.mach.group);
    this.machMats = [];
    this.mach.group.traverse((o) => { if (o.isMesh) this.machMats.push(o.material); });
    this.ghost = buildGhost(D);
    this.ghost.visible = false;
    st.scene.add(this.ghost);
    // vise / table and stock ghosts
    this.vise = buildVise(meta.vise);
    this.vise.group.traverse((o) => { if (o.material) { o.material.transparent = true; o.material.opacity = o.isMesh ? 0.3 : 0.15; o.material.depthWrite = false; } if (o.isMesh) o.castShadow = false; });
    // the machine table is huge and would haze every view from below: only the jaws and the vise body here
    this.vise.group.traverse((o) => { if (o.userData.kind === 'table') o.visible = false; });
    st.scene.add(this.vise.group);
    const bg = new THREE.BoxGeometry(hi.x - lo.x, 1, 1);
    const sl = this.partLo, sh = this.partHi;
    const sb = new THREE.BoxGeometry(sh.x - sl.x, sh.y - sl.y, sh.z - sl.z);
    sb.translate((sl.x + sh.x) / 2, (sl.y + sh.y) / 2, (sl.z + sh.z) / 2);
    bg.dispose();
    this.stockGhost = new THREE.Group();
    const sm = new THREE.Mesh(sb, new THREE.MeshBasicMaterial({ color: 0xf0a030, transparent: true, opacity: 0.1, depthWrite: false }));
    const se = new THREE.LineSegments(new THREE.EdgesGeometry(sb), new THREE.LineBasicMaterial({ color: 0xe08a10 }));
    this.stockGhost.add(sm, se);
    this.stockGhost.visible = false;
    st.scene.add(this.stockGhost);
    this.mode = 'dev';
    this.buildBar(els.bar);
    this.buildMarkers(els.view);
    this.buildPick(els.view);
    st.onFrame = () => { this.placeMarkers(); return false; };
    els.view.querySelector('.vp-msg')?.remove();
    st.invalidate();
  }
  setGhostMach(on) {
    for (const m of this.machMats) {
      m.transparent = on; m.opacity = on ? 0.35 : 1; m.depthWrite = !on; m.needsUpdate = true;
    }
  }
  setMode(m) {
    this.mode = m;
    this.target.visible = m === 'dev';
    this.bar.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
    this.bar.querySelector('.ovl-label').textContent = m === 'dev' ? 'machined part overlay' : 'target part overlay';
    this.bar.querySelector('.ovl-sw').style.background = m === 'dev' ? '#9aa3ad' : '#2f8cff';
    this.bar.querySelector('.dev-legend').hidden = m !== 'dev';
    this.bar.querySelector('.mach-legend').hidden = m !== 'mach';
    this.applyOverlay();
    this.stage.invalidate();
  }
  applyOverlay() {
    const on = this.bar.querySelector('.ovl').checked;
    this.ghost.visible = on && this.mode === 'mach';
    this.mach.group.visible = this.mode === 'mach' || on;
    this.setGhostMach(this.mode === 'dev' && on);
    this.stage.invalidate();
  }
  view(name, animate = true) {
    const st = this.stage;
    const dirs = { iso: st.camera.aspect < 0.9 ? [-0.6, -1.0, 1.55] : [-0.85, -1.25, 1.05], top: [0, -0.0001, 1], front: [0, -1, 0.28], back: [0.0, 1, 0.28], right: [1, 0.0, 0.28], left: [-1, 0, 0.28], under: [-0.6, -1.0, -0.9] };
    const v = new THREE.Vector3(...(dirs[name] || dirs.iso)).normalize();
    const box = [this.partLo, this.partHi];
    const { pos, target } = st.fitBox(v, box[0], box[1], name === 'top' ? 1.06 : 1.12);
    st.flyTo(pos, target, animate);
  }
  buildBar(bar) {
    this.bar = bar;
    const t = this.tol, D = this.D;
    const ticks = [-1, -0.5, 0, 0.5, 1];
    bar.innerHTML = `
      <div class="res-ctl">
        <span class="seg" role="group" aria-label="Result display">
          <button type="button" data-mode="dev" aria-pressed="true">Deviation on target</button>
          <button type="button" data-mode="mach" aria-pressed="false">Machined part (by setup)</button>
        </span>
        <label class="chk"><input type="checkbox" class="ovl"> <i class="sw ovl-sw" style="background:#9aa3ad"></i><span class="ovl-label">machined part overlay</span></label>
        <label class="chk"><input type="checkbox" class="vise" checked> <i class="sw" style="background:#6f7c8c"></i>vise</label>
        <label class="chk"><input type="checkbox" class="stk"> <i class="sw" style="background:#f0a030"></i>stock outline</label>
        <label class="chk"><input type="checkbox" class="mk" checked> region labels</label>
        <span class="seg views" role="group" aria-label="View"><button type="button" data-view="iso" title="Reset to the isometric overview">Iso</button><button type="button" data-view="top">Top</button><button type="button" data-view="front">Front</button><button type="button" data-view="back">Back</button><button type="button" data-view="right">Side</button><button type="button" data-view="under">Below</button></span>
      </div>
      <div class="cbar dev-legend">
        <div class="cb-title">Signed deviation of the machined part at the target surface (mm)</div>
        <div class="cb-grad" style="background:${devGradientCSS(t)}"></div>
        <div class="cb-ticks">${ticks.map((v) => `<span style="left:${50 + v * 50}%">${v === 0 ? '±' + t : (v > 0 ? '+' : '') + (Math.abs(v) < 1 ? v.toFixed(1) : v.toFixed(0))}</span>`).join('')}</div>
        <div class="cb-ends"><span>◀ gouge (too deep)</span><span class="mid">in tolerance</span><span>proud (left) ▶</span></div>
        <div class="cls-legend">
          <span><i class="sw hatch" style="background:${CLS5.unreach}"></i>not reachable in 3+2 – needs simultaneous 5-axis or a smaller tool (reported separately, not in the score)</span>
          <span><i class="sw" style="background:${CLS5.parting}"></i>parting face – sawn / broken off and hand-finished after the part-off (not scored)</span>
        </div>
      </div>
      <div class="cbar mach-legend" hidden>
        <div class="cb-title">Machined part = stock ∩ every setup's cut, coloured by the setup that cut each surface last</div>
        <div class="cls-legend setup-legend">${D.segs.map((s, i) => `<span><i class="sw" style="background:${SETUP_PALETTE[i % SETUP_PALETTE.length]}"></i>${i + 1} · ${setupLabel(s)}</span>`).join('')}<span><i class="sw" style="background:#8c9097"></i>uncut stock face</span></div>
      </div>`;
    bar.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => this.setMode(b.dataset.mode)));
    bar.querySelector('.ovl').onchange = () => this.applyOverlay();
    bar.querySelector('.vise').onchange = (e) => { this.vise.group.visible = e.target.checked; this.stage.invalidate(); };
    bar.querySelector('.stk').onchange = (e) => { this.stockGhost.visible = e.target.checked; this.stage.invalidate(); };
    bar.querySelector('.mk').onchange = (e) => { this.markerLayer.hidden = !e.target.checked; };
    bar.querySelectorAll('[data-view]').forEach((b) => (b.onclick = () => this.view(b.dataset.view)));
  }
  buildMarkers(view) {
    const layer = this.markerLayer = document.createElement('div');
    layer.className = 'markers';
    view.appendChild(layer);
    this.markers = (this.D.meta.regions || []).slice(0, 12).map((r) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'marker ' + r.type;
      el.textContent = 'R' + r.id;
      el.title = `R${r.id}: ${r.type} ${r.area_mm2} mm², worst ${r.dev_extreme > 0 ? '+' : ''}${r.dev_extreme} mm`;
      el.onclick = () => this.focusRegion(r.id, false);
      layer.appendChild(el);
      const b = r.bbox, nn = r.normal || [0, 0, 1];
      // pin on the bbox face the region's mean normal points out of
      const c = [(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2];
      const ax = [0, 1, 2].reduce((a, i) => (Math.abs(nn[i]) > Math.abs(nn[a]) ? i : a), 2);
      c[ax] = nn[ax] >= 0 ? b[ax + 3] : b[ax];
      return { r, el, p: new THREE.Vector3(...c) };
    });
  }
  placeMarkers() {
    if (this.markerLayer.hidden) return;
    for (const mk of this.markers) {
      const s = this.stage.project(mk.p);
      mk.el.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px)`;
      mk.el.hidden = s.behind;
    }
  }
  focusRegion(id, scroll = true) {
    const mk = this.markers.find((m) => m.r.id === id);
    if (!mk) return;
    if (scroll) this.stage.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (this.mode !== 'dev') this.setMode('dev');
    const b = mk.r.bbox, nn = mk.r.normal || [0, 0, 1];
    const c = new THREE.Vector3((b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2);
    const ext = Math.max(b[3] - b[0], b[4] - b[1], b[5] - b[2], 6);
    const dir = new THREE.Vector3(...nn).normalize().add(new THREE.Vector3(-0.3, -0.4, 0.4)).normalize();
    this.touched = true;
    this.stage.flyTo(c.clone().addScaledVector(dir, ext * 1.6 + this.stage.diag * 0.3), c);
    this.markers.forEach((m) => m.el.classList.toggle('active', m === mk));
  }
  buildPick(view) {
    const tip = this.tip = document.createElement('div');
    tip.className = 'pick-tip';
    tip.hidden = true;
    view.appendChild(tip);
    const ray = new THREE.Raycaster();
    let down = null;
    view.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
    view.addEventListener('pointerup', (e) => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 4) return;
      if (e.target.closest('.marker') || this.mode !== 'dev') return;
      const r = view.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, this.stage.camera);
      const hit = ray.intersectObject(this.target, false)[0];
      if (!hit) { tip.hidden = true; return; }
      const p = hit.point, f = hit.face, D = this.D;
      const bary = new THREE.Vector3();
      THREE.Triangle.getBarycoord(p, new THREE.Vector3().fromArray(D.meshV, f.a * 3), new THREE.Vector3().fromArray(D.meshV, f.b * 3), new THREE.Vector3().fromArray(D.meshV, f.c * 3), bary);
      const d = D.meshDev[f.a] * bary.x + D.meshDev[f.b] * bary.y + D.meshDev[f.c] * bary.z;
      const cls = D.meshCls[f.a];
      const kind = cls === 2 ? 'not reachable in 3+2 (excluded)' : cls === 1 ? 'parting face (hand-finished)' :
        d > this.tol ? 'proud' : d < -this.tol ? 'gouge' : 'in tolerance';
      tip.innerHTML = `<b>${d > 0 ? '+' : ''}${d.toFixed(3)} mm</b> ${kind}<br><span class="mono">X${p.x.toFixed(2)} Y${p.y.toFixed(2)} Z${p.z.toFixed(2)}</span>`;
      tip.style.transform = `translate(${e.clientX - r.left + 12}px, ${e.clientY - r.top + 12}px)`;
      tip.hidden = false;
    });
  }
}
