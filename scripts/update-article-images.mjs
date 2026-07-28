/**
 * Assign unique topic-relevant mid-body images + update covers.
 * Then patch article HTML img tags and rebuild README.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const articlesDir = join(root, "docs", "cms-content-pack", "articles");
const metaPath = join(articlesDir, "_meta.json");

/** Mid-body images (must not equal that article's cover) */
const bodies = {
  live: {
    img1: "01a587def62a6abcb8a32.jpg",
    img1alt: "100CUCI game lobby",
    img2: "050e5c73d8896a0b30d90.webp",
    img2alt: "100CUCI live casino promo",
  },
  banking: {
    img1: "31081511821962ba4e3a6.png",
    img1alt: "100CUCI deposit rebate and wallet methods",
    img2: "1ab4589f3219601fbb7cd.png",
    img2alt: "100CUCI accepted payment methods — safe and fast withdrawal",
  },
  jili: {
    img1: "ee03e5d7764a66d4b2da0.png",
    img1alt: "100CUCI slot providers",
    img2: "f01511fb45d9650f4c841.png",
    img2alt: "100CUCI Fastspin slot game",
  },
  slotcredit: {
    img1: "24174c823fa9681119cd8.jpg",
    img1alt: "100CUCI slots lobby",
    img2: "689de2def62a6bad84fc6.webp",
    img2alt: "100CUCI exclusive slot game",
  },
  football: {
    img1: "a2629340ed2a69e4fa4c7.webp",
    img1alt: "Football sportsbook",
    img2: "9bb336e08219612129751.png",
    img2alt: "100CUCI hot games and markets",
  },
  liveodds: {
    img1: "965a2bf2db5a64602326e.png",
    img1alt: "100CUCI live play banner",
    img2: "e22f2ef8764a6d3b0a117.png",
    img2alt: "100CUCI in-play style game card",
  },
  "4d": {
    img1: "125476a9d51965d355fb4.png",
    img1alt: "100CUCI deposit lucky draw number games",
    img2: "2636a9355b896f5d3413b.png",
    img2alt: "100CUCI fast number-style games",
  },
  responsible: {
    img1: "644a0cef3219689f26d07.gif",
    img1alt: "100CUCI community reminder",
    img2: "f85eb31f3219680b10ca3.gif",
    img2alt: "100CUCI daily rewards reminder",
  },
  freecredit: {
    img1: "b0dc9b63d88967e6859cb.webp",
    img1alt: "100CUCI welcome free credit",
    img2: "31081511821962ba4e3a6.png",
    img2alt: "100CUCI rebate and commission offers",
  },
  referral: {
    img1: "644a0cef3219689f26d07.gif",
    img1alt: "100CUCI share and subscribe rewards",
    img2: "5165631054b96399427ff.png",
    img2alt: "100CUCI payment and cashout options",
  },
};

/** Covers — no World Cup for non-sports; sports may use sport-book art */
const covers = {
  "live-casino-first-session-100cuci": "7a68e80182196c00919f4.png",
  "100cuci-casino-banking-withdrawal": "5165631054b96399427ff.png",
  "banking-withdrawal-at-100cuci-casino-malaysia-guide": "5165631054b96399427ff.png",
  "jili-mega888-start-100cuci": "62f867f8764a68724ee87.png",
  "slot-free-credit-malaysia-100cuci": "ba426dcef62a678dcc70a.webp",
  "football-betting-malaysia-100cuci": "18008343353a64f8a4481.png",
  "live-odds-basics-100cuci": "a2629340ed2a69e4fa4c7.webp",
  "4d-lottery-guide-100cuci": "125476a9d51965d355fb4.png",
  "lottery-responsible-play-100cuci": "9a34856f321963f19982f.gif",
  "free-credit-no-deposit-100cuci-guide": "b0dc9b63d88967e6859cb.webp",
  "referral-daily-rewards-100cuci": "f85eb31f3219680b10ca3.gif",
};

const categoryCovers = {
  casino: "7a68e80182196c00919f4.png",
  slots: "62f867f8764a68724ee87.png",
  sportsbook: "18008343353a64f8a4481.png",
  lottery: "125476a9d51965d355fb4.png",
  promotions: "b0dc9b63d88967e6859cb.webp",
};

const meta = JSON.parse(readFileSync(metaPath, "utf8"));

