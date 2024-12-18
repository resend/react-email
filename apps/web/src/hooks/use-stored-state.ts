import * as React from 'react';

export const useStoredState = <T extends string | undefined>(
  key: string,
  defaultValue: T,
): [state: T, setState: (newValue: T) => void] => {
  const [state, setState] = React.useState<T>(defaultValue);
  React.useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      setState(storedValue as T);
    }
  }, [key]);

  return [
    state,
    (newValue) => {
      if (newValue) {
        localStorage.setItem(key, newValue);
      }
      setState(newValue);
    },
  ];
};
