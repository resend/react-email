import { BubbleMenuAlignCenter } from './align-center';
import { BubbleMenuAlignLeft } from './align-left';
import { BubbleMenuAlignRight } from './align-right';
import { BubbleMenuBold } from './bold';
import { BubbleMenuCode } from './code';
import { BubbleMenuGroup } from './group';
import { BubbleMenuItalic } from './italic';
import { BubbleMenuItem } from './item';
import { BubbleMenuLinkSelector } from './link-selector';
import { BubbleMenuNodeSelector } from './node-selector';
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
export type { PreWiredItemProps } from './create-pre-wired-item';
export type { BubbleMenuGroupProps } from './group';
export { BubbleMenuGroup } from './group';
export { BubbleMenuItalic } from './italic';
export type { BubbleMenuItemProps } from './item';
export { BubbleMenuItem } from './item';
export type { BubbleMenuLinkSelectorProps } from './link-selector';
export { BubbleMenuLinkSelector } from './link-selector';
export type { BubbleMenuNodeSelectorProps } from './node-selector';
export { BubbleMenuNodeSelector } from './node-selector';
export type { BubbleMenuRootProps } from './root';
export { BubbleMenuRoot } from './root';
export type { BubbleMenuSeparatorProps } from './separator';
export { BubbleMenuSeparator } from './separator';
export { BubbleMenuStrike } from './strike';
// Side-effect import: registers bubble-menu events on EditorEventMap
import './types';

export { BubbleMenuUnderline } from './underline';
export { BubbleMenuUppercase } from './uppercase';

// Compound component namespace for convenient `BubbleMenu.Root` usage
export const BubbleMenu = {
  Root: BubbleMenuRoot,
  Group: BubbleMenuGroup,
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
  NodeSelector: BubbleMenuNodeSelector,
  LinkSelector: BubbleMenuLinkSelector,
} as const;
