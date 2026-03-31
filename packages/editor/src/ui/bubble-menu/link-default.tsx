import { PluginKey } from '@tiptap/pm/state';
import type * as React from 'react';
import { BubbleMenuLinkEditLink } from './link-edit-link';
import { BubbleMenuLinkForm } from './link-form';
import { BubbleMenuLinkOpenLink } from './link-open-link';
import { BubbleMenuLinkToolbar } from './link-toolbar';
import { BubbleMenuLinkUnlink } from './link-unlink';
import { BubbleMenuRoot } from './root';
import { bubbleMenuTriggers } from './triggers';

const linkPluginKey = new PluginKey('linkBubbleMenu');

type ExcludableItem = 'edit-link' | 'open-link' | 'unlink';

export interface BubbleMenuLinkDefaultProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  excludeItems?: ExcludableItem[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
}

export function BubbleMenuLinkDefault({
  excludeItems = [],
  placement = 'top',
  offset,
  onHide,
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
  ...rest
}: BubbleMenuLinkDefaultProps) {
  const has = (item: ExcludableItem) => !excludeItems.includes(item);

  const hasToolbarItems = has('edit-link') || has('open-link') || has('unlink');

  return (
    <BubbleMenuRoot
      shouldShow={bubbleMenuTriggers.nodeWithoutSelection('link')}
      pluginKey={linkPluginKey}
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
      {...rest}
    >
      {hasToolbarItems && (
        <BubbleMenuLinkToolbar>
          {has('edit-link') && <BubbleMenuLinkEditLink />}
          {has('open-link') && <BubbleMenuLinkOpenLink />}
          {has('unlink') && <BubbleMenuLinkUnlink />}
        </BubbleMenuLinkToolbar>
      )}
      <BubbleMenuLinkForm
        validateUrl={validateUrl}
        onLinkApply={onLinkApply}
        onLinkRemove={onLinkRemove}
      />
    </BubbleMenuRoot>
  );
}
