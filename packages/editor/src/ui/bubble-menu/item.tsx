import type * as React from 'react';

export interface BubbleMenuItemProps extends React.ComponentProps<'button'> {
  /** Used for aria-label and data-item attribute */
  name: string;
  /** Whether this item is currently active */
  isActive: boolean;
  /** Called when clicked */
  onCommand: () => void;
}

export function BubbleMenuItem({
  name,
  isActive,
  onCommand,
  className,
  children,
  ...rest
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
      onMouseDown={(e) => e.preventDefault()}
      onClick={onCommand}
      {...rest}
    >
      {children}
    </button>
  );
}
