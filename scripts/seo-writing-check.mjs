/**
 * Writing-rules check for one 100cuci article HTML file.
 * Prints the first failed rule and exits 1. Exit 0 when the file passes.
 *
 *   node scripts/seo-writing-check.mjs docs/cms-content-pack/articles/05-....html
 */
import { readFileSync } from "node:fs";

const BRAND =
  /\b(100\s*CUCI|100CUCI|JILI|MEGA\s*888|MEGA888|Pragmatic Play|SBOBET|iBCbet)\b/i;

function textOf(fragment) {
  return fragment
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string} html
 * @param {{ allowedTitle?: string, wpId?: number, usedTitles?: { title: string, wpId?: number }[] }} [options]
 * @returns {{ ok: true } | { ok: false, rule: string }}
 */
export function checkArticleHtml(html, options = {}) {
  const fail = (rule) => ({ ok: false, rule });
  const plain = textOf(html);

  const h1s = [...html.matchAll(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi)];
  if (h1s.length !== 1) return fail("One descriptive H1");

  const h1Text = textOf(h1s[0][0]);
  if (options.allowedTitle && h1Text.toLowerCase() !== options.allowedTitle.toLowerCase()) {
    return fail("queued article title must stay the same until it passes");
  }
  const repeated = (options.usedTitles ?? []).find(
    (row) =>
      row.title.toLowerCase() === h1Text.toLowerCase() &&
      Number(row.wpId) !== Number(options.wpId),
  );
  if (!options.allowedTitle && repeated) {
    return fail("Never repeat a title already in content/seo-topic-log.json");
  }

  const h1End = html.search(/<\/h1>/i);
  const h2Start = html.search(/<h2\b/i);
  if (h1End === -1 || h2Start === -1 || h2Start < h1End) {
    return fail("a lead paragraph that answers the query up front");
  }
  if (!/<p\b/i.test(html.slice(h1End, h2Start))) {
    return fail("a lead paragraph that answers the query up front");
  }

  const h2s = [...html.matchAll(/<h2\b[^>]*>[\s\S]*?<\/h2>/gi)];
  if (h2s.length < 4 || h2s.length > 5) return fail("4 or 5 H2 sections");
  if (textOf(h2s.at(-1)[0]) !== "Frequently Asked Questions") {
    return fail('The last H2 is exactly "Frequently Asked Questions"');
  }

  const h3s = [...html.matchAll(/<h3\b[^>]*>[\s\S]*?<\/h3>/gi)];
  if (h3s.length < 6) return fail("At least 6 H3 headings");

  const faqHeading = h2s.at(-1)[0];
  const faqStart = html.lastIndexOf(faqHeading);
  const summaryStart = html.search(/<div\s+class="lp-summary"/i);
  if (summaryStart === -1 || summaryStart < faqStart) {
    return fail('a closing <div class="lp-summary">');
  }
  const faq = html.slice(faqStart, summaryStart);
  const faqH3 = [...faq.matchAll(/<h3\b[^>]*>[\s\S]*?<\/h3>/gi)];
  if (faqH3.length < 3) return fail("at least 3 H3 questions");
  for (const match of faqH3) {
    const after = faq.slice(match.index + match[0].length);
    const next = after.search(/<h3\b|<h2\b/i);
    const chunk = next === -1 ? after : after.slice(0, next);
    if (!/<p\b/i.test(chunk)) {
      return fail("an answer paragraph under each FAQ question");
    }
  }

  const lists = html.match(/<ul\b/gi) ?? [];
  if (lists.length < 2) return fail("At least 2 bullet lists");

  const anchors = [
    ...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi),
  ];
  const internal = anchors.filter((anchor) => {
    const href = anchor[1];
    return (
      href.startsWith("/articles/") ||
      href.includes("100cuci.ad/articles/")
    );
  });
  if (internal.length < 3 || internal.length > 5) {
    return fail("3 to 5 internal links");
  }
  for (const anchor of anchors) {
    if (BRAND.test(textOf(anchor[2]))) {
      return fail("Brand and product names stay plain text, not anchor text");
    }
  }

  if (
    /guaranteed[-\s]?win|risk[-\s]?free|sure[-\s]?win|secret[-\s]?system/i.test(
      plain,
    )
  ) {
    return fail(
      "No guaranteed-win, risk-free, sure-win, or secret-system claims",
    );
  }
  if (!/18\s*\+/.test(plain)) return fail("State 18+");
  if (!/budget|bankroll/i.test(plain)) return fail("a fixed budget or bankroll");
  if (!/time limit/i.test(plain)) return fail("a time limit");
  if (!/do not chase losses|don't chase losses/i.test(plain)) {
    return fail("do not chase losses");
  }
  if (!/entertainment wallet/i.test(plain)) {
    return fail("a separate entertainment wallet");
  }
  if (!/Malaysia/i.test(plain) || !/\bRM\b/.test(plain)) {
    return fail(
      "Keep the site's own country, currency, and local payment context",
    );
  }

  return { ok: true };
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node scripts/seo-writing-check.mjs <article.html>");
    process.exit(1);
  }
  const html = readFileSync(file, "utf8");
  const result = checkArticleHtml(html);
  if (!result.ok) {
    console.error(result.rule);
    process.exit(1);
  }
  console.log("pass");
}

if (process.argv[1] && process.argv[1].endsWith("seo-writing-check.mjs")) {
  main();
}
