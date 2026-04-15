// eslint-disable-next-line @typescript-eslint/no-require-imports
const plugin = require('tailwindcss/plugin') as (
  cb: (api: {
    addVariant: (name: string, definition: string) => void;
    addUtilities: (utils: Record<string, Record<string, string>>) => void;
  }) => void,
) => unknown;

export const techTheme = {
  bg: '#DCE1E4',
  bg2: '#FFF',
  bg3: '#F6F6F6',
  bg4: '#F0F0F0',
  foreground: '#332C2C',
  foreground2: '#726A6A',
  foreground3: '#A2A9AA',
  stroke: '#F0F0F0',
  buttonBorder: '#E8E9E9',
  tipBadge: '#5B6E7A',
} as const;

const fontTokens = {
  11: {
    fontSize: '11px',
    lineHeight: '1.5',
    letterSpacing: '-0.11px',
    fontWeight: '400',
  },
  13: {
    fontSize: '13px',
    lineHeight: '1.5',
    letterSpacing: '-0.13px',
    fontWeight: '400',
  },
  14: {
    fontSize: '15px',
    lineHeight: '1.6',
    letterSpacing: '-0.042px',
    fontWeight: '450',
  },
  15: {
    fontSize: '15px',
    lineHeight: '1.6',
    letterSpacing: '-0.042px',
    fontWeight: '500',
  },
  16: {
    fontSize: '16px',
    lineHeight: '1.5',
    letterSpacing: '-0.16px',
    fontWeight: '400',
  },
  18: {
    fontSize: '18px',
    lineHeight: '1.5',
    letterSpacing: '-0.11px',
    fontWeight: '400',
  },
  20: {
    fontSize: '20px',
    lineHeight: '1.5',
    letterSpacing: '-0.1px',
    fontWeight: '400',
  },
  22: {
    fontSize: '22px',
    lineHeight: '1.4',
    letterSpacing: '-0.176px',
    fontWeight: '500',
  },
  24: {
    fontSize: '24px',
    lineHeight: '1.4',
    letterSpacing: '-0.12px',
    fontWeight: '600',
  },
  32: {
    fontSize: '32px',
    lineHeight: '1.2',
    letterSpacing: '-0.64px',
    fontWeight: '500',
  },
  40: {
    fontSize: '40px',
    lineHeight: '1.2',
    letterSpacing: '-0.8px',
    fontWeight: '700',
  },
  48: {
    fontSize: '48px',
    lineHeight: '1.15',
    letterSpacing: '-0.96px',
    fontWeight: '700',
  },
  56: {
    fontSize: '56px',
    lineHeight: '1.2',
    letterSpacing: '-1.2px',
    fontWeight: '700',
  },
} as const;

/** Sizing + rhythm for Tailwind `text-{n}`; pair with `font-{n}` utilities (plugin) for weight. */
const fontSizeThemeFromTokens = Object.fromEntries(
  Object.entries(fontTokens).map(([step, t]) => [
    step,
    [
      t.fontSize,
      { lineHeight: t.lineHeight, letterSpacing: t.letterSpacing },
    ] as [string, { lineHeight: string; letterSpacing: string }],
  ]),
);

export const techTailwindConfig = {
  theme: {
    extend: {
      fontSize: fontSizeThemeFromTokens,
      colors: {
        bg: techTheme.bg,
        'bg-2': techTheme.bg2,
        'bg-3': techTheme.bg3,
        'bg-4': techTheme.bg4,
        fg: techTheme.foreground,
        'fg-2': techTheme.foreground2,
        'fg-3': techTheme.foreground3,
        stroke: techTheme.stroke,
        'button-border': techTheme.buttonBorder,
        'tip-badge': techTheme.tipBadge,
      },
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
  plugins: [
    plugin(
      ({
        addVariant,
        addUtilities,
      }: {
        addVariant: (name: string, definition: string) => void;
        addUtilities: (u: Record<string, Record<string, string>>) => void;
      }) => {
        addVariant('mobile', '@media (max-width: 600px)');
        const numericFontUtilities = Object.fromEntries(
          Object.entries(fontTokens).map(([step, token]) => [
            `.font-${step}`,
            token,
          ]),
        );
        addUtilities(numericFontUtilities);
      },
    ),
  ],
};
