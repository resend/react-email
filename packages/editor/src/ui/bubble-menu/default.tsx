import * as React from 'react';
import { BubbleMenuAlignCenter } from './align-center';
import { BubbleMenuAlignLeft } from './align-left';
import { BubbleMenuAlignRight } from './align-right';
import { BubbleMenuBold } from './bold';
import { BubbleMenuCode } from './code';
import { BubbleMenuItemGroup } from './group';
import { BubbleMenuItalic } from './italic';
import { BubbleMenuLinkSelector } from './link-selector';
import { BubbleMenuNodeSelector } from './node-selector';
import { BubbleMenuRoot } from './root';
import { BubbleMenuStrike } from './strike';
import { BubbleMenuUnderline } from './underline';
import { BubbleMenuUppercase } from './uppercase';

type ExcludableItem =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'uppercase'
  | 'align-left'
  | 'align-center'
  | 'align-right'
  | 'node-selector'
  | 'link-selector';

export interface BubbleMenuDefaultProps {
  /** Items to exclude from the default layout */
  excludeItems?: ExcludableItem[];
  /** Node types that should NOT trigger the bubble menu (forwarded to Root) */
  excludeNodes?: string[];
  /** Placement relative to selection (forwarded to Root, default: 'bottom') */
  placement?: 'top' | 'bottom';
  /** Offset from selection in px (forwarded to Root, default: 8) */
  offset?: number;
  /** Called when the bubble menu hides (forwarded to Root) */
  onHide?: () => void;
  /** className applied to the Root wrapper */
  className?: string;
}

export function BubbleMenuDefault({
  excludeItems = [],
  excludeNodes,
  placement,
  offset,
  onHide,
  className,
}: BubbleMenuDefaultProps) {
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = React.useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = React.useState(false);

  const has = (item: ExcludableItem) => !excludeItems.includes(item);

  const handleNodeSelectorOpenChange = React.useCallback((open: boolean) => {
    setIsNodeSelectorOpen(open);
    if (open) {
      setIsLinkSelectorOpen(false);
    }
  }, []);

  const handleLinkSelectorOpenChange = React.useCallback((open: boolean) => {
    setIsLinkSelectorOpen(open);
    if (open) {
      setIsNodeSelectorOpen(false);
    }
  }, []);

  const handleHide = React.useCallback(() => {
    setIsNodeSelectorOpen(false);
    setIsLinkSelectorOpen(false);
    onHide?.();
  }, [onHide]);

  const hasFormattingItems =
    has('bold') ||
    has('italic') ||
    has('underline') ||
    has('strike') ||
    has('code') ||
    has('uppercase');

  const hasAlignmentItems =
    has('align-left') || has('align-center') || has('align-right');

  return (
    <BubbleMenuRoot
      excludeNodes={excludeNodes}
      placement={placement}
      offset={offset}
      onHide={handleHide}
      className={className}
    >
      {has('node-selector') && (
        <BubbleMenuNodeSelector
          open={isNodeSelectorOpen}
          onOpenChange={handleNodeSelectorOpenChange}
        />
      )}
      {has('link-selector') && (
        <BubbleMenuLinkSelector
          open={isLinkSelectorOpen}
          onOpenChange={handleLinkSelectorOpenChange}
        />
      )}
      {hasFormattingItems && (
        <BubbleMenuItemGroup>
          {has('bold') && <BubbleMenuBold />}
          {has('italic') && <BubbleMenuItalic />}
          {has('underline') && <BubbleMenuUnderline />}
          {has('strike') && <BubbleMenuStrike />}
          {has('code') && <BubbleMenuCode />}
          {has('uppercase') && <BubbleMenuUppercase />}
        </BubbleMenuItemGroup>
      )}
      {hasAlignmentItems && (
        <BubbleMenuItemGroup>
          {has('align-left') && <BubbleMenuAlignLeft />}
          {has('align-center') && <BubbleMenuAlignCenter />}
          {has('align-right') && <BubbleMenuAlignRight />}
        </BubbleMenuItemGroup>
      )}
    </BubbleMenuRoot>
  );
}
