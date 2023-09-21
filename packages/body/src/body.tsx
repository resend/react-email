import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"body">;

export interface BodyProps extends RootProps {}

export const Body: React.FC<Readonly<BodyProps>> = ({
  children,
  style,
  ...props
}) => {
  return (
    <body {...props} data-id="__react-email-body" style={style}>
      {children}
    </body>
  );
};

Body.displayName = "Body";
