import * as React from 'react';

export type BodyProps = Readonly<React.HtmlHTMLAttributes<HTMLBodyElement>>;

export const Body = React.forwardRef<HTMLBodyElement, BodyProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <body
        {...props}
        style={{
          background: style?.background,
          backgroundColor: style?.backgroundColor,
        }}
        ref={ref}
      >
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
              <td style={style}>{children}</td>
            </tr>
          </tbody>
        </table>
      </body>
    );
  },
);

Body.displayName = 'Body';
(Body as any).tailwindTreatAsElement = true;
