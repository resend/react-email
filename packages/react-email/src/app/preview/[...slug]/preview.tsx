'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import type { ControlsResult } from '../../../actions/get-email-controls';
import {
  type EmailRenderingResult,
  renderEmailByPath,
} from '../../../actions/render-email-by-path';
import { updatePreviewProps } from '../../../actions/update-preview-props';
import { CodeContainer } from '../../../components/code-container';
import { PreviewPropControls } from '../../../components/preview-prop-controls';
import { Shell } from '../../../components/shell';
import { Tooltip } from '../../../components/tooltip';
import { useEmailControls } from '../../../hooks/use-email-controls';
import { useEmailRenderingResult } from '../../../hooks/use-email-rendering-result';
import { useHotreload } from '../../../hooks/use-hot-reload';
import { useRenderingMetadata } from '../../../hooks/use-rendering-metadata';
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

              renderEmailByPath(emailPath, newPreviewProps, {
                invalidatingRenderingCache: true,
              })
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

export default Preview;
