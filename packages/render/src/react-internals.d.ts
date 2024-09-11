declare module "react-dom/server.browser" {
  export * from "react-dom/server";
}

declare module "react-markup" {
  export function experimental_renderToHTML(element: React.ReactElement): Promise<string>;
}
