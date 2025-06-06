export const importReactDOM = async () => {
  try {
    return await import('react-dom/server.edge');
  } catch (_exception) {
    return await import('react-dom/server');
  }
};
