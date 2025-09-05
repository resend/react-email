export const importReactDom = () => {
  // We don't use async here because tsup converts it to a generator syntax 
  // that esbuild doesn't understand as dealing with the import failing during
  // bundling: https://github.com/evanw/esbuild/issues/3216#issuecomment-1628913722
  return import('react-dom/server.edge').catch(
    () =>
      // This ensures that we still have compatibility with React 18, 
      // which doesn't have the `.edge` export.
      import('react-dom/server'),
  );
};
