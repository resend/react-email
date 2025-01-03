'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { Toaster } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import type { ControlsResult } from '../../../actions/get-email-controls';
import type { EmailRenderingResult } from '../../../actions/render-email-by-path';
import { renderEmailByPath } from '../../../actions/render-email-by-path';
import { updatePreviewProps } from '../../../actions/update-preview-props';
import { CodeContainer } from '../../../components/code-container';
import { IconArrowDown } from '../../../components/icons/icon-arrow-down';
import { IconCheck } from '../../../components/icons/icon-check';
import {
  ResizableWarpper,
  makeIframeDocumentBubbleEvents,
} from '../../../components/resizable-wrapper';
import { Shell } from '../../../components/shell';
import { Tooltip } from '../../../components/tooltip';
import { useClampedState } from '../../../hooks/use-clamped-state';
import { useEmailControls } from '../../../hooks/use-email-controls';
import { useEmailRenderingResult } from '../../../hooks/use-email-rendering-result';
import { useHotreload } from '../../../hooks/use-hot-reload';
import { useRenderingMetadata } from '../../../hooks/use-rendering-metadata';
import type { Controls } from '../../../package';
import { RenderingError } from './rendering-error';

interface PreviewProps {
  slug: string;
  emailPath: string;
  pathSeparator: string;

  previewProps: Record<string, unknown>;

  serverControlsResult: ControlsResult;
  serverRenderingResult: EmailRenderingResult;
}

const Preview = ({
  slug,
  emailPath,
  pathSeparator,

  previewProps: initialPreviewProps,

  serverControlsResult,
  serverRenderingResult,
}: PreviewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeView = searchParams.get('view') ?? 'preview';
  const activeLang = searchParams.get('lang') ?? 'jsx';

  const [previewProps, setPreviewProps] =
    useState<Record<string, unknown>>(initialPreviewProps);

  const [renderingResult, setRenderingResult] = useEmailRenderingResult(
    emailPath,
    previewProps,
    serverRenderingResult,
  );
  const previewPropsControls = useEmailControls(
    emailPath,
    serverControlsResult,
    renderingResult,
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
        {hasErrors ? <RenderingError error={renderingResult.error} /> : null}

        {previewPropsControls ? (
          <PreviewPropControls
            controls={previewPropsControls}
            onValueChange={(key, newValue) => {
              const newPreviewProps = { ...previewProps, [key]: newValue };
              setPreviewProps(newPreviewProps);

              debouncedUpdatePreviewProps(newPreviewProps);

              renderEmailByPath(emailPath, newPreviewProps)
                .then((newRenderingResult) => {
                  setRenderingResult(newRenderingResult);
                })
                .catch((exception) => {
                  throw new Error(
                    'Could not render the email after changing the props',
                    {
                      cause: exception,
                    },
                  );
                });
            }}
            previewProps={previewProps}
          />
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
      </div>
    </Shell>
  );
};

interface PreviewPropControls {
  previewProps: Record<string, unknown>;
  onValueChange: (key: string, newValue: unknown) => void;
  controls: Controls;
}

const PreviewPropControls = ({
  previewProps,
  onValueChange,
  controls,
}: PreviewPropControls) => {
  return (
    <div className="fixed bottom-0 left-0 grid h-40 w-full grid-cols-1 gap-3 border-t border-t-slate-9 border-solid bg-black px-3 py-2 md:grid-cols-3 lg:grid-cols-4">
      {Object.entries(controls).map(([key, control]) => {
        if (control) {
          const fieldId = `${key}-${control.type}`;
          const value = previewProps[key];

          switch (control.type) {
            case 'text':
            case 'email':
            case 'number':
              return (
                <div key={fieldId}>
                  <label
                    className="mb-2 block text-slate-10 text-sm"
                    htmlFor={fieldId}
                  >
                    {key}
                  </label>
                  <input
                    className="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-slate-12 text-sm placeholder-slate-10 outline-none transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
                    data-1p-ignore
                    id={fieldId}
                    onChange={(event) => {
                      onValueChange(key, event.currentTarget.value);
                    }}
                    type={control.type}
                    value={value as string}
                  />
                </div>
              );
            case 'select':
              return (
                <div key={fieldId}>
                  <label
                    className="mb-2 block text-slate-10 text-sm"
                    htmlFor={fieldId}
                  >
                    {key}
                  </label>
                  <Select.Root
                    onValueChange={(newValue) => {
                      onValueChange(key, newValue);
                    }}
                    value={value as string}
                  >
                    <Select.Trigger id={fieldId}>
                      <Select.Value />
                      <Select.Icon>
                        <IconArrowDown />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content>
                        <Select.Viewport>
                          {control.options.map((option) => (
                            <Select.Item
                              key={option.name}
                              value={option.value as string}
                            >
                              <Select.ItemText>{option.name}</Select.ItemText>
                              <Select.ItemIndicator>
                                <IconCheck />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              );
            case 'checkbox':
              return (
                <div key={fieldId}>
                  <Checkbox.Root
                    checked={value as boolean}
                    id={fieldId}
                    onCheckedChange={(newValue) => {
                      onValueChange(key, newValue);
                    }}
                  >
                    <Checkbox.Indicator>
                      <IconCheck />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    className="mb-2 block text-slate-10 text-sm"
                    htmlFor={fieldId}
                  >
                    {key}
                  </label>
                </div>
              );
          }
        }
        return null;
      })}
    </div>
  );
};

export default Preview;
