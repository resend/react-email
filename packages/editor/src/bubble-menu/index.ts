// Primitives (Radix-style compound components)

// Pre-built formatting buttons
export {
  AlignCenterButton,
  AlignLeftButton,
  AlignRightButton,
  BoldButton,
  CodeButton,
  ItalicButton,
  StrikeButton,
  UnderlineButton,
  UppercaseButton,
} from './buttons';
export type {
  BubbleMenuItemConfig,
  UseAlignmentItemsOptions,
  UseBubbleMenuOptions,
  UseBubbleMenuReturn,
  UseFormattingItemsOptions,
  UseLinkFormOptions,
  UseLinkFormReturn,
  UseNodeSelectorItemsOptions,
} from './hooks';
// Escape-hatch hooks (Base UI-style)
export {
  useAlignmentItems,
  useBubbleMenu,
  useFormattingItems,
  useLinkForm,
  useNodeSelectorItems,
} from './hooks';
export type {
  LinkFormInputProps,
  LinkFormProps,
  LinkFormSubmitProps,
  LinkFormUnlinkProps,
} from './link-form';

// Link Form (compound component)
export {
  LinkForm,
  LinkFormInput,
  LinkFormSubmit,
  LinkFormUnlink,
} from './link-form';
export type { NodeSelectorItemConfig } from './node-selector';
// Node Selector (compound component)
export {
  NodeSelector,
  NodeSelectorContent,
  NodeSelectorItem,
  NodeSelectorTrigger,
} from './node-selector';

// Pre-composed presets (zero-config)
export {
  ButtonBubbleMenu,
  ImageBubbleMenu,
  LinkBubbleMenu,
  TextBubbleMenu,
} from './presets';
export type {
  BubbleMenuButtonProps,
  BubbleMenuGroupProps,
  BubbleMenuRootProps,
  BubbleMenuSeparatorProps,
} from './primitives';
export {
  BubbleMenuButton,
  BubbleMenuGroup,
  BubbleMenuRoot,
  BubbleMenuSeparator,
} from './primitives';
