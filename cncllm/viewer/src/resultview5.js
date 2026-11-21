// 3+2 final result: the target part coloured by the signed deviation of the simulated part over its whole surface
// (green in tolerance, orange -> dark red proud, blue gouge; the same colours as the simulator's plots), with the tab
// witness areas the part-off leaves in their own colour; or the machined part itself (exact intersection of the stock
// and every setup's height field) coloured by setup. Clicking a region (marker, table row or the surface) explains why
// it failed. Vise and stock ghosts can be toggled.
import * as THREE from 'three';
import { Stage } from './scene.js';
import { DEV5, devColor5, devGradient5CSS, hexRgb } from './colors.js';
import { buildGhost } from './simview.js';
import { Material5 } from './material5.js';
import { SETUP_PALETTE, armZoom, buildVise, setupLabel } from './simview5.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export class ResultView5 {
  constructor(D, els) {
    this.D = D;
    const meta = D.meta, tol = this.tol = meta.tolerance || 0.1;
    const st = this.stage = new Stage(els.view, meta.stock);
    st.plate.visible = false;
    armZoom(st, els.view);
    // the part (target bounding box), not the stock or the vise, frames the view
    const P = D.meshV;
    const lo = new THREE.Vector3(Infinity, Infinity, Infinity), hi = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    for (let i = 0; i < P.length; i += 3) { lo.min(new THREE.Vector3(P[i], P[i + 1], P[i + 2])); hi.max(new THREE.Vector3(P[i], P[i + 1], P[i + 2])); }
    this.partLo = lo; this.partHi = hi;
    st.fitLo = lo.clone(); st.fitHi = hi.clone();
    // frame the whole part when the view first scrolls in (unless the reader already moved the camera)
    this.touched = false;
    els.view.addEventListener('pointerdown', () => { this.touched = true; });
    // default camera: of the overview directions, the one that sees the most failed area (area-weighted region
    // normals), so a large failure on the underside or the back is not hidden behind a green front
    this.startView = this.bestView(D.meta.regions || []);
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { if (!this.touched) { st.resize(); this.view(this.startView, false); } io.disconnect(); } });
    io.observe(els.view);
    this.view(this.startView, false);
    const k = st.key.shadow.camera, s = st.diag * 1.1;
    Object.assign(k, { left: -s, right: s, top: s, bottom: -s, far: st.diag * 6 });
    k.updateProjectionMatrix();
    // target coloured by deviation; tab witness (score class 1, only in data scored under the whole-surface rule)
    this.hasCls = meta.mesh?.cls_kind === 'score';
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(D.meshV, 3));
    g.setIndex(new THREE.BufferAttribute(D.meshF, 1));
    g.computeVertexNormals();
    const nv = D.meshDev.length, col = new Float32Array(nv * 3), tmp = new THREE.Color();
    const WIT = hexRgb(DEV5.witness);
    let nWit = 0;
    for (let i = 0; i < nv; i++) {
      const w = this.hasCls && D.meshCls[i] === 1;
      if (w) nWit++;
      const c = w ? WIT : devColor5(D.meshDev[i], tol);
      tmp.setRGB(c[0], c[1], c[2], THREE.SRGBColorSpace);
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    }
    this.nWit = nWit;
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.target = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.1, roughness: 0.55, side: THREE.DoubleSide }));
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
    // vise and stock ghosts (the machine table slab would haze every view from below: not drawn here)
    this.vise = buildVise(meta.vise);
    this.vise.group.traverse((o) => { if (o.material) { o.material.transparent = true; o.material.opacity = o.isMesh ? 0.3 : 0.15; o.material.depthWrite = false; } if (o.isMesh) o.castShadow = false; });
    this.vise.group.traverse((o) => { if (o.userData.kind === 'table') o.visible = false; });
    st.scene.add(this.vise.group);
    const sl = new THREE.Vector3(...meta.stock.lo), sh = new THREE.Vector3(...meta.stock.hi);
    const sb = new THREE.BoxGeometry(sh.x - sl.x, sh.y - sl.y, sh.z - sl.z);
    sb.translate((sl.x + sh.x) / 2, (sl.y + sh.y) / 2, (sl.z + sh.z) / 2);
    this.stockGhost = new THREE.Group();
    const sm = new THREE.Mesh(sb, new THREE.MeshBasicMaterial({ color: 0xf0a030, transparent: true, opacity: 0.1, depthWrite: false }));
    const se = new THREE.LineSegments(new THREE.EdgesGeometry(sb), new THREE.LineBasicMaterial({ color: 0xe08a10 }));
    this.stockGhost.add(sm, se);
    this.stockGhost.visible = false;
    st.scene.add(this.stockGhost);
    this.mode = 'dev';
    this.buildBar(els.bar);
    this.buildMarkers(els.view);
    const sc = meta.score || {};
    if (sc.whole_surface_in_tol_pct != null) {
      const sum = document.createElement('div');
      sum.className = 'res-sum';
      const f = (v) => (v == null ? '–' : (+v).toFixed(2) + '%');
      sum.innerHTML = `<b>${f(sc.whole_surface_in_tol_pct)}</b> in tolerance · <span class="rs-p">${f(sc.whole_surface_proud_pct)} proud</span> · <span class="rs-g">${f(sc.whole_surface_gouge_pct)} gouged</span>` +
        `<div class="rs-v">Some failures face away from this view: use Below / Back, or click a region.</div>`;
      els.view.appendChild(sum);
    }
    this.buildCard(els.view);
    this.buildPick(els.view);
    st.onFrame = () => { this.placeMarkers(); return false; };
    els.view.querySelector('.vp-msg')?.remove();
    st.invalidate();
  }
  viewDirs() {
    const st = this.stage;
    return { iso: st.camera.aspect < 0.9 ? [-0.6, -1.0, 1.55] : [-0.85, -1.25, 1.05], top: [0, -0.0001, 1], front: [0, -1, 0.28], back: [0.0, 1, 0.28], right: [1, 0.0, 0.28], left: [-1, 0, 0.28], under: [-0.6, -1.0, -0.9], isoBack: [0.85, 1.25, 1.05] };
  }
  bestView(regs) {
    const dirs = this.viewDirs();
    let best = 'iso', bs = -Infinity;
    for (const k of ['iso', 'under', 'isoBack']) {
      const v = new THREE.Vector3(...dirs[k]).normalize();
      let s = 0;
      for (const r of regs) { const n = r.normal || [0, 0, 1]; s += (r.area_mm2 || 0) * Math.max(0, v.x * n[0] + v.y * n[1] + v.z * n[2]); }
      if (k === 'iso') s *= 1.15;   // prefer the usual view unless another shows clearly more failure
      if (s > bs) { bs = s; best = k; }
    }
    return best;
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
    const dirs = this.viewDirs();
    const v = new THREE.Vector3(...(dirs[name] || dirs.iso)).normalize();
    const { pos, target } = st.fitBox(v, this.partLo, this.partHi, name === 'top' ? 1.06 : 1.15);
    st.flyTo(pos, target, animate);
    if (this.markers) this.markers.forEach((m) => m.el.classList.remove('active'));
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
        <div class="cb-title">Signed deviation of the machined part from the target surface (mm). Anything not green is out of tolerance.</div>
        <div class="cb-grad" style="background:${devGradient5CSS(t)}"></div>
        <div class="cb-ticks">${ticks.map((v) => `<span style="left:${50 + v * 50}%">${v === 0 ? '±' + t : (v > 0 ? '+' : '') + (Math.abs(v) < 1 ? v.toFixed(1) : v.toFixed(0))}</span>`).join('')}</div>
        <div class="cb-ends"><span>◀ gouge (cut too deep)</span><span class="mid">in tolerance</span><span>proud (material left) ▶</span></div>
        <div class="cls-legend">
          <span><i class="sw" style="background:${DEV5.ok}"></i>in tolerance (±${t} mm)</span>
          <span><i class="sw" style="background:linear-gradient(90deg, ${DEV5.proudLo}, ${DEV5.proudHi})"></i>proud: failed, material left</span>
          <span><i class="sw" style="background:${DEV5.gouge}"></i>gouge: failed, cut too deep</span>
          <span><i class="sw" style="background:${DEV5.witness}"></i>tab witness: where a part-off tab joins the part${this.hasCls ? (this.nWit ? '' : ' (none on this part)') : ' (not measured in this run)'}</span>
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
  regionPoint(r) {
    const b = r.bbox, nn = r.normal || [0, 0, 1];
    // pin on the bbox face the region's mean normal points out of
    const c = [(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2];
    const ax = [0, 1, 2].reduce((a, i) => (Math.abs(nn[i]) > Math.abs(nn[a]) ? i : a), 2);
    c[ax] = nn[ax] >= 0 ? b[ax + 3] : b[ax];
    return new THREE.Vector3(...c);
  }
  buildMarkers(view) {
    const layer = this.markerLayer = document.createElement('div');
    layer.className = 'markers';
    view.appendChild(layer);
    this.regions = this.D.meta.regions || [];
    this.markers = this.regions.slice(0, 12).map((r) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'marker ' + r.type;
      el.textContent = 'R' + r.id;
      el.title = `R${r.id}: ${r.type} ${r.area_mm2} mm², worst ${r.dev_extreme > 0 ? '+' : ''}${r.dev_extreme} mm`;
      el.onclick = () => this.focusRegion(r.id, false);
      layer.appendChild(el);
      return { r, el, p: this.regionPoint(r) };
    });
  }
  placeMarkers() {
    if (this.markerLayer.hidden) return;
    for (const mk of this.markers) {
      const s = this.stage.project(mk.p);
      mk.el.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px)`;
      mk.el.hidden = s.behind;
    }
    if (this.focus && !this.card.hidden) {
      const s = this.stage.project(this.focus);
      this.pin.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px)`;
      this.pin.hidden = s.behind;
    }
  }
  buildCard(view) {
    const c = this.card = document.createElement('div');
    c.className = 'region-card';
    c.hidden = true;
    c.setAttribute('role', 'dialog');
    c.setAttribute('aria-label', 'Region details');
    view.appendChild(c);
    const pin = this.pin = document.createElement('div');
    pin.className = 'region-pin';
    pin.hidden = true;
    view.appendChild(pin);
  }
  showCard(r) {
    const segs = this.D.segs, fr2seg = {};
    segs.forEach((s, i) => { if (!(s.frame in fr2seg)) fr2seg[s.frame] = i + 1; });
    const passes = (r.nearest_passes || []).slice(0, 5).map((p) => `<button class="gl" type="button" data-gline="${p.line}" title="T${p.tool}, setup ${fr2seg[p.frame] ?? '?'}, missed by ${p.gap_mm} mm">${p.line}</button>`).join(' ');
    const why = r.type === 'gouge' ? 'cut too deep: the surface is below the target' : 'material left: no pass finished this surface to size';
    this.card.innerHTML = `<button type="button" class="rc-x" aria-label="Close">×</button>
      <div class="rc-h"><span class="pill ${esc(r.type)}">${esc(r.type)}</span> <b>R${r.id}</b> · ${r.area_mm2} mm² · worst ${r.dev_extreme > 0 ? '+' : ''}${(+r.dev_extreme).toFixed(3)} mm</div>
      <div class="rc-why">Failed: ${why}.</div>
      ${r.hint ? `<div class="rc-hint"><b>Why:</b> ${esc(r.hint)}</div>` : ''}
      <div class="rc-f muted">${esc((r.faces || []).slice(0, 3).join(', '))}</div>
      ${passes ? `<div class="rc-p"><span class="muted">Nearest passes (G-code line):</span> ${passes}</div>` : '<div class="rc-p muted">No pass of the program came near this region.</div>'}`;
    this.card.hidden = false;
    this.card.querySelector('.rc-x').onclick = () => { this.card.hidden = true; this.pin.hidden = true; this.markers.forEach((m) => m.el.classList.remove('active')); };
  }
  focusRegion(id, scroll = true) {
    const r = this.regions.find((x) => x.id === id);
    if (!r) return;
    if (scroll) this.stage.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (this.mode !== 'dev') this.setMode('dev');
    const b = r.bbox, nn = r.normal || [0, 0, 1];
    const c = new THREE.Vector3((b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2);
    const ext = Math.max(b[3] - b[0], b[4] - b[1], b[5] - b[2], 6);
    const dir = new THREE.Vector3(...nn).normalize().add(new THREE.Vector3(-0.3, -0.4, 0.4)).normalize();
    this.touched = true;
    this.stage.flyTo(c.clone().addScaledVector(dir, ext * 1.6 + this.stage.diag * 0.3), c);
    this.markers.forEach((m) => m.el.classList.toggle('active', m.r.id === id));
    this.focus = this.regionPoint(r);
    this.showCard(r);
    this.stage.invalidate();
  }
  // nearest region (by bounding box) to a picked surface point
  regionAt(p) {
    let best = null, bd = Infinity;
    for (const r of this.regions) {
      const b = r.bbox;
      const dx = Math.max(b[0] - p.x, 0, p.x - b[3]), dy = Math.max(b[1] - p.y, 0, p.y - b[4]), dz = Math.max(b[2] - p.z, 0, p.z - b[5]);
      const d = Math.hypot(dx, dy, dz);
      if (d < bd) { bd = d; best = r; }
    }
    return bd < 1.5 ? best : null;
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
      if (e.target.closest('.marker, .region-card') || this.mode !== 'dev') return;
      const r = view.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, this.stage.camera);
      const hit = ray.intersectObject(this.target, false)[0];
      if (!hit) { tip.hidden = true; return; }
      const p = hit.point, f = hit.face, D = this.D;
      const bary = new THREE.Vector3();
      THREE.Triangle.getBarycoord(p, new THREE.Vector3().fromArray(D.meshV, f.a * 3), new THREE.Vector3().fromArray(D.meshV, f.b * 3), new THREE.Vector3().fromArray(D.meshV, f.c * 3), bary);
      const d = D.meshDev[f.a] * bary.x + D.meshDev[f.b] * bary.y + D.meshDev[f.c] * bary.z;
      const wit = this.hasCls && D.meshCls[f.a] === 1;
      const kind = wit ? 'tab witness (where a part-off tab joins the part)' : d > this.tol ? 'proud: failed, material left' : d < -this.tol ? 'gouge: failed, cut too deep' : 'in tolerance';
      const reg = (!wit && Math.abs(d) > this.tol) ? this.regionAt(p) : null;
      tip.innerHTML = `<b>${d > 0 ? '+' : ''}${d.toFixed(3)} mm</b> ${kind}<br><span class="mono">X${p.x.toFixed(2)} Y${p.y.toFixed(2)} Z${p.z.toFixed(2)}</span>${reg ? `<br>part of region R${reg.id}` : ''}`;
      tip.style.transform = `translate(${Math.min(e.clientX - r.left + 12, r.width - 270)}px, ${e.clientY - r.top + 12}px)`;
      tip.hidden = false;
      if (reg) { this.focus = this.regionPoint(reg); this.showCard(reg); this.markers.forEach((m) => m.el.classList.toggle('active', m.r.id === reg.id)); }
    });
  }
}
