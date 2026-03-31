import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

/**
 * Stub module used by browser tests to satisfy imports from
 * `@react-email/render` and `@react-email/markdown`. Those packages depend on
 * Node-only modules (`prettier`, `md-to-react-email`) that Vite cannot resolve
 * in the browser environment. The extensions only use React component exports
 * from `@react-email/components` at runtime, never the render/markdown
 * functions, so stubbing is safe for component-level testing.
 */
const stubModule = resolve(__dirname, 'src/__tests__/stub-module.ts');

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
            '@react-email/render': stubModule,
            '@react-email/markdown': stubModule,
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
