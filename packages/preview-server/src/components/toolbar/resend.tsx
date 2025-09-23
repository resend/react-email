import { useRef, useState } from 'react';
import { Results } from './results';
import { IconLoader } from '../icons/icon-loader';
import { IconCloudCheck } from '../icons/icon-cloud-check';
import { IconCloudAlert } from '../icons/icon-cloud-alert';

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
  id: string;
}

interface ResendProps {
  status: ResendStatus | undefined;
}

export const Resend = ({ status }: ResendProps) => {
  const items: ResendItem[] = [
    {
      status: 'uploading',
      name: 'account-confirmation',
      id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
    },
    {
      status: 'succeeded',
      name: 'forgot-password',
      id: '4dd369bc-aa82-4ff3-97de-514ae3000ee0',
    },
    {
      status: 'failed',
      name: 'feedback-request',
      id: 'd91cd9bd-1176-453e-8fc1-35364d380206',
    }
  ];

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
            {item.status === 'uploading' ? 'Uploading...' : item.status === 'failed' ? 'Failed to upload. Try again.' : 'Template uploaded successfully.'}
          </Results.Column>
          {item.status === 'succeeded' && (
            <Results.Column>
              <a
                href={`https://resend.com/templates/${item.id}`}
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

