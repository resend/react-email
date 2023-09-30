import * as React from "react";

type SectionElement = React.ElementRef<"table">;
type RootProps = React.ComponentPropsWithoutRef<"table">;

export type SectionProps = RootProps;

export const Section = React.forwardRef<SectionElement, Readonly<SectionProps>>(
  ({ children, style, ...props }, forwardedRef) => {
    return (
      <table
        align="center"
        width="100%"
        {...props}
        border={0}
        cellPadding="0"
        cellSpacing="0"
        data-id="react-email-section"
        ref={forwardedRef}
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
  },
);

Section.displayName = "Section";
