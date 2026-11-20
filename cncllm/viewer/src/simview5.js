// 3+2 cutting animation. The part, stock, vise and table stay fixed (fixture / G54 frame); the tool is drawn along
// each setup's tool axis and swings around the part while the table indexes between setups.
//  * playback clock = machine time (feeds as programmed, rapids at the rapid rate, + the indexing time per setup change)
//  * material = stock box  AND  every earlier segment's final height field  AND  the current segment's live field
//    (replayed in the browser with the 3-axis zcut kernel, in the segment's frame), see material5.js
//  * keyframes per segment come from a background worker, so scrubbing anywhere stays fast
import * as THREE from 'three';
import { Stage } from './scene.js';
import { applyRange } from './simcore.js';
import { buildToolpath } from './toolpath.js';
import { buildTool } from './toolmodel.js';
import { RAPID, hexRgb } from './colors.js';
import { GcodeList } from './gcodelist.js';
import { buildGhost, fmtTime } from './simview.js';
import { Material5 } from './material5.js';
import { segmentHF } from './geom5.js';

const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="currentColor"/></svg>',
  start: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2.4v14H6zM19 5.5v13L9.5 12z" fill="currentColor"/></svg>',
  end: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.6 5H18v14h-2.4zM5 5.5v13L14.5 12z" fill="currentColor"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 6 9.5 12l6 6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fwd: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.5 6 6 6-6 6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  prevSeg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h2.2v14H5zM19 6l-6 6 6 6M13 6l-6 6 6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>',
  nextSeg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.8 5H19v14h-2.2zM5 6l6 6-6 6M11 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>',
};
const SPEEDS = [1, 4, 16, 64, 256, 1024, 4096];
export const SETUP_PALETTE = ['#3b7dd8', '#e0703a', '#2fa36b', '#a35cc8', '#d4a017', '#d24f7a', '#2aa5b5', '#7c6b4f', '#5d6fd6', '#8aa82e'];

// small orientation icon: the tool axis drawn into an iso view of the stock (a box) with the arrow pointing from
// where the tool comes in
export function axisIcon(d, size = 30, color = 'currentColor') {
  const P = (x, y, z) => [15 + (x - y) * 6.2, 17 + (x + y) * 3.1 - z * 8];
  const box = [[-1, -1, -0.5], [1, -1, -0.5], [1, 1, -0.5], [-1, 1, -0.5], [-1, -1, 0.5], [1, -1, 0.5], [1, 1, 0.5], [-1, 1, 0.5]].map((v) => P(v[0] * 0.75, v[1] * 0.45, v[2] * 0.6));
  const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  const tip = P(d[0] * 0.55, d[1] * 0.55, d[2] * 0.55), tail = P(d[0] * 1.55, d[1] * 1.55, d[2] * 1.55);
  const dx = tip[0] - tail[0], dy = tip[1] - tail[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const h1 = [tip[0] - ux * 4 - uy * 2.6, tip[1] - uy * 4 + ux * 2.6], h2 = [tip[0] - ux * 4 + uy * 2.6, tip[1] - uy * 4 - ux * 2.6];
  const f = (p) => p.map((v) => v.toFixed(1)).join(',');
  return `<svg class="axis-ico" viewBox="0 0 30 30" width="${size}" height="${size}" aria-hidden="true">` +
    `<path d="${E.map(([a, b]) => `M${f(box[a])}L${f(box[b])}`).join('')}" stroke="currentColor" stroke-opacity=".45" stroke-width="1" fill="none"/>` +
    `<path d="M${f(tail)}L${f(tip)}" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/><path d="M${f(tip)}L${f(h1)}L${f(h2)}Z" fill="${color}"/></svg>`;
}

export function armZoom(stage, el) {
  stage.controls.enableZoom = false;
  el.addEventListener('pointerdown', () => { stage.controls.enableZoom = true; });
  el.addEventListener('pointerleave', () => { stage.controls.enableZoom = false; });
}

export function setupLabel(s) {
  return `A${Math.round(s.A_deg ?? 0)} C${Math.round(s.C_deg ?? 0)}`;
}

export function buildVise(vise) {
  const g = new THREE.Group(), meshes = [];
  const mats = {
    jaw: new THREE.MeshStandardMaterial({ color: 0x6f7c8c, metalness: 0.7, roughness: 0.38 }),
    body: new THREE.MeshStandardMaterial({ color: 0x3f4a57, metalness: 0.6, roughness: 0.45 }),
    table: new THREE.MeshStandardMaterial({ color: 0x2c3036, metalness: 0.45, roughness: 0.7 }),
  };
  for (const b of vise || []) {
    const lo = b.lo, hi = b.hi;
    const geo = new THREE.BoxGeometry(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]);
    geo.translate((lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2);
    const m = new THREE.Mesh(geo, mats[b.kind].clone());
    m.receiveShadow = true; m.castShadow = b.kind !== 'table';
    m.userData.kind = b.kind;
    g.add(m);
    meshes.push(m);
    if (b.kind === 'table') {
      // T-slots: dark grooves on the table top
      const n = 5, w = hi[1] - lo[1];
      for (let k = 1; k < n; k++) {
        const y = lo[1] + (w * k) / n;
        const sg = new THREE.BoxGeometry(hi[0] - lo[0], Math.min(14, w / 30), 0.6);
        sg.translate((lo[0] + hi[0]) / 2, y, hi[2] + 0.05);
        const slot = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ color: 0x16181b }));
        slot.userData.kind = 'table';
        g.add(slot);
      }
    }
    // edges for definition
    const eg = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 }));
    eg.userData.kind = b.kind;
    g.add(eg);
  }
  return { group: g, meshes };
}

