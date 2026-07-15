import * as React from 'react';
import { markAsElement } from '../element-marker.js';
import { useHtmlContext } from '../html/html-context.js';
import { marginProperties, paddingProperties } from './margin-properties.js';

export type BodyProps = Readonly<React.HtmlHTMLAttributes<HTMLBodyElement>>;

export const Body = React.forwardRef<HTMLBodyElement, BodyProps>(
  ({ children, style, ...props }, ref) => {
    const htmlContext = useHtmlContext();
    const dir = props.dir ?? htmlContext.dir ?? 'ltr';
    const lang = props.lang ?? htmlContext.lang ?? 'en';
    const bodyStyle: Record<string, string | number | undefined> = {
      background: style?.background,
      backgroundColor: style?.backgroundColor,
    };
    if (style) {
      for (const property of [...marginProperties, ...paddingProperties]) {
        // We reset the margin if the user sets it, this mimics the
        // same behavior that would happen if this was only using the body.
        // This avoids the incoming margin summing up with the margin
        // defined by the email client on the body, or by the browser itself
        bodyStyle[property] = style[property] !== undefined ? 0 : undefined;
      }
    }
    return (
      <body {...props} dir={dir} lang={lang} style={bodyStyle} ref={ref}>
        <table
          border={0}
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          align="center"
        >
          <tbody>
            <tr>
              {/*
                Yahoo and AOL remove all styles of the body element while converting it to a div,
                so we need to apply them to to an inner cell.

                See https://github.com/resend/react-email/issues/662.
              */}
              <td dir={dir} lang={lang} style={style}>
                {children}
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    );
  },
);

Body.displayName = 'Body';
markAsElement(Body);
