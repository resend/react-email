import { escapeClassName } from './escape-class-name';

describe('escapeClassName function', () => {
  it('should escape the first character properly', () => {
    expect(escapeClassName('[min-height-')).toBe('\\[min-height-');
  });

  it('should not escape an already escaped first-character', () => {
    expect(escapeClassName('\\[min-height-')).toBe('\\[min-height-');
  });

  it('should escape `min-height-[calc(25px+100%-20%*2/4)]` correctly', () => {
    expect(escapeClassName('min-height-[calc(25px+100%-20%*2/4)]')).toBe(
      'min-height-\\[calc\\(25px\\+100\\%-20\\%\\*2\\/4\\)\\]',
    );
  });
});
