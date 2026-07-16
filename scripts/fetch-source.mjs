import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "docs", "research", "100cuci.com");

const res = await fetch("https://100cuci.com/");
const html = await res.text();
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, "source.html"), html);

const styleBlocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
const links = [...html.matchAll(/<link[^>]+>/gi)].map((m) => m[0]);
const imgs = [...new Set([...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+\.(?:png|jpg|jpeg|webp|gif|svg)[^"]*)"/gi)].map((m) => m[1]))];

console.log("HTML length:", html.length);
console.log("Style blocks:", styleBlocks.length, "total chars:", styleBlocks.join("").length);
console.log("Link tags:", links.length);
console.log("Unique images:", imgs.length);

if (styleBlocks.length) {
  await fs.writeFile(path.join(outDir, "inline-styles.css"), styleBlocks.join("\n\n"));
}

await fs.writeFile(path.join(outDir, "image-urls.json"), JSON.stringify(imgs, null, 2));
