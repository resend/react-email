export const root = [
  {
    title: 'next-env.d.ts',
    content:
      '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n// NOTE: This file should not be edited\n// see https://nextjs.org/docs/basic-features/typescript for more information.\n',
  },
  {
    title: 'package.json',
    content:
      '{\n  "name": "react-email-preview",\n  "version": "0.0.4",\n  "description": "The React Email preview application",\n  "license": "MIT",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start",\n    "lint": "next lint",\n    "format:check": "prettier --check \\"**/*.{ts,tsx,md}\\"",\n    "format": "prettier --write \\"**/*.{ts,tsx,md}\\""\n  },\n  "dependencies": {\n    "@next/font": "13.0.4",\n    "@radix-ui/colors": "0.1.8",\n    "@radix-ui/react-collapsible": "1.0.1",\n    "@radix-ui/react-slot": "1.0.1",\n    "@radix-ui/react-toggle-group": "1.0.1",\n    "@react-email/render": "0.0.2",\n    "classnames": "2.3.2",\n    "next": "13.0.4",\n    "prism-react-renderer": "1.3.5",\n    "react": "18.2.0",\n    "react-dom": "18.2.0"\n  },\n  "devDependencies": {\n    "@types/classnames": "2.3.1",\n    "@types/node": "18.11.9",\n    "@types/react": "18.0.25",\n    "@types/react-dom": "18.0.9",\n    "autoprefixer": "10.4.13",\n    "postcss": "8.4.19",\n    "tailwindcss": "3.2.4",\n    "typescript": "4.9.3"\n  }\n}\n',
  },
  {
    title: 'postcss.config.js',
    content:
      'module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n',
  },
  {
    title: 'tailwind.config.js',
    content:
      "const colors = require('@radix-ui/colors');\nconst { fontFamily } = require('tailwindcss/defaultTheme');\nconst plugin = require('tailwindcss/plugin');\n\nconst iOsHeight = plugin(function ({ addUtilities }) {\n  const supportsTouchRule = '@supports (-webkit-touch-callout: none)';\n  const webkitFillAvailable = '-webkit-fill-available';\n\n  const utilities = {\n    '.min-h-screen-ios': {\n      [supportsTouchRule]: {\n        minHeight: webkitFillAvailable,\n      },\n    },\n    '.h-screen-ios': {\n      [supportsTouchRule]: {\n        height: webkitFillAvailable,\n      },\n    },\n  };\n\n  addUtilities(utilities, ['responsive']);\n});\n\n/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: [\n    // app content\n    `src/**/*.{js,ts,jsx,tsx}`,\n    // include packages if not transpiling\n    '../../packages/**/*.{js,ts,jsx,tsx}',\n    '../../apps/**/*.{js,ts,jsx,tsx}',\n  ],\n  theme: {\n    extend: {\n      backgroundImage: {\n        gradient:\n          'linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)',\n        gradientHover:\n          'linear-gradient(145.37deg, rgba(255, 255, 255, 0.1) -8.75%, rgba(255, 255, 255, 0.057) 83.95%)',\n        shine:\n          'linear-gradient(45deg, rgba(255,255,255,0) 45%,rgba(255,255,255,1) 50%,rgba(255,255,255,0) 55%,rgba(255,255,255,0) 100%)',\n      },\n      colors: {\n        cyan: {\n          1: colors.cyanDarkA.cyanA1,\n          2: colors.cyanDarkA.cyanA2,\n          3: colors.cyanDarkA.cyanA3,\n          4: colors.cyanDarkA.cyanA4,\n          5: colors.cyanDarkA.cyanA5,\n          6: colors.cyanDarkA.cyanA6,\n          7: colors.cyanDarkA.cyanA7,\n          8: colors.cyanDarkA.cyanA8,\n          9: colors.cyanDarkA.cyanA9,\n          10: colors.cyanDarkA.cyanA10,\n          11: colors.cyanDarkA.cyanA11,\n          12: colors.cyanDarkA.cyanA12,\n        },\n        slate: {\n          1: colors.slateDarkA.slateA1,\n          2: colors.slateDarkA.slateA2,\n          3: colors.slateDarkA.slateA3,\n          4: colors.slateDarkA.slateA4,\n          5: colors.slateDarkA.slateA5,\n          6: colors.slateDarkA.slateA6,\n          7: colors.slateDarkA.slateA7,\n          8: colors.slateDarkA.slateA8,\n          9: colors.slateDarkA.slateA9,\n          10: colors.slateDarkA.slateA10,\n          11: colors.slateDarkA.slateA11,\n          12: colors.slateDarkA.slateA12,\n        },\n      },\n      fontFamily: {\n        sans: ['var(--font-inter)', ...fontFamily.sans],\n      },\n      keyframes: {\n        shine: {\n          '0%': { backgroundPosition: '-100%' },\n          '100%': { backgroundPosition: '100%' },\n        },\n        dash: {\n          '0%': { strokeDashoffset: 1000 },\n          '100%': { strokeDashoffset: 0 },\n        },\n      },\n    },\n  },\n  plugins: [iOsHeight],\n};\n",
  },
  {
    title: 'tsconfig.json',
    content:
      '{\n  "compilerOptions": {\n    "target": "es5",\n    "lib": ["dom", "dom.iterable", "esnext"],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "strict": false,\n    "forceConsistentCasingInFileNames": true,\n    "noEmit": true,\n    "incremental": true,\n    "esModuleInterop": true,\n    "module": "esnext",\n    "moduleResolution": "node",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "jsx": "preserve",\n    "plugins": [\n      {\n        "name": "next"\n      }\n    ]\n  },\n  "include": [\n    "preview/next-env.d.ts",\n    "preview/.next/types/**/*.ts",\n    "**/*.ts",\n    "**/*.tsx",\n    ".next/types/**/*.ts"\n  ],\n  "exclude": ["node_modules"]\n}\n',
  },
];
