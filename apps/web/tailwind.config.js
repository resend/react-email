const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('@radix-ui/colors');
const plugin = require('tailwindcss/plugin');

const iOsHeight = plugin(({ addUtilities }) => {
  const supportsTouchRule = '@supports (-webkit-touch-callout: none)';
  const webkitFillAvailable = '-webkit-fill-available';

  const utilities = {
    '.min-h-screen-ios': {
      [supportsTouchRule]: {
        minHeight: webkitFillAvailable,
      },
    },
    '.h-screen-ios': {
      [supportsTouchRule]: {
        height: webkitFillAvailable,
      },
    },
  };

  addUtilities(utilities, ['responsive']);
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          1: colors.amberDarkA.amberA1,
          2: colors.amberDarkA.amberA2,
          3: colors.amberDarkA.amberA3,
          4: colors.amberDarkA.amberA4,
          5: colors.amberDarkA.amberA5,
          6: colors.amberDarkA.amberA6,
          7: colors.amberDarkA.amberA7,
          8: colors.amberDarkA.amberA8,
          9: colors.amberDarkA.amberA9,
          10: colors.amberDarkA.amberA10,
          11: colors.amberDarkA.amberA11,
          12: colors.amberDarkA.amberA12,
        },
        cyan: {
          1: colors.cyanDarkA.cyanA1,
          2: colors.cyanDarkA.cyanA2,
          3: colors.cyanDarkA.cyanA3,
          4: colors.cyanDarkA.cyanA4,
          5: colors.cyanDarkA.cyanA5,
          6: colors.cyanDarkA.cyanA6,
          7: colors.cyanDarkA.cyanA7,
          8: colors.cyanDarkA.cyanA8,
          9: colors.cyanDarkA.cyanA9,
          10: colors.cyanDarkA.cyanA10,
          11: colors.cyanDarkA.cyanA11,
          12: colors.cyanDarkA.cyanA12,
        },
        green: {
          1: colors.greenDarkA.greenA1,
          2: colors.greenDarkA.greenA2,
          3: colors.greenDarkA.greenA3,
          4: colors.greenDarkA.greenA4,
          5: colors.greenDarkA.greenA5,
          6: colors.greenDarkA.greenA6,
          7: colors.greenDarkA.greenA7,
          8: colors.greenDarkA.greenA8,
          9: colors.greenDarkA.greenA9,
          10: colors.greenDarkA.greenA10,
          11: colors.greenDarkA.greenA11,
          12: colors.greenDarkA.greenA12,
        },
        purple: {
          1: colors.purpleDarkA.purpleA1,
          2: colors.purpleDarkA.purpleA2,
          3: colors.purpleDarkA.purpleA3,
          4: colors.purpleDarkA.purpleA4,
          5: colors.purpleDarkA.purpleA5,
          6: colors.purpleDarkA.purpleA6,
          7: colors.purpleDarkA.purpleA7,
          8: colors.purpleDarkA.purpleA8,
          9: colors.purpleDarkA.purpleA9,
          10: colors.purpleDarkA.purpleA10,
          11: colors.purpleDarkA.purpleA11,
          12: colors.purpleDarkA.purpleA12,
        },
        slate: {
          1: colors.slateDarkA.slateA1,
          2: colors.slateDarkA.slateA2,
          3: colors.slateDarkA.slateA3,
          4: colors.slateDarkA.slateA4,
          5: colors.slateDarkA.slateA5,
          6: colors.slateDarkA.slateA6,
          7: colors.slateDarkA.slateA7,
          8: colors.slateDarkA.slateA8,
          9: colors.slateDarkA.slateA9,
          10: colors.slateDarkA.slateA10,
          11: colors.slateDarkA.slateA11,
          12: colors.slateDarkA.slateA12,
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-commit-mono)', ...defaultTheme.fontFamily.mono],
      },
      backgroundImage: {
        gradient:
          'linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)',
        gradientHover:
          'linear-gradient(145.37deg, rgba(255, 255, 255, 0.1) -8.75%, rgba(255, 255, 255, 0.057) 83.95%)',
        shine:
          'linear-gradient(45deg, rgba(255,255,255,0) 45%,rgba(255,255,255,1) 50%,rgba(255,255,255,0) 55%,rgba(255,255,255,0) 100%)',
      },
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '0%' },
          '100%': { backgroundPosition: '110%' },
        },
        shineTranslate: {
          '0%': { transform: 'translate(-198%)' },
          '50%': { transform: 'translate(198%)' },
          '100%': { transform: 'translate(198%)' },
        },
        dash: {
          '0%': { strokeDashoffset: 1000 },
          '100%': { strokeDashoffset: 0 },
        },
      },
    },
  },
  plugins: [iOsHeight],
};
