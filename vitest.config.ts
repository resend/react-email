/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'apps/web',
      'packages/create-email',
      'packages/editor/vitest.unit.config.ts',
      'packages/editor/vitest.browser.config.ts',
      'packages/react-email',
      'packages/render',
      'packages/ui',
    ],
  },
});
