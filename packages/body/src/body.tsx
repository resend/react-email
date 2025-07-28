import * as React from 'react';

export type BodyProps = Readonly<React.HtmlHTMLAttributes<HTMLBodyElement>>;

export const Body = React.forwardRef<HTMLBodyElement, BodyProps>(
  ({ children, style, ...props }, ref) => {
    const backgroundStyles: Record<string, string | number | undefined> = {};
    if (style) {
      for (const key of Object.keys(style)) {
        if (key === 'backgroundColor' || key === 'background') {
          backgroundStyles[key] = style[key];
        }
      }
    }
    return (
      <body {...props} style={backgroundStyles} ref={ref}>
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
                Yahoo and AOL don't keep the background color of the body, 
                so we need to apply it to an inner cell.

                See https://github.com/resend/react-email/issues/662.
              */}
              <td style={style}>{children}</td>
            </tr>
          </tbody>
        </table>
      </body>
    );
  },
);

Body.displayName = 'Body';
