import * as acorn from 'acorn';
import typescript from 'acorn-typescript';

export const Parser = acorn.Parser.extend(
  // @ts-expect-error
  typescript({
    allowSatisfies: true,
  }),
);

export type AST = ReturnType<typeof Parser.parse>;
