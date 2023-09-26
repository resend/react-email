import * as React from "react";
import { parsePadding, pxToPt } from "./utils";

type ButtonElement = React.ElementRef<"a">;
type RootProps = React.ComponentPropsWithoutRef<"a">;

export interface ButtonProps extends RootProps {}

export const Button = React.forwardRef<ButtonElement, Readonly<ButtonProps>>(
  ({ children, style, target = "_blank", ...props }, forwardedRef) => {
    const { pt, pr, pb, pl } = parsePadding({
      padding: style?.padding,
      paddingLeft: style?.paddingLeft,
      paddingRight: style?.paddingRight,
      paddingTop: style?.paddingTop,
      paddingBottom: style?.paddingBottom,
    });

    const y = pt + pb;
    const textRaise = pxToPt(y);

    return (
      <a
        {...props}
        ref={forwardedRef}
        target={target}
        style={buttonStyle({ ...style, pt, pr, pb, pl })}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso]><i style="letter-spacing: ${pl}px;mso-font-width:-100%;mso-text-raise:${textRaise}" hidden>&nbsp;</i><![endif]-->`,
          }}
        />
        <span style={buttonTextStyle(pb)}>{children}</span>
        <span
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso]><i style="letter-spacing: ${pr}px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]-->`,
          }}
        />
      </a>
    );
  },
);

Button.displayName = "Button";

const buttonStyle = (
  style?: React.CSSProperties & {
    pt: number;
    pr: number;
    pb: number;
    pl: number;
  },
) => {
  const { pt, pr, pb, pl, padding, ...rest } = style || {};

  return {
    ...rest,
    lineHeight: "100%",
    textDecoration: "none",
    display: "inline-block",
    maxWidth: "100%",
    padding: `${pt}px ${pr}px ${pb}px ${pl}px`,
  };
};

const buttonTextStyle = (pb?: number) => {
  return {
    maxWidth: "100%",
    display: "inline-block",
    lineHeight: "120%",
    msoPaddingAlt: "0px",
    msoTextRaise: pxToPt(pb || 0),
  };
};
