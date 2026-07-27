const res = await fetch("https://100cuci.com/", {
  headers: { "user-agent": "Mozilla/5.0" },
  redirect: "follow",
});
console.log("status", res.status, res.url);
const html = await res.text();
const urls = new Set();
for (const m of html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:png|jpe?g|webp|gif)/gi)) {
  urls.add(m[0].split("?")[0]);
}
for (const m of html.matchAll(/\/media\/[a-z0-9]+\.(?:png|jpe?g|webp|gif)/gi)) {
  urls.add(`https://xt30sf.b-cdn.net${m[0]}`);
}
const list = [...urls];
console.log("count", list.length);
for (const u of list) console.log(u);
