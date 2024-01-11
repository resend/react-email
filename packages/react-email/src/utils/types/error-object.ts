export interface ErrorObject {
  name: string;
  stack: string | undefined;
  cause: unknown;
  message: string;
}
