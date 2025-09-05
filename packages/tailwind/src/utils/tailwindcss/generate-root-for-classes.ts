import { parse } from 'css-tree';
import { type Config, compile } from 'tailwindcss';
import { resolveAllCSSVariables } from '../css/resolve-all-css-variables';
import indexCss from './tailwind-stylesheets/index';
import preflightCss from './tailwind-stylesheets/preflight';
import themeCss from './tailwind-stylesheets/theme';
import utilitiesCss from './tailwind-stylesheets/utilities';

const baseCss = `
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
@config;
`;

export async function generateRootForClasses(
  classes: string[],
  config: Config,
) {
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
  const css = compiler.build(classes);
  const root = parse(css);
  resolveAllCSSVariables(root);

  return root;
}
