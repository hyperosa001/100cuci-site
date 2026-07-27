# WordPress CMS Setup — 100CUCI（对齐 96m 流程）

CMS：**https://cms.100cuci.ad**（http 亦可）  
前台：**https://www.100cuci.ad**（Vercel）

## 1. WordPress

1. 设置 → 固定链接 → **文章名**
2. 安装插件：

| 插件 | 作用 |
|------|------|
| **Yoast SEO** | SEO title/description → build 时写入文章 meta |
| **100CUCI Site Links** | Login / Register URL |

### 安装 Site Links

```powershell
npm run package:plugin
```

上传 `dist/100cuci-site-links.zip` → 启用 → **设置 → 100CUCI Site Links**

```
GET https://cms.100cuci.ad/wp-json/cuci/v1/site-links
```

## 2. 分类 slug

`casino` · `slots` · `sportsbook` · `lottery` · `promotions`

## 3. 本机同步

`.env.local`：

```env
NEXT_PUBLIC_SITE_URL=https://www.100cuci.ad
WP_REST_URL=https://cms.100cuci.ad/wp-json
```

```powershell
npm run build
```

`prebuild` 会跑 `scripts/sync-wp-content.mjs`，拉取：

- `content/site-links.json`
- `content/categories.json`（含 Yoast 字段）
- `content/homepage-seo.json`（若存在 slug=`homepage-seo` 的页面）

## 4. Vercel

环境变量：`WP_REST_URL` + `NEXT_PUBLIC_SITE_URL` → Redeploy

完整清单见 `docs/GO-LIVE.md`
