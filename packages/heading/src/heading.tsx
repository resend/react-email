import * as React from 'react';
import type { As } from './utils/as';
import type { Margin } from './utils/spaces';
import { withMargin } from './utils/spaces';

export type HeadingAs = As<'h1', 'h2', 'h3', 'h4', 'h5', 'h6'>;
export type HeadingProps = HeadingAs & Margin;

export const Heading = React.forwardRef<
  HTMLHeadingElement,
  Readonly<HeadingProps>
>(
  (
    { as: Tag = 'h1', children, style, m, mx, my, mt, mr, mb, ml, ...props },
    ref,
  ) => {
    return (
      <Tag
        {...props}
        ref={ref}
        style={{ ...withMargin({ m, mx, my, mt, mr, mb, ml }), ...style }}
      >
        {children}
      </Tag>
    );
  },
);

Heading.displayName = 'Heading';
