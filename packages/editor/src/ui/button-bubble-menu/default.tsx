import { ButtonBubbleMenuEditLink } from './edit-link.js';
import { ButtonBubbleMenuRoot } from './root.js';
import { ButtonBubbleMenuToolbar } from './toolbar.js';

type ExcludableItem = 'edit-link';

export interface ButtonBubbleMenuDefaultProps {
  excludeItems?: ExcludableItem[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  className?: string;
}

export function ButtonBubbleMenuDefault({
  excludeItems = [],
  placement,
  offset,
  onHide,
  className,
}: ButtonBubbleMenuDefaultProps) {
  const hasEditLink = !excludeItems.includes('edit-link');

  return (
    <ButtonBubbleMenuRoot
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
    >
      {hasEditLink && (
        <ButtonBubbleMenuToolbar>
          <ButtonBubbleMenuEditLink />
        </ButtonBubbleMenuToolbar>
      )}
    </ButtonBubbleMenuRoot>
  );
}
