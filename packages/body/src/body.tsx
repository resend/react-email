import * as React from 'react';

export type BodyProps = Readonly<
  React.HtmlHTMLAttributes<HTMLTableCellElement>
>;

export const Body = React.forwardRef<HTMLBodyElement, BodyProps>(
  ({ children, ...props }, ref) => (
    <body ref={ref}>
      <table
        style={{ width: '100%', height: '100%' }}
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        align="center"
      >
        <tbody>
          <tr>
            {/* 
              Yahoo and AOL simply do not keep the styles applied to the `body`, 
              so we need to apply it to a table cell inside. 

              See https://github.com/resend/react-email/issues/662.
            */}
            <td {...props}>{children}</td>
          </tr>
        </tbody>
      </table>
    </body>
  ),
);

Body.displayName = 'Body';
