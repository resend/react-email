import * as React from 'react';

export type BodyProps = Readonly<React.HtmlHTMLAttributes<HTMLBodyElement>>;

export const Body = React.forwardRef<HTMLBodyElement, BodyProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <body className="p-0" {...props} ref={ref} style={style}>
        {children}
      </body>
    );
  },
);

Body.displayName = 'Body';
