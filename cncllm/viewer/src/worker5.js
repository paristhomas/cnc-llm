// Background replay of a 3+2 program: every segment on its own frame height field (starting at the stock-box top);
// posts keyframes every K moves and each segment's final field (checked against the simulator's export).
import { applyRange } from './simcore.js';
import { segmentHF, topField } from './geom5.js';

self.onmessage = (ev) => {
  const { segs, stock, tools, S, E, TL, K } = ev.data;
  const t0 = performance.now();
  let lastPost = t0;
  segs.forEach((sg, s) => {
    if (!sg.grid) return;
    const hf = segmentHF(sg, topField(sg, stock), tools);
    applyRange(hf, S, E, TL, sg.a, sg.b, 0, (m) => {
      if (m > sg.a && (m - sg.a) % K === 0) {
        hf.refreshDirtyBlocks(); hf.resetDirty();
        const H = hf.H.slice(), own = hf.own.slice();
        self.postMessage({ type: 'key', s, k: m, H, own }, [H.buffer, own.buffer]);
      }
      if ((m & 255) === 0) {
        const now = performance.now();
        if (now - lastPost > 200) { lastPost = now; self.postMessage({ type: 'progress', m }); }
      }
      if ((m & 1023) === 0) { hf.refreshDirtyBlocks(); hf.resetDirty(); }
    });
    const H = hf.H.slice();
    self.postMessage({ type: 'seg', s, H }, [H.buffer]);
  });
  self.postMessage({ type: 'done', ms: performance.now() - t0 });
};
