import { extractColors } from 'extract-colors';
import type { FinalColor } from 'extract-colors/lib/types/Color';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  makeIframeDocumentBubbleEvents,
  ResizableWrapper,
} from '../../../components/resizable-wrapper';
import { cn } from '../../../utils';

interface CanvasProps extends React.ComponentProps<'div'> {
  title: string;
  srcDoc: string;

  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;

  handleSaveViewSize: () => void;

  width: number;
  height: number;
  onWidthChange?: (width: number) => void;
  onHeightChange?: (height: number) => void;
}

const useColors = (iframe: HTMLIFrameElement | null) => {
  const [colors, setColors] = useState<FinalColor[]>([]);

  const updateColors = useDebouncedCallback(async () => {
    if (iframe?.contentDocument) {
      const canvas = await html2canvas(iframe.contentDocument.body, {
        useCORS: true,
        allowTaint: true,
      });
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Failed to get canvas context');
      }
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      const extractedColors = await extractColors(imageData);

      setColors(extractedColors);
    }
  }, 300);

  useEffect(() => {
    updateColors();
  }, [iframe]);

  return colors;
};

export const Canvas = ({
  title,
  srcDoc,

  minWidth,
  minHeight,
  maxHeight,
  maxWidth,

  handleSaveViewSize,

  width,
  height,

  onWidthChange,
  onHeightChange,

  ...rest
}: CanvasProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const colors = useColors(iframeRef.current);
  console.log('extracted colors', colors);

  return (
    <div
      {...rest}
      className={cn('h-full w-full flex bg-gray-100 p-4', rest.className)}
    >
      <ResizableWrapper
        minHeight={minHeight}
        minWidth={minWidth}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        height={height}
        onResizeEnd={() => {
          handleSaveViewSize();
        }}
        onResize={(value, direction) => {
          const isHorizontal = direction === 'east' || direction === 'west';
          if (isHorizontal) {
            onWidthChange?.(Math.round(value));
          } else {
            onHeightChange?.(Math.round(value));
          }
        }}
        width={width}
      >
        <iframe
          className="solid max-h-full rounded-lg bg-white"
          ref={(iframe) => {
            iframeRef.current = iframe;
            if (iframe) {
              return makeIframeDocumentBubbleEvents(iframe);
            }
          }}
          srcDoc={srcDoc}
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
          title={title}
        />
      </ResizableWrapper>
    </div>
  );
};
