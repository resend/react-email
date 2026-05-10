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
    /**
     * Coverage gate. Lives at the top level so it applies across both
     * projects. Thresholds are scoped narrowly to the directories the
     * Snow Leopard plan locked down; widen them as more areas reach
     * stable coverage.
     */
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/core/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
        'src/plugins/image/**/*.{ts,tsx}',
        'src/plugins/email-theming/css-transforms.ts',
      ],
      exclude: [
        'src/**/*.spec.{ts,tsx}',
        'src/**/__tests__/**',
        'src/**/__snapshots__/**',
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
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
        plugins: [react({})],
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
