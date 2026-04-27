// ── 配色方案 ──────────────────────────────────────────────
const THEMES = {
  light: {
    cardBg:    '#f6f8fa',
    digitBg:   '#ffffff',
    digitColor:'#1a1a1a',
    sepColor:  '#aaaaaa',
    divider:   '#e0e0e0',
    label:     '#7c7c7c',
  },
  dark: {
    cardBg:    '#1e1e1e',
    digitBg:   '#141416',
    digitColor:'#f0ede6',
    sepColor:  '#555555',
    divider:   '#000000',
    label:     '#868686',
  },
};

// ── 尺寸与间距配置 ────────────────────────────────────────
const DW       = 54;    // 数字块宽度 px
const DH       = 76;    // 数字块高度 px
const FS       = 64;    // 数字字号 px
const FF       = 'Arial, sans-serif';
const FW       = '700';
const DIV      = 2;     // 分割线厚度 px
const MON_W    = 150;   // 月份块宽度 px（拉宽以容纳三字母）
const SIDE_PAD = 0;  // 两侧留白比例（0.04 = 各留 4% 宽度）
const WIDE_BREAKPOINT = 500; // 容器宽度大于此值时显示日期+时间，否则仅时间

// ── 配置区结束 ────────────────────────────────────────────


function currentTheme() {
  const m = document.documentElement.getAttribute('data-mode');
  if (m === 'dark')  return THEMES.dark;
  if (m === 'light') return THEMES.light;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.dark : THEMES.light;
}

function utcParts() {
  const n = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return {
    mon:  months[n.getUTCMonth()],
    dd:   String(n.getUTCDate()).padStart(2, '0'),
    yyyy: String(n.getUTCFullYear()),
    hh:   String(n.getUTCHours()).padStart(2, '0'),
    mm:   String(n.getUTCMinutes()).padStart(2, '0'),
    ss:   String(n.getUTCSeconds()).padStart(2, '0'),
  };
}

function makeHalf(cls, th, w) {
  const el = document.createElement('div');
  el.className = cls;
  el.style.cssText = [
    `width:${w}px`,
    `height:${DH / 2}px`,
    `font-size:${FS}px`,
    `font-family:${FF}`,
    `font-weight:${FW}`,
    `background:${th.digitBg}`,
    `color:${th.digitColor}`,
    `border-width:${DIV}px`,
    `border-color:${th.divider}`,
    // 修改这里：取消原有的 line-height，改为 flex 居中
    `display:flex`,
    `justify-content:center`,
    `align-items:center`,
    `overflow:hidden`
  ].join(';');
  return el;
}

function makeDigitBlock(th, w) {
  w = w || DW;
  const wrap = document.createElement('div');
  wrap.style.cssText = `position:relative;width:${w}px;height:${DH}px;border-radius:5px;overflow:hidden;flex-shrink:0;`;

  const flap = document.createElement('div');
  flap.style.cssText = `position:absolute;top:0;left:0;width:${w}px;height:${DH}px;z-index:1;transform-style:preserve-3d;transition:transform 0s;transform:rotateX(0);`;

  const ff = makeHalf('fc-hf', th, w);
  const fb = makeHalf('fc-hb', th, w);
  ff.style.position = 'absolute';
  ff.style.top = '0';
  ff.style.backfaceVisibility = 'hidden';
  fb.style.transform = 'rotateX(-180deg)';
  fb.style.backfaceVisibility = 'hidden';

  const sf = makeHalf('fc-hf', th, w);
  const sb = makeHalf('fc-hb', th, w);

  flap.append(ff, fb);
  wrap.append(flap, sf, sb);

  let cur = '';
  return {
    el: wrap,
    faces: [ff, fb, sf, sb],
    get: () => cur,
    set(v) {
      cur = v;
      [ff, fb, sf, sb].forEach(e => e.dataset.t = v);
    },
    flip(v) {
      fb.dataset.t = v;
      sf.dataset.t = v;
      flap.style.transition = 'transform .45s ease-in-out';
      flap.style.transform  = 'rotateX(-180deg)';
      setTimeout(() => {
        flap.style.transition = 'transform 0s';
        flap.style.transform  = 'rotateX(0)';
        cur = v;
        [ff, fb, sf, sb].forEach(e => e.dataset.t = v);
      }, 450);
    },
  };
}

function makeSep(th) {
  const s = document.createElement('div');
  s.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;width:14px;padding-bottom:4px;flex-shrink:0;';
  const dots = [];
  for (let i = 0; i < 2; i++) {
    const d = document.createElement('div');
    d.style.cssText = `width:4px;height:4px;border-radius:50%;background:${th.sepColor};`;
    s.appendChild(d);
    dots.push(d);
  }
  return { el: s, dots };
}

function group(...els) {
  const g = document.createElement('div');
  g.style.cssText = 'display:flex;align-items:center;gap:2px;';
  els.forEach(e => g.appendChild(e));
  return g;
}

