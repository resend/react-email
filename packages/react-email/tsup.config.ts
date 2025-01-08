import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: false,
    entry: ['./src/cli/index.ts'],
    format: ['cjs'],
    outDir: 'dist/cli',
  },
  {
    dts: true,
    entry: ['./src/package/index.browser.ts'],
    target: "chrome",
    noExternal: [/@react-email\/.*/],
    format: ['cjs', 'esm'],
    outDir: 'dist/browser',
  },
  {
    dts: true,
    entry: ['./src/package/index.node.ts'],
    target: "node",
    noExternal: [/@react-email\/.*/],
    format: ['cjs', 'esm'],
    outDir: 'dist/node',
  },
]);
