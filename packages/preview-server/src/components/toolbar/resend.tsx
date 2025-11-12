import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { exportSingleTemplate } from '../../actions/export-single-template';
import { getEmailPathFromSlug } from '../../actions/get-email-path-from-slug';
import { renderEmailByPath } from '../../actions/render-email-by-path';
import { useEmails } from '../../contexts/emails';
import type { EmailsDirectory } from '../../utils/get-emails-directory-metadata';
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

interface ResendItem {
  status: 'uploading' | 'failed' | 'succeeded';
  name: string;
  id?: string;
}

type ResendIntegrationProps = {
  emailSlug: string;
  htmlMarkup: string;
};

export function ResendIntegration({
  emailSlug,
  htmlMarkup,
}: ResendIntegrationProps) {
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

  const getAllDirectories = (metadata: EmailsDirectory): EmailsDirectory[] => {
    const result = [metadata];
    for (const subDir of metadata.subDirectories) {
      result.push(...getAllDirectories(subDir));
    }
    return result;
  };

  const loading = isExportSinglePending || isBulkProcessing;

  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center pt-8">
        <h3 className="text-slate-12 font-medium text-base mb-1">
          Upload to Resend
        </h3>
        <p className="text-slate-11 text-sm text-center max-w-[320px]">
          Import your email using the Templates API.
        </p>
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
              const allDirectories = getAllDirectories(emailsDirectoryMetadata);
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

                  // This avoid exceeding the default rate limit of 2 requests per second
                  await sleep(600);
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
      </div>
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
}
