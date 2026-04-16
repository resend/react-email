import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

/**
 * Stub for `@react-email/render` in the browser test environment.
 * The render package depends on Node-only modules (`prettier`) that
 * Vite cannot resolve in the browser. Only the render package is
 * stubbed — components are resolved from the real `react-email` source.
 */
const renderStub = resolve(__dirname, 'src/__tests__/stub-module.ts');

export default defineConfig({
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'happy-dom',
          include: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
          exclude: ['src/**/*.browser.spec.tsx'],
        },
      },
      {
        extends: true,
        plugins: [react()],
        resolve: {
          alias: {
            '@react-email/render': renderStub,
          },
        },
        test: {
          name: 'browser',
          include: ['src/**/*.browser.spec.tsx'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            headless: true,
          },
        },
      },
    ],
  },
});
