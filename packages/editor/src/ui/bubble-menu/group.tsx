import type * as React from 'react';

export interface BubbleMenuGroupProps {
  className?: string;
  children: React.ReactNode;
}

export function BubbleMenuGroup({ className, children }: BubbleMenuGroupProps) {
  return (
    <fieldset className={className} data-re-bubble-menu-group="">
      {children}
    </fieldset>
  );
}
