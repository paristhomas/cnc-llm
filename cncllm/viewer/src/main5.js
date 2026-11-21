// 3+2 report page entry: decodes window.CNCLLM_DATA (gzip blob in base64, see cncllm/report5.py) and mounts the
// 3+2 cutting simulation and the final result view. Exposes window.CNCViewer for tests.
import * as THREE from 'three';
import { SimView5 } from './simview5.js';
import { ResultView5, TabsView } from './resultview5.js';
import { TOOL_PALETTE } from './colors.js';
import { topField } from './geom5.js';
import workerSrc from '../dist/worker5.txt';

const TYPES = { float32: Float32Array, float64: Float64Array, uint32: Uint32Array, int32: Int32Array, uint8: Uint8Array, int8: Int8Array, uint16: Uint16Array };

async function decode(raw) {
  const meta = raw.meta;
  const bin = atob(raw.blob);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  let buf = u8.buffer;
  if (meta.gzip) {
    if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot decompress the viewer data (DecompressionStream missing); use a current Chrome, Edge, Firefox or Safari.');
    const ds = new DecompressionStream('gzip');
    buf = await new Response(new Blob([u8]).stream().pipeThrough(ds)).arrayBuffer();
  }
  const A = {};
  for (const [k, v] of Object.entries(meta.arrays)) A[k] = new TYPES[v.type](buf, v.off, v.len);
  const n = meta.n_moves;
  const E = A.mv_end, S = new Float32Array(n * 3);
  if (n) { S.set(meta.start0, 0); S.set(E.subarray(0, (n - 1) * 3), 3); }
  for (const b of meta.breaks) S.set([b[1], b[2], b[3]], b[0] * 3);
  // segments: frame, quaternion, final height field, move -> segment
  const segOf = new Uint16Array(n);
  const segs = meta.segments.map((s, i) => {
    const R = s.R;
    const m4 = new THREE.Matrix4().makeBasis(new THREE.Vector3(R[0][0], R[1][0], R[2][0]), new THREE.Vector3(R[0][1], R[1][1], R[2][1]), new THREE.Vector3(R[0][2], R[1][2], R[2][2]));
    const sg = { ...s, quat: new THREE.Quaternion().setFromRotationMatrix(m4) };
    segOf.fill(i, s.a, s.b);
    if (s.grid) {
      const top = topField(sg, meta.stock), Dd = A[`seg${i}_D`], H = new Float32Array(top.length);
      for (let k = 0; k < H.length; k++) H[k] = top[k] - Dd[k];
      sg.finalH = H;
      sg.finalOwn = A[`seg${i}_own`];
    }
    return sg;
  });
  // replay coordinates (frame z + zoff) and fixture coordinates (toolpath, tool)
  const SZ = new Float32Array(n * 3), EZ = new Float32Array(n * 3), FS = new Float32Array(n * 3), FE = new Float32Array(n * 3);
  for (const sg of segs) {
    const R = sg.R, o = sg.o, z = sg.zoff;
    for (let m = sg.a; m < sg.b; m++) {
      const k = m * 3;
      for (const [src, dz, dst] of [[S, SZ, FS], [E, EZ, FE]]) {
        const x = src[k], y = src[k + 1], w = src[k + 2];
        dz[k] = x; dz[k + 1] = y; dz[k + 2] = w + z;
        dst[k] = o[0] + R[0][0] * x + R[0][1] * y + R[0][2] * w;
        dst[k + 1] = o[1] + R[1][0] * x + R[1][1] * y + R[1][2] * w;
        dst[k + 2] = o[2] + R[2][0] * x + R[2][1] * y + R[2][2] * w;
      }
    }
  }
  // machine time per move (+ the indexing time on the first move of every new setup) -> cumulative clock
  const TL = A.mv_tool, feed = A.mv_feed, cum = new Float64Array(n + 1), phi = new Float32Array(n);
  const idxT = meta.index_time_s || 6;
  for (let m = 0; m < n; m++) {
    const o = m * 3;
    const L = Math.hypot(E[o] - S[o], E[o + 1] - S[o + 1], E[o + 2] - S[o + 2]);
    const rapid = (TL[m] >> 5) & 1;
    const f = rapid ? meta.rapid_rate : Math.max(feed[m], 1);
    let dt = (L / f) * 60;
    if (m > 0 && segOf[m] !== segOf[m - 1]) { phi[m] = idxT / (idxT + dt); dt += idxT; }
    cum[m + 1] = cum[m] + dt;
  }
  const gcode = new TextDecoder().decode(A.gcode);
  const lines = A.mv_line, nl = Math.max(meta.n_lines + 2, n ? lines[n - 1] + 2 : 2);
  const firstMove = new Int32Array(nl).fill(-1);
  for (let m = 0; m < n; m++) if (firstMove[lines[m]] < 0) firstMove[lines[m]] = m;
  let next = n;
  for (let l = nl - 1; l >= 0; l--) { if (firstMove[l] < 0) firstMove[l] = next; else next = firstMove[l]; }
  for (const sg of segs) {   // first feed (cutting) move of each setup
    sg.firstCut = sg.a;
    for (let m = sg.a; m < sg.b; m++) if (!((A.mv_tool[m] >> 5) & 1)) { sg.firstCut = m; break; }
  }
  const toolsUsed = [];
  for (let m = 0; m < n; m++) { const t = TL[m] & 31; if (t && !toolsUsed.includes(t)) toolsUsed.push(t); }
  for (const sg of segs) { sg.fixHits = 0; for (let m = sg.a; m < sg.b; m++) if (A.mv_fix[m]) sg.fixHits++; }
  return {
    meta, segs, segOf, S, E, SZ, EZ, FS, FE, TL, cum, phi, gcode, firstMove, toolsUsed, line: lines, feed, crash: A.mv_crash, fix: A.mv_fix,
    meshV: A.mesh_V, meshF: A.mesh_F, meshDev: A.mesh_dev, meshCls: A.mesh_cls, meshRa: A.mesh_ra || null, meshEdges: A.mesh_edges,
  };
}

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

