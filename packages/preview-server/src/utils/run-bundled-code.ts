import path from 'node:path';
import vm from 'node:vm';
import { err, ok, type Result } from './result';
import { staticNodeModulesForVM } from './static-node-modules-for-vm';

export function createContext(
  filename: string,
  globalAddendum: Record<string, any> = {},
) {
  const globalToContextify = {
    ...globalAddendum,
    __filename: filename,
    __dirname: path.dirname(filename),
    module: {
      exports: {},
    },
    require(specifier: string) {
      let m = specifier;
      if (specifier.startsWith('node:')) {
        m = m.split(':')[1]!;
      }
      if (m in staticNodeModulesForVM) {
        return staticNodeModulesForVM[m];
      }
      return require(`${specifier}`);
    },
  };
  // - https://tc39.es/ecma262/#sec-well-known-intrinsic-objects
  const intrinsicJavascriptValues: Array<string | symbol> = [
    'AggregateError',
    'Array',
    'ArrayBuffer',
    'Atomics',
    'BigInt',
    'BigInt64Array',
    'BigUint64Array',
    'Boolean',
    'DataView',
    'Date',
    'Error',
    'EvalError',
    'FinalizationRegistry',
    'Float16Array',
    'Float32Array',
    'Float64Array',
    'Function',
    'Int16Array',
    'Int32Array',
    'Int8Array',
    'Intl',
    'JSON',
    'Map',
    'Math',
    'Number',
    'Object',
    'Promise',
    'Proxy',
    'RangeError',
    'ReferenceError',
    'Reflect',
    'RegExp',
    'Set',
    'SharedArrayBuffer',
    'String',
    'SuppressedError',
    'Symbol',
    'SyntaxError',
    'TypeError',
    'URIError',
    'Uint16Array',
    'Uint32Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'WeakMap',
    'WeakRef',
    'WeakSet',
    'WebAssembly',
  ];
  for (const key of Reflect.ownKeys(global)) {
    const descriptor = Object.getOwnPropertyDescriptor(global, key);
    // V8 has intrinsic values that have equivalents in the global scope, but are not necessarily tied together.
    // Meaning that if we define it there, it can break perfectly valid code.
    //
    // See https://github.com/resend/react-email/issues/2688
    if (intrinsicJavascriptValues.includes(key)) {
      continue;
    }
    if (descriptor) {
      Object.defineProperty(globalToContextify, key, descriptor);
    }
  }
  return vm.createContext(globalToContextify);
}

export async function runBundledCode(
  code: string,
  filename: string,
  context: vm.Context = createContext(filename),
): Promise<Result<object, unknown>> {
  try {
    const module = new vm.SourceTextModule(code, {
      context,
      identifier: filename,
      initializeImportMeta(meta) {
        meta.url = `file://${filename}`;
        meta.filename = filename;
        meta.dirname = path.dirname(filename);
        meta.resolve = (specifier: string) =>
          import.meta.resolve(specifier, meta.url);
      },
    });
    await module.link(async (specifier, _referencingModule, extra) => {
      let m = specifier;
      if (specifier.startsWith('node:')) {
        m = m.split(':')[1]!;
      }

      if (m in staticNodeModulesForVM) {
        const moduleExports = staticNodeModulesForVM[m];
        const exportKeys = Reflect.ownKeys(moduleExports).filter(
          (key) => typeof key === 'string',
        ) as string[];

        const syntheticModule = new vm.SyntheticModule(
          [...exportKeys, 'default'],
          function () {
            for (const key of exportKeys) {
              this.setExport(key, moduleExports[key]);
            }
            this.setExport('default', moduleExports);
          },
          {
            context,
            identifier: specifier,
          },
        );
        return syntheticModule;
      }

      const importedModule = await import(specifier, {
        with: extra.attributes as ImportAttributes,
      });

      const exportKeys = Reflect.ownKeys(importedModule).filter(
        (key) => typeof key === 'string',
      ) as string[];

      const syntheticModule = new vm.SyntheticModule(
        exportKeys,
        function () {
          for (const key of exportKeys) {
            this.setExport(key, importedModule[key]);
          }
        },
        {
          context,
          identifier: specifier,
        },
      );
      return syntheticModule;
    });
    await module.evaluate();
    const exports = { default: context.module?.exports };
    Object.assign(exports, module.namespace);
    return ok(exports);
  } catch (exception) {
    return err(exception);
  }
}
