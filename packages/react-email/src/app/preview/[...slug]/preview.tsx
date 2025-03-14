'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { use, useState } from 'react';
import { flushSync } from 'react-dom';
import { Toaster } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { Topbar } from '../../../components';
import { CodeContainer } from '../../../components/code-container';
import {
  ResizableWarpper,
  makeIframeDocumentBubbleEvents,
} from '../../../components/resizable-wrapper';
import { Send } from '../../../components/send';
import { ShellContent } from '../../../components/shell';
import { Tooltip } from '../../../components/tooltip';
import { ActiveViewToggleGroup } from '../../../components/topbar/active-view-toggle-group';
import { ViewSizeControls } from '../../../components/topbar/view-size-controls';
import { PreviewContext } from '../../../contexts/preview';
import { useClampedState } from '../../../hooks/use-clamped-state';
import { RenderingError } from './rendering-error';

interface PreviewProps {
  emailTitle: string;
}

const Preview = ({ emailTitle }: PreviewProps) => {
  const { renderingResult, renderedEmailMetadata } = use(PreviewContext)!;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeView = searchParams.get('view') ?? 'preview';
  const activeLang = searchParams.get('lang') ?? 'jsx';

  const handleViewChange = (view: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('view', view);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLangChange = (lang: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('view', 'source');
    params.set('lang', lang);
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasRenderingMetadata = typeof renderedEmailMetadata !== 'undefined';
  const hasErrors = 'error' in renderingResult;

  const [maxWidth, setMaxWidth] = useState(Number.POSITIVE_INFINITY);
  const [maxHeight, setMaxHeight] = useState(Number.POSITIVE_INFINITY);
  const minWidth = 350;
  const minHeight = 600;
  const storedWidth = searchParams.get('width');
  const storedHeight = searchParams.get('height');
  const [width, setWidth] = useClampedState(
    storedWidth ? Number.parseInt(storedWidth) : 600,
    350,
    maxWidth,
  );
  const [height, setHeight] = useClampedState(
    storedHeight ? Number.parseInt(storedHeight) : 1024,
    600,
    maxHeight,
  );

  const handleSaveViewSize = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set('width', width.toString());
    params.set('height', height.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

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

      <ShellContent
        className="relative flex bg-gray-200"
        ref={(element) => {
          const observer = new ResizeObserver((entry) => {
            const [elementEntry] = entry;
            if (elementEntry) {
              setMaxWidth(elementEntry.contentRect.width - 80);
              setMaxHeight(elementEntry.contentRect.height - 80);
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
              <ResizableWarpper
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
                    setWidth(value);
                  } else {
                    setHeight(value);
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
              </ResizableWarpper>
            )}

            {activeView === 'source' && (
              <div className="h-full w-full bg-black">
                <div className="m-auto flex max-w-3xl p-6">
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
      </ShellContent>
    </>
  );
};

export default Preview;
