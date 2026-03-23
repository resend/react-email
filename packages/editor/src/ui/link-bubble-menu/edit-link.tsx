import { PencilIcon } from '../../icons';
import type * as React from 'react';
import { useLinkBubbleMenuContext } from './context';

export interface LinkBubbleMenuEditLinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function LinkBubbleMenuEditLink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: LinkBubbleMenuEditLinkProps) {
  const { setIsEditing } = useLinkBubbleMenuContext();

  return (
    <button
      type="button"
      aria-label="Edit link"
      data-re-link-bm-item=""
      data-item="edit-link"
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        setIsEditing(true);
      }}
      {...rest}
    >
      {children ?? <PencilIcon />}
    </button>
  );
}
