/* eslint-disable @typescript-eslint/no-throw-literal */
interface PromiseState {
  promise: Promise<unknown>;
  error?: unknown;
  result?: unknown;
}

const promiseStates = new Map<string, PromiseState>();

export const useSuspensedPromise = <Result>(
  promiseFn: () => Promise<Result>,
  key: string,
) => {
  const previousState = promiseStates.get(key);
  if (previousState) {
    if (previousState.error) {
      throw previousState.error;
    }

    if (previousState.result) {
      return previousState.result as Result;
    }

    throw previousState.promise;
  }

  const state: PromiseState = {
    promise: promiseFn()
      .then((result) => (state.result = result))
      .catch((error) => (state.error = error as unknown)),
  };

  throw state.promise;
};
