// Machine view geometry: a trunnion table-table 5-axis machine sized around the job's vise (kinematics in kin5.mjs).
//
// Scene graph (machine coordinates, origin = rotary centre "pivot", Z up, spindle vertical):
//   fixed       bed, two trunnion supports with bearing housings and the A-axis drive cover   (never moves)
//   cradle      U-shaped cradle: floor, C-axis housing, two arms                              (rotation.x = A)
//     platter   round rotary platter with T-slots and a degree scale                          (rotation.z = 90 - C)
//       part    vise, stock, material, toolpath, target overlay in G54 coordinates           (position = -pivot_G54)
//   head        spindle nose + head casting, placed above the tool holder                    (translates only)
// The C axis is the G54 Z line through (0, 0) (the vise is centred there); the A axis is the machine X line through
// the pivot, which sits on the C axis at the height of the stock-box centre, so the part swings about its middle.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// (u, v) shape extruded along w -> world (x = w, y = u, z = v)
const UVW = new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1);
function extrudeX(shape, x0, len, bevel = 2) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: len - 2 * bevel, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 40 });
  g.applyMatrix4(UVW);
  g.translate(x0 + bevel, 0, 0);
  return g;
}
function cylX(r, x0, x1, seg = 48) {
  const g = new THREE.CylinderGeometry(r, r, x1 - x0, seg);
  g.rotateZ(Math.PI / 2);
  g.translate((x0 + x1) / 2, 0, 0);
  return g;
}
function box(lo, hi) {
  const g = new THREE.BoxGeometry(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]);
  g.translate((lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2);
  return g;
}
function mesh(geo, mat, cast = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = cast; m.receiveShadow = true;
  return m;
}

export function machineDims(meta) {
  const st = meta.stock, vise = meta.vise || [];
  const body = vise.find((b) => b.kind === 'body'), table = vise.find((b) => b.kind === 'table');
  const jaws = vise.filter((b) => b.kind === 'jaw');
  const zp = (st.lo[2] + st.hi[2]) / 2;
  const zt = table ? table.hi[2] : (body ? body.lo[2] : st.lo[2] - 40);   // platter top (G54 z)
  const ext = (b) => [b.hi[0] - b.lo[0], b.hi[1] - b.lo[1]];
  const bx = body ? ext(body) : [st.hi[0] - st.lo[0], st.hi[1] - st.lo[1]];
  let Rp = Math.max(0.5 * Math.max(bx[0], bx[1]) * 1.06 + 8, 0.5 * Math.hypot(st.hi[0] - st.lo[0], st.hi[1] - st.lo[1]) * 1.1, 60);
  Rp = Math.ceil(Rp / 5) * 5;
  const zT = zt - zp, tp = Math.max(16, Rp * 0.15);
  const W = 2 * Rp * 0.8, tf = Math.max(22, Rp * 0.2), hc = Math.max(18, Rp * 0.16);
  const zFt = zT - tp - hc, zFb = zFt - tf;
  const xa = Rp + Math.max(12, Rp * 0.1), ta = Math.max(24, Rp * 0.22);
  const rB = Math.max(Math.min(W / 2, Rp * 0.55), 40);
  const reach = Math.hypot(W / 2, zFb);
  const zBed = -reach - 14;
  const xs0 = xa + ta + 8, ts = Math.max(36, Rp * 0.32), rH = rB * 0.86;
  // everything that turns with the table, as distance from the pivot (for the safe retract height)
  const pts = [];
  for (const b of [...jaws, ...(body ? [body] : [])]) for (let k = 0; k < 8; k++) pts.push([k & 1 ? b.hi[0] : b.lo[0], k & 2 ? b.hi[1] : b.lo[1], (k & 4 ? b.hi[2] : b.lo[2]) - zp]);
  for (let k = 0; k < 8; k++) pts.push([k & 1 ? st.hi[0] : st.lo[0], k & 2 ? st.hi[1] : st.lo[1], (k & 4 ? st.hi[2] : st.lo[2]) - zp]);
  const rStock = Math.max(...pts.map((p) => Math.hypot(...p)));
  const rPlatter = Math.hypot(Rp, zT);
  return { zp, zt, pivot: [0, 0, zp], Rp, zT, tp, W, tf, hc, zFt, zFb, xa, ta, rB, zBed, xs0, ts, rH, reach, rStock,
    rSweep: Math.max(rStock, rPlatter), zSafe: Math.max(rStock, rPlatter) + 15 };
}

