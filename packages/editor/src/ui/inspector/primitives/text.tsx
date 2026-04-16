import type * as React from 'react';

export interface TextProps extends React.ComponentProps<'span'> {
  size?: 'sm' | 'base';
  color?: 'default' | 'muted';
}

export function Text({ size, color, className, ...rest }: TextProps) {
  return (
    <span
      data-re-inspector-text=""
      {...(size ? { 'data-size': size } : {})}
      {...(color ? { 'data-color': color } : {})}
      className={className}
      {...rest}
    />
  );
}
