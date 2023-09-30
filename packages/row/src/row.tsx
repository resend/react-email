import * as React from "react";

type RowElement = React.ElementRef<"table">;
type RootProps = React.ComponentPropsWithoutRef<"table">;

export interface RowProps extends RootProps {
  children: React.ReactNode;
}

export const Row = React.forwardRef<RowElement, Readonly<RowProps>>(
  ({ children, style, ...props }, forwardedRef) => {
    return (
      <table
        align="center"
        width="100%"
        {...props}
        border={0}
        cellPadding="0"
        cellSpacing="0"
        data-id="react-email-row"
        ref={forwardedRef}
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
