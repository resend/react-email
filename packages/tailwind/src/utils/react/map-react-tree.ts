import React from 'react';
import { isComponent } from './is-component';

/**
 * A function made for deep mapping a React tree from a node, even through its components.
 * For all the components it finds, it renders them by directly calling them. This has a few issues
 * with hooks, and the only solution is `renderAsync` here, which will probably be done in the future.
 *
 * @param process - The callback that will be called every time a new element has been reached.
 *
 * For components, this is going to be called, most of the time, two times. This is because the best
 * approach is to process *both* before rendering the components (i.e. on the props.children of a component element)
 * and after rendering them because the children themselves might have been modified in the component's
 * rendering.
 */
export function mapReactTree(
  value: React.ReactNode,
  process: (node: React.ReactNode) => React.ReactNode,
): React.ReactNode {
  const mapped = React.Children.map(value, (node) => {
    if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
      const newProps = { ...node.props };

      if (node.props.children && !isComponent(node)) {
        newProps.children = mapReactTree(node.props.children, process);
      }

      const processed = process(
        React.cloneElement(node, newProps, newProps.children),
      );

      if (
        React.isValidElement<{ children?: React.ReactNode }>(processed) &&
        (typeof processed.type === 'function' ||
          // @ts-expect-error - we know this is a component that may have a render function
          processed.type.render)
      ) {
        const OriginalComponent =
          typeof processed.type === 'object'
            ? // @ts-expect-error - we know this is a component with a render function
              (processed.type.render as React.FC)
            : (processed.type as React.FC);

        const rendered = OriginalComponent(processed.props);
        const mappedRenderedNode = mapReactTree(rendered, process);

        return mappedRenderedNode;
      }

      return processed;
    }

    return process(node);
  });

  return mapped && mapped.length === 1 ? mapped[0] : mapped;
}
