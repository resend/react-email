import { PencilIcon } from '../icons';
import type * as React from 'react';
import { useButtonBubbleMenuContext } from './context';

export interface ButtonBubbleMenuEditLinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function ButtonBubbleMenuEditLink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: ButtonBubbleMenuEditLinkProps) {
  const { setIsEditing } = useButtonBubbleMenuContext();

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
