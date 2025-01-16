import * as React from 'react';

export type ColumnProps = Readonly<React.ComponentPropsWithoutRef<'td'>>;

export const Column = React.forwardRef<HTMLTableCellElement, ColumnProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <td {...props} data-id="__react-email-column" ref={ref} style={style}>
        {children}
      </td>
    );
  },
);

Column.displayName = 'Column';
