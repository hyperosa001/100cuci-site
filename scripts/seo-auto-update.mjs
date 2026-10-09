/**
 * 100cuci SEO auto-update.
 *
 * Updates only the rotation slot that is due today, or the articles already
 * listed in content/seo-queued-retry.json. A failed writing check stays queued
 * and blocks the next new topic. Homepage and other pages are not touched.
 *
 *   node scripts/seo-auto-update.mjs            # check due/retry HTML, push if it passes
 *   node scripts/seo-auto-update.mjs --select   # print the slot and next title, change nothing
 *   node scripts/seo-auto-update.mjs --dry-run
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  loadEnvLocal,
  loadSchedule,
  pickArticlesForRun,
  resolveWpPostMapPath,
} from "./seo-rotation.mjs";
import { checkArticleHtml } from "./seo-writing-check.mjs";
import { isTelegramConfigured, sendTelegramMessage } from "./telegram-notify.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
loadEnvLocal(root);

const selectOnly = process.argv.includes("--select");
const dryRun = process.argv.includes("--dry-run");
const schedule = loadSchedule(root);
const map = JSON.parse(readFileSync(resolveWpPostMapPath(root, schedule), "utf8"));
const meta = JSON.parse(
  readFileSync(join(root, "docs", "cms-content-pack", "articles", "_meta.json"), "utf8"),
);
const topics = JSON.parse(readFileSync(join(root, "content", "seo-topics.json"), "utf8"));
const logPath = join(root, "content", "seo-topic-log.json");
const retryPath = join(root, "content", "seo-queued-retry.json");
const articlesDir = join(root, "docs", "cms-content-pack", "articles");

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

function hostOf(site) {
  return String(site ?? "https://www.100cuci.ad").replace(/^https?:\/\//, "").replace(/\/$/, "");
}

const siteHost = hostOf(schedule.site);
const topicLog = readJson(logPath, { used: [] });
const retryFile = readJson(retryPath, { items: [] });
const usedTitles = topicLog.used;
const metaByFile = new Map(meta.map((row) => [row.file, row]));

function rowById(wpId) {
  return map.find((row) => row.wpId === Number(wpId));
}

function articleLabel(wpId) {
  const row = rowById(wpId);
  const info = row ? metaByFile.get(row.html) : null;
  return info?.title ?? row?.note ?? `WP #${wpId}`;
}

function nextTopic(wpId) {
  const used = new Set(usedTitles.map((row) => String(row.title ?? "").toLowerCase()));
  return (
    topics.topics.find(
      (topic) => topic.wpId === Number(wpId) && !used.has(topic.title.toLowerCase()),
    ) ?? null
  );
}

function h1Of(html) {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) return "";
  return match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function loggedEntryForH1(wpId, h1) {
  if (!h1) return undefined;
  return usedTitles.find(
    (row) =>
      String(row.title ?? "").toLowerCase() === h1.toLowerCase() &&
      Number(row.wpId) === Number(wpId),
  );
}

function targets() {
  if (retryFile.items?.length) {
    return {
      source: "retry",
      ids: retryFile.items.map((item) => Number(item.wpId)),
    };
  }
  const { status, articleIds } = pickArticlesForRun(schedule, new Date());
  return { source: status.isDueToday ? "due" : "none", ids: articleIds, status };
}

function queueFailure(wpId, rule, title) {
  const items = retryFile.items.filter((item) => Number(item.wpId) !== Number(wpId));
  items.unshift({
    wpId: Number(wpId),
    title,
    failedRule: rule,
    at: new Date().toISOString(),
  });
  retryFile.items = items;
  writeFileSync(retryPath, `${JSON.stringify(retryFile, null, 2)}\n`);
}

function clearRetry(wpId) {
  retryFile.items = retryFile.items.filter((item) => Number(item.wpId) !== Number(wpId));
  writeFileSync(retryPath, `${JSON.stringify(retryFile, null, 2)}\n`);
}

function rememberTitle(wpId, title, pillar) {
  const existing = topicLog.used.find(
    (row) =>
      String(row.title ?? "").toLowerCase() === title.toLowerCase() &&
      Number(row.wpId) === Number(wpId),
  );
  if (existing) {
    existing.pendingPush = false;
    existing.pushedAt = new Date().toISOString();
  } else if (title) {
    topicLog.used.push({
      title,
      pillar,
      wpId: Number(wpId),
      source: "rewrite",
      pendingPush: false,
      at: new Date().toISOString(),
    });
  }
  writeFileSync(logPath, `${JSON.stringify(topicLog, null, 2)}\n`);
}

const plan = targets();

if (selectOnly || plan.source === "none") {
  if (plan.source === "none") {
    const next = plan.status?.nextRun;
    console.log(
      next
        ? `Not due. Next slot ${next.runDate.toISOString().slice(0, 10)}: ${next.articleIds.join(", ")}`
        : "Not due. No queued retry.",
    );
    process.exit(0);
  }
}

console.log(`\n=== SEO auto-update (${plan.source}) ===\n`);
for (const wpId of plan.ids) {
  const row = rowById(wpId);
  const html = row ? readFileSync(join(articlesDir, row.html), "utf8") : "";
  const h1 = h1Of(html);
  const queued = retryFile.items.find((item) => Number(item.wpId) === Number(wpId));
  const logged = loggedEntryForH1(wpId, h1);
  const upcoming = nextTopic(wpId);
  const line = queued?.title
    ? `queued: ${queued.title}`
    : logged?.pendingPush === true
      ? `ready to push: ${logged.title}`
      : `next title: ${upcoming?.title ?? "(no unused topic)"}`;
  console.log(`#${wpId}  ${articleLabel(wpId)}\n  ${line}`);
}

if (selectOnly) process.exit(0);

let firstFailure = null;
const passed = [];

for (const wpId of plan.ids) {
  const row = rowById(wpId);
  if (!row) {
    firstFailure ??= { wpId, label: articleLabel(wpId), rule: "article is missing from wp-post-map.json" };
    continue;
  }
  const html = readFileSync(join(articlesDir, row.html), "utf8");
  const h1 = h1Of(html);
  const queued = retryFile.items.find((item) => Number(item.wpId) === Number(wpId));
  const logged = loggedEntryForH1(wpId, h1);
  const upcoming = nextTopic(wpId);
  if (!queued && logged && logged.pendingPush !== true && upcoming) {
    const rule = "Pick the next unused topic from the pillars";
    if (!dryRun) queueFailure(wpId, rule, upcoming.title);
    firstFailure ??= { wpId, label: articleLabel(wpId), rule };
    console.error(`fail #${wpId}: ${rule}`);
    continue;
  }
  const planned =
    queued?.title ?? (logged?.pendingPush === true ? logged.title : upcoming?.title);
  const result = checkArticleHtml(html, {
    usedTitles,
    wpId,
    allowedTitle: planned,
  });
  if (!result.ok) {
    const title = queued?.title ?? planned ?? upcoming?.title ?? articleLabel(wpId);
    if (!dryRun) queueFailure(wpId, result.rule, title);
    firstFailure ??= { wpId, label: articleLabel(wpId), rule: result.rule };
    console.error(`fail #${wpId}: ${result.rule}`);
    continue;
  }
  passed.push({ wpId, row, h1: html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] });
}

if (firstFailure) {
  const text = [
    `❌ ${siteHost} 这轮文章没通过检查，正在修改，通过后才会更新。`,
    `${firstFailure.label}: ${firstFailure.rule}`,
    "这一轮不会跳过。",
  ].join("\n");
  console.error(`\n${text}\n`);
  if (!dryRun && isTelegramConfigured()) await sendTelegramMessage(text);
  process.exit(0);
}

if (!passed.length) process.exit(0);

if (dryRun) {
  console.log(`\n[dry-run] Would push ${passed.length} article(s).`);
  process.exit(0);
}

const push = spawnSync(
  process.execPath,
  [
    join(root, "scripts", "push-cms-articles-to-wp.mjs"),
    "--no-telegram",
    ...passed.map((item) => String(item.wpId)),
  ],
  { cwd: root, stdio: "inherit", env: process.env },
);

if ((push.status ?? 1) !== 0) process.exit(push.status ?? 1);

for (const item of passed) {
  const h1 = String(item.h1 ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const pillar = topics.articlePillar[String(item.wpId)] ?? "";
  rememberTitle(item.wpId, h1, pillar);
  clearRetry(item.wpId);
}

const text = `✅ ${siteHost} 已更新 ${passed.length} 篇文章`;
console.log(`\n${text}`);
if (isTelegramConfigured()) await sendTelegramMessage(text);
