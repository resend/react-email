import { createRequire } from 'node:module';
import url from 'node:url';
import { defineConfig } from 'tsdown';

// css-tree uses createRequire() to load .json data files, which breaks at
// runtime in ESM bundles. We bundle it in (noExternal) so we can intercept
// those require() calls via this plugin and inline the JSON content at build
// time. See https://github.com/resend/react-email/pull/2425.
const hoistCreateRequireImports = {
  name: 'hoist-create-require-imports',
  async transform(code: string, id: string, meta: Record<string, unknown>) {
    if (id.includes('css-tree')) {
      const localizedRequire = createRequire(url.pathToFileURL(id));

      return {
        code: code
          .replaceAll("import { createRequire } from 'module';", '')
          .replaceAll(
            /(const|var|let)\s+require\s*=\s*createRequire\s*\([^)]*\)\s*;?/g,
            '',
          )
          .replaceAll(
            /require\s*\(\s*(['"])([^)]+?\.json)\1\s*\)/gm,
            (_match: string, _quote: string, jsonSpecifier: string) => {
              return JSON.stringify(
                localizedRequire(localizedRequire.resolve(jsonSpecifier)),
                null,
                2,
              );
            },
          ),
        ...meta,
      };
    }
  },
};

export default defineConfig([
  {
    dts: false,
    entry: ['./src/cli/index.ts'],
    format: ['esm'],
    outDir: 'dist/cli',
  },
  {
    dts: true,
    entry: ['./src/config/index.ts'],
    format: ['esm', 'cjs'],
    outDir: 'dist/config',
  },
  {
    dts: true,
    entry: ['./src/index.ts'],
    format: ['esm', 'cjs'],
    outDir: 'dist',
    deps: {
      alwaysBundle: ['css-tree'],
      neverBundle: [/^react($|\/)/, /^react-dom($|\/)/],
    },
    plugins: [hoistCreateRequireImports],
  },
]);
