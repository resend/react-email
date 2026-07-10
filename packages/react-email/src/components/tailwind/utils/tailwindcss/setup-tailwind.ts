import { parse, type StyleSheet } from 'css-tree';
import { compile } from 'tailwindcss';
import type { TailwindConfig } from '../../tailwind.js';
import indexCss from './tailwind-stylesheets/index.js';
import preflightCss from './tailwind-stylesheets/preflight.js';
import themeCss from './tailwind-stylesheets/theme.js';
import utilitiesCss from './tailwind-stylesheets/utilities.js';

export type TailwindSetup = Awaited<ReturnType<typeof setupTailwind>>;

interface CSSConfigs {
  theme?: string;
  utility?: string;
}

interface SetupTailwindProps {
  config?: TailwindConfig;
  cssConfigs?: CSSConfigs;
}

const SETUP_TAILWIND_KEYS = new Set(['config', 'cssConfigs']);

export async function setupTailwind(props: SetupTailwindProps = {}) {
  const stray = Object.keys(props).filter((k) => !SETUP_TAILWIND_KEYS.has(k));
  if (stray.length > 0) {
    throw new Error(
      `setupTailwind now takes { config, cssConfigs } — received unexpected keys: ${stray.join(', ')}. ` +
        'If you used to call setupTailwind(config), wrap it: setupTailwind({ config }).',
    );
  }
  const { config, cssConfigs } = props;
  const baseCss = `
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
${cssConfigs?.theme ? '@import "custom-theme.css" layer(theme);' : ''}
${cssConfigs?.utility ? '@import "custom-utilities.css" layer(utilities);' : ''}
@config;
`;

  const compiler = await compile(baseCss, {
    async loadModule(id, base, resourceHint) {
      if (resourceHint === 'config') {
        return {
          path: id,
          base: base,
          module: config ?? {},
        };
      }

      throw new Error(
        `NO-OP: should we implement support for ${resourceHint}?`,
      );
    },
    polyfills: 0, // All
    async loadStylesheet(id, base) {
      if (id === 'tailwindcss') {
        return {
          base,
          path: 'tailwindcss/index.css',
          content: indexCss,
        };
      }

      if (id === 'tailwindcss/preflight.css') {
        return {
          base,
          path: id,
          content: preflightCss,
        };
      }

      if (id === 'tailwindcss/theme.css') {
        return {
          base,
          path: id,
          content: themeCss,
        };
      }

      if (id === 'tailwindcss/utilities.css') {
        return {
          base,
          path: id,
          content: utilitiesCss,
        };
      }

      if (id === 'custom-theme.css') {
        return {
          base,
          path: id,
          content: cssConfigs?.theme ?? '',
        };
      }

      if (id === 'custom-utilities.css') {
        return {
          base,
          path: id,
          content: cssConfigs?.utility ?? '',
        };
      }

      throw new Error(
        'stylesheet not supported, you can only import the ones from tailwindcss',
      );
    },
  });

  let css: string = baseCss;

  return {
    addUtilities: function addUtilities(candidates: string[]): void {
      css = compiler.build(candidates);
    },
    getStyleSheet: function getCss() {
      return parse(css) as StyleSheet;
    },
  };
}
