import path from 'node:path';
import { z } from 'zod';
import { isErr, isOk } from './result';
import { runBundledCode } from './run-bundled-code';

describe('runBundledCode()', () => {
  // See https://github.com/resend/react-email/issues/2688
  it('works with instanceof RegExp', async () => {
    const result = await runBundledCode(
      `
      export default [
        /.+/ instanceof RegExp, 
        [1, 2, 3] instanceof Array,
      ]`,
      'file.js',
    );

    expect(isOk(result), 'there should be no errors').toBe(true);
    if (!isOk(result)) {
      console.log(result.error);
      return;
    }

    const {
      default: [isInstanceOfRegExp, isArray],
    } = z
      .object({
        default: z.tuple([z.boolean(), z.boolean()]),
      })
      .parse(result.value);

    expect(
      /.+/,
      '/.+/ instanceof RegExp should work outside node:vm',
    ).toBeInstanceOf(RegExp);
    expect(isInstanceOfRegExp, '/.+/ instanceof RegExp to be true').toBe(true);
    expect(isArray, 'instanceof Array should work with arrays').toBe(true);
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

  // see https://github.com/resend/react-email/issues/2930
  it('works when using default imports for node:path', async () => {
    const result = await runBundledCode(
      `
import path from 'node:path';

export default path.join('a', 'b', 'c');
    `,
      'test-path.js',
    );
    if (!isOk(result)) {
      expect(isOk(result), 'there should be no errors').toBe(true);
      console.log(result.error);
      return;
    }
    expect(result.value).toEqual({ default: path.join('a', 'b', 'c') });
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
