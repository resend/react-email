export type ArgsOf<Func> = Func extends (...args: infer Args) => unknown
  ? Args
  : never;
