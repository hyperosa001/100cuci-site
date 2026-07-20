export type KeywordLink = {
  /** 文章里出现的词（不区分大小写） */
  keyword: string;
  /** 站内路径或完整 URL */
  href: string;
  /** 站外链接（Register 等） */
  external?: boolean;
};

export type SeoKeywordLink = {
  text: string;
  href: string;
  external?: boolean;
};

export type SeoSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
};

export type SeoFaqItem = {
  q: string;
  a: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  paragraphs?: string[];
  list?: string[];
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  articles: Article[];
};
