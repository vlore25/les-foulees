import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
   future: {
    webpack5: true,   
  },

  webpack(config) {
    config.resolve.fallback = {

      ...config.resolve.fallback,  

      fs: false, // the solution
    };
    
    return config;
  },
};

export default nextConfig;
