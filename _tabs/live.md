---
layout: live
icon: fa-solid fa-clock
order: 4
---

<style>
  #fc-root {
    width: 100%;
    overflow: hidden;
  }
  #fc-scale-wrap {
    transform-origin: top left;
    display: inline-flex;
  }
  #fc-card {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.1rem 1.4rem 1rem;
    border-radius: 14px;
    gap: 10px;
  }
  #fc-row-wide, #fc-row-narrow {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  #fc-label {
    font-size: 11px;
    font-family: Arial, sans-serif;
    letter-spacing: .08em;
    align-self: flex-end;
  }
  .fc-hf, .fc-hb {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
    }
    
    .fc-hf::before, .fc-hb::before {
      position: absolute;
      content: attr(data-t);
      text-align: center;
      left: 0;
      right: 0;
      height: 76px; /* 必须等于总高度 DH */
      line-height: 76px; /* 必须等于总高度 DH */
    }

    /* 上半部分：文字正常居中，但容器只有一半高度，自然裁掉下半部分 */
    .fc-hf::before {
      top: 0;
    }

    /* 下半部分：文字向上偏移半个高度，露出下半部分 */
    .fc-hb::before {
      bottom: 0; /* 贴紧底部 */
    }

    .fc-hf { border-bottom-style: solid; align-items: flex-start; }
    .fc-hb { border-top-style: solid; align-items: flex-end; }
</style>

<div id="fc-root" style="min-height:1px;">
  <div id="fc-scale-wrap"></div>
</div>

<script src="{{ '/assets/js/status/flip-clock.js' | relative_url }}"></script>


### 持仓市价

<div class="ticker-wrap">
  <div id="ticker-track">
  </div>
</div>

<style>
/* ── 字号统一在这里调节 ─────────────────────── */
.ticker-wrap { --tick-fs: 20px; }
/* ────────────────────────────────────────────── */

.ticker-wrap {
  overflow: hidden;
  width: 100%;
  border-top: 1px solid #d2d2d2;
  border-bottom: 1px solid #d2d2d2;
  padding: 2px 0;
  opacity: 0.85;
}

#ticker-track {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  animation: ticker-scroll linear infinite;
}

@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.ticker-wrap:hover #ticker-track {
  animation-play-state: paused;
}

.tick-item {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 4px;
  font-family: Arial, sans-serif;
  line-height: 1.3;
}

.tick-label {
  font-size: calc(var(--tick-fs) * 0.85);
  font-weight: bold;
  letter-spacing: 0.04em;
}

