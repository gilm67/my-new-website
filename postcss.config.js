/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ Tailwind 4.x uses this
    autoprefixer: {},
  },
};