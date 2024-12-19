import * as React from 'react';

export type BodyProps = Readonly<React.HtmlHTMLAttributes<HTMLBodyElement>>;

export const Body = React.forwardRef<HTMLBodyElement, BodyProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <body {...props} ref={ref} style={style}>
        {children}
      </body>
    );
  },
);

Body.displayName = 'Body';
