import { promises as fs } from 'node:fs';
import { transformAsync } from '@babel/core';
import type { Plugin } from 'esbuild';
import babelPlugin from './babel';

export default function esbuild(emailsDirectory = 'emails'): Plugin {
  return {
    name: 'tailwindcss',
    setup(build) {
      // build.onResolve({ filter: /\.tsx?$/ }, (args) => {
      //   if (
      //     new RegExp(`${emailsDirectory}\/.+?\.(tsx|jsx|js)$`).test(args.path)
      //   ) {
      //     return { path: args.path, namespace: 'tailwindcss' };
      //   }
      // });

      build.onLoad(
        {
          filter: new RegExp(`${emailsDirectory}\/.+?\.(tsx|jsx|js)$`),
        },
        async (args) => {
          const sourceCode = await fs.readFile(args.path, 'utf8');
          const transformedCode = await transformAsync(sourceCode, {
            filename: args.path,
            presets: ['@babel/preset-typescript'],
            plugins: [babelPlugin({})],
          });

          return {
            errors: transformedCode?.code
              ? [
                  {
                    pluginName: 'React Email',
                    text: `Processed ${args.path} with React Email's tailwindcss plugin.`,
                  },
                ]
              : undefined,
            contents: transformedCode?.code ?? undefined,
          };
        },
      );
    },
  };
}
