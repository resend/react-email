import * as React from "react";
import { parsePadding, pxToPt } from "./utils";

type ButtonElement = React.ElementRef<"a">;
export type ButtonProps = React.ComponentPropsWithoutRef<"a">;

export const Button = React.forwardRef<ButtonElement, Readonly<ButtonProps>>(
  ({ children, style, target = "_blank", ...props }, ref) => {
    const { pt, pr, pb, pl } = parsePadding({
      padding: style?.padding,
      paddingLeft: style?.paddingLeft ?? style?.paddingInline,
      paddingRight: style?.paddingRight ?? style?.paddingInline,
      paddingTop: style?.paddingTop ?? style?.paddingBlock,
      paddingBottom: style?.paddingBottom ?? style?.paddingBlock,
    });

    const y = pt + pb;
    const textRaise = pxToPt(y);

    return (
      <a
        {...props}
        ref={ref}
        style={buttonStyle({ ...style, pt, pr, pb, pl })}
        target={target}
      >
        <span
          dangerouslySetInnerHTML={{
            // The `&#8202;` is as close to `1px` of a character as we can get, then, we use the `mso-font-width`
            // to scale it according to what padding the user wants. It's not going to be 100% accurate, but it will
            // be as accurate as we can get without letter-spacing, which is not working for Outlook 2021.
            __html: `<!--[if mso]><i style="mso-font-width:${100 * pl}%;mso-text-raise:${textRaise}" hidden>&#8202;</i><![endif]-->`,
          }}
        />
        <span style={buttonTextStyle(pb)}>{children}</span>
        <span
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso]><i style="mso-font-width:${100 * pr}%" hidden>&#8202;</i><![endif]-->`,
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
  const { pt, pr, pb, pl, ...rest } = style || {};

  return {
    lineHeight: "100%",
    textDecoration: "none",
    display: "inline-block",
    maxWidth: "100%",
    ...rest,
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
