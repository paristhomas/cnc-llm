// Height-field material removal: JS port of cncllm/kernel.py (zcut + simulate_grid material removal).
// A 3-axis tool of revolution moving tip p0 -> p1 lowers every column (x, y) within its radius to
//   zcut = min_t z(t) + h(d(t)),  h = cutting profile height at radial distance d (flat / ball / bull / cone).
// Cells are evaluated at their centres x0 + (j + .5) res, exactly like the Python simulator, so a full replay
// reproduces the simulator's height field (checked in the UI against the exported result).

const GOLD = 0.5 * (Math.sqrt(5) - 1);
const INF = 1e30;
export const BLOCK = 16;

function prof(kind, R, cr, tip, cot, d) {
  if (kind === 0) return 0;
  if (kind === 1) return R - Math.sqrt(Math.max(R * R - d * d, 0));
  if (kind === 2) {
    const e = Math.max(d - (R - cr), 0);
    return cr - Math.sqrt(Math.max(cr * cr - e * e, 0));
  }
  return Math.max(d - tip, 0) * cot;
}

export function zcut(x0, y0, z0, x1, y1, z1, kind, R, cr, tip, cot, px, py) {
  const wx = px - x0, wy = py - y0;
  const ux = x1 - x0, uy = y1 - y0, dz = z1 - z0;
  const a = ux * ux + uy * uy;
  if (a < 1e-18) {
    const d = Math.sqrt(wx * wx + wy * wy);
    if (d > R) return INF;
    return Math.min(z0, z1) + prof(kind, R, cr, tip, cot, d);
  }
  const b = wx * ux + wy * uy;
  const c = wx * wx + wy * wy - R * R;
  const disc = b * b - a * c;
  if (disc < 0) return INF;
  const s = Math.sqrt(disc);
  const t0 = Math.max((b - s) / a, 0);
  const t1 = Math.min((b + s) / a, 1);
  if (t0 > t1) return INF;
  if (kind === 0) return Math.min(z0 + t0 * dz, z0 + t1 * dz);
  const tc = Math.min(Math.max(b / a, t0), t1);
  if (Math.abs(dz) < 1e-12) {
    const ex = wx - tc * ux, ey = wy - tc * uy;
    return z0 + prof(kind, R, cr, tip, cot, Math.sqrt(ex * ex + ey * ey));
  }
  // convex in t on [t0, t1]: golden-section search
  let lo = t0, hi = t1;
  let ta = hi - GOLD * (hi - lo), tb = lo + GOLD * (hi - lo);
  let ex = wx - ta * ux, ey = wy - ta * uy;
  let fa = z0 + ta * dz + prof(kind, R, cr, tip, cot, Math.sqrt(ex * ex + ey * ey));
  ex = wx - tb * ux; ey = wy - tb * uy;
  let fb = z0 + tb * dz + prof(kind, R, cr, tip, cot, Math.sqrt(ex * ex + ey * ey));
  for (let it = 0; it < 30; it++) {
    if (hi - lo < 1e-9) break;
    if (fa < fb) {
      hi = tb; tb = ta; fb = fa;
      ta = hi - GOLD * (hi - lo);
      ex = wx - ta * ux; ey = wy - ta * uy;
      fa = z0 + ta * dz + prof(kind, R, cr, tip, cot, Math.sqrt(ex * ex + ey * ey));
    } else {
      lo = ta; ta = tb; fa = fb;
      tb = lo + GOLD * (hi - lo);
      ex = wx - tb * ux; ey = wy - tb * uy;
      fb = z0 + tb * dz + prof(kind, R, cr, tip, cot, Math.sqrt(ex * ex + ey * ey));
    }
  }
  let best = Math.min(fa, fb);
  for (const t of [t0, t1, tc]) {
    ex = wx - t * ux; ey = wy - t * uy;
    const v = z0 + t * dz + prof(kind, R, cr, tip, cot, Math.sqrt(ex * ex + ey * ey));
    if (v < best) best = v;
  }
  return best;
}

