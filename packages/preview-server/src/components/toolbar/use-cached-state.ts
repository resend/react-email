import { useSyncExternalStore } from 'react';

export const useCachedState = <T>(key: string) => {
  let value: T | undefined = undefined;
  if ('localStorage' in global) {
    const storedValue = global.localStorage.getItem(key);
    if (storedValue !== null && storedValue !== 'undefined') {
      try {
        value = JSON.parse(storedValue) as T;
      } catch (exception) {
        console.warn(
          'Failed to load stored value for',
          key,
          'with value',
          storedValue,
        );
      }
    }
  }

  return [
    useSyncExternalStore(
      () => () => {},
      () => value,
      () => undefined,
    ),
    function setValue(newValue: T | undefined) {
      if ('localStorage' in global) {
        global.localStorage.setItem(key, JSON.stringify(newValue));
      }
    },
  ] as const;
};
