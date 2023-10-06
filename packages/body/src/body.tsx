import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"body">;

export type BodyProps = RootProps;

export const Body: React.FC<Readonly<BodyProps>> = ({
  children,
  style,
  ...props
}) => {
  return (
    <body {...props} style={style}>
      {children}
    </body>
  );
};

Body.displayName = "Body";
