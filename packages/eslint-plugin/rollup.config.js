import fs from 'node:fs'
import { basename, dirname } from 'node:path'
import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'

const pkg = JSON.parse(fs.readFileSync(
  new URL('./package.json', import.meta.url), 
  'utf-8'
))

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      manualChunks(id) {
        if (id.includes('util'))
          return 'utils'
        if (id.includes('configs'))
          return 'configs'
        if (id.includes('rules')) {
          const name = basename(id, '.ts');
          return name
        }
      },
      chunkFileNames: '[name].js',
    },
  ],
  plugins: [
    commonjs(),
    esbuild(),
  ],
  external: [
    ...Object.keys(pkg.dependencies || []),
    ...Object.keys(pkg.peerDependencies || []),
    'node:process',
  ],
})
