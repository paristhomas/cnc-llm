// Shared 3D stage: renderer, Z-up camera with orbit controls, studio environment lighting, fixture plate, view presets.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

THREE.Object3D.DEFAULT_UP.set(0, 0, 1);

export function isDark() {
  const t = document.documentElement.getAttribute('data-theme');
  if (t) return t === 'dark';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export class Stage {
  constructor(container, stock, { shadows = true } = {}) {
    this.container = container;
    this.stock = stock;
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!window.CNCLLM_STATIC });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.0;
    r.shadowMap.enabled = shadows;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.domElement.className = 'gl';
    container.appendChild(r.domElement);
    const scene = this.scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(r);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.7;
    pm.dispose();
    const lo = new THREE.Vector3(...stock.lo), hi = new THREE.Vector3(...stock.hi);
    this.center = lo.clone().add(hi).multiplyScalar(0.5);
    this.size = hi.clone().sub(lo);
    this.diag = this.size.length();
    const cam = this.camera = new THREE.PerspectiveCamera(32, 1, this.diag * 0.01, this.diag * 60);
    const c = this.controls = new OrbitControls(cam, r.domElement);
    c.enableDamping = true; c.dampingFactor = 0.12;
    c.screenSpacePanning = true;
    c.zoomToCursor = true;
    c.minDistance = this.diag * 0.05; c.maxDistance = this.diag * 12;
    c.addEventListener('change', () => this.invalidate());
    // key light with shadows + soft fill
    const key = this.key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(this.center.x - this.diag * 0.6, this.center.y - this.diag * 0.9, this.center.z + this.diag * 1.4);
    key.target.position.copy(this.center);
    key.castShadow = shadows;
    const s = this.diag * 0.75;
    Object.assign(key.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: this.diag * 0.2, far: this.diag * 4 });
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    scene.add(key, key.target);
    scene.add(new THREE.HemisphereLight(0xeef2ff, 0x30343a, 0.35));
    // fixture plate under the stock
    const m = Math.max(this.size.x, this.size.y) * 0.12 + 6;
    const pg = new THREE.BoxGeometry(this.size.x + 2 * m, this.size.y + 2 * m, 6);
    pg.translate(this.center.x, this.center.y, -3 - 0.02);
    this.plateMat = new THREE.MeshStandardMaterial({ color: 0x3b4048, metalness: 0.3, roughness: 0.75 });
    this.plate = new THREE.Mesh(pg, this.plateMat);
    this.plate.receiveShadow = true;
    scene.add(this.plate);
    this.needs = true;
    this.onFrame = null;
    this.visible = true;
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.resize();
    this.view('iso', false);
    this.applyTheme();
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => this.applyTheme());
    const loop = () => {
      requestAnimationFrame(loop);
      if (!this.visible) return;
      const busy = this.onFrame ? this.onFrame() : false;
      const moved = this.controls.update();
      if (busy || moved || this.needs) {
        this.needs = false;
        r.render(scene, cam);
        this.frames = (this.frames || 0) + 1;
      }
    };
    requestAnimationFrame(loop);
    if (!window.CNCLLM_STATIC) {
      // pause rendering while off-screen; re-render as soon as any part of the view scrolls back in
      const io = new IntersectionObserver((e) => { this.visible = e[e.length - 1].isIntersecting; if (this.visible) this.invalidate(); }, { rootMargin: '200px' });
      io.observe(container);
    }
  }
  applyTheme() {
    const dark = isDark();
    this.plateMat.color.set(dark ? 0x30343b : 0x4a5059);
    this.invalidate();
  }
  invalidate() { this.needs = true; }
  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.invalidate();
  }
  view(name, animate = true) {
    const portrait = this.camera.aspect < 0.9;
    const dirs = { iso: portrait ? [-0.6, -1.0, 1.55] : [-0.85, -1.25, 1.05], top: [0, -0.0001, 1], front: [0, -1, 0.28], right: [1, 0, 0.28] };
    const v = new THREE.Vector3(...(dirs[name] || dirs.iso)).normalize();
    const { pos, target } = this.fitBox(v, this.fitLo || new THREE.Vector3(...this.stock.lo), this.fitHi || new THREE.Vector3(...this.stock.hi), name === 'top' ? 1.06 : 1.12);
    this.flyTo(pos, target, animate);
  }
  // camera position looking along -v that frames the box (all 8 corners inside the frustum with a margin)
  fitBox(v, lo, hi, margin = 1.12) {
    const target = lo.clone().add(hi).multiplyScalar(0.5);
    const up = new THREE.Vector3(0, 0, 1);
    if (Math.abs(v.z) > 0.999) up.set(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(up, v).normalize();
    const u2 = new THREE.Vector3().crossVectors(v, right).normalize();
    const tv = Math.tan((this.camera.fov * Math.PI) / 360), th = tv * this.camera.aspect;
    let d = 0;
    for (let k = 0; k < 8; k++) {
      const c = new THREE.Vector3(k & 1 ? hi.x : lo.x, k & 2 ? hi.y : lo.y, k & 4 ? hi.z : lo.z).sub(target);
      const x = Math.abs(c.dot(right)), y = Math.abs(c.dot(u2)), z = c.dot(v);
      d = Math.max(d, (x * margin) / th + z, (y * margin) / tv + z);
    }
    return { pos: target.clone().addScaledVector(v, d), target };
  }
  flyTo(pos, target, animate = true) {
    const cam = this.camera, ctl = this.controls;
    if (!animate) { cam.position.copy(pos); ctl.target.copy(target); ctl.update(); this.invalidate(); return; }
    const p0 = cam.position.clone(), t0 = ctl.target.clone(), start = performance.now(), T = 450;
    const step = () => {
      const k = Math.min((performance.now() - start) / T, 1), e = 1 - Math.pow(1 - k, 3);
      cam.position.lerpVectors(p0, pos, e); ctl.target.lerpVectors(t0, target, e); ctl.update(); this.invalidate();
      if (k < 1) requestAnimationFrame(step);
    };
    step();
  }
  project(v) {
    const p = v.clone().project(this.camera);
    const w = this.container.clientWidth, h = this.container.clientHeight;
    return { x: (p.x * 0.5 + 0.5) * w, y: (-p.y * 0.5 + 0.5) * h, behind: p.z > 1 };
  }
}
