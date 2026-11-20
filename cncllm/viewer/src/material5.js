// 3+2 material renderer: the remaining material is the intersection of the stock box with one half-space-like
// constraint per setup segment s:  z_s(P) + zoff_s < H_s(x_s(P), y_s(P))  (H_s = column-height field of segment s in
// its own frame, the simulator's exact model). Every boundary piece is drawn (the 6 stock faces and each segment's
// height-field surface) and each fragment is discarded unless it lies inside all the OTHER active constraints, so the
// visible surface is exactly the boundary of the intersection. The height fields live in one RG32F atlas texture
// (R = H, G = cut depth below the stock-box top); the current segment's rectangle is re-uploaded as it is replayed.
import * as THREE from 'three';
import { ALU, ALU_RAW } from './colors.js';
import { topField } from './geom5.js';

const EPS = '2e-3';

// GLSL shared by the stock faces and the height-field surfaces
function glslCommon(nseg) {
  return `
uniform highp sampler2D uHT;
uniform int uActive;
uniform int uSelf;
uniform mat3 uRs[${nseg}];
uniform vec3 uOs[${nseg}];
uniform vec4 uGs[${nseg}];
uniform vec4 uAt[${nseg}];
uniform vec3 uLo;
uniform vec3 uHi;
float h5At(vec4 at, int j, int i) { return texelFetch(uHT, ivec2(int(at.x) + j, int(at.y) + i), 0).r; }
vec2 h5At2(vec4 at, int j, int i) { return texelFetch(uHT, ivec2(int(at.x) + j, int(at.y) + i), 0).rg; }
bool h5InSeg(int s, vec3 p) {
  vec3 d = p - uOs[s];
  mat3 R = uRs[s];
  vec3 q = vec3(dot(R[0], d), dot(R[1], d), dot(R[2], d));
  vec4 g = uGs[s];
  vec4 at = uAt[s];
  float u = (q.x - g.x) / g.z - 0.5, v = (q.y - g.y) / g.z - 0.5;
  if (u < 0.0 || v < 0.0 || u > at.z - 1.0 || v > at.w - 1.0) return true;
  int j = min(int(u), int(at.z) - 2), i = min(int(v), int(at.w) - 2);
  float fx = u - float(j), fy = v - float(i);
  vec2 a = h5At2(at, j, i), b = h5At2(at, j + 1, i), c = h5At2(at, j, i + 1), e = h5At2(at, j + 1, i + 1);
  if (max(max(a.y, b.y), max(c.y, e.y)) < ${EPS}) return true;   // uncut cell: only the stock box limits it
  float h = fx >= fy ? a.x + fx * (b.x - a.x) + fy * (e.x - b.x) : a.x + fy * (c.x - a.x) + fx * (e.x - c.x);
  return q.z + g.w <= h + ${EPS};
}
bool h5Inside(vec3 p) {
  if (any(lessThan(p, uLo - ${EPS})) || any(greaterThan(p, uHi + ${EPS}))) return false;
  for (int s = 0; s < ${nseg}; s++) {
    if (s >= uActive) break;
    if (s == uSelf || uAt[s].z < 1.5) continue;
    if (!h5InSeg(s, p)) return false;
  }
  return true;
}
`;
}

function shelfPack(sizes, maxW) {
  // sizes: [[w, h] | null]; returns offsets and atlas size (rows of decreasing height)
  const order = sizes.map((s, i) => i).filter((i) => sizes[i]).sort((a, b) => sizes[b][1] - sizes[a][1]);
  const off = sizes.map(() => null);
  let x = 0, y = 0, rowH = 0, W = 1;
  for (const i of order) {
    const [w, h] = sizes[i];
    if (x + w > maxW) { y += rowH; x = 0; rowH = 0; }
    off[i] = [x, y];
    x += w; rowH = Math.max(rowH, h); W = Math.max(W, x);
  }
  return { off, W, H: Math.max(1, y + rowH) };
}

