import type * as React from 'react';
import { useButtonBubbleMenuContext } from './context.js';

export interface ButtonBubbleMenuToolbarProps
  extends React.ComponentProps<'div'> {}

export function ButtonBubbleMenuToolbar({
  children,
  ...rest
}: ButtonBubbleMenuToolbarProps) {
  const { isEditing } = useButtonBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-btn-bm-toolbar="" {...rest}>
      {children}
    </div>
  );
}
