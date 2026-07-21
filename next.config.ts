import type { NextConfig } from "next";

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
};

export default nextConfig;
