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
      protocol: 'http',
      hostname: '82.165.134.12',
      port: '80',
      pathname: '/uploads/les-foulees/**',
    },
  ],
  },

};

export default nextConfig;