export class SimView5 {
  constructor(D, els, toolColor, workerSrc) {
    this.D = D;
    this.els = els;
    this.toolColor = toolColor;
    const meta = D.meta, n = this.n = meta.n_moves;
    const segs = this.segs = D.segs;
    this.N = segs.length;
    const stage = this.stage = new Stage(els.view, meta.stock);
    stage.plate.visible = false;
    armZoom(stage, els.view);
    // camera fits the stock and the jaws
    const lo = new THREE.Vector3(...meta.stock.lo), hi = new THREE.Vector3(...meta.stock.hi);
    for (const b of meta.vise || []) if (b.kind === 'jaw') { lo.min(new THREE.Vector3(...b.lo)); hi.max(new THREE.Vector3(...b.hi)); }
    stage.fitLo = lo; stage.fitHi = hi;
    this.fitLo = lo; this.fitHi = hi;
    this.vise = buildVise(meta.vise);
    stage.scene.add(this.vise.group);
    const k = stage.key.shadow.camera, s = stage.diag * 1.1;
    Object.assign(k, { left: -s, right: s, top: s, bottom: -s, far: stage.diag * 6 });
    k.updateProjectionMatrix();
    // material
    const toolRGB = [];
    for (const t of D.toolsUsed) toolRGB[t] = hexRgb(toolColor(t));
    this.mat5 = new Material5(stage.renderer, segs, meta.stock, toolRGB, SETUP_PALETTE.map(hexRgb));
    stage.scene.add(this.mat5.group);
    this.hfs = segs.map(() => null);
    this.finalH = segs.map((sg) => sg.finalH);
    this.layer = segs.map(() => 'top');   // what the atlas holds per segment: 'top' | 'final' | 'live'
    this.cs = -1;
    // toolpath (fixture coordinates)
    this.path = buildToolpath(D.FS, D.FE, D.TL, toolColor, stage.diag);
    stage.scene.add(this.path);
    this.ghost = buildGhost(D);
    this.ghost.visible = false;
    stage.scene.add(this.ghost);
    // tool-axis arrow shown while the table indexes (points along the new tool axis at the part)
    this.arrow = this.buildArrow(stage.diag);
    stage.scene.add(this.arrow);
    this.toolModels = {};
    this.toolObj = null;
    this.curTool = -1;
    this.cursor = 0; this.playTime = 0; this.playing = false;
    this.dIdx = 0; this.dFrac = 0;
    this.K = Math.max(400, Math.ceil(n / 60));
    this.keys = segs.map(() => new Map());
    this.keyList = segs.map(() => []);
    this.total = D.cum[n];
    this.speed = SPEEDS.find((sp) => this.total / sp <= 75) || SPEEDS[SPEEDS.length - 1];
    if (this.total / this.speed < 8 && this.speed > 1) this.speed = SPEEDS[Math.max(0, SPEEDS.indexOf(this.speed) - 1)];
    this.follow = true;
    this.buildUI();
    this.startWorker(workerSrc);
    this.lastT = performance.now();
    this.uiT = 0;
    this.stage.onFrame = () => this.frame();
    els.view.querySelector('.vp-msg')?.remove();
    this.setCursor(0);
    this.updateTool(0);
    this.stage.invalidate();
  }

