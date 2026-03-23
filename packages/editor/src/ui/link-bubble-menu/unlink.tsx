import type * as React from 'react';
import { UnlinkIcon } from '../icons';
import { useLinkBubbleMenuContext } from './context';

export interface LinkBubbleMenuUnlinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function LinkBubbleMenuUnlink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: LinkBubbleMenuUnlinkProps) {
  const { editor } = useLinkBubbleMenuContext();

  return (
    <button
      type="button"
      aria-label="Remove link"
      data-re-link-bm-item=""
      data-item="unlink"
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        editor.chain().focus().unsetLink().run();
      }}
      {...rest}
    >
      {children ?? <UnlinkIcon />}
    </button>
  );
}
