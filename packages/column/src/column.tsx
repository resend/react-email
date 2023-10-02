import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"td">;

export type ColumnProps = RootProps;

export const Column: React.FC<Readonly<ColumnProps>> = ({
  children,
  style,
  ...props
}) => {
  return (
    <td {...props} data-id="__react-email-column" style={style}>
      {children}
    </td>
  );
};
