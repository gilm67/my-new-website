/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async rewrites() {
    // 👇 legacy host = your old/live project
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
