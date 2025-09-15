/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async redirects() {
    return [
      // optional helper: /en → /en/about
      { source: '/en', destination: '/en/about', permanent: false },

      // fix capitalized legacy links
      { source: '/en/markets/Geneva', destination: '/markets/geneva', permanent: true },
      { source: '/en/markets/Zurich', destination: '/markets/zurich', permanent: true },
    ];
  },

  async rewrites() {
    const LEGACY = 'https://www.execpartners.ch';
    const STREAMLIT = 'https://ep-bp-simulator.streamlit.app';

    return [
      // DO NOT rewrite "/" — we want the splash to render there

      // keep these pages identical to the live site
      { source: '/jobs',        destination: `${LEGACY}/jobs` },
      { source: '/candidates',  destination: `${LEGACY}/candidates` },
      { source: '/contact',     destination: `${LEGACY}/contact` },

      // Streamlit app
      { source: '/bp-simulator',         destination: `${STREAMLIT}/` },
      { source: '/bp-simulator/:path*',  destination: `${STREAMLIT}/:path*` },
    ];
  },
};

module.exports = nextConfig;
