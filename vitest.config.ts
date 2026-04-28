/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'apps/web',
      'packages/create-email',
      'packages/editor',
      'packages/react-email',
      'packages/render',
      'packages/ui',
    ],
  },
});
