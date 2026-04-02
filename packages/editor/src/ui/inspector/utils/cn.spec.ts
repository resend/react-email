import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins strings with spaces', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters false values', () => {
    expect(cn('a', false, 'b')).toBe('a b');
  });

  it('filters null values', () => {
    expect(cn('a', null, 'b')).toBe('a b');
  });

  it('filters undefined values', () => {
    expect(cn('a', undefined, 'b')).toBe('a b');
  });

  it('filters empty strings', () => {
    expect(cn('a', '' as unknown as string, 'b')).toBe('a b');
  });

  it('returns empty string with no args', () => {
    expect(cn()).toBe('');
  });
});
