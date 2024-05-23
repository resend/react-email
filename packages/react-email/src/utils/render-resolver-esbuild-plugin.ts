import path from 'node:path';
import { promises as fs } from 'node:fs';
import type { Loader, PluginBuild, ResolveOptions } from 'esbuild';

function escapeStringForRegex(string: string) {
  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

/**
 * Made to export the `renderAsync` function out of the user's email template
 * so that issues like https://github.com/resend/react-email/issues/649 don't
 * happen.
 *
 * This avoids multiple versions of React being involved, i.e., the version
 * in the CLI vs. the version the user has on their emails.
 */
export const renderResolver = (emailTemplates: string[]) => ({
  name: 'render-resolver',
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
          export { renderAsync } from 'react-email-module-that-will-export-render'
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
            "Failed trying to import `renderAsync` from either `@react-email/render` or `@react-email/components` to be able to render your email template.\n Maybe you don't have either of them installed?";
        }
        return result;
      },
    );
  },
});
