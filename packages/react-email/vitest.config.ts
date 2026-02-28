import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    projects: [
      {
        test: {
          name: 'functional',
          include: ['./**/functional/**/*.spec.ts'],
        },
      },
      {
        test: {
          name: 'stress',
          include: ['./**/stress/**/*.spec.ts'],
        },
      },
    ],
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
      },
    },
  },
});
