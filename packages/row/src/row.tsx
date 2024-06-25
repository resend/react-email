import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"table">;

export interface RowProps extends RootProps {
  children: React.ReactNode;
}

export const Row = React.forwardRef<
  React.ElementRef<"table">,
  Readonly<RowProps>
>(({ children, style, ...props }, ref) => {
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
});

Row.displayName = "Row";
