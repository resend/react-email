import * as React from "react";

type ColumnElement = React.ElementRef<"td">;
type RootProps = React.ComponentPropsWithoutRef<"td">;

export interface ColumnProps extends RootProps {}

export const Column = React.forwardRef<ColumnElement, Readonly<ColumnProps>>(
  ({ children, style, ...props }, forwardedRef) => {
    return (
      <td {...props} ref={forwardedRef} style={style}>
        {children}
      </td>
    );
  },
);

Column.displayName = "Column";
