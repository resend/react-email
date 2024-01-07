import path from 'node:path';
import vm from 'node:vm';
import stream from 'node:stream';
import util from 'node:util';
import { build } from 'esbuild';
import type { EmailTemplate } from './types/email-template';

export const getEmailComponent = async (
  emailPath: string,
): Promise<EmailTemplate> => {
  const { outputFiles } = await build({
    bundle: true,
    entryPoints: [emailPath],
    platform: 'node',
    write: false,
    format: 'cjs',
    tsconfig: path.resolve(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.NEXT_PUBLIC_CLI_PACKAGE_LOCATION!,
      './tsconfig.export.json',
    ),
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const outputFile = outputFiles[0]!;
  const builtEmailCode = outputFile.text;

  // This is necessary because the requires of these modules break when we run the email with vm.
  // So what we do is pre-import and return it on the fake require function we pass to the VM's context
  const nodeModuleMapToPreImported = {
    stream,
    util
  };

  const fakeContext = {
    module: { exports: { default: undefined as unknown } },
    setTimeout,
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

  return fakeContext.module.exports.default as EmailTemplate;
};
