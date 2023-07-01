import * as React from "react";
import { pxToPt } from "./utils";

type ButtonElement = React.ElementRef<"a">;
type RootProps = React.ComponentPropsWithoutRef<"a">;

export interface ButtonProps extends RootProps {
  pX?: number;
  pY?: number;
}

export const Button = React.forwardRef<ButtonElement, Readonly<ButtonProps>>(
  ({ children, style, pX = 0, pY = 0, target = "_blank", ...props }, forwardedRef) => {
    const y = (pY || 0) * 2;
    const textRaise = pxToPt(y.toString());

    return (
      <a
        {...props}
        ref={forwardedRef}
        data-id="react-email-button"
        target={target}
        style={buttonStyle({ ...style, pX, pY })}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso]><i style="letter-spacing: ${pX}px;mso-font-width:-100%;mso-text-raise:${textRaise}" hidden>&nbsp;</i><![endif]-->`,
          }}
        />
        <span style={buttonTextStyle(pY)}>{children}</span>
        <span
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso]><i style="letter-spacing: ${pX}px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]-->`,
          }}
        />
      </a>
    );
  }
);

Button.displayName = "Button";

const buttonStyle = (
  style?: React.CSSProperties & { pY: number; pX: number }
) => {
  const { pY, pX, ...rest } = style || {};

  return {
    ...rest,
    lineHeight: "100%",
    textDecoration: "none",
    display: "inline-block",
    maxWidth: "100%",
    padding: `${pY}px ${pX}px`,
  };
};

const buttonTextStyle = (pY?: number) => {
  const paddingY = pY || 0;

  return {
    maxWidth: "100%",
    display: "inline-block",
    lineHeight: "120%",
    msoPaddingAlt: "0px",
    msoTextRaise: pxToPt(paddingY.toString()),
  };
};
