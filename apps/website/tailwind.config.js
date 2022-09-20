const colors = require('@radix-ui/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          1: colors.mauveDark.mauve1,
          2: colors.mauveDark.mauve2,
          3: colors.mauveDark.mauve3,
          4: colors.mauveDark.mauve4,
          5: colors.mauveDark.mauve5,
          6: colors.mauveDark.mauve6,
          7: colors.mauveDark.mauve7,
          8: colors.mauveDark.mauve8,
          9: colors.mauveDark.mauve9,
          10: colors.mauveDark.mauve10,
          11: colors.mauveDark.mauve11,
          12: colors.mauveDark.mauve12,
        },
        green: {
          1: colors.greenDark.green1,
          2: colors.greenDark.green2,
          3: colors.greenDark.green3,
          4: colors.greenDark.green4,
          5: colors.greenDark.green5,
          6: colors.greenDark.green6,
          7: colors.greenDark.green7,
          8: colors.greenDark.green8,
          9: colors.greenDark.green9,
          10: colors.greenDark.green10,
          11: colors.greenDark.green11,
          12: colors.greenDark.green12,
        },
        red: {
          1: colors.redDark.red1,
          2: colors.redDark.red2,
          3: colors.redDark.red3,
          4: colors.redDark.red4,
          5: colors.redDark.red5,
          6: colors.redDark.red6,
          7: colors.redDark.red7,
          8: colors.redDark.red8,
          9: colors.redDark.red9,
          10: colors.redDark.red10,
          11: colors.redDark.red11,
          12: colors.redDark.red12,
        },
        yellow: {
          1: colors.amberDark.amber1,
          2: colors.amberDark.amber2,
          3: colors.amberDark.amber3,
          4: colors.amberDark.amber4,
          5: colors.amberDark.amber5,
          6: colors.amberDark.amber6,
          7: colors.amberDark.amber7,
          8: colors.amberDark.amber8,
          9: colors.amberDark.amber9,
          10: colors.amberDark.amber10,
          11: colors.amberDark.amber11,
          12: colors.amberDark.amber12,
        },
        cyan: {
          1: '#61dafb' // Original React.js color
        }
      },
      fontFamily: {
        sans: ['Biotif', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
};