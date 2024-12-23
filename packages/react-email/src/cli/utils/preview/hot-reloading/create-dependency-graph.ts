import path from 'node:path';
import { existsSync, promises as fs, statSync } from 'node:fs';
import { getImportedModules } from './get-imported-modules';
import { isDev } from '../start-dev-server';
import { EventName } from 'chokidar/handler';

interface Module {
  path: string;

  dependencyPaths: string[];
  dependentPaths: string[];

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

const isJavascriptModule = (filePath: string) => {
  const extensionName = path.extname(filePath);

  return ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs'].includes(extensionName);
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
        moduleDependencies: [],
      },
    ]),
  );

  const getDependencyPaths = async (filePath: string) => {
    const contents = await fs.readFile(filePath, 'utf8');

    const importedPaths = getImportedModules(contents);
    const importedPathsRelativeToDirectory = importedPaths.map(
      (dependencyPath) => {
        const isModulePath = !dependencyPath.startsWith('.');
        /*
          path.isAbsolute will return false if the path looks like JavaScript module imports
          e.g. path.isAbsolute('react-dom/server') will return false, but for our purposes this
          path is not a relative one.
        */
        if (!isModulePath && !path.isAbsolute(dependencyPath)) {
          let pathToDependencyFromDirectory = path.resolve(
            /*
              path.resolve resolves paths differently from what imports on javascript do.

              So if we wouldn't do this, for an email at "/path/to/email.tsx" with a dependecy path of "./other-email" 
              would end up going into /path/to/email.tsx/other-email instead of /path/to/other-email which is the
              one the import is meant to go to
            */
            path.dirname(filePath),
            dependencyPath,
          );

          let isDirectory = false;
          try {
            // will throw if the the file is not existant
            isDirectory = statSync(pathToDependencyFromDirectory).isDirectory();
          } catch (_) {}
          if (isDirectory) {
            const pathToSubDirectory = pathToDependencyFromDirectory;
            const pathWithExtension = checkFileExtensionsUntilItExists(
              `${pathToSubDirectory}/index`,
            );
            if (pathWithExtension) {
              pathToDependencyFromDirectory = pathWithExtension;
            } else if (isDev) {
              // only warn about this on development as it is probably going to be irrelevant otherwise
              console.warn(
                `Could not find index file for directory at ${pathToDependencyFromDirectory}. This is probably going to cause issues with both hot reloading and your code.`,
              );
            }
          }

          /*
            If the path to the dependency does not include a file extension, such that our check
            for it being a javascript module fails, then we can assume it has the same as the `filePath`
          */
          if (!isJavascriptModule(pathToDependencyFromDirectory)) {
            const pathWithExtension = checkFileExtensionsUntilItExists(
              pathToDependencyFromDirectory,
            );

            if (pathWithExtension) {
              pathToDependencyFromDirectory = pathWithExtension;
            } else if (isDev) {
              // only warn about this on development as it is probably going to be irrelevant otherwise
              console.warn(
                `Could not determine the file extension for the file at ${pathToDependencyFromDirectory}`,
              );
            }
          }

          return pathToDependencyFromDirectory;
        } else {
          // when either the path is a module or is absolute
          return dependencyPath;
        }
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

    return {
      dependencyPaths: nonNodeModuleImportPathsRelativeToDirectory,
      moduleDependencies,
    };
  };

  const updateModuleDependenciesInGraph = async (moduleFilePath: string) => {
    const module = graph[moduleFilePath] ?? {
      path: moduleFilePath,
      dependencyPaths: [],
      dependentPaths: [],
      moduleDependencies: [],
    };

    const { moduleDependencies, dependencyPaths: newDependencyPaths } =
      await getDependencyPaths(moduleFilePath);

    module.moduleDependencies = moduleDependencies;

    // we go through these to remove the ones that don't exist anymore
    for (const dependencyPath of module.dependencyPaths) {
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

    module.dependencyPaths = newDependencyPaths;

    for (const dependencyPath of newDependencyPaths) {
      const dependencyModule = graph[dependencyPath];
      if (
        dependencyModule !== undefined &&
        !dependencyModule.dependentPaths.includes(moduleFilePath)
      ) {
        dependencyModule.dependentPaths.push(moduleFilePath);
      } else {
        /*
          This import path might have not been initialized as it can be outside
          of the original directory we looked into.
        */
        graph[dependencyPath] = {
          path: dependencyPath,
          moduleDependencies: [],
          dependencyPaths: [],
          dependentPaths: [moduleFilePath],
        };
      }
    }

    graph[moduleFilePath] = module;
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
      resolveDependentsOf: function resolveDependentsOf(pathToModule: string) {
        const moduleEntry = graph[pathToModule];
        const dependentPaths: Array<string> = [];

        if (moduleEntry) {
          for (const dependentPath of moduleEntry.dependentPaths) {
            const dependentsOfDependent = resolveDependentsOf(dependentPath);
            dependentPaths.push(...dependentsOfDependent);
            dependentPaths.push(dependentPath);
          }
        }

        return dependentPaths;
      },
    },
  ] as const;
};
