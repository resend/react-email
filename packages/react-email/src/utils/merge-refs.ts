export const mergeRefs = <T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> => {
  return (value) => {
    const cleanups: (() => void)[] = [];
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        const cleanup = ref(value);
        if (cleanup) {
          cleanups.push(cleanup);
        }
      } else if (ref) {
        ref.current = value;
      }
    });

    return () => {
      cleanups.forEach((callback) => callback());
    };
  };
};
