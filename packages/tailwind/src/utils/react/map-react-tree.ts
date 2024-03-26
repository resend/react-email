import React from "react";

/**
 * A function made for deep mapping a React tree from a node, even through its components.
 *
 * This is not async nor does it render itself the React components that it ends up finding.
 * The callbacks are going to be async, depending on you rendering method, but this will
 * work either way.
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
  return React.Children.map(value, (node) => {
    if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
      const newProps = { ...node.props };

      if (node.props.children) {
        newProps.children = mapReactTree(node.props.children, process);
      }

      const processed = process(
        React.cloneElement(node, newProps, newProps.children),
      );

      if (
        React.isValidElement<{ children?: React.ReactNode }>(processed) &&
        typeof processed.type === "function"
      ) {
        const OriginalComponent = processed.type as React.FC;

        const rendered = OriginalComponent(processed.props);
        const mappedRenderedNode = mapReactTree(rendered, process);

        return mappedRenderedNode;
      }

      return processed;
    }

    return process(node);
  });
}
