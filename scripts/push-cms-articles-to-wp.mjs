/**
 * Push local CMS content pack HTML → WordPress posts by post ID.
 * After update, www.100cuci.ad picks up changes in ~60s (runtime WP fetch).
 *
 * Default: content only (SEO-safe — does NOT change publish date).
 * Use --touch-date when promo/game list changed substantially.
 *
 * Requires .env.local:
 *   WP_REST_URL=https://cms.100cuci.ad/wp-json
 *   WP_APP_USER=your-wp-username
 *   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
 *
 * Usage:
 *   node scripts/push-cms-articles-to-wp.mjs                    # all, content only
 *   node scripts/push-cms-articles-to-wp.mjs 39 41              # specific IDs
 *   node scripts/push-cms-articles-to-wp.mjs --touch-date 39      # big update + new publish date
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatPushSummary,
  isTelegramConfigured,
  sendTelegramMessage,
} from "./telegram-notify.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const articlesDir = join(root, "docs", "cms-content-pack", "articles");
const mapPath = join(root, "docs", "cms-content-pack", "wp-post-map.json");

function loadEnvLocal() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const args = process.argv.slice(2);
const touchDate = args.includes("--touch-date");
const filterIds = args.filter((a) => a !== "--touch-date").map(Number).filter(Boolean);

const WP_REST = (process.env.WP_REST_URL ?? "").replace(/\/$/, "");
const WP_USER = process.env.WP_APP_USER ?? "";
const WP_PASS = process.env.WP_APP_PASSWORD ?? "";

if (!WP_REST || !WP_USER || !WP_PASS) {
  console.error(
    "Missing WP_REST_URL, WP_APP_USER, or WP_APP_PASSWORD in .env.local",
  );
  process.exit(1);
}

const auth = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const map = JSON.parse(readFileSync(mapPath, "utf8"));
const meta = JSON.parse(readFileSync(join(articlesDir, "_meta.json"), "utf8"));
const metaByFile = new Map(meta.map((m) => [m.file, m]));

const jobs = map.filter((row) => !filterIds.length || filterIds.includes(row.wpId));

async function updatePost(row) {
  const htmlPath = join(articlesDir, row.html);
  if (!existsSync(htmlPath)) {
    throw new Error(`HTML not found: ${row.html}`);
  }
  const content = readFileSync(htmlPath, "utf8").trim();
  const info = metaByFile.get(row.html);

  const payload = {
    content,
    ...(info?.excerpt ? { excerpt: info.excerpt } : {}),
    ...(info?.title ? { title: info.title } : {}),
  };
  if (touchDate) payload.date = new Date().toISOString();

  const res = await fetch(`${WP_REST}/wp/v2/posts/${row.wpId}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`POST ${row.wpId} failed ${res.status}: ${body.slice(0, 300)}`);
  }

  const post = await res.json();
  const dateNote = touchDate ? post.date : post.modified;
  console.log(`✓ #${row.wpId} → ${post.link} (${touchDate ? "published" : "modified"}: ${dateNote})`);
}

console.log(
  `Pushing ${jobs.length} post(s) to ${WP_REST}${touchDate ? " [touch-date ON]" : " [content only]"}\n`,
);

let failed = 0;
const updated = [];
const failedRows = [];

for (const row of jobs) {
  try {
    await updatePost(row);
    updated.push(row);
  } catch (err) {
    failed++;
    failedRows.push({ ...row, error: err.message });
    console.error(`✗ #${row.wpId} (${row.note}):`, err.message);
  }
}

console.log(
  failed
    ? `\nDone with ${failed} error(s).`
    : "\nDone. Live site refreshes in ~60 seconds.",
);

if (isTelegramConfigured() && (updated.length || failedRows.length)) {
  const text = formatPushSummary({
    updated,
    failed: failedRows,
    touchDate,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.100cuci.ad",
  });
  const sent = await sendTelegramMessage(text);
  if (sent) console.log("\n[telegram] notification sent.");
}
