import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: ['./src/cli/index.ts'],
    format: ['esm', 'cjs'],
    outDir: 'dist/cli',
  },
  {
    dts: true,
    entry: ['./src/package/index.ts'],
    format: ['esm', 'cjs'],
    outDir: 'dist/package',
  },
]);
