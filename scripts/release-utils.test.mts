import { describe, it, expect, vi } from 'vitest';
import {
  buildPublishDeps,
  topologicalSort,
  publishInOrder,
  topologicalPublish,
  topologicalPublishDryRun,
  type PackageInfo,
  type WorkspacePackage,
} from './release-utils.mts';

describe('buildPublishDeps', () => {
  it('returns empty deps for packages with no workspace dependencies', () => {
    const packages: PackageInfo[] = [
      { name: 'a', version: '1.0.0' },
      { name: 'b', version: '1.0.0' },
    ];
    const deps = buildPublishDeps(packages);
    expect(deps.get('a')).toEqual(new Set());
    expect(deps.get('b')).toEqual(new Set());
  });

  it('includes dependencies that are in the publish set', () => {
    const packages: PackageInfo[] = [
      { name: 'a', version: '1.0.0' },
      { name: 'b', version: '1.0.0', dependencies: { a: '1.0.0' } },
    ];
    const deps = buildPublishDeps(packages);
    expect(deps.get('a')).toEqual(new Set());
    expect(deps.get('b')).toEqual(new Set(['a']));
  });

  it('excludes dependencies not in the publish set', () => {
    const packages: PackageInfo[] = [
      {
        name: 'b',
        version: '1.0.0',
        dependencies: { a: '1.0.0', react: '19.0.0' },
      },
    ];
    const deps = buildPublishDeps(packages);
    expect(deps.get('b')).toEqual(new Set());
  });

  it('includes devDependencies that are in the publish set', () => {
    const packages: PackageInfo[] = [
      { name: 'a', version: '1.0.0' },
      { name: 'b', version: '1.0.0', devDependencies: { a: '1.0.0' } },
    ];
    const deps = buildPublishDeps(packages);
    expect(deps.get('b')).toEqual(new Set(['a']));
  });

  it('merges dependencies and devDependencies', () => {
    const packages: PackageInfo[] = [
      { name: 'a', version: '1.0.0' },
      { name: 'c', version: '1.0.0' },
      {
        name: 'b',
        version: '1.0.0',
        dependencies: { a: '1.0.0' },
        devDependencies: { c: '1.0.0' },
      },
    ];
    const deps = buildPublishDeps(packages);
    expect(deps.get('b')).toEqual(new Set(['a', 'c']));
  });

  it('models the @react-email/components pattern', () => {
    const leafPackages = ['body', 'button', 'text', 'render'].map((n) => ({
      name: `@react-email/${n}`,
      version: '1.0.0',
    }));
    const components: PackageInfo = {
      name: '@react-email/components',
      version: '1.0.0',
      dependencies: Object.fromEntries(
        leafPackages.map((p) => [p.name, p.version]),
      ),
    };
    const deps = buildPublishDeps([...leafPackages, components]);
    expect(deps.get('@react-email/components')).toEqual(
      new Set(leafPackages.map((p) => p.name)),
    );
    for (const leaf of leafPackages) {
      expect(deps.get(leaf.name)).toEqual(new Set());
    }
  });
});

describe('topologicalSort', () => {
  it('returns a single package', () => {
    const deps = new Map([['a', new Set<string>()]]);
    expect(topologicalSort(deps)).toEqual(['a']);
  });

  it('puts leaf packages before their dependents', () => {
    const deps = new Map([
      ['a', new Set<string>()],
      ['b', new Set(['a'])],
    ]);
    const sorted = topologicalSort(deps);
    expect(sorted.indexOf('a')).toBeLessThan(sorted.indexOf('b'));
  });

  it('sorts a diamond dependency graph correctly', () => {
    // d depends on b and c, both depend on a
    const deps = new Map([
      ['a', new Set<string>()],
      ['b', new Set(['a'])],
      ['c', new Set(['a'])],
      ['d', new Set(['b', 'c'])],
    ]);
    const sorted = topologicalSort(deps);
    expect(sorted.indexOf('a')).toBeLessThan(sorted.indexOf('b'));
    expect(sorted.indexOf('a')).toBeLessThan(sorted.indexOf('c'));
    expect(sorted.indexOf('b')).toBeLessThan(sorted.indexOf('d'));
    expect(sorted.indexOf('c')).toBeLessThan(sorted.indexOf('d'));
  });

  it('sorts independent packages (stable output)', () => {
    const deps = new Map([
      ['a', new Set<string>()],
      ['b', new Set<string>()],
      ['c', new Set<string>()],
    ]);
    const sorted = topologicalSort(deps);
    expect(sorted).toHaveLength(3);
    expect(new Set(sorted)).toEqual(new Set(['a', 'b', 'c']));
  });

  it('handles @react-email/components depending on many leaves', () => {
    const leaves = ['body', 'button', 'text', 'render', 'tailwind'];
    const deps = new Map<string, Set<string>>();
    for (const leaf of leaves) {
      deps.set(`@react-email/${leaf}`, new Set());
    }
    deps.set('@react-email/components', new Set(leaves.map((l) => `@react-email/${l}`)));

    const sorted = topologicalSort(deps);
    const componentsIdx = sorted.indexOf('@react-email/components');
    for (const leaf of leaves) {
      expect(sorted.indexOf(`@react-email/${leaf}`)).toBeLessThan(
        componentsIdx,
      );
    }
  });

  it('throws on circular dependencies', () => {
    const deps = new Map([
      ['a', new Set(['b'])],
      ['b', new Set(['a'])],
    ]);
    expect(() => topologicalSort(deps)).toThrow('Circular dependency');
  });

  it('throws on a cycle in a larger graph', () => {
    const deps = new Map([
      ['a', new Set<string>()],
      ['b', new Set(['c'])],
      ['c', new Set(['d'])],
      ['d', new Set(['b'])],
    ]);
    expect(() => topologicalSort(deps)).toThrow('Circular dependency');
    try {
      topologicalSort(deps);
    } catch (e) {
      const msg = (e as Error).message;
      // 'a' is not in the cycle, only b, c, d are
      // Extract the package list from the message
      const listed = msg.split(': ')[1]?.split(', ') ?? [];
      expect(listed).toContain('b');
      expect(listed).toContain('c');
      expect(listed).toContain('d');
      expect(listed).not.toContain('a');
    }
  });
});