export class Material5 {
  // segs: [{R (3x3 rows), o, zoff, grid {x0,y0,res,nx,ny} | null, big}], stock {lo, hi}
  constructor(renderer, segs, stock, toolRGB, segRGB) {
    this.renderer = renderer;
    this.segs = segs;
    this.stock = stock;
    const N = this.N = Math.max(segs.length, 1);
    const maxTex = Math.min(renderer.capabilities.maxTextureSize || 4096, 8192);
    const pk = shelfPack(segs.map((s) => (s.grid ? [s.grid.nx, s.grid.ny] : null)), maxTex);
    this.atlas = pk;
    if (pk.H > maxTex) throw new Error(`height-field atlas too large (${pk.W}x${pk.H})`);
    // CPU copies of the atlas (RG float: H, cut depth) and the tool-owner atlas
    this.hd = new Float32Array(pk.W * pk.H * 2);
    this.od = new Uint8Array(pk.W * pk.H);
    this.tex = new THREE.DataTexture(this.hd, pk.W, pk.H, THREE.RGFormat, THREE.FloatType);
    this.tex.magFilter = this.tex.minFilter = THREE.NearestFilter;
    this.tex.generateMipmaps = false;
    this.tex.needsUpdate = true;
    this.otex = new THREE.DataTexture(this.od, pk.W, pk.H, THREE.RedFormat, THREE.UnsignedByteType);
    this.otex.magFilter = this.otex.minFilter = THREE.NearestFilter;
    this.otex.generateMipmaps = false;
    this.otex.unpackAlignment = 1;
    this.otex.needsUpdate = true;
    // top (boxtop + zoff) per segment cell, kept for the cut depth
    this.top = segs.map((s) => (s.grid ? topField(s, stock) : null));
    const Rs = [], Os = [], Gs = [], At = [];
    for (let s = 0; s < N; s++) {
      const sg = segs[s];
      const m = new THREE.Matrix3();
      if (sg) m.set(sg.R[0][0], sg.R[0][1], sg.R[0][2], sg.R[1][0], sg.R[1][1], sg.R[1][2], sg.R[2][0], sg.R[2][1], sg.R[2][2]);
      Rs.push(m);
      Os.push(new THREE.Vector3(...(sg ? sg.o : [0, 0, 0])));
      const g = sg && sg.grid;
      Gs.push(new THREE.Vector4(g ? g.x0 : 0, g ? g.y0 : 0, g ? g.res : 1, sg ? sg.zoff : 0));
      const o = pk.off[s];
      At.push(new THREE.Vector4(o ? o[0] : 0, o ? o[1] : 0, g ? g.nx : 0, g ? g.ny : 0));
    }
    this.U = {
      uHT: { value: this.tex }, uOT: { value: this.otex }, uActive: { value: 0 }, uRs: { value: Rs }, uOs: { value: Os }, uGs: { value: Gs },
      uAt: { value: At }, uLo: { value: new THREE.Vector3(...stock.lo) }, uHi: { value: new THREE.Vector3(...stock.hi) },
      uToolCol: { value: Array.from({ length: 32 }, (_, t) => new THREE.Color().setRGB(...(toolRGB[t] || ALU), THREE.SRGBColorSpace)) },
      uMode: { value: 0 }, uHi2: { value: -1 }, uSegHi: { value: new THREE.Color(0xffb020) },
    };
    this.segRGB = segRGB;
    this.common = glslCommon(N);
    this.group = new THREE.Group();
    // stock faces
    const bl = new THREE.Vector3(...stock.lo), bh = new THREE.Vector3(...stock.hi);
    const bg = new THREE.BoxGeometry(bh.x - bl.x, bh.y - bl.y, bh.z - bl.z);
    bg.translate((bl.x + bh.x) / 2, (bl.y + bh.y) / 2, (bl.z + bh.z) / 2);
    this.boxMat = this.makeMat(-1, false);
    this.box = new THREE.Mesh(bg, this.boxMat);
    this.box.customDepthMaterial = this.makeMat(-1, true);
    this.box.castShadow = this.box.receiveShadow = true;
    this.box.frustumCulled = false;
    this.group.add(this.box);
    // one height-field surface per segment
    this.surf = segs.map((sg, s) => {
      if (!sg.grid) return null;
      const { x0, y0, res, nx, ny } = sg.grid;
      const pos = new Float32Array(nx * ny * 3);
      for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) {
        const o = (i * nx + j) * 3;
        pos[o] = x0 + (j + 0.5) * res; pos[o + 1] = y0 + (i + 0.5) * res; pos[o + 2] = 0;
      }
      const idx = new Uint32Array((nx - 1) * (ny - 1) * 6);
      let k = 0;
      for (let i = 0; i < ny - 1; i++) for (let j = 0; j < nx - 1; j++) {
        const a = i * nx + j, b = a + 1, c = a + nx, d = c + 1;
        idx[k++] = a; idx[k++] = b; idx[k++] = d; idx[k++] = a; idx[k++] = d; idx[k++] = c;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setIndex(new THREE.BufferAttribute(idx, 1));
      const mesh = new THREE.Mesh(geo, this.makeMat(s, false));
      mesh.customDepthMaterial = this.makeMat(s, true);
      const M4 = new THREE.Matrix4().set(sg.R[0][0], sg.R[0][1], sg.R[0][2], sg.o[0], sg.R[1][0], sg.R[1][1], sg.R[1][2], sg.o[1],
        sg.R[2][0], sg.R[2][1], sg.R[2][2], sg.o[2], 0, 0, 0, 1);
      mesh.matrixAutoUpdate = false;
      mesh.matrix.copy(M4);
      mesh.frustumCulled = false;
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.visible = false;
      this.group.add(mesh);
      return mesh;
    });
    this.loaded = segs.map(() => false);
  }

