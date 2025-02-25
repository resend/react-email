'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { Toaster } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import type { EmailRenderingResult } from '../../../actions/render-email-by-path';
import { CodeContainer } from '../../../components/code-container';
import {
  ResizableWarpper,
  makeIframeDocumentBubbleEvents,
} from '../../../components/resizable-wrapper';
import { Shell, ShellContent } from '../../../components/shell';
import { Tooltip } from '../../../components/tooltip';
import { useClampedState } from '../../../hooks/use-clamped-state';
import { useEmailRenderingResult } from '../../../hooks/use-email-rendering-result';
import { useHotreload } from '../../../hooks/use-hot-reload';
import { useRenderingMetadata } from '../../../hooks/use-rendering-metadata';
import { PreviewRenderer } from './preview-renderer';
import { RenderingError } from './rendering-error';
import { Topbar } from '../../../components';
import { ViewSizeControls } from '../../../components/topbar/view-size-controls';
import { Send } from '../../../components/send';
import { ActiveViewToggleGroup } from '../../../components/topbar/active-view-toggle-group';
import { IconHelp } from '../../../components/icons/icon-help';

interface PreviewProps {
  slug: string;
  emailPath: string;
  pathSeparator: string;
  serverRenderingResult: EmailRenderingResult;
}

const Preview = ({
  slug,
  emailPath,
  pathSeparator,
  serverRenderingResult,
}: PreviewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeView = searchParams.get('view') ?? 'preview';
  const activeLang = searchParams.get('lang') ?? 'jsx';

  const renderingResult = useEmailRenderingResult(
    emailPath,
    serverRenderingResult,
  );

  const renderedEmailMetadata = useRenderingMetadata(
    emailPath,
    renderingResult,
    serverRenderingResult,
  );

  if (process.env.NEXT_PUBLIC_IS_BUILDING !== 'true') {
    // this will not change on runtime so it doesn't violate
    // the rules of hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotreload((changes) => {
      const changeForThisEmail = changes.find((change) =>
        change.filename.includes(slug),
      );

      if (typeof changeForThisEmail !== 'undefined') {
        if (changeForThisEmail.event === 'unlink') {
          router.push('/');
        }
      }
    });
  }

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

  const hasMetadataToRender = typeof renderedEmailMetadata !== 'undefined';

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
    <Shell currentEmailOpenSlug={slug} markup={renderedEmailMetadata?.markup}>
      <Topbar pathSeparator={pathSeparator} currentEmailOpenSlug={slug}>
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
        {hasMetadataToRender ? (
          <div className="flex justify-end">
            <Send markup={renderedEmailMetadata.markup} />
          </div>
        ) : null}
      </Topbar>

      <ShellContent
        className="relative flex h-full bg-gray-200"
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
        <PreviewingHelp />

        {'error' in renderingResult ? (
          <RenderingError error={renderingResult.error} />
        ) : null}

        {hasMetadataToRender ? (
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
                <PreviewRenderer
                  className="max-h-full overflow-y-auto rounded-lg bg-white text-black"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                  ref={(iframe) => {
                    if (iframe) {
                      return makeIframeDocumentBubbleEvents(iframe);
                    }
                  }}
                  title={slug}
                >
                  {renderedEmailMetadata.element}
                </PreviewRenderer>
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
    </Shell>
  );
};

const PreviewingHelp = () => {
  return (
    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <div className="fixed right-20 bottom-10 rounded-full border border-slate-8 bg-black p-1 outline-none">
            <IconHelp size={20} />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content className="max-w-40 text-pretty text-center">
          This email template was rendered with React 19. It may differ slightly
          from your production email template if you are using React 18.
        </Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>
  );
};

export default Preview;
