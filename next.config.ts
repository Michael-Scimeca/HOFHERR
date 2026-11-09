import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Auto-convert uploads to WebP/AVIF and serve at the right size per device
    formats: ['image/avif', 'image/webp'],

    // Quality 80 is the sweet spot — visually lossless, ~40% smaller than JPEG
    qualities: [80],

    // Breakpoints to generate responsive srcsets for
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],

    // Allow images from these external domains (add more as needed)
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.hofherrmeatco.com' },
    ],

    // Cache optimized images for 24h on the CDN
    minimumCacheTTL: 86400,

    // Disable the built-in loader for external images if using Cloudinary
    // loader: 'cloudinary', // uncomment if moving to Cloudinary later
  },

  // Keep server functions small (Netlify rejects huge uploads). Routes that read files with
  // path.join(process.cwd(), …) make Next trace whole folders — public/ alone is ~370MB.
  // public/ is served from the CDN anyway, so exclude it and add back only what the social
  // image renderer reads from disk.
  outputFileTracingExcludes: {
    '*': ['public/**/*', 'design-originals/**/*', '.git/**/*', '**/*.mp4', '**/*.mov', '**/*.glb', '**/*.gltf'],
  },
  outputFileTracingIncludes: {
    '/api/social/**': ['public/assets/*.{jpg,png,svg}', 'src/lib/social/fonts/**/*', 'node_modules/dictionary-en/index.{aff,dic}'],
    '/admin/social/**': ['public/assets/*.{jpg,png,svg}', 'src/lib/social/fonts/**/*', 'node_modules/dictionary-en/index.{aff,dic}'],
  },

  // Compress all static assets
  compress: true,

  // Enable React strict mode
  reactStrictMode: true,

  // Hide the Next.js dev indicator
  devIndicators: false,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