  makeMat(self, depth) {
    const sg = self >= 0 ? this.segs[self] : null;
    const mat = depth ? new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking })
      : new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.72, roughness: 0.34, flatShading: true });
    const U = this.U, common = this.common;
    const segCol = new THREE.Color().setRGB(...(self >= 0 ? this.segRGB[self % this.segRGB.length] : ALU_RAW), THREE.SRGBColorSpace);
    const raw = new THREE.Color().setRGB(...ALU_RAW, THREE.SRGBColorSpace);
    const alu = new THREE.Color().setRGB(...ALU, THREE.SRGBColorSpace);
    mat.onBeforeCompile = (sh) => {
      for (const k of Object.keys(U)) sh.uniforms[k] = U[k];
      sh.uniforms.uSelf = { value: self };
      sh.uniforms.uSegCol = { value: segCol };
      sh.uniforms.uRaw = { value: raw };
      sh.uniforms.uAlu = { value: alu };
      const isSurf = self >= 0;
      let vs = sh.vertexShader.replace('#include <common>', `#include <common>
${common}
uniform highp sampler2D uOT;
varying vec3 vW5; varying float vCut5; flat out int vOwn5;`);
      vs = vs.replace('#include <begin_vertex>', isSurf ? `#include <begin_vertex>
{
  vec4 at = uAt[uSelf];
  int jj = gl_VertexID % int(at.z), ii = gl_VertexID / int(at.z);
  vec2 hv = h5At2(at, jj, ii);
  transformed.z = hv.x - uGs[uSelf].w;
  vCut5 = hv.y;
  vOwn5 = int(texelFetch(uOT, ivec2(int(at.x) + jj, int(at.y) + ii), 0).r * 255.0 + 0.5);
}` : `#include <begin_vertex>
vCut5 = 1.0; vOwn5 = 0;`);
      vs = vs.replace('#include <project_vertex>', `#include <project_vertex>
vW5 = (modelMatrix * vec4(transformed, 1.0)).xyz;`);
      sh.vertexShader = vs;
      let fs = sh.fragmentShader.replace('#include <common>', `#include <common>
${common}
uniform vec3 uToolCol[32]; uniform int uMode; uniform vec3 uSegCol; uniform vec3 uRaw; uniform vec3 uAlu; uniform int uHi2; uniform vec3 uSegHi;
varying vec3 vW5; varying float vCut5; flat in int vOwn5;`);
      fs = fs.replace(depth ? '#include <clipping_planes_fragment>' : '#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
${isSurf ? `if (vCut5 < ${EPS}) discard;` : ''}
if (!h5Inside(vW5)) discard;`);
      if (!depth) {
        fs = fs.replace('#include <color_fragment>', `#include <color_fragment>
{
  vec3 base = ${isSurf ? 'uAlu' : 'uRaw'};
  ${isSurf ? `if (uMode == 0 && vOwn5 > 0) base = uAlu * 0.72 + uToolCol[vOwn5] * 0.28;
  else if (uMode == 1) base = uAlu * 0.55 + uSegCol * 0.45;
  if (uHi2 == uSelf) base = mix(base, uSegHi, 0.55);` : ''}
  diffuseColor.rgb *= base;
}`);
      }
      sh.fragmentShader = fs;
    };
    mat.customProgramCacheKey = () => (depth ? 'h5d' : 'h5c') + (self >= 0 ? 's' : 'b') + this.N;
    return mat;
  }

  // segments 0..k-1 are shown with their current atlas content
  setActive(k) {
    this.U.uActive.value = k;
    this.surf.forEach((m, s) => { if (m) m.visible = s < k; });
  }
  setMode(m) { this.U.uMode.value = m; }
  // write segment s's height field (frame z + zoff) and owner tool into the atlas; rows [i0, i1]
  write(s, H, own, i0 = 0, i1 = null) {
    const sg = this.segs[s];
    if (!sg.grid) return;
    const { nx, ny } = sg.grid, [ox, oy] = this.atlas.off[s], W = this.atlas.W, T = this.top[s];
    if (i1 === null) i1 = ny - 1;
    i0 = Math.max(0, i0); i1 = Math.min(ny - 1, i1);
    if (i1 < i0) return;
    const hd = this.hd, od = this.od;
    for (let i = i0; i <= i1; i++) {
      const r = (oy + i) * W + ox, g = i * nx;
      for (let j = 0; j < nx; j++) {
        const h = H[g + j];
        hd[(r + j) * 2] = h; hd[(r + j) * 2 + 1] = Math.max(T[g + j] - h, 0);
        od[r + j] = own ? own[g + j] : 0;
      }
    }
    this.upload(s, i0, i1);
  }
  upload(s, i0, i1) {
    const r = this.renderer, gl = r.getContext();
    const pt = r.properties.get(this.tex), po = r.properties.get(this.otex);
    if (!pt.__webglTexture || !po.__webglTexture) { this.tex.needsUpdate = true; this.otex.needsUpdate = true; return; }
    const sg = this.segs[s], { nx } = sg.grid, [ox, oy] = this.atlas.off[s], W = this.atlas.W;
    const rows = i1 - i0 + 1;
    const sub = new Float32Array(nx * rows * 2), osub = new Uint8Array(nx * rows);
    for (let i = 0; i < rows; i++) {
      const r0 = (oy + i0 + i) * W + ox;
      sub.set(this.hd.subarray(r0 * 2, (r0 + nx) * 2), i * nx * 2);
      osub.set(this.od.subarray(r0, r0 + nx), i * nx);
    }
    r.state.activeTexture(gl.TEXTURE0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0); gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, 0); gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    r.state.bindTexture(gl.TEXTURE_2D, pt.__webglTexture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, ox, oy + i0, nx, rows, gl.RG, gl.FLOAT, sub);
    r.state.bindTexture(gl.TEXTURE_2D, po.__webglTexture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, ox, oy + i0, nx, rows, gl.RED, gl.UNSIGNED_BYTE, osub);
  }
}
