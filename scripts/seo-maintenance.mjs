/**
 * SEO maintenance planner for 100cuci.ad
 *
 * Usage:
 *   node scripts/seo-maintenance.mjs plan      # this month's 3 articles + homepage
 *   node scripts/seo-maintenance.mjs status    # WP dates + GSC reminders
 *   node scripts/seo-maintenance.mjs bump-homepage  # refresh Last updated on homepage SEO
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const schedulePath = join(root, "content", "seo-schedule.json");
const mapPath = join(root, "docs", "cms-content-pack", "wp-post-map.json");
const homepageSeoPath = join(root, "content", "homepage-seo.json");
const logPath = join(root, "content", "seo-maintenance-log.json");

function loadEnvLocal() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    if (!process.env[t.slice(0, i).trim()])
      process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
}

loadEnvLocal();

const cmd = process.argv[2] ?? "plan";
const schedule = JSON.parse(readFileSync(schedulePath, "utf8"));
const map = JSON.parse(readFileSync(mapPath, "utf8"));

function monthLabel(d = new Date()) {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function pickThisMonthArticles() {
  const order = schedule.rotation.priorityOrder;
  const n = schedule.rotation.articlesPerMonth;
  const now = new Date();
  /** July 2026 = first rotation month (right after bulk incremental update) */
  const epoch =
    (now.getFullYear() - 2026) * 12 + now.getMonth() - 6;
  const start =
    (((epoch * n) % order.length) + order.length) % order.length;
  const picks = [];
  for (let i = 0; i < n; i++) {
    picks.push(order[(start + i) % order.length]);
  }
  return picks;
}

function rowByWpId(id) {
  return map.find((r) => r.wpId === id);
}

async function fetchWpPosts() {
  const base = (process.env.WP_REST_URL ?? "").replace(/\/$/, "");
  if (!base) return null;
  const res = await fetch(
    `${base}/wp/v2/posts?per_page=100&status=publish&_fields=id,slug,title,date,modified`,
  );
  if (!res.ok) return null;
  return res.json();
}

function appendLog(entry) {
  const log = existsSync(logPath)
    ? JSON.parse(readFileSync(logPath, "utf8"))
    : { runs: [] };
  log.runs.unshift({ at: new Date().toISOString(), ...entry });
  log.runs = log.runs.slice(0, 24);
  writeFileSync(logPath, `${JSON.stringify(log, null, 2)}\n`);
}

if (cmd === "bump-homepage") {
  const seo = JSON.parse(readFileSync(homepageSeoPath, "utf8"));
  seo.lastUpdated = monthLabel();
  writeFileSync(homepageSeoPath, `${JSON.stringify(seo, null, 2)}\n`);
  appendLog({ action: "bump-homepage", lastUpdated: seo.lastUpdated });
  console.log(`Homepage SEO lastUpdated → ${seo.lastUpdated}`);
  console.log("Next: git add content/homepage-seo.json && git commit && git push");
  process.exit(0);
}

if (cmd === "plan") {
  const ids = pickThisMonthArticles();
  const label = monthLabel();
  console.log(`\n=== SEO plan — ${label} ===\n`);
  console.log("This month (3 articles, content-only push — no publish-date churn):\n");
  for (const id of ids) {
    const row = rowByWpId(id);
    console.log(`  • WP #${id}  ${row?.note ?? row?.html ?? "?"}`);
  }
  if (schedule.rotation.homepageEveryMonth) {
    console.log("\nHomepage:");
    console.log("  • Bump Last updated: npm run seo:bump-homepage → git push");
  }
  console.log("\nAfter editing HTML in docs/cms-content-pack/articles/:");
  console.log(`  npm run push:wp-articles -- ${ids.join(" ")}`);
  console.log("\nOptional (only big promo changes): add --touch-date\n");
  console.log("GSC checkpoints:");
  for (const c of schedule.gscCheckpoints) {
    console.log(`  Week ${c.week}: ${c.check}`);
  }
  appendLog({ action: "plan", month: label, articleIds: ids });
  process.exit(0);
}

if (cmd === "status") {
  const posts = await fetchWpPosts();
  console.log(`\n=== SEO status — ${monthLabel()} ===\n`);
  console.log(`Site:     ${schedule.site}`);
  console.log(`GSC:      ${schedule.gscProperty}`);
  console.log(`Sitemap:  ${schedule.sitemap}\n`);

  if (posts) {
    console.log("WP articles (newest first):\n");
    for (const p of [...posts].sort((a, b) => b.modified.localeCompare(a.modified))) {
      console.log(`  #${p.id}  modified ${p.modified.slice(0, 16)}  ${p.slug}`);
    }
  } else {
    console.log("(WP_REST_URL not set — skipping live post list)\n");
  }

  const homepage = JSON.parse(readFileSync(homepageSeoPath, "utf8"));
  console.log(`\nHomepage lastUpdated (code): ${homepage.lastUpdated}`);

  const ids = pickThisMonthArticles();
  console.log(`\nScheduled this month: #${ids.join(", #")}`);
  console.log("\nYour job now: check GSC Performance weekly; content updates run on schedule.\n");
  appendLog({ action: "status", month: monthLabel() });
  process.exit(0);
}

console.error("Usage: plan | status | bump-homepage");
process.exit(1);
