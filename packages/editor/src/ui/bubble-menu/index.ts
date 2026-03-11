import { BubbleMenuAlignCenter } from './align-center.js';
import { BubbleMenuAlignLeft } from './align-left.js';
import { BubbleMenuAlignRight } from './align-right.js';
import { BubbleMenuBold } from './bold.js';
import { BubbleMenuCode } from './code.js';
import { BubbleMenuDefault } from './default.js';
import { BubbleMenuItemGroup } from './group.js';
import { BubbleMenuItalic } from './italic.js';
import { BubbleMenuItem } from './item.js';
import { BubbleMenuLinkSelector } from './link-selector.js';
import {
  BubbleMenuNodeSelector,
  NodeSelectorContent,
  NodeSelectorRoot,
  NodeSelectorTrigger,
} from './node-selector.js';
import { BubbleMenuRoot } from './root.js';
import { BubbleMenuSeparator } from './separator.js';
import { BubbleMenuStrike } from './strike.js';
import { BubbleMenuUnderline } from './underline.js';
import { BubbleMenuUppercase } from './uppercase.js';

export { BubbleMenuAlignCenter } from './align-center.js';
export { BubbleMenuAlignLeft } from './align-left.js';
export { BubbleMenuAlignRight } from './align-right.js';
export { BubbleMenuBold } from './bold.js';
export { BubbleMenuCode } from './code.js';
export type { PreWiredItemProps } from './create-mark-bubble-item.js';
export type { BubbleMenuDefaultProps } from './default.js';
export { BubbleMenuDefault } from './default.js';
export type { BubbleMenuItemGroupProps } from './group.js';
export { BubbleMenuItemGroup } from './group.js';
export { BubbleMenuItalic } from './italic.js';
export type { BubbleMenuItemProps } from './item.js';
export { BubbleMenuItem } from './item.js';
export type { BubbleMenuLinkSelectorProps } from './link-selector.js';
export { BubbleMenuLinkSelector } from './link-selector.js';
export type {
  BubbleMenuNodeSelectorProps,
  NodeSelectorContentProps,
  NodeSelectorItem,
  NodeSelectorRootProps,
  NodeSelectorTriggerProps,
  NodeType,
} from './node-selector.js';
export {
  BubbleMenuNodeSelector,
  NodeSelectorContent,
  NodeSelectorRoot,
  NodeSelectorTrigger,
} from './node-selector.js';
export type { BubbleMenuRootProps } from './root.js';
export { BubbleMenuRoot } from './root.js';
export type { BubbleMenuSeparatorProps } from './separator.js';
export { BubbleMenuSeparator } from './separator.js';
export { BubbleMenuStrike } from './strike.js';
export { BubbleMenuUnderline } from './underline.js';
export { BubbleMenuUppercase } from './uppercase.js';

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
