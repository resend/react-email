'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import * as Select from '@radix-ui/react-select';
import { useDebouncedCallback } from 'use-debounce';
import * as Checkbox from '@radix-ui/react-checkbox';
import {
  renderEmailByPath,
  type EmailRenderingResult,
} from '../../../actions/render-email-by-path';
import { CodeContainer } from '../../../components/code-container';
import { Shell } from '../../../components/shell';
import { Tooltip } from '../../../components/tooltip';
import { useEmailRenderingResult } from '../../../hooks/use-email-rendering-result';
import { useHotreload } from '../../../hooks/use-hot-reload';
import { useRenderingMetadata } from '../../../hooks/use-rendering-metadata';
import type { ControlsResult } from '../../../actions/get-email-controls';
import type { Controls } from '../../../package';
import { IconArrowDown } from '../../../components/icons/icon-arrow-down';
import { IconCheck } from '../../../components/icons/icon-check';
import { useEmailControls } from '../../../hooks/use-email-controls';
import { updatePreviewProps } from '../../../actions/update-preview-props';
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

  const activeView = searchParams.get('view') ?? 'desktop';
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

  return (
    <Shell
      activeView={hasErrors ? undefined : activeView}
      currentEmailOpenSlug={slug}
      markup={renderedEmailMetadata?.markup}
      pathSeparator={pathSeparator}
      setActiveView={hasErrors ? undefined : handleViewChange}
    >
      {/* This relative is so that when there is any error the user can still switch between emails */}
      <div className="relative h-full">
        {hasErrors ? <RenderingError error={renderingResult.error} /> : null}

        {previewPropsControls ? (
          <PreviewPropControls
            controls={previewPropsControls}
            onValueChange={(key, newValue) => {
              const newPreviewProps = { ...previewProps, [key]: newValue };
              setPreviewProps(newPreviewProps);

              debouncedUpdatePreviewProps(newPreviewProps);

              renderEmailByPath(emailPath, newPreviewProps, true)
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
            {activeView === 'desktop' && (
              <iframe
                className="h-full w-full bg-white"
                srcDoc={renderedEmailMetadata.markup}
                title={slug}
              />
            )}

            {activeView === 'mobile' && (
              <iframe
                className="mx-auto h-full w-[360px] bg-white"
                srcDoc={renderedEmailMetadata.markup}
                title={slug}
              />
            )}

            {activeView === 'source' && (
              <div className="mx-auto flex max-w-3xl gap-6 p-6">
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
    <div className="fixed px-3 py-2 border-t border-solid border-t-slate-9 left-0 bottom-0 bg-black w-full grid gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-40">
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
                    className="text-slate-10 text-sm mb-2 block"
                    htmlFor={fieldId}
                  >
                    {key}
                  </label>
                  <input
                    className="appearance-none rounded-lg px-2 py-1 mb-3 outline-none w-full bg-slate-3 border placeholder-slate-10 border-slate-6 text-slate-12 text-sm focus:ring-1 focus:ring-slate-10 transition duration-300 ease-in-out"
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
                    className="text-slate-10 text-sm mb-2 block"
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
                    className="text-slate-10 text-sm mb-2 block"
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
