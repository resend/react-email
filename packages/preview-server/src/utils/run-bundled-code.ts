import path from 'node:path';
import url from 'node:url';
import vm from 'node:vm';
import { err, ok, type Result } from './result';
import { staticNodeModulesForVM } from './static-node-modules-for-vm';

export const createContext = (filename: string): vm.Context => {
  const import_ = (specifier: string) => import(specifier);

  import_.meta = {
    url: url.pathToFileURL(filename),
    filename: filename,
    dirname: path.dirname(filename),
  };
  return {
    ...global,
    console,
    Buffer,
    AbortSignal,
    Event,
    EventTarget,
    TextDecoder,
    Request,
    Response,
    TextDecoderStream,
    SyntaxError,
    Error,
    TextEncoder,
    TextEncoderStream,
    ReadableStream,
    URL,
    URLSearchParams,
    Headers,
    module: {
      exports: {},
    },
    import: import_,
    __filename: filename,
    __dirname: path.dirname(filename),
    require: (specifiedModule: string) => {
      let m = specifiedModule;
      if (specifiedModule.startsWith('node:')) {
        m = m.split(':')[1]!;
      }

      if (m in staticNodeModulesForVM) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return staticNodeModulesForVM[m];
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-useless-template-literals
      return require(`${specifiedModule}`) as unknown;
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
};

export const runBundledCode = (
  code: string,
  filename: string,
  fakeContext: vm.Context = createContext(filename),
): Result<unknown, unknown> => {
  try {
    vm.runInNewContext(code, fakeContext, { filename });
  } catch (exception) {
    return err(exception);
  }

  return ok(fakeContext.module.exports as unknown);
};
