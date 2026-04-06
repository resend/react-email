import type * as React from 'react';

export interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: string;
}

export function Button({ variant, className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      data-re-inspector-button=""
      {...(variant ? { 'data-variant': variant } : {})}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
