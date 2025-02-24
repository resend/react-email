import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'vitest/config';

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
