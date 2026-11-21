// Trunnion table-table kinematics for the Machine view (pure functions, no three.js: also run under node by
// tests/test_machine_view.py).
//
// Machine: the spindle is vertical and moves in X Y Z only. The A axis tilts the cradle about machine X; the C axis is
// the rotary platter on the cradle; the vise sits on the platter. The C axis is the G54 Z line through G54 (0, 0); the A
// axis is the machine X line through the rotary centre ("pivot", a point on the C axis).
//
// Conventions (all angles in degrees, matrices as row arrays M[i][j]):
//  * d = the G68.2 tool axis in G54 coordinates, tip -> holder (third column of the frame matrix R, sim5.to_fixture).
//  * Displayed angles = sim5.frame_angles(R):  A = acos(d_z) (tilt from +Z, 0..180),  C = atan2(d_y, d_x) (azimuth),
//    with C = 0 when |d_z| >= 0.9999 (as sim5).
//  * Table rotation  Rt(A, C) = Rx(A) . Rz(90 - C).  Check: Rz(90 - C) turns d to (0, sin A, cos A), then Rx(A)
//    turns that to (0, sin A cos A - cos A sin A, sin^2 A + cos^2 A) = (0, 0, 1). So Rt . d = +Z: the table brings the
//    tool axis vertical, under the spindle. Physically: the platter turns by (90 - C) and the cradle tilts by +A about
//    machine X (right-hand rule), which swings the top of the part towards the operator at -Y. Consequence: at A = 0,
//    C = 0 the platter sits at +90 deg, so the part appears turned 90 deg about Z against G54 (G54 +X points along
//    machine +Y). Any table-table machine with A about X needs such a fixed offset to tilt a tool axis that lies in the
//    G54 XZ plane.
//  * Kinematic C (what the platter really does) = the true azimuth atan2(d_y, d_x) whenever sin A > 1e-9 (it differs
//    from the displayed C only for near-vertical axes, where frame_angles reports C = 0), 0 for an exactly vertical
//    axis, and unwrapped by multiples of 360 so the platter always takes the short way between setups.
//  * Machine XYZ (DRO) = the tool tip relative to the rotary centre:  X_m = Rt . (p_G54 - pivot).
const D2R = Math.PI / 180, R2D = 180 / Math.PI;

export function frameAngles(R) {   // exact mirror of sim5.frame_angles
  const dz = R[2][2];
  const A = Math.acos(Math.max(-1, Math.min(1, dz))) * R2D;
  const C = Math.abs(dz) < 0.9999 ? Math.atan2(R[1][2], R[0][2]) * R2D : 0.0;
  return { A, C };
}

export function kinAngles(R) {     // angles the table is actually driven to (before unwrapping C)
  const d = [R[0][2], R[1][2], R[2][2]];
  const A = Math.acos(Math.max(-1, Math.min(1, d[2]))) * R2D;
  const s = Math.hypot(d[0], d[1]);
  const C = s > 1e-9 ? Math.atan2(d[1], d[0]) * R2D : 0.0;
  return { A, C };
}

// unwrap a list of azimuths (deg) so consecutive values differ by at most 180
export function unwrapC(list) {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    if (!i) { out.push(list[0]); continue; }
    // nearest equivalent of list[i] to the previous value; an exact half turn (180 deg either way) goes towards 0 so
    // the platter does not wind up over the program
    const p = out[i - 1], k = Math.round((p - list[i]) / 360);
    let best = null;
    for (const kk of [k - 1, k, k + 1]) {
      const c = list[i] + 360 * kk, dd = Math.abs(c - p);
      if (dd > 180 + 1e-9) continue;
      if (best === null || dd < Math.abs(best - p) - 1e-9 || (Math.abs(dd - Math.abs(best - p)) <= 1e-9 && Math.abs(c) < Math.abs(best))) best = c;
    }
    out.push(best);
  }
  return out;
}

// wrap to (-180, 180] for display
export function wrap180(c) {
  let x = ((c + 180) % 360 + 360) % 360 - 180;
  if (x <= -180) x += 360;
  return Object.is(x, -0) ? 0 : x;
}

export function matMul(A, B) {
  const C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) C[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
  return C;
}
export function matVec(A, v) {
  return [A[0][0] * v[0] + A[0][1] * v[1] + A[0][2] * v[2], A[1][0] * v[0] + A[1][1] * v[1] + A[1][2] * v[2], A[2][0] * v[0] + A[2][1] * v[1] + A[2][2] * v[2]];
}
export function rotX(deg) { const c = Math.cos(deg * D2R), s = Math.sin(deg * D2R); return [[1, 0, 0], [0, c, -s], [0, s, c]]; }
export function rotZ(deg) { const c = Math.cos(deg * D2R), s = Math.sin(deg * D2R); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]; }

// cradle tilt angle about machine X and platter angle about its own axis for table angles (A, C)
export function cradleAngle(A) { return A; }
export function platterAngle(C) { return 90 - C; }

export function tableRot(A, C) { return matMul(rotX(cradleAngle(A)), rotZ(platterAngle(C))); }

export function machineTip(p, A, C, pivot) {
  return matVec(tableRot(A, C), [p[0] - pivot[0], p[1] - pivot[1], p[2] - pivot[2]]);
}

// per-setup table angles: displayed (frame_angles) and kinematic (true azimuth, unwrapped along the program)
export function setupAngles(Rs) {
  const disp = Rs.map(frameAngles), kin = Rs.map(kinAngles);
  const cu = unwrapC(kin.map((k) => k.C));
  return Rs.map((R, i) => ({ A: disp[i].A, C: disp[i].C, Ak: kin[i].A, Ck: cu[i] }));
}

export function easeInOut(u) { u = Math.min(Math.max(u, 0), 1); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }

// Re-orientation between two setups, u in [0, 1]: 0-0.24 retract (spindle straight up to zSafe, table at the old
// angles), 0.24-0.76 table swing (A and C together, spindle parked), 0.76-1 re-approach (spindle across at zSafe, then
// down to the first point of the new setup). a/b: {Ak, Ck} of the old / new setup, pa/pb: machine tip before / after.
export const SWING_PHASES = [0.24, 0.76];
export function swingState(u, a, b, pa, pb, zSafe) {
  const [u1, u2] = SWING_PHASES;
  const zs = Math.max(zSafe, pa[2], pb[2]);
  if (u <= u1) {
    const e = easeInOut(u / u1);
    return { phase: 'retract', A: a.Ak, C: a.Ck, tip: [pa[0], pa[1], pa[2] + (zs - pa[2]) * e] };
  }
  if (u < u2) {
    const e = easeInOut((u - u1) / (u2 - u1));
    return { phase: 'swing', A: a.Ak + (b.Ak - a.Ak) * e, C: a.Ck + (b.Ck - a.Ck) * e, tip: [pa[0], pa[1], zs] };
  }
  const w = (u - u2) / (1 - u2);
  if (w < 0.5) {
    const e = easeInOut(w / 0.5);
    return { phase: 'approach', A: b.Ak, C: b.Ck, tip: [pa[0] + (pb[0] - pa[0]) * e, pa[1] + (pb[1] - pa[1]) * e, zs] };
  }
  const e = easeInOut((w - 0.5) / 0.5);
  return { phase: 'approach', A: b.Ak, C: b.Ck, tip: [pb[0], pb[1], zs + (pb[2] - zs) * e] };
}
