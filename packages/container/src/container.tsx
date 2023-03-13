import * as React from "react";

type ContainerElement = React.ElementRef<"table">;
type RootProps = React.ComponentPropsWithoutRef<"table">;

export interface ContainerProps extends RootProps {}

export const Container = React.forwardRef<
  ContainerElement,
  Readonly<ContainerProps>
>(({ children, style, ...props }, forwardedRef) => {
  return (
    <table
      {...props}
      ref={forwardedRef}
      align="center"
      role="presentation"
      cellSpacing="0"
      cellPadding="0"
      border={0}
      width="100%"
      style={{ maxWidth: "37.5em", ...style }}
    >
      <tr style={{ width: "100%" }}>
        <td>{children}</td>
      </tr>
    </table>
  );
});

Container.displayName = "Container";
