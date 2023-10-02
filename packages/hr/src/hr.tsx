import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"hr">;

export type HrProps = RootProps;

export const Hr: React.FC<Readonly<HrProps>> = ({ style, ...props }) => (
  <hr
    {...props}
    data-id="react-email-hr"
    style={{
      width: "100%",
      border: "none",
      borderTop: "1px solid #eaeaea",
      ...style,
    }}
  />
);
