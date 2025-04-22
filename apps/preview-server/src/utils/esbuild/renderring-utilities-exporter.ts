import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Loader, PluginBuild, ResolveOptions } from 'esbuild';
import { escapeStringForRegex } from './escape-string-for-regex';

/**
 * Made to export the `render` function out of the user's email template
 * so that issues like https://github.com/resend/react-email/issues/649 don't
 * happen.
 *
 * This also exports the `createElement` from the user's React version as well
 * to avoid mismatches.
 *
 * This avoids multiple versions of React being involved, i.e., the version
 * in the CLI vs. the version the user has on their emails.
 */
export const renderingUtilitiesExporter = (emailTemplates: string[]) => ({
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
        return {
          contents: `${await fs.readFile(pathToFile, 'utf8')};
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
});