export function buildMachine(meta) {
  const d = machineDims(meta);
  const M = {
    paint: new THREE.MeshStandardMaterial({ color: 0xc4c8cd, metalness: 0.25, roughness: 0.5 }),
    cradle: new THREE.MeshStandardMaterial({ color: 0x7d8792, metalness: 0.45, roughness: 0.42 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x2a2e34, metalness: 0.35, roughness: 0.65 }),
    bed: new THREE.MeshStandardMaterial({ color: 0x3a3f46, metalness: 0.3, roughness: 0.7 }),
    platter: new THREE.MeshStandardMaterial({ color: 0xb4bac1, metalness: 0.78, roughness: 0.3 }),
    slot: new THREE.MeshStandardMaterial({ color: 0x25282d, metalness: 0.3, roughness: 0.8 }),
    tick: new THREE.MeshBasicMaterial({ color: 0x1b1d21 }),
    zero: new THREE.MeshBasicMaterial({ color: 0xf2a33a }),
    accent: new THREE.MeshStandardMaterial({ color: 0xf2a33a, metalness: 0.2, roughness: 0.5 }),
    head: new THREE.MeshStandardMaterial({ color: 0xe1e4e8, metalness: 0.2, roughness: 0.45 }),
    nose: new THREE.MeshStandardMaterial({ color: 0x4b5058, metalness: 0.7, roughness: 0.35 }),
  };
  const fixed = new THREE.Group(), cradle = new THREE.Group(), platter = new THREE.Group(), part = new THREE.Group();
  cradle.add(platter); platter.add(part);
  part.position.set(-d.pivot[0], -d.pivot[1], -d.pivot[2]);
  // ---- bed
  const xb = d.xs0 + d.ts + 70;
  fixed.add(mesh(box([-xb, -d.W * 0.95, d.zBed - 34], [xb, d.W * 0.95, d.zBed]), M.bed, false));
  // ---- trunnion supports + bearing housings, drive cover on +X
  for (const sgn of [-1, 1]) {
    const x0 = sgn > 0 ? d.xs0 : -d.xs0 - d.ts;
    const s = new THREE.Shape();
    const wb = d.W * 0.62;
    s.moveTo(-wb, d.zBed); s.lineTo(wb, d.zBed); s.lineTo(d.rH, 0); s.absarc(0, 0, d.rH, 0, Math.PI, false); s.lineTo(-wb, d.zBed);
    fixed.add(mesh(extrudeX(s, x0, d.ts, 3), M.paint));
    const hx0 = sgn > 0 ? d.xs0 - 6 : -d.xs0 - d.ts - 10, hx1 = hx0 + d.ts + 16;
    fixed.add(mesh(cylX(d.rH * 0.78, hx0, hx1), M.paint));
    fixed.add(mesh(cylX(d.rH * 0.42, sgn > 0 ? hx1 : hx0 - 6, sgn > 0 ? hx1 + 6 : hx0), M.dark));
  }
  const cx0 = d.xs0 + d.ts + 10;
  fixed.add(mesh(cylX(d.rH * 0.7, cx0, cx0 + 48), M.dark));
  // ---- cradle: floor, C-axis housing, arms with round bosses around the A axis
  const W = d.W;
  const floor = box([-d.xa - 1, -W / 2, d.zFb], [d.xa + 1, W / 2, d.zFt]);
  const housing = new THREE.CylinderGeometry(d.Rp * 0.78, d.Rp * 0.82, d.hc + 2, 72);
  housing.rotateX(Math.PI / 2); housing.translate(0, 0, d.zFt + d.hc / 2 - 1);
  cradle.add(mesh(floor, M.cradle), mesh(housing, M.dark));
  for (const sgn of [-1, 1]) {
    const s = new THREE.Shape();
    s.moveTo(-W / 2, d.zFb); s.lineTo(W / 2, d.zFb); s.lineTo(W / 2, d.zFt); s.lineTo(d.rB, 0);
    s.absarc(0, 0, d.rB, 0, Math.PI, false); s.lineTo(-W / 2, d.zFt); s.lineTo(-W / 2, d.zFb);
    const x0 = sgn > 0 ? d.xa : -d.xa - d.ta;
    cradle.add(mesh(extrudeX(s, x0, d.ta, 3), M.cradle));
    // A-axis hub on the outside of each arm, with an orange index mark so the tilt reads
    const hx0 = sgn > 0 ? d.xa + d.ta - 1 : -d.xa - d.ta - 7, hub = cylX(d.rB * 0.62, hx0, hx0 + 8);
    cradle.add(mesh(hub, M.dark));
    const mk = box([hx0 - 0.5, -3, d.rB * 0.2], [hx0 + 8.5, 3, d.rB * 0.6]);
    cradle.add(mesh(mk, M.accent, false));
  }
  // ---- platter: disc, three diametral T-slots, degree scale on the rim, orange zero mark
  const disc = new THREE.CylinderGeometry(d.Rp, d.Rp, d.tp, 128);
  disc.rotateX(Math.PI / 2); disc.translate(0, 0, d.zT - d.tp / 2);
  platter.add(mesh(disc, M.platter));
  const slots = [];
  for (let k = 0; k < 3; k++) {
    const g = box([-d.Rp * 0.97, -6, d.zT - 0.2], [d.Rp * 0.97, 6, d.zT + 0.25]);
    g.rotateZ((k * Math.PI) / 3 + Math.PI / 6);
    slots.push(g);
  }
  platter.add(mesh(mergeGeometries(slots), M.slot, false));
  const ticks = [];
  for (let k = 0; k < 72; k++) {
    if (k === 0) continue;
    const L = k % 9 === 0 ? 12 : k % 3 === 0 ? 7 : 4;
    const g = box([d.Rp - L - 1.5, -0.7, d.zT], [d.Rp - 1.5, 0.7, d.zT + 0.3]);
    g.rotateZ((k * Math.PI) / 36);
    ticks.push(g);
  }
  platter.add(mesh(mergeGeometries(ticks), M.tick, false));
  const zero = box([d.Rp - 18, -2.2, d.zT], [d.Rp - 1, 2.2, d.zT + 0.45]);
  platter.add(mesh(zero, M.zero, false));
  const rim = new THREE.CylinderGeometry(d.Rp + 0.6, d.Rp + 0.6, 3, 128, 1, true);
  rim.rotateX(Math.PI / 2); rim.translate(0, 0, d.zT - d.tp + 4);
  platter.add(mesh(rim, M.dark, false));
  // ---- spindle head (origin = top of the tool holder)
  const head = new THREE.Group();
  const nose = new THREE.CylinderGeometry(36, 40, 46, 64); nose.rotateX(Math.PI / 2); nose.translate(0, 0, 23);
  const ring = new THREE.CylinderGeometry(42, 42, 8, 64); ring.rotateX(Math.PI / 2); ring.translate(0, 0, 50);
  const body = new THREE.CylinderGeometry(58, 58, 120, 64); body.rotateX(Math.PI / 2); body.translate(0, 0, 54 + 60);
  const casting = box([-80, -40, 120], [80, 130, 420]);
  head.add(mesh(nose, M.nose), mesh(ring, M.dark), mesh(body, M.head), mesh(casting, M.head));
  return { dims: d, fixed, cradle, platter, part, head, mats: M };
}

// set the table to (A, C) in degrees (kinematic C, unwrapped), via the scene graph
// (scene graph twin of kin5.tableRot = Rx(A) Rz(90 - C); the Machine view self-check compares the two)
export function poseTable(mc, A, C) {
  mc.cradle.rotation.set((A * Math.PI) / 180, 0, 0);
  mc.platter.rotation.set(0, 0, ((90 - C) * Math.PI) / 180);
}
