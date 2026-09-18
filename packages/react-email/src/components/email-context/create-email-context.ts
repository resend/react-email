import type * as React from 'react';
import {
  contextsPropName,
  type EmailContextMap,
  markAsEmailContextConsumer,
  markAsEmailContextProvider,
} from './markers.js';
import { propagateEmailContexts } from './propagate-email-contexts.js';

/**
 * A context meant to be used by the email components, mimicking React
 * context without relying on it.
 *
 * React context cannot be used for the email components because they may be
 * rendered inside React Server Components, where `createContext` and hooks
 * are not available, while also being rendered with `react-dom/server` or in
 * the browser.
 *
 * Instead of the value living in the renderer, it is carried through the
 * element tree itself: a provider component walks its children at render
 * time and clones every registered consumer element with the value injected
 * into a private prop (see `propagateEmailContexts` for how component
 * boundaries are crossed). Consumers then read it with `readEmailContext`,
 * which is a plain function and not a hook.
 */
export interface EmailContext<Value> {
  id: symbol;
  defaultValue: Value;
}

export const createEmailContext = <Value>(
  name: string,
  defaultValue: Value,
): EmailContext<Value> => ({
  // Registered globally so that duplicated copies of a context's module
  // (e.g. the CJS and ESM builds loaded in the same process) interoperate.
  id: Symbol.for(`react-email.email-context.${name}`),
  defaultValue,
});

/**
 * Reads the value provided for `context` from a consumer component's props.
 *
 * The component must have been marked with `markAsEmailContextConsumer` for
 * providers to inject values into it. Falls back to the context's default
 * value when the component is rendered outside of a provider or when the
 * propagation could not reach it (see the caveats on
 * `propagateEmailContexts`).
 */
export const readEmailContext = <Value>(
  props: object,
  context: EmailContext<Value>,
): Value => {
  const contexts = (props as Record<string, unknown>)[contextsPropName] as
    | EmailContextMap
    | undefined;
  if (contexts && context.id in contexts) {
    return contexts[context.id] as Value;
  }
  return context.defaultValue;
};

/**
 * Removes the private prop used to carry email context values so that it
 * doesn't leak into the DOM. Consumers and providers must call this before
 * spreading their remaining props into a host element.
 */
export const stripEmailContexts = <Props extends object>(
  props: Props,
): Props => {
  if (!(contextsPropName in props)) {
    return props;
  }
  const { [contextsPropName]: _contexts, ...rest } = props as Props & {
    [contextsPropName]?: EmailContextMap;
  };
  return rest as unknown as Props;
};

/**
 * Provides a value for `context` to all consumer elements found inside
 * `children`, mimicking what rendering a React context provider would do.
 *
 * The component calling this must be marked with
 * `markAsEmailContextProvider` and pass its own props as `providerProps`:
 * outer providers stop their propagation at nested provider elements and
 * inject the values they carry into them, so the nested provider is
 * responsible for merging its own value over the inherited ones and
 * continuing the propagation, which is what this function does.
 */
export const provideEmailContext = <Value>(
  context: EmailContext<Value>,
  value: Value,
  children: React.ReactNode,
  providerProps: object,
): React.ReactNode => {
  const inherited = (providerProps as Record<string, unknown>)[
    contextsPropName
  ] as EmailContextMap | undefined;
  return propagateEmailContexts(children, {
    ...inherited,
    [context.id]: value,
  });
};

export { markAsEmailContextConsumer, markAsEmailContextProvider };
