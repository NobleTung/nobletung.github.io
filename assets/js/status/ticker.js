// ── 配置区 ────────────────────────────────────────────────
const TICKER_CONFIG = {
  speed: 40,
  refreshInterval: 60,

  finnhubKey: 'd7muoghr01qngrvpgmd0d7muoghr01qngrvpgmdg',

  items: [
    // 股票
    { type: 'stock',  symbol: 'SPY',             label: 'SPY'     },
    { type: 'stock',  symbol: 'AAPL',            label: 'AAPL'    },
    { type: 'stock',  symbol: 'NVDA',            label: 'NVDA'    },
    { type: 'stock',  symbol: 'WMT',             label: 'WMT'     },
    // 加密货币
    { type: 'stock',  symbol: 'BINANCE:ETHUSDT', label: 'ETH'     },
    // 汇率
    { type: 'forex',  from: 'USD', to: 'JPY',    label: 'USD/JPY' },
    { type: 'forex',  from: 'USD', to: 'HKD',    label: 'USD/HKD' },
    { type: 'forex',  from: 'USD', to: 'CNY',    label: 'USD/CNY' },
  ],
};
// ── 配置区结束 ────────────────────────────────────────────


// ── 工具函数 ──────────────────────────────────────────────

// 返回 UTC 昨日日期字符串，格式 YYYY-MM-DD
function getYesterdayUTC() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ── Finnhub：股票 & 加密货币 ───────────────────────────────

async function fetchQuote(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${TICKER_CONFIG.finnhubKey}`;
  const res = await fetch(url);
  const d = await res.json();

  if (!d || typeof d.c !== 'number' || typeof d.pc !== 'number') {
    throw new Error(`Invalid data for ${symbol}`);
  }

  const price     = d.c !== 0 ? d.c  : d.pc;
  const change    = d.c !== 0 ? d.d  : 0;
  const changePct = d.c !== 0 ? d.dp : 0;

  return { price, change, changePct };
}

// ── Frankfurter：汇率（今日 + 昨日，一次并发）────────────────

async function fetchForexBatch(forexItems) {
  const symbols = [...new Set(forexItems.map(i => i.to))].join(',');

  // 找出所有不同的 from 货币（通常只有 USD 一种）
  const froms = [...new Set(forexItems.map(i => i.from))];

  const yesterday = getYesterdayUTC();

  // 每个 from 并发请求今日和昨日
  const results = {};

  await Promise.all(froms.map(async (from) => {
    const tos = forexItems.filter(i => i.from === from).map(i => i.to).join(',');
    const base = `https://api.frankfurter.dev/v1`;

    const [latestRes, prevRes] = await Promise.all([
      fetch(`${base}/latest?base=${from}&symbols=${tos}`),
      fetch(`${base}/${yesterday}?base=${from}&symbols=${tos}`),
    ]);

    const latest = await latestRes.json();
    const prev   = await prevRes.json();

    if (!latest?.rates) return;

    forexItems
      .filter(i => i.from === from)
      .forEach(item => {
        const to = item.to;
        const key = `${from}→${to}`;
        const todayRate = latest.rates[to];
        const prevRate  = prev?.rates?.[to];

        if (todayRate === undefined) return;

        const change    = prevRate ? todayRate - prevRate : 0;
        const changePct = prevRate ? (change / prevRate) * 100 : 0;

        results[key] = { price: todayRate, change, changePct };
      });
  }));

  return results;
}

// ── 格式化输出 ─────────────────────────────────────────────

function formatItem(label, price, change, changePct) {
  const up = change >= 0;
  const arrow = up ? '▲' : '▼';
  const colorClass = up ? 'tick-up' : 'tick-down';
  const sign = up ? '+' : '';
  const decimals = price >= 10 ? 2 : 4;

  return `
    <span class="tick-item">
      <span class="tick-label ${colorClass}">${label}</span>
      <span class="${colorClass}">
        ${arrow} ${price.toFixed(decimals)}
        <span class="tick-change">(${sign}${changePct.toFixed(2)}%)</span>
      </span>
    </span>
    <span class="tick-sep">·</span>
  `;
}

// ── 主逻辑 ────────────────────────────────────────────────

async function buildTickerHTML() {
  const stockItems = TICKER_CONFIG.items.filter(i => i.type === 'stock');
  const forexItems = TICKER_CONFIG.items.filter(i => i.type === 'forex');

  // 股票并发请求
  const stockResults = await Promise.allSettled(
    stockItems.map(item => fetchQuote(item.symbol))
  );

  // 汇率批量请求（含昨日对比）
  let forexRates = {};
  try {
    forexRates = await fetchForexBatch(forexItems);
  } catch (e) {
    console.warn('汇率请求失败', e);
  }

  const htmlParts = [];

  TICKER_CONFIG.items.forEach(item => {
    if (item.type === 'stock') {
      const idx = stockItems.indexOf(item);
      const result = stockResults[idx];
      if (result.status !== 'fulfilled') {
        console.warn(`${item.symbol} 获取失败`, result.reason);
        return;
      }
      const { price, change, changePct } = result.value;
      htmlParts.push(formatItem(item.label, price, change, changePct));

    } else if (item.type === 'forex') {
      const key = `${item.from}→${item.to}`;
      const rate = forexRates[key];
      if (!rate) {
        console.warn(`汇率 ${key} 获取失败`);
        return;
      }
      htmlParts.push(formatItem(item.label, rate.price, rate.change, rate.changePct));
    }
  });

  return htmlParts.join('');
}

async function initTicker() {
  const track = document.getElementById('ticker-track');
  if (!track) return;

  if (!track.dataset.loaded) {
    track.innerHTML = '<span style="opacity:0.5;font-family:Arial,sans-serif;font-size:13px;">加载中…</span>';
  }

  const html = await buildTickerHTML();
  if (!html) return;

  track.innerHTML = html + html;
  track.dataset.loaded = 'true';

  const totalWidth = track.scrollWidth / 2;
  track.style.animationDuration = (totalWidth / TICKER_CONFIG.speed) + 's';
}

document.addEventListener('DOMContentLoaded', function () {
  initTicker();
  setInterval(initTicker, TICKER_CONFIG.refreshInterval * 1000);
});