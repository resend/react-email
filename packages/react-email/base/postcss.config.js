// If you want to use other PostCSS plugins, see the following:
// https://tailwindcss.com/docs/using-with-preprocessors

const config = require('tailwind-config/tailwind.config.js');
config.theme.extend.colors.cyan = {
  1: '#61dafb',
};
config.theme.extend.fontFamily = {
  sans: ['Biotif', 'sans-serif'],
  mono: ['Fira Code', 'monospace'],
};

module.exports = {
  plugins: {
    // Specifying the config is not necessary in most cases, but it is included
    // here to share the same config across the entire monorepo
    tailwindcss: { config },
    autoprefixer: {},
  },
};
