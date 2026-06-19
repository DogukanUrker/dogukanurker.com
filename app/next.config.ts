import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // bundle the CV pdf fonts into the route's serverless function so it can read
  // them from disk (public/ assets aren't included in the function bundle).
  outputFileTracingIncludes: {
    "/cv/pdf": ["./public/fonts/**"],
  },
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
