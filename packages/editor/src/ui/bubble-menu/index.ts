import { BubbleMenuAlignCenter } from './align-center';
import { BubbleMenuAlignLeft } from './align-left';
import { BubbleMenuAlignRight } from './align-right';
import { BubbleMenuBold } from './bold';
import { BubbleMenuCode } from './code';
import { BubbleMenuDefault } from './default';
import { BubbleMenuItemGroup } from './group';
import { BubbleMenuItalic } from './italic';
import { BubbleMenuItem } from './item';
import { BubbleMenuLinkSelector } from './link-selector';
import {
  BubbleMenuNodeSelector,
  NodeSelectorContent,
  NodeSelectorRoot,
  NodeSelectorTrigger,
} from './node-selector';
import { BubbleMenuRoot } from './root';
import { BubbleMenuSeparator } from './separator';
import { BubbleMenuStrike } from './strike';
import { BubbleMenuUnderline } from './underline';
import { BubbleMenuUppercase } from './uppercase';

export { BubbleMenuAlignCenter } from './align-center';
export { BubbleMenuAlignLeft } from './align-left';
export { BubbleMenuAlignRight } from './align-right';
export { BubbleMenuBold } from './bold';
export { BubbleMenuCode } from './code';
export type { PreWiredItemProps } from './create-mark-bubble-item';
export type { BubbleMenuDefaultProps } from './default';
export { BubbleMenuDefault } from './default';
export type { BubbleMenuItemGroupProps } from './group';
export { BubbleMenuItemGroup } from './group';
export { BubbleMenuItalic } from './italic';
export type { BubbleMenuItemProps } from './item';
export { BubbleMenuItem } from './item';
export type { BubbleMenuLinkSelectorProps } from './link-selector';
export { BubbleMenuLinkSelector } from './link-selector';
export type {
  BubbleMenuNodeSelectorProps,
  NodeSelectorContentProps,
  NodeSelectorItem,
  NodeSelectorRootProps,
  NodeSelectorTriggerProps,
  NodeType,
} from './node-selector';
export {
  BubbleMenuNodeSelector,
  NodeSelectorContent,
  NodeSelectorRoot,
  NodeSelectorTrigger,
} from './node-selector';
export type { BubbleMenuRootProps } from './root';
export { BubbleMenuRoot } from './root';
export type { BubbleMenuSeparatorProps } from './separator';
export { BubbleMenuSeparator } from './separator';
export { BubbleMenuStrike } from './strike';
export { BubbleMenuUnderline } from './underline';
export { BubbleMenuUppercase } from './uppercase';

// Compound component namespace for convenient `BubbleMenu.Root` usage
export const BubbleMenu = {
  Root: BubbleMenuRoot,
  ItemGroup: BubbleMenuItemGroup,
  Separator: BubbleMenuSeparator,
  Item: BubbleMenuItem,
  Bold: BubbleMenuBold,
  Italic: BubbleMenuItalic,
  Underline: BubbleMenuUnderline,
  Strike: BubbleMenuStrike,
  Code: BubbleMenuCode,
  Uppercase: BubbleMenuUppercase,
  AlignLeft: BubbleMenuAlignLeft,
  AlignCenter: BubbleMenuAlignCenter,
  AlignRight: BubbleMenuAlignRight,
  NodeSelector: Object.assign(BubbleMenuNodeSelector, {
    Root: NodeSelectorRoot,
    Trigger: NodeSelectorTrigger,
    Content: NodeSelectorContent,
  }),
  LinkSelector: BubbleMenuLinkSelector,
  Default: BubbleMenuDefault,
} as const;
