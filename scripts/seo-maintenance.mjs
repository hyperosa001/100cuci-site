/**
 * SEO maintenance — phased rotation + homepage bump.
 *
 * Usage:
 *   node scripts/seo-maintenance.mjs plan
 *   node scripts/seo-maintenance.mjs calendar
 *   node scripts/seo-maintenance.mjs status
 *   node scripts/seo-maintenance.mjs bump-homepage
 *   node scripts/seo-maintenance.mjs auto-push [--force] [--dry-run]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  loadEnvLocal,
  loadSchedule,
  pickArticlesForRun,
  getRotationStatus,
  buildRotationTimeline,
  resolveWpPostMapPath,
} from "./seo-rotation.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
loadEnvLocal(root);

const cmd = process.argv[2] ?? "plan";
const extraArgs = process.argv.slice(3);
const homepageSeoPath = join(root, "content", "homepage-seo.json");
const logPath = join(root, "content", "seo-maintenance-log.json");

if (cmd === "auto-push") {
  const script = join(root, "scripts", "seo-auto-push.mjs");
  const result = spawnSync(process.execPath, [script, ...extraArgs], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  process.exit(result.status ?? 1);
}

const schedule = loadSchedule(root);
const mapPath = resolveWpPostMapPath(root, schedule);
const map = JSON.parse(readFileSync(mapPath, "utf8"));

function rowByWpId(id) {
  return map.find((r) => r.wpId === id);
}

function monthLabel(d = new Date()) {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function appendLog(entry) {
  const log = existsSync(logPath)
    ? JSON.parse(readFileSync(logPath, "utf8"))
    : { runs: [] };
  log.runs.unshift({ at: new Date().toISOString(), ...entry });
  log.runs = log.runs.slice(0, 48);
  writeFileSync(logPath, `${JSON.stringify(log, null, 2)}\n`);
}

async function fetchWpPosts() {
  const wpRest = process.env.WP_REST_URL?.replace(/\/$/, "");
  if (!wpRest) return null;
  const res = await fetch(
    `${wpRest}/wp/v2/posts?per_page=100&status=publish&_fields=id,slug,title,date,modified`,
  );
  if (!res.ok) return null;
  return res.json();
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

if (cmd === "calendar") {
  const { timeline } = buildRotationTimeline(schedule);
  console.log(`\n=== SEO calendar (bootstrap → steady) ===\n`);
  for (const r of timeline) {
    const ids = r.articleIds.map((id) => `#${id}`).join(", ");
    console.log(
      `${r.runDate.toISOString().slice(0, 10)}  [${r.phaseId}]  run ${r.runIndex + 1}/${r.runsInPhase}  ${ids}`,
    );
  }
  console.log("\nAfter last row: steady phase repeats every 30 days.\n");
  process.exit(0);
}

if (cmd === "plan") {
  const status = getRotationStatus(schedule);
  const { articleIds } = pickArticlesForRun(schedule, new Date(), { force: true });

  console.log(`\n=== SEO plan ===\n`);
  console.log(`Site:        ${schedule.site}`);
  console.log(`Start:       ${status.rotationStart}`);
  console.log(`Today:       day ${status.elapsedDays}`);
  console.log(`Phase:       ${status.activePhase?.label}`);
  console.log(
    status.isDueToday ? "Due today:   ✅ YES — run auto-push" : "Due today:   no",
  );
  if (status.nextRun && !status.isDueToday) {
    console.log(
      `Next run:    ${status.nextRun.runDate.toISOString().slice(0, 10)}  (#${status.nextRun.articleIds.join(", #")})`,
    );
  }
  console.log(`\nThis slot (${articleIds.length} articles):\n`);
  for (const id of articleIds) {
    const row = rowByWpId(id);
    console.log(`  • WP #${id}  ${row?.note ?? row?.html ?? "?"}`);
  }
  if (schedule.rotation?.homepageEveryMonth) {
    console.log("\nHomepage: npm run seo:bump-homepage → git push");
  }
  console.log("\nEdit local HTML, then:");
  console.log("  node scripts/seo-auto-push.mjs");
  console.log("  node scripts/seo-auto-push.mjs --force");
  console.log("  node scripts/seo-maintenance.mjs calendar\n");
  appendLog({ action: "plan", articleIds, phase: status.activePhase?.id });
  process.exit(0);
}

if (cmd === "status") {
  const status = getRotationStatus(schedule);
  const posts = await fetchWpPosts();
  console.log(`\n=== SEO status ===\n`);
  console.log(`Site:   ${schedule.site}`);
  console.log(`Phase:  ${status.activePhase?.label}`);
  console.log(`Day:    ${status.elapsedDays} since ${status.rotationStart}\n`);
  if (posts) {
    console.log("WP modified (newest first):\n");
    for (const p of [...posts].sort((a, b) => b.modified.localeCompare(a.modified))) {
      console.log(`  #${p.id}  ${p.modified.slice(0, 16)}  ${p.slug}`);
    }
  }
  console.log("");
  appendLog({ action: "status", phase: status.activePhase?.id });
  process.exit(0);
}

console.error("Usage: plan | calendar | status | bump-homepage | auto-push [--force]");
process.exit(1);
