import * as React from 'react';

type DivElement = React.ElementRef<'td'>;
type RootProps = React.ComponentPropsWithoutRef<'td'>;

export interface ColumnProps extends RootProps {
  style?: React.CSSProperties;
}

export const Column = React.forwardRef<DivElement, Readonly<ColumnProps>>(
  ({ children, style, ...props }, forwardedRef) => {
    const styleDefault = {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...style,
    };
    return (
      <td
        ref={forwardedRef}
        style={styleDefault}
        role="presentation"
        {...props}
      >
        {children}
      </td>
    );
  },
);

Column.displayName = 'Column';
