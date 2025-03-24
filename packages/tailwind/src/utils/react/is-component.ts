export const isComponent = (
  element: React.ReactElement,
): element is React.ReactElement<unknown, React.FC<unknown>> => {
  return (
    typeof element.type === 'function' ||
    // @ts-expect-error - we know this is a component that may have a render function
    element.type.render !== undefined
  );
};
