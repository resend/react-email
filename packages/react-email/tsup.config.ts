import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,
  entry: ['./src/cli/index.ts'],
  noExternal: ['preview-utils'],
  format: ['esm', 'cjs'],
  outDir: 'dist/cli',
});
