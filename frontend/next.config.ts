import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Ensure module resolution works correctly
  experimental: {
    // This helps with module resolution
  },
};

export default nextConfig;