.tick-up   { color: #22c55e; font-size: var(--tick-fs); }
.tick-down { color: #ef4444; font-size: var(--tick-fs); }

.tick-change {
  font-size: calc(var(--tick-fs) * 0.85);
  opacity: 0.85;
}

.tick-sep {
  font-family: Arial, sans-serif;
  opacity: 0.3;
  margin: 0 8px;
  align-self: center;
}
</style>

<script src="/assets/js/status/ticker.js"></script>

### 最近播放

<div id="music-status" class="card music-card">
  <div class="card-body">
    <div class="music-title">来自Noble的Apple Music</div>
    <div id="music-track" class="music-track"></div>
    <div id="music-summary" class="music-summary"></div>
  </div>
</div>

<script src="{{ '/assets/js/status/music-status.js' | relative_url }}"></script>

<style>
.music-card {
  background: var(--card-bg);
}

/* 标题 */
.music-title {
  margin-bottom: 0.6rem;
  font-weight: 600;
  font-size: 1.05em;
  color: var(--text-color);
}

/* 列表容器 */
.music-track {
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: none;
}

.music-track::-webkit-scrollbar {
  display: none;
}

/* 单条记录：歌名 | 歌手 | 时间 */
.music-item {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 0 0.6rem;
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  color: inherit;
}

/* ── 斑马纹：完整覆盖 Chirpy 的四种模式组合 ── */

/* 系统为亮色时：无 data-mode 或显式 light → 亮色行 */
@media (prefers-color-scheme: light) {
  html:not([data-mode]) .music-item:nth-child(odd),
  html[data-mode='light'] .music-item:nth-child(odd) {
    background: #fbfcfd;
  }
  html:not([data-mode]) .music-item:nth-child(even),
  html[data-mode='light'] .music-item:nth-child(even) {
    background: #ffffff;
  }

  /* 系统亮色但用户手动切到暗色 */
  html[data-mode='dark'] .music-item:nth-child(odd) {
    background: #252526;
  }
  html[data-mode='dark'] .music-item:nth-child(even) {
    background: #1f1f22;
  }
}

/* 系统为暗色时：无 data-mode 或显式 dark → 暗色行 */
@media (prefers-color-scheme: dark) {
  html:not([data-mode]) .music-item:nth-child(odd),
  html[data-mode='dark'] .music-item:nth-child(odd) {
    background: #252526;
  }
  html:not([data-mode]) .music-item:nth-child(even),
  html[data-mode='dark'] .music-item:nth-child(even) {
    background: #1f1f22;
  }

  /* 系统暗色但用户手动切到亮色 */
  html[data-mode='light'] .music-item:nth-child(odd) {
    background: #fbfcfd;
  }
  html[data-mode='light'] .music-item:nth-child(even) {
    background: #ffffff;
  }
}

/* 正在播放高亮 */
.music-item.now-playing {
  outline: 1px solid var(--link-color, #4a90e2);
  outline-offset: -1px;
}

/* 表格列 */
.music-col {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.music-col-title {
  font-size: 0.9em;
  font-weight: 600;
  color: var(--text-color);
}

.music-col-artist {
  font-size: 0.85em;
  color: var(--text-muted-color);
}

/* 时间 */
.music-time {
  font-size: 0.8em;
  color: var(--text-muted-color);
  white-space: nowrap;
  text-align: right;
}

/* 底部统计 */
.music-summary {
  margin-top: 0.6rem;
  font-size: 0.85em;
  color: var(--text-muted-color);
}

/* 空状态 */
.music-empty {
  color: var(--text-muted-color);
}
</style>


### 实时日程

<iframe id="open-web-calendar" 
    style="background:url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat;"
    src="https://open-web-calendar.hosted.quelltext.eu/calendar.html?css=.hamburger-menu%20%7B%0A%20%20display%3A%20none%20!important%3B%0A%7D%0A.dhx_cal_data%3A%3A-webkit-scrollbar%20%20%7B%0A%20%20display%3A%20none%20!important%3B%0A%7D%0A.CALENDAR-INDEX-0%2C%20.CALENDAR-INDEX-0%20.dhx_body%2C%20.CALENDAR-INDEX-0%20.dhx_title%20%20%7B%20background-color%3A%20%23537cfa%3B%20%7D%20%0A.CALENDAR-INDEX-1%2C%20.CALENDAR-INDEX-1%20.dhx_body%2C%20.CALENDAR-INDEX-1%20.dhx_title%20%20%7B%20background-color%3A%20%23537cfa%3B%20%7D%20%0A&amp;event_url_geo=&amp;event_url_location=http%3A%2F%2Fmaps.apple.com%2F%3Fq%3D%7Blocation%7D&amp;menu_shows_calendar_descriptions=true&amp;prefer_browser_language=true&amp;skin=dark&amp;start_of_week=su&amp;starting_hour=7&amp;tab=week&amp;target=_blank&amp;timezone=Asia%2FShanghai&amp;title=Noble%20Tung%E7%9A%84%E6%97%A5%E7%A8%8B&amp;url=fernet%3A%2F%2FgAAAAABp7dPZSbKP4VdxfIuNOk0MGa_m02l7CDOTpDAURowmjJQfLHK1fF14lu9baYhO6Ia-_WuTDVEp42osyFmOmqdpBwgpCwRHKHv93fnwWWWs3hZxXEOScBolkqkkGII-Lgbuwjmpk1PFP0nimwQV7ErP2BMFWlb1wHwa1BluTcQNA26KrOXtbJ65sBIGKMVsD7Pu3BKrmOVKKK8tQAHuwS88FIxNcFfGnuvR9BYV2XdEA_uH2i-nbu3-DkI92HQGbCfWvYLk-YvRH1bimAeGEto6sucz4DvT5SSZUFuyAdCKyDLiTPJd9kW2H5OuSbk1Ra4Mbq9mRnQusOI401Wt5dW3wO5Fn89k3-L1EQzkKr6NFr-9wKR0KdogZi6uVbbiiRy4sabu&amp;url=fernet%3A%2F%2FgAAAAABp7dO_Af-SESUXfUugqUNduX5feojlS-i4bj9dNjTHQYabVkX3KDlDXZ9fdR0c9ObTd5RSw_gFMQRfiWl2rqsJtAYKUESkGuzniXPFXk7kBWh2ovUTaO8P_YHZ7sHpmXWn_N8AD7IKxrrrf7jDUEws5ZYwKTgnPt72xVs8k3_H14VpQGBm5-i4w5Z9-2Kuewvbq3ivAfQuysy1tMKcK-8UorH6dLf0tCZaaR0ZFYMOXt0Gf07rrVXLLft7EElXXmZACVOfA8FduCRgD9T_L-Pamd5PVZlPd0AP1WrpVwCICcmHRyhW6fZJXWp7RJSgJZbcupRbsrzxvYYwBCa5FCugMN1Q9s-ihUREXSiVRAXxUllGxWm8ao1SB9KtSaMhvKQ6zB4V"
    sandbox="allow-scripts allow-same-origin allow-popups allow-downloads allow-popups-to-escape-sandbox"
    allowTransparency="true" scrolling="no" 
    frameborder="0" height="400px" width="100%"></iframe>

<script src="/assets/js/status/calendar-theme.js"></script>

### 站点近期更新

![站点更新](https://ghchart.rshah.org/nobletung)

