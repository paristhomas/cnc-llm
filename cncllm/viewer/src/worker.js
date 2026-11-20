// Background replay: runs the whole program once and posts keyframe snapshots (H + owner tool after k moves),
// so scrubbing anywhere is fast. Bundled separately and started from a Blob URL (works from file://).
import { HeightField, applyRange } from './simcore.js';

self.onmessage = (ev) => {
  const { grid, stock, tools, S, E, TL, K } = ev.data;
  const hf = new HeightField(grid, stock, tools);
  const n = TL.length;
  const t0 = performance.now();
  let lastPost = t0;
  applyRange(hf, S, E, TL, 0, n, 0, (m) => {
    if (m > 0 && m % K === 0) {
      hf.refreshDirtyBlocks();
      hf.resetDirty();
      const H = hf.H.slice(), own = hf.own.slice();
      self.postMessage({ type: 'key', k: m, H, own }, [H.buffer, own.buffer]);
    }
    if ((m & 255) === 0) {
      const now = performance.now();
      if (now - lastPost > 200) { lastPost = now; self.postMessage({ type: 'progress', m }); }
    }
    if ((m & 1023) === 0) { hf.refreshDirtyBlocks(); hf.resetDirty(); }
  });
  const H = hf.H.slice(), own = hf.own.slice();
  self.postMessage({ type: 'done', k: n, H, own, ms: performance.now() - t0, work: hf.work }, [H.buffer, own.buffer]);
};
