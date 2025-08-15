import {
  type ComponentType,
  cloneElement,
  isValidElement,
  type ReactNode,
} from 'react';
import type { Options } from './options';

const RENDER_OPTIONS_SYMBOL = Symbol.for('react-email.withRenderOptions');

/** Extends component props with optional render options. */
export type PropsWithRenderOptions<P = unknown> = P & {
  renderOptions?: Options;
};

/** Component wrapped with withRenderOptions, marked with a symbol. */
type ComponentWithRenderOptions<P = unknown> = ComponentType<
  PropsWithRenderOptions<P>
> & {
  [RENDER_OPTIONS_SYMBOL]: true;
};

/**
 * Wraps a component to receive render options as props.
 *
 * @param Component - The component to wrap.
 * @return A component that accepts `renderOptions` prop.
 *
 * @example
 * ```tsx
 * export const EmailTemplate = withRenderOptions(({ renderOptions }) => {
 *   if (renderOptions?.plainText) {
 *     return 'Plain text version';
 *   }
 *   return <div><h1>HTML version</h1></div>;
 * });
 * ```
 */
export function withRenderOptions<P = unknown>(
  Component: ComponentType<PropsWithRenderOptions<P>>,
): ComponentWithRenderOptions<P> {
  const WrappedComponent = Component as ComponentWithRenderOptions<P>;
  WrappedComponent[RENDER_OPTIONS_SYMBOL] = true;
  WrappedComponent.displayName = `withRenderOptions(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
}

/** @internal */
function isWithRenderOptionsComponent(
  component: unknown,
): component is ComponentWithRenderOptions {
  return (
    !!component &&
    typeof component === 'function' &&
    RENDER_OPTIONS_SYMBOL in component &&
    component[RENDER_OPTIONS_SYMBOL] === true
  );
}

/**
 * Injects render options into components wrapped with `withRenderOptions`.
 * Returns node unchanged if not wrapped or not a valid element.
 *
 * @param node - The React node to inject options into.
 * @param options - The render options to inject.
 * @returns The node with injected options if applicable, otherwise the original node.
 */
export function injectRenderOptions(
  node: ReactNode,
  options?: Options,
): ReactNode {
  if (!isValidElement(node)) return node;
  if (!isWithRenderOptionsComponent(node.type)) return node;
  const renderOptionsProps = { renderOptions: options };
  return cloneElement(node, renderOptionsProps);
}
