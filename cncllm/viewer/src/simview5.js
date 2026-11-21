// 3+2 cutting animation with two views of the same replay:
//  * Machine view (default): a trunnion table-table machine (machine5.js, kinematics in kin5.mjs). The spindle stays
//    vertical and moves in X Y Z; each setup's G68.2 tool axis is brought under it by tilting the cradle (A, about
//    machine X) and turning the platter (C). Between setups the tool retracts, the table swings, the tool re-approaches.
//  * Part view: the part, vise and table stay fixed (G54) and the tool is drawn along each setup's tool axis.
// Shared by both:
//  * playback clock = machine time (feeds as programmed, rapids at the rapid rate, + the indexing time per setup
//    change); a re-orientation always gets at least SWING_WALL_S of real time on screen, whatever the speed
//  * material = stock box AND every earlier segment's final height field AND the current segment's live field (replayed
//    in the browser with the 3-axis zcut kernel, in the segment's frame), see material5.js
//  * keyframes per segment come from a background worker, so scrubbing anywhere stays fast
//  * the timeline gives every setup a share proportional to its machine time, but at least TL_MIN (so the short setups
//    stay visible and clickable); scrubber, setup strip and marks all use that one mapping
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
import { buildMachine, poseTable } from './machine5.js';
import { frameAngles, machineTip, setupAngles, swingState, tableRot, wrap180 } from './kin5.mjs';

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
const SWING_WALL_S = 2.2;        // minimum real time of a re-orientation during playback
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

