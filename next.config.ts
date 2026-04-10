import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
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
    {
      protocol: 'http',
      hostname: 'localhost',
      pathname: '/uploads/les-foulees/**',
    },
  ],
  },

};

export default nextConfig;
