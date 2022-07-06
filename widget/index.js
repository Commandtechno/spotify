const $player = document.getElementById("player");
const $cover = document.getElementById("cover");
const $title = document.getElementById("title");
const $author = document.getElementById("author");
const $album = document.getElementById("album");
const $progressBar = document.getElementById("progress-bar");

const refresh_token = new URLSearchParams(location.search).get("refresh_token");
if (!refresh_token) return alert("No refresh token found");

let access_token = localStorage.getItem("access_token");
let expires_at = Number(localStorage.getItem("expires_at"));

function show(element) {
  element.style.display = null;
}

function hide(element) {
  element.style.display = "none";
}

async function getToken() {
  if (access_token && expires_at && expires_at > Date.now()) return access_token;
  const res = await fetch("/spotify/api/get_access_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
    headers: { "Content-Type": "text/plain" }
  }).then(res => res.json());

  access_token = res.access_token;
  expires_at = Date.now() + res.expires_in * 1_000;

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("expires_at", expires_at);

  return access_token;
}

async function update() {
  const token = await getToken();
  let res;

  try {
    res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json());
  } catch {
    $player.style.display = "none";
    return;
  }

  const cover = res.item.album.images[0]?.url;
  if (!cover) {
    hide($cover);
  } else if (cover !== $cover.src) {
    $cover.src = cover;
    $cover.style.display = null;
  }

  const title = res.item.name;
  const author =
    res.item.artists.length && "by " + res.item.artists.map(artist => artist.name).join(", ");
  const album = res.item.album.name && "on " + res.item.album.name;

  if (title && $title.innerText !== title) $title.innerText = title;
  if (author && $author.innerText !== author) $author.innerText = author;
  if (album && $album.innerText !== album) $album.innerText = album;

  $progressBar.style.width = `${(res.progress_ms / res.item.duration_ms) * 100}%`;
  $player.style.display = null;
}

update();
setInterval(update, 1_000);