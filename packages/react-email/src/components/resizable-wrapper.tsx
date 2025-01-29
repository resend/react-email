import { useEffect } from 'react';

type Direction = 'north' | 'south' | 'east' | 'west';

interface ResizableWarpperProps {
  width: number;
  height: number;

  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;

  onResize: (difference: number, direction: Direction) => void;
  onResizeEnd?: () => void;

  children: React.ReactNode;
}

export const makeIframeDocumentBubbleEvents = (iframe: HTMLIFrameElement) => {
  const mouseMoveBubbler = (event: MouseEvent) => {
    document.dispatchEvent(new MouseEvent('mousemove', event));
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
}: ResizableWarpperProps) => {
  let mouseMoveListener: ((event: MouseEvent) => void) | undefined;

  const handleStopResizing = () => {
    if (mouseMoveListener) {
      document.removeEventListener('mousemove', mouseMoveListener);
    }
    document.removeEventListener('mouseup', handleStopResizing);
    onResizeEnd?.();
  };

  const handleStartResizing = (direction: Direction) => {
    mouseMoveListener = (event) => {
      if (event.button === 0) {
        const signMultiplier =
          direction === 'west' || direction === 'north' ? -1 : 1;
        const difference =
          direction === 'east' || direction === 'west'
            ? event.movementX
            : event.movementY;
        onResize(difference * signMultiplier, direction);
      } else {
        handleStopResizing();
      }
    };

    document.addEventListener('mouseup', handleStopResizing);
    document.addEventListener('mousemove', mouseMoveListener);
  };

  useEffect(() => {
    return () => {
      handleStopResizing();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto my-auto box-content px-4 py-2">
      <div
        aria-label="resize-west"
        aria-valuenow={width}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-2 cursor-w-resize p-2 [user-drag:none]"
        draggable="false"
        onMouseDown={() => {
          handleStartResizing('west');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="h-8 w-1 rounded-md bg-slate-8" />
      </div>
      <div
        aria-label="resize-east"
        aria-valuenow={width}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
        className="-translate-x-full -translate-y-1/2 absolute top-1/2 left-full cursor-e-resize p-2 [user-drag:none]"
        draggable="false"
        onMouseDown={() => {
          handleStartResizing('east');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="h-8 w-1 rounded-md bg-slate-8" />
      </div>
      <div
        aria-label="resize-north"
        aria-valuenow={height}
        aria-valuemin={minHeight}
        aria-valuemax={maxHeight}
        className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 cursor-n-resize p-2 [user-drag:none]"
        draggable="false"
        onMouseDown={() => {
          handleStartResizing('north');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="h-1 w-8 rounded-md bg-slate-8" />
      </div>
      <div
        aria-label="resize-south"
        aria-valuenow={height}
        aria-valuemin={minHeight}
        aria-valuemax={maxHeight}
        className="-translate-x-1/2 -translate-y-1/2 absolute top-full left-1/2 cursor-s-resize p-2 [user-drag:none]"
        draggable="false"
        onMouseDown={() => {
          handleStartResizing('south');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="h-1 w-8 rounded-md bg-slate-8" />
      </div>

      {children}
    </div>
  );
};
