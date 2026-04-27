import path from 'node:path';
import { createDependencyGraph } from './create-dependency-graph.js';

vi.mock('@babel/traverse', async () => {
  const traverse = await vi.importActual('@babel/traverse');
  return { default: traverse };
});

const fixtureDirectory = path.join(
  import.meta.dirname,
  './test/dynamic-import-graph',
);

describe('createDependencyGraph() with dynamic imports', () => {
  it('exposes the directory of a template-literal `import()` as a glob dependency and resolves runtime files to the importing module', async () => {
    const [, , { resolveDependentsOf, getGlobDependencyDirectories }] =
      await createDependencyGraph(fixtureDirectory);

    const messagesDirectory = path.join(fixtureDirectory, 'messages');
    const templatePath = path.join(fixtureDirectory, 'template.ts');

    expect(getGlobDependencyDirectories()).toEqual([messagesDirectory]);

    // A JSON file matched by the dynamic import has no graph node, but the
    // importing module should still be reported as a dependent so the preview
    // reloads when it changes.
    expect(
      resolveDependentsOf(path.join(messagesDirectory, 'en', 'common.json')),
    ).toEqual([templatePath]);
  });
});
