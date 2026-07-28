import type { KeywordLink } from "@/content/types";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 清洗 CMS 误贴内容：
 * - markdown 代码围栏（```html）
 * - 已存在的关键词内链（避免二次 linkify / 半截标签泄漏）
 * - 半截属性碎片（如 casino/slug" class="lp-keyword-link">）
 */
export function scrubCmsHtml(html: string): string {
  return html
    .replace(/```(?:html|HTML|htm)?\s*/gi, "")
    .replace(/```/g, "")
    .replace(/<a\b[^>]*\blp-keyword-link\b[^>]*>([\s\S]*?)<\/a>/gi, "$1")
    .replace(/\b[\w./:-]+"\s+class=["']lp-keyword-link["'][^>]*>/gi, "")
    .replace(/\sclass=["']lp-keyword-link["']/gi, "")
    .trim();
}

/** 只在纯文本里找关键词，绝不匹配已插入的标签/属性 */
function matchInPlainText(
  text: string,
  pattern: RegExp,
): { index: number; value: string } | null {
  let i = 0;
  while (i < text.length) {
    if (text[i] === "<") {
      const close = text.indexOf(">", i);
      if (close === -1) return null;
      i = close + 1;
      continue;
    }
    let nextTag = text.indexOf("<", i);
    if (nextTag === -1) nextTag = text.length;
    const slice = text.slice(i, nextTag);
    const match = slice.match(pattern);
    if (match && match.index !== undefined) {
      return { index: i + match.index, value: match[0] };
    }
    i = nextTag;
  }
  return null;
}

/**
 * 给纯文本段落加关键词链接；跳过已有 <a> 内文本与标签属性。
 * 每个关键词最多链一次；全文最多 maxLinks 个（栏目文章默认 2）。
 */
export function linkifyHtml(
  html: string,
  links: KeywordLink[],
  maxLinks = 2,
): string {
  const cleaned = scrubCmsHtml(html);
  const sorted = [...links].sort((a, b) => b.keyword.length - a.keyword.length);
  const used = new Set<string>();
  let result = "";
  let i = 0;

  while (i < cleaned.length) {
    if (cleaned[i] === "<") {
      const close = cleaned.indexOf(">", i);
      if (close === -1) {
        result += cleaned.slice(i);
        break;
      }
      const tag = cleaned.slice(i, close + 1);
      result += tag;
      i = close + 1;

      const tagName = tag.match(/^<\/?\s*([a-z0-9]+)/i)?.[1]?.toLowerCase();
      if (tagName === "a") {
        const endA = cleaned.toLowerCase().indexOf("</a>", i);
        if (endA === -1) {
          result += cleaned.slice(i);
          break;
        }
        result += cleaned.slice(i, endA + 4);
        i = endA + 4;
      }
      continue;
    }

    let nextTag = cleaned.indexOf("<", i);
    if (nextTag === -1) nextTag = cleaned.length;
    let text = cleaned.slice(i, nextTag);

    for (const link of sorted) {
      if (used.size >= maxLinks) break;

      const key = link.keyword.toLowerCase();
      if (used.has(key)) continue;

      const hasSpace = /\s/.test(link.keyword);
      const pattern = hasSpace
        ? new RegExp(escapeRegex(link.keyword), "i")
        : new RegExp(`\\b${escapeRegex(link.keyword)}\\b`, "i");

      const match = matchInPlainText(text, pattern);
      if (!match) continue;

      const before = text.slice(0, match.index);
      const hit = match.value;
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
