import type * as React from 'react';
import { UnlinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';
import { focusEditor } from './utils';

export interface BubbleMenuButtonUnlinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {
  onLinkRemove?: () => void;
}

export function BubbleMenuButtonUnlink({
  className,
  children,
  onClick,
  onMouseDown,
  onLinkRemove,
  ...rest
}: BubbleMenuButtonUnlinkProps) {
  const { editor } = useBubbleMenuContext();

  return (
    <button
      {...rest}
      type="button"
      aria-label="Remove link"
      data-re-btn-bm-item=""
      data-item="unlink"
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        editor.commands.updateButton({ href: '#' });
        focusEditor(editor);
        onLinkRemove?.();
      }}
    >
      {children ?? <UnlinkIcon />}
    </button>
  );
}
