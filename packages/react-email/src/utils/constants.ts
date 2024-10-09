export const tabTransition = {
  type: 'spring',
  stiffness: 2000,
  damping: 80,
  mass: 1,
};

export const isInternalDev = process.env.IS_INTERNAL_DEV === 'true';
