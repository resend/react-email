'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Toaster } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import type { EmailRenderingResult } from '../../../actions/render-email-by-path';
import { CodeContainer } from '../../../components/code-container';
import {
  ResizableWrapper,
  makeIframeDocumentBubbleEvents,
} from '../../../components/resizable-wrapper';
import { Shell } from '../../../components/shell';
import { Tooltip } from '../../../components/tooltip';
import { useClampedState } from '../../../hooks/use-clamped-state';
import { useEmailRenderingResult } from '../../../hooks/use-email-rendering-result';
import { useHotreload } from '../../../hooks/use-hot-reload';
import { useRenderingMetadata } from '../../../hooks/use-rendering-metadata';
import { RenderingError } from './rendering-error';
import { checkerContext, CheckProvider } from "../../../components/sidebar/link-checker"

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

  const hasNoErrors = typeof renderedEmailMetadata !== 'undefined';

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

  const context = React.useContext(checkerContext)

  function addHighlither(iframe) {
    if (!iframe) return

    const cssRules = `
      .devtools-highlight {
        position: relative;
        cursor: pointer;
      }

      .devtools-highlight::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid #6464ff;
        background-color: rgba(111, 168, 220, 0.2);
        pointer-events: none;
        transition: opacity 0.15s ease-in-out;
      }

      .devtools-highlight::after {
        content: attr(data-url);
        position: absolute;
        left: -2px;
        top: -24px;
        background-color: #6464ff;
        color: white;
        padding: 2px 6px;
        font-size: 12px;
        font-family: monospace;
        border-radius: 2px;
        transition: opacity 0.15s ease-in-out;
      }`

    const receiveMessage = `(function receiveMessage() {
      function highlightNode(nodeId) {
        const element = document.querySelector(\`[data-node-id="\${nodeId}"]\`);
        element.classList.add("devtools-highlight")
      }

      function removeHighlight(nodeId) {
        const element = document.querySelector(\`[data-node-id="\${nodeId}"]\`);
        element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        element.classList.remove("devtools-highlight")
      }


      setTimeout(() => {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = \`${cssRules}\`;
        document.head.appendChild(styleTag);

        console.log(styleTag)
      }, 1000)

      window.addEventListener("message", (data) => {
        const { type, nodeId } = data.data;
        if (type === 'highlight') {
          highlightNode(nodeId);
        } else if (type === 'remove-highlight') {
          removeHighlight(nodeId);
        }
      })
    })();`

    iframe.contentWindow.eval(receiveMessage);
  }

  return (
    <Shell
      activeView={activeView}
      currentEmailOpenSlug={slug}
      markup={renderedEmailMetadata?.markup}
      pathSeparator={pathSeparator}
      setActiveView={handleViewChange}
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
    >
      {/* This relative is so that when there is any error the user can still switch between emails */}
      <div
        className="relative flex h-full bg-gray-200 pb-8"
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
        {'error' in renderingResult ? (
          <RenderingError error={renderingResult.error} />
        ) : null}

        {hasNoErrors ? (
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
                    addHighlither(iframe);

                    if (iframe) {
                      return makeIframeDocumentBubbleEvents(iframe);
                    }
                  }}
                  srcDoc={context.codeWithNodeIds || renderedEmailMetadata.markup}
                  key={context.codeWithNodeIds || renderedEmailMetadata.markup}
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                  title={slug}
                />
              </ResizableWrapper>
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
      </div>
    </Shell>
  );
};

export default Preview;
