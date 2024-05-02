import * as React from "react";

export type RowProps = Readonly<
  React.ComponentPropsWithoutRef<"table"> & {
    children: React.ReactNode;
  }
>;

export const Row = React.forwardRef<HTMLTableElement, RowProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <table
        align="center"
        width="100%"
        {...props}
        border={0}
        cellPadding="0"
        cellSpacing="0"
        ref={ref}
        role="presentation"
        style={style}
      >
        <tbody style={{ width: "100%" }}>
          <tr style={{ width: "100%" }}>{children}</tr>
        </tbody>
      </table>
    );
  },
);

Row.displayName = "Row";
