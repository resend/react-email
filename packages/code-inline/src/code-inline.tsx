import * as React from 'react';

type RootProps = React.ComponentPropsWithoutRef<'code'> &
  React.ComponentPropsWithoutRef<'span'>;

export type CodeInlineProps = Readonly<RootProps>;

/**
 * If you are sending emails for users that have the Orange.fr email client,
 * beware that this component will only work when you have a head containing meta tags.
 */
export const CodeInline = React.forwardRef<HTMLSpanElement, CodeInlineProps>(
  ({ children, ...props }, ref) => {
    return (
      <>
        {/* 
    This style tag is targeted at fixing an issue for the Orange.fr email client
    See:
    - https://www.caniemail.com/features/html-code/
    - https://www.howtotarget.email/#2019-03-26-freenet-2

    On that email client, the head and html elements are removed, making the meta tag a sibling of them
    allowing us to use a selector on them. Also <style> tags are supported on it.
    */}
        <style>{`
        meta ~ .cino {
          display: none !important;
          opacity: 0 !important;
        }

        meta ~ .cio {
          display: block !important;
        }
      `}</style>

        {/* Does not render on Orange.fr */}
        <code
          {...props}
          className={`${props.className ? props.className : ''} cino`}
        >
          {children}
        </code>

        {/* Renders only on Orange.fr */}
        <span
          {...props}
          className={`${props.className ? props.className : ''} cio`}
          ref={ref}
          style={{ display: 'none', ...props.style }}
        >
          {children}
        </span>
      </>
    );
  },
);

CodeInline.displayName = 'CodeInline';
