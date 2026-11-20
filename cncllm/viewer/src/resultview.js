// Final result: target mesh coloured by signed deviation (blue gouge / green in tolerance / red proud; undercut hatched
// grey, tool-limited violet, datum neutral) or the simulated machined surface coloured by height error vs the target.
import * as THREE from 'three';
import { Stage } from './scene.js';
import { StockMesh } from './stockmesh.js';
import { DEV, classColor, devColor, devGradientCSS } from './colors.js';
import { buildGhost } from './simview.js';

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

export class ResultView {
  constructor(D, els, onReady) {
    this.D = D;
    const meta = D.meta, tol = this.tol = meta.tolerance || 0.1;
    const st = this.stage = new Stage(els.view, meta.stock);
    // target coloured by deviation
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(D.meshV, 3));
    g.setIndex(new THREE.BufferAttribute(D.meshF, 1));
    g.computeVertexNormals();
    const nv = D.meshDev.length;
    const col = new Float32Array(nv * 3), hatch = new Float32Array(nv);
    for (let i = 0; i < nv; i++) {
      const c = classColor(D.meshCls[i]) || devColor(D.meshDev[i], tol);
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
      hatch[i] = D.meshCls[i] === 2 ? 1 : 0;
    }
    // colours are authored in sRGB; convert to linear for the renderer
    const tmp = new THREE.Color();
    for (let i = 0; i < nv; i++) { tmp.setRGB(col[i * 3], col[i * 3 + 1], col[i * 3 + 2], THREE.SRGBColorSpace); col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b; }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aHatch', new THREE.BufferAttribute(hatch, 1));
    this.target = new THREE.Mesh(g, hatchMaterial({ vertexColors: true, metalness: 0.1, roughness: 0.55, side: THREE.DoubleSide }));
    this.target.castShadow = true; this.target.receiveShadow = true;
    st.scene.add(this.target);
    // machined surface coloured by height error
    this.mmat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.25, roughness: 0.5, flatShading: true });
    this.machined = new StockMesh(meta.grid, meta.stock, this.mmat);
    this.machined.mode = 'error'; this.machined.tol = tol;
    this.machined.update(D.H, null, D.Ht, 0, meta.grid.ny - 1, true);
    st.scene.add(this.machined.group);
    this.machined.group.visible = false;
    this.ghost = buildGhost(D);
    this.ghost.visible = false;
    st.scene.add(this.ghost);
    // machined stock as a faint ghost over the deviation view
    this.stockGhostMat = new THREE.MeshStandardMaterial({ color: 0xf0a030, emissive: 0x5a3200, transparent: true, opacity: 0.4, depthWrite: false, flatShading: true, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
    this.mode = 'dev';
    this.buildBar(els.bar);
    this.buildMarkers(els.view);
    this.buildPick(els.view);
    st.onFrame = () => { this.placeMarkers(); return false; };
    els.view.querySelector('.vp-msg')?.remove();
    st.invalidate();
    onReady && onReady(this);
  }
  setMode(m) {
    this.mode = m;
    this.target.visible = m === 'dev';
    this.machined.group.visible = m === 'mach';
    this.bar.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
    this.bar.querySelector('.ovl-label').textContent = m === 'dev' ? 'machined stock overlay' : 'target part overlay';
    this.bar.querySelector('.ovl-sw').style.background = m === 'dev' ? '#f0a030' : '#2f8cff';
    this.bar.querySelector('.wall-legend').hidden = m !== 'mach';
    this.applyOverlay();
    this.bar.querySelector('.cls-legend').hidden = m !== 'dev';
    this.bar.querySelector('.cb-title').textContent = m === 'dev' ? 'Signed deviation of the machined part at the target surface (mm)' : 'Machined top minus target top, seen from above (mm)';
    this.stage.invalidate();
  }
  applyOverlay() {
    const on = this.bar.querySelector('.ovl').checked;
    this.ghost.visible = on && this.mode === 'mach';
    if (on && this.mode === 'dev') {
      this.machined.group.visible = true;
      this.machined.top.material = this.stockGhostMat; this.machined.skirt.material = this.stockGhostMat; this.machined.bottom.visible = false;
    } else {
      this.machined.top.material = this.mmat; this.machined.skirt.material = this.machined.skirtMat; this.machined.bottom.visible = true;
      this.machined.group.visible = this.mode === 'mach';
    }
    this.stage.invalidate();
  }
  buildBar(bar) {
    this.bar = bar;
    const t = this.tol;
    const ticks = [-1, -0.5, 0, 0.5, 1];
    bar.innerHTML = `
      <div class="res-ctl">
        <span class="seg" role="group" aria-label="Result display">
          <button type="button" data-mode="dev" aria-pressed="true">Deviation on target</button>
          <button type="button" data-mode="mach" aria-pressed="false">Machined surface</button>
        </span>
        <label class="chk"><input type="checkbox" class="ovl"> <i class="sw ovl-sw" style="background:#f0a030"></i><span class="ovl-label">machined stock overlay</span></label>
        <label class="chk"><input type="checkbox" class="mk" checked> region labels</label>
        <span class="seg views" role="group" aria-label="View"><button type="button" data-view="iso" title="Reset to the isometric overview">Reset / Iso</button><button type="button" data-view="top">Top</button><button type="button" data-view="front">Front</button></span>
      </div>
      <div class="cbar">
        <div class="cb-title">Signed deviation of the machined part at the target surface (mm)</div>
        <div class="cb-grad" style="background:${devGradientCSS(t)}"></div>
        <div class="cb-ticks">${ticks.map((v) => `<span style="left:${50 + v * 50}%">${v === 0 ? '±' + t : (v > 0 ? '+' : '') + (Math.abs(v) < 1 ? v.toFixed(1) : v.toFixed(0))}</span>`).join('')}</div>
        <div class="cb-ends"><span>◀ gouge (too deep)</span><span class="mid">in tolerance</span><span>proud (left) ▶</span></div>
        <div class="cls-legend">
          <span><i class="sw hatch" style="background:${DEV.undercut}"></i>undercut – not reachable from +Z (excluded)</span>
          <span><i class="sw" style="background:${DEV.limited}"></i>tool-limited – needs a smaller tool than the library (excluded)</span>
          <span><i class="sw" style="background:${DEV.datum}"></i>datum face (stock bottom)</span>
        </div>
        <div class="cls-legend wall-legend" hidden><span><i class="sw" style="background:#9a9ea6"></i>steep wall – a top-down height error is not meaningful there; walls are judged in the deviation view</span></div>
      </div>`;
    bar.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => this.setMode(b.dataset.mode)));
    bar.querySelector('.ovl').onchange = () => this.applyOverlay();
    bar.querySelector('.mk').onchange = (e) => { this.markerLayer.hidden = !e.target.checked; };
    bar.querySelectorAll('[data-view]').forEach((b) => (b.onclick = () => this.stage.view(b.dataset.view)));
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
      el.title = `R${r.id}: ${r.type} ${r.area_mm2} mm², worst ${r.dev_extreme > 0 ? '+' : ''}${r.dev_extreme} mm (${r.surface})`;
      el.onclick = () => this.focusRegion(r.id, false);
      layer.appendChild(el);
      const b = r.bbox;
      return { r, el, p: new THREE.Vector3((b[0] + b[3]) / 2, (b[1] + b[4]) / 2, b[5]) };
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
    const b = mk.r.bbox;
    const c = new THREE.Vector3((b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2);
    const ext = Math.max(b[3] - b[0], b[4] - b[1], b[5] - b[2], 6);
    const dir = this.stage.camera.position.clone().sub(this.stage.controls.target).normalize();
    if (dir.z < 0.35) { dir.z = 0.6; dir.normalize(); }
    this.stage.flyTo(c.clone().addScaledVector(dir, ext * 2.5 + this.stage.diag * 0.35), c);
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
      if (e.target.closest('.marker')) return;
      const r = view.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, this.stage.camera);
      const obj = this.mode === 'dev' ? this.target : this.machined.top;
      const hit = ray.intersectObject(obj, false)[0];
      if (!hit) { tip.hidden = true; return; }
      const p = hit.point;
      let txt;
      if (this.mode === 'dev') {
        const f = hit.face, D = this.D;
        // barycentric-weighted vertex deviation
        const a = f.a, b = f.b, c = f.c;
        const bary = new THREE.Vector3();
        THREE.Triangle.getBarycoord(p, new THREE.Vector3().fromArray(D.meshV, a * 3), new THREE.Vector3().fromArray(D.meshV, b * 3), new THREE.Vector3().fromArray(D.meshV, c * 3), bary);
        const d = D.meshDev[a] * bary.x + D.meshDev[b] * bary.y + D.meshDev[c] * bary.z;
        const cls = D.meshCls[a];
        const kind = cls === 2 ? 'undercut (excluded)' : cls === 3 ? 'tool-limited (excluded)' : cls === 1 ? 'datum face' :
          d > this.tol ? 'proud' : d < -this.tol ? 'gouge' : 'in tolerance';
        txt = `<b>${d > 0 ? '+' : ''}${d.toFixed(3)} mm</b> ${kind}`;
      } else {
        const g = this.D.meta.grid;
        const j = Math.round((p.x - g.x0) / g.res - 0.5), i = Math.round((p.y - g.y0) / g.res - 0.5);
        const k = i * g.nx + j, e2 = this.D.H[k] - this.D.Ht[k];
        txt = `<b>${e2 > 0 ? '+' : ''}${e2.toFixed(3)} mm</b> height error (top ${this.D.H[k].toFixed(3)}, target ${this.D.Ht[k].toFixed(3)})`;
      }
      tip.innerHTML = `${txt}<br><span class="mono">X${p.x.toFixed(2)} Y${p.y.toFixed(2)} Z${p.z.toFixed(2)}</span>`;
      tip.style.transform = `translate(${e.clientX - r.left + 12}px, ${e.clientY - r.top + 12}px)`;
      tip.hidden = false;
    });
  }
}
