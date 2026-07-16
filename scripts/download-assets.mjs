import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

const assets = [
  { url: "https://xt30sf.b-cdn.net/media/dc405826d0a96bd8cac56.png", dest: "images/logo.png" },
  { url: "https://xt30sf.b-cdn.net/media/d6838063072a67b0cddf5.gif", dest: "images/app-banner.gif" },
  { url: "https://xt30sf.b-cdn.net/media/a633e1ae197967554ac5e.webp", dest: "images/hot-icon.webp" },
  { url: "https://xt30sf.b-cdn.net/media/1ab4589f3219601fbb7cd.png", dest: "images/static-banner.png" },
  { url: "https://xt30sf.b-cdn.net/media/a6464acc5e4a6612bade2.webp", dest: "images/rebate-banner.webp" },
  { url: "https://xt30sf.b-cdn.net/media/f5e0ed4082196f7432355.png", dest: "seo/favicon.png" },
  { url: "https://xt30sf.b-cdn.net/media/0eae92f8764a601b27c2e.png", dest: "images/games/game-1.png" },
  { url: "https://xt30sf.b-cdn.net/media/62f867f8764a68724ee87.png", dest: "images/games/game-2.png" },
  { url: "https://xt30sf.b-cdn.net/media/e22f2ef8764a6d3b0a117.png", dest: "images/games/game-3.png" },
  { url: "https://xt30sf.b-cdn.net/media/cf8789d8764a6e04830fa.png", dest: "images/games/game-4.png" },
  { url: "https://xt30sf.b-cdn.net/media/e7a9b547005a602d5804f.png", dest: "images/games/game-5.png" },
  { url: "https://xt30sf.b-cdn.net/media/67403e98764a6850cd27b.webp", dest: "images/games/game-6.webp" },
  { url: "https://xt30sf.b-cdn.net/media/63e67e88764a69fa6254b.webp", dest: "images/games/game-7.webp" },
  { url: "https://xt30sf.b-cdn.net/media/5b828d78764a64caaaff6.webp", dest: "images/games/game-8.webp" },
  { url: "https://xt30sf.b-cdn.net/media/675f046b521960cbf355d.png", dest: "images/banners/banner-1.png" },
  { url: "https://xt30sf.b-cdn.net/media/75797bea52196c040e48b.png", dest: "images/banners/banner-2.png" },
  { url: "https://xt30sf.b-cdn.net/media/68307716f769627cd0efd.png", dest: "images/banners/banner-3.png" },
  { url: "https://xt30sf.b-cdn.net/media/242356da5219631284a75.png", dest: "images/banners/banner-4.png" },
];

async function download(url, dest) {
  const fullPath = path.join(publicDir, dest);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(fullPath, buf);
  console.log(`✓ ${dest}`);
}

const batchSize = 4;
for (let i = 0; i < assets.length; i += batchSize) {
  const batch = assets.slice(i, i + batchSize);
  await Promise.all(batch.map(({ url, dest }) => download(url, dest).catch((e) => console.error(`✗ ${dest}:`, e.message))));
}

console.log("Done.");
