import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import {
  createDependencyGraph,
  type DependencyGraph,
} from './create-dependency-graph.js';

const testingDiretctory = path.join(__dirname, './test/dependency-graph/inner');

const pathToTemporaryFile = path.join(
  testingDiretctory,
  './.temporary-file.ts',
);

vi.mock('@babel/traverse', async () => {
  const traverse = await vi.importActual('@babel/traverse');
  return { default: traverse };
});

describe('createDependencyGraph()', async () => {
  if (existsSync(pathToTemporaryFile)) {
    await fs.rm(pathToTemporaryFile);
  }

  const [dependencyGraph, updateDependencyGraph, { resolveDependentsOf }] =
    await createDependencyGraph(testingDiretctory);

  const toAbsolute = (relativePath: string) => {
    return path.resolve(testingDiretctory, relativePath);
  };

  it.sequential(
    'should resolve dependents when there are circular dependencies',
    async () => {
      expect(resolveDependentsOf(toAbsolute('file-a.ts'))).toEqual([
        toAbsolute('file-b.ts'),
        toAbsolute('general-importing-file.ts'),
      ]);
    },
  );

  it.sequential(
    'should have the right initial value for the dependency graph',
    () => {
      const relativePathDependencyGraph = Object.fromEntries(
        Object.entries(dependencyGraph).map(([key, value]) => {
          return [
            path.relative(testingDiretctory, key),
            {
              path: path.relative(testingDiretctory, value.path),
              dependentPaths: value.dependentPaths.map((p) =>
                path.relative(testingDiretctory, p),
              ),
              dependencyPaths: value.dependencyPaths.map((p) =>
                path.relative(testingDiretctory, p),
              ),
              moduleDependencies: value.moduleDependencies,
            },
          ];
        }),
      );
      expect(relativePathDependencyGraph).toMatchSnapshot();
    },
  );

  it.sequential('should work when adding a new file', async () => {
    await fs.writeFile(
      pathToTemporaryFile,
      `
import {} from './file-a';
import {} from './file-b';
import {} from './general-importing-file';
`,
      'utf8',
    );
    await updateDependencyGraph('add', pathToTemporaryFile);
    expect(dependencyGraph[pathToTemporaryFile]).toEqual({
      path: pathToTemporaryFile,
      dependentPaths: [],
      dependencyPaths: [
        toAbsolute('file-a.ts'),
        toAbsolute('file-b.ts'),
        toAbsolute('general-importing-file.ts'),
      ],
      moduleDependencies: [],
    } satisfies DependencyGraph[number]);
    expect(dependencyGraph[toAbsolute('file-a.ts')]?.dependentPaths).toContain(
      pathToTemporaryFile,
    );
    expect(dependencyGraph[toAbsolute('file-b.ts')]?.dependentPaths).toContain(
      pathToTemporaryFile,
    );
    expect(
      dependencyGraph[toAbsolute('general-importing-file.ts')]?.dependentPaths,
    ).toContain(pathToTemporaryFile);
  });

  it.sequential('should work when updating a file', async () => {
    await fs.writeFile(
      pathToTemporaryFile,
      `
import {} from './file-a';
import {} from './file-b';
`,
      'utf8',
    );
    await updateDependencyGraph('change', pathToTemporaryFile);
    expect(
      dependencyGraph[pathToTemporaryFile],
      'changed file to have updated dependencyPaths',
    ).toEqual({
      path: pathToTemporaryFile,
      dependentPaths: [],
      dependencyPaths: [toAbsolute('file-a.ts'), toAbsolute('file-b.ts')],
      moduleDependencies: [],
    } satisfies DependencyGraph[number]);
    expect(dependencyGraph[toAbsolute('file-a.ts')]?.dependentPaths).toContain(
      pathToTemporaryFile,
    );
    expect(dependencyGraph[toAbsolute('file-b.ts')]?.dependentPaths).toContain(
      pathToTemporaryFile,
    );
    expect(
      dependencyGraph[toAbsolute('general-importing-file.ts')]?.dependentPaths,
      'when removing dependency on a file, the dependency should have its dependents updated to not have the testing file again',
    ).not.toContain(pathToTemporaryFile);
  });

  it.sequential('should work when unlinking a file', async () => {
    await fs.rm(pathToTemporaryFile);
    await updateDependencyGraph('unlink', pathToTemporaryFile);
    expect(dependencyGraph[pathToTemporaryFile]).toBeUndefined();
    expect(
      dependencyGraph[toAbsolute('file-a.ts')]?.dependentPaths,
      "should remove itself from dependents once it's unlinked",
    ).not.toContain(pathToTemporaryFile);
    expect(
      dependencyGraph[toAbsolute('file-b.ts')]?.dependentPaths,
      "should remove itself from dependents once it's unlinked",
    ).not.toContain(pathToTemporaryFile);
    expect(
      dependencyGraph[toAbsolute('general-importing-file.ts')]?.dependentPaths,
      "should remove itself from dependents once it's unlinked",
    ).not.toContain(pathToTemporaryFile);
  });
});
