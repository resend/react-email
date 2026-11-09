'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { Toaster } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { Topbar } from '../../../components';
import { CodeContainer } from '../../../components/code-container';
import { PreviewPropsPanel } from '../../../components/preview-props-panel';
import {
  makeIframeDocumentBubbleEvents,
  ResizableWrapper,
} from '../../../components/resizable-wrapper';
import { Send } from '../../../components/send';
import { useToolbarState } from '../../../components/toolbar';
import { Tooltip } from '../../../components/tooltip';
import { ActiveViewToggleGroup } from '../../../components/topbar/active-view-toggle-group';
import { EmulatedDarkModeToggle } from '../../../components/topbar/emulated-dark-mode-toggle';
import { PropsPanelToggle } from '../../../components/topbar/props-panel-toggle';
import { ViewSizeControls } from '../../../components/topbar/view-size-controls';
import { usePreviewContext } from '../../../contexts/preview';
import { usePropsPanel } from '../../../contexts/props-panel';
import { useClampedState } from '../../../hooks/use-clamped-state';
import { cn } from '../../../utils';
import { inferEmailTitle } from '../../../utils/infer-email-title';
import { EmailFrame } from './email-frame';
import { ErrorOverlay } from './error-overlay';

interface PreviewProps extends React.ComponentProps<'div'> {
  emailTitle: string;
}

const Preview = ({ emailTitle, className, ...props }: PreviewProps) => {
  const { renderingResult, renderedEmailMetadata, emailSlug } =
    usePreviewContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isDarkModeEnabled = searchParams.get('dark') !== null;
  const activeView = searchParams.get('view') ?? 'preview';
  const isRawHtmlEmail = renderedEmailMetadata?.extname === 'html';
  const requestedLang = searchParams.get('lang');
  const defaultLang = isRawHtmlEmail ? 'html' : 'tsx';
  // Raw HTML templates only expose `html` and `markdown` tabs, so coerce any
  // lingering `tsx` selection from URL state to the HTML tab to avoid the
  // "No markup found for the active language!" error in CodeContainer.
  const activeLang =
    requestedLang === null || (isRawHtmlEmail && requestedLang === 'tsx')
      ? defaultLang
      : requestedLang;

  const handleDarkModeChange = (enabled: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (enabled) {
      params.set('dark', '');
    } else {
      params.delete('dark');
    }
    router.push(`${pathname}?${params.toString()}${location.hash}`);
  };

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
  const minWidth = 220;
  const minHeight = minWidth * 1.6;
  const storedWidth = searchParams.get('width');
  const storedHeight = searchParams.get('height');
  const [width, setWidth] = useClampedState(
    storedWidth ? Number.parseInt(storedWidth, 10) : 1024,
    minWidth,
    maxWidth,
  );
  const [height, setHeight] = useClampedState(
    storedHeight ? Number.parseInt(storedHeight, 10) : 600,
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

  const { open: propsPanelOpen, setOpen: handlePropsPanelChange } =
    usePropsPanel();

  return (
    <>
      <Topbar emailTitle={emailTitle}>
        {activeView === 'preview' ? (
          <>
            <EmulatedDarkModeToggle
              enabled={isDarkModeEnabled}
              onChange={(enabled) => handleDarkModeChange(enabled)}
            />
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
              minWidth={minWidth}
              minHeight={minHeight}
            />
          </>
        ) : null}
        <ActiveViewToggleGroup
          activeView={activeView}
          setActiveView={handleViewChange}
        />
        {hasRenderingMetadata && !isRawHtmlEmail ? (
          <PropsPanelToggle
            onChange={handlePropsPanelChange}
            open={propsPanelOpen}
          />
        ) : null}
        {hasRenderingMetadata ? (
          <div className="flex justify-end">
            <Send
              key={emailSlug}
              markup={renderedEmailMetadata.markup}
              defaultSubject={inferEmailTitle(emailTitle)}
              storageKey={emailSlug}
            />
          </div>
        ) : null}
      </Topbar>

      <div
        className={cn(
          'flex h-[calc(100%-3.5rem-2.375rem)] will-change-[height] transition-[height] duration-300',
          toolbarToggled && 'h-[calc(100%-3.5rem-13rem)]',
        )}
      >
        <div
          {...props}
          className={cn(
            'relative flex min-w-0 grow p-4',
            activeView === 'preview' && 'bg-gray-200',
            activeView === 'preview' && isDarkModeEnabled && 'bg-gray-400',
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
          {hasErrors ? <ErrorOverlay error={renderingResult.error} /> : null}

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
                  <EmailFrame
                    className="max-h-full rounded-lg bg-white [color-scheme:auto]"
                    darkMode={isDarkModeEnabled}
                    markup={renderedEmailMetadata.markup}
                    width={width}
                    height={height}
                    title={emailTitle}
                    ref={(iframe) => {
                      if (!iframe) return;

                      return makeIframeDocumentBubbleEvents(iframe);
                    }}
                  />
                </ResizableWrapper>
              )}

              {activeView === 'source' && (
                <div className="h-full w-full">
                  <div className="m-auto h-full flex max-w-3xl p-6">
                    <Tooltip.Provider>
                      <CodeContainer
                        activeLang={activeLang}
                        basename={renderedEmailMetadata.basename}
                        markups={
                          isRawHtmlEmail
                            ? [
                                {
                                  language: 'html',
                                  extension: 'html',
                                  content: renderedEmailMetadata.prettyMarkup,
                                },
                                {
                                  language: 'markdown',
                                  extension: 'md',
                                  content: renderedEmailMetadata.plainText,
                                },
                              ]
                            : [
                                {
                                  language: 'tsx',
                                  extension: renderedEmailMetadata.extname,
                                  content: renderedEmailMetadata.reactMarkup,
                                },
                                {
                                  language: 'html',
                                  content: renderedEmailMetadata.prettyMarkup,
                                },
                                {
                                  language: 'markdown',
                                  extension: 'md',
                                  content: renderedEmailMetadata.plainText,
                                },
                              ]
                        }
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

        {hasRenderingMetadata && !isRawHtmlEmail ? (
          <PreviewPropsPanel open={propsPanelOpen} />
        ) : null}
      </div>
    </>
  );
};

export default Preview;
