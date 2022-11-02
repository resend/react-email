import * as React from 'react';

type DivElement = React.ElementRef<'div'>;
type RootProps = React.ComponentPropsWithoutRef<'div'>;

export interface ColumnProps extends RootProps {
  style?: React.CSSProperties;
}

export const Column = React.forwardRef<DivElement, Readonly<ColumnProps>>(
  ({ children, style, ...props }, forwardedRef) => {
    const styleDefault = {
      display: 'inline-block',
      width: '100%',
      fontSize: '0px',
      verticalAlign: 'top',
      ...style,
    };

    return (
      <div
        ref={forwardedRef}
        style={styleDefault}
        role="presentation"
        {...props}
      >
        <tbody>{children}</tbody>
      </div>
    );
  },
);

Column.displayName = 'Column';
