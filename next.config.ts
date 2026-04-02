import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    unoptimized: true, // Évite les erreurs "received null" dans Docker
  },
};
export default nextConfig;
