import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicMedia = path.join(root, "public", "media");

const urls = JSON.parse(
  await fs.readFile(path.join(root, "src", "clone", "asset-urls.json"), "utf8"),
);

async function download(url) {
  const filename = url.split("/media/")[1];
  const dest = path.join(publicMedia, filename);
  try {
    await fs.access(dest);
    return;
  } catch {
    // continue
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status}`);
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${filename}`);
}

const batchSize = 6;
let failed = 0;
for (let i = 0; i < urls.length; i += batchSize) {
  const batch = urls.slice(i, i + batchSize);
  await Promise.all(
    batch.map((url) =>
      download(url).catch((e) => {
        failed++;
        console.error(`✗ ${url}: ${e.message}`);
      }),
    ),
  );
}
console.log(`Done. Failed: ${failed}/${urls.length}`);
