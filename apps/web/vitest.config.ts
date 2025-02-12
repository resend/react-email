import { defineConfig } from 'vitest/config';
import { loadEnvConfig } from '@next/env';
import path from 'node:path';

loadEnvConfig(__dirname, true);

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
