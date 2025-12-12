import path from 'node:path';
import vm from 'node:vm';
import { err, ok, type Result } from './result';
import { staticNodeModulesForVM } from './static-node-modules-for-vm';

export async function runBundledCode(
  code: string,
  filename: string,
  globalAddendum: Record<string, any> = {},
): Promise<Result<unknown, unknown>> {
  const globalToContextify = {
    ...globalAddendum,
    require(specifier: string) {
      let m = specifier; 
      if (specifier.startsWith('node:')) {
        m = m.split(':')[1]!;
      }
      if (m in staticNodeModulesForVM) {
        return staticNodeModulesForVM[m];
      }
    }
  };
  for (const key of Reflect.ownKeys(global)) {
    if (typeof key === 'string') {
      globalToContextify[key] = global[key];
    }
  }
  const contextified = vm.createContext(globalToContextify);
  try {
    const module = new vm.SourceTextModule(code, {
      context: contextified,
      identifier: filename,
      initializeImportMeta(meta) {
        meta.url = `file://${filename}`;
        meta.filename = filename;
        meta.dirname = path.dirname(filename);
        meta.resolve = import.meta.resolve;
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
            context: contextified,
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
          context: contextified,
          identifier: specifier,
        },
      );
      return syntheticModule;
    });
    await module.evaluate();
    return ok(module.namespace);
  } catch (exception) {
    return err(exception);
  }
}
