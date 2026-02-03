import { Img } from '@react-email/components';
import { NodeViewContent } from '@tiptap/react';
import type * as React from 'react';
import { cn } from '@/lib/cn';

export const TwitterComponent: React.FC<{
  href: string;
  imageSource: string;
  style: React.CSSProperties;
  className?: string;
  disabledLinkWhileEditing: boolean;
  selected?: boolean;
  attrs: {
    alignment: 'center' | 'left' | 'right';
  };
  onClick?: () => void;
}> = ({
  href,
  imageSource,
  style,
  className,
  disabledLinkWhileEditing,
  selected,
  attrs,
  onClick,
}) => {
  const img = (
    <>
      <Img
        style={style}
        alt="X's post"
        width="100%"
        src={imageSource || 'https://resend.com/static/twitter-placeholder.png'}
        // @ts-expect-error - alignment is not a valid prop for Img but used by Tiptap
        alignment={attrs.alignment}
      />
      <NodeViewContent />
    </>
  );

  if (href && !disabledLinkWhileEditing) {
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className={cn(
          className,
          'twitterContent',
          selected && 'twitterContent-selected',
        )}
      >
        {img}
      </a>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        className,
        'twitterContent',
        selected && 'twitterContent-selected',
        onClick && 'cursor-pointer',
      )}
    >
      {img}
    </div>
  );
};
