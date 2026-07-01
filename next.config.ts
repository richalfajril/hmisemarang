import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.2.2'],
  experimental: {
    // Image uploads are compressed to ≤2MB WebP client-side; allow headroom
    // over the 1MB Server Action default for the multipart payload.
    serverActions: { bodySizeLimit: '3mb' },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