describe('publishInOrder', () => {
  it('publishes all packages when all succeed', async () => {
    const deps = new Map([
      ['a', new Set<string>()],
      ['b', new Set(['a'])],
    ]);
    const sorted = ['a', 'b'];
    const calls: string[] = [];

    const result = await publishInOrder(sorted, deps, async (name) => {
      calls.push(name);
      return true;
    });

    expect(result.published).toEqual(['a', 'b']);
    expect(result.failed).toEqual([]);
    expect(calls).toEqual(['a', 'b']);
  });

  it('skips dependents when a dependency fails', async () => {
    const deps = new Map([
      ['a', new Set<string>()],
      ['b', new Set(['a'])],
      ['c', new Set(['b'])],
    ]);
    const sorted = ['a', 'b', 'c'];

    const result = await publishInOrder(sorted, deps, async (name) => {
      return name !== 'a'; // a fails
    });

    expect(result.published).toEqual([]);
    expect(result.failed).toEqual(['a', 'b', 'c']);
  });

  it('continues publishing independent packages when one fails', async () => {
    // a and b are independent, c depends on a
    const deps = new Map([
      ['a', new Set<string>()],
      ['b', new Set<string>()],
      ['c', new Set(['a'])],
    ]);
    const sorted = ['a', 'b', 'c'];

    const result = await publishInOrder(sorted, deps, async (name) => {
      return name !== 'a'; // a fails
    });

    expect(result.published).toEqual(['b']);
    expect(result.failed).toEqual(expect.arrayContaining(['a', 'c']));
    expect(result.failed).not.toContain('b');
  });

  it('skips transitively when a deep dependency fails', async () => {
    const deps = new Map([
      ['a', new Set<string>()],
      ['b', new Set(['a'])],
      ['c', new Set(['b'])],
      ['d', new Set(['c'])],
    ]);
    const sorted = ['a', 'b', 'c', 'd'];

    const calls: string[] = [];
    const result = await publishInOrder(sorted, deps, async (name) => {
      calls.push(name);
      return name !== 'b'; // b fails
    });

    expect(calls).toEqual(['a', 'b']); // c and d never attempted
    expect(result.published).toEqual(['a']);
    expect(result.failed).toEqual(['b', 'c', 'd']);
  });

  it('does not call publishFn for skipped packages', async () => {
    const deps = new Map([
      ['a', new Set<string>()],
      ['b', new Set(['a'])],
    ]);
    const sorted = ['a', 'b'];
    const calls: string[] = [];

    await publishInOrder(sorted, deps, async (name) => {
      calls.push(name);
      return false; // a fails
    });

    expect(calls).toEqual(['a']); // b was never called
  });

  it('handles an empty list', async () => {
    const result = await publishInOrder([], new Map(), async () => true);
    expect(result.published).toEqual([]);
    expect(result.failed).toEqual([]);
  });

  it('models partial failure in @react-email pattern', async () => {
    // button fails -> components should be skipped, but text succeeds
    const deps = new Map([
      ['@react-email/text', new Set<string>()],
      ['@react-email/button', new Set<string>()],
      [
        '@react-email/components',
        new Set(['@react-email/text', '@react-email/button']),
      ],
    ]);
    const sorted = ['@react-email/text', '@react-email/button', '@react-email/components'];

    const result = await publishInOrder(sorted, deps, async (name) => {
      return name !== '@react-email/button';
    });

    expect(result.published).toEqual(['@react-email/text']);
    expect(result.failed).toContain('@react-email/button');
    expect(result.failed).toContain('@react-email/components');
  });
});

