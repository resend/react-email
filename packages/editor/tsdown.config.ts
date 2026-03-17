import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/core/index.ts',
    'src/extensions/index.ts',
    'src/ui/index.ts',
    'src/utils/index.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react', 'react-dom'],
});
