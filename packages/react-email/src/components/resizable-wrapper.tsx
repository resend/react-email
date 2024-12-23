import { useEffect } from 'react';

type Direction = 'north' | 'south' | 'east' | 'west';

interface ResizableWarpperProps {
  width: number;
  height: number;

  onResize: (difference: number, direction: Direction) => void;

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
  children,
}: ResizableWarpperProps) => {
  let mouseMoveListener: ((event: MouseEvent) => void) | undefined;

  const handleStopResizing = () => {
    if (mouseMoveListener) {
      document.removeEventListener('mousemove', mouseMoveListener);
    }
    document.removeEventListener('mouseup', handleStopResizing);
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
    <div className="relative box-content px-4 py-2 mx-auto my-auto">
      <div
        aria-label="resize-west"
        aria-valuenow={width}
        className="absolute cursor-w-resize p-2 left-2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        onMouseDown={() => {
          handleStartResizing('west');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="rounded-md w-1 h-8 bg-slate-8" />
      </div>
      <div
        aria-label="resize-east"
        aria-valuenow={width}
        className="absolute cursor-e-resize p-2 left-full top-1/2 -translate-x-full -translate-y-1/2"
        onMouseDown={() => {
          handleStartResizing('east');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="rounded-md w-1 h-8 bg-slate-8" />
      </div>
      <div
        aria-label="resize-north"
        aria-valuenow={height}
        className="absolute cursor-n-resize p-2 left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        onMouseDown={() => {
          handleStartResizing('north');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="rounded-md w-8 h-1 bg-slate-8" />
      </div>
      <div
        aria-label="resize-south"
        aria-valuenow={height}
        className="absolute cursor-s-resize p-2 left-1/2 top-full -translate-x-1/2 -translate-y-1/2"
        onMouseDown={() => {
          handleStartResizing('south');
        }}
        role="slider"
        tabIndex={0}
      >
        <div className="rounded-md w-8 h-1 bg-slate-8" />
      </div>

      {children}
    </div>
  );
};
