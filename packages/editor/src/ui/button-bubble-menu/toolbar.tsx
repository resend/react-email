import type * as React from 'react';
import { useButtonBubbleMenuContext } from './context';

export interface ButtonBubbleMenuToolbarProps {
  className?: string;
  children: React.ReactNode;
}

export function ButtonBubbleMenuToolbar({
  className,
  children,
}: ButtonBubbleMenuToolbarProps) {
  const { isEditing } = useButtonBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-btn-bm-toolbar="" className={className}>
      {children}
    </div>
  );
}
