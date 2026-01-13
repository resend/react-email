import * as React from 'react';
import {
  BorderWrapper,
  hasBorderAndBorderRadius,
} from './utils/border-wrapper.js';

export type SectionProps = Readonly<React.ComponentPropsWithoutRef<'table'>>;

export const Section = React.forwardRef<HTMLTableElement, SectionProps>(
  ({ children, style, ...props }, ref) => {
    // Check if we need to use the border wrapper for compatibility
    if (hasBorderAndBorderRadius(style)) {
      return (
        <BorderWrapper style={style} {...props} ref={ref}>
          {children}
        </BorderWrapper>
      );
    }

    // Default rendering without border wrapper
    return (
      <table
        align="center"
        width="100%"
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        {...props}
        ref={ref}
        style={style}
      >
        <tbody>
          <tr>
            <td>{children}</td>
          </tr>
        </tbody>
      </table>
    );
  },
);

Section.displayName = 'Section';
