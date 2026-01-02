import { z } from 'zod';
import { err, isErr, isOk } from './result';
import { runBundledCode } from './run-bundled-code';

describe('runBundledCode()', () => {
  // See https://github.com/resend/react-email/issues/2688
  it('instanceof with RegExp should work', async () => {
    const result = await runBundledCode(
      `
      export default /.+/ instanceof RegExp`,
      'file.js',
    );

    expect(isOk(result), 'there should be no errors').toBe(true);
    if (!isOk(result)) {
      console.log(result.error);
      return;
    }

    const { default: isInstanceOfRegExp } = z
      .object({
        default: z.boolean(),
      })
      .parse(result.value);

    expect(
      /.+/,
      './+/ instanceof RegExp should work outside node:vm',
    ).toBeInstanceOf(RegExp);
    expect(isInstanceOfRegExp, '/.+/ instanceof RegExp to be true').toBe(true);
  });

  it('runs the bundled code in a VM context', async () => {
    const result = await runBundledCode('export default 42;', 'test.js');
    expect(isOk(result), 'there should be no errors').toBe(true);
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
    expect(isErr(result), 'should throw test error').toBe(true);
  });

  describe('Node internals support', () => {
    test('Request', async () => {
      const result = await runBundledCode(
        `
const _req = new Request('https://react.email');
const _res = new Response('{}');

const Email = () => {
  return 'Hello world!';
};

export default Email;`,
        'request-response-email.js',
      );
      if (!isOk(result)) {
        console.log(result.error);
        expect(isOk(result), 'there should be no errors').toBe(true);
        return;
      }
    });
  });
});
