import type * as React from 'react';
import { ImageBubbleMenuEditLink } from './edit-link';
import { ImageBubbleMenuRoot } from './root';
import { ImageBubbleMenuToolbar } from './toolbar';

type ExcludableItem = 'edit-link';

export interface ImageBubbleMenuDefaultProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  excludeItems?: ExcludableItem[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
}

export function ImageBubbleMenuDefault({
  excludeItems = [],
  placement,
  offset,
  onHide,
  className,
  ...rest
}: ImageBubbleMenuDefaultProps) {
  const hasEditLink = !excludeItems.includes('edit-link');

  return (
    <ImageBubbleMenuRoot
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
      {...rest}
    >
      {hasEditLink && (
        <ImageBubbleMenuToolbar>
          <ImageBubbleMenuEditLink />
        </ImageBubbleMenuToolbar>
      )}
    </ImageBubbleMenuRoot>
  );
}
