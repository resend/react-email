import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: false,
  entry: ['./src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
});
