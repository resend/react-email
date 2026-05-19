import type * as React from 'react';

export interface IconButtonProps extends React.ComponentProps<'button'> {}

export function IconButton({ className, children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      data-re-inspector-icon-button=""
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
