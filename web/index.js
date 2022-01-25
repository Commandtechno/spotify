let accessToken = localStorage.getItem("accessToken");
let expiresAt = localStorage.getItem("expiresAt");

async function getToken() {
  if (accessToken && expiresAt > Date.now()) return accessToken;
  const res = await fetch("https://commandtechno.com/spotify/token/refresh", {
    method: "POST",
    body: refreshToken,
    headers: { "Content-Type": "text/plain" }
  }).then(res => res.json());

  accessToken = res.access_token;
  expiresAt = Date.now() + res.expires_in * 1000;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("expiresAt", expiresAt);

  return accessToken;
}

window.addEventListener("load", () => {
  try {
    refreshToken;
  } catch {
    document.write("<h1>Please run the setup script first</h1>");
    return;
  }

  const playerElement = document.getElementById("player");
  const coverElement = document.getElementById("cover");
  const titleElement = document.getElementById("title");
  const authorElement = document.getElementById("author");
  const albumElement = document.getElementById("album");
  const progressBarElement = document.getElementById("progress-bar");

  setInterval(async () => {
    const token = await getToken();
    let player;

    try {
      player = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json());
    } catch {
      playerElement.style.display = "none";
      return;
    }

    const cover = player.item.album.images[0] ? player.item.album.images[0].url : "fallback.svg";
    const title = player.item.name;
    const author = player.item.artists[0].name;
    const album = player.item.album.name;
    const progress = player.progress_ms;
    const duration = player.item.duration_ms;

    coverElement.src = cover;
    titleElement.innerText = title;
    authorElement.innerText = author && "by " + author;
    albumElement.innerText = album && "on " + album;
    progressBarElement.style.width = `${(progress / duration) * 100}%`;

    playerElement.style.display = null;
  }, 1000);
});