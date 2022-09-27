import * as React from 'react';

type PreviewElement = React.ElementRef<'div'>;
type RootProps = React.ComponentPropsWithoutRef<'div'>;

export interface PreviewProps extends RootProps {
  children: string;
}

export const Preview = React.forwardRef<PreviewElement, Readonly<PreviewProps>>(
  ({ children = '', ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      style={{
        display: 'none',
        overflow: 'hidden',
        lineHeight: '1px',
        opacity: 0,
        maxHeight: 0,
        maxWidth: 0,
      }}
      {...props}
    >
      {children}
      {renderWhiteSpace(children)}
    </div>
  ),
);

const renderWhiteSpace = (text: string) => {
  const whiteSpaceCodes = '\xa0\u200C\u200B\u200D\u200E\u200F\uFEFF';
  return <div>{whiteSpaceCodes.repeat(150 - text.length)}</div>;
};

Preview.displayName = 'Preview';
