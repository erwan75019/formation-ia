import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/formation/site-web/:lesson(1[3-9]|20)/:path*",
        destination: "/formation/site-web/12",
        permanent: true,
      },
      {
        source: "/formation/python",
        destination: "/formation/site-web",
        permanent: true,
      },
      {
        source: "/formation/python/:path*",
        destination: "/formation/site-web/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
