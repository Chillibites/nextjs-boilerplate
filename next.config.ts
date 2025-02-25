import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
    ],
    domains: ['oal4ogbsudvw9gbd.public.blob.vercel-storage.com'],
  },
};

export default nextConfig;
