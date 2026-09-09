import * as React from 'react';
import { elementMarker } from '../element-marker.js';
import {
  contextConsumerMarker,
  contextProviderMarker,
  contextsPropName,
  type EmailContextMap,
  hasMarker,
} from './markers.js';

const forwardRefTypeSymbol = Symbol.for('react.forward_ref');
const memoTypeSymbol = Symbol.for('react.memo');
const injectorMarker = Symbol.for('react-email.email-context.injector');

type UnknownProps = Record<string, unknown> & { children?: React.ReactNode };

const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as PromiseLike<unknown>).then === 'function';

const unwrapMemo = (type: unknown): unknown => {
  let current = type;
  while (
    typeof current === 'object' &&
    current !== null &&
    (current as { $$typeof?: symbol }).$$typeof === memoTypeSymbol
  ) {
    current = (current as { type: unknown }).type;
  }
  return current;
};

const isForwardRef = (
  type: unknown,
): type is {
  render: (props: UnknownProps, ref: unknown) => React.ReactNode;
} => {
  return (
    typeof type === 'object' &&
    type !== null &&
    (type as { $$typeof?: symbol }).$$typeof === forwardRefTypeSymbol
  );
};

const isClassComponent = (type: unknown): boolean => {
  return (
    typeof type === 'function' &&
    type.prototype !== undefined &&
    type.prototype !== null &&
    (type.prototype as { isReactComponent?: unknown }).isReactComponent !==
      undefined
  );
};

interface EmailContextInjectorProps {
  componentType: unknown;
  componentProps: UnknownProps;
  contexts: EmailContextMap;
}

/**
 * Stands in for a component found during propagation. When React renders it,
 * it calls the original component the same way React would and continues
 * propagating the contexts through whatever the component returned, so that
 * consumers hidden behind component boundaries still receive their values.
 *
 * Hooks used by the original component still work because this runs inside
 * an actual React render, they just get attributed to this component.
 * Async components (only valid in RSC, where returning a thenable is
 * supported) are handled by chaining the propagation onto the promise.
 */
const EmailContextInjector = ({
  componentType,
  componentProps,
  contexts,
}: EmailContextInjectorProps): React.ReactNode => {
  const unwrapped = unwrapMemo(componentType);

  let output: unknown;
  if (isForwardRef(unwrapped)) {
    const { ref, ...propsWithoutRef } = componentProps;
    output = unwrapped.render(propsWithoutRef, ref);
  } else if (typeof unwrapped === 'function' && !isClassComponent(unwrapped)) {
    output = (unwrapped as (props: UnknownProps) => React.ReactNode)(
      componentProps,
    );
  } else {
    // We cannot safely call this component ourselves (e.g. a class component
    // wrapped in memo), so we let React render it as-is. Contexts will not
    // reach consumers inside of it, only through its children prop, which
    // was already handled during propagation.
    return React.createElement(
      componentType as React.ElementType,
      componentProps,
    );
  }

  if (isThenable(output)) {
    return output.then((resolved) =>
      propagateEmailContexts(resolved as React.ReactNode, contexts),
    ) as unknown as React.ReactNode;
  }

  return propagateEmailContexts(output as React.ReactNode, contexts);
};
EmailContextInjector.displayName = 'EmailContextInjector';
(EmailContextInjector as unknown as Record<symbol, boolean>)[injectorMarker] =
  true;

const cloneWithInjectedContexts = (
  element: React.ReactElement<UnknownProps>,
  contexts: EmailContextMap,
  newChildren?: { value: React.ReactNode },
) => {
  const existing = element.props[contextsPropName] as
    | EmailContextMap
    | undefined;
  // Contexts already injected by a previous propagation come from a
  // provider that is closer to the element, so they take precedence.
  const merged = existing ? { ...contexts, ...existing } : contexts;

  const overrides: UnknownProps = { [contextsPropName]: merged };
  if (newChildren) {
    overrides.children = newChildren.value;
  }

  return React.cloneElement(element, overrides);
};

const propagateThroughChildren = (
  element: React.ReactElement<UnknownProps>,
  contexts: EmailContextMap,
): React.ReactNode => {
  const children = element.props?.children;
  if (children === undefined || children === null) {
    return element;
  }

  const newChildren = propagateEmailContexts(children, contexts);
  if (newChildren === children) {
    return element;
  }

  return React.cloneElement(element, { children: newChildren });
};

const wrapInInjector = (
  element: React.ReactElement<UnknownProps>,
  contexts: EmailContextMap,
) => {
  return React.createElement(EmailContextInjector, {
    key: element.key ?? undefined,
    componentType: element.type,
    componentProps: element.props,
    contexts,
  });
};

