import { defineConfig } from "tsup";

export default defineConfig([
  {
    dts: true,
    entry: ['./src/babel.ts'],
    outDir: './dist',
    format: ['cjs', 'esm'],
  },
  {
    dts: true,
    entry: ['./src/nextjs.ts'],
    outDir: './dist',
    format: ['cjs', 'esm'],
  },
]);