const mkPkg = (
  name: string,
  version = '1.0.0',
  deps?: Record<string, string>,
  devDeps?: Record<string, string>,
): WorkspacePackage => ({
  name,
  version,
  dir: `/fake/${name}`,
  dependencies: deps,
  devDependencies: devDeps,
});

describe('topologicalPublish', () => {
  it('skips already-published packages', async () => {
    const packages = [mkPkg('a'), mkPkg('b')];
    const publishCalls: string[] = [];

    const result = await topologicalPublish({
      packages,
      checkPublished: async () => true, // all already published
      publish: async (pkg) => {
        publishCalls.push(pkg.name);
        return true;
      },
    });

    expect(result.published).toEqual([]);
    expect(result.failed).toEqual([]);
    expect(publishCalls).toEqual([]);
  });

  it('publishes unpublished packages in dependency order', async () => {
    const packages = [
      mkPkg('a'),
      mkPkg('b', '1.0.0', { a: '1.0.0' }),
    ];
    const publishCalls: string[] = [];

    const result = await topologicalPublish({
      packages,
      checkPublished: async () => false,
      publish: async (pkg) => {
        publishCalls.push(pkg.name);
        return true;
      },
    });

    expect(result.published).toEqual(['a', 'b']);
    expect(publishCalls).toEqual(['a', 'b']);
  });

  it('skips private packages', async () => {
    const packages = [
      { ...mkPkg('a'), private: true },
      mkPkg('b'),
    ];
    const publishCalls: string[] = [];

    const result = await topologicalPublish({
      packages,
      checkPublished: async () => false,
      publish: async (pkg) => {
        publishCalls.push(pkg.name);
        return true;
      },
    });

    expect(publishCalls).toEqual(['b']);
    expect(result.published).toEqual(['b']);
  });

  it('propagates failures transitively', async () => {
    const packages = [
      mkPkg('a'),
      mkPkg('b', '1.0.0', { a: '1.0.0' }),
      mkPkg('c', '1.0.0', { b: '1.0.0' }),
    ];

    const result = await topologicalPublish({
      packages,
      checkPublished: async () => false,
      publish: async (pkg) => pkg.name !== 'a',
    });

    expect(result.published).toEqual([]);
    expect(result.failed).toEqual(['a', 'b', 'c']);
  });

  it('only publishes packages not yet on the registry', async () => {
    const packages = [
      mkPkg('a'),
      mkPkg('b', '1.0.0', { a: '1.0.0' }),
    ];
    const publishCalls: string[] = [];

    const result = await topologicalPublish({
      packages,
      checkPublished: async (name) => name === 'a', // a already published
      publish: async (pkg) => {
        publishCalls.push(pkg.name);
        return true;
      },
    });

    // Only b needs publishing; its dep on a is already published so no failure
    expect(publishCalls).toEqual(['b']);
    expect(result.published).toEqual(['b']);
  });
});

describe('topologicalPublishDryRun', () => {
  it('does not call publish, logs plan', async () => {
    const packages = [
      mkPkg('a'),
      mkPkg('b', '1.0.0', { a: '1.0.0' }),
    ];
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await topologicalPublishDryRun({
      packages,
      distTag: 'latest',
      buildFailed: false,
      checkPublished: async () => false,
      checkBuildStatus: async () => true,
    });

    const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('[built] a@1.0.0');
    expect(output).toContain('[built] b@1.0.0');
    expect(output).toContain('Dry run complete');
    // a should appear before b
    expect(output.indexOf('a@1.0.0')).toBeLessThan(output.indexOf('b@1.0.0'));

    logSpy.mockRestore();
  });

  it('reports build failures when build failed', async () => {
    const packages = [mkPkg('a')];
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await topologicalPublishDryRun({
      packages,
      distTag: 'canary',
      buildFailed: true,
      checkPublished: async () => false,
      checkBuildStatus: async () => false, // dist dir missing
    });

    const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('[build failed]');
    expect(output).toContain('canary');

    logSpy.mockRestore();
  });

  it('shows dependency info in output', async () => {
    const packages = [
      mkPkg('a'),
      mkPkg('b', '1.0.0', { a: '1.0.0' }),
    ];
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await topologicalPublishDryRun({
      packages,
      distTag: 'latest',
      buildFailed: false,
      checkPublished: async () => false,
      checkBuildStatus: async () => true,
    });

    const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('depends on: a');

    logSpy.mockRestore();
  });
});
