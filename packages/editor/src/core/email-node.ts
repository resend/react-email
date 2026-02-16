import {
  type Editor,
  type JSONContent,
  Node,
  type NodeConfig,
  type NodeType,
} from '@tiptap/core';
import type { CssJs } from '@/types/editor/styles';

export type RendererComponent = (props: {
  node: JSONContent;
  styles: CssJs;
  children?: React.ReactNode;
}) => React.ReactNode;

export interface EmailNodeConfig<Options, Storage>
  extends NodeConfig<Options, Storage> {
  renderToReactEmail: RendererComponent;
}

type ConfigParameter<Options, Storage> = Partial<
  Omit<EmailNodeConfig<Options, Storage>, 'renderToReactEmail'>
> &
  Pick<EmailNodeConfig<Options, Storage>, 'renderToReactEmail'>;

export class EmailNode<
  Options = Record<string, never>,
  Storage = Record<string, never>,
> extends Node<Options, Storage> {
  declare config: EmailNodeConfig<Options, Storage>;

  // biome-ignore lint/complexity/noUselessConstructor: This is only meant to change the types for config, hence why we keep it
  constructor(config: ConfigParameter<Options, Storage>) {
    super(config);
  }

  /**
   * Create a new Node instance
   * @param config - Node configuration object or a function that returns a configuration object
   */
  static create<O = Record<string, never>, S = Record<string, never>>(
    config: ConfigParameter<O, S> | (() => ConfigParameter<O, S>),
  ) {
    // If the config is a function, execute it to get the configuration object
    const resolvedConfig = typeof config === 'function' ? config() : config;
    return new EmailNode<O, S>(resolvedConfig);
  }

  static from<O, S>(
    node: Node<O, S>,
    renderToReactEmail: RendererComponent,
  ): EmailNode<O, S> {
    const customNode = EmailNode.create({} as ConfigParameter<O, S>);
    // This only makes a shallow copy, so if there's nested objects here mutating things will be dangerous
    Object.assign(customNode, { ...node });
    customNode.config = { ...node.config, renderToReactEmail };
    return customNode;
  }

  configure(options?: Partial<Options>) {
    return super.configure(options) as EmailNode<Options, Storage>;
  }

  extend<
    ExtendedOptions = Options,
    ExtendedStorage = Storage,
    ExtendedConfig extends NodeConfig<
      ExtendedOptions,
      ExtendedStorage
    > = EmailNodeConfig<ExtendedOptions, ExtendedStorage>,
  >(
    extendedConfig?:
      | (() => Partial<ExtendedConfig>)
      | (Partial<ExtendedConfig> &
          ThisType<{
            name: string;
            options: ExtendedOptions;
            storage: ExtendedStorage;
            editor: Editor;
            type: NodeType;
          }>),
  ): EmailNode<ExtendedOptions, ExtendedStorage> {
    // If the extended config is a function, execute it to get the configuration object
    const resolvedConfig =
      typeof extendedConfig === 'function' ? extendedConfig() : extendedConfig;
    return super.extend(resolvedConfig) as EmailNode<
      ExtendedOptions,
      ExtendedStorage
    >;
  }
}
