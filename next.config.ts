import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.bim.com.tr" },
      { protocol: "https", hostname: "**.a101.com.tr" },
      { protocol: "https", hostname: "**.sokmarket.com.tr" },
      { protocol: "https", hostname: "cdn.a101.com.tr" },
      { protocol: "https", hostname: "cdn.sokmarket.com.tr" },
    ],
  },
};

export default nextConfig;
