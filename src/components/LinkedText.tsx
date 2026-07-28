import type { ReactNode } from "react";
import {
  KEYWORD_LINKS,
  KEYWORD_MAX_PER_ARTICLE,
} from "@/content/keyword-links";
import type { KeywordLink } from "@/content/types";

type Segment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string; external?: boolean };

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 每个关键词只链第一次；全文最多 maxLinks 个 */
function applyKeywordLinks(
  text: string,
  links: KeywordLink[],
  maxLinks: number,
): Segment[] {
  let segments: Segment[] = [{ type: "text", value: text }];
  const sorted = [...links].sort((a, b) => b.keyword.length - a.keyword.length);
  let linked = 0;

  for (const link of sorted) {
    if (linked >= maxLinks) break;

    const next: Segment[] = [];
    const pattern = new RegExp(escapeRegex(link.keyword), "i");
    let placed = false;

    for (const segment of segments) {
      if (segment.type !== "text" || placed) {
        next.push(segment);
        continue;
      }

      const source = segment.value;
      const match = source.match(pattern);
      if (!match || match.index === undefined) {
        next.push(segment);
        continue;
      }

      if (match.index > 0) {
        next.push({ type: "text", value: source.slice(0, match.index) });
      }
      next.push({
        type: "link",
        value: match[0],
        href: link.href,
        external: link.external,
      });
      const end = match.index + match[0].length;
      if (end < source.length) {
        next.push({ type: "text", value: source.slice(end) });
      }
      placed = true;
      linked += 1;
    }

    segments = next.length > 0 ? next : segments;
  }

  return segments;
}

export function LinkedText({
  text,
  links = KEYWORD_LINKS,
  maxLinks = KEYWORD_MAX_PER_ARTICLE,
  className,
}: {
  text: string;
  links?: KeywordLink[];
  maxLinks?: number;
  className?: string;
}) {
  const segments = applyKeywordLinks(text, links, maxLinks);

  const nodes: ReactNode[] = segments.map((segment, index) => {
    if (segment.type === "text") {
      return segment.value;
    }

    if (segment.external) {
      return (
        <a
          key={`${segment.href}-${index}`}
          href={segment.href}
          className="lp-keyword-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {segment.value}
        </a>
      );
    }

    return (
      <a key={`${segment.href}-${index}`} href={segment.href} className="lp-keyword-link">
        {segment.value}
      </a>
    );
  });

  return <span className={className}>{nodes}</span>;
}
