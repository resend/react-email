'use server';
import path from 'node:path';
import vm from 'node:vm';
import stream from 'node:stream';
import util from 'node:util';
import { build } from 'esbuild';
import { type EmailTemplate, isEmailTemplate } from './types/email-template';

export const getEmailComponent = async (...emailPaths: string[]) => {
  const { outputFiles } = await build({
    bundle: true,
    entryPoints: emailPaths,
    platform: 'node',
    write: false,
    // just a stub for esbuild
    // See https://github.com/evanw/esbuild/issues/2378#issuecomment-1178420272
    outdir: 'built-emails',
    format: 'cjs',
    tsconfig: path.resolve(__dirname, '../../../tsconfig.export.json'),
  });

  const components = new Map<string, EmailTemplate>();
  for (const outputFile of outputFiles) {
    const builtEmailCode = outputFile.text;

    // This is necessary because the requires of these modules break when we run the email with vm.
    // So what we do is pre-import and return it on the fake require function we pass to the VM's context
    const nodeModuleMapToPreImported = {
      stream, util
    };

    const fakeContext = {
      module: { exports: { default: undefined as unknown } },
      require: (module: string) => {
        if (module in nodeModuleMapToPreImported) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return nodeModuleMapToPreImported[module];
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require(`${module}`) as unknown;
        // this stupid string templating was necessary to not have
        // webpack warnings like:
        //
        // Import trace for requested module:
        // ./src/utils/get-email-component.tsx
        // ./src/app/page.tsx
        //  ⚠ ./src/utils/get-email-component.tsx
        // Critical dependency: the request of a dependency is an expression
      },
      process,
    };
    vm.runInNewContext(builtEmailCode, fakeContext);
    if (isEmailTemplate(fakeContext.module.exports.default)) {
      components.set(outputFile.path, fakeContext.module.exports.default);
    }
  }

  return components;
};
