import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    dts: false,
    entry: ['./src/cli/index.ts'],
    format: ['esm'],
    outDir: 'dist/cli',
  },
  {
    dts: true,
    entry: ['./src/index.ts'],
    format: ['esm'],
    outDir: 'dist',
    unbundle: true,
    // css-tree's ESM files load .json data through createRequire(), which
    // breaks once a consumer's bundler inlines them. Its dist bundle is
    // self-contained, so the ESM output points there; the CJS output keeps
    // plain 'css-tree', whose CJS build only uses static require() calls
    // that bundlers handle.
    outputOptions: {
      paths: {
        'css-tree': 'css-tree/dist/csstree.esm',
      },
    },
    deps: {
      neverBundle: [/^react($|\/)/, /^react-dom($|\/)/],
    },
  },
  {
    dts: true,
    entry: ['./src/index.ts'],
    format: ['cjs'],
    outDir: 'dist',
    unbundle: true,
    deps: {
      neverBundle: [/^react($|\/)/, /^react-dom($|\/)/],
    },
  },
]);
