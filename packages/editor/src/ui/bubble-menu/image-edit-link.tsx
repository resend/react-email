import type * as React from 'react';
import { PencilIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuImageEditLinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function BubbleMenuImageEditLink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: BubbleMenuImageEditLinkProps) {
  const { setIsEditing } = useBubbleMenuContext();

  return (
    <button
      {...rest}
      type="button"
      aria-label="Edit link"
      data-re-img-bm-item=""
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
