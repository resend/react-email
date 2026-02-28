/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['scripts/**/*.spec.mjs', 'scripts/**/*.spec.ts'],
  },
});
