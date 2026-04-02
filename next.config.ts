import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', 
    },
  },
  images: {
    unoptimized: true, // SOLUTION AU 404 : Désactive l'optimisation gourmande
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
    ],
  },

};

export default nextConfig;