for (const m of meta) {
  const body = bodies[m.topic];
  if (!body) continue;
  Object.assign(m, body);

  const file = join(articlesDir, m.file);
  let html = readFileSync(file, "utf8");

  // Replace first two content <img ...> that are full banners (not pay-row icons)
  // Strategy: replace by known old src patterns OR replace sequentially large imgs
  const imgTag =
    /<img\s+src="https:\/\/www\.100cuci\.ad\/media\/[^"]+"\s+alt="[^"]*"\s*\/>/g;
  const tags = [...html.matchAll(imgTag)].map((x) => x[0]);

  // Keep banking pay-row small icons; only swap first two "content" images
  // For banking file, first two are 310815 and 1ab4589; rest are logos in lp-pay-row
  if (m.topic === "banking") {
    html = html.replace(
      /src="https:\/\/www\.100cuci\.ad\/media\/[^"]+"/g,
      (match, offset) => {
        // only rewrite the two main banners by order of first occurrences outside pay-row
        return match;
      },
    );
    // Explicit replacements for banking main banners
    html = html
      .replace(
        /<img src="https:\/\/www\.100cuci\.ad\/media\/[^"]+" alt="100CUCI deposit rebate[^"]*" \/>/,
        `<img src="https://www.100cuci.ad/media/${body.img1}" alt="${body.img1alt}" />`,
      )
      .replace(
        /<img src="https:\/\/www\.100cuci\.ad\/media\/[^"]+" alt="100CUCI accepted payment methods[^"]*" \/>/,
        `<img src="https://www.100cuci.ad/media/${body.img2}" alt="${body.img2alt}" />`,
      );
  } else {
    let n = 0;
    html = html.replace(imgTag, (full) => {
      n += 1;
      if (n === 1) {
        return `<img src="https://www.100cuci.ad/media/${body.img1}" alt="${body.img1alt}" />`;
      }
      if (n === 2) {
        return `<img src="https://www.100cuci.ad/media/${body.img2}" alt="${body.img2alt}" />`;
      }
      return full;
    });
  }

  // Freecredit: cover is also b0dc9b — body img1 same as cover is ok for promo welcome,
  // but stripDuplicateCoverImgs will remove leading duplicate; put a different img1
  if (m.topic === "freecredit") {
    m.img1 = "f85eb31f3219680b10ca3.gif";
    m.img1alt = "100CUCI free credit and commission promo";
    m.img2 = "5165631054b96399427ff.png";
    m.img2alt = "100CUCI cashout payment options";
    let n = 0;
    html = html.replace(imgTag, (full) => {
      n += 1;
      if (n === 1) {
        return `<img src="https://www.100cuci.ad/media/${m.img1}" alt="${m.img1alt}" />`;
      }
      if (n === 2) {
        return `<img src="https://www.100cuci.ad/media/${m.img2}" alt="${m.img2alt}" />`;
      }
      return full;
    });
  }

  // Referral: cover is f85eb31 — body should not start with same
  if (m.topic === "referral") {
    m.img1 = "644a0cef3219689f26d07.gif";
    m.img1alt = "100CUCI share and subscribe rewards";
    m.img2 = "9bb336e08219612129751.png";
    m.img2alt = "100CUCI playable games after rewards";
    let n = 0;
    html = html.replace(imgTag, (full) => {
      n += 1;
      if (n === 1) {
        return `<img src="https://www.100cuci.ad/media/${m.img1}" alt="${m.img1alt}" />`;
      }
      if (n === 2) {
        return `<img src="https://www.100cuci.ad/media/${m.img2}" alt="${m.img2alt}" />`;
      }
      return full;
    });
  }

  // Lottery 4d: cover is 125476 — body img1 was also 125476; fix
  if (m.topic === "4d") {
    m.img1 = "2636a9355b896f5d3413b.png";
    m.img1alt = "100CUCI fast number-style games";
    m.img2 = "24174c823fa9681119cd8.jpg";
    m.img2alt = "100CUCI lobby for number and slot play";
    let n = 0;
    html = html.replace(imgTag, (full) => {
      n += 1;
      if (n === 1) {
        return `<img src="https://www.100cuci.ad/media/${m.img1}" alt="${m.img1alt}" />`;
      }
      if (n === 2) {
        return `<img src="https://www.100cuci.ad/media/${m.img2}" alt="${m.img2alt}" />`;
      }
      return full;
    });
  }

  writeFileSync(file, html);
  console.log(m.file, "→", m.img1, "+", m.img2);
}

writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");

// Update article-covers.ts
const coversTs = `/**
 * 文章封面 = 原站 100cuci.com CDN 克隆图（public/media）。
 * 完整显示、等比缩放，不裁切（CSS object-fit: contain）。
 */
export const ARTICLE_COVERS: Record<string, string> = {
${Object.entries(covers)
  .map(([k, v]) => `  "${k}": "/media/${v}",`)
  .join("\n")}
};

/** 栏目列表无 slug 匹配时的兜底图（同样来自原站 CDN） */
export const CATEGORY_COVERS: Record<string, string> = {
${Object.entries(categoryCovers)
  .map(([k, v]) => `  ${k}: "/media/${v}",`)
  .join("\n")}
};

export function getArticleCover(
  articleSlug: string,
  categorySlug?: string,
): string | undefined {
  return (
    ARTICLE_COVERS[articleSlug] ??
    (categorySlug ? CATEGORY_COVERS[categorySlug] : undefined)
  );
}
`;

writeFileSync(join(root, "src", "config", "article-covers.ts"), coversTs);
console.log("covers updated");
