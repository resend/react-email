import path from 'node:path';
import vm from 'node:vm';
import { err, ok, type Result } from './result';
import { staticNodeModulesForVM } from './static-node-modules-for-vm';

export const createContext = (filename: string): vm.Context => {
  return new Proxy(
    {
      module: {
        exports: {},
      },
      __filename: filename,
      __dirname: path.dirname(filename),
      require: (specifiedModule: string) => {
        let m = specifiedModule;
        if (specifiedModule.startsWith('node:')) {
          m = m.split(':')[1]!;
        }

        if (m in staticNodeModulesForVM) {
          return staticNodeModulesForVM[m];
        }

        return require(`${specifiedModule}`) as unknown;
        // this string templating was necessary to not have
        // webpack warnings like:
        //
        // Import trace for requested module:
        // ./src/utils/get-email-component.tsx
        // ./src/app/page.tsx
        //  ⚠ ./src/utils/get-email-component.tsx
        // Critical dependency: the request of a dependency is an expression
      },
    },
    {
      get(target, property: string) {
        if (property in target) {
          return target[property];
        }

        return globalThis[property as keyof typeof globalThis];
      },
      has(target, property: string) {
        return property in target || property in globalThis;
      },
      set(target, property, value) {
        target[property] = value;
        return true;
      },
      getOwnPropertyDescriptor(target, property) {
        return (
          Object.getOwnPropertyDescriptor(target, property) ??
          Object.getOwnPropertyDescriptor(globalThis, property)
        );
      },
      ownKeys(target) {
        const keys = new Set([
          ...Reflect.ownKeys(globalThis),
          ...Reflect.ownKeys(target),
        ]);
        return Array.from(keys);
      },
      defineProperty(target, property, descriptor) {
        Object.defineProperty(target, property, descriptor);
        return true;
      },
      deleteProperty(target, property) {
        return delete target[property];
      },
    },
  );
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
