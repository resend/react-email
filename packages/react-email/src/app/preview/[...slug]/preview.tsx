'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { Toaster } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { buildEmailComponent } from '../../../actions/build-email-component';
import { getEmailControls } from '../../../actions/get-email-controls';
import { getPreviewProps } from '../../../actions/get-preview-props';
import { renderEmail } from '../../../actions/render-email';
import { updatePreviewProps } from '../../../actions/update-preview-props';
import { CodeContainer } from '../../../components/code-container';
import { PreviewPropControls } from '../../../components/preview-prop-controls';
import {
  ResizableWarpper,
  makeIframeDocumentBubbleEvents,
} from '../../../components/resizable-wrapper';
import { Shell, ShellContent } from '../../../components/shell';
import { Tooltip } from '../../../components/tooltip';
import { useClampedState } from '../../../hooks/use-clamped-state';
import { useHotreload } from '../../../hooks/use-hot-reload';
import { useLastDefinedValue } from '../../../hooks/use-rendering-metadata';
import { err, isErr, isOk, mapResult } from '../../../utils/result';
import { isBuilding } from '../../env';
import { type PreviewState, getPreviewState } from './preview-state';
import { RenderingError } from './rendering-error';

interface PreviewProps {
  slug: string;
  pathSeparator: string;

  previewState: PreviewState;
}

const Preview = ({
  slug,
  pathSeparator,

  previewState: serverPreviewState,
}: PreviewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeView = searchParams.get('view') ?? 'preview';
  const activeLang = searchParams.get('lang') ?? 'jsx';

  const [previewState, setPreviewState] =
    useState<PreviewState>(serverPreviewState);

  if (!isBuilding) {
    useHotreload(async (changes) => {
      // const changeForThisEmail = changes.find((change) =>
      //   change.filename.includes(slug),
      // );
      //
      // if (typeof changeForThisEmail !== 'undefined') {
      //   if (changeForThisEmail.event === 'unlink') {
      //     router.push('/');
      //   }
      // }

      for await (const change of changes) {
        const slugForChangedEmail =
          // ex: apple-receipt.tsx
          // it will be the path relative to the emails directory, so it is already
          // going to be equivalent to the slug
          change.filename.replace(/\.[^.]+$/, '');

        if (slugForChangedEmail === slug) {
          const previewProps = await getPreviewProps(slug);
          const buildResult = await buildEmailComponent(slug);

          if (
            isErr(buildResult) &&
            buildResult.error.type === 'FAILED_TO_RESOLVE_PATH'
          ) {
            console.warn(
              `Seems like the email template at ${slug} is now not available`,
            );
            router.push('/');
            break;
          }

          const controlsResult = await getEmailControls(slug);
          const renderingResult = await renderEmail(slug, previewProps);

          setPreviewState(
            getPreviewState(
              buildResult,
              controlsResult,
              renderingResult,
              previewProps,
            ),
          );
        }
      }
    });
  }

  const renderedEmailMetadata = useLastDefinedValue(
    isOk(previewState) ? previewState.value.renderingMetadata : undefined,
  );

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

  const debouncedUpdatePreviewProps = useDebouncedCallback(
    (newProps: Record<string, unknown>) => {
      updatePreviewProps(slug, newProps).catch((exception) => {
        throw new Error('Could not update cookie for preview props', {
          cause: exception,
        });
      });
    },
    200,
  );

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
    <Shell
      activeView={activeView}
      currentEmailOpenSlug={slug}
      markup={renderedEmailMetadata?.markup}
      plainText={renderedEmailMetadata?.plainText}
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
        {isErr(previewState) ? (
          <RenderingError error={previewState.error} />
        ) : null}

        {/* If this is undefined means that the initial server render of the email had errors */}
        {typeof renderedEmailMetadata !== 'undefined' ? (
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
                  title={slug}
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

      {isOk(previewState) ? (
        <PreviewPropControls
          controls={previewState.value.controls}
          onValueChange={async (key, newValue) => {
            const newPreviewProps = {
              ...previewState.value.previewProps,
              [key]: newValue,
            };
            setPreviewState((state) =>
              mapResult(state, (value) => ({
                ...value,
                previewProps: newPreviewProps,
              })),
            );

            debouncedUpdatePreviewProps(newPreviewProps);

            setPreviewState((state) =>
              mapResult(state, (value) => ({
                ...value,
                previewProps: newPreviewProps,
              })),
            );
            const renderingResult = await renderEmail(slug, newPreviewProps);

            if (isErr(renderingResult)) {
              const error = renderingResult.error;
              if (error.type === 'RENDERING_FAILURE') {
                setPreviewState((state) => err(error.exception));
              } else if (error.type === 'EMAIL_COMPONENT_NOT_BUILT') {
                throw new Error(
                  'Email component was not built when updating props. This is a bug in React Email, please open an issue.',
                  {
                    cause: {
                      renderingResult,
                    },
                  },
                );
              }
            } else {
              setPreviewState((state) =>
                mapResult(state, (value) => ({
                  ...value,
                  renderingMetadata: renderingResult.value,
                })),
              );
            }
          }}
          previewProps={previewState.value.previewProps}
        />
      ) : null}
    </Shell>
  );
};

export default Preview;
