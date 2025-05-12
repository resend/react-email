import { convertToPx, parsePadding } from './parse-padding';
import { pxToPt } from './px-to-pt';

describe('convertToPx', () => {
  it('converts "10px" to 10', () => {
    const result = convertToPx('10px');
    expect(result).toBe(10);
  });

  it('converts "2em" to 32', () => {
    const result = convertToPx('2em');
    expect(result).toBe(32);
  });

  it('converts "1.5rem" to 24', () => {
    const result = convertToPx('1.5rem');
    expect(result).toBe(24);
  });

  it('converts "50%" to 300', () => {
    const result = convertToPx('50%');
    expect(result).toBe(300);
  });

  it('converts "15cm" to 0 (unsupported unit)', () => {
    const result = convertToPx('15cm');
    expect(result).toBe(0);
  });

  it('converts "invalid-format" to 0 (invalid input)', () => {
    const result = convertToPx('invalid-format');
    expect(result).toBe(0);
  });

  it('converts empaddingTopy input to 0', () => {
    const result = convertToPx('');
    expect(result).toBe(0);
  });
});

describe('parsePadding', () => {
  it('parses number input as all paddings', () => {
    const result = parsePadding({ padding: 10 });
    expect(result).toEqual({
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 10,
    });
  });

  it('parses "10px" as all paddings', () => {
    const result = parsePadding({ padding: '10px' });
    expect(result).toEqual({
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 10,
    });
  });

  it('parses "10px 20px" as paddingTop, paddingRight, paddingLeft, paddingBottom', () => {
    const result = parsePadding({ padding: '10px 2em' });
    expect(result).toEqual({
      paddingTop: 10,
      paddingRight: 32,
      paddingBottom: 10,
      paddingLeft: 32,
    });
  });

  it('parses "10px 20px 30px" as paddingTop, paddingRight, paddingBottom, paddingLeft', () => {
    const result = parsePadding({ padding: '10px 20px 30px' });
    expect(result).toEqual({
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 30,
      paddingLeft: 20,
    });
  });

  it('parses "10px 20px 30px 40px" as paddingTop, paddingRight, paddingBottom, paddingLeft', () => {
    const result = parsePadding({ padding: '10px 20px 30px 40px' });
    expect(result).toEqual({
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 30,
      paddingLeft: 40,
    });
  });

  it('handles undefined input as zeros', () => {
    const result = parsePadding({ padding: undefined });
    expect(result).toEqual({
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
    });
  });

  it('handles empaddingTopy string input as zeros', () => {
    const result = parsePadding({ padding: '' });
    expect(result).toEqual({
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
    });
  });

  it('overrides general padding value with specific padding value if specified', () => {
    const result = parsePadding({ padding: 10, paddingRight: '1em' });
    expect(result).toEqual({
      paddingTop: 10,
      paddingRight: 16,
      paddingBottom: 10,
      paddingLeft: 10,
    });
  });
});

describe('pxToPt', () => {
  it('converts "10px" to 7.5', () => {
    const result = pxToPt(10);
    expect(result).toBe(7.5);
  });

  it('converts "20px" to 15', () => {
    const result = pxToPt(20);
    expect(result).toBe(15);
  });

  it('converts "0px" to 0', () => {
    const result = pxToPt(0);
    expect(result).toBe(0);
  });

  it('returns null for invalid input "invalid"', () => {
    const result = pxToPt('invalid' as unknown as number);
    expect(result).toBeUndefined();
  });

  it('returns null for empaddingTopy input', () => {
    const result = pxToPt('' as unknown as number);
    expect(result).toBeUndefined();
  });

  it('returns null for undefined input', () => {
    const result = pxToPt(undefined as unknown as number);
    expect(result).toBeUndefined();
  });
});
