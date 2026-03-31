import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

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
