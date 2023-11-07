/**
 * An object that mimics the structure of the Error class,
 * we just can't use the Error class here because server actions can't
 * return classes
 */
export interface ErrorObject {
  name: string;
  stack: string | undefined;
  cause: unknown;
  message: string;
}
