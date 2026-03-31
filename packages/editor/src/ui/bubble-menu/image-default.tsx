import { PluginKey } from '@tiptap/pm/state';
import type * as React from 'react';
import { BubbleMenuImageEditLink } from './image-edit-link';
import { BubbleMenuImageToolbar } from './image-toolbar';
import { BubbleMenuRoot } from './root';
import { bubbleMenuTriggers } from './triggers';

const imagePluginKey = new PluginKey('imageBubbleMenu');

type ExcludableItem = 'edit-link';

export interface BubbleMenuImageDefaultProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  excludeItems?: ExcludableItem[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
}

export function BubbleMenuImageDefault({
  excludeItems = [],
  placement = 'top',
  offset,
  onHide,
  className,
  ...rest
}: BubbleMenuImageDefaultProps) {
  const hasEditLink = !excludeItems.includes('edit-link');

  return (
    <BubbleMenuRoot
      shouldShow={bubbleMenuTriggers.node('image')}
      pluginKey={imagePluginKey}
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
      {...rest}
    >
      {hasEditLink && (
        <BubbleMenuImageToolbar>
          <BubbleMenuImageEditLink />
        </BubbleMenuImageToolbar>
      )}
    </BubbleMenuRoot>
  );
}
