/**
 * Build docs/cms-content-pack/README.md with full HTML bodies for copy-paste.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pack = join(root, "docs", "cms-content-pack");
const articlesDir = join(pack, "articles");
const meta = JSON.parse(readFileSync(join(articlesDir, "_meta.json"), "utf8"));

const covers = {
  "live-casino-first-session-100cuci": "/media/7a68e80182196c00919f4.png",
  "100cuci-casino-banking-withdrawal": "/media/5165631054b96399427ff.png",
  "jili-mega888-start-100cuci": "/media/62f867f8764a68724ee87.png",
  "slot-free-credit-malaysia-100cuci": "/media/ba426dcef62a678dcc70a.webp",
  "football-betting-malaysia-100cuci": "/media/18008343353a64f8a4481.png",
  "live-odds-basics-100cuci": "/media/a2629340ed2a69e4fa4c7.webp",
  "4d-lottery-guide-100cuci": "/media/125476a9d51965d355fb4.png",
  "lottery-responsible-play-100cuci": "/media/9a34856f321963f19982f.gif",
  "free-credit-no-deposit-100cuci-guide": "/media/b0dc9b63d88967e6859cb.webp",
  "referral-daily-rewards-100cuci": "/media/f85eb31f3219680b10ca3.gif",
};

let md = `# 100CUCI CMS 内容包（直接复制发文）

每篇约 **1100～1450 英文词**。封面网站自动加；正文含 2 张中部图 + Summary。发文后约 1 分钟上站，无需再 push 文章。

## 怎么复制才不会再出现代码泄漏

1. 滚动到下面某一篇的 **正文 HTML** 代码块  
2. 点代码块右上角 **Copy**（推荐），或只选中块内从 \`<p>\` 到最后 \`</div>\`  
3. **不要**复制 \`\`\`html 或 \`\`\` 这两行  
4. WordPress → 切到 **Code editor / 代码编辑** → 粘贴 → Publish  
5. Excerpt 摘要、Title、slug、分类按每篇表格填写  

旧文若已坏：用同一正文 **整篇覆盖** 再更新。

---

## 速查表

| # | 分类 | slug（Permalink 必须一致） | 文件 |
|---|------|---------------------------|------|
`;

for (let i = 0; i < meta.length; i++) {
  const m = meta[i];
  md += `| ${i + 1} | ${m.category} | \`${m.slug}\` | [articles/${m.file}](articles/${m.file}) |\n`;
}

md += `
### 封面（CMS 不用插）

| slug | 封面 |
|------|------|
`;

for (const m of meta) {
  md += `| \`${m.slug}\` | \`${covers[m.slug]}\` |\n`;
}

md += `\n---\n\n`;

for (let i = 0; i < meta.length; i++) {
  const m = meta[i];
  const html = readFileSync(join(articlesDir, m.file), "utf8").trim();
  const words = html
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  md += `## ${i + 1}) ${m.category} — ${m.title}

| 字段 | 填写 |
|------|------|
| **分类** | ${m.category} |
| **标题 Title** | ${m.title} |
| **建议 slug** | \`${m.slug}\` |
| **摘要 Excerpt** | ${m.excerpt} |
| **字数** | ~${words} words |

### 正文 HTML（点 Copy，不要带 \`\`\`html）

\`\`\`html
${html}
\`\`\`

---

`;
}

md += `## 发完检查

1. 前台看不到 \`\`\`html、看不到裸露的 \`class="lp-keyword-link"\`  
2. 标题下有摘要盒；文末有 Summary  
3. 封面 1 张 + 文中约 2 张图（完整不裁切）  
4. URL 末段 = 上表 slug  
5. 打开栏目页确认卡片与 Read more  

重新生成本文（开发用）：

\`\`\`bash
node scripts/generate-cms-articles.mjs
node scripts/pad-cms-articles.mjs
node scripts/finalize-cms-articles.mjs
node scripts/boost-cms-articles.mjs
node scripts/topup-cms-articles.mjs
node scripts/build-cms-readme.mjs
\`\`\`
`;

writeFileSync(join(pack, "README.md"), md, "utf8");
console.log("Wrote README with", meta.length, "articles");
