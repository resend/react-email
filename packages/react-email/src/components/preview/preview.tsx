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
    const text = truncate(
      Array.isArray(children) ? children.join('') : children,
    );

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

/**
 * Cuts the text to `PREVIEW_MAX_LENGTH` without leaving half of a surrogate
 * pair (such as an emoji) at the end, which would render as a replacement character.
 */
const truncate = (text: string) => {
  const truncated = text.substring(0, PREVIEW_MAX_LENGTH);
  const lastCharCode = truncated.charCodeAt(truncated.length - 1);
  const splitsSurrogatePair =
    lastCharCode >= 0xd800 &&
    lastCharCode <= 0xdbff &&
    text.length > PREVIEW_MAX_LENGTH;

  return splitsSurrogatePair ? truncated.slice(0, -1) : truncated;
};

const whiteSpaceCodes = '\xa0\u200C\u200B\u200D\u200E\u200F\uFEFF';
export const renderWhiteSpace = (text: string) => {
  if (text.length >= PREVIEW_MAX_LENGTH) {
    return null;
  }

  return <div>{whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - text.length)}</div>;
};
