// Cutting animation: replays the program on a height-field stock in the browser.
//  * playback clock = machine time (feeds as programmed, rapids at the machine rapid rate) x speed
//  * display state = moves [0, dIdx) applied + fraction dFrac of move dIdx (a partial move is a shorter move:
//    the union of the swept volumes of the pieces is the swept volume of the whole move, so this is exact)
//  * keyframes (H + owner snapshots every K moves) come from a background worker (or are saved while playing),
//    so scrubbing backwards / far ahead restores the nearest keyframe and replays only the rest
import * as THREE from 'three';
import { Stage } from './scene.js';
import { HeightField, applyRange } from './simcore.js';
import { StockMesh } from './stockmesh.js';
import { buildToolpath } from './toolpath.js';
import { buildTool } from './toolmodel.js';
import { RAPID } from './colors.js';
import { GcodeList } from './gcodelist.js';

const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="currentColor"/></svg>',
  start: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2.4v14H6zM19 5.5v13L9.5 12z" fill="currentColor"/></svg>',
  end: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.6 5H18v14h-2.4zM5 5.5v13L14.5 12z" fill="currentColor"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 6 9.5 12l6 6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fwd: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.5 6 6 6-6 6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const SPEEDS = [1, 4, 16, 64, 256, 1024, 4096];

export function fmtTime(s) {
  s = Math.max(0, s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60);
  return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0');
}

