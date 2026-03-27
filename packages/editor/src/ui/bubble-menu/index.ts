import { BubbleMenuAlignCenter } from './align-center';
import { BubbleMenuAlignLeft } from './align-left';
import { BubbleMenuAlignRight } from './align-right';
import { BubbleMenuBold } from './bold';
import { BubbleMenuButtonDefault } from './button-default';
import { BubbleMenuButtonEditLink } from './button-edit-link';
import { BubbleMenuButtonForm } from './button-form';
import { BubbleMenuButtonToolbar } from './button-toolbar';
import { BubbleMenuButtonUnlink } from './button-unlink';
import { BubbleMenuCode } from './code';
import { BubbleMenuDefault } from './default';
import { BubbleMenuItemGroup } from './group';
import { BubbleMenuImageDefault } from './image-default';
import { BubbleMenuImageEditLink } from './image-edit-link';
import { BubbleMenuImageToolbar } from './image-toolbar';
import { BubbleMenuItalic } from './italic';
import { BubbleMenuItem } from './item';
import { BubbleMenuLinkDefault } from './link-default';
import { BubbleMenuLinkEditLink } from './link-edit-link';
import { BubbleMenuLinkForm } from './link-form';
import { BubbleMenuLinkOpenLink } from './link-open-link';
import { BubbleMenuLinkToolbar } from './link-toolbar';
import { BubbleMenuLinkUnlink } from './link-unlink';
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

// Named exports
export { BubbleMenuAlignCenter } from './align-center';
export { BubbleMenuAlignLeft } from './align-left';
export { BubbleMenuAlignRight } from './align-right';
export { BubbleMenuBold } from './bold';
export { BubbleMenuButtonDefault } from './button-default';
export type { BubbleMenuButtonDefaultProps } from './button-default';
export { BubbleMenuButtonEditLink } from './button-edit-link';
export type { BubbleMenuButtonEditLinkProps } from './button-edit-link';
export { BubbleMenuButtonForm } from './button-form';
export type { BubbleMenuButtonFormProps } from './button-form';
export { BubbleMenuButtonToolbar } from './button-toolbar';
export type { BubbleMenuButtonToolbarProps } from './button-toolbar';
export { BubbleMenuButtonUnlink } from './button-unlink';
export type { BubbleMenuButtonUnlinkProps } from './button-unlink';
export { BubbleMenuCode } from './code';
export { useBubbleMenuContext } from './context';
export type { BubbleMenuContextValue } from './context';
export type { PreWiredItemProps } from './create-mark-bubble-item';
export type { BubbleMenuDefaultProps } from './default';
export { BubbleMenuDefault } from './default';
export type { BubbleMenuItemGroupProps } from './group';
export { BubbleMenuItemGroup } from './group';
export { BubbleMenuImageDefault } from './image-default';
export type { BubbleMenuImageDefaultProps } from './image-default';
export { BubbleMenuImageEditLink } from './image-edit-link';
export type { BubbleMenuImageEditLinkProps } from './image-edit-link';
export { BubbleMenuImageToolbar } from './image-toolbar';
export type { BubbleMenuImageToolbarProps } from './image-toolbar';
export { BubbleMenuItalic } from './italic';
export type { BubbleMenuItemProps } from './item';
export { BubbleMenuItem } from './item';
export { BubbleMenuLinkDefault } from './link-default';
export type { BubbleMenuLinkDefaultProps } from './link-default';
export { BubbleMenuLinkEditLink } from './link-edit-link';
export type { BubbleMenuLinkEditLinkProps } from './link-edit-link';
export { BubbleMenuLinkForm } from './link-form';
export type { BubbleMenuLinkFormProps } from './link-form';
export { BubbleMenuLinkOpenLink } from './link-open-link';
export type { BubbleMenuLinkOpenLinkProps } from './link-open-link';
export { BubbleMenuLinkToolbar } from './link-toolbar';
export type { BubbleMenuLinkToolbarProps } from './link-toolbar';
export { BubbleMenuLinkUnlink } from './link-unlink';
export type { BubbleMenuLinkUnlinkProps } from './link-unlink';
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
export { bubbleMenuTriggers } from './triggers';
export type { ShouldShowFn, ShouldShowParams } from './triggers';

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
  ButtonToolbar: BubbleMenuButtonToolbar,
  ButtonEditLink: BubbleMenuButtonEditLink,
  ButtonUnlink: BubbleMenuButtonUnlink,
  ButtonForm: BubbleMenuButtonForm,
  ButtonDefault: BubbleMenuButtonDefault,
  LinkToolbar: BubbleMenuLinkToolbar,
  LinkEditLink: BubbleMenuLinkEditLink,
  LinkUnlink: BubbleMenuLinkUnlink,
  LinkOpenLink: BubbleMenuLinkOpenLink,
  LinkForm: BubbleMenuLinkForm,
  LinkDefault: BubbleMenuLinkDefault,
  ImageToolbar: BubbleMenuImageToolbar,
  ImageEditLink: BubbleMenuImageEditLink,
  ImageDefault: BubbleMenuImageDefault,
} as const;
