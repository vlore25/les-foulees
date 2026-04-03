import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
    {
      protocol: 'http', // ou https si tu configures un SSL
      hostname: '82.165.134.12',
      port: '9000',
      pathname: '/les-foulees-uploads/**',
    },
  ],
  },

};

export default nextConfig;
