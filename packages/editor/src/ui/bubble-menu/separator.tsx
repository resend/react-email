import type * as React from 'react';

export interface BubbleMenuSeparatorProps {
  className?: string;
}

export function BubbleMenuSeparator({ className }: BubbleMenuSeparatorProps) {
  return (
    <div
      role="separator"
      className={className}
      data-re-bubble-menu-separator=""
    />
  );
}
