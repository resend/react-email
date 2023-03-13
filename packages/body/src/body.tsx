import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"body">;

export interface BodyProps extends RootProps {
  style?: React.CSSProperties;
}

export const Body: React.FC<Readonly<BodyProps>> = ({
  children,
  style,
  ...props
}) => {
  const styleDefault = {
    wordSpacing: "normal",
    ...style,
  };
  return (
    <body {...props} style={style}>
      {children}
    </body>
  );
};

Body.displayName = "Body";
