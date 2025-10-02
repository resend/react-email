import { escapeClassName } from './escape-class-name';

describe('escapeClassName function', () => {
  it('escapes the first character properly', () => {
    expect(escapeClassName('[min-height-')).toBe('\\[min-height-');
  });

  it('does not escape an already escaped first-character', () => {
    expect(escapeClassName('\\[min-height-')).toBe('\\[min-height-');
  });

  it('escapes `min-height-[calc(25px+100%-20%*2/4)]` correctly', () => {
    expect(escapeClassName('min-height-[calc(25px+100%-20%*2/4)]')).toBe(
      'min-height-\\[calc\\(25px\\+100\\%-20\\%\\*2\\/4\\)\\]',
    );
  });
});
