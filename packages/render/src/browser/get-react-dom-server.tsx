let reactDOMServer: typeof import("react-dom/server") | undefined;

export const getReactDOMServer = async () => {
  if (!reactDOMServer) {
    try {
      reactDOMServer = (await import(
        // @ts-expect-error There are no types for this particular export yet
        "react-dom/server.edge"
      )) as typeof import("react-dom/server");
    } catch (exception) {
      reactDOMServer = await import("react-dom/server");
    }
  }

  return reactDOMServer;
};
