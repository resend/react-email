import path from 'node:path';
import {
  createDependencyGraph,
  isUnderDirectory,
} from './create-dependency-graph.js';

vi.mock('@babel/traverse', async () => {
  const traverse = await vi.importActual('@babel/traverse');
  return { default: traverse };
});

const fixtureDirectory = path.join(
  import.meta.dirname,
  './test/dynamic-import-graph',
);

const aliasedFixtureDirectory = path.join(
  import.meta.dirname,
  './test/aliased-import-graph/src',
);

const aliasedFallbackFixtureDirectory = path.join(
  import.meta.dirname,
  './test/aliased-fallback-graph/src',
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

  it('falls through to a later alias candidate when the first does not exist on disk', async () => {
    // tsconfig maps `@/*` to `["src/*", "lib/*"]`. The fixture has no
    // `src/locales` directory but does have `lib/locales`. The resolver must
    // skip the missing first candidate instead of returning it.
    const [, , { resolveDependentsOf, getGlobDependencyDirectories }] =
      await createDependencyGraph(aliasedFallbackFixtureDirectory);

    const localesDirectory = path.join(
      path.dirname(aliasedFallbackFixtureDirectory),
      'lib',
      'locales',
    );
    const templatePath = path.join(
      aliasedFallbackFixtureDirectory,
      'template.ts',
    );

    expect(getGlobDependencyDirectories()).toEqual([localesDirectory]);

    expect(
      resolveDependentsOf(path.join(localesDirectory, 'de', 'common.json')),
    ).toEqual([templatePath]);
  });

  it('resolves tsconfig path aliases in dynamic import template literals', async () => {
    const [, , { resolveDependentsOf, getGlobDependencyDirectories }] =
      await createDependencyGraph(aliasedFixtureDirectory);

    // The template uses `@/locales/${lng}/${ns}.json`, and the fixture's
    // tsconfig maps `@/*` -> `src/*`. The resolved glob directory must be the
    // real `src/locales/` folder, not be discarded as a bare specifier.
    const localesDirectory = path.join(aliasedFixtureDirectory, 'locales');
    const templatePath = path.join(aliasedFixtureDirectory, 'template.ts');

    expect(getGlobDependencyDirectories()).toEqual([localesDirectory]);

    expect(
      resolveDependentsOf(path.join(localesDirectory, 'tr', 'common.json')),
    ).toEqual([templatePath]);
  });
});

describe('isUnderDirectory()', () => {
  it('matches a nested file', () => {
    expect(
      isUnderDirectory(
        path.resolve('/proj/messages/en.json'),
        path.resolve('/proj/messages'),
      ),
    ).toBe(true);
  });

  it('matches the directory itself', () => {
    expect(
      isUnderDirectory(
        path.resolve('/proj/messages'),
        path.resolve('/proj/messages'),
      ),
    ).toBe(true);
  });

  it('does not match a sibling sharing a prefix', () => {
    expect(
      isUnderDirectory(
        path.resolve('/proj/messages-extra/x'),
        path.resolve('/proj/messages'),
      ),
    ).toBe(false);
  });

  it('handles root directory paths without producing a double separator', () => {
    // Regression: previously `'/' + path.sep === '//'`, so `/foo` was reported
    // as not under `/`.
    expect(isUnderDirectory(path.resolve('/foo/bar'), path.sep)).toBe(true);
    expect(isUnderDirectory(path.sep, path.sep)).toBe(true);
  });
});
