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
    if ('error' in previousState) {
      throw previousState.error;
    }

    if ('result' in previousState) {
      return previousState.result as Result;
    }

    throw previousState.promise;
  }

  const state: PromiseState = {
    promise: promiseFn()
      .then((result) => (state.result = result))
      .catch((error) => (state.error = error as unknown)),
  };
  promiseStates.set(key, state);

  throw state.promise;
};