  // ------------------------------------------------------------------ segments / keyframes
  hfOf(s) {
    if (!this.hfs[s]) this.hfs[s] = segmentHF(this.segs[s], this.mat5.top[s], this.D.meta.tools);
    return this.hfs[s];
  }
  setLayer(s, what) {
    const sg = this.segs[s];
    if (!sg.grid || this.layer[s] === what) return;
    if (what === 'final') this.mat5.write(s, this.finalH[s], sg.finalOwn);
    else if (what === 'top') this.mat5.write(s, this.mat5.top[s], null);
    this.layer[s] = what;
  }
  startWorker(src) {
    this.workerState = 'none';
    if (!src || typeof Worker === 'undefined' || this.n < 2) return;
    try {
      const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
      const w = this.worker = new Worker(url);
      const D = this.D, m = D.meta;
      this.workerState = 'running';
      this.workerProgress = 0;
      this.replayCmp = [];
      w.onmessage = (e) => {
        const d = e.data;
        if (d.type === 'progress') this.workerProgress = d.m;
        else if (d.type === 'key') { this.addKey(d.s, d.k, d.H, d.own); this.workerProgress = d.k; }
        else if (d.type === 'seg') this.compareSeg(d.s, d.H);
        else if (d.type === 'done') { this.workerState = 'done'; this.workerMs = d.ms; this.finishCompare(); w.terminate(); URL.revokeObjectURL(url); }
        this.uiT = 0;
      };
      w.onerror = (e) => { console.warn('replay worker failed, replaying on the main thread', e.message); this.workerState = 'failed'; };
      const segs = this.segs.map((sg) => ({ a: sg.a, b: sg.b, R: sg.R, o: sg.o, zoff: sg.zoff, big: sg.big, grid: sg.grid }));
      w.postMessage({ segs, stock: m.stock, tools: m.tools, S: D.SZ, E: D.EZ, TL: D.TL, K: this.K });
    } catch (err) {
      console.warn('no worker', err);
      this.workerState = 'failed';
    }
  }
  compareSeg(s, H) {
    const F = this.finalH[s];
    let bad = 0, mx = 0;
    for (let i = 0; i < F.length; i++) { const d = Math.abs(H[i] - F[i]); if (d > mx) mx = d; if (d > 0.002) bad++; }
    this.replayCmp.push({ bad, cells: F.length, mx });
  }
  finishCompare() {
    const c = this.replayCmp || [];
    const cells = c.reduce((a, x) => a + x.cells, 0), bad = c.reduce((a, x) => a + x.bad, 0);
    this.replay = cells ? { pct: 100 * (1 - bad / cells), max: Math.max(...c.map((x) => x.mx)), cells } : null;
    this.updateStatus();
  }
  addKey(s, k, H, own) {
    if (this.keys[s].has(k)) return;
    this.keys[s].set(k, { H, own });
    this.keyList[s].push(k);
    this.keyList[s].sort((a, b) => a - b);
  }
  bestKey(s, m) {   // largest keyframe index <= m in segment s (the segment start is always available)
    const L = this.keyList[s];
    let best = this.segs[s].a;
    for (let i = L.length - 1; i >= 0; i--) if (L[i] <= m) { best = L[i]; break; }
    return best;
  }
  restore(s, k) {
    const hf = this.hfOf(s);
    if (k === this.segs[s].a) hf.reset();
    else { const key = this.keys[s].get(k); hf.load(key.H, key.own); }
    this.dIdx = k; this.dFrac = 0;
  }
  segOf(m) { return this.D.segOf[Math.min(Math.max(m, 0), this.n - 1)]; }
  cutFrac(m, f) {
    const p = this.D.phi[m];
    return p > 0 ? Math.max(0, (f - p) / (1 - p)) : f;
  }
  applySub(m, f0, f1) {
    const S = this.D.SZ, E = this.D.EZ, o = m * 3, TL = this.D.TL;
    f0 = this.cutFrac(m, f0); f1 = this.cutFrac(m, f1);
    if (f1 <= f0) return;
    const hf = this.hfOf(this.segOf(m));
    const ax = S[o] + (E[o] - S[o]) * f0, ay = S[o + 1] + (E[o + 1] - S[o + 1]) * f0, az = S[o + 2] + (E[o + 2] - S[o + 2]) * f0;
    const bx = S[o] + (E[o] - S[o]) * f1, by = S[o + 1] + (E[o + 1] - S[o + 1]) * f1, bz = S[o + 2] + (E[o + 2] - S[o + 2]) * f1;
    hf.apply(ax, ay, az, bx, by, bz, TL[m] & 31);
  }
  // bring the displayed material to the cursor within the time budget; returns true when caught up
  advance(deadline) {
    const n = this.n, target = this.cursor;
    const tInt = Math.min(Math.floor(target), n);
    const tFrac = tInt < n ? target - tInt : 0;
    if (!n) return true;
    if (tInt >= n) {   // program finished: every segment final
      for (let s = 0; s < this.N; s++) this.setLayer(s, 'final');
      this.cs = -1; this.dIdx = n; this.dFrac = 0;
      this.mat5.setActive(this.N);
      return true;
    }
    const ts = this.segOf(tInt), sg = this.segs[ts];
    if (ts !== this.cs) {
      for (let s = 0; s < ts; s++) this.setLayer(s, 'final');
      this.cs = ts;
      this.mat5.setActive(ts + 1);
      if (!sg.grid) { this.dIdx = tInt; this.dFrac = tFrac; return true; }
      this.restore(ts, this.bestKey(ts, tInt));
      this.layer[ts] = 'live';
      this.hfOf(ts).markAllDirty();
    }
    if (!sg.grid) { this.dIdx = tInt; this.dFrac = tFrac; return true; }
    const hf = this.hfOf(ts);
    if (tInt < this.dIdx || (tInt === this.dIdx && tFrac < this.dFrac - 1e-9)) this.restore(ts, this.bestKey(ts, tInt));
    const k = this.bestKey(ts, tInt);
    if (k > this.dIdx + 64 || (k > this.dIdx && this.dFrac === 0 && k - this.dIdx > 4)) this.restore(ts, k);
    if (this.dIdx < tInt) {
      if (this.dFrac > 0) { this.applySub(this.dIdx, this.dFrac, 1); this.dIdx++; this.dFrac = 0; }
      const save = (this.workerState === 'running' || this.workerState === 'done') ? null : (m) => {
        if (m > sg.a && (m - sg.a) % this.K === 0 && !this.keys[ts].has(m)) this.addKey(ts, m, hf.H.slice(), hf.own.slice());
      };
      this.dIdx = applyRange(hf, this.D.SZ, this.D.EZ, this.D.TL, this.dIdx, tInt, deadline, save);
    }
    if (this.dIdx === tInt && tFrac > this.dFrac) { this.applySub(tInt, this.dFrac, tFrac); this.dFrac = tFrac; }
    return this.dIdx === tInt && this.dFrac >= tFrac - 1e-9;
  }

