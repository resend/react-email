import type { TsconfigRaw } from 'esbuild';
import { defineConfig } from 'vitest/config';
import tsconfig from './tsconfig.test.json';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  esbuild: {
    tsconfigRaw: tsconfig as TsconfigRaw,
  },
});
