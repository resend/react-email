import * as React from 'react';

type PreviewElement = React.ElementRef<'div'>;
type RootProps = React.ComponentPropsWithoutRef<'div'>;

export interface PreviewProps extends RootProps {
  text: string;
}

export const Preview = React.forwardRef<PreviewElement, Readonly<PreviewProps>>(
  ({ text = '', ...props }, forwardedRef) => (
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
      {text ? (
        <>
          {text}
          {renderWhiteSpace(text)}
        </>
      ) : (
        ''
      )}
    </div>
  ),
);

const renderWhiteSpace = (text: string) => {
  if (text.length < 70) {
    return [...new Array(70)].map((value, index) => (
      <span key={index}>&#847;&zwnj;&nbsp;</span>
    ))
  }
};

Preview.displayName = 'Preview';
