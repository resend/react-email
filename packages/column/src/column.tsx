import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"td">;
type TdElement = React.ElementRef<"td">;

export type ColumnProps = RootProps;

export const Column = React.forwardRef<TdElement, Readonly<ColumnProps>>(
  ({ children, style, ...props }, ref) => {
    return (
      <td {...props} data-id="__react-email-column" ref={ref} style={style}>
        {children}
      </td>
    );
  },
);

Column.displayName = "Column";
