import { isOk } from './result';
import { runBundledCode } from './run-bundled-code';

describe('runBundledCode()', () => {
  // See https://github.com/resend/react-email/issues/2688
  it('instanceof with RegExp should work', () => {
    const result = runBundledCode(
      `
      console.log(/.+/);
      console.log(new RegExp('.+'));
      console.log(new RegExp('.+') instanceof RegExp);
      module.exports = [
        /.+/ instanceof RegExp,
        RegExp,
      ]`,
      'file.cjs',
    );

    expect(isOk(result)).toBe(true);
    if (!isOk(result)) {
      return;
    }

    const [isInstanceOfRegExp, RegExpConstructor] = result.value as [
      boolean,
      RegExp,
    ];

    expect(RegExpConstructor).toBe(RegExp);
    expect(isInstanceOfRegExp, '/.+/ instanceof RegExp to be true').toBe(true);
  });
});
