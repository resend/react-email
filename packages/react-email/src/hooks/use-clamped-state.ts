import { useState } from 'react';

const clamp = (v: number, min: number, max: number) => {
  return Math.min(Math.max(v, min), max);
};

export const useClampedState = (initial: number, min: number, max: number) => {
  const [v, setV] = useState(initial);

  return [
    v,
    (valueOrFunction: number | ((v: number) => number)) => {
      if (typeof valueOrFunction === 'function') {
        setV((value: number) => clamp(valueOrFunction(value), min, max));
      } else {
        clamp(valueOrFunction, min, max);
      }
    },
  ] as const;
};
