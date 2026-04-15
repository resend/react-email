import type { TailwindConfig } from 'react-email';
import plugin from 'tailwindcss/plugin';

export const skinTheme = {
  bg: '#300610',
  bg2: '#431D26',
  bg3: '#F9F9ED',
  foreground: '#FCF3ED',
  foreground2: '#EFE1D8',
  foreground3: '#B09996',
  foregroundInverted: '#300610',
  stroke: '#3D151D',
  brand: '#614500',
} as const;

const fontTokens = {
  11: {
    fontSize: '11px',
    lineHeight: '1.5',
    letterSpacing: '0.3px',
    fontWeight: '400',
  },
  13: {
    fontSize: '13px',
    lineHeight: '1.5',
    letterSpacing: '0.2px',
    fontWeight: '400',
  },
  15: {
    fontSize: '15px',
    lineHeight: '1.5',
    letterSpacing: '0.25px',
    fontWeight: '400',
  },
  16: {
    fontSize: '16px',
    lineHeight: '1.5',
    letterSpacing: '0.168px',
    fontWeight: '500',
  },
  18: {
    fontSize: '18px',
    lineHeight: '1.5',
    letterSpacing: '0.056px',
    fontWeight: '400',
  },
  20: {
    fontSize: '20px',
    lineHeight: '1.5',
    letterSpacing: '0.1px',
    fontWeight: '400',
  },
  22: {
    fontSize: '22px',
    lineHeight: '1.5',
    letterSpacing: '-0.176px',
    fontWeight: '500',
  },
  24: {
    fontSize: '24px',
    lineHeight: '1.4',
    letterSpacing: '0.008px',
    fontWeight: '500',
  },
  32: {
    fontSize: '32px',
    lineHeight: '1.4',
    letterSpacing: '0.008px',
    fontWeight: '500',
  },
  40: {
    fontSize: '40px',
    lineHeight: '1',
    letterSpacing: '-0.2px',
    fontWeight: '400',
  },
  48: {
    fontSize: '48px',
    lineHeight: '1.2',
    letterSpacing: '-0.28px',
    fontWeight: '400',
  },
  56: {
    fontSize: '56px',
    lineHeight: '1',
    letterSpacing: '-0.36px',
    fontWeight: '400',
  },
  64: {
    fontSize: '64px',
    lineHeight: '1',
    letterSpacing: '-0.56px',
    fontWeight: '400',
  },
  72: {
    fontSize: '72px',
    lineHeight: '1',
    letterSpacing: '-0.52px',
    fontWeight: '400',
  },
} as const;

export const skinTailwindConfig: TailwindConfig = {
  theme: {
    extend: {
      colors: {
        bg: skinTheme.bg,
        'bg-2': skinTheme.bg2,
        'bg-3': skinTheme.bg3,
        fg: skinTheme.foreground,
        'fg-2': skinTheme.foreground2,
        'fg-3': skinTheme.foreground3,
        'fg-inverted': skinTheme.foregroundInverted,
        stroke: skinTheme.stroke,
        brand: skinTheme.brand,
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        serif: ["'Instrument Serif'", 'Georgia', "'Times New Roman'", 'serif'],
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, addVariant }) => {
      addVariant('mobile', '@media (max-width: 600px)');
      const numericFontUtilities = Object.fromEntries(
        Object.entries(fontTokens).map(([step, token]) => [
          `.font-${step}`,
          token,
        ]),
      );

      addUtilities(numericFontUtilities);
    }),
  ],
};
