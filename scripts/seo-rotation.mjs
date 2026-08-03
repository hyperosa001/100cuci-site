/**
 * Phased SEO rotation — bootstrap → ramp → steady monthly cycles.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function loadEnvLocal(root) {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const key = t.slice(0, i).trim();
    if (!process.env[key]) process.env[key] = t.slice(i + 1).trim();
  }
}

export function loadSchedule(root) {
  const path = join(root, "content", "seo-schedule.json");
  return JSON.parse(readFileSync(path, "utf8"));
}

export function resolveWpPostMapPath(root, schedule) {
  if (schedule.paths?.wpPostMap) {
    return join(root, schedule.paths.wpPostMap);
  }
  const candidates = [
    join(root, "docs", "cms-content-pack", "wp-post-map.json"),
    join(root, "docs", "cms-rewrites", "wp-post-map.json"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  throw new Error("wp-post-map.json not found");
}

/** Calendar YMD in Malaysia time — same on local PC and GitHub UTC runners. */
const TZ = "Asia/Kuala_Lumpur";

function ymdInTz(date = new Date(), timeZone = TZ) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** UTC noon for a YMD string — stable day arithmetic across timezones. */
function utcNoonFromYmd(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function startOfDay(d) {
  return utcNoonFromYmd(ymdInTz(d));
}

export function parseRotationStart(schedule) {
  const s = schedule.rotation?.rotationStart;
  if (s?.date) return utcNoonFromYmd(s.date);
  if (s?.year != null && s?.month != null) {
    // month is 1-based in schedule JSON (7 = July)
    const month = Number(s.month);
    const ymd = `${s.year}-${String(month).padStart(2, "0")}-${String(s.day ?? 1).padStart(2, "0")}`;
    return utcNoonFromYmd(ymd);
  }
  return startOfDay(new Date());
}

export function daysSinceStart(schedule, now = new Date()) {
  const start = parseRotationStart(schedule);
  const today = startOfDay(now);
  return Math.round((today - start) / 86400000);
}

export function getPhases(schedule) {
  if (schedule.rotation?.phases?.length) {
    return schedule.rotation.phases;
  }
  const n = schedule.rotation?.articlesPerMonth ?? 3;
  return [
    {
      id: "steady-monthly",
      label: "Monthly maintenance",
      intervalDays: 30,
      articlesPerRun: n,
    },
  ];
}

function runsInPhase(orderLength, articlesPerRun) {
  return Math.ceil(orderLength / articlesPerRun);
}

function articlesForRun(order, runIndex, articlesPerRun) {
  const start = runIndex * articlesPerRun;
  return order.slice(start, start + articlesPerRun);
}

function addDays(base, days) {
  return new Date(base.getTime() + days * 86400000);
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

/**
 * Build timeline of all runs from rotation start through steady phase.
 */
export function buildRotationTimeline(schedule, maxPhases = Infinity) {
  const order = (schedule.rotation?.priorityOrder ?? []).filter(Boolean);
  if (!order.length) throw new Error("rotation.priorityOrder is empty");

  const phases = getPhases(schedule);
  const start = parseRotationStart(schedule);
  const timeline = [];
  let dayOffset = 0;

  for (let pi = 0; pi < phases.length && pi < maxPhases; pi++) {
    const phase = phases[pi];
    const runs = runsInPhase(order.length, phase.articlesPerRun);
    for (let run = 0; run < runs; run++) {
      const runDay = dayOffset + run * phase.intervalDays;
      timeline.push({
        phaseIndex: pi,
        phaseId: phase.id,
        phaseLabel: phase.label,
        runIndex: run,
        runsInPhase: runs,
        runDay,
        runDate: addDays(start, runDay),
        articlesPerRun: phase.articlesPerRun,
        intervalDays: phase.intervalDays,
        articleIds: articlesForRun(order, run, phase.articlesPerRun),
      });
    }
    dayOffset += runs * phase.intervalDays;
  }

  return { order, phases, start, timeline };
}

export function getRotationStatus(schedule, now = new Date()) {
  const { order, phases, start, timeline } = buildRotationTimeline(schedule);
  const elapsed = daysSinceStart(schedule, now);

  let dueRun = timeline.find((r) => r.runDay === elapsed);
  let nextRun = timeline.find((r) => r.runDay > elapsed);
  let lastRun = [...timeline].reverse().find((r) => r.runDay < elapsed);

  if (!dueRun && !nextRun && timeline.length) {
    const steady = phases[phases.length - 1];
    const steadyRuns = runsInPhase(order.length, steady.articlesPerRun);
    const steadyBlock = steadyRuns * steady.intervalDays;
    const afterTimeline = elapsed - timeline[timeline.length - 1].runDay;
    if (afterTimeline >= 0 && steady.intervalDays > 0) {
      const steadyRunIndex = Math.floor(afterTimeline / steady.intervalDays);
      const runDay =
        timeline[timeline.length - 1].runDay + steadyRunIndex * steady.intervalDays;
      const cycleRun = steadyRunIndex % steadyRuns;
      dueRun =
        runDay === elapsed
          ? {
              phaseIndex: phases.length - 1,
              phaseId: steady.id,
              phaseLabel: steady.label,
              runIndex: cycleRun,
              runsInPhase: steadyRuns,
              runDay,
              runDate: addDays(start, runDay),
              articlesPerRun: steady.articlesPerRun,
              intervalDays: steady.intervalDays,
              articleIds: articlesForRun(order, cycleRun, steady.articlesPerRun),
              steadyCycle: Math.floor(steadyRunIndex / steadyRuns) + 1,
            }
          : null;
      if (!dueRun) {
        const nextSteadyIndex = steadyRunIndex + (elapsed % steady.intervalDays === 0 ? 0 : 1);
        const nextDay =
          timeline[timeline.length - 1].runDay + nextSteadyIndex * steady.intervalDays;
        if (elapsed < nextDay || elapsed % steady.intervalDays !== 0) {
          const nr = nextSteadyIndex;
          const cr = nr % steadyRuns;
          nextRun = {
            phaseIndex: phases.length - 1,
            phaseId: steady.id,
            phaseLabel: steady.label,
            runIndex: cr,
            runsInPhase: steadyRuns,
            runDay: nextDay,
            runDate: addDays(start, nextDay),
            articlesPerRun: steady.articlesPerRun,
            intervalDays: steady.intervalDays,
            articleIds: articlesForRun(order, cr, steady.articlesPerRun),
          };
        }
      }
    }
  }

  const active = dueRun ?? nextRun ?? timeline[timeline.length - 1];
  const phase = phases[active?.phaseIndex ?? 0];

  return {
    elapsedDays: elapsed,
    rotationStart: formatDate(start),
    isDueToday: Boolean(dueRun),
    dueRun,
    nextRun: dueRun ? nextRun : nextRun ?? dueRun,
    lastRun,
    activePhase: phase,
    activeRun: active,
    orderLength: order.length,
    timelineLength: timeline.length,
  };
}

/** Articles to push right now (due today, or next run if --force). */
export function pickArticlesForRun(schedule, now = new Date(), { force = false } = {}) {
  const status = getRotationStatus(schedule, now);
  const run = status.isDueToday ? status.dueRun : force ? status.nextRun ?? status.dueRun : null;
  if (!run) return { status, articleIds: [] };
  return { status, articleIds: run.articleIds };
}

/** @deprecated use pickArticlesForRun */
export function pickThisMonthArticles(schedule, now = new Date()) {
  const { articleIds } = pickArticlesForRun(schedule, now, { force: true });
  return articleIds;
}
