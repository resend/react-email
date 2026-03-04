import { UnlinkIcon } from 'lucide-react';
import type * as React from 'react';
import { useLinkBubbleMenuContext } from './context';

export interface LinkBubbleMenuUnlinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function LinkBubbleMenuUnlink({
  className,
  children,
  onClick,
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
      onMouseDown={(e) => e.preventDefault()}
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
