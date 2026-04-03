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
        protocol: 'https',
        hostname: 'loremflickr.com',
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'http',
        hostname: '82.165.134.12', // Ton IP VPS
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: true,
  },

};

export default nextConfig;
