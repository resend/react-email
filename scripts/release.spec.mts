// @vitest-environment node
import type { Package } from '@manypkg/get-packages';
import { describe, expect, it, vi } from 'vitest';
import {
  buildPublishGraph,
  parseNpmVersions,
  publishInOrder,
  publishPackages,
  selectDistTag,
  topologicalSort,
} from './release.mts';

type PackageJson = Package['packageJson'] & {
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
};

const pkg = (name: string, packageJson: Partial<PackageJson> = {}): Package =>
  ({
    dir: `/fake/${name}`,
    packageJson: { name, version: '1.0.0', ...packageJson },
  }) as Package;

describe('parseNpmVersions', () => {
  it('parses a single published version', () => {
    expect(
      parseNpmVersions('pkg', { exitCode: 0, stdout: '"1.0.0"\n', stderr: '' }),
    ).toEqual(['1.0.0']);
  });

  it('parses a list of published versions', () => {
    expect(
      parseNpmVersions('pkg', {
        exitCode: 0,
        stdout: '["1.0.0","1.0.1"]',
        stderr: '',
      }),
    ).toEqual(['1.0.0', '1.0.1']);
  });

  it('treats a npm 404 as an unpublished package', () => {
    expect(
      parseNpmVersions('pkg', {
        exitCode: 1,
        stdout: '',
        stderr:
          'npm error code E404\nnpm error 404 Not Found - GET https://registry.npmjs.org/pkg',
      }),
    ).toEqual([]);
  });

  it('throws on any other registry error', () => {
    expect(() =>
      parseNpmVersions('pkg', {
        exitCode: 1,
        stdout: '',
        stderr: 'npm error code E429\nToo Many Requests',
      }),
    ).toThrow('Failed to read published versions for pkg');
  });
});

describe('selectDistTag', () => {
  it('tags a plain x.y.z release as latest', () => {
    expect(selectDistTag('6.5.0')).toBe('latest');
  });

  it('tags a prerelease with its prerelease identifier', () => {
    expect(selectDistTag('6.0.0-canary.2')).toBe('canary');
    expect(selectDistTag('1.0.0-alpha.7')).toBe('alpha');
    expect(selectDistTag('0.0.0-experimental.47')).toBe('experimental');
  });

  it('never tags a prerelease as latest', () => {
    expect(selectDistTag('6.4.0-local.0')).toBe('local');
  });
});

describe('buildPublishGraph', () => {
  it('keeps only dependencies within the publish set', () => {
    const graph = buildPublishGraph([
      pkg('a'),
      pkg('b', { dependencies: { a: '1.0.0', react: '19.0.0' } }),
    ]);
    expect(graph.get('a')).toEqual(new Set());
    expect(graph.get('b')).toEqual(new Set(['a']));
  });

  it('includes optional and required peer dependencies', () => {
    const graph = buildPublishGraph([
      pkg('a'),
      pkg('b'),
      pkg('c', {
        optionalDependencies: { a: '1.0.0' },
        peerDependencies: { b: '1.0.0' },
      }),
    ]);
    expect(graph.get('c')).toEqual(new Set(['a', 'b']));
  });

  it('ignores optional peer dependencies and devDependencies', () => {
    const graph = buildPublishGraph([
      pkg('a'),
      pkg('b'),
      pkg('c', {
        devDependencies: { a: '1.0.0' },
        peerDependencies: { b: '1.0.0' },
        peerDependenciesMeta: { b: { optional: true } },
      }),
    ]);
    expect(graph.get('c')).toEqual(new Set());
  });
});

describe('topologicalSort', () => {
  it('orders dependencies before their dependents', () => {
    const graph = new Map([
      ['components', new Set(['button', 'text'])],
      ['button', new Set<string>()],
      ['text', new Set<string>()],
    ]);
    const ordered = topologicalSort(graph);
    expect(ordered.indexOf('button')).toBeLessThan(
      ordered.indexOf('components'),
    );
    expect(ordered.indexOf('text')).toBeLessThan(ordered.indexOf('components'));
  });

  it('throws when the graph has a cycle', () => {
    const graph = new Map([
      ['a', new Set(['b'])],
      ['b', new Set(['a'])],
    ]);
    expect(() => topologicalSort(graph)).toThrow('dependency cycle');
  });
});

describe('publishInOrder', () => {
  it('publishes every package when none fail', async () => {
    const graph = new Map([
      ['button', new Set<string>()],
      ['components', new Set(['button'])],
    ]);
    const publish = vi.fn().mockResolvedValue(true);

    const result = await publishInOrder(
      ['button', 'components'],
      graph,
      publish,
    );

    expect(result).toEqual({
      published: ['button', 'components'],
      failed: [],
    });
    expect(publish).toHaveBeenCalledTimes(2);
  });

  it('skips dependents when a dependency fails (the #3045 fix)', async () => {
    const graph = new Map([
      ['button', new Set<string>()],
      ['text', new Set<string>()],
      ['components', new Set(['button', 'text'])],
    ]);
    const publish = vi.fn(async (name: string) => name !== 'button');

    const result = await publishInOrder(
      ['button', 'text', 'components'],
      graph,
      publish,
    );

    expect(result.published).toEqual(['text']);
    expect(result.failed).toEqual(['button', 'components']);
    // components must never be attempted once its dependency failed.
    expect(publish).not.toHaveBeenCalledWith('components');
  });

  it('propagates failures transitively down the dependency chain', async () => {
    const graph = new Map([
      ['a', new Set<string>()],
      ['b', new Set(['a'])],
      ['c', new Set(['b'])],
    ]);
    const publish = vi.fn(async (name: string) => name !== 'a');

    const result = await publishInOrder(['a', 'b', 'c'], graph, publish);

    expect(result.published).toEqual([]);
    expect(result.failed).toEqual(['a', 'b', 'c']);
    expect(publish).toHaveBeenCalledTimes(1);
  });
});

describe('publishPackages', () => {
  it('publishes only unpublished versions, in dependency order', async () => {
    const packages = [
      pkg('@react-email/components', {
        name: '@react-email/components',
        dependencies: { '@react-email/button': '1.0.0' },
      }),
      pkg('@react-email/button', { name: '@react-email/button' }),
      pkg('@react-email/private', {
        name: '@react-email/private',
        private: true,
      }),
    ];
    const publishOrder: string[] = [];

    const result = await publishPackages({
      packages,
      // button is new, components already has this version on npm.
      getPublishedVersions: async (name) =>
        name === '@react-email/components' ? ['1.0.0'] : [],
      publish: async (target) => {
        publishOrder.push(target.packageJson.name);
        return true;
      },
    });

    expect(publishOrder).toEqual(['@react-email/button']);
    expect(result.published).toEqual(['@react-email/button']);
    expect(result.failed).toEqual([]);
  });

  it('passes the version-derived dist-tag through to publish', async () => {
    const tags: Record<string, string> = {};

    await publishPackages({
      packages: [
        pkg('@react-email/button', {
          name: '@react-email/button',
          version: '1.0.0-canary.3',
        }),
        pkg('@react-email/render', {
          name: '@react-email/render',
          version: '2.0.0',
        }),
      ],
      getPublishedVersions: async () => [],
      publish: async (target, distTag) => {
        tags[target.packageJson.name] = distTag;
        return true;
      },
    });

    expect(tags['@react-email/button']).toBe('canary');
    expect(tags['@react-email/render']).toBe('latest');
  });
});
