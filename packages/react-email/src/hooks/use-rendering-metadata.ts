import { useEffect, useRef } from 'react';

/**
 * Returns the rendering metadata if the given `renderingResult`
 * does not error. If it does error it returns the last value it had for the hook.
 */
export const useLastDefinedValue = <T>(value: T | undefined): T | undefined => {
  const lastValueRef = useRef<T | undefined>(value);

  useEffect(() => {
    if (value !== undefined) {
      lastValueRef.current = value;
    }
  }, [value]);

  return value ?? lastValueRef.current;
};
