import * as React from 'react';

type SectionElement = React.ElementRef<'table'>;
type RootProps = React.ComponentPropsWithoutRef<'table'>;

export interface SectionProps extends RootProps {}

export const Row = React.forwardRef<SectionElement, Readonly<SectionProps>>(
  ({ children, style, ...props }, forwardedRef) => {
    return (
      <table
        width="100%"
        {...props}
        ref={forwardedRef}
        style={style}
        align="center"
        role="presentation"
        cellSpacing="0"
        cellPadding="0"
        border={0}
      >
        <tbody style={{ width: '100%' }}>
          <tr style={{ width: '100%' }}>{children}</tr>
        </tbody>
      </table>
    );
  },
);

Row.displayName = 'Row';
