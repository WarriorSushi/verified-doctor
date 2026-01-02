import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for performance
  experimental: {
    // Enable partial prerendering for faster page loads
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/v1/create-qr-code/**",
      },
      {
        protocol: "https",
        hostname: "qofqsqgqhyxlwmdpqhjo.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Optimize image loading
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },

  // Enable compression
  compress: true,

  // Headers for caching static assets
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
