import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"table">;

export type SectionProps = RootProps;

export const Section = React.forwardRef<
  React.ElementRef<"table">,
  Readonly<SectionProps>
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
      <tbody>
        <tr>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  );
});

Section.displayName = "Section";
