import type * as React from 'react';
import { UnlinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';
import { focusEditor } from './utils';

export interface BubbleMenuImageUnlinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {
  onLinkRemove?: () => void;
}

export function BubbleMenuImageUnlink({
  className,
  children,
  onClick,
  onMouseDown,
  onLinkRemove,
  ...rest
}: BubbleMenuImageUnlinkProps) {
  const { editor } = useBubbleMenuContext();

  return (
    <button
      {...rest}
      type="button"
      aria-label="Remove link"
      data-re-img-bm-item=""
      data-item="unlink"
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        editor.chain().focus().updateAttributes('image', { href: null }).run();
        focusEditor(editor);
        onLinkRemove?.();
      }}
    >
      {children ?? <UnlinkIcon />}
    </button>
  );
}
