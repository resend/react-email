import type { TailwindConfig } from 'react-email';
import plugin from 'tailwindcss/plugin';

export const collageTheme = {
  canvas: '#FBFCFB',
  bg: '#FFFFFF',
  bg2: '#FBFCFB',
  foreground: '#103B05',
  foreground2: '#194A07',
  foreground3: '#869C7F',
  foregroundInverted: '#FBFFF9',
  stroke: '#D8E1D4',
  brand: '#103B05',
  shadow:
    '0px 76px 21px 0px rgba(193,195,193,0), 0px 49px 19px 0px rgba(193,195,193,0.01), 0px 27px 16px 0px rgba(193,195,193,0.05), 0px 12px 12px 0px rgba(193,195,193,0.09), 0px 3px 7px 0px rgba(193,195,193,0.1)',
} as const;

const fontTokens = {
  11: {
    fontSize: '11px',
    lineHeight: '1.5',
    letterSpacing: '-0.033px',
    fontWeight: '300',
  },
  13: {
    fontSize: '13px',
    lineHeight: '1.5',
    letterSpacing: '-0.039px',
    fontWeight: '300',
  },
  14: {
    fontSize: '14px',
    lineHeight: '1.5',
    letterSpacing: '0',
    fontWeight: '400',
  },
  15: {
    fontSize: '15px',
    lineHeight: '1.5',
    letterSpacing: '-0.075px',
    fontWeight: '500',
  },
  20: {
    fontSize: '20px',
    lineHeight: '1.2',
    letterSpacing: '-0.2px',
    fontWeight: '400',
  },
  32: {
    fontSize: '32px',
    lineHeight: '1.2',
    letterSpacing: '-0.6px',
    fontWeight: '400',
  },
  48: {
    fontSize: '48px',
    lineHeight: '1',
    letterSpacing: '-1.44px',
    fontWeight: '400',
  },
  58: {
    fontSize: '58px',
    lineHeight: '1',
    letterSpacing: '-1.74px',
    fontWeight: '400',
  },
  88: {
    fontSize: '88px',
    lineHeight: '1',
    letterSpacing: '-2.64px',
    fontWeight: '400',
  },
} as const;

const collageFontPlugin = plugin(({ addUtilities, addVariant }) => {
  addVariant('mobile', '@media (max-width: 600px)');
  const utilities: Record<string, Record<string, string>> = {};
  for (const [step, token] of Object.entries(fontTokens)) {
    utilities[`.font-${step}`] = token;
  }
  addUtilities(utilities);
});

export const collageTailwindConfig: TailwindConfig = {
  plugins: [collageFontPlugin],
  theme: {
    extend: {
      colors: {
        canvas: collageTheme.canvas,
        bg: collageTheme.bg,
        'bg-2': collageTheme.bg2,
        fg: collageTheme.foreground,
        'fg-2': collageTheme.foreground2,
        'fg-3': collageTheme.foreground3,
        'fg-inverted': collageTheme.foregroundInverted,
        stroke: collageTheme.stroke,
        brand: collageTheme.brand,
      },
      boxShadow: {
        'collage-card': collageTheme.shadow,
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        inter: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
};
