export const elementMarker = Symbol.for('react-email.element');

export const markAsElement = (component: unknown) => {
  (component as Record<symbol, boolean>)[elementMarker] = true;
};
