import { describe, expect, it } from 'vitest';
import { buildPropClassMap, inputsToStyleObject } from './panel-group-utils';

const inputs = [
  {
    label: 'Color',
    type: 'text' as const,
    value: '#000',
    prop: 'color' as any,
    classReference: 'text-color' as any,
  },
  {
    label: 'Size',
    type: 'number' as const,
    value: 16,
    prop: 'fontSize' as any,
    classReference: undefined,
  },
  {
    label: 'Weight',
    type: 'text' as const,
    value: '',
    prop: 'fontWeight' as any,
    classReference: 'font-weight' as any,
  },
];

describe('inputsToStyleObject', () => {
  it('maps inputs to prop/value pairs', () => {
    const result = inputsToStyleObject(inputs);
    expect(result).toEqual({
      color: '#000',
      fontSize: 16,
      fontWeight: undefined,
    });
  });

  it('treats empty string as undefined', () => {
    const result = inputsToStyleObject([
      { label: 'A', type: 'text' as const, value: '', prop: 'color' as any },
    ]);
    expect(result.color).toBeUndefined();
  });

  it('returns empty object for empty inputs', () => {
    expect(inputsToStyleObject([])).toEqual({});
  });
});

describe('buildPropClassMap', () => {
  it('maps each prop to its classReference', () => {
    const result = buildPropClassMap(inputs);
    expect(result).toEqual({
      color: 'text-color',
      fontSize: undefined,
      fontWeight: 'font-weight',
    });
  });

  it('returns empty object for empty inputs', () => {
    expect(buildPropClassMap([])).toEqual({});
  });
});
