/** Package WordPress plugin → dist/100cuci-site-links.zip */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pluginDir = join(root, "wordpress", "100cuci-site-links");
const distDir = join(root, "dist");
const zipPath = join(distDir, "100cuci-site-links.zip");

if (!existsSync(pluginDir)) {
  console.error("Plugin directory not found:", pluginDir);
  process.exit(1);
}

mkdirSync(distDir, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}

function collect(dir, prefix) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = `${prefix}/${name}`.replace(/\\/g, "/");
    const st = statSync(full);
    if (st.isDirectory()) out.push(...collect(full, rel));
    else out.push({ rel, full });
  }
  return out;
}

const files = collect(pluginDir, "100cuci-site-links");
const localParts = [];
const centralParts = [];
let offset = 0;

for (const f of files) {
  const data = readFileSync(f.full);
  const compressed = deflateRawSync(data);
  const nameBuf = Buffer.from(f.rel, "utf8");

  const local = Buffer.alloc(30 + nameBuf.length);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(8, 8);
  local.writeUInt32LE(crc32(data), 14);
  local.writeUInt32LE(compressed.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  nameBuf.copy(local, 30);
  localParts.push(local, compressed);

  const central = Buffer.alloc(46 + nameBuf.length);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(8, 10);
  central.writeUInt32LE(crc32(data), 16);
  central.writeUInt32LE(compressed.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(nameBuf.length, 28);
  central.writeUInt32LE(offset, 42);
  nameBuf.copy(central, 46);
  centralParts.push(central);

  offset += local.length + compressed.length;
}

const centralDir = Buffer.concat(centralParts);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(centralDir.length, 12);
end.writeUInt32LE(offset, 16);

writeFileSync(zipPath, Buffer.concat([...localParts, centralDir, end]));
console.log(`Plugin ZIP: ${zipPath}`);
