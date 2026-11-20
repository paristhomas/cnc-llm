// Virtualised G-code listing (only visible rows are in the DOM, so 500k-line programs scroll smoothly).
const LH = 20;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function highlight(line) {
  // split off comments first
  let code = line, cmt = '';
  const p = line.search(/[;(]/);
  if (p >= 0) { code = line.slice(0, p); cmt = line.slice(p); }
  const words = esc(code).replace(/([A-Za-z])\s*([-+]?(?:\d+\.?\d*|\.\d+))/g, (m, l, v) => {
    const L = l.toUpperCase();
    let c = 'k-w';
    if (L === 'G') c = /^0*0$/.test(v) ? 'k-gr' : /^0*[123]$/.test(v) ? 'k-gc' : 'k-g';
    else if (L === 'M') c = 'k-m';
    else if (L === 'T') c = 'k-t';
    else if (L === 'F' || L === 'S') c = 'k-f';
    else if ('XYZIJKR'.includes(L)) c = 'k-ax';
    return `<span class="${c}">${m}</span>`;
  });
  return words + (cmt ? `<span class="k-cm">${esc(cmt)}</span>` : '');
}

export class GcodeList {
  constructor(root, text, { onPick, marks }) {
    this.lines = text.split('\n');
    if (this.lines.length && this.lines[this.lines.length - 1] === '') this.lines.pop();
    this.onPick = onPick;
    this.marks = marks || new Map();  // line -> 'error' | 'warning'
    root.innerHTML = `
      <div class="gc-tools">
        <label class="sr-only" for="gc-find">Find in G-code</label>
        <input id="gc-find" type="search" placeholder="Find text or go to line…" autocomplete="off" spellcheck="false">
        <span class="gc-count" aria-live="polite"></span>
        <label class="follow" title="Keep the current line in view while playing"><input type="checkbox" checked> follow</label>
      </div>
      <div class="gc-scroll" tabindex="0" aria-label="G-code listing"><div class="gc-spacer"></div><div class="gc-rows"></div></div>`;
    this.scroll = root.querySelector('.gc-scroll');
    this.spacer = root.querySelector('.gc-spacer');
    this.rows = root.querySelector('.gc-rows');
    this.find = root.querySelector('#gc-find');
    this.count = root.querySelector('.gc-count');
    this.followBox = root.querySelector('.follow input');
    this.spacer.style.height = this.lines.length * LH + 'px';
    this.cur = 0;
    this.userScrollT = 0;
    this.scroll.addEventListener('scroll', () => { this.render(); }, { passive: true });
    for (const ev of ['wheel', 'touchmove', 'pointerdown', 'keydown'])
      this.scroll.addEventListener(ev, () => { this.userScrollT = performance.now(); }, { passive: true });
    this.rows.addEventListener('click', (e) => {
      const row = e.target.closest('.gc-row');
      if (row) this.onPick(+row.dataset.line);
    });
    let lastQ = '', lastHit = 0;
    this.find.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const q = this.find.value.trim();
      if (!q) return;
      if (/^\d+$/.test(q)) { this.onPick(+q); this.count.textContent = ''; return; }
      const Q = q.toUpperCase();
      const from = q === lastQ ? lastHit : this.cur;
      let hit = -1;
      for (let k = 1; k <= this.lines.length; k++) {
        const i = (from - 1 + k) % this.lines.length;   // 0-based index after the 1-based line `from`
        if (this.lines[i].toUpperCase().includes(Q)) { hit = i + 1; break; }
      }
      lastQ = q;
      if (hit < 0) { this.count.textContent = 'not found'; return; }
      lastHit = hit;
      this.count.textContent = `line ${hit}`;
      this.onPick(hit);
    });
    this.render();
  }
  get follow() { return this.followBox.checked; }
  setCurrent(line, force = false) {
    if (line === this.cur && !force) return;
    this.cur = line;
    const userRecently = performance.now() - this.userScrollT < 2500;
    if (force || (this.follow && !userRecently)) {
      const top = (line - 1) * LH, h = this.scroll.clientHeight;
      const st = this.scroll.scrollTop;
      if (force || top < st + LH * 2 || top > st + h - LH * 3) this.scroll.scrollTop = Math.max(0, top - h * 0.35);
    }
    this.render();
  }
  render() {
    const st = this.scroll.scrollTop, h = this.scroll.clientHeight || 300;
    const a = Math.max(0, Math.floor(st / LH) - 10), b = Math.min(this.lines.length, Math.ceil((st + h) / LH) + 10);
    if (a === this.ra && b === this.rb && this.cur === this.rc) return;
    this.ra = a; this.rb = b; this.rc = this.cur;
    let html = '';
    const w = String(this.lines.length).length;
    for (let i = a; i < b; i++) {
      const ln = i + 1, mk = this.marks.get(ln);
      const cls = 'gc-row' + (ln === this.cur ? ' cur' : '') + (mk ? ' ' + mk : '');
      html += `<div class="${cls}" data-line="${ln}" style="top:${i * LH}px"><span class="ln">${String(ln).padStart(w, ' ')}</span><span class="code">${highlight(this.lines[i]) || '&nbsp;'}</span></div>`;
    }
    this.rows.innerHTML = html;
  }
  line(n) { return this.lines[n - 1] || ''; }
}
