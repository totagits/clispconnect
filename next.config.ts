import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Suppress hydration warning alerts in dev console
  reactStrictMode: true,
};

export default nextConfig;

