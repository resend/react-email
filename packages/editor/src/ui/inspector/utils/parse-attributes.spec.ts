import { describe, expect, it } from 'vitest';
import { getOtherStyles, parseOtherStyleToInput } from './parse-attributes';

describe('getOtherStyles', () => {
  it('excludes properties handled by known sections', () => {
    const result = getOtherStyles({
      color: '#000',
      fontSize: '16px',
      customProp: 'value',
    });
    expect(result).toEqual({ customProp: 'value' });
  });

  it('excludes padding, background, border properties', () => {
    const result = getOtherStyles({
      padding: '10px',
      paddingTop: '5px',
      backgroundColor: '#fff',
      borderRadius: '4px',
      borderWidth: '1px',
      borderColor: '#000',
      borderStyle: 'solid',
      zIndex: '1',
    });
    expect(result).toEqual({ zIndex: '1' });
  });

  it('returns empty object when all properties are handled', () => {
    const result = getOtherStyles({ color: '#000', fontSize: '14px' });
    expect(result).toEqual({});
  });

  it('returns all properties when none are handled', () => {
    const result = getOtherStyles({ display: 'block', zIndex: '1' });
    expect(result).toEqual({ display: 'block', zIndex: '1' });
  });

  it('handles empty input', () => {
    expect(getOtherStyles({})).toEqual({});
  });
});

describe('parseOtherStyleToInput', () => {
  it('parses numeric pixel value', () => {
    const result = parseOtherStyleToInput('marginTop', '10px');
    expect(result).toEqual({
      label: 'Margin Top',
      type: 'number',
      value: 10,
      prop: 'marginTop',
      unit: 'px',
      detectedUnit: 'px',
    });
  });

  it('parses numeric percentage value', () => {
    const result = parseOtherStyleToInput('width', '50%');
    expect(result).toEqual({
      label: 'Width',
      type: 'number',
      value: 50,
      prop: 'width',
      unit: '%',
      detectedUnit: '%',
    });
  });

  it('parses plain number without unit as px', () => {
    const result = parseOtherStyleToInput('gap', '8');
    expect(result).toEqual({
      label: 'Gap',
      type: 'number',
      value: 8,
      prop: 'gap',
      unit: 'px',
      detectedUnit: 'px',
    });
  });

  it('parses non-numeric value as text', () => {
    const result = parseOtherStyleToInput('display', 'block');
    expect(result).toEqual({
      label: 'Display',
      type: 'text',
      value: 'block',
      prop: 'display',
    });
  });

  it('parses em unit', () => {
    const result = parseOtherStyleToInput('lineHeight', '1.5em');
    expect(result.detectedUnit).toBe('em');
  });

  it('handles negative numbers', () => {
    const result = parseOtherStyleToInput('marginLeft', '-5px');
    expect(result.value).toBe(-5);
    expect(result.type).toBe('number');
  });

  it('handles decimal numbers', () => {
    const result = parseOtherStyleToInput('opacity', '0.5');
    expect(result.value).toBe(0.5);
    expect(result.type).toBe('number');
  });
});
