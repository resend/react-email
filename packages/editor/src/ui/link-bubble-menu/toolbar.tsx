import type * as React from 'react';
import { useLinkBubbleMenuContext } from './context.js';

export interface LinkBubbleMenuToolbarProps
  extends React.ComponentProps<'div'> {}

export function LinkBubbleMenuToolbar({
  children,
  ...rest
}: LinkBubbleMenuToolbarProps) {
  const { isEditing } = useLinkBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-link-bm-toolbar="" {...rest}>
      {children}
    </div>
  );
}
