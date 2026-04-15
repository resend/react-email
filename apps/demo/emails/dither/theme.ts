// eslint-disable-next-line @typescript-eslint/no-require-imports
const plugin = require("tailwindcss/plugin") as (
  cb: (api: {
    addUtilities: (utils: Record<string, Record<string, string>>) => void;
    addVariant: (name: string, definition: string) => void;
  }) => void,
) => unknown;

export const ditherTheme = {
  bg: "#131313",
  bg2: "#212121",
  foreground: "#FFFFFF",
  foreground2: "#C4C4C4",
  foreground3: "#818181",
  foregroundInverted: "#FFFFFF",
  stroke: "#2B2B2B",
  brand: "#614500",
  muted: "#4A4A4A",
  subtleBorder: "#D0D0D0",
  surface: "#FFFFFF",
  ink: "#131313",
} as const;

const fontTokens = {
  11: {
    fontSize: "11px",
    lineHeight: "1.5",
    letterSpacing: "0.3px",
    fontWeight: "300",
  },
  13: {
    fontSize: "13px",
    lineHeight: "1.5",
    letterSpacing: "0.2px",
    fontWeight: "300",
  },
  14: {
    fontSize: "14px",
    lineHeight: "1.5",
    letterSpacing: "0.3px",
    fontWeight: "350",
  },
  15: {
    fontSize: "15px",
    lineHeight: "1.5",
    letterSpacing: "-0.075px",
    fontWeight: "450",
  },
  20: {
    fontSize: "20px",
    lineHeight: "1.1",
    letterSpacing: "0",
    fontWeight: "500",
  },
  24: {
    fontSize: "24px",
    lineHeight: "1.5",
    letterSpacing: "-0.072px",
    fontWeight: "500",
  },
  32: {
    fontSize: "32px",
    lineHeight: "0.9",
    letterSpacing: "0.4px",
    fontWeight: "500",
  },
  40: {
    fontSize: "40px",
    lineHeight: "1",
    letterSpacing: "-1.2px",
    fontWeight: "500",
  },
  56: {
    fontSize: "56px",
    lineHeight: "1",
    letterSpacing: "-1.68px",
    fontWeight: "500",
  },
} as const;

const ditherFontPlugin = plugin(
  ({
    addUtilities,
    addVariant,
  }: {
    addUtilities: (u: Record<string, Record<string, string>>) => void;
    addVariant: (name: string, definition: string) => void;
  }) => {
    addVariant("mobile", "@media (max-width: 600px)");
    const utilities: Record<string, Record<string, string>> = {};
    for (const [step, token] of Object.entries(fontTokens)) {
      utilities[`.font-${step}`] = token;
    }
    addUtilities(utilities);
  },
);

export const ditherTailwindConfig = {
  plugins: [ditherFontPlugin],
  theme: {
    extend: {
      colors: {
        bg: ditherTheme.bg,
        "bg-2": ditherTheme.bg2,
        fg: ditherTheme.foreground,
        "fg-2": ditherTheme.foreground2,
        "fg-3": ditherTheme.foreground3,
        "fg-inverted": ditherTheme.foregroundInverted,
        stroke: ditherTheme.stroke,
        brand: ditherTheme.brand,
        muted: ditherTheme.muted,
        "subtle-border": ditherTheme.subtleBorder,
        surface: ditherTheme.surface,
        ink: ditherTheme.ink,
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        mono: ["'IBM Plex Mono'", "'Courier New'", "monospace"],
        condensed: [
          "'IBM Plex Sans Condensed'",
          "'Arial Narrow'",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
};
