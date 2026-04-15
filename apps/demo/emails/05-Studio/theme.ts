import type { TailwindConfig } from 'react-email';
import plugin from 'tailwindcss/plugin';

const colors = {
  bg: '#DCE1E4',
  'bg-2': '#FFF',
  'bg-3': '#F6F6F6',
  'bg-4': '#F0F0F0',
  fg: '#332C2C',
  'fg-2': '#726A6A',
  'fg-3': '#A2A9AA',
  stroke: '#F0F0F0',
  'button-border': '#E8E9E9',
  'tip-badge': '#5B6E7A',
} as const;

const fontScale = {
  11: { fontSize: '11px', lineHeight: '1.5', letterSpacing: '-0.11px' },
  13: { fontSize: '13px', lineHeight: '1.5', letterSpacing: '-0.13px' },
  14: { fontSize: '14px', lineHeight: '1.6', letterSpacing: '-0.042px', fontWeight: '450' },
  15: { fontSize: '15px', lineHeight: '1.6', letterSpacing: '-0.042px', fontWeight: '500' },
  16: { fontSize: '16px', lineHeight: '1.5', letterSpacing: '-0.16px' },
  18: { fontSize: '18px', lineHeight: '1.5', letterSpacing: '-0.11px' },
  20: { fontSize: '20px', lineHeight: '1.5', letterSpacing: '-0.1px' },
  22: { fontSize: '22px', lineHeight: '1.4', letterSpacing: '-0.176px', fontWeight: '500' },
  24: { fontSize: '24px', lineHeight: '1.4', letterSpacing: '-0.12px', fontWeight: '600' },
  32: { fontSize: '32px', lineHeight: '1.2', letterSpacing: '-0.64px', fontWeight: '500' },
  40: { fontSize: '40px', lineHeight: '1.2', letterSpacing: '-0.8px', fontWeight: '700' },
  48: { fontSize: '48px', lineHeight: '1.15', letterSpacing: '-0.96px', fontWeight: '700' },
  56: { fontSize: '56px', lineHeight: '1.2', letterSpacing: '-1.2px', fontWeight: '700' },
} as const;

const fontSizeTheme = Object.fromEntries(
  Object.entries(fontScale).map(([step, t]) => [
    step,
    [
      t.fontSize,
      { lineHeight: t.lineHeight, letterSpacing: t.letterSpacing },
    ] as [string, { lineHeight: string; letterSpacing: string }],
  ]),
);

export const techTailwindConfig: TailwindConfig = {
  plugins: [
    plugin(({ addVariant, addUtilities }) => {
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
      fontSize: fontSizeTheme,
      colors,
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        geist: ['Geist', 'Inter', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        button:
          '0px 7px 2px 0px rgba(22,29,29,0),0px 5px 2px 0px rgba(22,29,29,0.01),0px 3px 2px 0px rgba(22,29,29,0.05),0px 1px 1px 0px rgba(22,29,29,0.09),0px 0px 1px 0px rgba(22,29,29,0.1)',
      },
    },
  },
};
