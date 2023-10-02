import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"table">;

export type SectionProps = RootProps;

export const Section: React.FC<Readonly<SectionProps>> = ({
  children,
  style,
  ...props
}) => {
  return (
    <table
      align="center"
      width="100%"
      {...props}
      border={0}
      cellPadding="0"
      cellSpacing="0"
      data-id="react-email-section"
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
};
