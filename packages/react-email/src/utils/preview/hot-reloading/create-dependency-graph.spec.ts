import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import {
  createDependencyGraph,
  type DependencyGraph,
} from './create-dependency-graph.js';

const pathToFileForTestingDependencyGraph = path.join(
  __dirname,
  '.for-dependency-graph.ts',
);

vi.mock('@babel/traverse', async () => {
  const traverse = await vi.importActual('@babel/traverse');
  return { default: traverse };
});

test('createDependencyGraph()', async () => {
  if (existsSync(pathToFileForTestingDependencyGraph)) {
    await fs.rm(pathToFileForTestingDependencyGraph);
  }

  const [dependencyGraph, updateDependencyGraph] =
    await createDependencyGraph(__dirname);

  const toAbsolute = (relativePath: string) => {
    return path.resolve(__dirname, relativePath);
  };

  const convertPathsToAbsolute = (graph: DependencyGraph) => {
    return Object.fromEntries(
      Object.entries(graph).map(([relativePath, module]) => {
        return [
          toAbsolute(relativePath),
          {
            path: toAbsolute(relativePath),
            dependencyPaths: module.dependencyPaths.map((p) => toAbsolute(p)),
            dependentPaths: module.dependentPaths.map((p) => toAbsolute(p)),
            moduleDependencies: module.moduleDependencies,
          },
        ];
      }),
    );
  };

  const initialDependencyGraph = convertPathsToAbsolute({
    'create-dependency-graph.ts': {
      path: 'create-dependency-graph.ts',
      dependencyPaths: ['get-imported-modules.ts', 'resolve-path-aliases.ts'],
      dependentPaths: [
        'create-dependency-graph.spec.ts',
        'setup-hot-reloading.ts',
      ],
      moduleDependencies: ['node:fs', 'node:path', 'chokidar/handler.js'],
    },
    'create-dependency-graph.spec.ts': {
      path: 'create-dependency-graph.spec.ts',
      dependencyPaths: ['create-dependency-graph.ts'],
      dependentPaths: [],
      moduleDependencies: ['node:fs', 'node:path'],
    },
    './test/some-file.ts': {
      dependencyPaths: [],
      dependentPaths: [],
      moduleDependencies: [],
      path: '/home/gabriel/Projects/Resend/react-email/packages/react-email/src/cli/utils/preview/hot-reloading/test/some-file.ts',
    },
    'resolve-path-aliases.ts': {
      path: 'resolve-path-aliases.ts',
      dependentPaths: [
        'create-dependency-graph.ts',
        'resolve-path-aliases.spec.ts',
      ],
      dependencyPaths: [],
      moduleDependencies: ['node:path', 'tsconfig-paths'],
    },
    'resolve-path-aliases.spec.ts': {
      path: 'resolve-path-aliases.spec.ts',
      dependencyPaths: ['resolve-path-aliases.ts'],
      dependentPaths: [],
      moduleDependencies: ['node:path'],
    },
    'get-imported-modules.ts': {
      path: 'get-imported-modules',
      dependentPaths: [
        'create-dependency-graph.ts',
        'get-imported-modules.spec.ts',
      ],
      dependencyPaths: [],
      moduleDependencies: ['@babel/parser', '@babel/traverse'],
    },
    'get-imported-modules.spec.ts': {
      path: 'get-imported-modules.spec.ts',
      dependencyPaths: ['get-imported-modules.ts'],
      dependentPaths: [],
      moduleDependencies: ['node:fs'],
    },
    'setup-hot-reloading.ts': {
      path: 'setup-hot-reloading.ts',
      dependencyPaths: [
        '../../types/hot-reload-change.ts',
        'create-dependency-graph.ts',
      ],
      dependentPaths: [],
      moduleDependencies: [
        'node:http',
        'node:path',
        'chokidar',
        'debounce',
        'socket.io',
      ],
    },
    '../../types/hot-reload-event.ts': {
      dependencyPaths: [],
      dependentPaths: ['../../types/hot-reload-change.ts'],
      moduleDependencies: ['chokidar/handler.js'],
      path: '../../types/hot-reload-event.ts',
    },
    '../../types/hot-reload-change.ts': {
      path: '../../types/hot-reload-change.ts',
      dependencyPaths: ['../../types/hot-reload-event.ts'],
      dependentPaths: ['setup-hot-reloading.ts'],
      moduleDependencies: [],
    },
  } satisfies DependencyGraph);

  expect(
    dependencyGraph,
    'the initial value for the dependency graph should work with the directory of this testing file',
  ).toEqual(initialDependencyGraph);

  await fs.writeFile(
    pathToFileForTestingDependencyGraph,
    `
import {} from './setup-hot-reloading';
import {} from './get-imported-modules';
import {} from './create-dependency-graph.ts';
`,
    'utf8',
  );
  await updateDependencyGraph('add', pathToFileForTestingDependencyGraph);
  expect(
    dependencyGraph[pathToFileForTestingDependencyGraph],
    'added file to have proper dependency paths',
  ).toEqual({
    path: pathToFileForTestingDependencyGraph,
    dependentPaths: [],
    dependencyPaths: [
      toAbsolute('setup-hot-reloading.ts'),
      toAbsolute('get-imported-modules.ts'),
      toAbsolute('create-dependency-graph.ts'),
    ],
    moduleDependencies: [],
  } satisfies DependencyGraph[number]);
  expect(
    dependencyGraph[toAbsolute('setup-hot-reloading.ts')]?.dependentPaths,
  ).toContain(pathToFileForTestingDependencyGraph);
  expect(
    dependencyGraph[toAbsolute('get-imported-modules.ts')]?.dependentPaths,
  ).toContain(pathToFileForTestingDependencyGraph);
  expect(
    dependencyGraph[toAbsolute('create-dependency-graph.ts')]?.dependentPaths,
  ).toContain(pathToFileForTestingDependencyGraph);

  await fs.writeFile(
    pathToFileForTestingDependencyGraph,
    `
import {} from './setup-hot-reloading';
import {} from './create-dependency-graph.ts';
`,
    'utf8',
  );
  await updateDependencyGraph('change', pathToFileForTestingDependencyGraph);
  expect(
    dependencyGraph[pathToFileForTestingDependencyGraph],
    'changed file to have updated dependencyPaths',
  ).toEqual({
    path: pathToFileForTestingDependencyGraph,
    dependentPaths: [],
    dependencyPaths: [
      toAbsolute('setup-hot-reloading.ts'),
      toAbsolute('create-dependency-graph.ts'),
    ],
    moduleDependencies: [],
  } satisfies DependencyGraph[number]);
  expect(
    dependencyGraph[toAbsolute('setup-hot-reloading.ts')]?.dependentPaths,
  ).toContain(pathToFileForTestingDependencyGraph);
  expect(
    dependencyGraph[toAbsolute('get-imported-modules.ts')]?.dependentPaths,
    'when removing dependency on a file, the dependency should have its dependents updated to not have the testing file again',
  ).not.toContain(pathToFileForTestingDependencyGraph);
  expect(
    dependencyGraph[toAbsolute('create-dependency-graph.ts')]?.dependentPaths,
  ).toContain(pathToFileForTestingDependencyGraph);

  await fs.rm(pathToFileForTestingDependencyGraph);
  await updateDependencyGraph('unlink', pathToFileForTestingDependencyGraph);
  expect(dependencyGraph[pathToFileForTestingDependencyGraph]).toBeUndefined();
  expect(
    dependencyGraph[toAbsolute('setup-hot-reloading.ts')]?.dependentPaths,
    "should remove itself from dependents once it's unlinked",
  ).not.toContain(pathToFileForTestingDependencyGraph);
  expect(
    dependencyGraph[toAbsolute('get-imported-modules.ts')]?.dependentPaths,
    "should remove itself from dependents once it's unlinked",
  ).not.toContain(pathToFileForTestingDependencyGraph);
  expect(
    dependencyGraph[toAbsolute('create-dependency-graph.ts')]?.dependentPaths,
    "should remove itself from dependents once it's unlinked",
  ).not.toContain(pathToFileForTestingDependencyGraph);
});
