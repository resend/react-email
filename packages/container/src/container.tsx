import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"table">;
type TableElement = React.ElementRef<"table">;

export type ContainerProps = RootProps;

export const Container = React.forwardRef<
  TableElement,
  Readonly<ContainerProps>
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
      style={{ maxWidth: "37.5em", ...style }}
    >
      <tbody>
        <tr style={{ width: "100%" }}>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  );
});

Container.displayName = "Container";
