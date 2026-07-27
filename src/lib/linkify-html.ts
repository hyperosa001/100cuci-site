import type { KeywordLink } from "@/content/types";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 给 HTML 正文里的关键词包一层 <a>（跳过已有链接内文本）。
 * 每个关键词只链第一次，避免整页刷屏。
 */
export function linkifyHtml(html: string, links: KeywordLink[]): string {
  const sorted = [...links].sort((a, b) => b.keyword.length - a.keyword.length);
  const used = new Set<string>();
  let result = "";
  let i = 0;

  while (i < html.length) {
    if (html[i] === "<") {
      const close = html.indexOf(">", i);
      if (close === -1) {
        result += html.slice(i);
        break;
      }
      const tag = html.slice(i, close + 1);
      result += tag;
      i = close + 1;

      const tagName = tag.match(/^<\/?\s*([a-z0-9]+)/i)?.[1]?.toLowerCase();
      if (tagName === "a") {
        const endA = html.toLowerCase().indexOf("</a>", i);
        if (endA === -1) {
          result += html.slice(i);
          break;
        }
        result += html.slice(i, endA + 4);
        i = endA + 4;
      }
      continue;
    }

    let nextTag = html.indexOf("<", i);
    if (nextTag === -1) nextTag = html.length;
    let text = html.slice(i, nextTag);

    for (const link of sorted) {
      const key = link.keyword.toLowerCase();
      if (used.has(key)) continue;
      const pattern = new RegExp(escapeRegex(link.keyword), "i");
      const match = text.match(pattern);
      if (!match || match.index === undefined) continue;

      const before = text.slice(0, match.index);
      const hit = match[0];
      const after = text.slice(match.index + hit.length);
      const attrs = link.external
        ? ` href="${link.href}" class="lp-keyword-link" target="_blank" rel="noopener noreferrer"`
        : ` href="${link.href}" class="lp-keyword-link"`;
      text = `${before}<a${attrs}>${hit}</a>${after}`;
      used.add(key);
    }

    result += text;
    i = nextTag;
  }

  return result;
}

export function estimateReadMinutes(text: string): number {
  const words = text
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
