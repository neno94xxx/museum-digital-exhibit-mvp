import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Worker threads are compatible with restricted Windows environments where
    // spawning child processes during type checking can be blocked.
    workerThreads: true,
  },
};

export default nextConfig;
