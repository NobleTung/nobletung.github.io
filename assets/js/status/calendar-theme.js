document.addEventListener('DOMContentLoaded', function () {

  function isDarkMode() {
    const mode = document.documentElement.getAttribute('data-mode');
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // ── Open Web Calendar ──────────────────────────────────────
  const calIframe = document.getElementById('open-web-calendar');
  const calSrc = calIframe ? calIframe.src : null;

  function updateCalendar() {
    if (!calIframe) return;
    const skin = isDarkMode() ? 'dark' : 'terrace';
    calIframe.src = calSrc.replace(/skin=[^&]+/, 'skin=' + skin);
  }

  // ── Time and Date Clock ────────────────────────────────────
  const clockIframe = document.getElementById('time-clock');
  const lightClock = 'https://free.timeanddate.com/clock/iae0fjmb/fn16/fs24/fc2a2a2a/tct/pct/ahl/tt0/tm1/th1/ta1';
  const darkClock  = 'https://free.timeanddate.com/clock/iae0fjmb/fn16/fs24/fcccc/tc1b1b1e/pct/ahl/tt0/tm1/th1/ta1';

  function updateClock() {
    if (!clockIframe) return;
    clockIframe.src = isDarkMode() ? darkClock : lightClock;
  }

  // ── 初始化 ─────────────────────────────────────────────────
  updateCalendar();
  updateClock();

  // ── 监听 Chirpy 手动切换 ───────────────────────────────────
  const observer = new MutationObserver(function () {
    updateCalendar();
    updateClock();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-mode']
  });

  // ── 监听系统主题变化 ───────────────────────────────────────
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', function () {
      updateCalendar();
      updateClock();
    });

});