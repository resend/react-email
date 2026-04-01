import type * as React from 'react';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkToolbarProps
  extends React.ComponentProps<'div'> {}

export function BubbleMenuLinkToolbar({
  children,
  ...rest
}: BubbleMenuLinkToolbarProps) {
  const { isEditing } = useBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-link-bm-toolbar="" {...rest}>
      {children}
    </div>
  );
}
