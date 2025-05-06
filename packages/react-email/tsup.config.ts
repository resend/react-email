import { defineConfig } from 'tsup';

export default defineConfig({
  dts: false,
  entry: ['./src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
});
