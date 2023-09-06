import { join } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const publicDir = join(__dirname, '../../../assets/preview/public');

console.log({ publicDir });

export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     input: {
  //       app: join(publicDir, '../index.html')
  //     }
  //   }
  // },
  plugins: [react()],
  publicDir,
  root: __dirname
});
