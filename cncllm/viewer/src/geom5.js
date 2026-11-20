// 3+2 helpers shared by the page and the replay worker (no three.js here).
import { HeightField } from './simcore.js';

// stock-box top along the frame z axis over frame column (x, y), + zoff; `big` where the column misses the box
// (R: 3x3 rows, columns = frame axes in fixture coordinates)
export function boxTop(R, o, lo, hi, x, y, zoff, big) {
  let tmin = -Infinity, tmax = Infinity;
  for (let a = 0; a < 3; a++) {
    const c = o[a] + R[a][0] * x + R[a][1] * y, d = R[a][2];
    if (Math.abs(d) < 1e-12) { if (c < lo[a] || c > hi[a]) return big; }
    else {
      const t1 = (lo[a] - c) / d, t2 = (hi[a] - c) / d;
      tmin = Math.max(tmin, Math.min(t1, t2)); tmax = Math.min(tmax, Math.max(t1, t2));
    }
  }
  return tmax >= tmin ? tmax + zoff : big;
}

export function topField(sg, stock) {
  const { x0, y0, res, nx, ny } = sg.grid, T = new Float32Array(nx * ny);
  for (let i = 0; i < ny; i++) {
    const y = y0 + (i + 0.5) * res;
    for (let j = 0; j < nx; j++) T[i * nx + j] = boxTop(sg.R, sg.o, stock.lo, stock.hi, x0 + (j + 0.5) * res, y, sg.zoff, sg.big);
  }
  return T;
}

// height field of one segment, starting at the stock-box top of every column
export function segmentHF(sg, top, tools) {
  const hf = new HeightField(sg.grid, { lo: [1e9, 1e9, 0], hi: [-1e9, -1e9, 0] }, tools);
  hf.H0 = top;
  hf.reset();
  hf.resetDirty();
  return hf;
}
