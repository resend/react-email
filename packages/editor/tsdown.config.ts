import { readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import type { TsdownPlugin } from 'tsdown';
import { defineConfig } from 'tsdown';

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
  name: string;
  exports: Record<string, unknown>;
};

/**
 * Keeps CSS imports out of the JS bundle and rewrites them to the package's
 * public CSS entry points (e.g. `../ui/themes/default.css` becomes
 * `@react-email/editor/themes/default.css`).
 *
 * The CSS files themselves are copied to `dist/` by `scripts/copy-css.ts`, so
 * consumers' bundlers load the stylesheet through the `exports` map, and the
 * import statement survives in both the ESM and CJS outputs.
 */
function externalizeCssImports(): TsdownPlugin {
  const cssExports = new Map<string, string>();
  for (const [subpath, target] of Object.entries(pkg.exports)) {
    if (typeof target === 'string' && target.endsWith('.css')) {
      cssExports.set(
        target.replace(/^\.\/dist\//, ''),
        `${pkg.name}${subpath.slice(1)}`,
      );
    }
  }

  return {
    name: 'externalize-css-imports',
    resolveId(source, importer) {
      if (!source.endsWith('.css') || !importer) return null;

      const file = relative(resolve('src'), resolve(dirname(importer), source));
      const specifier = cssExports.get(file.split('\\').join('/'));
      if (!specifier) {
        throw new Error(
          `"${source}" (imported by ${relative(process.cwd(), importer)}) is not exposed in package.json "exports"; add a CSS export for it or drop the import.`,
        );
      }

      // Side-effect-only import: tell Rolldown it must be kept even though
      // nothing is bound from it.
      return { id: specifier, external: true, moduleSideEffects: true };
    },
  };
}

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'core/index': 'src/core/index.ts',
    'extensions/index': 'src/extensions/index.ts',
    'plugins/index': 'src/plugins/index.ts',
    'ui/index': 'src/ui/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  deps: {
    neverBundle: ['react', 'react-dom'],
  },
  plugins: [externalizeCssImports()],
  onSuccess: 'pnpm build:css',
});
