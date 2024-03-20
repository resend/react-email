import React from "react";

/**
 * A function made for deep mapping a React tree from a node, even through its components.
 *
 * This is not async nor does it render itself the React components that it ends up finding.
 * The callbacks are going to be async, depending on you rendering method, but this will
 * work either way.
 *
 * @param finishedRenderingANode - Used internally — as the function is recursive — with the purpose
 * of counting the current global React tree index that has been rendered out of the total React tree size.
 *
 * This function is really useful because we can choose when to increase the index or not when 
 * we are rendering the component.
 */
export function walkElements(
  value: React.ReactNode,
  {
    preprocess = (n) => n,
    process = (n) => n,

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterAll = () => {},
  }: {
    /**
     * This is a more lightweight version of {@link process} and it is called right away for all
     * nodes. This is even internally used, by this function itself, for counting the size of the React tree
     * and the amount of nodes rendered.
     */
    preprocess?: (node: React.ReactNode) => React.ReactNode;

    /**
     * The callback that will be called every time a new element has been reached.
     *
     * For components, this is going to be called, most of the time, two times. This is because the best
     * approach is to process *both* before rendering the components (i.e. on the props.children of a component element)
     * and after rendering them because the children themselves might have been modified in the component's
     * rendering.
     */
    process?: (node: React.ReactNode) => React.ReactNode;

    /**
     * A function that is called once all the elements have been rendered. It detects this by counting
     * the size of the React tree and keeping track of which node was already rendered. Once it detects that all the nodes
     * have been rendered, it then is called.
     *
     * The way this function keeps track of the rendered elements is by proxying the `process` function in order
     * to only increase a global index in the React tree, and while doing that, making an estimate based on the children
     * it is able to find in the props, of what the size of the React tree is. By the end of rendering all components, and
     * elements being processed, the React tree's size has been found and the index has reached the end.
     */
    afterAll?: () => void;
  },

  finishedRenderingANode?: () => void,
): React.ReactNode {
  let currentKnownReactTreeSize = React.Children.toArray(value).length;
  let reactTreeIndex = 0;

  const onNodeRenderingFinished = () => {
    reactTreeIndex++;
    finishedRenderingANode?.();
    if (reactTreeIndex === currentKnownReactTreeSize) {
      afterAll();
    }
  };
  return React.Children.map(value, (node) => {
    const preprocessed = preprocess(node);

    if (React.isValidElement<{ children?: React.ReactNode }>(preprocessed)) {
      const OriginalComponent = preprocessed.type as React.FC;

      const newProps = { ...preprocessed.props };

      if (preprocessed.props.children) {
        newProps.children = walkElements(
          preprocessed.props.children,
          {
            process,
            preprocess: (n) => {
              currentKnownReactTreeSize++;

              return preprocess(n);
            },
          },
          onNodeRenderingFinished,
        );
      }

      if (typeof preprocessed.type === "function") {
        return process(
          React.createElement(
            (props) => {
              const rendered = OriginalComponent(props);

              const mappedRenderedNode = walkElements(
                rendered,
                {
                  process,
                  preprocess: (n) => {
                    currentKnownReactTreeSize++;

                    return preprocess(n);
                  },
                },
                onNodeRenderingFinished,
              );

              onNodeRenderingFinished();
              return mappedRenderedNode;
            },
            newProps,
            newProps.children,
          ),
        );
      }

      const processed = process(
        React.cloneElement(preprocessed, newProps, newProps.children),
      );
      onNodeRenderingFinished();
      return processed;
    }

    const processed = process(preprocessed);
    onNodeRenderingFinished();
    return processed;
  });
}
