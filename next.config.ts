import type { NextConfig } from "next";
import { LEGACY_ARTICLE_SLUG_REDIRECTS } from "./src/config/slug-redirects";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xt30sf.b-cdn.net",
        pathname: "/media/**",
      },
    ],
  },
  async redirects() {
    return LEGACY_ARTICLE_SLUG_REDIRECTS.map(({ category, from, to }) => ({
      source: `/articles/${category}/${from}`,
      destination: `/articles/${category}/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
