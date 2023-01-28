import * as React from 'react';

type SectionElement = React.ElementRef<'table'>;
type RootProps = React.ComponentPropsWithoutRef<'table'>;

export interface SectionProps extends RootProps {}

export const Section = React.forwardRef<SectionElement, Readonly<SectionProps>>(
  ({ children, style, ...props }, forwardedRef) => {
    return (
      <table
        {...props}
        ref={forwardedRef}
        style={style}
        align="center"
        role="presentation"
        cellSpacing="0"
        cellPadding="0"
        border={0}
        width="100%"
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
