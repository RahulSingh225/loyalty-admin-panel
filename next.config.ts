import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sturlite-uat.s3.ap-south-1.amazonaws.com', // Replace with your S3 hostname
        pathname: '/**', // Allows images from any path in the bucket
      },
    ],
  },
  output: 'standalone',
  /* config options here */
};

export default nextConfig;
