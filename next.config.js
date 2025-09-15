/** @type {import('next').NextConfig} */
const nextConfig = {
  // keep these relaxed while iterating
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async redirects() {
    return [
      // locale helper (optional: send /en to About)
      { source: '/en', destination: '/en/about', permanent: false },

      // fix specific “capitalized” market slugs coming from old links
      { source: '/en/markets/Geneva', destination: '/markets/geneva', permanent: true },
      { source: '/en/markets/Zurich', destination: '/markets/zurich', permanent: true },
    ];
  },

  async rewrites() {
    // Proxy legacy pages to your live site so content stays identical
    const LEGACY = 'https://www.execpartners.ch';
    const STREAMLIT = 'https://ep-bp-simulator.streamlit.app';

    return [
      // ❌ removed the "/" rewrite so splash can load from app/page.tsx

      // legacy sections you want to keep identical
      { source: '/jobs',        destination: `${LEGACY}/jobs` },
      { source: '/candidates',  destination: `${LEGACY}/candidates` },
      { source: '/contact',     destination: `${LEGACY}/contact` },

      // Business Plan Simulator hosted on Streamlit
      { source: '/bp-simulator',         destination: `${STREAMLIT}/` },
      { source: '/bp-simulator/stream',  destination: `${STREAMLIT}/stream` },
    ];
  },
};

module.exports = nextConfig;
