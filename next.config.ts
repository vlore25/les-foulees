import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
    ],
  },

};

export default nextConfig;
