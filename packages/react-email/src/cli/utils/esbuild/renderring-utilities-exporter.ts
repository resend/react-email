import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { PluginBuild, ResolveOptions } from 'esbuild';
import { escapeStringForRegex } from './escape-string-for-regex.js';

const ENTRY_SUFFIX = '?react-email-entry';

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
 *
 * Each template entry point is replaced by a wrapper module that re-exports
 * it along with the utilities, instead of loading the template's source here.
 * The template itself then goes through the regular load pipeline, so other
 * plugins (for example the user's `--esbuild-plugins`) can still transform it.
 */
export const renderingUtilitiesExporter = (emailTemplates: string[]) => ({
  name: 'rendering-utilities-exporter',
  setup: async (b: PluginBuild) => {
    const templatePaths = await Promise.all(
      emailTemplates.map((emailPath) => fs.realpath(emailPath)),
    );
    const templateFilter = new RegExp(
      templatePaths
        .map((templatePath) => escapeStringForRegex(templatePath))
        .join('|'),
    );

    b.onResolve({ filter: /.*/ }, async (args) => {
      if (args.kind !== 'entry-point') return null;
      const resolvedPath = path.isAbsolute(args.path)
        ? args.path
        : path.resolve(args.resolveDir, args.path);
      const realPath = await fs.realpath(resolvedPath);
      if (!templatePaths.includes(realPath)) return null;
      return { path: realPath, suffix: ENTRY_SUFFIX };
    });

    b.onLoad({ filter: templateFilter }, ({ path: pathToFile, suffix }) => {
      if (suffix !== ENTRY_SUFFIX) return null;
      const templateSpecifier = JSON.stringify(pathToFile);
      return {
        contents: `export * from ${templateSpecifier};
          import * as emailModule from ${templateSpecifier};
          export default emailModule.default;
          export { render } from 'react-email-module-that-will-export-render';
          export { createElement as reactEmailCreateReactElement } from 'react';
        `,
        loader: 'js',
        resolveDir: path.dirname(pathToFile),
      };
    });

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

        result = await b.resolve('react-email', options);
        if (result.errors.length > 0 && result.errors[0]) {
          result.errors[0].text =
            "Failed trying to import `render` from either `@react-email/render` or `react-email` to be able to render your email template.\n Maybe you don't have either of them installed?";
        }
        return result;
      },
    );
  },
});
