/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // 👇 Add redirects for locale root paths
  async redirects() {
    return [
      { source: '/en', destination: '/en/about', permanent: true },
      { source: '/fr', destination: '/fr/about', permanent: true },
      { source: '/de', destination: '/de/about', permanent: true },
    ];
  },

  // 👇 Legacy rewrites
  async rewrites() {
    const LEGACY = 'https://executive-partners-app-mqu8.vercel.app';
    return [
      { source: '/',             destination: `${LEGACY}/` },
      { source: '/jobs',         destination: `${LEGACY}/jobs` },
      { source: '/candidates',   destination: `${LEGACY}/candidates` },
      { source: '/contact',      destination: `${LEGACY}/contact` },
      { source: '/bp-simulator', destination: `${LEGACY}/bp-simulator` },
    ];
  },
};

module.exports = nextConfig;
