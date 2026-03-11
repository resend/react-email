import { LinkBubbleMenuEditLink } from './edit-link';
import { LinkBubbleMenuForm } from './form';
import { LinkBubbleMenuOpenLink } from './open-link';
import { LinkBubbleMenuRoot } from './root';
import { LinkBubbleMenuToolbar } from './toolbar';
import { LinkBubbleMenuUnlink } from './unlink';

type ExcludableItem = 'edit-link' | 'open-link' | 'unlink';

export interface LinkBubbleMenuDefaultProps {
  excludeItems?: ExcludableItem[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  className?: string;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
}

export function LinkBubbleMenuDefault({
  excludeItems = [],
  placement,
  offset,
  onHide,
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
}: LinkBubbleMenuDefaultProps) {
  const has = (item: ExcludableItem) => !excludeItems.includes(item);

  const hasToolbarItems = has('edit-link') || has('open-link') || has('unlink');

  return (
    <LinkBubbleMenuRoot
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
    >
      {hasToolbarItems && (
        <LinkBubbleMenuToolbar>
          {has('edit-link') && <LinkBubbleMenuEditLink />}
          {has('open-link') && <LinkBubbleMenuOpenLink />}
          {has('unlink') && <LinkBubbleMenuUnlink />}
        </LinkBubbleMenuToolbar>
      )}
      <LinkBubbleMenuForm
        validateUrl={validateUrl}
        onLinkApply={onLinkApply}
        onLinkRemove={onLinkRemove}
      />
    </LinkBubbleMenuRoot>
  );
}
