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

// The hidden preview text used to be padded with a long run of this filler so
// clients wouldn't pull body copy into the snippet. That run breaks SendGrid's
// click-tracking HTML rewriter, which truncates the message: the HTML part
// arrives empty while the plain-text part is fine. See #609, #1785, #1806.
//
// Removing only U+FEFF is NOT enough — we shipped that build and the emails
// were still blank. The whole run has to go.
const whiteSpaceCodes = '';
export const renderWhiteSpace = (text: string) => {
  if (text.length >= PREVIEW_MAX_LENGTH) {
    return null;
  }

  return <div>{whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - text.length)}</div>;
};