export class SimView {
  constructor(D, els, toolColor, workerSrc) {
    this.D = D;
    this.els = els;
    this.toolColor = toolColor;
    const meta = D.meta, n = this.n = meta.n_moves;
    this.stage = new Stage(els.view, meta.stock);
    this.hf = new HeightField(meta.grid, meta.stock, meta.tools);
    this.mat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.78, roughness: 0.3, flatShading: true });
    this.mesh = new StockMesh(meta.grid, meta.stock, this.mat);
    this.mesh.tol = meta.tolerance || 0.1;
    const tc = {};
    for (const t of D.toolsUsed) tc[t] = toolColor(t);
    this.mesh.setToolColors(tc);
    this.mesh.update(this.hf.H, this.hf.own, D.Ht, 0, meta.grid.ny - 1, true);
    this.stage.scene.add(this.mesh.group);
    // toolpath
    this.path = buildToolpath(D.S, D.E, D.TL, toolColor, this.stage.diag);
    this.stage.scene.add(this.path);
    // target ghost
    this.ghost = buildGhost(D);
    this.ghost.visible = false;
    this.stage.scene.add(this.ghost);
    // tools
    this.toolModels = {};
    this.toolObj = null;
    this.curTool = -1;
    // playback state
    this.cursor = 0; this.playTime = 0; this.playing = false;
    this.dIdx = 0; this.dFrac = 0;
    this.K = Math.max(500, Math.ceil(n / 40));
    this.keys = new Map([[0, { H: this.hf.H0, own: new Uint8Array(this.hf.H.length) }]]);
    this.keyList = [0];
    this.total = D.cum[n];
    this.speed = SPEEDS.find((s) => this.total / s <= 75) || SPEEDS[SPEEDS.length - 1];
    if (this.total / this.speed < 8 && this.speed > 1) this.speed = SPEEDS[Math.max(0, SPEEDS.indexOf(this.speed) - 1)];
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

  // ------------------------------------------------------------------ worker / keyframes
  startWorker(src) {
    this.workerState = 'none';
    if (!src || typeof Worker === 'undefined' || this.n < 2) return;
    try {
      const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
      const w = this.worker = new Worker(url);
      const D = this.D, m = D.meta;
      this.workerState = 'running';
      this.workerProgress = 0;
      w.onmessage = (e) => {
        const d = e.data;
        if (d.type === 'progress') this.workerProgress = d.m;
        else if (d.type === 'key' || d.type === 'done') {
          this.addKey(d.k, d.H, d.own);
          if (d.type === 'done') { this.workerState = 'done'; this.workerMs = d.ms; this.checkReplay(d.H); w.terminate(); URL.revokeObjectURL(url); }
          else this.workerProgress = d.k;
        }
        this.uiT = 0;
      };
      w.onerror = (e) => { console.warn('replay worker failed, falling back to main thread', e.message); this.workerState = 'failed'; };
      w.postMessage({ grid: m.grid, stock: m.stock, tools: m.tools, S: D.S, E: D.E, TL: D.TL, K: this.K });
    } catch (err) {
      console.warn('no worker', err);
      this.workerState = 'failed';
    }
  }
  addKey(k, H, own) {
    if (this.keys.has(k)) return;
    this.keys.set(k, { H, own });
    this.keyList.push(k);
    this.keyList.sort((a, b) => a - b);
  }
  bestKey(m) {   // largest keyframe index <= m
    const L = this.keyList;
    let lo = 0, hi = L.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (L[mid] <= m) lo = mid; else hi = mid - 1; }
    return L[lo];
  }
  restore(k) {
    const key = this.keys.get(k);
    this.hf.load(key.H, key.own);
    this.dIdx = k; this.dFrac = 0;
  }
  checkReplay(Hjs) {
    // compare the browser replay with the simulator's exported height field (inside the stock)
    const Hp = this.D.H, mesh = this.mesh, nx = this.D.meta.grid.nx;
    let bad = 0, cnt = 0, mx = 0;
    for (let i = mesh.iA; i <= mesh.iB; i++) {
      for (let j = mesh.jA; j <= mesh.jB; j++) {
        const d = Math.abs(Hjs[i * nx + j] - Hp[i * nx + j]);
        cnt++; if (d > mx) mx = d; if (d > 0.002) bad++;
      }
    }
    this.replay = { pct: 100 * (1 - bad / cnt), max: mx, cells: cnt };
    this.updateStatus();
  }

  // ------------------------------------------------------------------ geometry helpers
  pointAt(m, f, out) {
    const S = this.D.S, E = this.D.E, o = m * 3;
    out.set(S[o] + (E[o] - S[o]) * f, S[o + 1] + (E[o + 1] - S[o + 1]) * f, S[o + 2] + (E[o + 2] - S[o + 2]) * f);
    return out;
  }
  applySub(m, f0, f1) {
    const S = this.D.S, E = this.D.E, o = m * 3, TL = this.D.TL;
    const ax = S[o] + (E[o] - S[o]) * f0, ay = S[o + 1] + (E[o + 1] - S[o + 1]) * f0, az = S[o + 2] + (E[o + 2] - S[o + 2]) * f0;
    const bx = S[o] + (E[o] - S[o]) * f1, by = S[o + 1] + (E[o + 1] - S[o + 1]) * f1, bz = S[o + 2] + (E[o + 2] - S[o + 2]) * f1;
    this.hf.apply(ax, ay, az, bx, by, bz, TL[m] & 31);
  }
  // bring the display state to the cursor within the time budget; returns true when caught up
  advance(deadline) {
    const n = this.n, target = this.cursor;
    let tInt = Math.min(Math.floor(target), n);
    const tFrac = tInt < n ? target - tInt : 0;
    if (tInt < this.dIdx || (tInt === this.dIdx && tFrac < this.dFrac - 1e-9)) this.restore(this.bestKey(tInt));
    const k = this.bestKey(tInt);
    if (k > this.dIdx + 64 || (k > this.dIdx && this.dFrac === 0 && k - this.dIdx > 4)) this.restore(k);
    if (this.dIdx < tInt) {
      if (this.dFrac > 0) { this.applySub(this.dIdx, this.dFrac, 1); this.dIdx++; this.dFrac = 0; }
      const save = (this.workerState === 'running' || this.workerState === 'done') ? null : (m) => {
        if (m > 0 && m % this.K === 0 && !this.keys.has(m)) this.addKey(m, this.hf.H.slice(), this.hf.own.slice());
      };
      this.dIdx = applyRange(this.hf, this.D.S, this.D.E, this.D.TL, this.dIdx, tInt, deadline, save);
    }
    if (this.dIdx === tInt && tInt < n && tFrac > this.dFrac) { this.applySub(tInt, this.dFrac, tFrac); this.dFrac = tFrac; }
    return this.dIdx === tInt && (tInt >= n || this.dFrac >= tFrac - 1e-9);
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
    if (this.hf.dirty) {
      this.hf.refreshDirtyBlocks();
      this.mesh.update(this.hf.H, this.hf.own, this.D.Ht, this.hf.di0, this.hf.di1);
      this.hf.resetDirty();
      changed = true;
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
  placeTool(pos) {
    const n = this.n;
    if (!n) return;
    const m = this.moveAt(pos), f = Math.min(Math.max(pos - m, 0), 1);
    this.updateTool(m);
    if (!this.toolObj) return;
    this.pointAt(m, f, this.toolObj.position);
    this.spinning = ((this.D.TL[m] >> 6) & 1) === 1;
    // park: hide the tool once the program has finished so it does not hide the part
    this.toolObj.visible = this.showTool !== false && pos < n;
  }
  // the move the tool is on (fractional position) or has just finished (integer position); -> its G-code line is "current"
  moveAt(pos) {
    return Math.max(0, Math.min(Math.ceil(pos) - 1, this.n - 1));
  }
  updateTool(m) {
    const t = this.n ? this.D.TL[Math.min(m, this.n - 1)] & 31 : 0;
    if (t === this.curTool) return;
    this.curTool = t;
    if (this.toolObj) this.stage.scene.remove(this.toolObj);
    this.toolObj = null;
    const td = this.D.meta.tools[t];
    if (!td) return;
    if (!this.toolModels[t]) this.toolModels[t] = buildTool(td, this.toolColor(t));
    this.toolObj = this.toolModels[t];
    this.toolObj.visible = this.showTool !== false;
    this.stage.scene.add(this.toolObj);
  }

  // ------------------------------------------------------------------ UI
  buildUI() {
    const D = this.D, n = this.n, els = this.els;
    els.controls.innerHTML = `
      <div class="ctl-row">
        <button class="ib play" type="button" aria-label="Play">${ICON.play}</button>
        <button class="ib" type="button" data-act="start" aria-label="Back to start" title="Back to start">${ICON.start}</button>
        <button class="ib" type="button" data-act="back" aria-label="Previous move" title="Previous move (←)">${ICON.back}</button>
        <button class="ib" type="button" data-act="fwd" aria-label="Next move" title="Next move (→)">${ICON.fwd}</button>
        <button class="ib" type="button" data-act="end" aria-label="Jump to end" title="Jump to the end">${ICON.end}</button>
        <div class="scrub-wrap"><input class="scrub" type="range" min="0" max="${n}" step="any" value="0" aria-label="Program position"><div class="scrub-marks"></div></div>
        <span class="time mono" aria-live="off">0:00 / ${fmtTime(this.total)}</span>
      </div>
      <div class="ctl-row opts">
        <label>Speed <select class="speed">${SPEEDS.map((s) => `<option value="${s}" ${s === this.speed ? 'selected' : ''}>${s}×</option>`).join('')}<option value="turbo">max</option></select></label>
        <label>Colour <select class="colour"><option value="tool">by tool</option><option value="error">height error</option><option value="plain">aluminium</option></select></label>
        <label>Path <select class="pathmode"><option value="recent">recent + next</option><option value="all">all (past + future)</option><option value="past">past only</option><option value="none">off</option></select></label>
        <label class="chk"><input type="checkbox" class="rapids" checked> rapids</label>
        <label class="chk"><input type="checkbox" class="ghost"> target</label>
        <label class="chk"><input type="checkbox" class="showtool" checked> tool</label>
        <span class="seg views" role="group" aria-label="View"><button type="button" data-view="iso">Iso</button><button type="button" data-view="top">Top</button><button type="button" data-view="front">Front</button></span>
      </div>`;
    const q = (s) => els.controls.querySelector(s);
    this.playBtn = q('.play');
    this.scrub = q('.scrub');
    this.timeEl = q('.time');
    this.playBtn.onclick = () => this.togglePlay();
    els.controls.querySelectorAll('[data-act]').forEach((b) => (b.onclick = () => {
      const a = b.dataset.act;
      if (a === 'start') { this.playing = false; this.syncPlay(); this.setCursor(0); }
      else if (a === 'end') { this.playing = false; this.syncPlay(); this.setCursor(n); }
      else if (a === 'back') { this.playing = false; this.syncPlay(); this.setCursor(Math.ceil(this.cursor) - 1); }
      else if (a === 'fwd') { this.playing = false; this.syncPlay(); this.setCursor(Math.floor(this.cursor) + 1); }
    }));
    this.scrub.addEventListener('input', () => { this.setCursor(+this.scrub.value); });
    q('.speed').onchange = (e) => { const v = e.target.value; this.speed = v === 'turbo' ? Math.max(this.total / 12, 1) : +v; };
    q('.colour').onchange = (e) => { this.mesh.mode = e.target.value; this.mesh.update(this.hf.H, this.hf.own, D.Ht, 0, D.meta.grid.ny - 1, true); this.stage.invalidate(); };
    q('.pathmode').onchange = (e) => {
      this.setPathMode(e.target.value);
    };
    q('.pathmode').value = n > 3000 ? 'recent' : 'all';
    this.setPathMode(q('.pathmode').value);
    q('.rapids').onchange = (e) => { this.path.material.uniforms.uRapids.value = e.target.checked ? 1 : 0; this.stage.invalidate(); };
    q('.ghost').onchange = (e) => { this.ghost.visible = e.target.checked; this.legGhost.hidden = !e.target.checked; this.stage.invalidate(); };
    q('.showtool').onchange = (e) => { this.showTool = e.target.checked; if (this.toolObj) this.toolObj.visible = this.showTool; this.stage.invalidate(); };
    els.controls.querySelectorAll('[data-view]').forEach((b) => (b.onclick = () => this.stage.view(b.dataset.view)));
    // marks on the scrubber: tool changes and error moves
    const marks = q('.scrub-marks');
    let html = '', last = -1;
    for (let m = 0; m < n; m++) {
      const t = D.TL[m] & 31;
      if (t !== last && t) html += `<i class="tc" style="left:${(100 * m / n).toFixed(3)}%;background:${this.toolColor(t)}" title="T${t} from line ${D.line[m]}"></i>`;
      last = t;
    }
    const errMoves = [];
    for (let m = 0; m < n && errMoves.length < 200; m++) if (D.crash[m]) errMoves.push(m);
    for (const m of errMoves) html += `<i class="err" style="left:${(100 * m / n).toFixed(3)}%" title="crash flag at line ${D.line[m]}"></i>`;
    marks.innerHTML = html;
    // HUD overlay in the viewport
    const hud = document.createElement('div');
    hud.className = 'hud';
    hud.innerHTML = `<div class="hud-tool"><i class="dot"></i><span class="tname">–</span></div><div class="hud-state mono"></div>`;
    els.view.appendChild(hud);
    this.hud = hud;
    const st = document.createElement('div');
    st.className = 'vp-status';
    els.view.appendChild(st);
    this.statusEl = st;
    const leg = document.createElement('div');
    leg.className = 'vp-legend';
    leg.innerHTML = D.toolsUsed.map((t) => `<span><i style="background:${this.toolColor(t)}"></i>T${t}</span>`).join('') +
      `<span><i class="dash" style="--c:${RAPID}"></i>rapid</span><span class="muted-l">faint = still to run</span><span class="lg-ghost" hidden><i style="background:#2f8cff"></i>target part (overlay)</span>`;
    els.view.appendChild(leg);
    this.legGhost = leg.querySelector('.lg-ghost');
    // side panel: current block, tool, listing
    els.side.innerHTML = `
      <div class="cur-block"><div class="cb-head"><span class="cb-label">Current block</span><span class="cb-line mono"></span></div><div class="cb-code mono"></div>
        <dl class="cb-facts"><div><dt>Tool</dt><dd class="f-tool">–</dd></div><div><dt>Feed</dt><dd class="f-feed">–</dd></div><div><dt>Spindle</dt><dd class="f-rpm">–</dd></div><div><dt>Move</dt><dd class="f-move">–</dd></div></dl></div>
      <div class="gc"></div>`;
    const marksMap = new Map();
    for (const is of D.meta.issues || []) for (const l of is.lines?.length ? is.lines : [is.line]) if (l) marksMap.set(l, is.severity === 'error' ? 'error' : (marksMap.get(l) || 'warning'));
    this.list = new GcodeList(els.side.querySelector('.gc'), D.gcode, { onPick: (l) => this.gotoLine(l, false), marks: marksMap });
    this.cb = {
      line: els.side.querySelector('.cb-line'), code: els.side.querySelector('.cb-code'), tool: els.side.querySelector('.f-tool'),
      feed: els.side.querySelector('.f-feed'), rpm: els.side.querySelector('.f-rpm'), move: els.side.querySelector('.f-move'),
    };
    // keyboard
    els.view.tabIndex = 0;
    els.view.addEventListener('keydown', (e) => {
      if (e.key === ' ') { e.preventDefault(); this.togglePlay(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); this.setCursor(Math.floor(this.cursor) + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); this.setCursor(Math.ceil(this.cursor) - 1); }
    });
  }
  setPathMode(v) {
    const u = this.path.material.uniforms;
    this.path.visible = v !== 'none';
    u.uFuture.value = v === 'past' ? 0 : 1;
    // 'recent': only the last ~2 % of the program (at least 400 moves) stays bright, older moves fade out
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
    this.stage.invalidate();
  }
  syncPlay() {
    this.playBtn.innerHTML = this.playing ? ICON.pause : ICON.play;
    this.playBtn.setAttribute('aria-label', this.playing ? 'Pause' : 'Play');
    this.playBtn.classList.toggle('on', this.playing);
  }
  // jump to the end of the first move programmed on (or after) G-code line l
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
    const m = this.moveAt(pos);
    const showLine = D.line[m];
    this.list.setCurrent(showLine);
    const t = D.TL[m] & 31, rapid = (D.TL[m] >> 5) & 1, spin = (D.TL[m] >> 6) & 1;
    const td = D.meta.tools[t];
    const p = this.pointAt(m, Math.min(Math.max(pos - m, 0), 1), new THREE.Vector3());
    this.cb.line.textContent = `line ${showLine}`;
    this.cb.code.textContent = this.list.line(showLine) || ' ';
    this.cb.tool.textContent = td ? `T${t} · ${td.name}` : 'none';
    this.cb.feed.textContent = rapid ? 'rapid' : `F${Math.round(D.feed[m])}`;
    const rpm = this.rpmAt(m);
    this.cb.rpm.textContent = spin ? `S${Math.round(rpm)}` : 'off';
    this.cb.move.textContent = `${Math.min(Math.ceil(pos), n).toLocaleString()} / ${n.toLocaleString()}`;
    this.hud.querySelector('.dot').style.background = td ? this.toolColor(t) : 'transparent';
    this.hud.querySelector('.tname').textContent = td ? `T${t} · ${td.name}` : 'no tool';
    this.hud.querySelector('.hud-state').textContent =
      `${rapid ? 'G0 rapid' : 'F' + Math.round(D.feed[m])}  ${spin ? 'S' + Math.round(rpm) : 'spindle off'}\nX${p.x.toFixed(3)} Y${p.y.toFixed(3)} Z${p.z.toFixed(3)}`;
    this.updateStatus();
  }
  updateStatus() {
    let s = '';
    if (!this.caught) s = '<span class="spin"></span> computing…';
    else if (this.workerState === 'running') s = `<span class="spin"></span> pre-computing keyframes ${Math.round(100 * (this.workerProgress || 0) / this.n)}%`;
    else if (this.replay) {
      const ok = this.replay.pct >= 99.5;
      s = `<span class="${ok ? 'okc' : 'badc'}">${ok ? '✓' : '!'}</span> replay matches simulator on ${this.replay.pct.toFixed(2)}% of cells`;
      this.statusEl.title = `Browser replay vs simulator height field: max |Δ| ${this.replay.max.toFixed(4)} mm over ${this.replay.cells.toLocaleString()} cells; pre-computed in ${(this.workerMs / 1000).toFixed(1)} s`;
    }
    if (s !== this._st) { this._st = s; this.statusEl.innerHTML = s; this.statusEl.hidden = !s; }
  }
}

export function buildGhost(D) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(D.meshV, 3));
  g.setIndex(new THREE.BufferAttribute(D.meshF, 1));
  g.computeVertexNormals();
  const grp = new THREE.Group();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x2f8cff, emissive: 0x0d3c80, transparent: true, opacity: 0.38, depthWrite: false, metalness: 0, roughness: 0.6, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }));
  m.renderOrder = 3;
  let eg;
  if (D.meshEdges && D.meshEdges.length) {
    eg = new THREE.BufferGeometry();
    eg.setAttribute('position', new THREE.BufferAttribute(D.meshEdges, 3));
  } else eg = new THREE.EdgesGeometry(g, 28);
  const e = new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color: 0x0a4fc2, transparent: true, opacity: 1.0, depthWrite: false, depthTest: false }));
  e.renderOrder = 4;
  grp.add(m, e);
  return grp;
}
