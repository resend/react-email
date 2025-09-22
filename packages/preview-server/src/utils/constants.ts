import type { Transition } from 'framer-motion';

export const tabTransition: Transition = {
  type: 'spring',
  stiffness: 2000,
  damping: 80,
  mass: 1,
};
