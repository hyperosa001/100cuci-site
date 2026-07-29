/**
 * Auto-push scheduled rotation articles → WordPress + Telegram.
 *
 * Usage:
 *   node scripts/seo-auto-push.mjs              # only if due today
 *   node scripts/seo-auto-push.mjs --force      # push next slot now
 *   node scripts/seo-auto-push.mjs --dry-run
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

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
loadEnvLocal(root);

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const touchDate = process.argv.includes("--touch-date");
const schedule = loadSchedule(root);
const mapPath = resolveWpPostMapPath(root, schedule);
const map = JSON.parse(readFileSync(mapPath, "utf8"));
const { status, articleIds: ids } = pickArticlesForRun(schedule, new Date(), { force });
const logPath = join(root, "content", "seo-maintenance-log.json");

function appendLog(entry) {
  const log = existsSync(logPath)
    ? JSON.parse(readFileSync(logPath, "utf8"))
    : { runs: [] };
  log.runs.unshift({ at: new Date().toISOString(), ...entry });
  log.runs = log.runs.slice(0, 48);
  writeFileSync(logPath, `${JSON.stringify(log, null, 2)}\n`);
}

const run = status.dueRun ?? status.nextRun;

console.log(`\n=== SEO auto-push ===\n`);
console.log(`Site:  ${schedule.site}`);
console.log(`Start: ${status.rotationStart} (day ${status.elapsedDays})`);
console.log(`Phase: ${status.activePhase?.label ?? "?"}`);
console.log(
  status.isDueToday
    ? "Today: ✅ due — pushing now"
    : force
      ? "Today: ⏭ forced — pushing next slot"
      : "Today: ⏸ not due — use --force to push early",
);
if (run) {
  console.log(
    `Run:   ${run.runDate.toISOString().slice(0, 10)} · ${run.runIndex + 1}/${run.runsInPhase} in cycle`,
  );
}
console.log(`\nArticles (${ids.length}):\n`);

for (const id of ids) {
  const row = map.find((r) => r.wpId === id);
  console.log(`  • WP #${id}  ${row?.note ?? row?.html ?? "?"}`);
}

if (!ids.length) {
  console.log("\nNothing to push.\n");
  process.exit(0);
}

if (dryRun) {
  console.log("\n[dry-run] Skipped push.\n");
  process.exit(0);
}

if (!status.isDueToday && !force) {
  console.log("\nNot due today. Run with --force to push anyway.\n");
  process.exit(0);
}

const pushScript = join(root, "scripts", "push-cms-articles-to-wp.mjs");
const args = [pushScript, ...(touchDate ? ["--touch-date"] : []), ...ids.map(String)];
console.log("\nRunning push...\n");

const result = spawnSync(process.execPath, args, {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

appendLog({
  action: "auto-push",
  phase: run?.phaseId,
  articleIds: ids,
  touchDate,
  forced: force && !status.isDueToday,
  exitCode: result.status ?? 1,
});

process.exit(result.status ?? 1);
