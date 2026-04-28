import type * as React from 'react';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuButtonToolbarProps
  extends React.ComponentProps<'div'> {}

export function BubbleMenuButtonToolbar({
  children,
  ...rest
}: BubbleMenuButtonToolbarProps) {
  const { isEditing } = useBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-btn-bm-toolbar="" {...rest}>
      {children}
    </div>
  );
}
