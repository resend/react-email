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
        ref={forwardedRef}
        data-id="react-email-row"
        style={style}
        role="presentation"
        cellSpacing="0"
        cellPadding="0"
        border={0}
      >
        <tbody style={{ width: "100%" }}>
          <tr style={{ width: "100%" }}>{children}</tr>
        </tbody>
      </table>
    );
  }
);

Row.displayName = "Row";
