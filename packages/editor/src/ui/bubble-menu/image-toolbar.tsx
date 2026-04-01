import type * as React from 'react';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuImageToolbarProps
  extends React.ComponentProps<'div'> {}

export function BubbleMenuImageToolbar({
  children,
  ...rest
}: BubbleMenuImageToolbarProps) {
  const { isEditing } = useBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-img-bm-toolbar="" {...rest}>
      {children}
    </div>
  );
}
