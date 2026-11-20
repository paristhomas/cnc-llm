// Palettes. Tool colours follow the order of first use in the program (fixed categorical order, never cycled by rank);
// red is reserved for rapids. Deviation uses a blue (gouge) / green (in tolerance) / red (proud) diverging scale.
export const TOOL_PALETTE = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#6250d6', '#8a6d3b', '#5f7d8c', '#a04f9e', '#00a0b0'];
export const RAPID = '#e34948';
export const ALU = [0.73, 0.75, 0.78];       // machined aluminium
export const ALU_RAW = [0.55, 0.57, 0.60];
export const WALL = [0.60, 0.62, 0.65];   // steep wall: not judged in the top-down height error   // raw stock top (mill finish)
export const THROUGH = [0.20, 0.22, 0.25];   // cut through to the fixture plate

export const DEV = {
  gouge: '#2f66c9', gougeDeep: '#173c8a', ok: '#3fae6a', proud: '#e0614f', proudDeep: '#9e1f1f',
  undercut: '#8e939c', limited: '#9b72d0', datum: '#b9bcc2',
};

export function hexRgb(h) {
  const v = parseInt(h.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

const C = Object.fromEntries(Object.entries(DEV).map(([k, v]) => [k, hexRgb(v)]));
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const PALE_BLUE = [0.66, 0.77, 0.93], PALE_RED = [0.96, 0.72, 0.66];

// signed deviation (mm, + proud / - gouge) -> rgb; full colour reached at +-1 mm
export function devColor(d, tol) {
  if (d > tol) {
    const t = Math.min((d - tol) / (1 - tol), 1);
    return t < 0.25 ? lerp(PALE_RED, C.proud, t / 0.25) : lerp(C.proud, C.proudDeep, (t - 0.25) / 0.75);
  }
  if (d < -tol) {
    const t = Math.min((-d - tol) / (1 - tol), 1);
    return t < 0.25 ? lerp(PALE_BLUE, C.gouge, t / 0.25) : lerp(C.gouge, C.gougeDeep, (t - 0.25) / 0.75);
  }
  return C.ok;
}

export function classColor(cls) {
  return cls === 1 ? C.datum : cls === 2 ? C.undercut : cls === 3 ? C.limited : null;
}

// CSS gradient for the colour bar (same stops as devColor over -1..+1 mm)
export function devGradientCSS(tol) {
  const p = (v) => (50 + v * 50).toFixed(2) + '%';
  return `linear-gradient(90deg, ${DEV.gougeDeep} 0%, ${DEV.gouge} ${p(-(tol + 0.25 * (1 - tol)))}, rgb(168,196,237) ${p(-tol)}, ` +
    `${DEV.ok} ${p(-tol)}, ${DEV.ok} ${p(tol)}, rgb(245,184,168) ${p(tol)}, ${DEV.proud} ${p(tol + 0.25 * (1 - tol))}, ${DEV.proudDeep} 100%)`;
}
