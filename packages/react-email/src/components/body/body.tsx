import * as React from 'react';
import { markAsElement } from '../element-marker.js';
import {
  markAsEmailContextConsumer,
  readEmailContext,
  stripEmailContexts,
} from '../email-context/index.js';
import { htmlContext } from '../html/html-context.js';
import { marginProperties, paddingProperties } from './margin-properties.js';

export type BodyProps = Readonly<React.HtmlHTMLAttributes<HTMLBodyElement>>;

export const Body = React.forwardRef<HTMLBodyElement, BodyProps>(
  ({ children, style, ...props }, ref) => {
    // Email clients like Gmail may strip the html tag, so the language
    // metadata is repeated here. It is inherited from <Html> to avoid
    // conflicting values in the same document.
    // See https://github.com/resend/react-email/issues/3652.
    const inherited = readEmailContext(props, htmlContext);
    const {
      dir = inherited.dir ?? 'ltr',
      lang = inherited.lang ?? 'en',
      ...restProps
    } = stripEmailContexts(props);

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
      <body {...restProps} dir={dir} lang={lang} style={bodyStyle} ref={ref}>
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
markAsEmailContextConsumer(Body);
