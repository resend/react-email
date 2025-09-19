import { type CssNode, parse } from 'css-tree';
import { type Config, compile } from 'tailwindcss';
import { resolveAllCSSVariables } from '../css/resolve-all-css-variables';
import { resolveCalcExpressions } from '../css/resolve-calc-expressions';
import { sanitizeDeclarations } from '../css/sanitize-declarations';
import { sanitizeNonInlinableRules } from '../css/sanitize-non-inlinable-rules';
import indexCss from './tailwind-stylesheets/index';
import preflightCss from './tailwind-stylesheets/preflight';
import themeCss from './tailwind-stylesheets/theme';
import utilitiesCss from './tailwind-stylesheets/utilities';

export type TailwindSetup = Awaited<ReturnType<typeof setupTailwind>>;

export async function setupTailwind(config: Config) {
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

  let addedUtilities: string[] = [];

  let root: CssNode | undefined;

  return {
    /**
     * @description Given a list of Tailwind classes, it generates the corresponding CSS. Also resolves simple `calc` functions, and css variables.
     * The returned CSS also includes the CSS generated from all previous calls to this function, this is internal to Tailwind.
     */
    addUtilities: function addUtilities(
      classes: string[],
      { compatibilityFixes = true } = {},
    ) {
      if (!compatibilityFixes) {
        return parse(compiler.build(classes));
      }

      if (classes.some((className) => !addedUtilities.includes(className))) {
        addedUtilities = [...addedUtilities, ...classes];
        root = parse(compiler.build(classes));
        resolveAllCSSVariables(root);
        resolveCalcExpressions(root);
        sanitizeDeclarations(root);
        sanitizeNonInlinableRules(root);
      }
      return root!;
    },
  };
}
