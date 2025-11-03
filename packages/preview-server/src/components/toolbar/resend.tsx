import { useAction } from 'next-safe-action/hooks';
import { useRef, useState } from 'react';
import { exportSingleTemplate } from '../../actions/export-single-template';
import { getEmailPathFromSlug } from '../../actions/get-email-path-from-slug';
import { renderEmailByPath } from '../../actions/render-email-by-path';
import { useEmails } from '../../contexts/emails';
import { sleep } from '../../utils/sleep';
import { Button } from '../button';
import { IconCloudAlert } from '../icons/icon-cloud-alert';
import { IconCloudCheck } from '../icons/icon-cloud-check';
import { IconLoader } from '../icons/icon-loader';
import { Results } from './results';

export interface ResendStatus {
  hasApiKey: boolean;
  error: string | null;
}

export const useResend = ({
  initialStatus,
}: {
  initialStatus?: ResendStatus;
} = {}) => {
  const [status, setStatus] = useState<ResendStatus | undefined>(initialStatus);
  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const load = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);

    try {
      const response = await fetch('/api/has-resend-api-key', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const body = (await response.json().catch(() => ({}))) as
        | { ok: boolean; error: string | null }
        | undefined;

      if (response.ok && body?.ok) {
        const result = { hasApiKey: true, error: null };
        setStatus(result);
        return result;
      }

      const result = {
        hasApiKey: false,
        error: body?.error ?? 'Unknown error',
      };
      setStatus(result);
      return result;
    } catch (exception) {
      console.error('Error checking Resend API key', exception);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  return [status, { loading, load }] as const;
};

interface ResendItem {
  status: 'uploading' | 'failed' | 'succeeded';
  name: string;
  id?: string;
}

export const Resend = ({
  emailSlug,
  htmlMarkup,
}: {
  emailSlug: string;
  htmlMarkup: string;
}) => {
  const { emailsDirectoryMetadata } = useEmails();
  const [items, setItems] = useState<ResendItem[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const { execute: exportSingle, isPending: isExportSinglePending } = useAction(
    exportSingleTemplate,
    {
      onSuccess: ({ data }) => setItems([data]),
    },
  );

  const { executeAsync: exportSingleAsync } = useAction(exportSingleTemplate);

  const loading = isExportSinglePending || isBulkProcessing;

  if (items.length === 0 && !loading) {
    return (
      <SuccessWrapper>
        <SuccessTitle>Upload to Resend</SuccessTitle>
        <SuccessDescription>
          Import your email using the Templates API.
        </SuccessDescription>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setItems([
                {
                  status: 'uploading',
                  name: emailSlug,
                },
              ]);

              exportSingle({
                name: emailSlug,
                html: htmlMarkup,
              });
            }}
          >
            Upload
          </Button>
          <Button
            appearance="gradient"
            className="mt-2 mb-4"
            onClick={async () => {
              const allDirectories = [
                emailsDirectoryMetadata,
                ...emailsDirectoryMetadata.subDirectories,
              ];
              const allEmailSlugs = allDirectories.flatMap((dir) =>
                dir.emailFilenames.map((filename) => {
                  const slug = dir.relativePath
                    ? `${dir.relativePath}/${filename}`
                    : filename;
                  return {
                    name: slug,
                    status: 'uploading' as const,
                  };
                }),
              );

              setItems(allEmailSlugs);
              setIsBulkProcessing(true);

              for (let i = 0; i < allEmailSlugs.length; i++) {
                const emailItem = allEmailSlugs[i];
                if (!emailItem) continue;

                const emailSlug = emailItem.name;
                // Remove file extension, keeping the directory structure
                const templateName = emailSlug.replace(/\.[^/.]+$/, '');

                try {
                  const emailPath = await getEmailPathFromSlug(emailSlug);
                  const renderResult = await renderEmailByPath(emailPath);

                  if ('error' in renderResult) {
                    setItems((prevItems) =>
                      prevItems.map((item, index) =>
                        index === i
                          ? { ...item, status: 'failed' as const }
                          : item,
                      ),
                    );
                    continue;
                  }

                  const exportResult = await exportSingleAsync({
                    name: templateName,
                    html: renderResult.markup,
                  });

                  if (exportResult.data?.id) {
                    setItems((prevItems) =>
                      prevItems.map((item, index) =>
                        index === i
                          ? {
                              ...item,
                              status: 'succeeded',
                              id: exportResult.data!.id,
                            }
                          : item,
                      ),
                    );
                  } else {
                    setItems((prevItems) =>
                      prevItems.map((item, index) =>
                        index === i
                          ? { ...item, status: 'failed' as const }
                          : item,
                      ),
                    );
                  }

                  await sleep(200);
                } catch (error) {
                  console.error('Error processing %s:', emailSlug, error);
                  setItems((prevItems) =>
                    prevItems.map((item, index) =>
                      index === i
                        ? { ...item, status: 'failed' as const }
                        : item,
                    ),
                  );
                }
              }

              setIsBulkProcessing(false);
            }}
          >
            Bulk Upload
          </Button>
        </div>
      </SuccessWrapper>
    );
  }

  return (
    <Results>
      {items.map((item, index) => (
        <Results.Row key={item.id || index}>
          <Results.Column>
            {item.status === 'uploading' && (
              <span className="flex gap-2 items-center text-slate-12">
                <IconLoader className="animate-spin" />
                {item.name}
              </span>
            )}
            {item.status === 'failed' && (
              <span className="flex gap-2 items-center text-red-400">
                <IconCloudAlert />
                {item.name}
              </span>
            )}
            {item.status === 'succeeded' && (
              <span className="flex gap-2 items-center text-green-400">
                <IconCloudCheck />
                {item.name}
              </span>
            )}
          </Results.Column>
          <Results.Column>
            {item.status === 'uploading'
              ? 'Uploading...'
              : item.status === 'failed'
                ? 'Failed to upload. Try again.'
                : 'Template uploaded successfully.'}
          </Results.Column>
          <Results.Column>
            {item.status === 'succeeded' && (
              <a
                href={`https://resend.com/templates/${item.id}/editor`}
                className="underline ml-2 decoration-slate-9 decoration-1 hover:decoration-slate-11 transition-colors hover:text-slate-12"
                rel="noreferrer"
                target="_blank"
              >
                Open in Resend ↗
              </a>
            )}
          </Results.Column>
        </Results.Row>
      ))}
    </Results>
  );
};

const SuccessWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-8">
      {children}
    </div>
  );
};

const SuccessTitle = ({ children }) => {
  return (
    <h3 className="text-slate-12 font-medium text-base mb-1">{children}</h3>
  );
};

const SuccessDescription = ({ children }) => {
  return (
    <p className="text-slate-11 text-sm text-center max-w-[320px]">
      {children}
    </p>
  );
};
