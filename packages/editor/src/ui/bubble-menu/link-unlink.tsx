import type * as React from 'react';
import { UnlinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkUnlinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function BubbleMenuLinkUnlink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: BubbleMenuLinkUnlinkProps) {
  const { editor } = useBubbleMenuContext();

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
