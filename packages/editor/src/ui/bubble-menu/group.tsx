import type * as React from 'react';

export interface BubbleMenuItemGroupProps {
  className?: string;
  children: React.ReactNode;
}

export function BubbleMenuItemGroup({
  className,
  children,
}: BubbleMenuItemGroupProps) {
  return (
    <fieldset className={className} data-re-bubble-menu-group="">
      {children}
    </fieldset>
  );
}
