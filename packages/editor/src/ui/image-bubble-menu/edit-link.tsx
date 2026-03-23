import { LinkIcon } from '../../icons';
import type * as React from 'react';
import { useImageBubbleMenuContext } from './context';

export interface ImageBubbleMenuEditLinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function ImageBubbleMenuEditLink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: ImageBubbleMenuEditLinkProps) {
  const { setIsEditing } = useImageBubbleMenuContext();

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
      {children ?? <LinkIcon />}
    </button>
  );
}
