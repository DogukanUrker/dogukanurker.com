import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/articles",
        destination: "/article",
      },
      {
        source: "/articles/:slug",
        destination: "/article/:slug",
      },
    ];
  },
};

export default nextConfig;
