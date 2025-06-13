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
import { EmailClientToggleGroup } from '../../../components/topbar/email-client-toggle-group';
import { ViewSizeControls } from '../../../components/topbar/view-size-controls';
import { ViewportToggleGroup } from '../../../components/topbar/viewport-toggle-group';
import { PreviewContext } from '../../../contexts/preview';
import { useClampedState } from '../../../hooks/use-clamped-state';
import { cn } from '../../../utils';
import {
  getClientFrameComponent,
  makeEmailResponsive,
} from '../../../utils/email-client-utils';
import { RenderingError } from './rendering-error';

interface PreviewProps extends React.ComponentProps<'div'> {
  emailTitle: string;
}

const Preview = ({ emailTitle, className, ...props }: PreviewProps) => {
  const { renderingResult, renderedEmailMetadata } = use(PreviewContext)!;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeView = searchParams.get('view') || 'preview';
  const activeLang = searchParams.get('lang') || 'jsx';
  const clientEnabled = searchParams.get('client') === 'true';
  const activeClient = searchParams.get('activeClient') || 'gmail';
  const activeViewport = searchParams.get('viewport') || 'desktop';

  // Subject is now managed internally by EmailClientToggleGroup
  const [currentSubject, setCurrentSubject] = useState(
    'Welcome to Our Newsletter',
  );

  const handleViewChange = (view: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('view', view);
    router.push(`${pathname}?${params.toString()}${location.hash}`);
  };

  const handleLangChange = (lang: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('lang', lang);
    router.push(`${pathname}?${params.toString()}${location.hash}`);
  };

  const handleClientToggle = (enabled: boolean) => {
    const params = new URLSearchParams(searchParams);
    params.set('client', enabled.toString());
    router.push(`${pathname}?${params.toString()}${location.hash}`);
  };

  const handleClientChange = (client: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('activeClient', client);
    router.push(`${pathname}?${params.toString()}${location.hash}`);
  };

  const handleViewportChange = (viewport: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('viewport', viewport);
    router.push(`${pathname}?${params.toString()}${location.hash}`);
  };

  const handleSubjectChange = (subject: string) => {
    setCurrentSubject(subject);
  };

  const hasErrors = 'error' in renderingResult;
  const hasRenderingMetadata = typeof renderedEmailMetadata !== 'undefined';

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

  // Get the appropriate client frame component
  const ClientFrame = getClientFrameComponent(
    clientEnabled,
    activeClient,
    hasRenderingMetadata,
  );

  // Render the email iframe with appropriate sizing
  const renderEmailIframe = () => {
    if (clientEnabled && ClientFrame) {
      // When client frame is enabled, iframe fills the frame's content area
      // Strip viewport meta tags and inject responsive CSS only for mobile viewports
      const emailHtml = makeEmailResponsive(
        renderedEmailMetadata?.markup || '',
        activeViewport as 'mobile' | 'desktop',
      );

      return (
        <iframe
          className="w-full h-full bg-white [color-scheme:auto]"
          ref={(iframe) => {
            if (iframe) {
              return makeIframeDocumentBubbleEvents(iframe);
            }
          }}
          srcDoc={emailHtml}
          title={emailTitle}
        />
      );
    }
    // When no client frame, use the resizable dimensions with original HTML
    return (
      <iframe
        className="max-h-full rounded-lg bg-white [color-scheme:auto]"
        ref={(iframe) => {
          if (iframe) {
            return makeIframeDocumentBubbleEvents(iframe);
          }
        }}
        srcDoc={renderedEmailMetadata?.markup || ''}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        title={emailTitle}
      />
    );
  };

  return (
    <>
      <Topbar emailTitle={emailTitle}>
        {/* Conditionally show ViewSizeControls or ViewportToggleGroup */}
        {clientEnabled ? (
          <ViewportToggleGroup
            activeViewport={activeViewport}
            setActiveViewport={handleViewportChange}
          />
        ) : (
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
        )}
        <EmailClientToggleGroup
          isEnabled={clientEnabled}
          activeClient={activeClient}
          subject={currentSubject}
          onToggle={handleClientToggle}
          onClientChange={handleClientChange}
          onSubjectChange={handleSubjectChange}
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
              <>
                {ClientFrame ? (
                  // Client frame handles its own sizing and viewport
                  <ClientFrame
                    className="w-full h-full"
                    viewport={activeViewport as 'mobile' | 'desktop'}
                    subject={currentSubject}
                  >
                    {renderEmailIframe()}
                  </ClientFrame>
                ) : (
                  // No client frame - use resizable wrapper
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
                    {renderEmailIframe()}
                  </ResizableWrapper>
                )}
              </>
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
