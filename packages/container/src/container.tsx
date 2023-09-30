import * as React from "react";

type ContainerElement = React.ElementRef<"table">;
type RootProps = React.ComponentPropsWithoutRef<"table">;

export type ContainerProps = RootProps;

export const Container = React.forwardRef<
  ContainerElement,
  Readonly<ContainerProps>
>(({ children, style, ...props }, forwardedRef) => {
  return (
    <table
      align="center"
      width="100%"
      {...props}
      border={0}
      cellPadding="0"
      cellSpacing="0"
      data-id="__react-email-container"
      ref={forwardedRef}
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
