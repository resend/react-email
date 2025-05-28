declare module "react-markup" {
  export const version: string;

  export function experimental_renderToHTML(
    element: React.ReactElement,
    options?: {
      identifierPrefix?: string,
      signal?: AbortSignal,
      onError?: (error: unknown, errorInfo: { componentStack?: string }) => ?string,
    }
  ): Promise<string>;
}
