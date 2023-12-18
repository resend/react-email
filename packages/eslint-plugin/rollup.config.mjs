import fs from 'node:fs'
import { basename } from 'node:path'
import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'

const pkg = JSON.parse(fs.readFileSync(
  new URL('./package.json', import.meta.url),
  'utf-8'
))

const ruleNames = [];

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
          if (name !== 'index') {
            ruleNames.push(name);
          }
          return name
        }
      },
      chunkFileNames: '[name].js',
    },
  ],
  plugins: [
    commonjs(),
    esbuild(),
    {
      writeBundle() {
        const packageJsonExportsChunk = {
          exports: {
            ".": {
              "require": "./dist/index.js",
              "default": "./dist/index.js"
            },
          }
        };
        for (const name of ruleNames) {
          packageJsonExportsChunk.exports[`./rules/${name}`] = `./dist/${name}.js`;
        }
        console.info(
          `Paste this on the exports section of the "package.json" for the rules to work properly: \n`, 
          JSON.stringify(packageJsonExportsChunk, null, 2)
        );
      }
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || []),
    ...Object.keys(pkg.peerDependencies || [])
  ],
})
