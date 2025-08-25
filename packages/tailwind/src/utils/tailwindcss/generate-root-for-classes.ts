import { parse } from 'postcss';
import { type Config, compile } from 'tailwindcss';
import { resolveAllCSSVariables } from '../css/resolve-all-css-variables';
import indexCss from './tailwind-stylesheets/index';
import preflightCss from './tailwind-stylesheets/preflight';
import themeCss from './tailwind-stylesheets/theme';
import utilitiesCss from './tailwind-stylesheets/utilities';

const baseCss = `@import "tailwindcss";`;

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

      if (id === 'tailwindcss/preflight') {
        return {
          base,
          path: 'tailwindcss/preflight.css',
          content: preflightCss,
        };
      }

      if (id === 'tailwindcss/theme') {
        return {
          base,
          path: 'tailwindcss/theme.css',
          content: themeCss,
        };
      }

      if (id === 'tailwindcss/utilities') {
        return {
          base,
          path: 'tailwindcss/utilities.css',
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
  console.log(root.toString());
  resolveAllCSSVariables(root);
  console.log(root.toString());

  return root;
}
