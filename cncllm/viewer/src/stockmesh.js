// Solid stock rendered from a height field: top surface (one vertex per cell centre inside the stock), side skirts
// down to Z0 and a bottom face. Only rows touched since the last update are re-uploaded.
import * as THREE from 'three';
import { ALU, ALU_RAW, THROUGH, WALL, devColor, hexRgb } from './colors.js';

// vertex colours are linear in three.js: author in sRGB, convert through a LUT (output is 8-bit anyway)
const LUT = new Uint8Array(256);
for (let i = 0; i < 256; i++) { const c = i / 255; LUT[i] = Math.round(255 * (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))); }

export class StockMesh {
  constructor(grid, stock, material) {
    const { x0, y0, res, nx, ny } = grid;
    this.g = grid;
    const [lx, ly] = stock.lo, [hx, hy] = stock.hi;
    // cell index range whose centres lie inside the stock
    this.jA = Math.max(0, Math.ceil((lx - x0) / res - 0.5));
    this.jB = Math.min(nx - 1, Math.floor((hx - x0) / res - 0.5));
    this.iA = Math.max(0, Math.ceil((ly - y0) / res - 0.5));
    this.iB = Math.min(ny - 1, Math.floor((hy - y0) / res - 0.5));
    const W = this.W = this.jB - this.jA + 1, Hn = this.Hn = this.iB - this.iA + 1;
    const nv = W * Hn;
    const pos = new Float32Array(nv * 3);
    for (let i = 0; i < Hn; i++) {
      let y = y0 + (this.iA + i + 0.5) * res;
      if (i === 0) y = ly; if (i === Hn - 1) y = hy;
      for (let j = 0; j < W; j++) {
        let x = x0 + (this.jA + j + 0.5) * res;
        if (j === 0) x = lx; if (j === W - 1) x = hx;
        const o = (i * W + j) * 3;
        pos[o] = x; pos[o + 1] = y; pos[o + 2] = 0;
      }
    }
    const idx = new Uint32Array((W - 1) * (Hn - 1) * 6);
    let k = 0;
    for (let i = 0; i < Hn - 1; i++) {
      for (let j = 0; j < W - 1; j++) {
        const a = i * W + j, b = a + 1, c = a + W, d = c + 1;
        idx[k++] = a; idx[k++] = b; idx[k++] = d;
        idx[k++] = a; idx[k++] = d; idx[k++] = c;
      }
    }
    const geo = new THREE.BufferGeometry();
    this.posAttr = new THREE.BufferAttribute(pos, 3);
    this.posAttr.setUsage(THREE.DynamicDrawUsage);
    this.colAttr = new THREE.BufferAttribute(new Uint8Array(nv * 3), 3, true);
    this.colAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', this.posAttr);
    geo.setAttribute('color', this.colAttr);
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    const cx = (lx + hx) / 2, cy = (ly + hy) / 2, hz = stock.hi[2];
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(cx, cy, hz / 2), Math.hypot(hx - lx, hy - ly, hz) / 2 + 1);
    geo.boundingBox = new THREE.Box3(new THREE.Vector3(lx, ly, 0), new THREE.Vector3(hx, hy, hz));
    this.top = new THREE.Mesh(geo, material);
    this.top.castShadow = true; this.top.receiveShadow = true;

