import { useAction } from 'next-safe-action/hooks';
import { useRef, useState } from 'react';
import {
  bulkExportTemplates,
  exportSingleTemplate,
} from '../../actions/bulk-import-templates';
import { Button } from '../button';
import { IconCloudAlert } from '../icons/icon-cloud-alert';
import { IconCloudCheck } from '../icons/icon-cloud-check';
import { IconLoader } from '../icons/icon-loader';
import { Results } from './results';

export interface ResendStatus {
  hasApiKey: boolean;
  message?: string;
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
        | { status?: string; message?: string; error?: string }
        | undefined;

      if (response.ok) {
        const result: ResendStatus = { hasApiKey: true };
        setStatus(result);
        return result;
      }

      if (response.status === 400) {
        const result: ResendStatus = {
          hasApiKey: false,
          message: 'Resend API Key is not set',
        };
        setStatus(result);
        return result;
      }

      console.error(
        body?.error ?? 'Unknown error while checking Resend API key',
      );
    } catch (exception) {
      console.error(exception);
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
  emailPath,
  emailSlug,
  htmlMarkup,
  reactMarkup,
}: {
  emailPath: string;
  emailSlug: string;
  htmlMarkup: string;
  reactMarkup: string;
}) => {
  console.log('emailPath', emailPath, emailSlug);

  const [items, setItems] = useState<ResendItem[]>([]);

  const { execute: exportSingle, isPending: isExportSinglePending } = useAction(
    exportSingleTemplate,
    {
      onSuccess: ({ data }) => {
        setItems(data);
      },
    },
  );

  const { execute: exportBulk, isPending: isExportBulkPending } = useAction(
    bulkExportTemplates,
    {
      onSuccess: ({ data }) => {
        setItems(data);
      },
    },
  );

  const loading = isExportSinglePending || isExportBulkPending;

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
                reactMarkup,
              });
            }}
          >
            Upload
          </Button>
          <Button
            appearance="gradient"
            className="mt-2 mb-4"
            onClick={() => {
              exportBulk({
                emailPath,
              });
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
      {items.map((item) => (
        <Results.Row key={item.id}>
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
          {item.status === 'succeeded' && (
            <Results.Column>
              <a
                href={`https://resend.com/templates/${item.id}/editor`}
                className="underline ml-2 decoration-slate-9 decoration-1 hover:decoration-slate-11 transition-colors hover:text-slate-12"
                rel="noreferrer"
                target="_blank"
              >
                Open in Resend ↗
              </a>
            </Results.Column>
          )}
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
