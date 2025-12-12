import { z } from 'zod';
import { err, isOk } from './result';
import { runBundledCode } from './run-bundled-code';

describe('runBundledCode()', () => {
  it('should run the bundled code in a VM context', async () => {
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

  it('should return an error if the code throws', async () => {
    const result = await runBundledCode(
      'throw new Error("Test error");',
      'test.js',
    );
    expect(result).toEqual(err(expect.any(Error)));
  });
});
