import * as React from 'react';
import { markAsElement } from '../element-marker.js';

export type PreviewProps = Readonly<
  React.ComponentPropsWithoutRef<'div'> & {
    /**
     * @default true
     */
    useTitleTag?: boolean;
    children: string | string[];
  }
>;

const PREVIEW_MAX_LENGTH = 200;

export const Preview = React.forwardRef<HTMLDivElement, PreviewProps>(
  ({ children = '', useTitleTag = true, ...props }, ref) => {
    const text = (
      Array.isArray(children) ? children.join('') : children
    ).substring(0, PREVIEW_MAX_LENGTH);

    return (
      <>
        {useTitleTag ? <title>{text}</title> : null}
        <div
          style={{
            display: 'none',
            overflow: 'hidden',
            lineHeight: '1px',
            opacity: 0,
            maxHeight: 0,
            maxWidth: 0,
          }}
          data-skip-in-text={true}
          {...props}
          ref={ref}
        >
          {text}
          {renderWhiteSpace(text)}
        </div>
      </>
    );
  },
);

Preview.displayName = 'Preview';
markAsElement(Preview);

// Spam filters such as rspamd ignore these as preview padding, but count the
// direction marks U+200E and U+200F as hidden text, so those are left out.
const whiteSpaceCodes = '\xa0\u200C\u200B\u200D\uFEFF';
export const renderWhiteSpace = (text: string) => {
  if (text.length >= PREVIEW_MAX_LENGTH) {
    return null;
  }

  return <div>{whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - text.length)}</div>;
};
