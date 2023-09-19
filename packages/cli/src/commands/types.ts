export type Flags = Record<string, string | boolean | undefined>;

export type CommandFn = (flags: Flags, inputs: string[]) => Promise<boolean>;

export type TemplateFn = (props: {}) => JSX.Element;
