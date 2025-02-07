import { Slot } from '@radix-ui/react-slot';
import { type ComponentProps, useCallback, useEffect, useRef } from 'react';
import { cn } from '../utils';

type Direction = 'north' | 'south' | 'east' | 'west';

type ResizableWarpperProps = {
  width: number;
  height: number;

  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;

  onResize: (newSize: number, direction: Direction) => void;
  onResizeEnd?: () => void;

  children: React.ReactNode;
} & Omit<ComponentProps<'div'>, 'onResize' | 'children'>;

export const makeIframeDocumentBubbleEvents = (iframe: HTMLIFrameElement) => {
  const mouseMoveBubbler = (event: MouseEvent) => {
    const bounds = iframe.getBoundingClientRect();
    document.dispatchEvent(
      new MouseEvent('mousemove', {
        ...event,
        clientX: event.clientX + bounds.x,
        clientY: event.clientY + bounds.y,
      }),
    );
  };
  const mouseUpBubbler = (event: MouseEvent) => {
    document.dispatchEvent(new MouseEvent('mouseup', event));
  };
  iframe.contentDocument?.addEventListener('mousemove', mouseMoveBubbler);
  iframe.contentDocument?.addEventListener('mouseup', mouseUpBubbler);
  return () => {
    iframe.contentDocument?.removeEventListener('mousemove', mouseMoveBubbler);
    iframe.contentDocument?.removeEventListener('mouseup', mouseUpBubbler);
  };
};

export const ResizableWarpper = ({
  width,
  height,
  onResize,
  onResizeEnd,
  children,

  maxHeight,
  maxWidth,
  minHeight,
  minWidth,

  ...rest
}: ResizableWarpperProps) => {
  const resizableRef = useRef<HTMLElement>(null);

  const mouseMoveListener = useRef<(event: MouseEvent) => void>(null);

  const handleStopResizing = useCallback(() => {
    if (mouseMoveListener.current) {
      document.removeEventListener('mousemove', mouseMoveListener.current);
    }
    document.removeEventListener('mouseup', handleStopResizing);
    onResizeEnd?.();
  }, []);

  const handleStartResizing = (direction: Direction) => {
    mouseMoveListener.current = (event) => {
      if (event.button === 0 && resizableRef.current) {
        const isHorizontal = direction === 'east' || direction === 'west';

        const mousePosition = isHorizontal ? event.clientX : event.clientY;
        const resizableBoundingRect =
          resizableRef.current.getBoundingClientRect();
        const center = isHorizontal
          ? resizableBoundingRect.x + resizableBoundingRect.width / 2
          : resizableBoundingRect.y + resizableBoundingRect.height / 2;
        onResize(Math.abs(mousePosition - center) * 2, direction);
      } else {
        handleStopResizing();
      }
    };

    document.addEventListener('mouseup', handleStopResizing);
    document.addEventListener('mousemove', mouseMoveListener.current);
  };

  useEffect(() => {
    if (!window.document) return;

    return () => {
      handleStopResizing();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      {...rest}
      className={cn(
        'relative mx-auto my-auto box-content px-4 py-2',
        rest.className,
      )}
    >
      <div
        aria-label="resize-west"
        aria-valuenow={width}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-2 cursor-w-resize p-2 [user-drag:none]"
        onDragStart={(event) => event.preventDefault()}
        draggable="false"
        onMouseDown={() => {
          handleStartResizing('west');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="h-8 w-1 rounded-md bg-black/30" />
      </div>
      <div
        aria-label="resize-east"
        aria-valuenow={width}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
        onDragStart={(event) => event.preventDefault()}
        className="-translate-x-full -translate-y-1/2 absolute top-1/2 left-full cursor-e-resize p-2 [user-drag:none]"
        draggable="false"
        onMouseDown={() => {
          handleStartResizing('east');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="h-8 w-1 rounded-md bg-black/30" />
      </div>
      <div
        aria-label="resize-north"
        aria-valuenow={height}
        aria-valuemin={minHeight}
        aria-valuemax={maxHeight}
        onDragStart={(event) => event.preventDefault()}
        className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 cursor-n-resize p-2 [user-drag:none]"
        draggable="false"
        onMouseDown={() => {
          handleStartResizing('north');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="h-1 w-8 rounded-md bg-black/30" />
      </div>
      <div
        aria-label="resize-south"
        aria-valuenow={height}
        aria-valuemin={minHeight}
        aria-valuemax={maxHeight}
        onDragStart={(event) => event.preventDefault()}
        className="-translate-x-1/2 -translate-y-1/2 absolute top-full left-1/2 cursor-s-resize p-2 [user-drag:none]"
        draggable="false"
        onMouseDown={() => {
          handleStartResizing('south');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="h-1 w-8 rounded-md bg-black/30" />
      </div>

      <Slot ref={resizableRef}>{children}</Slot>
    </div>
  );
};
