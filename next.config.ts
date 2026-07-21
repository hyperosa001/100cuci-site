import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/",
        permanent: true,
      },
    ];
  },
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
