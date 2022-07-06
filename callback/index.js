const $url = document.getElementById("url");
const $preview = document.getElementById("preview");

(async () => {
  const code = new URLSearchParams(location.search).get("code");
  if (!code) return alert("No code found");

  const { refresh_token } = await fetch("/spotify/api/get_refresh_token", {
    method: "POST",
    body: JSON.stringify({ code }),
    headers: { "Content-Type": "application/json" }
  }).then(res => res.json());

  const url = new URL(`/spotify/widget?refresh_token=${refresh_token}`, location.origin).toString();
  $url.value = url;
  $preview.src = url;

  navigator.clipboard.writeText(url);
  $url.addEventListener("click", () => {
    $url.select();
    document.execCommand("copy");
  });
})();