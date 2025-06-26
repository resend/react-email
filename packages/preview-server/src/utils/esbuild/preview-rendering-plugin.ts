import { promises as fs } from 'node:fs';
import path from 'node:path';
import { transformAsync } from '@babel/core';
import tailwindcssBabelPlugin from '@react-email/tailwind/babel';
import type { Loader, PluginBuild, ResolveOptions } from 'esbuild';
import { escapeStringForRegex } from './escape-string-for-regex';

export const previewRenderingPlugin = (emailTemplates: string[]) => {
  return {
    name: 'rendering-utilities-exporter',
    setup: (b: PluginBuild) => {
      b.onLoad(
        {
          filter: new RegExp(
            emailTemplates
              .map((emailPath) => escapeStringForRegex(emailPath))
              .join('|'),
          ),
        },
        async ({ path: pathToFile }) => {
          const contents = await fs.readFile(pathToFile, 'utf8');
          const transformation = await transformAsync(contents, {
            filename: pathToFile,
            presets: [],
            parserOpts: {
              plugins: ['jsx', 'typescript'],
            },
            plugins: [tailwindcssBabelPlugin({})],
          });
          if (!transformation || !transformation.code) {
            return {
              errors: [
                {
                  text: `Failed to process ${pathToFile}`,
                },
              ],
            };
          }
          console.log(transformation.code);

          return {
            contents: `${transformation.code};
          export { render } from 'react-email-module-that-will-export-render'
          export { createElement as reactEmailCreateReactElement } from 'react';
        `,
            loader: path.extname(pathToFile).slice(1) as Loader,
          };
        },
      );

      b.onResolve(
        { filter: /^react-email-module-that-will-export-render$/ },
        async (args) => {
          const options: ResolveOptions = {
            kind: 'import-statement',
            importer: args.importer,
            resolveDir: args.resolveDir,
            namespace: args.namespace,
          };
          let result = await b.resolve('@react-email/render', options);
          if (result.errors.length === 0) {
            return result;
          }

          // If @react-email/render does not exist, resolve to @react-email/components
          result = await b.resolve('@react-email/components', options);
          if (result.errors.length > 0 && result.errors[0]) {
            result.errors[0].text =
              "Failed trying to import `render` from either `@react-email/render` or `@react-email/components` to be able to render your email template.\n Maybe you don't have either of them installed?";
          }
          return result;
        },
      );
    },
  };
};
