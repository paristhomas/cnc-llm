// Toolpath lines: one segment per move. Cuts coloured by tool, rapids dashed red; moves after the playback cursor
// are dimmed (or hidden), all in one draw call via a small shader.
import * as THREE from 'three';
import { RAPID, hexRgb } from './colors.js';

const VS = `
attribute vec3 color; attribute float aIdx; attribute float aDist; attribute float aRapid;
uniform float uCur; uniform float uWin;
varying vec3 vCol; varying float vDist; varying float vRapid; varying float vPast;
void main() {
  vCol = color; vDist = aDist; vRapid = aRapid; vPast = aIdx < uCur ? (aIdx < uCur - uWin ? 0.5 : 1.0) : 0.0;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  // pull the line 0.04 mm towards the camera (view space) so paths on machined floors stay visible,
  // without letting paths inside uncut material show through the stock
  mv.xyz *= max(1.0 - 0.04 / max(length(mv.xyz), 1e-3), 0.0);
  gl_Position = projectionMatrix * mv;
}`;
const FS = `
uniform float uPastA; uniform float uFutA; uniform float uOldA; uniform float uDash; uniform float uRapids; uniform float uFuture; uniform float uCuts;
varying vec3 vCol; varying float vDist; varying float vRapid; varying float vPast;
void main() {
  if (vRapid > 0.5) {
    if (uRapids < 0.5) discard;
    if (mod(vDist, uDash * 2.0) > uDash) discard;
  } else if (uCuts < 0.5) discard;
  if (vPast < 0.5 && uFuture < 0.5) discard;
  float a = vPast > 0.75 ? uPastA : vPast > 0.25 ? uOldA : uFutA;
  vec3 c = vPast > 0.75 ? vCol : mix(vCol, vec3(0.6), 0.35);
  gl_FragColor = vec4(c, a);
}`;

export function buildToolpath(S, E, TL, toolColor, scale) {
  const n = TL.length;
  const pos = new Float32Array(n * 6), col = new Float32Array(n * 6);
  const idx = new Float32Array(n * 2), dist = new Float32Array(n * 2), rap = new Float32Array(n * 2);
  const rapidRGB = hexRgb(RAPID);
  const cache = {};
  let acc = 0;
  for (let m = 0; m < n; m++) {
    const o = m * 6, s = m * 3;
    pos[o] = S[s]; pos[o + 1] = S[s + 1]; pos[o + 2] = S[s + 2];
    pos[o + 3] = E[s]; pos[o + 4] = E[s + 1]; pos[o + 5] = E[s + 2];
    const rapid = (TL[m] >> 5) & 1, tool = TL[m] & 31;
    const c = rapid ? rapidRGB : (cache[tool] || (cache[tool] = hexRgb(toolColor(tool))));
    col[o] = col[o + 3] = c[0]; col[o + 1] = col[o + 4] = c[1]; col[o + 2] = col[o + 5] = c[2];
    idx[m * 2] = idx[m * 2 + 1] = m;
    rap[m * 2] = rap[m * 2 + 1] = rapid;
    if (rapid) {
      const L = Math.hypot(E[s] - S[s], E[s + 1] - S[s + 1], E[s + 2] - S[s + 2]);
      dist[m * 2] = acc; acc += L; dist[m * 2 + 1] = acc;
      acc = acc % 1000;  // keep float precision (dash phase only)
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aIdx', new THREE.BufferAttribute(idx, 1));
  g.setAttribute('aDist', new THREE.BufferAttribute(dist, 1));
  g.setAttribute('aRapid', new THREE.BufferAttribute(rap, 1));
  g.computeBoundingSphere();
  const mat = new THREE.ShaderMaterial({
    vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false,
    uniforms: {
      uCur: { value: 0 }, uWin: { value: 1e9 }, uPastA: { value: 0.95 }, uFutA: { value: 0.22 }, uOldA: { value: 0.16 }, uDash: { value: Math.max(0.6, scale / 80) },
      uRapids: { value: 1 }, uFuture: { value: 1 }, uCuts: { value: 1 },
    },
  });
  const lines = new THREE.LineSegments(g, mat);
  lines.frustumCulled = false;
  lines.renderOrder = 2;
  return lines;
}
