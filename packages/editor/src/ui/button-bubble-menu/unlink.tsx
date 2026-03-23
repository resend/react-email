import { UnlinkIcon } from '../../icons';
import type * as React from 'react';
import { focusEditor } from '../bubble-menu/utils';
import { useButtonBubbleMenuContext } from './context';

export interface ButtonBubbleMenuUnlinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {
  onLinkRemove?: () => void;
}

export function ButtonBubbleMenuUnlink({
  className,
  children,
  onClick,
  onMouseDown,
  onLinkRemove,
  ...rest
}: ButtonBubbleMenuUnlinkProps) {
  const { editor } = useButtonBubbleMenuContext();

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
