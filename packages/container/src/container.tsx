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
      align="center"
      width="100%"
      {...props}
      ref={forwardedRef}
      data-id="__react-email-container"
      role="presentation"
      cellSpacing="0"
      cellPadding="0"
      border={0}
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
