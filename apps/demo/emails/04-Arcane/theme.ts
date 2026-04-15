import type { TailwindConfig } from 'react-email';
import plugin from 'tailwindcss/plugin';

const colors = {
  bg: '#300610',
  'bg-2': '#431D26',
  'bg-3': '#F9F9ED',
  fg: '#FCF3ED',
  'fg-2': '#EFE1D8',
  'fg-3': '#B09996',
  'fg-inverted': '#300610',
  stroke: '#3D151D',
  brand: '#614500',
} as const;

const fontScale = {
  11: { fontSize: '11px', lineHeight: '1.5', letterSpacing: '0.3px' },
  13: { fontSize: '13px', lineHeight: '1.5', letterSpacing: '0.2px' },
  15: { fontSize: '15px', lineHeight: '1.5', letterSpacing: '0.25px' },
  16: { fontSize: '16px', lineHeight: '1.5', letterSpacing: '0.168px', fontWeight: '500' },
  18: { fontSize: '18px', lineHeight: '1.5', letterSpacing: '0.056px' },
  20: { fontSize: '20px', lineHeight: '1.5', letterSpacing: '0.1px' },
  22: { fontSize: '22px', lineHeight: '1.5', letterSpacing: '-0.176px', fontWeight: '500' },
  24: { fontSize: '24px', lineHeight: '1.4', letterSpacing: '0.008px', fontWeight: '500' },
  32: { fontSize: '32px', lineHeight: '1.4', letterSpacing: '0.008px', fontWeight: '500' },
  40: { fontSize: '40px', lineHeight: '1', letterSpacing: '-0.2px' },
  48: { fontSize: '48px', lineHeight: '1.2', letterSpacing: '-0.28px' },
  56: { fontSize: '56px', lineHeight: '1', letterSpacing: '-0.36px' },
  64: { fontSize: '64px', lineHeight: '1', letterSpacing: '-0.56px' },
  72: { fontSize: '72px', lineHeight: '1', letterSpacing: '-0.52px' },
} as const;

export const skinTailwindConfig: TailwindConfig = {
  plugins: [
    plugin(({ addUtilities, addVariant }) => {
      addVariant('mobile', '@media (max-width: 600px)');
      const utilities: Record<string, Record<string, string>> = {};
      for (const [step, token] of Object.entries(fontScale)) {
        utilities[`.font-${step}`] = token;
      }
      addUtilities(utilities);
    }),
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        serif: ["'Instrument Serif'", 'Georgia', "'Times New Roman'", 'serif'],
      },
    },
  },
};
