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
    format: ['esm', 'cjs'],
    outDir: 'dist',
  },
]);
