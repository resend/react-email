import { defineConfig, type UserConfig } from 'tsdown';

// CJS output stays one file, so its entry does not export rolldown's interop helpers to a chunk.
const outputOptions: UserConfig['outputOptions'] = (options, format) =>
  format === 'cjs' ? { ...options, codeSplitting: false } : options;

export default defineConfig([
  {
    dts: true,
    entry: ['./src/node/index.ts'],
    outDir: './dist/node',
    format: ['cjs', 'esm'],
    outputOptions,
  },
  {
    dts: true,
    entry: ['./src/browser/index.ts'],
    outDir: './dist/browser',
    format: ['cjs', 'esm'],
    outputOptions,
  },
  {
    dts: true,
    entry: ['./src/edge/index.ts'],
    outDir: './dist/edge',
    format: ['cjs', 'esm'],
    outputOptions,
  },
]);