const propagateThroughElement = (
  element: React.ReactElement<UnknownProps>,
  contexts: EmailContextMap,
): React.ReactNode => {
  const type = element.type as unknown;
  const markerTarget = unwrapMemo(type);

  if (hasMarker(markerTarget, injectorMarker)) {
    const existing = (element.props as unknown as EmailContextInjectorProps)
      .contexts;
    return React.cloneElement(element, {
      contexts: { ...contexts, ...existing },
    } as Partial<UnknownProps>);
  }

  if (hasMarker(markerTarget, contextProviderMarker)) {
    // The provider merges its own value over the inherited ones and
    // continues the propagation through its subtree by itself, so we hand
    // the contexts over to it and stop descending.
    return cloneWithInjectedContexts(element, contexts);
  }

  if (hasMarker(markerTarget, contextConsumerMarker)) {
    const children = element.props.children;
    const newChildren =
      children === undefined || children === null
        ? undefined
        : { value: propagateEmailContexts(children, contexts) };
    return cloneWithInjectedContexts(element, contexts, newChildren);
  }

  if (
    hasMarker(markerTarget, elementMarker) ||
    typeof type === 'string' ||
    typeof type === 'symbol'
  ) {
    // Host elements (e.g. `td`), symbol-typed elements (e.g. Fragment,
    // Suspense) and react-email's own primitives just place their children
    // where they are, so we only need to keep descending through them.
    return propagateThroughChildren(element, contexts);
  }

  if (typeof type === 'function') {
    if (isClassComponent(type)) {
      // Class components cannot be called inline, so contexts only reach
      // whatever the user placed inside of their children prop.
      return propagateThroughChildren(element, contexts);
    }

    return wrapInInjector(element, contexts);
  }

  if (typeof type === 'object' && type !== null) {
    const typeOfType = (type as { $$typeof?: symbol }).$$typeof;
    if (typeOfType === forwardRefTypeSymbol || typeOfType === memoTypeSymbol) {
      return wrapInInjector(element, contexts);
    }

    // Other exotic types, such as React context providers/consumers, lazy
    // components and RSC client references. The most we can do for these is
    // keep propagating through the children the user has passed to them.
    return propagateThroughChildren(element, contexts);
  }

  return element;
};

/**
 * Walks a React node, injecting the given context values into every element
 * marked as an email context consumer (see `markAsEmailContextConsumer`).
 *
 * Since this cannot rely on React context—email templates may be rendered
 * inside RSC where it is not available—values are carried by cloning
 * elements with a private prop. Components found along the way are deferred
 * to render time through `EmailContextInjector`, which continues the
 * propagation through their output.
 *
 * Caveats, by design:
 * - Only the `children` prop is traversed, so consumers inside other
 *   element-typed props (e.g. Suspense's `fallback`) don't receive values.
 * - Consumers rendered inside class components, `React.lazy` components,
 *   render-prop functions or RSC client references fall back to their
 *   default values.
 */
export function propagateEmailContexts(
  node: React.ReactNode,
  contexts: EmailContextMap,
): React.ReactNode {
  if (node === null || node === undefined) {
    return node;
  }

  const typeOfNode = typeof node;
  if (
    typeOfNode === 'string' ||
    typeOfNode === 'number' ||
    typeOfNode === 'boolean' ||
    typeOfNode === 'bigint'
  ) {
    return node;
  }

  if (isThenable(node)) {
    return node.then((resolved) =>
      propagateEmailContexts(resolved as React.ReactNode, contexts),
    ) as unknown as React.ReactNode;
  }

  if (Array.isArray(node)) {
    let changed = false as boolean;
    const mapped = node.map((child) => {
      const result = propagateEmailContexts(child, contexts);
      if (result !== child) {
        changed = true;
      }
      return result;
    });
    if (!changed) {
      return node;
    }
    // The new array counts as dynamic children, so elements that relied on
    // being static JSX children need explicit keys, which are assigned by
    // position the same way React.Children.map does.
    return mapped.map((child, index) =>
      React.isValidElement(child) && child.key === null
        ? React.cloneElement(child, { key: `.${index}` })
        : child,
    );
  }

  if (React.isValidElement<UnknownProps>(node)) {
    return propagateThroughElement(node, contexts);
  }

  if (
    typeof (node as Iterable<React.ReactNode>)[Symbol.iterator] === 'function'
  ) {
    return Array.from(node as Iterable<React.ReactNode>).map((child) =>
      propagateEmailContexts(child, contexts),
    );
  }

  return node;
}
