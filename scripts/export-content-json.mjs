import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
mkdirSync(contentDir, { recursive: true });

// Load TS modules via Next/tsconfig path — use relative requires after compile is not available.
// This script is run once via: node --import tsx scripts/export-content-json.mjs
const { CATEGORIES } = await import("../src/content/categories.ts");
const seo = await import("../src/content/seo-content.ts");
const { KEYWORD_LINKS } = await import("../src/content/keyword-links.ts");

writeFileSync(
  join(contentDir, "categories.json"),
  JSON.stringify({ categories: CATEGORIES }, null, 2),
  "utf8",
);

writeFileSync(
  join(contentDir, "homepage-seo.json"),
  JSON.stringify(
    {
      lastUpdated: seo.SEO_LAST_UPDATED,
      cuciLinkHref: seo.SEO_CUCI_LINK_HREF,
      cuciLinkExternal: seo.SEO_CUCI_LINK_EXTERNAL,
      sections: seo.SEO_SECTIONS,
      faq: seo.SEO_FAQ,
    },
    null,
    2,
  ),
  "utf8",
);

writeFileSync(
  join(contentDir, "keyword-links.json"),
  JSON.stringify({ links: KEYWORD_LINKS }, null, 2),
  "utf8",
);

console.log("Exported content/*.json");
