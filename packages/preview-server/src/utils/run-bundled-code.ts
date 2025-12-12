import path from 'node:path';
import vm from 'node:vm';
import { err, ok, type Result } from './result';
import { staticNodeModulesForVM } from './static-node-modules-for-vm';

export async function runBundledCode(
  code: string,
  filename: string,
  fakeContext: vm.Context = vm.createContext(global),
): Promise<Result<unknown, unknown>> {
  try {
    const module = new vm.SourceTextModule(code, {
      context: fakeContext,
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
        return staticNodeModulesForVM[m];
      }

      await import(specifier, {
        with: extra.attributes as ImportAttributes,
      });
    });
    await module.evaluate();
    return ok(module.namespace);
  } catch (exception) {
    return err(exception);
  }
}
