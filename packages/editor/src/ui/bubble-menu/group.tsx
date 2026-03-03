import type * as React from 'react';

export interface BubbleMenuGroupProps {
  className?: string;
  children: React.ReactNode;
}

export function BubbleMenuGroup({ className, children }: BubbleMenuGroupProps) {
  return (
    <div role="group" className={className} data-re-bubble-menu-group="">
      {children}
    </div>
  );
}
