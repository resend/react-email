'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { use, useState } from 'react';
import { flushSync } from 'react-dom';
import { Toaster } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { Topbar } from '../../../components';
import { CodeContainer } from '../../../components/code-container';
import {
  makeIframeDocumentBubbleEvents,
  ResizableWrapper,
} from '../../../components/resizable-wrapper';
import { Send } from '../../../components/send';
import { useToolbarState } from '../../../components/toolbar';
import { Tooltip } from '../../../components/tooltip';
import { ActiveViewToggleGroup } from '../../../components/topbar/active-view-toggle-group';
import { ViewSizeControls } from '../../../components/topbar/view-size-controls';
import { PreviewContext } from '../../../contexts/preview';
import { useClampedState } from '../../../hooks/use-clamped-state';
import { cn } from '../../../utils';
import { RenderingError } from './rendering-error';

interface PreviewProps extends React.ComponentProps<'div'> {
  emailTitle: string;
}

const Preview = ({ emailTitle, className, ...props }: PreviewProps) => {
  const { renderingResult, renderedEmailMetadata } = use(PreviewContext)!;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeView = searchParams.get('view') ?? 'preview';
  const activeLang = searchParams.get('lang') ?? 'jsx';

  const handleViewChange = (view: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('view', view);
    router.push(`${pathname}?${params.toString()}${location.hash}`);
  };

  const handleLangChange = (lang: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('view', 'source');
    params.set('lang', lang);
    const isSameLang = searchParams.get('lang') === lang;
    router.push(
      `${pathname}?${params.toString()}${isSameLang ? location.hash : ''}`,
    );
  };

  const hasRenderingMetadata = typeof renderedEmailMetadata !== 'undefined';
  const hasErrors = 'error' in renderingResult;

  const [maxWidth, setMaxWidth] = useState(Number.POSITIVE_INFINITY);
  const [maxHeight, setMaxHeight] = useState(Number.POSITIVE_INFINITY);
  const minWidth = 100;
  const minHeight = 100;
  const storedWidth = searchParams.get('width');
  const storedHeight = searchParams.get('height');
  const [width, setWidth] = useClampedState(
    storedWidth ? Number.parseInt(storedWidth) : 600,
    minWidth,
    maxWidth,
  );
  const [height, setHeight] = useClampedState(
    storedHeight ? Number.parseInt(storedHeight) : 1024,
    minHeight,
    maxHeight,
  );

  const handleSaveViewSize = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set('width', width.toString());
    params.set('height', height.toString());
    router.push(`${pathname}?${params.toString()}${location.hash}`);
  }, 300);

  const { toggled: toolbarToggled } = useToolbarState();

  return (
    <>
      <Topbar emailTitle={emailTitle}>
        <ViewSizeControls
          setViewHeight={(height) => {
            setHeight(height);
            flushSync(() => {
              handleSaveViewSize();
            });
          }}
          setViewWidth={(width) => {
            setWidth(width);
            flushSync(() => {
              handleSaveViewSize();
            });
          }}
          viewHeight={height}
          viewWidth={width}
        />
        <ActiveViewToggleGroup
          activeView={activeView}
          setActiveView={handleViewChange}
        />
        {hasRenderingMetadata ? (
          <div className="flex justify-end">
            <Send markup={renderedEmailMetadata.markup} />
          </div>
        ) : null}
      </Topbar>

      <div
        {...props}
        className={cn(
          'h-[calc(100%-3.5rem-2.375rem)] will-change-[height] flex p-4 transition-[height] duration-300',
          activeView === 'preview' && 'bg-gray-200',
          toolbarToggled && 'h-[calc(100%-3.5rem-13rem)]',
          className,
        )}
        ref={(element) => {
          const observer = new ResizeObserver((entry) => {
            const [elementEntry] = entry;
            if (elementEntry) {
              setMaxWidth(elementEntry.contentRect.width);
              setMaxHeight(elementEntry.contentRect.height);
            }
          });

          if (element) {
            observer.observe(element);
          }

          return () => {
            observer.disconnect();
          };
        }}
      >
        {hasErrors ? <RenderingError error={renderingResult.error} /> : null}

        {hasRenderingMetadata ? (
          <>
            {activeView === 'preview' && (
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
                  const isHorizontal =
                    direction === 'east' || direction === 'west';
                  if (isHorizontal) {
                    setWidth(Math.round(value));
                  } else {
                    setHeight(Math.round(value));
                  }
                }}
                width={width}
              >
                <iframe
                  className="solid max-h-full rounded-lg bg-white"
                  ref={(iframe) => {
                    if (iframe) {
                      return makeIframeDocumentBubbleEvents(iframe);
                    }
                  }}
                  srcDoc={renderedEmailMetadata.markup}
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                  title={emailTitle}
                />
              </ResizableWrapper>
            )}

            {activeView === 'source' && (
              <div className="h-full w-full">
                <div className="m-auto h-full flex max-w-3xl p-6">
                  <Tooltip.Provider>
                    <CodeContainer
                      activeLang={activeLang}
                      markups={[
                        {
                          language: 'jsx',
                          content: renderedEmailMetadata.reactMarkup,
                        },
                        {
                          language: 'markup',
                          content: renderedEmailMetadata.markup,
                        },
                        {
                          language: 'markdown',
                          content: renderedEmailMetadata.plainText,
                        },
                      ]}
                      setActiveLang={handleLangChange}
                    />
                  </Tooltip.Provider>
                </div>
              </div>
            )}
          </>
        ) : null}

        <Toaster />
      </div>
    </>
  );
};

export default Preview;
