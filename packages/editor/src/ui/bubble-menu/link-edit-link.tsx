import type * as React from 'react';
import { PencilIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkEditLinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function BubbleMenuLinkEditLink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: BubbleMenuLinkEditLinkProps) {
  const { setIsEditing } = useBubbleMenuContext();

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
