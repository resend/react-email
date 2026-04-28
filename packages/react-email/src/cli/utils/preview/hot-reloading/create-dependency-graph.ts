import { existsSync, promises as fs, statSync } from 'node:fs';
import path from 'node:path';
import type { EventName } from 'chokidar/handler.js';
import { getImportedModules } from './get-imported-modules.js';
import {
  resolveAliasedDirectoryPrefix,
  resolvePathAliases,
} from './resolve-path-aliases.js';

interface Module {
  path: string;

  dependencyPaths: string[];
  dependentPaths: string[];

  globDependencyPaths: string[];

  moduleDependencies: string[];
}

export type DependencyGraph = Record</* path to module */ string, Module>;

const readAllFilesInsideDirectory = async (directory: string) => {
  let allFilePaths: string[] = [];

  const topLevelDirents = await fs.readdir(directory, { withFileTypes: true });

  for await (const dirent of topLevelDirents) {
    const pathToDirent = path.join(directory, dirent.name);
    if (dirent.isDirectory()) {
      allFilePaths = allFilePaths.concat(
        await readAllFilesInsideDirectory(pathToDirent),
      );
    } else {
      allFilePaths.push(pathToDirent);
    }
  }

  return allFilePaths;
};

const javascriptExtensions = ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs'];

const isJavascriptModule = (filePath: string) => {
  const extensionName = path.extname(filePath);

  return javascriptExtensions.includes(extensionName);
};

const checkFileExtensionsUntilItExists = (
  pathWithoutExtension: string,
): string | undefined => {
  if (existsSync(`${pathWithoutExtension}.ts`)) {
    return `${pathWithoutExtension}.ts`;
  }

  if (existsSync(`${pathWithoutExtension}.tsx`)) {
    return `${pathWithoutExtension}.tsx`;
  }

  if (existsSync(`${pathWithoutExtension}.js`)) {
    return `${pathWithoutExtension}.js`;
  }

  if (existsSync(`${pathWithoutExtension}.jsx`)) {
    return `${pathWithoutExtension}.jsx`;
  }

  if (existsSync(`${pathWithoutExtension}.mjs`)) {
    return `${pathWithoutExtension}.mjs`;
  }

  if (existsSync(`${pathWithoutExtension}.cjs`)) {
    return `${pathWithoutExtension}.cjs`;
  }
};

export const isUnderDirectory = (filePath: string, directoryPath: string) => {
  if (filePath === directoryPath) return true;
  const prefix = directoryPath.endsWith(path.sep)
    ? directoryPath
    : directoryPath + path.sep;
  return filePath.startsWith(prefix);
};

const resolveGlobPrefixToDirectory = (
  prefix: string,
  modulePath: string,
): string | undefined => {
  const moduleDirectory = path.dirname(modulePath);

  let resolvedPrefix: string;
  const isRelative = prefix.startsWith('.') || path.isAbsolute(prefix);
  if (isRelative) {
    resolvedPrefix = path.resolve(moduleDirectory, prefix);
  } else {
    const trimmed = prefix.replace(/[/\\]+$/, '');
    if (trimmed.length === 0) return undefined;
    const aliased = resolveAliasedDirectoryPrefix(trimmed, moduleDirectory);
    if (aliased === undefined) {
      return undefined;
    }
    resolvedPrefix = aliased;
  }

  const directory =
    prefix.endsWith('/') || prefix.endsWith(path.sep)
      ? resolvedPrefix
      : path.dirname(resolvedPrefix);

  if (isUnderDirectory(moduleDirectory, directory)) return undefined;

  if (!existsSync(directory)) return undefined;
  try {
    if (!statSync(directory).isDirectory()) return undefined;
  } catch (_) {
    return undefined;
  }

  return directory;
};

/**
 * Creates a stateful dependency graph that is structured in a way that you can get
 * the dependents of a module from its path.
 *
 * Stateful in the sense that it provides a `getter` and an "`updater`". The updater
 * will receive changes to the files, that can be perceived through some file watching mechanism,
 * so that it doesn't need to recompute the entire dependency graph but only the parts changed.
 */
