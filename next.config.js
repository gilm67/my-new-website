/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async redirects() {
    return [
      // Optional helper: /en → /en/about (NOT the root!)
      { source: '/en', destination: '/en/about', permanent: false },

      // Fix capitalized market slugs from old links
      { source: '/en/markets/Geneva', destination: '/markets/geneva', permanent: true },
      { source: '/en/markets/Zurich', destination: '/markets/zurich', permanent: true },
    ];
  },

  async rewrites() {
    const LEGACY = 'https://www.execpartners.ch';
    const STREAMLIT = 'https://ep-bp-simulator.streamlit.app';

    return [
      // IMPORTANT: no rewrite for '/'

      // Keep these proxied to live site
      { source: '/jobs',        destination: `${LEGACY}/jobs` },
      { source: '/candidates',  destination: `${LEGACY}/candidates` },
      { source: '/contact',     destination: `${LEGACY}/contact` },

      // Streamlit app passthrough
      { source: '/bp-simulator',        destination: `${STREAMLIT}/` },
      { source: '/bp-simulator/stream', destination: `${STREAMLIT}/stream` },
    ];
  },
};

module.exports = nextConfig;
