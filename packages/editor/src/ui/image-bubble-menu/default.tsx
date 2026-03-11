import { ImageBubbleMenuEditLink } from './edit-link';
import { ImageBubbleMenuRoot } from './root';
import { ImageBubbleMenuToolbar } from './toolbar';

type ExcludableItem = 'edit-link';

export interface ImageBubbleMenuDefaultProps {
  excludeItems?: ExcludableItem[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  className?: string;
}

export function ImageBubbleMenuDefault({
  excludeItems = [],
  placement,
  offset,
  onHide,
  className,
}: ImageBubbleMenuDefaultProps) {
  const hasEditLink = !excludeItems.includes('edit-link');

  return (
    <ImageBubbleMenuRoot
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
    >
      {hasEditLink && (
        <ImageBubbleMenuToolbar>
          <ImageBubbleMenuEditLink />
        </ImageBubbleMenuToolbar>
      )}
    </ImageBubbleMenuRoot>
  );
}
