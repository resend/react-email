// eslint-disable-next-line @typescript-eslint/no-require-imports
const plugin = require('tailwindcss/plugin') as (
  cb: (api: {
    addUtilities: (utils: Record<string, Record<string, string>>) => void;
  }) => void,
) => unknown;

export const barebonesBoxedTheme = {
  bg: '#FFFFFF',
  bg2: '#F3F4F6',
  foreground: '#14171E',
  foreground2: '#43454B',
  foreground3: '#7B7D81',
  foregroundInverted: '#FFFFFF',
  stroke: '#F0F0F0',
  strokeStrong: '#E4E4E7',
  brand: '#614500',
} as const;

const fontTokens = {
  11: {
    fontSize: '11px',
    fontWeight: '420',
    letterSpacing: '-0.033px',
    lineHeight: '150%',
  },
  13: {
    fontSize: '13px',
    fontWeight: '420',
    letterSpacing: '-0.039px',
    lineHeight: '150%',
  },
  14: {
    fontSize: '14px',
    fontWeight: '450',
    letterSpacing: '0px',
    lineHeight: '150%',
  },
  16: {
    fontSize: '16px',
    fontWeight: '420',
    letterSpacing: '-0.048px',
    lineHeight: '150%',
  },
  24: {
    fontSize: '24px',
    fontWeight: '600',
    letterSpacing: '-0.084px',
    lineHeight: '100%',
  },
  28: {
    fontSize: '28px',
    fontWeight: '600',
    letterSpacing: '-0.084px',
    lineHeight: '130%',
  },
  32: {
    fontSize: '32px',
    fontWeight: '600',
    letterSpacing: '-0.64px',
    lineHeight: '125%',
  },
  40: {
    fontSize: '40px',
    fontWeight: '600',
    letterSpacing: '-0.8px',
    lineHeight: '110%',
  },
} as const;

const barebonesFontPlugin = plugin((({
  addUtilities,
  addVariant,
}: {
  addUtilities: (u: Record<string, Record<string, string>>) => void;
  addVariant: (name: string, definition: string) => void;
}) => {
  addVariant('mobile', '@media (max-width: 600px)');
  const utilities: Record<string, Record<string, string>> = {};
  for (const [step, token] of Object.entries(fontTokens)) {
    utilities[`.font-${step}`] = token;
  }
  addUtilities(utilities);
}) as (api: {
  addUtilities: (utils: Record<string, Record<string, string>>) => void;
}) => void);

export const barebonesBoxedTailwindConfig = {
  plugins: [barebonesFontPlugin],
  theme: {
    extend: {
      colors: {
        bg: barebonesBoxedTheme.bg,
        'bg-2': barebonesBoxedTheme.bg2,
        fg: barebonesBoxedTheme.foreground,
        'fg-2': barebonesBoxedTheme.foreground2,
        'fg-3': barebonesBoxedTheme.foreground3,
        'fg-inverted': barebonesBoxedTheme.foregroundInverted,
        stroke: barebonesBoxedTheme.stroke,
        'stroke-strong': barebonesBoxedTheme.strokeStrong,
        brand: barebonesBoxedTheme.brand,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
      },
      fontWeight: {
        body: fontTokens[16].fontWeight,
      },
    },
  },
};
