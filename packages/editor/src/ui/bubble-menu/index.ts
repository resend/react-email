import { BubbleMenuRoot } from './root';
import { BubbleMenuGroup } from './group';
import { BubbleMenuSeparator } from './separator';
import { BubbleMenuItem } from './item';
import { BubbleMenuBold } from './bold';
import { BubbleMenuItalic } from './italic';
import { BubbleMenuUnderline } from './underline';
import { BubbleMenuStrike } from './strike';
import { BubbleMenuCode } from './code';
import { BubbleMenuUppercase } from './uppercase';
import { BubbleMenuAlignLeft } from './align-left';
import { BubbleMenuAlignCenter } from './align-center';
import { BubbleMenuAlignRight } from './align-right';
import { BubbleMenuNodeSelector } from './node-selector';
import { BubbleMenuLinkSelector } from './link-selector';

export { BubbleMenuRoot } from './root';
export type { BubbleMenuRootProps } from './root';

export { BubbleMenuGroup } from './group';
export type { BubbleMenuGroupProps } from './group';

export { BubbleMenuSeparator } from './separator';
export type { BubbleMenuSeparatorProps } from './separator';

export { BubbleMenuItem } from './item';
export type { BubbleMenuItemProps } from './item';

export type { PreWiredItemProps } from './create-pre-wired-item';

export { BubbleMenuBold } from './bold';
export { BubbleMenuItalic } from './italic';
export { BubbleMenuUnderline } from './underline';
export { BubbleMenuStrike } from './strike';
export { BubbleMenuCode } from './code';
export { BubbleMenuUppercase } from './uppercase';
export { BubbleMenuAlignLeft } from './align-left';
export { BubbleMenuAlignCenter } from './align-center';
export { BubbleMenuAlignRight } from './align-right';

export { BubbleMenuNodeSelector } from './node-selector';
export type { BubbleMenuNodeSelectorProps } from './node-selector';

export { BubbleMenuLinkSelector } from './link-selector';
export type { BubbleMenuLinkSelectorProps } from './link-selector';

export { editorBubbleMenuEventBus } from './event-bus';
export type {
  BubbleMenuEventMap,
  BubbleMenuEventName,
  BubbleMenuEventHandler,
  BubbleMenuEventSubscription,
} from './types';

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
