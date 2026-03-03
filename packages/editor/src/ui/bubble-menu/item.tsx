import type * as React from 'react';

export interface BubbleMenuItemProps {
  /** Used for aria-label and data-item attribute */
  name: string;
  /** Whether this item is currently active */
  isActive: boolean;
  /** Called when clicked */
  onCommand: () => void;
  className?: string;
  children: React.ReactNode;
}

export function BubbleMenuItem({
  name,
  isActive,
  onCommand,
  className,
  children,
}: BubbleMenuItemProps) {
  return (
    <button
      type="button"
      aria-label={name}
      aria-pressed={isActive}
      className={className}
      data-re-bubble-menu-item=""
      data-item={name}
      {...(isActive ? { 'data-active': '' } : {})}
      onClick={onCommand}
    >
      {children}
    </button>
  );
}
