import type { ReactNode } from "react";
import { KEYWORD_LINKS } from "@/content/keyword-links";
import type { KeywordLink } from "@/content/types";

type Segment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string; external?: boolean };

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyKeywordLinks(text: string, links: KeywordLink[]): Segment[] {
  let segments: Segment[] = [{ type: "text", value: text }];
  const sorted = [...links].sort((a, b) => b.keyword.length - a.keyword.length);

  for (const link of sorted) {
    const next: Segment[] = [];
    const pattern = new RegExp(escapeRegex(link.keyword), "gi");

    for (const segment of segments) {
      if (segment.type !== "text") {
        next.push(segment);
        continue;
      }

      let lastIndex = 0;
      let match: RegExpExecArray | null;
      const source = segment.value;

      while ((match = pattern.exec(source)) !== null) {
        if (match.index > lastIndex) {
          next.push({ type: "text", value: source.slice(lastIndex, match.index) });
        }
        next.push({
          type: "link",
          value: match[0],
          href: link.href,
          external: link.external,
        });
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < source.length) {
        next.push({ type: "text", value: source.slice(lastIndex) });
      }
    }

    segments = next.length > 0 ? next : segments;
  }

  return segments;
}

export function LinkedText({
  text,
  links = KEYWORD_LINKS,
  className,
}: {
  text: string;
  links?: KeywordLink[];
  className?: string;
}) {
  const segments = applyKeywordLinks(text, links);

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
