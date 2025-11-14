import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better error handling
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable compression
  compress: true,

  // Production source maps for debugging (disable for faster builds)
  productionBrowserSourceMaps: false,

  // Optimize packages
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // PoweredBy header removal for security
  poweredByHeader: false,

  // Security and performance headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
