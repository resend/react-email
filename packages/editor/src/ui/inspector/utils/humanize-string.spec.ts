import { describe, expect, it } from 'vitest';
import { humanizeString } from './humanize-string';

describe('humanizeString', () => {
  it('converts camelCase', () => {
    expect(humanizeString('camelCase')).toBe('Camel Case');
  });

  it('converts kebab-case', () => {
    expect(humanizeString('kebab-case')).toBe('Kebab Case');
  });

  it('converts snake_case', () => {
    expect(humanizeString('snake_case')).toBe('Snake Case');
  });

  it('leaves already human-readable strings unchanged', () => {
    expect(humanizeString('Hello World')).toBe('Hello World');
  });
});
