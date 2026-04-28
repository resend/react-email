import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    name: 'unit',
    environment: 'happy-dom',
    include: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
    exclude: ['src/**/*.browser.spec.tsx'],
  },
});
