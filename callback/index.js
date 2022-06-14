const refreshToken = new URLSearchParams(location.search).get("refresh_token");

const url = `https://commandtechno.com/spotify/widget?refresh_token=${refreshToken}`;

document.getElementById("url").innerText = url;

navigator.clipboard.writeText(url);