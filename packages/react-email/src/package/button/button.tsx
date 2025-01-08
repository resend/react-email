import * as React from 'react';
import { parsePadding } from './utils/parse-padding';
import { pxToPt } from './utils/px-to-pt';

export type ButtonProps = Readonly<React.ComponentPropsWithoutRef<'a'>>;

const maxFontWidth = 5;

/**
 * Computes a msoFontWidth \<= 5 and a count of space characters that,
 * when applied, end up being as close to `expectedWidth` as possible.
 */
function computeFontWidthAndSpaceCount(expectedWidth: number) {
  if (expectedWidth === 0) return [0, 0];

  let smallestSpaceCount = 0;

  const computeRequiredFontWidth = () => {
    if (smallestSpaceCount > 0) {
      return expectedWidth / smallestSpaceCount / 2;
    }

    return Number.POSITIVE_INFINITY;
  };

  while (computeRequiredFontWidth() > maxFontWidth) {
    smallestSpaceCount++;
  }

  return [computeRequiredFontWidth(), smallestSpaceCount] as const;
}

export const Button = React.forwardRef<HTMLAnchorElement, ButtonProps>(
  ({ children, style, target = '_blank', ...props }, ref) => {
    const { pt, pr, pb, pl } = parsePadding({
      padding: style?.padding,
      paddingLeft: style?.paddingLeft ?? style?.paddingInline,
      paddingRight: style?.paddingRight ?? style?.paddingInline,
      paddingTop: style?.paddingTop ?? style?.paddingBlock,
      paddingBottom: style?.paddingBottom ?? style?.paddingBlock,
    });

    const y = pt + pb;
    const textRaise = pxToPt(y);

    const [plFontWidth, plSpaceCount] = computeFontWidthAndSpaceCount(pl);
    const [prFontWidth, prSpaceCount] = computeFontWidthAndSpaceCount(pr);

    return (
      <a
        {...props}
        ref={ref}
        style={buttonStyle({ ...style, pt, pr, pb, pl })}
        target={target}
      >
        <span
          dangerouslySetInnerHTML={{
            // The `&#8202;` is as close to `1px` of an empty character as we can get, then, we use the `mso-font-width`
            // to scale it according to what padding the developer wants. `mso-font-width` also does not allow for percentages
            // >= 500% so we need to add extra spaces accordingly.
            //
            // See https://github.com/resend/react-email/issues/1512 for why we do not use letter-spacing instead.
            __html: `<!--[if mso]><i style="mso-font-width:${
              plFontWidth * 100
            }%;mso-text-raise:${textRaise}" hidden>${'&#8202;'.repeat(
              plSpaceCount,
            )}</i><![endif]-->`,
          }}
        />
        <span style={buttonTextStyle(pb)}>{children}</span>
        <span
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso]><i style="mso-font-width:${
              prFontWidth * 100
            }%" hidden>${'&#8202;'.repeat(
              prSpaceCount,
            )}&#8203;</i><![endif]-->`,
          }}
        />
      </a>
    );
  },
);

Button.displayName = 'Button';

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
    lineHeight: '100%',
    textDecoration: 'none',
    display: 'inline-block',
    maxWidth: '100%',
    msoPaddingAlt: '0px',
    ...rest,
    padding: `${pt}px ${pr}px ${pb}px ${pl}px`,
  };
};

const buttonTextStyle = (pb?: number) => {
  return {
    maxWidth: '100%',
    display: 'inline-block',
    lineHeight: '120%',
    msoPaddingAlt: '0px',
    msoTextRaise: pxToPt(pb || 0),
  };
};
