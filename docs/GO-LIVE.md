# 100CUCI Go-Live — 与 96m 同一套流程

```
编辑发文 → cms.100cuci.ad（WordPress + Yoast + Site Links）
              ↓
本地 / Vercel：npm run build → prebuild 同步 WP → content/*.json
              ↓
www.100cuci.ad（Vercel 前台）
```

发文后要 **Redeploy / 重新 build** 才会上线（和 96m 一样）。

---

## Phase 1 — WordPress（cms.100cuci.ad）

1. 固定链接 → **文章名**
2. 安装插件：
   - **Yoast SEO**（后台搜索安装）
   - **100CUCI Site Links**：上传 `dist/100cuci-site-links.zip`
3. 建分类（别名必须一致）：

| 名称 | 别名 |
|------|------|
| Casino | `casino` |
| Slots | `slots` |
| Sportsbook | `sportsbook` |
| Lottery | `lottery` |
| Promotions | `promotions` |

4. 发文章 → 勾选分类 → 发布  
5. 设置 → **100CUCI Site Links** → 填 Login / Register  
6. 文章里填 Yoast SEO title / description（可选，会进前台 meta）

生成插件 zip：

```powershell
npm run package:plugin
```

---

## Phase 2 — 本机 / Vercel 环境变量

### 本机 `.env.local`

```env
NEXT_PUBLIC_SITE_URL=https://www.100cuci.ad
WP_REST_URL=https://cms.100cuci.ad/wp-json
```

https 不稳时可用：`http://cms.100cuci.ad/wp-json`

### Vercel → Settings → Environment Variables

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.100cuci.ad` |
| `WP_REST_URL` | `https://cms.100cuci.ad/wp-json` |

Production / Preview / Development 都勾上 → 保存。

---

## Phase 3 — 同步 + 构建 + 上线

```powershell
cd "C:\Users\user-notebook\Desktop\ai 克隆网站工具\ai-website-cloner-template-master"

# 会自动跑 prebuild = sync-wp-content.mjs
npm run build
```

然后：

```powershell
git add .
git commit -m "Sync WordPress content and deploy"
git push
```

Vercel 会自动部署。  
以后 WP 改内容：再 build（或 Vercel Redeploy，build 时会再 sync）。

本地只测同步、不完整构建：

```powershell
$env:WP_REST_URL="https://cms.100cuci.ad/wp-json"
node scripts/sync-wp-content.mjs
```

---

## 和 96m 对照

| 步骤 | 96m | 100cuci |
|------|-----|---------|
| CMS | cms.96mas.online | cms.100cuci.ad |
| 插件 zip | `dist/96m-site-links.zip` | `dist/100cuci-site-links.zip` |
| Yoast | 要 | 要 |
| 环境变量 | `WP_REST_URL` | `WP_REST_URL` |
| sync | `prebuild` → `content/*.json` | 同左 |
| 前台 | Vercel `out/` 静态 | Vercel Next.js（同样 build 时 sync） |
| 发文后 | 重新 build / redeploy | 同左 |

详见 `wordpress/README-INSTALL.md`
