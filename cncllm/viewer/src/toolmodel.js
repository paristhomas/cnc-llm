// 3D model of a library tool: cutting profile (flat / ball / bull / cone) up to the flute length, shank up to the
// stick-out, then collet nut and holder. Origin = tool tip, axis +Z (machine convention).
import * as THREE from 'three';

let fluteTex = null;
function fluteTexture() {
  if (fluteTex) return fluteTex;
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#c9ced6'; g.fillRect(0, 0, 128, 128);
  // helical flutes: diagonal dark bands
  g.fillStyle = '#5b6270';
  for (let k = -2; k < 4; k++) {
    g.beginPath();
    g.moveTo(k * 64, 128); g.lineTo(k * 64 + 26, 128); g.lineTo(k * 64 + 26 + 64, 0); g.lineTo(k * 64 + 64, 0);
    g.closePath(); g.fill();
  }
  fluteTex = new THREE.CanvasTexture(c);
  fluteTex.wrapS = fluteTex.wrapT = THREE.RepeatWrapping;
  fluteTex.colorSpace = THREE.SRGBColorSpace;
  return fluteTex;
}

function cutterProfile(t) {
  const R = t.diameter / 2, fl = t.flute_length, pts = [];
  const P = (r, z) => pts.push(new THREE.Vector2(Math.max(r, 0.0001), z));
  if (t.kind === 'flat') { P(0, 0); P(R, 0); P(R, fl); }
  else if (t.kind === 'ball') {
    P(0, 0);
    for (let k = 1; k <= 16; k++) { const a = (k / 16) * Math.PI / 2; P(R * Math.sin(a), R - R * Math.cos(a)); }
    P(R, fl);
  } else if (t.kind === 'bull') {
    const c = t.corner_radius;
    P(0, 0); P(R - c, 0);
    for (let k = 1; k <= 10; k++) { const a = (k / 10) * Math.PI / 2; P(R - c + c * Math.sin(a), c - c * Math.cos(a)); }
    P(R, fl);
  } else {   // cone
    const tip = (t.tip_diameter || 0) / 2, cot = 1 / Math.tan(t.half_angle * Math.PI / 180);
    const zc = (R - tip) * cot;
    P(0, 0); if (tip > 0) P(tip, 0); P(R, zc); if (fl > zc) P(R, fl);
  }
  return pts;
}

export function buildTool(t, color) {
  const grp = new THREE.Group();
  const R = t.diameter / 2, fl = t.flute_length, so = t.stickout;
  const carbide = new THREE.MeshStandardMaterial({ color: 0xd4d8de, metalness: 0.85, roughness: 0.28, map: fluteTexture() });
  const shankM = new THREE.MeshStandardMaterial({ color: 0xc3c8cf, metalness: 0.9, roughness: 0.22 });
  // holder parts are semi-transparent so the cut under the spindle stays visible
  const steel = new THREE.MeshStandardMaterial({ color: 0x5a6069, metalness: 0.8, roughness: 0.35, transparent: true, opacity: 0.55, depthWrite: false });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2c3036, metalness: 0.6, roughness: 0.45, transparent: true, opacity: 0.45, depthWrite: false });
  const band = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), metalness: 0.2, roughness: 0.5, emissive: new THREE.Color(color), emissiveIntensity: 0.25 });
  const prof = cutterProfile(t);
  const topCut = prof[prof.length - 1].y;
  prof.push(new THREE.Vector2(0.0001, topCut));
  const lat = new THREE.LatheGeometry(prof, 40);
  lat.rotateX(Math.PI / 2);
  // stretch the flute texture along the length
  const tex = carbide.map.clone(); tex.needsUpdate = true; tex.repeat.set(t.flutes || 2, Math.max(1, fl / (t.diameter * 1.6)));
  carbide.map = tex;
  const cutter = new THREE.Mesh(lat, carbide);
  cutter.castShadow = true;
  const spin = new THREE.Group();
  spin.add(cutter);
  // shank
  const sr = (t.shank_diameter || t.diameter) / 2;
  const shLen = Math.max(so - topCut, 0.1);
  const sh = new THREE.CylinderGeometry(sr, sr, shLen, 32, 1, false);
  sh.rotateX(Math.PI / 2); sh.translate(0, 0, topCut + shLen / 2);
  const shank = new THREE.Mesh(sh, shankM); shank.castShadow = true;
  spin.add(shank);
  // colour band identifying the tool (matches the legend / toolpath colour)
  const bh = Math.min(3, shLen * 0.3);
  const bg = new THREE.CylinderGeometry(sr * 1.02, sr * 1.02, bh, 32, 1, true);
  bg.rotateX(Math.PI / 2); bg.translate(0, 0, so - bh / 2 - Math.min(4, shLen * 0.2));
  spin.add(new THREE.Mesh(bg, band));
  grp.add(spin);
  // collet nut + holder (not spinning visibly: keep static so it reads as the holder)
  const HD = t.holder_diameter / 2;
  const nut = new THREE.CylinderGeometry(HD, HD * 0.92, 10, 6, 1, false);
  nut.rotateX(Math.PI / 2); nut.translate(0, 0, so + 5);
  const nutM = new THREE.Mesh(nut, steel); nutM.castShadow = true;
  grp.add(nutM);
  const body = new THREE.CylinderGeometry(HD * 1.2, HD * 1.05, 16, 40, 1, false);
  body.rotateX(Math.PI / 2); body.translate(0, 0, so + 10 + 8);
  const bodyM = new THREE.Mesh(body, dark); bodyM.castShadow = true;
  grp.add(bodyM);
  grp.userData.spin = spin;
  grp.userData.height = so + 26;
  return grp;
}
