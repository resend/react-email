import { Img } from '@react-email/components';
import { NodeViewContent } from '@tiptap/react';
import type * as React from 'react';
import { cn } from '@/lib/cn';

export const YouTubeComponent: React.FC<{
  href: string;
  imageSource: string;
  style: React.CSSProperties;
  className?: string;
  disabledLinkWhileEditing: boolean;
  selected?: boolean;
  onClick?: () => void;
}> = ({
  href,
  imageSource,
  style,
  className,
  disabledLinkWhileEditing,
  selected,
  onClick,
}) => {
  const img = (
    <>
      <Img
        style={style}
        alt="YouTube video"
        width="100%"
        src={imageSource || 'https://resend.com/static/youtube-placeholder.png'}
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
          'youtubeContent',
          selected && 'youtubeContent-selected',
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
        'youtubeContent',
        selected && 'youtubeContent-selected',
        onClick && 'cursor-pointer',
      )}
    >
      {img}
    </div>
  );
};