  // ------------------------------------------------------------------ frame
  frame() {
    const now = performance.now();
    const dt = Math.min(now - this.lastT, 250) / 1000;
    this.lastT = now;
    if (this.playing) {
      this.playTime += dt * this.speed;
      if (this.playTime >= this.total) { this.playTime = this.total; this.playing = false; this.syncPlay(); }
      this.cursor = this.timeToCursor(this.playTime);
    }
    const caught = this.advance(now + (this.playing ? 12 : 16));
    this.caught = caught;
    let changed = false;
    if (this.cs >= 0) {
      const hf = this.hfs[this.cs];
      if (hf && hf.dirty) {
        hf.refreshDirtyBlocks();
        this.mat5.write(this.cs, hf.H, hf.own, hf.di0, hf.di1);
        hf.resetDirty();
        changed = true;
      }
    }
    const pos = caught ? this.cursor : this.dIdx + this.dFrac;
    if (pos !== this.shownPos) {
      this.shownPos = pos;
      this.placeTool(pos);
      this.path.material.uniforms.uCur.value = pos;
      changed = true;
    }
    if (this.toolObj && this.spinning && this.toolObj.visible) {
      this.toolObj.userData.spin.rotation.z -= dt * 30;
      changed = true;
    }
    if (now - this.uiT > (this.playing ? 90 : 30)) { this.uiT = now; this.updateUI(this.cursor); }
    return changed || this.playing || !caught;
  }
  timeToCursor(t) {
    const c = this.D.cum, n = this.n;
    if (t >= c[n]) return n;
    let lo = 0, hi = n - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (c[mid] <= t) lo = mid; else hi = mid - 1; }
    const d = c[lo + 1] - c[lo];
    return lo + (d > 0 ? Math.min((t - c[lo]) / d, 1) : 1);
  }
  cursorToTime(x) {
    const m = Math.min(Math.floor(x), this.n), c = this.D.cum;
    return m >= this.n ? c[this.n] : c[m] + (c[m + 1] - c[m]) * (x - m);
  }
  setCursor(x) {
    this.cursor = Math.max(0, Math.min(x, this.n));
    this.playTime = this.cursorToTime(this.cursor);
    this.uiT = 0;
    this.stage.invalidate();
  }
  moveAt(pos) { return Math.max(0, Math.min(Math.ceil(pos) - 1, this.n - 1)); }
  // tool pose (fixture coordinates) at move m, fraction f (time fraction, incl. the indexing phase)
  pose(m, f, P, Q) {
    const D = this.D, o = m * 3, s = this.segs[this.segOf(m)];
    const p = D.phi[m];
    if (p > 0 && f < p && m > 0) {
      // indexing: swing from the end of the previous move to the start of this one around the frame origins
      const u = f / p, e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      const s0 = this.segs[this.segOf(m - 1)];
      const qa = s0.quat, qb = s.quat;
      const A = new THREE.Vector3(D.FE[o - 3], D.FE[o - 2], D.FE[o - 1]);
      const B = new THREE.Vector3(D.FS[o], D.FS[o + 1], D.FS[o + 2]);
      const ca = new THREE.Vector3(...s0.o), cb = new THREE.Vector3(...s.o);
      Q.slerpQuaternions(qa, qb, e);
      const rel = Q.clone().multiply(qa.clone().invert());
      const c = ca.clone().lerp(cb, e);
      P.copy(A).sub(ca).applyQuaternion(rel).add(c);
      // correct the end point exactly onto B
      const endP = A.clone().sub(ca).applyQuaternion(qb.clone().multiply(qa.clone().invert())).add(cb);
      P.addScaledVector(B.clone().sub(endP), e);
      return true;
    }
    const g = this.cutFrac(m, f);
    P.set(D.FS[o] + (D.FE[o] - D.FS[o]) * g, D.FS[o + 1] + (D.FE[o + 1] - D.FS[o + 1]) * g, D.FS[o + 2] + (D.FE[o + 2] - D.FS[o + 2]) * g);
    Q.copy(s.quat);
    return false;
  }
  placeTool(pos) {
    const n = this.n;
    if (!n) return;
    const m = this.moveAt(pos), f = Math.min(Math.max(pos - m, 0), 1);
    this.updateTool(m);
    if (!this.toolObj) return;
    this.indexing = this.pose(m, f, this.toolObj.position, this.toolObj.quaternion);
    this.spinning = ((this.D.TL[m] >> 6) & 1) === 1 && !this.indexing;
    // tool-axis arrow while indexing and during the approach rapids of a setup
    const approach = pos < n && m < this.segs[this.segOf(m)].firstCut && this.segOf(m) > 0;
    this.arrow.visible = (!!this.indexing || approach) && pos < n;
    if (this.arrow.visible) this.placeArrow(this.toolObj.quaternion, this.segOf(m));
    this.toolObj.visible = this.showTool !== false && pos < n;
    // vise / table contact of the current move: highlight the box and the tool
    const fx = pos < n && f > 0 ? this.D.fix[m] : 0;
    if (fx !== this.shownFix) {
      this.shownFix = fx;
      this.vise.meshes.forEach((mesh, b) => {
        const hit = (fx >> b) & 1;
        mesh.material.emissive.set(hit ? 0xd02020 : 0x000000);
        mesh.material.emissiveIntensity = hit ? 0.9 : 0;
      });
      this.toolObj.traverse((o) => { if (o.material && o.material.emissive && !o.userData.band) o.material.emissive.set(fx ? 0x801010 : 0x000000); });
      this.fixWarn.hidden = !fx;
    }
    const seg = this.segOf(m);
    if (seg !== this.shownSeg) {
      this.shownSeg = seg;
      if (this.follow && this.playing) this.view('setup');
    }
  }
  buildArrow(diag) {
    const g = new THREE.Group(), L = diag * 0.32, r = diag * 0.012;
    const mat = new THREE.MeshStandardMaterial({ color: 0xffb020, emissive: 0xffb020, emissiveIntensity: 0.35, metalness: 0.1, roughness: 0.5, transparent: true, opacity: 0.9 });
    const cone = new THREE.ConeGeometry(r * 2.6, r * 7, 24); cone.rotateX(-Math.PI / 2); cone.translate(0, 0, r * 3.5);
    const shaft = new THREE.CylinderGeometry(r, r, L, 16); shaft.rotateX(Math.PI / 2); shaft.translate(0, 0, r * 7 + L / 2);
    g.add(new THREE.Mesh(cone, mat), new THREE.Mesh(shaft, mat));
    g.userData.mat = mat;
    g.visible = false;
    const lo = new THREE.Vector3(...this.D.meta.stock.lo), hi = new THREE.Vector3(...this.D.meta.stock.hi);
    g.userData.c = lo.clone().add(hi).multiplyScalar(0.5);
    g.userData.half = hi.clone().sub(lo).multiplyScalar(0.5);
    return g;
  }
  placeArrow(Q, si) {
    const a = this.arrow, d = new THREE.Vector3(0, 0, 1).applyQuaternion(Q), h = a.userData.half;
    // start just outside the stock box along d
    const t = Math.abs(d.x) * h.x + Math.abs(d.y) * h.y + Math.abs(d.z) * h.z;
    a.position.copy(a.userData.c).addScaledVector(d, t + this.stage.diag * 0.02);
    a.quaternion.copy(Q);
    a.userData.mat.color.set(SETUP_PALETTE[si % SETUP_PALETTE.length]);
    a.userData.mat.emissive.set(SETUP_PALETTE[si % SETUP_PALETTE.length]);
  }
  updateTool(m) {
    const t = this.n ? this.D.TL[Math.min(m, this.n - 1)] & 31 : 0;
    if (t === this.curTool) return;
    this.curTool = t;
    if (this.toolObj) this.stage.scene.remove(this.toolObj);
    this.toolObj = null;
    const td = this.D.meta.tools[t];
    if (!td) return;
    if (!this.toolModels[t]) {
      const obj = buildTool(td, this.toolColor(t));
      obj.traverse((o) => { if (o.material && o.material.emissive && o.material.emissiveIntensity > 0) o.userData.band = true; });
      this.toolModels[t] = obj;
    }
    this.toolObj = this.toolModels[t];
    this.toolObj.visible = this.showTool !== false;
    this.shownFix = -1;
    this.stage.scene.add(this.toolObj);
  }
  view(name) {
    const st = this.stage;
    if (['iso', 'top', 'front'].includes(name)) { st.view(name); return; }
    let v;
    if (name === 'back') v = new THREE.Vector3(0.25, 1, 0.45);
    else if (name === 'setup') {
      const s = this.segs[this.segOf(Math.max(this.moveAt(this.cursor), 0))];
      const d = new THREE.Vector3(s.R[0][2], s.R[1][2], s.R[2][2]);
      // look along the tool axis, tilted a little towards an iso view so depth reads
      v = d.clone().multiplyScalar(1.6).add(new THREE.Vector3(-0.35, -0.5, 0.45));
      if (v.lengthSq() < 1e-6) v.set(-0.85, -1.25, 1.05);
    }
    if (!v) return;
    const { pos, target } = st.fitBox(v.normalize(), this.fitLo, this.fitHi, 1.3);
    st.flyTo(pos, target, true);
  }

  // ------------------------------------------------------------------ UI
  buildUI() {
    const D = this.D, n = this.n, els = this.els, segs = this.segs;
    els.controls.innerHTML = `
      <div class="ctl-row">
        <button class="ib play" type="button" aria-label="Play">${ICON.play}</button>
        <button class="ib" type="button" data-act="start" aria-label="Back to start" title="Back to start">${ICON.start}</button>
        <button class="ib" type="button" data-act="pseg" aria-label="Previous setup" title="Previous setup">${ICON.prevSeg}</button>
        <button class="ib" type="button" data-act="back" aria-label="Previous move" title="Previous move (←)">${ICON.back}</button>
        <button class="ib" type="button" data-act="fwd" aria-label="Next move" title="Next move (→)">${ICON.fwd}</button>
        <button class="ib" type="button" data-act="nseg" aria-label="Next setup" title="Next setup">${ICON.nextSeg}</button>
        <button class="ib" type="button" data-act="end" aria-label="Jump to end" title="Jump to the end">${ICON.end}</button>
        <div class="scrub-wrap"><input class="scrub" type="range" min="0" max="${n}" step="any" value="0" aria-label="Program position"><div class="scrub-marks"></div></div>
        <span class="time mono" aria-live="off">0:00 / ${fmtTime(this.total)}</span>
      </div>
      <div class="setup-strip" role="group" aria-label="Setups"></div>
      <div class="ctl-row opts">
        <label>Speed <select class="speed">${SPEEDS.map((s) => `<option value="${s}" ${s === this.speed ? 'selected' : ''}>${s}×</option>`).join('')}<option value="turbo">max</option></select></label>
        <label>Colour <select class="colour"><option value="0">by tool</option><option value="1">by setup</option><option value="2">aluminium</option></select></label>
        <label>Path <select class="pathmode"><option value="recent">recent + next</option><option value="all">all (past + future)</option><option value="past">past only</option><option value="none">off</option></select></label>
        <label class="chk"><input type="checkbox" class="rapids" checked> rapids</label>
        <label class="chk"><input type="checkbox" class="ghost"> target</label>
        <label class="chk"><input type="checkbox" class="showtool" checked> tool</label>
        <label class="chk"><input type="checkbox" class="showvise" checked> vise</label>
        <label class="chk" title="Turn the camera towards each setup's tool axis when playback enters it"><input type="checkbox" class="follow" checked> follow setup</label>
        <span class="seg views" role="group" aria-label="View"><button type="button" data-view="iso">Iso</button><button type="button" data-view="top">Top</button><button type="button" data-view="front">Front</button><button type="button" data-view="back">Back</button><button type="button" data-view="setup" title="Look along the current setup's tool axis">Setup</button></span>
      </div>`;
    const q = (s) => els.controls.querySelector(s);
    this.playBtn = q('.play');
    this.scrub = q('.scrub');
    this.timeEl = q('.time');
    this.playBtn.onclick = () => this.togglePlay();
    const stop = () => { this.playing = false; this.syncPlay(); };
    els.controls.querySelectorAll('[data-act]').forEach((b) => (b.onclick = () => {
      const a = b.dataset.act;
      stop();
      if (a === 'start') this.setCursor(0);
      else if (a === 'end') this.setCursor(n);
      else if (a === 'back') this.setCursor(Math.ceil(this.cursor) - 1);
      else if (a === 'fwd') this.setCursor(Math.floor(this.cursor) + 1);
      else if (a === 'pseg' || a === 'nseg') {
        const cur = this.segOf(this.moveAt(this.cursor));
        const atStart = this.cursor <= segs[cur].firstCut + 1e-9;
        const t = a === 'nseg' ? cur + 1 : (atStart ? cur - 1 : cur);
        this.gotoSeg(Math.max(0, Math.min(t, this.N - 1)), a === 'nseg' && cur >= this.N - 1);
      }
    }));
    this.scrub.addEventListener('input', () => { this.setCursor(+this.scrub.value); });
    // clicks / drags anywhere on the track seek (also over the marks)
    const wrap = q('.scrub-wrap');
    const seek = (e) => {
      const r = this.scrub.getBoundingClientRect(), pad = 8;
      const f = Math.min(Math.max((e.clientX - r.left - pad) / Math.max(r.width - 2 * pad, 1), 0), 1);
      this.scrub.value = f * n; this.setCursor(f * n);
    };
    wrap.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault(); stop(); this.scrub.focus({ preventScroll: true });
      wrap.setPointerCapture(e.pointerId); seek(e);
      const mv = (ev) => seek(ev), up = () => { wrap.removeEventListener('pointermove', mv); wrap.removeEventListener('pointerup', up); wrap.removeEventListener('pointercancel', up); };
      wrap.addEventListener('pointermove', mv); wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
    });
    q('.speed').onchange = (e) => { const v = e.target.value; this.speed = v === 'turbo' ? Math.max(this.total / 12, 1) : +v; };
    q('.colour').onchange = (e) => { this.mat5.setMode(+e.target.value); this.stage.invalidate(); };
    q('.pathmode').onchange = (e) => this.setPathMode(e.target.value);
    q('.pathmode').value = n > 3000 ? 'recent' : 'all';
    this.setPathMode(q('.pathmode').value);
    q('.rapids').onchange = (e) => { this.path.material.uniforms.uRapids.value = e.target.checked ? 1 : 0; this.stage.invalidate(); };
    q('.ghost').onchange = (e) => { this.ghost.visible = e.target.checked; this.legGhost.hidden = !e.target.checked; this.stage.invalidate(); };
    q('.showtool').onchange = (e) => { this.showTool = e.target.checked; if (this.toolObj) this.toolObj.visible = this.showTool; this.stage.invalidate(); };
    q('.showvise').onchange = (e) => { this.vise.group.visible = e.target.checked; this.stage.invalidate(); };
    q('.follow').onchange = (e) => { this.follow = e.target.checked; };
    els.controls.querySelectorAll('[data-view]').forEach((b) => (b.onclick = () => this.view(b.dataset.view)));
    // scrubber marks: setup boundaries, tool changes, crash and vise-contact moves
    const marks = q('.scrub-marks');
    const pc = (m) => (100 * m / Math.max(n, 1)).toFixed(3);
    let html = '', last = -1;
    segs.forEach((s, i) => { if (i > 0) html += `<i class="sb" style="left:${pc(s.a)}%" title="Setup ${i + 1}: ${setupLabel(s)} from line ${s.first_line}"></i>`; });
    for (let m = 0; m < n; m++) {
      const t = D.TL[m] & 31;
      if (t !== last && t) html += `<i class="tc" style="left:${pc(m)}%;background:${this.toolColor(t)}" title="T${t} from line ${D.line[m]}"></i>`;
      last = t;
    }
    let ne = 0;
    for (let m = 0; m < n && ne < 300; m++) if (D.crash[m]) { html += `<i class="err" style="left:${pc(m)}%" title="crash flag at line ${D.line[m]}"></i>`; ne++; }
    // vise / table contact: one bar per run of consecutive contact moves (gaps under 0.3 % of the program merged)
    const gapM = Math.max(1, Math.round(n * 0.003));
    for (let m = 0, runs = 0; m < n && runs < 200; m++) {
      if (!D.fix[m]) continue;
      let e = m, k = m;
      while (k < n && k - e <= gapM) { if (D.fix[k]) e = k; k++; }
      html += `<i class="fixr" style="left:${pc(m)}%;width:max(2px,${(100 * (e + 1 - m) / n).toFixed(3)}%)" title="tool / holder touches the vise or table, lines ${D.line[m]}–${D.line[e]}"></i>`;
      m = e; runs++;
    }
    marks.innerHTML = html;
    // setup strip: one block per segment, width = its share of the machine time
    const strip = q('.setup-strip');
    const T = this.total || 1;
    strip.innerHTML = segs.map((s, i) => {
      const t0 = this.cursorToTime(s.a), t1 = this.cursorToTime(s.b);
      const w = Math.max(100 * (t1 - t0) / T, 0.001);
      const col = SETUP_PALETTE[i % SETUP_PALETTE.length];
      const tl = (s.tools || []).map((t) => 'T' + t).join(' ');
      const err = s.fixHits ? ' has-err' : '';
      return `<button type="button" class="sblk${err}" data-seg="${i}" style="flex:${w.toFixed(3)} 1 0;--sc:${col}" title="Setup ${i + 1} · ${setupLabel(s)} · tool axis (${s.tool_axis.map((v) => +v.toFixed(3)).join(', ')}) · ${tl} · lines ${s.first_line}–${s.last_line}${s.fixHits ? ' · touches the vise' : ''}">` +
        `${axisIcon(s.tool_axis, 18, col)}<span class="sb-n">${i + 1}</span><span class="sb-l">${setupLabel(s)} · ${tl}</span></button>`;
    }).join('');
    strip.querySelectorAll('[data-seg]').forEach((b) => (b.onclick = () => { stop(); this.gotoSeg(+b.dataset.seg); }));
    this.strip = strip;
    // HUD
    const hud = document.createElement('div');
    hud.className = 'hud';
    hud.innerHTML = `<div class="hud-setup"><span class="hs-ico"></span><span class="hs-txt"></span></div><div class="hud-tool"><i class="dot"></i><span class="tname">–</span></div><div class="hud-state mono"></div>`;
    els.view.appendChild(hud);
    this.hud = hud;
    const fw = document.createElement('div');
    fw.className = 'fix-warn';
    fw.hidden = true;
    fw.textContent = 'tool / holder touches the vise or table';
    els.view.appendChild(fw);
    this.fixWarn = fw;
    const st = document.createElement('div');
    st.className = 'vp-status';
    els.view.appendChild(st);
    this.statusEl = st;
    const leg = document.createElement('div');
    leg.className = 'vp-legend';
    leg.innerHTML = D.toolsUsed.map((t) => `<span><i style="background:${this.toolColor(t)}"></i>T${t}</span>`).join('') +
      `<span><i class="dash" style="--c:${RAPID}"></i>rapid</span><span class="lg-ghost" hidden><i style="background:#2f8cff"></i>target part (overlay)</span>`;
    els.view.appendChild(leg);
    this.legGhost = leg.querySelector('.lg-ghost');
    // side panel: current setup, current block, listing
    els.side.innerHTML = `
      <div class="cur-setup"><div class="cs-ico"></div><div class="cs-body"><div class="cs-head"><span class="cb-label">Setup</span><span class="cs-n mono"></span></div>
        <div class="cs-title"></div><div class="cs-sub muted small"></div></div></div>
      <div class="cur-block"><div class="cb-head"><span class="cb-label">Current block</span><span class="cb-line mono"></span></div><div class="cb-code mono"></div>
        <dl class="cb-facts"><div><dt>Tool</dt><dd class="f-tool">–</dd></div><div><dt>Feed</dt><dd class="f-feed">–</dd></div><div><dt>Spindle</dt><dd class="f-rpm">–</dd></div><div><dt>Move</dt><dd class="f-move">–</dd></div></dl></div>
      <div class="gc"></div>`;
    const marksMap = new Map();
    for (const is of D.meta.issues || []) for (const l of is.lines?.length ? is.lines : [is.line]) if (l) marksMap.set(l, is.severity === 'error' ? 'error' : (marksMap.get(l) || 'warning'));
    this.list = new GcodeList(els.side.querySelector('.gc'), D.gcode, { onPick: (l) => this.gotoLine(l, false), marks: marksMap });
    const qs = (s) => els.side.querySelector(s);
    this.cb = { line: qs('.cb-line'), code: qs('.cb-code'), tool: qs('.f-tool'), feed: qs('.f-feed'), rpm: qs('.f-rpm'), move: qs('.f-move') };
    this.csEl = { ico: qs('.cs-ico'), n: qs('.cs-n'), title: qs('.cs-title'), sub: qs('.cs-sub') };
    els.view.tabIndex = 0;
    els.view.addEventListener('keydown', (e) => {
      if (e.key === ' ') { e.preventDefault(); this.togglePlay(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); this.setCursor(Math.floor(this.cursor) + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); this.setCursor(Math.ceil(this.cursor) - 1); }
    });
  }
  gotoSeg(s, toEnd = false) {
    if (toEnd) { this.setCursor(this.n); return; }
    const sg = this.segs[s];
    // at the start of the setup's first feed move (the tool shown at its first cutting position, not parked)
    this.setCursor(sg.firstCut);
    this.uiT = 0;
    if (this.follow) { this.shownSeg = s; this.view('setup'); }
  }
  setPathMode(v) {
    const u = this.path.material.uniforms;
    this.path.visible = v !== 'none';
    u.uFuture.value = v === 'past' ? 0 : 1;
    u.uWin.value = v === 'recent' ? Math.max(400, this.n * 0.02) : 1e9;
    u.uFutA.value = v === 'recent' ? 0.12 : 0.22;
    u.uOldA.value = 0.1;
    this.stage.invalidate();
  }
  togglePlay() {
    if (!this.playing && this.cursor >= this.n) this.setCursor(0);
    this.playing = !this.playing;
    this.lastT = performance.now();
    this.syncPlay();
    if (this.playing && this.follow) { this.shownSeg = this.segOf(this.moveAt(this.cursor)); this.view('setup'); }
    this.stage.invalidate();
  }
  syncPlay() {
    this.playBtn.innerHTML = this.playing ? ICON.pause : ICON.play;
    this.playBtn.setAttribute('aria-label', this.playing ? 'Pause' : 'Play');
    this.playBtn.classList.toggle('on', this.playing);
  }
  gotoLine(l, scroll = true) {
    const fm = this.D.firstMove;
    const L = Math.max(0, Math.min(l, fm.length - 1));
    const m = fm[L];
    this.playing = false; this.syncPlay();
    if (m >= 0 && m < this.n) this.setCursor(m + 1);
    this.list.setCurrent(m >= 0 && m < this.n ? this.D.line[m] : l, true);
    this.uiT = 0;
    if (scroll) this.els.view.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  rpmAt(m) {
    const r = this.D.meta.rpm_changes;
    if (!r.length) return 0;
    let lo = 0, hi = r.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (r[mid][0] <= m) lo = mid; else hi = mid - 1; }
    return r[lo][1];
  }
  updateUI(pos) {
    const D = this.D, n = this.n;
    if (document.activeElement !== this.scrub) this.scrub.value = this.cursor;
    this.timeEl.textContent = `${fmtTime(this.cursorToTime(this.cursor))} / ${fmtTime(this.total)}`;
    if (!n) return;
    const m = this.moveAt(pos), si = this.segOf(m), sg = this.segs[si];
    const showLine = D.line[m];
    this.list.setCurrent(showLine);
    const t = D.TL[m] & 31, rapid = (D.TL[m] >> 5) & 1, spin = (D.TL[m] >> 6) & 1;
    const td = D.meta.tools[t];
    const o = m * 3, f = Math.min(Math.max(pos - m, 0), 1), g = this.cutFrac(m, f);
    const px = D.S[o] + (D.E[o] - D.S[o]) * g, py = D.S[o + 1] + (D.E[o + 1] - D.S[o + 1]) * g, pz = D.S[o + 2] + (D.E[o + 2] - D.S[o + 2]) * g;
    this.cb.line.textContent = `line ${showLine}`;
    this.cb.code.textContent = this.list.line(showLine) || ' ';
    this.cb.tool.textContent = td ? `T${t} · ${td.name}` : 'none';
    this.cb.feed.textContent = rapid ? 'rapid' : `F${Math.round(D.feed[m])}`;
    const rpm = this.rpmAt(m);
    this.cb.rpm.textContent = spin ? `S${Math.round(rpm)}` : 'off';
    this.cb.move.textContent = `${Math.min(Math.ceil(pos), n).toLocaleString()} / ${n.toLocaleString()}`;
    const col = SETUP_PALETTE[si % SETUP_PALETTE.length];
    if (this._uiSeg !== si) {
      this._uiSeg = si;
      const ax = sg.tool_axis.map((v) => (Math.abs(v) < 5e-4 ? 0 : +v.toFixed(3)));
      this.csEl.ico.innerHTML = axisIcon(sg.tool_axis, 44, col);
      this.csEl.n.textContent = `${si + 1} / ${this.N}`;
      this.csEl.title.textContent = `${setupLabel(sg)} · ${(sg.tools || []).map((x) => 'T' + x).join(', ') || 'no tool'}`;
      this.csEl.sub.textContent = `tool axis (${ax.join(', ')}) · G68.2 IJK ${(sg.ijk || [0, 0, 0]).map((v) => +(+v).toFixed(2)).join(' ')} · lines ${sg.first_line}–${sg.last_line}`;
      this.hud.querySelector('.hs-ico').innerHTML = axisIcon(sg.tool_axis, 22, col);
      this.strip.querySelectorAll('.sblk').forEach((b) => b.classList.toggle('cur', +b.dataset.seg === si));
    }
    this.hud.querySelector('.hs-txt').textContent = this.indexing ? `indexing to setup ${si + 1} · ${setupLabel(sg)}` : `setup ${si + 1}/${this.N} · ${setupLabel(sg)}`;
    this.hud.querySelector('.dot').style.background = td ? this.toolColor(t) : 'transparent';
    this.hud.querySelector('.tname').textContent = td ? `T${t} · ${td.name}` : 'no tool';
    this.hud.querySelector('.hud-state').textContent =
      `${rapid ? 'G0 rapid' : 'F' + Math.round(D.feed[m])}  ${spin ? 'S' + Math.round(rpm) : 'spindle off'}\nX${px.toFixed(3)} Y${py.toFixed(3)} Z${pz.toFixed(3)}`;
    this.updateStatus();
  }
  updateStatus() {
    let s = '';
    if (!this.caught) s = '<span class="spin"></span> computing…';
    else if (this.workerState === 'running') s = `<span class="spin"></span> pre-computing keyframes ${Math.round(100 * (this.workerProgress || 0) / this.n)}%`;
    else if (this.replay) {
      const ok = this.replay.pct >= 99.5;
      s = `<span class="${ok ? 'okc' : 'badc'}">${ok ? '✓' : '!'}</span> replay matches simulator on ${this.replay.pct.toFixed(2)}% of cells`;
      this.statusEl.title = `Browser replay of every setup vs the simulator's exact height fields: max |Δ| ${this.replay.max.toFixed(4)} mm over ${this.replay.cells.toLocaleString()} cells; pre-computed in ${(this.workerMs / 1000).toFixed(1)} s`;
    }
    if (s !== this._st) { this._st = s; this.statusEl.innerHTML = s; this.statusEl.hidden = !s; }
  }
}
