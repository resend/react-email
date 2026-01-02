import { z } from 'zod';
import { err, isOk } from './result';
import { runBundledCode } from './run-bundled-code';

describe('runBundledCode()', () => {
  // See https://github.com/resend/react-email/issues/2688
  it('instanceof with RegExp should work', async () => {
    const result = await runBundledCode(
      `
      module.exports = [
        /.+/ instanceof RegExp,
        /.+/,
        RegExp,
      ]`,
      'file.cjs',
    );

    expect(isOk(result)).toBe(true);
    if (!isOk(result)) {
      return;
    }

    const [isInstanceOfRegExp, regex, RegExpConstructor] = result.value as [
      boolean,
      RegExp,
      RegExpConstructor,
    ];

    expect(Object.getOwnPropertyDescriptor(regex, 'protitype')).toBe(
      Object.getOwnPropertyDescriptor(/.+/, 'protitype'),
    );
    expect(RegExpConstructor).toBe(RegExp);
    expect(isInstanceOfRegExp, '/.+/ instanceof RegExp to be true').toBe(true);
  });

  it('runs the bundled code in a VM context', async () => {
    const result = await runBundledCode('export default 42;', 'test.js');
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) {
      return;
    }
    expect(
      z
        .object({
          default: z.number(),
        })
        .parse(result.value).default,
    ).toEqual(42);
  });

  it('returns an error if the code throws', async () => {
    const result = await runBundledCode(
      'throw new Error("Test error");',
      'test.js',
    );
    expect(result).toEqual(err(expect.any(Error)));
  });
});