// tool table: 5 numbers per tool number (kind R cr tip cot); kind -1 = no such tool
export function toolTable(tools) {
  const T = new Float64Array(32 * 5).fill(0);
  for (let i = 0; i < 32; i++) T[i * 5] = -1;
  for (const k of Object.keys(tools)) {
    const n = +k, r = tools[k].row;
    for (let c = 0; c < 5; c++) T[n * 5 + c] = r[c];
  }
  return T;
}

export function initialHeight(grid, stock) {
  const { x0, y0, res, nx, ny } = grid;
  const H = new Float32Array(nx * ny);
  const [lx, ly] = stock.lo, [hx, hy, hz] = stock.hi;
  for (let i = 0; i < ny; i++) {
    const y = y0 + (i + 0.5) * res;
    if (y < ly || y > hy) continue;
    for (let j = 0; j < nx; j++) {
      const x = x0 + (j + 0.5) * res;
      if (x >= lx && x <= hx) H[i * nx + j] = hz;
    }
  }
  return H;
}

export class HeightField {
  constructor(grid, stock, tools) {
    this.g = grid;
    this.nx = grid.nx; this.ny = grid.ny;
    this.H0 = initialHeight(grid, stock);
    this.H = this.H0.slice();
    this.own = new Uint8Array(this.nx * this.ny);   // tool number that last cut the cell (0 = uncut)
    this.T = toolTable(tools);
    this.bnx = Math.ceil(this.nx / BLOCK); this.bny = Math.ceil(this.ny / BLOCK);
    this.bmax = new Float32Array(this.bnx * this.bny);
    this.recomputeBlocks(0, this.bny - 1, 0, this.bnx - 1);
    this.resetDirty();
    this.work = 0;
  }
  resetDirty() { this.di0 = 1e9; this.di1 = -1; this.dj0 = 1e9; this.dj1 = -1; }
  markAllDirty() { this.di0 = 0; this.di1 = this.ny - 1; this.dj0 = 0; this.dj1 = this.nx - 1; }
  get dirty() { return this.di1 >= this.di0; }
  load(H, own) {
    this.H.set(H); this.own.set(own);
    this.recomputeBlocks(0, this.bny - 1, 0, this.bnx - 1);
    this.markAllDirty();
  }
  reset() { this.load(this.H0, new Uint8Array(this.nx * this.ny)); }
  recomputeBlocks(bi0, bi1, bj0, bj1) {
    const { nx, ny, H, bmax, bnx } = this;
    for (let bi = bi0; bi <= bi1; bi++) {
      for (let bj = bj0; bj <= bj1; bj++) {
        let mx = 0;
        const i1 = Math.min((bi + 1) * BLOCK, ny), j1 = Math.min((bj + 1) * BLOCK, nx);
        for (let i = bi * BLOCK; i < i1; i++) {
          const row = i * nx;
          for (let j = bj * BLOCK; j < j1; j++) if (H[row + j] > mx) mx = H[row + j];
        }
        bmax[bi * bnx + bj] = mx;
      }
    }
  }
  // tighten block maxima inside the current dirty rectangle (upper bounds stay valid in between: H only decreases)
  refreshDirtyBlocks() {
    if (!this.dirty) return;
    this.recomputeBlocks(Math.floor(this.di0 / BLOCK), Math.floor(this.di1 / BLOCK),
      Math.floor(this.dj0 / BLOCK), Math.floor(this.dj1 / BLOCK));
  }
  // apply one move; returns removed volume (mm^3)
  apply(ax, ay, az, bx, by, bz, tool) {
    const T = this.T, o = tool * 5;
    if (tool <= 0 || tool >= 32 || T[o] < 0) return 0;
    const kind = T[o], R = T[o + 1], cr = T[o + 2], tip = T[o + 3], cot = T[o + 4];
    const { x0, y0, res } = this.g, nx = this.nx, ny = this.ny, H = this.H, own = this.own;
    const zlo = Math.min(az, bz);
    let j0 = Math.max(Math.floor((Math.min(ax, bx) - R - x0) / res), 0);
    let j1 = Math.min(Math.ceil((Math.max(ax, bx) + R - x0) / res), nx - 1);
    let i0 = Math.max(Math.floor((Math.min(ay, by) - R - y0) / res), 0);
    let i1 = Math.min(Math.ceil((Math.max(ay, by) + R - y0) / res), ny - 1);
    if (j0 > j1 || i0 > i1) return 0;
    // quick reject: every block under the bounding box is already at or below the lowest tip height
    const bi0 = Math.floor(i0 / BLOCK), bi1 = Math.floor(i1 / BLOCK), bj0 = Math.floor(j0 / BLOCK), bj1 = Math.floor(j1 / BLOCK);
    let any = false;
    for (let bi = bi0; bi <= bi1 && !any; bi++) {
      const r = bi * this.bnx;
      for (let bj = bj0; bj <= bj1; bj++) if (this.bmax[r + bj] > zlo) { any = true; break; }
    }
    if (!any) return 0;
    // long segments: restrict each row to the x-range the tool disc actually covers
    const dx = bx - ax, dy = by - ay;
    let v = 0, ci0 = 1e9, ci1 = -1, cj0 = 1e9, cj1 = -1;
    const area = res * res;
    for (let i = i0; i <= i1; i++) {
      const py = y0 + (i + 0.5) * res;
      let ja = j0, jb = j1;
      if (Math.abs(dy) > 1e-12) {
        // x-extent of the capsule (segment dilated by R) on this row
        const ta = Math.max(Math.min((py - R - ay) / dy, 1), 0), tb = Math.max(Math.min((py + R - ay) / dy, 1), 0);
        const xa = ax + dx * ta, xb = ax + dx * tb;
        ja = Math.max(j0, Math.floor((Math.min(xa, xb) - R - x0) / res));
        jb = Math.min(j1, Math.ceil((Math.max(xa, xb) + R - x0) / res));
      }
      const row = i * nx;
      for (let j = ja; j <= jb; j++) {
        const h = H[row + j];
        if (h <= zlo) continue;
        const px = x0 + (j + 0.5) * res;
        let zc = zcut(ax, ay, az, bx, by, bz, kind, R, cr, tip, cot, px, py);
        if (zc < h) {
          if (zc < 0) zc = h > 0 ? 0 : h;
          const dt = h - zc;
          if (dt > 0) {
            v += dt * area;
            H[row + j] = zc;
            own[row + j] = tool;
            if (i < ci0) ci0 = i; if (i > ci1) ci1 = i;
            if (j < cj0) cj0 = j; if (j > cj1) cj1 = j;
          }
        }
      }
    }
    this.work += (i1 - i0 + 1) * (j1 - j0 + 1);
    if (ci1 >= 0) {
      if (ci0 < this.di0) this.di0 = ci0; if (ci1 > this.di1) this.di1 = ci1;
      if (cj0 < this.dj0) this.dj0 = cj0; if (cj1 > this.dj1) this.dj1 = cj1;
    }
    return v;
  }
}

// Move arrays shared by the main thread and the worker: S (starts, n*3), E (ends, n*3), TL (tool | rapid<<5 | spindle<<6)
export function applyRange(hf, S, E, TL, from, to, deadline, onBoundary) {
  let m = from;
  for (; m < to; m++) {
    if (onBoundary) onBoundary(m);
    const o = m * 3;
    hf.apply(S[o], S[o + 1], S[o + 2], E[o], E[o + 1], E[o + 2], TL[m] & 31);
    if ((m & 31) === 31 && deadline && performance.now() > deadline) { m++; break; }
  }
  return m;
}
