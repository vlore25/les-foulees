import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
