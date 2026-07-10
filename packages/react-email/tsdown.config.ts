import { defineConfig } from 'tsdown';

// css-tree's ESM files load .json data through createRequire(), which breaks
// once a consumer's bundler inlines them. Its dist bundle is self-contained,
// so the emitted ESM points there; the CJS output keeps plain 'css-tree',
// whose CJS build only uses static require() calls that bundlers handle.
// Only .mjs chunks are rewritten: declaration files must keep the bare
// specifier, the only module @types/css-tree declares.
const selfContainedCssTreeEsm = {
  name: 'self-contained-css-tree-esm',
  renderChunk(code: string, chunk: { fileName: string }) {
    if (!chunk.fileName.endsWith('.mjs') || !code.includes('"css-tree"')) {
      return null;
    }
    return {
      code: code.replaceAll(
        ' from "css-tree"',
        ' from "css-tree/dist/csstree.esm"',
      ),
      map: null,
    };
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
    entry: ['./src/index.ts'],
    format: ['esm'],
    outDir: 'dist',
    unbundle: true,
    deps: {
      neverBundle: [/^react($|\/)/, /^react-dom($|\/)/],
    },
    plugins: [selfContainedCssTreeEsm],
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
