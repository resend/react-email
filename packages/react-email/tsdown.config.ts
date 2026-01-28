import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: false,
  entry: ['./src/index.ts', './src/commands/export-worker.ts'],
  format: ['esm'],
  outDir: 'dist',
});
