export const mergeRefs = <T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> => {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    });
  };
};
