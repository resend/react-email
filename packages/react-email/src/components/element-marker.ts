import type * as React from 'react';

export const elementMarker = Symbol.for('react-email.element');

export interface ResolvedTailwind {
  style: React.CSSProperties;
  className: string | undefined;
  classProperties: Record<string, string[]>;
}

export interface ElementOptions<Props = object> {
  resolveTailwind?: (props: Props, resolved: ResolvedTailwind) => Props;
}

export const markAsElement = <Props>(
  component: unknown,
  options: ElementOptions<Props> = {},
) => {
  (component as Record<symbol, ElementOptions<Props>>)[elementMarker] = options;
};

export const getElementOptions = (
  type: unknown,
): ElementOptions | undefined => {
  if (typeof type !== 'function' && typeof type !== 'object') return undefined;
  if (type === null) return undefined;
  return (type as Record<symbol, ElementOptions | undefined>)[elementMarker];
};
