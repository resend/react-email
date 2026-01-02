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
  for (const key of Reflect.ownKeys(global)) {
    const descriptor = Object.getOwnPropertyDescriptor(global, key);
    if (key === 'RegExp') {
      // Regexp isn't really needed from the global, and it actually can break code.
      // See https://github.com/resend/react-email/issues/2688.
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
        // Get all own property keys (including symbols and non-enumerable)
        const exportKeys = Reflect.ownKeys(moduleExports).filter(
          (key) => typeof key === 'string',
        ) as string[];

        // Create a SyntheticModule that exports the static module
        const syntheticModule = new vm.SyntheticModule(
          exportKeys,
          function () {
            // Set all exports from the static module
            for (const key of exportKeys) {
              this.setExport(key, moduleExports[key]);
            }
          },
          {
            context,
            identifier: specifier,
          },
        );
        return syntheticModule;
      }

      // For external modules, import them and create a SyntheticModule
      const importedModule = await import(specifier, {
        with: extra.attributes as ImportAttributes,
      });

      // Get all own property keys (including symbols and non-enumerable)
      // Filter to only string keys as SyntheticModule only supports string export names
      const exportKeys = Reflect.ownKeys(importedModule).filter(
        (key) => typeof key === 'string',
      ) as string[];

      const syntheticModule = new vm.SyntheticModule(
        exportKeys,
        function () {
          // Set all exports from the imported module
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
