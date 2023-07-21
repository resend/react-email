import * as React from "react";

type SectionElement = React.ElementRef<"table">;
type RootProps = React.ComponentPropsWithoutRef<"table">;

export interface SectionProps extends RootProps {}

export const Section = React.forwardRef<SectionElement, Readonly<SectionProps>>(
  ({ children, style, ...props }, forwardedRef) => {
    return (
      <table
        align="center"
        width="100%"
        {...props}
        ref={forwardedRef}
        data-id="react-email-section"
        style={style}
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
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
