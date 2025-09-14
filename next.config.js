/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Temporarily ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Temporarily ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },

  // ✅ Canonical redirects so locale pages are easy to reach
  async redirects() {
    return [
      // No localized homepage yet → send "/" to EN About
      { source: '/', destination: '/en/about', permanent: false },

      // Convenience: plain /about → English About
      { source: '/about', destination: '/en/about', permanent: false },

      // Locale roots go to their About pages
      { source: '/en', destination: '/en/about', permanent: false },
      { source: '/fr', destination: '/fr/about', permanent: false },
      { source: '/de', destination: '/de/about', permanent: false },
    ];
  },
};

module.exports = nextConfig;