const fmtN = (v, w = 8) => (Math.abs(v) < 5e-4 ? 0 : v).toFixed(3).padStart(w, ' ');

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
    // ---- machine + table hierarchy: everything in G54 hangs under mc.part
    const mc = this.mc = buildMachine(meta);
    stage.scene.add(mc.fixed, mc.cradle, mc.head);
    this.machineOnly = [mc.fixed, mc.head, ...mc.cradle.children.filter((o) => o !== mc.platter), ...mc.platter.children.filter((o) => o !== mc.part)];
    const lo = new THREE.Vector3(...meta.stock.lo), hi = new THREE.Vector3(...meta.stock.hi);
    for (const b of meta.vise || []) if (b.kind === 'jaw') { lo.min(new THREE.Vector3(...b.lo)); hi.max(new THREE.Vector3(...b.hi)); }
    this.fitLo = lo; this.fitHi = hi;
    this.vise = buildVise(meta.vise);
    mc.part.add(this.vise.group);
    // machine framing: the platter and the swing envelope of the job around the rotary centre
    const d = mc.dims;
    this.mFitLo = new THREE.Vector3(-d.xa - d.ta * 0.5, -d.Rp * 0.95, d.zT - d.tp * 0.6);
    this.mFitHi = new THREE.Vector3(d.xa + d.ta * 0.5, d.Rp * 0.95, Math.max(d.rStock * 0.95, 30));
    // per-setup table angles: displayed = sim5.frame_angles, kinematic = true azimuth, unwrapped (short way)
    const ang = setupAngles(segs.map((s) => s.R));
    segs.forEach((s, i) => {
      s.ang = ang[i];
      s.qTable = new THREE.Quaternion().setFromRotationMatrix(m4rows(tableRot(ang[i].Ak, ang[i].Ck)));
    });
    // material
    const toolRGB = [];
    for (const t of D.toolsUsed) toolRGB[t] = hexRgb(toolColor(t));
    this.mat5 = new Material5(stage.renderer, segs, meta.stock, toolRGB, SETUP_PALETTE.map(hexRgb));
    mc.part.add(this.mat5.group);
    this.hfs = segs.map(() => null);
    this.finalH = segs.map((sg) => sg.finalH);
    this.layer = segs.map(() => 'top');   // what the atlas holds per segment: 'top' | 'final' | 'live'
    this.cs = -1;
    // toolpath and target overlay (fixture coordinates)
    this.path = buildToolpath(D.FS, D.FE, D.TL, toolColor, stage.diag);
    mc.part.add(this.path);
    this.ghost = buildGhost(D);
    this.ghost.visible = false;
    mc.part.add(this.ghost);
    // Part view: tool-axis arrow shown while the table indexes (points along the new tool axis at the part)
    this.arrow = this.buildArrow(stage.diag);
    mc.part.add(this.arrow);
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
    this.buildTimeline();
    this.buildUI();
    this.startWorker(workerSrc);
    this.lastT = performance.now();
    this.uiT = 0;
    this.stage.onFrame = () => this.frame();
    els.view.querySelector('.vp-msg')?.remove();
    this.mode = null;
    this.setMode('machine', false);
    this.setCursor(0);
    this.updateTool(0);
    this.stage.invalidate();
  }

  // ------------------------------------------------------------------ view mode
  setMode(mode, animate = true) {
    if (mode === this.mode) return;
    this.mode = mode;
    const mc = this.mc, mach = mode === 'machine';
    for (const o of this.machineOnly) o.visible = mach;
    this.vise.group.children.forEach((o) => { if (o.userData.kind === 'table') o.visible = !mach; });
    if (mach) mc.part.position.set(-mc.dims.pivot[0], -mc.dims.pivot[1], -mc.dims.pivot[2]);
    else { mc.part.position.set(0, 0, 0); poseTable(mc, 0, 90); }   // identity: the part stays in G54
    this.arrow.visible = false;
    // shadow camera covers the machine or just the job
    const k = this.stage.key, s = mach ? Math.max(mc.dims.xs0 + mc.dims.ts, mc.dims.W) * 1.25 : this.stage.diag * 1.1;
    const c = mach ? new THREE.Vector3(0, 0, 0) : this.stage.center;
    k.position.set(c.x - s * 0.55, c.y - s * 0.8, c.z + s * 1.3);
    k.target.position.copy(c);
    Object.assign(k.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: s * 0.1, far: s * 5 });
    k.shadow.camera.updateProjectionMatrix();
    this.stage.camera.far = (mach ? s * 30 : this.stage.diag * 60);
    this.stage.camera.updateProjectionMatrix();
    this.stage.controls.maxDistance = mach ? s * 8 : this.stage.diag * 12;
    this.stage.fitLo = mach ? this.mFitLo : this.fitLo;
    this.stage.fitHi = mach ? this.mFitHi : this.fitHi;
    if (this.modeBtns) this.modeBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    if (this.els.view) this.els.view.dataset.mode = mode;
    if (this.droEl) { this.droEl.hidden = !mach; this.hud.hidden = mach; }
    this.shownPos = undefined;
    this.shownFix = -1;
    this.view(mach ? 'machine' : 'iso', animate);
    this.placeTool(this.cursor);
    this.uiT = 0;
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

  // ------------------------------------------------------------------ clock
  // index phase [t0, t1) of the re-orientation that starts segment s (s >= 1), in machine seconds
  idxPhase(s) {
    const a = this.segs[s].a, c = this.D.cum;
    return [c[a], c[a] + this.D.phi[a] * (c[a + 1] - c[a])];
  }
  swingMoves(s) {   // does the table actually move between segment s-1 and s
    const a = this.segs[s - 1].ang, b = this.segs[s].ang;
    return Math.abs(a.Ak - b.Ak) > 1e-6 || Math.abs(a.Ck - b.Ck) > 1e-6;
  }
  advanceClock(dt) {
    let t = this.playTime, budget = dt;   // real seconds
    for (let guard = 0; guard < 8 && budget > 1e-9 && t < this.total; guard++) {
      const s = this.segOf(this.moveAt(this.timeToCursor(t) + 1e-9));
      // inside an index phase: slow enough that the whole phase takes >= SWING_WALL_S
      let ph = null;
      for (const k of [s, s + 1]) {
        if (k >= 1 && k < this.N) { const p = this.idxPhase(k); if (t >= p[0] - 1e-9 && t < p[1]) { ph = p; break; } }
      }
      if (ph) {
        const rate = Math.min(this.speed, (ph[1] - ph[0]) / SWING_WALL_S);
        const need = (ph[1] - t) / rate;
        if (budget < need) { t += budget * rate; budget = 0; } else { t = ph[1]; budget -= need; }
        continue;
      }
      // normal speed, but stop at the start of the next index phase
      const next = s + 1 < this.N ? this.idxPhase(s + 1)[0] : Infinity;
      const t1 = t + budget * this.speed;
      if (t1 >= next && t < next) { budget -= (next - t) / this.speed; t = next; } else { t = t1; budget = 0; }
    }
    return Math.min(t, this.total);
  }

  // ------------------------------------------------------------------ frame
  frame() {
    const now = performance.now();
    const dt = Math.min(now - this.lastT, 250) / 1000;
    this.lastT = now;
    if (this.playing) {
      this.playTime = this.advanceClock(dt);
      if (this.playTime >= this.total) { this.playTime = this.total; this.playing = false; this.syncPlay(); }
      this.cursor = this.timeToCursor(this.playTime);
    }
    const caught = this.advance(now + (this.playing ? 12 : 60));   // paused (scrubbing): catch up faster
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
      // recent-path modes show the current setup's passes only (earlier setups' paths sit on other faces)
      this.path.material.uniforms.uFrom.value = (this.pathMode === 'recent' || this.pathMode === 'next') && this.n ? this.segs[this.segOf(this.moveAt(pos))].a : -1;
      changed = true;
    }
    if (this.toolObj && this.spinning && this.playing && this.toolObj.visible) {
      this.toolObj.userData.spin.rotation.z -= dt * 30;
      changed = true;
    }
    if (now - this.uiT > (this.playing ? 90 : 30)) { this.uiT = now; this.updateUI(this.shownPos ?? this.cursor); }
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
  // Part view tool pose (fixture coordinates) at move m, fraction f (time fraction, incl. the indexing phase)
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
  // Machine view pose at move m, fraction f: table angles (kinematic, deg), tool tip (machine coords) and the DRO
  machinePose(m, f) {
    const D = this.D, o = m * 3, si = this.segOf(m), s = this.segs[si], pv = this.mc.dims.pivot;
    const p = D.phi[m];
    if (p > 0 && f < p && m > 0) {
      const s0 = this.segs[this.segOf(m - 1)];
      const pa = machineTip([D.FE[o - 3], D.FE[o - 2], D.FE[o - 1]], s0.ang.Ak, s0.ang.Ck, pv);
      const pb = machineTip([D.FS[o], D.FS[o + 1], D.FS[o + 2]], s.ang.Ak, s.ang.Ck, pv);
      const st = swingState(f / p, s0.ang, s.ang, pa, pb, this.mc.dims.zSafe);
      return { indexing: true, phase: st.phase, A: st.A, C: st.C, tip: st.tip, dispA: st.A, dispC: wrap180(st.C), seg: si, from: this.segOf(m - 1) };
    }
    const P = new THREE.Vector3(), Q = new THREE.Quaternion();
    this.pose(m, f, P, Q);
    const tip = machineTip([P.x, P.y, P.z], s.ang.Ak, s.ang.Ck, pv);
    return { indexing: false, phase: 'cut', A: s.ang.Ak, C: s.ang.Ck, tip, dispA: s.ang.A, dispC: s.ang.C, seg: si, P, Q };
  }
  placeTool(pos) {
    const n = this.n;
    if (!n) return;
    const m = this.moveAt(pos), f = Math.min(Math.max(pos - m, 0), 1);
    this.updateTool(m);
    if (!this.toolObj) return;
    const T = this.toolObj;
    if (this.mode === 'machine') {
      const mp = this.mp = this.machinePose(m, f);
      poseTable(this.mc, mp.A, mp.C);
      T.position.set(mp.tip[0], mp.tip[1], mp.tip[2]);
      // the tool keeps its own orientation relative to the part's setup frame, carried by the table rotation:
      // qTable * quat(R_setup) has the tool axis on Rt . d = +Z (checked in machineCheck); parked tool: vertical
      if (mp.indexing) T.quaternion.identity();
      else T.quaternion.copy(this.segs[mp.seg].qTable).multiply(mp.Q);
      this.indexing = mp.indexing;
      this.mc.head.position.set(T.position.x, T.position.y, T.position.z + (T.userData.height || 0));
      this.arrow.visible = false;
    } else {
      this.mp = null;
      this.indexing = this.pose(m, f, T.position, T.quaternion);
      // tool-axis arrow while indexing and during the approach rapids of a setup
      const approach = pos < n && m < this.segs[this.segOf(m)].firstCut && this.segOf(m) > 0;
      this.arrow.visible = (!!this.indexing || approach) && pos < n;
      if (this.arrow.visible) this.placeArrow(T.quaternion, this.segOf(m));
    }
    this.spinning = ((this.D.TL[m] >> 6) & 1) === 1 && !this.indexing;
    T.visible = this.showTool !== false && pos < n;
    this.mc.head.visible = this.mode === 'machine' && this.showTool !== false;
    // vise / table contact of the current move: highlight the box (table -> platter in Machine view) and the tool
    const fx = pos < n && f > 0 ? this.D.fix[m] : 0;
    if (fx !== this.shownFix) {
      this.shownFix = fx;
      this.vise.meshes.forEach((mesh, b) => {
        const hit = (fx >> b) & 1;
        mesh.material.emissive.set(hit ? 0xd02020 : 0x000000);
        mesh.material.emissiveIntensity = hit ? 0.9 : 0;
        if (mesh.userData.kind === 'table') this.mc.mats.platter.emissive.set(hit ? 0xa01515 : 0x000000);
      });
      T.traverse((o) => { if (o.material && o.material.emissive && !o.userData.band) o.material.emissive.set(fx ? 0x801010 : 0x000000); });
      this.fixWarn.hidden = !fx;
    }
    const seg = this.segOf(m);
    if (seg !== this.shownSeg) {
      this.shownSeg = seg;
      if (this.follow && this.playing && this.mode === 'part') this.view('setup');
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
  view(name, animate = true) {
    const st = this.stage;
    let v, lo = this.fitLo, hi = this.fitHi, margin = 1.3;
    if (this.mode === 'machine') {
      lo = this.mFitLo; hi = this.mFitHi; margin = 1.08;
      const portrait = st.camera.aspect < 0.9;
      const dirs = { machine: portrait ? [-0.7, -1.0, 0.9] : [-0.78, -1.2, 0.74], iso: [-0.78, -1.2, 0.74], front: [0, -1, 0.3], side: [-1, -0.08, 0.3], top: [0, -0.0001, 1], back: [0.6, 1, 0.55] };
      v = new THREE.Vector3(...(dirs[name] || dirs.machine));
      if (name === 'top') margin = 1.02;
    } else {
      if (['iso', 'top', 'front'].includes(name)) { st.view(name, animate); return; }
      if (name === 'back') v = new THREE.Vector3(0.25, 1, 0.45);
      else if (name === 'setup') {
        const s = this.segs[this.segOf(Math.max(this.moveAt(this.cursor), 0))];
        const d = new THREE.Vector3(s.R[0][2], s.R[1][2], s.R[2][2]);
        // look along the tool axis, tilted a little towards an iso view so depth reads
        v = d.clone().multiplyScalar(1.6).add(new THREE.Vector3(-0.35, -0.5, 0.45));
        if (v.lengthSq() < 1e-6) v.set(-0.85, -1.25, 1.05);
      } else v = new THREE.Vector3(-0.85, -1.25, 1.05);
    }
    const { pos, target } = st.fitBox(v.normalize(), lo, hi, margin);
    st.flyTo(pos, target, animate);
  }

  // ------------------------------------------------------------------ timeline mapping (u in [0, 1])
  buildTimeline() {
    const segs = this.segs, T = this.total || 1, N = this.N;
    const wmin = Math.min(0.03, 0.35 / Math.max(N, 1));
    const t0 = segs.map((s) => this.cursorToTime(s.a)), t1 = segs.map((s) => this.cursorToTime(s.b));
    let w = segs.map((s, i) => Math.max((t1[i] - t0[i]) / T, wmin));
    const sum = w.reduce((a, b) => a + b, 0) || 1;
    w = w.map((x) => x / sum);
    const U = [];
    let acc = 0;
    for (const x of w) { U.push(acc); acc += x; }
    this.tl = { t0, t1, w, U };
  }
  uToTime(u) {
    const { t0, t1, w, U } = this.tl;
    if (u >= 1) return this.total;
    let s = 0;
    while (s < this.N - 1 && u >= U[s + 1]) s++;
    return t0[s] + Math.min(Math.max((u - U[s]) / w[s], 0), 1) * (t1[s] - t0[s]);
  }
  timeToU(t) {
    const { t0, t1, w, U } = this.tl;
    if (t >= this.total) return 1;
    let s = 0;
    while (s < this.N - 1 && t >= t0[s + 1]) s++;
    const d = t1[s] - t0[s];
    return U[s] + (d > 0 ? Math.min(Math.max((t - t0[s]) / d, 0), 1) : 0) * w[s];
  }
  cursorToU(x) { return this.timeToU(this.cursorToTime(x)); }
  uToCursor(u) { return this.timeToCursor(this.uToTime(u)); }

  // ------------------------------------------------------------------ test / review hooks
  // put the cursor at fraction t (0..1) of the re-orientation that starts setup `seg` (0-based, >= 1)
  seekSwing(seg, t) {
    const s = this.segs[Math.max(1, Math.min(seg, this.N - 1))];
    const a = s.a, p = this.D.phi[a] || 0;
    this.playing = false; this.syncPlay();
    this.setCursor(a + Math.min(Math.max(t, 0), 1) * p);
    this.shownPos = undefined;
    return { seg: Math.max(1, Math.min(seg, this.N - 1)), cursor: this.cursor, phi: p };
  }
  // Self-check of the Machine view from the rendered three.js objects, over many moves of every setup: the tool axis in
  // the world must be +Z (spindle vertical); mapped into the part's frame (inverse of the part group's matrixWorld) it
  // must be the setup's G68.2 tool axis; and the tool tip mapped into the part frame must equal the Part view tip
  // (pose(), which the Part view renders directly in G54) for the same move and fraction.
  machineCheck(perSeg = 24) {
    const keep = { mode: this.mode, cursor: this.cursor, playing: this.playing };
    this.playing = false;
    if (this.mode !== 'machine') this.setMode('machine', false);
    const scene = this.stage.scene, inv = new THREE.Matrix4(), ez = new THREE.Vector3(0, 0, 1);
    const P = new THREE.Vector3(), Q = new THREE.Quaternion();
    let maxDir = 0, maxAxis = 0, maxTip = 0, samples = 0, swingSamples = 0;
    const setups = [];
    for (let si = 0; si < this.N; si++) {
      const s = this.segs[si], cnt = s.b - s.a;
      const ms = new Set([s.a, s.b - 1, s.firstCut]);
      for (let k = 0; k < perSeg; k++) ms.add(s.a + Math.floor((k + 0.5) * cnt / perSeg));
      let segTip = 0;
      for (const m of ms) {
        for (const f of [0.5, 1.0, this.D.phi[m] > 0 ? (1 + this.D.phi[m]) / 2 : 0.25]) {
          const pos = m + f;
          if (this.D.phi[m] > 0 && f < this.D.phi[m]) continue;   // re-orientation: no G-code tip (checked below)
          this.placeTool(pos);
          scene.updateMatrixWorld(true);
          const T = this.toolObj;
          if (!T || this.mp.indexing) continue;
          const axisW = ez.clone().transformDirection(T.matrixWorld);
          maxDir = Math.max(maxDir, axisW.distanceTo(ez));
          const tipW = new THREE.Vector3().setFromMatrixPosition(T.matrixWorld);
          inv.copy(this.mc.part.matrixWorld).invert();
          const tipL = tipW.clone().applyMatrix4(inv);
          const axisL = axisW.clone().transformDirection(inv);
          const d = new THREE.Vector3(s.R[0][2], s.R[1][2], s.R[2][2]);
          maxAxis = Math.max(maxAxis, axisL.distanceTo(d));
          this.pose(m, f, P, Q);   // Part view reference
          const e = tipL.distanceTo(P);
          maxTip = Math.max(maxTip, e); segTip = Math.max(segTip, e);
          samples++;
        }
      }
      // the re-orientation into this setup: spindle stays vertical throughout
      if (si > 0 && this.D.phi[s.a] > 0) {
        for (const u of [0.1, 0.3, 0.5, 0.7, 0.9]) {
          this.placeTool(s.a + u * this.D.phi[s.a]);
          scene.updateMatrixWorld(true);
          maxDir = Math.max(maxDir, ez.clone().transformDirection(this.toolObj.matrixWorld).distanceTo(ez));
          swingSamples++;
        }
      }
      // displayed table angles while cutting in this setup (from the DRO state) vs sim5.frame_angles of its frame
      this.placeTool(Math.min(s.firstCut + 0.5, this.n));
      const fa = frameAngles(s.R);
      setups.push({ segment: si + 1, A: this.mp.dispA, C: this.mp.dispC, A_expected: fa.A, C_expected: fa.C,
        A_sim: s.A_deg ?? null, C_sim: s.C_deg ?? null, A_table: s.ang.Ak, C_table: s.ang.Ck, maxTipErrMm: segTip });
    }
    const maxAngErr = Math.max(0, ...setups.map((x) => Math.max(Math.abs(x.A - x.A_expected), Math.abs(x.C - x.C_expected))));
    const maxSimErr = Math.max(0, ...setups.filter((x) => x.A_sim !== null).map((x) => Math.max(Math.abs(x.A - x.A_sim), Math.abs(wrap180(x.C - x.C_sim)))));
    // restore
    if (keep.mode !== 'machine') this.setMode(keep.mode, false);
    this.setCursor(keep.cursor);
    this.shownPos = undefined;
    this.placeTool(keep.cursor);
    this.playing = keep.playing;
    const res = { maxSpindleDirErr: maxDir, maxToolAxisInPartErr: maxAxis, maxTipErrMm: maxTip, maxAngleErrDeg: maxAngErr,
      maxAngleVsSetupsJsonDeg: maxSimErr, samples, swingSamples, setups,
      pass: maxDir <= 1e-6 && maxAxis <= 1e-6 && maxTip <= 1e-6 && maxAngErr <= 1e-9 && maxSimErr <= 0.006,
      method: 'three.js matrixWorld of the rendered tool and part group; reference tip = Part view pose() in G54' };
    return res;
  }

  // ------------------------------------------------------------------ UI
  buildUI() {
    const D = this.D, n = this.n, els = this.els, segs = this.segs;
    els.controls.innerHTML = `
      <div class="tl-wrap">
        <div class="tl" role="slider" tabindex="0" aria-label="Program position" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="tl-bands"></div><div class="tl-marks"></div><div class="tl-fill"></div><div class="tl-thumb"></div>
        </div>
        <div class="setup-strip" role="group" aria-label="Setups"></div>
      </div>
      <div class="ctl-row">
        <button class="ib play" type="button" aria-label="Play">${ICON.play}</button>
        <button class="ib" type="button" data-act="start" aria-label="Back to start" title="Back to start">${ICON.start}</button>
        <button class="ib" type="button" data-act="pseg" aria-label="Previous setup" title="Previous setup">${ICON.prevSeg}</button>
        <button class="ib" type="button" data-act="back" aria-label="Previous move" title="Previous move (←)">${ICON.back}</button>
        <button class="ib" type="button" data-act="fwd" aria-label="Next move" title="Next move (→)">${ICON.fwd}</button>
        <button class="ib" type="button" data-act="nseg" aria-label="Next setup" title="Next setup">${ICON.nextSeg}</button>
        <button class="ib" type="button" data-act="end" aria-label="Jump to end" title="Jump to the end">${ICON.end}</button>
        <span class="time mono" aria-live="off">0:00 / ${fmtTime(this.total)}</span>
        <label class="speed-l">Speed <select class="speed">${SPEEDS.map((s) => `<option value="${s}" ${s === this.speed ? 'selected' : ''}>${s}×</option>`).join('')}<option value="turbo">max</option></select></label>
      </div>
      <div class="ctl-row opts">
        <label>Colour <select class="colour"><option value="0">by tool</option><option value="1">by setup</option><option value="2">aluminium</option></select></label>
        <label>Path <select class="pathmode"><option value="recent">recent cuts</option><option value="next">recent + next</option><option value="all">all (past + future)</option><option value="past">past only</option><option value="none">off</option></select></label>
        <label class="chk"><input type="checkbox" class="rapids" checked> rapids</label>
        <label class="chk"><input type="checkbox" class="ghost"> target</label>
        <label class="chk"><input type="checkbox" class="showtool" checked> tool</label>
        <label class="chk"><input type="checkbox" class="showvise" checked> vise</label>
        <label class="chk part-only" title="Part view: turn the camera towards each setup's tool axis when playback enters it"><input type="checkbox" class="follow" checked> follow setup</label>
        <span class="seg views" role="group" aria-label="Camera"><button type="button" data-view="iso">Iso</button><button type="button" data-view="top">Top</button><button type="button" data-view="front">Front</button><button type="button" data-view="back">Back</button><button type="button" data-view="setup" class="part-only" title="Look along the current setup's tool axis">Setup</button><button type="button" data-view="side" class="mach-only" title="Look along the A axis">Side</button></span>
      </div>`;
    const q = (s) => els.controls.querySelector(s);
    this.playBtn = q('.play');
    this.tlEl = q('.tl');
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
      else if (a === 'pseg' || a === 'nseg') this.stepSeg(a === 'nseg' ? 1 : -1);
    }));
    // timeline: pointer seeks anywhere on the track (custom slider: one mapping for track, marks and setup strip)
    const tl = this.tlEl;
    const seek = (e) => {
      const r = tl.getBoundingClientRect();
      const u = Math.min(Math.max((e.clientX - r.left) / Math.max(r.width, 1), 0), 1);
      this.setCursor(this.uToCursor(u));
    };
    tl.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault(); stop(); tl.focus({ preventScroll: true });
      try { tl.setPointerCapture(e.pointerId); } catch (_) { /* synthetic events */ }
      seek(e);
      const mv = (ev) => seek(ev), up = () => { tl.removeEventListener('pointermove', mv); tl.removeEventListener('pointerup', up); tl.removeEventListener('pointercancel', up); };
      tl.addEventListener('pointermove', mv); tl.addEventListener('pointerup', up); tl.addEventListener('pointercancel', up);
    });
    tl.addEventListener('keydown', (e) => {
      const u = this.cursorToU(this.cursor);
      let v = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = u + 0.005;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = u - 0.005;
      else if (e.key === 'PageUp') { e.preventDefault(); stop(); this.stepSeg(1); return; }
      else if (e.key === 'PageDown') { e.preventDefault(); stop(); this.stepSeg(-1); return; }
      else if (e.key === 'Home') v = 0; else if (e.key === 'End') v = 1;
      if (v === null) return;
      e.preventDefault(); stop();
      this.setCursor(this.uToCursor(Math.min(Math.max(v, 0), 1)));
    });
    q('.speed').onchange = (e) => { const v = e.target.value; this.speed = v === 'turbo' ? Math.max(this.total / 12, 1) : +v; };
    q('.colour').onchange = (e) => { this.mat5.setMode(+e.target.value); this.stage.invalidate(); };
    q('.pathmode').onchange = (e) => this.setPathMode(e.target.value);
    q('.pathmode').value = n > 3000 ? 'recent' : 'next';
    this.setPathMode(q('.pathmode').value);
    q('.rapids').onchange = (e) => { this.path.material.uniforms.uRapids.value = e.target.checked ? 1 : 0; this.stage.invalidate(); };
    q('.ghost').onchange = (e) => { this.ghost.visible = e.target.checked; this.legGhost.hidden = !e.target.checked; this.stage.invalidate(); };
    q('.showtool').onchange = (e) => { this.showTool = e.target.checked; this.shownPos = undefined; this.stage.invalidate(); };
    q('.showvise').onchange = (e) => { this.vise.group.visible = e.target.checked; this.stage.invalidate(); };
    q('.follow').onchange = (e) => { this.follow = e.target.checked; };
    els.controls.querySelectorAll('[data-view]').forEach((b) => (b.onclick = () => this.view(b.dataset.view)));
    // track: setup bands, tool changes, crash and vise-contact marks (all through cursorToU)
    const pc = (m) => (100 * this.cursorToU(m)).toFixed(3);
    q('.tl-bands').innerHTML = segs.map((s, i) => `<i style="left:${(100 * this.tl.U[i]).toFixed(3)}%;width:${(100 * this.tl.w[i]).toFixed(3)}%;--sc:${SETUP_PALETTE[i % SETUP_PALETTE.length]}"></i>`).join('');
    let html = '', last = -1;
    for (let m = 0; m < n; m++) {
      const t = D.TL[m] & 31;
      if (t !== last && t) html += `<i class="tc" style="left:${pc(m)}%;background:${this.toolColor(t)}" title="T${t} from line ${D.line[m]}"></i>`;
      last = t;
    }
    let ne = 0;
    for (let m = 0; m < n && ne < 300; m++) if (D.crash[m]) { html += `<i class="err" style="left:${pc(m)}%" title="crash flag at line ${D.line[m]}"></i>`; ne++; }
    const gapM = Math.max(1, Math.round(n * 0.003));
    for (let m = 0, runs = 0; m < n && runs < 200; m++) {
      if (!D.fix[m]) continue;
      let e = m, k = m;
      while (k < n && k - e <= gapM) { if (D.fix[k]) e = k; k++; }
      const a = this.cursorToU(m), b = this.cursorToU(e + 1);
      html += `<i class="fixr" style="left:${(100 * a).toFixed(3)}%;width:max(2px,${(100 * (b - a)).toFixed(3)}%)" title="tool / holder touches the vise or table, lines ${D.line[m]}–${D.line[e]}"></i>`;
      m = e; runs++;
    }
    q('.tl-marks').innerHTML = html;
    // setup strip: one block per segment, same widths as the track bands
    const strip = q('.setup-strip');
    strip.innerHTML = segs.map((s, i) => {
      const col = SETUP_PALETTE[i % SETUP_PALETTE.length];
      const tl = (s.tools || []).map((t) => 'T' + t).join(' ');
      const err = s.fixHits ? ' has-err' : '';
      const mins = (this.tl.t1[i] - this.tl.t0[i]) / 60;
      return `<button type="button" class="sblk${err}" data-seg="${i}" style="flex:${(100 * this.tl.w[i]).toFixed(4)} 1 0;--sc:${col}" title="Setup ${i + 1} · ${setupLabel(s)} · ${mins < 1 ? Math.round(mins * 60) + ' s' : mins.toFixed(1) + ' min'} · tool axis (${s.tool_axis.map((v) => +v.toFixed(3)).join(', ')}) · ${tl} · lines ${s.first_line}–${s.last_line}${s.fixHits ? ' · touches the vise' : ''}">` +
        `${axisIcon(s.tool_axis, 18, col)}<span class="sb-n">${i + 1}</span><span class="sb-l">${setupLabel(s)} · ${tl}</span></button>`;
    }).join('');
    strip.querySelectorAll('[data-seg]').forEach((b) => (b.onclick = () => { stop(); this.gotoSeg(+b.dataset.seg); }));
    this.strip = strip;
    // overlays: view toggle, DRO (Machine view), HUD (Part view), status, legend
    const tog = document.createElement('div');
    tog.className = 'vp-mode seg';
    tog.setAttribute('role', 'group');
    tog.setAttribute('aria-label', 'View');
    tog.innerHTML = '<button type="button" data-mode="machine" aria-pressed="true" title="The table tilts (A) and turns (C) the part under a vertical spindle">Machine view</button><button type="button" data-mode="part" aria-pressed="false" title="The part stays still and the tool comes in along each setup\'s axis">Part view</button>';
    els.view.appendChild(tog);
    this.modeBtns = [...tog.querySelectorAll('[data-mode]')];
    this.modeBtns.forEach((b) => (b.onclick = () => this.setMode(b.dataset.mode)));
    const dro = document.createElement('div');
    dro.className = 'dro';
    dro.setAttribute('aria-label', 'Machine position readout');
    dro.innerHTML = `<div class="dro-ax">${['X', 'Y', 'Z', 'A', 'C'].map((a) => `<div class="dro-r ${a === 'A' || a === 'C' ? 'rot' : ''}"><span class="dro-l">${a}</span><span class="dro-v" data-ax="${a}">0.000</span></div>`).join('')}</div>` +
      `<div class="dro-t"><i class="dot"></i><span class="dro-tool">–</span></div><div class="dro-line mono"></div><div class="dro-phase"></div>`;
    els.view.appendChild(dro);
    this.droEl = dro;
    this.droV = Object.fromEntries([...dro.querySelectorAll('[data-ax]')].map((e) => [e.dataset.ax, e]));
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
        <dl class="cb-facts"><div><dt>Tool</dt><dd class="f-tool">–</dd></div><div><dt>Feed</dt><dd class="f-feed">–</dd></div><div><dt>Spindle</dt><dd class="f-rpm">–</dd></div><div><dt>Move</dt><dd class="f-move">–</dd></div>
        <div class="wide"><dt>Tool tip in the setup frame (G68.2)</dt><dd class="f-work mono">–</dd></div></dl></div>
      <div class="gc"></div>`;
    const marksMap = new Map();
    for (const is of D.meta.issues || []) for (const l of is.lines?.length ? is.lines : [is.line]) if (l) marksMap.set(l, is.severity === 'error' ? 'error' : (marksMap.get(l) || 'warning'));
    this.list = new GcodeList(els.side.querySelector('.gc'), D.gcode, { onPick: (l) => this.gotoLine(l, false), marks: marksMap });
    const qs = (s) => els.side.querySelector(s);
    this.cb = { line: qs('.cb-line'), code: qs('.cb-code'), tool: qs('.f-tool'), feed: qs('.f-feed'), rpm: qs('.f-rpm'), move: qs('.f-move'), work: qs('.f-work') };
    this.csEl = { ico: qs('.cs-ico'), n: qs('.cs-n'), title: qs('.cs-title'), sub: qs('.cs-sub') };
    els.view.tabIndex = 0;
    els.view.addEventListener('keydown', (e) => {
      if (e.key === ' ') { e.preventDefault(); this.togglePlay(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); this.setCursor(Math.floor(this.cursor) + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); this.setCursor(Math.ceil(this.cursor) - 1); }
    });
  }
  stepSeg(dir) {
    const cur = this.segOf(this.moveAt(this.cursor));
    const atStart = this.cursor <= this.segs[cur].firstCut + 1e-9;
    const t = dir > 0 ? cur + 1 : (atStart ? cur - 1 : cur);
    this.gotoSeg(Math.max(0, Math.min(t, this.N - 1)), dir > 0 && cur >= this.N - 1);
  }
  gotoSeg(s, toEnd = false) {
    if (toEnd) { this.setCursor(this.n); return; }
    const sg = this.segs[s];
    // at the start of the setup's first feed move (the tool shown at its first cutting position, not parked)
    this.setCursor(sg.firstCut);
    this.uiT = 0;
    if (this.follow && this.mode === 'part') { this.shownSeg = s; this.view('setup'); }
  }
  setPathMode(v) {
    const u = this.path.material.uniforms;
    this.pathMode = v;
    this.shownPos = undefined;
    this.path.visible = v !== 'none';
    u.uFuture.value = v === 'past' || v === 'recent' ? 0 : 1;
    u.uWin.value = v === 'recent' || v === 'next' ? Math.max(300, this.n * 0.006) : 1e9;
    u.uFutA.value = v === 'next' ? 0.12 : 0.22;
    u.uOldA.value = 0.1;
    this.stage.invalidate();
  }
  togglePlay() {
    if (!this.playing && this.cursor >= this.n) this.setCursor(0);
    this.playing = !this.playing;
    this.lastT = performance.now();
    this.syncPlay();
    if (this.playing && this.follow && this.mode === 'part') { this.shownSeg = this.segOf(this.moveAt(this.cursor)); this.view('setup'); }
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
    const u = this.cursorToU(this.cursor);
    this.tlEl.style.setProperty('--u', (100 * u).toFixed(3) + '%');
    this.tlEl.setAttribute('aria-valuenow', (100 * u).toFixed(1));
    this.timeEl.textContent = `${fmtTime(this.cursorToTime(this.cursor))} / ${fmtTime(this.total)}`;
    if (!n) return;
    const m = this.moveAt(pos), si = this.segOf(m), sg = this.segs[si];
    const showLine = D.line[m];
    this.list.setCurrent(showLine);
    const t = D.TL[m] & 31, rapid = (D.TL[m] >> 5) & 1, spin = (D.TL[m] >> 6) & 1;
    const td = D.meta.tools[t];
    const o = m * 3, f = Math.min(Math.max(pos - m, 0), 1), g = this.cutFrac(m, f);
    const px = D.S[o] + (D.E[o] - D.S[o]) * g, py = D.S[o + 1] + (D.E[o + 1] - D.S[o + 1]) * g, pz = D.S[o + 2] + (D.E[o + 2] - D.S[o + 2]) * g;
    const code = this.list.line(showLine) || ' ';
    this.tlEl.setAttribute('aria-valuetext', `${fmtTime(this.cursorToTime(this.cursor))}, setup ${si + 1} of ${this.N}, line ${showLine}`);
    this.cb.line.textContent = `line ${showLine}`;
    this.cb.code.textContent = code;
    this.cb.tool.textContent = td ? `T${t} · ${td.name}` : 'none';
    this.cb.feed.textContent = rapid ? 'rapid' : `F${Math.round(D.feed[m])}`;
    const rpm = this.rpmAt(m);
    this.cb.rpm.textContent = spin ? `S${Math.round(rpm)}` : 'off';
    this.cb.move.textContent = `${Math.min(Math.ceil(pos), n).toLocaleString()} / ${n.toLocaleString()}`;
    this.cb.work.textContent = `X${px.toFixed(3)} Y${py.toFixed(3)} Z${pz.toFixed(3)}`;
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
    const toolTxt = td ? `T${t} · ${td.name}` : 'no tool';
    if (this.mode === 'machine' && this.mp) {
      const mp = this.mp;
      const v = { X: mp.tip[0], Y: mp.tip[1], Z: mp.tip[2], A: mp.dispA, C: mp.dispC };
      for (const k of Object.keys(v)) this.droV[k].textContent = fmtN(v[k], 9);
      this.droEl.querySelector('.dot').style.background = td ? this.toolColor(t) : 'transparent';
      this.droEl.querySelector('.dro-tool').textContent = toolTxt;
      this.droEl.querySelector('.dro-line').textContent = `N${showLine}  ${code.trim()}`;
      const ph = mp.indexing ? { retract: 'retract (Z up)', swing: 'table swings: A and C turn the part', approach: 're-approach' }[mp.phase] : '';
      const pe = this.droEl.querySelector('.dro-phase');
      pe.textContent = mp.indexing ? `Re-orienting to setup ${si + 1} · ${ph}` : `Setup ${si + 1}/${this.N} · ${rapid ? 'G0 rapid' : 'F' + Math.round(D.feed[m])} · ${spin && !mp.indexing ? 'S' + Math.round(rpm) : 'spindle off'}`;
      pe.classList.toggle('on', !!mp.indexing);
      this.droEl.classList.toggle('swinging', !!mp.indexing);
    } else {
      this.hud.querySelector('.hs-txt').textContent = this.indexing ? `indexing to setup ${si + 1} · ${setupLabel(sg)}` : `setup ${si + 1}/${this.N} · ${setupLabel(sg)}`;
      this.hud.querySelector('.dot').style.background = td ? this.toolColor(t) : 'transparent';
      this.hud.querySelector('.tname').textContent = toolTxt;
      this.hud.querySelector('.hud-state').textContent =
        `${rapid ? 'G0 rapid' : 'F' + Math.round(D.feed[m])}  ${spin ? 'S' + Math.round(rpm) : 'spindle off'}\nX${px.toFixed(3)} Y${py.toFixed(3)} Z${pz.toFixed(3)} (G68.2 setup frame)`;
    }
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

function m4rows(R) {
  return new THREE.Matrix4().set(R[0][0], R[0][1], R[0][2], 0, R[1][0], R[1][1], R[1][2], 0, R[2][0], R[2][1], R[2][2], 0, 0, 0, 0, 1);
}
