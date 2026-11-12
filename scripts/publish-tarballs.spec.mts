// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { findManifestProblems, publishInOrder } from './publish-tarballs.mjs';

const entry = (name: string, dependsOn: string[] = []) => ({
  name,
  dependsOn,
});

describe('findManifestProblems', () => {
  const expected = new Map([['@react-email/render', '2.4.0']]);
  const manifestEntry = {
    name: '@react-email/render',
    version: '2.4.0',
    distTag: 'latest',
    tarball: 'react-email-render-2.4.0.tgz',
    dependsOn: [],
  };
  const matchingTarball = () => ({
    name: '@react-email/render',
    version: '2.4.0',
  });

  it('accepts an entry that matches the commit and its tarball', () => {
    expect(
      findManifestProblems([manifestEntry], expected, matchingTarball),
    ).toEqual([]);
  });

  it('rejects a version that is not in the commit', () => {
    expect(
      findManifestProblems(
        [{ ...manifestEntry, version: '99.0.0' }],
        expected,
        matchingTarball,
      ),
    ).toHaveLength(1);
  });

  it('rejects a package that is not in the commit', () => {
    expect(
      findManifestProblems(
        [{ ...manifestEntry, name: 'left-pad' }],
        expected,
        matchingTarball,
      ),
    ).toHaveLength(1);
  });

  it.each([
    '.',
    '../react-email-render-2.4.0.tgz',
    'sub/react-email-render-2.4.0.tgz',
    'react-email-render',
  ])('rejects the tarball name %s', (tarball) => {
    expect(
      findManifestProblems(
        [{ ...manifestEntry, tarball }],
        expected,
        matchingTarball,
      ),
    ).toHaveLength(1);
  });

  it('rejects a tarball that contains a different package', () => {
    expect(
      findManifestProblems([manifestEntry], expected, () => ({
        name: 'left-pad',
        version: '2.4.0',
      })),
    ).toHaveLength(1);
  });

  it('rejects a tarball that contains a different version', () => {
    expect(
      findManifestProblems([manifestEntry], expected, () => ({
        name: '@react-email/render',
        version: '9.9.9',
      })),
    ).toHaveLength(1);
  });

  it('rejects a missing tarball', () => {
    expect(
      findManifestProblems([manifestEntry], expected, () => undefined),
    ).toHaveLength(1);
  });

  it.each([
    ['2.4.0', 'canary'],
    ['2.4.0', 'latest --ignore-scripts=false'],
    ['2.4.0-canary.1', 'latest'],
  ])('rejects %s with the dist-tag %s', (version, distTag) => {
    expect(
      findManifestProblems(
        [{ ...manifestEntry, version, distTag }],
        new Map([['@react-email/render', version]]),
        () => ({ name: '@react-email/render', version }),
      ),
    ).toHaveLength(1);
  });

  it('accepts the prerelease dist-tag for a prerelease version', () => {
    const version = '2.4.0-canary.1';
    expect(
      findManifestProblems(
        [{ ...manifestEntry, version, distTag: 'canary' }],
        new Map([['@react-email/render', version]]),
        () => ({ name: '@react-email/render', version }),
      ),
    ).toEqual([]);
  });
});

describe('publishInOrder', () => {
  it('publishes every package when none fail', () => {
    const publish = vi.fn().mockReturnValue(true);

    const result = publishInOrder(
      [entry('button'), entry('components', ['button'])],
      publish,
    );

    expect(result).toEqual({
      published: ['button', 'components'],
      failed: [],
    });
    expect(publish).toHaveBeenCalledTimes(2);
  });

  it('skips dependents when a dependency fails (the #3045 fix)', () => {
    const publish = vi.fn(({ name }: { name: string }) => name !== 'button');

    const result = publishInOrder(
      [entry('button'), entry('text'), entry('components', ['button', 'text'])],
      publish,
    );

    expect(result.published).toEqual(['text']);
    expect(result.failed).toEqual(['button', 'components']);
    expect(publish).not.toHaveBeenCalledWith(
      expect.objectContaining({ name: 'components' }),
    );
  });

  it('propagates failures transitively down the dependency chain', () => {
    const publish = vi.fn(({ name }: { name: string }) => name !== 'a');

    const result = publishInOrder(
      [entry('a'), entry('b', ['a']), entry('c', ['b'])],
      publish,
    );

    expect(result.published).toEqual([]);
    expect(result.failed).toEqual(['a', 'b', 'c']);
    expect(publish).toHaveBeenCalledTimes(1);
  });

  it('reports the results after each package', () => {
    const onProgress = vi.fn();

    publishInOrder(
      [entry('a'), entry('b')],
      ({ name }: { name: string }) => name === 'a',
      onProgress,
    );

    expect(onProgress.mock.calls).toEqual([
      [{ published: ['a'], failed: [] }],
      [{ published: ['a'], failed: ['b'] }],
    ]);
  });
});
