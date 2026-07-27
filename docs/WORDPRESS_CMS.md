# WordPress CMS（已并入 96m 同款流程）

请看：

- [GO-LIVE.md](./GO-LIVE.md) — 上线清单
- [../wordpress/README-INSTALL.md](../wordpress/README-INSTALL.md) — CMS 安装

核心：

1. WP 发文 + Yoast + Site Links 插件  
2. Vercel / 本机设 `WP_REST_URL=https://cms.100cuci.ad/wp-json`  
3. `npm run build`（prebuild 同步）→ push / Redeploy  
