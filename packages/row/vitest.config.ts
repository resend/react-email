import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['../react-email/src/components/row/**/*.spec.{ts,tsx}'],
  },
});
