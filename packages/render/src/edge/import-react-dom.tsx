export const importReactDOM = async () => {
  try {
    return await import('react-dom/server.edge');
  } catch (_exception) {
    // This ensures that we still have compatibiltity with React 18, which doesn't have the `edge` conditional export.
    return await import('react-dom/server');
  }
};
