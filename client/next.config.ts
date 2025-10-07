import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    ignoreDuringBuilds: true, // This disables ESLint during builds
  },
typescript: {
    ignoreBuildErrors: true, // ✅ disables TS errors during build
  },
};

export default nextConfig;
