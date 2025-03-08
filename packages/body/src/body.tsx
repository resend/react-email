import * as React from 'react';

export type BodyProps = Readonly<React.HtmlHTMLAttributes<HTMLBodyElement>>;

export const Body = React.forwardRef<HTMLBodyElement, BodyProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <>
        {style?.backgroundColor && (
          <style>
            {`
              body {
                  background-color: ${style.backgroundColor}
              }
            `}
          </style>
        )}
        <body {...props} ref={ref} style={style}>
          {children}
        </body>
      </>
    );
  },
);

Body.displayName = 'Body';
