import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "docs",
  "cms-content-pack",
  "articles",
);

const more = `<h2>One-page reminder before you tap Register</h2>
<p>Before you Register or reopen 100CUCI, confirm three facts: you are 18+, you can afford the weekly entertainment envelope, and you know which product you will play tonight. If any fact is fuzzy, wait. Fuzzy starts create messy endings. Clear starts create shorter, calmer sessions — whether you play live casino, slots, sportsbook, lottery, or promotions clearance.</p>
<p>Keep the Register button bookmark from this site only. Random search results mix clones and phishing pages. One trusted door is enough. After login, Promotions first, games second. That order alone prevents half of beginner turnover mistakes.</p>`;

for (const f of readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  const file = join(dir, f);
  let html = readFileSync(file, "utf8");
  let w = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  if (w < 1200 && !html.includes("One-page reminder before you tap Register")) {
    html = html.replace(
      '<div class="lp-summary">',
      `${more}\n\n<div class="lp-summary">`,
    );
    writeFileSync(file, html);
    w = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  }
  console.log(`${f}: ~${w} words`);
}
