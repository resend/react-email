import { type CssNode, parse } from 'css-tree';
import { compile } from 'tailwindcss';
import type { TailwindConfig } from '../../tailwind';
import indexCss from './tailwind-stylesheets/index';
import preflightCss from './tailwind-stylesheets/preflight';
import themeCss from './tailwind-stylesheets/theme';
import utilitiesCss from './tailwind-stylesheets/utilities';

export type TailwindSetup = Awaited<ReturnType<typeof setupTailwind>>;

export async function setupTailwind(config: TailwindConfig) {
  const baseCss = `
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
@config;
`;
  const compiler = await compile(baseCss, {
    async loadModule(id, base, resourceHint) {
      if (resourceHint === 'config') {
        return {
          path: id,
          base: base,
          module: config,
        };
      }

      throw new Error(
        `NO-OP: should we implement support for ${resourceHint}?`,
      );
    },
    polyfills: 3, // All
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

      throw new Error(
        'stylesheet not supported, you can only import tailwindcss',
      );
    },
  });

  let css: string = baseCss;

  return {
    addUtilities: function addUtilities(candidates: string[]): void {
      css = compiler.build(candidates);
    },
    getStyleSheet: function getCss(): CssNode {
      return parse(css);
    },
  };
}
