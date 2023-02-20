import * as React from 'react';

type RowElement = React.ElementRef<'table'>;
type RootProps = React.ComponentPropsWithoutRef<'table'>;

export interface RowProps extends RootProps {
  children: React.ReactNode;
}

export const Row = React.forwardRef<RowElement, Readonly<RowProps>>(
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
