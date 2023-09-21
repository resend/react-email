import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

process.chdir(__dirname);

export default defineConfig({
  define: {
    'process.env': 'import.meta.env'
  },
  plugins: [react()],
  root: __dirname
});
