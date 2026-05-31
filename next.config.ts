import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Build-tracker photos are served from Vercel Blob.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
