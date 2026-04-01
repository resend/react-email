import type * as React from 'react';
import { PencilIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuButtonEditLinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function BubbleMenuButtonEditLink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: BubbleMenuButtonEditLinkProps) {
  const { setIsEditing } = useBubbleMenuContext();

  return (
    <button
      {...rest}
      type="button"
      aria-label="Edit link"
      data-re-btn-bm-item=""
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
    >
      {children ?? <PencilIcon />}
    </button>
  );
}
