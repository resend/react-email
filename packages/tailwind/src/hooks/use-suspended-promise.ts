interface PromiseState {
  promise: Promise<unknown>;
  error?: unknown;
  result?: unknown;
}

const promiseStates = new Map<string, PromiseState>();
const MAX_CACHE_SIZE = 50;

export function useSuspensedPromise<Result>(
  promiseFn: () => Promise<Result>,
  key: string,
) {
  const previousState = promiseStates.get(key);
  if (previousState) {
    // LRU: move to end of insertion order
    promiseStates.delete(key);
    promiseStates.set(key, previousState);

    if ('error' in previousState) {
      throw previousState.error;
    }

    if ('result' in previousState) {
      return previousState.result as Result;
    }

    throw previousState.promise;
  }

  // Evict oldest entry when at capacity
  if (promiseStates.size >= MAX_CACHE_SIZE) {
    const oldestKey = promiseStates.keys().next().value;
    if (oldestKey !== undefined) promiseStates.delete(oldestKey);
  }

  const state: PromiseState = {
    promise: promiseFn()
      .then((result) => (state.result = result))
      .catch((error) => (state.error = error as unknown)),
  };
  promiseStates.set(key, state);

  throw state.promise;
}
