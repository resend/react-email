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
    entry: ['./src/package/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
  },
]);
