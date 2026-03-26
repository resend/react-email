import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'core/index': 'src/core/index.ts',
    'extensions/index': 'src/extensions/index.ts',
    'plugins/index': 'src/plugins/index.ts',
    'ui/index': 'src/ui/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react', 'react-dom'],
  onSuccess: 'tsx scripts/copy-css.ts',
});
