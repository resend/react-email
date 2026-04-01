import {
  type Editor,
  type JSONContent,
  Mark,
  type MarkConfig,
  type MarkType,
} from '@tiptap/core';

export type SerializedMark = NonNullable<JSONContent['marks']>[number];

export type MarkRendererComponent = (props: {
  mark: SerializedMark;
  node: JSONContent;
  style: React.CSSProperties;
  children?: React.ReactNode;

  extension: EmailMark<any, any>;
}) => React.ReactNode;

export interface EmailMarkConfig<Options, Storage>
  extends MarkConfig<Options, Storage> {
  renderToReactEmail: MarkRendererComponent;
}

type ConfigParameter<Options, Storage> = Partial<
  Omit<EmailMarkConfig<Options, Storage>, 'renderToReactEmail'>
> &
  Pick<EmailMarkConfig<Options, Storage>, 'renderToReactEmail'> &
  ThisType<{
    name: string;
    options: Options;
    storage: Storage;
    editor: Editor;
    type: MarkType;
    parent: (...args: any[]) => any;
  }>;

export class EmailMark<
  Options = Record<string, never>,
  Storage = Record<string, never>,
> extends Mark<Options, Storage> {
  declare config: EmailMarkConfig<Options, Storage>;

  // biome-ignore lint/complexity/noUselessConstructor: This is only meant to change the types for config, hence why we keep it
  constructor(config: ConfigParameter<Options, Storage>) {
    super(config);
  }

  /**
   * Create a new Mark instance
   * @param config - Mark configuration object or a function that returns a configuration object
   */
  static create<O = Record<string, never>, S = Record<string, never>>(
    config: ConfigParameter<O, S> | (() => ConfigParameter<O, S>),
  ) {
    const resolvedConfig = typeof config === 'function' ? config() : config;
    return new EmailMark<O, S>(resolvedConfig);
  }

  static from<O, S>(
    mark: Mark<O, S>,
    renderToReactEmail: MarkRendererComponent,
  ): EmailMark<O, S> {
    const customMark = EmailMark.create({} as ConfigParameter<O, S>);
    // This only makes a shallow copy, so if there's nested objects here mutating things will be dangerous
    Object.assign(customMark, { ...mark });
    customMark.config = { ...mark.config, renderToReactEmail };
    return customMark;
  }

  // Subclass return types for configure/extend; safe at runtime. TipTap's Mark typings cause TS2416 when returning EmailMark.
  // @ts-expect-error - EmailMark is a valid Mark subclass; base typings don't support subclass return types
  configure(options?: Partial<Options>) {
    return super.configure(options) as EmailMark<Options, Storage>;
  }

  // @ts-expect-error - same as configure: extend returns EmailMark for chaining; base typings are incompatible
  extend<
    ExtendedOptions = Options,
    ExtendedStorage = Storage,
    ExtendedConfig extends MarkConfig<
      ExtendedOptions,
      ExtendedStorage
    > = EmailMarkConfig<ExtendedOptions, ExtendedStorage>,
  >(
    extendedConfig?:
      | (() => Partial<ExtendedConfig>)
      | (Partial<ExtendedConfig> &
          ThisType<{
            name: string;
            options: ExtendedOptions;
            storage: ExtendedStorage;
            editor: Editor;
            type: MarkType;
          }>),
  ): EmailMark<ExtendedOptions, ExtendedStorage> {
    const resolvedConfig =
      typeof extendedConfig === 'function' ? extendedConfig() : extendedConfig;
    return super.extend(resolvedConfig) as EmailMark<
      ExtendedOptions,
      ExtendedStorage
    >;
  }
}
