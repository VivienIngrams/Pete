/** @type {import('next').NextConfig} */

const config = {
 images: {
       formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
    ],
  },

  // Enable compression
  compress: true,
  // Optimize production builds
  swcMinify: true,
  // Add experimental features for better performance
  experimental: {
  
    optimizePackageImports: ['lucide-react'],
  },
}

export default config
