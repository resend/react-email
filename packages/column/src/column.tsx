import * as React from 'react';

type DivElement = React.ElementRef<'div'>;
type RootProps = React.ComponentPropsWithoutRef<'div'>;

export interface ColumnProps extends RootProps {
  style?: React.CSSProperties;
}

export const Column = React.forwardRef<DivElement, Readonly<ColumnProps>>(
  ({ children, style, ...props }, forwardedRef) => {
    const styleDefault = {
      display: 'table-cell',
      width: '50%',
      ...style
    } 

    return(
      <div ref={forwardedRef} style={styleDefault} {...props}>
        {children}
      </div>
    )
  },
);

Column.displayName = 'Column';
