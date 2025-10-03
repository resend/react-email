import { createRequire } from 'node:module';
import url from 'node:url';
import { defineConfig } from 'tsdown/config';

export default defineConfig({
  entry: './src/index.ts',
  format: ['cjs', 'esm'],
  dts: true,
  noExternal: ['css-tree'],
  plugins: [
    {
      name: 'hoist-create-require-imports',
      async transform(code, id, meta) {
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
                (_match, _quote, jsonSpecifier) => {
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
    },
  ],
});
