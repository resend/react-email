import path from 'node:path';
import { existsSync, promises as fs } from 'node:fs';
import {
  DependencyGraph,
  createDependencyGraph,
} from './create-dependency-graph';

const pathToFileForTestingDependencyGraph = path.join(
  __dirname,
  '.for-dependency-graph.ts',
);

test('createDependencyGraph()', async () => {
  if (existsSync(pathToFileForTestingDependencyGraph)) {
    await fs.rm(pathToFileForTestingDependencyGraph);
  }

  const [dependencyGraph, updateDependencyGraph] =
    await createDependencyGraph(__dirname);

  const convertPathsToAbsolute = (graph: DependencyGraph) => {
    return Object.fromEntries(
      Object.entries(graph).map(([relativePath, module]) => {
        return [
          path.resolve(__dirname, relativePath),
          {
            path: path.resolve(__dirname, relativePath),
            dependencyPaths: module.dependencyPaths.map((p) =>
              path.resolve(__dirname, p),
            ),
            dependentPaths: module.dependentPaths.map((p) =>
              path.resolve(__dirname, p),
            ),
            moduleDependencies: module.moduleDependencies,
          },
        ];
      }),
    );
  };

  const initialDependencyGraph = convertPathsToAbsolute({
    'create-dependency-graph.ts': {
      path: 'create-dependency-graph.ts',
      dependencyPaths: ['get-imported-modules.ts'],
      dependentPaths: ['create-dependency-graph.spec.ts', 'setup-hot-reloading.ts'],
      moduleDependencies: ['node:path', 'node:fs'],
    },
    'create-dependency-graph.spec.ts': {
      path: 'create-dependency-graph.spec.ts',
      dependencyPaths: ['create-dependency-graph.ts'],
      dependentPaths: [],
      moduleDependencies: ['node:path', 'node:fs'],
    },
    'get-imported-modules.ts': {
      path: 'get-imported-modules',
      dependentPaths: [
        'create-dependency-graph.ts',
        'get-imported-modules.spec.ts',
      ],
      dependencyPaths: [],
      moduleDependencies: ['@babel/parser', 'babel-walk'],
    },
    'get-imported-modules.spec.ts': {
      path: 'get-imported-modules.spec.ts',
      dependencyPaths: ['get-imported-modules.ts'],
      dependentPaths: [],
      moduleDependencies: ['node:fs'],
    },
    'setup-hot-reloading.ts': {
      path: 'setup-hot-reloading.ts',
      dependencyPaths: ['../../../../utils/types/hot-reload-change.ts', 'create-dependency-graph.ts'],
      dependentPaths: [],
      moduleDependencies: [
        'node:http',
        'node:path',
        'socket.io',
        'chokidar',
        'debounce',
      ],
    },
    '../../../../utils/types/hot-reload-change.ts': {
      path: '../../../../utils/types/hot-reload-change.ts',
      dependencyPaths: [],
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
    dependencyGraph,
    'should update properly when adding new files in',
  ).toEqual(
    convertPathsToAbsolute({
      '.for-dependency-graph.ts': {
        path: 'setup-hot-reloading.ts',
        dependencyPaths: [
          'setup-hot-reloading.ts',
          'get-imported-modules.ts',
          'create-dependency-graph.ts',
        ],
        dependentPaths: [],
        moduleDependencies: [],
      },
      'create-dependency-graph.ts': {
        path: 'create-dependency-graph.ts',
        dependencyPaths: ['get-imported-modules.ts'],
        dependentPaths: [
          'create-dependency-graph.spec.ts',
          'setup-hot-reloading.ts',
          '.for-dependency-graph.ts'
        ],
        moduleDependencies: ['node:path', 'node:fs'],
      },
      'create-dependency-graph.spec.ts': {
        path: 'create-dependency-graph.spec.ts',
        dependencyPaths: ['create-dependency-graph.ts'],
        dependentPaths: [],
        moduleDependencies: ['node:path', 'node:fs'],
      },
      'get-imported-modules.ts': {
        path: 'get-imported-modules',
        dependentPaths: [
          'create-dependency-graph.ts',
          'get-imported-modules.spec.ts',
          '.for-dependency-graph.ts',
        ],
        dependencyPaths: [],
        moduleDependencies: ['@babel/parser', 'babel-walk'],
      },
      'get-imported-modules.spec.ts': {
        path: 'get-imported-modules.spec.ts',
        dependencyPaths: ['get-imported-modules.ts'],
        dependentPaths: [],
        moduleDependencies: ['node:fs'],
      },
      'setup-hot-reloading.ts': {
        path: 'setup-hot-reloading.ts',
        dependencyPaths: ['../../../../utils/types/hot-reload-change.ts', 'create-dependency-graph.ts'],
        dependentPaths: ['.for-dependency-graph.ts'],
        moduleDependencies: [
          'node:http',
          'node:path',
          'socket.io',
          'chokidar',
          'debounce',
        ],
      },
      '../../../../utils/types/hot-reload-change.ts': {
        path: '../../../../utils/types/hot-reload-change.ts',
        dependencyPaths: [],
        dependentPaths: ['setup-hot-reloading.ts'],
        moduleDependencies: [],
      },
    } satisfies DependencyGraph),
  );

  await fs.writeFile(
    pathToFileForTestingDependencyGraph,
    `
import {} from './setup-hot-reloading';
import {} from './get-imported-modules';
import {} from './create-dependency-graph.ts';
`,
    'utf8',
  );
  await updateDependencyGraph('change', pathToFileForTestingDependencyGraph);
  expect(
    dependencyGraph,
    'should update properly when modifying existing files',
  ).toEqual(
    convertPathsToAbsolute({
      '.for-dependency-graph.ts': {
        path: 'setup-hot-reloading.ts',
        dependencyPaths: [
          'setup-hot-reloading.ts',
          'get-imported-modules.ts',
          'create-dependency-graph.ts',
        ],
        dependentPaths: [],
        moduleDependencies: [],
      },
      'create-dependency-graph.ts': {
        path: 'create-dependency-graph.ts',
        dependencyPaths: ['get-imported-modules.ts'],
        dependentPaths: [
          'create-dependency-graph.spec.ts',
          'setup-hot-reloading.ts',
          '.for-dependency-graph.ts',
        ],
        moduleDependencies: ['node:path', 'node:fs'],
      },
      'create-dependency-graph.spec.ts': {
        path: 'create-dependency-graph.spec.ts',
        dependencyPaths: ['create-dependency-graph.ts'],
        dependentPaths: [],
        moduleDependencies: ['node:path', 'node:fs'],
      },
      'get-imported-modules.ts': {
        path: 'get-imported-modules',
        dependentPaths: [
          'create-dependency-graph.ts',
          'get-imported-modules.spec.ts',
          '.for-dependency-graph.ts',
        ],
        dependencyPaths: [],
        moduleDependencies: ['@babel/parser', 'babel-walk'],
      },
      'get-imported-modules.spec.ts': {
        path: 'get-imported-modules.spec.ts',
        dependencyPaths: ['get-imported-modules.ts'],
        dependentPaths: [],
        moduleDependencies: ['node:fs'],
      },
      'setup-hot-reloading.ts': {
        path: 'setup-hot-reloading.ts',
        dependencyPaths: ['../../../../utils/types/hot-reload-change.ts', 'create-dependency-graph.ts'],
        dependentPaths: ['.for-dependency-graph.ts'],
        moduleDependencies: [
          'node:http',
          'node:path',
          'socket.io',
          'chokidar',
          'debounce',
        ],
      },
      '../../../../utils/types/hot-reload-change.ts': {
        path: '../../../../utils/types/hot-reload-change.ts',
        dependencyPaths: [],
        dependentPaths: ['setup-hot-reloading.ts'],
        moduleDependencies: [],
      },
    } satisfies DependencyGraph),
  );

  await fs.rm(pathToFileForTestingDependencyGraph);
  await updateDependencyGraph('unlink', pathToFileForTestingDependencyGraph);
  expect(dependencyGraph, 'should work when deleting files').toEqual(
    initialDependencyGraph,
  );
});
