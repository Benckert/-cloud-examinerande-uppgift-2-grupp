import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker builds
  // This creates a self-contained server with only required dependencies
  // Reduces image size by ~80% and ensures env vars are properly baked in
  output: "standalone",

  // Disable X-Powered-By header for security
  poweredByHeader: false,

  // Enable compression for faster response times
  compress: true,
};

export default nextConfig;
