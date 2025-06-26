import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: { index: './src/babel.ts' },
    outDir: './babel',
    format: ['cjs', 'esm'],
  },
  {
    dts: true,
    entry: { index: './src/nextjs.ts' },
    outDir: './nextjs',
    format: ['cjs', 'esm'],
  },
]);
