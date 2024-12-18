import * as React from 'react';

export type PreviewProps = Readonly<
  React.ComponentPropsWithoutRef<'div'> & {
    children: string | string[];
  }
>;

const PREVIEW_MAX_LENGTH = 150;

export const Preview = React.forwardRef<HTMLDivElement, PreviewProps>(
  ({ children = '', ...props }, ref) => {
    const text = (
      Array.isArray(children) ? children.join('') : children
    ).substring(0, PREVIEW_MAX_LENGTH);

    return (
      <div
        style={{
          display: 'none',
          overflow: 'hidden',
          lineHeight: '1px',
          opacity: 0,
          maxHeight: 0,
          maxWidth: 0,
        }}
        {...props}
        ref={ref}
      >
        {text}
        {renderWhiteSpace(text)}
      </div>
    );
  },
);

Preview.displayName = 'Preview';

const whiteSpaceCodes = '\xa0\u200C\u200B\u200D\u200E\u200F\uFEFF';
export const renderWhiteSpace = (text: string) => {
  if (text.length >= PREVIEW_MAX_LENGTH) {
    return null;
  }

  return <div>{whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - text.length)}</div>;
};