const STATIC = /[?&]static=1\b/.test(location.search) || location.hash === '#static';
window.CNCLLM_STATIC = STATIC;

async function boot() {
  const api = window.CNCViewer = { ready: false };
  const raw = window.CNCLLM_DATA;
  const simEl = document.getElementById('simview');
  if (!raw || !simEl) return;
  const fail = (e) => {
    console.error(e);
    for (const el of document.querySelectorAll('.vp-msg')) { el.textContent = '3D viewer unavailable: ' + (e.message || e); el.classList.add('err'); }
    api.error = String(e.message || e);
  };
  let D;
  try {
    const t0 = performance.now();
    D = await decode(raw);
    api.decodeMs = performance.now() - t0;
  } catch (e) { fail(e); return; }
  const colorOf = {};
  D.toolsUsed.forEach((t, i) => { colorOf[t] = TOOL_PALETTE[i % TOOL_PALETTE.length]; });
  const toolColor = (t) => colorOf[t] || '#888888';
  document.querySelectorAll('.swatch[data-tool]').forEach((s) => { s.style.background = toolColor(+s.dataset.tool); });
  try {
    api.sim = new SimView5(D, { view: simEl, controls: document.getElementById('simcontrols'), side: document.getElementById('simside') }, toolColor, workerSrc);
  } catch (e) { fail(e); return; }
  api.data = D;
  // Machine view self-check from the rendered objects (see SimView5.machineCheck), before the page reports ready
  try {
    const t0 = performance.now();
    window.__machineCheck = api.sim.machineCheck();
    window.__machineCheck.ms = Math.round(performance.now() - t0);
    if (!window.__machineCheck.pass) console.warn('Machine view self-check failed', window.__machineCheck);
  } catch (e) { console.error('Machine view self-check could not run', e); window.__machineCheck = { error: String(e) }; }
  // deterministic hooks for reviews and screenshots
  window.__viewer = {
    seekSwing: (seg, t) => api.sim.seekSwing(seg, t),
    setMode: (m) => api.sim.setMode(m, false),
    gotoSeg: (s) => api.sim.gotoSeg(s),
    seekU: (u) => { api.sim.playing = false; api.sim.syncPlay(); api.sim.setCursor(api.sim.uToCursor(u)); return api.sim.cursor; },
    state: () => ({ mode: api.sim.mode, cursor: api.sim.cursor, caught: !!api.sim.caught, u: api.sim.cursorToU(api.sim.cursor),
      segments: api.sim.N, playing: api.sim.playing, pose: api.sim.mp ? { phase: api.sim.mp.phase, A: api.sim.mp.dispA, C: api.sim.mp.dispC, tip: api.sim.mp.tip } : null }),
  };
  const resEl = document.getElementById('resview');
  let pendingRegion = null;
  const makeResult = () => {
    if (api.result || !resEl) return api.result;
    try {
      api.result = new ResultView5(D, { view: resEl, bar: document.getElementById('resbar') });
      if (pendingRegion) api.result.focusRegion(pendingRegion, false);
    } catch (e) { fail(e); }
    return api.result;
  };
  api.makeResult = makeResult;
  // part-off 3D close-up, created when its section comes near the viewport
  const tabEl = document.getElementById('tabview');
  if (tabEl) {
    const makeTabs = () => { if (api.tabs) return api.tabs; try { api.tabs = new TabsView(D, tabEl); } catch (e) { fail(e); } return api.tabs; };
    api.makeTabs = makeTabs;
    if (STATIC) makeTabs();
    else { const io2 = new IntersectionObserver((e) => { if (e[0].isIntersecting) { makeTabs(); io2.disconnect(); } }, { rootMargin: '400px' }); io2.observe(tabEl); }
  }
  if (resEl) {
    if (STATIC) makeResult();
    else {
      const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { makeResult(); io.disconnect(); } }, { rootMargin: '600px' });
      io.observe(resEl);
      const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1500));
      idle(() => makeResult(), { timeout: 3000 });
    }
  }
  document.addEventListener('click', (e) => {
    const gl = e.target.closest('[data-gline]');
    if (gl) {
      e.preventDefault();
      const l = +gl.dataset.gline;
      api.sim.gotoLine(l, true);
      toast(`Line ${l}: animation positioned after its first move`);
      return;
    }
    const sg = e.target.closest('[data-goseg]');
    if (sg) {
      e.preventDefault();
      api.sim.gotoSeg(+sg.dataset.goseg);
      simEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const rg = e.target.closest('[data-region]');
    if (rg) {
      e.preventDefault();
      const id = +rg.dataset.region;
      if (resEl) resEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const r = makeResult();
      if (r) r.focusRegion(id, false); else pendingRegion = id;
    }
  });
  api.ready = true;
  document.documentElement.classList.add('viewer-ready');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