    // skirt: perimeter loop of top-boundary vertices, each with a bottom twin at Z0
    const ring = [];
    for (let j = 0; j < W; j++) ring.push(j);                         // front edge (y = lo)
    for (let i = 1; i < Hn; i++) ring.push(i * W + W - 1);            // right edge
    for (let j = W - 2; j >= 0; j--) ring.push((Hn - 1) * W + j);     // back edge
    for (let i = Hn - 2; i >= 1; i--) ring.push(i * W);               // left edge
    this.ring = ring;
    const nr = ring.length;
    const spos = new Float32Array(nr * 2 * 3);
    for (let r = 0; r < nr; r++) {
      const o = ring[r] * 3;
      spos[r * 6] = pos[o]; spos[r * 6 + 1] = pos[o + 1]; spos[r * 6 + 2] = 0;
      spos[r * 6 + 3] = pos[o]; spos[r * 6 + 4] = pos[o + 1]; spos[r * 6 + 5] = 0;
    }
    const sidx = [];
    for (let r = 0; r < nr; r++) {
      const a = r * 2, b = ((r + 1) % nr) * 2;
      // outward facing (ring runs counter-clockwise seen from +Z)
      sidx.push(a, a + 1, b + 1, a, b + 1, b);
    }
    const sgeo = new THREE.BufferGeometry();
    this.skirtPos = new THREE.BufferAttribute(spos, 3);
    this.skirtPos.setUsage(THREE.DynamicDrawUsage);
    sgeo.setAttribute('position', this.skirtPos);
    sgeo.setIndex(sidx);
    sgeo.boundingSphere = geo.boundingSphere.clone();
    this.skirtMat = new THREE.MeshStandardMaterial({ color: 0xb4b8be, metalness: 0.55, roughness: 0.5, flatShading: true, side: THREE.DoubleSide });
    this.skirt = new THREE.Mesh(sgeo, this.skirtMat);
    this.skirt.castShadow = true; this.skirt.receiveShadow = true;
    // bottom
    const bgeo = new THREE.PlaneGeometry(hx - lx, hy - ly);
    bgeo.rotateX(Math.PI);
    bgeo.translate(cx, cy, 0);
    this.bottomMat = new THREE.MeshStandardMaterial({ color: 0x8a8f96, metalness: 0.5, roughness: 0.6, side: THREE.FrontSide });
    this.bottom = new THREE.Mesh(bgeo, this.bottomMat);
    this.group = new THREE.Group();
    this.group.add(this.top, this.skirt, this.bottom);
    this.mode = 'tool';
    this.tol = 0.1;
    this.toolRGB = new Float32Array(32 * 3);
  }
  setToolColors(map) {   // map: tool number -> '#hex'
    for (const [t, hex] of Object.entries(map)) {
      const c = hexRgb(hex);
      // tint machined aluminium with the tool colour (keeps the metallic look)
      for (let k = 0; k < 3; k++) this.toolRGB[+t * 3 + k] = ALU[k] * 0.72 + c[k] * 0.28;
    }
  }
  // copy rows [i0, i1] (grid indices) of H/own into the vertex buffers
  update(H, own, Ht, i0 = 0, i1 = this.g.ny - 1, full = false) {
    const { nx } = this.g, W = this.W, pos = this.posAttr.array, col = this.colAttr.array;
    const a = Math.max(i0, this.iA), b = Math.min(i1, this.iB);
    if (a > b && !full) return;
    const mode = this.mode, tol = this.tol, trgb = this.toolRGB;
    for (let i = a; i <= b; i++) {
      const vi = (i - this.iA) * W, gi = i * nx + this.jA;
      for (let j = 0; j < W; j++) {
        const h = H[gi + j], v = vi + j, o = v * 3;
        pos[o + 2] = h;
        let r, g, bl;
        if (h <= 0.003) { [r, g, bl] = THROUGH; }
        else if (mode === 'error' && Ht) {
          // a top-down height difference is meaningless on steep walls: if the target or the machined surface
          // steps by more than 2 cells' worth between neighbours, the cell is a wall -> neutral, judged in the
          // deviation view instead
          const gk = gi + j, ii = i, jj = this.jA + j, step = 2 * this.g.res;
          let wall = false;
          const ht = Ht[gk];
          for (let di = -1; di <= 1 && !wall; di++) {
            if (ii + di < 0 || ii + di >= this.g.ny) continue;
            for (let dj = -1; dj <= 1; dj++) {
              if (jj + dj < 0 || jj + dj >= nx) continue;
              const k2 = gk + di * nx + dj;
              if (Math.abs(Ht[k2] - ht) > step || Math.abs(H[k2] - h) > step) { wall = true; break; }
            }
          }
          const e = h - ht;
          if (wall) { [r, g, bl] = WALL; } else
          [r, g, bl] = devColor(e, tol);
        } else if (mode === 'tool' && own && own[gi + j]) {
          const t = own[gi + j] * 3; r = trgb[t]; g = trgb[t + 1]; bl = trgb[t + 2];
        } else if (own && own[gi + j]) { [r, g, bl] = ALU; }
        else { [r, g, bl] = ALU_RAW; }
        col[o] = LUT[(r * 255 + 0.5) | 0]; col[o + 1] = LUT[(g * 255 + 0.5) | 0]; col[o + 2] = LUT[(bl * 255 + 0.5) | 0];
      }
    }
    const v0 = (a - this.iA) * W, cnt = (b - a + 1) * W;
    this.posAttr.clearUpdateRanges(); this.colAttr.clearUpdateRanges();
    this.posAttr.addUpdateRange(v0 * 3, cnt * 3); this.colAttr.addUpdateRange(v0 * 3, cnt * 3);
    this.posAttr.needsUpdate = true; this.colAttr.needsUpdate = true;
    // skirt tops follow the boundary heights
    const sp = this.skirtPos.array, ring = this.ring;
    for (let r = 0; r < ring.length; r++) sp[r * 6 + 2] = pos[ring[r] * 3 + 2];
    this.skirtPos.needsUpdate = true;
  }
  dispose() {
    this.top.geometry.dispose(); this.skirt.geometry.dispose(); this.bottom.geometry.dispose(); this.skirtMat.dispose(); this.bottomMat.dispose();
  }
}
