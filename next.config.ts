import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Pattern for images hosted on lh3.googleusercontent.com
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      // Pattern for images hosted on oal4ogbsudvw9gbd.public.blob.vercel-storage.com
      {
        protocol: "https",
        hostname: "oal4ogbsudvw9gbd.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
