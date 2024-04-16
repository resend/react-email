interface ForwardRefComponent<P = unknown> {
  render: React.FC<P>;
}

/**
  * A type that extends the usual {@link React.ReactElement} but adds in the case
  * where the `type` inside of the element is one from a `forwardRef` which is usually
  * like:
  *
  * ```json
  * {
  *   "type": {
  *     "render": [FunctionComponent]
  *   }
  *   ...
  * }
  * ```
  */
export interface ElementWithPossibleForwardRef<
  P = unknown,
  T extends string | React.JSXElementConstructor<P> | ForwardRefComponent<P> =
    | string
    | React.JSXElementConstructor<P>
    | ForwardRefComponent<P>,
> {
  type: T;
  props: P;
  key: string | null;
}

export const isComponent = <P = unknown>(
  element: ElementWithPossibleForwardRef<
    P,
    string | React.JSXElementConstructor<P> | ForwardRefComponent<P>
  >,
): element is ElementWithPossibleForwardRef<
  P,
  React.FC<P> | ForwardRefComponent<P>
> => {
  return (
    typeof element.type === "function" ||
    // @ts-expect-error - we know this is a component that may have a render function
    Boolean(element.type.render as React.FC | undefined)
  );
};