(function init() {
  const th   = currentTheme();
  const root = document.getElementById('fc-root');
  const wrap = document.getElementById('fc-scale-wrap');
  if (!root || !wrap) return;

  const card = document.createElement('div');
  card.id = 'fc-card';
  card.style.background = th.cardBg;

  // ── 宽屏行 ────────────────────────────────────────────
  const wideRow = document.createElement('div');
  wideRow.id = 'fc-row-wide';

  const mon = makeDigitBlock(th, MON_W);
  const d0  = makeDigitBlock(th), d1 = makeDigitBlock(th);
  const y0  = makeDigitBlock(th), y1 = makeDigitBlock(th),
        y2  = makeDigitBlock(th), y3 = makeDigitBlock(th);
  const h0  = makeDigitBlock(th), h1 = makeDigitBlock(th);
  const m0  = makeDigitBlock(th), m1 = makeDigitBlock(th);
  const s0  = makeDigitBlock(th), s1 = makeDigitBlock(th);

  const sep1 = makeSep(th), sep2 = makeSep(th), sep3 = makeSep(th),
        sep4  = makeSep(th), sep5 = makeSep(th);

  wideRow.append(
    group(mon.el), sep1.el,
    group(d0.el, d1.el), sep2.el,
    group(y0.el, y1.el, y2.el, y3.el), sep3.el,
    group(h0.el, h1.el), sep4.el,
    group(m0.el, m1.el), sep5.el,
    group(s0.el, s1.el),
  );

  // ── 窄屏行 ────────────────────────────────────────────
  const narrowRow = document.createElement('div');
  narrowRow.id = 'fc-row-narrow';

  const nh0 = makeDigitBlock(th), nh1 = makeDigitBlock(th);
  const nm0 = makeDigitBlock(th), nm1 = makeDigitBlock(th);
  const ns0 = makeDigitBlock(th), ns1 = makeDigitBlock(th);
  const nsep1 = makeSep(th), nsep2 = makeSep(th);

  narrowRow.append(
    group(nh0.el, nh1.el), nsep1.el,
    group(nm0.el, nm1.el), nsep2.el,
    group(ns0.el, ns1.el),
  );

  const label = document.createElement('div');
  label.id = 'fc-label';
  label.style.color = th.label;
  label.textContent = 'UTC';

  card.append(wideRow, narrowRow, label);
  wrap.appendChild(card);

  // ── 记录所有可主题化元素 ──────────────────────────────
  const allFaces = [
    mon, d0, d1, y0, y1, y2, y3,
    h0, h1, m0, m1, s0, s1,
    nh0, nh1, nm0, nm1, ns0, ns1,
  ].flatMap(d => d.faces);

  const allSepDots = [
    sep1, sep2, sep3, sep4, sep5, nsep1, nsep2
  ].flatMap(s => s.dots);

  // ── 初始化显示 ────────────────────────────────────────
  const p = utcParts();
  mon.set(p.mon);
  [d0, d1].forEach((d, i)       => d.set(p.dd[i]));
  [y0, y1, y2, y3].forEach((d, i) => d.set(p.yyyy[i]));
  [h0, h1].forEach((d, i)       => d.set(p.hh[i]));
  [m0, m1].forEach((d, i)       => d.set(p.mm[i]));
  [s0, s1].forEach((d, i)       => d.set(p.ss[i]));
  [nh0, nh1].forEach((d, i)     => d.set(p.hh[i]));
  [nm0, nm1].forEach((d, i)     => d.set(p.mm[i]));
  [ns0, ns1].forEach((d, i)     => d.set(p.ss[i]));

  // ── 响应式缩放 ────────────────────────────────────────
  let isWide = true;

  function rescale() {
    const rootW  = root.offsetWidth;
    const usable = rootW * (1 - SIDE_PAD * 2);

    // 先让内容自然展开，测量原始宽度
    wrap.style.transform  = 'none';
    wrap.style.marginLeft = '0';
    root.style.paddingBottom = '0';

    // 判断当前应显示哪一行
    const shouldBeWide = usable >= WIDE_BREAKPOINT;

    if (shouldBeWide) {
      wideRow.style.display   = 'flex';
      narrowRow.style.display = 'none';
    } else {
      wideRow.style.display   = 'none';
      narrowRow.style.display = 'flex';
    }

    isWide = shouldBeWide;

    // 测量实际使用的行宽度
    const naturalW = wrap.offsetWidth;
    const naturalH = wrap.offsetHeight;

    const scale      = Math.min(usable / naturalW, 1);
    const marginLeft = rootW * SIDE_PAD;

    wrap.style.transform     = `scale(${scale})`;
    wrap.style.transformOrigin = 'top left';
    wrap.style.marginLeft    = `${marginLeft}px`;

    // 用 padding-bottom 撑开缩放后的实际高度
    root.style.paddingBottom = `${naturalH * scale}px`;
    root.style.height = '0';
  }

  // 初次渲染后缩放
  requestAnimationFrame(rescale);
  window.addEventListener('resize', rescale);

  new ResizeObserver(rescale).observe(root);

  // ── 每秒 tick ─────────────────────────────────────────
  setInterval(() => {
    const q = utcParts();
    if (mon.get() !== q.mon) mon.flip(q.mon);
    [
      [[d0, d1],        q.dd],
      [[y0, y1, y2, y3], q.yyyy],
      [[h0, h1],        q.hh],
      [[m0, m1],        q.mm],
      [[s0, s1],        q.ss],
      [[nh0, nh1],      q.hh],
      [[nm0, nm1],      q.mm],
      [[ns0, ns1],      q.ss],
    ].forEach(([ds, str]) => {
      ds.forEach((d, i) => { if (d.get() !== str[i]) d.flip(str[i]); });
    });
  }, 1000);

  // ── 主题切换 ──────────────────────────────────────────
  function applyTheme() {
    const t = currentTheme();
    card.style.background = t.cardBg;
    allFaces.forEach(el => {
      el.style.background  = t.digitBg;
      el.style.color       = t.digitColor;
      el.style.borderColor = t.divider;
    });
    allSepDots.forEach(d => d.style.background = t.sepColor);
    label.style.color = t.label;
  }

  new MutationObserver(applyTheme)
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', applyTheme);
})();