export const createDependencyGraph = async (directory: string) => {
  const filePaths = await readAllFilesInsideDirectory(directory);
  const modulePaths = filePaths.filter(isJavascriptModule);
  const graph: DependencyGraph = Object.fromEntries(
    modulePaths.map((path) => [
      path,
      {
        path,
        dependencyPaths: [],
        dependentPaths: [],
        globDependencyPaths: [],
        moduleDependencies: [],
      },
    ]),
  );

  const getDependencyPaths = async (filePath: string) => {
    const contents = await fs.readFile(filePath, 'utf8');
    const imports = isJavascriptModule(filePath)
      ? getImportedModules(contents)
      : { staticImports: [], dynamicGlobPrefixes: [] };
    const importedPaths = isJavascriptModule(filePath)
      ? resolvePathAliases(imports.staticImports, path.dirname(filePath))
      : [];
    const importedPathsRelativeToDirectory = importedPaths.map(
      (dependencyPath) => {
        const isModulePath = !dependencyPath.startsWith('.');

        /*
          path.isAbsolute will return false if the path looks like JavaScript module imports
          e.g. path.isAbsolute('react-dom/server') will return false, but for our purposes this
          path is not a relative one.
        */
        if (isModulePath || path.isAbsolute(dependencyPath)) {
          return dependencyPath;
        }

        let pathToDependencyFromDirectory = path.resolve(
          /*
            path.resolve resolves paths differently from what imports on javascript do.

            So if we wouldn't do this, for an email at "/path/to/email.tsx" with a dependency path of "./other-email"
            would end up going into /path/to/email.tsx/other-email instead of /path/to/other-email which is the
            one the import is meant to go to
          */
          path.dirname(filePath),
          dependencyPath,
        );

        let isDirectory = false;
        try {
          // will throw if the the file is not existent
          isDirectory = statSync(pathToDependencyFromDirectory).isDirectory();
        } catch (_) {}
        if (isDirectory) {
          const pathToSubDirectory = pathToDependencyFromDirectory;
          const pathWithExtension = checkFileExtensionsUntilItExists(
            `${pathToSubDirectory}/index`,
          );
          if (pathWithExtension) {
            pathToDependencyFromDirectory = pathWithExtension;
          } else {
            console.warn(
              `Could not find index file for directory at ${pathToDependencyFromDirectory}. This is probably going to cause issues with both hot reloading and your code.`,
            );
          }
        }

        const extension = path.extname(pathToDependencyFromDirectory);
        const pathWithEnsuredExtension = (() => {
          if (
            extension.length > 0 &&
            existsSync(pathToDependencyFromDirectory)
          ) {
            return pathToDependencyFromDirectory;
          }
          if (javascriptExtensions.includes(extension)) {
            return checkFileExtensionsUntilItExists(
              pathToDependencyFromDirectory.replace(extension, ''),
            );
          }
          return checkFileExtensionsUntilItExists(
            pathToDependencyFromDirectory,
          );
        })();

        if (pathWithEnsuredExtension) {
          pathToDependencyFromDirectory = pathWithEnsuredExtension;
        } else {
          console.warn(
            `Could not find file at ${pathToDependencyFromDirectory}`,
          );
        }

        return pathToDependencyFromDirectory;
      },
    );

    const moduleDependencies = importedPathsRelativeToDirectory.filter(
      (dependencyPath) =>
        !dependencyPath.startsWith('.') && !path.isAbsolute(dependencyPath),
    );

    const nonNodeModuleImportPathsRelativeToDirectory =
      importedPathsRelativeToDirectory.filter(
        (dependencyPath) =>
          dependencyPath.startsWith('.') || path.isAbsolute(dependencyPath),
      );

    const globDependencyPaths = Array.from(
      new Set(
        imports.dynamicGlobPrefixes
          .map((prefix) => resolveGlobPrefixToDirectory(prefix, filePath))
          .filter((d): d is string => typeof d === 'string'),
      ),
    );

    return {
      dependencyPaths: nonNodeModuleImportPathsRelativeToDirectory,
      moduleDependencies,
      globDependencyPaths,
    };
  };

  const updateModuleDependenciesInGraph = async (moduleFilePath: string) => {
    if (graph[moduleFilePath] === undefined) {
      graph[moduleFilePath] = {
        path: moduleFilePath,
        dependencyPaths: [],
        dependentPaths: [],
        globDependencyPaths: [],
        moduleDependencies: [],
      };
    }

    const {
      moduleDependencies,
      dependencyPaths: newDependencyPaths,
      globDependencyPaths: newGlobDependencyPaths,
    } = await getDependencyPaths(moduleFilePath);

    graph[moduleFilePath].moduleDependencies = moduleDependencies;
    graph[moduleFilePath].globDependencyPaths = newGlobDependencyPaths;

    // we go through these to remove the ones that don't exist anymore
    for (const dependencyPath of graph[moduleFilePath].dependencyPaths) {
      // Looping through only the ones that were on the dependencyPaths but are not
      // in the newDependencyPaths
      if (newDependencyPaths.includes(dependencyPath)) continue;

      const dependencyModule = graph[dependencyPath];
      if (dependencyModule !== undefined) {
        dependencyModule.dependentPaths =
          dependencyModule.dependentPaths.filter(
            (dependentPath) => dependentPath !== moduleFilePath,
          );
      }
    }

    graph[moduleFilePath].dependencyPaths = newDependencyPaths;

    for await (const dependencyPath of newDependencyPaths) {
      if (graph[dependencyPath] === undefined) {
        /*
          This import path might have not been initialized as it can be outside
          of the original directory we looked into.
        */
        await updateModuleDependenciesInGraph(dependencyPath);
      }

      const dependencyModule = graph[dependencyPath];

      if (dependencyModule === undefined) {
        throw new Error(
          `Loading the dependency path ${dependencyPath} did not initialize it at all. This is a bug in React Email.`,
        );
      }

      if (!dependencyModule.dependentPaths.includes(moduleFilePath)) {
        dependencyModule.dependentPaths.push(moduleFilePath);
      }
    }
  };

  for (const filePath of modulePaths) {
    await updateModuleDependenciesInGraph(filePath);
  }

  const removeModuleFromGraph = (filePath: string) => {
    const module = graph[filePath];
    if (module) {
      for (const dependencyPath of module.dependencyPaths) {
        if (graph[dependencyPath]) {
          graph[dependencyPath]!.dependentPaths = graph[
            dependencyPath
          ]!.dependentPaths.filter(
            (dependentPath) => dependentPath !== filePath,
          );
        }
      }
      delete graph[filePath];
    }
  };

  /**
   * Returns the union of all directories any module declared as a glob
   * dependency. Useful for telling chokidar what to watch on top of the static
   * dependency graph.
   */
  const getGlobDependencyDirectories = (): string[] => {
    const directories = new Set<string>();
    for (const module of Object.values(graph)) {
      for (const directory of module.globDependencyPaths) {
        directories.add(directory);
      }
    }
    return [...directories];
  };

  return [
    graph,
    async (event: EventName, pathToModified: string) => {
      switch (event) {
        case 'change':
          if (isJavascriptModule(pathToModified)) {
            await updateModuleDependenciesInGraph(pathToModified);
          }
          break;
        case 'add':
          if (isJavascriptModule(pathToModified)) {
            await updateModuleDependenciesInGraph(pathToModified);
          }
          break;
        case 'addDir': {
          const filesInsideAddedDirectory =
            await readAllFilesInsideDirectory(pathToModified);
          const modulesInsideAddedDirectory =
            filesInsideAddedDirectory.filter(isJavascriptModule);
          for await (const filePath of modulesInsideAddedDirectory) {
            await updateModuleDependenciesInGraph(filePath);
          }
          break;
        }
        case 'unlink':
          if (isJavascriptModule(pathToModified)) {
            removeModuleFromGraph(pathToModified);
          }
          break;
        case 'unlinkDir': {
          const filesInsideDeletedDirectory =
            await readAllFilesInsideDirectory(pathToModified);
          const modulesInsideDeletedDirectory =
            filesInsideDeletedDirectory.filter(isJavascriptModule);
          for await (const filePath of modulesInsideDeletedDirectory) {
            removeModuleFromGraph(filePath);
          }
          break;
        }
      }
    },
    {
      /**
       * Resolves all modules that depend on the specified module, directly or indirectly.
       *
       * If the path doesn't correspond to a graph node (e.g. a JSON file
       * loaded via dynamic `import(\`...\`)`), modules whose glob directories
       * contain the path are treated as direct dependents and their own
       * dependents are resolved transitively.
       *
       * @param pathToModule - The path to the module whose dependents we want to find
       * @returns An array of paths to all modules that depend on the specified module
       */
      resolveDependentsOf: function resolveDependentsOf(
        pathToModule: string,
      ): string[] {
        const dependentPaths = new Set<string>();
        const stack: string[] = [pathToModule];

        for (const module of Object.values(graph)) {
          for (const globDirectory of module.globDependencyPaths) {
            if (
              isUnderDirectory(pathToModule, globDirectory) &&
              module.path !== pathToModule &&
              !dependentPaths.has(module.path)
            ) {
              dependentPaths.add(module.path);
              stack.push(module.path);
            }
          }
        }

        while (stack.length > 0) {
          const currentPath = stack.pop()!;
          const moduleEntry = graph[currentPath];

          if (!moduleEntry) continue;

          for (const dependentPath of moduleEntry.dependentPaths) {
            if (
              dependentPaths.has(dependentPath) ||
              dependentPath === pathToModule
            )
              continue;

            dependentPaths.add(dependentPath);
            stack.push(dependentPath);
          }
        }

        return [...dependentPaths.values()];
      },

      getGlobDependencyDirectories,
    },
  ] as const;
};
