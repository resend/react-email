import { describe, expect, it } from 'vitest';
import { isValidHexColor } from './is-valid-hex-color';

describe('isValidHexColor', () => {
  it('accepts 3-digit hex', () => {
    expect(isValidHexColor('#fff')).toBe(true);
  });

  it('accepts 6-digit hex', () => {
    expect(isValidHexColor('#ff00ff')).toBe(true);
  });

  it('accepts 8-digit hex', () => {
    expect(isValidHexColor('#ff00ff80')).toBe(true);
  });

  it('is case insensitive', () => {
    expect(isValidHexColor('#FF00FF')).toBe(true);
    expect(isValidHexColor('#AbCdEf')).toBe(true);
  });

  it('rejects values without hash', () => {
    expect(isValidHexColor('ff00ff')).toBe(false);
  });

  it('rejects wrong length', () => {
    expect(isValidHexColor('#ffff')).toBe(false);
    expect(isValidHexColor('#ff')).toBe(false);
  });

  it('rejects non-hex characters', () => {
    expect(isValidHexColor('#gggggg')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidHexColor('')).toBe(false);
  });

  it('rejects rgb()', () => {
    expect(isValidHexColor('rgb(255, 0, 0)')).toBe(false);
  });
});
