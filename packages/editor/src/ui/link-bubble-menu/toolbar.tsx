import type * as React from 'react';
import { useLinkBubbleMenuContext } from './context';

export interface LinkBubbleMenuToolbarProps {
  className?: string;
  children: React.ReactNode;
}

export function LinkBubbleMenuToolbar({
  className,
  children,
}: LinkBubbleMenuToolbarProps) {
  const { isEditing } = useLinkBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-link-bm-toolbar="" className={className}>
      {children}
    </div>
  );
}
