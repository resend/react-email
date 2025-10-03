/** biome-ignore-all lint/correctness/useHookAtTopLevel: function is not a React hook */
import { useSuspensedPromise } from './use-suspensed-promise';

describe('useSuspensedPromise', () => {
  beforeEach(() => {});

  it('suspends (throw promise) on first call', () => {
    const mockPromise = Promise.resolve('test-result');
    const promiseFn = vi.fn(() => mockPromise);
    const key = 'test-key-1';

    let thrownValue: any;
    try {
      useSuspensedPromise(promiseFn, key);
    } catch (thrown) {
      thrownValue = thrown;
    }
    expect(thrownValue).toBeInstanceOf(Promise);
    expect(promiseFn).toHaveBeenCalledOnce();
  });

  it('returns cached result on subsequent calls after promise resolves', async () => {
    const result = 'test-result';
    const promiseFn = vi.fn(() => Promise.resolve(result));
    const key = 'test-key-2';

    let thrownPromise: Promise<any>;
    try {
      useSuspensedPromise(promiseFn, key);
    } catch (promise) {
      thrownPromise = promise as Promise<any>;
    }

    await thrownPromise!;

    const cachedResult = useSuspensedPromise(promiseFn, key);
    expect(cachedResult).toBe(result);
    expect(promiseFn).toHaveBeenCalledOnce();
  });

  it('throws cached error on subsequent calls after promise rejects', async () => {
    const error = new Error('test-error');
    const promiseFn = vi.fn(() => Promise.reject(error));
    const key = 'test-key-3';

    let thrownPromise: Promise<any>;
    try {
      useSuspensedPromise(promiseFn, key);
    } catch (promise) {
      thrownPromise = promise as Promise<any>;
    }

    try {
      await thrownPromise!;
    } catch {}

    let thrownError: any;
    try {
      useSuspensedPromise(promiseFn, key);
    } catch (thrown) {
      thrownError = thrown;
    }
    expect(thrownError).toBe(error);
    expect(promiseFn).toHaveBeenCalledOnce();
  });

  it('handles different keys independently', async () => {
    const result1 = 'result1';
    const result2 = 'result2';
    const promiseFn1 = vi.fn(() => Promise.resolve(result1));
    const promiseFn2 = vi.fn(() => Promise.resolve(result2));
    const key1 = 'test-key-4';
    const key2 = 'test-key-5';

    let promise1: Promise<any>;
    let promise2: Promise<any>;

    try {
      useSuspensedPromise(promiseFn1, key1);
    } catch (p) {
      promise1 = p as Promise<any>;
    }

    try {
      useSuspensedPromise(promiseFn2, key2);
    } catch (p) {
      promise2 = p as Promise<any>;
    }

    await Promise.all([promise1!, promise2!]);

    expect(useSuspensedPromise(promiseFn1, key1)).toBe(result1);
    expect(useSuspensedPromise(promiseFn2, key2)).toBe(result2);
    expect(promiseFn1).toHaveBeenCalledOnce();
    expect(promiseFn2).toHaveBeenCalledOnce();
  });

  it('handles the same key with different promise functions', async () => {
    const result1 = 'result1';
    const promiseFn1 = vi.fn(() => Promise.resolve(result1));
    const promiseFn2 = vi.fn(() => Promise.resolve('result2'));
    const key = 'test-key-6';

    let promise1: Promise<any>;
    try {
      useSuspensedPromise(promiseFn1, key);
    } catch (p) {
      promise1 = p as Promise<any>;
    }

    await promise1!;

    const cachedResult = useSuspensedPromise(promiseFn2, key);
    expect(cachedResult).toBe(result1);
    expect(promiseFn1).toHaveBeenCalledOnce();
    expect(promiseFn2).not.toHaveBeenCalled();
  });

  it('handles promise that resolves to undefined', async () => {
    const promiseFn = vi.fn(() => Promise.resolve(undefined));
    const key = 'test-key-7';

    let thrownPromise: Promise<any>;
    try {
      useSuspensedPromise(promiseFn, key);
    } catch (promise) {
      thrownPromise = promise as Promise<any>;
    }

    await thrownPromise!;

    const result = useSuspensedPromise(promiseFn, key);
    expect(result).toBeUndefined();
  });

  it('handles promise that resolves to null', async () => {
    const promiseFn = vi.fn(() => Promise.resolve(null));
    const key = 'test-key-8';

    let thrownPromise: Promise<any>;
    try {
      useSuspensedPromise(promiseFn, key);
    } catch (promise) {
      thrownPromise = promise as Promise<any>;
    }

    await thrownPromise!;

    const result = useSuspensedPromise(promiseFn, key);
    expect(result).toBeNull();
  });

  it('handles promise that resolves to falsy values', async () => {
    const falsyValues = [false, 0, '', null, undefined];

    for (let i = 0; i < falsyValues.length; i++) {
      const value = falsyValues[i];
      const promiseFn = vi.fn(() => Promise.resolve(value));
      const key = `test-key-falsy-${i}`;

      let thrownPromise: Promise<any>;
      try {
        useSuspensedPromise(promiseFn, key);
      } catch (promise) {
        thrownPromise = promise as Promise<any>;
      }

      await thrownPromise!;

      const result = useSuspensedPromise(promiseFn, key);
      expect(result).toBe(value);
    }
  });

  it('handles promise that rejects with non-Error values', async () => {
    const rejectionValues = [
      'string error',
      42,
      null,
      undefined,
      { message: 'object error' },
    ];

    for (let i = 0; i < rejectionValues.length; i++) {
      const value = rejectionValues[i];
      const promiseFn = vi.fn(() => Promise.reject(value));
      const key = `test-key-rejection-${i}`;

      let thrownPromise: Promise<any>;
      try {
        useSuspensedPromise(promiseFn, key);
      } catch (promise) {
        thrownPromise = promise as Promise<any>;
      }

      try {
        await thrownPromise!;
      } catch {}

      let thrownError: any;
      try {
        useSuspensedPromise(promiseFn, key);
      } catch (thrown) {
        thrownError = thrown;
      }
      expect(thrownError).toBe(value);
    }
  });

  it('works with generic types', async () => {
    interface TestData {
      id: number;
      name: string;
    }

    const testData: TestData = { id: 1, name: 'test' };
    const promiseFn = vi.fn(() => Promise.resolve(testData));
    const key = 'test-key-9';

    let thrownPromise: Promise<any>;
    try {
      useSuspensedPromise<TestData>(promiseFn, key);
    } catch (promise) {
      thrownPromise = promise as Promise<any>;
    }

    await thrownPromise!;

    const result = useSuspensedPromise<TestData>(promiseFn, key);
    expect(result).toEqual(testData);
    expect(result.id).toBe(1);
    expect(result.name).toBe('test');
  });

  it('maintains state across multiple calls with the same key', () => {
    const promiseFn = vi.fn(() => Promise.resolve('test'));
    const key = 'test-key-10';

    let thrown1: any;
    let thrown2: any;
    let thrown3: any;
    try {
      useSuspensedPromise(promiseFn, key);
    } catch (e) {
      thrown1 = e;
    }
    try {
      useSuspensedPromise(promiseFn, key);
    } catch (e) {
      thrown2 = e;
    }
    try {
      useSuspensedPromise(promiseFn, key);
    } catch (e) {
      thrown3 = e;
    }

    expect(thrown1).toBeInstanceOf(Promise);
    expect(thrown2).toBeInstanceOf(Promise);
    expect(thrown3).toBeInstanceOf(Promise);
    expect(promiseFn).toHaveBeenCalledOnce();
  });
});
