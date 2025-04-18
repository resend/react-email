import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import {
  createDependencyGraph,
  type DependencyGraph,
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
    '../../../../../package.json': {
      dependencyPaths: [],
      dependentPaths: ['../start-dev-server.ts'],
      moduleDependencies: [],
      path: '../../../../../package.json',
    },
    'create-dependency-graph.ts': {
      path: 'create-dependency-graph.ts',
      dependencyPaths: ['../start-dev-server.ts', 'get-imported-modules.ts'],
      dependentPaths: [
        'create-dependency-graph.spec.ts',
        'setup-hot-reloading.ts',
      ],
      moduleDependencies: ['node:fs', 'node:path', 'chokidar/handler'],
    },
    'create-dependency-graph.spec.ts': {
      path: 'create-dependency-graph.spec.ts',
      dependencyPaths: ['create-dependency-graph.ts'],
      dependentPaths: [],
      moduleDependencies: ['node:fs', 'node:path'],
    },
    '../../../utils/preview/get-env-variables-for-preview-app.ts': {
      dependencyPaths: ['../../../utils/preview/start-dev-server.ts'],
      dependentPaths: ['../../../utils/preview/start-dev-server.ts'],
      moduleDependencies: ['node:path'],
      path: '../../../utils/preview/get-env-variables-for-preview-app.ts',
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
        '../../../../utils/types/hot-reload-change.ts',
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
    '../start-dev-server.ts': {
      dependencyPaths: [
        '../../../../../package.json',
        '../../../../utils/register-spinner-autostopping.ts',
        '../../../utils/preview/get-env-variables-for-preview-app.ts',
        '../../../utils/preview/serve-static-file.ts',
      ],
      path: '../start-dev-server.ts',
      dependentPaths: [
        '../../../utils/preview/get-env-variables-for-preview-app.ts',
        'create-dependency-graph.ts',
      ],
      moduleDependencies: [
        'node:http',
        'node:path',
        'node:url',
        'chalk',
        'log-symbols',
        'next',
        'ora',
      ],
    },
    '../../../utils/preview/serve-static-file.ts': {
      dependencyPaths: [],
      dependentPaths: ['../../../utils/preview/start-dev-server.ts'],
      moduleDependencies: [
        'node:fs',
        'node:http',
        'node:path',
        'node:url',
        'mime-types',
      ],
      path: '../../../utils/preview/serve-static-file.ts',
    },
    '../../../../utils/register-spinner-autostopping.ts': {
      dependencyPaths: [],
      dependentPaths: ['../../../utils/preview/start-dev-server.ts'],
      moduleDependencies: ['log-symbols', 'ora'],
      path: '../../../../utils/register-spinner-autostopping.ts',
    },
    '../../../../utils/types/hot-reload-event.ts': {
      dependencyPaths: [],
      dependentPaths: ['../../../../utils/types/hot-reload-change.ts'],
      moduleDependencies: ['chokidar/handler'],
      path: '../../../../utils/types/hot-reload-event.ts',
    },
    '../../../../utils/types/hot-reload-change.ts': {
      path: '../../../../utils/types/hot-reload-change.ts',
      dependencyPaths: ['../../../../utils/types/hot-reload-event.ts'],
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
