// Report page entry: decodes window.CNCLLM_DATA (gzip blob in base64, see cncllm/report.py) and mounts the
// cutting simulation and the final result views. Exposes window.CNCViewer for tests.
import { SimView } from './simview.js';
import { ResultView } from './resultview.js';
import { TOOL_PALETTE } from './colors.js';
import workerSrc from '../dist/worker.txt';

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
  // move starts: previous end, the program start, or an explicit break
  const E = A.mv_end, S = new Float32Array(n * 3);
  if (n) { S.set(meta.start0, 0); S.set(E.subarray(0, (n - 1) * 3), 3); }
  for (const b of meta.breaks) S.set([b[1], b[2], b[3]], b[0] * 3);
  // machine time per move (feeds as programmed, rapids at the rapid rate) -> cumulative clock
  const TL = A.mv_tool, feed = A.mv_feed, cum = new Float64Array(n + 1);
  for (let m = 0; m < n; m++) {
    const o = m * 3;
    const L = Math.hypot(E[o] - S[o], E[o + 1] - S[o + 1], E[o + 2] - S[o + 2]);
    const rapid = (TL[m] >> 5) & 1;
    const f = rapid ? meta.rapid_rate : Math.max(feed[m], 1);
    cum[m + 1] = cum[m] + (L / f) * 60;
  }
  const gcode = new TextDecoder().decode(A.gcode);
  // first move at or after each G-code line
  const lines = A.mv_line, nl = Math.max(meta.n_lines + 2, n ? lines[n - 1] + 2 : 2);
  const firstMove = new Int32Array(nl).fill(-1);
  for (let m = 0; m < n; m++) if (firstMove[lines[m]] < 0) firstMove[lines[m]] = m;
  let next = n;
  for (let l = nl - 1; l >= 0; l--) { if (firstMove[l] < 0) firstMove[l] = next; else next = firstMove[l]; }
  const toolsUsed = [];
  for (let m = 0; m < n; m++) { const t = TL[m] & 31; if (t && !toolsUsed.includes(t)) toolsUsed.push(t); }
  return {
    meta, S, E, TL, cum, gcode, firstMove, toolsUsed, line: lines, feed, crash: A.mv_crash,
    H: A.H, Ht: A.Ht, meshV: A.mesh_V, meshF: A.mesh_F, meshDev: A.mesh_dev, meshCls: A.mesh_cls, meshEdges: A.mesh_edges,
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

// ?static=1 (or #static): render every 3D view continuously, even off-screen, and keep the drawing buffer, so a
// headless full-page screenshot shows everything
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
    api.sim = new SimView(D, { view: simEl, controls: document.getElementById('simcontrols'), side: document.getElementById('simside') }, toolColor, workerSrc);
  } catch (e) { fail(e); return; }
  api.data = D;
  // the result view is created when it scrolls near the viewport (keeps the initial load light)
  const resEl = document.getElementById('resview');
  let pendingRegion = null;
  const makeResult = () => {
    if (api.result || !resEl) return api.result;
    try {
      api.result = new ResultView(D, { view: resEl, bar: document.getElementById('resbar') });
      if (pendingRegion) api.result.focusRegion(pendingRegion, false);
    } catch (e) { fail(e); }
    return api.result;
  };
  api.makeResult = makeResult;
  if (resEl) {
    if (STATIC) makeResult();
    else {
      const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { makeResult(); io.disconnect(); } }, { rootMargin: '600px' });
      io.observe(resEl);
      // also build it shortly after load, so it is ready before the reader gets there
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
