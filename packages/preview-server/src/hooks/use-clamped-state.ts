import { useState } from 'react';

const clamp = (v: number, min: number, max: number) => {
  return Math.min(Math.max(v, min), max);
};

export const useClampedState = (initial: number, min: number, max: number) => {
  const [v, setV] = useState(initial);

  return [
    clamp(v, min, max),
    (valueOrFunction: number | ((v: number) => number)) => {
      if (typeof valueOrFunction === 'function') {
        setV((value: number) => {
          const currentValue = clamp(value, min, max);

          return clamp(valueOrFunction(currentValue), min, max);
        });
      } else {
        setV(clamp(valueOrFunction, min, max));
      }
    },
  ] as const;
};
