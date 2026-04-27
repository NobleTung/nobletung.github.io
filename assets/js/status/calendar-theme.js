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

  // ── 初始化 ─────────────────────────────────────────────────
  updateCalendar();

  // ── 监听 Chirpy 手动切换 ───────────────────────────────────
  const observer = new MutationObserver(function () {
    updateCalendar();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-mode']
  });

  // ── 监听系统主题变化 ───────────────────────────────────────
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', function () {
      updateCalendar();
    });

});