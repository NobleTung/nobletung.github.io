document.addEventListener("DOMContentLoaded", function () {

  const username = "NobleTung";
  const apiKey = "169890fe9f31f423f3e5d0779d23665c";

  async function fetchMusic() {
    try {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`
      );

      const data = await res.json();

      if (!data.recenttracks || !data.recenttracks.track) {
        setEmpty();
        return;
      }

      renderTracks(data.recenttracks.track);
      renderSummary(data.recenttracks["@attr"]);

    } catch (err) {
      setError();
    }
  }

  function formatTime(dateText) {
    const played = new Date(dateText + " UTC");
    const now = new Date();

    const playedDate = new Date(played.getFullYear(), played.getMonth(), played.getDate());
    const todayDate  = new Date(now.getFullYear(),    now.getMonth(),    now.getDate());

    const diffDays = Math.round((todayDate - playedDate) / 86400000);

    const hh = String(played.getHours()).padStart(2, "0");
    const mm = String(played.getMinutes()).padStart(2, "0");
    const timeStr = `${hh}:${mm}`;

    if (diffDays === 0) return `今天 ${timeStr}`;
    if (diffDays === 1) return `昨天 ${timeStr}`;
    return `${played.getMonth() + 1}月${played.getDate()}日 ${timeStr}`;
  }

  function renderTracks(tracks) {
    const container = document.getElementById("music-track");
    if (!container) return;

    const html = tracks.map(track => {
      const title  = track.name;
      const artist = track.artist["#text"];

      const isNowPlaying = track["@attr"] && track["@attr"].nowplaying === "true";

      let timeText = "";
      if (isNowPlaying) {
        timeText = "Now";
      } else if (track.date && track.date["#text"]) {
        timeText = formatTime(track.date["#text"]);
      }

      return `
        <div class="music-item${isNowPlaying ? " now-playing" : ""}">
          <div class="music-col music-col-title">${title}</div>
          <div class="music-col music-col-artist">${artist}</div>
          <div class="music-time">${timeText}</div>
        </div>
      `;
    }).join("");

    container.innerHTML = html;
  }

  function renderSummary(attr) {
    const el = document.getElementById("music-summary");
    if (!el || !attr) return;
    const total = attr.total ? parseInt(attr.total) : 0;
    el.textContent = `本周播放 ${total} 首`;
  }

  function setEmpty() {
    const container = document.getElementById("music-track");
    if (container) container.innerHTML = `<span class="music-empty">No recent tracks</span>`;
  }

  function setError() {
    const container = document.getElementById("music-track");
    if (container) container.innerHTML = `<span class="music-empty">Unavailable</span>`;
  }

  fetchMusic();
  setInterval(fetchMusic, 60000);
});