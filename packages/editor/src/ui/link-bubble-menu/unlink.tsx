import { UnlinkIcon } from 'lucide-react';
import type * as React from 'react';
import { useLinkBubbleMenuContext } from './context.js';

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
