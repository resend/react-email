// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { publishInOrder } from './publish-tarballs.mjs';

const entry = (name: string, dependsOn: string[] = []) => ({
  name,
  dependsOn,
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
});
