import type { ReactNode } from "react";
import type { SeoFaqItem, SeoSection } from "@/content/types";

const BRAND_PATTERN = /100CUCI/gi;

export function collectHomepageSeoTexts(sections: SeoSection[], faq: SeoFaqItem[]): string[] {
  const texts: string[] = [];
  for (const section of sections) {
    texts.push(section.title);
    section.paragraphs?.forEach((p) => texts.push(p));
    section.list?.forEach((item) => texts.push(item));
  }
  texts.push("FAQ");
  for (const item of faq) {
    texts.push(item.q);
    texts.push(item.a);
  }
  return texts;
}

export function count100CuciMatches(texts: string[]): number {
  return texts.reduce((total, text) => {
    const matches = text.match(BRAND_PATTERN);
    return total + (matches?.length ?? 0);
  }, 0);
}

/** 全页 SEO 区只给第 1 个和最后 1 个「100CUCI」加链接 */
export function renderFirstLast100Cuci(
  text: string,
  href: string,
  external: boolean,
  state: { seen: number },
  totalMatches: number,
): ReactNode[] {
  if (totalMatches === 0) return [text];

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  const source = text;
  const pattern = new RegExp(BRAND_PATTERN.source, "gi");
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(source.slice(lastIndex, match.index));
    }

    state.seen += 1;
    const isFirst = state.seen === 1;
    const isLast = state.seen === totalMatches;
    const label = match[0];

    if (isFirst || isLast) {
      if (external) {
        nodes.push(
          <a
            key={`${match.index}-${state.seen}`}
            href={href}
            className="lp-keyword-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>,
        );
      } else {
        nodes.push(
          <a key={`${match.index}-${state.seen}`} href={href} className="lp-keyword-link">
            {label}
          </a>,
        );
      }
    } else {
      nodes.push(label);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < source.length) {
    nodes.push(source.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

export function HomepageSeoText({
  text,
  href,
  external,
  state,
  totalMatches,
}: {
  text: string;
  href: string;
  external: boolean;
  state: { seen: number };
  totalMatches: number;
}) {
  return <>{renderFirstLast100Cuci(text, href, external, state, totalMatches)}</>;
}
