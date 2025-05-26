type Ok<T, _E> = {
  value: T;
};
type Error<_T, E> = {
  error: E;
};

/**
 * Do not destructure this object, it is meant to have all fields together
 * in the same object
 */
export type Result<T, E> = Ok<T, E> | Error<T, E>;

export function isErr<T, E>(result: Result<T, E>): result is Error<T, E> {
  return 'error' in result;
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T, E> {
  return 'value' in result && !('error' in result);
}

export function mapResult<T, E, B>(
  result: Result<T, E>,
  callback: (value: T) => B,
): Result<B, E> {
  if (isOk(result)) {
    return ok(callback(result.value));
  }

  return result;
}

export function ok<T, E>(value: NoInfer<T>): Ok<T, E>;
// biome-ignore lint/suspicious/noConfusingVoidType: This is required for void return types on functions that can still error
export function ok<_T extends void = void, E = never>(value: void): Ok<void, E>;
export function ok<T, E>(value: NoInfer<T>): Ok<T, E> {
  return {
    value,
  };
}

export function err<T, E>(error: NoInfer<E>): Error<T, E>;
// biome-ignore lint/suspicious/noConfusingVoidType: This is required for void return types on functions that can still error
export function err<T, _E extends void = void>(error: void): Error<T, void>;
export function err<T, E>(error: NoInfer<E>): Error<T, E> {
  return {
    error,
  };
}
