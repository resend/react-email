import { Slot } from '@radix-ui/react-slot';
import {
  type ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '../utils';
import { VIEW_PRESETS } from './topbar/view-size-controls';

type Direction = 'north' | 'south' | 'east' | 'west';

type ResizableWrapperProps = {
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

export const ResizableWrapper = ({
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
}: ResizableWrapperProps) => {
  const resizableRef = useRef<HTMLElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const mouseMoveListener = useRef<(event: MouseEvent) => void>(null);
  const [direction, setDirection] = useState<Direction | null>(null);

  const handleStopResizing = useCallback(() => {
    if (mouseMoveListener.current) {
      document.removeEventListener('mousemove', mouseMoveListener.current);
    }
    document.removeEventListener('mouseup', handleStopResizing);
    setIsResizing(false);
    setDirection(null);
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

        const newPosition = Math.abs(mousePosition - center) * 2;

        setIsResizing(true);
        setDirection(direction);

        const threshold = 12;

        for (let i = 0; i < VIEW_PRESETS.length; i++) {
          const preset = VIEW_PRESETS[i];

          if (preset) {
            if (
              isHorizontal &&
              newPosition > preset.dimensions.width - threshold &&
              newPosition < preset.dimensions.width + threshold
            ) {
              onResize(preset.dimensions.width, direction);
              return;
            }

            if (
              !isHorizontal &&
              newPosition > preset.dimensions.height - threshold &&
              newPosition < preset.dimensions.height + threshold
            ) {
              onResize(preset.dimensions.height, direction);
              return;
            }
          }
        }

        onResize(Math.abs(mousePosition - center) * 2, direction);
      } else {
        handleStopResizing();
      }
    };

    document.addEventListener('mouseup', handleStopResizing);
    document.addEventListener('mousemove', mouseMoveListener.current);
  };

  useEffect(() => {
    if (!window.document) {
      return;
    }

    return () => {
      handleStopResizing();
    };
  }, []);

  return (
    <>
      <div className=" overflow-hidden absolute inset-0">
        <div className="absolute mx-auto box-content -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          {VIEW_PRESETS.map((preset) => (
            <div
              key={preset.name}
              className="-translate-x-1/2 -translate-y-1/2 absolute pointer-events-none select-none"
              style={{
                width: preset.dimensions.width,
                height: preset.dimensions.height,
              }}
            >
              {width === preset.dimensions.width &&
                isResizing &&
                (direction === 'east' || direction === 'west') && (
                  <>
                    <div className="absolute right-0 -top-[100vw] -bottom-[100vw] border-r-2 border-cyan-5" />
                    <div className="absolute left-0 -top-[100vw] -bottom-[100vw] border-l-2 border-cyan-5" />
                  </>
                )}

              {height === preset.dimensions.height &&
                isResizing &&
                (direction === 'north' || direction === 'south') && (
                  <>
                    <div className="absolute top-0 -left-[100vw] -right-[100vw] border-t-2 border-cyan-5" />
                    <div className="absolute bottom-0 -left-[100vw] -right-[100vw] border-b-2 border-cyan-5" />
                  </>
                )}
            </div>
          ))}
        </div>
      </div>

      <div
        {...rest}
        className={cn('relative mx-auto my-auto box-content', rest.className)}
      >
        <div
          aria-label="resize-west"
          aria-valuenow={width}
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
          className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 -left-2 cursor-w-resize p-2 [user-drag:none]"
          onDragStart={(event) => event.preventDefault()}
          draggable="false"
          onMouseDown={() => {
            handleStartResizing('west');
          }}
          role="slider"
          tabIndex={0}
        >
          <div
            className={cn('h-8 w-1 rounded-md bg-black/50 transition-colors', {
              'bg-black': direction === 'west',
            })}
          />
        </div>
        <div
          aria-label="resize-east"
          aria-valuenow={width}
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
          onDragStart={(event) => event.preventDefault()}
          className="translate-x-1/2 -translate-y-1/2 absolute top-1/2 -right-2 cursor-e-resize p-2 [user-drag:none]"
          draggable="false"
          onMouseDown={() => {
            handleStartResizing('east');
          }}
          role="slider"
          tabIndex={0}
        >
          <div
            className={cn('h-8 w-1 rounded-md bg-black/50 transition-colors', {
              'bg-black': direction === 'east',
            })}
          />
        </div>
        <div
          aria-label="resize-north"
          aria-valuenow={height}
          aria-valuemin={minHeight}
          aria-valuemax={maxHeight}
          onDragStart={(event) => event.preventDefault()}
          className="-translate-x-1/2 -translate-y-1/2 absolute -top-2 left-1/2 cursor-n-resize p-2 [user-drag:none]"
          draggable="false"
          onMouseDown={() => {
            handleStartResizing('north');
          }}
          role="slider"
          tabIndex={0}
        >
          <div
            className={cn('h-1 w-8 rounded-md bg-black/50 transition-colors', {
              'bg-black': direction === 'north',
            })}
          />
        </div>
        <div
          aria-label="resize-south"
          aria-valuenow={height}
          aria-valuemin={minHeight}
          aria-valuemax={maxHeight}
          onDragStart={(event) => event.preventDefault()}
          className="-translate-x-1/2 translate-y-1/2 absolute -bottom-2 left-1/2 cursor-s-resize p-2 [user-drag:none]"
          draggable="false"
          onMouseDown={() => {
            handleStartResizing('south');
          }}
          role="slider"
          tabIndex={0}
        >
          <div
            className={cn('h-1 w-8 rounded-md bg-black/50 transition-colors', {
              'bg-black': direction === 'south',
            })}
          />
        </div>

        <Slot
          ref={resizableRef}
          className={isResizing ? 'pointer-events-none select-none' : ''}
        >
          {children}
        </Slot>
      </div>
    </>
  );
};
