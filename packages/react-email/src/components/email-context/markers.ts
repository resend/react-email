/**
 * The prop under which email context values are injected into consumer
 * and provider components. Consumers and providers must strip this prop
 * (see `stripEmailContexts`) before spreading their props into host elements.
 */
export const contextsPropName = '__reactEmailContexts';

/**
 * A map of context values keyed by each context's unique symbol id.
 *
 * Symbols are registered globally (`Symbol.for`) so that duplicated copies of
 * this module (e.g. the CJS and ESM builds loaded in the same process) remain
 * compatible with each other.
 */
export type EmailContextMap = Record<symbol, unknown>;

export const contextProviderMarker = Symbol.for(
  'react-email.email-context.provider',
);

export const contextConsumerMarker = Symbol.for(
  'react-email.email-context.consumer',
);

/**
 * Marks a component as an email context provider. During propagation,
 * providers receive the inherited context values through their props and
 * are expected to continue propagation themselves (see `provideEmailContext`)
 * so that their own value gets merged with the inherited ones.
 */
export const markAsEmailContextProvider = (component: unknown) => {
  (component as Record<symbol, boolean>)[contextProviderMarker] = true;
};

/**
 * Marks a component as an email context consumer, making propagation inject
 * the current context values into its props so they can be read with
 * `readEmailContext`.
 */
export const markAsEmailContextConsumer = (component: unknown) => {
  (component as Record<symbol, boolean>)[contextConsumerMarker] = true;
};

export const hasMarker = (type: unknown, marker: symbol): boolean => {
  return (
    (typeof type === 'function' ||
      (typeof type === 'object' && type !== null)) &&
    marker in (type as object)
  );
};
